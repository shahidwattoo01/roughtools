'use client'
import { useState } from 'react'

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','this','that','these','those','it','its','i','you','he','she','we','they','my','your','his','her','our','their','me','him','us','them','as','if','so','not','no','nor','yet','both','either','each','than','such','up','out','about','into','through','after','before','also','then','just','more','most','very','too','all','any','some','what','which','who','how','when','where','why'])

function extractiveSummarize(text: string, numSentences: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  const cleaned = sentences.map(s => s.trim()).filter(s => s.length > 20)
  if (cleaned.length <= numSentences) return cleaned

  // Word frequency (ignoring stop words)
  const freq: Record<string, number> = {}
  cleaned.forEach(sentence => {
    sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).forEach(word => {
      if (word.length > 2 && !STOP_WORDS.has(word)) {
        freq[word] = (freq[word] || 0) + 1
      }
    })
  })

  // Score sentences
  const scored = cleaned.map((sentence, index) => {
    const words = sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
    const score = words.reduce((sum, word) => sum + (STOP_WORDS.has(word) ? 0 : (freq[word] || 0)), 0) / Math.max(words.length, 1)
    return { sentence, score, index }
  })

  // Pick top sentences, preserve original order
  const top = [...scored].sort((a, b) => b.score - a.score).slice(0, numSentences)
  top.sort((a, b) => a.index - b.index)
  return top.map(s => s.sentence)
}

export default function TextSummarizerClient() {
  const [input, setInput] = useState('')
  const [numSentences, setNumSentences] = useState(3)
  const [summary, setSummary] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  function summarize() {
    if (!input.trim()) return
    const sentences = ((input.match(/[^.!?]+[.!?]+/g) as string[]) || []).filter(s => s.trim().length > 20)
    if (sentences.length < 2) { setError('Please enter at least 2 full sentences to summarize.'); setSummary([]); return }
    setError('')
    setSummary(extractiveSummarize(input, numSentences))
    setCopied(false)
  }

  function copy() {
    const text = summary.join(' ')
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Input Text</label>
      <textarea
        value={input}
        onChange={e => { setInput(e.target.value); setSummary([]); setError('') }}
        placeholder="Paste your article, essay, or document here…"
        style={{ width: '100%', minHeight: 200, padding: 14, borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13, color: '#888' }}>
          Summary length: <strong style={{ color: '#a5b4fc' }}>{numSentences} sentence{numSentences > 1 ? 's' : ''}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={numSentences}
          onChange={e => setNumSentences(parseInt(e.target.value))}
          style={{ flex: 1, minWidth: 120, accentColor: '#6366f1' }}
        />
        <button
          onClick={summarize}
          disabled={!input.trim()}
          style={{ padding: '10px 24px', borderRadius: 10, background: '#6366f1', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: input.trim() ? 1 : 0.5 }}
        >
          Summarize
        </button>
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
      {summary.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#888' }}>Summary ({summary.length} sentence{summary.length > 1 ? 's' : ''})</span>
            <button
              onClick={copy}
              style={{ padding: '6px 14px', borderRadius: 7, background: copied ? '#10b981' : '#6366f1', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ padding: 16, background: 'rgba(99,102,241,0.08)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)' }}>
            {summary.map((s, i) => (
              <p key={i} style={{ color: '#d0d0f0', fontSize: 14, lineHeight: 1.75, margin: i > 0 ? '10px 0 0' : 0 }}>{s}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
