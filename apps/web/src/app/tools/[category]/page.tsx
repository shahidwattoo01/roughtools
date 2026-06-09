import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RelatedTools } from '@/components/RelatedTools'
import { LazySection } from '@/components/LazySection'
import { generateToolPageMetadata, getToolPageSchemas, DEFAULT_HOW_TO_STEPS, DEFAULT_FAQS } from '@/lib/tool-metadata'
import { getRelatedTools } from '@/lib/relatedTools'
import { getToolBySlug, ALL_TOOLS } from '@/lib/tools-registry'
import { getCategoryLabel } from '@/lib/seo'

export const dynamicParams = true
export const revalidate = 86400

export function generateStaticParams() {
  return []
}

// ─── Metadata ────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { category: string; tool: string } }
): Promise<Metadata> {
  return generateToolPageMetadata({ params })
}

// ─── Tool Page ───────────────────────────────────────────────
export default function ToolPage({
  params,
}: {
  params: { category: string; tool: string }
}) {
  const tool = getToolBySlug(params.tool)
  if (!tool) notFound()

  // Related tools — 4 links for internal SEO (Phase 3.7)
  const relatedTools = getRelatedTools(tool.slug)

  // All structured data schemas (Phase 3.4)
  const schemas = getToolPageSchemas({
    toolSlug: tool.slug,
    category: params.category,
    howToSteps: DEFAULT_HOW_TO_STEPS[tool.slug],
    faqs: DEFAULT_FAQS[tool.slug],
  })

  const categoryLabel = getCategoryLabel(tool.category)

  // Default FAQs for any tool that doesn't have specific ones
  const faqs =
    DEFAULT_FAQS[tool.slug] || [
      {
        question: `Is ${tool.name} free?`,
        answer: `Yes, ${tool.name} is completely free with up to 20 uses per day. Pro users get unlimited access.`,
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No signup required. All free tools work instantly without registration.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes. We process your data securely and never store files longer than 1 hour.',
      },
    ]

  return (
    <>
      {/* JSON-LD Structured Data (Phase 3.4) */}
      <JsonLd data={schemas} />

      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: categoryLabel, href: `/tools/${tool.category}` },
                { label: tool.name },
              ]}
            />
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6" id="main-content">
          {/* Tool Header */}
          <header className="mb-8">
            <div className="flex items-start gap-4">
              <div
                className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center
                           bg-white rounded-2xl border border-gray-200 shadow-sm"
                aria-hidden="true"
              >
                {getToolEmoji(tool.category)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {tool.name}
                </h1>
                <p className="text-gray-500 mt-2 text-lg leading-relaxed">
                  {tool.description}
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free to use
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    No signup required
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Instant results
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* ─── TOOL UI PLACEHOLDER ─────────────────────────────
              This section will be replaced by the actual tool
              component in Phase 5 (Missing Tool Pages).
              Each tool imports its own UI component here.
          ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10 shadow-sm">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                {getToolEmoji(tool.category)}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{tool.name}</h2>
              <p className="text-gray-500 max-w-md">
                Tool interface coming in Phase 5.
                <br />
                The SEO foundation for this page is fully set up.
              </p>
            </div>
          </div>

          {/* How to use — SEO content (Phase 3.4) */}
          {DEFAULT_HOW_TO_STEPS[tool.slug] && (
            <LazySection rootMargin="300px" className="mb-10">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  How to use {tool.name}
                </h2>
                <ol className="space-y-3">
                  {DEFAULT_HOW_TO_STEPS[tool.slug].map((step, i) => (
                    <li key={i} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{step.name}</p>
                        <p className="text-gray-500 text-sm mt-0.5">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </LazySection>
          )}

          {/* FAQ Section (Phase 3.4 — FAQ schema) */}
          <LazySection rootMargin="400px" className="mb-10">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none">
                      {faq.question}
                      <svg
                        className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-2"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </LazySection>

          {/* Related Tools — Internal Linking (Phase 3.7) */}
          <LazySection rootMargin="400px">
            <RelatedTools tools={relatedTools} currentToolName={tool.name} />
          </LazySection>
        </main>
      </div>
    </>
  )
}

function getToolEmoji(category: string): string {
  const map: Record<string, string> = {
    pdf: '📄', calculators: '🧮', developer: '💻', text: '✏️',
    converters: '🔄', network: '🌐', 'legal-tools': '⚖️', 'real-estate': '🏠',
  }
  return map[category] || '🛠️'
}