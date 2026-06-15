'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual'

const PERIOD_LABELS: Record<Period, string> = {
  hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly',
  biweekly: 'Bi-Weekly (every 2 wks)', semimonthly: 'Semi-Monthly (2×/mo)',
  monthly: 'Monthly', annual: 'Annual',
}

// ─── 2024 Tax Brackets (single filer — simplified) ────────────────────────────

const BRACKETS_SINGLE = [
  { max: 11600,  rate: 0.10 },
  { max: 47150,  rate: 0.12 },
  { max: 100525, rate: 0.22 },
  { max: 191950, rate: 0.24 },
  { max: 243725, rate: 0.32 },
  { max: 609350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
]

const STANDARD_DED = 14600

function calcFederalTax(taxableIncome: number): { tax: number; marginal: number } {
  let tax = 0, prev = 0, marginal = 0
  for (const b of BRACKETS_SINGLE) {
    if (taxableIncome <= prev) break
    const slice = Math.min(taxableIncome, b.max) - prev
    tax += slice * b.rate
    marginal = b.rate
    prev = b.max
  }
  return { tax, marginal }
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function annualize(amount: number, period: Period, hpw: number, wpw: number): number {
  switch (period) {
    case 'hourly':      return amount * hpw * wpw
    case 'daily':       return amount * (wpw * 5)      // work days = weeks × 5
    case 'weekly':      return amount * wpw
    case 'biweekly':    return amount * (wpw / 2)
    case 'semimonthly': return amount * 24
    case 'monthly':     return amount * 12
    case 'annual':      return amount
    default:            return amount
  }
}

interface SalaryResult {
  annual: number
  // All periods
  hourly: number; daily: number; weekly: number
  biweekly: number; semimonthly: number; monthly: number
  // After days off
  effectiveHourly: number   // accounting for vacation/holiday days
  workWeeks: number
  workDays: number
  // Tax
  agi: number
  taxableIncome: number
  federalTax: number
  fica: number
  stateTax: number
  totalTax: number
  effectiveRate: number
  marginalRate: number
  // Take-home
  annualTakeHome: number
  monthlyTakeHome: number
  biweeklyTakeHome: number
  hourlyTakeHome: number
  // Benefits
  totalCompensation: number
}

function calcSalary(
  amount: number,
  period: Period,
  hpw: number,                // hours per week
  vacationDays: number,        // PTO days off (reduces work days)
  holidayDays: number,         // federal holidays
  contrib401k: number,         // pre-tax 401k
  healthInsMonthly: number,    // pre-tax health ins deduction
  stateRate: number,           // flat state tax %
  employerBenefitsAnnual: number, // employer benefit value (401k match, health)
): SalaryResult {
  // Working weeks/days
  const workDays  = 260 - vacationDays - holidayDays  // 52 × 5 = 260 possible
  const workWeeks = workDays / 5
  const annual    = annualize(amount, period, hpw, workWeeks + vacationDays / 5 + holidayDays / 5)
  // ↑ We annualize at full 52-week year so hourly = annual / (52×hpw)

  const hourly       = annual / (52 * hpw)
  const daily        = annual / 260
  const weekly       = annual / 52
  const biweekly     = annual / 26
  const semimonthly  = annual / 24
  const monthly      = annual / 12
  const effectiveHourly = annual / (workDays * (hpw / 5))   // actual hours worked

  // Pre-tax deductions
  const pretaxDed = contrib401k + healthInsMonthly * 12
  const agi = Math.max(0, annual - pretaxDed)
  const taxableIncome = Math.max(0, agi - STANDARD_DED)

  const { tax: federalTax, marginal: marginalRate } = calcFederalTax(taxableIncome)

  // FICA
  const ssWageBase = 168600
  const fica = Math.min(annual, ssWageBase) * 0.062 + annual * 0.0145

  // State
  const stateTax = agi * (stateRate / 100)

  const totalTax = federalTax + fica + stateTax
  const effectiveRate = annual > 0 ? (totalTax / annual) * 100 : 0

  const annualTakeHome = annual - totalTax - pretaxDed
  const totalCompensation = annual + employerBenefitsAnnual

  return {
    annual, hourly, daily, weekly, biweekly, semimonthly, monthly,
    effectiveHourly, workWeeks, workDays,
    agi, taxableIncome, federalTax, fica, stateTax, totalTax,
    effectiveRate, marginalRate,
    annualTakeHome,
    monthlyTakeHome: annualTakeHome / 12,
    biweeklyTakeHome: annualTakeHome / 26,
    hourlyTakeHome: annualTakeHome / (52 * hpw),
    totalCompensation,
  }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const $ = (n: number) => '$' + Math.round(n).toLocaleString()
const $2 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const pct = (n: number, d = 1) => n.toFixed(d) + '%'

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px' }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT_BOX: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 15, boxSizing: 'border-box' }
const BTN_GHOST: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const TH: CSSProperties = { padding: '9px 12px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg-3)', textAlign: 'right', background: 'rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }
const TD: CSSProperties = { padding: '7px 12px', fontSize: 12, textAlign: 'right', color: 'var(--fg-2)', whiteSpace: 'nowrap' }

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SalaryCalculatorClient() {

  const [amount,       setAmount]       = useState('75000')
  const [period,       setPeriod]       = useState<Period>('annual')
  const [hpw,          setHpw]          = useState('40')
  const [vacDays,      setVacDays]      = useState('10')
  const [holidays,     setHolidays]     = useState('11')   // US federal holidays
  const [contrib401k,  setContrib401k]  = useState('0')
  const [healthIns,    setHealthIns]    = useState('0')    // per month
  const [stateRate,    setStateRate]    = useState('0')
  const [empBenefits,  setEmpBenefits]  = useState('0')    // employer value
  const [showAdv,      setShowAdv]      = useState(false)

  const AMT  = parseFloat(amount)      || 0
  const HPW  = parseFloat(hpw)         || 40
  const VAC  = parseFloat(vacDays)     || 0
  const HOL  = parseFloat(holidays)    || 0
  const K401 = parseFloat(contrib401k) || 0
  const HI   = parseFloat(healthIns)   || 0
  const SR   = parseFloat(stateRate)   || 0
  const EB   = parseFloat(empBenefits) || 0

  const result = useMemo<SalaryResult | null>(() => {
    if (AMT <= 0) return null
    return calcSalary(AMT, period, HPW, VAC, HOL, K401, HI, SR, EB)
  }, [AMT, period, HPW, VAC, HOL, K401, HI, SR, EB])

  // Scenarios: different salary levels
  const scenarios = useMemo(() => {
    if (!result || AMT <= 0) return null
    const run = (a: number) => calcSalary(a, 'annual', HPW, VAC, HOL, K401, HI, SR, EB)
    return {
      m10k: run(Math.max(0, result.annual - 10000)),
      base: result,
      p10k: run(result.annual + 10000),
      p25k: run(result.annual + 25000),
    }
  }, [result, AMT, HPW, VAC, HOL, K401, HI, SR, EB])

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

  const allPeriods: Period[] = ['hourly', 'daily', 'weekly', 'biweekly', 'semimonthly', 'monthly', 'annual']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* INPUTS */}
      <div style={CARD}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={LABEL}>Salary / Wage Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="75,000" min={0} step={500} style={INPUT_BOX} aria-label="Salary amount" />
          </div>
          <div>
            <label style={LABEL}>Pay Period</label>
            <select value={period} onChange={e => setPeriod(e.target.value as Period)} style={INPUT_BOX} aria-label="Pay period">
              {allPeriods.map(p => <option key={p} value={p}>{PERIOD_LABELS[p]}</option>)}
            </select>
          </div>
          <Field label="Hours per Week" value={hpw} onChange={setHpw} placeholder="40" min={1} max={80} step={0.5} />
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options (taxes, benefits, time off)
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Vacation / PTO Days"   value={vacDays}     onChange={setVacDays}     placeholder="10" min={0} max={60} hint="Paid days off per year" />
            <Field label="Holiday Days"           value={holidays}    onChange={setHolidays}    placeholder="11" min={0} max={30} hint="US: 11 federal holidays" />
            <Field label="401k Contribution ($/yr)" value={contrib401k} onChange={setContrib401k} placeholder="0" min={0} max={23000} step={500}
              hint="Pre-tax, reduces federal tax" />
            <Field label="Health Ins. Deduction ($/mo)" value={healthIns} onChange={setHealthIns} placeholder="0" min={0} step={25}
              hint="Pre-tax employee premium" />
            <Field label="State Income Tax Rate (%)" value={stateRate} onChange={setStateRate} placeholder="0" min={0} max={15} step={0.1}
              hint="Your state's rate (flat estimate)" />
            <Field label="Employer Benefits Value ($/yr)" value={empBenefits} onChange={setEmpBenefits} placeholder="0" min={0} step={500}
              hint="401k match, health, etc. (total comp)" />
          </div>
        )}
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          {/* Hero annual */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { l: 'Annual Salary',    v: $(result.annual),          c: '#6366f1' },
              { l: 'Monthly Take-Home', v: $(result.monthlyTakeHome), c: '#10b981' },
              { l: 'Bi-Weekly Take-Home', v: $(result.biweeklyTakeHome), c: '#38bdf8' },
              { l: 'Effective Hourly Rate', v: $2(result.hourly),    c: '#f59e0b', hint: `(vs. ${$2(result.effectiveHourly)} effective)` },
              { l: 'Total Tax Burden', v: $(result.totalTax),         c: '#f87171', hint: pct(result.effectiveRate) + ' effective' },
              ...(EB > 0 ? [{ l: 'Total Compensation', v: $(result.totalCompensation), c: '#e879f9', hint: `incl. $${EB.toLocaleString()} employer benefits` }] : []),
            ].map(({ l, v, c, hint }) => (
              <div key={l} style={{ padding: '16px 12px', background: 'var(--bg-2)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                {hint && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{hint}</div>}
              </div>
            ))}
          </div>

          {/* TIER 2: PAY PERIOD CONVERSION TABLE */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📋 Full Pay Period Conversion
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} aria-label="Salary pay period conversions">
                <thead>
                  <tr>
                    {['Pay Period','Gross','Tax Est.','Net Take-Home','Periods/Year'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Pay Period' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    { l: 'Hourly',        g: result.hourly,      n: result.hourlyTakeHome,     py: 52 * HPW },
                    { l: 'Daily',         g: result.daily,       n: result.annualTakeHome / result.workDays, py: result.workDays },
                    { l: 'Weekly',        g: result.weekly,      n: result.annualTakeHome / 52, py: 52 },
                    { l: 'Bi-Weekly',     g: result.biweekly,    n: result.biweeklyTakeHome,    py: 26 },
                    { l: 'Semi-Monthly',  g: result.semimonthly, n: result.annualTakeHome / 24, py: 24 },
                    { l: 'Monthly',       g: result.monthly,     n: result.monthlyTakeHome,     py: 12 },
                    { l: 'Annual',        g: result.annual,      n: result.annualTakeHome,      py: 1  },
                  ] as { l: string; g: number; n: number; py: number }[]).map(({ l, g, n, py }) => {
                    const tax = g - n
                    const isPeriod = l.toLowerCase().replace(/[- ]/g, '') === period.toLowerCase().replace(/[- ]/g, '')
                    return (
                      <tr key={l} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: isPeriod ? 'rgba(139,92,246,0.08)' : 'transparent',
                      }}>
                        <td style={{ ...TD, textAlign: 'left', color: isPeriod ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: isPeriod ? 700 : 400 }}>{isPeriod ? '★ ' : ''}{l}</td>
                        <td style={{ ...TD, fontWeight: isPeriod ? 700 : 400 }}>{$2(g)}</td>
                        <td style={{ ...TD, color: '#f87171' }}>{$2(tax)}</td>
                        <td style={{ ...TD, color: '#10b981', fontWeight: isPeriod ? 700 : 400 }}>{$2(n)}</td>
                        <td style={{ ...TD, color: 'var(--fg-3)' }}>{Number.isInteger(py) ? py : py.toFixed(0)}×</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Tax breakdown */}
            <div style={{ marginTop: 20, padding: '16px', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Annual Tax Breakdown
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                {[
                  { l: 'Federal Income Tax', v: result.federalTax,  note: `Eff. ${pct(result.effectiveRate)} · Marginal ${pct(result.marginalRate * 100, 0)}` },
                  { l: 'FICA (SS + Medicare)', v: result.fica,       note: '6.2% SS + 1.45% Medicare' },
                  ...(SR > 0 ? [{ l: `State Tax (~${pct(SR)})`, v: result.stateTax, note: `On AGI of ${$(result.agi)}` }] : []),
                ].map(({ l, v, note }) => (
                  <div key={l} style={{ fontSize: 12 }}>
                    <div style={{ color: 'var(--fg-3)', marginBottom: 2 }}>{l}</div>
                    <div style={{ color: '#f87171', fontWeight: 700 }}>{$(v)}</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 10 }}>{note}</div>
                  </div>
                ))}
                <div style={{ borderLeft: '2px solid rgba(248,113,113,0.3)', paddingLeft: 10, fontSize: 12 }}>
                  <div style={{ color: 'var(--fg-3)', marginBottom: 2 }}>Total Taxes</div>
                  <div style={{ color: '#f87171', fontWeight: 900, fontSize: 15 }}>{$(result.totalTax)}</div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 10 }}>Eff. rate: {pct(result.effectiveRate)}</div>
                </div>
              </div>
            </div>

            {/* Time off summary */}
            {(VAC > 0 || HOL > 0) && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, fontSize: 12 }}>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>Work schedule: </span>
                <span style={{ color: 'var(--fg-2)' }}>
                  {result.workDays} actual working days/year ({VAC} vacation + {HOL} holiday days off).
                  Your effective hourly rate (actual hours worked) = <strong style={{ color: '#38bdf8' }}>{$2(result.effectiveHourly)}/hr</strong>
                  {' '}vs. nominal {$2(result.hourly)}/hr.
                </span>
              </div>
            )}

            {/* Export */}
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={async () => exportCalcPDF({
                toolName: 'Salary Calculator',
                inputs: [
                  { label: 'Salary', value: `${$2(AMT)} / ${PERIOD_LABELS[period]}` },
                  { label: 'Hours/Week', value: String(HPW) },
                  { label: 'Annual Gross', value: $(result.annual) },
                ],
                results: [
                  { label: 'Annual Gross',           value: $(result.annual) },
                  { label: 'Monthly Take-Home',      value: $(result.monthlyTakeHome), highlight: true },
                  { label: 'Bi-Weekly Take-Home',    value: $(result.biweeklyTakeHome), highlight: true },
                  { label: 'Hourly Rate',            value: $2(result.hourly) },
                  { label: 'Federal Income Tax',     value: $(result.federalTax) },
                  { label: 'FICA',                   value: $(result.fica) },
                  { label: 'Total Taxes',            value: $(result.totalTax) },
                  { label: 'Effective Tax Rate',     value: pct(result.effectiveRate) },
                ],
              })} style={BTN_GHOST}>
                📄 Export PDF
              </button>
            </div>
          </div>

          {/* TIER 3: SCENARIO COMPARISON */}
          {scenarios && (
            <div style={CARD}>
              <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                📊 Salary Scenario Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>{['Annual Salary','Monthly Take-Home','Bi-Wkly Take-Home','Tax Burden','Eff. Rate'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Annual Salary' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[
                      { r: scenarios.m10k, hi: false },
                      { r: scenarios.base, hi: true  },
                      { r: scenarios.p10k, hi: false },
                      { r: scenarios.p25k, hi: false },
                    ].filter(({ r }) => r !== null && r.annual >= 0).map(({ r, hi }) => r ? (
                      <tr key={r.annual} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hi ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: hi ? 'var(--brand-2)' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>
                          {hi ? '★ ' : ''}{$(r.annual)}/yr
                        </td>
                        <td style={{ ...TD, color: hi ? '#10b981' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{$(r.monthlyTakeHome)}</td>
                        <td style={TD}>{$(r.biweeklyTakeHome)}</td>
                        <td style={{ ...TD, color: '#f87171' }}>{$(r.totalTax)}</td>
                        <td style={TD}>{pct(r.effectiveRate)}</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TIER 4: GUIDANCE */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              💡 What Your Numbers Mean
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Your <strong style={{ color: '#f87171' }}>marginal rate is {pct(result.marginalRate * 100, 0)}</strong> but your <strong style={{ color: '#10b981' }}>effective tax rate is {pct(result.effectiveRate)}</strong> — only income in the top bracket is taxed at the marginal rate.
              </li>
              {K401 > 0 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Your ${K401.toLocaleString()} 401k contribution reduces your federal taxable income, saving approximately ${Math.round(K401 * result.marginalRate).toLocaleString()} in federal taxes. This is effectively an instant {pct(result.marginalRate * 100, 0)} return on every 401k dollar.
                </li>
              )}
              {EB > 0 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Including employer benefits valued at ${EB.toLocaleString()}/year, your total compensation is ${result.totalCompensation.toLocaleString()} — always compare total compensation (not just salary) when evaluating job offers.
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Your hourly rate is <strong style={{ color: '#f59e0b' }}>{$2(result.hourly)}/hr</strong> based on a {HPW}-hour week. For evaluating freelance or contract rates: you need to cover your own benefits, self-employment tax (15.3%), and paid time off — a common rule of thumb is to multiply your employee hourly rate by 1.5–2× for equivalent freelance billing.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                These are federal estimates only for a single filer using the standard deduction. Actual take-home pay depends on your filing status, state taxes, additional deductions, and tax credits. Use this as a planning guide — consult a tax professional or use tax software (TurboTax, H&R Block) for your actual return.
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your salary or wage amount above — full pay breakdown appears instantly.
        </div>
      )}
    </div>
  )
}
