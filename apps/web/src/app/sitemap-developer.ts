import { MetadataRoute } from 'next'
import { getToolsByCategory } from '@/lib/tools-registry'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const tools = getToolsByCategory('developer')

  return tools.map((tool) => ({
    url: `${BASE_URL}/tools/developer/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.priority ?? 0.8,
  }))
}