import type { Metadata } from 'next'
import Link from 'next/link'
import SocialMediaClient from './SocialMediaClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Social Media Scheduler — Free Post Generator | RoughTools',
  description: 'Write platform-perfect posts for Twitter/X, LinkedIn, Instagram, and Facebook. Hashtag suggestions, character count guidance, and tone control. Free, no signup required.',
  alternates: { canonical: 'https://roughtools.com/tools/business/social-media-scheduler' },
  openGraph: {
    title: `Social Media Post Generator — Free for All Platforms | RoughTools`,
    description: `Generate platform-optimised posts for Twitter/X, LinkedIn, Instagram, and Facebook simultaneously. Free, no signup required.`,
    url: 'https://roughtools.com/tools/business/social-media-scheduler',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Social Media Post Generator — Free for All Platforms | RoughTools`,
    description: `Generate platform-optimised posts for Twitter/X, LinkedIn, Instagram, and Facebook simultaneously. Free, no signup required.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Is this social media post generator free to use?',
    a: 'Yes, the RoughTools Social Media Scheduler is completely free with no account, subscription, or payment required. You can generate platform-optimised posts for Twitter/X, LinkedIn, Instagram, and Facebook as many times as needed at no cost. RoughTools is funded through non-intrusive advertising, which keeps every business tool permanently free. There are no usage limits, no premium platforms locked behind a paywall, and no registration required to generate, copy, or use any of the generated posts.'
  },
  {
    q: 'Do I need to sign up to generate social media posts?',
    a: 'No account, email address, or registration is required. Enter your topic, brand description, and tone — your platform-ready posts are generated instantly for all four platforms. There is no login wall, no upgrade required to access any platform format, and no data stored about your brand or campaigns. The tool is entirely anonymous and can be used for unlimited post drafts without any sign-up process or personal information required.'
  },
  {
    q: 'Does this tool store the content or brand information I enter?',
    a: 'No. All post generation runs entirely within your browser using JavaScript templates. The topic, brand description, tone settings, and all other inputs you enter are never transmitted to RoughTools servers, never logged, and never shared with social media platforms or third-party analytics services. Your brand strategy and content ideas remain completely private. Once you close the browser tab, all data is gone with no trace retained.'
  },
  {
    q: 'Does this social media post generator work on mobile?',
    a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and the generated posts for each platform are optimised for touch screens and small displays. The copy button on each platform output works on iOS Safari and Android Chrome, allowing you to paste posts directly into the native social media app or a scheduling tool like Buffer or Hootsuite from your phone. This is ideal for capturing ideas and drafting content on the go.'
  },
  {
    q: 'Which browsers support this social media generator?',
    a: 'The Social Media Scheduler works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No plugins or extensions are required. The generator uses standard JavaScript that runs natively in every current browser. For the most reliable clipboard copy experience across all four platform outputs, Chrome or Firefox on desktop is recommended, though all current browsers fully support the clipboard API used.'
  },
  {
    q: 'How accurate are the character counts for each platform?',
    a: 'The character guidance built into this tool reflects current published platform specifications: Twitter/X posts are limited to 280 characters. LinkedIn posts can be up to 3,000 characters, but the first 140 characters appear before the "see more" fold — so the opening must hook the reader immediately. Instagram captions allow up to 2,200 characters with the first 125 visible before the fold. Facebook posts have no hard limit but shorter posts (under 250 characters) typically generate higher engagement. These specifications are verified against each platform\'s current documentation.'
  },
  {
    q: 'Can I use this tool without an internet connection?',
    a: 'Once the page has fully loaded in your browser, all post generation runs in JavaScript without requiring an active internet connection. You can enter topic details and generate posts for all four platforms offline after the initial page load. This is useful when drafting content during travel or in locations with poor signal. The initial page load requires internet access to download the tool assets, but after that the generator functions entirely client-side for as long as the browser tab is open.'
  },
  {
    q: 'How do I generate social media posts step by step?',
    a: 'To generate posts: (1) Enter your post topic or the key message you want to communicate. (2) Add a brief brand or business description to contextualise the content. (3) Select your target audience type (B2B professional, general consumer, creative community, etc.). (4) Choose a tone: professional, conversational, inspiring, educational, or promotional. (5) Click Generate — posts are produced for all four platforms simultaneously, each tailored to that platform\'s format, character limits, and audience expectations. (6) Copy each post using the platform-specific copy button and paste into your scheduling tool or directly into the platform.'
  },
  {
    q: 'Why should I use RoughTools instead of paid social media tools?',
    a: 'Paid social media tools like Hootsuite, Buffer, and Sprout Social focus on scheduling and analytics — they do not generate post copy. AI writing tools require subscriptions and produce generic text without applying platform-specific formatting rules. RoughTools Social Media Scheduler generates correctly formatted posts for all four major platforms simultaneously, applying each platform\'s conventions (LinkedIn professional tone, Twitter brevity, Instagram hook structure) without a subscription fee, account setup, or complex prompt engineering. It is the fastest way to draft platform-ready post copy from a single topic input.'
  },
  {
    q: 'How do I report a bug or request a new platform or feature?',
    a: 'To report a bug or request a new platform — such as Pinterest, TikTok captions, YouTube video descriptions, Threads, or Bluesky — or a new feature like hashtag set generation, content calendar templates, or post series generation, use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the topic and tone you selected, the platform with the issue, the browser and OS, and what you expected versus what was generated. Feature requests are reviewed and prioritised regularly by the development team.'
  },
  {
    q: 'What makes a good social media post for each platform?',
    a: 'Each platform has distinct content conventions. Twitter/X rewards brevity, directness, and strong hooks in the first five words — get to the point immediately. LinkedIn responds to professional insights, personal career stories, and industry commentary with a clear takeaway. Instagram content thrives with strong visual context, a compelling first line before the fold, and 5–10 relevant hashtags. Facebook posts perform best with conversational, community-oriented content under 250 characters for organic reach, or longer storytelling posts (500+ words) for high-engagement content. Understanding these differences is why platform-specific generation produces better results than a one-size-fits-all approach.'
  },
  {
    q: 'How many hashtags should I use on each social media platform?',
    a: 'Hashtag best practices differ significantly by platform. Instagram: 5–10 highly relevant hashtags. Research shows that using more than 10 provides diminishing returns and can appear spammy. LinkedIn: 3–5 niche hashtags are optimal — over-hashtagging looks unprofessional in a B2B context. Twitter/X: 1–2 hashtags maximum. Studies show that tweets with more than two hashtags see lower engagement. Facebook: hashtags have minimal algorithmic benefit — use 0–2 if any, focused on brand or campaign. TikTok (if applicable): 3–5 trending and niche hashtags. The generator includes contextually relevant hashtag suggestions tailored to each platform\'s norms.'
  },
]

