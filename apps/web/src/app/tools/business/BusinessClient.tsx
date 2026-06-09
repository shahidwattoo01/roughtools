'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const SUBCATEGORIES = [
  {
    id: 'copy',
    label: 'Copy & Content',
    icon: '✍️',
    color: 'violet',
    description: 'Sales copy, ads, email sequences, and social posts',
    tools: [
      { slug: 'sales-copy-ai',          name: 'Sales Copy AI',           icon: '✍️', description: 'Generate high-converting headlines, product descriptions, and CTAs for any product or service.', badge: 'Most Popular' },
      { slug: 'ad-creative-generator',  name: 'Ad Creative Generator',   icon: '🎯', description: 'Create compelling ad copy for Google Ads, Facebook, Instagram, and LinkedIn.', badge: 'High CPC' },
      { slug: 'social-media-scheduler', name: 'Social Media Scheduler',  icon: '📅', description: 'Write platform-perfect posts for Twitter/X, LinkedIn, Instagram, and Facebook with hashtag suggestions.' },
      { slug: 'email-marketing-ai',     name: 'Email Marketing AI',      icon: '📧', description: 'Write complete email sequences — welcome, nurture, promotional, and cart abandonment.', badge: 'High CPC' },
    ],
  },
  {
    id: 'web',
    label: 'Web & SEO',
    icon: '🔍',
    color: 'purple',
    description: 'Landing page copy and on-page SEO analysis',
    tools: [
      { slug: 'landing-page-builder',   name: 'Landing Page Builder',    icon: '🖥️', description: 'Generate complete landing page copy — hero headline, benefits, social proof, FAQ, and CTA.' },
      { slug: 'seo-optimizer',          name: 'SEO Optimizer',           icon: '🔍', description: 'Analyse your page title, meta description, and content for SEO. Get an instant score and fixes.' },
    ],
  },
]

const PALETTE: Record<string, { card:string; cardActive:string; border:string; borderActive:string; icon:string; badge:string; text:string; arrow:string; toolBg:string; toolBorder:string; toolIconBg:string }> = {
  violet: { card:'bg-violet-50', cardActive:'bg-violet-700', border:'border-violet-200', borderActive:'border-violet-700', icon:'bg-violet-100 text-violet-700', badge:'bg-violet-700', text:'text-violet-700', arrow:'group-hover:text-violet-700', toolBg:'bg-violet-50', toolBorder:'border-violet-200', toolIconBg:'bg-violet-100' },
  purple: { card:'bg-purple-50', cardActive:'bg-purple-600', border:'border-purple-200', borderActive:'border-purple-600', icon:'bg-purple-100 text-purple-600', badge:'bg-purple-600', text:'text-purple-600', arrow:'group-hover:text-purple-600', toolBg:'bg-purple-50', toolBorder:'border-purple-200', toolIconBg:'bg-purple-100' },
}

const TOTAL = SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)
const TRUST = [
  { icon: '⚡', text: 'Instant Results' },
  { icon: '🔒', text: 'Privacy First' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '🚫', text: 'No Signup' },
  { icon: '💯', text: 'High CPC Tools' },
]
const POPULAR = ['sales-copy-ai', 'ad-creative-generator', 'email-marketing-ai', 'seo-optimizer']

