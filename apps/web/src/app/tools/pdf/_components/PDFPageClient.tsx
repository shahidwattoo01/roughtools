'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { PDF_TOOL_CONFIGS, PDF_SUBCATEGORIES } from './pdf-tool-configs'
import CompressPDFIcon from './CompressPDFIcon'

/* ── Accent palette ─────────────────────────────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string;
  icon: string; badge: string; text: string; arrow: string;
  toolBg: string; toolBorder: string; toolIconBg: string;
}> = {
  red:    {
    card: 'bg-red-50',       cardActive: 'bg-red-600',
    border: 'border-red-200', borderActive: 'border-red-600',
    icon: 'bg-red-100 text-red-600',   badge: 'bg-red-600',
    text: 'text-red-600',    arrow: 'group-hover:text-red-600',
    toolBg: 'bg-red-50',    toolBorder: 'border-red-200', toolIconBg: 'bg-red-100',
  },
  orange: {
    card: 'bg-orange-50',    cardActive: 'bg-orange-500',
    border: 'border-orange-200', borderActive: 'border-orange-500',
    icon: 'bg-orange-100 text-orange-600', badge: 'bg-orange-500',
    text: 'text-orange-600', arrow: 'group-hover:text-orange-600',
    toolBg: 'bg-orange-50', toolBorder: 'border-orange-200', toolIconBg: 'bg-orange-100',
  },
  green:  {
    card: 'bg-green-50',     cardActive: 'bg-green-600',
    border: 'border-green-200', borderActive: 'border-green-600',
    icon: 'bg-green-100 text-green-600', badge: 'bg-green-600',
    text: 'text-green-600',  arrow: 'group-hover:text-green-600',
    toolBg: 'bg-green-50',  toolBorder: 'border-green-200', toolIconBg: 'bg-green-100',
  },
  blue:   {
    card: 'bg-blue-50',      cardActive: 'bg-blue-600',
    border: 'border-blue-200', borderActive: 'border-blue-600',
    icon: 'bg-blue-100 text-blue-600',  badge: 'bg-blue-600',
    text: 'text-blue-600',   arrow: 'group-hover:text-blue-600',
    toolBg: 'bg-blue-50',   toolBorder: 'border-blue-200', toolIconBg: 'bg-blue-100',
  },
  purple: {
    card: 'bg-purple-50',    cardActive: 'bg-purple-600',
    border: 'border-purple-200', borderActive: 'border-purple-600',
    icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-600',
    text: 'text-purple-600', arrow: 'group-hover:text-purple-600',
    toolBg: 'bg-purple-50', toolBorder: 'border-purple-200', toolIconBg: 'bg-purple-100',
  },
  slate:  {
    card: 'bg-slate-50',     cardActive: 'bg-slate-700',
    border: 'border-slate-200', borderActive: 'border-slate-700',
    icon: 'bg-slate-100 text-slate-700', badge: 'bg-slate-700',
    text: 'text-slate-700',  arrow: 'group-hover:text-slate-700',
    toolBg: 'bg-slate-50',  toolBorder: 'border-slate-200', toolIconBg: 'bg-slate-100',
  },
  indigo: {
    card: 'bg-indigo-50',    cardActive: 'bg-indigo-600',
    border: 'border-indigo-200', borderActive: 'border-indigo-600',
    icon: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-600',
    text: 'text-indigo-600', arrow: 'group-hover:text-indigo-600',
    toolBg: 'bg-indigo-50', toolBorder: 'border-indigo-200', toolIconBg: 'bg-indigo-100',
  },
}

/* ── Popular tools (hero quick links) ──────────────────────── */
const POPULAR = ['compress-pdf', 'merge-pdf', 'pdf-to-word', 'word-to-pdf', 'split-pdf', 'jpg-to-pdf', 'protect-pdf', 'ocr-pdf']

/* ── Trust badges ───────────────────────────────────────────── */
const TRUST = [
  { icon: '🔒', text: 'SSL Encrypted' },
  { icon: '🚀', text: 'Fast Processing' },
  { icon: '🗑️', text: 'Auto-deleted in 1h' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '📱', text: 'Mobile Friendly' },
]

