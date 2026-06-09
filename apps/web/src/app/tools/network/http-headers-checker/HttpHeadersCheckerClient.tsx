'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ──────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'left', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '8px 12px', fontSize: 12, color: 'var(--fg-2)', verticalAlign: 'top' }

// ─── Security header definitions ──────────────────────────────────────────────
interface SecHeaderDef {
  key: string
  label: string
  weight: number
  description: string
  howToAdd: string
}

const SECURITY_HEADERS: SecHeaderDef[] = [
  {
    key: 'strict-transport-security',
    label: 'Strict-Transport-Security',
    weight: 20,
    description: 'Forces browsers to use HTTPS for future requests, preventing protocol downgrade attacks and cookie hijacking.',
    howToAdd: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'content-security-policy',
    label: 'Content-Security-Policy',
    weight: 25,
    description: 'Prevents XSS attacks by specifying which content sources are trusted. One of the most impactful security headers.',
    howToAdd: "Add: Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
  },
  {
    key: 'x-frame-options',
    label: 'X-Frame-Options',
    weight: 15,
    description: 'Prevents your page from being embedded in iframes on other sites, stopping clickjacking attacks.',
    howToAdd: 'Add: X-Frame-Options: SAMEORIGIN',
  },
  {
    key: 'x-content-type-options',
    label: 'X-Content-Type-Options',
    weight: 10,
    description: 'Prevents browsers from MIME-sniffing a response away from the declared content-type.',
    howToAdd: 'Add: X-Content-Type-Options: nosniff',
  },
  {
    key: 'referrer-policy',
    label: 'Referrer-Policy',
    weight: 10,
    description: 'Controls how much referrer information is included with requests, protecting user privacy.',
    howToAdd: 'Add: Referrer-Policy: strict-origin-when-cross-origin',
  },
  {
    key: 'permissions-policy',
    label: 'Permissions-Policy',
    weight: 20,
    description: 'Controls which browser APIs and features can be used on your page (camera, microphone, geolocation, etc.).',
    howToAdd: "Add: Permissions-Policy: camera=(), microphone=(), geolocation=()",
  },
]

