'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AmortRow {
  period: number
  date: string
  payment: number
  principal: number
  interest: number
  extra: number
  cumInterest: number
  cumPrincipal: number
  balance: number
}

interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  totalExtra: number
  effectiveAPR: number
  payoffDate: string
  payoffMonths: number
  schedule: AmortRow[]
  crossoverMonth: number   // month # where cumPrincipal first exceeds cumInterest
  interestRatio: number    // totalInterest / totalPayment
}

// ─── Calculation Engine (CFPB-standard amortization) ─────────────────────────

function buildSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraMonthly: number,
  startDate: string,
): LoanResult | null {
  if (principal <= 0 || termMonths <= 0) return null
  const r = annualRate / 100 / 12                          // monthly rate
  const basePayment = r === 0
    ? principal / termMonths
    : (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)

  const schedule: AmortRow[] = []
  let balance = principal
  let cumInterest = 0
  let cumPrincipal = 0
  let crossoverMonth = -1

  const dt = new Date(startDate + 'T00:00:00')
  dt.setMonth(dt.getMonth() + 1)   // first payment one month after origination

  while (balance > 0.005 && schedule.length < 600) {
    const period = schedule.length + 1
    const interestPmt = balance * r
    const principalPmt = basePayment - interestPmt

    // cap extra so we don't overpay
    const extra = Math.min(extraMonthly, Math.max(0, balance - principalPmt))

    const totalPrincipalPmt = principalPmt + extra
    const isFinal = totalPrincipalPmt >= balance - 0.005

    if (isFinal) {
      const finalPrincipal = balance
      const finalPayment = finalPrincipal + interestPmt
      cumInterest += interestPmt
      cumPrincipal += finalPrincipal
      if (crossoverMonth < 0 && cumPrincipal >= cumInterest) crossoverMonth = period
      schedule.push({
        period, date: fmtDate(dt), payment: finalPayment,
        principal: finalPrincipal, interest: interestPmt,
        extra: 0, cumInterest, cumPrincipal, balance: 0,
      })
      break
    }

    balance = balance - totalPrincipalPmt
    cumInterest += interestPmt
    cumPrincipal += totalPrincipalPmt
    if (crossoverMonth < 0 && cumPrincipal >= cumInterest) crossoverMonth = period

    schedule.push({
      period, date: fmtDate(dt),
      payment: basePayment + extra,
      principal: principalPmt, interest: interestPmt, extra,
      cumInterest, cumPrincipal, balance,
    })
    dt.setMonth(dt.getMonth() + 1)
  }

  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0)
  const totalPayment  = schedule.reduce((s, r) => s + r.payment, 0)
  const totalExtra    = schedule.reduce((s, r) => s + r.extra, 0)

  return {
    monthlyPayment: basePayment,
    totalPayment,
    totalInterest,
    totalExtra,
    effectiveAPR: annualRate,   // override with fee-adjusted if needed
    payoffDate: schedule[schedule.length - 1]?.date ?? '',
    payoffMonths: schedule.length,
    schedule,
    crossoverMonth,
    interestRatio: totalPayment > 0 ? totalInterest / totalPayment : 0,
  }
}

