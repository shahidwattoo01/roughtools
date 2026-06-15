'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Units (all factors in mL) ────────────────────────────────────────────────

const UNITS = [
  { key: 'ml',     label: 'Milliliter / cm³',  symbol: 'mL',      toML: 1,              industry: 'Science / Medicine / Cooking' },
  { key: 'l',      label: 'Liter',             symbol: 'L',       toML: 1000,           industry: 'Metric — everyday liquids' },
  { key: 'm3',     label: 'Cubic Meter',       symbol: 'm³',      toML: 1e6,            industry: 'Large volumes / Engineering' },
  { key: 'in3',    label: 'Cubic Inch',        symbol: 'in³',     toML: 16.387064,      industry: 'US Engineering / Engines' },
  { key: 'ft3',    label: 'Cubic Foot',        symbol: 'ft³',     toML: 28316.846592,   industry: 'US Construction / Gas' },
  { key: 'yd3',    label: 'Cubic Yard',        symbol: 'yd³',     toML: 764554.857984,  industry: 'Construction / Concrete' },
  { key: 'usgal',  label: 'US Gallon',         symbol: 'US gal',  toML: 3785.411784,    industry: 'US fuel, beverages, pools' },
  { key: 'usqt',   label: 'US Quart',          symbol: 'US qt',   toML: 946.352946,     industry: 'US Culinary' },
  { key: 'uspt',   label: 'US Pint',           symbol: 'US pt',   toML: 473.176473,     industry: 'US Culinary / Beer' },
  { key: 'uscup',  label: 'US Cup',            symbol: 'US cup',  toML: 236.5882365,    industry: 'US Cooking / Baking' },
  { key: 'usfloz', label: 'US Fluid Ounce',    symbol: 'US fl oz',toML: 29.5735296,     industry: 'US Beverages / Retail' },
  { key: 'ustbsp', label: 'US Tablespoon',     symbol: 'US tbsp', toML: 14.78676478,    industry: 'US Cooking' },
  { key: 'ustsp',  label: 'US Teaspoon',       symbol: 'US tsp',  toML: 4.92892159,     industry: 'US Cooking' },
  { key: 'ukgal',  label: 'Imperial Gallon',   symbol: 'imp gal', toML: 4546.09,        industry: 'UK / Commonwealth fuel' },
  { key: 'ukqt',   label: 'Imperial Quart',    symbol: 'imp qt',  toML: 1136.5225,      industry: 'UK Culinary' },
  { key: 'ukpt',   label: 'Imperial Pint',     symbol: 'imp pt',  toML: 568.26125,      industry: 'UK / Irish pubs (beer)' },
  { key: 'bbl',    label: 'Oil Barrel (42 gal)',symbol: 'bbl',    toML: 158987.295,     industry: 'Oil & Gas industry' },
  { key: 'beerbbl',label: 'Beer Barrel (31 gal)',symbol: 'beer bbl',toML: 117347.765,   industry: 'US Brewing industry' },
] as const

type UnitKey = typeof UNITS[number]['key']
const UNIT_MAP = Object.fromEntries(UNITS.map(u => [u.key, u])) as Record<UnitKey, typeof UNITS[number]>

