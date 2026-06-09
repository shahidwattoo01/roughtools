import type { Question } from '../../_lib/types'
import { SequenceRenderer } from './SequenceRenderer'
import { AnalogyRenderer } from './AnalogyRenderer'
import { MemoryRenderer } from './MemoryRenderer'
import { MatrixRenderer } from './MatrixRenderer'
import { DeductionRenderer } from './DeductionRenderer'
import { SpatialRenderer } from './SpatialRenderer'

interface Props {
  question: Question
  disabled: boolean
  memoryPhase: 'display' | 'respond'
  onAnswer: (index: number) => void
  onMemoryDisplayDone: () => void
}

const DOMAIN_LABELS: Record<string, string> = {
  FLUID_REASONING:           'Fluid Reasoning',
  CRYSTALLIZED_INTELLIGENCE: 'Crystallized Intelligence',
  QUANTITATIVE_REASONING:    'Quantitative Reasoning',
  SPATIAL_REASONING:         'Spatial Reasoning',
  WORKING_MEMORY:            'Working Memory',
  PROCESSING_SPEED:          'Processing Speed',
}

export function QuestionRenderer({ question, disabled, memoryPhase, onAnswer, onMemoryDisplayDone }: Props) {
  const { content, format } = question

  let body: React.ReactNode

  if (format === 'SEQUENCE' && content.format === 'SEQUENCE') {
    body = <SequenceRenderer content={content} disabled={disabled} onAnswer={onAnswer} />
  } else if (format === 'ANALOGY' && content.format === 'ANALOGY') {
    body = <AnalogyRenderer content={content} disabled={disabled} onAnswer={onAnswer} />
  } else if (format === 'MEMORY' && content.format === 'MEMORY') {
    body = (
      <MemoryRenderer
        content={content}
        disabled={disabled}
        onAnswer={onAnswer}
        onDisplayDone={onMemoryDisplayDone}
        memoryPhase={memoryPhase}
      />
    )
  } else if (format === 'MATRIX' && content.format === 'MATRIX') {
    body = <MatrixRenderer content={content} disabled={disabled} onAnswer={onAnswer} />
  } else if (format === 'DEDUCTION' && content.format === 'DEDUCTION') {
    body = <DeductionRenderer content={content} disabled={disabled} onAnswer={onAnswer} />
  } else if (format === 'SPATIAL' && content.format === 'SPATIAL') {
    body = <SpatialRenderer content={content} disabled={disabled} onAnswer={onAnswer} />
  } else {
    body = <p className="text-sm text-[#555]">Unsupported question format: {format}</p>
  }

  return (
    <div>
      {/* Domain badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#fdf4ff] dark:bg-[#a21caf]/10 text-[#a21caf] dark:text-[#e879f9] rounded-full px-2.5 py-1 text-[11px] font-medium mb-4">
        {DOMAIN_LABELS[question.domain] ?? question.domain}
      </div>

      {body}

      <p className="text-center text-[11px] text-[#555] dark:text-[#aaa] mt-5">
        No answer feedback until the test is complete.
      </p>
    </div>
  )
}
