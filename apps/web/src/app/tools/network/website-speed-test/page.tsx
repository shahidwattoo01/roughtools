/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import WebsiteSpeedTestClient from './WebsiteSpeedTestClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Website Speed Test â€” Page Speed Checker & Performance Hub | RoughTools',
  description: 'Analyze your website\'s loading performance. Get Navigation Timing metrics plus quick-launch links to Google PageSpeed Insights and GTmetrix for in-depth speed analysis.',
  keywords: ['website speed test', 'page speed test', 'pagespeed insights', 'website performance', 'load time checker', 'ttfb test', 'core web vitals', 'gtmetrix'],
  alternates: { canonical: 'https://roughtools.com/tools/network/website-speed-test' },
  openGraph: {
    title: `Website Speed Test â€” Test Page Load Speed | RoughTools`,
    description: `Test the load speed of any website. Measure response time and identify performance bottlenecks. Free online speed test.`,
    url: 'https://roughtools.com/tools/network/website-speed-test',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Website Speed Test â€” Test Page Load Speed | RoughTools`,
    description: `Test the load speed of any website. Measure response time and identify performance bottlenecks. Free online speed test.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the Website Speed Test free to use?',
    a: 'Yes, the Website Speed Test on RoughTools is completely free with no subscription, usage limits, or premium features. You can run unlimited speed tests on any page at no cost. The Navigation Timing metrics are measured directly by your browser at no charge, and the links to Google PageSpeed Insights and GTmetrix also use free tiers of those services. RoughTools is funded through non-intrusive advertising to keep every tool free.',
  },
  {
    q: 'Do I need to create an account to test my website speed?',
    a: 'No account or registration is required. Open the Website Speed Test page and your current page load metrics are measured and displayed automatically using the browser\'s Navigation Timing API. No email address, password, or profile is needed at any point. For external URL testing via the linked tools, those services also offer free access without a required account.',
  },
  {
    q: 'Does this tool store or share data about my website?',
    a: 'RoughTools does not store or share any performance data. The Navigation Timing metrics are read directly from your browser\'s performance API and displayed locally â€” nothing is transmitted to or stored on RoughTools servers. When you click through to Google PageSpeed Insights or GTmetrix with a pre-filled URL, those external services handle your request under their own privacy policies.',
  },
  {
    q: 'Does the Website Speed Test work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works on smartphones, tablets, and desktop computers. Navigation Timing measurements on mobile will reflect your mobile device\'s network speed and processing power, which differ from desktop results. This makes mobile testing particularly valuable because it shows the real experience your mobile visitors have, rather than an idealized desktop benchmark.',
  },
  {
    q: 'Which browsers support this website speed test?',
    a: 'The speed test tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses the Navigation Timing API, which is supported in all major browsers. Results may vary slightly between browsers because each browser engine has different rendering and execution performance characteristics. Internet Explorer is not supported, as it has been end-of-life since 2022.',
  },
  {
    q: 'How accurate are the speed metrics this tool measures?',
    a: 'The Navigation Timing metrics â€” DOM Content Loaded, total page load time, and estimated Time to First Byte â€” are real measurements from your browser\'s performance subsystem, not estimates. They accurately represent what happened during this specific page load on your network and device. However, a single measurement is a snapshot. Page load times vary based on network conditions, server load, browser cache state, and background processes running on your device, so multiple tests give a more reliable picture.',
  },
  {
    q: 'Can I test my website speed offline?',
    a: 'No. Testing a website\'s speed requires loading the page over the internet, so an active network connection is required. The Navigation Timing metrics are measured as part of an actual page load â€” they cannot be simulated offline. If you want to test performance without affecting production traffic, consider using browser DevTools to throttle your network speed and simulate different connection types while loading your site.',
  },
  {
    q: 'How do I use the Website Speed Test? Step-by-step instructions.',
    a: 'Using this tool is simple. Step one: open the Website Speed Test page on RoughTools â€” the tool automatically reads Navigation Timing metrics from your current page load and displays DOM Content Loaded, total load time, and estimated TTFB. Step two: to test a different URL, copy it into the PageSpeed Insights or GTmetrix quick-launch section and click the corresponding button to open a full speed analysis in a new tab. Step three: review the Lighthouse scores, Core Web Vitals, and waterfall chart from those services to identify specific performance bottlenecks.',
  },
  {
    q: 'Why use RoughTools Website Speed Test instead of other websites?',
    a: 'RoughTools combines two layers of speed analysis in one place. First, it shows your real Navigation Timing metrics from the current page load â€” data you cannot get just by visiting PageSpeed Insights. Second, it provides pre-filled quick-launch buttons for both Google PageSpeed Insights and GTmetrix, so you can start an in-depth external analysis in one click rather than copying URLs manually. The page is lightweight and loads fast, which means less noise in your timing measurements.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report a bug or request a new feature. When reporting a bug, include your browser name and version, operating system, the URL you were testing, and a description of what you expected versus what you saw. Feature suggestions such as additional metric types, third-party tool integrations, or historical performance tracking are welcome and reviewed by the team for future releases.',
  },
  {
    q: 'What is Time to First Byte (TTFB) and why does it matter?',
    a: 'Time to First Byte (TTFB) is the duration from when a browser sends an HTTP request to when it receives the first byte of the server\'s response. It measures the combined time for DNS resolution, TCP connection establishment, TLS handshake (for HTTPS), and server processing. TTFB under 200ms is considered good; over 600ms suggests a server-side bottleneck such as a slow database query, insufficient server resources, or geographic distance between the user and the server. TTFB is one of the most directly actionable performance metrics because it is entirely server-side.',
  },
  {
    q: 'What are Core Web Vitals and do they affect SEO?',
    a: 'Core Web Vitals are a set of three user-experience metrics that Google measures and uses as a ranking signal in search results. Largest Contentful Paint (LCP) measures how quickly the main content of a page loads â€” good LCP is under 2.5 seconds. Cumulative Layout Shift (CLS) measures how much the page layout unexpectedly shifts during loading â€” good CLS is under 0.1. Interaction to Next Paint (INP) measures how quickly the page responds to user interactions â€” good INP is under 200 milliseconds. Pages that pass all three Core Web Vitals thresholds receive a performance ranking boost.',
  },
  {
    q: 'What is the difference between DOM Content Loaded and page load time?',
    a: 'DOM Content Loaded (DCL) fires when the browser has fully parsed the HTML document and built the DOM tree, but before stylesheets, images, and subframes have finished loading. It marks the point where JavaScript can start interacting with the document structure. Page load time (the Load event) fires after all resources referenced by the page â€” images, stylesheets, scripts, and iframes â€” have fully downloaded and processed. DCL is typically faster and is a better indicator of when the page becomes usable; the load time includes resource-heavy assets like large images.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Website Speed Test',
  url: 'https://roughtools.com/tools/network/website-speed-test',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Measure page load performance metrics using the Navigation Timing API and launch external speed analysis via Google PageSpeed Insights and GTmetrix. Free, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'Website Speed Test', item: 'https://roughtools.com/tools/network/website-speed-test' },
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
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> â€º Website Speed Test
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>Website Speed Test</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Measure real page load performance using the Navigation Timing API â€” DOM Content Loaded, total load time, and estimated Time to First Byte â€” directly from your browser. Then launch in-depth speed analysis on any URL via Google PageSpeed Insights and GTmetrix with one click. Free, no account required.
        </p>
        <div data-print-section="calculator">
        <WebsiteSpeedTestClient />
        </div>
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About Website Speed Test</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            Website performance directly impacts user experience and search engine rankings. Google uses Core Web Vitals as a ranking signal, and studies consistently show that slower pages have higher bounce rates and lower conversion rates. This tool provides two layers of speed analysis: real Navigation Timing metrics from your current page load, and quick-launch links to the two most widely used external speed testing services.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            For testing any external URL, the tool pre-fills links to Google PageSpeed Insights and GTmetrix. PageSpeed Insights runs Google&apos;s Lighthouse audit engine and reports Core Web Vitals from both lab data and real-world Chrome User Experience Report (CrUX) data. GTmetrix provides a waterfall chart showing how each resource loads, helping you identify which specific assets are slowing your page down.
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
              { name: 'WHOIS Lookup', href: '/tools/network/whois-lookup', desc: 'Domain registration info' },
              { name: 'Ping Tool', href: '/tools/network/ping-tool', desc: 'Test website connectivity' },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Website Speed Test"
          toolSlug="website-speed-test"
          toolUrl="https://roughtools.com/tools/network/website-speed-test"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
