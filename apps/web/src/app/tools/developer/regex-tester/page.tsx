import type { Metadata } from 'next'
import Link from 'next/link'
import RegexTesterClient from './RegexTesterClient'

export const metadata: Metadata = {
  title: 'Regex Tester & Debugger — Free Online Tool | RoughTools',
  description: 'Test regular expressions against a string in real time. See all matches highlighted, capture groups listed, and toggle flags like global, case-insensitive, and multiline.',
  keywords: ['regex tester', 'regular expression tester', 'regex debugger', 'regex online', 'regex matcher', 'test regex online'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/regex-tester' },
  openGraph: {
    title: `Regex Tester — Test & Debug Regular Expressions | RoughTools`,
    description: `Test and debug regular expressions in real time with match highlighting and named capture group support. Free online regex tester.`,
    url: 'https://roughtools.com/tools/developer/regex-tester',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Regex Tester — Test & Debug Regular Expressions | RoughTools`,
    description: `Test and debug regular expressions in real time with match highlighting and named capture group support. Free online regex tester.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this regex tester free to use?', a: 'Yes, the RoughTools Regex Tester is completely free with no account, subscription, or payment required. You can test unlimited regular expressions at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no premium flags or features behind a paywall, and no registration required.' },
  { q: 'Do I need to sign up to test regular expressions?', a: 'No account, email, or registration is required. Enter your regex pattern and test string, and matches are highlighted in real time. There is no login wall and no upgrade required to access any feature including capture group display, flag toggling, or match count. The tool is entirely anonymous — your patterns and test strings are never stored or shared.' },
  { q: 'Is my regex pattern and test string stored anywhere?', a: 'No. The regex matching runs entirely within your browser using JavaScript\'s native RegExp engine. Your patterns and test strings never leave your device, are never logged, and are never shared with any third party. This is important for developers testing patterns against real data that may contain personal information, API endpoints, or sensitive configuration values.' },
  { q: 'Does the regex tester work on mobile and tablet?', a: 'Yes, the tester is fully responsive and works on all modern smartphones and tablets. The pattern input, test string area, and match results are all optimised for mobile screens. This is useful when reviewing regex patterns in documentation, troubleshooting pattern issues on the go, or quickly testing a pattern shared in a code review message.' },
  { q: 'Which browsers support this regex tester?', a: 'The Regex Tester works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. It uses JavaScript\'s native RegExp engine, which is available in all current browser versions. Browser-specific regex support may vary — Chrome and Firefox have the most complete ES2022+ regex feature support including named capture groups and lookbehind assertions.' },
  { q: 'How accurate is the regex matching?', a: 'The tester uses JavaScript\'s native RegExp engine, so the results exactly match how your regex will behave in Node.js, browser JavaScript, and TypeScript projects. The JavaScript regex engine follows the ECMAScript specification. Note that JavaScript regex differs from PCRE (used in PHP, Perl, Python) and POSIX (used in grep, sed) in some edge cases — particularly around lookbehind support, possessive quantifiers, and atomic groups.' },
  { q: 'Can I use this regex tester offline?', a: 'Once the page has fully loaded, the tester runs entirely in JavaScript without requiring an active internet connection. You can test patterns and see match results offline after the initial page load. This is useful for developers working in secure environments, offline, or in locations with restricted internet access. All regex processing is client-side.' },
  { q: 'How do I use the regex tester step by step?', a: 'To test a regex: (1) Enter your regular expression pattern in the pattern field — without the surrounding slashes. (2) Toggle flags as needed: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line starts/ends), s (dotAll — dot matches newlines). (3) Enter or paste your test string in the text area. (4) Matches are highlighted in the test string in real time. (5) Below the test string, all capture groups for each match are listed with their index and matched value. No button press is needed — results update instantly as you type.' },
  { q: 'Why should I use RoughTools instead of regex101.com?', a: 'regex101.com is excellent for detailed regex debugging with explanation trees. RoughTools Regex Tester is optimised for quick, everyday pattern testing with zero friction — no account required, no cookie banners, minimal interface. If you need a quick confirmation that a pattern matches your string during active development, this tool gets you there faster. Both tools are valid choices; the best one depends on whether you need deep explanation or fast iteration.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as regex explanation/breakdown, named capture group display, substitution preview, multiple test strings, or regex library presets — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the pattern, flags, and test string (sanitised of sensitive data), the browser and OS, and what you expected versus what was matched.' },
  { q: 'What are regex flags and which should I use?', a: 'Flags modify how a regular expression engine interprets the pattern. The four most important are: g (global) — finds all matches rather than stopping after the first; i (case-insensitive) — matches regardless of upper/lower case; m (multiline) — changes ^ and $ to match start and end of each line rather than the whole string; s (dotAll) — makes the dot (.) match newline characters as well as all other characters. You can combine flags: /pattern/gim is a global, case-insensitive, multiline regex. Most everyday use cases only need the g flag.' },
  { q: 'What are capture groups and how do I use them?', a: 'A capture group is a portion of the regex pattern enclosed in parentheses, such as (\\d{4}). When a match is found, the text matched by each group is captured separately. Groups are numbered from left to right starting at 1. You can also create named groups: (?<year>\\d{4}) creates a group accessible as "year". Non-capturing groups (?:pattern) match without capturing. This tester displays all capture groups for each match — the group number, the named label if applicable, and the exact matched text — making it easy to verify your extraction logic.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Regex Tester', item: 'https://roughtools.com/tools/developer/regex-tester' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Regex Tester',
    url: 'https://roughtools.com/tools/developer/regex-tester',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online regex tester tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">Regex Tester</h1>
          <span className="ml-auto text-xs bg-orange-900/50 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">.*  Matches · Groups · Flags</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-900/60 to-amber-900/60 border-b border-orange-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Live Highlighting', 'Capture Groups', 'g · i · m · s Flags', 'JavaScript RegExp', 'Real-Time', 'Free'].map(b => (
              <span key={b} className="text-xs bg-orange-900/50 text-orange-300 border border-orange-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Regex Tester & Debugger</h2>
          <p className="text-orange-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Test regular expressions against any string in real time — matches are highlighted instantly as you type, with all capture groups listed for each match. Uses JavaScript&apos;s native RegExp engine, so results exactly match behaviour in Node.js, browser JS, and TypeScript. Toggle g, i, m, and s flags with a single click. Safe for sensitive test data — everything runs locally in your browser with no server communication.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-orange-900/20 rounded-2xl p-1"><RegexTesterClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🎨', title: 'Live Highlighting', desc: 'All matches highlighted in the test string as you type' }, { icon: '📦', title: 'Capture Groups', desc: 'Every group from every match listed with index and value' }, { icon: '🏳️', title: 'Flag Toggles', desc: 'g / i / m / s flags toggle with a single click' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Common Regex Patterns Reference</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
            {[['\\d+', 'One or more digits'], ['\\w+', 'Word characters (a-z, A-Z, 0-9, _)'], ['\\s+', 'One or more whitespace characters'], ['^.*$', 'Entire line'], ['\\b\\w+\\b', 'Complete word'], ['[a-zA-Z]+', 'Letters only'], ['\\d{3}-\\d{4}', 'Phone segment (555-1234)'], ['https?://\\S+', 'URLs'], ['^[\\w.-]+@[\\w.-]+\\.\\w+$', 'Email address'], ['(?<=\\().*(?=\\))', 'Text inside parentheses']].map(([pattern, desc]) => (
              <div key={pattern} className="flex items-center gap-3 p-2.5 bg-gray-800/50 rounded-lg">
                <code className="text-orange-400 text-xs flex-shrink-0">{pattern}</code>
                <span className="text-gray-400 text-xs">{desc}</span>
              </div>
            ))}
          </div>
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
            {[{ href: '/tools/developer/diff-checker', label: '↔️ Diff Checker' }, { href: '/tools/developer/js-beautifier', label: '✨ JS Beautifier' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' }, { href: '/tools/developer/html-encoder', label: '🔤 HTML Encoder' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
