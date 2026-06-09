/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import HttpHeadersCheckerClient from './HttpHeadersCheckerClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'HTTP Headers Checker — View Response Headers Online | RoughTools',
  description: 'Inspect HTTP response headers for any URL. Check status codes, content-type, cache-control, security headers, server info, and more — free, instant, no signup required.',
  keywords: ['http headers checker', 'response headers', 'check http headers', 'view server headers', 'http status code', 'content-type checker', 'cache-control header'],
  alternates: { canonical: 'https://roughtools.com/tools/network/http-headers-checker' },
  openGraph: {
    title: `HTTP Headers Checker — Inspect HTTP Response Headers | RoughTools`,
    description: `Check HTTP response headers for any URL. Inspect security headers, redirects, and cache controls. Free online tool.`,
    url: 'https://roughtools.com/tools/network/http-headers-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `HTTP Headers Checker — Inspect HTTP Response Headers | RoughTools`,
    description: `Check HTTP response headers for any URL. Inspect security headers, redirects, and cache controls. Free online tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the HTTP Headers Checker free to use?',
    a: 'Yes, the HTTP Headers Checker is completely free with no subscription fee, usage limits, or premium tier. You can inspect the response headers of unlimited URLs at no cost. RoughTools is supported through non-intrusive advertising, which keeps this tool and every other tool on the platform permanently free for developers, security engineers, and webmasters worldwide.',
  },
  {
    q: 'Do I need to sign up or create an account to check headers?',
    a: 'No account or registration is required. Open the HTTP Headers Checker, paste any public URL into the input field, and view the response headers immediately. There is no email address, password, or profile needed. RoughTools is built for developers who need quick, frictionless access to diagnostic information without creating an account first.',
  },
  {
    q: 'Does this tool store or log the URLs I check?',
    a: 'RoughTools does not store or log the URLs you submit. The request is routed through a CORS proxy so that your browser can fetch headers from cross-origin URLs, but no query history is retained on RoughTools servers. Use this tool freely to inspect internal staging URLs, audit security headers, and troubleshoot caching configurations.',
  },
  {
    q: 'Does the HTTP Headers Checker work on mobile phones and tablets?',
    a: 'Yes. The tool is fully responsive and works on smartphones, tablets, and desktop computers. The URL input and results table adapt to smaller screens so you can inspect HTTP headers from any device. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers without requiring any additional software or app installation.',
  },
  {
    q: 'Which browsers support this HTTP headers checker?',
    a: 'The HTTP Headers Checker works in all modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool uses the standard Fetch API available in every modern browser. Internet Explorer is not supported, as it reached end-of-life in June 2022 and lacks the modern JavaScript APIs required to make cross-origin requests through a CORS proxy.',
  },
  {
    q: 'How accurate are the HTTP headers this tool returns?',
    a: 'The headers returned reflect what the CORS proxy receives from the target server at the moment of the request. Because the request originates from a proxy rather than directly from your browser, some headers — particularly those set conditionally based on the User-Agent, IP address, or geographic location — may differ slightly from what your browser would receive directly. For most diagnostic purposes, the results accurately represent the server\'s configured header policy.',
  },
  {
    q: 'Can I check HTTP headers offline?',
    a: 'No. Checking HTTP headers requires a live connection to both the target URL and the CORS proxy service, so the tool cannot function offline. If you need to inspect headers without an internet connection, use curl from the command line: run curl -I https://example.com to see the response headers returned by any server you can reach from your machine.',
  },
  {
    q: 'How do I check HTTP response headers? Step-by-step instructions.',
    a: 'Checking headers with this tool is fast and simple. Step one: open the HTTP Headers Checker on this page. Step two: paste the full URL you want to inspect into the input field, including the protocol (https://). Step three: click the Check Headers button. Step four: review the list of response headers returned — look for the HTTP status code, Content-Type, Cache-Control, and any security headers like Strict-Transport-Security or Content-Security-Policy. Step five: use the results to diagnose caching, redirects, or missing security configurations.',
  },
  {
    q: 'Why use RoughTools HTTP Headers Checker instead of other websites?',
    a: 'RoughTools presents response headers in a clean, readable table with security-relevant headers highlighted so you can spot missing protections at a glance. The tool supports any public HTTPS URL and returns results immediately without page reloads. It is faster for quick header audits than running curl in a terminal, and more convenient than browser DevTools for sharing or inspecting headers for URLs you are not actively browsing.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report a bug or suggest improvements. When reporting an issue, include the URL that caused the unexpected result (or a similar public URL if the original is private), the browser and operating system you are using, and what you expected to see versus what was returned. The development team reviews every submission and uses them to guide future improvements.',
  },
  {
    q: 'What are HTTP response headers and why do they matter?',
    a: 'HTTP response headers are key-value pairs sent by a web server alongside every response, before the response body is delivered. They communicate metadata that controls how the browser handles the response — including the content type, caching instructions, security policies, redirect destinations, and whether the connection should be kept alive. Headers directly affect page performance, security posture, and SEO. Missing or misconfigured headers are one of the most common causes of caching bugs, security vulnerabilities, and unexpected browser behavior.',
  },
  {
    q: 'What security headers should every website have?',
    a: 'Security-critical response headers include: Strict-Transport-Security (HSTS), which forces browsers to use HTTPS and prevents downgrade attacks; Content-Security-Policy (CSP), which restricts what scripts and resources a page can load, preventing cross-site scripting; X-Frame-Options, which prevents your page from being embedded in an iframe and stops clickjacking attacks; X-Content-Type-Options: nosniff, which prevents browsers from MIME-sniffing response content; and Referrer-Policy, which controls how much referrer information is sent with outbound links. Missing these headers leaves a site exposed to well-known attack classes.',
  },
  {
    q: 'What does the Cache-Control header do?',
    a: 'Cache-Control is an HTTP header that tells browsers, CDNs, and intermediate proxies how to cache a response. Common directives include max-age=N, which allows caching for N seconds; no-cache, which requires the cache to revalidate with the server before using a stored response; no-store, which prevents the response from being stored in any cache; and public or private, which determines whether shared caches like CDNs may store the response. Correct Cache-Control configuration significantly impacts site performance and how quickly content updates reach users.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HTTP Headers Checker',
  url: 'https://roughtools.com/tools/network/http-headers-checker',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'View HTTP response headers for any URL to diagnose caching, security headers, status codes, and server configuration. Free and instant.',
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
    { '@type': 'ListItem', position: 3, name: 'HTTP Headers Checker', item: 'https://roughtools.com/tools/network/http-headers-checker' },
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
          <Link href="/tools/network" style={{ color: '#888', textDecoration: 'none' }}>Network Tools</Link> › HTTP Headers Checker
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>HTTP Headers Checker</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Inspect HTTP response headers for any public URL — status code, Content-Type, Cache-Control, security headers, and more. Instantly audit missing security protections, diagnose redirect chains, and verify caching configuration. Free, no account required.
        </p>
        <HttpHeadersCheckerClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About HTTP Headers Checker</h2>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7 }}>
            HTTP headers are the hidden metadata layer of every web request and response. When a browser fetches a page, the server replies with dozens of headers before sending any content — specifying how the response should be cached, what security policies apply, whether a redirect is needed, and what kind of content is being delivered. Developers and webmasters use header inspection to diagnose caching problems, verify HTTPS redirects, and audit security configurations against best practices.
          </p>
          <p style={{ color: 'var(--fg-2)', lineHeight: 1.7, marginTop: 12 }}>
            This tool uses a CORS proxy to fetch response headers from any public URL and displays them in a structured table. Security-critical headers like Strict-Transport-Security, Content-Security-Policy, and X-Frame-Options are highlighted so you can quickly spot missing protections. Results reflect what the server sends to standard HTTP requests, making this a fast alternative to running curl in a terminal.
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
              { name: 'WHOIS Lookup', href: '/tools/network/whois-lookup', desc: 'Domain registration info' },
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
          toolName="HTTP Headers Checker"
          toolSlug="http-headers-checker"
          toolUrl="https://roughtools.com/tools/network/http-headers-checker"
          type="general"
        />
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
