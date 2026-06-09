'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
  borderRadius: 16, padding: '24px 28px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 15, boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
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
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)',
  whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── State grid carbon intensity (kg CO₂/kWh, EPA eGRID) ─────────────────────
const STATE_GRID: Record<string, number> = {
  AL:0.449, AK:0.454, AZ:0.345, AR:0.450, CA:0.210, CO:0.530, CT:0.247, DE:0.398,
  FL:0.401, GA:0.413, HI:0.684, ID:0.083, IL:0.333, IN:0.593, IA:0.439, KS:0.491,
  KY:0.640, LA:0.451, ME:0.158, MD:0.328, MA:0.272, MI:0.490, MN:0.367, MS:0.449,
  MO:0.542, MT:0.349, NE:0.498, NV:0.358, NH:0.196, NJ:0.248, NM:0.548, NY:0.245,
  NC:0.369, ND:0.689, OH:0.509, OK:0.491, OR:0.104, PA:0.388, RI:0.319, SC:0.330,
  SD:0.128, TN:0.347, TX:0.434, UT:0.605, VT:0.025, VA:0.308, WA:0.070, WV:0.742,
  WI:0.479, WY:0.870,
}
const US_AVG = 0.386
const STATE_LIST = [
  'US Average', 'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA',
  'WA','WV','WI','WY',
]

// ─── EPA conversion factors ───────────────────────────────────────────────────
// Gas: 8.887 kg CO₂/gal (EPA), Diesel: 10.180 kg CO₂/gal
const GAS_CO2_PER_GAL = 8.887
const DIESEL_CO2_PER_GAL = 10.180

// ─── Types ────────────────────────────────────────────────────────────────────
interface YearRow {
  year: number
  evCO2kg: number
  gasCO2kg: number
  diffKg: number
  annualSavings: number
  cumSavings: number
  cumCO2Offset: number
}
interface EvResult {
  annualGasCO2kg: number
  annualEvCO2kg: number
  annualCO2ReductionKg: number
  annualCO2ReductionTonnes: number
  annualFuelSavings: number
  lifetimeCO2Offset: number
  lifetimeSavings: number
  breakEvenYears: number | null
  schedule: YearRow[]
  gridIntensity: number
  // scenarios
  currentGridCO2: number
  halfRenewableCO2: number
  fullRenewableCO2: number
}

// ─── Calculation engine ───────────────────────────────────────────────────────
function calcEV(
  mpg: number,
  fuelType: 'gasoline' | 'diesel',
  milesPerYear: number,
  evKwhPer100mi: number,
  state: string,
  gasPricePerGal: number,
  electricityPerKwh: number,
  ownershipYears: number,
  evPremium: number,
): EvResult {
  const gridIntensity = state === 'US Average' ? US_AVG : (STATE_GRID[state] ?? US_AVG)
  const co2PerGal = fuelType === 'diesel' ? DIESEL_CO2_PER_GAL : GAS_CO2_PER_GAL

  // Gas CO₂ = miles × (1/MPG) × kg CO₂/gal
  const annualGasCO2kg = milesPerYear * (1 / mpg) * co2PerGal

  // EV CO₂ = miles × (kWh/100mi / 100) × grid intensity (kg CO₂/kWh)
  const evKwhPerMi = evKwhPer100mi / 100
  const annualEvCO2kg = milesPerYear * evKwhPerMi * gridIntensity

  const annualCO2ReductionKg = Math.max(0, annualGasCO2kg - annualEvCO2kg)
  const annualCO2ReductionTonnes = annualCO2ReductionKg / 1000

  // Fuel cost
  const annualGasCost = (milesPerYear / mpg) * gasPricePerGal
  const annualEvCost = milesPerYear * evKwhPerMi * electricityPerKwh
  const annualFuelSavings = annualGasCost - annualEvCost

  const lifetimeCO2Offset = annualCO2ReductionKg * ownershipYears
  const lifetimeSavings = annualFuelSavings * ownershipYears
  const breakEvenYears = evPremium > 0 && annualFuelSavings > 0
    ? evPremium / annualFuelSavings
    : null

  // Year-by-year schedule
  const schedule: YearRow[] = []
  let cumSavings = 0, cumCO2Offset = 0
  for (let yr = 1; yr <= ownershipYears; yr++) {
    cumSavings += annualFuelSavings
    cumCO2Offset += annualCO2ReductionKg
    schedule.push({
      year: yr,
      evCO2kg: Math.round(annualEvCO2kg),
      gasCO2kg: Math.round(annualGasCO2kg),
      diffKg: Math.round(annualCO2ReductionKg),
      annualSavings: Math.round(annualFuelSavings),
      cumSavings: Math.round(cumSavings),
      cumCO2Offset: Math.round(cumCO2Offset),
    })
  }

  // Scenarios: current grid vs 50% renewable vs 100% renewable
  const halfRenewableGrid = gridIntensity * 0.5
  const fullRenewableGrid = 0.02 // near-zero
  const currentGridCO2 = annualEvCO2kg
  const halfRenewableCO2 = milesPerYear * evKwhPerMi * halfRenewableGrid
  const fullRenewableCO2 = milesPerYear * evKwhPerMi * fullRenewableGrid

  return {
    annualGasCO2kg, annualEvCO2kg, annualCO2ReductionKg, annualCO2ReductionTonnes,
    annualFuelSavings, lifetimeCO2Offset, lifetimeSavings, breakEvenYears, schedule,
    gridIntensity, currentGridCO2, halfRenewableCO2, fullRenewableCO2,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const $ = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })
