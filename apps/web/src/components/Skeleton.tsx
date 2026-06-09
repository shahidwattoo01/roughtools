/**
 * Skeleton — Step 7b
 * Spec: grey placeholder boxes with shimmer moving left→right.
 * Replaces blank loading states. Never show a blank white page or spinning circle.
 */

import { cn } from '@/lib/utils'

// ─── Base shimmer ─────────────────────────────────────────────
interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton-shimmer rounded', className)}
      style={style}
      aria-hidden="true"
    />
  )
}

// ─── Tool card skeleton ───────────────────────────────────────
export function ToolCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'p-4 rounded-xl border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]',
      'bg-white dark:bg-[#1A1A1A]',
      className
    )} aria-hidden="true">
      <div className="flex items-start gap-3">
        {/* Icon box */}
        <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name */}
          <Skeleton className="h-3.5 w-3/4 rounded" />
          {/* Description */}
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      {/* Badge */}
      <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

// ─── Tool grid skeleton ───────────────────────────────────────
export function ToolGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 2 | 3 | 4 }) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns]

  return (
    <div className={`grid gap-3 ${colClass}`} aria-busy="true" aria-label="Loading tools…">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Text block skeleton ──────────────────────────────────────
export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3']
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5 rounded', widths[i % widths.length])} />
      ))}
    </div>
  )
}

// ─── Page hero skeleton ───────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="py-32 flex flex-col items-center gap-6" aria-hidden="true">
      <Skeleton className="h-6 w-48 rounded-full" />
      <Skeleton className="h-16 w-96 rounded" />
      <Skeleton className="h-10 w-80 rounded" />
      <Skeleton className="h-14 w-[560px] max-w-full rounded-full" />
    </div>
  )
}
