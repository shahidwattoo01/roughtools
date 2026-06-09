/* eslint-disable @typescript-eslint/no-unused-vars, prefer-const, no-empty, no-useless-escape, react-hooks/exhaustive-deps */
'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' as const }
const btn: React.CSSProperties = { background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }

interface Frame { url: string; name: string; file: File }

export default function GifMakerClient() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [fps, setFps] = useState(3)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    const newFrames: Frame[] = Array.from(fl).filter(f => f.type.startsWith('image/')).map(f => ({
      url: URL.createObjectURL(f),
      name: f.name,
      file: f,
    }))
    setFrames(prev => [...prev, ...newFrames])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  useEffect(() => {
    if (frames.length < 2) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setPreviewIdx(prev => (prev + 1) % frames.length)
    }, 1000 / fps)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [frames, fps])

  const removeFrame = (i: number) => setFrames(prev => prev.filter((_,idx) => idx !== i))
  const moveUp = (i: number) => { if (i === 0) return; setFrames(prev => { const a=[...prev]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a }) }
  const moveDown = (i: number) => { if (i === frames.length-1) return; setFrames(prev => { const a=[...prev]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a }) }

  return (
    <div>
      <div style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ color:'#a78bfa', fontWeight:700, marginBottom:6 }}>About GIF Creation</div>
        <div style={{ color:'#e0e0ff', fontSize:13, lineHeight:1.6 }}>
          True GIF encoding in the browser requires a library like <strong>gif.js</strong> or <strong>gifshot</strong>.
          This tool lets you arrange frames and previews the animation. To create a real GIF:
          <ul style={{ marginTop:6, paddingLeft:20 }}>
            <li>Use <strong>Ezgif.com</strong> — upload your frames and set the delay</li>
            <li>Use <strong>Canva</strong> or <strong>Adobe Express</strong></li>
            <li>Add <code style={{ background:'rgba(255,255,255,0.1)', padding:'1px 5px', borderRadius:3 }}>gif.js</code> to your project for client-side encoding</li>
          </ul>
        </div>
      </div>

      <div style={card}>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          style={{ border:`2px dashed ${dragging ? '#7c3aed' : 'rgba(167,139,250,0.3)'}`, borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer', color:'#a78bfa' }}
        >
          <div style={{ fontSize:36 }}>🎞️</div>
          <div style={{ fontWeight:700, color:'#e0e0ff' }}>Drop frames here or click to add</div>
          <div style={{ fontSize:13, color:'#888', marginTop:4 }}>Upload images as animation frames</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {frames.length >= 2 && (
        <div style={card}>
          <label style={lbl}>Animation Preview ({fps} fps)</label>
          <div style={{ textAlign:'center', marginBottom:12 }}>
            <img src={frames[previewIdx]?.url} alt={`frame ${previewIdx+1}`} style={{ maxWidth:'100%', maxHeight:300, borderRadius:8, border:'2px solid rgba(167,139,250,0.2)' }} />
            <div style={{ color:'#888', fontSize:13, marginTop:8 }}>Frame {previewIdx + 1} / {frames.length}</div>
          </div>
          <label style={lbl}>Speed: {fps} FPS</label>
          <input type="range" min="1" max="30" value={fps} onChange={e => setFps(Number(e.target.value))} style={inp} />
        </div>
      )}

      {frames.length > 0 && (
        <div>
          <div style={card}>
            <label style={lbl}>Frames ({frames.length})</label>
            {frames.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'#0d0d1f', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                <div style={{ color:'#a78bfa', fontWeight:700, fontSize:13, width:24 }}>{i+1}</div>
                <img src={f.url} alt={f.name} style={{ width:50, height:40, objectFit:'cover', borderRadius:4 }} />
                <div style={{ flex:1, color:'#e0e0ff', fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => moveUp(i)} style={{ background:'rgba(255,255,255,0.08)', color:'#e0e0ff', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>↑</button>
                  <button onClick={() => moveDown(i)} style={{ background:'rgba(255,255,255,0.08)', color:'#e0e0ff', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>↓</button>
                  <a href={f.url} download={f.name} style={{ background:'rgba(124,58,237,0.2)', color:'#a78bfa', borderRadius:4, padding:'4px 8px', textDecoration:'none', fontSize:12 }}>Save</a>
                  <button onClick={() => removeFrame(i)} style={{ background:'rgba(239,68,68,0.2)', color:'#f87171', border:'none', borderRadius:4, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop:12, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:8, padding:'12px', fontSize:13, color:'#fbbf24' }}>
              To export as GIF: upload these {frames.length} frames to <strong>ezgif.com/maker</strong> and set delay to {Math.round(1000/fps)}ms per frame.
            </div>
          </div>
          <SmartRecommendation currentSlug="gif-maker" />
        </div>
      )}
    </div>
  )
}
