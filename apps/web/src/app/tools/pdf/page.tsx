import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import PDFPageClient from './_components/PDFPageClient'
import { pdfTools } from '@/data/pdfTools'

const SITE = 'https://roughtools.com'
const CANONICAL = `${SITE}/tools/pdf`

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Free PDF Tools Online — No Signup Required | RoughTools',
  description:
    '31 free PDF tools: compress, merge, split, convert PDF to Word/Excel/JPG/PNG, edit, protect, sign, OCR, and more. No signup. No watermark. Files deleted in 1 hour.',
  keywords: [
    'free pdf tools', 'online pdf converter', 'compress pdf', 'merge pdf',
    'split pdf', 'pdf to word', 'word to pdf', 'pdf editor online',
    'pdf tools no signup', 'roughtools pdf',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free PDF Tools Online — No Signup Required | RoughTools',
    description: '31 free PDF tools — convert, compress, merge, split, protect and more. No account needed.',
    url: CANONICAL,
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Tools Online | RoughTools',
    description: '31 free PDF tools — compress, merge, convert, split, protect and more.',
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
}

// ─── Structured Data ──────────────────────────────────────────
const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free PDF Tools Online — No Signup Required',
    url: CANONICAL,
    description: '31 free online PDF tools: compress, merge, split, convert, protect, sign, OCR and more. No signup required.',
    provider: { '@type': 'Organization', name: 'RoughTools', url: SITE },
    numberOfItems: 31,
    hasPart: pdfTools.map(t => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      url: t.canonicalUrl,
      applicationCategory: 'UtilitiesApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'PDF Tools', item: CANONICAL },
    ],
  },
]

export default function PDFToolsPage() {
  return (
    <>
      <JsonLd data={schemas} />
      <PDFPageClient />
    </>
  )
}
