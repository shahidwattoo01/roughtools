import type React from 'react'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDF_SUBCATEGORIES } from '@/app/tools/pdf/_components/pdf-tool-configs'
import StarRating from '@/components/tools/StarRating'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PDFToolFAQ { q: string; a: string }

export interface PDFRelatedTool { slug: string; name: string }

export interface PDFToolShellProps {
  toolName: string
  toolSlug: string
  description: string
  children: React.ReactNode
  faqs: PDFToolFAQ[]
  relatedTools: PDFRelatedTool[]
  schemas: object[]
  // Rich content from pdfTools.ts (optional — gracefully falls back)
  aboutHTML?: string
  howToSteps?: { title: string; description: string }[]
  ratingValue?: string
  reviewCount?: string
}

// ─── Sub-nav ──────────────────────────────────────────────────────────────────

function PDFSubNav() {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max text-xs">
          <Link
            href="/tools/pdf"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition-colors whitespace-nowrap dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
          >
            📄 All PDF Tools
          </Link>
          {PDF_SUBCATEGORIES.map(sc => (
            <Link
              key={sc.id}
              href={`/tools/pdf#${sc.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              {sc.icon} {sc.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
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
              className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
            >
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FAQSection({ faqs }: { faqs: PDFToolFAQ[] }) {
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
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

// ─── Related tools grid ───────────────────────────────────────────────────────

function RelatedSection({ tools }: { tools: PDFRelatedTool[] }) {
  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Related PDF Tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tools.map(t => (
          <Link
            key={t.slug}
            href={`/tools/pdf/${t.slug}`}
            className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 hover:shadow-sm transition-all text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-700 dark:hover:text-red-400 group"
          >
            <span className="text-base flex-shrink-0">📄</span>
            <span className="leading-tight">{t.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── About section ────────────────────────────────────────────────────────────

function AboutSection({
  toolName,
  description,
  aboutHTML,
}: {
  toolName: string
  description: string
  aboutHTML?: string
}) {
  return (
    <section className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About {toolName}</h2>
      {aboutHTML ? (
        <div
          className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 dark:prose-strong:text-gray-200"
          dangerouslySetInnerHTML={{ __html: aboutHTML }}
        />
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
            {description} RoughTools&apos;s {toolName.toLowerCase()} works directly in your browser
            with no software downloads required.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            All PDF processing is handled by our secure servers. Your files are automatically deleted
            within 1 hour. We never share, sell, or store your documents beyond processing.
          </p>
        </>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {['No signup required', 'Free to use', 'Secure & encrypted', 'Works on mobile', 'No watermarks'].map(f => (
          <span key={f} className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1 text-gray-600 dark:text-gray-300">
            ✓ {f}
          </span>
        ))}
      </div>
    </section>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function PDFToolShell({
  toolName,
  toolSlug,
  description,
  children,
  faqs,
  relatedTools,
  schemas,
  aboutHTML,
  howToSteps,
  ratingValue = '4.8',
  reviewCount = '1200',
}: PDFToolShellProps) {
  return (
    <>
      <JsonLd data={schemas} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sticky sub-nav */}
        <PDFSubNav />

        <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6" id="main-content">
          {/* Top ad */}
          <ToolAdUnit position="top" />

          {/* ① TOOL WIDGET — first, above the fold */}
          {children}

          {/* ② HOW-TO STEPS — usage instructions (formula equivalent for PDF tools) */}
          {howToSteps && howToSteps.length > 0 && <HowToSection steps={howToSteps} />}

          {/* Middle ad */}
          <ToolAdUnit position="middle" />

          {/* ③ ABOUT — informational context about the tool */}
          <AboutSection toolName={toolName} description={description} aboutHTML={aboutHTML} />

          {/* ④ FAQ — reference information */}
          <FAQSection faqs={faqs} />

          {/* ⑤ RELATED PDF TOOLS */}
          {relatedTools.length > 0 && <RelatedSection tools={relatedTools} />}

          {/* Star rating widget */}
          <StarRating toolSlug={toolSlug} ratingValue={ratingValue} reviewCount={reviewCount} />

          {/* Bottom ad */}
          <ToolAdUnit position="bottom" />
        </main>
      </div>
    </>
  )
}
