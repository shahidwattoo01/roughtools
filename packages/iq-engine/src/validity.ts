// ─── Validity engine — detects invalid test-taking behaviour ─────────────────

export interface ValidityInput {
  responses: {
    timeTakenMs: number
    isCorrect: boolean
    isTimeout: boolean
    difficulty: number
    domain: string
  }[]
  focusLossCount: number
  pauseCount: number
  lastCompletedSessionAt?: Date | null
  totalOptions: number  // number of answer choices per question (for chance baseline)
}

export interface ValidityResult {
  isValid: boolean
  flags: ValidityFlag[]
  hasCaveat: boolean   // valid but with a note
}

export type ValidityFlag =
  | 'SPEED_INVALID'
  | 'CHANCE_RESPONDING'
  | 'FOCUS_LOSS_EXCESSIVE'
  | 'COOLDOWN_VIOLATION'
  | 'INCONSISTENT_PATTERN'

const SEVERE_FLAGS: ValidityFlag[] = ['SPEED_INVALID', 'CHANCE_RESPONDING', 'COOLDOWN_VIOLATION']
const CAVEAT_FLAGS: ValidityFlag[] = ['FOCUS_LOSS_EXCESSIVE', 'INCONSISTENT_PATTERN']

export function checkValidity(input: ValidityInput): ValidityResult {
  const flags: ValidityFlag[] = []
  const scored = input.responses.filter((r) => !r.isTimeout)

  // 1. Speed check — mean response < 4 seconds
  if (scored.length > 0) {
    const meanMs = scored.reduce((s, r) => s + r.timeTakenMs, 0) / scored.length
    if (meanMs < 4000) flags.push('SPEED_INVALID')
  }

  // 2. Accuracy floor — below chance level
  const total = input.responses.length
  if (total >= 10) {
    const correctCount = input.responses.filter((r) => r.isCorrect).length
    const chanceRate = 1 / (input.totalOptions || 6)
    const correctRate = correctCount / total
    if (correctRate < chanceRate * 1.05) flags.push('CHANCE_RESPONDING')
  }

  // 3. Focus loss
  if (input.focusLossCount >= 3) flags.push('FOCUS_LOSS_EXCESSIVE')

  // 4. Cooldown check — must wait 24h between attempts
  if (input.lastCompletedSessionAt) {
    const hoursSince = (Date.now() - input.lastCompletedSessionAt.getTime()) / 3_600_000
    if (hoursSince < 24) flags.push('COOLDOWN_VIOLATION')
  }

  // 5. Inconsistency index — harder questions should not be correct while easier ones are wrong
  // (simplified: check if accuracy on difficulty ≥7 > accuracy on difficulty ≤3)
  const hard = input.responses.filter((r) => r.difficulty >= 7)
  const easy = input.responses.filter((r) => r.difficulty <= 3)
  if (hard.length >= 3 && easy.length >= 3) {
    const hardRate = hard.filter((r) => r.isCorrect).length / hard.length
    const easyRate = easy.filter((r) => r.isCorrect).length / easy.length
    if (hardRate > easyRate + 0.40) flags.push('INCONSISTENT_PATTERN')
  }

  // Verdict
  const severeCount = flags.filter((f) => SEVERE_FLAGS.includes(f)).length
  const caveats = flags.filter((f) => CAVEAT_FLAGS.includes(f))
  const isValid = severeCount === 0 && flags.length <= 1

  return {
    isValid,
    flags,
    hasCaveat: isValid && caveats.length > 0,
  }
}

export function validityMessage(flags: ValidityFlag[]): string {
  if (flags.includes('SPEED_INVALID'))
    return 'Responses were submitted too quickly for meaningful cognitive assessment. Please retake the test without rushing.'
  if (flags.includes('CHANCE_RESPONDING'))
    return 'Response patterns suggest random answering. Please retake the test and engage with each question carefully.'
  if (flags.includes('COOLDOWN_VIOLATION'))
    return 'A 24-hour cooldown period applies between attempts. Please try again tomorrow.'
  if (flags.includes('FOCUS_LOSS_EXCESSIVE'))
    return 'Multiple focus-loss events were detected. Results may be less reliable. Please retake in a distraction-free environment.'
  return 'One or more validity indicators were triggered. Results should be interpreted with caution.'
}
