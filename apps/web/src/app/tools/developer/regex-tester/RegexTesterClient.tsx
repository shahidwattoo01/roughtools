'use client'
import { useState, useMemo } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  background: '#252540',
  border: '1px solid var(--line-strong)',
  color: '#e0e0ff',
  fontSize: 14,
  fontFamily: 'monospace',
  boxSizing: 'border-box',
}

const areaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 100,
}

type MatchInfo = { fullMatch: string; groups: (string | undefined)[]; index: number }

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('')
  const [testStr, setTestStr] = useState('')
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false })

  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('')

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], error: '', highlighted: testStr }
    try {
      const re = new RegExp(pattern, flagStr)
      const found: MatchInfo[] = []
      const gRe = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g')
      let m: RegExpExecArray | null
      while ((m = gRe.exec(testStr)) !== null) {
        found.push({ fullMatch: m[0], groups: Array.from(m).slice(1), index: m.index })
        if (!flagStr.includes('g')) break
        if (m[0].length === 0) gRe.lastIndex++
      }

      // Build highlighted HTML
      let result = ''
      let last = 0
      const gRe2 = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g')
      let m2: RegExpExecArray | null
      while ((m2 = gRe2.exec(testStr)) !== null) {
        result += escHtml(testStr.slice(last, m2.index))
        result += `<mark style="background:#a78bfa33;color:var(--brand-2);border-radius:3px;padding:0 2px">${escHtml(m2[0])}</mark>`
        last = m2.index + m2[0].length
        if (!flagStr.includes('g')) break
        if (m2[0].length === 0) { result += escHtml(testStr[last] ?? ''); last++; gRe2.lastIndex = last }
      }
      result += escHtml(testStr.slice(last))
      void re
      return { matches: found, error: '', highlighted: result }
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message, highlighted: escHtml(testStr) }
    }
  }, [pattern, testStr, flagStr])

  function escHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const toggleFlag = (f: keyof typeof flags) => setFlags(prev => ({ ...prev, [f]: !prev[f] }))

  return (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Regular Expression</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: 18, userSelect: 'none' }}>/</span>
          <input style={{ ...inputStyle, flex: 1 }} value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g. (\w+)@(\w+\.\w+)" spellCheck={false} />
          <span style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: 18, userSelect: 'none' }}>/</span>
          <span style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: 14 }}>{flagStr || ' '}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {(['g', 'i', 'm', 's'] as const).map(f => (
          <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: flags[f] ? '#a78bfa' : '#888', fontWeight: 600 }}>
            <input type="checkbox" checked={flags[f]} onChange={() => toggleFlag(f)} style={{ accentColor: '#a78bfa' }} />
            <code style={{ background: 'rgba(167,139,250,0.1)', padding: '2px 8px', borderRadius: 4 }}>{f}</code>
            <span style={{ fontWeight: 400, color: '#888' }}>{{ g: 'global', i: 'ignoreCase', m: 'multiline', s: 'dotAll' }[f]}</span>
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Test String</label>
        <textarea style={areaStyle} value={testStr} onChange={e => setTestStr(e.target.value)} placeholder="Enter text to test against..." spellCheck={false} />
      </div>
      {error && (
        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: 13, fontFamily: 'monospace' }}>
          {error}
        </div>
      )}
      {testStr && pattern && !error && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Match Highlighting</label>
          <div style={{ padding: '12px 14px', background: '#252540', borderRadius: 8, border: '1px solid var(--line-strong)', fontFamily: 'monospace', fontSize: 13, color: '#e0e0ff', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: highlighted }} />
          <div style={{ marginTop: 8, fontSize: 13, color: matches.length > 0 ? '#4ade80' : '#f87171' }}>
            {matches.length > 0 ? `${matches.length} match${matches.length !== 1 ? 'es' : ''} found` : 'No matches'}
          </div>
        </div>
      )}
      {matches.length > 0 && (
        <div>
          <label style={{ display: 'block', marginBottom: 10, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Match Details</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matches.map((m, i) => (
              <div key={i} style={{ padding: '10px 14px', background: '#252540', borderRadius: 8, border: '1px solid rgba(167,139,250,0.15)', fontSize: 13, fontFamily: 'monospace' }}>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>Match {i + 1}</span>
                <span style={{ color: '#e0e0ff', marginLeft: 12 }}>&quot;{m.fullMatch}&quot;</span>
                <span style={{ color: '#666', marginLeft: 12 }}>at index {m.index}</span>
                {m.groups.length > 0 && m.groups.some(g => g !== undefined) && (
                  <div style={{ marginTop: 6, paddingLeft: 16, borderLeft: '2px solid rgba(167,139,250,0.2)' }}>
                    {m.groups.map((g, gi) => (
                      <div key={gi} style={{ color: 'var(--brand-2)', fontSize: 12 }}>Group {gi + 1}: {g !== undefined ? `"${g}"` : 'undefined'}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
