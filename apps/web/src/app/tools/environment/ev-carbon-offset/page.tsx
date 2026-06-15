import type { Metadata } from 'next'
import EnvironmentToolShell from '../_components/EnvironmentToolShell'
import { ENV_CONFIGS } from '../_components/environment-configs'
import EvCarbonClient from './EvCarbonClient'

const config = ENV_CONFIGS['ev-carbon-offset']

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: { canonical: `https://roughtools.com/tools/environment/${config.slug}` },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: `https://roughtools.com/tools/environment/${config.slug}`, type: 'website', siteName: 'RoughTools' },
  twitter: { card: 'summary_large_image', title: config.metaTitle, description: config.metaDescription },
  robots: { index: true, follow: true },
}

export default function Page() {
  const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' }, { '@type': 'ListItem', position: 2, name: 'Environment Tools', item: 'https://roughtools.com/tools/environment' }, { '@type': 'ListItem', position: 3, name: config.name, item: `https://roughtools.com/tools/environment/${config.slug}` }] }
  const webappLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: config.name, url: `https://roughtools.com/tools/environment/${config.slug}`, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, description: config.metaDescription }
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: config.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <EnvironmentToolShell config={config}>
        <EvCarbonClient />
      </EnvironmentToolShell>
    </>
  )
}
