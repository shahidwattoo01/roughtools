'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const SUBCATEGORIES = [
  {
    id: 'passwords',
    label: 'Passwords & Identity',
    icon: '🔐',
    color: 'slate',
    description: 'Generate passwords, disposable emails, and encrypt files',
    tools: [
      { slug: 'password-generator', name: 'Password Generator', description: 'Generate strong, secure passwords with custom length, symbols, and entropy scoring.', badge: 'Most Used', searches: '3.1M/mo', cpc: '$2.80' },
      { slug: 'temporary-email',    name: 'Temporary Email',    description: 'Disposable temporary email address — protect your inbox from spam instantly.', badge: 'Popular', searches: '2.4M/mo', cpc: '$1.90' },
      { slug: 'file-encryptor',     name: 'File Encryptor',     description: 'AES-256 client-side file encryption. Nothing is uploaded to any server.', searches: '420K/mo', cpc: '$1.60' },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & Network',
    icon: '🛡️',
    color: 'green',
    description: 'Check VPN leaks and strip metadata from files',
    tools: [
      { slug: 'vpn-checker',       name: 'VPN Checker',        description: 'Check for IP and DNS leaks in your VPN connection. Verify your privacy.', searches: '850K/mo', cpc: '$3.40' },
      { slug: 'metadata-remover',  name: 'Metadata Remover',   description: 'Strip EXIF metadata from photos before sharing. Remove GPS and camera data.', searches: '680K/mo', cpc: '$1.20' },
      { slug: 'ssl-checker',       name: 'SSL Checker',        description: 'Validate SSL certificates and check expiry dates for any domain instantly.', searches: '1.1M/mo', cpc: '$2.60' },
    ],
  },
  {
    id: 'web',
    label: 'Web & Links',
    icon: '🌐',
    color: 'blue',
    description: 'QR codes, barcodes, short links, and URL tools',
    tools: [
      { slug: 'qr-code-generator',  name: 'QR Code Generator',   description: 'Generate QR codes for URLs, text, contacts, WiFi, and more. Download as PNG/SVG.', badge: 'Most Popular', searches: '6.2M/mo', cpc: '$1.50' },
      { slug: 'barcode-generator',  name: 'Barcode Generator',   description: 'Generate Code 128, EAN-13, EAN-8, UPC-A & Code 39 barcodes. Download as PNG/SVG.', searches: '1.8M/mo', cpc: '$1.30' },
      { slug: 'url-shortener',      name: 'URL Shortener',       description: 'Shorten long URLs instantly. Create short branded links with custom slugs.', searches: '4.5M/mo', cpc: '$2.10' },
    ],
  },
]

const PALETTE: Record<string, { cardActive: string; border: string; borderActive: string; icon: string; badge: string }> = {
  slate: { cardActive: 'bg-slate-700', border: 'border-slate-200', borderActive: 'border-slate-700', icon: 'bg-slate-100 text-slate-700', badge: 'bg-slate-700' },
  green: { cardActive: 'bg-green-600', border: 'border-green-200', borderActive: 'border-green-600', icon: 'bg-green-100 text-green-600', badge: 'bg-green-600' },
  blue:  { cardActive: 'bg-blue-600',  border: 'border-blue-200',  borderActive: 'border-blue-600',  icon: 'bg-blue-100 text-blue-600',  badge: 'bg-blue-600'  },
}

const TOTAL = SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)
const TRUST = [
  { icon: '🔒', text: 'Client-Side Only' },
  { icon: '🚫', text: 'Zero Data Stored' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '⚡', text: 'Instant Results' },
  { icon: '🛡️', text: 'Privacy First' },
]
const POPULAR = ['password-generator', 'qr-code-generator', 'temporary-email', 'file-encryptor']

export default function SecurityToolsClient() {
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
      <section className="bg-gradient-to-b from-slate-700 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>🔒</span><span>{TOTAL} Free Security & Privacy Tools — Client-Side Only</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Security & Privacy Tools.<br className="hidden sm:block" /> Stay Safe Online.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Password generator, temporary email, AES-256 file encryption, VPN leak checker, QR code maker, URL shortener, SSL checker, and metadata remover — all client-side, zero data stored.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = SUBCATEGORIES.flatMap(s => s.tools).find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link key={slug} href={`/tools/security/${slug}`} className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap">
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
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Choose what you need to do</h2>
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
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100 dark:bg-white/8'}`}>🔒</div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Security Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400 dark:text-[#777]'}`}>{TOTAL} tools</div>
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
                    : `bg-white dark:bg-[#1e1e1e] ${pal.border} dark:border-white/10 text-gray-700 dark:text-[#ddd] hover:${pal.borderActive} dark:hover:border-slate-400`
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
            <p className="text-sm text-gray-600 dark:text-[#aaa]">Showing <span className="font-semibold text-gray-900 dark:text-white">{SUBCATEGORIES.find(s => s.id === active)?.label}</span> tools</p>
            <button onClick={() => selectCategory(null)} className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 font-medium flex items-center gap-1">
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
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>{sc.tools.length} {sc.tools.length === 1 ? 'tool' : 'tools'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sc.tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/security/${tool.slug}`}
                    className="group flex flex-col p-5 rounded-2xl border bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Security & Privacy Tools Online</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-[#bbb] leading-relaxed">
            <div>
              <p className="mb-3">Roughtools security tools are built for privacy-conscious users. Every tool runs entirely in your browser — passwords are generated locally, files are encrypted before any processing, and no metadata is ever transmitted to our servers.</p>
              <p>Zero data stored. Zero tracking. Zero compromise.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Why Roughtools Security Tools?</h3>
              <ul className="space-y-2">
                {['All processing happens in your browser — nothing uploaded','AES-256 encryption: industry-standard file security','Password generator with entropy scoring and custom rules','QR code generator for URLs, WiFi, contacts, and more','VPN, DNS, and WebRTC leak detection'].map(p => (
                  <li key={p} className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
            <p className="text-sm font-semibold text-gray-700 dark:text-[#ddd] mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[{href:'/tools/developer',label:'💻 Developer Tools'},{href:'/tools/network',label:'🌐 Network Tools'},{href:'/tools/pdf',label:'📄 PDF Tools'},{href:'/tools/image-tools',label:'🖼️ Image Tools'},{href:'/tools/text',label:'✏️ Text Tools'},{href:'/tools/document-tools',label:'📋 Document Tools'}].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-gray-700 dark:text-[#ccc] hover:border-slate-400 hover:text-slate-700 dark:hover:border-slate-500 dark:hover:text-slate-300 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
