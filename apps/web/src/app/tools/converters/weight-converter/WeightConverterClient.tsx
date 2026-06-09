'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Units (all factors in grams) ────────────────────────────────────────────

const UNITS = [
  { key: 'mg',   label: 'Milligram',        symbol: 'mg',    toG: 1e-3,             industry: 'Medicine / Pharmaceuticals' },
  { key: 'g',    label: 'Gram',             symbol: 'g',     toG: 1,                industry: 'Cooking / Science' },
  { key: 'kg',   label: 'Kilogram',         symbol: 'kg',    toG: 1e3,              industry: 'SI base unit — universal' },
  { key: 'mt',   label: 'Metric Ton',       symbol: 't',     toG: 1e6,              industry: 'Industry / Shipping' },
  { key: 'lb',   label: 'Pound',            symbol: 'lb',    toG: 453.59237,        industry: 'US / Imperial' },
  { key: 'oz',   label: 'Ounce',            symbol: 'oz',    toG: 28.349523125,     industry: 'US Culinary / Retail' },
  { key: 'st',   label: 'Stone',            symbol: 'st',    toG: 6350.29318,       industry: 'UK body weight' },
  { key: 'ston', label: 'Short Ton (US)',   symbol: 'sh tn', toG: 907184.74,        industry: 'US Industry / Agriculture' },
  { key: 'lton', label: 'Long Ton (UK)',    symbol: 'lg tn', toG: 1016046.9088,     industry: 'UK / Maritime shipping' },
  { key: 'toz',  label: 'Troy Ounce',       symbol: 'tr oz', toG: 31.1034768,       industry: 'Precious metals (gold, silver)' },
  { key: 'tlb',  label: 'Troy Pound',       symbol: 'tr lb', toG: 373.2417216,      industry: 'Precious metals' },
  { key: 'ct',   label: 'Carat',            symbol: 'ct',    toG: 0.2,              industry: 'Gemstones (diamonds)' },
  { key: 'gr',   label: 'Grain',            symbol: 'gr',    toG: 0.06479891,       industry: 'Ammunition / Pharma' },
  { key: 'slug', label: 'Slug',             symbol: 'slug',  toG: 14593.902937206,  industry: 'Physics (US customary)' },
] as const

type UnitKey = typeof UNITS[number]['key']
const UNIT_MAP = Object.fromEntries(UNITS.map(u => [u.key, u])) as Record<UnitKey, typeof UNITS[number]>

function convert(value: number, from: UnitKey, to: UnitKey): number {
  return value * UNIT_MAP[from].toG / UNIT_MAP[to].toG
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

// ─── Reference Points ─────────────────────────────────────────────────────────

const REFERENCES = [
  { label: 'US Nickel coin',        g: 5 },
  { label: '1 lb butter',           g: 453.59 },
  { label: 'Average adult human',   g: 70000 },
  { label: '1 metric ton (car)',     g: 1e6 },
  { label: 'Large shipping container', g: 30e6 },
  { label: '1 troy oz gold',        g: 31.1035 },
]

// ─── Quick Values ─────────────────────────────────────────────────────────────

const QUICK: Array<{ label: string; value: number; unit: UnitKey }> = [
  { label: '1 g',   value: 1,    unit: 'g'    },
  { label: '1 kg',  value: 1,    unit: 'kg'   },
  { label: '1 lb',  value: 1,    unit: 'lb'   },
  { label: '1 oz',  value: 1,    unit: 'oz'   },
  { label: '1 st',  value: 1,    unit: 'st'   },
  { label: '1 t',   value: 1,    unit: 'mt'   },
  { label: '70 kg', value: 70,   unit: 'kg'   },
  { label: '1 tr oz', value: 1,  unit: 'toz'  },
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
    download: 'weight-conversion-matrix.csv',
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

export default function WeightConverterClient() {
  const [values, setValues] = useState<Record<UnitKey, string>>(
    () => UNITS.reduce((acc, u) => ({ ...acc, [u.key]: u.key === 'kg' ? '1' : '' }), {} as Record<UnitKey, string>)
  )
  const [lastChanged, setLastChanged] = useState<UnitKey>('kg')
  const [showMatrix, setShowMatrix] = useState(false)

  const computed = useMemo<Record<UnitKey, number>>(() => {
    const raw = parseFloat(values[lastChanged])
    if (isNaN(raw)) return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: NaN }), {} as Record<UnitKey, number>)
    const grams = raw * UNIT_MAP[lastChanged].toG
    return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: grams / UNIT_MAP[u.key].toG }), {} as Record<UnitKey, number>)
  }, [values, lastChanged])

  function handleChange(key: UnitKey, raw: string) {
    const num = parseFloat(raw)
    const newVals: Record<UnitKey, string> = { ...values, [key]: raw }
    if (!isNaN(num)) {
      const grams = num * UNIT_MAP[key].toG
      UNITS.forEach(u => {
        if (u.key !== key) newVals[u.key] = fmt(grams / UNIT_MAP[u.key].toG)
      })
    }
    setValues(newVals)
    setLastChanged(key)
  }

  function applyQuick(value: number, unit: UnitKey) {
    const grams = value * UNIT_MAP[unit].toG
    const newVals = UNITS.reduce((acc, u) => ({ ...acc, [u.key]: fmt(grams / UNIT_MAP[u.key].toG) }), {} as Record<UnitKey, string>)
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Weight reference points">
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left' }}>Reference</th>
                {(['mg','g','kg','lb','oz','st','mt','toz'] as UnitKey[]).map(k => (
                  <th key={k} style={TH}>{UNIT_MAP[k].symbol}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERENCES.map(ref => (
                <tr key={ref.label}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => applyQuick(ref.g, 'g')}
                  title="Click to load"
                >
                  <td style={{ ...TD, textAlign: 'left', color: '#c4b5fd', fontWeight: 600 }}>{ref.label}</td>
                  {(['mg','g','kg','lb','oz','st','mt','toz'] as UnitKey[]).map(k => (
                    <td key={k} style={TD}>{fmt(ref.g / UNIT_MAP[k].toG)}</td>
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
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }} aria-label="Weight conversion matrix">
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
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Kilogram</strong> — The SI base unit of mass. Since 2019, defined by fixing Planck's constant. 1 kg = 1000 g. Note: technically "mass" not "weight" — weight is mass × gravity.
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Pound vs Kilogram</strong> — 1 lb = 453.592 g. The US uses pounds for body weight; the UK uses stone+pounds. Most of the world uses kg for body weight.
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Tons: Short vs Long vs Metric</strong> — Short ton (US) = 2000 lb ≈ 907 kg. Long ton (UK) = 2240 lb ≈ 1016 kg. Metric ton = exactly 1000 kg. Always specify which "ton" in contracts.
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Troy Ounce</strong> — Precious metals (gold, silver, platinum) are always quoted in troy ounces. 1 troy oz = 31.1035 g, heavier than the avoirdupois ounce (28.35 g).
          </li>
          <li style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Carat</strong> — Gem weight unit. 1 ct = 0.2 g (metric carat). A 1-carat diamond weighs 200 mg. Not to be confused with karat (gold purity).
          </li>
        </ul>
      </div>
    </div>
  )
}
