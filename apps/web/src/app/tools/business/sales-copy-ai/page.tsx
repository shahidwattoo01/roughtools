import type { Metadata } from 'next'
import Link from 'next/link'
import SalesCopyClient from './SalesCopyClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Sales Copy AI — Free Copywriting Generator | RoughTools',
  description: 'Generate high-converting sales copy, headlines, product descriptions, CTAs, and full sales pages instantly. Choose tone, format, and audience. Free, no signup required.',
  alternates: { canonical: 'https://roughtools.com/tools/business/sales-copy-ai' },
  openGraph: {
    title: `Sales Copy AI — Generate Sales Copy Online Free | RoughTools`,
    description: `Generate persuasive sales copy with AI. Create compelling product descriptions, sales emails, and VSL scripts. Free tool.`,
    url: 'https://roughtools.com/tools/business/sales-copy-ai',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Sales Copy AI — Generate Sales Copy Online Free | RoughTools`,
    description: `Generate persuasive sales copy with AI. Create compelling product descriptions, sales emails, and VSL scripts. Free tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this sales copy generator free to use?',
    a: 'Yes, the RoughTools Sales Copy AI is completely free with no subscription, account, or payment required. You can generate unlimited sales copy across all six formats — headlines, product descriptions, CTAs, email subjects, ad copy, and full sales pages — at no cost. RoughTools is funded through non-intrusive advertising, keeping every business tool permanently free. There are no usage limits and no premium copy formats locked behind a paywall.'
  },
  {
    q: 'Do I need to sign up to generate sales copy?',
    a: 'No account, email address, or registration is required at any stage. Enter your product details, select a copy format and tone, and your sales copy is generated instantly. There is no login wall, no upgrade required to access any format, and no data stored about your business or products. The tool is entirely anonymous — you can draft copy for unlimited products and campaigns without any sign-up process or personal information required.'
  },
  {
    q: 'Does this tool store or share my product information?',
    a: 'No. All copy generation runs entirely within your browser using JavaScript templates. The product name, benefits, target audience, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with any third party. Your business details and copywriting work remain completely private throughout the session. Once you close the browser tab, all data is gone with no trace retained anywhere.'
  },
  {
    q: 'Does the sales copy generator work on mobile and tablet?',
    a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and copy output panels are optimised for touch screens. This is useful when you need to quickly draft product copy or a campaign headline on the go. The copy button works on mobile browsers, letting you paste directly into your website CMS, ad platform, or email marketing tool from your phone or tablet.'
  },
  {
    q: 'Which browsers support this copywriting tool?',
    a: 'The Sales Copy AI works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The generator uses standard JavaScript that runs natively in every current browser. For the most reliable clipboard copy function, Chrome or Firefox on desktop is recommended, though all modern browsers support the clipboard API used by the copy buttons.'
  },
  {
    q: 'How good is the quality of the generated sales copy?',
    a: 'The generated copy follows established direct-response copywriting principles: benefit-first headlines, problem-agitate-solution structure for long-form content, specificity over vague claims, and action-oriented CTAs. Copy quality improves significantly with specific inputs — the more precise your product name, audience description, and key benefit, the more targeted the output. The generator provides a strong first draft that typically requires personalisation and fact-checking before publishing. Think of it as a professional copywriting framework applied to your specific product rather than a final finished piece.'
  },
  {
    q: 'Can I use this tool without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all copy generation runs in JavaScript without requiring an active internet connection. You can enter product details and generate copy offline after the initial page load. This is useful when brainstorming or drafting campaign copy during travel or in areas with poor signal. The initial page load requires internet access, but after that the generator functions entirely client-side for as long as the browser tab remains open.'
  },
  {
    q: 'How do I generate sales copy step by step?',
    a: 'To generate copy: (1) Enter your product or service name. (2) Write a clear description of the main benefit — what problem does it solve, and what outcome does the customer get? (3) Describe your target audience specifically — job role, life situation, or pain point. (4) Select the copy format: headline, product description, CTA, email subject, ad copy, or full sales page. (5) Choose a tone — persuasive, professional, conversational, urgent, or inspirational. (6) Click Generate. Copy the output using the copy button and paste into your website, ad manager, or email platform. Regenerate as many variations as you need.'
  },
  {
    q: 'Why should I use RoughTools instead of ChatGPT for copywriting?',
    a: 'RoughTools Sales Copy AI is purpose-built for direct-response marketing copy — it applies specific copywriting formulas (AIDA, PAS, benefit-led) to each format automatically. General AI assistants require careful prompting to produce copy that follows these frameworks, and the results are inconsistent without expert prompt knowledge. This tool outputs correctly structured copy for the specific format you choose, in seconds, without a paid subscription, and without writing a complex prompt. It is optimised for speed and consistency across standard marketing formats.'
  },
  {
    q: 'How do I report a bug or request a new copy format?',
    a: 'To report a bug or request a new format — such as video script intros, podcast ad reads, Amazon product listings, Kickstarter campaign copy, press release leads, or pitch deck copy — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the format selected, the browser and OS, and what you expected versus what was generated. Feature requests for industry-specific templates, tone presets, or A/B headline pair generation are reviewed and prioritised regularly.'
  },
  {
    q: 'What is the difference between a headline and sales copy?',
    a: 'A headline is the first line of any piece of copy — its only job is to stop the reader and compel them to read the next line. Effective headlines are specific, benefit-focused, curiosity-driven, or problem-aware. Sales copy is the full body text that persuades: it expands on the headline promise, explains the product, handles objections, builds desire, and closes with a call to action. A full sales page includes both, plus social proof, risk reversal (guarantee), and urgency elements. This generator produces all of these components depending on which format you select.'
  },
  {
    q: 'Can I use the generated copy commercially for client projects?',
    a: 'Yes, all content generated by this tool can be used commercially — for your own business, client copywriting projects, agency deliverables, or resale as part of a content service. There are no licensing restrictions on the output. The templates are based on established copywriting frameworks rather than proprietary or copyrighted material. As with any generated content, always customise the output with specific product details, verify all factual claims, and ensure the copy reflects the actual benefits of the product before publishing or delivering to clients.'
  },
]

