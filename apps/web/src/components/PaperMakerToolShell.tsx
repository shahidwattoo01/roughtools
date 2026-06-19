import type React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import ToolAdUnit from '@/components/ToolAdUnit';
import { ToolPageExtras } from '@/components/ToolPageExtras';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaperMakerFAQ {
  q: string;
  a: string;
}

export interface PaperMakerRelatedTool {
  slug: string;
  name: string;
  emoji: string;
  href: string;
  description: string;
}

export interface PaperMakerQuickRef {
  label: string;
  value: string;
  note?: string;
}

export interface PaperMakerWhenToUse {
  icon: string;
  title: string;
  description: string;
}

export interface PaperMakerToolShellProps {
  toolName: string;
  toolSlug: string;
  tagline: string;
  heroEmoji: string;
  aboutText: string[];
  children: React.ReactNode;
  faqs: PaperMakerFAQ[];
  relatedTools: PaperMakerRelatedTool[];
  schemas: object[];
  howToSteps: { title: string; description: string }[];
  quickRef: PaperMakerQuickRef[];
  whenToUse: PaperMakerWhenToUse[];
  proTips: string[];
  features?: string[];
}

// ─── Sub-nav ──────────────────────────────────────────────────────────────────

const SUB_NAV = [
  { href: '/tools/paper-maker', label: '📋 All Paper Maker Tools' },
  { href: '/tools/paper-maker/generate', label: '📄 Exam Generator' },
  { href: '/tools/paper-maker/mcq-bank', label: '✅ MCQ Bank' },
  { href: '/tools/paper-maker/class-test', label: '🧪 Class Test' },
  { href: '/tools/paper-maker/answer-key', label: '🔑 Answer Key' },
  { href: '/tools/paper-maker/paper-shuffler', label: '🔀 Shuffler' },
  { href: '/tools/paper-maker/bilingual', label: '🌐 Bilingual' },
  { href: '/tools/notes-maker/app', label: '📝 Notes Maker' },
];

