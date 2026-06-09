import { iqToPercentile, iqClassification, DEFAULT_NORMS, type NormParams } from './norms'

// ─── Domain weights (g-factor loadings from psychometric literature) ─────────

export const DOMAIN_WEIGHTS: Record<string, number> = {
  FLUID_REASONING:           0.25,
  QUANTITATIVE_REASONING:    0.20,
  CRYSTALLIZED_INTELLIGENCE: 0.18,
  SPATIAL_REASONING:         0.15,
  WORKING_MEMORY:            0.12,
  PROCESSING_SPEED:          0.10,
}

// ─── Per-response scoring ─────────────────────────────────────────────────────

export interface ResponseInput {
  isCorrect: boolean
  isTimeout: boolean
  difficulty: number        // 1–10
  discriminationIndex: number  // 0–1
  timeTakenMs: number
  timeLimitMs: number
}

export interface ResponseScore {
  weightedScore: number
  timePenalty: number
  finalScore: number
}

export function scoreResponse(r: ResponseInput): ResponseScore {
  if (r.isTimeout || !r.isCorrect) {
    return { weightedScore: 0, timePenalty: 0, finalScore: 0 }
  }

  const baseWeight = r.difficulty / 10
  const weightedScore = baseWeight * r.discriminationIndex

  const timeRatio = r.timeTakenMs / r.timeLimitMs
  let timePenalty = 0
  if (timeRatio > 0.75) timePenalty = weightedScore * 0.15
  else if (timeRatio > 0.33) timePenalty = weightedScore * 0.05

  const finalScore = Math.max(0, weightedScore - timePenalty)
  return { weightedScore, timePenalty, finalScore }
}

// ─── Domain efficiency scores ─────────────────────────────────────────────────

export interface DomainResult {
  domain: string
  efficiency: number        // 0–1 (finalScore / maxPossible)
  questionsAnswered: number
  weightedContribution: number
  band: string
  percentileWithinDomain: number
}

export interface ScoredResponse {
  domain: string
  difficulty: number
  discriminationIndex: number
  finalScore: number
  isPilot: boolean
}

export function computeDomainScores(responses: ScoredResponse[]): Record<string, DomainResult> {
  const scored = responses.filter((r) => !r.isPilot)
  const byDomain = new Map<string, ScoredResponse[]>()

  for (const r of scored) {
    if (!byDomain.has(r.domain)) byDomain.set(r.domain, [])
    byDomain.get(r.domain)!.push(r)
  }

  const results: Record<string, DomainResult> = {}

  for (const [domain, items] of byDomain) {
    const maxPossible = items.reduce((sum, r) => sum + (r.difficulty / 10) * r.discriminationIndex, 0)
    const actualScore = items.reduce((sum, r) => sum + r.finalScore, 0)
    const efficiency = maxPossible > 0 ? Math.min(1, actualScore / maxPossible) : 0

    const w = DOMAIN_WEIGHTS[domain] ?? 0.1
    const pct = efficiency * 100

    results[domain] = {
      domain,
      efficiency,
      questionsAnswered: items.length,
      weightedContribution: efficiency * w,
      band: bandFromEfficiency(efficiency),
      percentileWithinDomain: pct,
    }
  }

  return results
}

function bandFromEfficiency(e: number): string {
  if (e >= 0.90) return 'Very High'
  if (e >= 0.75) return 'Above Average'
  if (e >= 0.55) return 'Average'
  if (e >= 0.35) return 'Below Average'
  return 'Low'
}

// ─── Composite score → IQ ─────────────────────────────────────────────────────

export interface IqScoreResult {
  compositeRaw: number
  zScore: number
  iqScore: number
  confidenceLower: number
  confidenceUpper: number
  percentile: number
  classification: string
  normingVersion: string
  domainScores: Record<string, DomainResult>
}

const RELIABILITY = 0.90   // Cronbach α for 50-question adaptive test
const POPULATION_SD = 15
const SEM = POPULATION_SD * Math.sqrt(1 - RELIABILITY)   // ≈ 4.74

