'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

interface IpInfo {
  ip: string
  version: 'IPv4' | 'IPv6'
  country: string | null
  countryCode: string | null
  region: string | null
  regionCode: string | null
  city: string | null
  org: string | null
  asn: string | null
  timezone: string | null
  lat: number | null
  lon: number | null
  postal: string | null
  currency: string | null
  callingCode: string | null
  ipClass?: string
  isPrivate?: boolean
  ipv6Type?: string
  ipv6Expanded?: string
}

interface HistoryEntry { ip: string; city: string | null; country: string | null; at: string }

// ─── Style Tokens ──────────────────────────────────────────────────────────

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
  padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'left',
  background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '8px 12px', fontSize: 13, textAlign: 'left', color: 'var(--fg-2)' }

// ─── IP Helpers ────────────────────────────────────────────────────────────

function getIpVersion(ip: string): 'IPv4' | 'IPv6' { return ip.includes(':') ? 'IPv6' : 'IPv4' }

function getIpv4Class(ip: string): string {
  const first = parseInt(ip.split('.')[0])
  if (first <= 126) return 'A'
  if (first <= 191) return 'B'
  if (first <= 223) return 'C'
  if (first <= 239) return 'D (Multicast)'
  return 'E (Reserved)'
}

function isPrivateIp(ip: string): boolean {
  const p = ip.split('.').map(Number)
  return p[0] === 10 || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || p[0] === 127
}

function getIpv6Type(ip: string): string {
  const l = ip.toLowerCase()
  if (l === '::1') return 'Loopback'
  if (l.startsWith('fe80')) return 'Link-local'
  if (l.startsWith('fc') || l.startsWith('fd')) return 'Unique local'
  if (l.startsWith('ff')) return 'Multicast'
  return 'Global unicast'
}

type RawIpInfo = Omit<IpInfo, 'version' | 'ipClass' | 'isPrivate' | 'ipv6Type' | 'ipv6Expanded'>

function enrichIpInfo(raw: RawIpInfo): IpInfo {
  const version = getIpVersion(raw.ip)
  const info: IpInfo = { ...raw, version }
  if (version === 'IPv4') {
    info.ipClass = getIpv4Class(raw.ip)
    info.isPrivate = isPrivateIp(raw.ip)
  } else {
    info.ipv6Type = getIpv6Type(raw.ip)
    info.ipv6Expanded = raw.ip.split(':').map(g => g.padStart(4, '0')).join(':')
  }
  return info
}

