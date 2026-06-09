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
import ToolAdUnit from '@/components/ToolAdUnit'
import { ToolDisclaimer, type DisclaimerType } from '@/components/ToolDisclaimer'
import { ToolPrivacyNotice } from '@/components/ToolPrivacyNotice'
import { ToolStarRating } from '@/components/ToolStarRating'
import { ToolFeedback } from '@/components/ToolFeedback'
import { ToolSocialShare } from '@/components/ToolSocialShare'
import { PDFExportButton } from '@/components/PDFExportButton'
import { ToolFeaturesList } from '@/components/ToolFeaturesList'
import { SEO_CONFIG } from '@/lib/seo-config'

// ─── Static params — pre-render all 194 tool pages ───────────
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

// ─── Disclaimer type per category ────────────────────────────
function getDisclaimerType(category: string, slug: string): DisclaimerType {
  if (category === 'medical') return 'medical'
  if (category === 'legal-tools') return 'legal'
  if (category === 'real-estate') return 'financial'
  const financialSlugs = [
    'mortgage-calculator', 'loan-calculator', 'compound-interest-calculator',
    'roi-calculator', 'tax-calculator', 'salary-calculator', 'retirement-calculator',
    'inflation-calculator', 'currency-converter', 'discount-calculator', 'tip-calculator',
    'home-affordability-calculator', 'rent-vs-buy-calculator', 'cap-rate-calculator',
    'rental-yield-calculator', 'property-tax-calculator', 'closing-costs-calculator',
    'down-payment-calculator',
  ]
  if (financialSlugs.includes(slug)) return 'financial'
  const medicalSlugs = [
    'bmi-calculator', 'calorie-calculator', 'body-fat-calculator',
    'due-date-calculator', 'ovulation-calculator', 'half-life-calculator',
  ]
  if (medicalSlugs.includes(slug)) return 'medical'
  return 'general'
}

// ─── Categories where PDF export makes sense ──────────────────
const PDF_CATEGORIES = new Set([
  'calculators', 'real-estate', 'converters', 'text', 'business',
  'medical', 'engineering', 'environment',
])

// ─── Generate features from tool keywords ────────────────────
function buildFeatures(tool: { keywords: string[]; name: string; description: string }): string[] {
  const base = [
    `Free to use — no signup or account required`,
    `Works entirely in your browser — results are instant`,
    `Mobile-friendly and works on all modern browsers`,
    `No data is stored or transmitted — fully private`,
  ]
  return base
}

// ─── Tool Page ───────────────────────────────────────────────
export default function ToolPage({
  params,
}: {
  params: { category: string; tool: string }
}) {
  const tool = getToolBySlug(params.tool)
  if (!tool) notFound()

  const relatedTools = getRelatedTools(tool.slug)

  const schemas = getToolPageSchemas({
    toolSlug: tool.slug,
    category: params.category,
    howToSteps: DEFAULT_HOW_TO_STEPS[tool.slug],
    faqs: DEFAULT_FAQS[tool.slug],
  })

  const categoryLabel = getCategoryLabel(tool.category)
  const toolUrl = `${SEO_CONFIG.siteUrl}/tools/${params.category}/${params.tool}`
  const disclaimerType = getDisclaimerType(params.category, params.tool)
  const showPDF = PDF_CATEGORIES.has(params.category)

  const faqs =
    DEFAULT_FAQS[tool.slug] || [
      {
        question: `Is ${tool.name} free?`,
        answer: `Yes, ${tool.name} is completely free with no signup required. All calculations and conversions happen instantly in your browser.`,
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No. All free tools work instantly without registration. Simply open the tool and start using it.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes. Your input is processed locally in your browser and is never stored, transmitted, or shared with any server.',
      },
      {
        question: `Can I use ${tool.name} on mobile?`,
        answer: `Yes. ${tool.name} is fully mobile-responsive and works on smartphones and tablets as well as desktop computers.`,
      },
      {
        question: `How accurate is ${tool.name}?`,
        answer: `${tool.name} uses established formulas and methods to produce accurate results. For critical decisions always verify results independently and consult a relevant professional.`,
      },
    ]

  const features = buildFeatures(tool)

  return (
    <>
      <JsonLd data={schemas} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
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
          <ToolAdUnit position="top" />

          {/* ─── Tool Header ─── */}
          <header className="mb-8">
            <div className="flex items-start gap-4">
              <div
                className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center
                           bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                aria-hidden="true"
              >
                {getToolEmoji(tool.category)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {tool.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free to use
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    No signup required
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Instant results
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* ─── TOOL UI PLACEHOLDER ─── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6 shadow-sm">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                {getToolEmoji(tool.category)}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{tool.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Tool interface coming in Phase 5.
                <br />
                The SEO foundation for this page is fully set up.
              </p>
            </div>
          </div>

          {/* B-9 Data privacy notice — immediately below tool */}
          <ToolPrivacyNotice />

          {/* E-1 PDF export button */}
          {showPDF && (
            <div style={{ marginBottom: 8 }}>
              <PDFExportButton toolName={tool.name} />
            </div>
          )}

          <ToolAdUnit position="middle" />

          {/* B-6 Features list */}
          <LazySection rootMargin="300px">
            <ToolFeaturesList features={features} />
          </LazySection>

          {/* B-5 How-to steps */}
          {DEFAULT_HOW_TO_STEPS[tool.slug] && (
            <LazySection rootMargin="300px" className="mb-10">
              <section aria-labelledby="howto-heading">
                <h2 id="howto-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">
                  How to use {tool.name}
                </h2>
                <ol className="space-y-3">
                  {DEFAULT_HOW_TO_STEPS[tool.slug].map((step, i) => (
                    <li key={i} className="flex gap-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{step.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </LazySection>
          )}

          {/* B-8 Disclaimer */}
          <ToolDisclaimer type={disclaimerType} toolName={tool.name} />

          {/* B-7 FAQ */}
          <LazySection rootMargin="400px" className="mb-6">
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 list-none">
                      {faq.question}
                      <svg
                        className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-2"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </LazySection>

          {/* F-1 Star rating */}
          <LazySection rootMargin="400px">
            <ToolStarRating toolName={tool.name} toolSlug={tool.slug} toolUrl={toolUrl} />
          </LazySection>

          {/* F-2 Feedback */}
          <LazySection rootMargin="400px">
            <ToolFeedback toolName={tool.name} />
          </LazySection>

          {/* F-4 Related tools */}
          <LazySection rootMargin="400px">
            <RelatedTools tools={relatedTools} currentToolName={tool.name} />
          </LazySection>

          {/* F-3 Social share */}
          <LazySection rootMargin="400px">
            <ToolSocialShare toolName={tool.name} toolUrl={toolUrl} />
          </LazySection>

          <ToolAdUnit position="bottom" />
        </main>
      </div>
    </>
  )
}

function getToolEmoji(category: string): string {
  const map: Record<string, string> = {
    pdf: '📄', calculators: '🧮', developer: '💻', text: '✏️',
    converters: '🔄', network: '🌐', 'legal-tools': '⚖️', 'real-estate': '🏠',
    security: '🔐', 'document-tools': '📋', business: '💼', environment: '🌿',
    engineering: '⚙️', medical: '🏥', 'image-tools': '🖼️', 'iq-test': '🧠',
  }
  return map[category] || '🛠️'
}
