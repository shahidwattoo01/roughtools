'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'
import { LEGAL_CONFIGS } from './legal-configs'

interface LegalToolShellProps {
  toolSlug: string
  toolName: string
  children: React.ReactNode
}

export default function LegalToolShell({ toolSlug, toolName, children }: LegalToolShellProps) {
  const config = LEGAL_CONFIGS[toolSlug]
  const toolUrl = `https://roughtools.com/tools/legal-tools/${toolSlug}`
  const aboutParagraphs = config.aboutParagraphs(toolName)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ─── Breadcrumb bar ─── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/tools/legal-tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Legal Tools</Link>
            <span aria-hidden="true">›</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">{toolName}</span>
          </nav>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex items-start gap-5">
            <div
              className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center
                         bg-white/15 backdrop-blur-sm rounded-2xl border border-white/25 text-4xl sm:text-5xl"
              aria-hidden="true"
            >
              {config.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">
                  <span aria-hidden="true">{config.categoryIcon}</span>
                  {config.categoryLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 bg-emerald-900/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {toolName}
              </h1>
              <p className="mt-2 text-blue-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                {config.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['No signup required', 'Instant download', 'Privacy-first'].map(tag => (
                  <span
                    key={tag}
                    className="text-xs text-white/75 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" id="main-content">
        <ToolAdUnit position="top" />

        {/* ─── Tool widget ─── */}
        <div data-print-section="calculator" className="mb-8">
          {children}
        </div>

        {/* ─── Document structure ─── */}
        <section
          data-print-section="formula"
          aria-labelledby="structure-heading"
          className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100 dark:border-blue-900 px-6 py-4">
            <h2 id="structure-heading" className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span aria-hidden="true">📄</span>
              {config.documentStructure.title}
            </h2>
          </div>
          <div className="p-6">
            <pre className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              {config.documentStructure.content}
            </pre>
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Key Fields Explained
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Field</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">What it means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.documentStructure.variables.map((v, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}
                      >
                        <td className="px-4 py-2.5 font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">{v.field}</td>
                        <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{v.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                <strong>Note:</strong> {config.documentStructure.note}
              </p>
            </div>
          </div>
        </section>

        {/* ─── Quick reference ─── */}
        <section
          data-print-section="reference"
          aria-labelledby="quickref-heading"
          className="mb-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 border-b border-indigo-100 dark:border-indigo-900 px-6 py-4">
            <h2 id="quickref-heading" className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
              <span aria-hidden="true">⚡</span>
              Quick Reference
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 w-1/4">Term</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 w-2/5">What it means</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Example</th>
                </tr>
              </thead>
              <tbody>
                {config.quickRefRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}
                  >
                    <td className="px-5 py-3 font-semibold text-indigo-700 dark:text-indigo-400">{row.field}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{row.description}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-500 italic">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ToolAdUnit position="middle" />

        {/* ─── About section ─── */}
        <section aria-labelledby="about-heading" className="mb-8">
          <h2 id="about-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About the {toolName}
          </h2>
          <div className="space-y-4">
            {aboutParagraphs.map((p, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* ─── How to use ─── */}
        <section aria-labelledby="howto-heading" className="mb-8">
          <h2 id="howto-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            How to Use the {toolName}
          </h2>
          <ol className="space-y-3">
            {config.howToSteps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{step.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ─── When to use cards ─── */}
        <section aria-labelledby="when-heading" className="mb-8">
          <h2 id="when-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            When Do You Need a {toolName}?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.whenToUseCards.map((card, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="text-3xl mb-3" aria-hidden="true">{card.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{card.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Pro tips ─── */}
        <section aria-labelledby="tips-heading" className="mb-8">
          <h2 id="tips-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Pro Tips
          </h2>
          <div className="space-y-3">
            {config.proTips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4"
              >
                <span className="flex-shrink-0 text-blue-500 mt-0.5" aria-hidden="true">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.298.057-.593.125-.882A7 7 0 1010 14h2z" />
                  </svg>
                </span>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Legal disclaimer ─── */}
        <div className="mb-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <span className="flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" aria-hidden="true">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-1">Legal Disclaimer</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                The {toolName} generates template documents for general informational and educational purposes only. The generated document is not a substitute for advice from a qualified attorney and does not create an attorney-client relationship. Document enforceability depends on the laws of your jurisdiction, how the document is executed, and the specific facts of your situation. For legal matters involving significant financial value, property rights, employment, or personal rights, consult a licensed attorney in your jurisdiction before relying on any template document.
              </p>
            </div>
          </div>
        </div>

        {/* ─── FAQ ─── */}
        <section aria-labelledby="faq-heading" className="mb-8">
          <h2 id="faq-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {config.faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ─── Related tools ─── */}
        <section aria-labelledby="related-heading" className="mb-8">
          <h2 id="related-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Related Legal Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {config.relatedTools.map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/legal-tools/${tool.slug}`}
                className="flex items-start gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">{tool.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                    {tool.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── ToolPageExtras (rating, feedback, share, PDF, disclaimer) ─── */}
        <ToolPageExtras
          toolName={toolName}
          toolSlug={toolSlug}
          toolUrl={toolUrl}
          type="legal"
          showPDF
        />

        <ToolAdUnit position="bottom" />

        {/* ─── Back link ─── */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/tools/legal-tools"
            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Legal Tools
          </Link>
        </div>
      </main>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}
