'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Units (all factors in square meters) ────────────────────────────────────

const UNITS = [
  { key: 'mm2',  label: 'Sq Millimeter',     symbol: 'mm²',    toM2: 1e-6,            industry: 'Precision engineering' },
  { key: 'cm2',  label: 'Sq Centimeter',     symbol: 'cm²',    toM2: 1e-4,            industry: 'Science / Small surfaces' },
  { key: 'm2',   label: 'Sq Meter',          symbol: 'm²',     toM2: 1,               industry: 'SI base — rooms, floors' },
  { key: 'km2',  label: 'Sq Kilometer',      symbol: 'km²',    toM2: 1e6,             industry: 'Geography / Countries' },
  { key: 'in2',  label: 'Sq Inch',           symbol: 'in²',    toM2: 6.4516e-4,       industry: 'US Manufacturing / Print' },
  { key: 'ft2',  label: 'Sq Foot',           symbol: 'ft²',    toM2: 0.09290304,      industry: 'US Real Estate / Construction' },
  { key: 'yd2',  label: 'Sq Yard',           symbol: 'yd²',    toM2: 0.83612736,      industry: 'US / UK fabric, flooring' },
  { key: 'mi2',  label: 'Sq Mile',           symbol: 'mi²',    toM2: 2589988.110336,  industry: 'US Geography' },
  { key: 'ac',   label: 'Acre',              symbol: 'ac',     toM2: 4046.8564224,    industry: 'Agriculture / Real estate (US/UK)' },
  { key: 'ha',   label: 'Hectare',           symbol: 'ha',     toM2: 10000,           industry: 'Agriculture / Land (metric)' },
  { key: 'are',  label: 'Are',               symbol: 'a',      toM2: 100,             industry: 'Land area (legacy metric)' },
  { key: 'dun',  label: 'Dunam',             symbol: 'dunam',  toM2: 1000,            industry: 'Real estate (Middle East)' },
  { key: 'nmi2', label: 'Sq Nautical Mile',  symbol: 'nmi²',   toM2: 3429904,         industry: 'Maritime / Navigation' },
] as const

type UnitKey = typeof UNITS[number]['key']
const UNIT_MAP = Object.fromEntries(UNITS.map(u => [u.key, u])) as Record<UnitKey, typeof UNITS[number]>

function convert(value: number, from: UnitKey, to: UnitKey): number {
  return value * UNIT_MAP[from].toM2 / UNIT_MAP[to].toM2
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

// ─── Reference Points ─────────────────────────────────────────────────────────

const REFERENCES = [
  { label: 'Tennis court',           m2: 260.87 },
  { label: 'Basketball court (NBA)', m2: 436.64 },
  { label: 'American football field', m2: 5351.2 },
  { label: 'Central Park, NYC',      m2: 3.41e6 },
  { label: 'Manhattan island',       m2: 59.1e6 },
  { label: 'Texas',                  m2: 696241e6 },
]

// ─── Quick Values ─────────────────────────────────────────────────────────────

const QUICK: Array<{ label: string; value: number; unit: UnitKey }> = [
  { label: '1 m²',  value: 1,    unit: 'm2'  },
  { label: '1 ft²', value: 1,    unit: 'ft2' },
  { label: '1 ac',  value: 1,    unit: 'ac'  },
  { label: '1 ha',  value: 1,    unit: 'ha'  },
  { label: '1 km²', value: 1,    unit: 'km2' },
  { label: '1 mi²', value: 1,    unit: 'mi2' },
  { label: '100 m²',value: 100,  unit: 'm2'  },
  { label: '5 ac',  value: 5,    unit: 'ac'  },
]

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV() {
  const header = ['From \\ To (×1)', ...UNITS.map(u => u.symbol)].join(',')
  const rows = UNITS.map(from =>
    [from.symbol, ...UNITS.map(to => fmt(convert(1, from.key, to.key)))].join(',')
  )
  const csv = [header, ...rows].join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'area-conversion-matrix.csv',
  })
  a.click()
}

