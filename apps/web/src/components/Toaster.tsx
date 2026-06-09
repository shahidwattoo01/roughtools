'use client'

/**
 * Toaster — renders active toasts in bottom-right corner.
 * Spec: success=green left border, error=red, info=blue. Auto-dismiss 3s.
 * Mount once inside layout.tsx (inside CommandPaletteProvider).
 */

import { useToasts } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const TYPE_STYLES = {
  success: {
    border: 'border-l-emerald-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500 flex-shrink-0">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
  },
  error: {
    border: 'border-l-red-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-500 flex-shrink-0">
        <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
      </svg>
    ),
  },
  info: {
    border: 'border-l-blue-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-500 flex-shrink-0">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
    ),
  },
}

export function Toaster() {
  const { toasts, dismiss } = useToasts()

  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map((t) => {
        const style = TYPE_STYLES[t.type]
        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              'pointer-events-auto',
              'flex items-center gap-3',
              'min-w-[240px] max-w-[360px] px-4 py-3',
              'rounded-xl border-l-4',
              'bg-white dark:bg-[#1A1A1A]',
              'border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]',
              'shadow-lg',
              style.border,
              // Entrance
              'animate-[toast-in_200ms_cubic-bezier(0.16,1,0.3,1)_forwards]',
            )}
          >
            {style.icon}
            <p className="flex-1 text-[13px] font-medium text-[var(--fg)] leading-snug">
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="ml-1 text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors cursor-pointer flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
