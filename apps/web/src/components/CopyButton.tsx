'use client'

/**
 * CopyButton — Step 7a
 * Spec: "Copy" → immediately "Copied!" with checkmark → resets after 2s.
 * Icon morphs with 150ms scale animation. Color transitions copy → success green.
 * Feedback is icon-morph only — no toast (toast is for file uploads / form submissions).
 */

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/useToast'

interface CopyButtonProps {
  /** Text to copy to clipboard */
  value: string
  /** Label shown before copy */
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({
  value,
  label = 'Copy',
  className,
  size = 'md',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — please select and copy manually.')
    }
  }, [value, copied])

  const sizeClass = size === 'sm'
    ? 'h-7 px-2.5 text-[11px] gap-1.5'
    : 'h-8 px-3 text-[12px] gap-2'

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : `Copy ${label}`}
      className={cn(
        'inline-flex items-center rounded-lg border font-medium cursor-pointer',
        'transition-all duration-150 select-none',
        // Press scale — spec: scale(0.97) on active
        'active:scale-[0.97]',
        copied
          ? [
              'border-emerald-300/60 dark:border-emerald-700/40',
              'bg-emerald-50 dark:bg-emerald-900/20',
              'text-emerald-700 dark:text-emerald-400',
            ]
          : [
              'border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]',
              'bg-[var(--bg-1)] hover:bg-[var(--bg-2)]',
              'text-[var(--fg-2)] hover:text-[var(--fg)]',
            ],
        sizeClass,
        className
      )}
    >
      {/* Icon — morphs copy ↔ checkmark with scale animation */}
      <span
        className="flex-shrink-0 transition-transform duration-150"
        style={{ transform: copied ? 'scale(1)' : 'scale(1)', animation: copied ? 'icon-pop 150ms ease' : undefined }}
        aria-hidden="true"
      >
        {copied ? (
          // Checkmark
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}>
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        ) : (
          // Copy
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round"
            className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}>
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        )}
      </span>

      {/* Label */}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  )
}
