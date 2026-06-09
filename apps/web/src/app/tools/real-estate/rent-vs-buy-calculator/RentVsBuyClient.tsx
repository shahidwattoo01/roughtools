'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function RentVsBuyClient() {
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
  const statCard: React.CSSProperties = { background: dark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.08)', borderRadius: 8, padding: '16px', textAlign: 'center' }

  const [f, setF] = useState({ homePrice: '400000', downPct: '20', rate: '6.5', years: '30', propTaxRate: '1.2', maintenance: '1', appreciation: '3', rentMonthly: '2000', rentIncrease: '3', investReturn: '7' })
  const [result, setResult] = useState<{ buyTotal: number; rentTotal: number; winner: string; diff: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const price = parseFloat(f.homePrice) || 400000
    const downPct = parseFloat(f.downPct) || 20
    const rate = parseFloat(f.rate) || 6.5
    const yrs = parseInt(f.years) || 30
    const propTaxRate = parseFloat(f.propTaxRate) || 1.2
    const maintenance = parseFloat(f.maintenance) || 1
    const appreciation = parseFloat(f.appreciation) || 3
    const rentMo = parseFloat(f.rentMonthly) || 2000
    const rentInc = parseFloat(f.rentIncrease) || 3
    const investRet = parseFloat(f.investReturn) || 7
    const downPayment = price * downPct / 100
    const loan = price - downPayment
    const monthlyRate = rate / 100 / 12
    const n = yrs * 12
    const monthlyPI = loan * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1)
    let buyTotal = downPayment
    let rentTotal = 0
    let investedDown = downPayment
    let currentRent = rentMo
    for (let yr = 0; yr < yrs; yr++) {
      buyTotal += monthlyPI * 12 + price * Math.pow(1 + appreciation / 100, yr) * propTaxRate / 100 + price * maintenance / 100
      rentTotal += currentRent * 12
      investedDown *= (1 + investRet / 100)
      currentRent *= (1 + rentInc / 100)
    }
    const homeValue = price * Math.pow(1 + appreciation / 100, yrs)
    const buyNet = buyTotal - homeValue
    const rentNet = rentTotal - investedDown
    setResult({ buyTotal: Math.round(buyNet), rentTotal: Math.round(rentNet), winner: buyNet < rentNet ? 'Buy' : 'Rent', diff: Math.abs(Math.round(buyNet - rentNet)) })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(n))

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Home Price ($)</label><input style={inp} type="number" value={f.homePrice} onChange={e => s('homePrice', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Down Payment (%)</label><input style={inp} type="number" value={f.downPct} onChange={e => s('downPct', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Mortgage Rate (%)</label><input style={inp} type="number" step="0.1" value={f.rate} onChange={e => s('rate', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Loan Term (years)</label><input style={inp} type="number" value={f.years} onChange={e => s('years', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Property Tax Rate (%/yr)</label><input style={inp} type="number" step="0.1" value={f.propTaxRate} onChange={e => s('propTaxRate', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Maintenance (%/yr)</label><input style={inp} type="number" step="0.1" value={f.maintenance} onChange={e => s('maintenance', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Home Appreciation (%/yr)</label><input style={inp} type="number" step="0.1" value={f.appreciation} onChange={e => s('appreciation', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Monthly Rent ($)</label><input style={inp} type="number" value={f.rentMonthly} onChange={e => s('rentMonthly', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Annual Rent Increase (%)</label><input style={inp} type="number" step="0.1" value={f.rentIncrease} onChange={e => s('rentIncrease', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Investment Return (%/yr)</label><input style={inp} type="number" step="0.1" value={f.investReturn} onChange={e => s('investReturn', e.target.value)} /></div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Compare Rent vs Buy</button>
      <ToolAdUnit position="middle" />
      {result && (
        <div style={res}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: dark ? '#a78bfa' : '#7c3aed', marginBottom: 8 }}>
              {result.winner === 'Buy' ? 'Buying is better' : 'Renting is better'} over {f.years} years
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: result.winner === 'Buy' ? '#4ade80' : '#f59e0b' }}>
              Save {fmt(result.diff)} by {result.winner === 'Buy' ? 'buying' : 'renting'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={statCard}>
              <div style={{ fontSize: 12, color: mutedTxt, marginBottom: 4 }}>Total Buy Cost (net)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: valTxt }}>{fmt(result.buyTotal)}</div>
            </div>
            <div style={statCard}>
              <div style={{ fontSize: 12, color: mutedTxt, marginBottom: 4 }}>Total Rent Cost (net)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: valTxt }}>{fmt(result.rentTotal)}</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: mutedTxt, marginTop: 12, textAlign: 'center' }}>Net cost = total spent minus home equity (buy) or investment growth (rent)</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Rent vs Buy Calculator" />
          </div>
        </div>
      )}
    </div>
  )
}
