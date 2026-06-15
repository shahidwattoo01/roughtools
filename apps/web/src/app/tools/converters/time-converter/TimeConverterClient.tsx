'use client'
import { useState } from 'react'

type TimeUnit = 'ms' | 's' | 'min' | 'hr' | 'day' | 'week' | 'month' | 'year'

// Base: seconds
const UNITS: { key: TimeUnit; label: string; symbol: string; toSeconds: number }[] = [
  { key: 'ms', label: 'Milliseconds', symbol: 'ms', toSeconds: 0.001 },
  { key: 's', label: 'Seconds', symbol: 's', toSeconds: 1 },
  { key: 'min', label: 'Minutes', symbol: 'min', toSeconds: 60 },
  { key: 'hr', label: 'Hours', symbol: 'hr', toSeconds: 3600 },
  { key: 'day', label: 'Days', symbol: 'd', toSeconds: 86400 },
  { key: 'week', label: 'Weeks', symbol: 'wk', toSeconds: 604800 },
  { key: 'month', label: 'Months (avg)', symbol: 'mo', toSeconds: 2629800 }, // 365.25/12 * 86400
  { key: 'year', label: 'Years (avg)', symbol: 'yr', toSeconds: 31557600 },  // 365.25 * 86400
]

function convert(value: number, from: TimeUnit, to: TimeUnit): number {
  const fromUnit = UNITS.find(u => u.key === from)!
  const toUnit = UNITS.find(u => u.key === to)!
  return value * fromUnit.toSeconds / toUnit.toSeconds
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

export default function TimeConverterClient() {
  const [input, setInput] = useState('1')
  const [fromUnit, setFromUnit] = useState<TimeUnit>('hr')

  const numVal = parseFloat(input)
  const isValid = !isNaN(numVal)

  const selectStyle: React.CSSProperties = {
    background: '#0f0f23', color: '#e0e0ff', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, padding: '10px 14px', fontSize: 15, cursor: 'pointer', width: '100%',
  }
  const inputStyle: React.CSSProperties = {
    background: '#0f0f23', color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, padding: '12px 14px', fontSize: 18, width: '100%', boxSizing: 'border-box',
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = { color: '#888', fontSize: 13, marginBottom: 6, display: 'block' }
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)',
    borderRadius: 12, padding: 20,
  }

  return (
    <div style={{ background: 'var(--bg-1)', borderRadius: 16, padding: 28, border: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={labelStyle}>Value</label>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={inputStyle}
            placeholder="Enter time"
          />
        </div>
        <div>
          <label style={labelStyle}>From Unit</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value as TimeUnit)} style={selectStyle}>
            {UNITS.map(u => (
              <option key={u.key} value={u.key}>{u.label} ({u.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: '#888', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Results</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {UNITS.map(u => {
          const result = isValid ? convert(numVal, fromUnit, u.key) : null
          const isFrom = u.key === fromUnit
          return (
            <div key={u.key} style={{ ...cardStyle, border: isFrom ? '1px solid rgba(120,100,255,0.4)' : cardStyle.border }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{u.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: isFrom ? '#a78bfa' : '#e0e0ff', wordBreak: 'break-all' }}>
                {result !== null ? fmt(result) : '—'}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{u.symbol}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: '#555', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
        Note: months use 30.4375 days average; years use 365.25 days average.
      </div>
    </div>
  )
}
