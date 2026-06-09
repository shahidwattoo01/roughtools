'use client'
import { useState } from 'react'

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length === 0) return 0
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return m ? m.length : 1
}

interface ReadabilityResult {
  fleschEase: number
  fleschGrade: number
  avgSentenceLen: number
  avgWordLen: number
  complexWordPct: number
  wordCount: number
  sentenceCount: number
}

function analyze(text: string): ReadabilityResult | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  const words = trimmed.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  if (wordCount < 5) return null
  const sentences = (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).filter(s => s.trim().length > 0)
  const sentenceCount = Math.max(sentences.length, 1)
  const syllableTotal = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const complexWords = words.filter(w => countSyllables(w) >= 3).length
  const avgSentenceLen = wordCount / sentenceCount
  const avgWordLen = words.reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, '').length, 0) / wordCount
  const complexWordPct = (complexWords / wordCount) * 100
  const fleschEase = 206.835 - 1.015 * avgSentenceLen - 84.6 * (syllableTotal / wordCount)
  const fleschGrade = 0.39 * avgSentenceLen + 11.8 * (syllableTotal / wordCount) - 15.59
  return {
    fleschEase: Math.max(0, Math.min(100, fleschEase)),
    fleschGrade: Math.max(0, Math.min(18, fleschGrade)),
    avgSentenceLen,
    avgWordLen,
    complexWordPct,
    wordCount,
    sentenceCount,
  }
}

function easeLabel(score: number) {
  if (score >= 90) return { label: 'Very Easy', color: '#10b981' }
  if (score >= 70) return { label: 'Easy', color: '#34d399' }
  if (score >= 60) return { label: 'Standard', color: '#6366f1' }
  if (score >= 50) return { label: 'Fairly Difficult', color: '#f59e0b' }
  if (score >= 30) return { label: 'Difficult', color: '#ef4444' }
  return { label: 'Very Difficult', color: '#dc2626' }
}

function Meter({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.4s' }} />
    </div>
  )
}

export default function ReadabilityScoreClient() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ReadabilityResult | null>(null)
  const [error, setError] = useState('')

  function run() {
    const r = analyze(text)
    if (!r) { setError('Please enter at least 5 words to analyze.'); setResult(null); return }
    setError('')
    setResult(r)
  }

  const ease = result ? easeLabel(result.fleschEase) : null

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setResult(null); setError('') }}
        placeholder="Paste your text here to analyze readability…"
        style={{
          width: '100%',
          minHeight: 180,
          padding: 14,
          borderRadius: 10,
          background: 'var(--bg-3)',
          border: '1px solid var(--line-strong)',
          color: 'var(--fg)',
          fontSize: 14,
          lineHeight: 1.7,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
      <button
        onClick={run}
        disabled={!text.trim()}
        style={{ marginTop: 12, padding: '10px 28px', borderRadius: 10, background: '#6366f1', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: text.trim() ? 1 : 0.5 }}
      >
        Analyze Readability
      </button>
      {result && ease && (
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div style={{ padding: 18, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Flesch Reading Ease</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: ease.color }}>{result.fleschEase.toFixed(1)}</div>
            <div style={{ fontSize: 12, color: ease.color, marginBottom: 4 }}>{ease.label}</div>
            <Meter value={result.fleschEase} max={100} color={ease.color} />
          </div>
          <div style={{ padding: 18, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Flesch-Kincaid Grade Level</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#6366f1' }}>Grade {result.fleschGrade.toFixed(1)}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>US school grade equivalent</div>
            <Meter value={result.fleschGrade} max={18} color="#6366f1" />
          </div>
          <div style={{ padding: 18, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Avg. Sentence Length</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#8b5cf6' }}>{result.avgSentenceLen.toFixed(1)}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>words per sentence</div>
            <Meter value={result.avgSentenceLen} max={40} color="#8b5cf6" />
          </div>
          <div style={{ padding: 18, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Avg. Word Length</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#06b6d4' }}>{result.avgWordLen.toFixed(1)}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>characters per word</div>
            <Meter value={result.avgWordLen} max={10} color="#06b6d4" />
          </div>
          <div style={{ padding: 18, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Complex Words</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>{result.complexWordPct.toFixed(1)}%</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>3+ syllable words</div>
            <Meter value={result.complexWordPct} max={50} color="#f59e0b" />
          </div>
          <div style={{ padding: 18, background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Text Stats</div>
            <div style={{ fontSize: 14, color: 'var(--fg-2)', marginTop: 8, lineHeight: 1.8 }}>
              <div>{result.wordCount} words</div>
              <div>{result.sentenceCount} sentences</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
