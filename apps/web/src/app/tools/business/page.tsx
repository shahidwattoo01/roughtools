import type { Metadata } from 'next'
import BusinessClient from './BusinessClient'

export const metadata: Metadata = {
  title: '6 Free Business & Marketing Tools — AI Copy, Ads, SEO | Roughtools',
  description: 'Free AI-powered business tools: sales copy generator, ad creative maker, email marketing AI, social media content scheduler, landing page builder, and SEO optimizer. No signup.',
  keywords: ['business tools', 'sales copy generator', 'ad creative generator', 'email marketing ai', 'seo optimizer', 'landing page builder', 'social media scheduler', 'free business tools'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/business' },
  openGraph: {
    title: 'Free Business & Marketing Tools | Roughtools',
    description: '6 high-performance AI tools for sales, marketing, and SEO. 100% free, no signup.',
    url: 'https://roughtools.com/tools/business',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '6 Free Business & Marketing Tools | Roughtools',
    description: 'Sales copy, ad creatives, email sequences, landing pages, and SEO tools — all free.',
  },
}

export default function BusinessToolsPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://roughtools.com/tools/business' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BusinessClient />
    </>
  )
}
