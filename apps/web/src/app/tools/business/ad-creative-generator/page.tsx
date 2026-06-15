import type { Metadata } from 'next'
import Link from 'next/link'
import AdCreativeClient from './AdCreativeClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Ad Creative Generator — Free Google, Facebook & LinkedIn Ads | RoughTools',
  description: 'Generate high-converting ad copy for Google Ads, Facebook, Instagram, LinkedIn, and Twitter/X instantly. Platform-specific character limits, headlines, descriptions, and CTAs — free, no signup.',
  alternates: { canonical: 'https://roughtools.com/tools/business/ad-creative-generator' },
  openGraph: {
    title: `Ad Creative Generator — AI Ad Copy Writer Free | RoughTools`,
    description: `Generate compelling ad copy for Google, Facebook, and Instagram ads. AI-powered ad creative generator — free, no signup required.`,
    url: 'https://roughtools.com/tools/business/ad-creative-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Ad Creative Generator — AI Ad Copy Writer Free | RoughTools`,
    description: `Generate compelling ad copy for Google, Facebook, and Instagram ads. AI-powered ad creative generator — free, no signup required.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this ad creative generator free to use?',
    a: 'Yes, the RoughTools Ad Creative Generator is completely free with no account, subscription, or payment required. You can generate ad copy for Google Ads, Facebook, Instagram, LinkedIn, and Twitter/X as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, which keeps every business tool permanently free. There are no usage limits, no premium ad formats behind a paywall, and no registration required to generate and copy your ad copy.'
  },
  {
    q: 'Do I need to sign up to generate ad copy?',
    a: 'No account, email address, or registration is required. Enter your product name, unique selling proposition, target audience, and advertising objective — your ad copy is generated instantly. There is no login wall, no upgrade required to access any platform format, and no data stored about your products or campaigns. The tool is entirely anonymous. You can generate and copy ad copy for unlimited campaigns without any sign-up process.'
  },
  {
    q: 'Does this tool store or share the product information I enter?',
    a: 'No. All ad copy generation runs entirely within your browser using JavaScript templates. The product name, USP, audience, and other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with advertising platforms or third parties. Your campaign ideas and product details remain completely private. Once you close the browser tab, all entered data is gone with no trace retained.'
  },
  {
    q: 'Does the ad creative generator work on mobile and tablet?',
    a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and the generated ad copy panels are optimised for touch screens. This is useful when you are reviewing competitor ads or inspiration on your phone and want to quickly draft a campaign brief. The copy-to-clipboard button works on mobile browsers, allowing you to paste directly into your ad platform.'
  },
  {
    q: 'Which browsers support this ad creative generator?',
    a: 'The Ad Creative Generator works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The generator uses standard JavaScript that runs natively in every current browser. For the best clipboard copy experience, Chrome or Firefox on desktop is recommended, though all current browsers support the clipboard API used for the copy button.'
  },
  {
    q: 'How accurate are the character counts for each platform?',
    a: 'The character limits built into this tool reflect the official published specifications for each advertising platform: Google Ads headlines are 30 characters, descriptions are 90 characters. Facebook and Instagram primary text is up to 125 characters for best performance. LinkedIn introductory text allows 150 characters. Twitter/X ads are limited to 280 characters. These are verified against each platform\'s official ad specifications. Platform policies may change — always verify final copy against the platform\'s current ad manager requirements before publishing.'
  },
  {
    q: 'Can I use the generated ad copy offline?',
    a: 'Once the page has fully loaded in your browser, the ad copy generator runs entirely in JavaScript without requiring an active internet connection. You can enter product details and generate copy offline after the initial page load. The clipboard copy function requires browser API access, which works offline. This is useful when drafting campaign briefs during travel or in locations with poor connectivity. The initial page load requires internet access to download the tool assets.'
  },
  {
    q: 'How do I generate ad copy step by step?',
    a: 'To generate ad creatives: (1) Enter your product or service name clearly and concisely. (2) Write your unique selling proposition — the single most compelling reason to choose your product over competitors. (3) Describe your target audience in one or two words (e.g., "small business owners" or "fitness enthusiasts"). (4) Select the advertising platform — or choose All Platforms to generate copy for every format at once. (5) Choose your campaign objective (drive traffic, generate leads, increase sales, boost awareness, or app installs). (6) Click Generate — copy each platform\'s ad section to your clipboard and paste into your ad manager.'
  },
  {
    q: 'Why should I use RoughTools instead of AI writing tools like ChatGPT?',
    a: 'RoughTools Ad Creative Generator is purpose-built for advertising — it applies platform-specific character limits, format structures, and best practices for each ad type automatically. General AI writing tools produce text without understanding Google\'s 30-character headline constraint or Facebook\'s primary text recommendations. This tool generates ready-to-use, correctly formatted ad copy for each platform in seconds without requiring a paid AI subscription, prompt engineering knowledge, or manual character counting. Every output is correctly structured for direct use in ad managers.'
  },
  {
    q: 'How do I report a bug or request a new ad platform or format?',
    a: 'To report a bug or suggest a new platform or ad format — such as Pinterest Ads, TikTok Ads, YouTube pre-roll scripts, display ad copy, or retargeting-specific copy variations — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the inputs you used, the platform selected, the browser and OS, and what was generated versus what you expected. Feature requests for seasonal campaign templates, A/B variant generation, or tone switching are reviewed and prioritised regularly.'
  },
  {
    q: 'What makes a high-converting ad creative?',
    a: 'High-converting ad creatives share several traits: a clear, benefit-focused headline that immediately communicates value to the target audience; a specific, credible claim rather than vague superlatives; a strong call to action that tells the viewer exactly what to do next; and copy tailored to the awareness level of the audience (cold audiences need education, warm audiences need conversion triggers). The USP field in this generator is the most important input — a sharp, specific unique selling proposition is the foundation of every effective ad. Focus on what the customer gains, not what your product does.'
  },
  {
    q: 'Can I use the generated ad copy commercially for client campaigns?',
    a: 'Yes, all content generated by this tool can be used commercially — for your own business campaigns, client advertising projects, or agency work. There are no licensing restrictions on the output. The generated copy uses templates and frameworks based on established copywriting principles, not copyrighted material. As with any generated content, review and customise the output before publishing: add specifics unique to your product, verify all factual claims, and ensure compliance with the advertising policies of the platform you are using.'
  },
]

export default function AdCreativePage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
      { '@type': 'ListItem', position: 3, name: 'Ad Creative Generator', item: 'https://roughtools.com/tools/business/ad-creative-generator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Ad Creative Generator',
    url: 'https://roughtools.com/tools/business/ad-creative-generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online ad creative generator tool by RoughTools.',
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
          <span className="text-[var(--fg)] font-semibold">Ad Creative Generator</span>
          <span className="ml-auto text-[11px] bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-semibold">🎯 5 Platforms · Free</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">🎯</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Ad Creative Generator</h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Generate platform-ready ad copy for Google Ads, Facebook, Instagram, LinkedIn, and Twitter/X in seconds. Each format is built to the exact character limits and structural requirements of the target platform — Google&apos;s 30-character headlines, Facebook&apos;s primary text guidelines, LinkedIn&apos;s intro copy spec — so you can paste directly into your ad manager without manual editing. Enter your product, USP, audience, and objective to get professionally structured ads for every platform at once.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter/X', 'Character Limits', 'Free'].map(chip => (
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
        <AdCreativeClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🎯', title: '5 Platforms', desc: 'Google, Facebook, Instagram, LinkedIn & Twitter/X — all formats in one click' },
            { icon: '🔒', title: 'Private', desc: 'Your product details and campaign ideas never leave your browser' },
            { icon: '📏', title: 'Correct Limits', desc: 'Every output built to exact platform character count specifications' },
          ].map(c => (
            <div key={c.title} className="bg-[var(--bg-1)] border border-[var(--line)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-[var(--fg)] text-sm mb-1">{c.title}</div>
              <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Platform specs */}
        <section className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--fg)] mb-5">Platform Ad Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { platform: 'Google Ads', icon: '🔍', specs: ['Headline: 30 chars × 3', 'Description: 90 chars × 2', 'Display URL: 15 chars each path'] },
              { platform: 'Facebook / Instagram', icon: '📘', specs: ['Primary Text: 125 chars ideal', 'Headline: 27 chars', 'Link Description: 30 chars'] },
              { platform: 'LinkedIn', icon: '💼', specs: ['Introductory Text: 150 chars', 'Headline: 70 chars', 'Description: 100 chars'] },
              { platform: 'Twitter / X', icon: '🐦', specs: ['Tweet copy: 280 chars total', 'Headline card: 70 chars', 'Description card: 100 chars'] },
            ].map(p => (
              <div key={p.platform} className="bg-[var(--bg-2)] rounded-xl p-4">
                <div className="font-semibold text-[var(--fg)] mb-2">{p.icon} {p.platform}</div>
                <ul className="space-y-1">
                  {p.specs.map(s => <li key={s} className="text-gray-500 text-xs flex items-start gap-1.5"><span className="text-violet-400 mt-0.5">·</span>{s}</li>)}
                </ul>
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
              { href: '/tools/business/email-marketing-ai', label: '📧 Email Marketing AI' },
              { href: '/tools/business/social-media-scheduler', label: '📅 Social Media Scheduler' },
              { href: '/tools/business/landing-page-builder', label: '🖥️ Landing Page Builder' },
              { href: '/tools/business/seo-optimizer', label: '🔍 SEO Optimizer' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-[var(--bg-2)] border border-[var(--line)] rounded-full px-4 py-1.5 text-[var(--fg-1)] hover:border-[var(--brand-2)] hover:text-[var(--brand-2)] transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Ad Creative Generator"
          toolSlug="ad-creative-generator"
          toolUrl="https://roughtools.com/tools/business/ad-creative-generator"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </main>
    </div>
  )
}
