import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import URLShortenerClient from './URLShortenerClient'

export const metadata: Metadata = {
  title: `URL Shortener — Shorten Long URLs Free | RoughTools`,
  description: `Shorten long URLs instantly with a free URL shortener. Create short links with click tracking. No signup required.`,
  keywords: ['url shortener', 'link shortener', 'shorten url', 'short link generator', 'free url shortener'],
  alternates: { canonical: 'https://roughtools.com/tools/security/url-shortener' },
  openGraph: {
    title: `URL Shortener — Shorten Long URLs Free | RoughTools`,
    description: `Shorten long URLs instantly with a free URL shortener. Create short links with click tracking. No signup required.`,
    url: 'https://roughtools.com/tools/security/url-shortener',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `URL Shortener — Shorten Long URLs Free | RoughTools`,
    description: `Shorten long URLs instantly with a free URL shortener. Create short links with click tracking. No signup required.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'URL Shortener', item: 'https://roughtools.com/tools/security/url-shortener' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <URLShortenerClient />
    </>
  )
}
