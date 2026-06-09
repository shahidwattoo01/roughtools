import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import QRCodeGeneratorClient from './QRCodeGeneratorClient'

export const metadata: Metadata = {
  title: `QR Code Generator — Create QR Codes Free Online | RoughTools`,
  description: `Generate QR codes for URLs, text, email, phone, WiFi, and contacts. Customizable colors and sizes. Free online QR code generator.`,
  keywords: ['qr code generator', 'create qr code', 'free qr code maker', 'qr code online', 'wifi qr code'],
  alternates: { canonical: 'https://roughtools.com/tools/security/qr-code-generator' },
  openGraph: {
    title: `QR Code Generator — Create QR Codes Free Online | RoughTools`,
    description: `Generate QR codes for URLs, text, email, phone, WiFi, and contacts. Customizable colors and sizes. Free online QR code generator.`,
    url: 'https://roughtools.com/tools/security/qr-code-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `QR Code Generator — Create QR Codes Free Online | RoughTools`,
    description: `Generate QR codes for URLs, text, email, phone, WiFi, and contacts. Customizable colors and sizes. Free online QR code generator.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'QR Code Generator', item: 'https://roughtools.com/tools/security/qr-code-generator' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <QRCodeGeneratorClient />
    </>
  )
}
