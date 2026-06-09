import type { Metadata } from 'next'
import { generateCategoryMetadata } from '@/lib/seo'
import { getToolsByCategory } from '@/lib/tools-registry'
import { getCategoryPageSchema } from '@/lib/structured-data'
import { CATEGORY_SEO } from '@/lib/seo-config'

// Exported metadata for Next.js App Router
export const metadata: Metadata = generateCategoryMetadata('pdf')

// Schema for structured data (used in the page component)
export function getPdfCategorySchema() {
  const tools = getToolsByCategory('pdf')
  const seo = CATEGORY_SEO['pdf']
  return getCategoryPageSchema('pdf', seo.title, seo.description, tools)
}