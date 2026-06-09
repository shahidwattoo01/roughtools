'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Historical average CPI inflation rates (US BLS data) ─────────────────────

const HISTORICAL_RATES = [
  { label: '2024 (YTD) ~3.2%', value: '3.2' },
  { label: '2023 ~4.1%',       value: '4.1' },
  { label: '2022 ~8.0%',       value: '8.0' },
  { label: '2021 ~4.7%',       value: '4.7' },
  { label: '2010–2020 avg ~1.8%', value: '1.8' },
  { label: '2000–2010 avg ~2.6%', value: '2.6' },
  { label: '1990–2000 avg ~3.0%', value: '3.0' },
  { label: '1980–1990 avg ~5.6%', value: '5.6' },
  { label: '1970–1980 avg ~7.5%', value: '7.5' },
  { label: 'Fed target ~2%',   value: '2.0' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface YearRow {
  year: number
  value: number           // cumulative future value of original amount
  realValue: number       // original amount's purchasing power in this year's dollars
  annualLoss: number      // purchasing power lost this year
  cumulativeLoss: number  // total purchasing power lost since year 0
  cumulativeInflation: number  // % total inflation since year 0
}

interface InflationResult {
  originalAmount: number
  futureRequired: number   // what you need in N years to match today's purchasing power
  realValueNow: number     // what past amount is worth in today's dollars (reverse calc)
  totalInflation: number   // % total over period
  purchasingPowerLost: number  // %
  doublingTime: number         // years to halve purchasing power (Rule of 70)
  schedule: YearRow[]
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function calcInflation(amount: number, rate: number, years: number): InflationResult | null {
  if (amount <= 0 || years <= 0) return null
  const r = rate / 100

  // Future equivalent: how much you need in "years" years for same purchasing power
  const futureRequired = amount * Math.pow(1 + r, years)
  // Past equivalent: what this amount was worth "years" ago
  const realValueNow   = amount / Math.pow(1 + r, years)
  const totalInflation = (Math.pow(1 + r, years) - 1) * 100
  const purchasingPowerLost = (1 - Math.pow(1 / (1 + r), years)) * 100
  const doublingTime = r > 0 ? Math.log(2) / Math.log(1 + r) : Infinity  // exact compound version

  // Year-by-year schedule
  const schedule: YearRow[] = []
  for (let y = 1; y <= years; y++) {
    const value = amount * Math.pow(1 + r, y)
    const realValue = amount * Math.pow(1 / (1 + r), y)  // purchasing power in today's dollars
    const annualLoss = schedule.length > 0
      ? (schedule[schedule.length - 1].realValue - realValue)
      : (amount - realValue)
    const cumulativeLoss = amount - realValue
    const cumulativeInflation = (Math.pow(1 + r, y) - 1) * 100
    schedule.push({ year: y, value, realValue, annualLoss, cumulativeLoss, cumulativeInflation })
  }

  return { originalAmount: amount, futureRequired, realValueNow, totalInflation, purchasingPowerLost, doublingTime, schedule }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const $2 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const $ = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const pct = (n: number, d = 2) => n.toFixed(d) + '%'

function exportCSV(schedule: YearRow[], amount: number, filename: string) {
  const hdr = ['Year','Future Equivalent','Purchasing Power (in today\'s $)','Annual PP Loss','Cumulative PP Loss','Cumulative Inflation']
  const rows = schedule.map(r => [
    r.year, r.value.toFixed(2), r.realValue.toFixed(2),
    r.annualLoss.toFixed(2), r.cumulativeLoss.toFixed(2),
    r.cumulativeInflation.toFixed(2) + '%',
  ])
  const csv = [hdr, ...rows].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InflationCalculatorClient() {

  const [amount,   setAmount]   = useState('1000')
  const [rate,     setRate]     = useState('3')
  const [years,    setYears]    = useState('20')
  const [showSched, setShowSched] = useState(false)

  const AMT = parseFloat(amount) || 0
  const R   = parseFloat(rate)   || 0
  const Y   = parseInt(years)    || 0

  const result = useMemo<InflationResult | null>(() =>
    calcInflation(AMT, R, Y), [AMT, R, Y])

  // Scenarios: different inflation rates
  const scenarios = useMemo(() => {
    if (AMT <= 0 || Y <= 0) return null
    return [1, 2, 3, 4, 5, 6, 8, 10].map(r => {
      const res = calcInflation(AMT, r, Y)!
      return { rate: r, futureRequired: res.futureRequired, powerLost: res.purchasingPowerLost }
    })
  }, [AMT, Y])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
          <div>
            <label style={LABEL}>Amount ($)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="1,000" min={0} step={100} style={INPUT_BOX} aria-label="Amount" />
          </div>
          <div>
            <label style={LABEL}>Annual Inflation Rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)}
              placeholder="3" min={0} max={50} step={0.1} style={INPUT_BOX} aria-label="Inflation rate" />
            <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
              {[2, 3, 4, 5, 8].map(r => (
                <button key={r} onClick={() => setRate(String(r))} style={{
                  padding: '3px 9px', fontSize: 11, borderRadius: 20, cursor: 'pointer',
                  background: rate === String(r) ? 'rgba(139,92,246,0.4)' : 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(139,92,246,0.3)', color: rate === String(r) ? '#e9d5ff' : '#c4b5fd',
                  fontWeight: rate === String(r) ? 700 : 400,
                }}>{r}%</button>
              ))}
            </div>
          </div>
          <div>
            <label style={LABEL}>Number of Years</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)}
              placeholder="20" min={1} max={100} style={INPUT_BOX} aria-label="Years" />
          </div>
          <div>
            <label style={LABEL}>Historical Rate Presets</label>
            <select value="" onChange={e => e.target.value && setRate(e.target.value)}
              style={INPUT_BOX} aria-label="Historical rate preset">
              <option value="">— Select a historical rate —</option>
              {HISTORICAL_RATES.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Future Cost (same buying power)" value={$2(result.futureRequired)} color="#f59e0b"
              sub={`In ${Y} years at ${pct(R, 1)} inflation`} />
            <MetricCard label="Purchasing Power Lost"  value={pct(result.purchasingPowerLost, 1)} color="#f87171"
              sub={`${$2(result.originalAmount - result.schedule[Y-1]?.realValue)} in today's $`} />
            <MetricCard label="Total Inflation"         value={pct(result.totalInflation, 1)}     color="#fb923c"
              sub={`Cumulative over ${Y} years`} />
            <MetricCard label="PP Halving Time (Rule 70)" value={result.doublingTime < Infinity ? result.doublingTime.toFixed(1) + ' years' : '∞'} color="#e879f9"
              sub={`Purchasing power halves in ${result.doublingTime < Infinity ? result.doublingTime.toFixed(0) : '∞'} years`} />
          </div>

          {/* Context bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Purchasing Power Erosion Over {Y} Years
            </div>
            <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: result.schedule[Y-1]?.realValue ?? 0, background: '#10b981' }} title={`Remaining purchasing power: ${$2(result.schedule[Y-1]?.realValue ?? 0)}`} />
              <div style={{ flex: result.originalAmount - (result.schedule[Y-1]?.realValue ?? 0), background: '#f87171' }} title={`Lost: ${$2(result.originalAmount - (result.schedule[Y-1]?.realValue ?? 0))}`} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', fontSize: 11 }}>
              {[
                { l: 'Remaining Purchasing Power', v: $2(result.schedule[Y-1]?.realValue ?? 0), c: '#10b981' },
                { l: 'Purchasing Power Lost',       v: $2(result.originalAmount - (result.schedule[Y-1]?.realValue ?? 0)), c: '#f87171' },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 1, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>{l}:</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 2: YEAR-BY-YEAR SCHEDULE */}
          <div>
            <button onClick={() => setShowSched(v => !v)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              aria-expanded={showSched}>
              {showSched ? '▾' : '▸'} Year-by-Year Inflation Schedule ({Y} years)
            </button>

            {showSched && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => exportCSV(result.schedule, AMT, 'inflation-schedule')} style={BTN_GHOST}>⬇ Export CSV</button>
                  <button onClick={async () => exportCalcPDF({
                    toolName: 'Inflation Calculator',
                    inputs: [
                      { label: 'Amount', value: $2(AMT) },
                      { label: 'Annual Inflation Rate', value: pct(R, 1) },
                      { label: 'Years', value: String(Y) },
                    ],
                    results: [
                      { label: 'Future Cost (same buying power)', value: $2(result.futureRequired), highlight: true },
                      { label: 'Purchasing Power Lost',           value: pct(result.purchasingPowerLost, 1) },
                      { label: 'Total Inflation',                  value: pct(result.totalInflation, 1) },
                      { label: 'PP Halving Time',                  value: result.doublingTime.toFixed(1) + ' years' },
                    ],
                  })} style={BTN_GHOST}>📄 Export PDF</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Inflation year-by-year schedule">
                    <thead>
                      <tr>{['Year','Future Equivalent','Purchasing Power (today $)','Annual PP Loss','Cum. PP Lost','Cum. Inflation'].map(h => (
                        <th key={h} style={TH}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {result.schedule.map(row => (
                        <tr key={row.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.year}</td>
                          <td style={{ ...TD, color: '#f59e0b' }}>{$2(row.value)}</td>
                          <td style={{ ...TD, color: '#10b981' }}>{$2(row.realValue)}</td>
                          <td style={{ ...TD, color: '#f87171' }}>{$2(row.annualLoss)}</td>
                          <td style={{ ...TD, color: '#f87171', fontWeight: 600 }}>{$2(row.cumulativeLoss)}</td>
                          <td style={TD}>{pct(row.cumulativeInflation, 1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* TIER 3: SCENARIO COMPARISON */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Inflation Rate Sensitivity — {$2(AMT)} Over {Y} Years
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>{['Rate','Future Cost (same PP)','PP Loss (%)','PP Loss ($)'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Rate' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {scenarios.map(s => {
                      const isBase = String(s.rate) === rate || Math.abs(s.rate - R) < 0.01
                      return (
                        <tr key={s.rate} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isBase ? 'rgba(139,92,246,0.08)' : 'transparent', cursor: 'pointer' }}
                          onClick={() => setRate(String(s.rate))}>
                          <td style={{ ...TD, textAlign: 'left', color: isBase ? '#c4b5fd' : 'var(--fg-2)', fontWeight: isBase ? 700 : 400 }}>
                            {isBase ? '★ ' : ''}{s.rate}%
                            {s.rate === 2 && ' (Fed target)'}
                            {s.rate === 3 && ' (historical avg)'}
                            {s.rate === 8 && ' (2022 level)'}
                          </td>
                          <td style={{ ...TD, color: '#f59e0b', fontWeight: isBase ? 700 : 400 }}>{$2(s.futureRequired)}</td>
                          <td style={{ ...TD, color: '#f87171' }}>{pct(s.powerLost, 1)}</td>
                          <td style={{ ...TD, color: '#f87171' }}>{$(AMT * s.powerLost / 100)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TIER 4: GUIDANCE */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              💡 What This Means for Your Money
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                At {pct(R, 1)} inflation, {$2(AMT)} today will require <strong style={{ color: '#f59e0b' }}>{$2(result.futureRequired)}</strong> in {Y} years to buy the same goods — the money hasn&apos;t grown, prices have.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Purchasing power halves every <strong style={{ color: '#e879f9' }}>{result.doublingTime.toFixed(0)} years</strong> at {pct(R, 1)} inflation (Rule of 70: 70 ÷ {R} = {(70 / R).toFixed(1)} years). Cash held in savings earning below {pct(R, 1)} loses real value every year.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                To protect against inflation: invest in assets with returns that historically beat inflation — broad stock market indices (~7–10% nominal, ~4–7% real), TIPS (Treasury Inflation-Protected Securities), real estate, and I-Bonds. The key is that your return <em>rate</em> must exceed the inflation rate.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                The Fed&apos;s 2% target represents &apos;stable&apos; inflation. Even at this low rate, <strong>{$2(AMT)}</strong> today requires <strong>{$2(calcInflation(AMT, 2, Y)!.futureRequired)}</strong> in {Y} years. Inflation&apos;s erosive effect is real even at &apos;normal&apos; levels.
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter an amount, inflation rate, and time period above — results update instantly.
        </div>
      )}
    </div>
  )
}
