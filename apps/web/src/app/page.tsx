import type { Metadata } from 'next'
import Link from 'next/link'
import { generateHomeMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'
import { getWebsiteSchema, getOrganizationSchema, getPricingSchema } from '@/lib/structured-data'
import { TOTAL_REAL_TOOLS } from '@/lib/tools-registry'
import { HomeSearchBar } from '@/components/HomeSearchBar'
import { CategoryGrid } from '@/components/CategoryGrid'
import {
  IconStar,
  IconLayoutGrid,
  IconBolt,
} from '@tabler/icons-react'

export const metadata: Metadata = generateHomeMetadata()

const POPULAR_TOOLS = [
  { label: 'Compress PDF',        href: '/tools/pdf/compress-pdf' },
  { label: 'PDF to Word',         href: '/tools/pdf/pdf-to-word' },
  { label: 'Merge PDF',           href: '/tools/pdf/merge-pdf' },
  { label: 'Remove Background',   href: '/tools/image-tools/background-remover' },
  { label: 'QR Code Generator',   href: '/tools/security/qr-code-generator' },
  { label: 'BMI Calculator',      href: '/tools/calculators/bmi-calculator' },
  { label: 'eGFR Calculator',     href: '/tools/medical/egfr-ckd-epi-calculator' },
  { label: "Ohm's Law Calculator",href: '/tools/engineering/ohms-law-calculator' },
  { label: 'JSON Formatter',      href: '/tools/developer/json-formatter' },
  { label: 'Password Generator',  href: '/tools/security/password-generator' },
]

export default function HomePage() {
  const schemas = [getWebsiteSchema(), getOrganizationSchema(), getPricingSchema()]

  return (
    <>
      <JsonLd data={schemas} />

      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen text-[#1a1a1a] dark:text-[#f0f0f0]">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="max-w-[900px] mx-auto px-8 pt-14 pb-10">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#e8f5ee] dark:bg-[#1a6b3c]/20 text-[#1a6b3c] dark:text-[#6fcf97] rounded-full px-3.5 py-1.5 text-[13px] mb-5" suppressHydrationWarning>
            <IconStar size={13} aria-hidden="true" />
            {TOTAL_REAL_TOOLS}+ tools, completely free
          </div>

          {/* H1 */}
          <h1 className="text-[42px] font-medium leading-[1.15] text-[#1a1a1a] dark:text-[#f0f0f0] mb-4 max-w-[580px]">
            Your all-in-one<br />
            <em className="not-italic text-[#1a6b3c] dark:text-[#6fcf97]">online toolbox</em>
          </h1>

          {/* Subheading */}
          <p className="text-base text-[#555] dark:text-[#aaa] max-w-[540px] mb-6 leading-[1.6]">
            Convert, calculate, edit, and transform — everything you need in one place.
            No downloads, no login, just instant results.
          </p>

          {/* Search bar */}
          <HomeSearchBar />

          {/* Buttons */}
          <div className="flex gap-2.5 mt-5 flex-wrap">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <IconLayoutGrid size={15} aria-hidden="true" />
              Browse all tools
            </Link>
            <Link
              href="#popular"
              className="inline-flex items-center gap-2 border border-black/8 dark:border-white/15 text-[#1a1a1a] dark:text-[#f0f0f0] rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <IconBolt size={15} aria-hidden="true" />
              Popular tools
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-8 flex-wrap">
            {[
              { num: `${TOTAL_REAL_TOOLS}+`, label: 'Free tools',        green: false },
              { num: '16',              label: 'Categories',         green: false },
              { num: '0',               label: 'Sign-ups needed',    green: false },
              { num: '100%',            label: 'Free forever',       green: true  },
            ].map(({ num, label, green }) => (
              <div key={label}>
                <div className={`text-[26px] font-medium ${green ? 'text-[#1a6b3c] dark:text-[#6fcf97]' : 'text-[#1a1a1a] dark:text-[#f0f0f0]'}`}>
                  {num}
                </div>
                <div className="text-[13px] text-[#555] dark:text-[#aaa] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ───────────────────────────────────────── */}
        <section className="max-w-[900px] mx-auto px-8 pb-8">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-4">
            Browse by category
          </p>
          <CategoryGrid />
        </section>

        {/* ── POPULAR TOOLS ────────────────────────────────────── */}
        <section id="popular" className="max-w-[900px] mx-auto px-8 pb-12">
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#555] dark:text-[#aaa] mb-4">
            Most popular right now
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POPULAR_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-medium
                           bg-white dark:bg-[#1e1e1e]
                           border border-black/8 dark:border-white/8
                           text-[#374151] dark:text-[#ccc]
                           hover:border-[#1a6b3c] hover:text-[#1a6b3c] dark:hover:text-[#6fcf97]
                           transition-colors"
              >
                <span className="truncate">{tool.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                  strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 opacity-50">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
