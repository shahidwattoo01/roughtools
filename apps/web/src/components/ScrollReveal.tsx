'use client'

import { useEffect } from 'react'

/**
 * Activates .reveal elements when they enter the viewport.
 * Add className="reveal" to any element — it starts hidden
 * (opacity:0, translateY:28px) and fades in on scroll.
 */
export function ScrollReveal() {
  useEffect(() => {
    // ⚡ PERF: defer the DOM query until after the first paint so it
    // doesn't block the main thread on pages with no .reveal elements.
    const raf = requestAnimationFrame(() => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal')
      if (!elements.length) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      )

      elements.forEach(el => observer.observe(el))
      // Cleanup is handled by cancelAnimationFrame; observer cleans itself
      // up once all elements have been revealed.
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}
