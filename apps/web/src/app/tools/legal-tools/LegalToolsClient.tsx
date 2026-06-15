'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const SUBCATEGORIES = [
  {
    id: 'website',
    label: 'Website & App Legal',
    icon: '🌐',
    color: 'amber',
    description: 'Privacy policies, terms of service for websites and apps',
    tools: [
      { slug: 'privacy-policy-generator',   name: 'Privacy Policy Generator',   description: 'Generate a GDPR-compliant free privacy policy for any website or app.', badge: 'Most Popular', searches: '2.8M/mo', cpc: '$6.50' },
      { slug: 'terms-of-service-generator',  name: 'Terms of Service Generator', description: 'Generate free terms and conditions for websites, apps, and SaaS products.', badge: 'Popular', searches: '1.4M/mo', cpc: '$5.60' },
    ],
  },
  {
    id: 'contracts',
    label: 'Business & Employment',
    icon: '🤝',
    color: 'orange',
    description: 'NDAs, employment contracts, leases, and legal letters',
    tools: [
      { slug: 'nda-generator',                  name: 'NDA Generator',                  description: 'Create a non-disclosure agreement for startups, freelancers, and businesses.', badge: 'High CPC', searches: '1.8M/mo', cpc: '$8.40' },
      { slug: 'lease-agreement-generator',       name: 'Lease Agreement Generator',      description: 'Generate a free residential lease agreement for landlords and tenants.', searches: '1.1M/mo', cpc: '$4.80' },
      { slug: 'employment-contract-generator',   name: 'Employment Contract',            description: 'Create a free employment contract for new hires with customisable terms.', searches: '920K/mo', cpc: '$5.20' },
      { slug: 'cease-and-desist-generator',      name: 'Cease and Desist Generator',     description: 'Generate a cease and desist letter for copyright, harassment, or defamation.', searches: '580K/mo', cpc: '$7.80' },
    ],
  },
  {
    id: 'personal',
    label: 'Personal Legal',
    icon: '📜',
    color: 'yellow',
    description: 'Wills, power of attorney, and estate planning',
    tools: [
      { slug: 'will-generator',                  name: 'Last Will & Testament',          description: 'Create a simple last will and testament online. Free basic will template.', searches: '1.3M/mo', cpc: '$9.20' },
      { slug: 'power-of-attorney-generator',     name: 'Power of Attorney',              description: 'Generate a power of attorney document for financial or healthcare decisions.', searches: '980K/mo', cpc: '$8.60' },
    ],
  },
]

const PALETTE: Record<string, { cardActive: string; border: string; borderActive: string; icon: string; badge: string }> = {
  amber:  { cardActive: 'bg-amber-600',  border: 'border-amber-200',  borderActive: 'border-amber-600',  icon: 'bg-amber-100 text-amber-700',  badge: 'bg-amber-600'  },
  orange: { cardActive: 'bg-orange-600', border: 'border-orange-200', borderActive: 'border-orange-600', icon: 'bg-orange-100 text-orange-700', badge: 'bg-orange-600' },
  yellow: { cardActive: 'bg-yellow-500', border: 'border-yellow-200', borderActive: 'border-yellow-500', icon: 'bg-yellow-100 text-yellow-700', badge: 'bg-yellow-500' },
}

const TOTAL = SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)
const TRUST = [
  { icon: '⚡', text: 'Instant Generate' },
  { icon: '📄', text: 'Download as PDF' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '🔄', text: 'Customisable' },
  { icon: '🚫', text: 'No Signup' },
]
const POPULAR = ['privacy-policy-generator', 'terms-of-service-generator', 'nda-generator', 'will-generator']

export default function LegalToolsClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)
  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }, [])
  const visibleSections = active ? SUBCATEGORIES.filter(s => s.id === active) : SUBCATEGORIES

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-amber-600 to-yellow-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>⚖️</span><span>{TOTAL} Free Legal Document Templates — No Lawyer Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Free Legal Documents.<br className="hidden sm:block" /> Instant. Professional.
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl mx-auto mb-8">
            Privacy policy, terms of service, NDA, lease agreement, employment contract, will, power of attorney, and more — professional legal templates ready in minutes, completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = SUBCATEGORIES.flatMap(s => s.tools).find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link key={slug} href={`/tools/legal-tools/${slug}`} className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap">
                  {tool.name}
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
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Choose the document you need</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={() => selectCategory(null)}
            className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
              active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ddd] hover:border-gray-400 dark:hover:border-white/25'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100 dark:bg-white/8'}`}>⚖️</div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Legal Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>{TOTAL} templates</div>
            </div>
          </button>
          {SUBCATEGORIES.map(sc => {
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
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>{sc.tools.length} templates</div>
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
            <p className="text-sm text-gray-600 dark:text-[#aaa]">Showing <span className="font-semibold text-gray-900 dark:text-white">{SUBCATEGORIES.find(s => s.id === active)?.label}</span> templates</p>
            <button onClick={() => selectCategory(null)} className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#161616] border-y border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-[#888]">
          {TRUST.map(b => <span key={b.text} className="flex items-center gap-1.5 font-medium"><span>{b.icon}</span>{b.text}</span>)}
        </div>
      </div>

      {/* ── Tool Sections ─────────────────────────────────────── */}
      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20" id="main-content">
        {visibleSections.map(sc => {
          const pal = PALETTE[sc.color]
          return (
            <section key={sc.id} id={sc.id} aria-labelledby={`heading-${sc.id}`} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>{sc.icon}</div>
                <div>
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900 dark:text-white">{sc.label}</h2>
                  <p className="text-sm text-gray-500 dark:text-[#aaa]">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>{sc.tools.length} {sc.tools.length === 1 ? 'template' : 'templates'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sc.tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/legal-tools/${tool.slug}`}
                    className="group flex flex-col p-5 rounded-2xl border bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {tool.name}
                      </h3>
                      {tool.badge && (
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${pal.badge}`}>{tool.badge}</span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 dark:text-[#999] leading-relaxed line-clamp-2 flex-1 mb-4">{tool.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/8 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Legal Document Generator</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-[#bbb] leading-relaxed">
            <div>
              <p className="mb-3">Roughtools legal document generators help individuals and businesses create professional-grade legal templates in minutes. While these templates provide a strong starting point, always consult a licensed attorney for advice on your specific legal situation.</p>
              <p>Download as PDF or copy the text — ready to customise and sign immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Why Roughtools Legal Tools?</h3>
              <ul className="space-y-2">
                {['Privacy policy generator — GDPR compliant, customisable for any country','Terms of service — covers user rights, liability, and payment terms','NDA generator — mutual and unilateral non-disclosure agreements','Lease and employment contract templates for landlords and employers','Personal legal: wills and power of attorney documents'].map(p => (
                  <li key={p} className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
            <p className="text-sm font-semibold text-gray-700 dark:text-[#ddd] mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[{href:'/tools/document-tools',label:'📋 Document Tools'},{href:'/tools/real-estate',label:'🏠 Real Estate'},{href:'/tools/business',label:'💼 Business Tools'},{href:'/tools/pdf',label:'📄 PDF Tools'},{href:'/tools/security',label:'🔒 Security Tools'},{href:'/tools/calculators',label:'🧮 Calculators'}].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-gray-700 dark:text-[#ccc] hover:border-amber-300 hover:text-amber-700 dark:hover:border-amber-600 dark:hover:text-amber-400 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
