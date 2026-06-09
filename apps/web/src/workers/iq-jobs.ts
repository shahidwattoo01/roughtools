// ─── IQ BullMQ Job Processors ─────────────────────────────────────────────────
// Register with the shared queue. Import this file in your worker entrypoint.
//
// Usage in worker process:
//   import { registerIqProcessors } from '@/workers/iq-jobs'
//   import { startWorkers } from '@toolverse/queue'
//   registerIqProcessors()
//   startWorkers(3)

import { registerProcessor } from '@toolverse/queue'
import { PrismaClient } from '@prisma/client'
import { upload } from '@toolverse/storage'
import { buildIqReportHtml, generatePdfFromHtml } from '@/lib/iq-pdf-template'
import {
  computeDomainScores,
  computeIqScore,
  getDomainInsight,
  DEFAULT_NORMS,
  type ScoredResponse,
} from '@platform/iq-engine'

const prisma = new PrismaClient()

// ─── Job 1: iq-pdf-generate ───────────────────────────────────────────────────
// Fetch session → build HTML → Gotenberg → upload to S3 → update session

registerProcessor('iq-pdf-generate', async (job) => {
  const { sessionId } = job.data

  const session = await prisma.iqSession.findUnique({
    where: { id: sessionId },
    include: { responses: true },
  })

  if (!session || session.status !== 'COMPLETED' || !session.isValid) {
    throw new Error(`Session ${sessionId} not eligible for PDF`)
  }

  // Rebuild domain scores (same logic as /complete endpoint)
  const qIds = [...new Set(session.responses.map(r => r.questionId))]
  const qMeta = await prisma.iqQuestionBank.findMany({
    where: { id: { in: qIds } },
    select: { id: true, discriminationIndex: true },
  })
  const discMap = Object.fromEntries(qMeta.map(q => [q.id, q.discriminationIndex]))

  const scored: ScoredResponse[] = session.responses.map(r => ({
    domain: r.domain,
    difficulty: r.difficulty,
    discriminationIndex: discMap[r.questionId] ?? 0.7,
    finalScore: r.finalScore,
    isPilot: r.isPilot,
  }))

  const domainScores = computeDomainScores(scored)
  const iqResult = computeIqScore(domainScores, session.ageGroup)

  const AGE_LABELS: Record<string, string> = {
    AGE_18_24: '18–24', AGE_25_34: '25–34', AGE_35_44: '35–44',
    AGE_45_54: '45–54', AGE_55_64: '55–64', AGE_65_PLUS: '65+',
  }

  interface DomainEntry { domain: string; efficiency: number; band: string }
  const domainList = (Object.values(domainScores) as DomainEntry[]).map(d => ({
    domain: d.domain,
    label: DOMAIN_LABELS[d.domain] ?? d.domain,
    efficiency: d.efficiency,
    band: d.band,
    interpretation: getDomainInsight(d.domain, d.band),
  }))

  const html = buildIqReportHtml({
    sessionId: session.id,
    iqScore: iqResult.iqScore,
    confidenceLower: iqResult.confidenceLower,
    confidenceUpper: iqResult.confidenceUpper,
    percentile: iqResult.percentile,
    classification: iqResult.classification,
    ageGroup: AGE_LABELS[session.ageGroup] ?? session.ageGroup,
    questionCount: session.responses.length,
    completedAt: session.completedAt?.toISOString() ?? new Date().toISOString(),
    normingVersion: iqResult.normingVersion,
    domainScores: domainList,
    isValid: session.isValid,
    invalidityFlags: (session.invalidityFlags as string[]) ?? [],
  })

  const pdfBuffer = await generatePdfFromHtml(html)

  const path = `iq-reports/${sessionId}.pdf`
  const uploadResult = await upload(pdfBuffer, path, 'application/pdf')

  await prisma.iqSession.update({
    where: { id: sessionId },
    data: { reportReady: true, reportUrl: uploadResult.url },
  })

  console.log(`[IQ PDF] Generated for session ${sessionId} → ${uploadResult.url}`)
  return { url: uploadResult.url }
})

// ─── Job 2: iq-analytics-update ──────────────────────────────────────────────
// Recalculate empirical difficulty + discrimination for each question
// touched since `since` timestamp.

