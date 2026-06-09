/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import URLEncoderClient from './URLEncoderClient'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'URL Encoder & Decoder | Free Online Developer Tool | RoughTools',
  description: 'Encode and decode URLs or URL components instantly in your browser. Supports encodeURIComponent, decodeURIComponent, and full encodeURI encoding — free and completely private.',
  keywords: ['url encoder', 'url decoder', 'urlencode online', 'percent encoding', 'encode url', 'decode url', 'url component encoder'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/url-encoder' },
  openGraph: {
    title: `URL Encoder & Decoder — Percent-Encode URLs | RoughTools`,
    description: `Encode and decode URLs online using percent-encoding. Convert special characters for safe URL use. Free URL encoder/decoder.`,
    url: 'https://roughtools.com/tools/developer/url-encoder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `URL Encoder & Decoder — Percent-Encode URLs | RoughTools`,
    description: `Encode and decode URLs online using percent-encoding. Convert special characters for safe URL use. Free URL encoder/decoder.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the URL Encoder and Decoder free to use?',
    a: 'Yes, the URL Encoder and Decoder is completely free to use with no subscription, usage limits, or premium features behind a paywall. You can encode and decode unlimited URLs and URL components at no cost. RoughTools is supported through non-intrusive advertising, keeping every tool permanently free for developers, QA engineers, and anyone working with web URLs.',
  },
  {
    q: 'Do I need to sign up or create an account to encode URLs?',
    a: 'No. You can use the URL Encoder and Decoder immediately without creating an account, entering an email address, or completing any registration. Just open the tool, paste your URL or text, and click Encode or Decode. RoughTools is built for developers who need fast answers without unnecessary steps or sign-up friction.',
  },
  {
    q: 'Does this tool send my URLs or data to a server?',
    a: 'No. All encoding and decoding operations run entirely in your browser using JavaScript\'s native encodeURIComponent, decodeURIComponent, and encodeURI functions. Nothing you type is transmitted to any external server. Your URLs, query strings, and any sensitive parameters are processed locally and never logged, stored, or shared. This tool is safe to use with internal URLs and private API endpoints.',
  },
  {
    q: 'Does the URL Encoder work on mobile phones and tablets?',
    a: 'Yes. The URL Encoder and Decoder is fully responsive and adapts to any screen size, including smartphones and tablets. You can paste a URL, tap Encode or Decode, and copy the result on any mobile device. It works in Chrome for Android, Safari for iOS, and all other modern mobile browsers without any app download or installation required.',
  },
  {
    q: 'Which browsers support this URL encoding tool?',
    a: 'The URL Encoder and Decoder works in all major modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool relies on standard JavaScript string functions that have been universally supported for many years. Over 97% of global internet users are covered. Internet Explorer is not supported, but it reached end-of-life in 2022 and should not be used for any modern web task.',
  },
  {
    q: 'How accurate is the URL encoding and decoding?',
    a: 'The encoding and decoding is 100% accurate because the tool uses the browser\'s native JavaScript functions: encodeURIComponent, decodeURIComponent, and encodeURI. These are the same functions used in every JavaScript runtime including Node.js. There is no custom parsing or interpretation — the output will be identical to what your own JavaScript code would produce using the same functions.',
  },
  {
    q: 'Can I use this URL encoder offline?',
    a: 'Once the page has loaded in your browser, URL encoding and decoding works fully offline because all processing uses built-in JavaScript functions with no server calls. You do not need an active internet connection after the initial page load. For frequent offline use, bookmark the page and open it before you lose connectivity so it is cached and ready to use.',
  },
  {
    q: 'How do I encode or decode a URL? Step-by-step instructions.',
    a: 'Using this tool takes just a few seconds. Step one: open the URL Encoder and Decoder on this page. Step two: choose your encoding mode — select "Component" (encodeURIComponent) for encoding individual query parameter values or path segments, or "Full URL" (encodeURI) for encoding an entire URL while preserving structural characters. Step three: paste your text or URL into the input field. Step four: click Encode or Decode. Step five: click the Copy button to copy the result to your clipboard.',
  },
  {
    q: 'Why use RoughTools URL Encoder instead of other websites?',
    a: 'RoughTools offers both encodeURIComponent and encodeURI modes in a single tool, so you can choose the right encoding for your specific use case without switching between pages. All processing is instant and happens locally — no server round-trips, no loading spinners, and no risk of your API parameters or private URLs being logged by a third-party server. The interface is clean and loads fast.',
  },
  {
    q: 'How do I report a bug or suggest a new feature?',
    a: 'Visit the Contact page on RoughTools to report a bug or suggest a new feature. When reporting a bug, include the browser and OS you are using, the input text that caused the problem, what you expected the output to be, and what the tool actually produced. Feature requests are welcome — describe your use case and how the feature would help you, and the team will consider it for future updates.',
  },
  {
    q: 'What is URL encoding and why is it necessary?',
    a: 'URL encoding, formally called percent-encoding, replaces characters that are not allowed in URLs with a percent sign followed by two hexadecimal digits representing the character\'s UTF-8 byte value. For example, a space becomes %20 and an ampersand becomes %26. URLs can only contain a restricted set of ASCII characters, so encoding is required when you include spaces, accented letters, special symbols, or binary data in a URL path or query string.',
  },
  {
    q: 'What is the difference between encodeURIComponent and encodeURI?',
    a: 'encodeURI encodes an entire URL and deliberately leaves structural characters untouched — characters like forward slashes (/), question marks (?), hash symbols (#), ampersands (&), and equals signs (=) are preserved because they define the URL\'s structure. encodeURIComponent encodes a URL fragment such as a single query parameter value and does encode those structural characters, making it safe to embed the encoded result inside a query string without breaking the URL parser.',
  },
  {
    q: 'What characters are safe in URLs without encoding?',
    a: 'RFC 3986 defines a set of "unreserved characters" that never need encoding in any part of a URL: uppercase and lowercase letters A–Z and a–z, digits 0–9, hyphen (-), period (.), underscore (_), and tilde (~). All other characters — including spaces, Unicode letters, punctuation, and symbols — must be percent-encoded when used in query parameters or path segments to ensure correct parsing across all browsers and servers.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'URL Encoder & Decoder',
  url: 'https://roughtools.com/tools/developer/url-encoder',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Encode and decode URLs or URL components using encodeURIComponent, decodeURIComponent, and encodeURI. Free, private, instant.',
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
    { '@type': 'ListItem', position: 3, name: 'URL Encoder', item: 'https://roughtools.com/tools/developer/url-encoder' },
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
          <Link href="/tools/developer" style={{ color: '#888', textDecoration: 'none' }}>Developer Tools</Link> › URL Encoder
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>URL Encoder & Decoder</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Encode or decode URLs and URL components using standard percent-encoding — instantly in your browser. Choose between encodeURIComponent for query parameters and encodeURI for complete URLs. Free, private, and no account required.
        </p>
        <URLEncoderClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About URL Encoder</h2>
          <p style={{ color: '#aaa', lineHeight: 1.7 }}>
            URLs can only contain a restricted set of ASCII characters. When you need to include spaces, Unicode characters, or special symbols in a URL, they must be percent-encoded. This tool provides both encodeURIComponent for query parameter values and path segments, and encodeURI for complete URL strings that need minimal encoding while preserving their structure.
          </p>
          <p style={{ color: '#aaa', lineHeight: 1.7, marginTop: 12 }}>
            Correct URL encoding is essential for building reliable web applications. Incorrect encoding causes broken links, failed API requests, and security vulnerabilities including open redirect attacks. Use encodeURIComponent for any user-supplied values you embed in URLs, and encodeURI only when encoding a full URL that is already structurally valid and correct.
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
