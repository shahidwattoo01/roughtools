'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function HomeValueClient() {
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
  const statCard: React.CSSProperties = { background: dark ? 'rgba(74,222,128,0.1)' : 'rgba(74,222,128,0.08)', borderRadius: 8, padding: '12px', textAlign: 'center' }

  const [f, setF] = useState({ purchasePrice: '350000', purchaseYear: '2018', appreciationRate: '4', sqft: '1800', condition: 'good', marketCondition: 'normal' })
  const [result, setResult] = useState<{ estimated: number; low: number; high: number; gain: number; gainPct: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const price = parseFloat(f.purchasePrice) || 350000
    const year = parseInt(f.purchaseYear) || 2020
    const rate = parseFloat(f.appreciationRate) || 4
    const years = 2026 - year
    const condMult: Record<string, number> = { poor: 0.85, fair: 0.93, good: 1.0, excellent: 1.08 }
    const mktMult: Record<string, number> = { slow: 0.95, normal: 1.0, hot: 1.07, very_hot: 1.15 }
    const cond = condMult[f.condition] ?? 1
    const mkt = mktMult[f.marketCondition] ?? 1
    const base = price * Math.pow(1 + rate / 100, years) * cond * mkt
    setResult({ estimated: Math.round(base), low: Math.round(base * 0.92), high: Math.round(base * 1.08), gain: Math.round(base - price), gainPct: Math.round((base - price) / price * 1000) / 10 })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div style={{ padding: '10px 14px', background: dark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#fbbf24' }}>
        This is a simplified estimate based on appreciation rate and condition. For accurate valuations, use a licensed appraiser or real estate agent.
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Original Purchase Price ($)</label><input style={inp} type="number" value={f.purchasePrice} onChange={e => s('purchasePrice', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Year Purchased</label><input style={inp} type="number" value={f.purchaseYear} onChange={e => s('purchaseYear', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Avg Annual Appreciation (%)</label><input style={inp} type="number" step="0.5" value={f.appreciationRate} onChange={e => s('appreciationRate', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Square Footage</label><input style={inp} type="number" value={f.sqft} onChange={e => s('sqft', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Property Condition</label>
          <select style={inp} value={f.condition} onChange={e => s('condition', e.target.value)}>
            <option value="poor">Poor</option><option value="fair">Fair</option><option value="good">Good</option><option value="excellent">Excellent</option>
          </select>
        </div>
        <div style={card}><label style={lbl}>Market Condition</label>
          <select style={inp} value={f.marketCondition} onChange={e => s('marketCondition', e.target.value)}>
            <option value="slow">Slow market</option><option value="normal">Normal market</option><option value="hot">Hot market</option><option value="very_hot">Very hot market</option>
          </select>
        </div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Estimate Home Value</button>
      <ToolAdUnit position="middle" />
      {result && (
        <div style={res}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: mutedTxt, marginBottom: 4 }}>Estimated Value (2026)</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#4ade80' }}>{fmt(result.estimated)}</div>
            <div style={{ fontSize: 13, color: mutedTxt, marginTop: 4 }}>Range: {fmt(result.low)} – {fmt(result.high)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={statCard}>
              <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>Total Appreciation</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>+{fmt(result.gain)}</div>
            </div>
            <div style={statCard}>
              <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>% Gain</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>+{result.gainPct}%</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Home Value Estimator" />
          </div>
        </div>
      )}
    </div>
  )
}
