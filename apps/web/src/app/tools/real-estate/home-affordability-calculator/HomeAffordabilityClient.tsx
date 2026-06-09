'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function HomeAffordabilityClient() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = !mounted || resolvedTheme === 'dark'

  const card: React.CSSProperties = { background: dark ? '#13132a' : '#f5f3ff', border: `1px solid ${dark ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.2)'}`, borderRadius: 12, padding: '20px 24px', marginBottom: 16 }
  const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 700, color: dark ? '#a78bfa' : '#7c3aed', marginBottom: 6 }
  const inp: React.CSSProperties = { width: '100%', background: dark ? '#0d0d1f' : '#ffffff', border: `1px solid ${dark ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.3)'}`, borderRadius: 8, padding: '10px 14px', color: dark ? '#e0e0ff' : '#1e1b4b', fontSize: 14, boxSizing: 'border-box' }
  const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }
  const res: React.CSSProperties = { background: dark ? '#13132a' : '#faf7ff', border: `1px solid ${dark ? 'rgba(167,139,250,0.25)' : 'rgba(124,58,237,0.3)'}`, borderRadius: 12, padding: '20px 24px', marginTop: 24 }
  const mutedTxt = dark ? '#888' : '#6b7280'
  const valTxt = dark ? '#e0e0ff' : '#1e1b4b'
  const statCard: React.CSSProperties = { background: dark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.08)', borderRadius: 8, padding: '12px', textAlign: 'center' }

  const [f, setF] = useState({ income: '80000', debt: '500', downPayment: '40000', rate: '6.5', term: '30', propTax: '300', insurance: '150', dtiLimit: '43' })
  const [result, setResult] = useState<{ maxHome: number; maxLoan: number; monthly: number; dti: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const annualIncome = parseFloat(f.income) || 80000
    const monthlyIncome = annualIncome / 12
    const monthlyDebt = parseFloat(f.debt) || 0
    const down = parseFloat(f.downPayment) || 0
    const rate = parseFloat(f.rate) || 6.5
    const term = parseInt(f.term) || 30
    const propTax = parseFloat(f.propTax) || 300
    const insurance = parseFloat(f.insurance) || 150
    const dtiLimit = parseFloat(f.dtiLimit) || 43
    const maxHousingPayment = monthlyIncome * dtiLimit / 100 - monthlyDebt
    const maxPI = maxHousingPayment - propTax - insurance
    const monthlyRate = rate / 100 / 12
    const n = term * 12
    const maxLoan = maxPI * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n))
    const maxHome = maxLoan + down
    const dti = ((maxPI + propTax + insurance + monthlyDebt) / monthlyIncome) * 100
    setResult({ maxHome: Math.round(maxHome), maxLoan: Math.round(maxLoan), monthly: Math.round(maxPI + propTax + insurance), dti: Math.round(dti * 10) / 10 })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Annual Gross Income ($)</label><input style={inp} type="number" value={f.income} onChange={e => s('income', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Monthly Debt Payments ($)</label><input style={inp} type="number" value={f.debt} onChange={e => s('debt', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Down Payment ($)</label><input style={inp} type="number" value={f.downPayment} onChange={e => s('downPayment', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Mortgage Rate (%)</label><input style={inp} type="number" step="0.1" value={f.rate} onChange={e => s('rate', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Loan Term (years)</label><input style={inp} type="number" value={f.term} onChange={e => s('term', e.target.value)} /></div>
        <div style={card}><label style={lbl}>DTI Limit (%)</label><input style={inp} type="number" value={f.dtiLimit} onChange={e => s('dtiLimit', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Monthly Property Tax ($)</label><input style={inp} type="number" value={f.propTax} onChange={e => s('propTax', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Monthly Insurance ($)</label><input style={inp} type="number" value={f.insurance} onChange={e => s('insurance', e.target.value)} /></div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Calculate Affordability</button>
      <ToolAdUnit position="middle" />
      {result && (
        <div style={res}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: mutedTxt, marginBottom: 4 }}>Maximum Home Price</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#4ade80' }}>{fmt(result.maxHome)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[['Max Loan', fmt(result.maxLoan)], ['Monthly Payment', fmt(result.monthly)], ['DTI Ratio', result.dti + '%']].map(([label, val]) => (
              <div key={label} style={statCard}>
                <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: valTxt }}>{val}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: mutedTxt, marginTop: 12, textAlign: 'center' }}>Based on {f.dtiLimit}% DTI limit. Lenders may use different criteria.</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Home Affordability Calculator" />
          </div>
        </div>
      )}
    </div>
  )
}
