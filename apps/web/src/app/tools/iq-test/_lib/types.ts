// ─── Enums ───────────────────────────────────────────────────────────────────

export type AgeGroup =
  | 'AGE_18_24'
  | 'AGE_25_34'
  | 'AGE_35_44'
  | 'AGE_45_54'
  | 'AGE_55_64'
  | 'AGE_65_PLUS'

export type QuestionFormat =
  | 'MATRIX'
  | 'SEQUENCE'
  | 'ANALOGY'
  | 'MEMORY'
  | 'SPATIAL'
  | 'DEDUCTION'

export type IqDomain =
  | 'FLUID_REASONING'
  | 'CRYSTALLIZED_INTELLIGENCE'
  | 'PROCESSING_SPEED'
  | 'WORKING_MEMORY'
  | 'SPATIAL_REASONING'
  | 'QUANTITATIVE_REASONING'

// ─── Question content types (discriminated union on format) ──────────────────

export interface GridCell {
  shape: 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'diamond'
  fill: 'solid' | 'outline' | 'half' | 'dotted'
  rotation: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315
  size: 'small' | 'medium' | 'large'
  colorIndex: 1 | 2 | 3 | 4
}

export interface MatrixContent {
  format: 'MATRIX'
  grid: (GridCell | null)[][]
  options: GridCell[]
  correct: number
  renderHint: '3x3' | '4x4'
}

export interface SequenceContent {
  format: 'SEQUENCE'
  stem?: string
  sequence: (number | string | null)[]
  options: (number | string)[]
  correct: number
}

export interface AnalogyContent {
  format: 'ANALOGY'
  pairA: [string, string]
  promptWord: string
  options: string[]
  correct: number
  domainHint: 'semantic' | 'functional' | 'categorical' | 'oppositional'
}

export interface MemoryContent {
  format: 'MEMORY'
  sequence: (number | string)[]
  displayDurationMs: number
  mode: 'forward' | 'reverse'
  length: number
  options: (number | string)[][]
  correct: number
}

export interface SpatialContent {
  format: 'SPATIAL'
  stem: string
  baseDescription: string
  transformation: string
  options: string[]
  correct: number
}

export interface DeductionContent {
  format: 'DEDUCTION'
  premises: string[]
  question: string
  options: string[]
  correct: number
  logicType: 'modus_ponens' | 'modus_tollens' | 'categorical_syllogism' | 'disjunctive_syllogism'
}

export type QuestionContent =
  | MatrixContent
  | SequenceContent
  | AnalogyContent
  | MemoryContent
  | SpatialContent
  | DeductionContent

// ─── Session API types ───────────────────────────────────────────────────────

export interface Question {
  questionNumber: number
  totalEstimate: number
  domain: IqDomain
  format: QuestionFormat
  timeLimitSeconds: number
  content: QuestionContent
  questionToken: string
}

export interface StartSessionResponse {
  sessionId: string
  sessionToken: string
  firstQuestion: Question
  expiresAt: string
}

export interface SubmitAnswerResponse {
  complete: boolean
  nextQuestion?: Question
}

export interface FocusLossResponse {
  count: number
}

export interface CompleteResponse {
  sessionId: string
  iqScore: number
  redirectUrl: string
}

// ─── FSM state ───────────────────────────────────────────────────────────────

export type SessionPhase =
  | 'INSTRUCTIONS'
  | 'AGE_SELECT'
  | 'LOADING'
  | 'ACTIVE_QUESTION'
  | 'SUBMITTING'
  | 'BETWEEN_QUESTIONS'
  | 'PAUSED'
  | 'COMPLETING'
  | 'DONE'
  | 'ERROR'

export interface SessionState {
  phase: SessionPhase
  ageGroup: AgeGroup | null
  sessionId: string | null
  currentQuestion: Question | null
  questionIndex: number
  totalEstimate: number
  focusLossCount: number
  pauseCount: number
  timeRemaining: number
  memoryPhase: 'display' | 'respond'
  error: string | null
  redirectUrl: string | null
}

export type SessionAction =
  | { type: 'SHOW_AGE_SELECT' }
  | { type: 'START_LOADING' }
  | { type: 'SESSION_STARTED'; sessionId: string; firstQuestion: Question }
  | { type: 'QUESTION_LOADED'; question: Question }
  | { type: 'ANSWER_SUBMITTED' }
  | { type: 'TICK' }
  | { type: 'TIMEOUT' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'FOCUS_LOST'; count: number }
  | { type: 'MEMORY_DISPLAY_DONE' }
  | { type: 'TEST_COMPLETE'; redirectUrl: string }
  | { type: 'ERROR'; message: string }
