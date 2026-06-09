'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Subcategories ───────────────────────────────────────────── */
const SUBCATEGORIES = [
  {
    id: 'career',
    label: 'Career & Resume',
    icon: '👔',
    color: 'blue',
    description: 'Resumes, cover letters, and reference letters',
    tools: [
      { slug: 'resume-builder',        name: 'Resume Builder',           icon: '📋', description: 'Build a professional resume with 100+ templates. Download as PDF instantly.', badge: 'Most Popular' },
      { slug: 'cover-letter-builder',  name: 'Cover Letter Builder',     icon: '✍️', description: 'AI-powered cover letters tailored to any job description. Free templates.', badge: 'Popular' },
      { slug: 'reference-letter',      name: 'Reference Letter',         icon: '🎓', description: 'Generate professional reference and recommendation letters for any situation.' },
    ],
  },
  {
    id: 'business',
    label: 'Business Documents',
    icon: '💼',
    color: 'indigo',
    description: 'Invoices, proposals, reports, and contracts',
    tools: [
      { slug: 'invoice-generator',     name: 'Invoice Generator',        icon: '🧾', description: 'Create professional invoices with your branding. Download as PDF or print.', badge: 'Popular' },
      { slug: 'proposal-generator',    name: 'Business Proposal',        icon: '📊', description: 'Create winning business proposals with professional templates for any industry.' },
      { slug: 'business-letter',       name: 'Business Letter',          icon: '📮', description: 'Formal business letters for any professional purpose. Multiple formats.' },
      { slug: 'meeting-minutes',       name: 'Meeting Minutes',          icon: '📝', description: 'Structured meeting minutes with action items and follow-up tracking.' },
      { slug: 'expense-report',        name: 'Expense Report',           icon: '💰', description: 'Professional expense reports for employees and freelancers. PDF export.' },
    ],
  },
  {
    id: 'legal',
    label: 'Legal & Compliance',
    icon: '⚖️',
    color: 'purple',
    description: 'Contracts, NDAs, and terms of service',
    tools: [
      { slug: 'contract-creator',      name: 'Contract Creator',         icon: '📜', description: 'Simple service and freelance contracts. Free templates for any engagement.' },
      { slug: 'nda-generator',         name: 'NDA Generator',            icon: '🔏', description: 'Generate non-disclosure agreements in minutes. Mutual and unilateral NDAs.' },
      { slug: 'terms-of-service',      name: 'Terms of Service',         icon: '📑', description: 'Generate terms of service and privacy policy documents for your website.' },
    ],
  },
]

