/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, no-irregular-whitespace */
'use client'
import React, { useState } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

function normalizeBase64(raw: string): { dataUrl: string; mime: string } | null {
  const trimmed = raw.trim()
  if (trimmed.startsWith('data:image/')) {
    const mimeMatch = trimmed.match(/^data:(image\/[a-z+]+);base64,/)
    if (mimeMatch) return { dataUrl: trimmed, mime: mimeMatch[1] }
  }
  const b64clean = trimmed.replace(/\s/g, '')
  const mimes = ['image/png','image/jpeg','image/gif','image/webp']
  for (const mime of mimes) {
    const dataUrl = `data:${mime};base64,${b64clean}`
    return { dataUrl, mime }
  }
  return null
}

function isValidBase64(str: string): boolean {
  try {
    const clean = str.replace(/^data:[^;]+;base64,/, '').replace(/\s/g,'')
    return /^[A-Za-z0-9+/]*={0,2}$/.test(clean) && clean.length % 4 === 0
  } catch { return false }
}

export default function Base64ToImageClient() {
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState('')
  const [mime, setMime] = useState('')
  const [error, setError] = useState('')

  const decode = () => {
    setError(''); setPreview(''); setMime('')
    if (!input.trim()) { setError('Please paste a base64 string.'); return }
    if (!isValidBase64(input)) { setError('Invalid base64 string. Please check your input.'); return }
    const result = normalizeBase64(input)
    if (!result) { setError('Could not decode. Make sure this is a valid image base64 string.'); return }
    setPreview(result.dataUrl)
    setMime(result.mime)
  }

  const downloadAs = (format: 'png' | 'jpg') => {
    if (!preview) return
    const canvas = document.createElement('canvas')
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      if (format === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height) }
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.href = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95)
      a.download = `decoded-image.${format}`
      a.click()
    }
    img.src = preview
  }

  return (
    <div>
      <div style={card}>
        <label style={lbl}>Paste Base64 String</label>
        <div style={{ fontSize:12, color:'#888', marginBottom:8 }}>Accepts: full data URL (data:image/png;base64,...) or raw base64</div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANS... or raw base64..."
          style={{ ...inp, height:160, resize:'vertical', fontFamily:'monospace', fontSize:12 }}
        />
        {error && <div style={{ color:'#f87171', fontSize:13, marginTop:8 }}>⚠️ {error}</div>}
        <button style={{ ...btn, marginTop:16 }} onClick={decode}>Decode &amp; Preview</button>
      </div>

      {preview && (
        <div>
          <div style={card}>
            <label style={lbl}>Preview</label>
            <div style={{ background:'repeating-conic-gradient(#222 0% 25%, #333 0% 50%) 0 0/20px 20px', borderRadius:8, marginBottom:12, overflow:'hidden' }}>
              <img src={preview} alt="decoded" style={{ maxWidth:'100%', display:'block', margin:'0 auto' }} />
            </div>
            {mime && <div style={{ color:'#888', fontSize:13, marginBottom:12 }}>Detected format: <strong style={{ color:'#a78bfa' }}>{mime}</strong></div>}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <button onClick={() => downloadAs('png')} style={{ ...btn, marginBottom:0 }}>Download as PNG</button>
              <button onClick={() => downloadAs('jpg')} style={{ ...btn, marginBottom:0, background:'linear-gradient(135deg,#0f766e,#0369a1)' }}>Download as JPG</button>
            </div>
          </div>
          <SmartRecommendation currentSlug="base64-to-image" />
        </div>
      )}
    </div>
  )
}
