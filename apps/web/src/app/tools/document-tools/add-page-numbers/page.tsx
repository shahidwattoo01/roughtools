import type { Metadata } from 'next'
import AddPageNumbersClient from './AddPageNumbersClient'

export const metadata: Metadata = {
  title: `Add Page Numbers to PDF — Free Online Tool | RoughTools`,
  description: `Add page numbers to PDF files online. Customize position, font, and starting number. Free browser-based PDF page numbering tool.`,
  keywords: ['add page numbers to pdf', 'pdf page numbering', 'number pdf pages online', 'free pdf page numbers', 'page number pdf tool'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/add-page-numbers' },
  openGraph: {
    title: `Add Page Numbers to PDF — Free Online Tool | RoughTools`,
    description: `Add page numbers to PDF files online. Customize position, font, and starting number. Free browser-based PDF page numbering tool.`,
    url: 'https://roughtools.com/tools/document-tools/add-page-numbers',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Add Page Numbers to PDF — Free Online Tool | RoughTools`,
    description: `Add page numbers to PDF files online. Customize position, font, and starting number. Free browser-based PDF page numbering tool.`,
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
      { '@type': 'ListItem', position: 3, name: 'Add Page Numbers to PDF', item: 'https://roughtools.com/tools/document-tools/add-page-numbers' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <AddPageNumbersClient />
    </>
  )
}
