import Link from 'next/link'
import ToolAdUnit from '@/components/ToolAdUnit'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'All Tools — 175+ Free Online Tools | RoughTools',
  description: '175+ free online tools across 18 categories: calculators, converters, developer tools, PDF tools, and more. No signup required.',
  alternates: { canonical: 'https://roughtools.com/tools' },
  openGraph: {
    title: 'All Tools — 175+ Free Online Tools | RoughTools',
    description: '175+ free online tools across 18 categories. No signup required.',
    url: 'https://roughtools.com/tools',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tools — 175+ Free Online Tools | RoughTools',
    description: '175+ free online tools across 18 categories. No signup required.',
  },
  robots: { index: true, follow: true },
}

const ALL_CATEGORIES = [
  {
    icon: '🧮',
    name: 'Calculators',
    desc: 'Tax, mortgage, BMI, loan, ROI and more',
    href: '/tools/calculators',
    count: 20,
    accent: '#026fc7',
    tag: '⭐ Most Popular',
  },
  {
    icon: '⚖️',
    name: 'Legal AI',
    desc: 'Contracts, NDA, privacy policy, will creator',
    href: '/tools/legal-tools',
    count: 8,
    accent: '#dc2626',
    tag: '💰 High CPC $100+',
  },
  {
    icon: '🏠',
    name: 'Real Estate',
    desc: 'Mortgage, rent vs buy, home affordability',
    href: '/tools/real-estate',
    count: 8,
    accent: '#d97706',
    tag: '💰 High CPC $50',
  },
  {
    icon: '📄',
    name: 'Documents',
    desc: 'PDF, resume, contracts, signatures, invoices',
    href: '/tools/document-tools',
    count: 12,
    accent: '#7c3aed',
    tag: null,
  },
  {
    icon: '🔒',
    name: 'Security',
    desc: 'Password, QR code, URL shortener, encryption',
    href: '/tools/security',
    count: 8,
    accent: '#059669',
    tag: '1.5M searches',
  },
  {
    icon: '🤖',
    name: 'AI Intelligence',
    desc: 'Chat, research, code generator, agents',
    href: '/tools',
    count: 10,
    accent: '#026fc7',
    tag: 'New',
  },
  {
    icon: '💻',
    name: 'Developer Tools',
    desc: 'JSON, regex, API tester, color palette',
    href: '/tools',
    count: 10,
    accent: '#6d28d9',
    tag: null,
  },
  {
    icon: '🎨',
    name: 'Media & Content',
    desc: 'Image, video, audio, design, thumbnails',
    href: '/tools',
    count: 12,
    accent: '#db2777',
    tag: null,
  },
  {
    icon: '⏱️',
    name: 'Productivity',
    desc: 'Pomodoro, habit tracker, meal planner',
    href: '/tools',
    count: 10,
    accent: '#ea580c',
    tag: null,
  },
  {
    icon: '🎓',
    name: 'Education',
    desc: 'Flashcards, math solver, language tutor',
    href: '/tools',
    count: 10,
    accent: '#16a34a',
    tag: null,
  },
  {
    icon: '🏡',
    name: 'Home & Family',
    desc: 'Room planner, baby names, moving costs',
    href: '/tools',
    count: 8,
    accent: '#ca8a04',
    tag: null,
  },
  {
    icon: '🎮',
    name: 'Fun & Creative',
    desc: 'Meme generator, story writer, name generator',
    href: '/tools',
    count: 6,
    accent: '#db2777',
    tag: '🔥 Viral',
  },
  {
    icon: '🚗',
    name: 'Automotive',
    desc: 'Car loan, fuel cost, lease vs buy, EV savings',
    href: '/tools',
    count: 6,
    accent: '#ea580c',
    tag: '$1.2T market',
  },
  {
    icon: '🌱',
    name: 'Environmental',
    desc: 'Carbon footprint, solar savings, EV offset',
    href: '/tools',
    count: 6,
    accent: '#16a34a',
    tag: 'ESG $35T',
  },
  {
    icon: '📊',
    name: 'Data & Analytics',
    desc: 'CSV visualizer, SQL builder, chart generator',
    href: '/tools',
    count: 10,
    accent: '#2563eb',
    tag: null,
  },
  {
    icon: '🛒',
    name: 'Commerce & Growth',
    desc: 'Sales copy, ads, SEO, landing page builder',
    href: '/tools',
    count: 12,
    accent: '#7c3aed',
    tag: null,
  },
  {
    icon: '⚙️',
    name: 'Engineering',
    desc: 'Unit converter, stress calc, circuit tools, CAD',
    href: '/tools',
    count: 10,
    accent: '#0891b2',
    tag: '🔧 Technical',
  },
  {
    icon: '🏥',
    name: 'Medical & Health',
    desc: 'BMI, calorie tracker, dosage, symptom checker',
    href: '/tools',
    count: 10,
    accent: '#0d9488',
    tag: '💊 High CPC $80',
  },
]

