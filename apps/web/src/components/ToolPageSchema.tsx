/**
 * ToolPageSchema.tsx
 *
 * Drop-in structured data component for tool pages.
 * Generates WebApplication + FAQPage + HowTo + BreadcrumbList JSON-LD
 * from a single configuration object.
 *
 * Usage on any tool page:
 *
 *   import ToolPageSchema from '@/components/ToolPageSchema'
 *
 *   <ToolPageSchema
 *     name="BMI Calculator"
 *     slug="calculators/bmi-calculator"
 *     description="Free BMI calculator..."
 *     category="Calculators"
 *     categorySlug="calculators"
 *     appCategory="HealthApplication"
 *     howToSteps={[{ name: '...', text: '...' }]}
 *     faqItems={[{ q: '...', a: '...' }]}
 *   />
 */

import { JsonLd } from '@/components/JsonLd'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HowToStep {
  name: string
  text: string
}

interface FAQItem {
  q: string
  a: string
}

interface ToolPageSchemaProps {
  /** Tool display name, e.g. "BMI Calculator" */
  name: string
  /** URL path after /tools/, e.g. "calculators/bmi-calculator" */
  slug: string
  /** Tool description (same as meta description) */
  description: string
  /** Human-readable category, e.g. "Calculators" */
  category: string
  /** URL-segment category, e.g. "calculators" */
  categorySlug: string
  /**
   * Schema.org applicationCategory value.
   * Common values: HealthApplication, FinanceApplication, UtilitiesApplication,
   * DeveloperApplication, EducationApplication, MultimediaApplication
   * @default "UtilitiesApplication"
   */
  appCategory?: string
  /** How-to steps for HowTo schema (optional but recommended) */
  howToSteps?: HowToStep[]
  /** FAQ items for FAQPage schema (optional but recommended) */
  faqItems?: FAQItem[]
  /** Estimated time to complete the how-to, in ISO 8601 duration, e.g. "PT2M" */
  howToTime?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToolPageSchema({
  name,
  slug,
  description,
  category,
  categorySlug,
  appCategory = 'UtilitiesApplication',
  howToSteps,
  faqItems,
  howToTime = 'PT1M',
}: ToolPageSchemaProps) {
  const url = `${BASE_URL}/tools/${slug}`
  const schemas: object[] = []

  // ── WebApplication ────────────────────────────────────────────────────────
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    description,
    applicationCategory: appCategory,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      name: 'RoughTools',
      url: BASE_URL,
    },
  })

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',            item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: category,          item: `${BASE_URL}/tools/${categorySlug}` },
      { '@type': 'ListItem', position: 3, name,                    item: url },
    ],
  })

  // ── HowTo ─────────────────────────────────────────────────────────────────
  if (howToSteps && howToSteps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Use ${name}`,
      description: `Step-by-step guide for using the free ${name} tool.`,
      totalTime: howToTime,
      tool: { '@type': 'HowToTool', name },
      step: howToSteps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
        url: `${url}#step-${i + 1}`,
      })),
    })
  }

  // ── FAQPage ───────────────────────────────────────────────────────────────
  if (faqItems && faqItems.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    })
  }

  return <JsonLd data={schemas} />
}
