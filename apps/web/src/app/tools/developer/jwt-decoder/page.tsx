import type { Metadata } from 'next'
import Link from 'next/link'
import JwtDecoderClient from './JwtDecoderClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'JWT Decoder — Decode JSON Web Tokens Online | RoughTools',
  description: 'Decode JSON Web Tokens (JWT) instantly in your browser. Inspect the header, payload, and signature — check expiry, claims, and algorithm with zero server calls.',
  keywords: ['jwt decoder', 'json web token decoder', 'decode jwt online', 'jwt header payload', 'jwt expiry checker', 'jwt claims viewer'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/jwt-decoder' },
  openGraph: {
    title: `JWT Decoder — Decode JSON Web Tokens Online | RoughTools`,
    description: `Decode and inspect JWT tokens instantly without sending your token to any server. Free online JWT decoder and inspector.`,
    url: 'https://roughtools.com/tools/developer/jwt-decoder',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `JWT Decoder — Decode JSON Web Tokens Online | RoughTools`,
    description: `Decode and inspect JWT tokens instantly without sending your token to any server. Free online JWT decoder and inspector.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this JWT decoder free to use?', a: 'Yes, the RoughTools JWT Decoder is completely free with no account, subscription, or payment required. You can decode unlimited JSON Web Tokens at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits and no registration required to inspect any JWT header, payload, or expiry information.' },
  { q: 'Do I need to sign up to decode a JWT?', a: 'No account, email, or registration is required. Paste your token and the decoded header and payload appear instantly. There is no login wall, no paywall on any field, and no data stored about the tokens you decode. The decoder is entirely anonymous — your tokens are never associated with any user profile.' },
  { q: 'Is it safe to paste my JWT into this decoder?', a: 'The decoder processes the token entirely within your browser — no data is transmitted to RoughTools servers. However, treat any JWT as a sensitive credential. Never paste production tokens with sensitive user data into any online tool unless you fully trust it. For inspecting live production tokens, use your IDE or a command-line tool. This tool is safest for development, staging, and test environment tokens where the secrets are not critical.' },
  { q: 'Does the JWT decoder work on mobile and tablet?', a: 'Yes, the decoder is fully responsive and works on all modern smartphones and tablets. The decoded header and payload display clearly on small screens. This is useful when reviewing authentication issues on mobile devices, checking token expiry during mobile API debugging, or quickly inspecting a JWT from a mobile email or chat message.' },
  { q: 'Which browsers are supported by the JWT decoder?', a: 'The JWT Decoder works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. No plugins are required. The decoder uses standard browser APIs (atob for Base64URL decoding and JSON.parse for the payload) that are available in all current browser versions.' },
  { q: 'How accurate is the JWT decoding?', a: 'The decoder accurately parses the standard JWT three-part format (header.payload.signature) and Base64URL-decodes each part. It handles both standard Base64 and URL-safe Base64 (which replaces + with - and / with _). The payload is then parsed as JSON to display claims. The decoder correctly identifies and displays all standard registered claims (iss, sub, aud, exp, nbf, iat, jti) as well as any custom claims in the payload.' },
  { q: 'Can I use the JWT decoder offline?', a: 'Once the page has fully loaded, the decoder runs entirely in browser JavaScript without requiring an active internet connection. You can decode tokens offline after the initial page load. This is useful in secure development environments with restricted internet access, or when reviewing tokens in situations without reliable connectivity.' },
  { q: 'How do I decode a JWT step by step?', a: 'To decode a JWT: (1) Copy the full JWT string — it looks like three Base64-encoded segments separated by dots. (2) Paste it into the input field. (3) The tool instantly displays the decoded header (algorithm and token type) and the decoded payload (all claims including subject, issuer, and expiry). (4) Check the "exp" claim to see the expiry time — the tool typically shows this as a human-readable date. (5) Review the "alg" field in the header to confirm the signing algorithm used.' },
  { q: 'Why should I use RoughTools instead of jwt.io?', a: 'jwt.io is a well-known tool but sends decoded token data over the network and stores it in URL parameters, which can appear in server logs and browser history. RoughTools JWT Decoder processes everything locally in your browser with no network transmission. This makes it safer for decoding tokens that contain user identifiers, permission scopes, or other sensitive claims — even if the token itself is not a production secret.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as signature verification with a provided secret, token expiry countdown timer, claim documentation tooltips, or support for JWE (encrypted tokens) — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the type of JWT you were decoding (not the token itself), the browser and OS, and what you expected versus what was displayed.' },
  { q: 'What is a JWT and what are its three parts?', a: 'A JSON Web Token (JWT) is a compact, URL-safe token format widely used for authentication and information exchange. It consists of three Base64URL-encoded parts separated by dots: (1) Header — declares the token type ("JWT") and the signing algorithm (HS256, RS256, ES256, etc.). (2) Payload — contains claims: registered claims like "sub" (subject), "exp" (expiry), "iat" (issued at), plus any custom application data. (3) Signature — the cryptographic proof that the header and payload have not been tampered with, computed using the secret or private key.' },
  { q: 'Does this tool verify the JWT signature?', a: 'No — this tool only decodes the header and payload. It does not verify the cryptographic signature. Decoding shows you what the token claims (identity, expiry, permissions), but it cannot confirm that the token was legitimately issued by your authentication server. Signature verification requires the signing secret (for HMAC algorithms like HS256) or the public key (for RSA/ECDSA algorithms like RS256/ES256). For signature verification, use a server-side library: jsonwebtoken for Node.js, PyJWT for Python, or java-jwt for Java.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'JWT Decoder', item: 'https://roughtools.com/tools/developer/jwt-decoder' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JWT Decoder',
    url: 'https://roughtools.com/tools/developer/jwt-decoder',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online jwt decoder tool by RoughTools.',
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
          <h1 className="font-bold text-white text-sm">JWT Decoder</h1>
          <span className="ml-auto text-xs bg-purple-900/50 text-purple-400 border border-purple-800 px-2 py-0.5 rounded-full">🔑 Header · Payload · Expiry</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-900/60 to-violet-900/60 border-b border-purple-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['Header', 'Payload Claims', 'Expiry Check', 'Algorithm', 'Client-Side Only', 'Free'].map(b => (
              <span key={b} className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">JWT Decoder</h2>
          <p className="text-purple-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Decode JSON Web Tokens instantly in your browser with zero server communication. Paste any JWT to inspect the full decoded header (algorithm, token type), payload claims (subject, issuer, expiry, custom fields), and expiry status. The header and payload are Base64URL-encoded — not encrypted — so their content is always readable. This tool is safe for development and staging tokens; the decoding happens entirely client-side with no data leaving your browser.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-purple-900/20 rounded-2xl p-1"><JwtDecoderClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🔒', title: 'Client-Side', desc: 'Token never transmitted — safe for dev tokens' }, { icon: '📋', title: 'All Claims', desc: 'Displays registered and custom payload claims' }, { icon: '⏱️', title: 'Expiry Check', desc: 'Shows exp claim as human-readable date/time' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">JWT Structure Reference</h2>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            {[{ part: 'Header', color: 'text-red-400', desc: 'alg (algorithm), typ (token type)', example: '{"alg":"HS256","typ":"JWT"}' }, { part: 'Payload', color: 'text-purple-400', desc: 'sub, iss, exp, iat + custom claims', example: '{"sub":"user123","exp":1700000000}' }, { part: 'Signature', color: 'text-blue-400', desc: 'Cryptographic proof of integrity', example: 'HMACSHA256(header.payload, secret)' }].map(p => (
              <div key={p.part} className="bg-gray-800/50 rounded-xl p-4">
                <div className={`font-bold text-sm mb-1 ${p.color}`}>{p.part}</div>
                <div className="text-gray-400 text-xs mb-2">{p.desc}</div>
                <code className="text-gray-500 text-xs block font-mono">{p.example}</code>
              </div>
            ))}
          </div>
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-purple-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/hash-generator', label: '#️⃣ Hash Generator' }, { href: '/tools/developer/base64-encoder', label: '🔤 Base64 Encoder' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' }, { href: '/tools/developer/uuid-generator', label: '🆔 UUID Generator' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-purple-500 hover:text-purple-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="JWT Decoder"
          toolSlug="jwt-decoder"
          toolUrl="https://roughtools.com/tools/developer/jwt-decoder"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
