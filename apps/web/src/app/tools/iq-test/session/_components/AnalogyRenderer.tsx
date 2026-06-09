import type { AnalogyContent } from '../../_lib/types'

interface Props {
  content: AnalogyContent
  disabled: boolean
  onAnswer: (index: number) => void
}

export function AnalogyRenderer({ content, disabled, onAnswer }: Props) {
  return (
    <div>
      {/* Analogy stem */}
      <div className="flex flex-wrap items-center gap-2 mb-7">
        <span className="bg-[#f3f4f6] dark:bg-white/8 rounded-lg px-4 py-2.5 text-[15px] font-semibold">
          {content.pairA[0]}
        </span>
        <span className="text-[#555] dark:text-[#aaa] font-medium">is to</span>
        <span className="bg-[#f3f4f6] dark:bg-white/8 rounded-lg px-4 py-2.5 text-[15px] font-semibold">
          {content.pairA[1]}
        </span>
        <span className="text-[#555] dark:text-[#aaa] font-medium">as</span>
        <span className="bg-[#fdf4ff] dark:bg-[#a21caf]/10 border border-[#a21caf]/20 rounded-lg px-4 py-2.5 text-[15px] font-semibold text-[#a21caf] dark:text-[#e879f9]">
          {content.promptWord}
        </span>
        <span className="text-[#555] dark:text-[#aaa] font-medium">is to</span>
        <span className="border-2 border-dashed border-[#a21caf] rounded-lg px-5 py-2.5 text-[15px] font-semibold text-[#a21caf]">
          ?
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {content.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={disabled}
            className="py-3 px-4 rounded-xl border-2 border-black/10 dark:border-white/15
                       text-sm font-medium text-[#374151] dark:text-[#ccc]
                       hover:border-[#a21caf] hover:text-[#a21caf] dark:hover:text-[#e879f9]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
