import type { Metadata } from 'next'
import EnvironmentClient from './EnvironmentClient'

export const metadata: Metadata = {
  title: '6 Free Environment & Eco Tools — Carbon, Solar, EV | Roughtools',
  description: 'Free eco calculators: carbon footprint calculator, solar savings, home energy audit, EV carbon offset, flight carbon calculator, and waste reduction planner. Science-based. No signup.',
  keywords: ['carbon footprint calculator', 'solar savings calculator', 'home energy audit', 'ev carbon offset', 'flight carbon calculator', 'waste reduction planner', 'eco tools', 'environment tools'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/environment' },
  openGraph: {
    title: 'Free Environment & Eco Tools | Roughtools',
    description: '6 free eco tools: carbon footprint, solar savings, EV comparison, flight emissions, home energy audit, and waste reduction. Science-based.',
    url: 'https://roughtools.com/tools/environment',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '6 Free Environment & Eco Tools | Roughtools',
    description: 'Carbon footprint, solar savings, EV offset, flight emissions, home energy and more — all free.',
  },
}

export default function EnvironmentToolsPage() {
  return <EnvironmentClient />
}
