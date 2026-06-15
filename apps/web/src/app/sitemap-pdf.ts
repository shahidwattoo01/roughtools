import { MetadataRoute } from 'next'
import { pdfTools } from '@/data/pdfTools'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return pdfTools.map((tool) => ({
    url: tool.canonicalUrl,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
}
