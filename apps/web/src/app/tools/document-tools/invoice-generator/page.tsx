import type { Metadata } from 'next'
import InvoiceGeneratorClient from './InvoiceGeneratorClient'

export const metadata: Metadata = {
  title: `Invoice Generator — Create Professional Invoices Free | RoughTools`,
  description: `Create professional invoices with customizable templates, line items, tax, and discounts. Export to PDF. Free online invoice generator.`,
  keywords: ['invoice generator', 'free invoice maker', 'invoice template', 'create invoice online', 'professional invoice creator'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/invoice-generator' },
  openGraph: {
    title: `Invoice Generator — Create Professional Invoices Free | RoughTools`,
    description: `Create professional invoices with customizable templates, line items, tax, and discounts. Export to PDF. Free online invoice generator.`,
    url: 'https://roughtools.com/tools/document-tools/invoice-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Invoice Generator — Create Professional Invoices Free | RoughTools`,
    description: `Create professional invoices with customizable templates, line items, tax, and discounts. Export to PDF. Free online invoice generator.`,
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Document Tools', item: 'https://roughtools.com/tools/document-tools' },
      { '@type': 'ListItem', position: 3, name: 'Invoice Generator', item: 'https://roughtools.com/tools/document-tools/invoice-generator' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <InvoiceGeneratorClient />
    </>
  )
}
