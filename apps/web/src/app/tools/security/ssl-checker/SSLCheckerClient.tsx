'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'


interface SSLResult {
  domain: string
  issuer: string
  subject: string
  validFrom: string
  validTo: string
  daysUntilExpiry: number
  isValid: boolean
  isExpired: boolean
  san: string[]
  fingerprint: string
}

const FAQS = [
  {
    q: 'Is this SSL certificate checker free to use?',
    a: 'Yes, the RoughTools SSL Certificate Checker is completely free with no account, sign-up, or subscription required. You can check as many domains as needed — individual websites, subdomains, API endpoints, or mail servers — at no cost. There are no daily limits, no captcha requirements, and no hidden premium tiers. RoughTools is funded through non-intrusive advertising, keeping every tool permanently free for developers, system administrators, and security professionals.'
  },
  {
    q: 'Do I need to create an account to check SSL certificates?',
    a: 'No account, registration, email address, or personal information is required. Enter a domain name and click Check — results are displayed within seconds. There is no login wall, no rate limit that requires registration to bypass, and no history of your certificate checks stored against any profile. Each check is stateless: you get the results and that is the complete interaction.'
  },
  {
    q: 'Does this tool store the domains I check?',
    a: 'RoughTools does not build a database of domains you have checked or associate lookups with your identity. The domain name is sent to the server to perform the TLS handshake and retrieve the certificate, which is then returned to your browser. Standard server access logs (maintained by all web servers) may record the domain as a query parameter, but these are operational logs and are not used for profiling, sold to third parties, or retained beyond standard log rotation periods.'
  },
  {
    q: 'Does the SSL checker work on mobile phones and tablets?',
    a: 'Yes, the SSL Certificate Checker is fully responsive and works on all modern mobile browsers including Safari on iOS and Chrome on Android. The results display clearly on small screens with all certificate fields — issuer, validity dates, subject alternative names, fingerprint, and expiry countdown — formatted for readability on mobile. This is useful for quickly checking a certificate status when you receive an alert on your phone or need to verify a domain while away from your desk.'
  },
  {
    q: 'Which browsers support this SSL certificate checker?',
    a: 'The tool works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. No special browser extensions or plugins are required. The check is performed server-side (as a TLS connection must be made to retrieve the certificate details), so your browser only needs to support standard HTTP requests, which all modern browsers handle natively.'
  },
  {
    q: 'How accurate are the SSL certificate results?',
    a: 'The results are highly accurate as they are retrieved by performing an actual TLS handshake with the target server — the same way your browser connects to a website. The certificate details displayed (issuer, validity dates, subject alternative names, fingerprint, and expiry) are read directly from the TLS certificate presented by the server, not from a cached database. This means results reflect the current live certificate, including any recent renewals or changes. Results for CDN-fronted domains may reflect the CDN certificate rather than the origin.'
  },
  {
    q: 'How do I check an SSL certificate step by step?',
    a: 'To check an SSL certificate: (1) Enter the domain name in the input field — use just the domain, e.g. "example.com" without "https://". (2) Optionally specify a subdomain such as "api.example.com" or "mail.example.com". (3) Press Enter or click "Check SSL". (4) Review the certificate status banner (Valid, Expired, or Issue Detected). (5) Check the expiry date and "Expires In" countdown. (6) Review the issuer to confirm it is from a trusted Certificate Authority. (7) Check Subject Alternative Names to confirm all required subdomains are covered.'
  },
  {
    q: 'What does the expiry countdown tell me and when should I renew?',
    a: 'The expiry countdown shows how many days remain until the SSL certificate expires. A certificate with fewer than 30 days remaining should be renewed promptly — browsers will display security warnings to users once it expires. Most Certificate Authorities recommend renewing 30–60 days before expiry to allow time for DNS propagation and configuration verification. Certificates from free providers like Let\'s Encrypt expire every 90 days and should be configured with automatic renewal. A countdown of 0 means the certificate is expired and the site is showing security warnings to visitors.'
  },
  {
    q: 'What are Subject Alternative Names (SANs) and why do they matter?',
    a: 'Subject Alternative Names (SANs) are a list of domains and subdomains that a single SSL certificate covers. Modern TLS certificates use SANs to protect multiple domains — for example, a certificate may cover "example.com," "www.example.com," "api.example.com," and "shop.example.com" all within one certificate. If a subdomain you need to secure is not listed in the SAN field, visitors to that subdomain will see a certificate name mismatch error. The SAN list in this tool shows all domains the current certificate is valid for, helping you identify coverage gaps.'
  },
  {
    q: 'Why should I use RoughTools SSL Checker instead of browser developer tools?',
    a: 'Browser developer tools show the certificate for the current page in the active browser session, but cannot check certificates for domains you are not currently visiting, subdomains you need to audit, or certificates on non-standard ports. RoughTools SSL Checker lets you check any domain by name, see the full SAN list in a readable format, get an expiry countdown in days, and check multiple domains quickly without navigating to each one. It also shows the fingerprint for certificate pinning verification and handles redirects to retrieve the actual certificate presented at the domain.'
  },
  {
    q: 'How do I report a bug or request a new certificate check feature?',
    a: 'To report a bug or suggest a feature — such as port-specific certificate checks, certificate chain validation, HSTS header detection, or bulk domain checking — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the domain you were checking, the browser and OS you were using, and what result you expected versus what was displayed. Feature requests for certificate monitoring alerts, webhook notifications on expiry, or CSV export of results are all considered for future development.'
  },
  {
    q: 'What does it mean if the tool shows a certificate issue but my browser says it is secure?',
    a: 'Your browser may cache a valid OCSP response or use certificate stapling, creating a brief window where the browser shows "Secure" even if the certificate has issues at the TLS layer. CDN providers also often serve their own certificates at the edge while the origin may have a separate or expired certificate. Additionally, your browser may have the issuer in its trusted root store while this tool\'s server environment has a different trust store. If this tool shows an issue but browsers are not warning users, investigate the CDN or proxy layer — the edge certificate may differ from the origin certificate.'
  },
]

