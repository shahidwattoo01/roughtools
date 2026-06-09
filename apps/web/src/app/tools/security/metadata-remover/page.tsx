import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import MetadataRemoverClient from './MetadataRemoverClient'

export const metadata: Metadata = {
  title: `Metadata Remover — Remove EXIF Data from Images | RoughTools`,
  description: `Remove EXIF metadata and location data from photos and files privately in your browser. Free online metadata remover tool.`,
  keywords: ['metadata remover', 'exif remover', 'remove exif data', 'strip metadata from image', 'photo metadata cleaner'],
  alternates: { canonical: 'https://roughtools.com/tools/security/metadata-remover' },
  openGraph: {
    title: `Metadata Remover — Remove EXIF Data from Images | RoughTools`,
    description: `Remove EXIF metadata and location data from photos and files privately in your browser. Free online metadata remover tool.`,
    url: 'https://roughtools.com/tools/security/metadata-remover',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Metadata Remover — Remove EXIF Data from Images | RoughTools`,
    description: `Remove EXIF metadata and location data from photos and files privately in your browser. Free online metadata remover tool.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'Metadata Remover', item: 'https://roughtools.com/tools/security/metadata-remover' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <MetadataRemoverClient />
    </>
  )
}
