import type { Metadata } from 'next'
import EngineeringPageClient from './_components/EngineeringPageClient'

const SITE      = 'https://roughtools.com'
const CANONICAL = `${SITE}/tools/engineering`

export const metadata: Metadata = {
  title: '126 Free Engineering Calculators & Tools | Roughtools',
  description:
    'Professional engineering calculators for civil, electrical, mechanical, HVAC, software, geotechnical and more. Free, instant, browser-based — no signup required.',
  keywords: [
    'engineering calculators', 'civil engineering tools', 'electrical engineering calculator',
    'mechanical engineering calculator', 'HVAC calculator', 'structural engineering tools',
    'online engineering tools', 'free engineering calculators',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: '126 Free Engineering Tools & Calculators | Roughtools',
    description: 'Civil, Electrical, Mechanical, HVAC, Software & more — professional-grade calculators, all free.',
    url: CANONICAL,
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '126 Free Engineering Calculators | Roughtools',
    description: 'Every engineering discipline covered — free, instant, no signup.',
  },
  robots: { index: true, follow: true },
}

export default function EngineeringHubPage() {
  return <EngineeringPageClient />
}
