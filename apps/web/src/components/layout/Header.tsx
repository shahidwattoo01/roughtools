'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const { status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAuthenticated = status === 'authenticated'

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" aria-label="Brand" className="text-lg font-bold">
          Brand
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className="text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-sm font-medium"
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn()}
              className="text-sm font-medium"
            >
              Sign In
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex items-center md:hidden"
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          data-testid="mobile-nav"
          className="border-t bg-background px-4 pb-4 md:hidden"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="mt-2 text-sm font-medium"
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn()}
              className="mt-2 text-sm font-medium"
            >
              Sign In
            </button>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
