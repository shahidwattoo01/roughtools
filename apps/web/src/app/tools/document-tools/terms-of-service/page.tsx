import type { Metadata } from 'next'
import TermsOfServiceGeneratorClient from './TermsOfServiceGeneratorClient'

export const metadata: Metadata = {
  title: `Terms of Service Generator — Free ToS Creator | RoughTools`,
  description: `Generate terms of service for your website or app. Customizable template with key clauses. Free online terms of service generator.`,
  keywords: ['terms of service generator', 'terms of service template', 'tos generator', 'website terms generator', 'free tos creator'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/terms-of-service' },
  openGraph: {
    title: `Terms of Service Generator — Free ToS Creator | RoughTools`,
    description: `Generate terms of service for your website or app. Customizable template with key clauses. Free online terms of service generator.`,
    url: 'https://roughtools.com/tools/document-tools/terms-of-service',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terms of Service Generator — Free ToS Creator | RoughTools`,
    description: `Generate terms of service for your website or app. Customizable template with key clauses. Free online terms of service generator.`,
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
      { '@type': 'ListItem', position: 3, name: 'Terms of Service Generator', item: 'https://roughtools.com/tools/document-tools/terms-of-service' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <TermsOfServiceGeneratorClient />
    </>
  )
}
