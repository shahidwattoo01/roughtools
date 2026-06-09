import type { Metadata } from 'next'
import ContractCreatorClient from './ContractCreatorClient'

export const metadata: Metadata = {
  title: `Contract Creator — Create Business Contracts Free | RoughTools`,
  description: `Create professional business contracts and service agreements online. Export to PDF. Free contract creator with customizable templates.`,
  keywords: ['contract creator', 'contract generator', 'business contract template', 'service agreement generator', 'free contract maker'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/contract-creator' },
  openGraph: {
    title: `Contract Creator — Create Business Contracts Free | RoughTools`,
    description: `Create professional business contracts and service agreements online. Export to PDF. Free contract creator with customizable templates.`,
    url: 'https://roughtools.com/tools/document-tools/contract-creator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contract Creator — Create Business Contracts Free | RoughTools`,
    description: `Create professional business contracts and service agreements online. Export to PDF. Free contract creator with customizable templates.`,
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
      { '@type': 'ListItem', position: 3, name: 'Contract Creator', item: 'https://roughtools.com/tools/document-tools/contract-creator' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ContractCreatorClient />
    </>
  )
}
