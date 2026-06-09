'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Accent palette (mirrors PDFPageClient) ─────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string
  icon: string; badge: string; text: string; arrow: string
  toolBg: string; toolBorder: string; toolIconBg: string
}> = {
  amber: {
    card: 'bg-amber-50',      cardActive: 'bg-amber-500',
    border: 'border-amber-200', borderActive: 'border-amber-500',
    icon: 'bg-amber-100 text-amber-600',  badge: 'bg-amber-500',
    text: 'text-amber-600',   arrow: 'group-hover:text-amber-600',
    toolBg: 'bg-amber-50',   toolBorder: 'border-amber-200', toolIconBg: 'bg-amber-100',
  },
  blue: {
    card: 'bg-blue-50',       cardActive: 'bg-blue-600',
    border: 'border-blue-200', borderActive: 'border-blue-600',
    icon: 'bg-blue-100 text-blue-600',    badge: 'bg-blue-600',
    text: 'text-blue-600',    arrow: 'group-hover:text-blue-600',
    toolBg: 'bg-blue-50',    toolBorder: 'border-blue-200', toolIconBg: 'bg-blue-100',
  },
  green: {
    card: 'bg-green-50',      cardActive: 'bg-green-600',
    border: 'border-green-200', borderActive: 'border-green-600',
    icon: 'bg-green-100 text-green-600',  badge: 'bg-green-600',
    text: 'text-green-600',   arrow: 'group-hover:text-green-600',
    toolBg: 'bg-green-50',   toolBorder: 'border-green-200', toolIconBg: 'bg-green-100',
  },
  purple: {
    card: 'bg-purple-50',     cardActive: 'bg-purple-600',
    border: 'border-purple-200', borderActive: 'border-purple-600',
    icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-600',
    text: 'text-purple-600',  arrow: 'group-hover:text-purple-600',
    toolBg: 'bg-purple-50',  toolBorder: 'border-purple-200', toolIconBg: 'bg-purple-100',
  },
}

