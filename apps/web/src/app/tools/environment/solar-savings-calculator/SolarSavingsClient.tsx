'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style Tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px',
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
  borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer',
}
const TH: CSSProperties = {
  padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap',
}
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '18px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, min, max, step, hint, type = 'number' }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; min?: number; max?: number; step?: number; hint?: string; type?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} min={min} max={max} step={step} style={INPUT_BOX} aria-label={label} />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

function SelectField({ label, value, onChange, options, hint }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; hint?: string
}) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...INPUT_BOX, cursor: 'pointer' }} aria-label={label}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

// ─── State Peak Sun Hours (NREL) ─────────────────────────────────────────────

const STATE_SUN_HOURS: Record<string, number> = {
  AZ: 6.57, NM: 6.77, NV: 6.41, CA: 5.82, TX: 5.26, FL: 5.42, CO: 5.37, HI: 5.59,
  UT: 5.26, OK: 5.13, KS: 5.13, LA: 5.02, AR: 4.96, GA: 5.02, SC: 4.99, MS: 4.99,
  AL: 4.96, NC: 4.93, TN: 4.90, VA: 4.87, MD: 4.84, DE: 4.78, NJ: 4.66, PA: 4.54,
  NY: 4.44, CT: 4.44, RI: 4.41, MA: 4.38, NH: 4.22, VT: 4.19, ME: 4.16, WA: 4.02,
  OR: 4.26, ID: 5.00, MT: 4.93, WY: 5.26, ND: 4.96, SD: 4.99, NE: 5.02, MN: 4.54,
  IA: 4.60, WI: 4.48, IL: 4.54, MI: 4.22, OH: 4.15, IN: 4.38, MO: 4.81, KY: 4.60,
  WV: 4.48, AK: 3.50,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CashFlowRow {
  year: number; production: number; savings: number; loanPayment: number; net: number; cumulative: number
}

interface SolarResult {
  systemKw: number; annualProduction: number; annualSavings: number; paybackYears: number
  totalCost: number; netCost: number; savings25yr: number; co2OffsetTonnes: number; irrPct: number
  breakEvenYear: number; cashFlow: CashFlowRow[]
}

// ─── NREL PVWatts Calculation Engine ─────────────────────────────────────────

function calcSolar(inp: {
  monthlyBill: number; utilityRate: number; billIncreaseRate: number
  systemKwOverride: number; state: string; systemCostPerWatt: number
  federalTaxCreditPct: number; stateIncentive: number
  loanEnabled: boolean; loanRate: number; loanTermYears: number
  panelDegradationPct: number; yearsOwnership: number
}): SolarResult | null {
  if (inp.utilityRate <= 0) return null
  const sunHours = STATE_SUN_HOURS[inp.state] ?? 4.5
  // Auto-size system from monthly bill or use override
  const annualUsage = (inp.monthlyBill / inp.utilityRate) * 12
  const systemKw = inp.systemKwOverride > 0
    ? inp.systemKwOverride
    : Math.max(1, (annualUsage / (sunHours * 365 * 0.8)))
  const grossCost = systemKw * 1000 * inp.systemCostPerWatt
  const federalCredit = grossCost * (inp.federalTaxCreditPct / 100)
  const netCost = grossCost - federalCredit - inp.stateIncentive

  // Loan monthly payment
  const loanRate = inp.loanEnabled ? inp.loanRate / 100 / 12 : 0
  const loanN    = inp.loanEnabled ? inp.loanTermYears * 12 : 0
  const loanPmt  = inp.loanEnabled && loanRate > 0
    ? (netCost * loanRate * Math.pow(1 + loanRate, loanN)) / (Math.pow(1 + loanRate, loanN) - 1)
    : inp.loanEnabled ? netCost / loanN : 0
  const annualLoanPayment = loanPmt * 12

  // PVWatts: Year 1 base production
  const baseProduction = systemKw * sunHours * 365 * 0.8
  const gridFactor = 0.386  // US avg kg CO2e/kWh
  const co2OffsetTonnes = (baseProduction * gridFactor) / 1000

  // 25-year cash flow projection
  const years = Math.min(inp.yearsOwnership, 25)
  const cashFlow: CashFlowRow[] = []
  let cumulative = -netCost
  let breakEvenYear = -1
  const annualCashFlows: number[] = [-netCost]

  for (let y = 1; y <= years; y++) {
    const degradFactor = Math.pow(1 - inp.panelDegradationPct / 100, y - 1)
    const production = baseProduction * degradFactor
    const rateThisYear = inp.utilityRate * Math.pow(1 + inp.billIncreaseRate / 100, y - 1)
    const savings = production * rateThisYear
    const loanPayment = y <= inp.loanTermYears ? annualLoanPayment : 0
    const net = savings - loanPayment
    cumulative += net
    if (breakEvenYear < 0 && cumulative >= 0) breakEvenYear = y
    cashFlow.push({ year: y, production: Math.round(production), savings: Math.round(savings), loanPayment: Math.round(loanPayment), net: Math.round(net), cumulative: Math.round(cumulative) })
    annualCashFlows.push(net)
  }

  // Simple IRR via Newton-Raphson
  let irrPct = 0
  let r = 0.08
  for (let i = 0; i < 100; i++) {
    let npv = 0, dnpv = 0
    annualCashFlows.forEach((cf, t) => {
      const disc = Math.pow(1 + r, t)
      npv  += cf / disc
      dnpv -= t * cf / (disc * (1 + r))
    })
    const next = r - npv / dnpv
    if (Math.abs(next - r) < 1e-8) { r = next; break }
    r = next < -0.99 ? 0.001 : next
  }
  irrPct = r * 100

  const savings25yr = cashFlow.reduce((s, row) => s + row.savings, 0)

  return {
    systemKw: Math.round(systemKw * 10) / 10, annualProduction: Math.round(baseProduction),
    annualSavings: Math.round(cashFlow[0]?.savings ?? 0),
    paybackYears: breakEvenYear > 0 ? breakEvenYear : years + 1,
    totalCost: Math.round(grossCost), netCost: Math.round(netCost),
    savings25yr: Math.round(savings25yr), co2OffsetTonnes: Math.round(co2OffsetTonnes * 10) / 10,
    irrPct: Math.round(irrPct * 10) / 10, breakEvenYear,
    cashFlow,
  }
}

const $c = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SolarSavingsClient() {
  const [monthlyBill,         setMonthlyBill]         = useState('150')
  const [utilityRate,         setUtilityRate]         = useState('0.17')
  const [billIncreaseRate,    setBillIncreaseRate]     = useState('3.5')
  const [systemKwOverride,    setSystemKwOverride]     = useState('')
  const [state,               setState]               = useState('CA')
  const [systemCostPerWatt,   setSystemCostPerWatt]   = useState('3.00')
  const [federalTaxCredit,    setFederalTaxCredit]    = useState('30')
  const [stateIncentive,      setStateIncentive]      = useState('0')
  const [loanEnabled,         setLoanEnabled]         = useState(false)
  const [loanRate,            setLoanRate]            = useState('6.0')
  const [loanTermYears,       setLoanTermYears]       = useState('10')
  const [panelDegradation,    setPanelDegradation]    = useState('0.5')
  const [yearsOwnership,      setYearsOwnership]      = useState('25')
  const [showTable,           setShowTable]           = useState(false)
  const [showAll,             setShowAll]             = useState(false)

  const inputs = useMemo(() => ({
    monthlyBill: parseFloat(monthlyBill) || 150,
    utilityRate: parseFloat(utilityRate) || 0.17,
    billIncreaseRate: parseFloat(billIncreaseRate) || 3.5,
    systemKwOverride: parseFloat(systemKwOverride) || 0,
    state,
    systemCostPerWatt: parseFloat(systemCostPerWatt) || 3.00,
    federalTaxCreditPct: parseFloat(federalTaxCredit) || 30,
    stateIncentive: parseFloat(stateIncentive) || 0,
    loanEnabled,
    loanRate: parseFloat(loanRate) || 6.0,
    loanTermYears: parseInt(loanTermYears) || 10,
    panelDegradationPct: parseFloat(panelDegradation) || 0.5,
    yearsOwnership: parseInt(yearsOwnership) || 25,
  }), [monthlyBill, utilityRate, billIncreaseRate, systemKwOverride, state,
      systemCostPerWatt, federalTaxCredit, stateIncentive, loanEnabled,
      loanRate, loanTermYears, panelDegradation, yearsOwnership])

  const result = useMemo(() => calcSolar(inputs), [inputs])

  // Scenarios
  const scenarios = useMemo(() => {
    if (!result) return null
    const cash   = calcSolar({ ...inputs, loanEnabled: false })
    const loan   = calcSolar({ ...inputs, loanEnabled: true })
    const noSolar = null // represent with utility cost only
    return { cash, loan, noSolar }
  }, [inputs, result])

  const displayRows = result ? (showAll ? result.cashFlow : result.cashFlow.slice(0, 10)) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Electricity & System Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
          <Field label="Monthly Electric Bill ($)" value={monthlyBill} onChange={setMonthlyBill} placeholder="150" min={0} step={10} hint="Average monthly utility bill" />
          <Field label="Utility Rate ($/kWh)" value={utilityRate} onChange={setUtilityRate} placeholder="0.17" min={0.01} step={0.01} hint="Current rate per kWh" />
          <Field label="Annual Bill Increase (%)" value={billIncreaseRate} onChange={setBillIncreaseRate} placeholder="3.5" min={0} max={15} step={0.5} hint="Historical avg ~3.5%/yr" />
          <SelectField label="State" value={state} onChange={setState} hint="NREL peak sun hours" options={
            Object.keys(STATE_SUN_HOURS).sort().map(s => ({ value: s, label: s + ' (' + STATE_SUN_HOURS[s].toFixed(2) + ' hrs/day)' }))
          } />
          <Field label="Override System Size (kW)" value={systemKwOverride} onChange={setSystemKwOverride} placeholder="auto" min={1} max={50} step={0.5} hint="Leave blank to auto-size" />
        </div>

        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.07em', borderTop: '1px solid var(--line-strong)', paddingTop: 16 }}>
          Cost & Incentives
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
          <Field label="System Cost ($/watt)" value={systemCostPerWatt} onChange={setSystemCostPerWatt} placeholder="3.00" min={1} max={8} step={0.25} hint="Installed cost, US avg $3/W" />
          <Field label="Federal Tax Credit (%)" value={federalTaxCredit} onChange={setFederalTaxCredit} placeholder="30" min={0} max={100} step={1} hint="ITC 30% through 2032" />
          <Field label="State Incentive ($)" value={stateIncentive} onChange={setStateIncentive} placeholder="0" min={0} step={100} hint="State rebates / credits" />
          <Field label="Panel Degradation (%/yr)" value={panelDegradation} onChange={setPanelDegradation} placeholder="0.5" min={0.1} max={2} step={0.1} hint="Typical 0.5%/yr" />
          <Field label="Years of Ownership" value={yearsOwnership} onChange={setYearsOwnership} placeholder="25" min={5} max={25} step={1} hint="Max 25-year projection" />
        </div>

        <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <label style={LABEL}>Financing</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={loanEnabled} onChange={e => setLoanEnabled(e.target.checked)} style={{ width: 16, height: 16 }} />
              <span style={{ color: 'var(--fg-2)', fontSize: 13 }}>Use solar loan financing</span>
            </label>
          </div>
          {loanEnabled && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              <Field label="Loan Interest Rate (%)" value={loanRate} onChange={setLoanRate} placeholder="6.0" min={0} max={20} step={0.25} />
              <Field label="Loan Term (Years)" value={loanTermYears} onChange={setLoanTermYears} placeholder="10" min={1} max={25} step={1} />
            </div>
          )}
        </div>
      </div>

      {/* ── TIER 1: KEY METRICS ── */}
      {result ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="System Size" value={result.systemKw + ' kW'} color="#f59e0b" sub="Auto-sized from bill" />
            <MetricCard label="Annual Savings" value={$c(result.annualSavings)} color="#10b981" sub="Year 1 electricity savings" />
            <MetricCard label="Payback Period" value={result.paybackYears <= 25 ? result.paybackYears + ' yrs' : '>25 yrs'} color="#6366f1" sub={result.breakEvenYear > 0 ? 'Break-even year ' + result.breakEvenYear : 'No break-even in window'} />
            <MetricCard label="25-Year Savings" value={$c(result.savings25yr)} color="#38bdf8" sub={'Net cost: ' + $c(result.netCost)} />
            <MetricCard label="CO2 Offset" value={result.co2OffsetTonnes + ' t/yr'} color="#6ee7b7" sub="Tonnes CO2e annually" />
            <MetricCard label="IRR" value={result.irrPct.toFixed(1) + '%'} color="#e879f9" sub="Internal rate of return" />
          </div>

          {/* Cost bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost & Incentives</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Gross System Cost', value: $c(result.totalCost), color: '#6366f1' },
                { label: '30% Federal ITC', value: '-' + $c(result.totalCost - result.netCost - (parseFloat(stateIncentive) || 0)), color: '#10b981' },
                { label: 'State Incentive', value: '-' + $c(parseFloat(stateIncentive) || 0), color: '#38bdf8' },
                { label: 'Net Out-of-Pocket', value: $c(result.netCost), color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 8, textAlign: 'center', minWidth: 120 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TIER 2: 25-YEAR CASH FLOW TABLE ── */}
          <div>
            <button onClick={() => setShowTable(v => !v)} style={{
              width: '100%', textAlign: 'left', padding: '14px 20px',
              background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
              borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }} aria-expanded={showTable}>
              {showTable ? '▾' : '▸'} {inputs.yearsOwnership}-Year Cash Flow Projection
              <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)', marginLeft: 8 }}>
                ({result.cashFlow.length} years shown)
              </span>
              {result.breakEvenYear > 0 && (
                <span style={{ marginLeft: 12, fontSize: 11, color: '#fbbf24', fontWeight: 500 }}>
                  Break-even at Year {result.breakEvenYear}
                </span>
              )}
            </button>

            {showTable && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => exportCalcPDF({
                    toolName: 'Solar Savings Calculator',
                    inputs: [
                      { label: 'Monthly Bill', value: '$' + monthlyBill },
                      { label: 'Utility Rate', value: '$' + utilityRate + '/kWh' },
                      { label: 'System Size', value: result.systemKw + ' kW' },
                      { label: 'State', value: state },
                    ],
                    results: [
                      { label: 'Annual Savings', value: $c(result.annualSavings), highlight: true },
                      { label: 'Payback Period', value: result.paybackYears + ' years' },
                      { label: '25-Year Savings', value: $c(result.savings25yr) },
                      { label: 'IRR', value: result.irrPct.toFixed(1) + '%' },
                      { label: 'CO2 Offset', value: result.co2OffsetTonnes + ' t/yr' },
                    ],
                    tableHeaders: ['Year', 'Production (kWh)', 'Savings ($)', 'Loan Pmt ($)', 'Net ($)', 'Cumulative ($)'],
                    tableRows: result.cashFlow.map(r => ({
                      'Year': r.year,
                      'Production (kWh)': fmt(r.production),
                      'Savings ($)': $c(r.savings),
                      'Loan Pmt ($)': r.loanPayment > 0 ? $c(r.loanPayment) : '—',
                      'Net ($)': $c(r.net),
                      'Cumulative ($)': $c(r.cumulative),
                    })),
                  })} style={BTN_GHOST}>
                    Export PDF
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {['Year', 'Production kWh', 'Savings $', 'Loan Pmt $', 'Net $', 'Cumulative $'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map(row => {
                        const isBreakEven = row.year === result!.breakEvenYear
                        return (
                          <tr key={row.year} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isBreakEven ? 'rgba(251,191,36,0.06)' : 'transparent' }}>
                            <td style={{ ...TD, color: isBreakEven ? '#fbbf24' : 'var(--fg-3)' }}>
                              {isBreakEven ? '★ ' : ''}{row.year}
                            </td>
                            <td style={TD}>{fmt(row.production)}</td>
                            <td style={{ ...TD, color: '#10b981' }}>{$c(row.savings)}</td>
                            <td style={{ ...TD, color: '#f59e0b' }}>{row.loanPayment > 0 ? $c(row.loanPayment) : '—'}</td>
                            <td style={{ ...TD, color: row.net >= 0 ? '#10b981' : '#ef4444' }}>{$c(row.net)}</td>
                            <td style={{ ...TD, color: row.cumulative >= 0 ? '#6366f1' : '#ef4444', fontWeight: row.cumulative >= 0 ? 700 : 400 }}>
                              {$c(row.cumulative)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {result.cashFlow.length > 10 && (
                  <div style={{ textAlign: 'center', padding: '12px 20px', borderTop: '1px solid var(--line-strong)' }}>
                    <button onClick={() => setShowAll(v => !v)} style={{ ...BTN_GHOST, fontSize: 12 }}>
                      {showAll ? '▲ Show first 10 years' : `▼ Show all ${result.cashFlow.length} years`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── TIER 3: SCENARIO COMPARISON ── */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Scenario Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Scenario', 'Net Cost', 'Yr 1 Savings', '25-yr Savings', 'Payback', 'IRR'].map((h, i) => (
                        <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: '★ Cash Purchase', r: scenarios.cash, highlight: true },
                      { label: 'Solar Loan Financing', r: scenarios.loan, highlight: false },
                    ].map(({ label, r, highlight }) => r ? (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: highlight ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: highlight ? '#c4b5fd' : 'var(--fg-2)', fontWeight: highlight ? 700 : 400 }}>{label}</td>
                        <td style={TD}>{$c(r.netCost)}</td>
                        <td style={{ ...TD, color: '#10b981' }}>{$c(r.annualSavings)}</td>
                        <td style={{ ...TD, color: '#38bdf8', fontWeight: 700 }}>{$c(r.savings25yr)}</td>
                        <td style={TD}>{r.paybackYears <= 25 ? r.paybackYears + ' yrs' : '>25 yrs'}</td>
                        <td style={{ ...TD, color: r.irrPct > 5 ? '#10b981' : 'var(--fg-3)' }}>{r.irrPct.toFixed(1)}%</td>
                      </tr>
                    ) : null)}
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-3)' }}>No Solar (utility only)</td>
                      <td style={{ ...TD, color: '#ef4444' }}>—</td>
                      <td style={{ ...TD, color: '#ef4444' }}>-{$c(Math.round(parseFloat(monthlyBill) * 12))}/yr</td>
                      <td style={{ ...TD, color: '#ef4444', fontWeight: 700 }}>
                        -{$c(Math.round(Array.from({ length: 25 }, (_, i) => parseFloat(monthlyBill) * 12 * Math.pow(1 + parseFloat(billIncreaseRate) / 100, i)).reduce((a, b) => a + b, 0)))}
                      </td>
                      <td style={TD}>Never</td>
                      <td style={TD}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TIER 4: ROI ANALYSIS & GUIDANCE ── */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              ROI Analysis & Guidance
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Your {result.systemKw} kW system in {state} generates an estimated {fmt(result.annualProduction)} kWh/year using NREL PVWatts methodology ({STATE_SUN_HOURS[state] ?? 4.5} peak sun hours/day).
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                After the 30% federal Investment Tax Credit (ITC), your net cost is {$c(result.netCost)}. The ITC applies to installed system costs and is available through 2032 at 30%.
              </li>
              {result.irrPct > 0 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  IRR of {result.irrPct.toFixed(1)}% {result.irrPct > 8 ? 'exceeds most safe fixed-income investments — solar is a strong financial choice in your state.' : result.irrPct > 4 ? 'is comparable to a diversified bond portfolio. Factor in the inflation hedge on utility costs.' : 'is modest. Consider whether your utility rates or incentives change the picture.'}
                </li>
              )}
              {result.breakEvenYear > 0 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Break-even at Year {result.breakEvenYear} means you have {25 - result.breakEvenYear} years of pure profit after payback within a standard 25-year panel warranty period.
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Panel degradation of {panelDegradation}%/year is factored into each year's production. Premium panels often degrade only 0.3%/year — worth asking installers for degradation warranties.
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your monthly bill and utility rate to see your solar savings projection.
        </div>
      )}
    </div>
  )
}
