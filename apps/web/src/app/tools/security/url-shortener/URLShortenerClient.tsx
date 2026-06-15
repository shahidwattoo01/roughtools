'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'


interface ShortLinkResult {
  slug: string
  shortUrl: string
  originalUrl: string
  expiresAt: string | null
  createdAt: string
}

const FAQS = [
  {
    q: 'Is this URL shortener free to use?',
    a: 'Yes, the RoughTools URL Shortener is completely free with no account, subscription, or credit card required. You can shorten unlimited URLs, set custom slugs, and configure expiry dates at no cost. RoughTools is funded through non-intrusive advertising, keeping this and all other tools permanently free. There are no hidden limits on the number of links you can create or the number of redirects each link can serve.'
  },
  {
    q: 'Do I need to sign up or create an account to shorten a URL?',
    a: 'No account, email address, or registration is required to create a short link. Enter your long URL, optionally choose a custom slug and expiry period, and click Shorten. Your short link is created instantly. The only limitation of using the tool without an account is that you cannot manage, edit, or delete previously created links — link management features are available for registered users if that feature is enabled.'
  },
  {
    q: 'Is my URL data private — do you store the links I create?',
    a: 'Short links must be stored server-side so that redirects can function when someone clicks the link. The original URL and short slug are stored in our database to serve redirects. RoughTools does not sell this data, does not profile users based on URLs shortened, and does not display your URLs to other users. Link data may be deleted after expiry (if an expiry date was set) or after an extended period of inactivity. Do not shorten URLs that contain passwords, private tokens, or personal data in the URL structure.'
  },
  {
    q: 'Does the URL shortener work on mobile phones and tablets?',
    a: 'Yes, the URL Shortener is fully responsive and works on all modern mobile browsers. You can shorten URLs on mobile and share the resulting short link via messaging apps, social media, email, or QR code. The copy button is touch-friendly and works on iOS Safari and Android Chrome. Short links you create are immediately accessible — anyone clicking the link on any device is redirected to the original URL instantly.'
  },
  {
    q: 'Which browsers are supported by this URL shortener?',
    a: 'The URL Shortener works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave on both desktop and mobile. The tool requires JavaScript to be enabled for the form submission and clipboard copy functionality. The short links themselves work in any browser or application that can follow HTTP redirects — including email clients, messaging apps, and social media platforms.'
  },
  {
    q: 'How accurate and reliable are the short links?',
    a: 'Short links redirect reliably as long as the link has not expired and the server is operational. Redirects use HTTP 301 (permanent) or 302 (temporary) status codes, which are universally supported by all browsers, HTTP clients, and web crawlers. Link resolution is typically instantaneous — under 50 milliseconds. Links with custom slugs will return a 404 if the slug is already taken. If a link expires, visitors are shown an expiry notice rather than a broken redirect.'
  },
  {
    q: 'How do I create a short URL step by step?',
    a: 'To shorten a URL: (1) Paste your long URL into the "Long URL" field. (2) Optionally enter a Custom Slug — a memorable short identifier like "my-event" or "product-launch". Leave blank for an auto-generated slug. (3) Optionally set an expiry in days — the link will stop working after that period. (4) Click "Shorten URL". (5) Copy your new short link using the Copy button. (6) Share the link anywhere — it redirects to your original URL immediately when clicked.'
  },
  {
    q: 'Can I use a custom slug for my short link?',
    a: 'Yes, custom slugs allow you to create readable short links like "roughtools.com/go/my-event" instead of a random alphanumeric code. Custom slugs must be 2–32 characters and can contain letters, numbers, hyphens, and underscores. Slugs are case-insensitive. If your preferred slug is already taken, the tool will inform you and you can choose a different one. Custom slugs are ideal for marketing campaigns, event links, and shared resources where a memorable URL improves click-through rates.'
  },
  {
    q: 'Why should I use RoughTools URL Shortener instead of Bitly or TinyURL?',
    a: 'RoughTools URL Shortener is integrated with the rest of the RoughTools suite — you can shorten a URL and immediately generate a QR code for it using the QR Code Generator tool. Unlike Bitly, which limits features on its free tier and requires an account for custom slugs, RoughTools provides custom slugs and expiry dates without an account. There are no mandatory click analytics, no redirect interstitial pages, and no commercial tracking overlays added to your redirects.'
  },
  {
    q: 'How do I report a bug or suggest a new feature for the URL shortener?',
    a: 'To report a bug or request a feature — such as click analytics, QR code generation alongside the short link, bulk URL shortening, or password-protected links — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the URL you were trying to shorten, the browser and OS, and whether you were using a custom slug. Feature requests for link management dashboards and webhook callbacks on link access are reviewed regularly.'
  },
  {
    q: 'What happens to my short link when it expires?',
    a: 'When a short link reaches its expiry date (if one was set during creation), the redirect stops working. Visitors who click an expired link are shown an expiry notice page rather than being redirected to a broken or misleading destination. Links without an expiry date remain active indefinitely unless they are removed during maintenance. If you need a link to remain active permanently, leave the expiry field blank when creating the short URL.'
  },
  {
    q: 'Can I use shortened links on social media platforms?',
    a: 'Yes, short links created with RoughTools can be shared on Twitter, Instagram, LinkedIn, Facebook, WhatsApp, and any other platform. Social media platforms preview links using Open Graph metadata from the destination URL — the short link passes through this metadata on redirect. Some platforms (particularly Twitter/X) may expand short links to show the destination domain in the preview. Links to adult content, phishing sites, or malware will be removed if reported and violate the terms of service.'
  },
]

