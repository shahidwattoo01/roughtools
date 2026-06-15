import type { Metadata } from 'next'
import Link from 'next/link'
import EmailMarketingClient from './EmailMarketingClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Email Marketing AI — Free Email Copy Generator | RoughTools',
  description: 'Write complete email sequences — welcome, nurture, promotional, cart abandonment, re-engagement, and newsletters. Subject lines, preview text, and full body copy. Free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/business/email-marketing-ai' },
  openGraph: {
    title: `Email Marketing AI — Generate Email Campaigns Free | RoughTools`,
    description: `Generate professional email marketing campaigns with AI. Subject lines, body copy, and CTAs for any audience. Free online tool.`,
    url: 'https://roughtools.com/tools/business/email-marketing-ai',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Email Marketing AI — Generate Email Campaigns Free | RoughTools`,
    description: `Generate professional email marketing campaigns with AI. Subject lines, body copy, and CTAs for any audience. Free online tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this email marketing copy generator free to use?',
    a: 'Yes, the RoughTools Email Marketing AI is completely free with no subscription, account, or payment required. You can generate complete email copy — subject lines, preview text, and full body — for all six email types as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, which keeps every business tool permanently free. There are no usage limits, no premium email types behind a paywall, and no registration of any kind required.'
  },
  {
    q: 'Do I need to create an account to generate email copy?',
    a: 'No account, email address, or registration is required. Enter your business name, product, audience, and select the email type — your complete email copy is generated instantly. There is no login wall, no upgrade required to access any email format, and no data stored about your business or campaigns. The tool is entirely anonymous and can be used as many times as you need without creating any profile or credentials.'
  },
  {
    q: 'Does this tool store or share the information I enter?',
    a: 'No. All email copy generation runs entirely within your browser using JavaScript templates. The business name, product details, audience description, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with email service providers or third-party data services. Your business information and campaign ideas remain completely private. Once you close the browser tab, all data is gone with no trace retained.'
  },
  {
    q: 'Does the email marketing generator work on mobile and tablet?',
    a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and the generated email copy panels are optimised for touch screens and small display widths. You can generate and copy email sequences on mobile, making it easy to draft campaign copy wherever you are. The copy-to-clipboard button works on iOS Safari and Android Chrome, allowing you to paste directly into your email marketing platform or notes app.'
  },
  {
    q: 'Which browsers are compatible with this email copy generator?',
    a: 'The Email Marketing AI works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The generator uses standard JavaScript that runs natively in every current browser. For the best clipboard copy experience across all generated sections, Chrome or Firefox on desktop is recommended, though all modern browsers fully support the clipboard API used.'
  },
  {
    q: 'How good is the generated email copy quality?',
    a: 'The generated copy follows established email marketing best practices: subject lines under 50 characters for maximum mobile display, compelling preview text that extends the subject line\'s hook, benefit-led body copy, and clear single-action CTAs. The templates are structured around proven copywriting frameworks (AIDA, PAS, and benefit-first writing). Quality depends on the specificity of your inputs — the more specific and unique your USP and audience description, the more targeted and effective the output. Always personalise and review before sending to your list.'
  },
  {
    q: 'Can I use this tool without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all email copy generation runs in JavaScript without requiring an active internet connection. You can enter product details and generate copy for any email type offline. The initial page load requires internet access to download the tool assets, but after that the generator functions entirely client-side. This is useful when drafting email campaign briefs during travel or in locations with limited connectivity.'
  },
  {
    q: 'How do I generate an email sequence step by step?',
    a: 'To generate email copy: (1) Enter your business or brand name. (2) Describe your product or service clearly and include the key benefit. (3) Describe your target audience in specific terms — the more specific, the better the copy. (4) Select the email type: welcome, nurture, promotional, cart abandonment, re-engagement, or newsletter. (5) Optionally set the tone — professional, friendly, urgent, or inspirational. (6) Click Generate — the tool outputs a complete email with subject line, preview text, greeting, body copy, and CTA. Copy each section using the copy button and paste into your email platform.'
  },
  {
    q: 'Why should I use RoughTools instead of paid email copywriting tools?',
    a: 'RoughTools Email Marketing AI generates complete, structured email copy across six essential campaign types — including cart abandonment and re-engagement sequences that most free tools omit. Unlike AI writing assistants that require a paid subscription and manual prompting for each email element, this tool outputs all components (subject line, preview text, body, and CTA) in one click, structured correctly for immediate use. It is entirely private, requires no API key or account, and has no monthly cost or usage cap.'
  },
  {
    q: 'How do I report a bug or suggest a new email type?',
    a: 'To report a bug or request a new email type — such as onboarding sequences, trial expiry emails, feedback request emails, referral emails, or post-purchase follow-ups — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the email type selected, the browser and OS, and what you expected versus what was generated. Feature requests for multi-step drip sequence generation, A/B subject line variants, or personalisation token placeholders are reviewed and prioritised regularly.'
  },
  {
    q: 'What is the ideal length for a marketing email?',
    a: 'Optimal email length depends on the type and audience, but general best practices are: promotional emails perform best at 50–125 words — short, benefit-focused, and action-oriented. Welcome emails can be 150–200 words as new subscribers expect to learn about the brand. Nurture emails work well at 200–300 words — enough to provide value without overwhelming. Newsletter digests can be longer (500+ words) but should use clear headers for scannability. Cart abandonment emails are most effective under 100 words — create urgency quickly. The subject line should be under 50 characters for mobile, and preview text should extend the subject rather than repeat it.'
  },
  {
    q: 'What are the six email types this tool generates?',
    a: 'The six email types are: (1) Welcome Email — sent immediately after signup to introduce your brand and set expectations. (2) Nurture Email — educational content that builds trust and moves subscribers toward a purchase decision. (3) Promotional Email — time-sensitive offer or product announcement designed to drive immediate action. (4) Cart Abandonment — sent to users who added items to a cart but did not complete checkout. (5) Re-engagement — sent to inactive subscribers to revive interest before they unsubscribe. (6) Newsletter — regular value-packed content digest to maintain audience relationship and top-of-mind awareness. Each type uses a different psychological framework and CTA strategy.'
  },
]

