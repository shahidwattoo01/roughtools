'use client'

/**
 * RelatedTools.tsx
 *
 * Displays a grid of related tools on every tool page.
 * Matches the dark design system (CSS custom properties from globals.css).
 *
 * Optional: pass relatedPosts to add a "From the blog" link strip below
 * the tool grid for internal linking to relevant articles.
 */

import Link from 'next/link'
import type { Tool, ToolCategory } from '@/lib/tools-registry'

// ─── Category accent colours (dark theme) ────────────────────────────────────

const CAT_COLOR: Record<ToolCategory, string> = {
  pdf:              '#ff3d62',
  calculators:      '#5b6cff',
  medical:          '#14b8a6',
  engineering:      '#3b82f6',
  'image-tools':    '#ec4899',
  developer:        '#8b5cf6',
  'document-tools': '#6366f1',
  text:             '#f59e0b',
  converters:       '#14b8a6',
  network:          '#06b6d4',
  security:         '#10b981',
  'legal-tools':    '#facc15',
  'real-estate':    '#f97316',
  business:         '#a855f7',
  environment:      '#84cc16',
  'iq-test':        '#a21caf',
}

// ─── Tiny SVG icons ───────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const ExternalLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RelatedPost {
  title: string
  href: string
}

interface RelatedToolsProps {
  tools: Tool[]
  currentToolName?: string
  /** Optional blog posts related to this tool — adds a "From the blog" strip */
  relatedPosts?: RelatedPost[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RelatedTools({ tools, currentToolName, relatedPosts }: RelatedToolsProps) {
  if (!tools.length && (!relatedPosts || !relatedPosts.length)) return null

  return (
    <section
      style={{
        marginTop: 48,
        paddingTop: 40,
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
      aria-label="Related tools and resources"
    >
      {/* ── Section header ── */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e4e8ff', margin: '0 0 6px' }}>
          Related Tools
        </h2>
        {currentToolName && (
          <p style={{ fontSize: 13, color: '#666a8a', margin: 0 }}>
            More tools you might find useful alongside {currentToolName}
          </p>
        )}
      </div>

      {/* ── Tool grid ── */}
      {tools.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: relatedPosts?.length ? 32 : 0,
        }}>
          {tools.map(tool => {
            const color = CAT_COLOR[tool.category] ?? '#7c8bff'
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.category}/${tool.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    transition: 'border-color 0.18s, background 0.18s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = `${color}44`
                    el.style.background = `${color}0d`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(255,255,255,0.07)'
                    el.style.background = 'rgba(255,255,255,0.025)'
                  }}
                >
                  {/* Colour dot */}
                  <span style={{
                    flexShrink: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    marginTop: 5,
                    boxShadow: `0 0 6px ${color}66`,
                  }} aria-hidden="true" />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: '0 0 3px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#c4caff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {tool.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: 12,
                      color: '#666a8a',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {tool.description}
                    </p>
                  </div>

                  <span style={{ color: '#555878', flexShrink: 0, marginTop: 4 }}>
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── From the blog strip ── */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#7c8bff', margin: '0 0 12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            From the Blog
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {relatedPosts.map((post, i) => (
              <Link
                key={i}
                href={post.href}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'rgba(124,139,255,0.04)',
                  border: '1px solid rgba(124,139,255,0.12)',
                  borderRadius: 10,
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(124,139,255,0.09)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(124,139,255,0.04)'
                  }}
                >
                  <span style={{ fontSize: 13, color: '#a5b0ff', fontWeight: 600 }}>
                    {post.title}
                  </span>
                  <span style={{ color: '#555878', flexShrink: 0 }}>
                    <ExternalLink />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
