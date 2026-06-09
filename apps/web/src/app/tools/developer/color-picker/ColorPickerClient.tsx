'use client'
import { useState } from 'react'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim())
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (max !== min) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

export default function ColorPickerClient() {
  const [hex, setHex] = useState('#a78bfa')
  const [hexInput, setHexInput] = useState('#a78bfa')
  const [rgbInput, setRgbInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
  const hsv = rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null

  function handleColorChange(val: string) {
    setHex(val)
    setHexInput(val)
    setRgbInput('')
  }

  function applyHexInput() {
    const cleaned = hexInput.startsWith('#') ? hexInput : '#' + hexInput
    if (/^#[0-9a-f]{6}$/i.test(cleaned)) {
      setHex(cleaned)
      setHexInput(cleaned)
    }
  }

  function applyRgbInput() {
    const m = rgbInput.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
    if (!m) return
    const r = Math.min(255, parseInt(m[1])), g = Math.min(255, parseInt(m[2])), b = Math.min(255, parseInt(m[3]))
    const newHex = rgbToHex(r, g, b)
    setHex(newHex)
    setHexInput(newHex)
  }

  function copy(label: string, value: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const rows = rgb && hsl && hsv ? [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  ] : []

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 24 }}>
        {/* Color picker + preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <input
            type="color"
            value={hex}
            onChange={e => handleColorChange(e.target.value)}
            style={{ width: 80, height: 80, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'none' }}
          />
          <div style={{ width: 80, height: 80, borderRadius: 12, background: hex, border: '1px solid rgba(255,255,255,0.15)' }} />
        </div>
        {/* Manual inputs */}
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>HEX</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#252540', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0ff', fontSize: 13, fontFamily: 'monospace' }}
                value={hexInput}
                onChange={e => setHexInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyHexInput()}
                placeholder="#a78bfa"
              />
              <button onClick={applyHexInput} style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', background: 'rgba(167,139,250,0.2)', color: '#a78bfa' }}>Apply</button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>RGB</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#252540', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0ff', fontSize: 13, fontFamily: 'monospace' }}
                value={rgbInput}
                onChange={e => setRgbInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyRgbInput()}
                placeholder="167, 139, 250"
              />
              <button onClick={applyRgbInput} style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', background: 'rgba(167,139,250,0.2)', color: '#a78bfa' }}>Apply</button>
            </div>
          </div>
        </div>
      </div>
      {rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {rows.map(({ label, value }) => (
            <div key={label} style={{ padding: '12px 14px', background: '#252540', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>{label}</span>
                <button
                  onClick={() => copy(label, value)}
                  style={{ padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: copied === label ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)', color: copied === label ? '#4ade80' : '#a78bfa' }}
                >
                  {copied === label ? '✓' : 'Copy'}
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#e0e0ff', wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
