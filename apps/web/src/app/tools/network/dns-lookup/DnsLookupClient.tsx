'use client'
import { useState, useCallback } from 'react'
import type { CSSProperties } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

type RecordType = 'A' | 'AAAA' | 'MX' | 'NS' | 'TXT' | 'CNAME' | 'SOA' | 'PTR' | 'SRV' | 'CAA'

interface DnsRecord {
  name: string
  type: string
  ttl: number
  data: string
}

interface DnsResponse {
  status: number
  statusText: string
  authenticated: boolean
  name: string
  type: string
  answer: DnsRecord[]
  authority: DnsRecord[]
  comment: string | null
  error?: string
}

// ─── Style Tokens ──────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
  color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_PRIMARY: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#6366f1', border: 'none',
  borderRadius: 8, padding: '10px 22px', color: '#fff', fontSize: 13,
  fontWeight: 700, cursor: 'pointer',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
  letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'left',
  background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '9px 12px', fontSize: 13, textAlign: 'left',
  color: 'var(--fg-2)', wordBreak: 'break-all',
}

const RECORD_TYPES: RecordType[] = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA', 'PTR', 'SRV', 'CAA']

const TYPE_COLORS: Record<string, string> = {
  A: '#6366f1', AAAA: '#8b5cf6', MX: '#f59e0b', NS: '#38bdf8',
  TXT: '#10b981', CNAME: '#a78bfa', SOA: '#ef4444',
  PTR: '#ec4899', SRV: '#14b8a6', CAA: '#f97316',
}

