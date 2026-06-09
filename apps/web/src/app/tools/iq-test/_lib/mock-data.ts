import type { AgeGroup, Question, StartSessionResponse } from './types'

// Mutable index so submitAnswer can advance it
export const mockQuestionIndex = { value: 0 }

const MOCK_QUESTIONS: Question[] = [
  // ── Sequence (Fluid Reasoning) ──────────────────────────────────────────
  {
    questionNumber: 1,
    totalEstimate: 48,
    domain: 'FLUID_REASONING',
    format: 'SEQUENCE',
    timeLimitSeconds: 45,
    questionToken: 'mock-seq-1',
    content: {
      format: 'SEQUENCE',
      stem: 'What number comes next in the sequence?',
      sequence: [2, 4, 8, 16, null],
      options: [24, 28, 32, 36, 30, 20],
      correct: 2,
    },
  },
  // ── Analogy (Crystallized Intelligence) ─────────────────────────────────
  {
    questionNumber: 2,
    totalEstimate: 48,
    domain: 'CRYSTALLIZED_INTELLIGENCE',
    format: 'ANALOGY',
    timeLimitSeconds: 40,
    questionToken: 'mock-ana-1',
    content: {
      format: 'ANALOGY',
      pairA: ['Book', 'Library'],
      promptWord: 'Painting',
      options: ['Artist', 'Museum', 'Canvas', 'Colour', 'Frame', 'Gallery'],
      correct: 1,
      domainHint: 'functional',
    },
  },
  // ── Matrix (Fluid Reasoning) ────────────────────────────────────────────
  {
    questionNumber: 3,
    totalEstimate: 48,
    domain: 'FLUID_REASONING',
    format: 'MATRIX',
    timeLimitSeconds: 60,
    questionToken: 'mock-mat-1',
    content: {
      format: 'MATRIX',
      renderHint: '3x3',
      grid: [
        [
          { shape: 'circle',   fill: 'solid',   rotation: 0,  size: 'small',  colorIndex: 1 },
          { shape: 'circle',   fill: 'solid',   rotation: 0,  size: 'medium', colorIndex: 1 },
          { shape: 'circle',   fill: 'solid',   rotation: 0,  size: 'large',  colorIndex: 1 },
        ],
        [
          { shape: 'square',   fill: 'outline', rotation: 0,  size: 'small',  colorIndex: 2 },
          { shape: 'square',   fill: 'outline', rotation: 0,  size: 'medium', colorIndex: 2 },
          { shape: 'square',   fill: 'outline', rotation: 0,  size: 'large',  colorIndex: 2 },
        ],
        [
          { shape: 'triangle', fill: 'half',    rotation: 0,  size: 'small',  colorIndex: 3 },
          { shape: 'triangle', fill: 'half',    rotation: 0,  size: 'medium', colorIndex: 3 },
          null,
        ],
      ],
      options: [
        { shape: 'triangle', fill: 'half',    rotation: 0,  size: 'large',  colorIndex: 3 },
        { shape: 'triangle', fill: 'solid',   rotation: 0,  size: 'large',  colorIndex: 3 },
        { shape: 'circle',   fill: 'half',    rotation: 0,  size: 'large',  colorIndex: 3 },
        { shape: 'triangle', fill: 'half',    rotation: 90, size: 'large',  colorIndex: 3 },
        { shape: 'square',   fill: 'half',    rotation: 0,  size: 'large',  colorIndex: 3 },
        { shape: 'triangle', fill: 'outline', rotation: 0,  size: 'large',  colorIndex: 3 },
      ],
      correct: 0,
    },
  },
  // ── Memory (Working Memory) ─────────────────────────────────────────────
  {
    questionNumber: 4,
    totalEstimate: 48,
    domain: 'WORKING_MEMORY',
    format: 'MEMORY',
    timeLimitSeconds: 30,
    questionToken: 'mock-mem-1',
    content: {
      format: 'MEMORY',
      sequence: [7, 3, 9, 1, 5],
      displayDurationMs: 4000,
      mode: 'forward',
      length: 5,
      options: [
        [7, 3, 9, 1, 5],
        [7, 3, 1, 9, 5],
        [7, 9, 3, 1, 5],
        [3, 7, 9, 1, 5],
        [7, 3, 9, 5, 1],
        [7, 3, 9, 1, 6],
      ],
      correct: 0,
    },
  },
  // ── Deduction (Fluid Reasoning) ──────────────────────────────────────────
  {
    questionNumber: 5,
    totalEstimate: 48,
    domain: 'FLUID_REASONING',
    format: 'DEDUCTION',
    timeLimitSeconds: 50,
    questionToken: 'mock-ded-1',
    content: {
      format: 'DEDUCTION',
      premises: [
        'All architects are engineers.',
        'Some engineers are project managers.',
        'Maria is an architect.',
      ],
      question: 'Which conclusion must be true?',
      options: [
        'Maria is a project manager.',
        'Maria is an engineer.',
        'All project managers are architects.',
        'Some architects are not engineers.',
      ],
      correct: 1,
      logicType: 'categorical_syllogism',
    },
  },
  // ── Spatial (Spatial Reasoning) ──────────────────────────────────────────
  {
    questionNumber: 6,
    totalEstimate: 48,
    domain: 'SPATIAL_REASONING',
    format: 'SPATIAL',
    timeLimitSeconds: 55,
    questionToken: 'mock-spa-1',
    content: {
      format: 'SPATIAL',
      stem: 'The shape on the left is rotated 90° clockwise. Which option shows the result?',
      baseDescription: 'An L-shaped block: 3 cubes tall on the left, 2 cubes extending right at the bottom.',
      transformation: '90° clockwise rotation around the vertical axis',
      options: [
        '2 cubes tall on the left, 3 cubes extending right at the bottom',
        '3 cubes wide on top, 2 cubes extending down on the right',
        '2 cubes wide on top, 3 cubes extending down on the left',
        '3 cubes tall on the right, 2 cubes extending left at the bottom',
      ],
      correct: 1,
    },
  },
  // ── Sequence (Quantitative Reasoning) ────────────────────────────────────
  {
    questionNumber: 7,
    totalEstimate: 48,
    domain: 'QUANTITATIVE_REASONING',
    format: 'SEQUENCE',
    timeLimitSeconds: 45,
    questionToken: 'mock-seq-2',
    content: {
      format: 'SEQUENCE',
      stem: 'What number completes the pattern?',
      sequence: [1, 1, 2, 3, 5, 8, null],
      options: [11, 12, 13, 14, 15, 16],
      correct: 2,
    },
  },
  // ── Memory reverse (Working Memory) ──────────────────────────────────────
  {
    questionNumber: 8,
    totalEstimate: 48,
    domain: 'WORKING_MEMORY',
    format: 'MEMORY',
    timeLimitSeconds: 35,
    questionToken: 'mock-mem-2',
    content: {
      format: 'MEMORY',
      sequence: [4, 8, 2, 6],
      displayDurationMs: 3500,
      mode: 'reverse',
      length: 4,
      options: [
        [6, 2, 8, 4],
        [4, 8, 2, 6],
        [6, 8, 2, 4],
        [4, 2, 8, 6],
        [2, 6, 4, 8],
        [6, 2, 4, 8],
      ],
      correct: 0,
    },
  },
]

export function MOCK_START_SESSION(ageGroup: AgeGroup): StartSessionResponse {
  return {
    sessionId: `mock-${Date.now()}`,
    sessionToken: 'mock-token-xyz',
    expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    firstQuestion: { ...MOCK_QUESTIONS[0], questionNumber: 1, totalEstimate: 48 },
  }
}

export function MOCK_NEXT_QUESTION(): Question | null {
  const q = MOCK_QUESTIONS[mockQuestionIndex.value]
  if (!q) return null
  return { ...q, questionNumber: mockQuestionIndex.value + 1, totalEstimate: 48 }
}
