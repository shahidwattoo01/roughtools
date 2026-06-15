import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { LEGAL_CONFIGS } from '../_components/legal-configs'
import LegalToolShell from '../_components/LegalToolShell'
import EmploymentClient from './EmploymentClient'

const config = LEGAL_CONFIGS['employment-contract-generator']
const TOOL_SLUG = 'employment-contract-generator'
const TOOL_NAME = 'Employment Contract Generator'
const TOOL_URL = `https://roughtools.com/tools/legal-tools/${TOOL_SLUG}`

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: TOOL_URL,
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: config.metaTitle,
    description: config.metaDescription,
  },
  robots: { index: true, follow: true },
}

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: TOOL_NAME,
    url: TOOL_URL,
    applicationCategory: 'LegalApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Legal Tools', item: 'https://roughtools.com/tools/legal-tools' },
      { '@type': 'ListItem', position: 3, name: TOOL_NAME, item: TOOL_URL },
    ],
  },
]

export default function EmploymentContractPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <LegalToolShell toolSlug={TOOL_SLUG} toolName={TOOL_NAME}>
        <EmploymentClient />
      </LegalToolShell>
    </>
  )
}


