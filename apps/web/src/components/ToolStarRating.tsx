'use client'

/**
 * ToolStarRating.tsx
 * Rule F-1 — Star rating widget with AggregateRating schema.
 * Ratings stored in localStorage. No fabricated seed data per policy.
 */

import { useState, useEffect } from 'react'
import { JsonLd } from '@/components/JsonLd'

interface ToolStarRatingProps {
  toolName: string
  toolSlug: string
  toolUrl?: string
}

export function ToolStarRating({ toolName, toolSlug, toolUrl }: ToolStarRatingProps) {
  const storageKey = `rt-rating-${toolSlug}`
  const countKey = `rt-rating-count-${toolSlug}`

  const [userRating, setUserRating] = useState<number>(0)
  const [hovered, setHovered] = useState<number>(0)
  const [submitted, setSubmitted] = useState(false)
  const [ratingCount, setRatingCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = parseInt(localStorage.getItem(storageKey) || '0', 10)
    const count = parseInt(localStorage.getItem(countKey) || '0', 10)
    if (stored > 0) {
      setUserRating(stored)
      setSubmitted(true)
    }
    if (count > 0) {
      setRatingCount(count)
      // avg is stored as integer * 10 to avoid float storage issues
      const storedAvg = parseFloat(localStorage.getItem(`rt-rating-avg-${toolSlug}`) || '0')
      setAvgRating(storedAvg)
    }
  }, [storageKey, countKey, toolSlug])

  const handleRate = (star: number) => {
    if (submitted) return
    const prevCount = parseInt(localStorage.getItem(countKey) || '0', 10)
    const prevAvg = parseFloat(localStorage.getItem(`rt-rating-avg-${toolSlug}`) || '0')
    const newCount = prevCount + 1
    const newAvg = prevCount === 0 ? star : ((prevAvg * prevCount) + star) / newCount
    const rounded = Math.round(newAvg * 10) / 10

    localStorage.setItem(storageKey, String(star))
    localStorage.setItem(countKey, String(newCount))
    localStorage.setItem(`rt-rating-avg-${toolSlug}`, String(rounded))

    setUserRating(star)
    setRatingCount(newCount)
    setAvgRating(rounded)
    setSubmitted(true)
  }

  if (!mounted) return null

  const displayRating = avgRating || 0
  const aggregateSchema = ratingCount > 0
    ? [{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: toolName,
        url: toolUrl,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: displayRating.toFixed(1),
          reviewCount: ratingCount,
          bestRating: '5',
          worstRating: '1',
        },
      }]
    : []

  return (
    <>
      {aggregateSchema.length > 0 && <JsonLd data={aggregateSchema} />}
      <section
        aria-labelledby="rating-heading"
        style={{
          margin: '32px 0',
          padding: '22px 26px',
          background: 'var(--bg-2)',
          borderRadius: 14,
          border: '1px solid var(--line)',
          textAlign: 'center',
        }}
      >
        <h2
          id="rating-heading"
          style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', marginBottom: 4, marginTop: 0 }}
        >
          {submitted ? 'Thanks for rating!' : `Rate ${toolName}`}
        </h2>

        {ratingCount > 0 && (
          <p style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, marginTop: 0 }}>
            {displayRating.toFixed(1)} / 5 based on {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
          </p>
        )}

        <div
          role="group"
          aria-label={`Rate ${toolName} out of 5 stars`}
          style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6 }}
        >
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              aria-pressed={userRating === star}
              disabled={submitted}
              onClick={() => handleRate(star)}
              onMouseEnter={() => !submitted && setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                background: 'none',
                border: 'none',
                cursor: submitted ? 'default' : 'pointer',
                padding: '2px 4px',
                fontSize: 28,
                color: star <= (hovered || userRating) ? '#f59e0b' : 'var(--fg-mute)',
                transition: 'color 0.15s, transform 0.1s',
                transform: !submitted && hovered >= star ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              ★
            </button>
          ))}
        </div>

        {!submitted && (
          <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: 0 }}>
            Click to rate — your rating is saved locally
          </p>
        )}
        {submitted && (
          <p style={{ fontSize: 12, color: '#10b981', margin: 0 }}>
            You rated {userRating} / 5 stars
          </p>
        )}
      </section>
    </>
  )
}