const PERFORMANCE_HEADERS = ['cache-control', 'etag', 'vary', 'content-encoding']
const PERF_LABELS: Record<string, string> = {
  'cache-control': 'Cache-Control',
  'etag': 'ETag',
  'vary': 'Vary',
  'content-encoding': 'Content-Encoding',
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CheckResult {
  headers: Record<string, string>
  statusCode: number
  responseTime: number
  url: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getStatusColor(code: number): string {
  if (code >= 200 && code < 300) return '#10b981'
  if (code >= 300 && code < 400) return '#f59e0b'
  if (code >= 400) return '#ef4444'
  return '#888'
}

function MetricBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HttpHeadersCheckerClient() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function check() {
    let target = url.trim()
    if (!target) return
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target
    setLoading(true)
    setResult(null)
    setError('')
    const t0 = performance.now()

    try {
      // Use allorigins.win as CORS proxy to fetch headers
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`
      const res = await fetch(proxyUrl)
      if (!res.ok) throw new Error(`Proxy error ${res.status}`)
      const data = await res.json()
      const elapsed = Math.round(performance.now() - t0)

      // Build header map from what allorigins returns + proxy response headers
      const headers: Record<string, string> = {}
      if (data.status?.content_type) headers['content-type'] = data.status.content_type
      if (data.status?.content_length != null) headers['content-length'] = String(data.status.content_length)

      res.headers.forEach((v, k) => {
        const lk = k.toLowerCase()
        // Filter out allorigins-specific noise
        if (!['access-control-allow-origin', 'access-control-allow-credentials'].includes(lk)) {
          headers[lk] = v
        }
      })

      // Simulate common security header absence realistically (they're stripped by proxy)
      // Mark that headers come via proxy
      headers['x-fetched-via'] = 'allorigins.win CORS proxy — security headers may be stripped'

      setResult({
        headers,
        statusCode: data.status?.http_code ?? 200,
        responseTime: data.status?.response_time ?? elapsed,
        url: target,
      })
    } catch (e) {
      setError('Could not fetch headers. The site may block external requests or the URL is invalid. Try adding https:// if not present.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Score calculation ─────────────────────────────────────────────────────
  const secScore = useMemo(() => {
    if (!result) return 0
    return SECURITY_HEADERS.reduce((acc, h) => acc + (result.headers[h.key] ? h.weight : 0), 0)
  }, [result])

  const scoreColor = secScore >= 80 ? '#10b981' : secScore >= 50 ? '#f59e0b' : '#ef4444'
  const scoreLabel = secScore >= 80 ? 'Good' : secScore >= 50 ? 'Needs Improvement' : 'Poor'

  // ─── Categorize headers ────────────────────────────────────────────────────
  function getHeaderColor(key: string): string {
    if (SECURITY_HEADERS.some(h => h.key === key)) return '#a78bfa'
    if (PERFORMANCE_HEADERS.includes(key)) return '#34d399'
    return 'var(--fg-2)'
  }

  const sortedHeaders = result
    ? Object.entries(result.headers).sort(([a], [b]) => {
        const aIsSec = SECURITY_HEADERS.some(h => h.key === a) ? 0 : PERFORMANCE_HEADERS.includes(a) ? 1 : 2
        const bIsSec = SECURITY_HEADERS.some(h => h.key === b) ? 0 : PERFORMANCE_HEADERS.includes(b) ? 1 : 2
        return aIsSec - bIsSec || a.localeCompare(b)
      })
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUT */}
      <div style={CARD}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          Inspect HTTP response headers for any URL. Security headers are analyzed and scored.
          Note: results are fetched via a CORS proxy — some security headers may appear missing because they are stripped by the proxy layer.
        </p>
        <label style={LABEL}>URL to check</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            style={INPUT_BOX}
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            aria-label="URL to check"
          />
          <button
            onClick={check}
            disabled={loading || !url.trim()}
            style={{ ...BTN_GHOST, padding: '10px 22px', opacity: loading || !url.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Checking…' : 'Check Headers'}
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, flexWrap: 'wrap' }}>
          <span><span style={{ color: '#a78bfa', fontWeight: 700 }}>Purple</span> = Security headers</span>
          <span><span style={{ color: '#34d399', fontWeight: 700 }}>Green</span> = Performance headers</span>
          <span><span style={{ color: 'var(--fg-2)', fontWeight: 700 }}>White</span> = Other headers</span>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {result && (
        <>
          {/* Summary metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricBadge label="Status Code" value={String(result.statusCode)} color={getStatusColor(result.statusCode)} />
            <MetricBadge label="Response Time" value={`${result.responseTime}ms`} color={result.responseTime < 200 ? '#10b981' : result.responseTime < 500 ? '#f59e0b' : '#ef4444'} />
            <MetricBadge label="Total Headers" value={String(Object.keys(result.headers).length)} color="#6366f1" />
            <MetricBadge label="Security Score" value={`${secScore}/100`} color={scoreColor} />
          </div>

          {/* Security score bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Security Score
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor }}>{secScore}/100 — {scoreLabel}</span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${secScore}%`, background: scoreColor, borderRadius: 5, transition: 'width 0.5s' }} />
            </div>
          </div>

          {/* All Headers table */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              All Response Headers
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Response headers">
                <thead>
                  <tr>
                    <th style={{ ...TH, width: '35%' }}>Header Name</th>
                    <th style={{ ...TH }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHeaders.map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, color: getHeaderColor(key), fontFamily: 'monospace', fontWeight: 600, whiteSpace: 'nowrap' }}>{key}</td>
                      <td style={{ ...TD, fontFamily: 'monospace', wordBreak: 'break-all' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Header Audit */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Security Header Audit
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SECURITY_HEADERS.map(h => {
                const present = !!result.headers[h.key]
                return (
                  <div key={h.key} style={{
                    padding: '12px 16px', borderRadius: 10,
                    background: present ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${present ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: present ? 0 : 6 }}>
                      <span style={{ fontSize: 16, lineHeight: 1 }}>{present ? '✅' : '❌'}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: present ? '#34d399' : '#f87171', fontFamily: 'monospace' }}>
                        {h.label}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-3)', fontWeight: 600 }}>
                        +{h.weight} pts
                      </span>
                    </div>
                    {!present && (
                      <>
                        <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>{h.description}</p>
                        <code style={{ display: 'block', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: 6, fontSize: 11, color: '#c4b5fd', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {h.howToAdd}
                        </code>
                      </>
                    )}
                    {present && (
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {result.headers[h.key]}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance Headers */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Performance Headers
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {PERFORMANCE_HEADERS.map(key => {
                const present = !!result.headers[key]
                return (
                  <div key={key} style={{
                    padding: '10px 14px', borderRadius: 8,
                    background: present ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${present ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span>{present ? '✅' : '⬜'}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: present ? '#34d399' : 'var(--fg-3)', fontFamily: 'monospace' }}>
                        {PERF_LABELS[key]}
                      </span>
                    </div>
                    {present && (
                      <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {result.headers[key]}
                      </div>
                    )}
                    {!present && <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>Not set</div>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Guidance */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              About HTTP Headers
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>Security headers are free to add and can prevent a large class of web attacks including XSS, clickjacking, and MIME-sniffing.</li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>Results fetched via CORS proxy may show fewer security headers than are actually served — test with curl or browser DevTools for authoritative results.</li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>Use <code style={{ color: '#c4b5fd' }}>curl -I https://example.com</code> from terminal for a direct header inspection without any proxy.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
