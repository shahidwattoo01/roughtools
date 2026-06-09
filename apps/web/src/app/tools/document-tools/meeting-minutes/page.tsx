import type { Metadata } from 'next'
import MeetingMinutesClient from './MeetingMinutesClient'

export const metadata: Metadata = {
  title: `Meeting Minutes Generator — Free Meeting Notes Template | RoughTools`,
  description: `Create professional meeting minutes with action items, attendees, and decisions. Export to PDF. Free online meeting minutes generator.`,
  keywords: ['meeting minutes generator', 'meeting notes template', 'meeting minutes template', 'create meeting minutes', 'free minutes maker'],
  alternates: { canonical: 'https://roughtools.com/tools/document-tools/meeting-minutes' },
  openGraph: {
    title: `Meeting Minutes Generator — Free Meeting Notes Template | RoughTools`,
    description: `Create professional meeting minutes with action items, attendees, and decisions. Export to PDF. Free online meeting minutes generator.`,
    url: 'https://roughtools.com/tools/document-tools/meeting-minutes',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Meeting Minutes Generator — Free Meeting Notes Template | RoughTools`,
    description: `Create professional meeting minutes with action items, attendees, and decisions. Export to PDF. Free online meeting minutes generator.`,
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
      { '@type': 'ListItem', position: 3, name: 'Meeting Minutes Generator', item: 'https://roughtools.com/tools/document-tools/meeting-minutes' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <MeetingMinutesClient />
    </>
  )
}
