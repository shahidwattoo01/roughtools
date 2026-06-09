import type { Metadata } from 'next'
import DocumentToolsClient from './DocumentToolsClient'

export const metadata: Metadata = {
  title: '11 Free Document Creator Tools — Resume, Invoice, Contracts | Roughtools',
  description: 'Free professional document creator tools: resume builder, invoice generator, cover letter, business proposal, contract creator, NDA generator, meeting minutes, expense report, business letter, reference letter, and terms of service. No signup. 100% free.',
  keywords: ['document tools', 'resume builder', 'invoice generator', 'cover letter', 'pdf tools', 'merge pdf', 'pdf to word', 'nda generator', 'free document tools'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/document-tools' },
  openGraph: {
    title: '11 Free Document Creator Tools — Resume, Invoice, Contracts | Roughtools',
    description: 'Build resumes, generate invoices, draft contracts and NDAs, write business letters and proposals. All free, no signup required.',
    url: 'https://roughtools.com/tools/document-tools',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '11 Free Document Creator Tools | Roughtools',
    description: 'Resume builder, invoice generator, contracts, NDAs, business letters and more — all free.',
  },
}

export default function DocumentToolsPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Document Tools', item: 'https://roughtools.com/tools/document-tools' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <DocumentToolsClient />
    </>
  )
}
