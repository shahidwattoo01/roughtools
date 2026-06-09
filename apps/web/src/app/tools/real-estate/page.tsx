import type { Metadata } from 'next'
import RealEstateClient from './RealEstateClient'

export const metadata: Metadata = {
  title: '8 Free Real Estate Calculators — Rent vs Buy, Affordability, Cap Rate | Roughtools',
  description: 'Free real estate calculators: rent vs buy, home affordability, closing costs, down payment, cap rate, rental yield, home value estimator, and property tax. No signup required.',
  keywords: ['real estate calculators', 'rent vs buy calculator', 'home affordability calculator', 'closing costs calculator', 'cap rate calculator', 'rental yield calculator', 'property tax calculator', 'home value estimator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/real-estate' },
  openGraph: {
    title: 'Free Real Estate Calculators | Roughtools',
    description: 'Rent vs buy, home affordability, cap rate, rental yield, closing costs, and more — all free, no signup.',
    url: 'https://roughtools.com/tools/real-estate',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '8 Free Real Estate Calculators | Roughtools',
    description: 'Rent vs buy, affordability, cap rate, rental yield, closing costs, and more — all free.',
  },
}

export default function RealEstatePage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Real Estate Tools', item: 'https://roughtools.com/tools/real-estate' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <RealEstateClient />
    </>
  )
}
