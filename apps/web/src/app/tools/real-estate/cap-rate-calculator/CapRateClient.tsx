'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function CapRateClient() {
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

  const [f, setF] = useState({ propertyValue: '500000', grossRent: '48000', vacancy: '5', propTax: '5000', insurance: '1500', maintenance: '2000', management: '10', other: '500' })
  const [result, setResult] = useState<{ noi: number; capRate: number; grossYield: number; expenses: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const value = parseFloat(f.propertyValue) || 500000
    const gross = parseFloat(f.grossRent) || 48000
    const vacancy = parseFloat(f.vacancy) || 5
    const propTax = parseFloat(f.propTax) || 5000
    const insurance = parseFloat(f.insurance) || 1500
    const maintenance = parseFloat(f.maintenance) || 2000
    const mgmtPct = parseFloat(f.management) || 10
    const other = parseFloat(f.other) || 500
    const effectiveRent = gross * (1 - vacancy / 100)
    const mgmtFee = effectiveRent * mgmtPct / 100
    const totalExpenses = propTax + insurance + maintenance + mgmtFee + other
    const noi = effectiveRent - totalExpenses
    const capRate = (noi / value) * 100
    const grossYield = (gross / value) * 100
    setResult({ noi: Math.round(noi), capRate: Math.round(capRate * 100) / 100, grossYield: Math.round(grossYield * 100) / 100, expenses: Math.round(totalExpenses) })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
  const getRating = (rate: number) => rate >= 8 ? { label: 'Excellent', color: '#4ade80' } : rate >= 5 ? { label: 'Good', color: '#a78bfa' } : rate >= 3 ? { label: 'Average', color: '#f59e0b' } : { label: 'Below Average', color: '#f87171' }

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Property Value ($)</label><input style={inp} type="number" value={f.propertyValue} onChange={e => s('propertyValue', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Annual Gross Rent ($)</label><input style={inp} type="number" value={f.grossRent} onChange={e => s('grossRent', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Vacancy Rate (%)</label><input style={inp} type="number" step="0.5" value={f.vacancy} onChange={e => s('vacancy', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Property Taxes ($/yr)</label><input style={inp} type="number" value={f.propTax} onChange={e => s('propTax', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Insurance ($/yr)</label><input style={inp} type="number" value={f.insurance} onChange={e => s('insurance', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Maintenance ($/yr)</label><input style={inp} type="number" value={f.maintenance} onChange={e => s('maintenance', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Property Management (%)</label><input style={inp} type="number" step="1" value={f.management} onChange={e => s('management', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Other Expenses ($/yr)</label><input style={inp} type="number" value={f.other} onChange={e => s('other', e.target.value)} /></div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Calculate Cap Rate</button>
      <ToolAdUnit position="middle" />
      {result && (() => {
        const rating = getRating(result.capRate)
        return (
          <div style={res}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: mutedTxt, marginBottom: 4 }}>Cap Rate</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: rating.color }}>{result.capRate}%</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: rating.color }}>{rating.label}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[['Net Operating Income', fmt(result.noi)], ['Gross Yield', result.grossYield + '%'], ['Annual Expenses', fmt(result.expenses)]].map(([label, val]) => (
                <div key={label} style={statCard}>
                  <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: valTxt }}>{val}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: mutedTxt, marginTop: 12, textAlign: 'center' }}>Cap Rate = NOI / Property Value. Typical range: 4–10% depending on market.</p>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <PDFExportButton toolName="Cap Rate Calculator" />
            </div>
          </div>
        )
      })()}
    </div>
  )
}
