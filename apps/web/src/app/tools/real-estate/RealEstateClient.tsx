'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const SUBCATEGORIES = [
  {
    id: 'buying',
    label: 'Home Buying',
    icon: '🏡',
    color: 'teal',
    description: 'Affordability, closing costs, down payment, rent vs buy',
    tools: [
      { slug: 'rent-vs-buy-calculator',          name: 'Rent vs Buy Calculator',         icon: '⚖️', description: 'Compare renting vs buying a home. Calculate the true 10-year cost of each option.', badge: 'Most Popular' },
      { slug: 'home-affordability-calculator',   name: 'Home Affordability Calculator',  icon: '💰', description: 'How much house can you afford? Based on income, debt, and down payment.', badge: 'Popular' },
      { slug: 'closing-costs-calculator',        name: 'Closing Costs Calculator',       icon: '🧾', description: 'Estimate home buying closing costs including fees, taxes, and prepaid items.' },
      { slug: 'down-payment-calculator',         name: 'Down Payment Calculator',        icon: '💵', description: 'Calculate how much down payment you need and how long to save for it.' },
    ],
  },
  {
    id: 'investment',
    label: 'Investment Property',
    icon: '📈',
    color: 'emerald',
    description: 'Cap rate, rental yield, property value, and tax',
    tools: [
      { slug: 'cap-rate-calculator',             name: 'Cap Rate Calculator',            icon: '📊', description: 'Calculate capitalisation rate for investment properties and evaluate rental ROI.' },
      { slug: 'rental-yield-calculator',         name: 'Rental Yield Calculator',        icon: '🏘️', description: 'Calculate gross and net rental yield for buy-to-let investment properties.' },
      { slug: 'home-value-estimator',            name: 'Home Value Estimator',           icon: '🏠', description: 'Estimate your home value based on location, size, age, and local market data.' },
      { slug: 'property-tax-calculator',         name: 'Property Tax Calculator',        icon: '🏛️', description: 'Estimate annual property tax based on home value and local tax rate.' },
    ],
  },
]

const PALETTE: Record<string, { card:string; cardActive:string; border:string; borderActive:string; icon:string; badge:string; text:string; arrow:string; toolBg:string; toolBorder:string; toolIconBg:string }> = {
  teal:    { card:'bg-teal-50',    cardActive:'bg-teal-600',    border:'border-teal-200',    borderActive:'border-teal-600',    icon:'bg-teal-100 text-teal-600',    badge:'bg-teal-600',    text:'text-teal-600',    arrow:'group-hover:text-teal-600',    toolBg:'bg-teal-50',    toolBorder:'border-teal-200',    toolIconBg:'bg-teal-100'    },
  emerald: { card:'bg-emerald-50', cardActive:'bg-emerald-600', border:'border-emerald-200', borderActive:'border-emerald-600', icon:'bg-emerald-100 text-emerald-600', badge:'bg-emerald-600', text:'text-emerald-600', arrow:'group-hover:text-emerald-600', toolBg:'bg-emerald-50', toolBorder:'border-emerald-200', toolIconBg:'bg-emerald-100' },
}

const TOTAL = SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)
const TRUST = [
  { icon: '⚡', text: 'Instant Results' },
  { icon: '🔒', text: 'Private & Secure' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '🎯', text: 'Accurate Data' },
  { icon: '🚫', text: 'No Signup' },
]
const POPULAR = ['rent-vs-buy-calculator', 'home-affordability-calculator', 'cap-rate-calculator', 'rental-yield-calculator']

export default function RealEstateClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)
  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }, [])
  const visibleSections = active ? SUBCATEGORIES.filter(s => s.id === active) : SUBCATEGORIES

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-b from-teal-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>🏠</span><span>{TOTAL} Free Real Estate Calculators — No Signup Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Real Estate Calculators.<br className="hidden sm:block" /> Make Smarter Decisions.
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-8">
            Rent vs buy, home affordability, closing costs, down payment, cap rate, rental yield, property tax, and home value estimator — science-based tools for buyers and investors.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = SUBCATEGORIES.flatMap(s => s.tools).find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link key={slug} href={`/tools/real-estate/${slug}`} className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap">
                  {tool.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Choose what you need to calculate</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button onClick={() => selectCategory(null)} className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${active === null ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100'}`}>🏠</div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All RE Calculators</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400'}`}>{TOTAL} calculators</div>
            </div>
          </button>
          {SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color]
            const isActive = active === sc.id
            return (
              <button key={sc.id} onClick={() => selectCategory(isActive ? null : sc.id)} className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${isActive ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5` : `bg-white ${pal.border} text-gray-700 hover:${pal.card} hover:${pal.borderActive}`}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-white/20' : pal.icon}`}>{sc.icon}</div>
                <div>
                  <div className="font-bold text-[14px] leading-tight">{sc.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{sc.tools.length} calculators</div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{sc.description}</p>
                {isActive && <div className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center"><svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
              </button>
            )
          })}
        </div>
        {active && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{SUBCATEGORIES.find(s => s.id === active)?.label}</span> calculators</p>
            <button onClick={() => selectCategory(null)} className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      <div className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
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
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900">{sc.label}</h2>
                  <p className="text-sm text-gray-500">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>{sc.tools.length} calculators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(tool => (
                  <Link key={tool.slug} href={`/tools/real-estate/${tool.slug}`} className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${pal.toolBg} ${pal.toolBorder} hover:shadow-md hover:-translate-y-0.5`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0 ${pal.toolIconBg}`}>{tool.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-gray-900 group-hover:${pal.text} transition-colors leading-snug`}>{tool.name}</h3>
                        {tool.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${pal.badge} flex-shrink-0`}>{tool.badge}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{tool.description}</p>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 text-gray-300 ${pal.arrow} transition-colors mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Real Estate Calculators</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="mb-3">Roughtools real estate calculators are used by homebuyers, landlords, and property investors to make data-driven decisions. Every calculation runs instantly in your browser — no account, no signup, no data stored.</p>
              <p>From the true 10-year cost of renting vs buying to net rental yield with full expense breakdown.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Roughtools Real Estate?</h3>
              <ul className="space-y-2">
                {['Rent vs Buy: true 10-year comparison including opportunity cost','Home Affordability: based on income, debt-to-income ratio, and down payment','Rental Yield: gross and net yield with expense breakdown','Cap Rate: NOI ÷ property value with investment grade rating','Closing Costs: state-level estimates for agent fees, taxes, and prepaid items'].map(p => (
                  <li key={p} className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[{href:'/tools/calculators',label:'🧮 Calculators'},{href:'/tools/legal-tools',label:'⚖️ Legal Tools'},{href:'/tools/document-tools',label:'📋 Document Tools'},{href:'/tools/environment',label:'🌿 Environment'},{href:'/tools/business',label:'💼 Business Tools'},{href:'/tools/converters',label:'🔄 Converters'}].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-teal-300 hover:text-teal-700 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
