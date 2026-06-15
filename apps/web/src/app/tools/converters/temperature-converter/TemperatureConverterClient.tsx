'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Unit Definitions ─────────────────────────────────────────────────────────

const UNITS = [
  { key: 'c',  label: 'Celsius',    symbol: '°C',  industry: 'International standard (SI derived)' },
  { key: 'f',  label: 'Fahrenheit', symbol: '°F',  industry: 'Everyday use — United States' },
  { key: 'k',  label: 'Kelvin',     symbol: 'K',   industry: 'Scientific / thermodynamics — SI base' },
  { key: 'r',  label: 'Rankine',    symbol: '°R',  industry: 'Engineering thermodynamics (US)' },
  { key: 'de', label: 'Delisle',    symbol: '°De', industry: 'Historical — 18th-century Russia' },
  { key: 'n',  label: 'Newton',     symbol: '°N',  industry: 'Historical — proposed by Isaac Newton' },
  { key: 're', label: 'Réaumur',    symbol: '°Ré', industry: 'Historical — European dairy industry' },
  { key: 'ro', label: 'Rømer',      symbol: '°Rø', industry: 'Historical — Danish scale (pre-Celsius)' },
] as const

type UnitKey = typeof UNITS[number]['key']

// ─── Conversion Engine (all via Celsius) ──────────────────────────────────────

function toCelsius(v: number, from: UnitKey): number {
  switch (from) {
    case 'c':  return v
    case 'f':  return (v - 32) * 5 / 9
    case 'k':  return v - 273.15
    case 'r':  return (v - 491.67) * 5 / 9
    case 'de': return 100 - v * 2 / 3
    case 'n':  return v * 100 / 33
    case 're': return v * 5 / 4
    case 'ro': return (v - 7.5) * 40 / 21
  }
}

function fromCelsius(c: number, to: UnitKey): number {
  switch (to) {
    case 'c':  return c
    case 'f':  return c * 9 / 5 + 32
    case 'k':  return c + 273.15
    case 'r':  return (c + 273.15) * 9 / 5
    case 'de': return (100 - c) * 3 / 2
    case 'n':  return c * 33 / 100
    case 're': return c * 4 / 5
    case 'ro': return c * 21 / 40 + 7.5
  }
}

function convert(value: number, from: UnitKey, to: UnitKey): number {
  return fromCelsius(toCelsius(value, from), to)
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e9) return n.toExponential(4)
  const s = parseFloat(n.toPrecision(8)).toString()
  return s
}

// ─── Reference Points ─────────────────────────────────────────────────────────

const REFERENCES = [
  { label: 'Absolute Zero',       c: -273.15 },
  { label: 'Water Freezing',      c: 0 },
  { label: 'Room Temperature',    c: 22 },
  { label: 'Normal Body Temp',    c: 37 },
  { label: 'Water Boiling',       c: 100 },
  { label: 'Sun Surface',         c: 5505 },
]

// ─── Quick Values ─────────────────────────────────────────────────────────────

const QUICK: Array<{ label: string; value: number; unit: UnitKey }> = [
  { label: '−40°C', value: -40,  unit: 'c' },
  { label: '0°C',   value: 0,    unit: 'c' },
  { label: '20°C',  value: 20,   unit: 'c' },
  { label: '37°C',  value: 37,   unit: 'c' },
  { label: '100°C', value: 100,  unit: 'c' },
  { label: '212°F', value: 212,  unit: 'f' },
  { label: '98.6°F',value: 98.6, unit: 'f' },
  { label: '0 K',   value: 0,    unit: 'k' },
]

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(baseC: number) {
  const header = ['From \\ To', ...UNITS.map(u => u.symbol)].join(',')
  const rows = UNITS.map(from =>
    [from.symbol, ...UNITS.map(to => fmt(convert(fromCelsius(baseC, from.key), from.key, to.key)))].join(',')
  )
  const csv = [header, ...rows].join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'temperature-conversion-matrix.csv',
  })
  a.click()
}

// ─── Style Tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-2)', border: '1px solid var(--line-strong)',
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
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13,
  fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 12, textAlign: 'right',
  color: 'var(--fg-2)', whiteSpace: 'nowrap',
}

