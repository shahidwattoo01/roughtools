/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useRef, useCallback } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface ImageInfo {
  name: string
  size: number
  width: number
  height: number
  aspectRatio: string
  format: string
  megapixels: number
}

export default function ImageSizeCheckerClient() {
  const [infos, setInfos] = useState<ImageInfo[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    const files = Array.from(fl).filter(f => f.type.startsWith('image/'))
    setInfos([]); setPreviews([])
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      const img = new window.Image()
      img.onload = () => {
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
        const d = gcd(img.naturalWidth, img.naturalHeight)
        const info: ImageInfo = {
          name: f.name,
          size: f.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: `${img.naturalWidth/d}:${img.naturalHeight/d}`,
          format: f.type,
          megapixels: parseFloat((img.naturalWidth * img.naturalHeight / 1_000_000).toFixed(2)),
        }
        setInfos(prev => [...prev, info])
        setPreviews(prev => [...prev, url])
      }
      img.src = url
    })
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const fmt = (n: number) => {
    if (n >= 1024*1024) return `${(n/1024/1024).toFixed(2)} MB`
    if (n >= 1024) return `${(n/1024).toFixed(1)} KB`
    return `${n} bytes`
  }

  const rows = (info: ImageInfo) => [
    { label:'File Name', value: info.name },
    { label:'File Size', value: `${fmt(info.size)} (${info.size.toLocaleString()} bytes)` },
    { label:'Dimensions', value: `${info.width} × ${info.height} px` },
    { label:'Aspect Ratio', value: info.aspectRatio },
    { label:'Format', value: info.format },
    { label:'Megapixels', value: `${info.megapixels} MP` },
  ]

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
          <div style={{ fontSize:36 }}>🔍</div>
          <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop images or click to upload</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Multiple files supported • no processing, instant info</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {infos.map((info, i) => (
        <div key={i} style={card}>
          <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:16 }}>
            <img src={previews[i]} alt={info.name} style={{ width:80, height:80, objectFit:'cover', borderRadius:8, flexShrink:0, border:'1px solid var(--line-strong)' }} />
            <div style={{ flex:1 }}>
              <div style={{ color:'#e0e0ff', fontWeight:700, marginBottom:4, wordBreak:'break-all' }}>{info.name}</div>
              <div style={{ color:'#a78bfa', fontSize:13 }}>{info.width} × {info.height}px • {fmt(info.size)}</div>
            </div>
          </div>
          <div style={{ background:'#0d0d1f', borderRadius:8, overflow:'hidden' }}>
            {rows(info).map((row, j) => (
              <div key={j} style={{ display:'flex', padding:'8px 14px', borderBottom: j < rows(info).length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none', gap:12 }}>
                <div style={{ color:'#a78bfa', fontSize:13, fontWeight:700, minWidth:120, flexShrink:0 }}>{row.label}</div>
                <div style={{ color:'#e0e0ff', fontSize:13 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {infos.length > 0 && <SmartRecommendation currentSlug="image-size-checker" />}
    </div>
  )
}
