'use client'

import { useEffect, useRef, useState } from 'react'
import { AdUnit } from '@/components/analytics/AdSense'

const AD_CONFIG = {
  top:     { maxWidth: 728, height: 90,  format: 'horizontal' as const, lazy: false },
  middle:  { maxWidth: 728, height: 280, format: 'rectangle'  as const, lazy: true  },
  bottom:  { maxWidth: 728, height: 90,  format: 'horizontal' as const, lazy: true  },
  sidebar: { maxWidth: 300, height: 250, format: 'rectangle'  as const, lazy: true  },
} as const

const AD_SLOTS: Record<string, string> = {
  top:     process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP     || '',
  middle:  process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE  || '',
  bottom:  process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM  || '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
}

interface ToolAdUnitProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
  className?: string
}

export default function ToolAdUnit({ position, className }: ToolAdUnitProps) {
  const { maxWidth, height, format, lazy } = AD_CONFIG[position]
  const containerRef = useRef<HTMLDivElement>(null)

  // mounted guard: never render ad content during SSR — eliminates hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [inView, setInView]   = useState(false)

  useEffect(() => {
    setMounted(true)
    // Non-lazy ads become visible immediately after mount
    if (!lazy) {
      setInView(true)
      return
    }
    // Lazy ads wait for the element to approach the viewport
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [lazy])

  const isSidebar = position === 'sidebar'

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Advertisement"
      suppressHydrationWarning
      style={{
        width: '100%',
        maxWidth,
        height,
        margin: isSidebar ? '0' : '28px auto',
        // sidebar sticky must come AFTER position:relative so it wins
        position: isSidebar ? 'sticky' : 'relative',
        top: isSidebar ? 72 : undefined,
        contain: 'strict',
        background: 'rgba(255,255,255,0.025)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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

      {mounted && inView && (
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
