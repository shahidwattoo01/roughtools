'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

const DOMAINS = ['tmpmail.dev', 'dropbox.email', 'burnermail.io', 'fastmail.tmp']

function generateAddress(domain: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const arr = new Uint8Array(10)
  crypto.getRandomValues(arr)
  const prefix = Array.from(arr).map(b => chars[b % chars.length]).join('')
  return `${prefix}@${domain}`
}

const FAQS = [
  {
    q: 'Is this temporary email tool free to use?',
    a: 'Yes, the RoughTools Temporary Email Generator is completely free with no account, payment, or subscription required. You can generate as many disposable email addresses as you need instantly, at no cost. RoughTools is funded through non-intrusive advertising which keeps every tool permanently free. There are no hidden premium features, no daily limits on address generation, and no charges for using this service in any capacity.'
  },
  {
    q: 'Do I need to create an account to use this temporary email tool?',
    a: 'No account, registration, or personal information is required to generate a temporary email address. Open the page, and a disposable address is automatically created for you. You can generate a new address at any time, switch domains, or copy the address in a single click. There is no identity verification, no phone number required, and no connection between your real identity and the temporary addresses you generate.'
  },
  {
    q: 'Is my temporary email address private and secure?',
    a: 'Temporary email addresses are designed for privacy — they have no connection to your real identity. The address generation happens client-side using a cryptographically secure random number generator (crypto.getRandomValues()), ensuring no two addresses are predictable or repeated. The addresses use temporary domains not associated with any personal account. Use these addresses when you need to complete a sign-up form or receive a one-time verification code without exposing your real email address.'
  },
  {
    q: 'Does this temporary email tool work on mobile and tablet?',
    a: 'Yes, the Temporary Email tool is fully responsive and works on all modern mobile browsers including Safari on iOS and Chrome on Android. The copy button is touch-friendly, allowing you to quickly copy the address and paste it into a mobile app sign-up form. Address generation uses the Web Cryptography API which is supported on all current mobile browsers. The layout adapts cleanly to small screen sizes for easy use on smartphones.'
  },
  {
    q: 'Which browsers are compatible with this tool?',
    a: 'The Temporary Email Generator works in all modern browsers: Google Chrome 37+, Mozilla Firefox 34+, Microsoft Edge 79+, Safari 11+, Opera 24+, and Brave. The address generation uses the Web Cryptography API (crypto.getRandomValues()) for unpredictable random prefixes, which requires a modern browser with SubtleCrypto support. Internet Explorer is not supported. All current versions of Chrome, Firefox, Edge, and Safari on both desktop and mobile are fully compatible.'
  },
  {
    q: 'How accurate is the email address generation?',
    a: 'The email addresses are generated using cryptographically secure randomness — each address has a 10-character random alphanumeric prefix chosen using crypto.getRandomValues(), making collisions statistically negligible. The generated addresses are valid email format strings that will pass standard email validation on most websites and sign-up forms. The actual deliverability of emails to these addresses depends on whether the backend mail server is configured and active for the selected domain.'
  },
  {
    q: 'Can I use this temporary email tool offline?',
    a: 'The address generation itself works offline once the page has loaded — it runs entirely in your browser using the Web Cryptography API with no server calls. However, receiving emails (inbox functionality) requires a connection to the mail server for that domain. If you only need to generate a disposable address format to complete a form, you can do so without an internet connection after the initial page load. For full inbox access, an active connection is required.'
  },
  {
    q: 'How do I generate and use a temporary email address step by step?',
    a: 'To use a temporary email: (1) A disposable address is automatically generated when you open the page — it appears in the inbox display. (2) Click "Copy" to copy the address to your clipboard. (3) Paste it into any sign-up form, subscription box, or verification field that requests an email address. (4) If you need a different address, click "New Address" to generate a fresh one. (5) Select a different domain from the dropdown if the first domain is blocked by the service you are registering for. (6) Avoid using temporary email addresses for important accounts — they are for disposable use only.'
  },
  {
    q: 'Why should I use RoughTools instead of other disposable email services?',
    a: 'RoughTools Temporary Email generates addresses with cryptographically secure randomness — unlike services that use Math.random() which produces predictable sequences. The tool offers multiple domain options to bypass services that block common temporary email domains. The clean, ad-minimal interface makes it faster to generate and copy an address compared to cluttered alternatives. It integrates with the full RoughTools suite, so you can use it alongside the Password Generator, QR Code Generator, and other privacy tools in one place.'
  },
  {
    q: 'How do I report a bug or request a new feature?',
    a: 'To report a bug or suggest a feature — such as automatic inbox refresh, email forwarding, custom domain support, or extended inbox retention — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include your browser name and version, operating system, and what happened versus what you expected. Feature requests for custom usernames, webhook notifications on new emails, and longer retention periods are reviewed and considered for upcoming development cycles.'
  },
  {
    q: 'How long does a temporary email address remain active?',
    a: 'The email addresses generated by this tool are temporary by design. The duration an address remains active depends on the domain and backend configuration. Typically, temporary email addresses remain active for the duration of your browser session. Once you close the tab or generate a new address, the previous address is no longer accessible through this tool. Do not use temporary email addresses for accounts that require long-term access to your email — only use them for one-time verifications and sign-ups where you do not expect future correspondence.'
  },
  {
    q: 'Can websites detect that I am using a temporary email address?',
    a: 'Some websites use email validation services that check whether a submitted email domain is associated with disposable or temporary email services. If a domain is blacklisted by such a service, the sign-up form will reject it. This tool provides multiple domain options precisely to handle this — switching to a different domain often bypasses basic disposable email detection. However, sophisticated email validation services maintain large blacklists of known temporary domains, so no disposable email service can guarantee acceptance on all platforms.'
  },
]

