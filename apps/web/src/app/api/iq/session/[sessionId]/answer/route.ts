import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../_lib/db'
import { requireSession, decodeQuestionToken, formatQuestion } from '../../../_lib/session'
import { processAnswer, pickNextQuestion, estimateTotalQuestions, shouldEndTest } from '../../../_lib/adaptive-state'
import { scoreResponse } from '@platform/iq-engine'

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  let body: { questionToken?: string; selectedOption?: number; timeTakenMs?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const { questionToken, selectedOption, timeTakenMs } = body
  if (!questionToken || selectedOption === undefined || timeTakenMs === undefined) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const questionId = decodeQuestionToken(questionToken, session.id)
  if (!questionId) {
    return NextResponse.json({ message: 'Invalid question token' }, { status: 400 })
  }

  // Fetch question (including correct answer — server side only)
  const dbQuestion = await prisma.iqQuestionBank.findUnique({ where: { id: questionId } })
  if (!dbQuestion) return NextResponse.json({ message: 'Question not found' }, { status: 404 })

  const content = dbQuestion.content as Record<string, unknown>
  const correctIndex = content['correct'] as number ?? -1
  const isCorrect = selectedOption === correctIndex

  // Score the response
  const scored = scoreResponse({
    isCorrect,
    isTimeout: false,
    difficulty: dbQuestion.difficulty,
    discriminationIndex: dbQuestion.discriminationIndex,
    timeTakenMs,
    timeLimitMs: dbQuestion.timeLimitSeconds * 1000,
  })

  await prisma.iqResponse.create({
    data: {
      sessionId: session.id,
      questionId,
      domain: dbQuestion.domain,
      difficulty: dbQuestion.difficulty,
      presentedAt: new Date(Date.now() - timeTakenMs),
      answeredAt: new Date(),
      timeTakenMs,
      selectedOption,
      isCorrect,
      isTimeout: false,
      isPilot: dbQuestion.pilot,
      weightedScore: scored.weightedScore,
      timePenalty: scored.timePenalty,
      finalScore: scored.finalScore,
    },
  })

  // Update adaptive state
  const updatedState = await processAnswer(session, questionId, isCorrect)

  // Update analytics counters (fire-and-forget)
  prisma.iqQuestionAnalytics.upsert({
    where: { questionId },
    create: {
      questionId,
      totalPresentations: 1,
      totalCorrect: isCorrect ? 1 : 0,
      meanTimeMs: timeTakenMs,
      stdDevTimeMs: 0,
      exposureThisMonth: 1,
    },
    update: {
      totalPresentations: { increment: 1 },
      totalCorrect: isCorrect ? { increment: 1 } : undefined,
      exposureThisMonth: { increment: 1 },
      lastUpdated: new Date(),
    },
  }).catch(() => {})

  if (shouldEndTest(updatedState)) {
    return NextResponse.json({ complete: true })
  }

  // Fetch next question
  const freshSession = await prisma.iqSession.findUnique({ where: { id: session.id } })
  if (!freshSession) return NextResponse.json({ complete: true })

  const result = await pickNextQuestion(freshSession)
  if ('isComplete' in result && result.isComplete) {
    return NextResponse.json({ complete: true })
  }

  const { dbQuestion: nextQ, state } = result as Exclude<typeof result, { isComplete: true }>
  if (!nextQ) return NextResponse.json({ complete: true })

  const questionNumber = freshSession.currentIndex + 1
  const totalEstimate = Math.max(questionNumber + 1, 40 + estimateTotalQuestions(state))

  return NextResponse.json({
    complete: false,
    nextQuestion: formatQuestion(nextQ, questionNumber, totalEstimate, session.id),
  })
}
