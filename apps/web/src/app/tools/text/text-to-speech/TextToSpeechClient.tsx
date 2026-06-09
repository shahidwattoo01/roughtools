'use client'
import { useState, useEffect, useRef } from 'react'

export default function TextToSpeechClient() {
  const [text, setText] = useState('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [supported, setSupported] = useState(true)
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { setSupported(false); return }
    function loadVoices() {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) { setVoices(v); setSelectedVoice(v[0].name) }
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  function speak() {
    if (!text.trim() || !supported) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) utt.voice = voice
    utt.rate = rate
    utt.pitch = pitch
    utt.onstart = () => { setSpeaking(true); setPaused(false) }
    utt.onend = () => { setSpeaking(false); setPaused(false) }
    utt.onerror = () => { setSpeaking(false); setPaused(false) }
    uttRef.current = utt
    window.speechSynthesis.speak(utt)
  }

  function pause() {
    if (speaking && !paused) { window.speechSynthesis.pause(); setPaused(true) }
    else if (paused) { window.speechSynthesis.resume(); setPaused(false) }
  }

  function stop() {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  const btnStyle = (active: boolean, color = '#6366f1'): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: 10,
    background: active ? color : 'rgba(255,255,255,0.07)',
    border: '1px solid ' + (active ? color : 'rgba(255,255,255,0.12)'),
    color: active ? '#fff' : 'var(--fg-2)',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  })

  if (!supported) {
    return (
      <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
        <p style={{ color: '#f59e0b' }}>Your browser does not support the Web Speech API. Please use a modern browser like Chrome, Edge, or Safari.</p>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text to speak…"
        style={{ width: '100%', minHeight: 160, padding: 14, borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Voice</label>
          <select
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 13, outline: 'none' }}
          >
            {voices.length === 0 && <option value="">Loading voices…</option>}
            {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Rate: {rate.toFixed(1)}×</label>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#6366f1' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Pitch: {pitch.toFixed(1)}</label>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#6366f1' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        <button onClick={speak} disabled={!text.trim() || speaking} style={{ ...btnStyle(false, '#6366f1'), background: '#6366f1', color: '#fff', opacity: (!text.trim() || speaking) ? 0.5 : 1 }}>
          ▶ Play
        </button>
        <button onClick={pause} disabled={!speaking} style={{ ...btnStyle(paused, '#8b5cf6'), opacity: speaking ? 1 : 0.4 }}>
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button onClick={stop} disabled={!speaking && !paused} style={{ ...btnStyle(false, '#ef4444'), opacity: (speaking || paused) ? 1 : 0.4 }}>
          ⏹ Stop
        </button>
      </div>
      {speaking && !paused && (
        <div style={{ marginTop: 14, fontSize: 13, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1s infinite' }} />
          Speaking…
        </div>
      )}
    </div>
  )
}
