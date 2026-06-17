import { MetadataRoute } from 'next'
import { ALL_TOOLS } from '@/lib/tools-registry'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { pdfTools } from '@/data/pdfTools'
import {
  CALC_SUBCATEGORIES,
} from './tools/calculators/_components/calculator-tool-configs'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.roughtools.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static shell pages ────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                  lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/tools`,                       lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE_URL}/blog`,                        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/pricing`,                     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`,              lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // ── Category hub pages ────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = [
    'calculators', 'developer', 'text', 'converters', 'network', 'security',
    'document-tools', 'legal-tools', 'real-estate', 'image-tools',
    'pdf', 'medical', 'engineering', 'business', 'environment', 'iq-test', 'resume',
  ].map(path => ({
    url: `${BASE_URL}/tools/${path}`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85,
  }))

  // ── Registry tool pages (ALL — no slice cap) ──────────────────────────────
  // Deduplicate by URL to avoid sitemap bloat from any duplicate slugs
  const registryToolUrls = new Set<string>()
  const registryPages: MetadataRoute.Sitemap = ALL_TOOLS.flatMap(tool => {
    const url = `${BASE_URL}/tools/${tool.category}/${tool.slug}`
    if (registryToolUrls.has(url)) return []
    registryToolUrls.add(url)
    return [{ url, lastModified: now, changeFrequency: 'weekly' as const, priority: tool.priority ?? 0.7 }]
  })

  // ── Calculator hub slugs (from CALC_SUBCATEGORIES) ────────────────────────
  // The calculators hub uses /tools/calculators/[slug] dynamic route.
  // These slugs come from the config, not the registry.
  const calcSlugsInRegistry = new Set(
    ALL_TOOLS.filter(t => t.category === 'calculators').map(t => t.slug)
  )
  const calcHubPages: MetadataRoute.Sitemap = CALC_SUBCATEGORIES.flatMap(sub =>
    (sub.tools ?? [])
      .filter((t: { slug: string }) => !calcSlugsInRegistry.has(t.slug))
      .map((t: { slug: string }) => ({
        url: `${BASE_URL}/tools/calculators/${t.slug}`,
        lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75,
      }))
  )

  // ── Blog posts ────────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ── IQ test routes ────────────────────────────────────────────────────────
  const iqPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/tools/iq-test`,             lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/tools/iq-test/session`,     lastModified: now, changeFrequency: 'weekly' as const, priority: 0.85 },
  ]

  // ── PDF tool pages (explicit — guarantees all 31 are included) ────────────
  // pdfTools.ts is the single source of truth; ALL_TOOLS may be missing some.
  const pdfToolPages: MetadataRoute.Sitemap = pdfTools.map(tool => ({
    url: tool.canonicalUrl,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const allPages = [
    ...staticPages,
    ...categoryPages,
    ...registryPages,
    ...calcHubPages,
    ...pdfToolPages,
    ...blogPages,
    ...iqPages,
  ]

  // Remove duplicates (some tools appear in both registry and hardcoded lists)
  const seen = new Set<string>()
  return allPages.filter(p => {
    if (seen.has(p.url)) return false
    seen.add(p.url)
    return true
  })
}
