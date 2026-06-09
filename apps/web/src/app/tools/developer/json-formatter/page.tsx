import type { Metadata } from 'next'
import Link from 'next/link'
import JsonFormatterClient from './JsonFormatterClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator — Free Online Tool | RoughTools',
  description: 'Format, minify, and validate JSON instantly in your browser. Paste any JSON string to beautify it with 2-space indentation or compress it to one line — no server required.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'format json online', 'json pretty print'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/json-formatter' },
  openGraph: {
    title: `JSON Formatter & Validator — Free Online Tool | RoughTools`,
    description: `Format, minify, and validate JSON instantly in your browser. Beautify JSON or compress it — zero server communication, no data uploaded.`,
    url: 'https://roughtools.com/tools/developer/json-formatter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `JSON Formatter & Validator — Free Online Tool | RoughTools`,
    description: `Format, minify, and validate JSON instantly in your browser. Beautify JSON or compress it — zero server communication, no data uploaded.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this JSON formatter free to use?', a: 'Yes, the RoughTools JSON Formatter is completely free with no account, subscription, or payment required. You can format, validate, and minify unlimited JSON strings at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no file size restrictions beyond browser memory, and no registration of any kind required to use the full formatter and validator.' },
  { q: 'Do I need to sign up to format JSON?', a: 'No account, email, or registration is required. Paste your JSON, click Format or Minify, and the result appears instantly. There is no login wall and no upgrade required to access any feature. The tool is entirely anonymous — your JSON content is never associated with any user profile or account.' },
  { q: 'Is my JSON data sent to a server when I format it?', a: 'No. All processing runs entirely within your browser using JavaScript\'s native JSON.parse and JSON.stringify APIs. Your JSON data — which may contain API keys, user records, configuration secrets, or proprietary data structures — never leaves your device. Once you close the tab, the data is gone with no trace retained on any server.' },
  { q: 'Does the JSON formatter work on mobile and tablet?', a: 'Yes, the formatter is fully responsive and works on all modern smartphones and tablets. The text areas and output panels are optimised for mobile viewing. This is useful when you receive a minified JSON payload on your phone and need to quickly inspect its structure, or when reviewing API responses during mobile debugging sessions.' },
  { q: 'Which browsers are supported by this JSON tool?', a: 'The JSON Formatter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins are required — it uses the browser\'s native JSON parser that is available in all current browser versions. For large JSON files (over 1 MB), Chrome and Firefox provide the best performance due to their optimised JavaScript engines.' },
  { q: 'How accurate is the JSON validation?', a: 'The validator uses the browser\'s native JSON.parse() function, which implements the full JSON specification (RFC 8259). It catches all syntax errors including: single-quoted strings (JSON requires double quotes), trailing commas after the last property, unquoted keys, unescaped control characters, and mismatched brackets. The error message shows the character position of the first syntax error to help you locate the problem quickly.' },
  { q: 'Can I use this JSON formatter offline?', a: 'Once the page has fully loaded in your browser, the formatter runs entirely in JavaScript without requiring an active internet connection. You can paste and format JSON offline after the initial page load. This is useful for developers working in secure environments, on flights, or in locations with restricted internet access. The initial page load requires internet access, but all processing is then client-side.' },
  { q: 'How do I format and validate JSON step by step?', a: 'To format JSON: (1) Paste your JSON string into the input text area. (2) Click "Format" to pretty-print with 2-space indentation, or "Minify" to compress to a single line. (3) If the JSON is invalid, an error message appears below the input showing where the syntax error is. (4) Copy the formatted output using the Copy button. For large objects, use browser Ctrl+F to search within the formatted output. The formatter handles deeply nested objects and arrays of any size within browser memory limits.' },
  { q: 'Why should I use RoughTools instead of other JSON formatters?', a: 'RoughTools JSON Formatter processes your data entirely client-side — no JSON you paste (which might contain tokens, passwords, or PII) is ever uploaded to a server. Many online JSON tools send your data to their backend for processing, which is a security risk for sensitive payloads. This tool also provides both formatting and minification in one place, validates as you go, and requires no account or captcha to use.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as JSON Schema validation, JSON-to-CSV conversion, JSON tree view, key sorting, or JSON path query support — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the JSON that caused the issue (sanitised of any sensitive data), the browser and OS, and what you expected versus what happened. Feature requests are reviewed and prioritised regularly.' },
  { q: 'What is the difference between JSON formatting and minifying?', a: 'JSON formatting (pretty-printing) adds consistent whitespace — newlines and indentation — to make the structure human-readable. A formatted JSON object clearly shows nesting levels and makes debugging easy. JSON minifying removes all whitespace that is not part of string values, producing the smallest valid JSON string. Minified JSON is ideal for API requests, environment variables, and config files where payload size matters. Both operations are lossless — the data content is identical before and after.' },
  { q: 'What common JSON errors does this validator catch?', a: 'The validator catches all JSON syntax violations: strings not enclosed in double quotes (single quotes are not valid JSON), trailing commas after the last item in an object or array, missing commas between properties, unquoted property keys (unlike JavaScript object literals), use of undefined or NaN values (not valid in JSON), improperly escaped characters in strings, mismatched or unclosed brackets and braces, and number formats not supported by JSON (like hex or octal). The error message includes the position of the first error for quick debugging.' },
]

const RELATED = [
  { href: '/tools/developer/yaml-validator', label: '📄 YAML Validator' },
  { href: '/tools/developer/xml-formatter', label: '📋 XML Formatter' },
  { href: '/tools/developer/jwt-decoder', label: '🔑 JWT Decoder' },
  { href: '/tools/developer/base64-encoder', label: '🔤 Base64 Encoder' },
  { href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' },
  { href: '/tools/developer/hash-generator', label: '#️⃣ Hash Generator' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'JSON Formatter & Validator', item: 'https://roughtools.com/tools/developer/json-formatter' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON Formatter & Validator',
    url: 'https://roughtools.com/tools/developer/json-formatter',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online json formatter & validator tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">JSON Formatter & Validator</h1>
          <span className="ml-auto text-xs bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">{ }  Format · Minify · Validate</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-blue-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Pretty Print', 'Minify', 'Validate', 'Syntax Errors', 'Client-Side', 'Free'].map(b => (
              <span key={b} className="text-xs bg-blue-900/50 text-blue-300 border border-blue-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">JSON Formatter & Validator</h2>
          <p className="text-blue-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Format, minify, and validate JSON instantly in your browser with zero server communication. Paste any minified or malformed JSON string to pretty-print it with consistent 2-space indentation, or compress formatted JSON to a single line for API payloads and environment variables. The built-in validator uses the browser&apos;s native JSON.parse to catch all syntax errors — trailing commas, single-quoted strings, unquoted keys — and shows exactly where the error is. Safe for API tokens, credentials, and any sensitive JSON data.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-blue-900/20 rounded-2xl p-1"><JsonFormatterClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'JSON never leaves your browser — safe for tokens & secrets' }, { icon: '✅', title: 'Full Validation', desc: 'Catches all RFC 8259 syntax violations with error position' }, { icon: '⚡', title: 'Instant', desc: 'Format or minify any size JSON in milliseconds' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-blue-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">{RELATED.map(l => <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors">{l.label}</Link>)}</div>
        </div>

        <ToolPageExtras
          toolName="JSON Formatter"
          toolSlug="json-formatter"
          toolUrl="https://roughtools.com/tools/developer/json-formatter"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
