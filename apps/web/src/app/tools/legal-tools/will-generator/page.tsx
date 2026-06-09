/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import WillClient from './WillClient'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
export const metadata: Metadata = {
  title: 'Free Last Will and Testament Generator | RoughTools',
  description: 'Generate a basic last will and testament document online for free. Simple will template.',
  alternates: { canonical: 'https://roughtools.com/tools/legal-tools/will-generator' },
  openGraph: {
    title: `Will Generator — Free Last Will & Testament | RoughTools`,
    description: `Generate a basic last will and testament template. Free online will generator for simple estate planning.`,
    url: 'https://roughtools.com/tools/legal-tools/will-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Will Generator — Free Last Will & Testament | RoughTools`,
    description: `Generate a basic last will and testament template. Free online will generator for simple estate planning.`,
  },
  robots: { index: true, follow: true },
}
const schemas = [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Last Will & Testament Generator', url: 'https://roughtools.com/tools/legal-tools/will-generator', applicationCategory: 'LegalApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Legal Tools', item: 'https://roughtools.com/tools/legal-tools' },
    { '@type': 'ListItem', position: 3, name: 'Will Generator', item: 'https://roughtools.com/tools/legal-tools/will-generator' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[...schemas, breadcrumbLd]} />
      <div style={{ minHeight: '100vh', background: 'var(--bg-0)', color: 'var(--fg)', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px 80px' }}>
          <Link href="/tools/legal-tools" style={{ color: 'var(--brand-2)', fontSize: 13, textDecoration: 'none' }}>← Legal Tools</Link>
          <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, margin: '16px 0 8px', letterSpacing: -1, color: 'var(--fg)' }}>Last Will & Testament Generator</h1>
          <p style={{ color: 'var(--fg-2)', marginBottom: 24 }}>Generate a basic last will and testament document online for free. Simple will template.</p>
          <ToolAdUnit position="top" />
          <WillClient />
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Related Legal Tools</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { name: 'Power of Attorney Generator', href: '/tools/legal-tools/power-of-attorney-generator', desc: 'POA document template' },
                { name: 'NDA Generator', href: '/tools/legal-tools/nda-generator', desc: 'Non-disclosure agreement' },
                { name: 'Privacy Policy Generator', href: '/tools/legal-tools/privacy-policy-generator', desc: 'GDPR privacy policy' },
                { name: 'Lease Agreement', href: '/tools/legal-tools/lease-agreement-generator', desc: 'Rental contract template' },
                { name: 'Employment Contract', href: '/tools/legal-tools/employment-contract-generator', desc: 'Job offer letter template' },
              ].map(t => (
                <a key={t.href} href={t.href} style={{ display: 'block', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--fg)', textDecoration: 'none' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{t.desc}</div>
                </a>
              ))}
            </div>
          </section>
          <ToolPageExtras
            toolName="Last Will & Testament Generator"
            toolSlug="will-generator"
            toolUrl="https://roughtools.com/tools/legal-tools/will-generator"
            type="legal"
            showPDF
          />
          <ToolAdUnit position="bottom" />
        </div>
      </div>
    </>
  )
}
