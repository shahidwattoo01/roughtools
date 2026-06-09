/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import TermsClient from './TermsClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Terms of Service Generator — Free Terms & Conditions | RoughTools',
  description: 'Generate free terms of service / terms and conditions for your website or app instantly. Customizable template covering liability, user conduct, and more.',
  alternates: { canonical: 'https://roughtools.com/tools/legal-tools/terms-of-service-generator' },
  openGraph: {
    title: `Terms of Service Generator — Free ToS Creator | RoughTools`,
    description: `Generate terms of service for your website or app. Free online terms of service generator tool.`,
    url: 'https://roughtools.com/tools/legal-tools/terms-of-service-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Terms of Service Generator — Free ToS Creator | RoughTools`,
    description: `Generate terms of service for your website or app. Free online terms of service generator tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  { q: 'Why do I need Terms of Service?', a: 'Terms of Service protect your business by setting rules for how users can use your website, limiting your liability, and establishing what happens in disputes.' },
  { q: 'What is the difference between Terms of Service and Privacy Policy?', a: 'Terms of Service govern the rules of using your website. A Privacy Policy specifically covers how you collect and handle personal data. Both are typically required.' },
  { q: 'Are these terms legally enforceable?', a: 'Well-drafted terms can be enforceable, but enforceability depends on jurisdiction and how prominently terms are displayed. Users should click "I Agree" for stronger enforceability.' },
  { q: 'How often should I update my Terms of Service?', a: 'Update them whenever your service changes significantly — new features, payment terms, or user data handling. Always date the document and notify users of material changes.' },
]

const schemas = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Terms of Service Generator', url: 'https://roughtools.com/tools/legal-tools/terms-of-service-generator', applicationCategory: 'LegalApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
]


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Legal Tools', item: 'https://roughtools.com/tools/legal-tools' },
    { '@type': 'ListItem', position: 3, name: 'Terms of Service Generator', item: 'https://roughtools.com/tools/legal-tools/terms-of-service-generator' },
  ],
}
export default function TermsPage() {
  return (
    <>
      <JsonLd data={[...schemas, breadcrumbLd]} />
      <div style={{ minHeight: '100vh', background: 'var(--bg-0)', color: 'var(--fg)', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px 80px' }}>
          <Link href="/tools/legal-tools" style={{ color: 'var(--brand-2)', fontSize: 13, textDecoration: 'none' }}>← Legal Tools</Link>
          <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, margin: '16px 0 8px', letterSpacing: -1, color: 'var(--fg)' }}>Terms of Service Generator</h1>
          <p style={{ color: 'var(--fg-2)', marginBottom: 24 }}>Create free terms and conditions for your website or app in minutes.</p>
          <ToolAdUnit position="top" />
          <TermsClient />
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
            {FAQ.map(({ q, a }, i) => (
              <div key={i} style={{ marginBottom: 16, padding: '16px 20px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--fg)' }}>{q}</h3>
                <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{a}</p>
              </div>
            ))}
          </section>
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Related Legal Tools</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { name: 'Privacy Policy Generator', href: '/tools/legal-tools/privacy-policy-generator', desc: 'GDPR privacy policy' },
                { name: 'NDA Generator', href: '/tools/legal-tools/nda-generator', desc: 'Non-disclosure agreement' },
                { name: 'Employment Contract', href: '/tools/legal-tools/employment-contract-generator', desc: 'Job offer letter template' },
                { name: 'Lease Agreement', href: '/tools/legal-tools/lease-agreement-generator', desc: 'Rental contract template' },
                { name: 'Cease & Desist Generator', href: '/tools/legal-tools/cease-and-desist-generator', desc: 'Cease and desist letter' },
              ].map(t => (
                <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>
          <ToolPageExtras
            toolName="Terms of Service Generator"
            toolSlug="terms-of-service-generator"
            toolUrl="https://roughtools.com/tools/legal-tools/terms-of-service-generator"
            type="legal"
            showPDF
          />
          <ToolAdUnit position="bottom" />
        </div>
      </div>
    </>
  )
}