export default function SocialMediaPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
      { '@type': 'ListItem', position: 3, name: 'Social Media Scheduler', item: 'https://roughtools.com/tools/business/social-media-scheduler' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Social Media Scheduler',
    url: 'https://roughtools.com/tools/business/social-media-scheduler',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online social media scheduler tool by RoughTools.',
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
          <span className="text-[var(--fg)] font-semibold">Social Media Scheduler</span>
          <span className="ml-auto text-[11px] bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-semibold">📱 4 Platforms · Free</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 border border-white/20">📅</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Social Media Post Generator</h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Generate platform-optimised social media posts for Twitter/X, LinkedIn, Instagram, and Facebook simultaneously from a single topic input. Each platform gets copy written to its specific format conventions, character limit guidelines, hashtag norms, and audience expectations — LinkedIn gets professional tone and insight-driven structure, Twitter/X gets punchy brevity, Instagram gets a strong hook before the fold, and Facebook gets community-oriented conversational copy. Choose your tone, audience, and message — all four posts are ready to copy in one click.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Twitter / X', 'LinkedIn', 'Instagram', 'Facebook', 'Hashtag Suggestions', 'Tone Control', 'Free'].map(chip => (
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
        <SocialMediaClient />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📱', title: '4 Platforms', desc: 'Twitter/X, LinkedIn, Instagram & Facebook — all from one input' },
            { icon: '🔒', title: 'Private', desc: 'Brand details and content ideas never leave your browser' },
            { icon: '#️⃣', title: 'Hashtags', desc: 'Platform-appropriate hashtag suggestions included per post' },
          ].map(c => (
            <div key={c.title} className="bg-[var(--bg-1)] border border-[var(--line)] rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-[var(--fg)] text-sm mb-1">{c.title}</div>
              <div className="text-[var(--fg-2)] text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Platform guide */}
        <section className="bg-[var(--bg-1)] rounded-2xl border border-[var(--line)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--fg)] mb-5">Platform Content Conventions</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { platform: 'Twitter / X', icon: '🐦', limit: '280 chars', tone: 'Direct, punchy, hook in first 5 words', hashtags: '1–2 max', tips: 'Numbers, strong opinions, and questions drive engagement.' },
              { platform: 'LinkedIn', icon: '💼', limit: '3,000 chars (140 before fold)', tone: 'Professional, insight-driven, personal story', hashtags: '3–5 niche', tips: 'First line must work as a standalone hook to encourage "see more" clicks.' },
              { platform: 'Instagram', icon: '📸', limit: '2,200 chars (125 before fold)', tone: 'Visual, aspirational, community-oriented', hashtags: '5–10 relevant', tips: 'Lead with a strong hook. Assume the image carries half the message.' },
              { platform: 'Facebook', icon: '📘', limit: 'No hard limit (under 250 optimal)', tone: 'Conversational, community, storytelling', hashtags: '0–2 or none', tips: 'Question-based posts and personal stories generate the most comments.' },
            ].map(p => (
              <div key={p.platform} className="bg-[var(--bg-2)] rounded-xl p-4">
                <div className="font-semibold text-[var(--fg)] mb-2">{p.icon} {p.platform}</div>
                <div className="space-y-1 text-xs text-[var(--fg-2)]">
                  <div><span className="text-gray-700 font-medium">Limit:</span> {p.limit}</div>
                  <div><span className="text-gray-700 font-medium">Tone:</span> {p.tone}</div>
                  <div><span className="text-gray-700 font-medium">Hashtags:</span> {p.hashtags}</div>
                  <div className="text-gray-400 pt-1 border-t border-gray-200">{p.tips}</div>
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
              { href: '/tools/business/sales-copy-ai', label: '✍️ Sales Copy AI' },
              { href: '/tools/business/landing-page-builder', label: '🖥️ Landing Page Builder' },
              { href: '/tools/business/seo-optimizer', label: '🔍 SEO Optimizer' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-[var(--bg-2)] border border-[var(--line)] rounded-full px-4 py-1.5 text-[var(--fg-1)] hover:border-[var(--brand-2)] hover:text-[var(--brand-2)] transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <ToolPageExtras
          toolName="Social Media Scheduler"
          toolSlug="social-media-scheduler"
          toolUrl="https://roughtools.com/tools/business/social-media-scheduler"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </main>
    </div>
  )
}
