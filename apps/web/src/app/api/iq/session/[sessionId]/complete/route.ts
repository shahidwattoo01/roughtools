import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../_lib/db'
import { requireSession } from '../../../_lib/session'
import {
  computeDomainScores,
  computeIqScore,
  getDomainInsight,
  checkValidity,
  type ScoredResponse,
  type ValidityInput,
} from '@platform/iq-engine'

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  if (session.status === 'COMPLETED') {
    return NextResponse.json({ redirectUrl: `/tools/iq-test/results/${session.id}` })
  }

  // Load all responses
  const responses = await prisma.iqResponse.findMany({
    where: { sessionId: session.id },
  })

  if (responses.length < 5) {
    return NextResponse.json({ message: 'Not enough responses to score' }, { status: 400 })
  }

  // ── Validity check ──────────────────────────────────────────────────────────
  const lastSession = await prisma.iqSession.findFirst({
    where: {
      userId: session.userId ?? undefined,
      status: 'COMPLETED',
      id: { not: session.id },
    },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  })

  const validityInput: ValidityInput = {
    responses: responses.map((r) => ({
      timeTakenMs: r.timeTakenMs,
      isCorrect: r.isCorrect,
      isTimeout: r.isTimeout,
      difficulty: r.difficulty,
      domain: r.domain,
    })),
    focusLossCount: session.focusLossCount,
    pauseCount: session.pauseCount,
    lastCompletedSessionAt: lastSession?.completedAt ?? null,
    totalOptions: 6,
  }

  const validity = checkValidity(validityInput)

  // ── Domain scoring ──────────────────────────────────────────────────────────
  const scoredResponses: ScoredResponse[] = responses.map((r) => ({
    domain: r.domain,
    difficulty: r.difficulty,
    discriminationIndex: 0.7,   // default; real value comes from question bank
    finalScore: r.finalScore,
    isPilot: r.isPilot,
  }))

  // Enrich with real discrimination index from question bank
  const questionIds = [...new Set(responses.map((r) => r.questionId))]
  const qMeta = await prisma.iqQuestionBank.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, discriminationIndex: true },
  })
  const discMap = Object.fromEntries(qMeta.map((q) => [q.id, q.discriminationIndex]))

  const enriched: ScoredResponse[] = responses.map((r, i) => ({
    ...scoredResponses[i],
    discriminationIndex: discMap[r.questionId] ?? 0.7,
  }))

  const domainScores = computeDomainScores(enriched)
  const iqResult = computeIqScore(domainScores, session.ageGroup)

  // Add insight narratives
  const domainScoresWithInsights = Object.fromEntries(
    Object.entries(domainScores).map(([domain, result]) => [
      domain,
      { ...result, interpretation: getDomainInsight(domain, result.band) },
    ]),
  )

  // ── Persist final scores ────────────────────────────────────────────────────
  await prisma.iqSession.update({
    where: { id: session.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      totalQuestions: responses.length,
      rawScore: iqResult.compositeRaw,
      iqScore: iqResult.iqScore,
      confidenceLower: iqResult.confidenceLower,
      confidenceUpper: iqResult.confidenceUpper,
      percentile: iqResult.percentile,
      domainScores: domainScoresWithInsights,
      isValid: validity.isValid,
      invalidityFlags: validity.flags,
      normingVersion: iqResult.normingVersion,
    },
  })

  return NextResponse.json({
    redirectUrl: `/tools/iq-test/results/${session.id}`,
  })
}
