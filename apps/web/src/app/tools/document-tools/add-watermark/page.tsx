import type { Metadata } from 'next'
import AddWatermarkClient from './AddWatermarkClient'

export const metadata: Metadata = {
  title: `Add Watermark to PDF — Free Online Watermark Tool | RoughTools`,
  description: `Add text or image watermarks to PDF files online. Customize position, opacity, and rotation. Free PDF watermark tool.`,
  keywords: ['add watermark to pdf', 'pdf watermark tool', 'watermark pdf online', 'free pdf watermarker', 'stamp pdf online'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/add-watermark' },
  openGraph: {
    title: `Add Watermark to PDF — Free Online Watermark Tool | RoughTools`,
    description: `Add text or image watermarks to PDF files online. Customize position, opacity, and rotation. Free PDF watermark tool.`,
    url: 'https://roughtools.com/tools/document-tools/add-watermark',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Add Watermark to PDF — Free Online Watermark Tool | RoughTools`,
    description: `Add text or image watermarks to PDF files online. Customize position, opacity, and rotation. Free PDF watermark tool.`,
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
      { '@type': 'ListItem', position: 3, name: 'Add Watermark to PDF', item: 'https://roughtools.com/tools/document-tools/add-watermark' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <AddWatermarkClient />
    </>
  )
}
