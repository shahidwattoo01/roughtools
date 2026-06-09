import type { Metadata } from 'next'
import Link from 'next/link'
import HashGeneratorClient from './HashGeneratorClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512 | RoughTools',
  description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for any text instantly in your browser. Free online hash generator with Web Crypto API — no data sent to servers.',
  keywords: ['hash generator', 'sha256 generator', 'md5 generator', 'sha512 online', 'text hash generator', 'sha1 calculator'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/hash-generator' },
  openGraph: {
    title: `Hash Generator — MD5, SHA-1, SHA-256 & More | RoughTools`,
    description: `Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text instantly in your browser. Free online hash generator tool.`,
    url: 'https://roughtools.com/tools/developer/hash-generator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Hash Generator — MD5, SHA-1, SHA-256 & More | RoughTools`,
    description: `Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text instantly in your browser. Free online hash generator tool.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this hash generator free to use?', a: 'Yes, the RoughTools Hash Generator is completely free with no account, subscription, or payment required. You can generate MD5, SHA-1, SHA-256, and SHA-512 hashes for unlimited strings at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits and no registration required.' },
  { q: 'Do I need to sign up to generate hashes?', a: 'No account, email, or registration is required. Enter your text and all four hash values appear instantly. There is no login wall, no paywall on any algorithm, and no data stored about the strings you hash. The tool is entirely anonymous — your input text is never associated with any user profile or retained after the session.' },
  { q: 'Is my text sent to a server when I generate a hash?', a: 'No. All hashing runs entirely within your browser using the Web Cryptography API (SubtleCrypto). Your text — which may be a password, an API secret, a file path, or any sensitive string — never leaves your device. This is the same cryptographic engine used by password managers and security software. Once you close the tab, the data is gone with no server trace.' },
  { q: 'Does the hash generator work on mobile and tablet?', a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. All input fields and hash output are optimised for mobile screens. This is useful when verifying a hash value from documentation on your phone, checking a checksum for a downloaded file, or quickly generating a hash for testing while away from a desktop environment.' },
  { q: 'Which browsers support this hash generator?', a: 'The Hash Generator works in all modern browsers that support the Web Cryptography API: Google Chrome 37+, Mozilla Firefox 34+, Microsoft Edge 12+, Safari 11+, and Opera 24+. The SubtleCrypto API used for SHA-256 and SHA-512 is built into all current browsers. MD5 is implemented in JavaScript since it is not part of the Web Crypto standard. Internet Explorer is not supported.' },
  { q: 'How secure are the generated hashes?', a: 'For cryptographic use: SHA-256 and SHA-512 are cryptographically secure hash functions — suitable for data integrity verification, HMAC generation, and digital signatures. SHA-1 is considered cryptographically broken for collision resistance and should not be used for new security applications. MD5 is broken for security purposes and should only be used for non-security checksums (like file integrity). For password hashing, never use these algorithms directly — use a purpose-built password hashing function like bcrypt, Argon2, or scrypt.' },
  { q: 'Can I use the hash generator offline?', a: 'Once the page has fully loaded, hashing runs in the browser without requiring an active internet connection. You can enter text and see all hash outputs offline. The SubtleCrypto API and JavaScript MD5 implementation are both client-side and work without network access. This is useful in secure air-gapped environments, when verifying checksums offline, or during network outages.' },
  { q: 'How do I generate a hash step by step?', a: 'To generate hashes: (1) Enter your text in the input field — this can be any string: a password, a file checksum input, a message, or any data you want to hash. (2) All four hashes (MD5, SHA-1, SHA-256, SHA-512) are generated and displayed simultaneously in real time as you type. (3) Click the copy button next to any hash to copy it to your clipboard. (4) Use SHA-256 or SHA-512 for any security-sensitive hashing application.' },
  { q: 'Why should I use RoughTools instead of a command line for hashing?', a: 'Command-line tools (echo "text" | sha256sum) require terminal access and typing careful commands to avoid including a trailing newline. RoughTools Hash Generator shows all four hash algorithms simultaneously in one click, making it faster for quick lookups and comparisons. It is also accessible from any browser without installing any tools — useful on shared machines, in documentation, or when giving a quick hash example in a code review.' },
  { q: 'How do I report a bug or request a new hash algorithm?', a: 'To report a bug or request a new algorithm — such as SHA-3, BLAKE2, RIPEMD-160, HMAC generation with a key, or file hashing (drag-and-drop a file to get its hash) — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the input text (sanitised if sensitive), the algorithm that produced unexpected output, the browser and OS, and the expected hash value.' },
  { q: 'What is the difference between MD5, SHA-1, SHA-256, and SHA-512?', a: 'These four algorithms differ in output length and security: MD5 produces a 128-bit (32 hex character) hash. It is fast but cryptographically broken — do not use for security. SHA-1 produces a 160-bit (40 hex character) hash. Also broken for collision resistance — avoid for new applications. SHA-256 (part of SHA-2) produces a 256-bit (64 hex character) hash. Cryptographically secure and widely used — the standard choice for most applications. SHA-512 produces a 512-bit (128 hex character) hash. More secure and faster on 64-bit hardware; useful where extra security margin is desired. For most developer needs, SHA-256 is the right choice.' },
  { q: 'Can I use this hash generator to hash passwords?', a: 'Technically yes, but you should not use MD5, SHA-1, SHA-256, or SHA-512 directly for password hashing in any application. These algorithms are designed to be fast — which makes them unsuitable for passwords because attackers can test billions of guesses per second. Password hashing requires a deliberately slow algorithm with a salt: use bcrypt (cost factor 10+), Argon2id (recommended by OWASP), or scrypt. Frameworks like Node.js bcrypt, Python passlib, and PHP\'s password_hash() implement these correctly. Use this hash generator for data integrity checks, checksums, and non-password applications.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Hash Generator', item: 'https://roughtools.com/tools/developer/hash-generator' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Hash Generator',
    url: 'https://roughtools.com/tools/developer/hash-generator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online hash generator tool by RoughTools.',
  }

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/developer" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Developer Tools
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">Hash Generator</h1>
          <span className="ml-auto text-xs bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">#️⃣ MD5 · SHA-1 · SHA-256 · SHA-512</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-900/60 to-green-900/60 border-b border-emerald-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'Web Crypto API', 'All at Once', 'Free'].map(b => (
              <span key={b} className="text-xs bg-emerald-900/50 text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Hash Generator</h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for any text instantly — all four algorithms simultaneously in one view. Uses the browser&apos;s native Web Cryptography API (SubtleCrypto) for SHA-256 and SHA-512 — the same cryptographic engine used by security software. All processing is client-side; your text never leaves your browser. Use SHA-256 for security applications — avoid MD5 and SHA-1 for anything security-critical.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-emerald-900/20 rounded-2xl p-1"><HashGeneratorClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Private', desc: 'Your text never leaves your browser — Web Crypto API used' }, { icon: '4️⃣', title: '4 Algorithms', desc: 'MD5, SHA-1, SHA-256, SHA-512 all generated at once' }, { icon: '⚡', title: 'Real-Time', desc: 'All hashes update instantly as you type' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-emerald-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/jwt-decoder', label: '🔑 JWT Decoder' }, { href: '/tools/developer/base64-encoder', label: '🔤 Base64 Encoder' }, { href: '/tools/developer/uuid-generator', label: '🆔 UUID Generator' }, { href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Hash Generator"
          toolSlug="hash-generator"
          toolUrl="https://roughtools.com/tools/developer/hash-generator"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
