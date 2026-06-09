/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import WhoisLookupClient from './WhoisLookupClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'WHOIS Lookup — Domain Registration Info | RoughTools',
  description: 'Look up WHOIS information for any domain. Find registrar, registration date, expiry date, and nameservers via trusted WHOIS services — free, instant, no signup required.',
  keywords: ['whois lookup', 'domain whois', 'domain registration', 'who owns domain', 'domain expiry', 'domain registrar lookup', 'whois search'],
  alternates: { canonical: 'https://roughtools.com/tools/network/whois-lookup' },
  openGraph: {
    title: `WHOIS Lookup — Domain Registration Info | RoughTools`,
    description: `Look up WHOIS registration information for any domain. Find owner, registrar, expiry date, and nameservers. Free tool.`,
    url: 'https://roughtools.com/tools/network/whois-lookup',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `WHOIS Lookup — Domain Registration Info | RoughTools`,
    description: `Look up WHOIS registration information for any domain. Find owner, registrar, expiry date, and nameservers. Free tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the WHOIS Lookup tool free to use?',
    a: 'Yes, the WHOIS Lookup tool on RoughTools is completely free with no subscription, usage limits, or premium tier. You can look up WHOIS registration data for unlimited domains at no cost. RoughTools is supported through non-intrusive advertising, which keeps every tool on the platform permanently free for domain investors, webmasters, security researchers, and IT professionals worldwide.',
  },
  {
    q: 'Do I need to create an account to look up domain WHOIS data?',
    a: 'No account or registration is required. Open the WHOIS Lookup tool, type a domain name, and click through to a pre-filled WHOIS search with one click. There is no email address, password, or profile needed at any point. RoughTools is built for fast, frictionless access to domain registration information without any sign-up barrier.',
  },
  {
    q: 'Does this tool store or log the domains I look up?',
    a: 'RoughTools does not store or log the domain names you enter into the lookup tool. When you click through to ICANN or another WHOIS service, those external services process your query under their own privacy policies. No query history is retained on RoughTools servers. You can use this tool freely to investigate domains for security research, due diligence, or brand monitoring.',
  },
  {
    q: 'Does the WHOIS Lookup tool work on mobile phones and tablets?',
    a: 'Yes. The WHOIS Lookup tool is fully responsive and works correctly on smartphones, tablets, and desktop computers. The domain input and lookup buttons adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. The tool opens external WHOIS services in a new tab, which works on all mobile browsers that support standard tab navigation.',
  },
  {
    q: 'Which browsers support this WHOIS lookup tool?',
    a: 'The WHOIS Lookup tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool is built with standard HTML and JavaScript that work in every modern browser. Internet Explorer is not supported, as it has been end-of-life since June 2022. Any browser updated after 2016 will work correctly with this tool.',
  },
  {
    q: 'How accurate is the WHOIS data returned for a domain?',
    a: 'The WHOIS data is retrieved from the authoritative ICANN WHOIS service and IANA-accredited registrar databases, which are the most accurate sources available. Accuracy depends on what information the domain registrant provided at registration and whether they enabled privacy protection. Registration dates, expiry dates, registrar names, and nameserver records are typically accurate. Contact information may be hidden or replaced by privacy protection proxy details for many domains registered after 2018.',
  },
  {
    q: 'Can I use the WHOIS Lookup tool offline?',
    a: 'No. WHOIS lookups require a live internet connection because the tool must connect to external WHOIS registry servers to retrieve domain registration data. WHOIS is inherently a network protocol — it cannot function without querying a remote database. If you need to perform WHOIS lookups from the command line, use the whois command on Linux or macOS: run whois example.com in your terminal to query the registry directly.',
  },
  {
    q: 'How do I look up WHOIS data for a domain? Step-by-step.',
    a: 'Looking up domain WHOIS information is simple. Step one: open the WHOIS Lookup page on RoughTools. Step two: type the domain name you want to check into the input field — for example, example.com (without http:// or www). Step three: click the WHOIS Lookup button to launch the search on the authoritative ICANN WHOIS service with your domain pre-filled. Step four: on the WHOIS results page, review the registrar, registration date, expiry date, nameservers, and any available registrant contact information.',
  },
  {
    q: 'Why use RoughTools WHOIS Lookup instead of other websites?',
    a: 'RoughTools routes you to the ICANN official WHOIS service — the most authoritative source for domain registration data — with your domain pre-filled, saving you from copying and pasting. The tool is clean and fast, without the aggressive upsell prompts and distracting ads that many WHOIS sites display. It is a focused utility that gets you to the registration data you need in one click without distraction.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest an improvement. If the tool is not correctly routing to WHOIS services or the domain you entered is being malformed, include the domain name and what happened. Feature requests — such as support for additional WHOIS services, bulk domain lookup, or expiry date tracking — are welcome and reviewed by the development team for future releases.',
  },
  {
    q: 'What is WHOIS and what information does it show?',
    a: 'WHOIS (pronounced "who is") is a query-and-response protocol defined in RFC 3912 that retrieves public registration records for internet resources including domain names and IP address blocks. A WHOIS record for a domain typically includes the registrant\'s name and contact information (or a privacy proxy), the domain registrar, the registration date, the expiry date, the last update date, the domain\'s nameservers, and the current status of the domain registration. WHOIS data is publicly mandated by ICANN for all generic top-level domains.',
  },
  {
    q: 'Why is WHOIS data sometimes hidden or replaced with privacy information?',
    a: 'Domain privacy protection (also called WHOIS privacy or proxy registration) replaces the registrant\'s personal contact details — name, email, phone number, and address — with generic contact information belonging to the registrar\'s privacy service. Registrants opt in to this service to protect personal information from spam, phishing, and harassment. Privacy protection became much more common after GDPR regulations took effect in May 2018, as European registrants are legally entitled to have personal data protected from public exposure.',
  },
  {
    q: 'What does the domain expiry date mean and what happens if it expires?',
    a: 'The domain expiry date is when the current registration period ends. If the registrant does not renew the domain before this date, the registration lapses. Most registrars offer a grace period of 0–45 days during which the registrant can still renew at the standard price. After the grace period, the domain enters a redemption period during which reclaiming it costs significantly more. After the redemption period — typically 30 days — the domain is deleted from the registry and becomes available for anyone to register. Domain expiry is closely monitored by domain investors who watch for valuable expired domains.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WHOIS Domain Lookup',
  url: 'https://roughtools.com/tools/network/whois-lookup',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Look up WHOIS registration data for any domain — registrar, registration date, expiry date, and nameservers. Routes to ICANN WHOIS with domain pre-filled. Free.',
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
    { '@type': 'ListItem', position: 3, name: 'WHOIS Lookup', item: 'https://roughtools.com/tools/network/whois-lookup' },
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
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> › WHOIS Lookup
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>WHOIS Lookup</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Find domain registration information — registrar, creation date, expiry date, nameservers, and registrant details. Enter a domain name and launch a WHOIS search via the ICANN authoritative registry in one click. Useful for domain due diligence, security research, and monitoring expiry dates. Free, no account required.
        </p>
        <WhoisLookupClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About WHOIS Lookup</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            WHOIS is a query-and-response protocol that retrieves registration data for internet resources like domain names and IP address blocks. It reveals who registered a domain, the registrar they used, the registration and expiry dates, and which nameservers the domain is delegated to. WHOIS data is publicly mandated by ICANN for all generic top-level domains, making it an essential tool for security research, domain due diligence, and abuse reporting.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            Because WHOIS queries require raw TCP connections to WHOIS servers on port 43, browsers cannot perform them directly. This tool routes you to the ICANN official WHOIS service with your domain pre-filled so you get authoritative results in one click. ICANN&apos;s lookup has direct access to registrar data and provides the most up-to-date registration information available.
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
              { name: 'DNS Lookup', href: '/tools/network/dns-lookup', desc: 'Query DNS records' },
              { name: 'HTTP Headers Checker', href: '/tools/network/http-headers-checker', desc: 'Inspect HTTP response headers' },
              { name: 'Ping Tool', href: '/tools/network/ping-tool', desc: 'Test website connectivity' },
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
          toolName="WHOIS Lookup"
          toolSlug="whois-lookup"
          toolUrl="https://roughtools.com/tools/network/whois-lookup"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