export function computeIqScore(
  domainScores: Record<string, DomainResult>,
  ageGroup: string,
  norms?: NormParams,
): IqScoreResult {
  const n = norms ?? DEFAULT_NORMS[ageGroup] ?? DEFAULT_NORMS['AGE_25_34']

  // Weighted composite
  let composite = 0
  let totalWeight = 0
  for (const [domain, result] of Object.entries(domainScores)) {
    const w = DOMAIN_WEIGHTS[domain] ?? 0
    composite += result.efficiency * w
    totalWeight += w
  }
  // normalise if domains are missing
  const compositeRaw = totalWeight > 0 ? composite / totalWeight : composite

  const zScore = (compositeRaw - n.meanRaw) / n.stdDevRaw
  const rawIq = 100 + 15 * zScore
  const iqScore = Math.round(Math.min(160, Math.max(55, rawIq)))

  const confidenceLower = Math.max(55, Math.round(iqScore - 1.96 * SEM))
  const confidenceUpper = Math.min(160, Math.round(iqScore + 1.96 * SEM))

  return {
    compositeRaw,
    zScore,
    iqScore,
    confidenceLower,
    confidenceUpper,
    percentile: Math.round(iqToPercentile(iqScore) * 10) / 10,
    classification: iqClassification(iqScore),
    normingVersion: n.version,
    domainScores,
  }
}

// ─── Domain insight narratives (pre-written lookup, avoids runtime LLM calls) ─

const DOMAIN_INSIGHTS: Record<string, Record<string, string>> = {
  FLUID_REASONING: {
    'Very High':      'Exceptional capacity to identify rules, solve novel puzzles, and detect abstract patterns without prior knowledge.',
    'Above Average':  'Strong pattern recognition and novel problem-solving ability, performing better than most peers.',
    'Average':        'Typical ability to work through new logical problems and recognise patterns in unfamiliar material.',
    'Below Average':  'Some difficulty with complex novel problems; benefits from structured frameworks when approaching new challenges.',
    'Low':            'Challenges with abstract reasoning tasks; concrete, step-by-step approaches are most effective.',
  },
  CRYSTALLIZED_INTELLIGENCE: {
    'Very High':      'Extensive vocabulary, broad factual knowledge, and excellent verbal reasoning — the hallmark of deep learning and curiosity.',
    'Above Average':  'Rich knowledge base and strong verbal analogical reasoning, above what most people demonstrate.',
    'Average':        'Solid command of language and general knowledge consistent with typical educational exposure.',
    'Below Average':  'Narrower knowledge base or vocabulary relative to peers; targeted reading can accelerate development.',
    'Low':            'Limited general knowledge breadth; strong in specific domains where direct experience exists.',
  },
  QUANTITATIVE_REASONING: {
    'Very High':      'Exceptional numerical fluency — rapid, accurate pattern detection in mathematical sequences and relationships.',
    'Above Average':  'Well above average in spotting numerical rules and completing arithmetic sequences under time pressure.',
    'Average':        'Competent with number series and quantitative patterns at a level consistent with the general population.',
    'Below Average':  'Some difficulty with complex numerical patterns; benefits from deliberate practice with number sequences.',
    'Low':            'Quantitative pattern-finding tasks are challenging; a focus on sequential reasoning practice would help.',
  },
  SPATIAL_REASONING: {
    'Very High':      'Remarkable ability to mentally rotate, fold, and manipulate 3-D objects — a strong predictor of success in STEM fields.',
    'Above Average':  'Above-average spatial imagination, able to visualise transformations that most people find difficult.',
    'Average':        'Typical ability to mentally rotate and visualise objects in space.',
    'Below Average':  'Spatial transformation tasks are moderately challenging; physical manipulation aids learning.',
    'Low':            'Three-dimensional mental rotation is effortful; diagrams and hands-on models help significantly.',
  },
  WORKING_MEMORY: {
    'Very High':      'Outstanding capacity to hold and manipulate information in mind simultaneously — a core executive function.',
    'Above Average':  'Strong short-term memory capacity, able to track and transform longer sequences than average.',
    'Average':        'Normal ability to hold sequences in mind consistent with average working memory span.',
    'Below Average':  'Working memory load is occasionally taxed; chunking and note-taking strategies help manage complexity.',
    'Low':            'Short-term holding of information is limited; external aids and reduced cognitive load improve performance.',
  },
  PROCESSING_SPEED: {
    'Very High':      'Exceptionally fast and accurate at simple cognitive tasks — high mental efficiency under time pressure.',
    'Above Average':  'Quicker than most at processing simple information accurately and consistently.',
    'Average':        'Normal processing speed consistent with the general population.',
    'Below Average':  'Slightly slower on timed tasks; accuracy remains solid when time pressure is reduced.',
    'Low':            'Time-pressured tasks are significantly harder; performance improves markedly with extended time.',
  },
}

export function getDomainInsight(domain: string, band: string): string {
  return DOMAIN_INSIGHTS[domain]?.[band] ?? 'Performance was consistent with general population norms for this domain.'
}
