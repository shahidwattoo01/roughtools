import type { Metadata } from 'next'
import LegalToolsClient from './LegalToolsClient'

export const metadata: Metadata = {
  title: '8 Free Legal Document Generators — Privacy Policy, NDA, Contracts | Roughtools',
  description: 'Free legal document generators: privacy policy, terms of service, NDA, lease agreement, employment contract, cease and desist, last will, and power of attorney. No lawyer needed.',
  keywords: ['legal document generator', 'privacy policy generator', 'terms of service generator', 'nda generator', 'lease agreement generator', 'employment contract', 'will generator', 'power of attorney'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/legal-tools' },
  openGraph: {
    title: 'Free Legal Document Generators | Roughtools',
    description: 'Create professional legal documents for free — privacy policy, NDA, contracts, wills, and more. No lawyer required.',
    url: 'https://roughtools.com/tools/legal-tools',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '8 Free Legal Document Generators | Roughtools',
    description: 'Privacy policy, NDA, contracts, lease agreements, wills and more — all free, instant.',
  },
}

export default function LegalToolsPage() {
  return <LegalToolsClient />
}
