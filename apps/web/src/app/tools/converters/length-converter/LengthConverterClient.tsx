'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Units (all factors in meters) ───────────────────────────────────────────

const UNITS = [
  { key: 'mm',   label: 'Millimeter',        symbol: 'mm',   toM: 1e-3,                      industry: 'Engineering / Manufacturing' },
  { key: 'cm',   label: 'Centimeter',        symbol: 'cm',   toM: 1e-2,                      industry: 'Everyday (height, clothing)' },
  { key: 'm',    label: 'Meter',             symbol: 'm',    toM: 1,                         industry: 'SI base unit — universal' },
  { key: 'km',   label: 'Kilometer',         symbol: 'km',   toM: 1e3,                       industry: 'Road distances' },
  { key: 'in',   label: 'Inch',              symbol: 'in',   toM: 0.0254,                    industry: 'US / Imperial' },
  { key: 'ft',   label: 'Foot',              symbol: 'ft',   toM: 0.3048,                    industry: 'US / Imperial (construction)' },
  { key: 'yd',   label: 'Yard',              symbol: 'yd',   toM: 0.9144,                    industry: 'US / Imperial (fabric, sports)' },
  { key: 'mi',   label: 'Mile',              symbol: 'mi',   toM: 1609.344,                  industry: 'US roads' },
  { key: 'nmi',  label: 'Nautical Mile',     symbol: 'nmi',  toM: 1852,                      industry: 'Aviation / Maritime' },
  { key: 'ly',   label: 'Light Year',        symbol: 'ly',   toM: 9.4607304725808e15,        industry: 'Astronomy (stellar distances)' },
  { key: 'au',   label: 'Astronomical Unit', symbol: 'AU',   toM: 1.495978707e11,            industry: 'Astronomy (solar system)' },
  { key: 'ang',  label: 'Angstrom',          symbol: 'Å',    toM: 1e-10,                     industry: 'Chemistry / Crystallography' },
  { key: 'um',   label: 'Micrometer',        symbol: 'µm',   toM: 1e-6,                      industry: 'Optics / Precision machining' },
  { key: 'nm',   label: 'Nanometer',         symbol: 'nm',   toM: 1e-9,                      industry: 'Semiconductors / Biology' },
  { key: 'fur',  label: 'Furlong',           symbol: 'fur',  toM: 201.168,                   industry: 'Horse racing' },
] as const

type UnitKey = typeof UNITS[number]['key']
const UNIT_MAP = Object.fromEntries(UNITS.map(u => [u.key, u])) as Record<UnitKey, typeof UNITS[number]>

