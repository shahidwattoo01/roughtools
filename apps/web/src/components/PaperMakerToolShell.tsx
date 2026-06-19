import type React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import ToolAdUnit from '@/components/ToolAdUnit';
import StarRating from '@/components/tools/StarRating';

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
}

export interface PaperMakerToolShellProps {
  toolName: string;
  toolSlug: string;
  tagline: string;
  aboutText: string[];
  children: React.ReactNode;
  faqs: PaperMakerFAQ[];
  relatedTools: PaperMakerRelatedTool[];
  schemas: object[];
  howToSteps?: { title: string; description: string }[];
  features?: string[];
}

// ─── Sub-nav ──────────────────────────────────────────────────────────────────

const SUB_NAV = [
  { href: '/tools/paper-maker', label: '📋 All Paper Maker Tools' },
  { href: '/tools/paper-maker/generate', label: '📄 Exam Generator' },
  { href: '/tools/paper-maker/mcq-bank', label: '✅ MCQ Bank' },
  { href: '/tools/paper-maker/class-test', label: '🧪 Class Test' },
  { href: '/tools/paper-maker/answer-key', label: '🔑 Answer Key' },
  { href: '/tools/paper-maker/paper-shuffler', label: '🔀 Paper Shuffler' },
  { href: '/tools/paper-maker/bilingual', label: '🌐 Bilingual' },
  { href: '/tools/notes-maker/app', label: '📝 Notes Maker' },
];

function PaperMakerSubNav() {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max text-xs">
          {SUB_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300 transition-colors whitespace-nowrap first:bg-sky-50 first:text-sky-700 first:font-semibold first:border first:border-sky-200 dark:first:bg-sky-900/30 dark:first:text-sky-300 dark:first:border-sky-700"
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
    <section className="mt-10" aria-labelledby="howto-heading">
      <h2 id="howto-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-5">
        How to Use This Tool
      </h2>
      <ol className="space-y-4">
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FAQSection({ faqs }: { faqs: PaperMakerFAQ[] }) {
  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 list-none text-sm">
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
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── Related tools grid ───────────────────────────────────────────────────────

function RelatedSection({ tools }: { tools: PaperMakerRelatedTool[] }) {
  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Related Paper Maker Tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={t.href}
            className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-sm transition-all text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-sky-700 dark:hover:text-sky-400 group"
          >
            <span className="text-base flex-shrink-0">{t.emoji}</span>
            <span className="leading-tight">{t.name}</span>
          </Link>
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
    <section className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About {toolName}</h2>
      {aboutText.map((para, i) => (
        <p key={i} className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
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

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function PaperMakerToolShell({
  toolName,
  toolSlug,
  tagline: _tagline,
  aboutText,
  children,
  faqs,
  relatedTools,
  schemas,
  howToSteps,
  features,
}: PaperMakerToolShellProps) {
  return (
    <>
      <JsonLd data={schemas} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sticky sub-nav */}
        <PaperMakerSubNav />

        <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6" id="main-content">
          {/* Top ad */}
          <ToolAdUnit position="top" />

          {/* ① TOOL WIDGET */}
          {children}

          {/* ② HOW-TO STEPS */}
          {howToSteps && howToSteps.length > 0 && <HowToSection steps={howToSteps} />}

          {/* Middle ad */}
          <ToolAdUnit position="middle" />

          {/* ③ ABOUT */}
          <AboutSection toolName={toolName} aboutText={aboutText} features={features} />

          {/* ④ FAQ */}
          <FAQSection faqs={faqs} />

          {/* ⑤ RELATED TOOLS */}
          {relatedTools.length > 0 && <RelatedSection tools={relatedTools} />}

          {/* Star rating */}
          <StarRating toolSlug={toolSlug} />

          {/* Bottom ad */}
          <ToolAdUnit position="bottom" />
        </main>
      </div>
    </>
  );
}
