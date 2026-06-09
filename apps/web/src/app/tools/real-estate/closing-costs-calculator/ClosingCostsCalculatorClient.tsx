'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Style Tokens ─────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: '#c4b5fd', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 10px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '6px 10px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '16px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const fmt = (n: number, dec = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const pct = (n: number, d = 2) => n.toFixed(d) + '%'

// ─── State Transfer Tax by state (avg effective rate as %) ───────────────────

const STATE_TRANSFER_TAX: Record<string, number> = {
  AL: 0.1, AK: 0, AZ: 0, AR: 0.33, CA: 0.11, CO: 0.01, CT: 0.75,
  DE: 1.5, FL: 0.7, GA: 0.1, HI: 0.1, ID: 0, IL: 0.1, IN: 0,
  IA: 0.16, KS: 0.26, KY: 0.1, LA: 0, ME: 0.44, MD: 0.5, MA: 0.456,
  MI: 0.75, MN: 0.33, MS: 0, MO: 0, MT: 0, NE: 0.225, NV: 0.13,
  NH: 0.75, NJ: 1.0, NM: 0, NY: 0.4, NC: 0.2, ND: 0, OH: 0.1,
  OK: 0.15, OR: 0.1, PA: 1.0, RI: 0.46, SC: 0.37, SD: 0, TN: 0.37,
  TX: 0, UT: 0, VT: 1.25, VA: 0.25, WA: 1.1, WV: 0.11, WI: 0.3, WY: 0,
}
const STATE_LIST = Object.keys(STATE_TRANSFER_TAX).sort()

// ─── Calculation Logic ────────────────────────────────────────────────────────

interface ClosingFee { name: string; low: number; typical: number; high: number; payer: 'buyer' | 'seller' }

