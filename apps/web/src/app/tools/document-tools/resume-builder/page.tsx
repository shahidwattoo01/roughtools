import type { Metadata } from 'next'
import ResumeBuilderClient from './ResumeBuilderClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: `Resume Builder — Create a Professional Resume Free | RoughTools`,
  description: `Build a professional resume with multiple templates. Export to PDF. Free online resume builder — no signup required.`,
  keywords: ['resume builder', 'free resume maker', 'resume template', 'cv builder online', 'create resume free'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/resume-builder' },
  openGraph: {
    title: `Resume Builder — Create a Professional Resume Free | RoughTools`,
    description: `Build a professional resume with multiple templates. Export to PDF. Free online resume builder — no signup required.`,
    url: 'https://roughtools.com/tools/document-tools/resume-builder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Resume Builder — Create a Professional Resume Free | RoughTools`,
    description: `Build a professional resume with multiple templates. Export to PDF. Free online resume builder — no signup required.`,
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Document Tools', item: 'https://roughtools.com/tools/document-tools' },
      { '@type': 'ListItem', position: 3, name: 'Resume Builder', item: 'https://roughtools.com/tools/document-tools/resume-builder' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ResumeBuilderClient />
      <ToolPageExtras toolName="Resume Builder" toolSlug="resume-builder" toolUrl="https://roughtools.com/tools/document-tools/resume-builder" type="general" showPDF />
      <ToolAdUnit position="bottom" />
    </>
  )
}
