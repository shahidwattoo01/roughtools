'use client'
import { useState } from 'react'
import type { CSSProperties } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

interface ParsedWhois {
  query: string
  domain: string
  tld: string
  tldRegistry: string
  registrar: string
  registrationDate: string | null
  expiryDate: string | null
  lastUpdated: string | null
  nameServers: string[]
  registrant: string
  privacyEnabled: boolean
  status: string[]
  ageYears: number | null
  ageDays: number | null
  daysUntilExpiry: number | null
  port43: string | null
  raw: string
}

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
const BTN_PRIMARY: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#6366f1', border: 'none', borderRadius: 8,
  padding: '10px 22px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TD: CSSProperties = { padding: '9px 12px', fontSize: 13, color: 'var(--fg-2)' }

// ─── TLD Registry Map ──────────────────────────────────────────────────────

const TLD_REGISTRY: Record<string, string> = {
  com: 'VeriSign / ICANN', org: 'Public Interest Registry (PIR)',
  net: 'VeriSign', io: 'Internet Computer Bureau (UK)',
  co: 'NIC Colombia', dev: 'Google Registry', app: 'Google Registry',
  ai: 'Government of Anguilla', uk: 'Nominet (UK)', de: 'DENIC (Germany)',
  fr: 'AFNIC (France)', ca: 'CIRA (Canada)', au: 'auDA (Australia)',
  in: 'NIXI (India)', edu: 'Educause', gov: 'U.S. General Services Administration',
  jp: 'JPRS (Japan)', cn: 'CNNIC (China)', nl: 'SIDN (Netherlands)',
  ru: 'Coordination Center (Russia)', br: 'NIC.br (Brazil)', eu: 'EURid',
  info: 'Afilias', biz: 'Neustar', xyz: 'XYZ.COM LLC',
}

// ─── Domain Status Info ────────────────────────────────────────────────────

const STATUS_INFO: Record<string, { color: string; desc: string }> = {
  'client transfer prohibited': { color: '#f59e0b', desc: 'Registrar has locked domain against unauthorized transfers.' },
  'client update prohibited': { color: '#f59e0b', desc: 'Registrar has locked domain against changes.' },
  'client delete prohibited': { color: '#f59e0b', desc: 'Registrar has locked domain against deletion.' },
  'server transfer prohibited': { color: '#ef4444', desc: 'Registry-level lock against transfers (highest security level).' },
  'server delete prohibited': { color: '#ef4444', desc: 'Registry-level lock preventing deletion.' },
  'server update prohibited': { color: '#ef4444', desc: 'Registry-level lock preventing updates.' },
  'client hold': { color: '#ef4444', desc: 'Domain is not delegated — typically due to unpaid renewal.' },
  'server hold': { color: '#ef4444', desc: 'Registry has placed the domain on hold.' },
  'ok': { color: '#10b981', desc: 'Domain is active with no restrictions.' },
  'active': { color: '#10b981', desc: 'Domain is active and delegated.' },
  'inactive': { color: '#9ca3af', desc: 'Domain has no nameservers configured.' },
  'pending delete': { color: '#ef4444', desc: 'Domain is pending deletion and may become available soon.' },
  'redemption period': { color: '#f97316', desc: 'Grace period after expiry — registrant may still recover it.' },
}

// ─── RDAP Parser ───────────────────────────────────────────────────────────

type VCardEntry = [string, Record<string, unknown>, string, string | string[]]

function extractVCardFn(vcardArray: unknown): string | null {
  if (!Array.isArray(vcardArray) || vcardArray.length < 2) return null
  const entries = vcardArray[1] as VCardEntry[]
  if (!Array.isArray(entries)) return null
  const fn = entries.find(e => Array.isArray(e) && e[0] === 'fn')
  if (!fn) return null
  const val = fn[3]
  return Array.isArray(val) ? (val[0] as string) : (val as string) ?? null
}

function findEntityByRole(
  entities: Array<{ roles?: string[]; vcardArray?: unknown }> | undefined,
  role: string
): string | null {
  if (!entities) return null
  for (const e of entities) {
    if (e.roles?.includes(role)) {
      const fn = extractVCardFn(e.vcardArray)
      if (fn) return fn
    }
  }
  return null
}

function getEventDate(
  events: Array<{ eventAction: string; eventDate: string }> | undefined,
  action: string
): string | null {
  return events?.find(e => e.eventAction === action)?.eventDate ?? null
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  try { return new Date(iso).toISOString().split('T')[0] } catch { return iso }
}

