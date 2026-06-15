'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style Tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 10px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '6px 10px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '16px 12px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const fmt = (n: number, dec = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const pct = (n: number, d = 1) => n.toFixed(d) + '%'

// ─── Core Calculation ─────────────────────────────────────────────────────────

function calcMonthlyPI(loan: number, annualRate: number, termMonths: number): number {
  if (loan <= 0 || termMonths <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return loan / termMonths
  return (loan * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
}

/** Solve for max home price given max monthly PITI */
function solveMaxHomePrice(
  maxMonthly: number,
  downPct: number,
  annualRate: number,
  termMonths: number,
  taxRate: number,
  insuranceRate: number,
): number {
  // PI = maxMonthly - tax - insurance; tax + insurance depend on price → iterative
  // PI_factor = r*(1+r)^n / ((1+r)^n - 1) applied to loanAmt = price*(1-downPct)
  const r = annualRate / 100 / 12
  const pow = Math.pow(1 + r, termMonths)
  const piFactor = r === 0 ? 1 / termMonths : (r * pow) / (pow - 1)
  // monthly tax+insurance as fraction of price
  const monthlyFraction = taxRate / 100 / 12 + insuranceRate / 100 / 12
  // PI = (price * (1-down)) * piFactor
  // total = PI + price * monthlyFraction = maxMonthly
  // price * [(1-down)*piFactor + monthlyFraction] = maxMonthly
  const denominator = (1 - downPct / 100) * piFactor + monthlyFraction
  if (denominator <= 0) return 0
  return maxMonthly / denominator
}

interface AffordResult {
  grossMonthlyIncome: number
  maxFrontEndConv: number      // 28% rule price
  maxBackEndConv: number       // 36% rule price
  maxFrontEndFHA: number       // 31% rule price
  maxBackEndFHA: number        // 43% rule price
  maxPriceConv: number         // min of front/back conventional
  maxPriceFHA: number          // min of front/back FHA
  // PITI at max conventional price
  pitiConv: { pi: number; tax: number; insurance: number; pmi: number; total: number }
  // Required income for given home price
  requiredIncomeConv: number
  requiredIncomeFHA: number
  downAmt: number
  loanConv: number
}

function calcAffordability(
  annualIncome: number,
  monthlyDebts: number,
  downSaved: number,
  annualRate: number,
  termYrs: number,
  taxRate: number,
  insuranceRate: number,
  homePrice: number,   // for "required income" reverse calc
  downPct: number,
): AffordResult {
  const grossMonthly = annualIncome / 12
  const termMos = termYrs * 12

  // Max monthly housing payment under each rule
  const maxFrontConv = grossMonthly * 0.28
  const maxBackConv  = grossMonthly * 0.36 - monthlyDebts
  const maxFrontFHA  = grossMonthly * 0.31
  const maxBackFHA   = grossMonthly * 0.43 - monthlyDebts

  const solve = (maxMo: number) => solveMaxHomePrice(maxMo, downPct, annualRate, termMos, taxRate, insuranceRate)

  const maxFrontEndConv = solve(maxFrontConv)
  const maxBackEndConv  = solve(maxBackConv)
  const maxFrontEndFHA  = solve(maxFrontFHA)
  const maxBackEndFHA   = solve(maxBackFHA)

  const maxPriceConv = Math.min(maxFrontEndConv, maxBackEndConv)
  const maxPriceFHA  = Math.min(maxFrontEndFHA, maxBackEndFHA)

  // PITI at conventional max
  const downAmtConv = maxPriceConv * downPct / 100
  const loanConv = maxPriceConv - downAmtConv
  const ltv = loanConv / maxPriceConv
  const piConv = calcMonthlyPI(loanConv, annualRate, termMos)
  const taxConv = maxPriceConv * taxRate / 100 / 12
  const insConv = maxPriceConv * insuranceRate / 100 / 12
  const pmiConv = ltv > 0.8 ? loanConv * 0.0085 / 12 : 0

  // Required income: reverse — what income is needed for given homePrice?
  const downAmt = homePrice * downPct / 100
  const loan = homePrice - downAmt
  const pi = calcMonthlyPI(loan, annualRate, termMos)
  const tax = homePrice * taxRate / 100 / 12
  const ins = homePrice * insuranceRate / 100 / 12
  const pmi = (loan / homePrice) > 0.8 ? loan * 0.0085 / 12 : 0
  const totalPITI = pi + tax + ins + pmi
  const requiredIncomeConv = totalPITI / 0.28 * 12
  const requiredIncomeFHA  = totalPITI / 0.31 * 12

  return {
    grossMonthlyIncome: grossMonthly,
    maxFrontEndConv, maxBackEndConv, maxFrontEndFHA, maxBackEndFHA,
    maxPriceConv, maxPriceFHA,
    pitiConv: { pi: piConv, tax: taxConv, insurance: insConv, pmi: pmiConv, total: piConv + taxConv + insConv + pmiConv },
    requiredIncomeConv, requiredIncomeFHA,
    downAmt: downAmtConv,
    loanConv,
  }
}

// ─── CSV export helper ────────────────────────────────────────────────────────

function exportCSV(rows: Array<Record<string, string | number>>, filename: string) {
  if (!rows.length) return
  const hdr = Object.keys(rows[0])
  const csv = [hdr, ...rows.map(r => hdr.map(k => r[k]))].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: filename,
  })
  a.click()
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeAffordabilityCalculatorClient() {
  const [annualIncome, setAnnualIncome] = useState('100000')
  const [monthlyDebts, setMonthlyDebts] = useState('500')
  const [downSaved, setDownSaved] = useState('40000')
  const [annualRate, setAnnualRate] = useState('6.5')
  const [termYrs, setTermYrs] = useState('30')
  const [taxRate, setTaxRate] = useState('1.2')
  const [insuranceRate, setInsuranceRate] = useState('0.5')
  const [homePrice, setHomePrice] = useState('400000')
  const [downPct, setDownPct] = useState('10')
  const [showAdv, setShowAdv] = useState(false)

  const income = parseFloat(annualIncome) || 0
  const debts = parseFloat(monthlyDebts) || 0
  const saved = parseFloat(downSaved) || 0
  const rate = parseFloat(annualRate) || 0
  const term = parseInt(termYrs) || 30
  const tax = parseFloat(taxRate) || 0
  const ins = parseFloat(insuranceRate) || 0
  const HP = parseFloat(homePrice) || 0
  const DP = parseFloat(downPct) || 10

  const result = useMemo(() =>
    income > 0 ? calcAffordability(income, debts, saved, rate, term, tax, ins, HP, DP) : null,
    [income, debts, saved, rate, term, tax, ins, HP, DP]
  )

  // Rate scenario table
  const rateScenarios = useMemo(() => {
    if (!income) return []
    return [rate - 1, rate, rate + 1].filter(r => r > 0).map(r => {
      const res = calcAffordability(income, debts, saved, r, term, tax, ins, HP, DP)
      return { rate: r, maxConv: res.maxPriceConv, maxFHA: res.maxPriceFHA, piti: res.pitiConv.total }
    })
  }, [income, debts, saved, rate, term, tax, ins, HP, DP])

  const scenarioTableData = rateScenarios.map(r => ({
    'Rate': pct(r.rate, 2),
    'Max Price (Conv)': fmt(r.maxConv),
    'Max Price (FHA)': fmt(r.maxFHA),
    'Est. PITI/mo': fmt(r.piti),
  }))

  function Field({ label, value, onChange, min, max, step, placeholder, hint }: {
    label: string; value: string; onChange: (v: string) => void
    min?: number; max?: number; step?: number; placeholder?: string; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input type="number" value={value} onChange={e => onChange(e.target.value)}
          min={min} max={max} step={step} placeholder={placeholder} style={INPUT_BOX} aria-label={label} />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Field label="Annual Gross Income ($)" value={annualIncome} onChange={setAnnualIncome} min={0} step={5000} placeholder="100,000" />
          <Field label="Monthly Debts ($)" value={monthlyDebts} onChange={setMonthlyDebts} min={0} step={50} placeholder="500"
            hint="Car, student loans, credit card mins" />
          <Field label="Down Payment Saved ($)" value={downSaved} onChange={setDownSaved} min={0} step={1000} placeholder="40,000" />
          <Field label="Interest Rate (%)" value={annualRate} onChange={setAnnualRate} min={0} max={25} step={0.05} placeholder="6.5" />
          <div>
            <label style={LABEL}>Loan Term</label>
            <select value={termYrs} onChange={e => setTermYrs(e.target.value)} style={INPUT_BOX} aria-label="Loan Term">
              <option value="30">30 Years</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years</option>
            </select>
          </div>
          <Field label="Down Payment (%)" value={downPct} onChange={setDownPct} min={0} max={100} step={0.5} placeholder="10" />
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Property Tax & Insurance
        </button>
        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Property Tax Rate (%/yr)" value={taxRate} onChange={setTaxRate} min={0} max={5} step={0.05} placeholder="1.2"
              hint="National avg ~1.07%" />
            <Field label="Insurance Rate (%/yr)" value={insuranceRate} onChange={setInsuranceRate} min={0} max={3} step={0.05} placeholder="0.5" />
          </div>
        )}
      </div>

      {/* RESULTS */}
      {result && (
        <>
          {/* Max home price cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Max Price (Conv 28/36)" value={fmt(result.maxPriceConv)} color="#6366f1"
              sub="Front or back limit" />
            <MetricCard label="Max Price (FHA 31/43)" value={fmt(result.maxPriceFHA)} color="#8b5cf6"
              sub="FHA guidelines" />
            <MetricCard label="Down Payment" value={fmt(result.downAmt)} color="#38bdf8"
              sub={`${pct(DP)} of conv max`} />
            <MetricCard label="PITI at Max Price" value={fmt(result.pitiConv.total) + '/mo'} color="#f59e0b"
              sub={`P&I: ${fmt(result.pitiConv.pi)}`} />
          </div>

          {/* PITI breakdown at max price */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PITI Breakdown at Conventional Max Price ({fmt(result.maxPriceConv)})
            </div>
            <div style={{ height: 16, borderRadius: 8, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: result.pitiConv.pi, background: '#6366f1' }} title="Principal & Interest" />
              <div style={{ flex: result.pitiConv.tax, background: '#f59e0b' }} title="Property Tax" />
              <div style={{ flex: result.pitiConv.insurance, background: '#38bdf8' }} title="Insurance" />
              {result.pitiConv.pmi > 0 && <div style={{ flex: result.pitiConv.pmi, background: '#e879f9' }} title="PMI" />}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 10 }}>
              {[
                { label: 'Principal & Interest', v: result.pitiConv.pi, c: '#6366f1' },
                { label: 'Property Tax', v: result.pitiConv.tax, c: '#f59e0b' },
                { label: 'Insurance', v: result.pitiConv.insurance, c: '#38bdf8' },
                ...(result.pitiConv.pmi > 0 ? [{ label: 'PMI', v: result.pitiConv.pmi, c: '#e879f9' }] : []),
              ].map(({ label, v, c }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>{label}:</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 700 }}>{fmt(v)}/mo</span>
                </div>
              ))}
            </div>
          </div>

          {/* 28/36 vs 31/43 rule breakdown */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Affordability Rules Comparison
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Rule', 'Limit', 'Max Monthly', 'Max Home Price'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rule: 'Conventional Front-End', limit: '28% gross monthly', maxMo: result.grossMonthlyIncome * 0.28, maxPrice: result.maxFrontEndConv, hi: false },
                    { rule: 'Conventional Back-End', limit: '36% gross monthly', maxMo: result.grossMonthlyIncome * 0.36 - debts, maxPrice: result.maxBackEndConv, hi: false },
                    { rule: '★ Conv. Effective Max', limit: 'More restrictive', maxMo: Math.min(result.grossMonthlyIncome * 0.28, result.grossMonthlyIncome * 0.36 - debts), maxPrice: result.maxPriceConv, hi: true },
                    { rule: 'FHA Front-End', limit: '31% gross monthly', maxMo: result.grossMonthlyIncome * 0.31, maxPrice: result.maxFrontEndFHA, hi: false },
                    { rule: 'FHA Back-End', limit: '43% gross monthly', maxMo: result.grossMonthlyIncome * 0.43 - debts, maxPrice: result.maxBackEndFHA, hi: false },
                    { rule: '★ FHA Effective Max', limit: 'More restrictive', maxMo: Math.min(result.grossMonthlyIncome * 0.31, result.grossMonthlyIncome * 0.43 - debts), maxPrice: result.maxPriceFHA, hi: true },
                  ].map(({ rule, limit, maxMo, maxPrice, hi }) => (
                    <tr key={rule} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: hi ? 'rgba(139,92,246,0.1)' : 'transparent',
                    }}>
                      <td style={{ ...TD, textAlign: 'left', color: hi ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{rule}</td>
                      <td style={{ ...TD, color: 'var(--fg-3)' }}>{limit}</td>
                      <td style={TD}>{fmt(Math.max(0, maxMo))}/mo</td>
                      <td style={{ ...TD, fontWeight: hi ? 700 : 400, color: hi ? '#6366f1' : 'var(--fg-2)' }}>{fmt(Math.max(0, maxPrice))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Required income reverse calc */}
          {HP > 0 && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Income Required for Target Home Price
              </h3>
              <div style={{ marginBottom: 12 }}>
                <Field label="Target Home Price ($)" value={homePrice} onChange={setHomePrice} min={0} step={5000} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 8 }}>
                <MetricCard label="Required Income (Conv 28%)" value={fmt(result.requiredIncomeConv) + '/yr'} color="#6366f1"
                  sub={fmt(result.requiredIncomeConv / 12) + '/mo'} />
                <MetricCard label="Required Income (FHA 31%)" value={fmt(result.requiredIncomeFHA) + '/yr'} color="#8b5cf6"
                  sub={fmt(result.requiredIncomeFHA / 12) + '/mo'} />
                <MetricCard label="Your Income" value={fmt(income) + '/yr'} color={income >= result.requiredIncomeConv ? '#10b981' : '#f87171'}
                  sub={income >= result.requiredIncomeConv ? '✓ Qualifies conventionally' : 'Below conventional threshold'} />
              </div>
            </div>
          )}

          {/* Rate scenario table */}
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Rate Sensitivity (±1%)
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => exportCSV(scenarioTableData, 'affordability-rate-scenarios')} style={BTN_GHOST}>⬇ CSV</button>
                <button onClick={async () => exportCalcPDF({
                  toolName: 'Home Affordability Calculator',
                  inputs: [
                    { label: 'Annual Income', value: fmt(income) },
                    { label: 'Monthly Debts', value: fmt(debts) },
                    { label: 'Down Saved', value: fmt(saved) },
                    { label: 'Rate', value: pct(rate, 2) },
                    { label: 'Term', value: `${termYrs} years` },
                  ],
                  results: [
                    { label: 'Max Price (Conv)', value: fmt(result.maxPriceConv), highlight: true },
                    { label: 'Max Price (FHA)', value: fmt(result.maxPriceFHA), highlight: true },
                    { label: 'PITI/mo at Max', value: fmt(result.pitiConv.total) },
                    { label: 'Req. Income (Conv)', value: fmt(result.requiredIncomeConv) },
                  ],
                  tableHeaders: ['Rate', 'Max Price (Conv)', 'Max Price (FHA)', 'Est. PITI/mo'],
                  tableRows: scenarioTableData,
                })} style={BTN_GHOST}>📄 PDF</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Rate', 'Max Price (Conv)', 'Max Price (FHA)', 'PITI/mo'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rateScenarios.map(row => (
                    <tr key={row.rate} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: row.rate === rate ? 'rgba(139,92,246,0.1)' : 'transparent',
                    }}>
                      <td style={{ ...TD, textAlign: 'left', color: row.rate === rate ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: row.rate === rate ? 700 : 400 }}>
                        {row.rate === rate ? '★ ' : ''}{pct(row.rate, 2)}
                      </td>
                      <td style={{ ...TD, color: row.rate === rate ? '#6366f1' : 'var(--fg-2)', fontWeight: row.rate === rate ? 700 : 400 }}>{fmt(row.maxConv)}</td>
                      <td style={TD}>{fmt(row.maxFHA)}</td>
                      <td style={TD}>{fmt(row.piti)}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guidance */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              What Your Numbers Mean
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Based on the conventional 28/36 rule, your max home price is <strong style={{ color: '#6366f1' }}>{fmt(result.maxPriceConv)}</strong> with {fmt(debts)}/month in existing debts. FHA guidelines (31/43) allow up to <strong style={{ color: '#8b5cf6' }}>{fmt(result.maxPriceFHA)}</strong>.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                The more restrictive limit is the {result.maxFrontEndConv < result.maxBackEndConv ? 'front-end (28%)' : 'back-end (36%)'} ratio. {debts > result.grossMonthlyIncome * 0.08 ? `Your monthly debts (${fmt(debts)}) are consuming ${pct(debts / result.grossMonthlyIncome * 100)} of income — reducing debts would significantly increase your buying power.` : 'Your debt load is manageable.'}
              </li>
              {saved < result.downAmt && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  You&apos;ve saved {fmt(saved)}, but need {fmt(result.downAmt)} for a {pct(DP, 0)} down payment on the max price. You&apos;re {fmt(result.downAmt - saved)} short — consider a lower price point or increasing your savings rate.
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Every 1% increase in interest rate reduces your buying power by approximately {fmt(result.maxPriceConv - (rateScenarios.find(r => r.rate === rate + 1)?.maxConv ?? result.maxPriceConv))}. Lock your rate as soon as you&apos;re under contract.
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your annual income, debts, and down payment to see your maximum affordable home price.
        </div>
      )}
    </div>
  )
}
