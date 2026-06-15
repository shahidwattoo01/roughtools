'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AmortRow {
  month: number
  date: string
  payment: number        // P&I only
  principal: number
  interest: number
  extra: number
  pmi: number
  cumInterest: number
  cumPrincipal: number
  balance: number
  ltv: number
}

interface MortgageResult {
  // Loan
  principal: number
  piPayment: number          // principal + interest
  // PITI breakdown
  monthlyTax: number
  monthlyInsurance: number
  monthlyPMI: number
  monthlyHOA: number
  totalMonthly: number       // full PITI + PMI + HOA
  // Totals
  totalInterest: number
  totalPayment: number       // P&I only * n
  totalPMI: number
  totalCost: number          // everything paid over life
  // Schedule
  schedule: AmortRow[]
  payoffMonths: number
  payoffDate: string
  crossoverMonth: number
  pmiDropMonth: number       // month PMI automatically drops (LTV ≤ 80%)
  // Metrics
  ltv: number                // loan-to-value at origination
  effectiveAPR: number
}

// ─── Calculation Engine ───────────────────────────────────────────────────────

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function calcMortgage(
  homePrice: number,
  downPayment: number,        // absolute $
  annualRate: number,          // %
  termMonths: number,
  extraMonthly: number,
  propertyTaxAnnual: number,
  insuranceAnnual: number,
  pmiRate: number,             // % of loan per year (0.5–1.5%)
  hoaMonthly: number,
  originationFee: number,
  startDate: string,
): MortgageResult | null {
  const P = homePrice - downPayment
  if (P <= 0 || homePrice <= 0 || termMonths <= 0 || annualRate < 0) return null

  const r    = annualRate / 100 / 12
  const n    = termMonths
  const piPayment = r === 0
    ? P / n
    : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const monthlyTax       = propertyTaxAnnual / 12
  const monthlyInsurance = insuranceAnnual / 12
  const monthlyHOA       = hoaMonthly

  let balance = P
  let cumInterest = 0
  let cumPrincipal = 0
  let crossoverMonth = -1
  let pmiDropMonth = -1
  let totalPMI = 0
  const schedule: AmortRow[] = []

  const dt = new Date(startDate + 'T00:00:00')
  dt.setMonth(dt.getMonth() + 1)

  while (balance > 0.005 && schedule.length < 600) {
    const month = schedule.length + 1
    const currentLTV = balance / homePrice

    // PMI applies when LTV > 80%
    const pmiAnnual = currentLTV > 0.80 ? (balance * pmiRate) / 100 : 0
    const pmiMonthly = pmiAnnual / 12
    if (pmiDropMonth < 0 && currentLTV <= 0.80 && month > 1) pmiDropMonth = month

    const interestPmt = balance * r
    const principalPmt  = piPayment - interestPmt
    const extra = Math.min(extraMonthly, Math.max(0, balance - principalPmt))
    const totalPrincipalPmt = principalPmt + extra
    const isFinal = totalPrincipalPmt >= balance - 0.005

    if (isFinal) {
      const finalPrincipal = balance
      cumInterest  += interestPmt
      cumPrincipal += finalPrincipal
      totalPMI += pmiMonthly
      if (crossoverMonth < 0 && cumPrincipal >= cumInterest) crossoverMonth = month

      schedule.push({
        month, date: fmtDate(dt),
        payment: finalPrincipal + interestPmt,
        principal: finalPrincipal, interest: interestPmt, extra: 0,
        pmi: pmiMonthly, cumInterest, cumPrincipal, balance: 0,
        ltv: 0,
      })
      break
    }

    balance -= totalPrincipalPmt
    cumInterest  += interestPmt
    cumPrincipal += totalPrincipalPmt
    totalPMI += pmiMonthly
    if (crossoverMonth < 0 && cumPrincipal >= cumInterest) crossoverMonth = month

    schedule.push({
      month, date: fmtDate(dt),
      payment: piPayment + extra, principal: principalPmt, interest: interestPmt, extra,
      pmi: pmiMonthly, cumInterest, cumPrincipal, balance,
      ltv: balance / homePrice,
    })
    dt.setMonth(dt.getMonth() + 1)
  }

  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0)
  const totalPayment  = schedule.reduce((s, r) => s + r.payment, 0)
  const totalCost     = totalPayment + totalPMI +
    (propertyTaxAnnual / 12 + insuranceAnnual / 12 + hoaMonthly) * schedule.length

  // Effective APR (includes origination fee)
  let effectiveAPR = annualRate
  if (originationFee > 0) {
    const netProceeds = P - originationFee
    let guess = r
    for (let i = 0; i < 200; i++) {
      const pow  = Math.pow(1 + guess, n)
      const f    = piPayment * (1 - 1 / pow) / guess - netProceeds
      const df   = piPayment * ((n * Math.pow(1 + guess, n - 1) * guess - (pow - 1)) / (guess * guess * pow * pow))
      const next = guess - f / df
      if (Math.abs(next - guess) < 1e-10) { guess = next; break }
      guess = next < 0 ? 0.0001 : next
    }
    effectiveAPR = guess * 12 * 100
  }

  const totalMonthly = piPayment + monthlyTax + monthlyInsurance +
    (P / homePrice > 0.80 ? (P * (pmiRate / 100)) / 12 : 0) + monthlyHOA

  return {
    principal: P,
    piPayment,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI: P / homePrice > 0.80 ? (P * (pmiRate / 100)) / 12 : 0,
    monthlyHOA,
    totalMonthly,
    totalInterest,
    totalPayment,
    totalPMI,
    totalCost,
    schedule,
    payoffMonths: schedule.length,
    payoffDate: schedule[schedule.length - 1]?.date ?? '',
    crossoverMonth,
    pmiDropMonth,
    ltv: P / homePrice,
    effectiveAPR,
  }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const $ = (n: number, dec = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const $2 = (n: number) => $(n, 2)
const pct = (n: number, d = 3) => n.toFixed(d) + '%'

// ─── CSV ──────────────────────────────────────────────────────────────────────

function exportCSV(schedule: AmortRow[], filename: string) {
  const hdr = ['Month','Date','P&I Payment','Principal','Interest','Extra','PMI','Cum. Interest','Cum. Principal','Balance','LTV']
  const rows = schedule.map(r => [
    r.month, r.date, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2),
    r.extra.toFixed(2), r.pmi.toFixed(2), r.cumInterest.toFixed(2),
    r.cumPrincipal.toFixed(2), r.balance.toFixed(2), (r.ltv * 100).toFixed(2) + '%',
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
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 10px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '5px 10px', fontSize: 11, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

function MetricCard({ label, value, sub, color = '#6366f1' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '16px 12px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Pie chart (SVG) ──────────────────────────────────────────────────────────

function PieDonut({ slices }: { slices: { value: number; color: string; label: string }[] }) {
  const total = slices.reduce((s, r) => s + r.value, 0)
  if (!total) return null
  const r = 60, cx = 75, cy = 75
  let angle = -0.25 * Math.PI * 2
  const paths = slices.map(s => {
    const frac = s.value / total
    if (frac <= 0) return null
    const sweep = frac >= 1 ? 0.9999 : frac
    const end = angle + sweep * Math.PI * 2
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end)
    const large = sweep > 0.5 ? 1 : 0
    const path = `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`
    angle = end
    return { path, color: s.color, label: s.label, pct: (frac * 100).toFixed(0) }
  }).filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={150} height={150} viewBox="0 0 150 150">
        {paths.map((p, i) => p && <path key={i} d={p.path} fill={p.color} />)}
        <circle cx={cx} cy={cy} r={r * 0.5} fill="var(--bg-1)" />
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', justifyContent: 'center' }}>
        {slices.filter(s => s.value > 0).map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--fg-3)' }}>
            <span style={{ width: 8, height: 8, background: s.color, borderRadius: 1, display: 'inline-block' }} />
            {s.label}: {$(s.value)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MortgageCalculatorClient() {

  // Core
  const [homePrice,   setHomePrice]   = useState('400000')
  const [downAmt,     setDownAmt]     = useState('')
  const [downPct,     setDownPct]     = useState('20')
  const [downMode,    setDownMode]    = useState<'pct' | 'amt'>('pct')
  const [rate,        setRate]        = useState('6.5')
  const [term,        setTerm]        = useState('30')
  const [startDate,   setStartDate]   = useState(() => new Date().toISOString().slice(0, 7))

  // Advanced
  const [extraPmt,    setExtraPmt]    = useState('0')
  const [propTax,     setPropTax]     = useState('4800')   // ~1.2% of 400k
  const [insurance,   setInsurance]   = useState('1200')
  const [pmiRate,     setPmiRate]     = useState('0.85')   // typical PMI %
  const [hoa,         setHoa]         = useState('0')
  const [originFee,   setOriginFee]   = useState('0')
  const [showAdv,     setShowAdv]     = useState(false)
  const [showSched,   setShowSched]   = useState(false)
  const [showAll,     setShowAll]     = useState(false)

  // Derived
  const HP   = parseFloat(homePrice) || 0
  const termMos = parseInt(term) * 12

  const downAmount = downMode === 'pct'
    ? HP * ((parseFloat(downPct) || 0) / 100)
    : parseFloat(downAmt) || 0
  const downPercent = HP > 0 ? (downAmount / HP) * 100 : 0

  const sdFull = startDate ? startDate + '-01' : new Date().toISOString().slice(0, 10)

  const result = useMemo<MortgageResult | null>(() => calcMortgage(
    HP, downAmount, parseFloat(rate) || 0, termMos,
    parseFloat(extraPmt) || 0,
    parseFloat(propTax) || 0,
    parseFloat(insurance) || 0,
    parseFloat(pmiRate) || 0,
    parseFloat(hoa) || 0,
    parseFloat(originFee) || 0,
    sdFull,
  ), [HP, downAmount, rate, termMos, extraPmt, propTax, insurance, pmiRate, hoa, originFee, sdFull])

  // Scenarios
  const scenarios = useMemo(() => {
    if (!result || HP <= 0) return null
    const R  = parseFloat(rate) || 0
    const EP = parseFloat(extraPmt) || 0
    const run = (r: number, t: number, ep: number) => calcMortgage(
      HP, downAmount, r, t * 12, ep,
      parseFloat(propTax) || 0, parseFloat(insurance) || 0,
      parseFloat(pmiRate) || 0, parseFloat(hoa) || 0, 0, sdFull,
    )
    return {
      base:    result,
      rate05:  run(R + 0.5,  parseInt(term), EP),
      rate_05: run(Math.max(0.01, R - 0.5), parseInt(term), EP),
      term15:  parseInt(term) !== 15 ? run(R, 15, EP)  : null,
      term30:  parseInt(term) !== 30 ? run(R, 30, EP)  : null,
      extra500: run(R, parseInt(term), EP + 500),
    }
  }, [result, HP, downAmount, rate, term, extraPmt, propTax, insurance, pmiRate, hoa, sdFull])

  // Guidance
  const guidance = useMemo(() => {
    if (!result) return []
    const tips: string[] = []
    const interestPct = ((result.totalInterest / result.totalPayment) * 100).toFixed(0)

    tips.push(`Your P&I payment is ${$2(result.piPayment)}/month. Total out-of-pocket including taxes, insurance${result.monthlyPMI > 0 ? ', PMI,' : ''} and HOA is ${$2(result.totalMonthly)}/month — ${((result.totalMonthly / result.piPayment - 1) * 100).toFixed(0)}% more than the base payment.`)

    if (result.ltv > 0.80) {
      tips.push(`Your LTV is ${pct(result.ltv * 100, 1)} — above 80%, so PMI applies until month ${result.pmiDropMonth} (${result.schedule[result.pmiDropMonth - 1]?.date ?? ''}). PMI will cost ${$(result.totalPMI)} total before dropping automatically. A larger down payment (to reach 20%) would eliminate this cost.`)
    }

    tips.push(`Over ${result.payoffMonths} months, you'll pay ${$(result.totalInterest)} in interest — ${interestPct}% of total P&I payments. ${parseInt(term) === 30 ? `Switching to a 15-year term${scenarios?.term15 ? ` would reduce total interest to ${$(scenarios.term15.totalInterest)} (saving ${$(result.totalInterest - scenarios.term15.totalInterest)})` : ''} but increases the monthly payment.` : ''}`)

    if (result.crossoverMonth > 0) {
      tips.push(`Crossover point: at month ${result.crossoverMonth} (${result.schedule[result.crossoverMonth - 1]?.date ?? ''}), your cumulative principal paid first exceeds cumulative interest paid. Before this, most of each payment goes to interest.`)
    }

    if (scenarios?.extra500) {
      const saved = result.totalInterest - scenarios.extra500.totalInterest
      const mosSaved = result.payoffMonths - scenarios.extra500.payoffMonths
      tips.push(`Adding $500/month extra to principal would save ${$(saved)} in interest and pay off the loan ${Math.floor(mosSaved / 12)} year${Math.floor(mosSaved / 12) !== 1 ? 's' : ''} ${mosSaved % 12} months early.`)
    }

    return tips
  }, [result, scenarios, term])

  const displayRows = result ? (showAll ? result.schedule : result.schedule.slice(0, 24)) : []

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Field label="Home Price ($)"  value={homePrice} onChange={setHomePrice} placeholder="400,000" min={0} step={5000} />

          {/* Down payment — toggle $ vs % */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <span style={LABEL as CSSProperties}>Down Payment</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['pct', 'amt'] as const).map(m => (
                  <button key={m} onClick={() => setDownMode(m)} style={{
                    padding: '2px 8px', fontSize: 11, borderRadius: 4, cursor: 'pointer',
                    background: downMode === m ? 'rgba(139,92,246,0.3)' : 'transparent',
                    border: '1px solid rgba(139,92,246,0.3)', color: 'var(--brand-2)',
                  }}>{m === 'pct' ? '%' : '$'}</button>
                ))}
              </div>
            </div>
            {downMode === 'pct' ? (
              <input type="number" value={downPct} onChange={e => setDownPct(e.target.value)}
                placeholder="20" min={0} max={100} step={0.5} style={INPUT_BOX} aria-label="Down payment percent" />
            ) : (
              <input type="number" value={downAmt} onChange={e => setDownAmt(e.target.value)}
                placeholder="80,000" min={0} step={1000} style={INPUT_BOX} aria-label="Down payment amount" />
            )}
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>
              {downMode === 'pct' ? `= ${$(downAmount)}` : `= ${downPercent.toFixed(1)}%`}
              {downPercent < 20 ? ' ⚠ PMI applies' : ' ✓ No PMI'}
            </div>
          </div>

          <Field label="Annual Interest Rate (%)" value={rate} onChange={setRate} placeholder="6.5" min={0} max={25} step={0.05} />

          <div>
            <label style={LABEL}>Loan Term</label>
            <select value={term} onChange={e => setTerm(e.target.value)} style={INPUT_BOX} aria-label="Loan Term">
              <option value="30">30 Years (standard)</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years (low interest)</option>
              <option value="10">10 Years</option>
            </select>
          </div>

          <div>
            <label style={LABEL}>First Payment Month</label>
            <input type="month" value={startDate} onChange={e => setStartDate(e.target.value)}
              style={INPUT_BOX} aria-label="First payment month" />
          </div>
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options (taxes, insurance, PMI, HOA)
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Property Tax ($/yr)"    value={propTax}    onChange={setPropTax}    placeholder="4,800" min={0} step={100}
              hint="Typically 0.5%–2.5% of home value/yr" />
            <Field label="Home Insurance ($/yr)"  value={insurance}  onChange={setInsurance}  placeholder="1,200" min={0} step={100}
              hint="National avg ~$1,200–$2,000/yr" />
            <Field label="PMI Rate (% of loan/yr)" value={pmiRate}  onChange={setPmiRate}    placeholder="0.85"  min={0} max={3} step={0.05}
              hint="Applies when LTV > 80%; typical 0.5–1.5%" />
            <Field label="HOA Fee ($/month)"       value={hoa}       onChange={setHoa}        placeholder="0"     min={0} step={25} />
            <Field label="Extra Monthly Payment ($)" value={extraPmt} onChange={setExtraPmt} placeholder="0"     min={0} step={50}
              hint="Applied to principal each month" />
            <Field label="Origination Fee ($)"     value={originFee} onChange={setOriginFee} placeholder="0"     min={0} step={100}
              hint="Adjusts effective APR" />
          </div>
        )}
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          {/* Monthly payment breakdown */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.3)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Total Monthly Payment (PITI{result.monthlyPMI > 0 ? ' + PMI' : ''}{result.monthlyHOA > 0 ? ' + HOA' : ''})
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#6366f1', lineHeight: 1 }}>
                {$2(result.totalMonthly)}
              </span>
              <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>/month</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
              {[
                { l: 'Principal & Interest', v: result.piPayment, c: '#8b5cf6' },
                { l: 'Property Tax',         v: result.monthlyTax, c: '#f59e0b' },
                { l: 'Home Insurance',       v: result.monthlyInsurance, c: '#38bdf8' },
                ...(result.monthlyPMI > 0 ? [{ l: 'PMI', v: result.monthlyPMI, c: '#e879f9' }] : []),
                ...(result.monthlyHOA > 0 ? [{ l: 'HOA', v: result.monthlyHOA, c: '#6ee7b7' }] : []),
              ].map(({ l, v, c }) => v > 0 ? (
                <div key={l} style={{ fontSize: 12 }}>
                  <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>{l}</div>
                  <div style={{ color: c, fontWeight: 700 }}>{$2(v)}</div>
                </div>
              ) : null)}
            </div>
            {/* PITI bar */}
            <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', marginTop: 12 }}>
              {[
                { v: result.piPayment, c: '#8b5cf6' }, { v: result.monthlyTax, c: '#f59e0b' },
                { v: result.monthlyInsurance, c: '#38bdf8' }, { v: result.monthlyPMI, c: '#e879f9' },
                { v: result.monthlyHOA, c: '#6ee7b7' },
              ].map((s, i) => s.v > 0 ? <div key={i} style={{ flex: s.v, background: s.c }} /> : null)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="Loan Amount"      value={$(result.principal)}       color="#8b5cf6" />
            <MetricCard label="Total Interest"   value={$(result.totalInterest)}   color="#f59e0b"
              sub={`${((result.totalInterest / result.totalPayment) * 100).toFixed(0)}% of P&I`} />
            <MetricCard label="Payoff Date"      value={result.payoffDate}         color="#38bdf8"
              sub={`${result.payoffMonths} payments`} />
            <MetricCard label="LTV at Origination" value={pct(result.ltv * 100, 1)} color={result.ltv > 0.8 ? '#e879f9' : '#10b981'}
              sub={result.ltv > 0.8 ? '⚠ PMI required' : '✓ No PMI'} />
            {parseFloat(originFee) > 0 && !isNaN(result.effectiveAPR) && (
              <MetricCard label="Effective APR"  value={pct(result.effectiveAPR)}  color="#fb923c"
                sub="Fee-adjusted rate" />
            )}
          </div>

          {/* PieDonut */}
          <div style={CARD}>
            <PieDonut slices={[
              { value: result.principal,         color: '#8b5cf6', label: 'Principal' },
              { value: result.totalInterest,     color: '#f59e0b', label: 'Interest' },
              ...(result.totalPMI > 0 ? [{ value: result.totalPMI, color: '#e879f9', label: 'PMI' }] : []),
            ]} />
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--fg-3)' }}>
              Total cost over loan life: <strong style={{ color: 'var(--fg-2)' }}>{$(result.totalCost)}</strong>
              {' (includes taxes, insurance, PMI, HOA)'}
            </div>
          </div>

          {/* TIER 2: AMORTIZATION SCHEDULE */}
          <div>
            <button onClick={() => setShowSched(v => !v)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 20px', background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              aria-expanded={showSched}>
              {showSched ? '▾' : '▸'} Full Amortization Schedule
              <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)', marginLeft: 8 }}>({result.payoffMonths} payments)</span>
              {result.crossoverMonth > 0 && (
                <span style={{ marginLeft: 12, fontSize: 11, color: '#fbbf24', fontWeight: 500 }}>★ Crossover at month {result.crossoverMonth}</span>
              )}
            </button>

            {showSched && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button onClick={() => exportCSV(result.schedule, 'mortgage-amortization')} style={BTN_GHOST}>⬇ Export CSV</button>
                  <button onClick={async () => exportCalcPDF({
                    toolName: 'Mortgage Calculator',
                    inputs: [
                      { label: 'Home Price',       value: $(HP) },
                      { label: 'Down Payment',     value: `${$(downAmount)} (${downPercent.toFixed(1)}%)` },
                      { label: 'Interest Rate',    value: pct(parseFloat(rate) || 0, 2) },
                      { label: 'Loan Term',        value: `${term} years` },
                      { label: 'Extra/Month',      value: $(parseFloat(extraPmt) || 0) },
                      { label: 'Property Tax/yr',  value: $(parseFloat(propTax) || 0) },
                      { label: 'Insurance/yr',     value: $(parseFloat(insurance) || 0) },
                    ],
                    results: [
                      { label: 'Monthly P&I',    value: $2(result.piPayment),     highlight: true },
                      { label: 'Total Monthly',  value: $2(result.totalMonthly),  highlight: true },
                      { label: 'Total Interest', value: $(result.totalInterest) },
                      { label: 'Total PMI',      value: $(result.totalPMI) },
                      { label: 'Payoff Date',    value: result.payoffDate },
                      { label: 'LTV',            value: pct(result.ltv * 100, 1) },
                    ],
                    tableHeaders: ['Month','Date','P&I','Principal','Interest','PMI','Balance','LTV'],
                    tableRows: result.schedule.map(r => ({
                      Month: r.month, Date: r.date, 'P&I': $2(r.payment),
                      Principal: $2(r.principal), Interest: $2(r.interest),
                      PMI: r.pmi > 0 ? $2(r.pmi) : '—',
                      Balance: $(r.balance), LTV: (r.ltv * 100).toFixed(1) + '%',
                    })),
                  })} style={BTN_GHOST}>📄 Export PDF</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }} aria-label="Mortgage amortization schedule">
                    <thead>
                      <tr>
                        {['Month','Date','P&I Payment','Principal','Interest','Extra','PMI','Cum. Interest','Balance','LTV'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map(row => {
                        const isCross = row.month === result.crossoverMonth
                        const isPMIDrop = row.month === result.pmiDropMonth
                        return (
                          <tr key={row.month} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: isCross ? 'rgba(251,191,36,0.05)' : isPMIDrop ? 'rgba(232,121,249,0.05)' : 'transparent',
                          }}>
                            <td style={{ ...TD, color: isCross ? '#fbbf24' : isPMIDrop ? '#e879f9' : 'var(--fg-3)' }}>
                              {isCross ? '★' : isPMIDrop ? '⊗' : ''} {row.month}
                            </td>
                            <td style={{ ...TD, textAlign: 'left' }}>{row.date}</td>
                            <td style={TD}>{$2(row.payment)}</td>
                            <td style={{ ...TD, color: '#8b5cf6' }}>{$2(row.principal)}</td>
                            <td style={{ ...TD, color: '#f59e0b' }}>{$2(row.interest)}</td>
                            <td style={{ ...TD, color: '#10b981' }}>{row.extra > 0 ? $2(row.extra) : '—'}</td>
                            <td style={{ ...TD, color: '#e879f9' }}>{row.pmi > 0 ? $2(row.pmi) : '—'}</td>
                            <td style={TD}>{$(row.cumInterest)}</td>
                            <td style={TD}>{$(row.balance)}</td>
                            <td style={{ ...TD, color: row.ltv > 0.8 ? '#e879f9' : '#10b981' }}>{(row.ltv * 100).toFixed(1)}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <td colSpan={2} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>TOTALS</td>
                        <td style={{ ...TD, fontWeight: 700 }}>{$(result.totalPayment)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#8b5cf6' }}>{$(result.principal)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#f59e0b' }}>{$(result.totalInterest)}</td>
                        <td />
                        <td style={{ ...TD, fontWeight: 700, color: '#e879f9' }}>{result.totalPMI > 0 ? $(result.totalPMI) : '—'}</td>
                        <td colSpan={3} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {result.schedule.length > 24 && (
                  <div style={{ textAlign: 'center', padding: '12px 20px', borderTop: '1px solid var(--line-strong)' }}>
                    <button onClick={() => setShowAll(v => !v)} style={{ ...BTN_GHOST, fontSize: 12 }}>
                      {showAll ? `▲ Show first 24 months` : `▼ Show all ${result.payoffMonths} months`}
                    </button>
                  </div>
                )}
                <div style={{ padding: '8px 16px', fontSize: 11, color: 'var(--fg-3)', borderTop: '1px solid var(--line-strong)' }}>
                  ★ = Crossover month (cumulative principal {'>'} cumulative interest) · ⊗ = PMI drops
                </div>
              </div>
            )}
          </div>

          {/* TIER 3: SCENARIOS */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Scenario Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>{['Scenario','Monthly P&I','Total Interest','Total PMI','Payoff','vs. Base Interest'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Scenario' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[
                      { label: `Base (${pct(parseFloat(rate) || 0, 2)}, ${term}yr)`, r: scenarios.base, hi: true },
                      { label: `Rate +0.5% (${pct((parseFloat(rate) || 0) + 0.5, 2)})`, r: scenarios.rate05, hi: false },
                      { label: `Rate −0.5% (${pct(Math.max(0.01, (parseFloat(rate) || 0) - 0.5), 2)})`, r: scenarios.rate_05, hi: false },
                      ...(scenarios.term15 ? [{ label: '15-Year Term', r: scenarios.term15, hi: false }] : []),
                      ...(scenarios.term30 ? [{ label: '30-Year Term', r: scenarios.term30, hi: false }] : []),
                      { label: 'Extra $500/month', r: scenarios.extra500, hi: false },
                    ].filter(({ r }) => r !== null).map(({ label, r, hi }) => r ? (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hi ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: hi ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{hi ? '★ ' : ''}{label}</td>
                        <td style={{ ...TD, fontWeight: hi ? 700 : 400, color: hi ? '#6366f1' : 'var(--fg-2)' }}>{$2(r.piPayment)}</td>
                        <td style={TD}>{$(r.totalInterest)}</td>
                        <td style={TD}>{r.totalPMI > 0 ? $(r.totalPMI) : '—'}</td>
                        <td style={TD}>{r.payoffDate}</td>
                        <td style={{ ...TD, color: r.totalInterest < scenarios.base.totalInterest ? '#10b981' : r.totalInterest > scenarios.base.totalInterest ? '#f87171' : 'var(--fg-3)' }}>
                          {hi ? '—' : (r.totalInterest <= scenarios.base.totalInterest ? '' : '+') + $(r.totalInterest - scenarios.base.totalInterest)}
                        </td>
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
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
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
          Enter home price, down payment, rate and term above — full PITI breakdown appears instantly.
        </div>
      )}
    </div>
  )
}
