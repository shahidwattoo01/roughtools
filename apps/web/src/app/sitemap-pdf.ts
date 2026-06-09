import { MetadataRoute } from 'next'
import { pdfTools } from '@/data/pdfTools'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return pdfTools.map((tool) => ({
    url: tool.canonicalUrl,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
}
