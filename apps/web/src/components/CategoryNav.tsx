'use client'

// ============================================================
// ROUGHTOOLS â€” CategoryNav Component (Phase 3.7)
// Navigation between tool categories
// Every category page links to all other categories
// Critical for internal linking & SEO crawlability
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ToolCategory } from '@/lib/tools-registry'

interface Category {
  slug: ToolCategory
  label: string
  emoji: string
  count: number
}

const CATEGORIES: Category[] = [
  { slug: 'pdf', label: 'PDF Tools', emoji: 'ðŸ“„', count: 26 },
  { slug: 'calculators', label: 'Calculators', emoji: 'ðŸ§®', count: 21 },
  { slug: 'developer', label: 'Developer', emoji: 'ðŸ’»', count: 20 },
  { slug: 'image-tools', label: 'Image Tools', emoji: 'ðŸ–¼ï¸', count: 38 },
  { slug: 'text', label: 'Text Tools', emoji: 'âœï¸', count: 10 },
  { slug: 'converters', label: 'Converters', emoji: 'ðŸ”„', count: 8 },
  { slug: 'network', label: 'Network', emoji: 'ðŸŒ', count: 6 },
  { slug: 'legal-tools', label: 'Legal Tools', emoji: 'âš–ï¸', count: 50 },
  { slug: 'real-estate', label: 'Real Estate', emoji: 'ðŸ ', count: 42 },
  { slug: 'security', label: 'Security', emoji: 'ðŸ”’', count: 8 },
  { slug: 'document-tools', label: 'Documents', emoji: 'ðŸ“‹', count: 9 },
]

interface CategoryNavProps {
  variant?: 'tabs' | 'pills' | 'sidebar'
  className?: string
  /** Highlight the active category */
  activeCategory?: ToolCategory
}

export function CategoryNav({
  variant = 'tabs',
  className,
  activeCategory,
}: CategoryNavProps) {
  const pathname = usePathname()

  if (variant === 'tabs') {
    return (
      <nav
        aria-label="Tool categories"
        className={cn('overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0', className)}
      >
        <ul
          className="flex gap-2 min-w-max pb-px"
          role="tablist"
        >
          {CATEGORIES.map((cat) => {
            const href = `/tools/${cat.slug}`
            const isActive =
              activeCategory === cat.slug || pathname.startsWith(href)

            return (
              <li key={cat.slug} role="presentation">
                <Link
                  href={href}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${cat.label} â€” ${cat.count} tools`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                    'transition-all duration-200 whitespace-nowrap',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  )}
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      'text-xs rounded-full px-1.5 py-0.5',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {cat.count}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  if (variant === 'pills') {
    return (
      <nav aria-label="Tool categories" className={className}>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const href = `/tools/${cat.slug}`
            const isActive = activeCategory === cat.slug

            return (
              <li key={cat.slug}>
                <Link
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                  )}
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  // Sidebar variant
  return (
    <nav aria-label="Tool categories" className={className}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-2">
        Categories
      </p>
      <ul className="space-y-0.5">
        {CATEGORIES.map((cat) => {
          const href = `/tools/${cat.slug}`
          const isActive = activeCategory === cat.slug || pathname.startsWith(href)

          return (
            <li key={cat.slug}>
              <Link
                href={href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </span>
                <span className="text-xs text-gray-400">{cat.count}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}