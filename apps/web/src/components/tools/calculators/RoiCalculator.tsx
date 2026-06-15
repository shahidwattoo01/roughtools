'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoiResult {
  netProfit: number
  roi: number               // simple ROI %
  cagr: number              // annualized ROI (CAGR) %
  multiple: number          // return multiple (x)
  paybackYears: number      // time to break even if earning income stream
  afterTaxProfit: number
  afterTaxROI: number
  afterTaxCAGR: number
}

interface YearRow {
  year: number
  value: number
  gain: number
  cumulativeROI: number
}

// ─── Engines ─────────────────────────────────────────────────────────────────

function calcROI(
  initial: number,
  finalValue: number,
  additionalCosts: number,
  annualIncome: number,    // annual income generated (rental, dividends, etc.)
  years: number,
  months: number,
  taxRate: number,
): RoiResult | null {
  if (initial <= 0) return null
  const totalInvested = initial + additionalCosts
  const totalIncome   = annualIncome * (years + months / 12)
  const totalReturn   = finalValue + totalIncome
  const netProfit     = totalReturn - totalInvested
  const roi           = (netProfit / totalInvested) * 100
  const t             = years + months / 12
  const cagr          = t > 0 ? (Math.pow(totalReturn / totalInvested, 1 / t) - 1) * 100 : 0
  const multiple      = totalInvested > 0 ? totalReturn / totalInvested : 0
  const paybackYears  = annualIncome > 0 ? totalInvested / annualIncome : Infinity

  const taxableProfitShare = netProfit * (taxRate / 100)
  const afterTaxProfit     = netProfit - taxableProfitShare
  const afterTaxROI        = (afterTaxProfit / totalInvested) * 100
  const afterTaxCAGR       = t > 0 ? (Math.pow((totalInvested + afterTaxProfit) / totalInvested, 1 / t) - 1) * 100 : 0

  return { netProfit, roi, cagr, multiple, paybackYears, afterTaxProfit, afterTaxROI, afterTaxCAGR }
}

function buildYearlySchedule(
  initial: number,
  additionalCosts: number,
  annualIncome: number,
  targetFinalValue: number,
  years: number,
  months: number,
): YearRow[] {
  const totalInvested = initial + additionalCosts
  const t = years + months / 12
  if (t <= 0) return []

  // If we have a target final value, use linear interpolation for the asset value
  // (for appreciation-based investments)
  const rows: YearRow[] = []
  const totalSteps = Math.ceil(t)

  for (let y = 1; y <= totalSteps; y++) {
    const fracYear = Math.min(y, t)
    const assetValue = totalInvested + (targetFinalValue - initial) * (fracYear / t)
    const incomeToDate = annualIncome * fracYear
    const totalValue = assetValue + incomeToDate
    const gain = totalValue - totalInvested
    const cumROI = (gain / totalInvested) * 100

    rows.push({ year: y, value: totalValue, gain, cumulativeROI: cumROI })
  }
  return rows
}

// ─── Formats ─────────────────────────────────────────────────────────────────

