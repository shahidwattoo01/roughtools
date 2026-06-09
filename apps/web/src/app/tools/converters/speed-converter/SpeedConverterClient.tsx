'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Units (all factors in m/s) ───────────────────────────────────────────────

const UNITS = [
  { key: 'ms',     label: 'Meters/Second',    symbol: 'm/s',      toMs: 1,                      industry: 'SI — base unit' },
  { key: 'kmh',    label: 'Kilometers/Hour',  symbol: 'km/h',     toMs: 1000 / 3600,            industry: 'Automotive / Weather' },
  { key: 'mph',    label: 'Miles/Hour',        symbol: 'mph',      toMs: 1609.344 / 3600,        industry: 'US / UK roads' },
  { key: 'fts',    label: 'Feet/Second',       symbol: 'ft/s',     toMs: 0.3048,                 industry: 'US Engineering' },
  { key: 'kn',     label: 'Knot',             symbol: 'kn',       toMs: 1852 / 3600,            industry: 'Aviation / Maritime' },
  { key: 'mach',   label: 'Mach (sea level)', symbol: 'Mach',     toMs: 343,                    industry: 'Aerospace' },
  { key: 'c',      label: 'Speed of Light',   symbol: 'c',        toMs: 299792458,              industry: 'Physics' },
  { key: 'cms',    label: 'Centimeters/Sec',  symbol: 'cm/s',     toMs: 0.01,                   industry: 'Science' },
  { key: 'mms',    label: 'Millimeters/Sec',  symbol: 'mm/s',     toMs: 0.001,                  industry: 'Science / Robotics' },
  { key: 'ftm',    label: 'Feet/Minute',      symbol: 'ft/min',   toMs: 0.3048 / 60,            industry: 'HVAC / Elevators' },
  { key: 'mim',    label: 'Miles/Minute',     symbol: 'mi/min',   toMs: 1609.344 / 60,          industry: 'Aerospace' },
  { key: 'mih',    label: 'Meters/Hour',      symbol: 'm/h',      toMs: 1 / 3600,               industry: 'Slow speeds' },
] as const

type UnitKey = typeof UNITS[number]['key']
const UNIT_MAP = Object.fromEntries(UNITS.map(u => [u.key, u])) as Record<UnitKey, typeof UNITS[number]>

function convert(value: number, from: UnitKey, to: UnitKey): number {
  return value * UNIT_MAP[from].toMs / UNIT_MAP[to].toMs
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e9 || abs < 1e-8) return n.toExponential(4)
  if (abs >= 1000) return n.toFixed(3)
  if (abs >= 1) return n.toFixed(5).replace(/\.?0+$/, '')
  return n.toPrecision(5)
}

const REFERENCE_POINTS = [
  { label: 'Snail',                    ms: 0.001 },
  { label: 'Human walking (avg)',      ms: 1.4 },
  { label: 'Usain Bolt (100m WR)',     ms: 10.44 },
  { label: 'Highway speed limit (US)', ms: 29.06 },
  { label: 'Commercial aircraft',      ms: 250 },
  { label: 'Speed of sound (sea lvl)',ms: 343 },
  { label: 'Low Earth orbit (ISS)',    ms: 7660 },
  { label: 'Speed of light',          ms: 299792458 },
]

const CARD: CSSProperties = { background: '#12121f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px 28px' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.45)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }
const COLORS = ['#6366f1','#f59e0b','#10b981','#38bdf8','#e879f9','#fb923c','#a78bfa','#34d399','#f472b6','#60a5fa','#4ade80','#fbbf24']

function MetricCard({ label, value, color = '#6366f1' }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: '16px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 900, color, wordBreak: 'break-all' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

function exportCSV() {
  const header = ['Reference', ...UNITS.map(u => `${u.label} (${u.symbol})`)]
  const rows = REFERENCE_POINTS.map(rp => [rp.label, ...UNITS.map(u => fmt(rp.ms / UNIT_MAP[u.key].toMs))])
  const csv = [header, ...rows].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'speed-conversion.csv' })
  a.click()
}