// ─── Copy helper ──────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#10b981' : 'var(--fg-3)', fontSize: 12, padding: '0 4px' }}
      title="Copy value"
      aria-label="Copy value"
    >
      {copied ? '✓' : '⎘'}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TemperatureConverterClient() {
  const [values, setValues] = useState<Record<UnitKey, string>>({
    c: '100', f: '', k: '', r: '', de: '', n: '', re: '', ro: '',
  })
  const [lastChanged, setLastChanged] = useState<UnitKey>('c')
  const [showMatrix, setShowMatrix] = useState(false)

  // ── Computed conversions ──
  const computed = useMemo<Record<UnitKey, number>>(() => {
    const raw = parseFloat(values[lastChanged])
    if (isNaN(raw)) return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: NaN }), {} as Record<UnitKey, number>)
    const celsiusVal = toCelsius(raw, lastChanged)
    return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: fromCelsius(celsiusVal, u.key) }), {} as Record<UnitKey, number>)
  }, [values, lastChanged])

  function handleChange(key: UnitKey, raw: string) {
    const newVals = { ...values, [key]: raw }
    // update all other fields display
    const num = parseFloat(raw)
    if (!isNaN(num)) {
      const c = toCelsius(num, key)
      UNITS.forEach(u => {
        if (u.key !== key) newVals[u.key] = fmt(fromCelsius(c, u.key))
      })
    }
    setValues(newVals)
    setLastChanged(key)
  }

  function applyQuick(value: number, unit: UnitKey) {
    const c = toCelsius(value, unit)
    const newVals = UNITS.reduce((acc, u) => ({ ...acc, [u.key]: fmt(fromCelsius(c, u.key)) }), {} as Record<UnitKey, string>)
    setValues(newVals)
    setLastChanged(unit)
  }

  const baseC = isFinite(computed['c']) ? computed['c'] : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── QUICK VALUES ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {QUICK.map(q => (
          <button key={q.label} onClick={() => applyQuick(q.value, q.unit)} style={BTN_GHOST}>
            {q.label}
          </button>
        ))}
      </div>

      {/* ── LIVE UNIT INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {UNITS.map(u => (
            <div key={u.key}>
              <label style={LABEL}>{u.label} ({u.symbol})</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number"
                  value={values[u.key]}
                  onChange={e => handleChange(u.key, e.target.value)}
                  placeholder="Enter value"
                  style={INPUT_BOX}
                  aria-label={u.label}
                />
                <CopyBtn text={values[u.key]} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3 }}>{u.industry}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REFERENCE POINTS ── */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Reference Points
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Temperature reference points">
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left' }}>Reference</th>
                {UNITS.map(u => <th key={u.key} style={TH}>{u.symbol}</th>)}
              </tr>
            </thead>
            <tbody>
              {REFERENCES.map(ref => (
                <tr key={ref.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => applyQuick(ref.c, 'c')}
                  title={`Click to load ${ref.label}`}
                >
                  <td style={{ ...TD, textAlign: 'left', color: 'var(--brand-2)', fontWeight: 600 }}>{ref.label}</td>
                  {UNITS.map(u => (
                    <td key={u.key} style={TD}>{fmt(fromCelsius(ref.c, u.key))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 8 }}>Click any row to load that reference point into the converter.</div>
      </div>

      {/* ── FULL CONVERSION MATRIX ── */}
      <div>
        <button
          onClick={() => setShowMatrix(v => !v)}
          style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-2)', border: '1px solid var(--line-strong)', borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          aria-expanded={showMatrix}
        >
          {showMatrix ? '▾' : '▸'} Full Conversion Matrix (1 unit of each → all others)
        </button>
        {showMatrix && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)' }}>
              <button onClick={() => exportCSV(baseC)} style={BTN_GHOST} aria-label="Export matrix CSV">
                ⬇ Export CSV
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Temperature conversion matrix">
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>1 unit →</th>
                    {UNITS.map(u => <th key={u.key} style={TH}>{u.symbol}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {UNITS.map(from => (
                    <tr key={from.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--brand-2)', fontWeight: 700 }}>1 {from.symbol}</td>
                      {UNITS.map(to => (
                        <td key={to.key} style={{ ...TD, background: from.key === to.key ? 'rgba(99,102,241,0.12)' : 'transparent' }}>
                          {from.key === to.key ? '1' : fmt(convert(1, from.key, to.key))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── INDUSTRY CONTEXT ── */}
      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Industry & Science Context
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Celsius (°C)</strong> — The international standard for everyday temperature. Used by 195+ countries. 0°C = water freezes, 100°C = water boils at sea level.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Fahrenheit (°F)</strong> — Standard in the United States. Human body temperature (98.6°F) and key weather benchmarks are well-represented on this scale.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Kelvin (K)</strong> — The SI base unit of thermodynamic temperature. 0 K = absolute zero, the coldest possible temperature. Critical in physics, chemistry, and astronomy. Note: no degree symbol.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Rankine (°R)</strong> — Absolute temperature scale using Fahrenheit degrees. Used in some US engineering fields (thermodynamics, aerospace). 0°R = absolute zero.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Delisle, Newton, Réaumur, Rømer</strong> — Historical scales from the 1700s. Réaumur (°Ré) was once widely used in France and Germany, particularly in food/dairy contexts. All are now obsolete in practice.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>−40°</strong> — The unique crossover point where Celsius and Fahrenheit are equal: −40°C = −40°F.
          </li>
        </ul>
      </div>
    </div>
  )
}