function parseRdap(data: Record<string, unknown>, query: string): ParsedWhois {
  const events = data.events as Array<{ eventAction: string; eventDate: string }> | undefined
  const nameservers = data.nameservers as Array<{ ldhName?: string; unicodeName?: string }> | undefined
  const entities = data.entities as Array<{ roles?: string[]; vcardArray?: unknown }> | undefined
  const status = (data.status as string[] | undefined) ?? []

  const ldhName = ((data.ldhName ?? data.handle ?? query) as string).toLowerCase().replace(/\.$/, '')
  const tld = ldhName.split('.').pop() ?? 'com'

  const registrationDateRaw = getEventDate(events, 'registration')
  const expiryDateRaw = getEventDate(events, 'expiration')
  const lastUpdatedRaw = getEventDate(events, 'last changed')

  const regDate = registrationDateRaw ? new Date(registrationDateRaw) : null
  const expDate = expiryDateRaw ? new Date(expiryDateRaw) : null
  const now = new Date()

  const ageDays = regDate ? Math.floor((now.getTime() - regDate.getTime()) / 86_400_000) : null
  const ageYears = ageDays !== null ? Math.floor(ageDays / 365.25) : null
  const daysUntilExpiry = expDate ? Math.floor((expDate.getTime() - now.getTime()) / 86_400_000) : null

  const registrar = findEntityByRole(entities, 'registrar') ?? 'Unknown Registrar'
  const registrant = findEntityByRole(entities, 'registrant')

  const nsNames = (nameservers ?? [])
    .map(ns => (ns.ldhName ?? ns.unicodeName ?? '').toLowerCase())
    .filter(Boolean)

  return {
    query,
    domain: ldhName,
    tld,
    tldRegistry: TLD_REGISTRY[tld] ?? 'Country Code Registry',
    registrar,
    registrationDate: formatDate(registrationDateRaw),
    expiryDate: formatDate(expiryDateRaw),
    lastUpdated: formatDate(lastUpdatedRaw),
    nameServers: nsNames,
    registrant: registrant ?? 'REDACTED FOR PRIVACY',
    privacyEnabled: !registrant,
    status,
    ageYears,
    ageDays,
    daysUntilExpiry,
    port43: (data.port43 as string) ?? null,
    raw: JSON.stringify(data, null, 2),
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 900, color, wordBreak: 'break-all' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function expiryColor(days: number): string {
  if (days > 365) return '#10b981'
  if (days > 60) return '#f59e0b'
  return '#ef4444'
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function WhoisLookupClient() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<ParsedWhois | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRaw, setShowRaw] = useState(false)

  async function handleLookup() {
    const q = query.trim().replace(/^https?:\/\//, '').split('/')[0]
    if (!q) return
    setLoading(true)
    setError('')
    setResult(null)
    setShowRaw(false)

    try {
      const res = await fetch(`/api/tools/whois-lookup?query=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
      setResult(parseRdap(data as Record<string, unknown>, q))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'WHOIS lookup failed. The domain may not support RDAP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUT ─────────────────────────────────────────────────────────── */}
      <div style={CARD}>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          Real-time registration data via <strong style={{ color: 'var(--fg-2)' }}>RDAP</strong> (RFC 7482) — the modern, structured replacement for legacy WHOIS.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={LABEL}>Domain or IP Address</label>
            <input
              style={INPUT_BOX}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleLookup()}
              placeholder="e.g. example.com or 8.8.8.8"
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleLookup}
              disabled={loading || !query.trim()}
              style={{ ...BTN_PRIMARY, opacity: loading || !query.trim() ? 0.5 : 1 }}
            >
              {loading ? '↻ Looking up…' : 'WHOIS Lookup'}
            </button>
          </div>
        </div>
        {error && (
          <div style={{ marginTop: 12, padding: '11px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* ── RESULTS ───────────────────────────────────────────────────────── */}
      {result && (
        <>
          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <MetricCard
              label="Domain Age"
              value={result.ageYears !== null ? `${result.ageYears} yr${result.ageYears !== 1 ? 's' : ''}` : '—'}
              sub={result.ageDays !== null ? `${result.ageDays.toLocaleString()} days` : undefined}
              color="#6366f1"
            />
            <MetricCard label="Registered" value={result.registrationDate ?? '—'} color="#8b5cf6" />
            <MetricCard
              label="Expires"
              value={result.expiryDate ?? '—'}
              sub={result.daysUntilExpiry !== null ? `${result.daysUntilExpiry} days left` : undefined}
              color={result.daysUntilExpiry !== null ? expiryColor(result.daysUntilExpiry) : '#888'}
            />
            <MetricCard
              label="Registrar"
              value={result.registrar.split(',')[0].split('.')[0]}
              sub={result.registrar.length > 20 ? result.registrar.slice(0, 30) + '…' : result.registrar}
              color="#38bdf8"
            />
            <MetricCard label="TLD" value={`.${result.tld}`} sub={result.tldRegistry.split(' ')[0]} color="#10b981" />
          </div>

          {/* Expiry alert */}
          {result.daysUntilExpiry !== null && result.daysUntilExpiry < 365 && (
            <div style={{
              padding: '12px 18px', borderRadius: 10,
              background: result.daysUntilExpiry < 30 ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
              border: `1px solid ${result.daysUntilExpiry < 30 ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}`,
              color: result.daysUntilExpiry < 30 ? '#f87171' : '#fbbf24', fontSize: 13, fontWeight: 600, lineHeight: 1.5,
            }}>
              {result.daysUntilExpiry < 0
                ? '⛔ This domain has already expired!'
                : result.daysUntilExpiry < 30
                  ? `⚠ Domain expires in ${result.daysUntilExpiry} days — renewal is urgent!`
                  : `Domain expires in ${result.daysUntilExpiry} days. Consider renewing to avoid losing it.`}
            </div>
          )}

          {/* Registration details */}
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Registration Details
              </h3>
              <button onClick={() => setShowRaw(!showRaw)} style={{ ...BTN_GHOST, fontSize: 12, padding: '5px 12px' }}>
                {showRaw ? 'Parsed View' : 'Raw RDAP JSON'}
              </button>
            </div>

            {showRaw ? (
              <pre style={{
                margin: 0, padding: '14px', background: 'rgba(0,0,0,0.4)', borderRadius: 8,
                fontSize: 11, color: '#34d399', fontFamily: 'monospace', overflowX: 'auto',
                maxHeight: 500, overflowY: 'auto', lineHeight: 1.5,
              }}>
                {result.raw}
              </pre>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Domain', result.domain],
                    ['TLD', `.${result.tld}`],
                    ['TLD Registry', result.tldRegistry],
                    ['Registrar', result.registrar],
                    ['WHOIS Server', result.port43 ?? 'Provided via RDAP'],
                    ['Registration Date', result.registrationDate ?? 'Unknown'],
                    ['Expiry Date', result.expiryDate ?? 'Unknown'],
                    ['Last Updated', result.lastUpdated ?? 'Unknown'],
                    ['Registrant', result.registrant],
                    ['WHOIS Privacy', result.privacyEnabled ? 'Enabled — contact info hidden (GDPR)' : 'Disabled — contact info public'],
                    ['Name Servers', result.nameServers.length > 0 ? result.nameServers.join(', ') : 'None listed'],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, color: 'var(--fg-3)', fontWeight: 600, width: '36%', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</td>
                      <td style={{ ...TD, color: 'var(--fg)', fontFamily: k === 'Domain' || k === 'WHOIS Server' ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Name servers */}
          {result.nameServers.length > 0 && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Name Servers ({result.nameServers.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                {result.nameServers.map((ns, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#a5b4fc', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#c4b5fd', fontFamily: 'monospace', wordBreak: 'break-all' }}>{ns}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status flags */}
          {result.status.length > 0 && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Status Flags ({result.status.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.status.map((s, i) => {
                  const info = STATUS_INFO[s.toLowerCase()]
                  return (
                    <div key={i} style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, borderLeft: `3px solid ${info?.color ?? '#888'}` }}>
                      <div style={{ fontSize: 13, color: info?.color ?? '#a5b4fc', fontWeight: 700, fontFamily: 'monospace', marginBottom: info?.desc ? 4 : 0 }}>{s}</div>
                      {info?.desc && <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>{info.desc}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Research links */}
          <div style={{ ...CARD, padding: '18px 24px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Historical Research</h3>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6 }}>
              Check historical snapshots and past ownership of this domain.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href={`https://web.archive.org/web/*/${result.domain}`} target="_blank" rel="noopener noreferrer" style={{ ...BTN_GHOST, textDecoration: 'none', fontSize: 12 }}>
                Wayback Machine →
              </a>
              <a href={`https://dnschecker.org/#A/${result.domain}`} target="_blank" rel="noopener noreferrer" style={{ ...BTN_GHOST, textDecoration: 'none', fontSize: 12 }}>
                DNS Propagation →
              </a>
            </div>
          </div>
        </>
      )}

      {/* ── INFO CARD ─────────────────────────────────────────────────────── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          About WHOIS &amp; RDAP
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            <strong>RDAP</strong> (Registration Data Access Protocol) is the modern JSON-based replacement for legacy WHOIS, standardised in RFC 7482.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            Since GDPR (2018), most registrars hide personal contact information behind privacy protection — this is standard and expected.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            Monitor domain expiry carefully — expired domains can be snapped up by cybersquatters within hours of deletion.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
            The authoritative WHOIS for .com/.net is managed by VeriSign at <strong>whois.verisign-grs.com</strong>.
          </li>
        </ul>
      </div>
    </div>
  )
}
