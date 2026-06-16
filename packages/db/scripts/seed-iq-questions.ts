import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Domain = 'FLUID_REASONING' | 'CRYSTALLIZED_INTELLIGENCE' | 'PROCESSING_SPEED' | 'WORKING_MEMORY' | 'SPATIAL_REASONING' | 'QUANTITATIVE_REASONING'
type Format = 'MATRIX' | 'SEQUENCE' | 'ANALOGY' | 'MEMORY' | 'SPATIAL' | 'DEDUCTION'

interface SeedQuestion {
  domain: Domain
  format: Format
  difficulty: number
  timeLimitSeconds: number
  content: Record<string, unknown>
}

// Sourced from apps/web/src/app/tools/iq-test/_lib/mock-data.ts (40 questions, 6 domains, 6 formats)
const QUESTIONS: SeedQuestion[] = [
  { domain: 'FLUID_REASONING', format: 'SEQUENCE', difficulty: 3, timeLimitSeconds: 45,
    content: { stem: 'What number comes next?', sequence: [2, 4, 8, 16, null], options: [24, 28, 32, 36, 30, 20], correct: 2 } },
  { domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE', difficulty: 3, timeLimitSeconds: 45,
    content: { stem: 'What number completes the pattern?', sequence: [1, 1, 2, 3, 5, 8, null], options: [11, 12, 13, 14, 15, 16], correct: 2 } },
  { domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE', difficulty: 4, timeLimitSeconds: 40,
    content: { stem: 'Which number is missing?', sequence: [3, 6, 12, 24, null, 96], options: [36, 40, 42, 44, 48, 50], correct: 4 } },
  { domain: 'FLUID_REASONING', format: 'SEQUENCE', difficulty: 4, timeLimitSeconds: 50,
    content: { stem: 'What comes next in the series?', sequence: [100, 91, 83, 76, 70, null], options: [63, 64, 65, 66, 67, 68], correct: 3 } },
  { domain: 'FLUID_REASONING', format: 'SEQUENCE', difficulty: 4, timeLimitSeconds: 50,
    content: { stem: 'Complete the sequence:', sequence: [2, 6, 12, 20, 30, null], options: [36, 40, 42, 44, 48, 52], correct: 2 } },
  { domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE', difficulty: 5, timeLimitSeconds: 55,
    content: { stem: 'What value replaces the question mark?', sequence: [1, 4, 9, 16, 25, null], options: [30, 32, 35, 36, 38, 40], correct: 3 } },
  { domain: 'FLUID_REASONING', format: 'SEQUENCE', difficulty: 5, timeLimitSeconds: 55,
    content: { stem: 'Find the next number:', sequence: [3, 9, 27, 81, null], options: [162, 200, 240, 243, 256, 270], correct: 3 } },
  { domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE', difficulty: 6, timeLimitSeconds: 60,
    content: { stem: 'What number is missing?', sequence: [17, 13, null, 5, 1], options: [6, 7, 8, 9, 10, 11], correct: 3 } },

  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 3, timeLimitSeconds: 40,
    content: { pairA: ['Book', 'Library'], promptWord: 'Painting', options: ['Artist', 'Museum', 'Canvas', 'Colour', 'Frame', 'Gallery'], correct: 1, domainHint: 'functional' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 3, timeLimitSeconds: 40,
    content: { pairA: ['Scalpel', 'Surgeon'], promptWord: 'Brush', options: ['Canvas', 'Painter', 'Gallery', 'Colour', 'Wall', 'Frame'], correct: 1, domainHint: 'functional' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 4, timeLimitSeconds: 40,
    content: { pairA: ['Marathon', 'Endurance'], promptWord: 'Sprint', options: ['Track', 'Speed', 'Distance', 'Athlete', 'Race', 'Medal'], correct: 1, domainHint: 'semantic' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 5, timeLimitSeconds: 40,
    content: { pairA: ['Ignorance', 'Education'], promptWord: 'Disease', options: ['Doctor', 'Medicine', 'Hospital', 'Health', 'Cure', 'Illness'], correct: 4, domainHint: 'functional' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 4, timeLimitSeconds: 40,
    content: { pairA: ['Telescope', 'Stars'], promptWord: 'Microscope', options: ['Science', 'Lens', 'Bacteria', 'Biology', 'Laboratory', 'Doctor'], correct: 2, domainHint: 'functional' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 3, timeLimitSeconds: 35,
    content: { pairA: ['Clock', 'Time'], promptWord: 'Thermometer', options: ['Heat', 'Cold', 'Temperature', 'Weather', 'Mercury', 'Degrees'], correct: 2, domainHint: 'functional' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 5, timeLimitSeconds: 45,
    content: { pairA: ['Archipelago', 'Islands'], promptWord: 'Constellation', options: ['Planet', 'Telescope', 'Stars', 'Galaxy', 'Universe', 'Orbit'], correct: 2, domainHint: 'categorical' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 6, timeLimitSeconds: 45,
    content: { pairA: ['Pedantic', 'Precision'], promptWord: 'Magnanimous', options: ['Wealth', 'Generosity', 'Pride', 'Courage', 'Kindness', 'Wisdom'], correct: 1, domainHint: 'semantic' } },

  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 5, timeLimitSeconds: 50,
    content: { premises: ['All architects are engineers.', 'Some engineers are project managers.', 'Maria is an architect.'], question: 'Which conclusion must be true?', options: ['Maria is a project manager.', 'Maria is an engineer.', 'All project managers are architects.', 'Some architects are not engineers.'], correct: 1, logicType: 'categorical_syllogism' } },
  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 5, timeLimitSeconds: 50,
    content: { premises: ['No reptiles are warm-blooded.', 'All snakes are reptiles.'], question: 'Which conclusion is necessarily true?', options: ['Some warm-blooded animals are snakes.', 'No snakes are warm-blooded.', 'All warm-blooded animals are reptiles.', 'Some reptiles are not snakes.'], correct: 1, logicType: 'categorical_syllogism' } },
  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 6, timeLimitSeconds: 55,
    content: { premises: ['If it rains, the ground gets wet.', 'The ground is not wet.'], question: 'What can you conclude?', options: ['It is raining.', 'It did not rain.', 'The ground is always dry.', 'Nothing can be concluded.'], correct: 1, logicType: 'modus_tollens' } },
  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 4, timeLimitSeconds: 55,
    content: { premises: ['All mammals breathe air.', 'Whales breathe air.'], question: 'Which is the strongest valid conclusion?', options: ['Whales are mammals.', 'Whales might be mammals.', 'All air-breathing animals are mammals.', 'Whales are the only mammals in the sea.'], correct: 1, logicType: 'modus_ponens' } },
  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 6, timeLimitSeconds: 60,
    content: { premises: ['Alex is taller than Ben.', 'Ben is taller than Chris.', 'Dana is shorter than Chris.'], question: 'Who is the tallest?', options: ['Ben', 'Chris', 'Alex', 'Dana'], correct: 2, logicType: 'categorical_syllogism' } },
  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 5, timeLimitSeconds: 60,
    content: { premises: ['Either the meeting is on Monday or Tuesday.', 'The meeting is not on Monday.'], question: 'What must be true?', options: ['The meeting is on Wednesday.', 'The meeting is on Tuesday.', 'The meeting might be cancelled.', 'The meeting was already held.'], correct: 1, logicType: 'disjunctive_syllogism' } },

  { domain: 'FLUID_REASONING', format: 'MATRIX', difficulty: 6, timeLimitSeconds: 60,
    content: { renderHint: '3x3',
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
      ], correct: 0 } },
  { domain: 'FLUID_REASONING', format: 'MATRIX', difficulty: 6, timeLimitSeconds: 65,
    content: { renderHint: '3x3',
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
      ], correct: 2 } },
  { domain: 'FLUID_REASONING', format: 'MATRIX', difficulty: 7, timeLimitSeconds: 65,
    content: { renderHint: '3x3',
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
      ], correct: 1 } },
  { domain: 'SPATIAL_REASONING', format: 'MATRIX', difficulty: 7, timeLimitSeconds: 70,
    content: { renderHint: '3x3',
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
      ], correct: 1 } },
  { domain: 'FLUID_REASONING', format: 'MATRIX', difficulty: 7, timeLimitSeconds: 70,
    content: { renderHint: '3x3',
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
      ], correct: 2 } },

  { domain: 'WORKING_MEMORY', format: 'MEMORY', difficulty: 3, timeLimitSeconds: 30,
    content: { sequence: [7, 3, 9, 1, 5], displayDurationMs: 4000, mode: 'forward', length: 5, options: [[7,3,9,1,5],[7,3,1,9,5],[7,9,3,1,5],[3,7,9,1,5],[7,3,9,5,1],[7,3,9,1,6]], correct: 0 } },
  { domain: 'WORKING_MEMORY', format: 'MEMORY', difficulty: 4, timeLimitSeconds: 35,
    content: { sequence: [4, 8, 2, 6], displayDurationMs: 3500, mode: 'reverse', length: 4, options: [[6,2,8,4],[4,8,2,6],[6,8,2,4],[4,2,8,6],[2,6,4,8],[6,2,4,8]], correct: 0 } },
  { domain: 'WORKING_MEMORY', format: 'MEMORY', difficulty: 5, timeLimitSeconds: 35,
    content: { sequence: [5, 1, 7, 3, 8, 2], displayDurationMs: 5000, mode: 'forward', length: 6, options: [[5,1,7,3,8,2],[5,1,7,8,3,2],[5,1,3,7,8,2],[5,1,7,3,2,8],[1,5,7,3,8,2],[5,1,7,3,8,4]], correct: 0 } },
  { domain: 'WORKING_MEMORY', format: 'MEMORY', difficulty: 6, timeLimitSeconds: 40,
    content: { sequence: [9, 4, 6, 1, 8, 3, 5], displayDurationMs: 5500, mode: 'forward', length: 7, options: [[9,4,6,1,8,3,5],[9,4,6,1,3,8,5],[9,4,6,8,1,3,5],[9,4,1,6,8,3,5],[4,9,6,1,8,3,5],[9,4,6,1,8,5,3]], correct: 0 } },
  { domain: 'WORKING_MEMORY', format: 'MEMORY', difficulty: 4, timeLimitSeconds: 40,
    content: { sequence: [3, 7, 2, 9], displayDurationMs: 3000, mode: 'reverse', length: 4, options: [[9,2,7,3],[3,7,2,9],[7,2,9,3],[9,7,2,3],[2,9,7,3],[9,2,3,7]], correct: 0 } },

  { domain: 'SPATIAL_REASONING', format: 'SPATIAL', difficulty: 5, timeLimitSeconds: 55,
    content: { stem: 'The shape on the left is rotated 90° clockwise. Which option shows the result?', baseDescription: 'An L-shaped block: 3 cubes tall on the left, 2 cubes extending right at the bottom.', transformation: '90° clockwise rotation around the vertical axis', options: ['2 cubes tall on the left, 3 cubes extending right at the bottom', '3 cubes wide on top, 2 cubes extending down on the right', '2 cubes wide on top, 3 cubes extending down on the left', '3 cubes tall on the right, 2 cubes extending left at the bottom'], correct: 1 } },
  { domain: 'SPATIAL_REASONING', format: 'SPATIAL', difficulty: 5, timeLimitSeconds: 55,
    content: { stem: 'A cube is unfolded into a flat cross shape. If the top face shows a star, what is on the opposite face?', baseDescription: 'A standard cross-shaped net with center square and four squares extending up, down, left, right. The top extension has a star.', transformation: 'Mental folding of net into cube', options: ['The bottom extension square', 'The left extension square', 'The right extension square', 'The center square'], correct: 0 } },
  { domain: 'SPATIAL_REASONING', format: 'SPATIAL', difficulty: 4, timeLimitSeconds: 60,
    content: { stem: 'A clock shows 3:00. If you rotate the clock image 180°, what time does it appear to show?', baseDescription: 'Standard clock face showing exactly 3:00.', transformation: '180° rotation of the entire clock image', options: ['9:00', '6:00', '12:00', '3:00'], correct: 0 } },
  { domain: 'SPATIAL_REASONING', format: 'SPATIAL', difficulty: 3, timeLimitSeconds: 60,
    content: { stem: 'You are looking at a 4×4 grid of dots. A diagonal line goes from the top-left dot to the bottom-right dot. How many dots does the line pass through?', baseDescription: '4×4 grid of equally spaced dots.', transformation: 'Diagonal path visualization', options: ['2 dots', '3 dots', '4 dots', '6 dots'], correct: 2 } },

  { domain: 'QUANTITATIVE_REASONING', format: 'SEQUENCE', difficulty: 6, timeLimitSeconds: 50,
    content: { stem: 'A store marks items up 40% then discounts 40%. The final price compared to the original is:', sequence: [null], options: [100, 96, 84, 80, 76, 72], correct: 2 } },
  { domain: 'FLUID_REASONING', format: 'DEDUCTION', difficulty: 7, timeLimitSeconds: 55,
    content: { premises: ['Five people sit in a row: Anna, Ben, Clara, Dan, Eve.', 'Anna sits next to Ben.', 'Clara sits at one end.', 'Dan sits between Ben and Eve.'], question: 'Which order is possible?', options: ['Clara-Anna-Ben-Dan-Eve', 'Eve-Clara-Anna-Ben-Dan', 'Clara-Ben-Anna-Dan-Eve', 'Ben-Anna-Clara-Dan-Eve'], correct: 0, logicType: 'categorical_syllogism' } },
  { domain: 'CRYSTALLIZED_INTELLIGENCE', format: 'ANALOGY', difficulty: 7, timeLimitSeconds: 45,
    content: { pairA: ['Obfuscate', 'Clarity'], promptWord: 'Ameliorate', options: ['Improvement', 'Deterioration', 'Ambiguity', 'Complexity', 'Precision', 'Brevity'], correct: 1, domainHint: 'oppositional' } },
  { domain: 'FLUID_REASONING', format: 'SEQUENCE', difficulty: 8, timeLimitSeconds: 60,
    content: { stem: 'What number comes next? 2, 3, 5, 7, 11, 13, 17, 19, …', sequence: [2, 3, 5, 7, 11, 13, 17, 19, null], options: [20, 21, 22, 23, 24, 25], correct: 3 } },
]

async function main() {
  console.log(`Seeding ${QUESTIONS.length} IQ questions...`)
  for (const q of QUESTIONS) {
    await prisma.iqQuestionBank.create({
      data: {
        domain: q.domain,
        format: q.format,
        difficulty: q.difficulty,
        content: { ...q.content, format: q.format },
        timeLimitSeconds: q.timeLimitSeconds,
        difficultyCalibrated: false,
        pilot: false,
        isActive: true,
      },
    })
  }
  const count = await prisma.iqQuestionBank.count()
  console.log(`Done. Total questions in bank: ${count}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
