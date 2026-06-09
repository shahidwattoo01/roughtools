'use client'
// apps/web/src/components/ui/CustomCursor.tsx

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ mx: 0, my: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    const onMouseMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      cursor.style.left = e.clientX - 6 + 'px'
      cursor.style.top = e.clientY - 6 + 'px'
    }

    const animate = () => {
      pos.current.tx += (pos.current.mx - pos.current.tx) * 0.14
      pos.current.ty += (pos.current.my - pos.current.ty) * 0.14
      trail.style.left = pos.current.tx - 20 + 'px'
      trail.style.top = pos.current.ty - 20 + 'px'
      requestAnimationFrame(animate)
    }

    const interactiveEls = document.querySelectorAll(
      'a, button, .tool-card, .calc-card, .cat-card, .fpill, .hv-tool, .kw-card, .phase-card, .sidebar-item'
    )
    const onEnter = () => {
      trail.style.width = '56px'
      trail.style.height = '56px'
      trail.style.borderColor = 'rgba(108,99,255,0.7)'
    }
    const onLeave = () => {
      trail.style.width = '40px'
      trail.style.height = '40px'
      trail.style.borderColor = 'rgba(108,99,255,0.4)'
    }

    document.addEventListener('mousemove', onMouseMove)
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    const raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', width: 12, height: 12,
          background: 'var(--accent)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9999,
          transition: 'transform 0.1s, background 0.2s',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={trailRef}
        style={{
          position: 'fixed', width: 40, height: 40,
          border: '1.5px solid rgba(108,99,255,0.4)',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 9998,
          transition: 'all 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />
    </>
  )
}