'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { CALC_SUBCATEGORIES, CALC_TOOL_CONFIGS, TOTAL_CALC_COUNT } from './calculator-tool-configs'

/* ── Category FAQ ───────────────────────────────────────────── */
const CATEGORY_FAQS = [
  { q: 'Are all calculators completely free?', a: 'Yes, 100% free. Every calculator on RoughTools is free to use with no limits, no subscription, and no signup required. The site is supported by advertising — the calculators themselves cost you nothing.' },
  { q: 'Is my data private when I use these calculators?', a: 'Completely private. All calculations run in your browser using JavaScript. No data you enter — financial figures, health measurements, personal details — is transmitted to any server, stored in any database, or shared with anyone. When you close the tab, your inputs are gone.' },
  { q: 'How accurate are the results?', a: 'Results are mathematically accurate based on the standard formulas for each calculator type. Accuracy depends on the quality of your inputs. For finance and health calculators, results are estimates based on the assumptions stated on each page — always read the disclaimer and consult a professional before making important decisions.' },
  { q: 'Should I rely on these calculators for major financial decisions?', a: 'Use them as a starting point for informed conversations with professionals — not as a substitute for professional advice. For major decisions like taking out a mortgage, changing investments, or making retirement plans, always consult a qualified financial advisor. Our calculators clearly state their limitations and assumptions.' },
  { q: 'Do the calculators work on mobile phones?', a: 'Yes, every calculator is fully responsive and optimised for mobile. They work on iPhone, Android, and any modern smartphone or tablet. No app installation required — just open the page in your mobile browser and start calculating.' },
  { q: 'Do I need to create an account?', a: 'No. There are no accounts, no logins, no email addresses required. Every calculator on RoughTools is open to everyone immediately, no registration needed.' },
  { q: 'What browsers are supported?', a: 'All modern browsers: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Opera. Chrome and Firefox provide the best experience. Internet Explorer is not supported. The calculators also work on mobile browsers: iOS Safari and Chrome for Android.' },
  { q: 'Can I save my calculation results?', a: 'Yes. Use the "Export PDF Report" button on any calculator to download a formatted PDF of your inputs and results. You can also use your browser\'s built-in print function (Ctrl+P or Cmd+P, then "Save as PDF") to capture any page. The star rating saves to your browser\'s local storage.' },
  { q: 'Are the formulas used by these calculators standard?', a: 'Yes. We use industry-standard formulas for all calculations: the standard amortization formula for loans and mortgages, the compound interest formula for savings and investments, the Mifflin-St Jeor equation for calorie calculations, the WHO BMI formula, and Naegele\'s Rule for pregnancy due dates. Each calculator page documents the exact formula used.' },
  { q: 'Who built these calculators and are they qualified?', a: 'RoughTools is a web technology company. Our calculators implement standard mathematical and financial formulas that are well-documented and widely used by professionals. However, the calculators themselves are software tools — they do not provide personalised professional advice. For financial and health decisions, consult a qualified professional.' },
]

function CategoryFAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {CATEGORY_FAQS.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={open === i}
          >
            <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
            <svg
              className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Accent palette ─────────────────────────────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string;
  icon: string; badge: string; text: string; arrow: string;
  toolBg: string; toolBorder: string; toolIconBg: string;
}> = {
  indigo: {
    card: 'bg-indigo-50',    cardActive: 'bg-indigo-600',
    border: 'border-indigo-200', borderActive: 'border-indigo-600',
    icon: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-600',
    text: 'text-indigo-600', arrow: 'group-hover:text-indigo-600',
    toolBg: 'bg-indigo-50', toolBorder: 'border-indigo-200', toolIconBg: 'bg-indigo-100',
  },
  green: {
    card: 'bg-green-50',     cardActive: 'bg-green-600',
    border: 'border-green-200', borderActive: 'border-green-600',
    icon: 'bg-green-100 text-green-600', badge: 'bg-green-600',
    text: 'text-green-600',  arrow: 'group-hover:text-green-600',
    toolBg: 'bg-green-50',  toolBorder: 'border-green-200', toolIconBg: 'bg-green-100',
  },
  blue: {
    card: 'bg-blue-50',      cardActive: 'bg-blue-600',
    border: 'border-blue-200', borderActive: 'border-blue-600',
    icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-600',
    text: 'text-blue-600',   arrow: 'group-hover:text-blue-600',
    toolBg: 'bg-blue-50',   toolBorder: 'border-blue-200', toolIconBg: 'bg-blue-100',
  },
  orange: {
    card: 'bg-orange-50',    cardActive: 'bg-orange-500',
    border: 'border-orange-200', borderActive: 'border-orange-500',
    icon: 'bg-orange-100 text-orange-600', badge: 'bg-orange-500',
    text: 'text-orange-600', arrow: 'group-hover:text-orange-600',
    toolBg: 'bg-orange-50', toolBorder: 'border-orange-200', toolIconBg: 'bg-orange-100',
  },
  purple: {
    card: 'bg-purple-50',    cardActive: 'bg-purple-600',
    border: 'border-purple-200', borderActive: 'border-purple-600',
    icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-600',
    text: 'text-purple-600', arrow: 'group-hover:text-purple-600',
    toolBg: 'bg-purple-50', toolBorder: 'border-purple-200', toolIconBg: 'bg-purple-100',
  },
  teal: {
    card: 'bg-teal-50',      cardActive: 'bg-teal-600',
    border: 'border-teal-200', borderActive: 'border-teal-600',
    icon: 'bg-teal-100 text-teal-600', badge: 'bg-teal-600',
    text: 'text-teal-600',   arrow: 'group-hover:text-teal-600',
    toolBg: 'bg-teal-50',   toolBorder: 'border-teal-200', toolIconBg: 'bg-teal-100',
  },
  red: {
    card: 'bg-red-50',       cardActive: 'bg-red-600',
    border: 'border-red-200', borderActive: 'border-red-600',
    icon: 'bg-red-100 text-red-600', badge: 'bg-red-600',
    text: 'text-red-600',    arrow: 'group-hover:text-red-600',
    toolBg: 'bg-red-50',    toolBorder: 'border-red-200', toolIconBg: 'bg-red-100',
  },
}

/* ── Popular calculators for hero quick links ───────────────── */
const POPULAR = [
  'mortgage-calculator', 'bmi-calculator', 'loan-calculator',
  'compound-interest-calculator', 'age-calculator', 'calorie-calculator',
  'scientific-calculator', 'percentage-calculator',
]

/* ── Trust badges ───────────────────────────────────────────── */
const TRUST = [
  { icon: '⚡', text: 'Instant Results' },
  { icon: '🔒', text: 'Privacy First' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '📱', text: 'Mobile Friendly' },
  { icon: '🚫', text: 'No Watermarks' },
]

