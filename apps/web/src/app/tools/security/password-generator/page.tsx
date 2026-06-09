import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import PasswordGeneratorClient from './PasswordGeneratorClient'

export const metadata: Metadata = {
  title: `Password Generator — Secure Random Password | RoughTools`,
  description: `Generate cryptographically secure passwords using crypto.getRandomValues(). Standard, passphrase, and PIN modes. Free online password generator.`,
  keywords: ['password generator', 'secure password generator', 'random password', 'strong password generator', 'free password generator'],
  alternates: { canonical: 'https://roughtools.com/tools/security/password-generator' },
  openGraph: {
    title: `Password Generator — Secure Random Password | RoughTools`,
    description: `Generate cryptographically secure passwords using crypto.getRandomValues(). Standard, passphrase, and PIN modes. Free online password generator.`,
    url: 'https://roughtools.com/tools/security/password-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Password Generator — Secure Random Password | RoughTools`,
    description: `Generate cryptographically secure passwords using crypto.getRandomValues(). Standard, passphrase, and PIN modes. Free online password generator.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'Password Generator', item: 'https://roughtools.com/tools/security/password-generator' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PasswordGeneratorClient />
    </>
  )
}
