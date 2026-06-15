import type { Metadata } from 'next'
import Link from 'next/link'
import SeoOptimizerClient from './SeoOptimizerClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'SEO Optimizer — Free On-Page SEO Checker & Analyser | RoughTools',
  description: 'Analyse your page title, meta description, keyword density, content length, and readability. Get an SEO score from 0–100, a letter grade, and specific actionable fixes. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/business/seo-optimizer' },
  openGraph: {
    title: `SEO Optimizer — Free SEO Content Optimizer | RoughTools`,
    description: `Optimize your content for search engines with AI. Meta titles, descriptions, headers, and keyword suggestions. Free SEO tool.`,
    url: 'https://roughtools.com/tools/business/seo-optimizer',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `SEO Optimizer — Free SEO Content Optimizer | RoughTools`,
    description: `Optimize your content for search engines with AI. Meta titles, descriptions, headers, and keyword suggestions. Free SEO tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this SEO optimizer tool free to use?',
    a: 'Yes, the RoughTools SEO Optimizer is completely free with no account, subscription, or payment required. You can analyse unlimited pages — checking title length, meta description, keyword density, content length, and readability — at no cost. RoughTools is funded through non-intrusive advertising, which keeps every business tool permanently free. There are no usage limits, no advanced checks locked behind a premium tier, and no registration of any kind required.'
  },
  {
    q: 'Do I need to sign up to check my page SEO?',
    a: 'No account, email address, or registration is required. Paste your page title, meta description, content, and target keyword into the tool, and your SEO score appears instantly with a full breakdown and action list. There is no login wall, no paywall on any check, and no data stored about your pages or keywords. The tool is entirely anonymous — your content and keyword strategy remain completely private throughout the analysis.'
  },
  {
    q: 'Does this tool send my content to a server for analysis?',
    a: 'No. All SEO analysis runs entirely within your browser using JavaScript. The page title, meta description, content, and target keyword you enter are never transmitted to RoughTools servers, never logged, and never shared with search engines or SEO data providers. Your content remains completely private. This is important for drafts, unreleased pages, and proprietary content — you can analyse anything without it being indexed or shared before you are ready to publish.'
  },
  {
    q: 'Does the SEO optimizer work on mobile and tablet?',
    a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and the results panel — including the score, grade, and individual check results — are optimised for touch screens. This is useful when reviewing content on mobile devices or auditing pages from your phone. The actionable fix list is readable on small screens without horizontal scrolling.'
  },
  {
    q: 'Which browsers are supported by this SEO checker?',
    a: 'The SEO Optimizer works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required — the analysis uses standard JavaScript text processing that runs natively in every current browser. For the best experience with the score display and colour-coded results, any current version of Chrome, Firefox, or Safari on desktop is recommended.'
  },
  {
    q: 'How accurate is the SEO score this tool produces?',
    a: 'The score reflects the five on-page SEO factors analysed: title length, meta description length and keyword presence, keyword density, content length, and readability. These are well-established, widely-agreed-upon on-page SEO best practices that align with Google\'s published guidelines. The score does not account for off-page factors (backlinks, domain authority), technical SEO (Core Web Vitals, page speed, mobile-friendliness), or ranking competition for the target keyword. Use it as a reliable on-page content quality indicator, not a complete ranking predictor.'
  },
  {
    q: 'Can I use this SEO checker without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all SEO analysis runs in JavaScript without requiring an active internet connection. You can paste content and run analyses offline after the initial page load. This is useful when reviewing draft content in environments with limited internet access. The initial page load requires internet access to download the tool, but after that the analyser functions entirely client-side for as long as the browser tab remains open.'
  },
  {
    q: 'How do I use the SEO optimizer step by step?',
    a: 'To analyse a page: (1) Enter your target keyword — the primary search term you want this page to rank for. (2) Paste your page title (the HTML title tag or H1). (3) Paste your meta description — the text that appears in Google search results under your page title. (4) Paste your full page content — the body text of the article or page. (5) Click Analyse. The tool produces a score from 0–100, a letter grade (A–F), individual pass/fail results for each check, and a prioritised list of specific improvements to make before publishing.'
  },
  {
    q: 'Why should I use RoughTools instead of paid SEO tools like Ahrefs or SEMrush?',
    a: 'Paid SEO tools like Ahrefs, SEMrush, and Moz provide extensive keyword research, backlink analysis, and competitive intelligence that this tool does not. However, for on-page content SEO checks — which most writers and content managers need for every single piece of content they publish — those tools require expensive monthly subscriptions. RoughTools SEO Optimizer provides instant on-page analysis for free, with no account, making it ideal for quick pre-publish checks, content auditing, and teaching on-page SEO fundamentals without tool cost barriers.'
  },
  {
    q: 'How do I report a bug or suggest a new SEO check?',
    a: 'To report a bug or suggest a new check — such as H1/H2 heading analysis, image alt text detection, internal link count, schema markup presence, LSI keyword coverage, or reading grade level scoring — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the content you analysed (or a description), the score you received, the browser and OS, and what you expected. Feature requests for bulk URL analysis, CSV export, or WordPress plugin integration are reviewed and prioritised regularly.'
  },
  {
    q: 'What is keyword density and what percentage should I target?',
    a: 'Keyword density is the percentage of your total word count that consists of your target keyword. For example, if your page has 1,000 words and your keyword appears 10 times, the density is 1%. The recommended range is 1–2% for most content — enough to clearly signal relevance to search engines without appearing to stuff the keyword unnaturally. Below 0.5% may mean the page is not focused on the target keyword. Above 3% risks keyword stuffing, which Google penalises. Modern SEO also values semantic relevance — using related terms and synonyms — not just exact keyword repetition.'
  },
  {
    q: 'What content length is best for SEO ranking?',
    a: 'Minimum content length for SEO consideration is 300 words — pages below this are typically considered thin content and rank poorly or are deindexed. For competitive keywords, 800–1,500 words is the typical range for ranking in page one results. In-depth pillar content targeting broad keywords often benefits from 2,000–3,000 words when it genuinely covers the topic comprehensively. Longer is not always better — content should match the search intent and cover the topic thoroughly. A 400-word page answering a specific question can outrank a 2,000-word general overview if it better satisfies user intent.'
  },
]

export default function SeoOptimizerPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
      { '@type': 'ListItem', position: 3, name: 'SEO Optimizer', item: 'https://roughtools.com/tools/business/seo-optimizer' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SEO Optimizer',
    url: 'https://roughtools.com/tools/business/seo-optimizer',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online seo optimizer tool by RoughTools.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />

      {/* Breadcrumb */}
      <div className="bg-[var(--bg-1)] border-b border-[var(--line)] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-2 text-xs text-[var(--fg-2)]">
          <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools/business" className="hover:text-violet-600 transition-colors">Business Tools</Link>
          <span>›</span>
          <span className="text-[var(--fg)] font-semibold">SEO Optimizer</span>
          <span className="ml-auto text-[11px] bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">🔍 5 SEO Checks · Free</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">🔍</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">SEO Optimizer</h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Get an instant on-page SEO health score for any page before you publish. Paste your title, meta description, target keyword, and page content — the analyser checks five critical SEO factors, produces a score from 0 to 100, assigns a letter grade from A to F, and gives you a prioritised list of specific improvements to make. All analysis runs in your browser with no data uploaded to any server, making it safe for draft content, client work, and unreleased pages.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Title Length', 'Meta Description', 'Keyword Density', 'Content Length', 'Readability', 'Letter Grade', 'Free'].map(chip => (
                  <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-violet-100">{chip}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Tool */}
        <div data-print-section="calculator">
        <SeoOptimizerClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📊', title: '0–100 Score', desc: 'Instant SEO health score with A–F letter grade' },
            { icon: '🔒', title: 'Private', desc: 'Content and keywords never leave your browser' },
            { icon: '🛠️', title: 'Fix List', desc: 'Specific, actionable improvements for each failed check' },
          ].map(c => (
            <div key={c.title} className="bg-[var(--bg-1)] border border-[var(--line)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-[var(--fg)] text-sm mb-1">{c.title}</div>
              <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* What each check analyses */}
        <section className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--fg)] mb-5">What Each SEO Check Analyses</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: '🔤', check: 'Page Title', detail: 'Length: 50–60 characters ideal. Keyword position: first 3 words has highest weight. Truncation risk: titles over 60 chars are cut off in Google results.' },
              { icon: '📝', check: 'Meta Description', detail: 'Length: 140–160 characters optimal. Keyword presence confirms relevance. Compelling descriptions improve click-through rate from search results.' },
              { icon: '🔑', check: 'Keyword Density', detail: 'Target: 1–2% of total word count. Below 0.5% = under-optimised. Above 3% = over-optimised (stuffing risk). Uses exact-match count.' },
              { icon: '📖', check: 'Content Length', detail: 'Under 300 words = thin content (poor ranking potential). 600–800 = acceptable for focused topics. 1,000+ = recommended for competitive keywords.' },
              { icon: '💬', check: 'Readability', detail: 'Based on average sentence length. Under 20 words/sentence = easy to read. Over 30 words/sentence = complex. Readable content reduces bounce rate.' },
            ].map(c => (
              <div key={c.check} className="bg-[var(--bg-2)] rounded-xl p-4">
                <div className="font-semibold text-gray-900 mb-1">{c.icon} {c.check}</div>
                <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.detail}</div>
              </div>
            ))}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <div className="font-semibold text-violet-800 mb-1">🎯 Combined SEO Score</div>
              <div className="text-violet-600 text-xs leading-relaxed">All 5 checks weighted and combined into a 0–100 score. A = 90+, B = 75–89, C = 60–74, D = 45–59, F = below 45. Fix the lowest-scoring checks first for maximum score improvement.</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-[var(--fg)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--bg-1)] shadow-sm">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-[var(--bg-2)] hover:bg-[var(--bg-3)] transition-colors">
                  <h3 className="text-sm font-semibold text-[var(--fg)] text-left pr-4">{faq.q}</h3>
                  <span className="text-purple-500 font-bold text-lg flex-shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm text-[var(--fg-1)] leading-relaxed border-t border-[var(--line)]">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <div className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--fg)] mb-3">Related Business Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/tools/business/landing-page-builder', label: '🖥️ Landing Page Builder' },
              { href: '/tools/business/sales-copy-ai', label: '✍️ Sales Copy AI' },
              { href: '/tools/business/ad-creative-generator', label: '🎯 Ad Creative Generator' },
              { href: '/tools/business/email-marketing-ai', label: '📧 Email Marketing AI' },
              { href: '/tools/business/social-media-scheduler', label: '📅 Social Media Scheduler' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-[var(--bg-2)] border border-[var(--line)] rounded-full px-4 py-1.5 text-[var(--fg-1)] hover:border-[var(--brand-2)] hover:text-[var(--brand-2)] transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="SEO Optimizer"
          toolSlug="seo-optimizer"
          toolUrl="https://roughtools.com/tools/business/seo-optimizer"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </main>
    </div>
  )
}
