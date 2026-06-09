import type { Metadata } from 'next'
import ReferenceLetterGeneratorClient from './ReferenceLetterGeneratorClient'

export const metadata: Metadata = {
  title: `Reference Letter Generator — Free Reference Letter | RoughTools`,
  description: `Create professional reference and recommendation letters online. Export to PDF. Free reference letter generator tool.`,
  keywords: ['reference letter generator', 'recommendation letter template', 'reference letter template', 'create reference letter', 'free letter generator'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/reference-letter' },
  openGraph: {
    title: `Reference Letter Generator — Free Reference Letter | RoughTools`,
    description: `Create professional reference and recommendation letters online. Export to PDF. Free reference letter generator tool.`,
    url: 'https://roughtools.com/tools/document-tools/reference-letter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Reference Letter Generator — Free Reference Letter | RoughTools`,
    description: `Create professional reference and recommendation letters online. Export to PDF. Free reference letter generator tool.`,
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
      { '@type': 'ListItem', position: 3, name: 'Reference Letter Generator', item: 'https://roughtools.com/tools/document-tools/reference-letter' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ReferenceLetterGeneratorClient />
    </>
  )
}