function ttlHuman(ttl: number): string {
  if (ttl < 60) return `${ttl}s`
  if (ttl < 3600) return `${Math.floor(ttl / 60)}m`
  if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`
  return `${Math.floor(ttl / 86400)}d`
}

function detectTxtSubtype(value: string): string {
  if (value.startsWith('v=spf1')) return 'SPF'
  if (value.startsWith('v=DKIM1') || value.includes('k=rsa') || value.includes('k=ed25519')) return 'DKIM'
  if (value.startsWith('v=DMARC1')) return 'DMARC'
  if (value.startsWith('v=TLSRPTv1')) return 'TLSRPT'
  if (value.startsWith('v=BIMI1')) return 'BIMI'
  if (value.startsWith('google-site-verification')) return 'Google Verification'
  if (value.startsWith('MS=')) return 'Microsoft Verification'
  if (value.startsWith('facebook-domain-verification')) return 'Facebook Verification'
  return ''
}

function parseMx(data: string): { priority: number; host: string } | null {
  const m = data.match(/^(\d+)\s+(.+)$/)
  if (!m) return null
  return { priority: parseInt(m[1]), host: m[2] }
}

function parseSoa(data: string): Array<[string, string]> | null {
  const parts = data.trim().split(/\s+/)
  if (parts.length < 7) return null
  return [
    ['Primary NS', parts[0]],
    ['Admin Email', parts[1].replace('.', '@')],
    ['Serial', parts[2]],
    ['Refresh', ttlHuman(parseInt(parts[3]))],
    ['Retry', ttlHuman(parseInt(parts[4]))],
    ['Expire', ttlHuman(parseInt(parts[5]))],
    ['Min TTL', ttlHuman(parseInt(parts[6]))],
  ]
}

function parseSrv(data: string): { priority: number; weight: number; port: number; target: string } | null {
  const parts = data.trim().split(/\s+/)
  if (parts.length < 4) return null
  return { priority: parseInt(parts[0]), weight: parseInt(parts[1]), port: parseInt(parts[2]), target: parts[3] }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#10b981' : 'var(--fg-3)', fontSize: 13, padding: '2px 6px', borderRadius: 4 }}
      title="Copy value"
    >
      {copied ? '✓' : '⎘'}
    </button>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function DnsLookupClient() {
  const [domain, setDomain] = useState('')
  const [selectedType, setSelectedType] = useState<RecordType>('A')
  const [mode, setMode] = useState<'single' | 'all'>('single')
  const [result, setResult] = useState<DnsResponse | null>(null)
  const [allResults, setAllResults] = useState<Partial<Record<RecordType, DnsResponse>> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedSoaIdx, setExpandedSoaIdx] = useState<number | null>(null)

  const lookupSingle = useCallback(async (name: string, type: string): Promise<DnsResponse> => {
    const res = await fetch(`/api/tools/dns-lookup?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`)
    const data = await res.json()
    if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
    return data as DnsResponse
  }, [])

  async function handleLookup() {
    const d = domain.trim().replace(/^https?:\/\//, '').split('/')[0]
    if (!d) return
    setLoading(true)
    setError('')
    setResult(null)
    setAllResults(null)
    setExpandedSoaIdx(null)

    try {
      if (mode === 'all') {
        const all: Partial<Record<RecordType, DnsResponse>> = {}
        for (const t of RECORD_TYPES) {
          try {
            const r = await lookupSingle(d, t)
            if (r.answer.length > 0 || r.authority.length > 0) all[t] = r
          } catch { /* skip types that error */ }
        }
        setAllResults(all)
      } else {
        const r = await lookupSingle(d, selectedType)
        setResult(r)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'DNS lookup failed.')
    } finally {
      setLoading(false)
    }
  }

  function renderRecordsTable(records: DnsRecord[], typeOverride?: string) {
    if (records.length === 0) {
      return <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: 0 }}>No records returned.</p>
    }
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Type', 'Name', 'Value', 'TTL', ''].map((h, i) => <th key={i} style={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {records.map((rec, i) => {
              const recType = typeOverride ?? rec.type
              const typeColor = TYPE_COLORS[recType] ?? '#888'
              const txtSubtype = rec.type === 'TXT' ? detectTxtSubtype(rec.data) : ''
              const mxParsed = rec.type === 'MX' ? parseMx(rec.data) : null
              const soaParsed = rec.type === 'SOA' ? parseSoa(rec.data) : null
              const srvParsed = rec.type === 'SRV' ? parseSrv(rec.data) : null
              const isExpanded = expandedSoaIdx === i

              return (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: soaParsed ? 'pointer' : 'default' }}
                  onClick={() => soaParsed && setExpandedSoaIdx(isExpanded ? null : i)}
                >
                  <td style={{ ...TD, width: 72 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: `${typeColor}22`, color: typeColor, fontWeight: 800, fontSize: 11, fontFamily: 'monospace' }}>
                      {recType}
                    </span>
                  </td>
                  <td style={{ ...TD, color: 'var(--fg-3)', fontSize: 12, fontFamily: 'monospace' }}>{rec.name}</td>
                  <td style={{ ...TD }}>
                    {mxParsed && (
                      <span style={{ marginRight: 8, padding: '1px 7px', borderRadius: 4, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 700, fontSize: 11 }}>
                        P{mxParsed.priority}
                      </span>
                    )}
                    {soaParsed ? (
                      <>
                        <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{rec.data.split(' ')[0]}</span>
                        <span style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 8 }}>{isExpanded ? '▲ hide' : '▼ details'}</span>
                        {isExpanded && (
                          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6 }}>
                            {soaParsed.map(([k, v]) => (
                              <div key={k} style={{ padding: '6px 8px', background: 'var(--bg-2)', borderRadius: 6 }}>
                                <div style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>{k}</div>
                                <div style={{ fontSize: 12, color: 'var(--brand-2)', fontFamily: 'monospace' }}>{v}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : srvParsed ? (
                      <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        <span style={{ color: '#f59e0b' }}>P{srvParsed.priority}</span>
                        <span style={{ color: 'var(--fg-3)' }}> W{srvParsed.weight}</span>
                        <span style={{ color: '#38bdf8' }}> :{srvParsed.port}</span>
                        {'  '}{srvParsed.target}
                      </span>
                    ) : (
                      <>
                        <span style={{ fontFamily: ['A', 'AAAA', 'TXT'].includes(rec.type) ? 'monospace' : 'inherit', fontSize: 13 }}>
                          {mxParsed ? mxParsed.host : rec.data}
                        </span>
                        {txtSubtype && (
                          <span style={{ marginLeft: 8, padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.18)', color: '#34d399' }}>
                            {txtSubtype}
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td style={{ ...TD, color: 'var(--fg-3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {ttlHuman(rec.ttl)}
                    <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--fg-3)' }}>{rec.ttl}s</span>
                  </td>
                  <td style={{ ...TD, width: 36, padding: '8px 6px' }}>
                    <CopyButton text={rec.data} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const totalRecords = allResults
    ? Object.values(allResults).reduce((s, r) => s + r.answer.length, 0)
    : (result?.answer.length ?? 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUT ────────────────────────────────────────────────────────── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <label style={LABEL}>Domain Name</label>
            <input
              style={INPUT_BOX}
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleLookup()}
              placeholder="e.g. example.com or subdomain.example.org"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleLookup}
            disabled={loading || !domain.trim()}
            style={{ ...BTN_PRIMARY, opacity: loading || !domain.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}
          >
            {loading ? '↻ Looking up…' : 'Look Up DNS'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {RECORD_TYPES.map(t => {
            const active = mode === 'single' && selectedType === t
            return (
              <button
                key={t}
                onClick={() => { setSelectedType(t); setMode('single') }}
                style={{
                  padding: '5px 11px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  border: `1px solid ${active ? (TYPE_COLORS[t] ?? 'rgba(139,92,246,0.5)') : 'var(--line-strong)'}`,
                  background: active ? `${TYPE_COLORS[t] ?? '#6366f1'}22` : 'rgba(0,0,0,0.25)',
                  color: active ? (TYPE_COLORS[t] ?? 'var(--brand-2)') : 'var(--fg-3)',
                }}
              >
                {t}
              </button>
            )
          })}
          <button
            onClick={() => setMode('all')}
            style={{
              ...BTN_GHOST, fontSize: 12, padding: '5px 13px',
              background: mode === 'all' ? 'rgba(16,185,129,0.15)' : BTN_GHOST.background,
              borderColor: mode === 'all' ? 'rgba(16,185,129,0.45)' : 'rgba(139,92,246,0.3)',
              color: mode === 'all' ? '#34d399' : 'var(--brand-2)',
            }}
          >
            All Records
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '11px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* ── SUMMARY ─────────────────────────────────────────────────────── */}
      {(result || allResults) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { label: 'Domain', value: domain.replace(/^https?:\/\//, '').split('/')[0], color: '#6366f1' },
            { label: 'Records', value: String(totalRecords), color: totalRecords > 0 ? '#10b981' : '#ef4444' },
            ...(allResults ? [{ label: 'Types Found', value: String(Object.keys(allResults).length), color: '#f59e0b' }] : []),
            ...(result ? [{ label: 'Status', value: result.statusText, color: result.status === 0 ? '#10b981' : '#ef4444' }] : []),
            ...(result?.authenticated ? [{ label: 'DNSSEC', value: 'Validated ✓', color: '#34d399' }] : []),
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '16px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color, wordBreak: 'break-all' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── SINGLE RESULT ───────────────────────────────────────────────── */}
      {result && (
        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 10px', borderRadius: 6, background: `${TYPE_COLORS[selectedType] ?? '#6366f1'}22`, color: TYPE_COLORS[selectedType] ?? '#6366f1', fontWeight: 800, fontSize: 12 }}>
              {selectedType}
            </span>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)' }}>
              {result.answer.length} record{result.answer.length !== 1 ? 's' : ''} for{' '}
              <span style={{ color: '#a5b4fc' }}>{domain}</span>
            </h3>
            {result.authenticated && (
              <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: 11, fontWeight: 700 }}>
                DNSSEC Validated ✓
              </span>
            )}
          </div>

          {result.status !== 0 && (
            <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: 13, color: '#f87171' }}>
              DNS Status: <strong>{result.statusText}</strong>
              {result.status === 3 && ' — Domain does not exist (NXDOMAIN).'}
              {result.status === 2 && ' — Server failure. Try again shortly.'}
              {result.comment && <span style={{ marginLeft: 6, color: 'var(--fg-3)' }}>({result.comment})</span>}
            </div>
          )}

          {renderRecordsTable(result.answer)}

          {result.authority.length > 0 && (
            <>
              <h4 style={{ margin: '18px 0 10px', fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Authority Section
              </h4>
              {renderRecordsTable(result.authority)}
            </>
          )}

          {selectedType === 'MX' && result.answer.length > 0 && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(245,158,11,0.07)', borderRadius: 8, fontSize: 12, color: '#fbbf24', lineHeight: 1.6 }}>
              Tip: Also check TXT records for SPF, DKIM, and DMARC to confirm email authentication is correctly configured.
            </div>
          )}
        </div>
      )}

      {/* ── ALL RECORDS ─────────────────────────────────────────────────── */}
      {allResults && (
        <>
          {(Object.entries(allResults) as [RecordType, DnsResponse][]).map(([type, r]) => (
            <div key={type} style={CARD}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ padding: '3px 10px', borderRadius: 6, background: `${TYPE_COLORS[type] ?? '#6366f1'}22`, color: TYPE_COLORS[type] ?? '#6366f1', fontWeight: 800, fontSize: 12 }}>
                  {type}
                </span>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--fg-2)' }}>
                  {r.answer.length} record{r.answer.length !== 1 ? 's' : ''}
                </h3>
                {r.authenticated && (
                  <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: 11, fontWeight: 700 }}>DNSSEC ✓</span>
                )}
              </div>
              {renderRecordsTable(r.answer, type)}
            </div>
          ))}
          {Object.keys(allResults).length === 0 && (
            <div style={{ ...CARD, textAlign: 'center', color: 'var(--fg-3)', fontSize: 14, padding: '40px 28px' }}>
              No DNS records found for this domain.
            </div>
          )}
        </>
      )}

      {/* ── REFERENCE ───────────────────────────────────────────────────── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          DNS Record Types Reference
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 8 }}>
          {[
            { type: 'A', desc: 'Maps a domain to an IPv4 address. The most fundamental DNS record.' },
            { type: 'AAAA', desc: 'Maps a domain to an IPv6 address.' },
            { type: 'MX', desc: 'Mail exchange servers — required for receiving email. Priority determines order.' },
            { type: 'NS', desc: 'Authoritative nameservers for the zone — delegate DNS authority.' },
            { type: 'TXT', desc: 'Arbitrary text: SPF, DKIM, DMARC, domain verification tokens.' },
            { type: 'CNAME', desc: 'Canonical name — alias from one hostname to another (e.g. www → apex).' },
            { type: 'SOA', desc: 'Start of Authority — serial number, refresh timing, admin contact.' },
            { type: 'PTR', desc: 'Reverse DNS — maps an IP address back to a hostname.' },
            { type: 'SRV', desc: 'Service locator with priority, weight, and port (e.g. SIP, XMPP).' },
            { type: 'CAA', desc: 'Restricts which Certificate Authorities may issue TLS certs.' },
          ].map(({ type, desc }) => (
            <div key={type} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0' }}>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: `${TYPE_COLORS[type] ?? '#6366f1'}22`, color: TYPE_COLORS[type] ?? '#6366f1', fontWeight: 800, fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                {type}
              </span>
              <span style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.55 }}>{desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'var(--bg-2)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--fg-2)' }}>About TTL:</strong> Time To Live controls how long resolvers cache a record.
          Low TTL (300s) → faster change propagation, more DNS queries.
          High TTL (86400s) → better performance, slower propagation.
          DNS changes can take up to 48h to propagate globally due to resolver caches.
        </div>
      </div>
    </div>
  )
}