function PaperMakerSubNav() {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max text-xs">
          {SUB_NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                i === 0
                  ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── How-to steps ─────────────────────────────────────────────────────────────

function HowToSection({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <section
      className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      aria-labelledby="howto-heading"
    >
      <h2
        id="howto-heading"
        className="text-base font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2"
      >
        <span>📋</span> How to Use This Tool
      </h2>
      <ol className="space-y-5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4 items-start">
            <span
              aria-hidden="true"
              className="flex-shrink-0 w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-sm"
            >
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── Quick reference table ────────────────────────────────────────────────────

function QuickRefSection({ rows }: { rows: PaperMakerQuickRef[] }) {
  return (
    <section
      className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      aria-labelledby="quickref-heading"
    >
      <div className="p-6 pb-3">
        <h2
          id="quickref-heading"
          className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <span>📊</span> Quick Reference
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                Feature
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
                Detail
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide hidden sm:table-cell">
                Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {row.label}
                </td>
                <td className="px-6 py-3 text-sky-700 dark:text-sky-400 font-semibold">
                  {row.value}
                </td>
                <td className="px-6 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                  {row.note ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── When to Use cards ────────────────────────────────────────────────────────

function WhenToUseSection({ cards }: { cards: PaperMakerWhenToUse[] }) {
  return (
    <section className="mt-8" aria-labelledby="whenuse-heading">
      <h2
        id="whenuse-heading"
        className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
      >
        <span>🎯</span> When to Use This Tool
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="text-xl mb-2">{card.icon}</div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
              {card.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pro tips ─────────────────────────────────────────────────────────────────

function ProTipsSection({ tips }: { tips: string[] }) {
  return (
    <section
      className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      aria-labelledby="tips-heading"
    >
      <h2
        id="tips-heading"
        className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
      >
        <span>💡</span> Pro Tips for Pakistani Teachers
      </h2>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-200 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── About section ────────────────────────────────────────────────────────────

function AboutSection({
  toolName,
  aboutText,
  features,
}: {
  toolName: string;
  aboutText: string[];
  features?: string[];
}) {
  return (
    <section
      className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
      >
        <span>ℹ️</span> About {toolName}
      </h2>
      {aboutText.map((para, i) => (
        <p key={i} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {para}
        </p>
      ))}
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          features ?? [
            'No signup required',
            'Free to use',
            'Works on mobile',
            'No watermarks',
            'Print-ready PDF',
          ]
        ).map((f) => (
          <span
            key={f}
            className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1 text-gray-600 dark:text-gray-300"
          >
            ✓ {f}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FAQSection({ faqs }: { faqs: PaperMakerFAQ[] }) {
  return (
    <section className="mt-8" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
      >
        <span>❓</span> Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 list-none text-sm">
              {faq.q}
              <svg
                className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── Related tools ────────────────────────────────────────────────────────────

function RelatedSection({ tools }: { tools: PaperMakerRelatedTool[] }) {
  return (
    <section className="mt-8" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4"
      >
        More Paper Maker Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={t.href}
            className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-sm transition-all"
          >
            <span className="text-xl flex-shrink-0">{t.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors leading-snug">
                {t.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                {t.description}
              </p>
            </div>
            <svg
              className="h-4 w-4 ml-auto text-gray-300 dark:text-gray-600 group-hover:text-sky-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function PaperMakerToolShell({
  toolName,
  toolSlug,
  tagline,
  heroEmoji,
  aboutText,
  children,
  faqs,
  relatedTools,
  schemas,
  howToSteps,
  quickRef,
  whenToUse,
  proTips,
  features,
}: PaperMakerToolShellProps) {
  return (
    <>
      <JsonLd data={schemas} />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
        {/* ── Sticky sub-nav ─────────────────────────────────────────────── */}
        <PaperMakerSubNav />

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap"
            >
              <Link href="/" className="hover:text-sky-600 transition-colors">
                Home
              </Link>
              <span aria-hidden="true">›</span>
              <Link href="/tools/paper-maker" className="hover:text-sky-600 transition-colors">
                Paper Maker
              </Link>
              <span aria-hidden="true">›</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">{toolName}</span>
            </nav>
          </div>
        </div>

        {/* ── Gradient hero ──────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                {heroEmoji}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{toolName}</h1>
                <p className="text-sky-100 text-sm mt-1 leading-relaxed max-w-xl">{tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {[
                'Free for Pakistani teachers',
                'No signup required',
                'Print-ready PDF',
                'Classes 1–12',
                'All boards supported',
              ].map((chip) => (
                <span
                  key={chip}
                  className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-sky-100"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Top ad */}
          <ToolAdUnit position="top" />

          {/* ① Tool widget — above the fold */}
          <div className="mb-8">{children}</div>

          {/* ② Quick reference table */}
          <QuickRefSection rows={quickRef} />

          {/* ③ About section */}
          <AboutSection toolName={toolName} aboutText={aboutText} features={features} />

          {/* ④ How-to steps */}
          <HowToSection steps={howToSteps} />

          {/* Middle ad */}
          <ToolAdUnit position="middle" />

          {/* ⑤ When to use cards */}
          <WhenToUseSection cards={whenToUse} />

          {/* ⑥ Pro tips */}
          <ProTipsSection tips={proTips} />

          {/* ⑦ FAQ accordion */}
          <FAQSection faqs={faqs} />

          {/* ⑧ Related tools */}
          {relatedTools.length > 0 && <RelatedSection tools={relatedTools} />}

          {/* ⑨ Compliance extras (rating, feedback, social share) */}
          <ToolPageExtras
            toolName={toolName}
            toolSlug={toolSlug}
            toolUrl={`https://roughtools.com/tools/paper-maker/${toolSlug}`}
            type="general"
          />

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/tools/paper-maker"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
            >
              ← Back to Paper Maker
            </Link>
          </div>

          {/* Bottom ad */}
          <ToolAdUnit position="bottom" />
        </main>
      </div>
    </>
  );
}
