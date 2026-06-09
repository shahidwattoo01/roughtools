import type { Metadata } from 'next'
import ProposalGeneratorClient from './ProposalGeneratorClient'

export const metadata: Metadata = {
  title: `Proposal Generator — Create Business Proposals Free | RoughTools`,
  description: `Create professional business proposals and project proposals online. Export to PDF. Free online proposal generator tool.`,
  keywords: ['proposal generator', 'business proposal template', 'project proposal generator', 'free proposal maker', 'create business proposal'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/proposal-generator' },
  openGraph: {
    title: `Proposal Generator — Create Business Proposals Free | RoughTools`,
    description: `Create professional business proposals and project proposals online. Export to PDF. Free online proposal generator tool.`,
    url: 'https://roughtools.com/tools/document-tools/proposal-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Proposal Generator — Create Business Proposals Free | RoughTools`,
    description: `Create professional business proposals and project proposals online. Export to PDF. Free online proposal generator tool.`,
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
      { '@type': 'ListItem', position: 3, name: 'Proposal Generator', item: 'https://roughtools.com/tools/document-tools/proposal-generator' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ProposalGeneratorClient />
    </>
  )
}
