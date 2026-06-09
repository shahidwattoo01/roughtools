/**
 * CalculatorSchema.tsx
 * Renders three JSON-LD blocks for every calculator page:
 *  1. SoftwareApplication
 *  2. FAQPage
 *  3. BreadcrumbList
 */

export interface CalculatorSchemaProps {
  name: string
  description: string
  url: string
  ratingValue?: string
  reviewCount?: string
  applicationCategory?: string
  faqs?: { q: string; a: string }[]
  /** Override breadcrumb trail — defaults to Home → Calculators → {name} */
  breadcrumbExtra?: { name: string; item: string }
}

export function CalculatorSchema({
  name,
  description,
  url,
  ratingValue = '4.8',
  reviewCount = '1024',
  applicationCategory = 'UtilitiesApplication',
  faqs = [],
  breadcrumbExtra,
}: CalculatorSchemaProps) {
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    },
  }

  const breadcrumbItems: object[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
  ]
  if (breadcrumbExtra) {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: breadcrumbExtra.name, item: breadcrumbExtra.item })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name, item: url })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name, item: url })
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  const faqPage = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  )
}
