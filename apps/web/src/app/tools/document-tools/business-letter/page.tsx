import type { Metadata } from 'next'
import BusinessLetterGeneratorClient from './BusinessLetterGeneratorClient'

export const metadata: Metadata = {
  title: `Business Letter Generator — Professional Letter Template | RoughTools`,
  description: `Create professional business letters with proper formatting and templates. Export to PDF. Free online business letter generator.`,
  keywords: ['business letter generator', 'professional letter template', 'business letter format', 'formal letter generator', 'free letter maker'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/business-letter' },
  openGraph: {
    title: `Business Letter Generator — Professional Letter Template | RoughTools`,
    description: `Create professional business letters with proper formatting and templates. Export to PDF. Free online business letter generator.`,
    url: 'https://roughtools.com/tools/document-tools/business-letter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Business Letter Generator — Professional Letter Template | RoughTools`,
    description: `Create professional business letters with proper formatting and templates. Export to PDF. Free online business letter generator.`,
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
      { '@type': 'ListItem', position: 3, name: 'Business Letter Generator', item: 'https://roughtools.com/tools/document-tools/business-letter' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BusinessLetterGeneratorClient />
    </>
  )
}
