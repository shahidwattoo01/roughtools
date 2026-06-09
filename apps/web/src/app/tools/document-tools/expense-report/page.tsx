import type { Metadata } from 'next'
import ExpenseReportGeneratorClient from './ExpenseReportGeneratorClient'

export const metadata: Metadata = {
  title: `Expense Report Generator — Create Expense Reports Free | RoughTools`,
  description: `Create professional expense reports with itemized costs and totals. Export to PDF. Free online expense report generator tool.`,
  keywords: ['expense report generator', 'expense report template', 'create expense report', 'business expense tracker', 'free expense report maker'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/expense-report' },
  openGraph: {
    title: `Expense Report Generator — Create Expense Reports Free | RoughTools`,
    description: `Create professional expense reports with itemized costs and totals. Export to PDF. Free online expense report generator tool.`,
    url: 'https://roughtools.com/tools/document-tools/expense-report',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Expense Report Generator — Create Expense Reports Free | RoughTools`,
    description: `Create professional expense reports with itemized costs and totals. Export to PDF. Free online expense report generator tool.`,
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
      { '@type': 'ListItem', position: 3, name: 'Expense Report Generator', item: 'https://roughtools.com/tools/document-tools/expense-report' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ExpenseReportGeneratorClient />
    </>
  )
}
