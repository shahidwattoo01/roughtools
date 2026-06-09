import type { Metadata } from 'next'
import CoverLetterBuilderClient from './CoverLetterBuilderClient'

export const metadata: Metadata = {
  title: `Cover Letter Builder — Create Cover Letters Free | RoughTools`,
  description: `Build a professional cover letter with customizable templates. Export to PDF. Free online cover letter builder — no signup required.`,
  keywords: ['cover letter builder', 'cover letter generator', 'free cover letter maker', 'cover letter template', 'create cover letter online'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/cover-letter-builder' },
  openGraph: {
    title: `Cover Letter Builder — Create Cover Letters Free | RoughTools`,
    description: `Build a professional cover letter with customizable templates. Export to PDF. Free online cover letter builder — no signup required.`,
    url: 'https://roughtools.com/tools/document-tools/cover-letter-builder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Cover Letter Builder — Create Cover Letters Free | RoughTools`,
    description: `Build a professional cover letter with customizable templates. Export to PDF. Free online cover letter builder — no signup required.`,
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
      { '@type': 'ListItem', position: 3, name: 'Cover Letter Builder', item: 'https://roughtools.com/tools/document-tools/cover-letter-builder' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CoverLetterBuilderClient />
    </>
  )
}
