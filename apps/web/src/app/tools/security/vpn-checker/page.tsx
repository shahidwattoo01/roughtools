import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import VPNCheckerClient from './VPNCheckerClient'

export const metadata: Metadata = {
  title: `VPN Checker — Check if Your VPN is Working | RoughTools`,
  description: `Check if your VPN is active and verify your IP address, location, and DNS leak status. Free online VPN detector and checker.`,
  keywords: ['vpn checker', 'vpn detector', 'dns leak test', 'vpn ip check', 'check vpn connection'],
  alternates: { canonical: 'https://roughtools.com/tools/security/vpn-checker' },
  openGraph: {
    title: `VPN Checker — Check if Your VPN is Working | RoughTools`,
    description: `Check if your VPN is active and verify your IP address, location, and DNS leak status. Free online VPN detector and checker.`,
    url: 'https://roughtools.com/tools/security/vpn-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `VPN Checker — Check if Your VPN is Working | RoughTools`,
    description: `Check if your VPN is active and verify your IP address, location, and DNS leak status. Free online VPN detector and checker.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'VPN Checker', item: 'https://roughtools.com/tools/security/vpn-checker' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <VPNCheckerClient />
    </>
  )
}
