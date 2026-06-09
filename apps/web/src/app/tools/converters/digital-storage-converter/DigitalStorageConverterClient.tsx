'use client'
import { useState } from 'react'

type StorageUnit = 'bit' | 'kbit' | 'mbit' | 'gbit' | 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'

// Base: bits (decimal: 1 KB = 1000 B = 8000 bits)
const UNITS: { key: StorageUnit; label: string; symbol: string; toBits: number }[] = [
  { key: 'bit', label: 'Bits', symbol: 'b', toBits: 1 },
  { key: 'kbit', label: 'Kilobits', symbol: 'Kb', toBits: 1_000 },
  { key: 'mbit', label: 'Megabits', symbol: 'Mb', toBits: 1_000_000 },
  { key: 'gbit', label: 'Gigabits', symbol: 'Gb', toBits: 1_000_000_000 },
  { key: 'B', label: 'Bytes', symbol: 'B', toBits: 8 },
  { key: 'KB', label: 'Kilobytes', symbol: 'KB', toBits: 8_000 },
  { key: 'MB', label: 'Megabytes', symbol: 'MB', toBits: 8_000_000 },
  { key: 'GB', label: 'Gigabytes', symbol: 'GB', toBits: 8_000_000_000 },
  { key: 'TB', label: 'Terabytes', symbol: 'TB', toBits: 8_000_000_000_000 },
  { key: 'PB', label: 'Petabytes', symbol: 'PB', toBits: 8_000_000_000_000_000 },
]

function convert(value: number, from: StorageUnit, to: StorageUnit): number {
  const fromUnit = UNITS.find(u => u.key === from)!
  const toUnit = UNITS.find(u => u.key === to)!
  return value * fromUnit.toBits / toUnit.toBits
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e18 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

export default function DigitalStorageConverterClient() {
  const [input, setInput] = useState('1')
  const [fromUnit, setFromUnit] = useState<StorageUnit>('GB')

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
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 20,
  }

  const byteUnits: StorageUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const bitUnits: StorageUnit[] = ['bit', 'kbit', 'mbit', 'gbit']

  return (
    <div style={{ background: '#12121f', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={labelStyle}>Value</label>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={inputStyle}
            placeholder="Enter size"
          />
        </div>
        <div>
          <label style={labelStyle}>From Unit</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value as StorageUnit)} style={selectStyle}>
            <optgroup label="Byte units">
              {byteUnits.map(k => {
                const u = UNITS.find(x => x.key === k)!
                return <option key={k} value={k}>{u.label} ({u.symbol})</option>
              })}
            </optgroup>
            <optgroup label="Bit units">
              {bitUnits.map(k => {
                const u = UNITS.find(x => x.key === k)!
                return <option key={k} value={k}>{u.label} ({u.symbol})</option>
              })}
            </optgroup>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 14, color: '#888', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Byte Units</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        {byteUnits.map(k => {
          const u = UNITS.find(x => x.key === k)!
          const result = isValid ? convert(numVal, fromUnit, k) : null
          const isFrom = k === fromUnit
          return (
            <div key={k} style={{ ...cardStyle, border: isFrom ? '1px solid rgba(120,100,255,0.4)' : cardStyle.border }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{u.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: isFrom ? '#a78bfa' : '#e0e0ff', wordBreak: 'break-all' }}>
                {result !== null ? fmt(result) : '—'}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{u.symbol}</div>
            </div>
          )
        })}
      </div>

      <h3 style={{ fontSize: 14, color: '#888', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Bit Units</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {bitUnits.map(k => {
          const u = UNITS.find(x => x.key === k)!
          const result = isValid ? convert(numVal, fromUnit, k) : null
          const isFrom = k === fromUnit
          return (
            <div key={k} style={{ ...cardStyle, border: isFrom ? '1px solid rgba(120,100,255,0.4)' : cardStyle.border }}>
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
        Uses decimal standard: 1 KB = 1,000 bytes, 1 MB = 1,000,000 bytes, etc.
      </div>
    </div>
  )
}
