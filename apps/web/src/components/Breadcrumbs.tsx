'use client'

// ============================================================
// ROUGHTOOLS â€” Breadcrumbs Component
// Renders breadcrumbs with JSON-LD BreadcrumbList schema
// ============================================================

import Link from 'next/link'
import { ChevronRight, Home } from '@/components/icons'
import { JsonLd } from './JsonLd'
import { getBreadcrumbSchema } from '@/lib/structured-data'
import { SEO_CONFIG } from '@/lib/seo-config'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const { siteUrl } = SEO_CONFIG

  // Build schema items (always include home)
  const schemaItems = [
    { name: 'Home', url: siteUrl },
    ...items.map((item) => ({
      name: item.label,
      url: item.href ? `${siteUrl}${item.href}` : siteUrl,
    })),
  ]

  const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items]

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(schemaItems)} />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1 text-sm text-gray-500 ${className}`}
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            const isFirst = index === 0

            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-gray-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  // Current page â€” not a link
                  <span
                    className="text-gray-800 font-medium truncate max-w-[200px]"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '/'}
                    className="hover:text-indigo-600 transition-colors flex items-center gap-1"
                  >
                    {isFirst && (
                      <Home className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className={isFirst ? 'sr-only sm:not-sr-only' : ''}>
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}