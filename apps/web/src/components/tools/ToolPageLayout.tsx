import PDFToolShell from '@/components/PDFToolShell'

export interface HowToStep {
  title: string
  description: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface RelatedTool {
  name: string
  href: string
  icon?: string
}

export interface ToolPageLayoutProps {
  toolName: string
  toolSlug: string
  tagline: string
  howToSteps: HowToStep[]
  aboutHTML: string
  faqs: FAQ[]
  relatedTools: RelatedTool[]
  ratingValue?: string
  reviewCount?: string
  schemas?: object[]
  children: React.ReactNode
}

/**
 * ToolPageLayout — wraps PDFToolShell with the canonical prop interface.
 * Use this in any tool page that needs how-to steps, about copy, FAQs,
 * related tools, and a star-rating widget.
 */
export default function ToolPageLayout({
  toolName,
  toolSlug,
  tagline,
  howToSteps,
  aboutHTML,
  faqs,
  relatedTools,
  ratingValue = '4.8',
  reviewCount = '1200',
  schemas = [],
  children,
}: ToolPageLayoutProps) {
  return (
    <PDFToolShell
      toolName={toolName}
      toolSlug={toolSlug}
      description={tagline}
      faqs={faqs.map(f => ({ q: f.question, a: f.answer }))}
      relatedTools={relatedTools.map(t => ({
        slug: t.href.split('/').pop() ?? t.href,
        name: t.name,
      }))}
      schemas={schemas}
      aboutHTML={aboutHTML}
      howToSteps={howToSteps}
      ratingValue={ratingValue}
      reviewCount={reviewCount}
    >
      {children}
    </PDFToolShell>
  )
}
