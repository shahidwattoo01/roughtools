'use client'

import { useEffect, useRef, useState } from 'react'
import { AdUnit } from '@/components/analytics/AdSense'

// ─── Ad configuration ──────────────────────────────────────────────────────
// Heights MUST match the actual ad sizes served — this prevents CLS.
// Google recommends reserving space before the ad loads.
const AD_CONFIG = {
  top:     { maxWidth: 728, height: 90,  format: 'horizontal' as const, lazy: false },
  middle:  { maxWidth: 728, height: 280, format: 'rectangle'  as const, lazy: true  },
  bottom:  { maxWidth: 728, height: 90,  format: 'horizontal' as const, lazy: true  },
  sidebar: { maxWidth: 300, height: 250, format: 'rectangle'  as const, lazy: true  },
} as const

// Replace with real slot IDs from AdSense dashboard
const AD_SLOTS: Record<string, string> = {
  top:     process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP     || '1234567890',
  middle:  process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE  || '0987654321',
  bottom:  process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM  || '1122334455',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '5544332211',
}

interface ToolAdUnitProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
  className?: string
}

/**
 * Ad slot with hard-reserved dimensions to prevent Cumulative Layout Shift (CLS).
 *
 * - Top ad loads immediately (above the fold)
 * - Middle / bottom / sidebar ads lazy-load via IntersectionObserver
 *   (starts fetching 200 px before the element enters the viewport)
 */
export default function ToolAdUnit({ position, className }: ToolAdUnitProps) {
  const { maxWidth, height, format, lazy } = AD_CONFIG[position]
  const containerRef = useRef<HTMLDivElement>(null)

  // Non-lazy ads render immediately; lazy ads wait until near-viewport
  const [inView, setInView] = useState(!lazy)

  useEffect(() => {
    if (!lazy || inView) return
    const el = containerRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '200px 0px' },  // pre-load 200 px before entering viewport
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [lazy, inView])

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Advertisement"
      style={{
        // ── CLS prevention: reserve exact space before the ad arrives ──────
        width: '100%',
        maxWidth: maxWidth,
        // Use height (not minHeight) so the box never grows/shrinks the layout
        height: height,
        margin: position === 'sidebar' ? '0' : '28px auto',
        // Sidebar stays in viewport as users scroll through long tool pages
        ...(position === 'sidebar' && { position: 'sticky', top: 72 }),
        // contain:strict prevents any ad content from shifting surroundings
        contain: 'strict',
        background: 'rgba(255,255,255,0.025)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle "Advertisement" label — always present, non-intrusive */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 3,
          right: 7,
          fontSize: 9,
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.18)',
          pointerEvents: 'none',
          userSelect: 'none',
          textTransform: 'uppercase',
        }}
      >
        Advertisement
      </span>

      {inView && (
        <AdUnit
          slot={AD_SLOTS[position]}
          format={format}
          label={`tool-page-${position}`}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}