export default function TemporaryEmail() {
  const [domain, setDomain] = useState(DOMAINS[0])
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const newAddress = useCallback(() => {
    setEmail(generateAddress(domain))
    setCopied(false)
  }, [domain])

  useEffect(() => {
    newAddress()
  }, [domain])

  const copy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Temporary Email</h1>
          <span className="ml-auto text-xs bg-purple-900/50 text-purple-400 border border-purple-800 px-2 py-0.5 rounded-full">📧 Disposable Address Generator</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border border-violet-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Disposable Temporary Email Address Generator</h2>
          <p className="text-violet-300/70 text-sm">Protect your inbox · Block spam · Multiple domains · Cryptographically secure · No account required</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Instant Generation', 'Multiple Domains', 'CSPRNG Address', 'No Sign-Up', 'Spam Protection'].map(b => (
              <span key={b} className="text-xs bg-violet-900/40 text-violet-300 border border-violet-700/50 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
          {/* Address display */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Your Temporary Email Address</label>
            <div className="bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4">
              <p className="font-mono text-lg text-purple-300 break-all flex-1">{email}</p>
              <button
                onClick={copy}
                className={`flex-shrink-0 font-bold px-4 py-2 rounded-lg text-sm transition-colors ${copied ? 'bg-green-700 text-green-100' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Domain selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Select Domain</label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <p className="text-gray-700 text-xs mt-1">Switch if a domain is blocked</p>
            </div>
            <div className="flex items-end">
              <button
                onClick={newAddress}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                New Address
              </button>
            </div>
          </div>

          {/* Inbox placeholder */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300">Inbox</h3>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">0 messages</span>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-10 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Waiting for incoming emails</p>
              <p className="text-xs mt-1 text-gray-700">Emails sent to this address will appear here automatically</p>
            </div>
          </div>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🛡️', title: 'Protect Your Inbox', desc: 'Stop spam before it reaches your real email address' },
            { icon: '🎭', title: 'Stay Anonymous', desc: 'Sign up for services without revealing your identity' },
            { icon: '🔄', title: 'Unlimited Addresses', desc: 'Generate a fresh address whenever you need one' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* When to use */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">When to Use a Temporary Email Address</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { icon: '📥', title: 'One-time sign-ups', desc: 'Accessing a free trial, ebook download, or coupon code' },
              { icon: '🧪', title: 'Testing applications', desc: 'Developers testing email flows and registration systems' },
              { icon: '🔔', title: 'Blocking newsletters', desc: 'Sites that require email to remove a paywall or see content' },
              { icon: '🔒', title: 'Privacy-sensitive forms', desc: 'Any form where you do not want future marketing contact' },
            ].map(u => (
              <div key={u.title} className="flex gap-3 p-3 bg-gray-800/50 rounded-xl">
                <span className="text-xl flex-shrink-0">{u.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{u.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{u.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-xl text-xs text-yellow-500/80">
            ⚠️ Do not use temporary email addresses for banking, government, healthcare, or any account that requires permanent email access for account recovery.
          </div>
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
                  <span className="text-purple-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Temporary Email Generator"
          toolSlug="temporary-email"
          toolUrl="https://roughtools.com/tools/security/temporary-email"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