function convert(value: number, from: UnitKey, to: UnitKey): number {
  return value * UNIT_MAP[from].toM / UNIT_MAP[to].toM
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

// ─── Reference Points ─────────────────────────────────────────────────────────

const REFERENCES = [
  { label: 'Width of a human hair',   m: 70e-6 },
  { label: 'Height of Eiffel Tower',  m: 330 },
  { label: 'Marathon race',           m: 42195 },
  { label: 'Earth circumference',     m: 40075016.686 },
  { label: 'Earth–Moon distance',     m: 384400e3 },
  { label: 'Earth–Sun distance (1 AU)', m: 1.495978707e11 },
]

// ─── Quick Values ─────────────────────────────────────────────────────────────

const QUICK: Array<{ label: string; value: number; unit: UnitKey }> = [
  { label: '1 m',    value: 1,       unit: 'm'   },
  { label: '1 km',   value: 1,       unit: 'km'  },
  { label: '1 mi',   value: 1,       unit: 'mi'  },
  { label: '1 ft',   value: 1,       unit: 'ft'  },
  { label: '1 in',   value: 1,       unit: 'in'  },
  { label: '1 nmi',  value: 1,       unit: 'nmi' },
  { label: '5′ 10″', value: 177.8,   unit: 'cm'  },
  { label: '100 yd', value: 100,     unit: 'yd'  },
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
    download: 'length-conversion-matrix.csv',
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

export default function LengthConverterClient() {
  const [values, setValues] = useState<Record<UnitKey, string>>(
    () => UNITS.reduce((acc, u) => ({ ...acc, [u.key]: u.key === 'm' ? '1' : '' }), {} as Record<UnitKey, string>)
  )
  const [lastChanged, setLastChanged] = useState<UnitKey>('m')
  const [showMatrix, setShowMatrix] = useState(false)

  const _computed = useMemo<Record<UnitKey, number>>(() => {
    const raw = parseFloat(values[lastChanged])
    if (isNaN(raw)) return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: NaN }), {} as Record<UnitKey, number>)
    const meters = raw * UNIT_MAP[lastChanged].toM
    return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: meters / UNIT_MAP[u.key].toM }), {} as Record<UnitKey, number>)
  }, [values, lastChanged])

  function handleChange(key: UnitKey, raw: string) {
    const num = parseFloat(raw)
    const newVals: Record<UnitKey, string> = { ...values, [key]: raw }
    if (!isNaN(num)) {
      const meters = num * UNIT_MAP[key].toM
      UNITS.forEach(u => {
        if (u.key !== key) newVals[u.key] = fmt(meters / UNIT_MAP[u.key].toM)
      })
    }
    setValues(newVals)
    setLastChanged(key)
  }

  function applyQuick(value: number, unit: UnitKey) {
    const meters = value * UNIT_MAP[unit].toM
    const newVals = UNITS.reduce((acc, u) => ({ ...acc, [u.key]: fmt(meters / UNIT_MAP[u.key].toM) }), {} as Record<UnitKey, string>)
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
              <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3 }}>{u.industry}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REFERENCE POINTS ── */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Real-World References
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Length reference points">
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left' }}>Reference</th>
                {['m', 'km', 'mi', 'ft', 'in', 'nmi', 'ly', 'au'].map(k => {
                  const u = UNIT_MAP[k as UnitKey]
                  return <th key={k} style={TH}>{u.symbol}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {REFERENCES.map(ref => (
                <tr key={ref.label}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => applyQuick(ref.m, 'm')}
                  title="Click to load"
                >
                  <td style={{ ...TD, textAlign: 'left', color: 'var(--brand-2)', fontWeight: 600 }}>{ref.label}</td>
                  {(['m','km','mi','ft','in','nmi','ly','au'] as UnitKey[]).map(k => (
                    <td key={k} style={TD}>{fmt(ref.m / UNIT_MAP[k].toM)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 8 }}>Click any row to load into the converter.</div>
      </div>

      {/* ── FULL CONVERSION MATRIX ── */}
      <div>
        <button
          onClick={() => setShowMatrix(v => !v)}
          style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-2)', border: '1px solid var(--line-strong)', borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          aria-expanded={showMatrix}
        >
          {showMatrix ? '▾' : '▸'} Full Conversion Matrix (1 of each unit → all others)
        </button>
        {showMatrix && (
          <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)' }}>
              <button onClick={exportCSV} style={BTN_GHOST}>⬇ Export CSV</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }} aria-label="Length conversion matrix">
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
          Industry Context
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Metric (SI)</strong> — Used in science, engineering, and 195+ countries. The meter is defined by the speed of light: 1 m = distance light travels in 1/299,792,458 of a second.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Imperial / US Customary</strong> — The US remains one of only 3 countries not officially using SI. Construction, aviation (altitude in feet), and consumer products commonly use inches, feet, and miles.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Nautical Mile</strong> — Defined as 1 arc-minute of latitude (1/60th of a degree). 1 nautical mile = 1.852 km. Aviation and maritime navigation use knots (nautical miles per hour) for speed.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Nanometer & Angstrom</strong> — Semiconductor transistors are now measured in nanometers (e.g., 3 nm process node). DNA double helix diameter ≈ 2 nm. Atomic radii are measured in Angstroms (1 Å = 0.1 nm).
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Light Year</strong> — The distance light travels in one year: ~9.46 × 10¹⁵ m. The nearest star (Proxima Centauri) is 4.24 light years away. Not a unit of time.
          </li>
        </ul>
      </div>
    </div>
  )
}
