import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers including Google, Bing, etc.
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/embed/',
        ],
      },
      // Allow AI search crawlers — critical for appearing in ChatGPT, Perplexity, Bing AI, etc.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-calculators.xml`,
      `${BASE_URL}/sitemap-pdf.xml`,
      `${BASE_URL}/sitemap-developer.xml`,
      `${BASE_URL}/sitemap-text.xml`,
      `${BASE_URL}/sitemap-converters.xml`,
      `${BASE_URL}/sitemap-legal-tools.xml`,
      `${BASE_URL}/sitemap-network.xml`,
      `${BASE_URL}/sitemap-real-estate.xml`,
    ],
    host: BASE_URL,
  }
}
