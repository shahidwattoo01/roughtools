import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CALC_TOOL_CONFIGS,
  CALC_SUBCATEGORIES,
  type CalcEntry,
} from '../_components/calculator-tool-configs'
import { getCalcSEO } from '../_components/calc-seo-configs'
import GenericCalculatorClient from './GenericCalculatorClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

// ─── Types ────────────────────────────────────────────────────
interface Props {
  params: { slug: string }
}

// ─── Static params — pre-render every non-existing calculator ─
export async function generateStaticParams() {
  return Object.values(CALC_TOOL_CONFIGS)
    .filter(t => !t.existing)
    .map(t => ({ slug: t.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = CALC_TOOL_CONFIGS[params.slug]
  if (!tool) return { title: 'Calculator Not Found' }

  const seo = getCalcSEO(tool.slug)
  const title       = seo?.seoTitle       ?? `${tool.name} — Free Online Calculator | Roughtools`
  const description = seo?.metaDescription ?? `${tool.description} Free, no signup required. Instant results.`
  const url = `https://roughtools.com/tools/calculators/${tool.slug}`

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: seo?.seoTitle ?? `${tool.name} | Roughtools`,
      description,
      url,
      type: 'website',
      siteName: 'Roughtools',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.seoTitle ?? `${tool.name} | Roughtools`,
      description,
    },
  }
}

// ─── Find which subcategory a slug belongs to ─────────────────
function getSubcategory(slug: string) {
  return CALC_SUBCATEGORIES.find(sc => sc.tools.some(t => t.slug === slug))
}

// ─── Get related tools (same subcategory, different slug) ─────
function getRelated(slug: string, limit = 6) {
  const sc = getSubcategory(slug)
  if (!sc) return []
  return sc.tools.filter(t => t.slug !== slug).slice(0, limit)
}

// ─── JSON-LD builders ─────────────────────────────────────────
function buildJsonLd(
  tool: CalcEntry,
  subcategory: ReturnType<typeof getSubcategory>,
  seo: ReturnType<typeof getCalcSEO>,
) {
  const url = `https://roughtools.com/tools/calculators/${tool.slug}`
  const description = seo?.metaDescription ?? tool.description

  const breadcrumbItems: object[] = [
    { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
  ]
  if (subcategory) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: subcategory.label,
      item: `https://roughtools.com/tools/calculators#${subcategory.id}`,
    })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: tool.name, item: url })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: tool.name, item: url })
  }

  const appCategory = (() => {
    if (['loan','mortgage','investment','interest','tax','savings','debt','property','retirement'].includes(subcategory?.id ?? '')) return 'FinanceApplication'
    if (['health-bmi','health-calories','health-fitness','pregnancy'].includes(subcategory?.id ?? '')) return 'HealthApplication'
    return 'UtilitiesApplication'
  })()

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    url,
    description,
    applicationCategory: appCategory,
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  const faqs = seo?.faqs ?? []
  const faqPage = faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  return { webApp, breadcrumb, faqPage }
}

// ─── Page ─────────────────────────────────────────────────────
export default function GenericCalculatorPage({ params }: Props) {
  const tool = CALC_TOOL_CONFIGS[params.slug]

  // Redirect existing tools that have dedicated pages shouldn't land here
  // (Next.js will prefer static directories), but guard anyway
  if (!tool) notFound()

  const seo         = getCalcSEO(tool.slug)
  const subcategory = getSubcategory(tool.slug)

  // Related: prefer curated relatedSlugs from SEO config, fallback to subcategory peers
  const seoRelated = (seo?.relatedSlugs ?? [])
    .map(s => CALC_TOOL_CONFIGS[s])
    .filter((t): t is CalcEntry => Boolean(t))
    .slice(0, 6)
  const related = seoRelated.length > 0 ? seoRelated : getRelated(tool.slug)

  const { webApp, breadcrumb, faqPage } = buildJsonLd(tool, subcategory, seo)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── JSON-LD structured data ────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/tools/calculators" className="hover:text-indigo-600 transition-colors">Calculators</Link>
            {subcategory && (
              <>
                <span aria-hidden="true">›</span>
                <Link
                  href={`/tools/calculators#${subcategory.id}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {subcategory.label}
                </Link>
              </>
            )}
            <span aria-hidden="true">›</span>
            <span className="text-gray-800 font-medium truncate">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero strip ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">
              {tool.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{tool.name}</h1>
              <p className="text-indigo-200 text-sm mt-1 leading-relaxed max-w-xl">
                {tool.description}
              </p>
            </div>
          </div>
          {/* Trust chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {['⚡ Instant results', '🔒 Private — runs locally', '🆓 Free forever', '🚫 No signup'].map(chip => (
              <span key={chip} className="text-xs bg-white/15 border border-white/20 rounded-full px-3 py-1 text-indigo-100">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Calculator ─────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ① CALCULATOR (includes Formula + Reference/Disclaimer inside) */}
        <GenericCalculatorClient tool={tool} />

        {/* ② ABOUT — after calculator + formula + reference */}
        {seo?.pageDescription && (
          <section className="mt-8 bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              About the {tool.name}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{seo.pageDescription}</p>
          </section>
        )}

        {/* ③ HOW TO USE */}
        {seo?.howToUse && seo.howToUse.length > 0 && (
          <section className="mt-10 bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🧭</span>
              <h2 className="text-base font-bold text-gray-900">
                How to Use the {tool.name}
              </h2>
            </div>
            <ol className="space-y-3">
              {seo.howToUse.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── Related calculators ──────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="related-heading" className="text-lg font-bold text-gray-900">
                Related Calculators
              </h2>
              <Link
                href="/tools/calculators"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/tools/calculators/${r.slug}`}
                  className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <span className="text-xl flex-shrink-0">{r.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                      {r.name}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.description}</p>
                  </div>
                  <svg className="h-4 w-4 ml-auto text-gray-300 group-hover:text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Compliance kit: B-8, B-9, E-1, F-1, F-2, F-3 */}
        <ToolPageExtras
          toolName={tool.name}
          toolSlug={tool.slug}
          toolUrl={`https://roughtools.com/tools/calculators/${tool.slug}`}
          type="general"
        />

        {/* ── Back link ──────────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/tools/calculators"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Back to All Calculators
          </Link>
        </div>
      </main>
    </div>
  )
}
