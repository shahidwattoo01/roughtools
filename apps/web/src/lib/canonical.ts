// ============================================================
// ROUGHTOOLS — CANONICAL URL UTILITIES
// Prevent duplicate content issues
// ============================================================

import { SEO_CONFIG } from './seo-config'

const BASE = SEO_CONFIG.siteUrl

/** Get canonical URL for tool page */
export function toolCanonical(category: string, slug: string): string {
  return `${BASE}/tools/${category}/${slug}`
}

/** Get canonical URL for category page */
export function categoryCanonical(category: string): string {
  return `${BASE}/tools/${category}`
}

/** Get canonical URL for blog post */
export function blogCanonical(slug: string): string {
  return `${BASE}/blog/${slug}`
}

/** Get canonical URL for any static page */
export function pageCanonical(path: string): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  // Remove trailing slash (unless root)
  const normalPath = cleanPath.length > 1 ? cleanPath.replace(/\/$/, '') : cleanPath
  return `${BASE}${normalPath}`
}

/**
 * Normalise a URL to its canonical form.
 * Removes: trailing slashes, UTM params, duplicate params.
 */
export function normaliseCanonical(url: string): string {
  try {
    const parsed = new URL(url)

    // Remove tracking params
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source']
    trackingParams.forEach((p) => parsed.searchParams.delete(p))

    // Remove trailing slash from pathname (except root)
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1)
    }

    return parsed.toString()
  } catch {
    return url
  }
}

/**
 * Pagination canonical helpers.
 * Page 1 → canonical = base URL (no ?page=1)
 * Page N → canonical = base URL + ?page=N
 */
export function paginatedCanonical(baseUrl: string, page: number): string {
  if (page <= 1) return baseUrl
  const url = new URL(baseUrl)
  url.searchParams.set('page', String(page))
  return url.toString()
}