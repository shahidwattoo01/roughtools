import type { Metadata } from 'next'
import NDAGeneratorClient from './NDAGeneratorClient'

export const metadata: Metadata = {
  title: `NDA Generator — Free Non-Disclosure Agreement | RoughTools`,
  description: `Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Export to PDF. Free online NDA generator.`,
  keywords: ['nda generator', 'non-disclosure agreement', 'confidentiality agreement', 'nda template', 'free nda maker'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/nda-generator' },
  openGraph: {
    title: `NDA Generator — Free Non-Disclosure Agreement | RoughTools`,
    description: `Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Export to PDF. Free online NDA generator.`,
    url: 'https://roughtools.com/tools/document-tools/nda-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `NDA Generator — Free Non-Disclosure Agreement | RoughTools`,
    description: `Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Export to PDF. Free online NDA generator.`,
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
      { '@type': 'ListItem', position: 3, name: 'NDA Generator', item: 'https://roughtools.com/tools/document-tools/nda-generator' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <NDAGeneratorClient />
    </>
  )
}
