import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import FileEncryptorClient from './FileEncryptorClient'

export const metadata: Metadata = {
  title: `File Encryptor — Encrypt Files Online Free | RoughTools`,
  description: `Encrypt and decrypt files in your browser using AES-256 encryption. Fully client-side — your files never leave your device. Free tool.`,
  keywords: ['file encryptor', 'encrypt file online', 'aes file encryption', 'browser file encryption', 'decrypt file online'],
  alternates: { canonical: 'https://roughtools.com/tools/security/file-encryptor' },
  openGraph: {
    title: `File Encryptor — Encrypt Files Online Free | RoughTools`,
    description: `Encrypt and decrypt files in your browser using AES-256 encryption. Fully client-side — your files never leave your device. Free tool.`,
    url: 'https://roughtools.com/tools/security/file-encryptor',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `File Encryptor — Encrypt Files Online Free | RoughTools`,
    description: `Encrypt and decrypt files in your browser using AES-256 encryption. Fully client-side — your files never leave your device. Free tool.`,
  },
  robots: { index: true, follow: true },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Security Tools', item: 'https://roughtools.com/tools/security' },
    { '@type': 'ListItem', position: 3, name: 'File Encryptor', item: 'https://roughtools.com/tools/security/file-encryptor' },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <FileEncryptorClient />
    </>
  )
}
