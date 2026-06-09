// ─── 3PL Item Response Theory — simplified adaptive engine ──────────────────
//
// Uses Maximum Likelihood Estimation to update theta (ability estimate) after
// each response, then selects the next question with maximum Fisher Information
// at the current theta level.

export interface QuestionMeta {
  id: string
  domain: string
  difficulty: number      // 1–10, converted to IRT b parameter
  discriminationIndex: number  // a parameter (0–1)
  pilot: boolean
  exposureThisMonth: number
}

export interface AdaptiveState {
  thetaByDomain: Record<string, number>    // ability estimate per domain
  seByDomain: Record<string, number>       // standard error per domain
  infoByDomain: Record<string, number>     // accumulated Fisher info per domain
  askedIds: Set<string>
  domainQuestionCount: Record<string, number>
}

// ─── IRT helpers ─────────────────────────────────────────────────────────────

// Convert difficulty 1–10 to IRT b parameter (logit scale, ~-3 to +3)
function diffToB(d: number): number {
  return ((d - 5.5) / 4.5) * 2.5
}

// 3PL probability of correct response
// P(θ) = c + (1-c) / (1 + exp(-1.7 * a * (θ - b)))
// We use c = 1/nOptions ≈ 0.17 for 6-option questions
function p3pl(theta: number, a: number, b: number, c = 0.17): number {
  return c + (1 - c) / (1 + Math.exp(-1.7 * a * (theta - b)))
}

// Fisher Information at theta for a given item
function fisherInfo(theta: number, a: number, b: number, c = 0.17): number {
  const pVal = p3pl(theta, a, b, c)
  const q = 1 - pVal
  const pStar = (pVal - c) / (1 - c)  // P*(θ) without guessing
  if (q < 1e-6 || pVal < 1e-6) return 0
  return (1.7 * a) ** 2 * (pStar ** 2 * q) / pVal
}

// ─── Theta update (MLE step) ──────────────────────────────────────────────────

export function updateTheta(
  currentTheta: number,
  currentSE: number,
  currentInfo: number,
  isCorrect: boolean,
  question: QuestionMeta,
): { theta: number; se: number; info: number } {
  const a = question.discriminationIndex
  const b = diffToB(question.difficulty)
  const info = fisherInfo(currentTheta, a, b)

  // Newton-Raphson update (one step)
  const pVal = p3pl(currentTheta, a, b)
  const delta = isCorrect ? (1 - pVal) : -pVal
  const newInfo = currentInfo + info

  // Step size inversely proportional to accumulated info
  const step = info > 0 ? (delta / info) * 0.6 : 0  // 0.6 damping factor
  const newTheta = Math.min(4, Math.max(-4, currentTheta + step))
  const newSE = newInfo > 0 ? 1 / Math.sqrt(newInfo) : 2.0

  return { theta: newTheta, se: newSE, info: newInfo }
}

// ─── Question selection ───────────────────────────────────────────────────────

const MAX_EXPOSURE_RATE = 0.30   // max 30% of users per month

const DOMAIN_ROTATION = [
  'FLUID_REASONING',
  'QUANTITATIVE_REASONING',
  'CRYSTALLIZED_INTELLIGENCE',
  'SPATIAL_REASONING',
  'WORKING_MEMORY',
  'PROCESSING_SPEED',
]

// Max questions per domain before stopping that domain's contribution
const DOMAIN_MAX: Record<string, number> = {
  FLUID_REASONING:           12,
  QUANTITATIVE_REASONING:    10,
  CRYSTALLIZED_INTELLIGENCE: 9,
  SPATIAL_REASONING:         8,
  WORKING_MEMORY:            7,
  PROCESSING_SPEED:          6,
}

// Domain stops when SE < threshold
const SE_THRESHOLD = 0.35

export function initAdaptiveState(): AdaptiveState {
  const thetaByDomain: Record<string, number> = {}
  const seByDomain: Record<string, number> = {}
  const infoByDomain: Record<string, number> = {}
  const domainQuestionCount: Record<string, number> = {}

  for (const d of DOMAIN_ROTATION) {
    thetaByDomain[d] = 0
    seByDomain[d] = 2.0
    infoByDomain[d] = 0
    domainQuestionCount[d] = 0
  }

  return { thetaByDomain, seByDomain, infoByDomain, askedIds: new Set(), domainQuestionCount }
}

export function selectNextQuestion(
  state: AdaptiveState,
  availableByDomain: Record<string, QuestionMeta[]>,
  totalMonthlyPresentations: number,
): { question: QuestionMeta; domain: string } | null {
  // Domain rotation order: pick next domain that still needs questions
  const activeDomains = DOMAIN_ROTATION.filter((d) => {
    const count = state.domainQuestionCount[d] ?? 0
    const se = state.seByDomain[d] ?? 2.0
    const max = DOMAIN_MAX[d] ?? 8
    return count < max && se > SE_THRESHOLD
  })

  if (activeDomains.length === 0) return null

  // Interleave: pick the domain with highest SE (most uncertain) among active ones
  const targetDomain = activeDomains.reduce((best, d) =>
    (state.seByDomain[d] ?? 2.0) > (state.seByDomain[best] ?? 2.0) ? d : best,
    activeDomains[0],
  )

  const theta = state.thetaByDomain[targetDomain] ?? 0
  const candidates = (availableByDomain[targetDomain] ?? []).filter((q) => {
    if (state.askedIds.has(q.id)) return false
    // Exposure control: skip if overexposed this month
    if (totalMonthlyPresentations > 0) {
      const exposureRate = q.exposureThisMonth / totalMonthlyPresentations
      if (exposureRate > MAX_EXPOSURE_RATE) return false
    }
    return true
  })

  if (candidates.length === 0) {
    // Try any remaining domain
    for (const d of DOMAIN_ROTATION) {
      if (d === targetDomain) continue
      const fallback = (availableByDomain[d] ?? []).find((q) => !state.askedIds.has(q.id))
      if (fallback) return { question: fallback, domain: d }
    }
    return null
  }

  // Select maximum Fisher Information item at current theta
  let bestItem = candidates[0]
  let bestInfo = -Infinity

  for (const q of candidates) {
    const a = q.discriminationIndex
    const b = diffToB(q.difficulty)
    const info = fisherInfo(theta, a, b)
    if (info > bestInfo) {
      bestInfo = info
      bestItem = q
    }
  }

  return { question: bestItem, domain: targetDomain }
}

export function shouldStopDomain(state: AdaptiveState, domain: string): boolean {
  const count = state.domainQuestionCount[domain] ?? 0
  const se = state.seByDomain[domain] ?? 2.0
  const max = DOMAIN_MAX[domain] ?? 8
  return count >= max || se <= SE_THRESHOLD
}

export function shouldEndTest(state: AdaptiveState): boolean {
  return DOMAIN_ROTATION.every((d) => shouldStopDomain(state, d))
}

export function estimateTotalQuestions(state: AdaptiveState): number {
  let total = 0
  for (const d of DOMAIN_ROTATION) {
    const remaining = Math.max(0, (DOMAIN_MAX[d] ?? 8) - (state.domainQuestionCount[d] ?? 0))
    const se = state.seByDomain[d] ?? 2.0
    // If SE is already low, expect fewer questions
    total += se <= SE_THRESHOLD ? 0 : Math.min(remaining, Math.ceil(remaining * (se / 2.0)))
  }
  return Math.max(1, total)
}
