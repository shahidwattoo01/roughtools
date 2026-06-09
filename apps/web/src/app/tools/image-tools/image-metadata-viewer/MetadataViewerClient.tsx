/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface MetaRow { label: string; value: string }

function readJpegMarkers(buffer: ArrayBuffer): Record<string, string> {
  const view = new DataView(buffer)
  const result: Record<string, string> = {}
  let offset = 0
  if (view.getUint16(offset) !== 0xFFD8) return result
  offset = 2
  while (offset < view.byteLength - 1) {
    const marker = view.getUint16(offset)
    if (marker === 0xFFE1) {
      const len = view.getUint16(offset + 2)
      try {
        const exifHeader = new Uint8Array(buffer, offset + 4, 6)
        const headerStr = String.fromCharCode(...exifHeader)
        if (headerStr.startsWith('Exif')) {
          result['EXIF'] = 'Present'
        }
      } catch { /* ignore */ }
      offset += 2 + len
    } else if ((marker & 0xFF00) === 0xFF00) {
      if (view.byteLength <= offset + 3) break
      const len = view.getUint16(offset + 2)
      offset += 2 + len
    } else break
  }
  return result
}

export default function MetadataViewerClient() {
  const [meta, setMeta] = useState<MetaRow[]>([])
  const [preview, setPreview] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url)
    const img = new window.Image()
    img.onload = () => {
      const fmt = (n: number) => n > 1024*1024 ? `${(n/1024/1024).toFixed(2)} MB` : `${(n/1024).toFixed(1)} KB`
      const rows: MetaRow[] = [
        { label: 'File Name', value: f.name },
        { label: 'File Size', value: fmt(f.size) + ` (${f.size.toLocaleString()} bytes)` },
        { label: 'Format', value: f.type || 'Unknown' },
        { label: 'Dimensions', value: `${img.naturalWidth} × ${img.naturalHeight} px` },
        { label: 'Megapixels', value: `${(img.naturalWidth * img.naturalHeight / 1_000_000).toFixed(2)} MP` },
        { label: 'Aspect Ratio', value: (() => { const g = (a: number, b: number): number => b === 0 ? a : g(b, a % b); const d = g(img.naturalWidth, img.naturalHeight); return `${img.naturalWidth/d}:${img.naturalHeight/d}` })() },
        { label: 'Last Modified', value: new Date(f.lastModified).toLocaleString() },
        { label: 'Data URI Size', value: fmt(f.size * 1.37) + ' (estimated)' },
      ]

      const reader = new FileReader()
      reader.onload = e => {
        const buf = e.target?.result as ArrayBuffer
        const markers = readJpegMarkers(buf)
        if (markers['EXIF']) rows.push({ label: 'EXIF Data', value: 'Present (embedded)' })
        else rows.push({ label: 'EXIF Data', value: 'Not detected or not JPEG' })
        setMeta(rows)
      }
      reader.readAsArrayBuffer(f)
    }
    img.src = url
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }, [])

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
          {preview ? <img src={preview} alt="preview" style={{ maxHeight:160, maxWidth:'100%', borderRadius:8 }} /> : (
            <><div style={{ fontSize:36 }}>🔍</div><div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop image or click to upload</div><div style={{ fontSize:13, color:'#888', marginTop:4 }}>Metadata will be extracted instantly</div></>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>

      {meta.length > 0 && (
        <div>
          <div style={card}>
            <label style={lbl}>Image Metadata</label>
            <div style={{ background:'#0d0d1f', borderRadius:8, overflow:'hidden' }}>
              {meta.map((row, i) => (
                <div key={i} style={{ display:'flex', padding:'10px 14px', borderBottom: i < meta.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none', gap:12 }}>
                  <div style={{ color:'#a78bfa', fontSize:13, fontWeight:700, minWidth:140, flexShrink:0 }}>{row.label}</div>
                  <div style={{ color:'#e0e0ff', fontSize:13, wordBreak:'break-all' }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>
          <SmartRecommendation currentSlug="image-metadata-viewer" />
        </div>
      )}
    </div>
  )
}
