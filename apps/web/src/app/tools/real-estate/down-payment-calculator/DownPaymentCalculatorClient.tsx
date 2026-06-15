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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcMonthlyPI(loan: number, annualRate: number, termMonths: number): number {
  if (loan <= 0 || termMonths <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return loan / termMonths
  return (loan * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
}

function calcPMIMonthly(loanAmt: number, pmiRateAnnual: number): number {
  return loanAmt * pmiRateAnnual / 100 / 12
}

// ─── Loan Programs ────────────────────────────────────────────────────────────

const LOAN_PROGRAMS = [
  { name: 'VA Loan', minDown: 0, note: '0% down for eligible veterans/active duty. No PMI.' },
  { name: 'USDA Loan', minDown: 0, note: '0% down for eligible rural properties. Income limits apply.' },
  { name: 'FHA Loan', minDown: 3.5, note: '3.5% min. Requires mortgage insurance premium (MIP).' },
  { name: 'Conventional 97', minDown: 3, note: '3% min for first-time buyers. PMI required until 20% equity.' },
  { name: 'Conventional', minDown: 5, note: '5%+ standard. 20%+ eliminates PMI entirely.' },
]

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: Array<Record<string, string | number>>, filename: string) {
  if (!rows.length) return
  const hdr = Object.keys(rows[0])
  const data = rows.map(r => hdr.map(k => r[k]))
  const csv = [hdr, ...data].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: filename,
  })
  a.click()
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DownPaymentCalculatorClient() {
  const [homePrice, setHomePrice] = useState('400000')
  const [downPct, setDownPct] = useState('10')
  const [loanType, setLoanType] = useState('Conventional')
  const [annualRate, setAnnualRate] = useState('6.5')
  const [termYrs, setTermYrs] = useState('30')
  const [grossIncome, setGrossIncome] = useState('8000')
  const [monthlyDebts, setMonthlyDebts] = useState('500')
  const [pmiRate, setPmiRate] = useState('0.8')
  const [monthlySavings, setMonthlySavings] = useState('500')
  const [showAdv, setShowAdv] = useState(false)

  const HP = parseFloat(homePrice) || 0
  const DP = parseFloat(downPct) || 0
  const rate = parseFloat(annualRate) || 0
  const term = parseInt(termYrs) || 30
  const income = parseFloat(grossIncome) || 0
  const debts = parseFloat(monthlyDebts) || 0
  const pmiR = parseFloat(pmiRate) || 0.8
  const savings = parseFloat(monthlySavings) || 0

  const result = useMemo(() => {
    if (HP <= 0) return null
    const downAmt = HP * DP / 100
    const loanAmt = HP - downAmt
    const ltv = loanAmt / HP
    const pmiRequired = ltv > 0.80
    const pmiMonthly = pmiRequired ? calcPMIMonthly(loanAmt, pmiR) : 0
    const piPayment = calcMonthlyPI(loanAmt, rate, term * 12)
    const totalMonthly = piPayment + pmiMonthly
    const frontEndDTI = income > 0 ? (totalMonthly / income) * 100 : 0
    const backEndDTI = income > 0 ? ((totalMonthly + debts) / income) * 100 : 0

    // Time to save: current savings → target down payment
    const monthsToSave = savings > 0 ? Math.ceil(downAmt / savings) : null

    return { downAmt, loanAmt, ltv, pmiRequired, pmiMonthly, piPayment, totalMonthly, frontEndDTI, backEndDTI, monthsToSave }
  }, [HP, DP, rate, term, income, debts, pmiR, savings])

  // Scenario table for different down percentages
  const scenarioRows = useMemo(() => {
    if (!HP) return []
    return [3, 3.5, 5, 10, 15, 20, 25].map(dp => {
      const downAmt = HP * dp / 100
      const loanAmt = HP - downAmt
      const ltv = loanAmt / HP
      const pmiReq = ltv > 0.80
      const pmiMo = pmiReq ? calcPMIMonthly(loanAmt, pmiR) : 0
      const pi = calcMonthlyPI(loanAmt, rate, term * 12)
      const totalMo = pi + pmiMo
      return { dp, downAmt, loanAmt, ltv, pmiReq, pmiMo, pi, totalMo }
    })
  }, [HP, rate, term, pmiR])

  const scenarioTableData = scenarioRows.map(r => ({
    'Down %': `${r.dp}%`,
    'Down Amount': fmt(r.downAmt),
    'Loan Amount': fmt(r.loanAmt),
    'LTV': pct(r.ltv * 100),
    'PMI Req': r.pmiReq ? 'Yes' : 'No',
    'PMI/mo': r.pmiReq ? fmt(r.pmiMo) : '—',
    'Monthly P&I': fmt(r.pi),
    'Total Monthly': fmt(r.totalMo),
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
          <Field label="Home Price ($)" value={homePrice} onChange={setHomePrice} min={0} step={5000} placeholder="400,000" />

          {/* Down payment slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <span style={LABEL as CSSProperties}>Down Payment</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-2)' }}>{DP}%</span>
            </div>
            <input type="range" min={0} max={40} step={0.5} value={downPct}
              onChange={e => setDownPct(e.target.value)}
              style={{ width: '100%', accentColor: '#8b5cf6' }} aria-label="Down payment slider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>
              <span>0%</span>
              <span style={{ color: '#10b981' }}>{HP > 0 ? fmt(HP * DP / 100) : '$0'}</span>
              <span>40%</span>
            </div>
          </div>

          <div>
            <label style={LABEL}>Loan Type</label>
            <select value={loanType} onChange={e => setLoanType(e.target.value)} style={INPUT_BOX} aria-label="Loan Type">
              <option value="Conventional">Conventional</option>
              <option value="FHA">FHA (3.5% min)</option>
              <option value="VA">VA (0% down)</option>
              <option value="USDA">USDA (0% down)</option>
            </select>
          </div>

          <Field label="Interest Rate (%)" value={annualRate} onChange={setAnnualRate} min={0} max={25} step={0.05} placeholder="6.5" />
          <div>
            <label style={LABEL}>Loan Term</label>
            <select value={termYrs} onChange={e => setTermYrs(e.target.value)} style={INPUT_BOX} aria-label="Loan Term">
              <option value="30">30 Years</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years</option>
            </select>
          </div>
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} DTI & Savings Inputs
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Monthly Gross Income ($)" value={grossIncome} onChange={setGrossIncome} min={0} step={100} placeholder="8,000" />
            <Field label="Other Monthly Debts ($)" value={monthlyDebts} onChange={setMonthlyDebts} min={0} step={50} placeholder="500"
              hint="Car, student loan, credit card min" />
            <Field label="PMI Rate (% of loan/yr)" value={pmiRate} onChange={setPmiRate} min={0} max={3} step={0.05} placeholder="0.8"
              hint="Typical 0.5–1.2%" />
            <Field label="Monthly Savings ($)" value={monthlySavings} onChange={setMonthlySavings} min={0} step={50} placeholder="500"
              hint="How much you can save per month" />
          </div>
        )}
      </div>

      {/* RESULTS */}
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Down Payment" value={fmt(result.downAmt)} color="#8b5cf6"
              sub={`${pct(DP)} of price`} />
            <MetricCard label="Loan Amount" value={fmt(result.loanAmt)} color="#6366f1"
              sub={`LTV ${pct(result.ltv * 100)}`} />
            <MetricCard label="Monthly P&I" value={fmt(result.piPayment)} color="#38bdf8" />
            <MetricCard label="PMI" value={result.pmiRequired ? fmt(result.pmiMonthly) + '/mo' : 'None'}
              color={result.pmiRequired ? '#e879f9' : '#10b981'}
              sub={result.pmiRequired ? 'LTV > 80%' : '≥20% down'} />
            {income > 0 && (
              <>
                <MetricCard label="Front-End DTI" value={pct(result.frontEndDTI)}
                  color={result.frontEndDTI <= 28 ? '#10b981' : result.frontEndDTI <= 36 ? '#f59e0b' : '#f87171'}
                  sub={result.frontEndDTI <= 28 ? '✓ Under 28% limit' : 'Over 28% guideline'} />
                <MetricCard label="Back-End DTI" value={pct(result.backEndDTI)}
                  color={result.backEndDTI <= 36 ? '#10b981' : result.backEndDTI <= 43 ? '#f59e0b' : '#f87171'}
                  sub={result.backEndDTI <= 43 ? 'FHA max 43%' : 'High — may limit approval'} />
              </>
            )}
            {result.monthsToSave !== null && (
              <MetricCard label="Months to Save" value={String(result.monthsToSave)}
                color="#f59e0b" sub={`~${(result.monthsToSave / 12).toFixed(1)} years at $${savings}/mo`} />
            )}
          </div>

          {/* LTV bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Loan-to-Value Ratio: {pct(result.ltv * 100)} — {result.pmiRequired ? 'PMI Required' : 'No PMI'}
            </div>
            <div style={{ height: 16, borderRadius: 8, overflow: 'hidden', display: 'flex', background: 'var(--bg-2)' }}>
              <div style={{ width: `${(1 - result.ltv) * 100}%`, background: '#8b5cf6', minWidth: 2 }} title={`Down: ${pct(DP)}`} />
              <div style={{ flex: 1, background: result.pmiRequired ? '#e879f9' : '#10b981' }} title={`Loan: ${pct(result.ltv * 100)}`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--fg-3)' }}>
              <span style={{ color: '#8b5cf6' }}>Equity: {pct(DP)}</span>
              <span style={{ color: result.pmiRequired ? '#e879f9' : '#10b981' }}>Loan: {pct(result.ltv * 100)}</span>
            </div>
          </div>

          {/* Down payment scenario table */}
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Down Payment Scenario Table
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => exportCSV(scenarioTableData, 'down-payment-scenarios')} style={BTN_GHOST}>⬇ CSV</button>
                <button onClick={async () => exportCalcPDF({
                  toolName: 'Down Payment Calculator',
                  inputs: [
                    { label: 'Home Price', value: fmt(HP) },
                    { label: 'Down Payment', value: `${pct(DP)} (${fmt(result.downAmt)})` },
                    { label: 'Interest Rate', value: pct(rate, 2) },
                    { label: 'Loan Term', value: `${termYrs} years` },
                  ],
                  results: [
                    { label: 'Loan Amount', value: fmt(result.loanAmt), highlight: true },
                    { label: 'Monthly P&I', value: fmt(result.piPayment), highlight: true },
                    { label: 'LTV', value: pct(result.ltv * 100) },
                    { label: 'PMI/mo', value: result.pmiRequired ? fmt(result.pmiMonthly) : 'None' },
                    ...(income > 0 ? [
                      { label: 'Front DTI', value: pct(result.frontEndDTI) },
                      { label: 'Back DTI', value: pct(result.backEndDTI) },
                    ] : []),
                  ],
                  tableHeaders: ['Down %', 'Down Amount', 'Loan Amount', 'LTV', 'PMI Req', 'PMI/mo', 'Monthly P&I', 'Total Monthly'],
                  tableRows: scenarioTableData,
                })} style={BTN_GHOST}>📄 PDF</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Down %', 'Down Amt', 'Loan Amt', 'LTV', 'PMI?', 'PMI/mo', 'P&I', 'Total/mo'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenarioRows.map(row => (
                    <tr key={row.dp} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: row.dp === DP ? 'rgba(139,92,246,0.1)' : 'transparent',
                    }}>
                      <td style={{ ...TD, textAlign: 'left', color: row.dp === DP ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: row.dp === DP ? 700 : 400 }}>
                        {row.dp === DP ? '★ ' : ''}{row.dp}%
                      </td>
                      <td style={TD}>{fmt(row.downAmt)}</td>
                      <td style={TD}>{fmt(row.loanAmt)}</td>
                      <td style={{ ...TD, color: row.ltv > 0.8 ? '#e879f9' : '#10b981' }}>{pct(row.ltv * 100)}</td>
                      <td style={{ ...TD, color: row.pmiReq ? '#e879f9' : '#10b981' }}>{row.pmiReq ? 'Yes' : 'No'}</td>
                      <td style={{ ...TD, color: '#e879f9' }}>{row.pmiReq ? fmt(row.pmiMo) : '—'}</td>
                      <td style={TD}>{fmt(row.pi)}</td>
                      <td style={{ ...TD, fontWeight: row.dp === DP ? 700 : 400, color: row.dp === DP ? '#f59e0b' : 'var(--fg-2)' }}>{fmt(row.totalMo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Loan programs */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Loan Programs by Minimum Down Payment
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LOAN_PROGRAMS.map(p => (
                <div key={p.name} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px',
                  background: p.name.includes(loanType) ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.2)',
                  borderRadius: 8, border: `1px solid ${p.name.includes(loanType) ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
                }}>
                  <div style={{ minWidth: 44, textAlign: 'center', background: 'rgba(99,102,241,0.15)', borderRadius: 6, padding: '4px 8px', fontSize: 13, fontWeight: 800, color: '#8b5cf6' }}>
                    {p.minDown}%
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{p.note}</div>
                    {HP > 0 && (
                      <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2 }}>
                        Min down: {fmt(HP * p.minDown / 100)} · Loan: {fmt(HP * (1 - p.minDown / 100))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidance */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              What Your Numbers Mean
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                A <strong>{pct(DP)}</strong> down payment means borrowing <strong style={{ color: '#6366f1' }}>{fmt(result.loanAmt)}</strong> at an LTV of {pct(result.ltv * 100, 1)}.{' '}
                {result.pmiRequired
                  ? `PMI adds ${fmt(result.pmiMonthly)}/month to your payment until you reach 20% equity.`
                  : 'No PMI required — you have ≥20% equity from day one.'}
              </li>
              {income > 0 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Your front-end DTI is <strong style={{ color: result.frontEndDTI <= 28 ? '#10b981' : '#f87171' }}>{pct(result.frontEndDTI)}</strong>{' '}
                  (lenders prefer ≤28%). Back-end DTI is <strong style={{ color: result.backEndDTI <= 43 ? '#10b981' : '#f87171' }}>{pct(result.backEndDTI)}</strong>{' '}
                  (FHA max 43%, conventional 36%). {result.backEndDTI > 43 ? 'Consider reducing debts before applying.' : 'Your DTI looks manageable.'}
                </li>
              )}
              {result.monthsToSave !== null && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Saving {fmt(savings)}/month, you can reach your {fmt(result.downAmt)} down payment goal in{' '}
                  <strong style={{ color: '#f59e0b' }}>{result.monthsToSave} months</strong> ({(result.monthsToSave / 12).toFixed(1)} years).
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Putting down 20% ({fmt(HP * 0.2)}) eliminates PMI (saves {fmt(result.pmiMonthly * 12)}/year) and reduces your loan to {fmt(HP * 0.8)}.
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter a home price and adjust the down payment slider to see your full breakdown.
        </div>
      )}
    </div>
  )
}
