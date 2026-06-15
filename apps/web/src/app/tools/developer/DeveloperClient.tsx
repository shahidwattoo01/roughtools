'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const PALETTE: Record<string, { cardActive: string; border: string; borderActive: string; icon: string; badge: string }> = {
  amber:  { cardActive: 'bg-amber-500',  border: 'border-amber-200',  borderActive: 'border-amber-500',  icon: 'bg-amber-100 text-amber-600',  badge: 'bg-amber-500'  },
  blue:   { cardActive: 'bg-blue-600',   border: 'border-blue-200',   borderActive: 'border-blue-600',   icon: 'bg-blue-100 text-blue-600',   badge: 'bg-blue-600'   },
  green:  { cardActive: 'bg-green-600',  border: 'border-green-200',  borderActive: 'border-green-600',  icon: 'bg-green-100 text-green-600',  badge: 'bg-green-600'  },
  purple: { cardActive: 'bg-purple-600', border: 'border-purple-200', borderActive: 'border-purple-600', icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-600' },
}

const DEV_TOOLS: Record<string, { title: string; description: string; badge?: string; searches: string; cpc: string }> = {
  'json-formatter':      { title: 'JSON Formatter',           badge: 'Most Used', searches: '2.4M/mo', cpc: '$1.80', description: 'Format, validate, minify, and beautify JSON. Syntax highlighting with instant error detection.' },
  'js-beautifier':       { title: 'JavaScript Beautifier',                        searches: '820K/mo',  cpc: '$1.40', description: 'Beautify and format JS code. Supports ES6+, JSX, and TypeScript syntax.' },
  'css-minifier':        { title: 'CSS Minifier',                                 searches: '540K/mo',  cpc: '$1.20', description: 'Minify CSS files to reduce size. Strips whitespace, comments, and redundant rules.' },
  'sql-formatter':       { title: 'SQL Formatter',                                searches: '1.1M/mo',  cpc: '$2.20', description: 'Format SQL queries for MySQL, PostgreSQL, and SQLite with keyword highlighting.' },
  'xml-formatter':       { title: 'XML Formatter',                                searches: '680K/mo',  cpc: '$1.60', description: 'Format, validate, and prettify XML with collapsible tree view and syntax highlighting.' },
  'yaml-validator':      { title: 'YAML Validator',                               searches: '420K/mo',  cpc: '$1.80', description: 'Validate and format YAML files. Instantly convert YAML ↔ JSON with error reporting.' },
  'markdown-editor':     { title: 'Markdown Editor',                              searches: '980K/mo',  cpc: '$1.50', description: 'Live-preview Markdown editor with syntax highlighting and one-click HTML export.' },
  'base64-encoder':      { title: 'Base64 Encoder / Decoder', badge: 'Popular',  searches: '1.8M/mo',  cpc: '$1.10', description: 'Encode and decode Base64 strings. Supports plain text and file encoding in one click.' },
  'url-encoder':         { title: 'URL Encoder / Decoder',                        searches: '1.2M/mo',  cpc: '$0.90', description: 'Percent-encode and decode URLs. Safely escape special characters for use in query strings.' },
  'html-encoder':        { title: 'HTML Encoder / Decoder',                       searches: '580K/mo',  cpc: '$1.00', description: 'Encode and decode HTML entities. Escape < > & " and all Unicode characters.' },
  'jwt-decoder':         { title: 'JWT Decoder',              badge: 'Popular',  searches: '1.4M/mo',  cpc: '$2.40', description: 'Decode and inspect JWT tokens. View header, payload, expiry, and signature parts.' },
  'uuid-generator':      { title: 'UUID Generator',                               searches: '1.6M/mo',  cpc: '$0.80', description: 'Generate UUID v1 and v4 identifiers. Bulk-generate up to 1,000 UUIDs at once.' },
  'hash-generator':      { title: 'Hash Generator',                               searches: '720K/mo',  cpc: '$1.30', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or uploaded files.' },
  'regex-tester':        { title: 'Regex Tester',             badge: 'Popular',  searches: '2.1M/mo',  cpc: '$1.60', description: 'Test regular expressions with live match highlighting and named capture group inspection.' },
  'diff-checker':        { title: 'Diff Checker',                                 searches: '1.3M/mo',  cpc: '$1.20', description: 'Compare two text blocks side-by-side with highlighted line and character-level differences.' },
  'timestamp-converter': { title: 'Unix Timestamp Converter',                     searches: '880K/mo',  cpc: '$0.70', description: 'Convert Unix timestamps to readable dates and back. Supports milliseconds and multiple timezones.' },
  'cron-parser':         { title: 'Cron Expression Parser',                       searches: '640K/mo',  cpc: '$1.40', description: 'Parse and validate cron expressions. Preview the next 10 scheduled execution times.' },
  'chmod-calculator':    { title: 'Chmod Calculator',                             searches: '480K/mo',  cpc: '$0.60', description: 'Build Unix file permission strings visually. Shows octal, symbolic, and human-readable output.' },
  'color-picker':        { title: 'Color Picker',                                 searches: '1.9M/mo',  cpc: '$0.90', description: 'Pick colors in HEX, RGB, HSL, and HSV. Generate tints, shades, and full color palettes.' },
}

const DEV_SUBCATEGORIES = [
  {
    id: 'formatters',
    label: 'Code Formatters',
    icon: '🎨',
    color: 'amber',
    description: 'Beautify, minify, and validate code in any language',
    tools: ['json-formatter', 'js-beautifier', 'css-minifier', 'sql-formatter', 'xml-formatter', 'yaml-validator', 'markdown-editor'],
  },
  {
    id: 'encoders',
    label: 'Encoders & Decoders',
    icon: '🔒',
    color: 'blue',
    description: 'Base64, URL encoding, HTML entities, and JWT tokens',
    tools: ['base64-encoder', 'url-encoder', 'html-encoder', 'jwt-decoder'],
  },
  {
    id: 'generators',
    label: 'Generators & Testers',
    icon: '🔧',
    color: 'green',
    description: 'Generate UUIDs, hashes, and test regular expressions',
    tools: ['uuid-generator', 'hash-generator', 'regex-tester'],
  },
  {
    id: 'utilities',
    label: 'Dev Utilities',
    icon: '⚙️',
    color: 'purple',
    description: 'Diff checker, timestamps, cron parser, chmod, and color tools',
    tools: ['diff-checker', 'timestamp-converter', 'cron-parser', 'chmod-calculator', 'color-picker'],
  },
]

const POPULAR = ['json-formatter', 'base64-encoder', 'regex-tester', 'jwt-decoder', 'uuid-generator', 'diff-checker', 'hash-generator', 'url-encoder']
const TRUST = [
  { icon: '⚡', text: 'Instant Results' },
  { icon: '🔒', text: 'Browser-Side Only' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '🚫', text: 'No Login Required' },
  { icon: '🌐', text: 'Works Offline' },
]
const TOTAL = Object.keys(DEV_TOOLS).length

export default function DeveloperClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)
  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }, [])
  const visibleSections = active ? DEV_SUBCATEGORIES.filter(s => s.id === active) : DEV_SUBCATEGORIES

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-amber-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>💻</span><span>{TOTAL} Free Developer Tools — All Browser-Side</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Developer Tools. Fast.<br className="hidden sm:block" /> Free. No Limits.
          </h1>
          <p className="text-lg text-amber-50 max-w-2xl mx-auto mb-8">
            JSON formatter, Base64 encoder, regex tester, JWT decoder, UUID generator, diff checker — all run in your browser. No API key, no account, no data sent to any server.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = DEV_TOOLS[slug]
              if (!tool) return null
              return (
                <Link key={slug} href={`/tools/developer/${slug}`} className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap">
                  {tool.title}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Category Filter ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 dark:text-[#777] uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Choose what you need to do</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => selectCategory(null)}
            className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
              active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ddd] hover:border-gray-400 dark:hover:border-white/25'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100 dark:bg-white/8'}`}>💻</div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Dev Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>{TOTAL} tools</div>
            </div>
          </button>
          {DEV_SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color]
            const isActive = active === sc.id
            return (
              <button
                key={sc.id}
                onClick={() => selectCategory(isActive ? null : sc.id)}
                className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
                  isActive
                    ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5`
                    : `bg-white dark:bg-[#1e1e1e] ${pal.border} dark:border-white/10 text-gray-700 dark:text-[#ddd] hover:${pal.borderActive} dark:hover:border-amber-500`
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-white/20' : `${pal.icon} dark:bg-white/8`}`}>{sc.icon}</div>
                <div>
                  <div className="font-bold text-[14px] leading-tight">{sc.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>{sc.tools.length} tools</div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-[#999]'}`}>{sc.description}</p>
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {active && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-gray-600 dark:text-[#aaa]">Showing <span className="font-semibold text-gray-900 dark:text-white">{DEV_SUBCATEGORIES.find(s => s.id === active)?.label}</span> tools</p>
            <button onClick={() => selectCategory(null)} className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* ── Trust bar ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#161616] border-y border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-[#888]">
          {TRUST.map(b => <span key={b.text} className="flex items-center gap-1.5 font-medium"><span>{b.icon}</span>{b.text}</span>)}
        </div>
      </div>

      {/* ── Tool Sections ────────────────────────────────────── */}
      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20" id="main-content">
        {visibleSections.map(sc => {
          const pal = PALETTE[sc.color]
          return (
            <section key={sc.id} id={sc.id} aria-labelledby={`heading-${sc.id}`} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>{sc.icon}</div>
                <div>
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900 dark:text-white">{sc.label}</h2>
                  <p className="text-sm text-gray-500 dark:text-[#999]">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>{sc.tools.length} tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(slug => {
                  const tool = DEV_TOOLS[slug]
                  if (!tool) return null
                  return (
                    <Link
                      key={slug}
                      href={`/tools/developer/${slug}`}
                      className="group flex flex-col p-5 rounded-2xl border bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {tool.title}
                        </h3>
                        {tool.badge && (
                          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${pal.badge}`}>{tool.badge}</span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-500 dark:text-[#999] leading-relaxed line-clamp-2 flex-1 mb-4">{tool.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* ── SEO Section ──────────────────────────────────── */}
        <section className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/8 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Developer Tools Online</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-[#aaa] leading-relaxed">
            <div>
              <p className="mb-3">Every tool runs 100% in your browser — no data is ever sent to a server. JSON, Base64, regex, UUID, hashes, and more. Bookmark them, use them offline, share them with your team.</p>
              <p>No sign-up, no rate limits, no paywalls. Just the tool and your code.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Why developers choose Roughtools?</h3>
              <ul className="space-y-2">
                {['100% browser-based — zero data sent to any server','No account, no API key, no rate limits','Works offline after first load','Supports modern formats: ES6+, JSX, TypeScript, YAML','Syntax-highlighted output for every formatter','Free forever — no freemium tier'].map(p => (
                  <li key={p} className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
            <p className="text-sm font-semibold text-gray-700 dark:text-[#ccc] mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[{href:'/tools/pdf',label:'📄 PDF Tools'},{href:'/tools/calculators',label:'🧮 Calculators'},{href:'/tools/network',label:'🌐 Network Tools'},{href:'/tools/security',label:'🔒 Security'},{href:'/tools/text',label:'✏️ Text Tools'},{href:'/tools/image-tools',label:'🖼️ Image Tools'}].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-gray-700 dark:text-[#ccc] hover:border-amber-300 dark:hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
