'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { exportCalcPDF } from '@/lib/calcPdf'

// ─── 2024 US Federal Tax Brackets ────────────────────────────────────────────
// Source: IRS Rev. Proc. 2023-34 (2024 tax year)

const FED_BRACKETS: Record<string, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0,       max: 11600,  rate: 10 },
    { min: 11600,   max: 47150,  rate: 12 },
    { min: 47150,   max: 100525, rate: 22 },
    { min: 100525,  max: 191950, rate: 24 },
    { min: 191950,  max: 243725, rate: 32 },
    { min: 243725,  max: 609350, rate: 35 },
    { min: 609350,  max: Infinity, rate: 37 },
  ],
  married_joint: [
    { min: 0,       max: 23200,  rate: 10 },
    { min: 23200,   max: 94300,  rate: 12 },
    { min: 94300,   max: 201050, rate: 22 },
    { min: 201050,  max: 383900, rate: 24 },
    { min: 383900,  max: 487450, rate: 32 },
    { min: 487450,  max: 731200, rate: 35 },
    { min: 731200,  max: Infinity, rate: 37 },
  ],
  married_separate: [
    { min: 0,       max: 11600,  rate: 10 },
    { min: 11600,   max: 47150,  rate: 12 },
    { min: 47150,   max: 100525, rate: 22 },
    { min: 100525,  max: 191950, rate: 24 },
    { min: 191950,  max: 243725, rate: 32 },
    { min: 243725,  max: 365600, rate: 35 },
    { min: 365600,  max: Infinity, rate: 37 },
  ],
  head_of_household: [
    { min: 0,       max: 16550,  rate: 10 },
    { min: 16550,   max: 63100,  rate: 12 },
    { min: 63100,   max: 100500, rate: 22 },
    { min: 100500,  max: 191950, rate: 24 },
    { min: 191950,  max: 243700, rate: 32 },
    { min: 243700,  max: 609350, rate: 35 },
    { min: 609350,  max: Infinity, rate: 37 },
  ],
}

const STD_DEDUCTIONS: Record<string, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900,
}

