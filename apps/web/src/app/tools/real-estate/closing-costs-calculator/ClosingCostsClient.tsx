'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

interface CostItem { label: string; amount: number }

export default function ClosingCostsClient() {
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
  const rowItemBg = dark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.05)'
  const rowItemTxt = dark ? '#c4c4e0' : '#4b5563'

  const [f, setF] = useState({ price: '400000', loan: '320000', state: '3', role: 'buyer' })
  const [items, setItems] = useState<CostItem[]>([])
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const price = parseFloat(f.price) || 400000
    const loan = parseFloat(f.loan) || 320000
    const statePct = parseFloat(f.state) || 3
    const costs: CostItem[] = f.role === 'buyer' ? [
      { label: 'Loan Origination Fee (1%)', amount: Math.round(loan * 0.01) },
      { label: 'Appraisal Fee', amount: 500 },
      { label: 'Home Inspection', amount: 400 },
      { label: 'Title Insurance', amount: Math.round(price * 0.005) },
      { label: 'Title Search', amount: 300 },
      { label: 'Attorney Fees', amount: 1000 },
      { label: 'Recording Fees', amount: 200 },
      { label: 'Transfer Taxes', amount: Math.round(price * statePct / 200) },
      { label: 'Prepaid Property Tax (2 mo)', amount: Math.round(price * 0.012 / 6) },
      { label: 'Prepaid Homeowners Insurance', amount: 1200 },
      { label: 'Mortgage Points (optional)', amount: 0 },
    ] : [
      { label: 'Real Estate Agent Commission (6%)', amount: Math.round(price * 0.06) },
      { label: 'Transfer Taxes', amount: Math.round(price * statePct / 200) },
      { label: 'Attorney Fees', amount: 1000 },
      { label: 'Home Warranty', amount: 500 },
      { label: 'Recording Fees', amount: 200 },
      { label: 'Prorated Property Tax', amount: Math.round(price * 0.012 / 4) },
    ]
    setItems(costs)
  }

  const total = items.reduce((s, i) => s + i.amount, 0)
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Home Price ($)</label><input style={inp} type="number" value={f.price} onChange={e => s('price', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Loan Amount ($)</label><input style={inp} type="number" value={f.loan} onChange={e => s('loan', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>State Transfer Tax Rate (%)</label><input style={inp} type="number" step="0.1" value={f.state} onChange={e => s('state', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Your Role</label>
          <select style={inp} value={f.role} onChange={e => s('role', e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Calculate Closing Costs</button>
      <ToolAdUnit position="middle" />
      {items.length > 0 && (
        <div style={res}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: mutedTxt, marginBottom: 4 }}>Estimated Total Closing Costs</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b' }}>{fmt(total)}</div>
            <div style={{ fontSize: 13, color: mutedTxt, marginTop: 4 }}>({Math.round(total / (parseFloat(f.price) || 400000) * 100)}% of home price)</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.filter(i => i.amount > 0).map(i => (
              <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: rowItemBg, borderRadius: 6 }}>
                <span style={{ fontSize: 13, color: rowItemTxt }}>{i.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: valTxt }}>{fmt(i.amount)}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: mutedTxt, marginTop: 12, textAlign: 'center' }}>Estimates only. Actual closing costs vary by lender, state, and transaction.</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Closing Costs Calculator" />
          </div>
        </div>
      )}
    </div>
  )
}
