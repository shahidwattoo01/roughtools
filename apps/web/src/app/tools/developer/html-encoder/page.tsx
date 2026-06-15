import type { Metadata } from 'next'
import DeveloperToolShell from '../_components/DeveloperToolShell'
import { DEV_CONFIGS } from '../_components/developer-configs'
import HTMLEncoderClient from './HTMLEncoderClient'

const config = DEV_CONFIGS['html-encoder']

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: { canonical: `https://roughtools.com/tools/developer/${config.slug}` },
  openGraph: { title: config.metaTitle, description: config.metaDescription, url: `https://roughtools.com/tools/developer/${config.slug}`, type: 'website', siteName: 'RoughTools' },
  twitter: { card: 'summary_large_image', title: config.metaTitle, description: config.metaDescription },
  robots: { index: true, follow: true },
}

export default function Page() {
  const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' }, { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' }, { '@type': 'ListItem', position: 3, name: config.name, item: `https://roughtools.com/tools/developer/${config.slug}` } ] }
  const webappLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: config.name, url: `https://roughtools.com/tools/developer/${config.slug}`, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, description: config.metaDescription }
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: config.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <DeveloperToolShell config={config}>
        <HTMLEncoderClient />
      </DeveloperToolShell>
    </>
  )
}
