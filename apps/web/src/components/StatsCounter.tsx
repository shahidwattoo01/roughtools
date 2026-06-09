'use client'

/**
 * StatsCounter — animated count-up stat cards
 * Uses IntersectionObserver so animation only fires when visible.
 * Respects prefers-reduced-motion.
 */

import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/utils'

interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label: string
  sub: string
  special?: string  // for non-numeric like "∞"
}

const STATS: Stat[] = [
  { value: 405, suffix: '+',  label: 'Free tools, growing',  sub: 'across 15 categories' },
  { value: 0,                 label: 'Signups needed',       sub: 'Open and use instantly' },
  { value: 100, suffix: '%',  label: 'In your browser',      sub: 'Files never leave device' },
  { value: 0,   special: '∞', label: 'Unlimited uses',       sub: 'No quotas, ever' },
]

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const { count, ref } = useCountUp({
    target: stat.value,
    duration: 1500,
  })

  return (
    <div
      className={cn(
        'stat-card',
        'opacity-0 translate-y-4',
        'animate-[stat-entrance_500ms_ease_forwards]',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-num">
        {stat.special ? (
          <span className="accent">{stat.special}</span>
        ) : (
          <span ref={ref as React.RefObject<HTMLSpanElement>} className="accent">
            {stat.prefix}{count.toLocaleString()}{stat.suffix}
          </span>
        )}
      </div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-sub">{stat.sub}</div>
    </div>
  )
}

export function StatsCounter({ className }: { className?: string }) {
  return (
    <div className={cn('hero-stats', className)}>
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} delay={i * 80} />
      ))}
    </div>
  )
}
