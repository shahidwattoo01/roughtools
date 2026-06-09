'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/tools', label: 'All Tools' },
  { href: '/tools?cat=calculators', label: 'Calculators' },
  { href: '/tools?cat=documents', label: 'Documents' },
  { href: '/tools?cat=media', label: 'Media' },
  { href: '/tools?cat=legal', label: 'Legal AI' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) window.location.href = `/tools?q=${encodeURIComponent(search)}`
  }, [search])

  return (
    <>
      {/* Announcement bar */}
      <div className="gradient-brand text-white text-center py-2 px-4 text-xs font-semibold">
        ✦ 155+ free tools — no signup required &nbsp;·&nbsp;
        <Link href="/tools" className="underline font-bold text-white hover:opacity-80">
          Browse all tools →
        </Link>
      </div>

      {/* Main navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[var(--bg-surface)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--border-subtle)]'
          : 'bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]'
      }`} style={{ height: 'var(--header-height)' }}>
        <div className="container h-full flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand text-white font-display font-black text-lg">
              T
            </div>
            <span className="font-display font-black text-xl text-[var(--text-primary)] tracking-tight">
              Tool<span className="text-brand">verse</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 ml-auto bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-xl px-3 h-9 w-56 lg:w-72">
            <svg className="shrink-0 text-[var(--text-muted)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search 155+ tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-full"
            />
            <kbd className="hidden lg:flex items-center gap-0.5 font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5 shrink-0">
              ⌘K
            </kbd>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-2">
            <Link href="/tools" className="hidden sm:block btn btn-secondary btn-sm">
              Browse Tools
            </Link>
            <Link href="#" className="btn btn-primary btn-sm shadow-brand">
              Get Pro ↗
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden btn btn-ghost btn-sm p-2"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                  : <><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-slide-up">
            <div className="container py-4 flex flex-col gap-1">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-xl px-3 h-10 mb-3">
                <svg className="shrink-0 text-[var(--text-muted)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-full"
                />
              </form>

              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}