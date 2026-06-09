import type { Metadata } from 'next'
import Link from 'next/link'
import JsBeautifierClient from './JsBeautifierClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'JavaScript Beautifier — Format & Prettify JS Code | RoughTools',
  description: 'Beautify and format JavaScript code instantly in your browser. Pretty-print minified JS, fix indentation, and improve readability — or minify it back down. No upload required.',
  keywords: ['javascript beautifier', 'js formatter', 'javascript formatter', 'js beautifier online', 'prettify javascript', 'js minifier'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/js-beautifier' },
  openGraph: {
    title: `JavaScript Beautifier — Format JS Code Online | RoughTools`,
    description: `Format and beautify JavaScript code online. Pretty-print minified JS and fix indentation. Free online JavaScript beautifier.`,
    url: 'https://roughtools.com/tools/developer/js-beautifier',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `JavaScript Beautifier — Format JS Code Online | RoughTools`,
    description: `Format and beautify JavaScript code online. Pretty-print minified JS and fix indentation. Free online JavaScript beautifier.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this JavaScript beautifier free to use?', a: 'Yes, the RoughTools JavaScript Beautifier is completely free with no account, subscription, or payment required. You can format and minify unlimited JavaScript files at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no file size limits beyond browser memory, no usage counts, and no registration required.' },
  { q: 'Do I need to sign up to format JavaScript code?', a: 'No account, email, or registration is required. Paste your JavaScript and click Beautify or Minify — the result appears instantly. There is no login wall, no paywall on any feature, and no data stored about the code you process. The tool is entirely anonymous — your source code is never transmitted or retained.' },
  { q: 'Is my JavaScript code sent to a server when I format it?', a: 'No. All JavaScript formatting and minification runs entirely within your browser. Your code — which may be proprietary application code, unreleased features, API integration code, or any other source you cannot share externally — never leaves your device. This is essential for teams with strict IP protection policies. Once you close the tab, all data is gone.' },
  { q: 'Does the JavaScript beautifier work on mobile and tablet?', a: 'Yes, the beautifier is fully responsive and works on all modern smartphones and tablets. The input and output code areas are optimised for mobile viewing. This is useful when reviewing minified JS from a browser\'s source view, inspecting library code on your phone, or quickly formatting a snippet during a code review from a mobile device.' },
  { q: 'Which browsers support this JS beautifier?', a: 'The JavaScript Beautifier works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The beautifier uses JavaScript string processing that runs natively in all current browsers. For large files (over 500 KB), Chrome and Firefox provide the best performance due to their optimised JavaScript engines.' },
  { q: 'How accurate is the JavaScript formatting?', a: 'The beautifier applies consistent 2-space indentation, adds line breaks after block statements, and restores readable spacing around operators and keywords. It handles modern JavaScript including arrow functions, template literals, destructuring, async/await, and class syntax. The formatted output is functionally identical to the input — only whitespace presentation changes. For syntax errors in the input, the tool attempts best-effort formatting but may produce unexpected indentation near the error.' },
  { q: 'Can I use the JavaScript beautifier offline?', a: 'Once the page has fully loaded, all formatting runs in JavaScript without requiring an active internet connection. You can beautify or minify code offline after the initial page load. This is useful in secure development environments, when reviewing code on flights, or in locations with restricted internet access. The initial page load requires internet, but all processing is then client-side.' },
  { q: 'How do I beautify JavaScript code step by step?', a: 'To format JavaScript: (1) Paste your minified or unformatted JavaScript into the input area. This can be a full file, a module, a function, or any valid JavaScript. (2) Click "Beautify" to apply 2-space indentation and consistent formatting. (3) Click "Copy" to copy the formatted code to your clipboard. (4) Optionally click "Minify" to recompress the code to a single line for production use. The character count and size reduction percentage are shown after minification.' },
  { q: 'Why should I use RoughTools instead of Prettier or ESLint for formatting?', a: 'Prettier and ESLint are the right tools for automated formatting in a development workflow — they integrate with editors, run on save, and enforce team-wide style rules. RoughTools JS Beautifier is for quick one-off tasks: inspecting a minified library file, formatting a copied snippet, or reviewing vendor code that is not in your codebase. It requires zero configuration, no npm install, and works immediately from any browser without setting up a project.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as TypeScript support, configurable indentation (tabs vs spaces), JSX formatting, configurable quote style, or sort-imports support — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the JavaScript snippet that caused the issue, the browser and OS, and what you expected versus what was output.' },
  { q: 'What is the difference between JavaScript beautifying and minifying?', a: 'Beautifying (pretty-printing) adds consistent whitespace — indentation, newlines, and spaces around operators — to make code readable and debuggable. A beautified file is larger but easy to understand, modify, and review. Minifying removes all unnecessary whitespace, shortens variable names (in advanced minifiers), and produces the smallest possible JavaScript for faster browser loading. Minified code is not human-readable but loads faster. For development and debugging, use beautified code; for production deployment, use minified and ideally gzip-compressed code.' },
  { q: 'Can this beautifier handle TypeScript code?', a: 'The beautifier processes JavaScript syntax. TypeScript-specific syntax (type annotations, interfaces, generics, decorators) may or may not format correctly depending on the complexity of the TypeScript-specific constructs. For simple TypeScript files that look like annotated JavaScript, formatting often works without issues. For complex TypeScript with advanced type gymnastics or decorators, the output may have formatting errors. For TypeScript, the recommended approach is to use Prettier with the TypeScript parser configured in your editor, which has full TypeScript AST awareness.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'JavaScript Beautifier', item: 'https://roughtools.com/tools/developer/js-beautifier' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JavaScript Beautifier',
    url: 'https://roughtools.com/tools/developer/js-beautifier',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online javascript beautifier tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">JavaScript Beautifier</h1>
          <span className="ml-auto text-xs bg-yellow-900/50 text-yellow-400 border border-yellow-800 px-2 py-0.5 rounded-full">✨ Format · Minify · Instant</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-900/60 to-amber-900/60 border-b border-yellow-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Pretty Print', 'Minify', '2-Space Indent', 'Modern JS', 'Private', 'Free'].map(b => (
              <span key={b} className="text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">JavaScript Beautifier & Formatter</h2>
          <p className="text-yellow-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Format, beautify, and minify JavaScript code instantly in your browser with no upload required. Paste any minified, obfuscated, or poorly-indented JavaScript to pretty-print it with consistent 2-space indentation and readable spacing. Or compress formatted JS back to a single minified line for production. Handles modern JavaScript including ES6+ syntax, arrow functions, async/await, destructuring, and template literals. All processing is client-side — your proprietary code never leaves your browser.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-yellow-900/20 rounded-2xl p-1"><JsBeautifierClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'Proprietary code never leaves your browser' }, { icon: '⚙️', title: 'Modern JS', desc: 'Handles ES6+, arrow functions, async/await, destructuring' }, { icon: '⚡', title: 'Instant', desc: 'Format any size JS file in milliseconds' }].map(c => (
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
                <span className="text-yellow-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/css-minifier', label: '💨 CSS Minifier' }, { href: '/tools/developer/diff-checker', label: '↔️ Diff Checker' }, { href: '/tools/developer/regex-tester', label: '.* Regex Tester' }, { href: '/tools/developer/html-encoder', label: '🌐 HTML Encoder' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="JavaScript Beautifier"
          toolSlug="js-beautifier"
          toolUrl="https://roughtools.com/tools/developer/js-beautifier"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
