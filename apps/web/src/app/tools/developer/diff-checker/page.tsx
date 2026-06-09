import type { Metadata } from 'next'
import Link from 'next/link'
import DiffCheckerClient from './DiffCheckerClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Diff Checker — Compare Two Texts Side by Side | RoughTools',
  description: 'Compare two texts side by side and highlight the differences. Line-by-line diff for code, documents, configuration files, and any text — free, private, no upload.',
  keywords: ['diff checker', 'text compare', 'compare two texts', 'diff tool online', 'side by side diff', 'code compare'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/diff-checker' },
  openGraph: {
    title: `Diff Checker — Compare Text Files Online | RoughTools`,
    description: `Compare two text files or code snippets and see differences highlighted line by line. Free online diff checker tool.`,
    url: 'https://roughtools.com/tools/developer/diff-checker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Diff Checker — Compare Text Files Online | RoughTools`,
    description: `Compare two text files or code snippets and see differences highlighted line by line. Free online diff checker tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this diff checker free to use?', a: 'Yes, the RoughTools Diff Checker is completely free with no account, subscription, or payment required. You can compare unlimited text pairs at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no file size restrictions beyond browser memory, and no registration required.' },
  { q: 'Do I need to sign up to compare texts?', a: 'No account, email, or registration is required. Paste two texts and differences are highlighted instantly. There is no login wall, no paywall on any feature, and no data stored about the texts you compare. The tool is entirely anonymous — your code, documents, and configuration content are never transmitted or retained.' },
  { q: 'Is my text sent to a server when comparing?', a: 'No. All diff computation runs entirely within your browser using JavaScript. The texts you paste — which may contain proprietary code, unreleased configuration, sensitive documents, or personal data — never leave your device. This is critical for comparing internal configuration files, private documents, or code with credentials. Once you close the tab, all data is gone.' },
  { q: 'Does the diff checker work on mobile and tablet?', a: 'Yes, the diff checker is fully responsive and works on all modern smartphones and tablets. The side-by-side comparison and difference highlighting are optimised for mobile screens. This is useful when reviewing code changes during on-call incidents on your phone, checking configuration differences from a mobile device, or comparing document versions while away from a desktop.' },
  { q: 'Which browsers support this diff checker?', a: 'The Diff Checker works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins are required. The diff algorithm uses standard JavaScript string operations available in all current browsers. For large files (thousands of lines), Chrome and Firefox provide the best performance.' },
  { q: 'How accurate is the diff comparison?', a: 'The diff uses a standard line-by-line comparison algorithm that correctly identifies added lines (highlighted in green), removed lines (highlighted in red), and unchanged lines. For very large inputs or texts with many small changes, performance may degrade. The algorithm is deterministic — the same inputs always produce the same diff output. Character-level diffing within changed lines may vary depending on the algorithm implementation used.' },
  { q: 'Can I use the diff checker offline?', a: 'Once the page has fully loaded, all comparison runs in JavaScript without requiring an active internet connection. You can paste texts and see the diff offline. This is useful in secure environments, when comparing files on machines without internet access, or during network outages when you need to review configuration changes before applying them.' },
  { q: 'How do I compare two texts step by step?', a: 'To compare two texts: (1) Paste the original or older version in the left panel. (2) Paste the modified or newer version in the right panel. (3) The diff is computed and displayed instantly — lines only in the left panel (removed) are highlighted in red, lines only in the right panel (added) are highlighted in green, and matching lines appear normally. (4) Scroll through the output to review all changes. Use the line count summary to get an overview of how many lines changed.' },
  { q: 'Why should I use RoughTools instead of running git diff?', a: 'Git diff is the right tool for comparing committed or staged file changes in a repository. RoughTools Diff Checker is for comparing any arbitrary text without a git repository: comparing API responses, comparing config files from different servers, checking what changed between two versions of a document, or diffing clipboard contents. It requires no command-line access, no file system access, and works from any browser on any machine.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as character-level inline diff highlighting, ignore whitespace option, word diff mode, side-by-side merge view, or file upload support — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include a minimal example of the two texts that produced the unexpected diff, the browser and OS, and what you expected versus what was shown.' },
  { q: 'What types of content can I compare with this tool?', a: 'The diff checker works with any plain text content: source code in any language (JavaScript, Python, SQL, Go, etc.), JSON and YAML configuration files, XML documents, HTML templates, CSS stylesheets, Markdown documents, log file excerpts, CLI command output, database schema definitions, environment variable files, and any other text-based content. The tool treats each line as a unit — it shows which lines were added, removed, or unchanged between the two versions.' },
  { q: 'What is the difference between a line diff and a word diff?', a: 'A line diff (what this tool uses) compares entire lines as units — a line either matches or it does not. This is the standard format used by git diff and Unix diff utilities. It is ideal for code review and configuration comparison where you want to see which lines changed. A word diff compares individual words within each line, highlighting specific words that changed rather than entire lines. Word diff is better for prose documents where you want to see exactly which words were modified in a paragraph. This tool currently uses line-level diff, which is the most common format for developer use cases.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Diff Checker', item: 'https://roughtools.com/tools/developer/diff-checker' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Diff Checker',
    url: 'https://roughtools.com/tools/developer/diff-checker',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online diff checker tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">Diff Checker</h1>
          <span className="ml-auto text-xs bg-yellow-900/50 text-yellow-400 border border-yellow-800 px-2 py-0.5 rounded-full">↔️ Added · Removed · Unchanged</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-900/60 to-amber-900/60 border-b border-yellow-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Line-by-Line Diff', 'Side-by-Side', 'Added Lines', 'Removed Lines', 'Private', 'Free'].map(b => (
              <span key={b} className="text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Diff Checker — Compare Two Texts</h2>
          <p className="text-yellow-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Compare any two texts side by side and see differences highlighted instantly — added lines in green, removed lines in red, unchanged lines shown normally. Works for code, JSON, YAML, configuration files, documents, and any plain text. All comparison runs in your browser with zero server communication — safe for sensitive code, credentials, and internal configurations.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-yellow-900/20 rounded-2xl p-1"><DiffCheckerClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'Your code and config files never leave your browser' }, { icon: '🟢', title: 'Color-Coded', desc: 'Green for added, red for removed, grey for unchanged' }, { icon: '⚡', title: 'Instant', desc: 'Diff computed in real time as you type' }].map(c => (
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
            {[{ href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/yaml-validator', label: '📄 YAML Validator' }, { href: '/tools/developer/xml-formatter', label: '📋 XML Formatter' }, { href: '/tools/developer/regex-tester', label: '.* Regex Tester' }, { href: '/tools/developer/sql-formatter', label: '🗃️ SQL Formatter' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Diff Checker"
          toolSlug="diff-checker"
          toolUrl="https://roughtools.com/tools/developer/diff-checker"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
