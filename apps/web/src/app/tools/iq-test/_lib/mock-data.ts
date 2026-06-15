import type { AgeGroup, Question, StartSessionResponse } from './types'

export const mockQuestionIndex = { value: 0 }
export const mockAnswers: Array<{ correct: boolean; timeTakenMs: number; domain: string }> = []

// ─── 40 questions across 6 cognitive domains ──────────────────────────────────

const MOCK_QUESTIONS: Question[] = [
  // ── FLUID REASONING: Sequences (1-8) ───────────────────────────────────────
  {
    questionNumber: 1, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 45, questionToken: 'seq-1',
    content: { format: 'SEQUENCE', stem: 'What number comes next?', sequence: [2, 4, 8, 16, null], options: [24, 28, 32, 36, 30, 20], correct: 2 },
  },
  {
    questionNumber: 2, totalEstimate: 40, domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 45, questionToken: 'seq-2',
    content: { format: 'SEQUENCE', stem: 'What number completes the pattern?', sequence: [1, 1, 2, 3, 5, 8, null], options: [11, 12, 13, 14, 15, 16], correct: 2 },
  },
  {
    questionNumber: 3, totalEstimate: 40, domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 40, questionToken: 'seq-3',
    content: { format: 'SEQUENCE', stem: 'Which number is missing?', sequence: [3, 6, 12, 24, null, 96], options: [36, 40, 42, 44, 48, 50], correct: 4 },
  },
  {
    questionNumber: 4, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 50, questionToken: 'seq-4',
    content: { format: 'SEQUENCE', stem: 'What comes next in the series?', sequence: [100, 91, 83, 76, 70, null], options: [63, 64, 65, 66, 67, 68], correct: 3 },
  },
  {
    questionNumber: 5, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 50, questionToken: 'seq-5',
    content: { format: 'SEQUENCE', stem: 'Complete the sequence:', sequence: [2, 6, 12, 20, 30, null], options: [36, 40, 42, 44, 48, 52], correct: 2 },
  },
  {
    questionNumber: 6, totalEstimate: 40, domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 55, questionToken: 'seq-6',
    content: { format: 'SEQUENCE', stem: 'What value replaces the question mark?', sequence: [1, 4, 9, 16, 25, null], options: [30, 32, 35, 36, 38, 40], correct: 3 },
  },
  {
    questionNumber: 7, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 55, questionToken: 'seq-7',
    content: { format: 'SEQUENCE', stem: 'Find the next number:', sequence: [3, 9, 27, 81, null], options: [162, 200, 240, 243, 256, 270], correct: 3 },
  },
  {
    questionNumber: 8, totalEstimate: 40, domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 60, questionToken: 'seq-8',
    content: { format: 'SEQUENCE', stem: 'What number is missing?', sequence: [17, 13, null, 5, 1], options: [6, 7, 8, 9, 10, 11], correct: 3 },
  },

  // ── CRYSTALLIZED INTELLIGENCE: Analogies (9-16) ────────────────────────────
  {
    questionNumber: 9, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 40, questionToken: 'ana-1',
    content: { format: 'ANALOGY', pairA: ['Book', 'Library'], promptWord: 'Painting', options: ['Artist', 'Museum', 'Canvas', 'Colour', 'Frame', 'Gallery'], correct: 1, domainHint: 'functional' },
  },
  {
    questionNumber: 10, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 40, questionToken: 'ana-2',
    content: { format: 'ANALOGY', pairA: ['Scalpel', 'Surgeon'], promptWord: 'Brush', options: ['Canvas', 'Painter', 'Gallery', 'Colour', 'Wall', 'Frame'], correct: 1, domainHint: 'functional' },
  },
  {
    questionNumber: 11, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 40, questionToken: 'ana-3',
    content: { format: 'ANALOGY', pairA: ['Marathon', 'Endurance'], promptWord: 'Sprint', options: ['Track', 'Speed', 'Distance', 'Athlete', 'Race', 'Medal'], correct: 1, domainHint: 'semantic' },
  },
  {
    questionNumber: 12, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 40, questionToken: 'ana-4',
    content: { format: 'ANALOGY', pairA: ['Ignorance', 'Education'], promptWord: 'Disease', options: ['Doctor', 'Medicine', 'Hospital', 'Health', 'Cure', 'Illness'], correct: 4, domainHint: 'functional' },
  },
  {
    questionNumber: 13, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 40, questionToken: 'ana-5',
    content: { format: 'ANALOGY', pairA: ['Telescope', 'Stars'], promptWord: 'Microscope', options: ['Science', 'Lens', 'Bacteria', 'Biology', 'Laboratory', 'Doctor'], correct: 2, domainHint: 'functional' },
  },
  {
    questionNumber: 14, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 35, questionToken: 'ana-6',
    content: { format: 'ANALOGY', pairA: ['Clock', 'Time'], promptWord: 'Thermometer', options: ['Heat', 'Cold', 'Temperature', 'Weather', 'Mercury', 'Degrees'], correct: 2, domainHint: 'functional' },
  },
  {
    questionNumber: 15, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 45, questionToken: 'ana-7',
    content: { format: 'ANALOGY', pairA: ['Archipelago', 'Islands'], promptWord: 'Constellation', options: ['Planet', 'Telescope', 'Stars', 'Galaxy', 'Universe', 'Orbit'], correct: 2, domainHint: 'categorical' },
  },
  {
    questionNumber: 16, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 45, questionToken: 'ana-8',
    content: { format: 'ANALOGY', pairA: ['Pedantic', 'Precision'], promptWord: 'Magnanimous', options: ['Wealth', 'Generosity', 'Pride', 'Courage', 'Kindness', 'Wisdom'], correct: 1, domainHint: 'semantic' },
  },

  // ── FLUID REASONING: Deduction (17-22) ─────────────────────────────────────
  {
    questionNumber: 17, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 50, questionToken: 'ded-1',
    content: {
      format: 'DEDUCTION',
      premises: ['All architects are engineers.', 'Some engineers are project managers.', 'Maria is an architect.'],
      question: 'Which conclusion must be true?',
      options: ['Maria is a project manager.', 'Maria is an engineer.', 'All project managers are architects.', 'Some architects are not engineers.'],
      correct: 1, logicType: 'categorical_syllogism',
    },
  },
  {
    questionNumber: 18, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 50, questionToken: 'ded-2',
    content: {
      format: 'DEDUCTION',
      premises: ['No reptiles are warm-blooded.', 'All snakes are reptiles.'],
      question: 'Which conclusion is necessarily true?',
      options: ['Some warm-blooded animals are snakes.', 'No snakes are warm-blooded.', 'All warm-blooded animals are reptiles.', 'Some reptiles are not snakes.'],
      correct: 1, logicType: 'categorical_syllogism',
    },
  },
  {
    questionNumber: 19, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 55, questionToken: 'ded-3',
    content: {
      format: 'DEDUCTION',
      premises: ['If it rains, the ground gets wet.', 'The ground is not wet.'],
      question: 'What can you conclude?',
      options: ['It is raining.', 'It did not rain.', 'The ground is always dry.', 'Nothing can be concluded.'],
      correct: 1, logicType: 'modus_tollens',
    },
  },
  {
    questionNumber: 20, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 55, questionToken: 'ded-4',
    content: {
      format: 'DEDUCTION',
      premises: ['All mammals breathe air.', 'Whales breathe air.'],
      question: 'Which is the strongest valid conclusion?',
      options: ['Whales are mammals.', 'Whales might be mammals.', 'All air-breathing animals are mammals.', 'Whales are the only mammals in the sea.'],
      correct: 1, logicType: 'modus_ponens',
    },
  },
  {
    questionNumber: 21, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 60, questionToken: 'ded-5',
    content: {
      format: 'DEDUCTION',
      premises: ['Alex is taller than Ben.', 'Ben is taller than Chris.', 'Dana is shorter than Chris.'],
      question: 'Who is the tallest?',
      options: ['Ben', 'Chris', 'Alex', 'Dana'],
      correct: 2, logicType: 'categorical_syllogism',
    },
  },
  {
    questionNumber: 22, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 60, questionToken: 'ded-6',
    content: {
      format: 'DEDUCTION',
      premises: ['Either the meeting is on Monday or Tuesday.', 'The meeting is not on Monday.'],
      question: 'What must be true?',
      options: ['The meeting is on Wednesday.', 'The meeting is on Tuesday.', 'The meeting might be cancelled.', 'The meeting was already held.'],
      correct: 1, logicType: 'disjunctive_syllogism',
    },
  },

  // ── FLUID REASONING: Matrices (23-27) ──────────────────────────────────────
  {
    questionNumber: 23, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'MATRIX',
    timeLimitSeconds: 60, questionToken: 'mat-1',
    content: {
      format: 'MATRIX', renderHint: '3x3',
      grid: [
        [{ shape: 'circle', fill: 'solid', rotation: 0, size: 'small', colorIndex: 1 }, { shape: 'circle', fill: 'solid', rotation: 0, size: 'medium', colorIndex: 1 }, { shape: 'circle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 1 }],
        [{ shape: 'square', fill: 'outline', rotation: 0, size: 'small', colorIndex: 2 }, { shape: 'square', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 2 }, { shape: 'square', fill: 'outline', rotation: 0, size: 'large', colorIndex: 2 }],
        [{ shape: 'triangle', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 }, { shape: 'triangle', fill: 'half', rotation: 0, size: 'medium', colorIndex: 3 }, null],
      ],
      options: [
        { shape: 'triangle', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'triangle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'circle', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'triangle', fill: 'half', rotation: 90, size: 'large', colorIndex: 3 },
        { shape: 'square', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'triangle', fill: 'outline', rotation: 0, size: 'large', colorIndex: 3 },
      ],
      correct: 0,
    },
  },
  {
    questionNumber: 24, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'MATRIX',
    timeLimitSeconds: 65, questionToken: 'mat-2',
    content: {
      format: 'MATRIX', renderHint: '3x3',
      grid: [
        [{ shape: 'circle', fill: 'solid', rotation: 0, size: 'small', colorIndex: 1 }, { shape: 'square', fill: 'solid', rotation: 0, size: 'small', colorIndex: 1 }, { shape: 'triangle', fill: 'solid', rotation: 0, size: 'small', colorIndex: 1 }],
        [{ shape: 'circle', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 2 }, { shape: 'square', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 2 }, { shape: 'triangle', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 2 }],
        [{ shape: 'circle', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 }, { shape: 'square', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 }, null],
      ],
      options: [
        { shape: 'triangle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'circle', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'triangle', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'triangle', fill: 'outline', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'square', fill: 'half', rotation: 0, size: 'large', colorIndex: 3 },
        { shape: 'triangle', fill: 'half', rotation: 90, size: 'large', colorIndex: 3 },
      ],
      correct: 2,
    },
  },
  {
    questionNumber: 25, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'MATRIX',
    timeLimitSeconds: 65, questionToken: 'mat-3',
    content: {
      format: 'MATRIX', renderHint: '3x3',
      grid: [
        [{ shape: 'triangle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 1 }, { shape: 'triangle', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 1 }, { shape: 'triangle', fill: 'half', rotation: 0, size: 'small', colorIndex: 1 }],
        [{ shape: 'circle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 2 }, { shape: 'circle', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 2 }, { shape: 'circle', fill: 'half', rotation: 0, size: 'small', colorIndex: 2 }],
        [{ shape: 'square', fill: 'solid', rotation: 0, size: 'large', colorIndex: 3 }, { shape: 'square', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 3 }, null],
      ],
      options: [
        { shape: 'square', fill: 'outline', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'square', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'circle', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'square', fill: 'solid', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'triangle', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'square', fill: 'half', rotation: 90, size: 'small', colorIndex: 3 },
      ],
      correct: 1,
    },
  },
  {
    questionNumber: 26, totalEstimate: 40, domain: 'SPATIAL_REASONING', format: 'MATRIX',
    timeLimitSeconds: 70, questionToken: 'mat-4',
    content: {
      format: 'MATRIX', renderHint: '3x3',
      grid: [
        [{ shape: 'circle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 1 }, { shape: 'circle', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 1 }, { shape: 'circle', fill: 'half', rotation: 0, size: 'small', colorIndex: 1 }],
        [{ shape: 'square', fill: 'solid', rotation: 0, size: 'large', colorIndex: 2 }, { shape: 'square', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 2 }, { shape: 'square', fill: 'half', rotation: 0, size: 'small', colorIndex: 2 }],
        [{ shape: 'triangle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 3 }, { shape: 'triangle', fill: 'outline', rotation: 0, size: 'medium', colorIndex: 3 }, null],
      ],
      options: [
        { shape: 'triangle', fill: 'solid', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'triangle', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'triangle', fill: 'outline', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'circle', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 },
        { shape: 'triangle', fill: 'half', rotation: 90, size: 'small', colorIndex: 3 },
        { shape: 'square', fill: 'half', rotation: 0, size: 'small', colorIndex: 3 },
      ],
      correct: 1,
    },
  },
  {
    questionNumber: 27, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'MATRIX',
    timeLimitSeconds: 70, questionToken: 'mat-5',
    content: {
      format: 'MATRIX', renderHint: '3x3',
      grid: [
        [{ shape: 'circle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 1 }, { shape: 'square', fill: 'solid', rotation: 0, size: 'large', colorIndex: 2 }, { shape: 'triangle', fill: 'solid', rotation: 0, size: 'large', colorIndex: 3 }],
        [{ shape: 'circle', fill: 'half', rotation: 0, size: 'medium', colorIndex: 2 }, { shape: 'square', fill: 'half', rotation: 0, size: 'medium', colorIndex: 3 }, { shape: 'triangle', fill: 'half', rotation: 0, size: 'medium', colorIndex: 1 }],
        [{ shape: 'circle', fill: 'outline', rotation: 0, size: 'small', colorIndex: 3 }, { shape: 'square', fill: 'outline', rotation: 0, size: 'small', colorIndex: 1 }, null],
      ],
      options: [
        { shape: 'circle', fill: 'outline', rotation: 0, size: 'small', colorIndex: 2 },
        { shape: 'triangle', fill: 'solid', rotation: 0, size: 'small', colorIndex: 2 },
        { shape: 'triangle', fill: 'outline', rotation: 0, size: 'small', colorIndex: 2 },
        { shape: 'triangle', fill: 'half', rotation: 0, size: 'small', colorIndex: 2 },
        { shape: 'square', fill: 'outline', rotation: 0, size: 'small', colorIndex: 2 },
        { shape: 'triangle', fill: 'outline', rotation: 90, size: 'small', colorIndex: 2 },
      ],
      correct: 2,
    },
  },

  // ── WORKING MEMORY (28-32) ──────────────────────────────────────────────────
  {
    questionNumber: 28, totalEstimate: 40, domain: 'WORKING_MEMORY', format: 'MEMORY',
    timeLimitSeconds: 30, questionToken: 'mem-1',
    content: { format: 'MEMORY', sequence: [7, 3, 9, 1, 5], displayDurationMs: 4000, mode: 'forward', length: 5, options: [[7,3,9,1,5],[7,3,1,9,5],[7,9,3,1,5],[3,7,9,1,5],[7,3,9,5,1],[7,3,9,1,6]], correct: 0 },
  },
  {
    questionNumber: 29, totalEstimate: 40, domain: 'WORKING_MEMORY', format: 'MEMORY',
    timeLimitSeconds: 35, questionToken: 'mem-2',
    content: { format: 'MEMORY', sequence: [4, 8, 2, 6], displayDurationMs: 3500, mode: 'reverse', length: 4, options: [[6,2,8,4],[4,8,2,6],[6,8,2,4],[4,2,8,6],[2,6,4,8],[6,2,4,8]], correct: 0 },
  },
  {
    questionNumber: 30, totalEstimate: 40, domain: 'WORKING_MEMORY', format: 'MEMORY',
    timeLimitSeconds: 35, questionToken: 'mem-3',
    content: { format: 'MEMORY', sequence: [5, 1, 7, 3, 8, 2], displayDurationMs: 5000, mode: 'forward', length: 6, options: [[5,1,7,3,8,2],[5,1,7,8,3,2],[5,1,3,7,8,2],[5,1,7,3,2,8],[1,5,7,3,8,2],[5,1,7,3,8,4]], correct: 0 },
  },
  {
    questionNumber: 31, totalEstimate: 40, domain: 'WORKING_MEMORY', format: 'MEMORY',
    timeLimitSeconds: 40, questionToken: 'mem-4',
    content: { format: 'MEMORY', sequence: [9, 4, 6, 1, 8, 3, 5], displayDurationMs: 5500, mode: 'forward', length: 7, options: [[9,4,6,1,8,3,5],[9,4,6,1,3,8,5],[9,4,6,8,1,3,5],[9,4,1,6,8,3,5],[4,9,6,1,8,3,5],[9,4,6,1,8,5,3]], correct: 0 },
  },
  {
    questionNumber: 32, totalEstimate: 40, domain: 'WORKING_MEMORY', format: 'MEMORY',
    timeLimitSeconds: 40, questionToken: 'mem-5',
    content: { format: 'MEMORY', sequence: [3, 7, 2, 9], displayDurationMs: 3000, mode: 'reverse', length: 4, options: [[9,2,7,3],[3,7,2,9],[7,2,9,3],[9,7,2,3],[2,9,7,3],[9,2,3,7]], correct: 0 },
  },

  // ── SPATIAL REASONING (33-36) ───────────────────────────────────────────────
  {
    questionNumber: 33, totalEstimate: 40, domain: 'SPATIAL_REASONING', format: 'SPATIAL',
    timeLimitSeconds: 55, questionToken: 'spa-1',
    content: {
      format: 'SPATIAL', stem: 'The shape on the left is rotated 90° clockwise. Which option shows the result?',
      baseDescription: 'An L-shaped block: 3 cubes tall on the left, 2 cubes extending right at the bottom.',
      transformation: '90° clockwise rotation around the vertical axis',
      options: ['2 cubes tall on the left, 3 cubes extending right at the bottom', '3 cubes wide on top, 2 cubes extending down on the right', '2 cubes wide on top, 3 cubes extending down on the left', '3 cubes tall on the right, 2 cubes extending left at the bottom'],
      correct: 1,
    },
  },
  {
    questionNumber: 34, totalEstimate: 40, domain: 'SPATIAL_REASONING', format: 'SPATIAL',
    timeLimitSeconds: 55, questionToken: 'spa-2',
    content: {
      format: 'SPATIAL', stem: 'A cube is unfolded into a flat cross shape. If the top face shows a star, what is on the opposite face?',
      baseDescription: 'A standard cross-shaped net with center square and four squares extending up, down, left, right. The top extension has a star.',
      transformation: 'Mental folding of net into cube',
      options: ['The bottom extension square', 'The left extension square', 'The right extension square', 'The center square'],
      correct: 0,
    },
  },
  {
    questionNumber: 35, totalEstimate: 40, domain: 'SPATIAL_REASONING', format: 'SPATIAL',
    timeLimitSeconds: 60, questionToken: 'spa-3',
    content: {
      format: 'SPATIAL', stem: 'A clock shows 3:00. If you rotate the clock image 180°, what time does it appear to show?',
      baseDescription: 'Standard clock face showing exactly 3:00.',
      transformation: '180° rotation of the entire clock image',
      options: ['9:00', '6:00', '12:00', '3:00'],
      correct: 0,
    },
  },
  {
    questionNumber: 36, totalEstimate: 40, domain: 'SPATIAL_REASONING', format: 'SPATIAL',
    timeLimitSeconds: 60, questionToken: 'spa-4',
    content: {
      format: 'SPATIAL', stem: 'You are looking at a 4×4 grid of dots. A diagonal line goes from the top-left dot to the bottom-right dot. How many dots does the line pass through?',
      baseDescription: '4×4 grid of equally spaced dots.',
      transformation: 'Diagonal path visualization',
      options: ['2 dots', '3 dots', '4 dots', '6 dots'],
      correct: 2,
    },
  },

  // ── EXTRA MIXED QUESTIONS (37-40) ───────────────────────────────────────────
  {
    questionNumber: 37, totalEstimate: 40, domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 50, questionToken: 'qr-1',
    content: { format: 'SEQUENCE', stem: 'A store marks items up 40% then discounts 40%. The final price compared to the original is:', sequence: [null], options: [100, 96, 84, 80, 76, 72], correct: 2 },
  },
  {
    questionNumber: 38, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'DEDUCTION',
    timeLimitSeconds: 55, questionToken: 'ded-7',
    content: {
      format: 'DEDUCTION',
      premises: ['Five people sit in a row: Anna, Ben, Clara, Dan, Eve.', 'Anna sits next to Ben.', 'Clara sits at one end.', 'Dan sits between Ben and Eve.'],
      question: 'Which order is possible?',
      options: ['Clara-Anna-Ben-Dan-Eve', 'Eve-Clara-Anna-Ben-Dan', 'Clara-Ben-Anna-Dan-Eve', 'Ben-Anna-Clara-Dan-Eve'],
      correct: 0, logicType: 'categorical_syllogism',
    },
  },
  {
    questionNumber: 39, totalEstimate: 40, domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY',
    timeLimitSeconds: 45, questionToken: 'ana-9',
    content: { format: 'ANALOGY', pairA: ['Obfuscate', 'Clarity'], promptWord: 'Ameliorate', options: ['Improvement', 'Deterioration', 'Ambiguity', 'Complexity', 'Precision', 'Brevity'], correct: 1, domainHint: 'oppositional' },
  },
  {
    questionNumber: 40, totalEstimate: 40, domain: 'FLUID_REASONING', format: 'SEQUENCE',
    timeLimitSeconds: 60, questionToken: 'seq-9',
    content: { format: 'SEQUENCE', stem: 'What number comes next? 2, 3, 5, 7, 11, 13, 17, 19, …', sequence: [2, 3, 5, 7, 11, 13, 17, 19, null], options: [20, 21, 22, 23, 24, 25], correct: 3 },
  },
]

// ─── Mock session start ───────────────────────────────────────────────────────

export function MOCK_START_SESSION(_ageGroup: AgeGroup): StartSessionResponse {
  mockQuestionIndex.value = 0
  mockAnswers.length = 0
  return {
    sessionId: `mock-${Date.now()}`,
    sessionToken: 'mock-token-xyz',
    expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    firstQuestion: { ...MOCK_QUESTIONS[0], questionNumber: 1, totalEstimate: 40 },
  }
}

export function MOCK_NEXT_QUESTION(): Question | null {
  const q = MOCK_QUESTIONS[mockQuestionIndex.value]
  if (!q) return null
  return { ...q, questionNumber: mockQuestionIndex.value + 1, totalEstimate: 40 }
}

// ─── Client-side IQ scoring ───────────────────────────────────────────────────

export interface MockResult {
  sessionId: string
  iqScore: number
  confidenceLower: number
  confidenceUpper: number
  percentile: number
  classification: string
  isValid: boolean
  invalidityFlags: string[]
  domainScores: Record<string, MockDomainScore>
  ageGroup: string
  questionCount: number
  completedAt: string
  normingVersion: string
  reportReady: boolean
  reportUrl: null
}

export interface MockDomainScore {
  domain: string
  label: string
  efficiency: number
  band: string
  interpretation: string
  percentileWithinDomain: number
}

const DOMAIN_LABELS: Record<string, string> = {
  FLUID_REASONING: 'Fluid Reasoning',
  CRYSTALLIZED_INTELLIGENCE: 'Crystallized Intelligence',
  QUANTITATIVE_REASONING: 'Quantitative Reasoning',
  SPATIAL_REASONING: 'Spatial Reasoning',
  WORKING_MEMORY: 'Working Memory',
  PROCESSING_SPEED: 'Processing Speed',
}

function domainBand(efficiency: number): string {
  if (efficiency >= 0.90) return 'Superior'
  if (efficiency >= 0.75) return 'High Average'
  if (efficiency >= 0.55) return 'Average'
  if (efficiency >= 0.40) return 'Low Average'
  return 'Below Average'
}

function domainInterpretation(domain: string, efficiency: number): string {
  const level = efficiency >= 0.75 ? 'strong' : efficiency >= 0.55 ? 'average' : 'developing'
  const interpretations: Record<string, Record<string, string>> = {
    FLUID_REASONING: {
      strong: 'You excel at identifying patterns and solving novel problems. Your abstract reasoning is a cognitive strength.',
      average: 'Your ability to solve novel problems is typical for your age group.',
      developing: 'Practice with logic puzzles and pattern recognition may help strengthen this domain.',
    },
    CRYSTALLIZED_INTELLIGENCE: {
      strong: 'Your accumulated knowledge and vocabulary are notably high, reflecting strong verbal and conceptual learning.',
      average: 'Your crystallized knowledge base is well within the expected range.',
      developing: 'Reading widely across subjects can help build crystallized knowledge over time.',
    },
    QUANTITATIVE_REASONING: {
      strong: 'Your numerical reasoning and mathematical pattern recognition are a clear strength.',
      average: 'Your quantitative reasoning is within the typical range for your age group.',
      developing: 'Regular practice with mental arithmetic and number puzzles can improve this area.',
    },
    SPATIAL_REASONING: {
      strong: 'Your ability to mentally rotate and manipulate objects in 3D space is excellent.',
      average: 'Your spatial visualization ability is within the expected range.',
      developing: 'Spatial puzzles, 3D modeling, and architecture games can help develop this skill.',
    },
    WORKING_MEMORY: {
      strong: 'Your working memory capacity is excellent — you can hold and manipulate more information simultaneously.',
      average: 'Your working memory capacity is within the expected range for your age group.',
      developing: 'Memory training exercises and mindfulness practices can help improve working memory.',
    },
  }
  return interpretations[domain]?.[level] ?? 'This domain measures a specific aspect of cognitive performance.'
}

function normalCDF(z: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const sign = z < 0 ? -1 : 1
  const x = Math.abs(z) / Math.SQRT2
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  return 0.5 * (1.0 + sign * y)
}

export function calculateMockResult(
  sessionId: string,
  answers: Array<{ correct: boolean; timeTakenMs: number; domain: string }>,
  ageGroup: string,
): MockResult {
  const total = answers.length
  const correct = answers.filter(a => a.correct).length

  // Score out of 40, normalized — mean 100, SD 15
  // We use a beta-adjusted raw score to account for difficulty spread
  const pct = total > 0 ? correct / total : 0
  // Adjust for chance: subtract expected chance performance and rescale
  const adjusted = Math.max(0, (pct - 0.25) / 0.75)
  const z = (adjusted - 0.5) / 0.18
  const iqRaw = Math.round(100 + z * 15)
  const iqScore = Math.max(55, Math.min(145, iqRaw))
  const confidenceLower = Math.max(55, iqScore - 5)
  const confidenceUpper = Math.min(145, iqScore + 5)
  const percentile = Math.round(normalCDF((iqScore - 100) / 15) * 100)

  let classification: string
  if (iqScore >= 130) classification = 'Very Superior'
  else if (iqScore >= 120) classification = 'Superior'
  else if (iqScore >= 110) classification = 'High Average'
  else if (iqScore >= 90) classification = 'Average'
  else if (iqScore >= 80) classification = 'Low Average'
  else if (iqScore >= 70) classification = 'Borderline'
  else classification = 'Extremely Low'

  // Per-domain scores
  const domainMap: Record<string, { correct: number; total: number; totalTime: number }> = {}
  for (const a of answers) {
    if (!domainMap[a.domain]) domainMap[a.domain] = { correct: 0, total: 0, totalTime: 0 }
    domainMap[a.domain].total += 1
    domainMap[a.domain].totalTime += a.timeTakenMs
    if (a.correct) domainMap[a.domain].correct += 1
  }

  const domainScores: Record<string, MockDomainScore> = {}
  for (const [domain, stats] of Object.entries(domainMap)) {
    const efficiency = stats.total > 0 ? stats.correct / stats.total : 0
    domainScores[domain] = {
      domain,
      label: DOMAIN_LABELS[domain] ?? domain,
      efficiency,
      band: domainBand(efficiency),
      interpretation: domainInterpretation(domain, efficiency),
      percentileWithinDomain: Math.round(normalCDF((efficiency - 0.6) / 0.2) * 100),
    }
  }

  return {
    sessionId,
    iqScore,
    confidenceLower,
    confidenceUpper,
    percentile,
    classification,
    isValid: total >= 20,
    invalidityFlags: total < 20 ? ['INSUFFICIENT_QUESTIONS_ANSWERED'] : [],
    domainScores,
    ageGroup,
    questionCount: total,
    completedAt: new Date().toISOString(),
    normingVersion: 'v2.1-community',
    reportReady: false,
    reportUrl: null,
  }
}
