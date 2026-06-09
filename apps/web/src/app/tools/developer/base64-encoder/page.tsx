import type { Metadata } from 'next'
import Link from 'next/link'
import Base64EncoderClient from './Base64EncoderClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder — Free Online Tool | RoughTools',
  description: 'Encode plain text or binary data to Base64, or decode Base64 strings back to text instantly in your browser. Free, private, and no registration required.',
  keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64 online', 'base64 converter'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/base64-encoder' },
  openGraph: {
    title: `Base64 Encoder & Decoder — Free Online Tool | RoughTools`,
    description: `Encode text to Base64 or decode Base64 strings instantly in your browser. Free, private Base64 encoder/decoder — no server required.`,
    url: 'https://roughtools.com/tools/developer/base64-encoder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Base64 Encoder & Decoder — Free Online Tool | RoughTools`,
    description: `Encode text to Base64 or decode Base64 strings instantly in your browser. Free, private Base64 encoder/decoder — no server required.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this Base64 encoder free to use?', a: 'Yes, the RoughTools Base64 Encoder & Decoder is completely free with no account, subscription, or payment required. You can encode and decode unlimited Base64 strings at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no character count restrictions, and no registration required.' },
  { q: 'Do I need to sign up to encode or decode Base64?', a: 'No account, email, or registration is required. Enter your text and click Encode or Decode — the result appears instantly. There is no login wall and no data stored about the strings you process. The tool is entirely anonymous — your input and output are never associated with any user profile or retained after the session ends.' },
  { q: 'Is my data sent to a server when I encode it?', a: 'No. All Base64 encoding and decoding runs entirely within your browser using JavaScript\'s native btoa() and atob() functions. Your data — which might include API credentials, authentication tokens, configuration values, or private messages — never leaves your device. Once you close the tab, the data is gone with no server-side trace retained.' },
  { q: 'Does this Base64 tool work on mobile and tablet?', a: 'Yes, the encoder/decoder is fully responsive and works on all modern smartphones and tablets. The input and output text areas are optimised for mobile viewing. This is useful when decoding Base64-encoded values from API responses, configuration files, or authentication headers while debugging mobile apps or reviewing data on the go.' },
  { q: 'Which browsers support this Base64 encoder?', a: 'The Base64 Encoder works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses the native btoa() and atob() functions that are available in all current browser versions. For handling binary data or non-ASCII characters correctly, the tool applies the standard UTF-8 encoding trick before calling btoa().' },
  { q: 'How accurate is the Base64 encoding?', a: 'The encoder produces standard Base64 output as defined in RFC 4648. For plain text input, the tool first encodes to UTF-8 bytes using encodeURIComponent, then applies btoa() — this correctly handles non-ASCII characters that would otherwise cause btoa() to throw. The output uses the standard Base64 alphabet (A-Z, a-z, 0-9, +, /) with = padding where needed.' },
  { q: 'Can I use this Base64 tool offline?', a: 'Once the page has fully loaded, encoding and decoding run entirely in JavaScript without requiring an active internet connection. You can process strings offline after the initial page load. This is useful in secure environments, when processing sensitive credentials on a machine without unrestricted internet access, or when working offline during travel.' },
  { q: 'How do I encode and decode Base64 step by step?', a: 'To encode: (1) Select "Encode" mode. (2) Enter or paste your plain text string in the input area. (3) The Base64 encoded result appears instantly. (4) Click Copy to copy the output. To decode: (1) Select "Decode" mode. (2) Paste the Base64 string in the input area. (3) The decoded text appears in the output. If the Base64 string is invalid or cannot be decoded to valid UTF-8, an error message is displayed.' },
  { q: 'Why should I use RoughTools instead of a search engine for Base64?', a: 'Searching "base64 encode [your text]" in Google sends your text to a search engine\'s servers. For any Base64 encoding involving credentials, private data, or internal configuration values, this is a security risk. RoughTools Base64 Encoder processes your data entirely locally — your text is never transmitted to any server. It is safer for sensitive strings and more convenient for frequent encoding/decoding workflows.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as URL-safe Base64 output, file-to-Base64 conversion, image encoding, binary input support, or batch encoding — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the input (sanitised if sensitive), the browser and OS, and what you expected versus what was output.' },
  { q: 'What is Base64 and why is it used?', a: 'Base64 is an encoding scheme that converts binary data to a text representation using 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It increases data size by approximately 33% but makes binary data safe to transmit in contexts that only support text — such as email (MIME), HTTP headers, HTML data URIs, and JSON payloads. Base64 is used in HTTP Basic Authentication headers, JWT tokens, embedding images in CSS, and storing binary data in configuration files.' },
  { q: 'What is the difference between Base64 and Base64URL encoding?', a: 'Standard Base64 uses + and / as the 62nd and 63rd characters, and pads output with = to make length a multiple of 4. These characters are problematic in URLs and filenames. Base64URL (RFC 4648 Section 5) replaces + with - and / with _, and often omits = padding. Base64URL is used in JWTs, OAuth tokens, and URL parameters. Standard Base64 is used in HTTP headers, MIME email attachments, and data URIs. When working with JWTs or URL parameters, use Base64URL decoding rather than standard Base64.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Base64 Encoder & Decoder', item: 'https://roughtools.com/tools/developer/base64-encoder' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Base64 Encoder & Decoder',
    url: 'https://roughtools.com/tools/developer/base64-encoder',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online base64 encoder & decoder tool by RoughTools.',
  }

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/developer" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Developer Tools
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">Base64 Encoder & Decoder</h1>
          <span className="ml-auto text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">🔤 Encode · Decode · Private</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-b border-green-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Encode', 'Decode', 'UTF-8 Safe', 'Client-Side Only', 'RFC 4648', 'Free'].map(b => (
              <span key={b} className="text-xs bg-green-900/50 text-green-300 border border-green-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Base64 Encoder & Decoder</h2>
          <p className="text-green-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Encode plain text to Base64 or decode Base64 strings back to text instantly — entirely in your browser using JavaScript&apos;s native btoa() and atob() APIs. Handles non-ASCII and Unicode characters correctly via UTF-8 pre-encoding. Useful for HTTP Basic Auth headers, JWT inspection, data URIs, and API credential encoding. All processing is client-side — your credentials, tokens, and private text never leave your device.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-green-900/20 rounded-2xl p-1"><Base64EncoderClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'Your text never leaves your browser — safe for credentials' }, { icon: '🌐', title: 'UTF-8 Safe', desc: 'Correctly handles all Unicode and non-ASCII characters' }, { icon: '⚡', title: 'Instant', desc: 'Encode or decode any string in milliseconds' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-green-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/jwt-decoder', label: '🔑 JWT Decoder' }, { href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' }, { href: '/tools/developer/hash-generator', label: '#️⃣ Hash Generator' }, { href: '/tools/developer/html-encoder', label: '🌐 HTML Encoder' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-green-500 hover:text-green-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Base64 Encoder"
          toolSlug="base64-encoder"
          toolUrl="https://roughtools.com/tools/developer/base64-encoder"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