function convert(value: number, from: UnitKey, to: UnitKey): number {
  return value * UNIT_MAP[from].toML / UNIT_MAP[to].toML
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

// ─── Reference Points ─────────────────────────────────────────────────────────

const REFERENCES = [
  { label: 'Single espresso shot',   ml: 30 },
  { label: 'Wine bottle',            ml: 750 },
  { label: 'US gallon of milk',      ml: 3785.41 },
  { label: 'Average car fuel tank',  ml: 60000 },
  { label: 'Olympic swimming pool',  ml: 2.5e9 },
  { label: '1 oil barrel (42 gal)',  ml: 158987.295 },
]

// ─── Quick Values ─────────────────────────────────────────────────────────────

const QUICK: Array<{ label: string; value: number; unit: UnitKey }> = [
  { label: '1 mL',    value: 1,    unit: 'ml'    },
  { label: '1 L',     value: 1,    unit: 'l'     },
  { label: '1 US gal',value: 1,    unit: 'usgal' },
  { label: '1 imp gal',value: 1,   unit: 'ukgal' },
  { label: '1 ft³',   value: 1,    unit: 'ft3'   },
  { label: '750 mL',  value: 750,  unit: 'ml'    },
  { label: '1 bbl',   value: 1,    unit: 'bbl'   },
  { label: '1 cup',   value: 1,    unit: 'uscup' },
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
    download: 'volume-conversion-matrix.csv',
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

export default function VolumeConverterClient() {
  const [values, setValues] = useState<Record<UnitKey, string>>(
    () => UNITS.reduce((acc, u) => ({ ...acc, [u.key]: u.key === 'l' ? '1' : '' }), {} as Record<UnitKey, string>)
  )
  const [lastChanged, setLastChanged] = useState<UnitKey>('l')
  const [showMatrix, setShowMatrix] = useState(false)

  const _computed = useMemo<Record<UnitKey, number>>(() => {
    const raw = parseFloat(values[lastChanged])
    if (isNaN(raw)) return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: NaN }), {} as Record<UnitKey, number>)
    const ml = raw * UNIT_MAP[lastChanged].toML
    return UNITS.reduce((acc, u) => ({ ...acc, [u.key]: ml / UNIT_MAP[u.key].toML }), {} as Record<UnitKey, number>)
  }, [values, lastChanged])

  function handleChange(key: UnitKey, raw: string) {
    const num = parseFloat(raw)
    const newVals: Record<UnitKey, string> = { ...values, [key]: raw }
    if (!isNaN(num)) {
      const ml = num * UNIT_MAP[key].toML
      UNITS.forEach(u => {
        if (u.key !== key) newVals[u.key] = fmt(ml / UNIT_MAP[u.key].toML)
      })
    }
    setValues(newVals)
    setLastChanged(key)
  }

  function applyQuick(value: number, unit: UnitKey) {
    const ml = value * UNIT_MAP[unit].toML
    const newVals = UNITS.reduce((acc, u) => ({ ...acc, [u.key]: fmt(ml / UNIT_MAP[u.key].toML) }), {} as Record<UnitKey, string>)
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 16 }}>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Volume reference points">
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left' }}>Reference</th>
                {(['ml','l','usgal','usfloz','ft3','ukpt','bbl'] as UnitKey[]).map(k => (
                  <th key={k} style={TH}>{UNIT_MAP[k].symbol}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERENCES.map(ref => (
                <tr key={ref.label}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => applyQuick(ref.ml, 'ml')}
                  title="Click to load"
                >
                  <td style={{ ...TD, textAlign: 'left', color: 'var(--brand-2)', fontWeight: 600 }}>{ref.label}</td>
                  {(['ml','l','usgal','usfloz','ft3','ukpt','bbl'] as UnitKey[]).map(k => (
                    <td key={k} style={TD}>{fmt(ref.ml / UNIT_MAP[k].toML)}</td>
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
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }} aria-label="Volume conversion matrix">
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
            <strong style={{ color: 'var(--fg)' }}>US vs Imperial gallons</strong> — 1 US gallon = 3.785 L; 1 Imperial gallon = 4.546 L. They differ by ~20%. Always check which gallon is meant in recipes, fuel prices, and regulations.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Oil Barrel</strong> — The standard oil barrel is 42 US gallons (158.987 L), established in Pennsylvania in 1872. Global oil production is quoted in &quot;barrels per day&quot; (bbl/day).
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Beer Barrel</strong> — The US beer barrel = 31 US gallons (117.35 L) = 2 half-barrels (kegs). Craft breweries measure output in barrels; US total production is ~200 million barrels/year.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>UK Pint</strong> — The Imperial pint (568 mL) is 20% larger than the US pint (473 mL). Ordering a &quot;pint&quot; in a UK pub gives you noticeably more than in a US bar.
          </li>
          <li style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--fg)' }}>Cooking conversions</strong> — 1 US cup = 16 tbsp = 48 tsp = 8 fl oz = 236.6 mL. The metric equivalent is 250 mL for &quot;1 cup&quot; in Australian/UK recipes.
          </li>
        </ul>
      </div>
    </div>
  )
}
