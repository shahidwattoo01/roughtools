'use client'

/**
 * SiteHeader — matches roughtools_homepage_fixed.html exactly
 * Dark background #1a1a1a · 56px height · sticky top-0
 * + Ticker bar below in green #1a6b3c
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useScrolled } from '@/hooks/useScrolled'
import { CommandPaletteTrigger } from '@/components/CommandPalette'
import { SOCIAL_LINKS } from '@/lib/social-config'
import { TOTAL_REAL_TOOLS } from '@/lib/tools-registry'
import { TOTAL_CALC_COUNT } from '@/app/tools/calculators/_components/calculator-tool-configs'
import {
  IconLayoutGrid,
  IconBrandX,
  IconBrandGithub,
  IconMoon,
  IconSun,
  IconMenu2,
  IconX,
  IconTools,
  IconUserOff,
  IconBrowser,
} from '@tabler/icons-react'

/* ─── Category data for drawer ─────────────────────────────── */
// Counts sourced from each category's hub page (authoritative)
const DRAWER_CATS = [
  { name: 'Calculators',      href: '/tools/calculators',   count: TOTAL_CALC_COUNT },
  { name: 'Engineering',      href: '/tools/engineering',   count: 126 },
  { name: 'Medical & Health', href: '/tools/medical',       count: 113 },
  { name: 'Image Tools',      href: '/tools/image-tools',   count: 38  },
  { name: 'PDF Tools',        href: '/tools/pdf',           count: 31  },
  { name: 'Developer Tools',  href: '/tools/developer',     count: 19  },
  { name: 'Text Tools',       href: '/tools/text',          count: 10  },
  { name: 'Security',         href: '/tools/security',      count: 9   },
  { name: 'Unit Converters',  href: '/tools/converters',    count: 8   },
  { name: 'Legal Tools',      href: '/tools/legal-tools',   count: 8   },
  { name: 'Real Estate',      href: '/tools/real-estate',   count: 8   },
  { name: 'Network Tools',    href: '/tools/network',       count: 7   },
  { name: 'Document Tools',   href: '/tools/document-tools',count: 11  },
  { name: 'Business',         href: '/tools/business',      count: 6   },
  { name: 'Environment',      href: '/tools/environment',   count: 6   },
  { name: 'IQ Test',          href: '/tools/iq-test',       count: 1   },
]

/* ─── Component ─────────────────────────────────────────────── */
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted]   = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const drawerRef               = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close drawer on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [menuOpen])

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isDark = mounted && resolvedTheme === 'dark'
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <>
      {/* ── Sticky header ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 h-14 flex items-center justify-between px-8"
        style={{ background: '#1a1a1a' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="RoughTools home">
          <div
            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: '#1a6b3c' }}
          >
            RT
          </div>
          <span className="text-white text-[16px] font-semibold leading-none">
            RoughTools<span className="text-[#aaa] font-normal text-sm">.com</span>
          </span>
        </Link>

        {/* Centre search — opens command palette */}
        <CommandPaletteTrigger
          className="flex-1 max-w-[380px] mx-8 h-9 rounded-lg px-3 text-[14px] text-[#aaa]
                     border-[0.5px] cursor-pointer hidden sm:flex"
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        />

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* All Tools */}
          <Link
            href="/tools"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm"
            style={{ background: 'rgba(255,255,255,0.10)', border: '0.5px solid rgba(255,255,255,0.20)' }}
          >
            <IconLayoutGrid size={14} aria-hidden="true" />
            All Tools
            {mounted && (
              <span
                className="text-white text-[11px] px-1.5 py-0.5 rounded-full ml-0.5"
                style={{ background: '#1a6b3c' }}
              >
                {TOTAL_REAL_TOOLS}
              </span>
            )}
          </Link>

          {/* X */}
          {SOCIAL_LINKS.twitter && (
            <a
              href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}
              aria-label="Twitter / X"
            >
              <IconBrandX size={15} aria-hidden="true" />
            </a>
          )}

          {/* GitHub */}
          {SOCIAL_LINKS.github && (
            <a
              href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}
              aria-label="GitHub"
            >
              <IconBrandGithub size={15} aria-hidden="true" />
            </a>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-white transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mounted && isDark
              ? <IconSun size={15} aria-hidden="true" />
              : <IconMoon size={15} aria-hidden="true" />
            }
          </button>

          {/* Menu */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.10)', border: '0.5px solid rgba(255,255,255,0.20)' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <IconMenu2 size={14} aria-hidden="true" />
            Menu
          </button>
        </div>
      </header>

      {/* ── Ticker bar ────────────────────────────────────────── */}
      <div
        className="flex items-center gap-6 px-8 py-1.5 text-white text-xs"
        style={{ background: '#1a6b3c' }}
        aria-label="Site information"
      >
        <span className="flex items-center gap-1.5">
          <IconTools size={13} aria-hidden="true" />
          {mounted ? `${TOTAL_REAL_TOOLS}+ ` : ''}free online tools
        </span>
        <span className="flex items-center gap-1.5">
          <IconUserOff size={13} aria-hidden="true" />
          No signup required
        </span>
        <span className="flex items-center gap-1.5 hidden sm:flex">
          <IconBrowser size={13} aria-hidden="true" />
          Works in your browser
        </span>
      </div>

      {/* ── Backdrop ──────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer — slide in from right ──────────────────────── */}
      <aside
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[92vw] flex flex-col overflow-hidden transition-transform duration-300"
        style={{
          background: '#1a1a1a',
          borderLeft: '0.5px solid rgba(255,255,255,0.12)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
        aria-hidden={!menuOpen}
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.10)' }}
        >
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: '#1a6b3c' }}>RT</div>
            <span className="text-white font-semibold text-sm">RoughTools</span>
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-[#aaa] hover:text-white cursor-pointer" aria-label="Close menu">
            <IconX size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Drawer search */}
        <div className="px-5 py-3" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <CommandPaletteTrigger
            className="w-full h-9 rounded-lg px-3 text-[13px] text-[#aaa] flex"
            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
          />
        </div>

        {/* Category list */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Categories">
          {DRAWER_CATS.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-5 py-2.5 text-[#ccc] hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              <span>{cat.name}</span>
              <span className="text-[11px] text-[#666]">{cat.count}</span>
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/tools"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: '#1a6b3c' }}
          >
            Browse all {mounted ? `${TOTAL_REAL_TOOLS} ` : ''}tools →
          </Link>
        </div>
      </aside>
    </>
  )
}