// ─── Style Tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: '#12121f', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
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
  color: 'rgba(255,255,255,0.45)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = {
  padding: '6px 12px', fontSize: 12, textAlign: 'right',
  color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap',
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#10b981' : 'var(--fg-3)', fontSize: 12, padding: '0 4px' }}
      title="Copy value" aria-label="Copy value"
    >
      {copied ? '✓' : '⎘'}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AreaConverterClient() {
  const [values, setValues] = useState<Record<UnitKey, string>>(
    () => UNITS.reduce((acc, u) => ({ ...acc, [u.key]: u.key === 'm2' ? '1' : '' }), {} as Record<UnitKey, string>)
  )
  const [lastChanged, setLastChanged] = useState<UnitKey>('m2')
  const [showMatrix, setShowMatrix] = useState(false)

  const computed = useMemo<Record<UnitKey, number>>(() => {
    const raw = parseFloat(values[lastChanged])
    if (isNaN(raw)) return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: NaN }), {} as Record<UnitKey, number>)
    const sqm = raw * UNIT_MAP[lastChanged].toM2
    return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: sqm / UNIT_MAP[u.key].toM2 }), {} as Record<UnitKey, number>)
  }, [values, lastChanged])

  function handleChange(key: UnitKey, raw: string) {
    const num = parseFloat(raw)
    const newVals: Record<UnitKey, string> = { ...values, [key]: raw }
    if (!isNaN(num)) {
      const sqm = num * UNIT_MAP[key].toM2
      UNITS.forEach(u => {
        if (u.key !== key) newVals[u.key] = fmt(sqm / UNIT_MAP[u.key].toM2)
      })
    }
    setValues(newVals)
    setLastChanged(key)
  }

  function applyQuick(value: number, unit: UnitKey) {
    const sqm = value * UNIT_MAP[unit].toM2
    const newVals = UNITS.reduce((acc, u) => ({ ...acc, [u.key]: fmt(sqm / UNIT_MAP[u.key].toM2) }), {} as Record<UnitKey, string>)
    setValues(newVals)
    setLastChanged(unit)
  }

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
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
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{u.industry}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REFERENCE POINTS ── */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Real-World References
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Area reference points">
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left' }}>Reference</th>
                {(['m2','ft2','yd2','ac','ha','km2','mi2'] as UnitKey[]).map(k => (
                  <th key={k} style={TH}>{UNIT_MAP[k].symbol}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERENCES.map(ref => (
                <tr key={ref.label}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => applyQuick(ref.m2, 'm2')}
                  title="Click to load"
                >
                  <td style={{ ...TD, textAlign: 'left', color: '#c4b5fd', fontWeight: 600 }}>{ref.label}</td>
                  {(['m2','ft2','yd2','ac','ha','km2','mi2'] as UnitKey[]).map(k => (
                    <td key={k} style={TD}>{fmt(ref.m2 / UNIT_MAP[k].toM2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Click any row to load into the converter.</div>
      </div>

      {/* ── FULL CONVERSION MATRIX ── */}
      <div>
        <button
          onClick={() => setShowMatrix(v => !v)}
          style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: '#12121f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          aria-expanded={showMatrix}
        >
          {showMatrix ? '▾' : '▸'} Full Conversion Matrix (1 of each unit → all others)
        </button>
        {showMatrix && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={exportCSV} style={BTN_GHOST}>⬇ Export CSV</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }} aria-label="Area conversion matrix">
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>1 unit →</th>
                    {UNITS.map(u => <th key={u.key} style={TH}>{u.symbol}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {UNITS.map(from => (
                    <tr key={from.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: '#c4b5fd', fontWeight: 700 }}>1 {from.symbol}</td>
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
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Industry Context
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Real Estate</strong> — US/UK agents use sq ft and acres. Continental Europe uses m² for floors and hectares for land. Middle East uses dunams (1000 m²).
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Agriculture</strong> — Farmers in the US measure in acres (1 ac ≈ 4047 m²). Internationally, the hectare is standard (1 ha = 10,000 m² = 2.47 acres). A football field is about 1.32 acres.
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Acre vs Hectare</strong> — 1 acre = 0.4047 ha. 1 hectare = 2.471 acres. The acre comes from the area a yoke of oxen could plough in a day.
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Country Sizes</strong> — The Vatican (0.44 km²) vs Russia (17.1 million km²). The US is 9.834 million km²; Texas alone is 696,000 km².
          </li>
        </ul>
      </div>
    </div>
  )
}