function calcClosingCosts(
  homePrice: number,
  downPct: number,
  loanType: string,
  state: string,
  firstTimeBuyer: boolean,
  commissionPct: number,
  originationPct: number,
  rate: number,
) {
  const downAmt = homePrice * downPct / 100
  const loanAmt = homePrice - downAmt
  const transferTaxRate = STATE_TRANSFER_TAX[state] ?? 0.5

  // Monthly interest for prepaid (1 month)
  const prepaidInterest = loanAmt * (rate / 100 / 12)

  const fees: ClosingFee[] = [
    { name: 'Loan Origination Fee', low: loanAmt * 0.005, typical: loanAmt * (originationPct / 100), high: loanAmt * 0.02, payer: 'buyer' },
    { name: 'Appraisal Fee', low: 300, typical: 400, high: 600, payer: 'buyer' },
    { name: 'Home Inspection', low: 300, typical: 400, high: 500, payer: 'buyer' },
    { name: "Title Insurance (Lender's)", low: loanAmt * 0.003, typical: loanAmt * 0.005, high: loanAmt * 0.007, payer: 'buyer' },
    { name: "Title Insurance (Owner's)", low: homePrice * 0.002, typical: homePrice * 0.003, high: homePrice * 0.004, payer: 'buyer' },
    { name: 'Recording Fees', low: 75, typical: 150, high: 250, payer: 'buyer' },
    { name: 'Transfer Tax (Buyer Share)', low: homePrice * transferTaxRate / 100 * 0.5, typical: homePrice * transferTaxRate / 100 * 0.5, high: homePrice * transferTaxRate / 100 * 0.5, payer: 'buyer' },
    { name: 'Prepaid Interest (1 month)', low: prepaidInterest * 0.5, typical: prepaidInterest, high: prepaidInterest * 1.5, payer: 'buyer' },
    { name: 'Homeowner Insurance Escrow (2 mo)', low: homePrice * 0.005 / 6, typical: homePrice * 0.005 / 6 * 2, high: homePrice * 0.0075 / 6 * 2, payer: 'buyer' },
    { name: 'Property Tax Escrow (2–3 mo)', low: homePrice * 0.01 / 4, typical: homePrice * 0.012 / 4, high: homePrice * 0.015 / 4, payer: 'buyer' },
    ...(loanType === 'FHA' ? [{ name: 'FHA Upfront MIP (1.75%)', low: loanAmt * 0.0175, typical: loanAmt * 0.0175, high: loanAmt * 0.0175, payer: 'buyer' as const }] : []),
    { name: 'Real Estate Commission', low: homePrice * 0.05, typical: homePrice * commissionPct / 100, high: homePrice * 0.06, payer: 'seller' },
    { name: 'Transfer Tax (Seller Share)', low: homePrice * transferTaxRate / 100 * 0.5, typical: homePrice * transferTaxRate / 100 * 0.5, high: homePrice * transferTaxRate / 100 * 0.5, payer: 'seller' },
    { name: "Attorney / Closing Agent", low: 500, typical: 800, high: 1500, payer: 'seller' },
  ]

  const buyerFees = fees.filter(f => f.payer === 'buyer')
  const sellerFees = fees.filter(f => f.payer === 'seller')

  const totalBuyerClosing = buyerFees.reduce((s, f) => s + f.typical, 0)
  const totalSellerCosts = sellerFees.reduce((s, f) => s + f.typical, 0)
  const totalFundsNeeded = downAmt + totalBuyerClosing
  const sellerNetProceeds = homePrice - totalSellerCosts

  return { fees, buyerFees, sellerFees, totalBuyerClosing, totalSellerCosts, totalFundsNeeded, sellerNetProceeds, downAmt, loanAmt }
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(rows: ClosingFee[], filename: string) {
  const hdr = ['Fee Name', 'Payer', 'Low Estimate', 'Typical', 'High Estimate']
  const data = rows.map(r => [r.name, r.payer, r.low.toFixed(2), r.typical.toFixed(2), r.high.toFixed(2)])
  const csv = [hdr, ...data].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: filename,
  })
  a.click()
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClosingCostsCalculatorClient() {
  const [homePrice, setHomePrice] = useState('400000')
  const [downPct, setDownPct] = useState('10')
  const [loanType, setLoanType] = useState('Conventional')
  const [state, setState] = useState('CA')
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(false)
  const [commissionPct, setCommissionPct] = useState('5.5')
  const [originationPct, setOriginationPct] = useState('1')
  const [rate, setRate] = useState('6.5')
  const [showAdv, setShowAdv] = useState(false)
  const [showItemized, setShowItemized] = useState(false)

  const HP = parseFloat(homePrice) || 0
  const DP = parseFloat(downPct) || 0
  const comm = parseFloat(commissionPct) || 5.5
  const orig = parseFloat(originationPct) || 1
  const r = parseFloat(rate) || 6.5

  const result = useMemo(() =>
    HP > 0 ? calcClosingCosts(HP, DP, loanType, state, firstTimeBuyer, comm, orig, r) : null,
    [HP, DP, loanType, state, firstTimeBuyer, comm, orig, r]
  )

  // Down payment scenarios: 3%, 3.5%, 5%, 10%, 20%
  const scenarios = useMemo(() => {
    if (!HP) return []
    return [3, 3.5, 5, 10, 20].map(dp => {
      const c = calcClosingCosts(HP, dp, loanType, state, firstTimeBuyer, comm, orig, r)
      const ltv = (100 - dp) / 100
      const hasPMI = ltv > 0.8
      const loan = HP * (1 - dp / 100)
      const pmiMonthly = hasPMI ? loan * 0.0085 / 12 : 0
      return { dp, ...c, hasPMI, pmiMonthly }
    })
  }, [HP, loanType, state, firstTimeBuyer, comm, orig, r])

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
          <Field label="Down Payment (%)" value={downPct} onChange={setDownPct} min={0} max={100} step={0.5} placeholder="10"
            hint={HP > 0 ? `= ${fmt(HP * DP / 100)} · LTV ${(100 - DP).toFixed(1)}%` : ''} />
          <div>
            <label style={LABEL}>Loan Type</label>
            <select value={loanType} onChange={e => setLoanType(e.target.value)} style={INPUT_BOX} aria-label="Loan Type">
              <option value="Conventional">Conventional</option>
              <option value="FHA">FHA</option>
              <option value="VA">VA</option>
              <option value="USDA">USDA</option>
            </select>
          </div>
          <div>
            <label style={LABEL}>State</label>
            <select value={state} onChange={e => setState(e.target.value)} style={INPUT_BOX} aria-label="State">
              {STATE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field label="Interest Rate (%)" value={rate} onChange={setRate} min={0} max={25} step={0.05} placeholder="6.5" />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <label style={{ ...LABEL, marginBottom: 10 }}>First-Time Buyer</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
              <input type="checkbox" checked={firstTimeBuyer} onChange={e => setFirstTimeBuyer(e.target.checked)} style={{ width: 16, height: 16 }} />
              Yes (may qualify for exemptions)
            </label>
          </div>
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced (commission & origination)
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Agent Commission (%)" value={commissionPct} onChange={setCommissionPct} min={0} max={10} step={0.1} placeholder="5.5"
              hint="Seller pays; split between agents" />
            <Field label="Origination Fee (% of loan)" value={originationPct} onChange={setOriginationPct} min={0} max={5} step={0.1} placeholder="1" />
          </div>
        )}
      </div>

      {/* RESULTS */}
      {result && (
        <>
          {/* Summary metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Total Buyer Closing" value={fmt(result.totalBuyerClosing)} color="#6366f1"
              sub={`${pct(result.totalBuyerClosing / HP * 100, 1)} of price`} />
            <MetricCard label="Down Payment" value={fmt(result.downAmt)} color="#8b5cf6"
              sub={`${DP}% of price`} />
            <MetricCard label="Total Funds Needed" value={fmt(result.totalFundsNeeded)} color="#f59e0b"
              sub="Down + closing costs" />
            <MetricCard label="Loan Amount" value={fmt(result.loanAmt)} color="#38bdf8"
              sub={`LTV ${((result.loanAmt / HP) * 100).toFixed(1)}%`} />
            <MetricCard label="Seller Net Proceeds" value={fmt(result.sellerNetProceeds)} color="#10b981"
              sub={`After ${pct(result.totalSellerCosts / HP * 100, 1)} in costs`} />
            <MetricCard label="Total Seller Costs" value={fmt(result.totalSellerCosts)} color="#e879f9"
              sub={`Commission + fees`} />
          </div>

          {/* Total funds bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Funds Needed Breakdown
            </div>
            <div style={{ height: 16, borderRadius: 8, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: result.downAmt, background: '#8b5cf6' }} title={`Down: ${fmt(result.downAmt)}`} />
              <div style={{ flex: result.totalBuyerClosing, background: '#f59e0b' }} title={`Closing: ${fmt(result.totalBuyerClosing)}`} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Down Payment', v: result.downAmt, c: '#8b5cf6' },
                { label: 'Buyer Closing Costs', v: result.totalBuyerClosing, c: '#f59e0b' },
              ].map(({ label, v, c }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>{label}:</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 700 }}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized fee table */}
          <div>
            <button onClick={() => setShowItemized(v => !v)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: '#c4b5fd', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              aria-expanded={showItemized}>
              {showItemized ? '▾' : '▸'} Itemized Fee Table (Low / Typical / High)
            </button>

            {showItemized && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => exportCSV(result.fees, 'closing-costs')} style={BTN_GHOST}>⬇ Export CSV</button>
                  <button onClick={async () => exportCalcPDF({
                    toolName: 'Closing Costs Calculator',
                    inputs: [
                      { label: 'Home Price', value: fmt(HP) },
                      { label: 'Down Payment', value: `${DP}% (${fmt(result.downAmt)})` },
                      { label: 'Loan Type', value: loanType },
                      { label: 'State', value: state },
                      { label: 'Interest Rate', value: pct(r, 2) },
                    ],
                    results: [
                      { label: 'Buyer Closing Costs', value: fmt(result.totalBuyerClosing), highlight: true },
                      { label: 'Total Funds Needed', value: fmt(result.totalFundsNeeded), highlight: true },
                      { label: 'Seller Net Proceeds', value: fmt(result.sellerNetProceeds) },
                      { label: 'Total Seller Costs', value: fmt(result.totalSellerCosts) },
                    ],
                    tableHeaders: ['Fee', 'Payer', 'Low', 'Typical', 'High'],
                    tableRows: result.fees.map(f => ({
                      Fee: f.name, Payer: f.payer,
                      Low: fmt(f.low), Typical: fmt(f.typical), High: fmt(f.high),
                    })),
                  })} style={BTN_GHOST}>📄 Export PDF</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Itemized closing costs">
                    <thead>
                      <tr>
                        {['Fee', 'Payer', 'Low', 'Typical', 'High'].map((h, i) => (
                          <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Buyer section */}
                      <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                        <td colSpan={5} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: '#8b5cf6', fontSize: 11, padding: '8px 10px' }}>BUYER COSTS</td>
                      </tr>
                      {result.buyerFees.map(fee => (
                        <tr key={fee.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-2)' }}>{fee.name}</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>Buyer</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{fmt(fee.low)}</td>
                          <td style={{ ...TD, fontWeight: 600, color: 'var(--fg)' }}>{fmt(fee.typical)}</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{fmt(fee.high)}</td>
                        </tr>
                      ))}
                      <tr style={{ background: 'rgba(99,102,241,0.05)', borderTop: '1px solid rgba(99,102,241,0.2)' }}>
                        <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: '#6366f1' }}>Total Buyer Closing Costs</td>
                        <td />
                        <td style={{ ...TD, fontWeight: 700 }}>{fmt(result.buyerFees.reduce((s, f) => s + f.low, 0))}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#6366f1' }}>{fmt(result.totalBuyerClosing)}</td>
                        <td style={{ ...TD, fontWeight: 700 }}>{fmt(result.buyerFees.reduce((s, f) => s + f.high, 0))}</td>
                      </tr>

                      {/* Seller section */}
                      <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                        <td colSpan={5} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: '#e879f9', fontSize: 11, padding: '8px 10px' }}>SELLER COSTS</td>
                      </tr>
                      {result.sellerFees.map(fee => (
                        <tr key={fee.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ ...TD, textAlign: 'left', color: 'var(--fg-2)' }}>{fee.name}</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>Seller</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{fmt(fee.low)}</td>
                          <td style={{ ...TD, fontWeight: 600, color: 'var(--fg)' }}>{fmt(fee.typical)}</td>
                          <td style={{ ...TD, color: 'var(--fg-3)' }}>{fmt(fee.high)}</td>
                        </tr>
                      ))}
                      <tr style={{ background: 'rgba(232,121,249,0.05)', borderTop: '1px solid rgba(232,121,249,0.2)' }}>
                        <td style={{ ...TD, textAlign: 'left', fontWeight: 700, color: '#e879f9' }}>Total Seller Costs</td>
                        <td />
                        <td style={{ ...TD, fontWeight: 700 }}>{fmt(result.sellerFees.reduce((s, f) => s + f.low, 0))}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#e879f9' }}>{fmt(result.totalSellerCosts)}</td>
                        <td style={{ ...TD, fontWeight: 700 }}>{fmt(result.sellerFees.reduce((s, f) => s + f.high, 0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Down payment scenario table */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Down Payment Scenario Comparison
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Down %', 'Down Amt', 'Loan Amt', 'Buyer Closing', 'Total Needed', 'PMI?', 'Est. PMI/mo'].map((h, i) => (
                      <th key={h} style={{ ...TH, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map(s => (
                    <tr key={s.dp} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: s.dp === DP ? 'rgba(139,92,246,0.1)' : 'transparent',
                    }}>
                      <td style={{ ...TD, textAlign: 'left', color: s.dp === DP ? '#c4b5fd' : 'var(--fg-2)', fontWeight: s.dp === DP ? 700 : 400 }}>
                        {s.dp === DP ? '★ ' : ''}{s.dp}%
                      </td>
                      <td style={TD}>{fmt(s.downAmt)}</td>
                      <td style={TD}>{fmt(s.loanAmt)}</td>
                      <td style={TD}>{fmt(s.totalBuyerClosing)}</td>
                      <td style={{ ...TD, fontWeight: 600, color: s.dp === DP ? '#f59e0b' : 'var(--fg-2)' }}>{fmt(s.totalFundsNeeded)}</td>
                      <td style={{ ...TD, color: s.hasPMI ? '#e879f9' : '#10b981' }}>{s.hasPMI ? 'Yes' : 'No'}</td>
                      <td style={{ ...TD, color: s.hasPMI ? '#e879f9' : 'var(--fg-3)' }}>{s.hasPMI ? fmt(s.pmiMonthly) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guidance */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              What Your Numbers Mean
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Your buyer closing costs are <strong style={{ color: '#6366f1' }}>{fmt(result.totalBuyerClosing)}</strong> ({pct(result.totalBuyerClosing / HP * 100, 1)} of purchase price). Combined with your {pct(DP, 0)} down payment of {fmt(result.downAmt)}, you'll need <strong style={{ color: '#f59e0b' }}>{fmt(result.totalFundsNeeded)}</strong> in cash at closing.
              </li>
              {DP < 20 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  With {pct(DP, 0)} down, PMI applies (LTV {(100 - DP).toFixed(1)}%). At 0.85% annually, that's ~{fmt(result.loanAmt * 0.0085 / 12)}/month until you reach 20% equity. Increasing your down payment to 20% would eliminate PMI entirely.
                </li>
              )}
              {loanType === 'FHA' && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  FHA loans require a 1.75% upfront mortgage insurance premium ({fmt(result.loanAmt * 0.0175)}) plus annual MIP. Consider a conventional loan if your credit score exceeds 680 to avoid this cost.
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                The seller will net approximately <strong style={{ color: '#10b981' }}>{fmt(result.sellerNetProceeds)}</strong> after paying {pct(comm, 1)} commission ({fmt(HP * comm / 100)}) and transfer taxes. Transfer tax rate in {state}: {pct(STATE_TRANSFER_TAX[state] ?? 0, 2)}.
              </li>
              {firstTimeBuyer && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  As a first-time buyer, check your state's programs — many offer transfer tax exemptions or closing cost assistance that could reduce your out-of-pocket by thousands.
                </li>
              )}
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter a home price above to see a full breakdown of buyer and seller closing costs.
        </div>
      )}
    </div>
  )
}