export default function AllToolsPage() {
  return (
    <>
      <main className="flex-1 bg-[var(--bg-base)]">

        {/* Header */}
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
          <div className="container py-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="block w-5 h-0.5 bg-[var(--primary)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Browse</span>
            </div>
            <h1 className="font-display font-black text-[clamp(36px,5vw,64px)] leading-tight tracking-tight text-[var(--text-primary)] mb-4">
              All{' '}
              <span className="gradient-text italic">Categories</span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-lg">
              175 free AI tools across 18 categories. No signup required.
            </p>

            {/* Quick stats */}
            <div className="flex items-center gap-6 mt-6">
              {[
                { value: '175+', label: 'Tools' },
                { value: '18', label: 'Categories' },
                { value: 'Free', label: 'Always' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-display font-bold text-[var(--text-primary)]">{s.value}</span>
                  <span className="text-sm text-[var(--text-muted)]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ad between header and grid */}
        <div className="container pt-8">
          <ToolAdUnit position="top" />
        </div>

        {/* Category grid */}
        <div className="container py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ALL_CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="card group relative overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
                style={{
                  animationDelay: `${i * 40}ms`,
                  background: `linear-gradient(135deg, ${cat.accent}22 0%, ${cat.accent}0a 100%)`,
                  borderColor: `${cat.accent}35`,
                }}
              >
                {/* Background emoji watermark */}
                <div
                  className="absolute right-3 top-3 text-8xl pointer-events-none select-none leading-none"
                  style={{ opacity: 0.18, color: cat.accent }}
                >
                  {cat.icon}
                </div>

                <div className="card-body relative">
                  {/* Tag */}
                  {cat.tag ? (
                    <div
                      className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 border"
                      style={{
                        background: `${cat.accent}20`,
                        color: cat.accent,
                        borderColor: `${cat.accent}40`,
                      }}
                    >
                      {cat.tag}
                    </div>
                  ) : (
                    <div className="h-6 mb-3" />
                  )}

                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                      style={{
                        background: `${cat.accent}25`,
                        borderColor: `${cat.accent}40`,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <div
                        className="font-display font-extrabold text-[17px] leading-tight tracking-tight"
                        style={{ color: '#0d111c' }}
                      >
                        {cat.name}
                      </div>
                      <div
                        className="text-[11px] font-bold mt-1 uppercase tracking-widest"
                        style={{ color: cat.accent }}
                      >
                        {cat.count} tools
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-[13px] leading-relaxed mb-4"
                    style={{ color: '#384168', fontWeight: 500 }}
                  >
                    {cat.desc}
                  </p>

                  {/* CTA */}
                  <div
                    className="flex items-center justify-between pt-3 border-t"
                    style={{ borderColor: `${cat.accent}30` }}
                  >
                    <span
                      className="text-[12px] font-bold tracking-wide uppercase"
                      style={{ color: cat.accent }}
                    >
                      Browse tools
                    </span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      style={{ color: cat.accent }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ad at bottom */}
        <div className="container pb-8">
          <ToolAdUnit position="bottom" />
        </div>
      </main>
    </>
  )
}