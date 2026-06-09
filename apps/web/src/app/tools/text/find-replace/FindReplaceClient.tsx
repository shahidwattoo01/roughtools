'use client'
import { useState, useMemo } from 'react'

interface MatchSegment {
  text: string
  match: boolean
}

function buildSegments(text: string, regex: RegExp | null): MatchSegment[] {
  if (!regex || !text) return [{ text, match: false }]
  const segments: MatchSegment[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false })
    segments.push({ text: m[0], match: true })
    last = m.index + m[0].length
    if (m[0].length === 0) { re.lastIndex++; continue }
  }
  if (last < text.length) segments.push({ text: text.slice(last), match: false })
  return segments.length > 0 ? segments : [{ text, match: false }]
}

export default function FindReplaceClient() {
  const [source, setSource] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [regexMode, setRegexMode] = useState(false)
  const [output, setOutput] = useState('')
  const [regexError, setRegexError] = useState('')
  const [copied, setCopied] = useState(false)

  const regex = useMemo(() => {
    if (!find) return null
    try {
      let pattern = regexMode ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (wholeWord) pattern = `\\b${pattern}\\b`
      const flags = caseSensitive ? 'g' : 'gi'
      setRegexError('')
      return new RegExp(pattern, flags)
    } catch (e) {
      setRegexError((e as Error).message)
      return null
    }
  }, [find, caseSensitive, wholeWord, regexMode])

  const matchCount = useMemo(() => {
    if (!regex || !source) return 0
    return (source.match(regex) || []).length
  }, [regex, source])

  const segments = useMemo(() => buildSegments(source, regex), [source, regex])

  function doReplace(all: boolean) {
    if (!regex) return
    const result = all ? source.replace(regex, replace) : source.replace(new RegExp(regex.source, regex.flags.replace('g', '')), replace)
    setOutput(result)
    setCopied(false)
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    background: 'var(--bg-3)',
    border: '1px solid var(--line-strong)',
    color: 'var(--fg)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: value ? '#a5b4fc' : '#777' }}>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} style={{ accentColor: '#6366f1' }} />
      {label}
    </label>
  )

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Source Text</label>
      <textarea
        value={source}
        onChange={e => { setSource(e.target.value); setOutput('') }}
        placeholder="Paste your text here…"
        style={{ width: '100%', minHeight: 160, padding: 14, borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 5 }}>Find</label>
          <input value={find} onChange={e => setFind(e.target.value)} placeholder={regexMode ? 'Regex pattern…' : 'Search text…'} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 5 }}>Replace with</label>
          <input value={replace} onChange={e => setReplace(e.target.value)} placeholder="Replacement text…" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, margin: '12px 0', alignItems: 'center' }}>
        <Toggle label="Case Sensitive" value={caseSensitive} onChange={setCaseSensitive} />
        <Toggle label="Whole Word" value={wholeWord} onChange={setWholeWord} />
        <Toggle label="Regex Mode" value={regexMode} onChange={setRegexMode} />
        {find && !regexError && (
          <span style={{ fontSize: 12, color: matchCount > 0 ? '#6366f1' : '#666', marginLeft: 4 }}>
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
        )}
        {regexError && <span style={{ fontSize: 12, color: '#ef4444' }}>Invalid regex: {regexError}</span>}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => doReplace(false)}
          disabled={!find || !source || !regex || matchCount === 0}
          style={{ padding: '9px 20px', borderRadius: 9, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (!find || !source || !regex || matchCount === 0) ? 0.4 : 1 }}
        >
          Replace First
        </button>
        <button
          onClick={() => doReplace(true)}
          disabled={!find || !source || !regex || matchCount === 0}
          style={{ padding: '9px 20px', borderRadius: 9, background: '#6366f1', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: (!find || !source || !regex || matchCount === 0) ? 0.4 : 1 }}
        >
          Replace All ({matchCount})
        </button>
      </div>
      {find && regex && source && !regexError && matchCount > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Matches highlighted:</div>
          <div style={{ padding: 14, background: 'var(--bg-3)', borderRadius: 10, border: '1px solid var(--line)', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 200, overflow: 'auto' }}>
            {segments.map((seg, i) => seg.match
              ? <mark key={i} style={{ background: 'rgba(99,102,241,0.5)', color: '#fff', borderRadius: 3, padding: '1px 0' }}>{seg.text}</mark>
              : <span key={i}>{seg.text}</span>
            )}
          </div>
        </div>
      )}
      {output !== '' && (
        <div style={{ marginTop: 16, position: 'relative' }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Output</label>
          <textarea value={output} readOnly style={{ width: '100%', minHeight: 140, padding: 14, borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--line)', color: 'var(--fg)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          <button onClick={copy} style={{ position: 'absolute', top: 32, right: 10, padding: '6px 14px', borderRadius: 7, background: copied ? '#10b981' : '#6366f1', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
