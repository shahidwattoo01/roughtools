'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ToolAdUnit from '@/components/ToolAdUnit'
import { PDFExportButton } from '@/components/PDFExportButton'

export default function PropertyTaxClient() {
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

  const [f, setF] = useState({ assessedValue: '350000', taxRate: '1.2', homestead: '0', exemption: '0' })
  const [result, setResult] = useState<{ annual: number; monthly: number; daily: number; effective: number } | null>(null)
  const s = (k: string, v: string) => setF(p => ({ ...p, [k]: v }))

  function calc() {
    const assessed = parseFloat(f.assessedValue) || 350000
    const rate = parseFloat(f.taxRate) || 1.2
    const homestead = parseFloat(f.homestead) || 0
    const exemption = parseFloat(f.exemption) || 0
    const taxableValue = Math.max(0, assessed - homestead - exemption)
    const annual = taxableValue * rate / 100
    setResult({ annual: Math.round(annual), monthly: Math.round(annual / 12), daily: Math.round(annual / 365 * 100) / 100, effective: Math.round(annual / assessed * 10000) / 100 })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <div style={row}>
        <div style={card}><label style={lbl}>Assessed Property Value ($)</label><input style={inp} type="number" value={f.assessedValue} onChange={e => s('assessedValue', e.target.value)} /></div>
        <div style={card}><label style={lbl}>Tax Rate (% per year)</label><input style={inp} type="number" step="0.01" value={f.taxRate} onChange={e => s('taxRate', e.target.value)} /></div>
      </div>
      <div style={row}>
        <div style={card}><label style={lbl}>Homestead Exemption ($)</label><input style={inp} type="number" value={f.homestead} onChange={e => s('homestead', e.target.value)} placeholder="0" /></div>
        <div style={card}><label style={lbl}>Other Exemptions ($)</label><input style={inp} type="number" value={f.exemption} onChange={e => s('exemption', e.target.value)} placeholder="0" /></div>
      </div>
      <button onClick={calc} style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginBottom: 24 }}>Calculate Property Tax</button>
      <ToolAdUnit position="middle" />
      {result && (
        <div style={res}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: mutedTxt, marginBottom: 4 }}>Annual Property Tax</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b' }}>{fmt(result.annual)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[['Monthly', fmt(result.monthly)], ['Daily', '$' + result.daily], ['Effective Rate', result.effective + '%']].map(([label, val]) => (
              <div key={label} style={statCard}>
                <div style={{ fontSize: 11, color: mutedTxt, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: valTxt }}>{val}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: mutedTxt, marginTop: 12, textAlign: 'center' }}>Actual taxes may vary. Contact your local assessor for official rates.</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <PDFExportButton toolName="Property Tax Calculator" />
          </div>
        </div>
      )}
    </div>
  )
}
