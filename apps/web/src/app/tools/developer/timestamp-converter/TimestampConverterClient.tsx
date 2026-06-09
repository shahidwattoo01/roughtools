'use client'
import { useState, useEffect } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  background: '#252540',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e0e0ff',
  fontSize: 14,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
}

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  background: accent ? '#a78bfa' : 'rgba(255,255,255,0.08)',
  color: accent ? '#0f0f1e' : '#e0e0ff',
})

type TSResult = { utc: string; local: string; iso: string; relative: string }
type DTResult = { seconds: number; ms: number }

function formatRelative(ms: number): string {
  const diff = Date.now() - ms
  const abs = Math.abs(diff)
  const future = diff < 0
  if (abs < 60000) return 'just now'
  if (abs < 3600000) return `${Math.round(abs / 60000)} minutes ${future ? 'from now' : 'ago'}`
  if (abs < 86400000) return `${Math.round(abs / 3600000)} hours ${future ? 'from now' : 'ago'}`
  return `${Math.round(abs / 86400000)} days ${future ? 'from now' : 'ago'}`
}

export default function TimestampConverterClient() {
  const [tsInput, setTsInput] = useState('')
  const [tsResult, setTsResult] = useState<TSResult | null>(null)
  const [tsError, setTsError] = useState('')

  const [dateInput, setDateInput] = useState('')
  const [dtResult, setDtResult] = useState<DTResult | null>(null)

  const [now, setNow] = useState(0)
  const [copiedNow, setCopiedNow] = useState(false)

  useEffect(() => {
    setNow(Math.floor(Date.now() / 1000))
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  function convertTS() {
    setTsError('')
    const raw = tsInput.trim()
    if (!raw) return
    const num = Number(raw)
    if (isNaN(num)) { setTsError('Invalid timestamp — enter a numeric value.'); return }
    const ms = raw.length >= 13 ? num : num * 1000
    const d = new Date(ms)
    if (isNaN(d.getTime())) { setTsError('Timestamp is out of range.'); return }
    setTsResult({
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      iso: d.toISOString(),
      relative: formatRelative(ms),
    })
  }

  function convertDate() {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return
    const ms = d.getTime()
    setDtResult({ seconds: Math.floor(ms / 1000), ms })
  }

  function copyNow() {
    navigator.clipboard.writeText(String(now)).then(() => {
      setCopiedNow(true)
      setTimeout(() => setCopiedNow(false), 1500)
    })
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Current timestamp */}
      <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(167,139,250,0.08)', borderRadius: 10, border: '1px solid rgba(167,139,250,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>Current Unix Timestamp (seconds)</div>
          <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#e0e0ff' }}>{now}</div>
        </div>
        <button style={btnStyle()} onClick={copyNow}>{copiedNow ? 'Copied!' : 'Copy'}</button>
      </div>

      {/* Timestamp → Date */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 10 }}>Timestamp → Human-readable Date</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <input style={{ ...inputStyle, flex: 1 }} value={tsInput} onChange={e => { setTsInput(e.target.value); setTsResult(null); setTsError('') }} placeholder="Enter Unix timestamp (seconds or ms)..." />
          <button style={btnStyle(true)} onClick={convertTS}>Convert</button>
        </div>
        {tsError && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 8 }}>{tsError}</div>}
        {tsResult && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { label: 'UTC', value: tsResult.utc },
              { label: 'Local', value: tsResult.local },
              { label: 'ISO 8601', value: tsResult.iso },
              { label: 'Relative', value: tsResult.relative },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '10px 14px', background: '#252540', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: '#e0e0ff', fontFamily: 'monospace', wordBreak: 'break-all' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date → Timestamp */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 10 }}>Date → Timestamp</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <input type="datetime-local" style={{ ...inputStyle, flex: 1 }} value={dateInput} onChange={e => { setDateInput(e.target.value); setDtResult(null) }} />
          <button style={btnStyle(true)} onClick={convertDate}>Convert</button>
        </div>
        {dtResult && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Seconds', value: dtResult.seconds },
              { label: 'Milliseconds', value: dtResult.ms },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '10px 14px', background: '#252540', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15, color: '#e0e0ff', fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
