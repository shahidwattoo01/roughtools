/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import DnsLookupClient from './DnsLookupClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'DNS Lookup Tool — Free Online DNS Record Checker | RoughTools',
  description: 'Look up DNS records for any domain instantly. Check A, AAAA, CNAME, MX, TXT, NS, and SOA records using Google\'s public DNS API. Free, no signup, results in seconds.',
  keywords: ['dns lookup', 'dns checker', 'check dns records', 'mx record lookup', 'a record lookup', 'txt record checker', 'cname lookup', 'ns lookup'],
  alternates: { canonical: 'https://roughtools.com/tools/network/dns-lookup' },
  openGraph: {
    title: `DNS Lookup — Query DNS Records Online | RoughTools`,
    description: `Look up DNS records for any domain: A, AAAA, MX, TXT, NS, CNAME. Free online DNS lookup and query tool.`,
    url: 'https://roughtools.com/tools/network/dns-lookup',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `DNS Lookup — Query DNS Records Online | RoughTools`,
    description: `Look up DNS records for any domain: A, AAAA, MX, TXT, NS, CNAME. Free online DNS lookup and query tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the DNS Lookup tool free to use?',
    a: 'Yes, the DNS Lookup tool on RoughTools is completely free with no subscription, usage limits, or premium tiers. You can look up DNS records for unlimited domains at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for developers, system administrators, webmasters, and IT professionals worldwide.',
  },
  {
    q: 'Do I need to create an account to check DNS records?',
    a: 'No account or registration is required. Open the DNS Lookup tool, type a domain name, select the record type you want, and get results instantly. There is no email address needed, no password to set, and no profile to create. RoughTools is designed for IT professionals who need fast answers without unnecessary barriers.',
  },
  {
    q: 'Does this tool store or log the domains I look up?',
    a: 'RoughTools does not log the domains you query. DNS queries are sent to Google\'s Public DNS-over-HTTPS API (dns.google) directly from your browser. Google\'s DNS-over-HTTPS service has its own privacy policy regarding query logging, but no query data is stored on RoughTools servers. Use this tool freely to audit domains, troubleshoot email delivery, and verify DNS configurations.',
  },
  {
    q: 'Does the DNS Lookup tool work on mobile phones and tablets?',
    a: 'Yes. The DNS Lookup tool is fully responsive and works correctly on smartphones, tablets, and desktop computers. The domain input and record type selector adapt to smaller screens, and results display clearly on all device sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any app installation.',
  },
  {
    q: 'Which browsers support this DNS lookup tool?',
    a: 'The DNS Lookup tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses the Fetch API to query Google\'s DNS-over-HTTPS endpoint, which is supported in every modern browser. Internet Explorer is not supported, as it has been end-of-life since 2022 and lacks the modern JavaScript features this tool requires.',
  },
  {
    q: 'How accurate are the DNS results this tool returns?',
    a: 'Results reflect what Google\'s Public DNS resolvers (8.8.8.8 / 8.8.4.4) return at the moment of the query, including current TTL values. Because Google\'s resolvers cache records according to their TTL, results may be up to TTL seconds behind the authoritative nameserver. For the most up-to-date view of a record immediately after a DNS change, query the domain\'s authoritative nameserver directly using the dig or nslookup command-line tools.',
  },
  {
    q: 'Can I use the DNS Lookup tool offline?',
    a: 'No. DNS lookups require a live internet connection because the tool must query Google\'s DNS-over-HTTPS API to retrieve records. The tool cannot function offline since DNS resolution is inherently a network operation. If you need offline DNS lookup capability, use the dig or nslookup command-line utilities available on Linux, macOS, and Windows, which query DNS directly from your system.',
  },
  {
    q: 'How do I look up DNS records? Step-by-step guide.',
    a: 'Using the DNS Lookup tool takes under 10 seconds. Step one: open the DNS Lookup page on RoughTools. Step two: type the domain name you want to check into the input field — for example, example.com (without http:// or www). Step three: select the DNS record type from the dropdown — choose A for the IP address, MX for mail servers, TXT for verification records, CNAME for aliases, or NS for nameservers. Step four: click the Lookup button. Step five: review the returned records, including the value and TTL for each entry.',
  },
  {
    q: 'Why use RoughTools DNS Lookup instead of other websites?',
    a: 'RoughTools queries Google\'s Public DNS-over-HTTPS API directly from your browser, which means no server-side relay, no additional latency, and results that reflect what the world\'s most widely used DNS resolver sees. The interface supports all major record types — A, AAAA, CNAME, MX, TXT, NS, SOA — in a single lookup without switching tabs. The page loads fast and results appear instantly.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Use the Contact page on RoughTools to report issues or request new record types and features. When reporting a bug, include the domain name that caused the problem, the record type you selected, your browser and operating system, and a description of what you expected versus what you received. The team reviews all feedback and uses it to prioritize improvements in future releases.',
  },
  {
    q: 'What is a DNS record and how does DNS work?',
    a: 'DNS (Domain Name System) is the internet\'s distributed phonebook, translating human-readable domain names like example.com into the IP addresses that computers use to communicate. DNS records are entries stored in a zone file on authoritative nameservers. When you type a domain in your browser, your device queries a resolver (like Google\'s 8.8.8.8), which locates the authoritative nameserver for that domain and retrieves the relevant record, returning the answer to your device.',
  },
  {
    q: 'What is an MX record and why does it matter for email?',
    a: 'An MX (Mail Exchanger) record specifies which mail servers are responsible for receiving email sent to a domain. Without correctly configured MX records, email sent to addresses at your domain will fail to deliver. Each MX record has a priority value — lower numbers mean higher priority. Many domains have multiple MX records pointing to different mail servers for redundancy, so that if the primary server is unreachable, email is delivered to a backup server.',
  },
  {
    q: 'How long do DNS changes take to propagate worldwide?',
    a: 'DNS propagation time depends primarily on the TTL (Time to Live) value of the record being changed. A record with a TTL of 3600 seconds (one hour) may take up to one hour to update on all resolvers that cached the old value. Changes can take anywhere from a few minutes for records with very low TTLs to 48 hours for records with high TTLs or for resolvers that do not respect TTL values. Lowering the TTL before making a planned DNS change is a common practice to speed up propagation.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'DNS Lookup Tool',
  url: 'https://roughtools.com/tools/network/dns-lookup',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Look up A, AAAA, CNAME, MX, TXT, NS, and SOA DNS records for any domain using Google\'s public DNS API. Free, instant, no signup.',
}
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Network Tools', item: 'https://roughtools.com/tools/network' },
    { '@type': 'ListItem', position: 3, name: 'DNS Lookup', item: 'https://roughtools.com/tools/network/dns-lookup' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 64px' }}>
        <ToolAdUnit position="top" />
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> › DNS Lookup
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>DNS Lookup</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Check DNS records for any domain — A, AAAA, CNAME, MX, TXT, NS, and SOA — powered by Google Public DNS. Verify DNS propagation, diagnose email delivery problems, audit CDN configurations, and inspect nameserver assignments in seconds. Free, no account required.
        </p>
        <DnsLookupClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About DNS Lookup</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            The Domain Name System is the internet&apos;s phonebook, translating human-readable domain names into the IP addresses that computers use to communicate. This tool queries Google&apos;s Public DNS-over-HTTPS API (dns.google) to fetch live DNS records for any domain you enter, letting you inspect exactly how a domain is configured without installing any command-line tools like nslookup or dig.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Use this tool to verify that your DNS changes have propagated, diagnose email delivery issues by checking MX and SPF records, confirm CDN configurations through CNAME records, or audit a domain&apos;s nameserver assignments. The results reflect what Google&apos;s resolvers see — a useful reference point since billions of users rely on Google&apos;s 8.8.8.8 resolver daily.
          </p>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--fg)' }}>{q}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: 0, lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </section>
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Related Network Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { name: 'IP Checker', href: '/tools/network/ip-checker', desc: 'Find your public IP address' },
              { name: 'WHOIS Lookup', href: '/tools/network/whois-lookup', desc: 'Domain registration info' },
              { name: 'HTTP Headers Checker', href: '/tools/network/http-headers-checker', desc: 'Inspect HTTP response headers' },
              { name: 'Port Checker', href: '/tools/network/port-checker', desc: 'Check open ports' },
              { name: 'Website Speed Test', href: '/tools/network/website-speed-test', desc: 'Test page load speed' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="DNS Lookup"
          toolSlug="dns-lookup"
          toolUrl="https://roughtools.com/tools/network/dns-lookup"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
