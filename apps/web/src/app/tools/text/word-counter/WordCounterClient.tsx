'use client'
import { useState, useCallback } from 'react'

function getStats(text: string) {
  const trimmed = text.trim()
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).filter(Boolean).length
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = trimmed === '' ? 0 : (trimmed.match(/[^.!?]*[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0)
  const paragraphs = trimmed === '' ? 0 : trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (trimmed.length > 0 ? 1 : 0)
  const readingSeconds = Math.ceil((words / 200) * 60)
  const speakingSeconds = Math.ceil((words / 130) * 60)
  const fmtTime = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime: fmtTime(readingSeconds), speakingTime: fmtTime(speakingSeconds) }
}

const STATS_CONFIG = [
  { key: 'words', label: 'Words', color: '#6366f1' },
  { key: 'chars', label: 'Characters', color: '#8b5cf6' },
  { key: 'charsNoSpaces', label: 'Chars (no spaces)', color: '#a78bfa' },
  { key: 'sentences', label: 'Sentences', color: '#06b6d4' },
  { key: 'paragraphs', label: 'Paragraphs', color: '#10b981' },
  { key: 'readingTime', label: 'Reading Time', color: '#f59e0b' },
  { key: 'speakingTime', label: 'Speaking Time', color: '#ef4444' },
] as const

export default function WordCounterClient() {
  const [text, setText] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }, [])

  const stats = getStats(text)

  return (
    <div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start typing or paste your text here…"
        style={{
          width: '100%',
          minHeight: 240,
          padding: 16,
          borderRadius: 12,
          background: 'var(--bg-2)',
          border: '1px solid var(--line-strong)',
          color: 'var(--fg)',
          fontSize: 15,
          lineHeight: 1.7,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginTop: 16 }}>
        {STATS_CONFIG.map(({ key, label, color }) => (
          <div key={key} style={{ padding: '16px 12px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--line)', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color }}>{stats[key]}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      {text.length > 0 && (
        <button
          onClick={() => setText('')}
          style={{ marginTop: 12, padding: '8px 18px', borderRadius: 8, background: 'transparent', border: '1px solid var(--line-strong)', color: '#888', fontSize: 13, cursor: 'pointer' }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