export default function BusinessClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)
  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }, [])
  const visibleSections = active ? SUBCATEGORIES.filter(s => s.id === active) : SUBCATEGORIES

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <section className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>💼</span><span>{TOTAL} Free Business & Marketing Tools — No Signup Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            AI-Powered Business Tools.<br className="hidden sm:block" /> 100% Free.
          </h1>
          <p className="text-lg text-violet-100 max-w-2xl mx-auto mb-8">
            Sales copy, ad creatives, email sequences, social posts, landing pages, and SEO analysis — all in one place. No subscription, no watermark.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = SUBCATEGORIES.flatMap(s => s.tools).find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link key={slug} href={`/tools/business/${slug}`} className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap">
                  {tool.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-[var(--fg-2)] uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-[var(--fg)]">Choose what you need to do</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button onClick={() => selectCategory(null)} className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${active === null ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5' : 'bg-[var(--bg-1)] border-[var(--line-strong)] text-[var(--fg)] hover:border-[var(--fg-2)]'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-[var(--bg-2)]'}`}>💼</div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Business Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-[var(--fg-2)]'}`}>{TOTAL} tools</div>
            </div>
          </button>
          {SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color]
            const isActive = active === sc.id
            return (
              <button key={sc.id} onClick={() => selectCategory(isActive ? null : sc.id)} className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${isActive ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5` : `bg-[var(--bg-1)] ${pal.border} text-[var(--fg)] hover:${pal.card} hover:${pal.borderActive}`}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-white/20' : pal.icon}`}>{sc.icon}</div>
                <div>
                  <div className="font-bold text-[14px] leading-tight">{sc.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-[var(--fg-2)]'}`}>{sc.tools.length} tools</div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-[var(--fg-2)]'}`}>{sc.description}</p>
                {isActive && <div className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center"><svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
              </button>
            )
          })}
        </div>
        {active && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-[var(--fg-1)]">Showing <span className="font-semibold text-[var(--fg)]">{SUBCATEGORIES.find(s => s.id === active)?.label}</span> tools</p>
            <button onClick={() => selectCategory(null)} className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      <div className="bg-[var(--bg-1)] border-y border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-[var(--fg-2)]">
          {TRUST.map(b => <span key={b.text} className="flex items-center gap-1.5 font-medium"><span>{b.icon}</span>{b.text}</span>)}
        </div>
      </div>

      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20" id="main-content">
        {visibleSections.map(sc => {
          const pal = PALETTE[sc.color]
          return (
            <section key={sc.id} id={sc.id} aria-labelledby={`heading-${sc.id}`} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>{sc.icon}</div>
                <div>
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-[var(--fg)]">{sc.label}</h2>
                  <p className="text-sm text-[var(--fg-2)]">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>{sc.tools.length} tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(tool => (
                  <Link key={tool.slug} href={`/tools/business/${tool.slug}`} className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${pal.toolBg} ${pal.toolBorder} hover:shadow-md hover:-translate-y-0.5`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0 ${pal.toolIconBg}`}>{tool.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-[var(--fg)] group-hover:${pal.text} transition-colors leading-snug`}>{tool.name}</h3>
                        {tool.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${pal.badge} flex-shrink-0`}>{tool.badge}</span>}
                      </div>
                      <p className="text-xs text-[var(--fg-2)] mt-0.5 leading-relaxed line-clamp-2">{tool.description}</p>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 text-gray-300 ${pal.arrow} transition-colors mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
        <section className="bg-[var(--bg-1)] rounded-3xl border border-[var(--line)] p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">Free AI Business & Marketing Tools</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-[var(--fg-1)] leading-relaxed">
            <div>
              <p className="mb-3">Roughtools Business Tools are built for founders, marketers, and content creators who need professional-quality copy and analysis without expensive SaaS subscriptions. Every tool runs in your browser — no data leaves your device.</p>
              <p>From generating scroll-stopping ad headlines to analysing your SEO health, these tools cover the full marketing stack.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--fg)] mb-2">Why use Roughtools for business?</h3>
              <ul className="space-y-2">
                {['AI-quality copy without ChatGPT API costs','Platform-specific formats for every ad network','Complete email sequence frameworks, not just subject lines','Real SEO analysis with actionable scoring','Landing page copy structured for conversion','No login, no limit, no credit card — ever'].map(p => (
                  <li key={p} className="flex items-start gap-2"><span className="text-violet-500 font-bold mt-0.5 flex-shrink-0">✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <p className="text-sm font-semibold text-[var(--fg-1)] mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[{href:'/tools/pdf',label:'📄 PDF Tools'},{href:'/tools/calculators',label:'🧮 Calculators'},{href:'/tools/image-tools',label:'🖼️ Image Tools'},{href:'/tools/developer',label:'💻 Developer'},{href:'/tools/legal-tools',label:'⚖️ Legal Tools'},{href:'/tools/real-estate',label:'🏠 Real Estate'}].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-[var(--bg-2)] border border-[var(--line)] rounded-full px-4 py-1.5 text-[var(--fg-1)] hover:border-[var(--brand-2)] hover:text-[var(--brand-2)] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