export default function EmailMarketingPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
      { '@type': 'ListItem', position: 3, name: 'Email Marketing AI', item: 'https://roughtools.com/tools/business/email-marketing-ai' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Email Marketing AI',
    url: 'https://roughtools.com/tools/business/email-marketing-ai',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online email marketing ai tool by RoughTools.',
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
          <span className="text-[var(--fg)] font-semibold">Email Marketing AI</span>
          <span className="ml-auto text-[11px] bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-semibold">📧 6 Email Types · Free</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">📧</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Email Marketing AI</h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Generate complete, send-ready email copy for every stage of your customer journey. This tool produces all three critical components of an effective email — subject line, preview text, and full body copy — in one click, across six essential campaign types: welcome sequences, nurture flows, promotional offers, cart abandonment recovery, re-engagement campaigns, and newsletters. Each template follows proven copywriting frameworks and email marketing best practices, tailored to your product and audience with no AI subscription required.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Welcome', 'Nurture', 'Promotional', 'Cart Abandonment', 'Re-engagement', 'Newsletter', 'Free'].map(chip => (
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
        <EmailMarketingClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📨', title: '6 Email Types', desc: 'Welcome, nurture, promo, cart abandonment, re-engagement & newsletter' },
            { icon: '🔒', title: 'Private', desc: 'Business details and campaign ideas never leave your browser' },
            { icon: '✅', title: 'All 3 Elements', desc: 'Subject line, preview text & body copy generated together' },
          ].map(c => (
            <div key={c.title} className="bg-[var(--bg-1)] border border-[var(--line)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-[var(--fg)] text-sm mb-1">{c.title}</div>
              <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Email type guide */}
        <section className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--fg)] mb-5">When to Use Each Email Type</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { type: 'Welcome Email', icon: '👋', when: 'Immediately after signup or first purchase', goal: 'Introduce brand, set expectations, deliver lead magnet' },
              { type: 'Nurture Email', icon: '🌱', when: 'Days 3–14 of onboarding sequence', goal: 'Build trust, educate, move toward purchase decision' },
              { type: 'Promotional Email', icon: '🎁', when: 'Product launches, sales, seasonal events', goal: 'Drive immediate conversions with urgency and offer' },
              { type: 'Cart Abandonment', icon: '🛒', when: '1–3 hours after cart abandoned', goal: 'Recover lost sales — highest ROI email type' },
              { type: 'Re-engagement', icon: '🔄', when: '60–90 days of subscriber inactivity', goal: 'Revive inactive subscribers before list cleaning' },
              { type: 'Newsletter', icon: '📰', when: 'Weekly or bi-weekly ongoing', goal: 'Maintain relationship and top-of-mind awareness' },
            ].map(e => (
              <div key={e.type} className="bg-[var(--bg-2)] rounded-xl p-4">
                <div className="font-semibold text-gray-900 mb-1">{e.icon} {e.type}</div>
                <div className="text-[var(--fg-2)] text-xs"><span className="text-gray-700 font-medium">When: </span>{e.when}</div>
                <div className="text-gray-500 text-xs mt-0.5"><span className="text-gray-700 font-medium">Goal: </span>{e.goal}</div>
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
              { href: '/tools/business/sales-copy-ai', label: '✍️ Sales Copy AI' },
              { href: '/tools/business/ad-creative-generator', label: '🎯 Ad Creative Generator' },
              { href: '/tools/business/social-media-scheduler', label: '📅 Social Media Scheduler' },
              { href: '/tools/business/landing-page-builder', label: '🖥️ Landing Page Builder' },
              { href: '/tools/business/seo-optimizer', label: '🔍 SEO Optimizer' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-[var(--bg-2)] border border-[var(--line)] rounded-full px-4 py-1.5 text-[var(--fg-1)] hover:border-[var(--brand-2)] hover:text-[var(--brand-2)] transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Email Marketing AI"
          toolSlug="email-marketing-ai"
          toolUrl="https://roughtools.com/tools/business/email-marketing-ai"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </main>
    </div>
  )
}
