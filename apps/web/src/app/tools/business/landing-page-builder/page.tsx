import type { Metadata } from 'next'
import Link from 'next/link'
import LandingPageClient from './LandingPageClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Landing Page Builder — Free Copy Generator | RoughTools',
  description: 'Generate a complete landing page copy structure — hero headline, sub-headline, benefits, social proof, FAQ, and CTA — all 9 sections ready to paste into your page builder. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/business/landing-page-builder' },
  openGraph: {
    title: `Landing Page Builder — Create Landing Page Copy | RoughTools`,
    description: `Generate high-converting landing page copy with AI. Headlines, benefits, CTAs, and social proof sections. Free online tool.`,
    url: 'https://roughtools.com/tools/business/landing-page-builder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Landing Page Builder — Create Landing Page Copy | RoughTools`,
    description: `Generate high-converting landing page copy with AI. Headlines, benefits, CTAs, and social proof sections. Free online tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this landing page copy generator free to use?',
    a: 'Yes, the RoughTools Landing Page Builder is completely free with no account, subscription, or payment required. You can generate complete 9-section landing page copy for unlimited products and services at no cost. RoughTools is funded through non-intrusive advertising, which keeps every business tool permanently free. There are no usage limits, no premium sections locked behind a paywall, and no registration required to generate and copy the full landing page structure.'
  },
  {
    q: 'Do I need to sign up to generate landing page copy?',
    a: 'No account, email address, or registration is required. Enter your product name, value proposition, target audience, and key benefits — your complete landing page copy is generated instantly across all nine sections. There is no login wall, no upgrade required to see any section, and no data stored about your product or business. The tool is entirely anonymous and can be used for unlimited projects without any sign-up process.'
  },
  {
    q: 'Does this tool store or share the product information I enter?',
    a: 'No. All landing page copy generation runs entirely within your browser using JavaScript templates. The product name, value proposition, audience, benefits, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Your product strategy and copy remain completely private throughout the session. Once you close the browser tab, all entered data is gone with no trace retained.'
  },
  {
    q: 'Does the landing page builder work on mobile and tablet?',
    a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and the nine generated copy sections are optimised for touch screens and small display sizes. You can generate and copy landing page sections on mobile, making it easy to draft page content wherever you are. Copy buttons work on iOS Safari and Android Chrome for direct pasting into your page builder, CMS, or notes app.'
  },
  {
    q: 'Which browsers support this landing page copy generator?',
    a: 'The Landing Page Builder works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The generator uses standard JavaScript that runs natively in every current browser. For the most reliable clipboard copy function across all nine sections, Chrome or Firefox on desktop is recommended, though all current browsers fully support the clipboard API used.'
  },
  {
    q: 'How complete is the generated landing page copy?',
    a: 'The generator produces copy for all nine standard conversion-focused sections: hero headline and sub-headline, problem statement, solution introduction, feature and benefit list, social proof placeholders, pricing or offer section, FAQ section, risk reversal (guarantee), and final CTA. Each section follows conversion copywriting principles — the hero leads with the transformation, benefits are stated before features, the CTA is specific and action-oriented. The output is a complete first draft that requires personalisation with real testimonials, specific pricing, and unique product details.'
  },
  {
    q: 'Can I use this tool without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all copy generation runs in JavaScript without requiring an active internet connection. You can enter product details and generate all nine landing page sections offline after the initial page load. The initial page load requires internet access, but after that the generator functions entirely client-side. This is useful when drafting page copy during travel or in locations with poor connectivity.'
  },
  {
    q: 'How do I generate landing page copy step by step?',
    a: 'To generate a landing page: (1) Enter your product or service name. (2) Write your core value proposition — the single most important outcome your product delivers. (3) Describe your target audience specifically, including their primary pain point. (4) List three to five key features or benefits, separated clearly. (5) Select the page goal: lead generation, product sale, app download, or consultation booking. (6) Click Generate — all nine sections are produced at once. Copy each section using the individual copy buttons and paste into your page builder (Webflow, Framer, WordPress, Squarespace, etc.).'
  },
  {
    q: 'Why should I use RoughTools instead of hiring a copywriter?',
    a: 'A professional conversion copywriter for a full landing page typically costs $500–$3,000+ and requires a briefing process, revision cycles, and several days of turnaround time. RoughTools Landing Page Builder generates a complete structural first draft in seconds for free. It is not a replacement for an experienced copywriter on high-stakes pages with significant advertising spend — but for early-stage products, MVP launches, agency first drafts, and smaller businesses, it provides a solid, correctly structured starting point that can be refined without starting from a blank page.'
  },
  {
    q: 'How do I report a bug or request a new landing page section?',
    a: 'To report a bug or suggest a new section — such as comparison tables, video script copy, countdown timer copy, exit-intent popup copy, sticky header CTA, or industry-specific templates for SaaS, ecommerce, or services — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the section that had an issue, the browser and OS, and what you expected versus what was generated. Feature requests are reviewed and prioritised regularly.'
  },
  {
    q: 'What are the 9 sections of a high-converting landing page?',
    a: 'A complete conversion-focused landing page contains: (1) Hero — bold headline, sub-headline, and primary CTA above the fold. (2) Problem — validate the audience pain point to create emotional connection. (3) Solution — introduce your product as the answer. (4) Features & Benefits — list what it does and what the user gets. (5) Social Proof — testimonials, logos, or statistics. (6) Offer — pricing, what is included, and value stacking. (7) FAQ — remove purchase objections. (8) Guarantee — risk reversal to reduce hesitation. (9) Final CTA — repeat the primary action with urgency or scarcity framing.'
  },
  {
    q: 'Can I use the generated copy commercially for client landing pages?',
    a: 'Yes, all content generated by this tool can be used commercially — for your own business pages, client projects, agency deliverables, or as part of a content or web design service. There are no licensing restrictions on the output. The generated copy uses templates based on established conversion copywriting frameworks rather than proprietary material. Always customise the output with real testimonials, actual pricing, and product-specific details before publishing, and ensure all claims are factually accurate for the specific product or service.'
  },
]

export default function LandingPagePage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
      { '@type': 'ListItem', position: 3, name: 'Landing Page Builder', item: 'https://roughtools.com/tools/business/landing-page-builder' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Landing Page Builder',
    url: 'https://roughtools.com/tools/business/landing-page-builder',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online landing page builder tool by RoughTools.',
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
          <span className="text-[var(--fg)] font-semibold">Landing Page Builder</span>
          <span className="ml-auto text-[11px] bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">🖥️ 9 Sections · Free</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">🖥️</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Landing Page Builder</h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Generate a complete, conversion-optimised landing page copy structure in one click — all nine sections from hero headline to final CTA, ready to paste directly into Webflow, Framer, Wix, WordPress, Squarespace, or any page builder. Each section is written using proven direct-response copywriting frameworks: AIDA for the hero, PAS for the problem section, benefit-led writing for features, and urgency framing for the close. Enter your product, audience, and key benefits to get a full first draft instantly.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Hero Copy', 'Problem Statement', 'Benefits', 'Social Proof', 'FAQ Section', 'CTA', '9 Sections', 'Free'].map(chip => (
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
        <LandingPageClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📄', title: '9 Sections', desc: 'Hero → Problem → Solution → Features → Proof → Offer → FAQ → Guarantee → CTA' },
            { icon: '🔒', title: 'Private', desc: 'Product details and page copy never leave your browser' },
            { icon: '⚡', title: 'Instant', desc: 'Complete page structure generated in under one second' },
          ].map(c => (
            <div key={c.title} className="bg-[var(--bg-1)] border border-[var(--line)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-[var(--fg)] text-sm mb-1">{c.title}</div>
              <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Section map */}
        <section className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--fg)] mb-5">The 9-Section Landing Page Structure</h2>
          <div className="space-y-2">
            {[
              { num: '01', section: 'Hero', desc: 'Bold headline + sub-headline + primary CTA. Must communicate the transformation above the fold.' },
              { num: '02', section: 'Problem', desc: 'Validate the audience pain point. Creates emotional resonance and confirms you understand their situation.' },
              { num: '03', section: 'Solution', desc: 'Introduce your product as the answer to the problem. Bridge from pain to relief.' },
              { num: '04', section: 'Features & Benefits', desc: 'List what the product does (features) paired with what the user gets (benefits).' },
              { num: '05', section: 'Social Proof', desc: 'Testimonials, customer logos, case study numbers, or press mentions. Reduces skepticism.' },
              { num: '06', section: 'Offer', desc: 'Pricing, plan comparison, or what is included. Value stacking to justify the price.' },
              { num: '07', section: 'FAQ', desc: 'Address the top five objections and hesitations that prevent purchase.' },
              { num: '08', section: 'Guarantee', desc: 'Risk reversal — money-back, free trial, or satisfaction guarantee to remove hesitation.' },
              { num: '09', section: 'Final CTA', desc: 'Repeat the primary action with urgency or scarcity framing. Last chance to convert.' },
            ].map(s => (
              <div key={s.num} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--bg-2)] transition-colors">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">{s.num}</span>
                <div>
                  <span className="font-semibold text-gray-900 text-sm">{s.section}</span>
                  <span className="text-[var(--fg-2)] text-xs"> — {s.desc}</span>
                </div>
              </div>
            ))}
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
              { href: '/tools/business/seo-optimizer', label: '🔍 SEO Optimizer' },
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
          toolName="Landing Page Builder"
          toolSlug="landing-page-builder"
          toolUrl="https://roughtools.com/tools/business/landing-page-builder"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </main>
    </div>
  )
}
