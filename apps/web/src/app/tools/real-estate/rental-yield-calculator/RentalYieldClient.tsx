'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function RentalYieldClient() {
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
  const yieldCard: React.CSSProperties = { background: dark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.08)', borderRadius: 10, padding: '16px', textAlign: 'center' }
  const statCard: React.CSSProperties = { background: dark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)', borderRadius: 8, padding: '12px', textAlign: 'center' }

  const [f, setF] = useState({ purchasePrice: '400000', monthlyRent: '2200', annualExpenses: '8000', purchaseCosts: '12000' })
  const [result, setResult] = useState<{ grossYield: number; netYield: number; annualIncome: number; netIncome: number; roi: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const price = parseFloat(f.purchasePrice) || 400000
    const monthlyRent = parseFloat(f.monthlyRent) || 2200
    const expenses = parseFloat(f.annualExpenses) || 0
    const purchaseCosts = parseFloat(f.purchaseCosts) || 0
    const annualRent = monthlyRent * 12
    const totalInvestment = price + purchaseCosts
    const netIncome = annualRent - expenses
    const grossYield = (annualRent / price) * 100
    const netYield = (netIncome / price) * 100
    const roi = (netIncome / totalInvestment) * 100
    setResult({ grossYield: Math.round(grossYield * 100) / 100, netYield: Math.round(netYield * 100) / 100, annualIncome: Math.round(annualRent), netIncome: Math.round(netIncome), roi: Math.round(roi * 100) / 100 })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Purchase Price ($)</label><input style={inp} type="number" value={f.purchasePrice} onChange={e => s('purchasePrice', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Monthly Rent ($)</label><input style={inp} type="number" value={f.monthlyRent} onChange={e => s('monthlyRent', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Annual Expenses ($)</label><input style={inp} type="number" value={f.annualExpenses} onChange={e => s('annualExpenses', e.target.value)} placeholder="Tax + insurance + maintenance" /></div>
        <div style={card}><label style={lbl}>Purchase Costs ($)</label><input style={inp} type="number" value={f.purchaseCosts} onChange={e => s('purchaseCosts', e.target.value)} placeholder="Stamp duty, legal fees, etc." /></div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Calculate Rental Yield</button>
      <ToolAdUnit position="middle" />
      {result && (
        <div style={res}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={yieldCard}>
              <div style={{ fontSize: 12, color: mutedTxt, marginBottom: 4 }}>Gross Yield</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#4ade80' }}>{result.grossYield}%</div>
            </div>
            <div style={yieldCard}>
              <div style={{ fontSize: 12, color: mutedTxt, marginBottom: 4 }}>Net Yield</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#a78bfa' }}>{result.netYield}%</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[['Annual Rent', fmt(result.annualIncome)], ['Net Income', fmt(result.netIncome)], ['ROI (on total)', result.roi + '%']].map(([label, val]) => (
              <div key={label} style={statCard}>
                <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: valTxt }}>{val}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: mutedTxt, marginTop: 12, textAlign: 'center' }}>Gross yield = annual rent / property price. Net yield accounts for expenses.</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Rental Yield Calculator" />
          </div>
        </div>
      )}
    </div>
  )
}
