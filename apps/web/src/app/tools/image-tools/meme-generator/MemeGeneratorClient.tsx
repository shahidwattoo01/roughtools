'use client'
import { useState, useRef, useEffect } from 'react'
import BeforeAfterSlider from '@/components/image-tools/BeforeAfterSlider'
import SmartRecommendation from '@/components/image-tools/SmartRecommendation'

const card: React.CSSProperties = { background:'#13132a', border:'1px solid rgba(167,139,250,0.15)', borderRadius:12, padding:'20px 24px', marginBottom:16 }
const inp: React.CSSProperties = { width:'100%', background:'#0d0d1f', border:'1px solid rgba(167,139,250,0.2)', borderRadius:8, padding:'10px 14px', color:'#e0e0ff', fontSize:14, boxSizing:'border-box' }

export default function MemeGeneratorClient() {
  const [preview, setPreview] = useState('')
  const [topText, setTopText] = useState('TOP TEXT')
  const [bottomText, setBottomText] = useState('BOTTOM TEXT')
  const [fontSize, setFontSize] = useState(48)
  const [result, setResult] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const url = URL.createObjectURL(f)
    setPreview(url)
    const img = new Image()
    img.onload = () => { imgRef.current = img; renderMeme(img) }
    img.src = url
  }

  const renderMeme = (img?: HTMLImageElement) => {
    const i = img || imgRef.current
    if (!i) return
    const c = document.createElement('canvas')
    c.width = i.width; c.height = i.height
    const ctx = c.getContext('2d')!
    ctx.drawImage(i, 0, 0)
    const fSize = Math.max(fontSize, Math.round(i.width / 15))
    ctx.font = `900 ${fSize}px Impact, Arial`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = fSize / 10
    ctx.lineJoin = 'round'
    const drawText = (text: string, y: number) => {
      ctx.strokeText(text.toUpperCase(), i.width / 2, y)
      ctx.fillText(text.toUpperCase(), i.width / 2, y)
    }
    if (topText) drawText(topText, fSize + 10)
    if (bottomText) drawText(bottomText, i.height - 20)
    setResult(c.toDataURL('image/jpeg', 0.95))
  }

  useEffect(() => { if (imgRef.current?.complete) renderMeme() }, [topText, bottomText, fontSize]) // eslint-disable-line

  return (
    <div>
      <div style={card}>
        <div onClick={() => inputRef.current?.click()} style={{ border:'2px dashed rgba(167,139,250,0.3)', borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer' }}>
          {preview
            ? <img src={preview} alt="preview" style={{ maxWidth:'100%', maxHeight:200 }} />
            : <><div style={{ fontSize:40, marginBottom:8 }}>😂</div><div style={{ color:'#888', fontSize:14 }}>Upload an image to create a meme</div></>
          }
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      </div>
      {preview && (
        <>
          <div style={card}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }}>Top Text</label>
            <input style={inp} value={topText} onChange={e => setTopText(e.target.value)} placeholder="TOP TEXT" />
          </div>
          <div style={card}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }}>Bottom Text</label>
            <input style={inp} value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="BOTTOM TEXT" />
          </div>
          <div style={card}>
            <label style={{ display:'block', fontSize:13, fontWeight:700, color:'#a78bfa', marginBottom:6 }}>Font Size: {fontSize}px</label>
            <input type="range" min={20} max={120} value={fontSize} onChange={e => setFontSize(+e.target.value)} style={{ width:'100%', accentColor:'#7c3aed' }} />
          </div>
          <button onClick={() => renderMeme()} style={{ background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer', width:'100%', marginBottom:24 }}>
            Generate Meme
          </button>
        </>
      )}

      {result && (
        <div>
          <BeforeAfterSlider
            beforeSrc={preview}
            afterSrc={result}
            beforeLabel="Original"
            afterLabel="Meme"
          />
          <div style={{ ...card, marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ fontSize:14, fontWeight:700, color:'#a78bfa' }}>Your Meme</span>
              <a href={result} download="meme.jpg" style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa', borderRadius:6, padding:'8px 16px', fontSize:12, fontWeight:600, textDecoration:'none' }}>Download</a>
            </div>
            <img src={result} alt="meme" style={{ maxWidth:'100%', borderRadius:8 }} />
          </div>
          <SmartRecommendation currentSlug="meme-generator" />
        </div>
      )}
    </div>
  )
}
