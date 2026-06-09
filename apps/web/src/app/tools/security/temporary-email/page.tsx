import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import TemporaryEmailClient from './TemporaryEmailClient'

export const metadata: Metadata = {
  title: `Temporary Email — Disposable Email Address | RoughTools`,
  description: `Generate a disposable temporary email address to protect your privacy. Free throwaway email with inbox. No registration required.`,
  keywords: ['temporary email', 'disposable email', 'throwaway email', 'fake email generator', 'temp mail'],
  alternates: { canonical: 'https://roughtools.com/tools/security/temporary-email' },
  openGraph: {
    title: `Temporary Email — Disposable Email Address | RoughTools`,
    description: `Generate a disposable temporary email address to protect your privacy. Free throwaway email with inbox. No registration required.`,
    url: 'https://roughtools.com/tools/security/temporary-email',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Temporary Email — Disposable Email Address | RoughTools`,
    description: `Generate a disposable temporary email address to protect your privacy. Free throwaway email with inbox. No registration required.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'Temporary Email', item: 'https://roughtools.com/tools/security/temporary-email' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <TemporaryEmailClient />
    </>
  )
}
