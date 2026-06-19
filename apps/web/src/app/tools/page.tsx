import Link from 'next/link';
import ToolAdUnit from '@/components/ToolAdUnit';
import type { Metadata } from 'next';
import { TOTAL_REAL_TOOLS, TOTAL_CALC_COUNT } from '@/lib/tool-counts';

export const metadata: Metadata = {
  title: `All Tools — ${TOTAL_REAL_TOOLS}+ Free Online Tools | RoughTools`,
  description: `${TOTAL_REAL_TOOLS}+ free online tools across 17 categories: calculators, converters, developer tools, PDF tools, and more. No signup required.`,
  alternates: { canonical: 'https://roughtools.com/tools' },
  openGraph: {
    title: `All Tools — ${TOTAL_REAL_TOOLS}+ Free Online Tools | RoughTools`,
    description: `${TOTAL_REAL_TOOLS}+ free online tools across 17 categories. No signup required.`,
    url: 'https://roughtools.com/tools',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `All Tools — ${TOTAL_REAL_TOOLS}+ Free Online Tools | RoughTools`,
    description: `${TOTAL_REAL_TOOLS}+ free online tools across 17 categories. No signup required.`,
  },
  robots: { index: true, follow: true },
};

// Counts must stay in sync with CategoryGrid.tsx and tool-counts.ts (sum = TOTAL_REAL_TOOLS)
const ALL_CATEGORIES = [
  {
    name: 'Calculators',
    desc: 'Tax, mortgage, BMI, loan, ROI and more',
    href: '/tools/calculators',
    count: TOTAL_CALC_COUNT,
    accent: '#026fc7',
  },
  {
    name: 'Medical & Health',
    desc: 'BMI, calorie tracker, dosage, symptom checker',
    href: '/tools/medical',
    count: 113,
    accent: '#0d9488',
  },
  {
    name: 'Engineering',
    desc: 'Unit converter, stress calc, circuit tools, CAD',
    href: '/tools/engineering',
    count: 126,
    accent: '#0891b2',
  },
  {
    name: 'Image Tools',
    desc: 'Compress, resize, convert, background remover',
    href: '/tools/image-tools',
    count: 38,
    accent: '#db2777',
  },
  {
    name: 'PDF Tools',
    desc: 'Merge, split, compress, convert, sign PDFs',
    href: '/tools/pdf',
    count: 31,
    accent: '#e11d48',
  },
  {
    name: 'Developer Tools',
    desc: 'JSON, regex, API tester, color palette',
    href: '/tools/developer',
    count: 19,
    accent: '#6d28d9',
  },
  {
    name: 'Legal Tools',
    desc: 'Contracts, NDA, privacy policy, will creator',
    href: '/tools/legal-tools',
    count: 8,
    accent: '#dc2626',
  },
  {
    name: 'Document Tools',
    desc: 'Resume, cover letter, invoice, contracts',
    href: '/tools/document-tools',
    count: 11,
    accent: '#7c3aed',
  },
  {
    name: 'Real Estate',
    desc: 'Mortgage, rent vs buy, home affordability',
    href: '/tools/real-estate',
    count: 8,
    accent: '#d97706',
  },
  {
    name: 'Security',
    desc: 'Password, QR code, URL shortener, encryption',
    href: '/tools/security',
    count: 9,
    accent: '#059669',
  },
  {
    name: 'Business',
    desc: 'Sales copy, ad creative, email marketing, SEO',
    href: '/tools/business',
    count: 6,
    accent: '#8b5cf6',
  },
  {
    name: 'Text Tools',
    desc: 'Word count, case converter, summarizer, translator',
    href: '/tools/text',
    count: 10,
    accent: '#16a34a',
  },
  {
    name: 'Converters',
    desc: 'Unit, currency, file format, data converters',
    href: '/tools/converters',
    count: 8,
    accent: '#0284c7',
  },
  {
    name: 'Network Tools',
    desc: 'IP lookup, DNS checker, ping, port scanner',
    href: '/tools/network',
    count: 7,
    accent: '#2563eb',
  },
  {
    name: 'Environment',
    desc: 'Carbon footprint, solar savings, EV offset',
    href: '/tools/environment',
    count: 6,
    accent: '#16a34a',
  },
  {
    name: 'IQ Test',
    desc: 'Adaptive IQ test with full cognitive report',
    href: '/tools/iq-test',
    count: 1,
    accent: '#7c3aed',
  },
  {
    name: 'Paper Maker',
    desc: 'Generate exam papers, question banks, and class tests for Pakistani boards',
    href: '/tools/paper-maker',
    count: 1,
    accent: '#0369a1',
  },
] as const;

const CATEGORY_COUNT = ALL_CATEGORIES.length; // 17

export default function AllToolsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 mb-6">
            Browse
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
            All{' '}
            <span className="italic bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
            {TOTAL_REAL_TOOLS}+ free online tools across {CATEGORY_COUNT} categories. No signup
            required.
          </p>
          <div className="flex items-center justify-center gap-8">
            {[
              { value: `${TOTAL_REAL_TOOLS}+`, label: 'Tools' },
              { value: `${CATEGORY_COUNT}`, label: 'Categories' },
              { value: 'Free', label: 'Always' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-widest mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-[#999]">
          {[
            { icon: '⚡', text: 'All tools free forever' },
            { icon: '🔒', text: 'No signup required' },
            { icon: '🌐', text: 'Works in your browser' },
            { icon: '📱', text: 'Mobile friendly' },
            { icon: '🚫', text: 'No watermarks, ever' },
          ].map((b) => (
            <span key={b.text} className="flex items-center gap-1.5 font-medium">
              <span>{b.icon}</span>
              {b.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Ad ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <ToolAdUnit position="top" />
      </div>

      {/* ── Category grid ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col p-5 rounded-2xl border bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative"
            >
              {/* Subtle accent gradient */}
              <div
                className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${cat.accent} 0%, transparent 60%)` }}
              />

              <div className="relative flex flex-col flex-1">
                {/* Name + count */}
                <div className="mb-2">
                  <h2 className="font-extrabold text-[17px] leading-tight tracking-tight text-gray-900 dark:text-white">
                    {cat.name}
                  </h2>
                  <div
                    className="text-[11px] font-bold mt-1 uppercase tracking-widest"
                    style={{ color: cat.accent }}
                  >
                    {cat.count} {cat.count === 1 ? 'tool' : 'tools'}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-500 dark:text-[#999] leading-relaxed line-clamp-2 flex-1 mb-4">
                  {cat.desc}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
                  <span
                    className="text-[12px] font-bold tracking-wide uppercase"
                    style={{ color: cat.accent }}
                  >
                    Browse tools
                  </span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    style={{ color: cat.accent }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Ad bottom ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <ToolAdUnit position="bottom" />
      </div>

      {/* ── SEO section ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-white/10 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why RoughTools?</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-[#aaa] leading-relaxed">
            <div>
              <p className="mb-3">
                RoughTools gives you {TOTAL_REAL_TOOLS}+ professional-grade tools completely free —
                no paywalls, no sign-up, no watermarks. Every tool runs entirely in your browser for
                maximum privacy.
              </p>
              <p>
                From legal documents and medical calculators to image editing and developer
                utilities, we cover every use case with tools designed to be fast, accurate, and
                beautiful.
              </p>
            </div>
            <ul className="space-y-2">
              {[
                `${TOTAL_REAL_TOOLS}+ tools across ${CATEGORY_COUNT} categories`,
                'All tools 100% free — no subscription needed',
                'No account or sign-up required',
                'Works entirely in your browser',
                'Mobile-friendly and responsive',
                'No watermarks on any output',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