export default function SalesCopyPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
      { '@type': 'ListItem', position: 3, name: 'Sales Copy AI', item: 'https://roughtools.com/tools/business/sales-copy-ai' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sales Copy AI',
    url: 'https://roughtools.com/tools/business/sales-copy-ai',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online sales copy ai tool by RoughTools.',
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
          <span className="text-[var(--fg)] font-semibold">Sales Copy AI</span>
          <span className="ml-auto text-[11px] bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-semibold">✍️ 6 Copy Formats · Free</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">✍️</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Sales Copy AI</h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Generate high-converting sales copy for any product or service across six essential formats: attention-grabbing headlines, persuasive product descriptions, compelling CTAs, email subject lines, ad copy, and complete sales pages. Each format applies proven direct-response copywriting frameworks — AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitate, Solution), and benefit-first writing — so the output is structured to convert rather than merely describe. Choose your tone, enter your product and audience, and get professional-quality copy instantly without a paid writing tool subscription.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Headlines', 'Product Descriptions', 'CTAs', 'Email Subjects', 'Ad Copy', 'Sales Pages', 'Free'].map(chip => (
                  <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-violet-100">{chip}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Tool */}
        <SalesCopyClient />

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🎯', title: '6 Formats', desc: 'Headlines, descriptions, CTAs, subjects, ads & full sales pages' },
            { icon: '🔒', title: 'Private', desc: 'Your product details and copy ideas never leave your browser' },
            { icon: '📐', title: 'DR Frameworks', desc: 'AIDA & PAS copywriting structures applied automatically' },
          ].map(c => (
            <div key={c.title} className="bg-[var(--bg-1)] border border-[var(--line)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-[var(--fg)] text-sm mb-1">{c.title}</div>
              <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Copywriting frameworks */}
        <section className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--fg)] mb-5">Copywriting Frameworks Used</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { name: 'AIDA', full: 'Attention · Interest · Desire · Action', desc: 'Classic funnel framework. Grab attention, build interest, create desire, prompt action. Used for ads, landing pages, and sales emails.', color: 'bg-violet-50 border-violet-200' },
              { name: 'PAS', full: 'Problem · Agitate · Solution', desc: 'Identify the reader\'s pain point, intensify it, then present the product as the relief. Highly effective for product descriptions and long-form copy.', color: 'bg-purple-50 border-purple-200' },
              { name: 'Benefit-First', full: 'Lead with outcome, not feature', desc: 'State the transformation or result the customer gets before explaining how. "Lose 10 lbs in 30 days" beats "Advanced metabolic formula."', color: 'bg-indigo-50 border-indigo-200' },
            ].map(f => (
              <div key={f.name} className={`rounded-xl p-4 border ${f.color}`}>
                <div className="font-bold text-[var(--fg)] text-base">{f.name}</div>
                <div className="text-violet-600 text-xs font-medium mb-2">{f.full}</div>
                <div className="text-[var(--fg-2)] text-xs leading-relaxed">{f.desc}</div>
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
                  <span className="text-violet-500 font-bold text-lg flex-shrink-0">+</span>
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
              { href: '/tools/business/ad-creative-generator', label: '🎯 Ad Creative Generator' },
              { href: '/tools/business/email-marketing-ai', label: '📧 Email Marketing AI' },
              { href: '/tools/business/landing-page-builder', label: '🖥️ Landing Page Builder' },
              { href: '/tools/business/social-media-scheduler', label: '📅 Social Media Scheduler' },
              { href: '/tools/business/seo-optimizer', label: '🔍 SEO Optimizer' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-[var(--bg-2)] border border-[var(--line)] rounded-full px-4 py-1.5 text-[var(--fg-1)] hover:border-[var(--brand-2)] hover:text-[var(--brand-2)] transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Sales Copy AI"
          toolSlug="sales-copy-ai"
          toolUrl="https://roughtools.com/tools/business/sales-copy-ai"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </main>
    </div>
  )
}
