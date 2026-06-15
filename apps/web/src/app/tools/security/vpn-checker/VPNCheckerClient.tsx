'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'


interface IpResult {
  ip: string
  city?: string
  region?: string
  country?: string
  org?: string
  hostname?: string
  isVpn?: boolean
  isProxy?: boolean
  isTor?: boolean
}

const FAQS = [
  {
    q: 'Is this VPN checker tool completely free to use?',
    a: 'Yes, the RoughTools VPN & Proxy Checker is completely free with no account, sign-up, or payment required. You can check your IP status as many times as needed — after switching servers, changing networks, or at any point you want to verify your privacy. RoughTools is funded through non-intrusive advertising, which keeps all tools permanently free. There is no premium tier for faster checks or additional detection features.'
  },
  {
    q: 'Do I need to create an account to check my IP address?',
    a: 'No account, email address, or personal information is required to use the VPN Checker. Simply open the page and click "Check My IP Status." Your IP address, location, ISP, and VPN/proxy detection results are displayed instantly. There is no registration wall, no captcha, and no usage limit. Each check is independent — no history of your IP lookups is stored by RoughTools.'
  },
  {
    q: 'Does this tool store or log my IP address?',
    a: 'RoughTools does not log, store, or share your IP address in any identifiable way. The check is performed by querying a third-party IP intelligence service on your behalf, and the result is displayed in your browser. Standard server logs (which all web servers maintain) may record your IP as part of the HTTP request, but these are not associated with your IP lookup results, are not sold, and are not retained for profiling purposes. Privacy is the primary purpose of this tool.'
  },
  {
    q: 'Does this VPN checker work on mobile and tablet browsers?',
    a: 'Yes, the VPN Checker is fully responsive and works on all mobile browsers including Safari on iOS and Chrome on Android. The IP detection and VPN/proxy analysis works identically on mobile devices. This is particularly useful for verifying whether your mobile VPN app is correctly routing all traffic — including mobile browser traffic — through the VPN tunnel. Run the check with your VPN off and then on to compare results.'
  },
  {
    q: 'Which browsers are supported by this tool?',
    a: 'The VPN Checker works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. Both desktop and mobile versions are fully supported. The tool makes a simple API request to retrieve your connection details, which requires no special browser features beyond standard fetch support. For accuracy in detecting WebRTC IP leaks (a separate privacy concern), use a browser with WebRTC enabled — Chrome and Firefox are recommended for the most thorough detection.'
  },
  {
    q: 'How accurate is the VPN and proxy detection?',
    a: 'The detection accuracy depends on the IP intelligence database used. Commercial VPN services with dedicated IP pools are generally detected accurately. However, some VPN providers rotate IPs through residential proxy networks specifically to evade detection, making them harder to flag. Corporate VPNs and university networks are often detected as organizational proxies. The tool is reliable for checking major consumer VPN services and known datacenter proxies, but no IP detection service achieves 100% accuracy across all providers and configurations.'
  },
  {
    q: 'How do I use the VPN Checker step by step?',
    a: 'To check your VPN status: (1) Connect or disconnect your VPN as desired before running the check. (2) Open this page and click "Check My IP Status." (3) Wait 2–3 seconds for the IP lookup to complete. (4) Review your public IP address, geographic location, and ISP. (5) Check the detection verdict at the bottom — it indicates whether a VPN, proxy, or Tor exit node is detected. For a leak test, run once with VPN off to see your real IP, then connect your VPN and run again to confirm the new IP appears.'
  },
  {
    q: 'Can this tool detect if my VPN is leaking my real IP address?',
    a: 'The tool detects your publicly visible IP address, which tells you whether your VPN is successfully masking your real IP. If the IP shown matches your home ISP after connecting a VPN, your VPN has a routing failure or kill switch issue. However, WebRTC leaks (where your real IP leaks through browser WebRTC connections even with a VPN active) require a separate test. DNS leaks — where DNS queries bypass the VPN tunnel — are also a separate detection scenario. This tool is best used for basic VPN connectivity verification and IP location confirmation.'
  },
  {
    q: 'Why should I use RoughTools VPN Checker instead of similar sites?',
    a: 'RoughTools VPN Checker provides IP address, geolocation, ISP/organization, hostname, and VPN/proxy/Tor detection in a clean, ad-minimal interface without requiring JavaScript to be disabled or privacy extensions to be active. Unlike some IP-check sites that run aggressive fingerprinting scripts, RoughTools is designed with privacy in mind. The results include all fields relevant to assessing your VPN effectiveness — location, organization, and detection verdict — without the clutter of unrelated marketing content.'
  },
  {
    q: 'How do I report a bug or request a new detection feature?',
    a: 'To report a bug or suggest a detection improvement — such as WebRTC leak detection, DNS leak testing, or IPv6 leak detection — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include your browser version, operating system, VPN provider name (if comfortable sharing), and what the tool displayed versus what you expected. Feature requests for additional privacy diagnostics are welcomed and reviewed regularly by the development team.'
  },
  {
    q: 'What is the difference between a VPN, proxy, and Tor — how does this tool detect each?',
    a: 'A VPN routes all your device traffic through an encrypted tunnel, replacing your IP with the VPN server IP. A proxy routes only specific traffic (often browser-only) through an intermediary server. Tor routes traffic through multiple volunteer relay nodes for high anonymity, making the exit node IP visible. This tool detects each by cross-referencing your IP against commercial and community-maintained databases of known VPN datacenter IP ranges, proxy service IPs, and published Tor exit node lists. Detection is based on IP reputation, not traffic analysis.'
  },
]