export default function SpeedConverterClient() {
  const initValues = Object.fromEntries(UNITS.map(u => [u.key, u.key === 'kmh' ? '100' : ''])) as Record<UnitKey, string>
  const [inputValues, setInputValues] = useState<Record<UnitKey, string>>(initValues)
  const [activeUnit, setActiveUnit] = useState<UnitKey>('kmh')
  const [copied, setCopied] = useState<string | null>(null)

  const computed = useMemo(() => {
    const raw = inputValues[activeUnit]
    const num = parseFloat(raw)
    if (raw === '' || isNaN(num)) return null
    const result = {} as Record<UnitKey, number>
    for (const u of UNITS) result[u.key] = convert(num, activeUnit, u.key)
    return result
  }, [inputValues, activeUnit])

  function handleChange(unit: UnitKey, val: string) {
    setActiveUnit(unit)
    setInputValues(prev => ({ ...prev, [unit]: val }))
  }

  function copyValue(unit: UnitKey) {
    const val = computed ? fmt(computed[unit]) : inputValues[unit]
    navigator.clipboard.writeText(val).then(() => { setCopied(unit); setTimeout(() => setCopied(null), 1500) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={CARD}>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Type in any field — all others update instantly. Mach is at sea level (343 m/s).</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
          {UNITS.map(u => {
            const color = COLORS[UNITS.findIndex(x => x.key === u.key) % COLORS.length]
            const displayVal = activeUnit === u.key ? inputValues[u.key] : computed ? fmt(computed[u.key]) : ''
            return (
              <div key={u.key} style={{ background: activeUnit === u.key ? 'rgba(99,102,241,0.08)' : 'transparent', border: `1px solid ${activeUnit === u.key ? 'rgba(99,102,241,0.4)' : 'transparent'}`, borderRadius: 10, padding: '10px 12px' }}>
                <label style={LABEL}>{u.label}<span style={{ marginLeft: 6, color, fontWeight: 700 }}>{u.symbol}</span></label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" value={displayVal} onChange={e => handleChange(u.key, e.target.value)} placeholder="0" style={{ ...INPUT_BOX, flex: 1 }} aria-label={u.label} />
                  <button onClick={() => copyValue(u.key)} style={{ ...BTN_GHOST, padding: '0 10px', fontSize: 12, background: copied === u.key ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.12)', color: copied === u.key ? '#34d399' : '#c4b5fd' }} title="Copy">{copied === u.key ? '✓' : '⎘'}</button>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{u.industry}</div>
              </div>
            )
          })}
        </div>
      </div>

      {computed && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {(['ms','kmh','mph','kn','mach','c'] as UnitKey[]).map((key, i) => (
            <MetricCard key={key} label={UNIT_MAP[key].label} value={`${fmt(computed[key])} ${UNIT_MAP[key].symbol}`} color={COLORS[i]} />
          ))}
        </div>
      )}

      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Conversion Matrix</h3>
          <button onClick={exportCSV} style={BTN_GHOST}>⬇ Export CSV</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {(() => {
            const mk = ['ms','kmh','mph','fts','kn','mach','cms'] as UnitKey[]
            return (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, textAlign: 'left' }}>1 →</th>
                    {mk.map(k => <th key={k} style={{ ...TH, color: COLORS[UNITS.findIndex(u => u.key === k) % COLORS.length] }}>{UNIT_MAP[k].symbol}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {mk.map((fromKey, ri) => (
                    <tr key={fromKey} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: COLORS[UNITS.findIndex(u => u.key === fromKey) % COLORS.length], fontWeight: 700 }}>1 {UNIT_MAP[fromKey].symbol}</td>
                      {mk.map((toKey, ci) => (
                        <td key={toKey} style={{ ...TD, background: ri === ci ? 'rgba(99,102,241,0.08)' : 'transparent', color: ri === ci ? 'var(--fg-3)' : 'var(--fg-2)' }}>
                          {ri === ci ? '1' : fmt(convert(1, fromKey, toKey))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          })()}
        </div>
      </div>

      <div style={CARD}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Real-World Reference Speeds</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ ...TH, textAlign: 'left' }}>Reference</th>
                {(['ms','kmh','mph','kn','mach'] as UnitKey[]).map(k => <th key={k} style={{ ...TH, color: COLORS[UNITS.findIndex(u => u.key === k) % COLORS.length] }}>{UNIT_MAP[k].symbol}</th>)}
              </tr>
            </thead>
            <tbody>
              {REFERENCE_POINTS.map((rp, i) => (
                <tr key={rp.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <td style={{ ...TD, textAlign: 'left', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{rp.label}</td>
                  {(['ms','kmh','mph','kn','mach'] as UnitKey[]).map(k => <td key={k} style={TD}>{fmt(rp.ms / UNIT_MAP[k].toMs)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Industry Standards</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { title: 'Aviation / Maritime', desc: 'Knots are universal in aviation and maritime. 1 knot = 1 nautical mile/hour = 1.852 km/h. Aircraft altimeters and speedometers use knots worldwide.' },
            { title: 'Automotive', desc: 'km/h used in most countries; mph in US, UK, Myanmar. Speed of sound in air: 343 m/s (1235 km/h, 767 mph). Sound barrier first broken in 1947.' },
            { title: 'Physics', desc: 'Speed of light (c) is the cosmic speed limit: 299,792,458 m/s exactly. GPS satellites need relativistic speed corrections. Mach 1 varies with altitude and temperature.' },
            { title: 'Aerospace', desc: 'Mach 1 = 343 m/s at sea level. Mach 5+ is hypersonic. Low Earth orbit requires ~7.9 km/s. Escape velocity from Earth is 11.2 km/s (Mach 32.6).' },
          ].map(item => (
            <div key={item.title} style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