const FILING_OPTIONS = [
  { value: 'single',            label: 'Single' },
  { value: 'married_joint',     label: 'Married Filing Jointly' },
  { value: 'married_separate',  label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
]

// FICA constants (2024)
const SS_WAGE_BASE  = 168600   // Social Security wage base 2024
const SS_RATE       = 0.062    // Employee SS rate
const MEDICARE_RATE = 0.0145   // Employee Medicare rate
const AMED_THRESHOLD_SINGLE  = 200000
const AMED_THRESHOLD_JOINT   = 250000
const AMED_SURTAX   = 0.009   // Additional Medicare on high earners

// State tax flat estimates (simplified; not all states have income tax)
const STATE_TAX_RATES: Record<string, number> = {
  'No State Income Tax (TX,FL,NV,SD,WY,WA,AK)': 0,
  'California (CA) ~9.3%': 9.3,
  'New York (NY) ~6.4%': 6.4,
  'Oregon (OR) ~8.75%': 8.75,
  'Minnesota (MN) ~7.05%': 7.05,
  'Illinois (IL) ~4.95%': 4.95,
  'Pennsylvania (PA) ~3.07%': 3.07,
  'Colorado (CO) ~4.4%': 4.4,
  'Georgia (GA) ~5.49%': 5.49,
  'North Carolina (NC) ~4.5%': 4.5,
  'Ohio (OH) ~3.5%': 3.5,
  'Michigan (MI) ~4.05%': 4.05,
  'Arizona (AZ) ~2.5%': 2.5,
  'Other (enter rate)': -1,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BracketRow {
  bracket: string
  rate: number
  incomeInBracket: number
  tax: number
}

interface TaxResult {
  grossIncome: number
  adjustedGrossIncome: number
  taxableIncome: number
  deductionUsed: number
  isItemized: boolean
  // Federal income tax
  federalTax: number
  marginalRate: number
  effectiveFedRate: number
  bracketBreakdown: BracketRow[]
  // FICA
  socialSecurity: number
  medicare: number
  additionalMedicare: number
  totalFICA: number
  // State
  stateTax: number
  stateRate: number
  // Totals
  totalTax: number
  takeHomePay: number
  effectiveTotalRate: number
  monthlyTakeHome: number
  biweeklyTakeHome: number
}

// ─── Engine ───────────────────────────────────────────────────────────────────

function calcTax(
  grossIncome: number,
  otherIncome: number,         // dividends, interest, etc.
  filingStatus: string,
  deductionMode: 'standard' | 'itemized',
  itemizedDeduction: number,
  retirement401k: number,      // pre-tax 401k (reduces AGI)
  hsaContrib: number,          // HSA deduction
  stateRate: number,           // flat rate for simplicity
  isSelfEmployed: boolean,
): TaxResult | null {
  const TOTAL_GROSS = grossIncome + otherIncome
  if (TOTAL_GROSS <= 0) return null

  // Above-the-line deductions: 401k, HSA reduce AGI
  // Self-employed: deduct half of SE tax
  const selfEmployedTax = isSelfEmployed
    ? TOTAL_GROSS * 0.9235 * 0.153  // SE tax on 92.35% of income
    : 0
  const seDeduction = selfEmployedTax / 2   // deduct half of SE tax

  const adjustedGrossIncome = Math.max(0, TOTAL_GROSS - retirement401k - hsaContrib - seDeduction)

  // Deduction
  const stdDed = STD_DEDUCTIONS[filingStatus] ?? 14600
  const deductionUsed = deductionMode === 'itemized'
    ? Math.max(itemizedDeduction, stdDed)   // always take higher
    : stdDed
  const isItemized = deductionMode === 'itemized' && itemizedDeduction > stdDed

  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionUsed)

  // Federal income tax via brackets
  const brackets = FED_BRACKETS[filingStatus] ?? FED_BRACKETS.single
  let federalTax = 0
  let marginalRate = 0
  const bracketBreakdown: BracketRow[] = []

  for (const b of brackets) {
    if (taxableIncome <= b.min) break
    const incomeInBracket = Math.min(taxableIncome, b.max) - b.min
    const tax = (incomeInBracket * b.rate) / 100
    federalTax += tax
    marginalRate = b.rate
    bracketBreakdown.push({
      bracket: `${fmt(b.min)} – ${b.max === Infinity ? '∞' : fmt(b.max)}`,
      rate: b.rate,
      incomeInBracket,
      tax,
    })
  }

  const effectiveFedRate = TOTAL_GROSS > 0 ? (federalTax / TOTAL_GROSS) * 100 : 0

  // FICA (applies to W-2 wages = grossIncome only, not investment income)
  let socialSecurity = 0
  let medicare = 0
  let additionalMedicare = 0

  if (!isSelfEmployed) {
    socialSecurity = Math.min(grossIncome, SS_WAGE_BASE) * SS_RATE
    medicare       = grossIncome * MEDICARE_RATE
    const threshold = filingStatus === 'married_joint' ? AMED_THRESHOLD_JOINT : AMED_THRESHOLD_SINGLE
    if (grossIncome > threshold) additionalMedicare = (grossIncome - threshold) * AMED_SURTAX
  } else {
    // Self-employed pays both halves (but deducts half above)
    socialSecurity = Math.min(grossIncome, SS_WAGE_BASE) * SS_RATE * 2
    medicare       = grossIncome * MEDICARE_RATE * 2
    const threshold = filingStatus === 'married_joint' ? AMED_THRESHOLD_JOINT : AMED_THRESHOLD_SINGLE
    if (grossIncome > threshold) additionalMedicare = (grossIncome - threshold) * AMED_SURTAX
  }
  const totalFICA = socialSecurity + medicare + additionalMedicare

  // State tax (flat rate on AGI for simplicity)
  const stateTax = adjustedGrossIncome * (stateRate / 100)

  const totalTax      = federalTax + totalFICA + stateTax
  const takeHomePay   = TOTAL_GROSS - totalTax - retirement401k - hsaContrib
  const effectiveTotalRate = TOTAL_GROSS > 0 ? (totalTax / TOTAL_GROSS) * 100 : 0

  return {
    grossIncome: TOTAL_GROSS,
    adjustedGrossIncome,
    taxableIncome,
    deductionUsed,
    isItemized,
    federalTax,
    marginalRate,
    effectiveFedRate,
    bracketBreakdown,
    socialSecurity,
    medicare,
    additionalMedicare,
    totalFICA,
    stateTax,
    stateRate,
    totalTax,
    takeHomePay,
    effectiveTotalRate,
    monthlyTakeHome: takeHomePay / 12,
    biweeklyTakeHome: takeHomePay / 26,
  }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()
const $ = (n: number) => fmt(n)
const $2 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const pct = (n: number, d = 2) => n.toFixed(d) + '%'

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
      <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TaxCalculator() {

  // Core
  const [income,       setIncome]       = useState('75000')
  const [filingStatus, setFilingStatus] = useState('single')

  // Advanced
  const [otherIncome,  setOtherIncome]  = useState('0')
  const [deductMode,   setDeductMode]   = useState<'standard' | 'itemized'>('standard')
  const [itemizedDed,  setItemizedDed]  = useState('0')
  const [contrib401k,  setContrib401k]  = useState('0')
  const [hsaContrib,   setHsaContrib]   = useState('0')
  const [stateKey,     setStateKey]     = useState('No State Income Tax (TX,FL,NV,SD,WY,WA,AK)')
  const [customState,  setCustomState]  = useState('5')
  const [selfEmp,      setSelfEmp]      = useState(false)
  const [showAdv,      setShowAdv]      = useState(false)

  const GROSS  = parseFloat(income)      || 0
  const OTHER  = parseFloat(otherIncome) || 0
  const ITEM   = parseFloat(itemizedDed) || 0
  const K401   = parseFloat(contrib401k) || 0
  const HSA    = parseFloat(hsaContrib)  || 0
  const stateRaw = STATE_TAX_RATES[stateKey]
  const STATE_RATE = stateRaw === -1 ? (parseFloat(customState) || 0) : (stateRaw ?? 0)

  const result = useMemo<TaxResult | null>(() =>
    calcTax(GROSS, OTHER, filingStatus, deductMode, ITEM, K401, HSA, STATE_RATE, selfEmp),
    [GROSS, OTHER, filingStatus, deductMode, ITEM, K401, HSA, STATE_RATE, selfEmp]
  )

  // Scenarios: different income levels
  const scenarios = useMemo(() => {
    if (GROSS <= 0) return null
    const run = (g: number) => calcTax(g, OTHER, filingStatus, deductMode, ITEM, K401, HSA, STATE_RATE, selfEmp)
    return {
      m25:  run(Math.max(0, GROSS - 25000)),
      base: result,
      p25:  run(GROSS + 25000),
      p50:  run(GROSS + 50000),
    }
  }, [GROSS, OTHER, filingStatus, deductMode, ITEM, K401, HSA, STATE_RATE, selfEmp, result])

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 16 }}>
          <Field label="Annual W-2 / Wage Income ($)" value={income} onChange={setIncome} placeholder="75,000" min={0} step={1000} />
          <div>
            <label style={LABEL}>Filing Status</label>
            <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={INPUT_BOX} aria-label="Filing Status">
              {FILING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <button onClick={() => setShowAdv(v => !v)} style={{ ...BTN_GHOST, marginBottom: showAdv ? 16 : 0 }} aria-expanded={showAdv}>
          {showAdv ? '▾' : '▸'} Advanced Options (deductions, FICA, state)
        </button>

        {showAdv && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, padding: '16px 0 4px', borderTop: '1px solid var(--line-strong)' }}>
            <Field label="Other Income ($)"           value={otherIncome} onChange={setOtherIncome} placeholder="0" min={0} step={500}
              hint="Dividends, interest, side income" />
            <div>
              <label style={LABEL}>Deduction Method</label>
              <select value={deductMode} onChange={e => setDeductMode(e.target.value as 'standard' | 'itemized')} style={INPUT_BOX}>
                <option value="standard">Standard Deduction</option>
                <option value="itemized">Itemized Deductions</option>
              </select>
              {deductMode === 'standard' && (
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>
                  2024 standard: ${(STD_DEDUCTIONS[filingStatus] ?? 14600).toLocaleString()}
                </div>
              )}
            </div>
            {deductMode === 'itemized' && (
              <Field label="Total Itemized Deductions ($)" value={itemizedDed} onChange={setItemizedDed} placeholder="0" min={0} step={500}
                hint="Mortgage interest, state taxes, charitable, etc." />
            )}
            <Field label="401(k) / 403(b) Contribution ($)" value={contrib401k} onChange={setContrib401k} placeholder="0" min={0} max={23000} step={500}
              hint="2024 limit: $23,000 (under 50)" />
            <Field label="HSA Contribution ($)"          value={hsaContrib}  onChange={setHsaContrib}  placeholder="0" min={0} max={4150} step={100}
              hint="2024 limit: $4,150 single / $8,300 family" />
            <div>
              <label style={LABEL}>State Tax</label>
              <select value={stateKey} onChange={e => setStateKey(e.target.value)} style={INPUT_BOX} aria-label="State Tax">
                {Object.keys(STATE_TAX_RATES).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            {stateRaw === -1 && (
              <Field label="Custom State Rate (%)" value={customState} onChange={setCustomState} placeholder="5" min={0} max={15} step={0.1} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8 }}>
              <input type="checkbox" id="selfEmp" checked={selfEmp} onChange={e => setSelfEmp(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="selfEmp" style={{ ...LABEL, margin: 0, cursor: 'pointer' }}>Self-Employed (pays full 15.3% SE tax)</label>
            </div>
          </div>
        )}
      </div>

      {/* TIER 1: SUMMARY */}
      {result && (
        <>
          {/* Hero take-home */}
          <div style={{ ...CARD, textAlign: 'center', background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Estimated Annual Take-Home Pay
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
              {$(result.takeHomePay)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 8 }}>
              {$(result.monthlyTakeHome)}/month · {$(result.biweeklyTakeHome)}/bi-weekly
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <MetricCard label="Federal Tax"      value={$(result.federalTax)}        color="#f87171"
              sub={`Eff. ${pct(result.effectiveFedRate)}`} />
            <MetricCard label="Marginal Rate"    value={pct(result.marginalRate, 0)} color="#fb923c"
              sub="Top bracket hit" />
            <MetricCard label="FICA (SS+Med)"    value={$(result.totalFICA)}         color="#f59e0b" />
            {result.stateTax > 0 && (
              <MetricCard label={`State Tax (~${pct(STATE_RATE, 1)})`} value={$(result.stateTax)} color="#e879f9" />
            )}
            <MetricCard label="Total Tax Burden" value={$(result.totalTax)}          color="#f87171"
              sub={`Eff. ${pct(result.effectiveTotalRate)}`} />
            <MetricCard label="Taxable Income"   value={$(result.taxableIncome)}     color="#38bdf8"
              sub={`After ${$(result.deductionUsed)} deduction`} />
          </div>

          {/* Tax composition bar */}
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tax Breakdown</div>
            <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: result.takeHomePay,  background: '#10b981' }} title={`Take-home: ${$(result.takeHomePay)}`} />
              <div style={{ flex: result.federalTax,   background: '#f87171' }} title={`Federal: ${$(result.federalTax)}`} />
              <div style={{ flex: result.totalFICA,    background: '#f59e0b' }} title={`FICA: ${$(result.totalFICA)}`} />
              {result.stateTax > 0 && <div style={{ flex: result.stateTax, background: '#e879f9' }} title={`State: ${$(result.stateTax)}`} />}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                { l: 'Take-Home', v: result.takeHomePay,  c: '#10b981' },
                { l: 'Federal',   v: result.federalTax,   c: '#f87171' },
                { l: 'FICA',      v: result.totalFICA,    c: '#f59e0b' },
                ...(result.stateTax > 0 ? [{ l: 'State', v: result.stateTax, c: '#e879f9' }] : []),
              ].map(({ l, v, c }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 1, display: 'inline-block' }} />
                  <span style={{ color: 'var(--fg-3)' }}>{l}:</span>
                  <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>{$(v)}</span>
                  <span style={{ color: 'var(--fg-3)' }}>({pct((v / result.grossIncome) * 100, 0)})</span>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 2: BRACKET BREAKDOWN */}
          <div style={CARD}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              📋 Federal Tax Bracket Breakdown (2024)
            </h3>

            {/* Income flow */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4px 12px', marginBottom: 20, alignItems: 'center', fontSize: 13 }}>
              {[
                { l: 'Gross Income',          v: result.grossIncome,           c: 'var(--fg-2)' },
                { l: `− Pre-tax 401k/HSA`,    v: -(K401 + HSA),                c: '#6366f1', hide: K401 + HSA === 0 },
                { l: '= Adjusted Gross Income (AGI)', v: result.adjustedGrossIncome, c: '#c4b5fd', bold: true },
                { l: `− ${result.isItemized ? 'Itemized' : 'Standard'} Deduction`, v: -result.deductionUsed, c: '#38bdf8' },
                { l: '= Taxable Income',      v: result.taxableIncome,         c: '#c4b5fd', bold: true },
              ].filter(r => !r.hide).map(({ l, v, c, bold }) => (
                <>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{l}</span>
                  <div style={{ height: 1, background: 'var(--line-strong)' }} />
                  <span style={{ color: c, fontWeight: bold ? 800 : 500, textAlign: 'right', fontFamily: 'monospace' }}>{v < 0 ? '−' : ''}{$(Math.abs(v))}</span>
                </>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }} aria-label="Federal tax bracket breakdown">
                <thead>
                  <tr>
                    {['Bracket','Rate','Income in Bracket','Tax in Bracket','Cumulative Tax'].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.bracketBreakdown.map((row, i) => {
                    const cumTax = result.bracketBreakdown.slice(0, i + 1).reduce((s, r) => s + r.tax, 0)
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i === result.bracketBreakdown.length - 1 ? 'rgba(251,146,60,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left' }}>{row.bracket}</td>
                        <td style={{ ...TD, color: '#fb923c', fontWeight: 700 }}>{pct(row.rate, 0)}</td>
                        <td style={TD}>{$(row.incomeInBracket)}</td>
                        <td style={{ ...TD, color: '#f87171' }}>{$(row.tax)}</td>
                        <td style={{ ...TD, fontWeight: 600 }}>{$(cumTax)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                    <td colSpan={3} style={{ ...TD, textAlign: 'left', fontWeight: 700, color: 'var(--fg-2)' }}>TOTAL FEDERAL</td>
                    <td style={{ ...TD, fontWeight: 700, color: '#f87171' }}>{$(result.federalTax)}</td>
                    <td style={{ ...TD, fontWeight: 700 }}>Eff. {pct(result.effectiveFedRate)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* FICA detail */}
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                FICA Payroll Taxes {selfEmp ? '(Self-Employment)' : '(Employee Share)'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
                {[
                  { l: `Social Security (${selfEmp ? '12.4' : '6.2'}%)`, v: result.socialSecurity, note: `On first ${fmt(SS_WAGE_BASE)}` },
                  { l: `Medicare (${selfEmp ? '2.9' : '1.45'}%)`,        v: result.medicare,       note: 'No wage base limit' },
                  ...(result.additionalMedicare > 0 ? [{ l: 'Additional Medicare (+0.9%)', v: result.additionalMedicare, note: 'High earner surtax' }] : []),
                ].map(({ l, v, note }) => (
                  <div key={l} style={{ fontSize: 12 }}>
                    <div style={{ color: 'var(--fg-3)', marginBottom: 2 }}>{l}</div>
                    <div style={{ color: '#f59e0b', fontWeight: 700 }}>{$(v)}</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 10 }}>{note}</div>
                  </div>
                ))}
                <div style={{ fontSize: 12, borderLeft: '2px solid rgba(245,158,11,0.3)', paddingLeft: 10 }}>
                  <div style={{ color: 'var(--fg-3)', marginBottom: 2 }}>Total FICA</div>
                  <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: 15 }}>{$(result.totalFICA)}</div>
                </div>
              </div>
            </div>

            {/* Export */}
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={async () => exportCalcPDF({
                toolName: 'Income Tax Calculator (2024)',
                inputs: [
                  { label: 'Gross Income',      value: $(result.grossIncome) },
                  { label: 'Filing Status',     value: FILING_OPTIONS.find(o => o.value === filingStatus)?.label ?? filingStatus },
                  { label: 'Deduction',         value: `${result.isItemized ? 'Itemized' : 'Standard'} — ${$(result.deductionUsed)}` },
                  { label: '401k / HSA',        value: $(K401 + HSA) },
                  { label: 'State Rate',        value: pct(STATE_RATE) },
                ],
                results: [
                  { label: 'Federal Tax',       value: $(result.federalTax) },
                  { label: 'Effective Fed Rate', value: pct(result.effectiveFedRate) },
                  { label: 'Marginal Rate',     value: pct(result.marginalRate, 0) },
                  { label: 'FICA',              value: $(result.totalFICA) },
                  { label: 'State Tax',         value: $(result.stateTax) },
                  { label: 'Total Tax',         value: $(result.totalTax) },
                  { label: 'Take-Home Pay',     value: $(result.takeHomePay), highlight: true },
                  { label: 'Monthly Take-Home', value: $(result.monthlyTakeHome), highlight: true },
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
                📊 Income Scenario Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>{['Income','Federal Tax','Eff. Rate','FICA','State','Total Tax','Take-Home'].map(h => (
                      <th key={h} style={{ ...TH, textAlign: h === 'Income' ? 'left' : 'right', padding: '10px 14px' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[
                      { label: `${$(GROSS - 25000)} (−$25k)`, r: scenarios.m25, hi: false },
                      { label: `${$(GROSS)} (current)`,        r: scenarios.base, hi: true },
                      { label: `${$(GROSS + 25000)} (+$25k)`, r: scenarios.p25, hi: false },
                      { label: `${$(GROSS + 50000)} (+$50k)`, r: scenarios.p50, hi: false },
                    ].filter(({ r }) => r !== null).map(({ label, r, hi }) => r ? (
                      <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: hi ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                        <td style={{ ...TD, textAlign: 'left', color: hi ? '#c4b5fd' : 'var(--fg-2)', fontWeight: hi ? 700 : 400 }}>{hi ? '★ ' : ''}{label}</td>
                        <td style={TD}>{$(r.federalTax)}</td>
                        <td style={{ ...TD, color: hi ? '#fb923c' : 'var(--fg-2)' }}>{pct(r.effectiveFedRate)}</td>
                        <td style={TD}>{$(r.totalFICA)}</td>
                        <td style={TD}>{$(r.stateTax)}</td>
                        <td style={{ ...TD, color: '#f87171' }}>{$(r.totalTax)}</td>
                        <td style={{ ...TD, color: '#10b981', fontWeight: hi ? 700 : 400 }}>{$(r.takeHomePay)}</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TIER 4: GUIDANCE */}
          <div style={{ ...CARD, background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              💡 Tax Planning Insights
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                Your <strong style={{ color: '#fb923c' }}>marginal rate is {pct(result.marginalRate, 0)}</strong> but your <strong style={{ color: '#10b981' }}>effective rate is only {pct(result.effectiveFedRate)}</strong> — this is because only income in the top bracket is taxed at {pct(result.marginalRate, 0)}. Getting a raise won't reduce your overall take-home pay.
              </li>
              {K401 + HSA < 23000 && GROSS > 50000 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Contributing the 2024 401k maximum ($23,000) would reduce your taxable income by {$(23000 - K401 - HSA)} beyond your current contributions, saving approximately {$(((23000 - K401 - HSA) * result.marginalRate) / 100)} in federal taxes at your marginal rate.
                </li>
              )}
              {!result.isItemized && ITEM > 0 && (
                <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                  Your itemized deductions ({$(ITEM)}) are below the standard deduction ({$(STD_DEDUCTIONS[filingStatus] ?? 14600)}) — you automatically get the higher standard deduction. You&apos;d need {$(STD_DEDUCTIONS[filingStatus] - ITEM)} more in qualifying deductions to benefit from itemizing.
                </li>
              )}
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                FICA taxes ({$(result.totalFICA)}) are separate from income tax and are not reduced by deductions or filing status. If you are self-employed, you pay both the employer and employee share ({pct(15.3, 1)} total), but can deduct half as a business expense.
              </li>
              <li style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7 }}>
                <strong style={{ color: '#fbbf24' }}>Estimates only.</strong> These calculations use 2024 IRS brackets and standard deductions for federal income tax, with a simplified flat rate for state tax. They do not include the alternative minimum tax (AMT), tax credits (EITC, child tax credit, education credits), capital gains rates, or itemized deductions specifics. Always consult a CPA or tax professional for your actual tax situation.
              </li>
            </ul>
          </div>
        </>
      )}

      {!result && (
        <div style={{ ...CARD, textAlign: 'center', padding: '40px 20px', color: 'var(--fg-3)', fontSize: 14 }}>
          Enter your annual income above — tax breakdown updates instantly.
        </div>
      )}
    </div>
  )
}
