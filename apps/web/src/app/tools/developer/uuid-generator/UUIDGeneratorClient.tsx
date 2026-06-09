'use client'
import { useState } from 'react'

const btnStyle = (accent?: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  background: accent ? '#a78bfa' : 'rgba(255,255,255,0.08)',
  color: accent ? '#0f0f1e' : '#e0e0ff',
})

export default function UUIDGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  function generate() {
    const result: string[] = []
    const n = Math.min(Math.max(1, count), 100)
    for (let i = 0; i < n; i++) {
      result.push(crypto.randomUUID())
    }
    setUuids(result)
  }

  function copyOne(i: number) {
    navigator.clipboard.writeText(uuids[i]).then(() => {
      setCopiedIndex(i)
      setTimeout(() => setCopiedIndex(null), 1200)
    })
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    })
  }

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Count (1–100)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            style={{ width: 100, padding: '10px 12px', borderRadius: 8, background: '#252540', border: '1px solid rgba(255,255,255,0.1)', color: '#e0e0ff', fontSize: 14 }}
          />
        </div>
        <button style={btnStyle(true)} onClick={generate}>Generate</button>
        {uuids.length > 0 && (
          <button style={btnStyle()} onClick={copyAll}>{copiedAll ? 'Copied!' : `Copy All (${uuids.length})`}</button>
        )}
      </div>
      {uuids.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {uuids.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#252540', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: '#e0e0ff', letterSpacing: 0.5 }}>{u}</span>
              <button
                onClick={() => copyOne(i)}
                style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: copiedIndex === i ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.15)', color: copiedIndex === i ? '#4ade80' : '#a78bfa' }}
              >
                {copiedIndex === i ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
      {uuids.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#555', fontSize: 14 }}>
          Click Generate to create UUID(s)
        </div>
      )}
    </div>
  )
}
