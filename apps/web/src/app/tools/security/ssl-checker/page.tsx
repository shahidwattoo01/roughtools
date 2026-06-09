import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import SSLCheckerClient from './SSLCheckerClient'

export const metadata: Metadata = {
  title: `SSL Certificate Checker — Check SSL Validity Online | RoughTools`,
  description: `Check SSL certificate validity, expiry date, issuer, and SAN entries for any domain. Free online SSL certificate checker tool.`,
  keywords: ['ssl checker', 'ssl certificate checker', 'ssl validity checker', 'check ssl certificate', 'ssl expiry checker'],
  alternates: { canonical: 'https://roughtools.com/tools/security/ssl-checker' },
  openGraph: {
    title: `SSL Certificate Checker — Check SSL Validity Online | RoughTools`,
    description: `Check SSL certificate validity, expiry date, issuer, and SAN entries for any domain. Free online SSL certificate checker tool.`,
    url: 'https://roughtools.com/tools/security/ssl-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `SSL Certificate Checker — Check SSL Validity Online | RoughTools`,
    description: `Check SSL certificate validity, expiry date, issuer, and SAN entries for any domain. Free online SSL certificate checker tool.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'SSL Certificate Checker', item: 'https://roughtools.com/tools/security/ssl-checker' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SSLCheckerClient />
    </>
  )
}