const $ = (n: number, dec = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const pct = (n: number, d = 2) => (n >= 0 ? '+' : '') + n.toFixed(d) + '%'
const pctRaw = (n: number, d = 2) => n.toFixed(d) + '%'

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoiCalculator() {

  // Core
  const [initial,    setInitial]    = useState('10000')
  const [finalValue, setFinalValue] = useState('15000')
  const [years,      setYears]      = useState('3')
  const [months,     setMonths]     = useState('0')

  // Advanced
  const [extraCosts, setExtraCosts] = useState('0')
  const [annualIncome, setAnnualIncome] = useState('0')
  const [taxRate,    setTaxRate]    = useState('20')
  const [showAdv,    setShowAdv]    = useState(false)
  const [showSched,  setShowSched]  = useState(false)

  const INI  = parseFloat(initial)    || 0
  const FIN  = parseFloat(finalValue) || 0
  const YRS  = parseInt(years)        || 0
  const MOS  = parseInt(months)       || 0
  const EC   = parseFloat(extraCosts) || 0
  const AI   = parseFloat(annualIncome) || 0
  const TAX  = parseFloat(taxRate)    || 0

  const result = useMemo<RoiResult | null>(() =>
    calcROI(INI, FIN, EC, AI, YRS, MOS, TAX),
    [INI, FIN, EC, AI, YRS, MOS, TAX]
  )

  const schedule = useMemo<YearRow[]>(() =>
    buildYearlySchedule(INI, EC, AI, FIN, YRS, MOS),
    [INI, EC, AI, FIN, YRS, MOS]
  )

  // Scenarios: different return multiples
  const scenarios = useMemo(() => {
    if (INI <= 0) return null
    const t = YRS + MOS / 12
    if (t <= 0) return null
    const s = (fin: number) => calcROI(INI, fin, EC, AI, YRS, MOS, TAX)
    const loss25   = INI * 0.75 + AI * t  // 25% loss of asset
    const loss10   = INI * 0.90 + AI * t
    const gain25   = INI * 1.25 + AI * t
    const gain50   = INI * 1.50 + AI * t
    return {
      base:   result,
      loss25: s(INI * 0.75),
      loss10: s(INI * 0.90),
      gain25: s(INI * 1.25),
      gain50: s(INI * 1.50),
    }
  }, [INI, EC, AI, YRS, MOS, TAX, result])

  const guidance = useMemo(() => {
    if (!result) return []
    const t = YRS + MOS / 12
    const tips: string[] = []

    if (result.roi < 0) {
      tips.push(`This investment lost ${$(-result.netProfit)} — a ${Math.abs(result.roi).toFixed(1)}% loss. Analyze what went wrong: was it market conditions, timing, costs, or fundamental business/property issues?`)
    } else {
      tips.push(`This investment returned ${$(result.netProfit)} profit — a ${result.roi.toFixed(1)}% total ROI over ${t.toFixed(1)} year${t !== 1 ? 's' : ''}. ` +
        `The annualized CAGR of ${pctRaw(result.cagr)} ${result.cagr >= 10 ? 'exceeds the historical S&P 500 average (~10%), excellent performance.' : result.cagr >= 7 ? 'is in line with long-term stock market returns (~7-10%).' : 'is below long-term equity market returns — consider whether this risk-return tradeoff is justified.'}`)
    }

    if (TAX > 0) {
      tips.push(`After ${pctRaw(TAX)} capital gains tax, your take-home profit is ${$(result.afterTaxProfit)} (after-tax ROI: ${pctRaw(result.afterTaxROI)}, after-tax CAGR: ${pctRaw(result.afterTaxCAGR)}). Long-term capital gains (held >1 year) are taxed at a lower rate than short-term gains.`)
    }

    if (result.paybackYears < Infinity && result.paybackYears > 0) {
      tips.push(`At ${$(AI)}/year income, your payback period is ${result.paybackYears.toFixed(1)} years — the time until cash flows alone recover your investment, regardless of asset appreciation.`)
    }

    if (result.multiple >= 2) {
      tips.push(`A ${result.multiple.toFixed(2)}x return multiple means every $1 invested returned $${result.multiple.toFixed(2)}. Elite VC funds target ≥3x; real estate investors often target 1.5–2x.`)
    }

    return tips
  }, [result, YRS, MOS, TAX, AI])

  function Field({ label, value, onChange, placeholder, min, max, step, hint }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; min?: number; max?: number; step?: number; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} min={min} max={max} step={step} style={INPUT_BOX} aria-label={label} />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  const roi = result?.roi ?? 0
  const positive = roi >= 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Field label="Initial Investment ($)"    value={initial}    onChange={setInitial}    placeholder="10,000" min={0} step={500} hint="Total amount invested" />
          <Field label="Final / Exit Value ($)"    value={finalValue} onChange={setFinalValue} placeholder="15,000" min={0} step={500} hint="Sale price or current value" />
          <Field label="Holding Period (Years)"    value={years}      onChange={setYears}      placeholder="3"      min={0} />
          <Field label="Holding Period (Months)"   value={months}     onChange={setMonths}     placeholder="0"      min={0} max={11} />
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Additional Costs ($)"       value={extraCosts}   onChange={setExtraCosts}   placeholder="0"  min={0} step={100} hint="Fees, repairs, carrying costs, etc." />
            <Field label="Annual Income from Asset ($)" value={annualIncome} onChange={setAnnualIncome} placeholder="0" min={0} step={100} hint="Rental income, dividends, etc." />
            <Field label="Tax Rate on Gains (%)"      value={taxRate}      onChange={setTaxRate}      placeholder="20" min={0} max={100} step={1} hint="Capital gains tax rate" />
          </div>
        )}
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          {/* Hero ROI */}
          <div style={{ ...CARD, textAlign: 'center', background: positive ? 'rgba(16,185,129,0.06)' : 'rgba(248,113,113,0.06)', borderColor: positive ? 'rgba(16,185,129,0.25)' : 'rgba(248,113,113,0.25)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Return on Investment
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: positive ? '#10b981' : '#f87171', lineHeight: 1 }}>
              {pct(result.roi, 1)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 8 }}>
              Net Profit: <strong style={{ color: positive ? '#10b981' : '#f87171' }}>{$(result.netProfit)}</strong>
              {' · '}Return Multiple: <strong style={{ color: 'var(--fg-2)' }}>{result.multiple.toFixed(2)}x</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Annualized CAGR"  value={pct(result.cagr, 2)}         color={result.cagr >= 0 ? '#6366f1' : '#f87171'} />
            <MetricCard label="Return Multiple"  value={`${result.multiple.toFixed(2)}x`} color="#38bdf8" />
            <MetricCard label="Net Profit"        value={$(result.netProfit)}          color={positive ? '#10b981' : '#f87171'} />
            {TAX > 0 && (
              <MetricCard label="After-Tax ROI"   value={pctRaw(result.afterTaxROI)}  color="#f59e0b"
                sub={`After ${pctRaw(TAX)} tax`} />
            )}
            {result.paybackYears < Infinity && (
              <MetricCard label="Payback Period"  value={`${result.paybackYears.toFixed(1)} yrs`} color="#e879f9"
                sub="From income alone" />
            )}
          </div>

          {/* TIER 2: YEAR-BY-YEAR */}
          {schedule.length > 0 && (
            <div>
              <button onClick={() => setShowSched(v => !v)} style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer' }} aria-expanded={showSched}>
                {showSched ? '▾' : '▸'} Year-by-Year Value Schedule
              </button>

              {showSched && (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                    <button onClick={async () => exportCalcPDF({
                      toolName: 'ROI Calculator',
                      inputs: [
                        { label: 'Initial Investment', value: $(INI) },
                        { label: 'Exit Value',         value: $(FIN) },
                        { label: 'Holding Period',     value: `${YRS}y ${MOS}m` },
                        { label: 'Additional Costs',   value: $(EC) },
                        { label: 'Annual Income',      value: $(AI) },
                        { label: 'Tax Rate',           value: pctRaw(TAX) },
                      ],
                      results: [
                        { label: 'ROI',            value: pct(result.roi, 2),          highlight: true },
                        { label: 'CAGR',           value: pct(result.cagr, 2),         highlight: true },
                        { label: 'Net Profit',     value: $(result.netProfit) },
                        { label: 'Return Multiple',value: `${result.multiple.toFixed(2)}x` },
                        { label: 'After-Tax ROI',  value: pctRaw(result.afterTaxROI) },
                      ],
                    })} style={BTN_GHOST}>
                      📄 Export PDF
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="ROI year-by-year schedule">
                      <thead>
                        <tr>{['Year','Total Value','Gain / Loss','Cumulative ROI'].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {schedule.map(row => (
                          <tr key={row.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ ...TD, color: 'var(--fg-3)' }}>{row.year}</td>
                            <td style={{ ...TD, fontWeight: 600 }}>{$(row.value)}</td>
                            <td style={{ ...TD, color: row.gain >= 0 ? '#10b981' : '#f87171', fontWeight: 600 }}>
                              {row.gain >= 0 ? '+' : ''}{$(row.gain)}
                            </td>
                            <td style={{ ...TD, color: row.cumulativeROI >= 0 ? '#6366f1' : '#f87171' }}>
                              {pct(row.cumulativeROI, 1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TIER 3: SCENARIOS */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Scenario Analysis — Sensitivity to Exit Value
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>{['Scenario','Exit Value','ROI','CAGR','Net Profit'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Scenario' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[
                      { label: '−25% loss',  res: scenarios.loss25, exv: INI * 0.75 },
                      { label: '−10% loss',  res: scenarios.loss10, exv: INI * 0.90 },
                      { label: `Base (current)`, res: scenarios.base, exv: FIN, hi: true },
                      { label: '+25% gain',  res: scenarios.gain25, exv: INI * 1.25 },
                      { label: '+50% gain',  res: scenarios.gain50, exv: INI * 1.50 },
                    ].map(({ label, res, exv, hi }) => res ? (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hi ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: hi ? '#c4b5fd' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{hi ? '★ ' : ''}{label}</td>
                        <td style={TD}>{$(exv)}</td>
                        <td style={{ ...TD, color: res.roi >= 0 ? '#10b981' : '#f87171', fontWeight: hi ? 700 : 400 }}>{pct(res.roi, 1)}</td>
                        <td style={{ ...TD, color: res.cagr >= 0 ? '#6366f1' : '#f87171' }}>{pct(res.cagr, 1)}</td>
                        <td style={{ ...TD, color: res.netProfit >= 0 ? '#10b981' : '#f87171' }}>{$(res.netProfit)}</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TIER 4: GUIDANCE */}
          {guidance.length > 0 && (
            <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                💡 What Your Numbers Mean
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {guidance.map((tip, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your initial investment and exit/final value above — results update instantly.
        </div>
      )}
    </div>
  )
}
