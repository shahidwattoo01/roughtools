'use client'

import { useState, useEffect } from 'react'

/**
 * Returns { scrolled, scrolledFar }
 * scrolled    → true after 80px  (triggers header shrink + border)
 * scrolledFar → true after 300px (optional hide-on-scroll use)
 */
export function useScrolled(threshold = 80) {
  const [scrolled,    setScrolled]    = useState(false)
  const [scrolledFar, setScrolledFar] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > threshold)
      setScrolledFar(y > 300)
    }

    // Passive listener for performance
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // run once on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { scrolled, scrolledFar }
}
