import type { Metadata } from 'next'
import NetworkClient from './NetworkClient'

export const metadata: Metadata = {
  title: '7 Free Network Tools — DNS Lookup, WHOIS, Port Checker & More | Roughtools',
  description: 'Free network diagnostic tools: DNS lookup, WHOIS lookup, IP address checker, port checker, ping tool, HTTP headers checker, and website speed test. No signup required.',
  keywords: ['network tools', 'dns lookup', 'whois lookup', 'ip checker', 'port checker', 'ping tool', 'http headers checker', 'website speed test'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/network' },
  openGraph: {
    title: '7 Free Network Tools — DNS, WHOIS, Port Checker & More | Roughtools',
    description: 'DNS lookup, WHOIS, IP checker, port checker, ping, HTTP headers, and website speed test — all free, no signup.',
    url: 'https://roughtools.com/tools/network',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '7 Free Network Tools | Roughtools',
    description: 'DNS lookup, WHOIS, port checker, ping, HTTP headers, and speed test — free.',
  },
}

export default function NetworkPage() {
  return <NetworkClient />
}
