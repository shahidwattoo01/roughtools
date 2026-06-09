import type { Metadata } from 'next'
import Link from 'next/link'
import MarkdownEditorClient from './MarkdownEditorClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Markdown Editor — Live Preview Online | RoughTools',
  description: 'Free online Markdown editor with live preview. Write Markdown on the left and instantly see the rendered HTML on the right. Supports all standard Markdown syntax.',
  keywords: ['markdown editor', 'markdown preview', 'online markdown editor', 'live markdown preview', 'markdown to html', 'markdown renderer'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/markdown-editor' },
  openGraph: {
    title: `Markdown Editor — Live Preview Markdown Online | RoughTools`,
    description: `Write and preview Markdown in real time with a split-pane editor. Free online Markdown editor with live rendered output.`,
    url: 'https://roughtools.com/tools/developer/markdown-editor',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Markdown Editor — Live Preview Markdown Online | RoughTools`,
    description: `Write and preview Markdown in real time with a split-pane editor. Free online Markdown editor with live rendered output.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this Markdown editor free to use?', a: 'Yes, the RoughTools Markdown Editor is completely free with no account, subscription, or payment required. You can write and preview unlimited Markdown documents at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no document size restrictions beyond browser memory, and no registration required.' },
  { q: 'Do I need to sign up to use the Markdown editor?', a: 'No account, email, or registration is required. Open the page, start writing Markdown, and see the live rendered preview instantly. There is no login wall, no paywall on any feature, and no data stored about the documents you write. The editor is entirely anonymous — your content is never transmitted or retained anywhere.' },
  { q: 'Is my Markdown content sent to a server?', a: 'No. All Markdown parsing and rendering runs entirely within your browser using a client-side JavaScript Markdown library. Your content — which may include private documentation, unreleased product copy, technical notes, or personal writing — never leaves your device. Once you close the tab, all data is gone with no server trace retained.' },
  { q: 'Does the Markdown editor work on mobile and tablet?', a: 'Yes, the editor is fully responsive and works on all modern smartphones and tablets. The two-panel layout (editor and preview) adapts to smaller screens. This is useful for drafting README files on the go, writing documentation while away from a desktop, reviewing Markdown content on your phone, or editing blog posts from a tablet.' },
  { q: 'Which browsers support this Markdown editor?', a: 'The Markdown Editor works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins or extensions are required. The editor uses a client-side Markdown parser and standard browser rendering. Any current version of Chrome, Firefox, or Safari on desktop or mobile is fully supported.' },
  { q: 'What Markdown syntax does this editor support?', a: 'The editor supports all standard CommonMark Markdown syntax: headings (# H1 through ###### H6), bold (**text**), italic (*text*), blockquotes (>), ordered and unordered lists, inline code (`code`), code blocks (``` with optional language), horizontal rules (---), links ([text](url)), and images (![alt](url)). It also supports GitHub Flavored Markdown (GFM) extensions including tables (|col1|col2|), task lists (- [x]), and strikethrough (~~text~~) depending on the parser.' },
  { q: 'Can I use this Markdown editor without an internet connection?', a: 'Once the page has fully loaded, all Markdown editing and preview rendering runs in JavaScript without requiring an active internet connection. You can write and preview Markdown offline after the initial page load. This is useful for drafting documentation during travel, writing content in locations with poor connectivity, or editing technical notes in restricted network environments.' },
  { q: 'How do I use the Markdown editor step by step?', a: 'To use the editor: (1) Type or paste Markdown text in the left panel. (2) The rendered preview updates in real time on the right panel — no button press required. (3) Use the Markdown syntax reference below to format headings, bold, italic, lists, code, and tables. (4) Copy the rendered HTML from the preview area or copy the raw Markdown for use elsewhere. (5) For code blocks, type three backticks followed by a language name (```javascript) for syntax highlighting in the preview.' },
  { q: 'Why should I use RoughTools instead of VS Code for Markdown preview?', a: 'VS Code has excellent built-in Markdown preview and is the best tool for editing Markdown files in a project. RoughTools Markdown Editor is for quick one-off tasks where you do not want to open VS Code, create a file, and set up a workspace: drafting a README snippet, checking how formatted text will look, or previewing Markdown you received in a message or email. It requires zero setup and works immediately from any browser.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as export to HTML or PDF, Markdown table generator UI, syntax highlighting in the editor pane, custom CSS themes, or GitHub README preview mode — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the Markdown snippet that caused the issue, the browser and OS, and what you expected versus what was rendered.' },
  { q: 'What is Markdown and why is it widely used?', a: 'Markdown is a lightweight plain-text formatting syntax created by John Gruber in 2004. It uses simple punctuation characters to indicate formatting — # for headings, ** for bold, * for italic, - for lists — that converts to valid HTML. Markdown is widely used because it is easy to write, readable as plain text, version-control friendly, and universally supported: GitHub READMEs, Stack Overflow posts, Notion documents, Jekyll/Hugo blogs, Discord messages, Slack messages, and most documentation platforms render Markdown. It has become the de facto standard for developer-facing documentation.' },
  { q: 'What is the difference between Markdown and HTML?', a: 'HTML (HyperText Markup Language) is the actual markup language that browsers render — it uses explicit tags like <h1>, <strong>, and <ul>. HTML is precise but verbose and difficult to write quickly by hand. Markdown is a human-friendly shorthand that compiles to HTML — # is equivalent to <h1>, **text** is equivalent to <strong>text</strong>. Markdown is easier to read and write as plain text, but less expressive than HTML for complex layouts. Most Markdown renderers allow raw HTML to be embedded for complex formatting needs that Markdown syntax cannot express.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Markdown Editor', item: 'https://roughtools.com/tools/developer/markdown-editor' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Markdown Editor',
    url: 'https://roughtools.com/tools/developer/markdown-editor',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online markdown editor tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">Markdown Editor</h1>
          <span className="ml-auto text-xs bg-slate-700/80 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-full">📝 Write · Preview · Instant</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 border-b border-slate-700/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Live Preview', 'CommonMark', 'GFM Tables', 'Code Blocks', 'Split Panel', 'Free'].map(b => (
              <span key={b} className="text-xs bg-slate-800/80 text-slate-300 border border-slate-600/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Markdown Editor with Live Preview</h2>
          <p className="text-slate-300/80 text-sm sm:text-base leading-relaxed max-w-3xl">Write Markdown on the left and see the rendered HTML preview update in real time on the right — no button to click, no page reload. Supports all standard CommonMark syntax plus GitHub Flavored Markdown (GFM) extensions including tables, task lists, and strikethrough. Useful for drafting README files, writing documentation, previewing blog posts, and checking Markdown formatting. All content is processed client-side — your writing never leaves your browser.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-slate-700/20 rounded-2xl p-1"><MarkdownEditorClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '👁️', title: 'Live Preview', desc: 'Rendered HTML updates in real time as you type' }, { icon: '📋', title: 'Full Syntax', desc: 'CommonMark + GFM: tables, task lists, code blocks' }, { icon: '🔒', title: 'Private', desc: 'Your content never leaves your browser' }].map(c => (
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
                <span className="text-slate-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/diff-checker', label: '↔️ Diff Checker' }, { href: '/tools/developer/html-encoder', label: '🌐 HTML Encoder' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/js-beautifier', label: '✨ JS Beautifier' }, { href: '/tools/developer/regex-tester', label: '.* Regex Tester' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-slate-400 hover:text-slate-300 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Markdown Editor"
          toolSlug="markdown-editor"
          toolUrl="https://roughtools.com/tools/developer/markdown-editor"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
