'use client'
import { useState, useEffect } from 'react'

interface NavTiming {
  ttfb: number
  domContentLoaded: number
  totalLoad: number
  dnsLookup: number
  tcpConnect: number
  serverResponse: number
}

interface SpeedService {
  name: string
  description: string
  color: string
  icon: string
  url: (u: string) => string
}

const SPEED_SERVICES: SpeedService[] = [
  {
    name: 'Google PageSpeed Insights',
    description: 'Lighthouse audit + Core Web Vitals from real Chrome users',
    color: '#6366f1',
    icon: 'G',
    url: (u) => `https://pagespeed.web.dev/report?url=${encodeURIComponent(u)}`,
  },
  {
    name: 'GTmetrix',
    description: 'Detailed waterfall chart and performance recommendations',
    color: '#22c55e',
    icon: 'GT',
    url: (u) => `https://gtmetrix.com/?url=${encodeURIComponent(u)}`,
  },
  {
    name: 'WebPageTest',
    description: 'Advanced testing with multiple locations and connection types',
    color: '#f59e0b',
    icon: 'WP',
    url: (u) => `https://www.webpagetest.org/?url=${encodeURIComponent(u)}`,
  },
  {
    name: 'Pingdom Speed Test',
    description: 'Quick performance grade and HTTP request waterfall',
    color: '#a78bfa',
    icon: 'P',
    url: (u) => `https://tools.pingdom.com/#${encodeURIComponent(u)}`,
  },
]

const cardStyle: React.CSSProperties = {
  background: '#1a1a2e',
  borderRadius: 12,
  padding: 24,
  border: '1px solid rgba(255,255,255,0.07)',
}

function getScoreColor(ms: number, thresholds: [number, number]) {
  if (ms <= thresholds[0]) return '#22c55e'
  if (ms <= thresholds[1]) return '#f59e0b'
  return '#ef4444'
}

function MetricCard({ label, value, unit, thresholds, hint }: { label: string; value: number; unit: string; thresholds: [number, number]; hint: string }) {
  const color = getScoreColor(value, thresholds)
  const rating = value <= thresholds[0] ? 'Good' : value <= thresholds[1] ? 'Needs Improvement' : 'Poor'
  return (
    <div style={{ padding: 16, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}30` }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color, marginBottom: 2 }}>{value}<span style={{ fontSize: 14, fontWeight: 600, marginLeft: 3 }}>{unit}</span></div>
      <div style={{ fontSize: 12, color, marginBottom: 6 }}>{rating}</div>
      <div style={{ fontSize: 11, color: '#555' }}>{hint}</div>
    </div>
  )
}

export default function WebsiteSpeedTestClient() {
  const [timing, setTiming] = useState<NavTiming | null>(null)
  const [url, setUrl] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [measured, setMeasured] = useState(false)

  function measureCurrentPage() {
    if (typeof window === 'undefined') return
    const entries = performance.getEntriesByType('navigation')
    if (entries.length > 0) {
      const nav = entries[0] as PerformanceNavigationTiming
      setTiming({
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        totalLoad: Math.round(nav.loadEventEnd - nav.startTime),
        dnsLookup: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tcpConnect: Math.round(nav.connectEnd - nav.connectStart),
        serverResponse: Math.round(nav.responseEnd - nav.responseStart),
      })
      setMeasured(true)
    }
  }

  useEffect(() => {
    // Auto-measure on mount if timing data is available
    if (typeof window !== 'undefined' && performance.getEntriesByType('navigation').length > 0) {
      measureCurrentPage()
    }
  }, [])

  function handleSubmit() {
    let u = url.trim()
    if (!u) return
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u
    setSubmitted(u)
  }

  return (
    <div>
      {/* Current page metrics */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e0e0ff', margin: 0 }}>Current Page Metrics</h2>
            <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>Navigation Timing API — real measurements for this page load</p>
          </div>
          <button
            onClick={measureCurrentPage}
            style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: 'none', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}
          >
            Refresh Metrics
          </button>
        </div>

        {timing ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            <MetricCard label="TTFB" value={timing.ttfb} unit="ms" thresholds={[200, 500]} hint="Time to First Byte" />
            <MetricCard label="DOM Loaded" value={timing.domContentLoaded} unit="ms" thresholds={[500, 1500]} hint="HTML fully parsed" />
            <MetricCard label="Page Load" value={timing.totalLoad} unit="ms" thresholds={[1000, 3000]} hint="All resources loaded" />
            <MetricCard label="DNS Lookup" value={timing.dnsLookup} unit="ms" thresholds={[50, 150]} hint="Domain resolution time" />
            <MetricCard label="TCP Connect" value={timing.tcpConnect} unit="ms" thresholds={[50, 150]} hint="Connection setup time" />
            <MetricCard label="Server Response" value={timing.serverResponse} unit="ms" thresholds={[100, 300]} hint="Body download time" />
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: 14 }}>
            {measured ? 'Timing data not available for this page.' : 'Loading timing data…'}
          </div>
        )}
      </div>

      {/* External URL speed test launcher */}
      <div style={{ ...cardStyle, marginTop: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e0e0ff', marginBottom: 6 }}>Test Any Website&apos;s Speed</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>Enter a URL to launch it in top speed testing services — each opens pre-filled with your URL.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: '#252540', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0ff', fontSize: 14, outline: 'none', minWidth: 0 }}
            type="text"
            placeholder="https://yoursite.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          />
          <button
            onClick={handleSubmit}
            style={{ padding: '10px 22px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none', background: '#6366f1', color: '#fff', whiteSpace: 'nowrap' }}
          >
            Analyze
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {SPEED_SERVICES.map(svc => {
            const href = submitted ? svc.url(submitted) : undefined
            return (
              <a
                key={svc.name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${submitted ? svc.color + '40' : 'rgba(255,255,255,0.07)'}`,
                  textDecoration: 'none',
                  cursor: submitted ? 'pointer' : 'default',
                  opacity: submitted ? 1 : 0.5,
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${svc.color}20`, border: `1px solid ${svc.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: svc.color, flexShrink: 0 }}>
                  {svc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e0e0ff', marginBottom: 2 }}>{svc.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{svc.description}</div>
                </div>
                <div style={{ fontSize: 16, color: svc.color }}>{submitted ? '→' : '—'}</div>
              </a>
            )
          })}
        </div>
        {!submitted && (
          <p style={{ fontSize: 13, color: '#555', marginTop: 14, textAlign: 'center' }}>Enter a URL above to enable the speed testing services</p>
        )}
      </div>

      {/* Quick tips */}
      <div style={{ ...cardStyle, marginTop: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e0e0ff', marginBottom: 14 }}>Quick Performance Tips</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { title: 'Optimize images', tip: 'Use WebP/AVIF format, lazy load below-fold images, and serve correctly sized images for each viewport.' },
            { title: 'Enable compression', tip: 'Gzip or Brotli compress text assets (HTML, CSS, JS). Most CDNs and servers do this automatically when configured.' },
            { title: 'Leverage browser caching', tip: 'Set long Cache-Control max-age for static assets and use content-addressed filenames (e.g. main.abc123.js) for cache busting.' },
            { title: 'Minimize render-blocking resources', tip: 'Load non-critical CSS asynchronously and defer or async JavaScript that isn\'t needed for initial render.' },
          ].map(({ title, tip }) => (
            <div key={title} style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
