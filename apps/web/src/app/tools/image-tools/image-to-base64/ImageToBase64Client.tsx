/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

export default function ImageToBase64Client() {
  const [dataUrl, setDataUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [preview, setPreview] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFileName(f.name)
    setFileSize(f.size)
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      setDataUrl(result)
      setPreview(result)
    }
    reader.readAsDataURL(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, [])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const base64Only = dataUrl ? dataUrl.split(',')[1] : ''
  const htmlEmbed = dataUrl ? `<img src="${dataUrl}" alt="${fileName}" />` : ''
  const fmt = (n: number) => n > 1024*1024 ? `${(n/1024/1024).toFixed(2)} MB` : `${(n/1024).toFixed(1)} KB`

  const CopyBtn = ({ text, k, label }: { text: string; k: string; label: string }) => (
    <button onClick={() => copy(text, k)} style={{ background: copied===k ? '#10b981' : 'rgba(124,58,237,0.15)', color:'#a78bfa', border:'none', borderRadius:6, padding:'6px 14px', fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
      {copied === k ? '✓ Copied' : label}
    </button>
  )

  return (
    <div>
      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer', color:'#a78bfa' }}
        >
          {preview ? <img src={preview} alt="preview" style={{ maxHeight:150, maxWidth:'100%', borderRadius:8 }} /> : (
            <>
              <div style={{ fontSize:36 }}>🖼️</div>
              <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {dataUrl && (
        <div>
          <div style={card}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
              <div style={{ background:'#0d0d1f', borderRadius:8, padding:'10px' }}><div style={{ color:'#888', fontSize:12 }}>File Size</div><div style={{ color:'#e0e0ff', fontWeight:700 }}>{fmt(fileSize)}</div></div>
              <div style={{ background:'#0d0d1f', borderRadius:8, padding:'10px' }}><div style={{ color:'#888', fontSize:12 }}>Base64 Length</div><div style={{ color:'#e0e0ff', fontWeight:700 }}>{fmt(base64Only.length)}</div></div>
              <div style={{ background:'#0d0d1f', borderRadius:8, padding:'10px' }}><div style={{ color:'#888', fontSize:12 }}>Size Increase</div><div style={{ color:'#fbbf24', fontWeight:700 }}>{Math.round((base64Only.length*0.75/fileSize-1)*100)}%</div></div>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <label style={lbl}>Data URL (full)</label>
                <CopyBtn text={dataUrl} k="dataurl" label="Copy" />
              </div>
              <textarea readOnly value={dataUrl} style={{ ...inp, height:80, resize:'vertical', fontFamily:'monospace', fontSize:11 }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <label style={lbl}>Base64 Only</label>
                <CopyBtn text={base64Only} k="base64" label="Copy" />
              </div>
              <textarea readOnly value={base64Only} style={{ ...inp, height:80, resize:'vertical', fontFamily:'monospace', fontSize:11 }} />
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <label style={lbl}>HTML img embed</label>
                <CopyBtn text={htmlEmbed} k="html" label="Copy" />
              </div>
              <textarea readOnly value={htmlEmbed} style={{ ...inp, height:60, resize:'vertical', fontFamily:'monospace', fontSize:11 }} />
            </div>
          </div>
          <SmartRecommendation currentSlug="image-to-base64" />
        </div>
      )}
    </div>
  )
}
