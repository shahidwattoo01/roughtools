'use client'

import { useState, useEffect, useRef } from 'react'
import type { MemoryContent } from '../../_lib/types'

interface Props {
  content: MemoryContent
  disabled: boolean
  onAnswer: (index: number) => void
  onDisplayDone: () => void
  memoryPhase: 'display' | 'respond'
}

export function MemoryRenderer({ content, disabled, onAnswer, onDisplayDone, memoryPhase }: Props) {
  const [msLeft, setMsLeft] = useState(content.displayDurationMs)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (memoryPhase !== 'display') return

    setMsLeft(content.displayDurationMs)
    intervalRef.current = setInterval(() => {
      setMsLeft((prev) => {
        if (prev <= 100) {
          clearInterval(intervalRef.current!)
          onDisplayDone()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryPhase, content.displayDurationMs])

  if (memoryPhase === 'display') {
    const pct = (msLeft / content.displayDurationMs) * 100
    return (
      <div className="text-center">
        <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-4">
          Memorise the sequence in order.{' '}
          {content.mode === 'reverse' && (
            <strong className="text-[#a21caf]">You will need to recall it in reverse.</strong>
          )}
        </p>

        {/* Sequence display */}
        <div className="flex justify-center gap-3 mb-6">
          {content.sequence.map((item, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-xl bg-[#a21caf] text-white flex items-center justify-center text-2xl font-bold shadow-md"
            >
              {String(item)}
            </div>
          ))}
        </div>

        {/* Countdown bar */}
        <div className="max-w-[240px] mx-auto">
          <div className="h-1.5 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full bg-[#a21caf] transition-all duration-100"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-[#555] dark:text-[#aaa]">
            Memorising… {(msLeft / 1000).toFixed(1)}s
          </p>
        </div>
      </div>
    )
  }

  // Respond phase
  return (
    <div>
      <p className="text-[15px] font-medium mb-2">
        {content.mode === 'reverse'
          ? 'Select the sequence in reverse order:'
          : 'Select the sequence you saw:'}
      </p>
      <p className="text-[12px] text-[#555] dark:text-[#aaa] mb-6">
        {content.length} digits · {content.mode === 'reverse' ? 'last digit first' : 'same order'}
      </p>

      <div className="space-y-2">
        {content.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={disabled}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border-2
                       border-black/10 dark:border-white/15
                       hover:border-[#a21caf] hover:bg-[#fdf4ff] dark:hover:bg-[#a21caf]/5
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-[12px] text-[#555] dark:text-[#aaa] w-4 flex-shrink-0">{String.fromCharCode(65 + i)}</span>
            <div className="flex gap-2">
              {opt.map((digit, j) => (
                <span
                  key={j}
                  className="w-9 h-9 rounded-lg bg-[#f3f4f6] dark:bg-white/8 flex items-center justify-center text-sm font-semibold"
                >
                  {String(digit)}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
