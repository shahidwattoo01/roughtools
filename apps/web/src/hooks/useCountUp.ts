'use client'

import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  target: number
  duration?: number   // ms, default 1500
  start?: number      // default 0
  easing?: (t: number) => number
}

/**
 * Counts up from `start` to `target` over `duration`ms
 * using IntersectionObserver — only triggers when element enters viewport.
 * Returns [count, ref] — attach ref to the element to observe.
 */
export function useCountUp({
  target,
  duration = 1500,
  start = 0,
  easing = easeOut,
}: UseCountUpOptions) {
  const [count, setCount]   = useState(start)
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  // Trigger on viewport entry
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Animate once active
  useEffect(() => {
    if (!active) return
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target)
      return
    }

    let startTime: number | null = null
    const range = target - start

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(start + range * easing(progress)))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [active, target, start, duration, easing])

  return { count, ref }
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}