export default function PDFPageClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    // Small timeout lets React re-render the filtered sections first, then scroll
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleSections = active
    ? PDF_SUBCATEGORIES.filter(s => s.id === active)
    : PDF_SUBCATEGORIES

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-red-600 to-red-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>📄</span>
            <span>31 Free PDF Tools — No Signup Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Every PDF Tool You Need.<br className="hidden sm:block" /> 100% Free.
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto mb-8">
            Convert, compress, merge, split, edit, protect, sign and repair PDFs — all in one place.
            No watermarks. No daily limits. Files deleted automatically after processing.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const cfg = PDF_TOOL_CONFIGS[slug]
              if (!cfg) return null
              return (
                <Link
                  key={slug}
                  href={`/tools/pdf/${slug}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  {cfg.title}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Category Cards ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 dark:text-[#777] uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Choose what you need to do</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* "All Tools" card */}
          <button
            onClick={() => selectCategory(null)}
            className={`
              relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
              ${active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ddd] hover:border-gray-400 dark:hover:border-white/25'
              }
            `}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100 dark:bg-white/8'}`}>
              📄
            </div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All PDF Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>
                31 tools
              </div>
            </div>
          </button>

          {/* Per-subcategory cards */}
          {PDF_SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color] ?? PALETTE.red
            const isActive = active === sc.id
            return (
              <button
                key={sc.id}
                onClick={() => selectCategory(isActive ? null : sc.id)}
                className={`
                  relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
                  ${isActive
                    ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5`
                    : `bg-white ${pal.border} text-gray-700 hover:${pal.card} hover:${pal.borderActive}`
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-white/20' : pal.icon}`}>
                  {sc.icon}
                </div>
                <div>
                  <div className="font-bold text-[14px] leading-tight">{sc.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>
                    {sc.tools.length} tools
                  </div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-[#999]'}`}>
                  {sc.description}
                </p>

                {/* Active checkmark */}
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
            <p className="text-sm text-gray-600 dark:text-[#aaa]">
              Showing <span className="font-semibold text-gray-900 dark:text-white">
                {PDF_SUBCATEGORIES.find(s => s.id === active)?.label}
              </span> tools
            </p>
            <button
              onClick={() => selectCategory(null)}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
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
      <div className="bg-white dark:bg-[#161616] border-y border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-[#888]">
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
          const pal = PALETTE[sc.color] ?? PALETTE.red
          return (
            <section
              key={sc.id}
              id={sc.id}
              aria-labelledby={`heading-${sc.id}`}
              className="scroll-mt-8"
            >
              {/* Section header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>
                  {sc.icon}
                </div>
                <div>
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900 dark:text-white">
                    {sc.label}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-[#999]">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>
                  {sc.tools.length} {sc.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              {/* Tool grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(slug => {
                  const cfg = PDF_TOOL_CONFIGS[slug]
                  if (!cfg) return null
                  return (
                    <Link
                      key={slug}
                      href={`/tools/pdf/${slug}`}
                      className={`
                        group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200
                        ${pal.toolBg} ${pal.toolBorder} dark:bg-[#1e1e1e] dark:border-white/10
                        hover:shadow-md hover:-translate-y-0.5
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                      `}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0 ${slug === 'compress-pdf' ? 'bg-transparent overflow-visible' : `overflow-hidden ${pal.toolIconBg}`}`}>
                        {slug === 'compress-pdf'
                          ? <CompressPDFIcon scale={0.1538} />
                          : sc.icon
                        }
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:${pal.text} transition-colors leading-snug`}>
                          {cfg.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-[#999] mt-0.5 leading-relaxed line-clamp-2">
                          {cfg.description}
                        </p>
                      </div>
                      <svg
                        className={`w-4 h-4 flex-shrink-0 text-gray-300 dark:text-[#666] ${pal.arrow} transition-colors mt-1 group-hover:translate-x-0.5 transition-transform`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* ── Why RoughTools for PDF? ───────────────────────── */}
        <section className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/8 p-8 sm:p-10" aria-labelledby="why-roughtools">
          <h2 id="why-roughtools" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why Use RoughTools for PDF?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '🆓', title: '100% Free', desc: 'Every tool is free with no hidden fees, no subscription tiers, and no usage caps. Process as many files as you need.' },
              { icon: '⚡', title: 'No Signup', desc: 'Go straight to the tool and start working. No account creation, no email verification, no waiting.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'All transfers use HTTPS encryption. Your files are automatically deleted from our servers within one hour of processing.' },
              { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive and tested on Chrome, Firefox, Safari, and Edge on desktop, tablet, and mobile.' },
            ].map(b => (
              <div key={b.title} className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/8">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-gray-600 dark:text-[#aaa] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Intro text */}
          <div className="prose prose-sm max-w-none text-gray-600 dark:text-[#aaa] mb-8 space-y-3">
            <p>
              PDF is the universal document format — used for contracts, invoices, reports, academic papers, and
              everything in between. But working with PDFs has traditionally required expensive desktop software
              or clunky online tools riddled with upsells. RoughTools changes that by offering 31 professional-grade
              PDF tools that are completely free, permanently free, with no account required and no watermarks on
              your output files.
            </p>
            <p>
              Whether you need to compress a 50 MB PDF to fit an email attachment limit, split a combined invoice
              batch into individual files, convert a scanned receipt into a searchable document using OCR, or
              digitally sign a contract without printing a single sheet of paper — every task has its own
              dedicated tool here, built to do exactly that job and nothing more. No bloated feature lists, no
              confusing menus. Just upload, configure, and download.
            </p>
            <p>
              Every tool in this collection is designed with privacy as a first principle. Your documents are
              processed on isolated servers and deleted automatically within one hour. We do not read the content
              of your files, we do not sell data, and we do not require you to create an account that stores your
              upload history. What happens to your documents stays between you and the tool.
            </p>
          </div>

          {/* Category FAQ */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              {
                q: 'What PDF tools are available on RoughTools?',
                a: 'RoughTools offers 31 PDF tools across seven categories: Convert FROM PDF (PDF to Word, Excel, PowerPoint, JPG, PNG, Text, EPUB, PDF/A), Convert TO PDF (Word, Excel, PowerPoint, JPG, PNG, HTML), Compress PDF, Merge & Split (merge, split, extract pages, remove pages, organise), Edit PDF (rotate, crop, watermark, page numbers, redact, flatten), Security (protect, unlock, sign), and Advanced (OCR, repair, compare).',
              },
              {
                q: 'Are all PDF tools really free?',
                a: 'Yes. All 31 tools are completely free with no daily limits, no premium tiers, and no hidden fees. No credit card is required and you never need to create an account.',
              },
              {
                q: 'Is there a file size limit?',
                a: 'Each tool accepts PDF files up to 50 MB. If your file is larger, consider compressing it first or splitting it into smaller sections before processing.',
              },
              {
                q: 'Are my files safe and private?',
                a: 'Yes. All file transfers use HTTPS encryption. Your uploaded files and any output files are automatically deleted from our servers within one hour of processing. We do not read, analyse, or share the content of your documents.',
              },
              {
                q: 'Do I need to create an account?',
                a: 'No account is required for any tool. Navigate directly to the tool you need, upload your file, and download the result. There is no registration process.',
              },
              {
                q: 'What browsers are supported?',
                a: 'All tools work in Chrome, Firefox, Safari, and Edge on desktop. Mobile versions of these browsers on iOS and Android are also fully supported.',
              },
              {
                q: 'Can I use these tools on my phone or tablet?',
                a: 'Yes. All 31 tools are fully responsive and optimised for touch interfaces. You can upload files directly from your phone\'s storage, camera roll, or cloud storage apps.',
              },
              {
                q: 'How long does PDF processing take?',
                a: 'Most operations complete in 5–30 seconds depending on the tool and file size. OCR processing of multi-page scanned documents may take up to 60 seconds. Conversion tools for large files typically take 15–45 seconds.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 list-none text-sm">
                  {faq.q}
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-200 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/tools/calculators', label: '🧮 Calculators' },
                { href: '/tools/image-tools', label: '🖼️ Image Tools' },
                { href: '/tools/developer', label: '💻 Developer Tools' },
                { href: '/tools/text', label: '✏️ Text Tools' },
                { href: '/tools/legal-tools', label: '⚖️ Legal Tools' },
                { href: '/tools/converters', label: '🔄 Converters' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href as never}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-red-300 hover:text-red-700 transition-colors"
                >
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
