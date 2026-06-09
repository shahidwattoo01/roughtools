'use client'

/**
 * ChatbotLoader.tsx
 *
 * Defers mounting the Chatbot widget until after the page is idle.
 *
 * Why this matters:
 *  - AdSense and GA4 scripts compete with chatbot JS on mobile networks.
 *  - Mounting the chatbot immediately adds ~30 kB parse cost at page load.
 *  - By deferring until (a) user interacts OR (b) 5 s idle timeout, we
 *    let ad slots and Core Web Vitals metrics (LCP, FID) land first.
 *
 * Strategy:
 *  1. On desktop: mount after requestIdleCallback (or 3 s fallback)
 *  2. On mobile: mount only after first user scroll/touch/click
 *     (capped at 8 s so it still loads even if user never interacts)
 */

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Chatbot = dynamic(
  () => import('@/components/Chatbot').then(m => ({ default: m.Chatbot })),
  { ssr: false },
)

export default function ChatbotLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) return

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    // Desktop: use requestIdleCallback for zero-impact mounting
    if (!isMobile) {
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(() => setMounted(true), { timeout: 3000 })
        return () => cancelIdleCallback(id)
      } else {
        const t = setTimeout(() => setMounted(true), 2000)
        return () => clearTimeout(t)
      }
    }

    // Mobile: wait for first interaction OR 8 s, whichever comes first
    const mount = () => {
      if (!mounted) setMounted(true)
    }

    const events = ['scroll', 'touchstart', 'click', 'keydown'] as const
    events.forEach(e => window.addEventListener(e, mount, { once: true, passive: true }))

    const fallback = setTimeout(mount, 8000)

    return () => {
      events.forEach(e => window.removeEventListener(e, mount))
      clearTimeout(fallback)
    }
  }, [mounted])

  if (!mounted) return null
  return <Chatbot />
}