registerProcessor('iq-analytics-update', async (job) => {
  const since = new Date(job.data.since)

  const responses = await prisma.iqResponse.findMany({
    where: { answeredAt: { gte: since }, isPilot: false },
    select: { questionId: true, isCorrect: true, timeTakenMs: true },
  })

  const byQuestion = new Map<string, { correct: number; total: number; times: number[] }>()
  for (const r of responses) {
    const entry = byQuestion.get(r.questionId) ?? { correct: 0, total: 0, times: [] }
    entry.total++
    if (r.isCorrect) entry.correct++
    entry.times.push(r.timeTakenMs)
    byQuestion.set(r.questionId, entry)
  }

  for (const [questionId, stats] of byQuestion) {
    const mean = stats.times.reduce((a, b) => a + b, 0) / stats.times.length
    const variance = stats.times.reduce((s, t) => s + (t - mean) ** 2, 0) / stats.times.length
    const difficultyEmpirical = 1 - (stats.correct / stats.total) // proportion wrong

    await prisma.iqQuestionAnalytics.upsert({
      where: { questionId },
      create: {
        questionId,
        totalPresentations: stats.total,
        totalCorrect: stats.correct,
        meanTimeMs: mean,
        stdDevTimeMs: Math.sqrt(variance),
        difficultyEmpirical,
        exposureThisMonth: stats.total,
      },
      update: {
        totalPresentations: { increment: stats.total },
        totalCorrect: { increment: stats.correct },
        meanTimeMs: mean,
        stdDevTimeMs: Math.sqrt(variance),
        difficultyEmpirical,
        lastUpdated: new Date(),
      },
    })
  }

  console.log(`[IQ Analytics] Updated ${byQuestion.size} questions since ${since.toISOString()}`)
  return { updated: byQuestion.size }
})

// ─── Job 3: iq-norming-recalculate ───────────────────────────────────────────
// Compute new mean_raw / std_dev_raw per age group from all valid sessions.

registerProcessor('iq-norming-recalculate', async (job) => {
  const sessions = await prisma.iqSession.findMany({
    where: { status: 'COMPLETED', isValid: true, rawScore: { not: null } },
    select: { ageGroup: true, rawScore: true },
  })

  if (sessions.length < 50) {
    console.log('[IQ Norming] Skipped — fewer than 50 valid sessions')
    return { skipped: true, count: sessions.length }
  }

  const byGroup = new Map<string, number[]>()
  for (const s of sessions) {
    const g = s.ageGroup as string
    if (!byGroup.has(g)) byGroup.set(g, [])
    byGroup.get(g)!.push(s.rawScore as number)
  }

  const version = `v${sessions.length}-empirical-${Date.now()}`

  for (const [ageGroup, scores] of byGroup) {
    if (scores.length < 10) continue
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length
    const stdDev = Math.sqrt(variance)

    // Build percentile table from actual distribution
    const sorted = [...scores].sort((a, b) => a - b)
    const percentileTable: Record<number, number> = {}
    for (let p = 1; p <= 99; p++) {
      const idx = Math.floor((p / 100) * sorted.length)
      percentileTable[p] = sorted[Math.min(idx, sorted.length - 1)]
    }

    await prisma.iqNormingSnapshot.updateMany({
      where: { ageGroup: ageGroup as Parameters<typeof prisma.iqNormingSnapshot.updateMany>[0]['where']['ageGroup'], isActive: true },
      data: { isActive: false },
    })

    await prisma.iqNormingSnapshot.create({
      data: {
        version,
        ageGroup: ageGroup as Parameters<typeof prisma.iqNormingSnapshot.create>[0]['data']['ageGroup'],
        sampleSize: scores.length,
        meanRaw: mean,
        stdDevRaw: stdDev,
        percentileTable,
        isActive: true,
      },
    })
  }

  console.log(`[IQ Norming] Created snapshot ${version} from ${sessions.length} sessions`)
  return { version, sessionCount: sessions.length }
})

// ─── Job 4: iq-session-expiry ─────────────────────────────────────────────────
// Expire sessions that have passed their expiresAt timestamp.

registerProcessor('iq-session-expiry', async () => {
  const result = await prisma.iqSession.updateMany({
    where: {
      status: { in: ['ACTIVE', 'PAUSED'] },
      expiresAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  })

  console.log(`[IQ Expiry] Expired ${result.count} sessions`)
  return { expired: result.count }
})

// ─── Domain label map (for PDF generation) ───────────────────────────────────

const DOMAIN_LABELS: Record<string, string> = {
  FLUID_REASONING:           'Fluid Reasoning',
  CRYSTALLIZED_INTELLIGENCE: 'Crystallized Intelligence',
  QUANTITATIVE_REASONING:    'Quantitative Reasoning',
  SPATIAL_REASONING:         'Spatial Reasoning',
  WORKING_MEMORY:            'Working Memory',
  PROCESSING_SPEED:          'Processing Speed',
}

export function registerIqProcessors() {
  // Processors are registered via the side-effect of importing this module.
  // This export exists so calling code can confirm registration.
  console.log('[IQ Workers] Registered 4 IQ job processors')
}
