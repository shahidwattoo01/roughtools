'use client'
import { useState } from 'react'

interface Issue {
  index: number
  length: number
  message: string
  type: 'typo' | 'style' | 'repeated'
}

const COMMON_TYPOS: Record<string, string> = {
  teh: 'the', adn: 'and', taht: 'that', thsi: 'this', wiht: 'with', fro: 'for',
  hte: 'the', ot: 'to', od: 'do', nad: 'and', nto: 'not', si: 'is', ti: 'it',
  recieve: 'receive', beleive: 'believe', occured: 'occurred', seperate: 'separate',
  definately: 'definitely', goverment: 'government', publically: 'publicly',
  accomodate: 'accommodate', occurance: 'occurrence',
}

function checkText(text: string): Issue[] {
  const issues: Issue[] = []

  // Double spaces
  let m: RegExpExecArray | null
  const doubleSpaceRe = /  +/g
  while ((m = doubleSpaceRe.exec(text)) !== null) {
    issues.push({ index: m.index, length: m[0].length, message: 'Double space detected', type: 'style' })
  }

  // Common typos
  const wordRe = /\b([a-zA-Z]+)\b/g
  while ((m = wordRe.exec(text)) !== null) {
    const word = m[1].toLowerCase()
    if (COMMON_TYPOS[word]) {
      issues.push({ index: m.index, length: m[1].length, message: `Possible typo: "${m[1]}" → "${COMMON_TYPOS[word]}"`, type: 'typo' })
    }
  }

  // Repeated consecutive words
  const repeatedRe = /\b(\w+)\s+\1\b/gi
  while ((m = repeatedRe.exec(text)) !== null) {
    issues.push({ index: m.index, length: m[0].length, message: `Repeated word: "${m[1]}"`, type: 'repeated' })
  }

  // Missing capitalization after . ! ?
  const capRe = /[.!?]\s+([a-z])/g
  while ((m = capRe.exec(text)) !== null) {
    const letterIndex = m.index + m[0].length - 1
    issues.push({ index: letterIndex, length: 1, message: 'Sentence should start with a capital letter', type: 'style' })
  }

  // Sort by index
  issues.sort((a, b) => a.index - b.index)
  return issues
}

function buildHighlighted(text: string, issues: Issue[]) {
  const parts: { text: string; issue?: Issue }[] = []
  let cursor = 0
  for (const issue of issues) {
    if (issue.index > cursor) parts.push({ text: text.slice(cursor, issue.index) })
    parts.push({ text: text.slice(issue.index, issue.index + issue.length), issue })
    cursor = issue.index + issue.length
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
}

const TYPE_COLORS: Record<Issue['type'], string> = {
  typo: 'rgba(239,68,68,0.35)',
  style: 'rgba(245,158,11,0.35)',
  repeated: 'rgba(168,85,247,0.35)',
}

export default function GrammarCheckerClient() {
  const [text, setText] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])
  const [checked, setChecked] = useState(false)

  function check() {
    setIssues(checkText(text))
    setChecked(true)
  }

  const parts = checked ? buildHighlighted(text, issues) : []

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Your Text</label>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setChecked(false) }}
        placeholder="Paste or type your text here to check for common errors…"
        style={{
          width: '100%',
          minHeight: 160,
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
      <button
        onClick={check}
        disabled={!text.trim()}
        style={{ marginTop: 12, padding: '10px 28px', borderRadius: 10, background: '#6366f1', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: text.trim() ? 1 : 0.5 }}
      >
        Check Grammar
      </button>
      {checked && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: issues.length === 0 ? '#10b981' : '#f59e0b' }}>
              {issues.length === 0 ? 'No issues found!' : `${issues.length} issue${issues.length > 1 ? 's' : ''} found`}
            </span>
            <span style={{ fontSize: 12, color: '#666', display: 'flex', gap: 10 }}>
              <span style={{ background: TYPE_COLORS.typo, padding: '2px 8px', borderRadius: 4 }}>Typo</span>
              <span style={{ background: TYPE_COLORS.style, padding: '2px 8px', borderRadius: 4 }}>Style</span>
              <span style={{ background: TYPE_COLORS.repeated, padding: '2px 8px', borderRadius: 4 }}>Repeated</span>
            </span>
          </div>
          {issues.length > 0 && (
            <>
              <div style={{ padding: 14, background: 'var(--bg-3)', borderRadius: 10, border: '1px solid var(--line)', lineHeight: 1.8, fontSize: 14, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {parts.map((p, i) => p.issue
                  ? <mark key={i} title={p.issue.message} style={{ background: TYPE_COLORS[p.issue.type], color: '#fff', borderRadius: 3, padding: '1px 0', cursor: 'help' }}>{p.text}</mark>
                  : <span key={i}>{p.text}</span>
                )}
              </div>
              <div style={{ marginTop: 14 }}>
                {issues.map((issue, i) => (
                  <div key={i} style={{ padding: '8px 12px', marginBottom: 6, background: 'var(--bg-3)', borderRadius: 8, borderLeft: `3px solid ${TYPE_COLORS[issue.type].replace('0.35', '0.8')}`, fontSize: 13, color: '#bbb' }}>
                    {issue.message}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
