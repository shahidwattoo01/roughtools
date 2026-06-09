import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { TOTAL_CALC_COUNT, CALC_SUBCATEGORIES } from './_components/calculator-tool-configs'
import CalculatorsPageClient from './_components/CalculatorsPageClient'

const SITE      = 'https://roughtools.com'
const CANONICAL = `${SITE}/tools/calculators`

export const metadata: Metadata = {
  title: `Free Online Calculators — Finance, Health, Math & More | RoughTools`,
  description:
    `${TOTAL_CALC_COUNT}+ free calculators for mortgage, BMI, loan, compound interest, tax, retirement, percentage, pregnancy due date, GPA, and more. No signup. Instant results. 100% private.`,
  keywords: [
    'free online calculators', 'free mortgage calculator', 'free bmi calculator', 'free loan calculator',
    'compound interest calculator', 'percentage calculator', 'tax calculator', 'retirement calculator',
    'free calorie calculator', 'pregnancy due date calculator', 'roughtools calculators',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `Free Online Calculators — Finance, Health, Math & More | RoughTools`,
    description: `${TOTAL_CALC_COUNT}+ free financial, health, and math calculators. No signup. 100% private.`,
    url: CANONICAL, type: 'website', siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Free Online Calculators | RoughTools`,
    description: `Mortgage, BMI, loan, tax, and ${TOTAL_CALC_COUNT}+ more free calculators. Instant results.`,
  },
  robots: { index: true, follow: true },
}

// Build hasPart array from all calculators
const allCalcUrls = CALC_SUBCATEGORIES.flatMap(sc =>
  sc.tools.map(t => ({
    '@type': 'WebApplication',
    url: `${SITE}/tools/calculators/${t.slug}`,
    name: t.name,
  }))
)

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Online Calculators — Finance, Health, Math & More',
    description: `${TOTAL_CALC_COUNT}+ free browser-based calculators for finance, health, math, and everyday use. No signup required.`,
    url: CANONICAL,
    provider: { '@type': 'Organization', name: 'RoughTools', url: SITE },
    numberOfItems: TOTAL_CALC_COUNT,
    hasPart: allCalcUrls,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Are all calculators free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, 100% free with no signup required.' } },
      { '@type': 'Question', name: 'Is my data private?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. All calculations run in your browser. No data is transmitted to any server.' } },
      { '@type': 'Question', name: 'Do these work on mobile?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, all calculators are fully responsive and work on any mobile device.' } },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',        item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: CANONICAL },
    ],
  },
]

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <CalculatorsPageClient />
    </>
  )
}
