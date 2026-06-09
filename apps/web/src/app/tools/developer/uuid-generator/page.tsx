/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import UUIDGeneratorClient from './UUIDGeneratorClient'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'UUID Generator | Free Online Developer Tool | RoughTools',
  description: 'Generate UUID v4 identifiers instantly in your browser. Create single or bulk UUIDs up to 100 at once, copy them all with one click — free and no signup required.',
  keywords: ['uuid generator', 'uuid v4 generator', 'generate uuid', 'random uuid', 'guid generator', 'unique id generator', 'bulk uuid'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/uuid-generator' },
  openGraph: {
    title: `UUID Generator — Generate UUID v4 Free Online | RoughTools`,
    description: `Generate RFC-compliant UUIDs (v1, v4, v5) instantly in your browser. Bulk UUID generation, no server required. Free tool.`,
    url: 'https://roughtools.com/tools/developer/uuid-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `UUID Generator — Generate UUID v4 Free Online | RoughTools`,
    description: `Generate RFC-compliant UUIDs (v1, v4, v5) instantly in your browser. Bulk UUID generation, no server required. Free tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the UUID Generator free to use?',
    a: 'Yes, the UUID Generator on RoughTools is completely free to use with no hidden charges, subscription plans, or premium tiers. You can generate as many UUIDs as you need — single or in bulk batches of up to 100 — without ever paying anything. RoughTools is supported by non-intrusive advertising, which means every tool remains permanently free for all users worldwide, with no usage limits or paywalls.',
  },
  {
    q: 'Do I need to create an account to generate UUIDs?',
    a: 'No account or sign-up is required. You can start generating UUIDs immediately after opening the page — no email address, no registration, no password. RoughTools is designed for developers who need fast answers without friction. Just open the tool, click Generate, and copy your UUIDs. Your browser handles everything locally without any authentication.',
  },
  {
    q: 'Does this tool store or share the UUIDs I generate?',
    a: 'No. UUID generation happens entirely inside your browser using the Web Crypto API. No data is transmitted to any server, and no UUIDs are logged, stored, or shared. Each UUID is generated locally on your device and exists only in your clipboard or wherever you paste it. You can use this tool confidently even for sensitive internal identifiers or database primary keys.',
  },
  {
    q: 'Does the UUID Generator work on mobile and tablet?',
    a: 'Yes. The UUID Generator is fully responsive and works on smartphones, tablets, and desktop computers. The interface adapts to smaller screens so you can generate and copy UUIDs on any device. The Web Crypto API used for generation is supported on all modern mobile browsers including Chrome for Android and Safari for iOS.',
  },
  {
    q: 'Which browsers are supported by this tool?',
    a: 'The UUID Generator works in all modern browsers that support the Web Crypto API, including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. These browsers cover over 97% of global web users. Internet Explorer is not supported, but IE has been end-of-life since 2022 and its usage share is negligible.',
  },
  {
    q: 'How accurate and random are the generated UUIDs?',
    a: 'All UUIDs are generated using crypto.randomUUID(), which is part of the browser\'s Web Crypto API and uses a cryptographically secure pseudorandom number generator (CSPRNG). This is the same standard used for TLS key generation and password managers. UUID v4 has 122 bits of randomness, making the probability of a collision approximately 1 in 5.3 × 10^36 — effectively impossible in practice.',
  },
  {
    q: 'Can I use this UUID Generator offline?',
    a: 'Once the page has loaded, UUID generation works offline because all processing happens in your browser using the Web Crypto API. You do not need an internet connection to generate UUIDs after the initial page load. However, the page itself must load from the internet first. If you work frequently offline, consider bookmarking the tool and opening it before going offline.',
  },
  {
    q: 'How do I use the UUID Generator? Step-by-step instructions.',
    a: 'Using the UUID Generator takes just a few seconds. First, open the tool on this page. Second, set the quantity — enter a number from 1 to 100 in the count field if you want multiple UUIDs. Third, click the Generate button to produce your UUIDs instantly. Fourth, click Copy to copy a single UUID, or use Copy All to copy the entire batch to your clipboard. Fifth, paste the UUID(s) wherever you need them.',
  },
  {
    q: 'Why should I use RoughTools UUID Generator instead of other sites?',
    a: 'RoughTools generates UUIDs entirely in your browser using the cryptographically secure Web Crypto API — no server round-trips, no data collection, and no latency. The bulk generation feature creates up to 100 UUIDs in one click, and the one-click Copy All saves time when seeding databases or test fixtures. The interface is minimal and loads instantly, so you get in and out without distraction.',
  },
  {
    q: 'How do I report a bug or request a new feature?',
    a: 'You can report bugs or suggest improvements using the Contact page on RoughTools. Describe the issue clearly — include which browser and operating system you are using, what you expected to happen, and what actually happened. For feature requests, explain the use case you are trying to solve. The team reviews all submissions and prioritizes frequently requested improvements in upcoming releases.',
  },
  {
    q: 'What is a UUID and what is it used for?',
    a: 'UUID (Universally Unique Identifier) is a 128-bit identifier standardized by RFC 4122, formatted as 32 hexadecimal digits in five groups separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. UUIDs are used as primary keys in databases, correlation IDs in distributed systems, file names for cloud storage uploads, session tokens, API resource identifiers, and anywhere a globally unique string is needed without coordination between services.',
  },
  {
    q: 'What is UUID v4 and how is it different from other UUID versions?',
    a: 'UUID v4 uses random or pseudo-random numbers for all bits (except 6 fixed version/variant bits). It is the most popular version because it requires no network address, no clock, and no central registry. UUID v1 uses the MAC address and timestamp, which can leak machine identity. UUID v3 and v5 use a name and namespace with MD5 or SHA-1 hashing. UUID v4 is the right choice when you need truly random, unguessable identifiers.',
  },
  {
    q: 'What is the difference between a UUID and a GUID?',
    a: 'GUID (Globally Unique Identifier) is Microsoft\'s name for UUID. They are the same 128-bit format defined by the same RFC 4122 standard. The term GUID is commonly used in Windows, .NET, SQL Server, and the COM ecosystem. UUID is the cross-platform term used in Linux, macOS, databases like PostgreSQL, and web APIs. If a system asks for a GUID, a UUID v4 generated by this tool is perfectly valid.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UUID Generator',
  url: 'https://roughtools.com/tools/developer/uuid-generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Generate UUID v4 identifiers instantly — single or bulk up to 100 at once. Free, no signup, runs entirely in your browser.',
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
    { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
    { '@type': 'ListItem', position: 3, name: 'UUID Generator', item: 'https://roughtools.com/tools/developer/uuid-generator' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 64px' }}>
        <ToolAdUnit position="top" />
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link href="/tools/developer" style={{ color: '#888', textDecoration: 'none' }}>Developer Tools</Link> › UUID Generator
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>UUID v4 Generator</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Generate cryptographically strong UUID v4 identifiers — single or up to 100 at once. All generation happens locally in your browser using the Web Crypto API, so your data never leaves your device. Free, instant, and no account required.
        </p>
        <UUIDGeneratorClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About UUID Generator</h2>
          <p style={{ color: '#aaa', lineHeight: 1.7 }}>
            UUIDs are the standard solution for generating unique identifiers without a central authority. They are used as primary keys in databases, correlation IDs in distributed systems, file names for uploads, session tokens, and anywhere a unique string is needed without coordination between services. The UUID v4 format is the most widely adopted version because it relies purely on randomness — no network address or timestamp is embedded, making it safe to generate from any device.
          </p>
          <p style={{ color: '#aaa', lineHeight: 1.7, marginTop: 12 }}>
            This tool uses the browser&apos;s Web Crypto API (crypto.randomUUID()) which produces Version 4 UUIDs using a cryptographically secure random number generator. The bulk generate feature is useful for seeding test databases, creating fixture data, or generating a batch of identifiers for import workflows. With 122 bits of randomness, UUID v4 collisions are statistically impossible even at massive scale.
          </p>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#e0e0ff' }}>{q}</h3>
              <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </section>
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