export default function SSLChecker() {
  const [domain, setDomain] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<SSLResult | null>(null)
  const [error, setError] = useState('')
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  async function checkSSL() {
    const d = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!d) return
    setChecking(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch(`/api/tools/ssl-checker?domain=${encodeURIComponent(d)}`)
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to retrieve SSL certificate. Ensure the domain is correct and accessible.')
      } else {
        setResult(json.data)
      }
    } catch {
      setError('Could not reach the API server. Please try again in a moment.')
    } finally {
      setChecking(false)
    }
  }

  const expiryStatus = result == null ? null
    : result.isExpired ? { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700', icon: '❌', label: 'Expired SSL Certificate' }
    : result.daysUntilExpiry < 14 ? { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', icon: '⚠️', label: `Certificate Expires in ${result.daysUntilExpiry} Days` }
    : result.isValid ? { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', icon: '✅', label: 'Valid SSL Certificate' }
    : { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', icon: '⚠️', label: 'Certificate Issue Detected' }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top nav */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Security Tools
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">SSL Certificate Checker</h1>
          <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 px-2 py-0.5 rounded-full">🔒 Live TLS Inspection</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">SSL / TLS Certificate Checker</h2>
          <p className="text-emerald-300/70 text-sm">Live certificate inspection · Expiry countdown · Issuer details · SANs · Fingerprint · Any domain · Free</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Expiry Date', 'Certificate Issuer', 'Subject Alt Names', 'SHA Fingerprint', 'Live TLS Check'].map(b => (
              <span key={b} className="text-xs bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* Search panel */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Domain Name</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkSSL()}
                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-gray-600"
                placeholder="example.com or api.example.com"
              />
              <button
                onClick={checkSSL}
                disabled={checking || !domain.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-6 rounded-xl transition-colors text-sm whitespace-nowrap flex items-center gap-2"
              >
                {checking
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Checking…</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>Check SSL</>
                }
              </button>
            </div>
            <p className="text-gray-700 text-xs mt-1.5">Enter domain only — no https:// prefix needed</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          {result && expiryStatus && (
            <div className="space-y-3">
              {/* Status banner */}
              <div className={`p-4 rounded-xl border text-center font-bold text-base ${expiryStatus.bg} ${expiryStatus.border} ${expiryStatus.color}`}>
                {expiryStatus.icon} {expiryStatus.label}
              </div>

              {/* Details */}
              <div className="grid gap-2">
                {[
                  { label: 'Domain', value: result.domain },
                  { label: 'Subject (CN)', value: result.subject },
                  { label: 'Certificate Issuer', value: result.issuer },
                  { label: 'Valid From', value: new Date(result.validFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Valid To', value: new Date(result.validTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-xl gap-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm flex-shrink-0">{label}</span>
                    <span className="text-gray-900 dark:text-white text-sm text-right break-all">{value}</span>
                  </div>
                ))}

                {/* Expiry countdown */}
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Expires In</span>
                  <span className={`text-sm font-bold ${expiryStatus.color}`}>
                    {result.isExpired
                      ? `Expired ${Math.abs(result.daysUntilExpiry)} day${Math.abs(result.daysUntilExpiry) !== 1 ? 's' : ''} ago`
                      : `${result.daysUntilExpiry} day${result.daysUntilExpiry !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>

                {/* Expiry bar */}
                {!result.isExpired && (
                  <div className="px-3 pb-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${result.daysUntilExpiry < 14 ? 'bg-red-500' : result.daysUntilExpiry < 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (result.daysUntilExpiry / 365) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {result.daysUntilExpiry < 30 ? 'Renew soon to avoid service disruption' : result.daysUntilExpiry < 60 ? 'Plan renewal within the next month' : 'Certificate health is good'}
                    </p>
                  </div>
                )}

                {/* Fingerprint */}
                {result.fingerprint && (
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">SHA-256 Fingerprint</span>
                    </div>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{result.fingerprint}</p>
                  </div>
                )}

                {/* SANs */}
                {result.san && result.san.length > 0 && (
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Subject Alternative Names ({result.san.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.san.slice(0, 24).map(name => (
                        <span key={name} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-lg font-mono">{name}</span>
                      ))}
                      {result.san.length > 24 && (
                        <span className="text-gray-500 text-xs py-1">+{result.san.length - 24} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => { setResult(null); setDomain('') }}
                className="w-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Check Another Domain
              </button>
            </div>
          )}
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔍', title: 'Live Inspection', desc: 'Real TLS handshake — not a cached database lookup' },
            { icon: '📅', title: 'Expiry Countdown', desc: 'Days remaining displayed with colour-coded urgency' },
            { icon: '📋', title: 'Full SAN List', desc: 'See every domain covered by the certificate' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={e => { e.preventDefault(); setFaqOpen(faqOpen === i ? null : i) }}>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left">{faq.q}</h3>
                  <span className="text-emerald-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="SSL Certificate Checker"
          toolSlug="ssl-checker"
          toolUrl="https://roughtools.com/tools/security/ssl-checker"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
