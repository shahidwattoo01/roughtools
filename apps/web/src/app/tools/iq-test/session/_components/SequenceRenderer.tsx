import type { SequenceContent } from '../../_lib/types'

interface Props {
  content: SequenceContent
  disabled: boolean
  onAnswer: (index: number) => void
}

export function SequenceRenderer({ content, disabled, onAnswer }: Props) {
  return (
    <div>
      {content.stem && (
        <p className="text-[15px] font-medium mb-5 leading-[1.6]">{content.stem}</p>
      )}

      {/* Sequence row */}
      <div className="flex gap-2 flex-wrap mb-7">
        {content.sequence.map((item, i) => (
          <div
            key={i}
            className={[
              'w-12 h-12 rounded-lg flex items-center justify-center text-lg font-semibold border-2',
              item === null
                ? 'border-dashed border-[#a21caf] text-[#a21caf] bg-[#fdf4ff] dark:bg-[#a21caf]/10'
                : 'border-black/10 dark:border-white/15 bg-[#f9f9f9] dark:bg-[#2a2a2a] text-[#1a1a1a] dark:text-[#f0f0f0]',
            ].join(' ')}
          >
            {item === null ? '?' : String(item)}
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-2">
        {content.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={disabled}
            className="py-3 px-4 rounded-xl border-2 border-black/10 dark:border-white/15
                       text-sm font-semibold text-[#374151] dark:text-[#ccc]
                       hover:border-[#a21caf] hover:text-[#a21caf] dark:hover:text-[#e879f9]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {String(opt)}
          </button>
        ))}
      </div>
    </div>
  )
}