const kg = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' kg'
const t = (n: number) => (n / 1000).toFixed(2) + ' t'

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'number', min, max, step, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; min?: number; max?: number; step?: number; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} min={min} max={max} step={step}
        style={INPUT_BOX} aria-label={label} />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EvCarbonClient() {
  const [mpg,          setMpg]          = useState('28')
  const [fuelType,     setFuelType]     = useState<'gasoline' | 'diesel'>('gasoline')
  const [miles,        setMiles]        = useState('12000')
  const [evKwh,        setEvKwh]        = useState('28')
  const [state,        setState]        = useState('US Average')
  const [gasPrice,     setGasPrice]     = useState('3.50')
  const [elecPrice,    setElecPrice]    = useState('0.13')
  const [years,        setYears]        = useState('8')
  const [evPremium,    setEvPremium]    = useState('5000')
  const [showTable,    setShowTable]    = useState(false)
  const [showAdv,      setShowAdv]      = useState(false)

  const result = useMemo<EvResult | null>(() => {
    const mpgN = parseFloat(mpg) || 0
    const milesN = parseFloat(miles) || 0
    const evKwhN = parseFloat(evKwh) || 28
    const gasPriceN = parseFloat(gasPrice) || 3.50
    const elecN = parseFloat(elecPrice) || 0.13
    const yearsN = parseInt(years) || 8
    const premiumN = parseFloat(evPremium) || 0
    if (mpgN <= 0 || milesN <= 0) return null
    return calcEV(mpgN, fuelType, milesN, evKwhN, state, gasPriceN, elecN, yearsN, premiumN)
  }, [mpg, fuelType, miles, evKwh, state, gasPrice, elecPrice, years, evPremium])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Field label="Current Car MPG" value={mpg} onChange={setMpg} placeholder="28" min={1} max={200} step={1} hint="EPA combined MPG" />
          <div>
            <label style={LABEL}>Fuel Type</label>
            <select value={fuelType} onChange={e => setFuelType(e.target.value as 'gasoline' | 'diesel')} style={INPUT_BOX}>
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>
          <Field label="Miles / Year" value={miles} onChange={setMiles} placeholder="12000" min={0} step={1000} hint="Annual mileage" />
          <div>
            <label style={LABEL}>State Grid</label>
            <select value={state} onChange={e => setState(e.target.value)} style={INPUT_BOX} aria-label="State">
              {STATE_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--line-strong)' }}>
            <Field label="EV kWh / 100 mi" value={evKwh} onChange={setEvKwh} placeholder="28" min={10} max={60} step={1} hint="EPA default ≈28" />
            <Field label="Gas Price ($/gal)" value={gasPrice} onChange={setGasPrice} placeholder="3.50" min={0} step={0.10} />
            <Field label="Electricity ($/kWh)" value={elecPrice} onChange={setElecPrice} placeholder="0.13" min={0} step={0.01} />
            <Field label="Ownership (years)" value={years} onChange={setYears} placeholder="8" min={1} max={25} step={1} />
            <Field label="EV Price Premium ($)" value={evPremium} onChange={setEvPremium} placeholder="5000" min={0} step={500} hint="For break-even calc" />
          </div>
        )}
      </div>

      {/* ── RESULTS ── */}
      {result ? (
        <>
          {/* Summary metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Annual CO₂ Reduction" value={kg(result.annualCO2ReductionKg)} sub={t(result.annualCO2ReductionKg) + ' tonnes'} color="#10b981" />
            <MetricCard label="Annual Fuel Savings" value={$(result.annualFuelSavings)} color="#6366f1" />
            <MetricCard label="Lifetime CO₂ Offset" value={t(result.lifetimeCO2Offset)} sub={`Over ${years} years`} color="#38bdf8" />
            <MetricCard label="Lifetime Fuel Savings" value={$(result.lifetimeSavings)} color="#f59e0b" />
            {result.breakEvenYears !== null && (
              <MetricCard
                label="Break-Even Point"
                value={result.breakEvenYears > 0 ? result.breakEvenYears.toFixed(1) + ' yrs' : 'Immediate'}
                sub="Fuel savings vs EV premium"
                color="#e879f9"
              />
            )}
          </div>

          {/* CO₂ comparison bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Annual CO₂ Comparison
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: `Gas Car (${mpg} MPG)`, value: result.annualGasCO2kg, color: '#f59e0b', max: result.annualGasCO2kg },
                { label: 'EV (your grid)', value: result.annualEvCO2kg, color: '#6366f1', max: result.annualGasCO2kg },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{row.label}</span>
                    <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{kg(row.value)}</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: row.color, borderRadius: 5, width: `${(row.value / row.max) * 100}%`, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid scenario comparison */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Grid Scenario Analysis
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Scenario', 'EV CO₂/yr', 'vs Gas Car', 'CO₂ Saved'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: `Current Grid (${state})`, co2: result.currentGridCO2, highlight: true },
                    { label: '50% Renewable Grid', co2: result.halfRenewableCO2, highlight: false },
                    { label: '100% Renewable Grid', co2: result.fullRenewableCO2, highlight: false },
                  ].map(({ label, co2, highlight }) => (
                    <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: highlight ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                      <td style={{ ...TD, textAlign: 'left', color: highlight ? '#c4b5fd' : 'var(--fg-2)', fontWeight: highlight ? 700 : 400 }}>{highlight ? '★ ' : ''}{label}</td>
                      <td style={TD}>{kg(co2)}</td>
                      <td style={{ ...TD, color: '#f59e0b' }}>{kg(result.annualGasCO2kg)}</td>
                      <td style={{ ...TD, color: '#10b981', fontWeight: 600 }}>{kg(Math.max(0, result.annualGasCO2kg - co2))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Year-by-year toggle */}
          <div>
            <button
              onClick={() => setShowTable(v => !v)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              aria-expanded={showTable}
            >
              {showTable ? '▾' : '▸'} Year-by-Year Comparison Table
              <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)', marginLeft: 10 }}>({years} years)</span>
            </button>
            {showTable && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Year-by-year EV vs gas comparison">
                    <thead>
                      <tr>
                        {['Year', 'EV CO₂ (kg)', 'Gas CO₂ (kg)', 'CO₂ Saved', 'Annual Savings', 'Cum. Savings', 'Cum. CO₂ Offset'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map(row => (
                        <tr key={row.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--fg-3)', fontWeight: 700, textAlign: 'center' }}>{row.year}</td>
                          <td style={{ ...TD, color: '#6366f1' }}>{row.evCO2kg.toLocaleString()}</td>
                          <td style={{ ...TD, color: '#f59e0b' }}>{row.gasCO2kg.toLocaleString()}</td>
                          <td style={{ ...TD, color: '#10b981', fontWeight: 600 }}>{row.diffKg.toLocaleString()}</td>
                          <td style={TD}>{$(row.annualSavings)}</td>
                          <td style={{ ...TD, fontWeight: 600 }}>{$(row.cumSavings)}</td>
                          <td style={{ ...TD, color: '#38bdf8' }}>{row.cumCO2Offset.toLocaleString()} kg</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>TOTAL</td>
                        <td colSpan={3} style={{ ...TD, color: '#10b981', fontWeight: 700 }}>{kg(result.lifetimeCO2Offset)} CO₂ offset</td>
                        <td colSpan={3} style={{ ...TD, color: '#6366f1', fontWeight: 700 }}>{$(result.lifetimeSavings)} total fuel savings</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Guidance */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Key Insights
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                result.annualCO2ReductionKg > 0
                  ? `Switching to an EV on the ${state} grid saves ${kg(result.annualCO2ReductionKg)} of CO₂ per year — equivalent to planting ~${Math.round(result.annualCO2ReductionKg / 21)} trees annually.`
                  : `Your current grid (${(result.gridIntensity * 1000).toFixed(0)} g CO₂/kWh) is relatively carbon-intensive. The EV still reduces total lifecycle emissions, especially as the grid gets cleaner.`,
                result.annualFuelSavings > 0
                  ? `At ${gasPrice} $/gal gas and ${elecPrice} $/kWh electricity, you save approximately ${$(result.annualFuelSavings)}/year on fuel — ${$(result.lifetimeSavings)} over ${years} years.`
                  : `Your electricity rate (${elecPrice} $/kWh) is higher than typical. Check off-peak charging rates to maximize savings.`,
                result.breakEvenYears !== null && result.breakEvenYears > 0
                  ? `With a $${parseFloat(evPremium).toLocaleString()} EV price premium, the break-even point is ${result.breakEvenYears.toFixed(1)} years through fuel savings alone — before accounting for lower maintenance costs.`
                  : null,
              ].filter(Boolean).map((tip, i) => (
                <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>{tip}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your current car MPG and annual miles above — results update instantly.
        </div>
      )}
    </div>
  )
}