export default function URLShortener() {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ShortLinkResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  async function handleShorten(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    setCopied(false)
    setLoading(true)
    try {
      const res = await fetch(`/api/tools/url-shortener`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          ...(customSlug ? { customSlug } : {}),
          ...(expiresInDays ? { expiresInDays: parseInt(expiresInDays, 10) } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error?.message ?? 'Failed to shorten URL. Please check the URL and try again.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Could not reach the API server. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (!result) return
    navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  const CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400 dark:placeholder-gray-600'

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
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">URL Shortener</h1>
          <span className="ml-auto text-xs bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800 px-2 py-0.5 rounded-full">🔗 Custom Slugs · Expiry Dates</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-teal-900/50 border border-cyan-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Free URL Shortener with Custom Slugs</h2>
          <p className="text-cyan-300/70 text-sm">Shorten any URL instantly · Custom branded slugs · Set expiry dates · No account required · 100% free</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Instant Redirect', 'Custom Slug', 'Expiry Dates', 'No Account', 'Share Anywhere'].map(b => (
              <span key={b} className="text-xs bg-cyan-900/40 text-cyan-300 border border-cyan-700/50 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* Main form */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleShorten} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Long URL to Shorten</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className={CLS}
                placeholder="https://example.com/very/long/url/path?with=parameters"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Custom Slug <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={e => setCustomSlug(e.target.value)}
                  pattern="[a-zA-Z0-9_-]{2,32}"
                  className={CLS}
                  placeholder="my-link"
                />
                <p className="text-gray-700 text-xs mt-1">Letters, numbers, hyphens only</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Expires In <span className="text-gray-600 font-normal">(days, optional)</span>
                </label>
                <input
                  type="number"
                  value={expiresInDays}
                  onChange={e => setExpiresInDays(e.target.value)}
                  min={1}
                  max={3650}
                  className={CLS}
                  placeholder="30"
                />
                <p className="text-gray-700 text-xs mt-1">Leave blank for permanent link</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-400 text-sm">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Shortening…</>
                : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>Shorten URL</>
              }
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-2 p-5 bg-cyan-900/20 border border-cyan-700 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm font-medium">✅ Short link created</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Your short URL</p>
                <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400 break-all">{result.shortUrl}</p>
              </div>
              <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Original URL</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs break-all line-clamp-2">{result.originalUrl}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className={`flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors ${copied ? 'bg-green-700 text-green-100' : 'bg-cyan-700 hover:bg-cyan-600 text-white'}`}
                >
                  {copied ? '✓ Copied to Clipboard' : '📋 Copy Short Link'}
                </button>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Open ↗
                </a>
              </div>
              {result.expiresAt && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
                  Expires: {new Date(result.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: 'Instant Redirect', desc: 'Sub-50ms redirect — no interstitial pages or waiting' },
            { icon: '🔗', title: 'Custom Slugs', desc: 'Branded, memorable short links for campaigns and sharing' },
            { icon: '⏱️', title: 'Expiry Control', desc: 'Set links to expire automatically after any number of days' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Common Uses for URL Shortening</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: '📱', title: 'Social Media', desc: 'Character-limited posts on Twitter/X, Instagram bios, and LinkedIn' },
              { icon: '📊', title: 'Marketing Campaigns', desc: 'Trackable campaign links with branded slugs for campaigns' },
              { icon: '📄', title: 'Print Materials', desc: 'Short, typeable URLs for flyers, business cards, and signage' },
              { icon: '📷', title: 'QR Codes', desc: 'Shorter URLs create denser, more scannable QR codes' },
            ].map(u => (
              <div key={u.title} className="flex gap-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <span className="text-xl flex-shrink-0">{u.icon}</span>
                <div>
                  <div className="text-gray-900 dark:text-white text-sm font-semibold">{u.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{u.desc}</div>
                </div>
              </div>
            ))}
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
                  <span className="text-cyan-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="URL Shortener"
          toolSlug="url-shortener"
          toolUrl="https://roughtools.com/tools/security/url-shortener"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
