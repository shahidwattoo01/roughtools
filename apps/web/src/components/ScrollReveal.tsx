'use client'

import { useEffect } from 'react'

/**
 * Activates .reveal elements when they enter the viewport.
 * Add className="reveal" to any element — it starts hidden
 * (opacity:0, translateY:28px) and fades in on scroll.
 */
export function ScrollReveal() {
  useEffect(() => {
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

    return () => observer.disconnect()
  }, [])

  return null
}