// ─── Sub-components ────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 900, color, wordBreak: 'break-all' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}35` }}>
      {label}
    </span>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function IpCheckerClient() {
  const [autoIp, setAutoIp] = useState<IpInfo | null>(null)
  const [autoLoading, setAutoLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<IpInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const fetchIpGeo = useCallback(async (ip?: string): Promise<IpInfo> => {
    const url = ip ? `/api/tools/ip-lookup?ip=${encodeURIComponent(ip)}` : '/api/tools/ip-lookup'
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
    return enrichIpInfo(data as RawIpInfo)
  }, [])

  const detectMyIp = useCallback(async () => {
    setAutoLoading(true)
    try {
      setAutoIp(await fetchIpGeo())
    } catch {
      try {
        const r = await fetch('https://api.ipify.org?format=json')
        const { ip } = await r.json() as { ip: string }
        setAutoIp(enrichIpInfo({ ip, city: null, country: null, countryCode: null, region: null, regionCode: null, org: null, asn: null, timezone: null, lat: null, lon: null, postal: null, currency: null, callingCode: null }))
      } catch { setAutoIp(null) }
    } finally {
      setAutoLoading(false)
    }
  }, [fetchIpGeo])

  useEffect(() => { detectMyIp() }, [detectMyIp])

  async function handleLookup() {
    const ip = query.trim()
    if (!ip) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const info = await fetchIpGeo(ip)
      setResult(info)
      setHistory(prev => [{ ip: info.ip, city: info.city, country: info.country, at: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to look up IP.')
    } finally {
      setLoading(false)
    }
  }

  function renderDetailTable(info: IpInfo) {
    const rows: Array<[string, string, boolean?]> = [
      ['IP Address', info.ip, true],
      ['IP Version', info.version],
      ['Country', info.country ? `${info.country} (${info.countryCode})` : '—'],
      ['Region', info.region ? `${info.region}${info.regionCode ? ` (${info.regionCode})` : ''}` : '—'],
      ['City', info.city ?? '—'],
      ['Postal Code', info.postal ?? '—'],
      ['ISP / Organisation', info.org ?? '—'],
      ['ASN', info.asn ?? '—', true],
      ['Timezone', info.timezone ?? '—'],
      ['Currency', info.currency ?? '—'],
      ['Country Code', info.callingCode ?? '—'],
      ['Coordinates', info.lat != null && info.lon != null ? `${info.lat.toFixed(4)}°, ${info.lon.toFixed(4)}°` : '—'],
      ...(info.version === 'IPv4'
        ? [['IP Class', `Class ${info.ipClass}`] as [string, string], ['Address Type', info.isPrivate ? 'Private (RFC 1918)' : 'Public (globally routable)'] as [string, string]]
        : [['IPv6 Type', info.ipv6Type ?? '—'] as [string, string], ['Expanded Form', info.ipv6Expanded ?? '—', true] as [string, string, boolean?]]),
    ]
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map(([k, v, mono]) => (
            <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ ...TD, color: 'var(--fg-3)', fontWeight: 600, width: '38%', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</td>
              <td style={{ ...TD, color: 'var(--fg)', wordBreak: 'break-all', whiteSpace: 'normal', fontFamily: mono ? 'monospace' : 'inherit' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const displayInfo = result ?? autoIp

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUT ─────────────────────────────────────────────────────────── */}
      <div style={CARD}>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          Your public IP is auto-detected on load. Enter any IPv4 or IPv6 address for real geolocation and network data.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={LABEL}>IP Address</label>
            <input
              style={INPUT_BOX}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleLookup()}
              placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888"
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <button
              onClick={handleLookup}
              disabled={loading || !query.trim()}
              style={{ ...BTN_GHOST, background: '#6366f1', border: 'none', color: '#fff', opacity: loading || !query.trim() ? 0.5 : 1 }}
            >
              {loading ? '↻ Looking up…' : 'Look Up'}
            </button>
            <button
              onClick={detectMyIp}
              disabled={autoLoading}
              style={{ ...BTN_GHOST, background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#34d399' }}
            >
              {autoLoading ? '↻' : '⊕'} My IP
            </button>
          </div>
        </div>
        {error && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* ── RESULTS ───────────────────────────────────────────────────────── */}
      {autoLoading && !displayInfo ? (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Detecting your IP address…
        </div>
      ) : displayInfo ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <MetricCard label="IP Address" value={displayInfo.ip} color="#6366f1" />
            <MetricCard label="Version" value={displayInfo.version} color="#8b5cf6" />
            <MetricCard label="Country" value={displayInfo.country ?? '—'} sub={displayInfo.countryCode ?? undefined} color="#10b981" />
            <MetricCard label="City" value={displayInfo.city ?? '—'} sub={displayInfo.region ?? undefined} color="#38bdf8" />
            <MetricCard label="ASN" value={displayInfo.asn ?? '—'} sub={displayInfo.org?.split(' ').slice(0, 3).join(' ') ?? undefined} color="#f59e0b" />
          </div>

          {/* Classification chips */}
          <div style={{ ...CARD, padding: '18px 22px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Address Classification</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {displayInfo.version === 'IPv4' && (
                <>
                  <Chip label={displayInfo.isPrivate ? 'Private (RFC 1918)' : 'Public IP'} color={displayInfo.isPrivate ? '#f59e0b' : '#10b981'} />
                  <Chip label={`Class ${displayInfo.ipClass}`} color="#6366f1" />
                </>
              )}
              {displayInfo.version === 'IPv6' && displayInfo.ipv6Type && (
                <Chip label={displayInfo.ipv6Type} color="#8b5cf6" />
              )}
              {displayInfo.timezone && <Chip label={displayInfo.timezone} color="#38bdf8" />}
              {displayInfo.currency && <Chip label={`Currency: ${displayInfo.currency}`} color="#f59e0b" />}
            </div>
            {displayInfo.isPrivate && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#f59e0b', padding: '8px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 6, border: '1px solid rgba(245,158,11,0.2)', lineHeight: 1.6 }}>
                This is a private address — not routable on the public internet. Geolocation data will not be available.
              </div>
            )}
          </div>

          {/* Detail table */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {result ? `IP Details — ${result.ip}` : 'Your IP Details'}
            </h3>
            <div style={{ overflowX: 'auto' }}>{renderDetailTable(displayInfo)}</div>
          </div>

          {/* Map */}
          {displayInfo.lat != null && displayInfo.lon != null && (
            <div style={{ ...CARD, padding: '18px 22px' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Approximate Location</div>
              <div style={{ height: 160, borderRadius: 10, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--line-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ fontSize: 32 }}>📍</div>
                <div style={{ fontSize: 15, color: 'var(--fg-2)', fontWeight: 700 }}>
                  {[displayInfo.city, displayInfo.region, displayInfo.country].filter(Boolean).join(', ')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{displayInfo.lat.toFixed(6)}°, {displayInfo.lon.toFixed(6)}°</div>
                <a href={`https://www.google.com/maps?q=${displayInfo.lat},${displayInfo.lon}`} target="_blank" rel="noopener noreferrer" style={{ ...BTN_GHOST, marginTop: 4, textDecoration: 'none', fontSize: 12 }}>
                  View on Google Maps →
                </a>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--fg-3)' }}>
                Geolocation is approximate — accurate to city level for most IPs. VPN users will see the server location.
              </p>
            </div>
          )}
        </>
      ) : null}

      {/* ── HISTORY ───────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Recent Lookups</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['IP Address', 'City', 'Country', 'Time'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }} onClick={() => setQuery(h.ip)}>
                    <td style={{ ...TD, color: '#c4b5fd', fontWeight: 600, fontFamily: 'monospace' }}>{h.ip}</td>
                    <td style={TD}>{h.city ?? '—'}</td>
                    <td style={TD}>{h.country ?? '—'}</td>
                    <td style={{ ...TD, color: 'var(--fg-3)' }}>{h.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GUIDE ─────────────────────────────────────────────────────────── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>About IP Addresses</h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>Geolocation is approximate — accurate to city level for most IPs, but may show the ISP hub rather than your exact location.</li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>VPN, proxy, and Tor users will see the server&apos;s location, not their real physical location.</li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>IPv4 private ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — not routable on the public internet.</li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>The ASN (Autonomous System Number) identifies the network operator or ISP responsible for routing the IP block.</li>
        </ul>
      </div>
    </div>
  )
}