/* ── Color palette ───────────────────────────────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string;
  icon: string; badge: string; text: string; arrow: string;
  toolBg: string; toolBorder: string; toolIconBg: string;
}> = {
  blue:   { card:'bg-blue-50',   cardActive:'bg-blue-600',   border:'border-blue-200',   borderActive:'border-blue-600',   icon:'bg-blue-100 text-blue-600',   badge:'bg-blue-600',   text:'text-blue-600',   arrow:'group-hover:text-blue-600',   toolBg:'bg-blue-50',   toolBorder:'border-blue-200',   toolIconBg:'bg-blue-100'   },
  indigo: { card:'bg-indigo-50', cardActive:'bg-indigo-600', border:'border-indigo-200', borderActive:'border-indigo-600', icon:'bg-indigo-100 text-indigo-600', badge:'bg-indigo-600', text:'text-indigo-600', arrow:'group-hover:text-indigo-600', toolBg:'bg-indigo-50', toolBorder:'border-indigo-200', toolIconBg:'bg-indigo-100' },
  purple: { card:'bg-purple-50', cardActive:'bg-purple-600', border:'border-purple-200', borderActive:'border-purple-600', icon:'bg-purple-100 text-purple-600', badge:'bg-purple-600', text:'text-purple-600', arrow:'group-hover:text-purple-600', toolBg:'bg-purple-50', toolBorder:'border-purple-200', toolIconBg:'bg-purple-100' },
}

const TOTAL = SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)

const TRUST = [
  { icon: '⚡', text: 'Instant Generate' },
  { icon: '📄', text: 'PDF Download' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '✏️', text: 'Fully Editable' },
  { icon: '🚫', text: 'No Signup' },
]

const POPULAR = ['resume-builder', 'invoice-generator', 'cover-letter-builder', 'contract-creator', 'nda-generator', 'proposal-generator', 'expense-report', 'business-letter']

export default function DocumentToolsClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleSections = active
    ? SUBCATEGORIES.filter(s => s.id === active)
    : SUBCATEGORIES

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>📋</span>
            <span>{TOTAL} Free Document Tools — No Signup Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Every Document Tool You Need.<br className="hidden sm:block" /> 100% Free.
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Build resumes, generate invoices, create contracts, draft NDAs, write business letters, and more — professional documents ready in minutes. No account needed, no watermarks, no limits.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = SUBCATEGORIES.flatMap(s => s.tools).find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link
                  key={slug}
                  href={`/tools/document-tools/${slug}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  {tool.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Category Filter Cards ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Choose what you need to do</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* All Tools card */}
          <button
            onClick={() => selectCategory(null)}
            className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
              active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100'}`}>
              📋
            </div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Document Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400'}`}>
                {TOTAL} tools
              </div>
            </div>
          </button>

          {/* Subcategory cards */}
          {SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color] ?? PALETTE.blue
            const isActive = active === sc.id
            return (
              <button
                key={sc.id}
                onClick={() => selectCategory(isActive ? null : sc.id)}
                className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
                  isActive
                    ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5`
                    : `bg-white ${pal.border} text-gray-700 hover:${pal.card} hover:${pal.borderActive}`
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-white/20' : pal.icon}`}>
                  {sc.icon}
                </div>
                <div>
                  <div className="font-bold text-[14px] leading-tight">{sc.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    {sc.tools.length} tools
                  </div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {sc.description}
                </p>
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Active filter label */}
        {active && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">
                {SUBCATEGORIES.find(s => s.id === active)?.label}
              </span> tools
            </p>
            <button
              onClick={() => selectCategory(null)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
          {TRUST.map(b => (
            <span key={b.text} className="flex items-center gap-1.5 font-medium">
              <span>{b.icon}</span>{b.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tool Sections ─────────────────────────────────────── */}
      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20" id="main-content">

        {visibleSections.map(sc => {
          const pal = PALETTE[sc.color] ?? PALETTE.blue
          return (
            <section key={sc.id} id={sc.id} aria-labelledby={`heading-${sc.id}`} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>
                  {sc.icon}
                </div>
                <div>
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900">{sc.label}</h2>
                  <p className="text-sm text-gray-500">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>
                  {sc.tools.length} {sc.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/document-tools/${tool.slug}`}
                    className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${pal.toolBg} ${pal.toolBorder} hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0 ${pal.toolIconBg}`}>
                      {tool.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-gray-900 group-hover:${pal.text} transition-colors leading-snug`}>
                          {tool.name}
                        </h3>
                        {tool.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${pal.badge} flex-shrink-0`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 text-gray-300 ${pal.arrow} transition-colors mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* ── SEO Section ──────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Best Free Document Tools Online</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="mb-3">
                Roughtools offers {TOTAL} professional document creator tools completely free. Whether you need to
                build a polished resume, generate a branded invoice, draft an NDA, or write a business proposal —
                everything works instantly in your browser.
              </p>
              <p>For PDF conversion, merging, compressing, and editing — visit our dedicated <a href="/tools/pdf" className="text-blue-600 underline">PDF Tools</a> page.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Roughtools Document Tools?</h3>
              <ul className="space-y-2">
                {[
                  'No account required — start immediately',
                  `All ${TOTAL} tools completely free with no hidden limits`,
                  'Resume builder with 100+ professional templates',
                  'Business docs: invoices, proposals, letters, expense reports',
                  'Legal documents: contracts, NDAs, and terms of service',
                ].map(point => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/tools/pdf', label: '📄 PDF Tools' },
                { href: '/tools/legal-tools', label: '⚖️ Legal Tools' },
                { href: '/tools/image-tools', label: '🖼️ Image Tools' },
                { href: '/tools/text', label: '✏️ Text Tools' },
                { href: '/tools/calculators', label: '🧮 Calculators' },
                { href: '/tools/business', label: '💼 Business Tools' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