export default function CalculatorsPageClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleSections = active
    ? CALC_SUBCATEGORIES.filter(s => s.id === active)
    : CALC_SUBCATEGORIES

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>🧮</span>
            <span>{TOTAL_CALC_COUNT}+ Free Calculators — No Signup Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Every Calculator You Need.<br className="hidden sm:block" /> 100% Free.
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Financial, health, math, engineering, and specialty calculators — all in one place.
            No watermarks. No daily limits. Instant results in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const cfg = CALC_TOOL_CONFIGS[slug]
              if (!cfg) return null
              return (
                <Link
                  key={slug}
                  href={`/tools/calculators/${slug}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  {cfg.name}
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
          <h2 className="text-2xl font-extrabold text-gray-900">Choose your calculator type</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* "All Calculators" card */}
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
              🧮
            </div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Calculators</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400'}`}>
                {TOTAL_CALC_COUNT}+ tools
              </div>
            </div>
          </button>

          {/* Per-subcategory cards */}
          {CALC_SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color] ?? PALETTE.indigo
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
                    {sc.tools.length} calculators
                  </div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
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
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">
                {CALC_SUBCATEGORIES.find(s => s.id === active)?.label}
              </span> calculators
            </p>
            <button
              onClick={() => selectCategory(null)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
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

      {/* ── Calculator Sections ───────────────────────────────── */}
      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20" id="main-content">

        {visibleSections.map(sc => {
          const pal = PALETTE[sc.color] ?? PALETTE.indigo
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
                  {sc.tools.length} calculators
                </span>
              </div>

              {/* Tool grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/calculators/${tool.slug}`}
                    className={`
                      group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200
                      ${pal.toolBg} ${pal.toolBorder}
                      hover:shadow-md hover:-translate-y-0.5
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    `}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-lg flex-shrink-0 ${pal.toolIconBg}`}>
                      {tool.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold text-gray-900 group-hover:${pal.text} transition-colors leading-snug`}>
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 flex-shrink-0 text-gray-300 ${pal.arrow} transition-colors mt-1`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* ── About / Intro ────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10" aria-labelledby="about-calculators">
          <h2 id="about-calculators" className="text-2xl font-bold text-gray-900 mb-4">
            Free Online Calculators — Finance, Health, Math &amp; More
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="mb-3">
                RoughTools offers {TOTAL_CALC_COUNT}+ professional-grade calculators, all completely free and
                accessible without any account or signup. Whether you need to calculate your mortgage payment
                before speaking to a lender, estimate your BMI before a doctor&apos;s appointment, plan
                your retirement savings with compound interest, or simply figure out how to split a
                restaurant bill fairly — every calculation you need is here and ready in seconds.
              </p>
              <p className="mb-3">
                Our calculators are designed for real people making real decisions. A 28-year-old planning
                their first retirement contribution, a couple calculating whether they can afford a home,
                a student figuring out their GPA before applying to graduate school, a parent calculating a
                pregnancy due date — these are the people our tools are built for. No finance degree
                required. No confusing jargon. Just enter your numbers and get clear, accurate results.
              </p>
              <p>
                Unlike calculator apps that require installation or accounts, browser-based calculators
                like ours work on any device — smartphone, tablet, or desktop — without downloading
                anything. They load instantly, work offline once cached, and keep your financial and
                health data completely private on your device.
              </p>
            </div>
            <div>
              <p className="mb-3">
                Our calculators span five major categories. <strong className="text-gray-800">Finance calculators</strong> cover
                mortgages, loans, compound interest, retirement savings, tax estimation, and more — the
                essential tools for anyone managing their financial future. <strong className="text-gray-800">Health calculators</strong> include
                BMI, daily calorie needs, body fat percentage, pregnancy due date, and ideal weight — built
                to the same clinical standards used by healthcare providers.
              </p>
              <p className="mb-3">
                <strong className="text-gray-800">Math calculators</strong> handle everything from percentages and fractions
                to quadratic equations and statistical analysis. <strong className="text-gray-800">Unit converters</strong> make
                it easy to switch between metric and imperial across length, weight, temperature, speed,
                area, and volume. And <strong className="text-gray-800">everyday calculators</strong> tackle tip splitting,
                discount pricing, GPA calculation, and date differences.
              </p>
              <h3 className="font-semibold text-gray-900 mb-2">Every calculator follows these principles:</h3>
              <ul className="space-y-1.5">
                {[
                  'Transparent formulas — we show you the exact math',
                  'Honest disclaimers — we say when to consult a professional',
                  '100% private — no data is ever transmitted or stored',
                  'No account needed — start calculating immediately',
                  'Mobile-first design — works perfectly on any screen size',
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
                { href: '/tools/pdf',         label: '📄 PDF Tools' },
                { href: '/tools/image-tools', label: '🖼️ Image Tools' },
                { href: '/tools/developer',   label: '💻 Developer Tools' },
                { href: '/tools/text',        label: '✏️ Text Tools' },
                { href: '/tools/legal-tools', label: '⚖️ Legal Tools' },
                { href: '/tools/real-estate', label: '🏠 Real Estate' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Trustworthy ──────────────────────────────────── */}
        <section aria-labelledby="trust-heading">
          <h2 id="trust-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Our Calculators Are Trustworthy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '📐',
                title: 'Transparent Formulas',
                description: 'Every calculator shows the exact mathematical formula it uses — not a black box. See the formula, understand the variables, verify the math yourself.',
              },
              {
                icon: '⚠️',
                title: 'Honest Disclaimers',
                description: 'Finance and health calculators clearly say when results are estimates and when you should consult a professional. We never overstate what a calculator can tell you.',
              },
              {
                icon: '🔒',
                title: '100% Private',
                description: 'No data you enter is ever transmitted to our servers, stored in any database, or shared with third parties. All calculations happen on your device only.',
              },
              {
                icon: '🚫',
                title: 'No Account Needed',
                description: 'Start calculating immediately — no email, no password, no signup form. Every tool on RoughTools is open to everyone, always, for free.',
              },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Category FAQ ─────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
          <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <CategoryFAQ />
        </section>

      </main>
    </div>
  )
}
