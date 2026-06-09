import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import BarcodeGeneratorClient from './BarcodeGeneratorClient'

export const metadata: Metadata = {
  title: `Barcode Generator — Create Barcodes Online Free | RoughTools`,
  description: `Generate barcodes in Code 128, EAN-13, UPC-A, QR, and more formats instantly. Free online barcode generator — no signup required.`,
  keywords: ['barcode generator', 'create barcode online', 'code 128 generator', 'ean-13 barcode', 'free barcode maker'],
  alternates: { canonical: 'https://roughtools.com/tools/security/barcode-generator' },
  openGraph: {
    title: `Barcode Generator — Create Barcodes Online Free | RoughTools`,
    description: `Generate barcodes in Code 128, EAN-13, UPC-A, QR, and more formats instantly. Free online barcode generator — no signup required.`,
    url: 'https://roughtools.com/tools/security/barcode-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Barcode Generator — Create Barcodes Online Free | RoughTools`,
    description: `Generate barcodes in Code 128, EAN-13, UPC-A, QR, and more formats instantly. Free online barcode generator — no signup required.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'Barcode Generator', item: 'https://roughtools.com/tools/security/barcode-generator' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <BarcodeGeneratorClient />
    </>
  )
}
