import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PDF_TOOL_CONFIGS } from '../_components/pdf-tool-configs'
import PDFToolClient from '../_components/PDFToolClient'
import PDFToolShell from '@/components/PDFToolShell'
import { pdfTools } from '@/data/pdfTools'

const SITE = 'https://roughtools.com'

// ─── Static params ─────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(PDF_TOOL_CONFIGS).map((slug) => ({ pdfTool: slug }))
}

// ─── Metadata ──────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { pdfTool: string } }
): Promise<Metadata> {
  const config = PDF_TOOL_CONFIGS[params.pdfTool]
  if (!config) return { title: 'PDF Tool | RoughTools' }

  const richData = pdfTools.find(t => t.slug === params.pdfTool)
  const canonical = richData?.canonicalUrl ?? `${SITE}/tools/pdf/${config.slug}`
  const title = richData?.metaTitle ?? `${config.title} — Free Online | RoughTools`
  const description = richData?.metaDescription ?? `${config.description} No signup required. Free to use. Secure & private.`

  return {
    title,
    description,
    keywords: [
      config.title.toLowerCase(),
      `free ${config.title.toLowerCase()}`,
      `online ${config.title.toLowerCase()}`,
      'pdf tool online',
      'roughtools pdf',
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'RoughTools',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
  }
}

// ─── Related tools ──────────────────────────────────────────────
function getRelatedPDFTools(slug: string, subcategory: string) {
  const richData = pdfTools.find(t => t.slug === slug)
  if (richData?.relatedToolSlugs?.length) {
    return richData.relatedToolSlugs
      .filter(s => PDF_TOOL_CONFIGS[s])
      .map(s => ({ slug: s, name: PDF_TOOL_CONFIGS[s].title }))
  }
  const allSlugs = Object.keys(PDF_TOOL_CONFIGS)
  const sameCat = allSlugs.filter(s => s !== slug && PDF_TOOL_CONFIGS[s].subcategory === subcategory)
  const others  = allSlugs.filter(s => s !== slug && PDF_TOOL_CONFIGS[s].subcategory !== subcategory)
  return [...sameCat, ...others].slice(0, 6).map(s => ({ slug: s, name: PDF_TOOL_CONFIGS[s].title }))
}

// ─── FAQs ───────────────────────────────────────────────────────
function getFAQs(slug: string, toolName: string) {
  const richData = pdfTools.find(t => t.slug === slug)
  if (richData?.faqs?.length) {
    return richData.faqs.map(f => ({ q: f.question, a: f.answer }))
  }
  return [
    { q: `Is ${toolName} free to use?`, a: `Yes, ${toolName} is completely free with no daily limits. No account required.` },
    { q: 'Is my PDF file secure?', a: 'All uploads are encrypted with HTTPS. Your files are automatically deleted from our servers within 1 hour of processing.' },
    { q: 'What browsers are supported?', a: 'All modern browsers are supported: Chrome, Firefox, Safari, Edge, and their mobile equivalents.' },
    { q: 'Is there a file size limit?', a: 'Free users can process PDF files up to 50MB.' },
  ]
}

// ─── JSON-LD ────────────────────────────────────────────────────
function getSchemas(slug: string, title: string, description: string, faqs: { q: string; a: string }[]) {
  const richData = pdfTools.find(t => t.slug === slug)
  const url = richData?.canonicalUrl ?? `${SITE}/tools/pdf/${slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: title,
      description: richData?.tagline ?? description,
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: richData ? {
        '@type': 'AggregateRating',
        ratingValue: richData.ratingValue,
        reviewCount: richData.reviewCount,
      } : undefined,
      provider: { '@type': 'Organization', name: 'RoughTools', url: SITE },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'PDF Tools', item: `${SITE}/tools/pdf` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ]
}

// ─── Page ───────────────────────────────────────────────────────
export default function PDFToolPage({ params }: { params: { pdfTool: string } }) {
  const config = PDF_TOOL_CONFIGS[params.pdfTool]
  if (!config) notFound()

  const richData = pdfTools.find(t => t.slug === params.pdfTool)
  const faqs = getFAQs(params.pdfTool, config.title)
  const relatedTools = getRelatedPDFTools(params.pdfTool, config.subcategory)
  const schemas = getSchemas(params.pdfTool, config.title, config.description, faqs)

  return (
    <PDFToolShell
      toolName={config.title}
      toolSlug={params.pdfTool}
      description={config.description}
      faqs={faqs}
      relatedTools={relatedTools}
      schemas={schemas}
      aboutHTML={richData?.aboutHTML}
      howToSteps={richData?.howToSteps}
      ratingValue={richData?.ratingValue}
      reviewCount={richData?.reviewCount}
    >
      <PDFToolClient config={config} />
    </PDFToolShell>
  )
}