/* ── Tool data ──────────────────────────────────────────────── */
const DEV_TOOLS: Record<string, { title: string; description: string; icon: string; badge?: string }> = {
  'json-formatter':     { title: 'JSON Formatter',           icon: '{ }', badge: 'Most Used', description: 'Format, validate, minify, and beautify JSON. Syntax highlighting with instant error detection.' },
  'js-beautifier':      { title: 'JavaScript Beautifier',    icon: '✨',  description: 'Beautify and format JS code. Supports ES6+, JSX, and TypeScript syntax.' },
  'css-minifier':       { title: 'CSS Minifier',             icon: '🎨',  description: 'Minify CSS files to reduce size. Strips whitespace, comments, and redundant rules.' },
  'sql-formatter':      { title: 'SQL Formatter',            icon: '🗃️', description: 'Format SQL queries for MySQL, PostgreSQL, and SQLite with keyword highlighting.' },
  'xml-formatter':      { title: 'XML Formatter',            icon: '📄',  description: 'Format, validate, and prettify XML with collapsible tree view and syntax highlighting.' },
  'yaml-validator':     { title: 'YAML Validator',           icon: '📋',  description: 'Validate and format YAML files. Instantly convert YAML ↔ JSON with error reporting.' },
  'markdown-editor':    { title: 'Markdown Editor',          icon: '📝',  description: 'Live-preview Markdown editor with syntax highlighting and one-click HTML export.' },
  'base64-encoder':     { title: 'Base64 Encoder / Decoder', icon: '🔤',  badge: 'Popular', description: 'Encode and decode Base64 strings. Supports plain text and file encoding in one click.' },
  'url-encoder':        { title: 'URL Encoder / Decoder',    icon: '🔗',  description: 'Percent-encode and decode URLs. Safely escape special characters for use in query strings.' },
  'html-encoder':       { title: 'HTML Encoder / Decoder',   icon: '🏷️', description: 'Encode and decode HTML entities. Escape < > & " and all Unicode characters.' },
  'jwt-decoder':        { title: 'JWT Decoder',              icon: '🔑',  description: 'Decode and inspect JWT tokens. View header, payload, expiry, and signature parts.' },
  'uuid-generator':     { title: 'UUID Generator',           icon: '🆔',  description: 'Generate UUID v1 and v4 identifiers. Bulk-generate up to 1 000 UUIDs at once.' },
  'hash-generator':     { title: 'Hash Generator',           icon: '#',   description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or uploaded files.' },
  'regex-tester':       { title: 'Regex Tester',             icon: '🔍',  description: 'Test regular expressions with live match highlighting and named capture group inspection.' },
  'diff-checker':       { title: 'Diff Checker',             icon: '🔄',  description: 'Compare two text blocks side-by-side with highlighted line and character-level differences.' },
  'timestamp-converter':{ title: 'Unix Timestamp Converter', icon: '🕐',  description: 'Convert Unix timestamps to readable dates and back. Supports milliseconds and multiple timezones.' },
  'cron-parser':        { title: 'Cron Expression Parser',   icon: '⏰',  description: 'Parse and validate cron expressions. Preview the next 10 scheduled execution times.' },
  'chmod-calculator':   { title: 'Chmod Calculator',         icon: '🔐',  description: 'Build Unix file permission strings visually. Shows octal, symbolic, and human-readable output.' },
  'color-picker':       { title: 'Color Picker',             icon: '🎨',  description: 'Pick colors in HEX, RGB, HSL, and HSV. Generate tints, shades, and full color palettes.' },
}

/* ── Sub-categories ─────────────────────────────────────────── */
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

/* ── Popular quick links ────────────────────────────────────── */
const POPULAR = ['json-formatter', 'base64-encoder', 'regex-tester', 'jwt-decoder', 'uuid-generator', 'diff-checker', 'hash-generator', 'url-encoder']

/* ── Trust badges ───────────────────────────────────────────── */
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
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleSections = active
    ? DEV_SUBCATEGORIES.filter(s => s.id === active)
    : DEV_SUBCATEGORIES

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-amber-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>💻</span>
            <span>{TOTAL} Free Developer Tools — All Browser-Side</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Developer Tools. Fast.<br className="hidden sm:block" /> Free. No Limits.
          </h1>
          <p className="text-lg text-amber-50 max-w-2xl mx-auto mb-8">
            JSON formatter, Base64 encoder, regex tester, JWT decoder, UUID generator, diff checker —
            all run in your browser. No API key, no account, no data sent to any server.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = DEV_TOOLS[slug]
              if (!tool) return null
              return (
                <Link
                  key={slug}
                  href={`/tools/developer/${slug}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  {tool.title}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Category Cards ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Choose what you need to do</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* "All Tools" card */}
          <button
            onClick={() => selectCategory(null)}
            className={`
              relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
              ${active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
              }
            `}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100'}`}>
              💻
            </div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Dev Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400'}`}>
                {TOTAL} tools
              </div>
            </div>
          </button>

          {/* Per-subcategory cards */}
          {DEV_SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color] ?? PALETTE.amber
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
                {DEV_SUBCATEGORIES.find(s => s.id === active)?.label}
              </span> tools
            </p>
            <button
              onClick={() => selectCategory(null)}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
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
          const pal = PALETTE[sc.color] ?? PALETTE.amber
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
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900">
                    {sc.label}
                  </h2>
                  <p className="text-sm text-gray-500">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>
                  {sc.tools.length} {sc.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              {/* Tool grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(slug => {
                  const tool = DEV_TOOLS[slug]
                  if (!tool) return null
                  return (
                    <Link
                      key={slug}
                      href={`/tools/developer/${slug}`}
                      className={`
                        group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200
                        ${pal.toolBg} ${pal.toolBorder}
                        hover:shadow-md hover:-translate-y-0.5
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                      `}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0 overflow-hidden ${pal.toolIconBg}`}>
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-semibold text-gray-900 group-hover:${pal.text} transition-colors leading-snug`}>
                            {tool.title}
                          </h3>
                          {tool.badge && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${pal.badge}`}>
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <svg
                        className={`w-4 h-4 flex-shrink-0 text-gray-300 ${pal.arrow} transition-colors mt-1 group-hover:translate-x-0.5 transition-transform`}
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

        {/* ── Why RoughTools for Developers? ───────────────────── */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10" aria-labelledby="why-devtools">
          <h2 id="why-devtools" className="text-2xl font-bold text-gray-900 mb-6">
            Why Use RoughTools Developer Tools?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '🔒', title: '100% Client-Side',    desc: 'Every tool runs entirely in your browser. Your code, tokens, and credentials are never sent to any server.' },
              { icon: '⚡', title: 'Zero Friction',       desc: 'No account, no API key, no rate limits. Open the tool and start working in under three seconds.' },
              { icon: '🌐', title: 'Works Offline',       desc: 'Once the page is loaded, most tools work without an internet connection — perfect for secure environments.' },
              { icon: '🆓', title: 'Always Free',         desc: 'Every tool is permanently free with no premium tiers, no usage caps, and no hidden charges.' },
            ].map(b => (
              <div key={b.title} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 mb-8 space-y-3">
            <p>
              Every developer has a collection of bookmarked utilities they reach for constantly — a JSON
              formatter, a Base64 encoder, a regex tester. The problem is that most online tools either
              require an account, throttle usage behind a paywall, or send your data to a remote server.
              RoughTools is different: all {TOTAL} developer tools run 100% in your browser using only
              HTML, CSS, and JavaScript. No data leaves your machine.
            </p>
            <p>
              The four categories cover the full breadth of daily developer needs. <strong>Code Formatters</strong> handle
              JSON, JavaScript, CSS, SQL, XML, YAML, and Markdown — beautifying messy code or minifying it
              for production. <strong>Encoders &amp; Decoders</strong> cover Base64, URL percent-encoding,
              HTML entities, and JWT inspection. <strong>Generators &amp; Testers</strong> give you RFC-compliant
              UUIDs, cryptographic hashes, and a live regex sandbox. <strong>Dev Utilities</strong> round out
              the set with diff checking, Unix timestamp conversion, cron expression parsing, chmod calculation,
              and a full-featured color picker.
            </p>
            <p>
              Whether you are debugging an authentication issue at 2 AM, formatting a 10 000-line SQL dump
              before a code review, or just need a quick SHA-256 hash of a string, these tools are built
              to get out of your way and deliver the answer immediately.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              {
                q: 'What developer tools are available on RoughTools?',
                a: `RoughTools offers ${TOTAL} developer tools in four categories: Code Formatters (JSON Formatter, JavaScript Beautifier, CSS Minifier, SQL Formatter, XML Formatter, YAML Validator, Markdown Editor), Encoders & Decoders (Base64, URL, HTML, JWT Decoder), Generators & Testers (UUID Generator, Hash Generator, Regex Tester), and Dev Utilities (Diff Checker, Unix Timestamp Converter, Cron Parser, Chmod Calculator, Color Picker).`,
              },
              {
                q: 'Is my data safe when I use these tools?',
                a: 'Yes. Every tool runs entirely in your browser using client-side JavaScript. Your code, tokens, credentials, and file contents are never sent to any server. There are no network requests for processing.',
              },
              {
                q: 'Do I need an account or API key?',
                a: 'No. All developer tools are freely accessible without any registration, login, or API key. Just open the tool and use it.',
              },
              {
                q: 'Can I use these tools offline?',
                a: 'Once the page has loaded, most tools work without an internet connection since all processing happens in the browser. This makes them suitable for secure or air-gapped environments.',
              },
              {
                q: 'Which browsers are supported?',
                a: 'All tools are tested and work in Chrome, Firefox, Safari, and Edge on desktop and mobile. Any browser supporting ES2020 and the Web Crypto API will work correctly.',
              },
              {
                q: 'Is the JSON Formatter safe for sensitive config files?',
                a: 'Yes. The JSON Formatter runs entirely in your browser. No data is uploaded to any server. It is safe to paste API keys, connection strings, or any sensitive configuration.',
              },
              {
                q: 'Can I decode a JWT token to check its expiry?',
                a: 'Yes. The JWT Decoder splits the token into header, payload, and signature, then displays the decoded JSON. It also shows the expiry time (exp) as a human-readable date.',
              },
              {
                q: 'How does the Hash Generator work?',
                a: 'The Hash Generator uses the browser\'s built-in Web Crypto API to compute MD5, SHA-1, SHA-256, and SHA-512 hashes. You can hash plain text or upload a file directly.',
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
                { href: '/tools/pdf',        label: '📄 PDF Tools' },
                { href: '/tools/text',       label: '✏️ Text Tools' },
                { href: '/tools/security',   label: '🔒 Security Tools' },
                { href: '/tools/network',    label: '🌐 Network Tools' },
                { href: '/tools/converters', label: '🔄 Converters' },
                { href: '/tools/image-tools',label: '🖼️ Image Tools' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href as never}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
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
