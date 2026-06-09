import {
  initAdaptiveState,
  updateTheta,
  selectNextQuestion,
  shouldEndTest,
  estimateTotalQuestions,
  type AdaptiveState,
  type QuestionMeta,
} from '@platform/iq-engine'
import { prisma } from './db'
import type { IqSession } from '@prisma/client'

/** Deserialise AdaptiveState from session DB columns */
export function stateFromSession(session: IqSession): AdaptiveState {
  const thetaByDomain = (session.thetaEstimates as Record<string, number>) ?? {}
  const seByDomain = (session.stdErrors as Record<string, number>) ?? {}
  const askedIds = new Set<string>(
    Array.isArray(session.questionsOrder) ? (session.questionsOrder as string[]) : [],
  )
  const domainQuestionCount: Record<string, number> = {}

  // Recount per domain from the questionsOrder (we persist domain in IqResponse)
  // For a quick re-init we use the current theta map keys as proxy
  for (const d of Object.keys(thetaByDomain)) {
    domainQuestionCount[d] = 0
  }

  return {
    thetaByDomain,
    seByDomain,
    infoByDomain: {},   // not persisted — acceptable; info is recomputed from SE
    askedIds,
    domainQuestionCount,
  }
}

/** Persist updated AdaptiveState to session row */
export async function persistState(sessionId: string, state: AdaptiveState): Promise<void> {
  await prisma.iqSession.update({
    where: { id: sessionId },
    data: {
      thetaEstimates: state.thetaByDomain,
      stdErrors: state.seByDomain,
      questionsOrder: Array.from(state.askedIds),
      currentIndex: state.askedIds.size,
    },
  })
}

/** Load candidate questions from DB, grouped by domain */
async function loadCandidates(
  askedIds: Set<string>,
): Promise<Record<string, QuestionMeta[]>> {
  const questions = await prisma.iqQuestionBank.findMany({
    where: { isActive: true },
    select: {
      id: true,
      domain: true,
      difficulty: true,
      discriminationIndex: true,
      pilot: true,
      analytics: { select: { exposureThisMonth: true } },
    },
  })

  const grouped: Record<string, QuestionMeta[]> = {}

  for (const q of questions) {
    if (askedIds.has(q.id)) continue
    const domain = q.domain as string
    if (!grouped[domain]) grouped[domain] = []
    grouped[domain].push({
      id: q.id,
      domain,
      difficulty: q.difficulty,
      discriminationIndex: q.discriminationIndex,
      pilot: q.pilot,
      exposureThisMonth: q.analytics?.exposureThisMonth ?? 0,
    })
  }

  return grouped
}

/** Pick the next question and return the DB row, or null if test is complete */
export async function pickNextQuestion(
  session: IqSession,
): Promise<{ dbQuestion: Awaited<ReturnType<typeof prisma.iqQuestionBank.findUnique>>; state: AdaptiveState; isComplete: boolean } | { isComplete: true }> {
  const state = stateFromSession(session)

  if (shouldEndTest(state)) return { isComplete: true }

  const candidates = await loadCandidates(state.askedIds)

  // Total presentations this month across all questions (for exposure calc)
  const totalPresentations = await prisma.iqQuestionAnalytics.aggregate({
    _sum: { exposureThisMonth: true },
  }).then((r) => r._sum.exposureThisMonth ?? 0)

  const selected = selectNextQuestion(state, candidates, totalPresentations)
  if (!selected) return { isComplete: true }

  const dbQuestion = await prisma.iqQuestionBank.findUnique({
    where: { id: selected.question.id },
  })

  // Update state
  state.askedIds.add(selected.question.id)
  state.domainQuestionCount[selected.domain] =
    (state.domainQuestionCount[selected.domain] ?? 0) + 1

  await persistState(session.id, state)

  return { dbQuestion, state, isComplete: false }
}

/** Update theta after an answer */
export async function processAnswer(
  session: IqSession,
  questionId: string,
  isCorrect: boolean,
): Promise<AdaptiveState> {
  const state = stateFromSession(session)

  const q = await prisma.iqQuestionBank.findUnique({
    where: { id: questionId },
    select: { domain: true, difficulty: true, discriminationIndex: true },
  })
  if (!q) return state

  const domain = q.domain as string
  const meta: QuestionMeta = {
    id: questionId,
    domain,
    difficulty: q.difficulty,
    discriminationIndex: q.discriminationIndex,
    pilot: false,
    exposureThisMonth: 0,
  }

  const updated = updateTheta(
    state.thetaByDomain[domain] ?? 0,
    state.seByDomain[domain] ?? 2.0,
    state.infoByDomain[domain] ?? 0,
    isCorrect,
    meta,
  )

  state.thetaByDomain[domain] = updated.theta
  state.seByDomain[domain] = updated.se
  state.infoByDomain[domain] = updated.info

  await persistState(session.id, state)
  return state
}

export { initAdaptiveState, shouldEndTest, estimateTotalQuestions }
