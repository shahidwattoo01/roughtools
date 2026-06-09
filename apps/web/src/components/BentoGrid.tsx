/**
 * BentoGrid — asymmetric editorial card layout (Steps 5a + 5b)
 * Row 1: large featured card (2-col) + 2 normal cards
 * Row 2: 4 equal category cards
 * Row 3: wide stats card
 * Spec: clean white cards, generous padding (32px), subtle borders, micro-interactions
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Data ────────────────────────────────────────────────────
const FEATURED = {
  name: 'PDF Compress',
  description: 'Shrink any PDF to a fraction of its size — client-side, nothing uploaded.',
  href: '/tools/pdf/compress-pdf',
  category: 'PDF',
  color: '#ff3d62',
  stat: '26 PDF tools available',
}

const ROW1_CARDS = [
  {
    name: 'Background Remover',
    description: 'Remove image backgrounds instantly with AI.',
    href: '/tools/image-tools/background-remover',
    category: 'Image',
    color: '#ec4899',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>
      </svg>
    ),
  },
  {
    name: 'JSON Formatter',
    description: 'Beautify, validate and minify JSON in one click.',
    href: '/tools/developer/json-formatter',
    category: 'Developer',
    color: '#64748b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>
      </svg>
    ),
  },
]

const ROW2_CATEGORIES = [
  { name: 'Medical & Health', count: 113, href: '/tools/medical',     color: '#14b8a6',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 14c1.5-1.4 3-3.4 3-5.5A5.5 5.5 0 0016.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 002 8.5c0 2 1.5 4 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.7-1 2 4 1.8-2.5 1 1H21"/></svg> },
  { name: 'Engineering',      count: 126, href: '/tools/engineering', color: '#3b82f6',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { name: 'Security',         count: 8,   href: '/tools/security',   color: '#10b981',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg> },
  { name: 'Image Tools',      count: 38,  href: '/tools/image-tools',color: '#ec4899',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg> },
]

// ─── Shared card base ─────────────────────────────────────────
const cardBase = cn(
  'rounded-2xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]',
  'bg-white dark:bg-[#1A1A1A]',
  'p-8',
  'transition-all duration-200',
  'hover:border-[rgba(0,0,0,0.18)] dark:hover:border-[rgba(255,255,255,0.16)]',
  'hover:-translate-y-[2px]',
  'active:scale-[0.99]',
)

// ─── Component ────────────────────────────────────────────────
export function BentoGrid() {
  return (
    <section className="section bg-0">
      <div className="wrap">
        {/* Section header */}
        <div className="section-head reveal">
          <div className="section-head-row">
            <div>
              <span className="eyebrow">Highlights</span>
              <h2>Most <span className="italic">useful</span><br />right now</h2>
            </div>
            <div className="section-head-side">
              <p>A selection of the tools real users opened today across every category.</p>
            </div>
          </div>
        </div>

        {/* ── Row 1: featured (2-col) + 2 cards ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 reveal reveal-delay-1">

          {/* Featured card — 2-col wide */}
          <Link
            href={FEATURED.href}
            className={cn(cardBase, 'md:col-span-2 flex flex-col justify-between cursor-pointer group min-h-[220px]')}
          >
            {/* Top */}
            <div>
              <span
                className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full mb-4"
                style={{ background: `${FEATURED.color}14`, color: FEATURED.color }}
              >
                {FEATURED.category}
              </span>
              <h3 className="text-[22px] font-semibold text-[var(--fg)] leading-tight group-hover:text-[var(--brand)] transition-colors duration-150">
                {FEATURED.name}
              </h3>
              <p className="text-[14px] text-[var(--fg-2)] mt-2 leading-relaxed">
                {FEATURED.description}
              </p>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-[12px] text-[var(--fg-3)]">{FEATURED.stat}</span>
              <span
                className="inline-flex items-center gap-1.5 text-[13px] font-medium group-hover:gap-2.5 transition-all duration-150"
                style={{ color: FEATURED.color }}
              >
                Open tool
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                  strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </span>
            </div>
          </Link>

          {/* 2 regular cards */}
          {ROW1_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={cn(cardBase, 'flex flex-col justify-between cursor-pointer group min-h-[220px]')}
            >
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${card.color}14`, color: card.color }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--fg)] group-hover:text-[var(--brand)] transition-colors duration-150">
                  {card.name}
                </h3>
                <p className="text-[13px] text-[var(--fg-2)] mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <span
                className="text-[12px] font-medium mt-4 inline-flex items-center gap-1"
                style={{ color: card.color }}
              >
                {card.category}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Row 2: 4 equal category cards ─────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 reveal reveal-delay-2">
          {ROW2_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={cn(cardBase, 'cursor-pointer group')}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${cat.color}14`, color: cat.color }}
                aria-hidden="true"
              >
                {cat.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--fg)] group-hover:text-[var(--brand)] transition-colors duration-150 leading-tight">
                {cat.name}
              </h3>
              <p className="text-[12px] text-[var(--fg-3)] mt-1">{cat.count} tools</p>
            </Link>
          ))}
        </div>

        {/* ── Row 3: wide stats card ─────────────────────────── */}
        <div className={cn(cardBase, 'mt-4 reveal reveal-delay-2 flex flex-wrap items-center justify-between gap-6')}>
          <div>
            <p className="text-[28px] font-bold text-[var(--fg)] tracking-tight">
              2,000,000+{' '}
              <span className="text-[var(--brand)]">tool uses</span> this month
            </p>
            <p className="text-[14px] text-[var(--fg-2)] mt-1">
              Real people solving real problems — no account, no limit.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium
                       bg-[var(--brand)] text-white hover:opacity-90 transition-opacity duration-150
                       flex-shrink-0"
          >
            Browse all tools
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
