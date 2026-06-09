import type { DeductionContent } from '../../_lib/types'

interface Props {
  content: DeductionContent
  disabled: boolean
  onAnswer: (index: number) => void
}

export function DeductionRenderer({ content, disabled, onAnswer }: Props) {
  return (
    <div>
      {/* Premises */}
      <div className="bg-[#f9f9f9] dark:bg-[#2a2a2a] rounded-xl p-4 mb-5 space-y-2">
        <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-[#555] dark:text-[#aaa] mb-3">
          Given statements
        </p>
        {content.premises.map((p, i) => (
          <div key={i} className="flex gap-2.5 text-[14px] text-[#1a1a1a] dark:text-[#f0f0f0] leading-[1.55]">
            <span className="text-[#a21caf] font-semibold flex-shrink-0">{i + 1}.</span>
            {p}
          </div>
        ))}
      </div>

      {/* Question */}
      <p className="text-[15px] font-medium mb-5 leading-[1.6]">{content.question}</p>

      {/* Options */}
      <div className="space-y-2">
        {content.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={disabled}
            className="w-full flex items-start gap-3 py-3 px-4 rounded-xl border-2 text-left
                       border-black/10 dark:border-white/15
                       text-[13px] text-[#374151] dark:text-[#ccc]
                       hover:border-[#a21caf] hover:text-[#a21caf] dark:hover:text-[#e879f9]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="font-semibold flex-shrink-0 text-[#a21caf] dark:text-[#e879f9]">
              {String.fromCharCode(65 + i)}.
            </span>
            <span className="leading-[1.55]">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
