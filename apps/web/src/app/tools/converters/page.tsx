import type { Metadata } from 'next'
import ConvertersClient from './ConvertersClient'

export const metadata: Metadata = {
  title: '8 Free Unit Converters — Temperature, Length, Weight & More | Roughtools',
  description: 'Free unit converters: temperature, length, weight, area, volume, speed, time, and digital storage. Instant, accurate to 6 significant figures. No signup required.',
  keywords: ['unit converters', 'temperature converter', 'length converter', 'weight converter', 'area converter', 'volume converter', 'speed converter', 'digital storage converter'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/converters' },
  openGraph: {
    title: '8 Free Unit Converters — Temperature, Length, Weight & More | Roughtools',
    description: 'Temperature, length, weight, area, volume, speed, time, and digital storage converters — all instant and free.',
    url: 'https://roughtools.com/tools/converters',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '8 Free Unit Converters | Roughtools',
    description: 'Instant unit converters for temperature, length, weight, volume, speed, time, and digital storage.',
  },
}

export default function ConvertersPage() {
  return <ConvertersClient />
}
