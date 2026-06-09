/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import PingToolClient from './PingToolClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Online Ping Tool — Test Website Connectivity & Response Time | RoughTools',
  description: 'Test website reachability and measure HTTP response times with our online ping tool. Run multiple requests and see average, min, and max response times. Free and instant.',
  keywords: ['online ping tool', 'ping website', 'test website connectivity', 'http ping', 'website response time', 'check website up', 'latency test online'],
  alternates: { canonical: 'https://roughtools.com/tools/network/ping-tool' },
  openGraph: {
    title: `Ping Tool — Online Ping Test | RoughTools`,
    description: `Test the reachability of any host with an online ping tool. Check latency and packet loss. Free online ping test.`,
    url: 'https://roughtools.com/tools/network/ping-tool',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Ping Tool — Online Ping Test | RoughTools`,
    description: `Test the reachability of any host with an online ping tool. Check latency and packet loss. Free online ping test.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the online ping tool free to use?',
    a: 'Yes, the Online Ping Tool on RoughTools is completely free with no subscription, usage limits, or hidden costs. You can test the reachability and response time of unlimited websites and servers at no charge. RoughTools is supported through non-intrusive advertising, which keeps every tool on the platform permanently free for developers, network administrators, and IT professionals.',
  },
  {
    q: 'Do I need to create an account to ping a website?',
    a: 'No account or registration is required. Open the Online Ping Tool, type the URL or hostname you want to test, and start the ping immediately. There is no email address, password, or profile needed at any point. RoughTools is designed for fast, frictionless network diagnostics — you get response time data in seconds without any sign-up step.',
  },
  {
    q: 'Does this tool store or log the URLs I ping?',
    a: 'RoughTools does not store or log the URLs or hostnames you test with the ping tool. All requests are made directly from your browser to the target URL — no intermediary server on RoughTools retains your query history. Use this tool freely to test internal staging servers (if publicly reachable), external APIs, and production websites without any concern about your query data being recorded.',
  },
  {
    q: 'Does the ping tool work on mobile phones and tablets?',
    a: 'Yes. The Online Ping Tool is fully responsive and works on smartphones, tablets, and desktop computers. The input field and results display adapt to all screen sizes. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. Keep in mind that results from a mobile device reflect your mobile network latency, which may differ from your home or office connection speed.',
  },
  {
    q: 'Which browsers support this online ping tool?',
    a: 'The ping tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses the Fetch API and the Performance Timing API, both of which are universally available in modern browsers. Internet Explorer is not supported as it reached end-of-life in 2022 and lacks the Fetch API used to measure response times.',
  },
  {
    q: 'How accurate are the ping response times this tool shows?',
    a: 'Response times are measured using the browser\'s Performance API, which captures the time from when the fetch request is initiated to when the first response byte is received. This is a real measurement of HTTP latency from your network to the target server. Results include DNS lookup and TCP connection time on the first request, and benefit from connection reuse on subsequent requests. The measurements accurately reflect real-world HTTP response time from your current network.',
  },
  {
    q: 'Can I use the ping tool offline?',
    a: 'No. Pinging a website requires an active internet connection because the tool must send actual HTTP requests to the target host. By definition, testing network connectivity requires a network. If you need to test local network connectivity without internet access, use the ping command in your terminal: ping hostname works on Windows, Linux, and macOS and sends ICMP packets directly without requiring browser access.',
  },
  {
    q: 'How do I ping a website using this tool? Step-by-step guide.',
    a: 'Using the ping tool is straightforward. Step one: open the Online Ping Tool on this page. Step two: type the full URL or hostname you want to test — for example, https://example.com or just example.com. Step three: click the Ping button to start the test. Step four: the tool sends four sequential HTTP requests to the target and records the response time for each. Step five: review the results — the average, minimum, and maximum response times are displayed, giving you a clear picture of the server\'s responsiveness from your network.',
  },
  {
    q: 'Why use RoughTools Ping Tool instead of other websites?',
    a: 'RoughTools measures response times directly from your browser using real HTTP requests — so results reflect actual latency from your specific network location, not from a remote testing server in another country. This makes the results immediately actionable for diagnosing whether a slowness issue is coming from your connection or from the server itself. The tool sends four requests and calculates average, min, and max, giving a more reliable picture than a single measurement.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report bugs or submit feature requests. When reporting a bug, include the URL you were testing, the response you received, your browser and operating system, and what you expected to happen. For feature requests such as custom request counts, HEAD vs GET selection, or HTTPS vs HTTP comparison — describe your use case clearly and the team will evaluate it for a future release.',
  },
  {
    q: 'Why is this HTTP-based ping and not ICMP ping?',
    a: 'Traditional ping uses ICMP (Internet Control Message Protocol) echo requests, which operate at the network layer below HTTP. Browsers run in a security sandbox and cannot send raw ICMP packets — doing so requires operating system-level privileges that browsers deliberately do not have for security reasons. This tool uses HTTP fetch requests instead, which measures the time for a full HTTP round-trip. For web services, HTTP-based latency is actually more relevant than ICMP latency because it reflects the complete request processing time.',
  },
  {
    q: 'What does it mean if a website times out during the ping test?',
    a: 'A timeout during the ping test can mean several things: the host is unreachable or offline, a firewall is blocking requests from your IP or network, the server does not respond to the specific request type the tool uses, or the server is severely overloaded and taking too long to respond. Some servers are configured to reject HEAD requests or block known proxy services. A timeout in this tool does not always mean the site is completely down — it may simply be blocking the specific request type used by browser-based ping tools.',
  },
  {
    q: 'What is the difference between latency and bandwidth?',
    a: 'Latency is the time it takes for a single request to travel to a server and back, measured in milliseconds. It reflects the physical distance to the server and the number of network hops between you and it. Bandwidth is the maximum amount of data that can be transferred per second, measured in Mbps or Gbps. A connection can have high bandwidth but high latency — for example, a satellite internet connection can download large files quickly but feels sluggish for real-time interactive tasks because every action requires a 600ms round trip.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Online Ping Tool',
  url: 'https://roughtools.com/tools/network/ping-tool',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Test website reachability and HTTP response times. Sends 4 requests and shows average, min, and max latency. Free, instant, no signup.',
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
    { '@type': 'ListItem', position: 3, name: 'Ping Tool', item: 'https://roughtools.com/tools/network/ping-tool' },
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
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> › Ping Tool
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Online Ping Tool</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Test website reachability and measure HTTP response times directly from your browser. Sends four sequential requests to the target and reports average, minimum, and maximum latency. Useful for diagnosing connectivity issues, comparing server performance, and verifying uptime. Free, no account required.
        </p>
        <PingToolClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Ping Tool</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Traditional ping uses ICMP echo requests, a protocol that operates below HTTP at the network layer. Because browsers are sandboxed and cannot send raw ICMP packets, this tool uses HTTP fetch requests with the Performance Timing API to measure response times for web services. It sends four sequential requests to the target and records the time taken for each, then calculates the average, minimum, and maximum response times.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            HTTP-based ping is particularly useful for testing the availability and performance of web services and APIs. While it doesn&apos;t bypass HTTP infrastructure like ICMP ping does, it gives a real-world measurement of how quickly the server responds to actual web requests from your browser&apos;s network connection. The first request is often slower due to DNS lookup and TCP connection setup — subsequent requests benefit from connection reuse.
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
              { name: 'Port Checker', href: '/tools/network/port-checker', desc: 'Check open ports' },
              { name: 'HTTP Headers Checker', href: '/tools/network/http-headers-checker', desc: 'Inspect HTTP response headers' },
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
          toolName="Ping Tool"
          toolSlug="ping-tool"
          toolUrl="https://roughtools.com/tools/network/ping-tool"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
