/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import IpCheckerClient from './IpCheckerClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'What Is My IP Address? | Free IP Checker & Lookup | RoughTools',
  description: 'Find your public IP address instantly and look up detailed geolocation info for any IP â€” country, city, ISP, timezone, and coordinates. Free, no signup required.',
  keywords: ['what is my ip', 'ip address checker', 'ip lookup', 'ip geolocation', 'my ip address', 'find my ip', 'ip location finder'],
  alternates: { canonical: 'https://roughtools.com/tools/network/ip-checker' },
  openGraph: {
    title: `IP Address Checker â€” Find Your IP Address | RoughTools`,
    description: `Find your public IP address, ISP, location, and network details instantly. Free online IP address lookup tool.`,
    url: 'https://roughtools.com/tools/network/ip-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `IP Address Checker â€” Find Your IP Address | RoughTools`,
    description: `Find your public IP address, ISP, location, and network details instantly. Free online IP address lookup tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the IP Address Checker free to use?',
    a: 'Yes, the IP Address Checker and lookup tool is completely free with no subscription, usage limits, or premium features. You can look up your own public IP address and query geolocation data for unlimited IP addresses at no cost. RoughTools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for all users.',
  },
  {
    q: 'Do I need to create an account to find my IP address?',
    a: 'No account or registration is required. Open the IP Checker page and your public IP address is displayed automatically within seconds â€” no input needed. To look up a different IP, simply type it into the search field. There is no email, password, or profile required at any point. RoughTools is designed for instant answers without sign-up friction.',
  },
  {
    q: 'Does this tool store or share my IP address?',
    a: 'RoughTools does not store your IP address or any lookup history. Your IP is retrieved from the ipapi.co public geolocation API, which has its own privacy policy. The tool is designed to display your IP to you â€” not to collect or log it. You can freely use this tool to verify your VPN connection, check your public-facing address, or look up IPs from server logs without any data retention concern on our end.',
  },
  {
    q: 'Does the IP Checker work on mobile phones and tablets?',
    a: 'Yes. The IP Address Checker is fully responsive and works correctly on smartphones, tablets, and desktop computers. The layout adapts to all screen sizes so you can view your IP and full geolocation details on any device. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. Your mobile device\'s public IP â€” assigned by your carrier or Wi-Fi network â€” is automatically detected and displayed.',
  },
  {
    q: 'Which browsers are supported by this IP lookup tool?',
    a: 'The IP Checker works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses the standard Fetch API to query the geolocation service, which is supported across all major browser engines. Internet Explorer is not supported, as it has been end-of-life since June 2022 and lacks the modern JavaScript features required by this tool.',
  },
  {
    q: 'How accurate is the IP geolocation data?',
    a: 'IP geolocation is based on registration data, routing tables, and network mapping â€” not GPS. Accuracy varies by region and ISP. For most residential connections, the country and region are accurate but the city may be off by 50â€“200 miles. ISPs sometimes register IP blocks in a different city than where customers are located. VPNs and proxy services show the server\'s location, not the user\'s actual physical location.',
  },
  {
    q: 'Can I use this IP Checker offline?',
    a: 'No. Retrieving your public IP address and geolocation data requires a live internet connection, as the tool queries an external API. By definition, you need to be online to have a public IP address to display. If you need your local network IP (e.g., 192.168.x.x) without internet, you can find it in your device\'s network settings or by running ipconfig (Windows) or ifconfig (Linux/macOS) in a terminal.',
  },
  {
    q: 'How do I look up my IP address and location? Step-by-step.',
    a: 'Using the IP Checker is immediate. Step one: open the IP Checker page on RoughTools â€” your public IP address is detected and displayed automatically within a few seconds. Step two: review the geolocation data shown, including country, region, city, ISP name, ASN number, timezone, and approximate coordinates. Step three: to look up a different IP address (for example, one you found in server logs), type it into the lookup field and press Enter. Step four: the tool displays full geolocation details for the queried IP.',
  },
  {
    q: 'Why use RoughTools IP Checker instead of other websites?',
    a: 'RoughTools detects your IP automatically the moment the page loads â€” no button to press. It shows comprehensive geolocation data including ISP, ASN, timezone, and coordinates in a single view without navigating multiple pages. The page is lightweight and loads fast, giving you your IP in under two seconds. You can also look up any other IP by typing it directly, making it useful for both self-lookup and server log investigation.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Use the Contact page on RoughTools to report bugs or suggest improvements. When reporting an issue, describe what you expected to see (for example, your correct city), what was actually displayed, and any context that might explain the discrepancy such as using a VPN, mobile carrier network, or corporate proxy. Feature requests are also welcome â€” describe the use case and the team will evaluate it for a future release.',
  },
  {
    q: 'What is a public IP address and how is it assigned?',
    a: 'A public IP address is a globally unique number that identifies your network on the internet. It is assigned by your Internet Service Provider (ISP) from a block of addresses they own. Most home users receive a dynamic public IP that can change when they restart their router or after their lease expires. Businesses often pay for a static IP that never changes, which is necessary for hosting servers, running VPNs, and whitelisting in firewalls.',
  },
  {
    q: 'What is the difference between IPv4 and IPv6 addresses?',
    a: 'IPv4 addresses are 32-bit numbers written as four groups of digits separated by dots â€” for example, 203.0.113.42. The IPv4 address space contains approximately 4.3 billion addresses, which have been exhausted globally. IPv6 addresses are 128-bit numbers written in hexadecimal notation separated by colons â€” for example, 2001:db8::1. IPv6 provides a vastly larger address space with approximately 340 undecillion unique addresses. Many modern networks support both protocols simultaneously, known as a dual-stack configuration.',
  },
  {
    q: 'Why does my IP address location show the wrong city?',
    a: 'IP geolocation works by matching your IP address against databases of known IP block assignments. ISPs often register large blocks of IP addresses at their regional headquarters or a data center city rather than the specific city where a customer is located. This causes geolocation to show the wrong city in many cases. Additionally, using a VPN always shows the VPN server\'s city, not your actual location. For mobile carrier connections, the location often reflects the carrier\'s gateway city rather than your physical position.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'IP Address Checker & Lookup',
  url: 'https://roughtools.com/tools/network/ip-checker',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Find your public IP address and look up geolocation info â€” country, city, ISP, timezone, and coordinates. Free, instant, no signup.',
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
    { '@type': 'ListItem', position: 3, name: 'IP Address Checker', item: 'https://roughtools.com/tools/network/ip-checker' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 64px' }}>
        <ToolAdUnit position="top" />
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> â€º{' '}
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> â€º IP Checker
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>IP Address Checker</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Instantly find your public IP address and look up geolocation details for any IP â€” country, city, ISP, ASN, timezone, and coordinates. Your IP is detected automatically on page load. Useful for verifying VPN connections, investigating server logs, and diagnosing routing issues. Free, no account required.
        </p>
        <div data-print-section="calculator">
        <IpCheckerClient />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About IP Checker</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Every device connected to the internet has a public IP address assigned by its Internet Service Provider. This tool uses the ipapi.co public API to instantly retrieve your current public IP along with geolocation metadata â€” including country, region, city, ISP name, ASN, timezone, and approximate latitude/longitude coordinates. The lookup happens directly in your browser with no server-side logging on RoughTools.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            You can also look up any IP address manually by entering it in the search field. This is useful for identifying the owner of an IP that appears in your server logs, diagnosing routing issues, or verifying that a VPN is masking your real location. Note that geolocation accuracy is typically city-level â€” exact street addresses are never exposed by public IP geolocation data.
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
              { name: 'DNS Lookup', href: '/tools/network/dns-lookup', desc: 'Query DNS records' },
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
          toolName="IP Address Checker"
          toolSlug="ip-checker"
          toolUrl="https://roughtools.com/tools/network/ip-checker"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
