import type { Metadata } from 'next'
import Link from 'next/link'
import HTMLEncoderClient from './HTMLEncoderClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'HTML Encoder & Decoder — Free Online Tool | RoughTools',
  description: 'Convert special characters to HTML entities and decode HTML entities back to plain text. Handles &, <, >, ", \' and all named entities — free and runs in your browser.',
  keywords: ['html encoder', 'html decoder', 'html entities', 'encode html', 'html escape', 'html entity converter'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/html-encoder' },
  openGraph: {
    title: `HTML Encoder & Decoder — Escape HTML Entities | RoughTools`,
    description: `Encode and decode HTML entities online. Escape special characters for safe HTML display. Free HTML encoder and decoder tool.`,
    url: 'https://roughtools.com/tools/developer/html-encoder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `HTML Encoder & Decoder — Escape HTML Entities | RoughTools`,
    description: `Encode and decode HTML entities online. Escape special characters for safe HTML display. Free HTML encoder and decoder tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this HTML encoder free to use?', a: 'Yes, the RoughTools HTML Encoder & Decoder is completely free with no account, subscription, or payment required. You can encode and decode unlimited HTML strings at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits and no registration required.' },
  { q: 'Do I need to sign up to encode HTML entities?', a: 'No account, email, or registration is required. Enter your text and the encoded or decoded result appears instantly. There is no login wall, no paywall on any feature, and no data stored about the strings you process. The tool is entirely anonymous — your content is never transmitted or retained.' },
  { q: 'Is my content sent to a server when I encode it?', a: 'No. All HTML encoding and decoding runs entirely within your browser using JavaScript\'s DOM APIs and string replacement. Your HTML content — which may include proprietary templates, private user content, or internal application code — never leaves your device. Once you close the tab, all data is gone with no server trace.' },
  { q: 'Does the HTML encoder work on mobile and tablet?', a: 'Yes, the encoder/decoder is fully responsive and works on all modern smartphones and tablets. The input and output text areas are optimised for mobile screens. This is useful when reviewing HTML escaping in CMS content, checking that user-submitted content is properly escaped, or converting HTML entities when working from a mobile device.' },
  { q: 'Which browsers support this HTML encoder?', a: 'The HTML Encoder works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The encoder uses standard JavaScript DOM and string operations available in all current browser versions.' },
  { q: 'How accurate is the HTML entity encoding?', a: 'The encoder converts the five critical HTML characters that require escaping: & becomes &amp;, < becomes &lt;, > becomes &gt;, " becomes &quot;, and \' becomes &#039; or &apos;. The decoder handles all standard HTML named entities (&nbsp;, &copy;, &trade;, etc.) and numeric entities (both decimal &#169; and hexadecimal &#xA9; formats). This coverage is complete for preventing XSS in HTML contexts and rendering entity-encoded content correctly.' },
  { q: 'Can I use this HTML encoder offline?', a: 'Once the page has fully loaded, all encoding and decoding runs in JavaScript without requiring an active internet connection. You can process HTML content offline after the initial page load. This is useful in secure environments, when working with local HTML files, or in locations with restricted internet access.' },
  { q: 'How do I encode and decode HTML entities step by step?', a: 'To encode HTML: (1) Select "Encode" mode. (2) Paste text containing raw HTML special characters — for example, user-submitted content or code samples. (3) The encoded output replaces & with &amp;, < with &lt;, > with &gt;, etc. (4) Copy the output and use it safely in HTML attributes, text nodes, or database storage. To decode: select "Decode" mode, paste the entity-encoded string, and get plain text back. This is useful when displaying HTML source code in a browser.' },
  { q: 'Why should I use RoughTools instead of writing this in code?', a: 'For a one-off encoding or decoding task, writing JavaScript or Python to escape HTML is slower than using this tool. RoughTools HTML Encoder is ideal for quickly encoding a content sample, checking how a specific string will look when escaped, or converting entity-heavy CMS content for inspection — without opening a REPL, writing a script, or setting up a development environment. For production code, use your framework\'s built-in escaping functions (e.g., htmlspecialchars in PHP, DOMPurify in JavaScript).' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as attribute-specific encoding, JavaScript string escaping, full Unicode to entity conversion, or XML entity encoding — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the input string that caused the issue, the browser and OS, and what you expected versus what was output.' },
  { q: 'What are HTML entities and why do they matter?', a: 'HTML entities are special text sequences that represent characters which have special meaning in HTML markup. The five critical ones are: & (ampersand) — starts all entities, must be escaped as &amp;. < (less-than) — opens HTML tags, must be escaped as &lt;. > (greater-than) — closes HTML tags, escaped as &gt;. " (double quote) — delimits attribute values, escaped as &quot;. \' (single quote) — also used in attributes, escaped as &#039;. Failing to escape these in user-generated content creates Cross-Site Scripting (XSS) vulnerabilities, which allow attackers to inject malicious JavaScript into your web pages.' },
  { q: 'What is the difference between HTML encoding and URL encoding?', a: 'HTML encoding replaces characters that have special meaning in HTML markup with their HTML entity equivalents (&lt; for <, &amp; for &). It is used to safely display text within HTML pages without it being interpreted as markup. URL encoding (percent-encoding) replaces characters that are not valid in URLs with a percent sign followed by the hexadecimal ASCII code (%20 for space, %3C for <). HTML encoding is used for HTML content; URL encoding is used for query parameters and URL paths. They are not interchangeable — a URL-encoded string embedded in HTML still needs HTML encoding, and vice versa.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'HTML Encoder', item: 'https://roughtools.com/tools/developer/html-encoder' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HTML Encoder',
    url: 'https://roughtools.com/tools/developer/html-encoder',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online html encoder tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">HTML Encoder & Decoder</h1>
          <span className="ml-auto text-xs bg-orange-900/50 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">🌐 &amp; · &lt; · &gt; · &quot;</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-900/60 to-amber-900/60 border-b border-orange-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['HTML Entities', 'XSS Prevention', 'Encode & Decode', 'Named Entities', 'Numeric Entities', 'Free'].map(b => (
              <span key={b} className="text-xs bg-orange-900/50 text-orange-300 border border-orange-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">HTML Entity Encoder & Decoder</h2>
          <p className="text-orange-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Convert special characters to HTML entities and back — instantly, in your browser. Handles all five critical HTML characters (&amp;, &lt;, &gt;, &quot;, &apos;) plus named entities (&amp;nbsp;, &amp;copy;, &amp;trade;) and numeric entities. Essential for safely displaying user content in HTML, preventing XSS vulnerabilities, and rendering entity-encoded CMS content correctly.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-orange-900/20 rounded-2xl p-1"><HTMLEncoderClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🛡️', title: 'XSS Prevention', desc: 'Properly escape user content before HTML insertion' }, { icon: '🔄', title: 'Two-Way', desc: 'Encode raw text to entities and decode entities to text' }, { icon: '🔒', title: 'Private', desc: 'Your content never leaves your browser' }].map(c => (
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
                <span className="text-orange-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' }, { href: '/tools/developer/base64-encoder', label: '🔤 Base64 Encoder' }, { href: '/tools/developer/css-minifier', label: '💨 CSS Minifier' }, { href: '/tools/developer/markdown-editor', label: '📝 Markdown Editor' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="HTML Encoder"
          toolSlug="html-encoder"
          toolUrl="https://roughtools.com/tools/developer/html-encoder"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
