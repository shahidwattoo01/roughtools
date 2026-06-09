import type { SpatialContent } from '../../_lib/types'

interface Props {
  content: SpatialContent
  disabled: boolean
  onAnswer: (index: number) => void
}

// CSS-based isometric cube grid to represent the base object visually.
// In a full implementation this would be a WebGL/Three.js renderer.
function IsoBlock({ label }: { label: string }) {
  return (
    <div className="relative w-[56px] h-[48px]" aria-hidden="true">
      {/* Top face */}
      <div
        className="absolute inset-x-0 top-0 h-[16px] bg-[#c084fc]"
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
      />
      {/* Left face */}
      <div
        className="absolute left-0 bottom-0 w-[28px] h-[32px] bg-[#7e22ce]"
        style={{ clipPath: 'polygon(0% 0%, 100% 50%, 100% 100%, 0% 50%)' }}
      />
      {/* Right face */}
      <div
        className="absolute right-0 bottom-0 w-[28px] h-[32px] bg-[#a855f7]"
        style={{ clipPath: 'polygon(0% 50%, 100% 0%, 100% 50%, 0% 100%)' }}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function SpatialRenderer({ content, disabled, onAnswer }: Props) {
  return (
    <div>
      {/* Stem */}
      <p className="text-[15px] font-medium mb-4 leading-[1.6]">{content.stem}</p>

      {/* Base shape description */}
      <div className="bg-[#f9f9f9] dark:bg-[#2a2a2a] rounded-xl p-4 mb-5 flex gap-5 items-start">
        {/* Decorative iso blocks */}
        <div className="flex gap-0.5 flex-shrink-0 pt-1" aria-hidden="true">
          <IsoBlock label="cube 1" />
          <IsoBlock label="cube 2" />
        </div>
        <div>
          <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-[#555] dark:text-[#aaa] mb-1">
            Original shape
          </p>
          <p className="text-[13px] text-[#374151] dark:text-[#ccc] leading-[1.6]">
            {content.baseDescription}
          </p>
          <p className="text-[12px] text-[#a21caf] dark:text-[#e879f9] mt-1.5 font-medium">
            ↻ {content.transformation}
          </p>
        </div>
      </div>

      {/* Options */}
      <p className="text-[12px] text-[#555] dark:text-[#aaa] mb-3">
        Which of the following describes the result?
      </p>
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
