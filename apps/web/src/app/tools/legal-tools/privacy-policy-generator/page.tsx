/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import PrivacyPolicyClient from './PrivacyPolicyClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Privacy Policy Generator — Free GDPR Privacy Policy | RoughTools',
  description: 'Generate a free privacy policy for your website or app instantly. GDPR and CCPA compliant template. No lawyer needed.',
  alternates: { canonical: 'https://roughtools.com/tools/legal-tools/privacy-policy-generator' },
  openGraph: {
    title: 'Privacy Policy Generator — Free GDPR Privacy Policy | RoughTools',
    description: 'Generate a free privacy policy for your website or app instantly. GDPR and CCPA compliant template. No lawyer needed.',
    url: 'https://roughtools.com/tools/legal-tools/privacy-policy-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy Generator — Free GDPR Privacy Policy | RoughTools',
    description: 'Generate a free privacy policy for your website or app instantly. GDPR and CCPA compliant template. No lawyer needed.',
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  { q: 'Do I need a privacy policy?', a: 'Yes, if your website collects any user data (including via cookies or analytics), most jurisdictions require a privacy policy. GDPR (EU), CCPA (California), and other laws mandate it.' },
  { q: 'Is this privacy policy legally binding?', a: 'This generator creates a template based on common legal requirements. For full legal compliance, especially for GDPR or CCPA, we recommend reviewing it with a qualified attorney.' },
  { q: 'What is GDPR compliance?', a: 'GDPR (General Data Protection Regulation) is an EU law that requires websites to disclose what data they collect, how it is used, and gives users rights over their data.' },
  { q: 'Can I use this for my mobile app?', a: 'Yes. The generated policy covers websites and apps. You may need to add app-specific sections (push notifications, device permissions) for full mobile compliance.' },
]

const schemas = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Privacy Policy Generator', url: 'https://roughtools.com/tools/legal-tools/privacy-policy-generator', applicationCategory: 'LegalApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
]


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Legal Tools', item: 'https://roughtools.com/tools/legal-tools' },
    { '@type': 'ListItem', position: 3, name: 'Privacy Policy Generator', item: 'https://roughtools.com/tools/legal-tools/privacy-policy-generator' },
  ],
}
export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={[...schemas, breadcrumbLd]} />
      <div style={{ minHeight: '100vh', background: 'var(--bg-0)', color: 'var(--fg)', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px 80px' }}>
          <Link href="/tools/legal-tools" style={{ color: 'var(--brand-2)', fontSize: 13, textDecoration: 'none' }}>← Legal Tools</Link>
          <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, margin: '16px 0 8px', letterSpacing: -1, color: 'var(--fg)' }}>Privacy Policy Generator</h1>
          <p style={{ color: 'var(--fg-2)', marginBottom: 24 }}>Generate a free privacy policy for your website or app. GDPR & CCPA ready.</p>
          <ToolAdUnit position="top" />
          <PrivacyPolicyClient />
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
                { name: 'NDA Generator', href: '/tools/legal-tools/nda-generator', desc: 'Non-disclosure agreement' },
                { name: 'Terms of Service Generator', href: '/tools/legal-tools/terms-of-service-generator', desc: 'Website terms & conditions' },
                { name: 'Employment Contract', href: '/tools/legal-tools/employment-contract-generator', desc: 'Job offer letter template' },
                { name: 'Lease Agreement', href: '/tools/legal-tools/lease-agreement-generator', desc: 'Rental contract template' },
                { name: 'Will Generator', href: '/tools/legal-tools/will-generator', desc: 'Last will & testament' },
              ].map(t => (
                <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>
          <ToolPageExtras
            toolName="Privacy Policy Generator"
            toolSlug="privacy-policy-generator"
            toolUrl="https://roughtools.com/tools/legal-tools/privacy-policy-generator"
            type="legal"
            showPDF
          />
          <ToolAdUnit position="bottom" />
        </div>
      </div>
    </>
  )
}
