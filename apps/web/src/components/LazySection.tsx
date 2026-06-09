'use client'

// ============================================================
// ROUGHTOOLS â€” LazySection Component (Phase 3.6)
// "Add loading='lazy' to below-fold content"
// Uses IntersectionObserver to defer rendering of content
// that is below the fold â€” improves LCP & TTI scores.
// ============================================================

import { useEffect, useRef, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LazySectionProps {
  children: ReactNode
  className?: string
  /** Minimum height to reserve before content loads â€” prevents layout shift */
  minHeight?: number | string
  /** How far from viewport edge to start loading (default: 200px) */
  rootMargin?: string
  /** Skeleton placeholder shown while section loads */
  skeleton?: ReactNode
  /** Disable lazy loading (renders immediately) */
  disabled?: boolean
  /** Fade in animation when section becomes visible */
  fadeIn?: boolean
  /** aria-label for the section */
  label?: string
}

export function LazySection({
  children,
  className,
  minHeight,
  rootMargin = '200px',
  skeleton,
  disabled = false,
  fadeIn = true,
  label,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(disabled)
  const [hasLoaded, setHasLoaded] = useState(disabled)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) return

    // If IntersectionObserver not available (old browser) â€” load immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      setHasLoaded(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Small delay so animation plays nicely
          setTimeout(() => setHasLoaded(true), 50)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [disabled, rootMargin])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={!isVisible && minHeight ? { minHeight } : undefined}
      aria-label={label}
    >
      {!isVisible && skeleton ? (
        skeleton
      ) : isVisible ? (
        <div
          className={cn(
            fadeIn && 'transition-opacity duration-500',
            fadeIn && !hasLoaded && 'opacity-0',
            fadeIn && hasLoaded && 'opacity-100'
          )}
        >
          {children}
        </div>
      ) : (
        // Reserve space with empty div when no skeleton provided
        minHeight ? (
          <div style={{ minHeight }} aria-hidden="true" />
        ) : null
      )}
    </div>
  )
}

// â”€â”€â”€ SKELETON COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Generic card skeleton */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 p-4 animate-pulse bg-gray-50',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}

/** Tool grid skeleton â€” 8 cards */
export function ToolGridSkeleton({
  count = 8,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Text block skeleton */
export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}