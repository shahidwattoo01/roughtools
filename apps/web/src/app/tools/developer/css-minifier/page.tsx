import type { Metadata } from 'next'
import Link from 'next/link'
import CssMinifierClient from './CssMinifierClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'CSS Minifier — Free Online CSS Compressor | RoughTools',
  description: 'Minify and compress CSS instantly in your browser. Remove whitespace, comments, and unnecessary characters to reduce file size — no upload required.',
  keywords: ['css minifier', 'css compressor', 'minify css online', 'css optimizer', 'compress css', 'css beautifier'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/css-minifier' },
  openGraph: {
    title: `CSS Minifier — Minify CSS Online Free | RoughTools`,
    description: `Minify CSS files instantly in your browser. Remove whitespace and comments to reduce file size. Free online CSS minifier tool.`,
    url: 'https://roughtools.com/tools/developer/css-minifier',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `CSS Minifier — Minify CSS Online Free | RoughTools`,
    description: `Minify CSS files instantly in your browser. Remove whitespace and comments to reduce file size. Free online CSS minifier tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this CSS minifier free to use?', a: 'Yes, the RoughTools CSS Minifier is completely free with no account, subscription, or payment required. You can minify unlimited CSS files and stylesheets at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no file size restrictions beyond browser memory, and no registration required.' },
  { q: 'Do I need to sign up to minify CSS?', a: 'No account, email, or registration is required. Paste your CSS and click Minify — the compressed output appears instantly. There is no login wall, no paywall on any feature, and no data stored about the CSS you process. The tool is entirely anonymous — your stylesheets are never transmitted or stored anywhere.' },
  { q: 'Is my CSS sent to a server for processing?', a: 'No. All CSS minification runs entirely within your browser using JavaScript. Your CSS code — which may contain proprietary design system tokens, unreleased product styles, or internal tooling configurations — never leaves your device. This is important for teams that cannot share stylesheets externally. Once you close the tab, the data is gone with no trace retained.' },
  { q: 'Does the CSS minifier work on mobile and tablet?', a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. The text areas are optimised for mobile viewing. This is useful when reviewing CSS file sizes for mobile performance audits, checking the output of a minification pass, or quickly compressing a stylesheet while working remotely from a mobile device.' },
  { q: 'Which browsers support this CSS minifier?', a: 'The CSS Minifier works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The minification uses JavaScript string processing that runs natively in every current browser. For large stylesheets (over 500 KB), Chrome and Firefox provide the best performance.' },
  { q: 'How accurate and safe is the CSS minification?', a: 'The minifier removes: all comments (/* ... */), leading and trailing whitespace, newlines and extra spaces between selectors and declarations, and unnecessary spaces around : ; { } characters while preserving space inside string values and selectors that require spaces. It does not perform semantic analysis — it does not remove unused rules, merge duplicate selectors, or shorten colour values. This means the output is always functionally identical to the input; only presentation whitespace is removed, not CSS logic.' },
  { q: 'Can I use this CSS minifier offline?', a: 'Once the page has fully loaded, all minification runs in JavaScript without requiring an active internet connection. You can paste and minify CSS offline after the initial page load. This is useful when working on frontend projects in environments with restricted internet access or when reviewing CSS files during travel.' },
  { q: 'How do I minify CSS step by step?', a: 'To minify CSS: (1) Paste your CSS stylesheet into the input text area — any valid CSS including media queries, variables, and keyframe animations. (2) Click "Minify" to compress the output. (3) The size reduction percentage is shown — typically 30–50% for hand-written CSS. (4) Click "Copy" to copy the minified CSS to your clipboard. (5) Paste into your production stylesheet, CDN, or build pipeline. You can also click "Beautify" to format the minified CSS back to a readable form.' },
  { q: 'Why should I use RoughTools instead of build tools like webpack or PostCSS?', a: 'Build tools with CSS minification plugins (cssnano, clean-css, etc.) are the right choice for automated production pipelines. RoughTools CSS Minifier is for quick one-off compressions: pasting a small snippet to share in a code review, checking how much a stylesheet would compress before setting up a build step, or minifying a standalone CSS file without configuring a full build pipeline. It has no setup cost and works immediately without npm install.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as CSS beautification/formatting, unused CSS removal, shorthand expansion, vendor prefix handling, or CSS variable expansion — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include a small CSS snippet that reproduced the issue, the browser and OS, and what you expected versus what was output.' },
  { q: 'What does CSS minification actually remove?', a: 'CSS minification removes all content that browsers ignore during rendering: (1) Comments — everything between /* and */ is stripped. (2) Whitespace — tabs, newlines, and extra spaces between tokens. (3) Redundant spaces — spaces around colons (:), semicolons (;), and braces ({ }). (4) Trailing semicolons before closing braces. The minifier preserves all content that affects rendering: the actual selector names, property names, property values (including space-separated values like padding: 0 10px), string content in quotes, and all at-rules (@media, @keyframes, @import).' },
  { q: 'How much can CSS minification reduce file size?', a: 'CSS minification typically reduces file size by 20–50% depending on how the original was written. Hand-written CSS with many comments, generous whitespace, and long descriptive class names compresses more than already-compact utility CSS. For context: Bootstrap\'s full CSS is about 194 KB unminified and 163 KB minified (16% reduction) — it was already reasonably compact. A verbosely-written stylesheet with extensive inline documentation can achieve 40–50% reduction. Minification should always be combined with GZIP or Brotli compression at the server level, which typically achieves an additional 70–80% reduction.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'CSS Minifier', item: 'https://roughtools.com/tools/developer/css-minifier' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CSS Minifier',
    url: 'https://roughtools.com/tools/developer/css-minifier',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online css minifier tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">CSS Minifier</h1>
          <span className="ml-auto text-xs bg-cyan-900/50 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">💨 Compress · Beautify · Instant</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-cyan-900/60 to-sky-900/60 border-b border-cyan-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Remove Comments', 'Strip Whitespace', 'Size Reduction %', 'Beautify Option', 'Client-Side', 'Free'].map(b => (
              <span key={b} className="text-xs bg-cyan-900/50 text-cyan-300 border border-cyan-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">CSS Minifier & Compressor</h2>
          <p className="text-cyan-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Minify and compress CSS instantly in your browser — no upload, no server, no setup. Removes all comments, whitespace, and unnecessary characters while preserving the exact rendering behaviour of your stylesheet. Shows the size reduction percentage so you can see the impact. All processing is client-side — your proprietary stylesheets and design tokens never leave your device.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-cyan-900/20 rounded-2xl p-1"><CssMinifierClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'Your stylesheets never leave your browser' }, { icon: '📉', title: 'Size Savings', desc: 'Typical 20–50% reduction shown as percentage' }, { icon: '✅', title: 'Safe', desc: 'Only removes whitespace/comments — never alters CSS logic' }].map(c => (
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
                <span className="text-cyan-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/js-beautifier', label: '✨ JS Beautifier' }, { href: '/tools/developer/html-encoder', label: '🌐 HTML Encoder' }, { href: '/tools/developer/color-picker', label: '🎨 Color Picker' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/diff-checker', label: '↔️ Diff Checker' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="CSS Minifier"
          toolSlug="css-minifier"
          toolUrl="https://roughtools.com/tools/developer/css-minifier"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
