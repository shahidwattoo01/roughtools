'use client'
import { useState, useRef } from 'react'
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

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PingResult {
  attempt: number
  ms: number | null
  status: 'pending' | 'success' | 'timeout'
}

interface PingSession {
  host: string
  results: PingResult[]
  timestamp: string
}

// ─── Latency helpers ───────────────────────────────────────────────────────────
function latencyColor(ms: number): string {
  if (ms < 50) return '#10b981'
  if (ms < 100) return '#34d399'
  if (ms < 200) return '#f59e0b'
  return '#ef4444'
}

function latencyLabel(ms: number): string {
  if (ms < 50) return 'Excellent'
  if (ms < 100) return 'Good'
  if (ms < 200) return 'Acceptable'
  return 'Poor'
}

async function singlePing(url: string, timeoutMs = 8000): Promise<number | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const t0 = performance.now()
  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal, cache: 'no-store' })
    clearTimeout(timer)
    return Math.round(performance.now() - t0)
  } catch {
    clearTimeout(timer)
    return null
  }
}

function MetricCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{ padding: '16px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PingToolClient() {
  const [host, setHost] = useState('')
  const [count, setCount] = useState(4)
  const [results, setResults] = useState<PingResult[]>([])
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<PingSession[]>([])
  const abortRef = useRef(false)

  async function startPing() {
    let target = host.trim()
    if (!target || running) return
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target
    abortRef.current = false
    setRunning(true)

    const initial: PingResult[] = Array.from({ length: count }, (_, i) => ({ attempt: i + 1, ms: null, status: 'pending' }))
    setResults(initial)

    const sessionResults: PingResult[] = []
    for (let i = 0; i < count; i++) {
      if (abortRef.current) break
      const ms = await singlePing(target)
      const r: PingResult = { attempt: i + 1, ms, status: ms !== null ? 'success' : 'timeout' }
      sessionResults.push(r)
      setResults(prev => prev.map(p => p.attempt === i + 1 ? r : p))
      // Small delay between pings
      if (i < count - 1) await new Promise(res => setTimeout(res, 300))
    }

    setHistory(prev => [{
      host: target,
      results: sessionResults,
      timestamp: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 10))
    setRunning(false)
  }

  function stopPing() {
    abortRef.current = true
    setRunning(false)
  }

  const completed = results.filter(r => r.status !== 'pending')
  const successful = results.filter(r => r.status === 'success' && r.ms !== null)
  const times = successful.map(r => r.ms as number)
  const avgMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null
  const minMs = times.length ? Math.min(...times) : null
  const maxMs = times.length ? Math.max(...times) : null
  const lossCount = completed.filter(r => r.status === 'timeout').length
  const lossPct = completed.length ? Math.round((lossCount / completed.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUT */}
      <div style={CARD}>
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 13, color: '#a5b4fc', marginBottom: 16 }}>
          Browser ping uses HTTP HEAD requests — not ICMP. Results reflect HTTP latency from your network to the server.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={LABEL}>Hostname or URL</label>
            <input
              style={INPUT_BOX}
              type="text"
              placeholder="google.com or https://api.example.com"
              value={host}
              onChange={e => setHost(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !running && startPing()}
              disabled={running}
              aria-label="Hostname or URL"
            />
          </div>
          <div>
            <label style={LABEL}>Count (1–20)</label>
            <input
              style={INPUT_BOX}
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={e => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 4)))}
              disabled={running}
              aria-label="Ping count"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={startPing}
            disabled={running || !host.trim()}
            style={{ ...BTN_GHOST, background: '#6366f1', border: 'none', color: '#fff', padding: '10px 22px', opacity: running || !host.trim() ? 0.5 : 1 }}
          >
            {running ? 'Pinging…' : `Ping ×${count}`}
          </button>
          {running && (
            <button onClick={stopPing} style={{ ...BTN_GHOST }}>
              Stop
            </button>
          )}
        </div>
      </div>

      {/* LIVE RESULTS */}
      {results.length > 0 && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Pinging {host}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {results.map(r => (
              <div key={r.attempt} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--fg-3)', minWidth: 60, fontWeight: 600 }}>
                  #{r.attempt}
                </span>
                {r.status === 'pending' && (
                  <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>Sending…</span>
                )}
                {r.status === 'success' && r.ms !== null && (
                  <>
                    <span style={{ fontSize: 18, fontWeight: 900, color: latencyColor(r.ms), minWidth: 70 }}>
                      {r.ms}ms
                    </span>
                    <span style={{ fontSize: 11, color: latencyColor(r.ms) }}>{latencyLabel(r.ms)}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        background: latencyColor(r.ms),
                        width: `${Math.min(100, (r.ms / 500) * 100)}%`,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </>
                )}
                {r.status === 'timeout' && (
                  <span style={{ fontSize: 13, color: '#ef4444' }}>Request timed out</span>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          {!running && times.length > 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 14 }}>
                <MetricCard label="Min" value={`${minMs}ms`} color={latencyColor(minMs!)} />
                <MetricCard label="Avg" value={`${avgMs}ms`} color={latencyColor(avgMs!)} sub={latencyLabel(avgMs!)} />
                <MetricCard label="Max" value={`${maxMs}ms`} color={latencyColor(maxMs!)} />
                <MetricCard label="Packet Loss" value={`${lossPct}%`} color={lossPct === 0 ? '#10b981' : lossPct < 25 ? '#f59e0b' : '#ef4444'} sub={`${lossCount}/${completed.length} lost`} />
              </div>

              {lossPct > 0 && (
                <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#f87171' }}>
                  Packet loss detected. The host may be throttling HEAD requests, behind a CDN that blocks them, or intermittently unavailable.
                </div>
              )}
            </>
          )}
          {!running && times.length === 0 && completed.length > 0 && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#f87171' }}>
              All requests timed out. Possible causes: host is unreachable, blocks HEAD method, has strict CORS, or your network is blocking the request.
            </div>
          )}
        </div>
      )}

      {/* LATENCY GUIDE */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Latency Classification
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {[
            { label: 'Excellent', range: '< 50ms', color: '#10b981', desc: 'Local or nearby CDN edge' },
            { label: 'Good', range: '50–100ms', color: '#34d399', desc: 'Same continent servers' },
            { label: 'Acceptable', range: '100–200ms', color: '#f59e0b', desc: 'Cross-continent connections' },
            { label: 'Poor', range: '> 200ms', color: '#ef4444', desc: 'Distant or congested servers' },
          ].map(({ label, range, color, desc }) => (
            <div key={label} style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, borderLeft: `3px solid ${color}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{range}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SESSION HISTORY */}
      {history.length > 0 && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Session History (last {history.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((s, i) => {
              const okTimes = s.results.filter(r => r.ms !== null).map(r => r.ms as number)
              const sessionAvg = okTimes.length ? Math.round(okTimes.reduce((a, b) => a + b, 0) / okTimes.length) : null
              const sessionLoss = Math.round(((s.results.length - okTimes.length) / s.results.length) * 100)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--fg-3)', minWidth: 50 }}>{s.timestamp}</span>
                  <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.host}</span>
                  {sessionAvg !== null && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: latencyColor(sessionAvg) }}>{sessionAvg}ms avg</span>
                  )}
                  <span style={{ fontSize: 12, color: sessionLoss > 0 ? '#ef4444' : '#10b981' }}>
                    {sessionLoss}% loss
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TROUBLESHOOTING */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Troubleshooting Guide
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>All timeouts:</strong> Many servers block HEAD requests for security or performance. Try the full URL with protocol (https://). Some CDNs filter non-GET requests.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>Very high latency:</strong> Could indicate geographically distant server, congested network, or server under load. Compare with a known-fast host like https://google.com.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>Inconsistent results:</strong> Variable latency (jitter) is normal for cross-continent connections. High variance can indicate network instability or load balancer routing changes.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>For true ICMP ping:</strong> Use <code style={{ color: '#c4b5fd' }}>ping hostname</code> from your terminal — browsers cannot send ICMP packets.
          </li>
        </ul>
      </div>
    </div>
  )
}
