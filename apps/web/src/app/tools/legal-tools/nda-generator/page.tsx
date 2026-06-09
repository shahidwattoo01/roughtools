/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import NdaClient from './NdaClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
export const metadata: Metadata = {
  title: 'NDA Generator — Free Non-Disclosure Agreement Template | RoughTools',
  description: 'Create a free non-disclosure agreement (NDA) online in minutes. Customizable mutual and one-way NDA template. Download instantly.',
  alternates: { canonical: 'https://roughtools.com/tools/legal-tools/nda-generator' },
  openGraph: {
    title: `NDA Generator — Free Non-Disclosure Agreement | RoughTools`,
    description: `Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Free online NDA creator tool.`,
    url: 'https://roughtools.com/tools/legal-tools/nda-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `NDA Generator — Free Non-Disclosure Agreement | RoughTools`,
    description: `Generate a non-disclosure agreement (NDA) for mutual or one-way confidentiality. Free online NDA creator tool.`,
  },
  robots: { index: true, follow: true },
}
const FAQ = [
  { q: 'What is an NDA?', a: 'A Non-Disclosure Agreement (NDA) is a legal contract between parties that establishes a confidential relationship. The party signing the NDA agrees not to disclose information covered by the agreement.' },
  { q: 'When do I need an NDA?', a: 'NDAs are common when sharing business ideas with potential partners, hiring employees or contractors, discussing potential acquisitions, or any situation where sensitive information is shared.' },
  { q: 'What is the difference between mutual and one-way NDA?', a: 'A one-way NDA protects only the disclosing party. A mutual NDA protects both parties — used when both sides are sharing confidential information.' },
  { q: 'How long should an NDA last?', a: 'Most NDAs last 1–5 years. Trade secrets may be protected indefinitely. The appropriate duration depends on the nature of the information and your industry.' },
]
const schemas = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'NDA Generator', url: 'https://roughtools.com/tools/legal-tools/nda-generator', applicationCategory: 'LegalApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(({q,a}) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
]

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Legal Tools', item: 'https://roughtools.com/tools/legal-tools' },
    { '@type': 'ListItem', position: 3, name: 'NDA Generator', item: 'https://roughtools.com/tools/legal-tools/nda-generator' },
  ],
}
export default function NdaPage() {
  return (
    <>
      <JsonLd data={[...schemas, breadcrumbLd]} />
      <div style={{ minHeight: '100vh', background: 'var(--bg-0)', color: 'var(--fg)', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px 80px' }}>
          <Link href="/tools/legal-tools" style={{ color: 'var(--brand-2)', fontSize: 13, textDecoration: 'none' }}>← Legal Tools</Link>
          <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, margin: '16px 0 8px', letterSpacing: -1, color: 'var(--fg)' }}>NDA Generator</h1>
          <p style={{ color: 'var(--fg-2)', marginBottom: 24 }}>Create a free non-disclosure agreement in minutes. Customizable template.</p>
          <ToolAdUnit position="top" />
          <NdaClient />
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
            {FAQ.map(({q,a},i) => (
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
                { name: 'Terms of Service Generator', href: '/tools/legal-tools/terms-of-service-generator', desc: 'Website terms & conditions' },
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
            toolName="NDA Generator"
            toolSlug="nda-generator"
            toolUrl="https://roughtools.com/tools/legal-tools/nda-generator"
            type="legal"
            showPDF
          />
          <ToolAdUnit position="bottom" />
        </div>
      </div>
    </>
  )
}
