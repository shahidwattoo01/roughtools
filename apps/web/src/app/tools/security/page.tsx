import type { Metadata } from 'next'
import SecurityToolsClient from './SecurityToolsClient'

export const metadata: Metadata = {
  title: '8 Free Security & Privacy Tools — Password Generator, QR Code & More | Roughtools',
  description: 'Free security and privacy tools: password generator, temporary email, AES-256 file encryption, VPN leak checker, metadata remover, QR code generator, URL shortener, and SSL checker. Client-side only — zero data stored.',
  keywords: ['security tools', 'password generator', 'qr code generator', 'temporary email', 'file encryption', 'vpn checker', 'metadata remover', 'ssl checker', 'privacy tools'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/security' },
  openGraph: {
    title: '8 Free Security & Privacy Tools | Roughtools',
    description: 'Password generator, temp email, file encryption, VPN checker, QR codes and more. Client-side only — no data stored.',
    url: 'https://roughtools.com/tools/security',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: '8 Free Security & Privacy Tools | Roughtools',
    description: 'Password generator, QR code maker, file encryptor, VPN checker and more — all free, client-side only.',
  },
}

export default function SecurityPage() {
  return <SecurityToolsClient />
}