export default function VPNChecker() {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<IpResult | null>(null)
  const [error, setError] = useState('')
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  async function checkIP() {
    setChecking(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch(`/api/tools/ip-checker`)
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to check IP')
      } else {
        setResult(json)
      }
    } catch {
      setError('Could not reach the API server. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const location = result
    ? [result.city, result.region, result.country].filter(Boolean).join(', ') || 'Unknown'
    : ''

  const _isFlagged = result && (result.isVpn || result.isProxy || result.isTor)

  const verdict = result
    ? result.isTor ? { icon: '🧅', label: 'Tor Exit Node Detected', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700' }
      : result.isVpn ? { icon: '🛡️', label: 'VPN Detected', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700' }
      : result.isProxy ? { icon: '⚠️', label: 'Proxy Detected', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700' }
      : { icon: '✅', label: 'No VPN / Proxy Detected — Real IP', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700' }
    : null

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
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">VPN & Proxy Checker</h1>
          <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800 px-2 py-0.5 rounded-full">🛡️ IP Leak Detection</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 border border-blue-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">VPN, Proxy & IP Leak Checker</h2>
          <p className="text-blue-300/70 text-sm">See your real public IP · Detect VPN, proxy & Tor · Check location & ISP · Verify your privacy instantly</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['IP Address', 'Geolocation', 'ISP Detection', 'VPN Detection', 'Tor Detection', 'Proxy Detection'].map(b => (
              <span key={b} className="text-xs bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
          <div className="text-center">
            <button
              onClick={checkIP}
              disabled={checking}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold px-10 py-4 rounded-xl transition-colors text-base flex items-center gap-2 mx-auto"
            >
              {checking
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Analyzing Connection…</>
                : <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>Check My IP Status</>
              }
            </button>
            <p className="text-gray-600 text-xs mt-2">Results appear below — takes 1–3 seconds</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-400 text-sm text-center">
              ❌ {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              {/* Verdict */}
              {verdict && (
                <div className={`p-4 rounded-xl border text-center font-bold text-base ${verdict.bg} ${verdict.border} ${verdict.color}`}>
                  {verdict.icon} {verdict.label}
                </div>
              )}

              {/* Details grid */}
              <div className="grid gap-2">
                {[
                  { label: 'Public IP Address', value: result.ip, mono: true },
                  { label: 'Location', value: location },
                  { label: 'ISP / Organisation', value: result.org ?? 'Unknown' },
                  ...(result.hostname ? [{ label: 'Hostname', value: result.hostname }] : []),
                  { label: 'VPN Detected', value: result.isVpn ? 'Yes' : 'No', highlight: result.isVpn },
                  { label: 'Proxy Detected', value: result.isProxy ? 'Yes' : 'No', highlight: result.isProxy },
                  { label: 'Tor Exit Node', value: result.isTor ? 'Yes' : 'No', highlight: result.isTor },
                ].map(({ label, value, mono, highlight }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{label}</span>
                    <span className={`text-sm font-medium ${mono ? 'font-mono text-gray-900 dark:text-white' : highlight ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={checkIP} className="w-full border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                ↻ Run Check Again
              </button>
            </div>
          )}
        </div>

        {/* Trust / info cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🌐', title: 'Real IP Detection', desc: 'See the exact IP address websites and servers see when you connect' },
            { icon: '🛡️', title: 'VPN Verification', desc: 'Confirm your VPN is routing traffic correctly and masking your real IP' },
            { icon: '📍', title: 'Location Check', desc: 'Verify what country and city appears when browsing the internet' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Usage guide */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">How to Use the VPN Checker</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Verify your VPN is working</h3>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>Disconnect your VPN and run a check — note your real IP</li>
                <li>Connect your VPN to a server in another country</li>
                <li>Run the check again — the IP should change</li>
                <li>Confirm the location matches your VPN server country</li>
              </ol>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-2">What the results mean</h3>
              <ul className="space-y-1.5">
                <li><span className="text-green-400 font-medium">✅ No VPN Detected</span> — your real IP is visible to websites</li>
                <li><span className="text-blue-400 font-medium">🛡️ VPN Detected</span> — VPN is active and routing traffic</li>
                <li><span className="text-yellow-400 font-medium">⚠️ Proxy Detected</span> — a proxy server is routing traffic</li>
                <li><span className="text-orange-400 font-medium">🧅 Tor Detected</span> — connecting via Tor exit node</li>
              </ul>
            </div>
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
                  <span className="text-blue-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="VPN Checker"
          toolSlug="vpn-checker"
          toolUrl="https://roughtools.com/tools/security/vpn-checker"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
