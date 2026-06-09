'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function DownPaymentClient() {
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

  const [f, setF] = useState({ homePrice: '400000', downPct: '20', savings: '1000', monthlySave: '500' })
  const [result, setResult] = useState<{ downAmount: number; loanAmount: number; monthsNeeded: number; pmi: boolean; pmiMonthly: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const price = parseFloat(f.homePrice) || 400000
    const pct = parseFloat(f.downPct) || 20
    const savings = parseFloat(f.savings) || 0
    const monthly = parseFloat(f.monthlySave) || 0
    const downAmount = price * pct / 100
    const loanAmount = price - downAmount
    const needed = Math.max(0, downAmount - savings)
    const monthsNeeded = monthly > 0 ? Math.ceil(needed / monthly) : 0
    const pmi = pct < 20
    const pmiMonthly = pmi ? Math.round(loanAmount * 0.01 / 12) : 0
    setResult({ downAmount: Math.round(downAmount), loanAmount: Math.round(loanAmount), monthsNeeded, pmi, pmiMonthly })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Home Price ($)</label><input style={inp} type="number" value={f.homePrice} onChange={e => s('homePrice', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Down Payment (%)</label>
          <select style={inp} value={f.downPct} onChange={e => s('downPct', e.target.value)}>
            <option value="3">3% (FHA min)</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20% (no PMI)</option>
            <option value="25">25%</option>
          </select>
        </div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Current Savings ($)</label><input style={inp} type="number" value={f.savings} onChange={e => s('savings', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Monthly Savings Goal ($)</label><input style={inp} type="number" value={f.monthlySave} onChange={e => s('monthlySave', e.target.value)} /></div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Calculate Down Payment</button>
      <ToolAdUnit position="middle" />
      {result && (
        <div style={res}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: mutedTxt, marginBottom: 4 }}>Down Payment Required</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#a78bfa' }}>{fmt(result.downAmount)}</div>
            <div style={{ fontSize: 13, color: mutedTxt, marginTop: 4 }}>Loan Amount: {fmt(result.loanAmount)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={statCard}>
              <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>Months to Save</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: valTxt }}>{result.monthsNeeded > 0 ? result.monthsNeeded + ' mo' : 'Ready now'}</div>
            </div>
            <div style={{ background: result.pmi ? (dark ? 'rgba(248,113,113,0.1)' : 'rgba(248,113,113,0.08)') : (dark ? 'rgba(74,222,128,0.1)' : 'rgba(74,222,128,0.08)'), borderRadius: 8, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>PMI Required</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: result.pmi ? '#f87171' : '#4ade80' }}>{result.pmi ? 'Yes — ' + fmt(result.pmiMonthly) + '/mo' : 'No PMI'}</div>
            </div>
          </div>
          {result.pmi && <p style={{ fontSize: 12, color: '#f87171', textAlign: 'center' }}>PMI is required for down payments under 20%. Put 20%+ down to avoid it.</p>}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Down Payment Calculator" />
          </div>
        </div>
      )}
    </div>
  )
}