/** Newton-Raphson APR when origination fee reduces net proceeds */
function calcEffectiveAPR(
  principal: number,
  originationFee: number,
  monthlyPayment: number,
  nPayments: number,
): number {
  if (originationFee <= 0) return NaN
  const netProceeds = principal - originationFee
  let r = 0.005
  for (let i = 0; i < 200; i++) {
    const pow = Math.pow(1 + r, nPayments)
    const f   = monthlyPayment * (1 - 1 / pow) / r - netProceeds
    const df  = monthlyPayment * (
      (nPayments * Math.pow(1 + r, nPayments - 1) * r - (pow - 1)) /
      (r * r * pow * pow)
    )
    const next = r - f / df
    if (Math.abs(next - r) < 1e-10) { r = next; break }
    r = next < 0 ? 0.0001 : next
  }
  return r * 12 * 100
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
const $ = (n: number, dec = 2) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dec, maximumFractionDigits: dec })
const $0 = (n: number) => $(n, 0)
const pct = (n: number, d = 3) => n.toFixed(d) + '%'

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(schedule: AmortRow[], filename: string) {
  const header = ['Period','Date','Payment','Principal','Interest','Extra Payment','Cum. Interest','Cum. Principal','Balance']
  const rows = schedule.map(r => [
    r.period, r.date,
    r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2),
    r.extra.toFixed(2), r.cumInterest.toFixed(2), r.cumPrincipal.toFixed(2), r.balance.toFixed(2),
  ])
  const csv = [header, ...rows].map(r => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: filename,
  })
  a.click()
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const CARD: CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-strong)',
  borderRadius: 16,
  padding: '24px 28px',
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
const TD: CSSProperties = { padding: '6px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color = '#6366f1' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ padding: '18px 14px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function ScenarioTable({ scenarios }: {
  scenarios: Array<{ label: string; result: LoanResult | null; highlight?: boolean }>
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Scenario', 'Monthly Payment', 'Total Interest', 'Total Cost', 'Payoff'].map(h => (
              <th key={h} style={{ ...TH, textAlign: h === 'Scenario' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scenarios.map(({ label, result: r, highlight }) => (
            <tr key={label} style={{
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: highlight ? 'rgba(139,92,246,0.08)' : 'transparent',
            }}>
              <td style={{ ...TD, textAlign: 'left', color: highlight ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: highlight ? 700 : 400 }}>
                {highlight ? '★ ' : ''}{label}
              </td>
              {r ? (
                <>
                  <td style={{ ...TD, color: highlight ? '#6366f1' : 'var(--fg-2)', fontWeight: highlight ? 700 : 400 }}>{$(r.monthlyPayment)}</td>
                  <td style={{ ...TD }}>{$0(r.totalInterest)}</td>
                  <td style={{ ...TD }}>{$0(r.totalPayment)}</td>
                  <td style={{ ...TD }}>{r.payoffDate}</td>
                </>
              ) : (
                <td colSpan={4} style={{ ...TD, textAlign: 'center', color: 'var(--fg-3)' }}>—</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoanCalculatorClient() {

  // ── Core inputs ──
  const [amount,       setAmount]       = useState('10000')
  const [rate,         setRate]         = useState('6.5')
  const [termYrs,      setTermYrs]      = useState('5')
  const [termMos,      setTermMos]      = useState('0')
  const [startDate,    setStartDate]    = useState(() => new Date().toISOString().slice(0, 7))  // YYYY-MM

  // ── Advanced inputs ──
  const [extraPayment, setExtraPayment] = useState('0')
  const [originFee,    setOriginFee]    = useState('0')
  const [showAdv,      setShowAdv]      = useState(false)

  // ── UI state ──
  const [showSchedule, setShowSchedule] = useState(false)
  const [showAll,      setShowAll]      = useState(false)

  // ─── Derived values ───
  const P      = parseFloat(amount)       || 0
  const r      = parseFloat(rate)         || 0
  const yr     = parseInt(termYrs)        || 0
  const mo     = parseInt(termMos)        || 0
  const N      = yr * 12 + mo
  const extra  = parseFloat(extraPayment) || 0
  const fee    = parseFloat(originFee)    || 0
  const sdFull = startDate ? startDate + '-01' : new Date().toISOString().slice(0, 10)

  // ─── Main result (real-time, no button) ──────────────────────────────────────
  const result = useMemo<LoanResult | null>(() => {
    if (P <= 0 || N <= 0) return null
    const res = buildSchedule(P, r, N, extra, sdFull)
    if (!res) return null
    if (fee > 0) {
      res.effectiveAPR = calcEffectiveAPR(P, fee, res.monthlyPayment, res.payoffMonths)
    }
    return res
  }, [P, r, N, extra, fee, sdFull])

  // ─── Scenarios ───────────────────────────────────────────────────────────────
  const scenarios = useMemo(() => {
    if (!result || P <= 0 || N <= 0) return null
    return {
      base:      result,
      rateUp:    buildSchedule(P, r + 1,             N, extra, sdFull),
      rateDown:  buildSchedule(P, Math.max(0.01, r - 1), N, extra, sdFull),
      shortTerm: N > 12 ? buildSchedule(P, r, Math.max(12, N - 24), extra, sdFull) : null,
      extraHun:  buildSchedule(P, r, N, extra + 100, sdFull),
    }
  }, [result, P, r, N, extra, sdFull])

  // ─── Table rows ──────────────────────────────────────────────────────────────
  const displayRows = result
    ? (showAll ? result.schedule : result.schedule.slice(0, 24))
    : []

  // ─── Guidance ────────────────────────────────────────────────────────────────
  function getGuidance(): string[] {
    if (!result) return []
    const tips: string[] = []
    const interestPct = (result.interestRatio * 100).toFixed(0)

    tips.push(`Your total interest cost is ${$0(result.totalInterest)} — ${interestPct}% of total payments. ${
      result.interestRatio > 0.35 ? 'This is high. Consider a shorter term or extra payments to reduce it.' :
      result.interestRatio < 0.15 ? 'This is relatively low — good loan structure.' :
      'This is typical for this loan type.'
    }`)

    if (extra === 0 && result.payoffMonths > 24) {
      const withExtra = buildSchedule(P, r, N, 50, sdFull)
      if (withExtra) {
        const saved = result.totalInterest - withExtra.totalInterest
        const savedMos = result.payoffMonths - withExtra.payoffMonths
        tips.push(`Adding just $50/month extra saves ${$0(saved)} in interest and pays off the loan ${savedMos} month${savedMos !== 1 ? 's' : ''} early.`)
      }
    }

    if (result.crossoverMonth > 0) {
      tips.push(`The crossover point — where cumulative principal exceeds cumulative interest — occurs at month ${result.crossoverMonth} (${fmtDate(offsetDate(sdFull, result.crossoverMonth))}). Before this point, most of each payment goes toward interest.`)
    }

    if (fee > 0 && !isNaN(result.effectiveAPR)) {
      tips.push(`The origination fee of ${$0(fee)} raises your effective APR from ${pct(r, 2)} to ${pct(result.effectiveAPR, 3)}. Always compare loans by APR, not just stated rate.`)
    }

    if (r > 15) {
      tips.push('Your interest rate is above 15%. Consider credit unions (typically lower rates) or improving your credit score before borrowing.')
    }

    return tips
  }

  function offsetDate(base: string, months: number): Date {
    const d = new Date(base + 'T00:00:00')
    d.setMonth(d.getMonth() + months)
    return d
  }

  const guidance = getGuidance()

  // ─── Input helper ─────────────────────────────────────────────────────────────
  function Field({
    label, value, onChange, placeholder, type = 'number',
    min, max, step, hint,
  }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; type?: string; min?: number; max?: number; step?: number; hint?: string
  }) {
    return (
      <div>
        <label style={LABEL}>{label}</label>
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min} max={max} step={step}
          style={INPUT_BOX}
          aria-label={label}
        />
        {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── INPUTS ── */}
      <div style={CARD}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 16, marginBottom: 16,
        }}>
          <Field label="Loan Amount ($)"       value={amount}   onChange={setAmount}   placeholder="10,000"  min={0} step={100} hint="Total borrowed" />
          <Field label="Annual Interest Rate (%)" value={rate}  onChange={setRate}     placeholder="6.5"     min={0} max={60} step={0.05} />
          <Field label="Term (Years)"           value={termYrs} onChange={setTermYrs}  placeholder="5"       min={0} max={50} />
          <Field label="Term (Extra Months)"    value={termMos} onChange={setTermMos}  placeholder="0"       min={0} max={11} />
          <div>
            <label style={LABEL}>Start Month</label>
            <input
              type="month" value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={INPUT_BOX} aria-label="Start Month"
            />
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdv(v => !v)}
          style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }}
          aria-expanded={showAdv}
        >
          {showAdv ? '▾' : '▸'} Advanced Options
        </button>

        {showAdv && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 16, padding: '16px 0 4px',
            borderTop: '1px solid var(--line-strong)',
          }}>
            <Field label="Extra Monthly Payment ($)" value={extraPayment} onChange={setExtraPayment}
              placeholder="0" min={0} step={50}
              hint="Applied to principal each month"
            />
            <Field label="Origination Fee ($)"       value={originFee}   onChange={setOriginFee}
              placeholder="0" min={0} step={50}
              hint="Upfront lender fee (adjusts APR)"
            />
          </div>
        )}
      </div>

      {/* ── TIER 1: SUMMARY CARD ── */}
      {result ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard label="Monthly Payment"  value={$(result.monthlyPayment)}   color="#6366f1" />
            <MetricCard label="Total Interest"   value={$0(result.totalInterest)}   color="#f59e0b"
              sub={`${(result.interestRatio * 100).toFixed(0)}% of total`} />
            <MetricCard label="Total Cost"        value={$0(result.totalPayment)}    color="#10b981" />
            <MetricCard label="Payoff Date"       value={result.payoffDate}          color="#38bdf8"
              sub={`${result.payoffMonths} payments`} />
            {fee > 0 && !isNaN(result.effectiveAPR) && (
              <MetricCard label="Effective APR"   value={pct(result.effectiveAPR)}  color="#e879f9"
                sub="Fee-adjusted" />
            )}
          </div>

          {/* Interest vs principal bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Payment Breakdown
            </div>
            <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: P, background: '#6366f1' }} title={`Principal: ${$0(P)}`} />
              <div style={{ flex: result.totalInterest, background: '#f59e0b' }} title={`Interest: ${$0(result.totalInterest)}`} />
              {result.totalExtra > 0 && (
                <div style={{ flex: result.totalExtra, background: '#10b981' }} title={`Extra payments: ${$0(result.totalExtra)}`} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Principal', amount: P, color: '#6366f1' },
                { label: 'Interest',  amount: result.totalInterest, color: '#f59e0b' },
                ...(result.totalExtra > 0 ? [{ label: 'Extra', amount: result.totalExtra, color: '#10b981' }] : []),
              ].map(({ label, amount, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>{label}:</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{$0(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── TIER 2: AMORTIZATION SCHEDULE ── */}
          <div>
            <button
              onClick={() => setShowSchedule(v => !v)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 20px',
                background: 'var(--bg-1)', border: '1px solid var(--line-strong)',
                borderRadius: 12, color: 'var(--brand-2)', fontWeight: 700, fontSize: 14,
                cursor: 'pointer',
              }}
              aria-expanded={showSchedule}
            >
              {showSchedule ? '▾' : '▸'} Full Amortization Schedule
              &nbsp;<span style={{ fontWeight: 400, fontSize: 12, color: 'var(--fg-3)' }}>({result.payoffMonths} periods)</span>
              {result.crossoverMonth > 0 && (
                <span style={{ marginLeft: 12, fontSize: 11, color: '#fbbf24', fontWeight: 500 }}>
                  ★ Crossover at month {result.crossoverMonth}
                </span>
              )}
            </button>

            {showSchedule && (
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', marginTop: 4 }}>
                {/* Export buttons */}
                <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-strong)', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => exportCSV(result.schedule, 'loan-amortization')}
                    style={BTN_GHOST}
                    aria-label="Export amortization table as CSV"
                  >
                    ⬇ Export CSV
                  </button>
                  <button
                    onClick={async () => exportCalcPDF({
                      toolName: 'Loan Calculator',
                      inputs: [
                        { label: 'Loan Amount',    value: $(P) },
                        { label: 'Annual Rate',    value: pct(r, 2) },
                        { label: 'Loan Term',      value: `${yr}y ${mo}m` },
                        { label: 'Extra/Month',    value: $(extra) },
                        { label: 'Origination Fee',value: $(fee) },
                      ],
                      results: [
                        { label: 'Monthly Payment',  value: $(result.monthlyPayment), highlight: true },
                        { label: 'Total Interest',   value: $0(result.totalInterest) },
                        { label: 'Total Cost',       value: $0(result.totalPayment) },
                        { label: 'Payoff Date',      value: result.payoffDate },
                        ...(fee > 0 && !isNaN(result.effectiveAPR)
                          ? [{ label: 'Effective APR', value: pct(result.effectiveAPR) }]
                          : []),
                      ],
                      tableHeaders: ['Period','Date','Payment','Principal','Interest','Balance'],
                      tableRows: result.schedule.map(r => ({
                        'Period':    r.period,
                        'Date':      r.date,
                        'Payment':   $(r.payment),
                        'Principal': $(r.principal),
                        'Interest':  $(r.interest),
                        'Balance':   $0(r.balance),
                      })),
                    })}
                    style={BTN_GHOST}
                    aria-label="Export as PDF"
                  >
                    📄 Export PDF
                  </button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Loan amortization schedule">
                    <thead>
                      <tr>
                        {['Period','Date','Payment','Principal','Interest','Extra','Cum. Interest','Balance'].map(h => (
                          <th key={h} style={TH}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map(row => {
                        const isCross = row.period === result.crossoverMonth
                        return (
                          <tr
                            key={row.period}
                            style={{
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              background: isCross ? 'rgba(251,191,36,0.06)' : 'transparent',
                            }}
                            title={isCross ? '★ Crossover: cumulative principal now exceeds cumulative interest' : undefined}
                          >
                            <td style={{ ...TD, color: isCross ? '#fbbf24' : 'var(--fg-3)' }}>
                              {isCross ? '★ ' : ''}{row.period}
                            </td>
                            <td style={{ ...TD, textAlign: 'left' }}>{row.date}</td>
                            <td style={TD}>{$(row.payment)}</td>
                            <td style={{ ...TD, color: '#8b5cf6' }}>{$(row.principal)}</td>
                            <td style={{ ...TD, color: '#f59e0b' }}>{$(row.interest)}</td>
                            <td style={{ ...TD, color: '#10b981' }}>{row.extra > 0 ? $(row.extra) : '—'}</td>
                            <td style={TD}>{$0(row.cumInterest)}</td>
                            <td style={TD}>{$0(row.balance)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    {/* Totals row */}
                    <tfoot>
                      <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                        <td colSpan={2} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>TOTALS</td>
                        <td style={{ ...TD, fontWeight: 700, color: 'var(--fg)' }}>{$0(result.totalPayment)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#8b5cf6' }}>{$0(P)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#f59e0b' }}>{$0(result.totalInterest)}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#10b981' }}>{result.totalExtra > 0 ? $0(result.totalExtra) : '—'}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Show all / collapse */}
                {result.schedule.length > 24 && (
                  <div style={{ textAlign: 'center', padding: '12px 20px', borderTop: '1px solid var(--line-strong)' }}>
                    <button
                      onClick={() => setShowAll(v => !v)}
                      style={{ ...BTN_GHOST, fontSize: 12 }}
                    >
                      {showAll
                        ? `▲ Show first 24 months only`
                        : `▼ Show all ${result.payoffMonths} months`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── TIER 3: SCENARIO ANALYSIS ── */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Scenario Comparison
              </h3>
              <ScenarioTable scenarios={[
                { label: `Base (${pct(r, 2)}, ${yr}y ${mo}m)`,           result: scenarios.base,      highlight: true },
                { label: `Rate +1% (${pct(r + 1, 2)})`,                  result: scenarios.rateUp,    highlight: false },
                { label: `Rate −1% (${pct(Math.max(0.01, r - 1), 2)})`,  result: scenarios.rateDown,  highlight: false },
                ...(scenarios.shortTerm
                  ? [{ label: `Term −2 years (${yr - 2}y)`, result: scenarios.shortTerm, highlight: false }]
                  : []),
                { label: 'Extra $100/month',                               result: scenarios.extraHun,  highlight: false },
              ]} />
            </div>
          )}

          {/* ── TIER 4: INTERPRETATION & GUIDANCE ── */}
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
      ) : (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          {P > 0 && N <= 0
            ? '⚠ Enter a loan term (years or months) to calculate.'
            : P <= 0
            ? 'Enter a loan amount above to see your payment and full schedule.'
            : 'Enter loan details above — results update instantly.'}
        </div>
      )}
    </div>
  )
}
