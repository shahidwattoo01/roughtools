'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

interface Props {
  beforeSrc: string   // original image URL / data URL
  afterSrc: string    // processed image URL / data URL
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeSrc, afterSrc,
  beforeLabel = 'Original',
  afterLabel  = 'Processed',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(50)        // divider position 0–100
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    const newPct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100))
    setPct(newPct)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    move(e.clientX)
  }, [move])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true
    move(e.touches[0].clientX)
  }, [move])

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      move(x)
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [move])

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 8, textAlign: 'center' }}>
        ← Drag to compare {beforeLabel} vs {afterLabel} →
      </p>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          position: 'relative', width: '100%', overflow: 'hidden',
          borderRadius: 12, cursor: 'col-resize',
          border: '1px solid rgba(236,72,153,0.25)',
          userSelect: 'none', touchAction: 'none',
          maxHeight: 420,
        }}
      >
        {/* After (full width, underneath) */}
        <img
          src={afterSrc} alt={afterLabel}
          style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain', background: '#111' }}
        />

        {/* Before (clipped to left side) */}
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
        }}>
          <img
            src={beforeSrc} alt={beforeLabel}
            style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain', background: '#111' }}
          />
        </div>

        {/* Divider line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${pct}%`, transform: 'translateX(-50%)',
          width: 2, background: '#ec4899', pointerEvents: 'none',
        }} />

        {/* Handle */}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${pct}%`, transform: 'translate(-50%,-50%)',
          width: 36, height: 36, borderRadius: '50%',
          background: '#ec4899', border: '3px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)', pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 900, letterSpacing: -1 }}>⇔</span>
        </div>

        {/* Labels */}
        <span style={{
          position: 'absolute', top: 8, left: 10,
          fontSize: 11, fontWeight: 700, color: '#fff',
          background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px',
          pointerEvents: 'none',
        }}>{beforeLabel}</span>
        <span style={{
          position: 'absolute', top: 8, right: 10,
          fontSize: 11, fontWeight: 700, color: '#fff',
          background: 'rgba(236,72,153,0.7)', borderRadius: 6, padding: '3px 8px',
          pointerEvents: 'none',
        }}>{afterLabel}</span>
      </div>
    </div>
  )
}
