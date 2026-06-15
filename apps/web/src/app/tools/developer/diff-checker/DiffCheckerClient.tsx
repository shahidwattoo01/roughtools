'use client'
import { useState } from 'react'

// ── LCS-based diff algorithm ─────────────────────────────────────────────────
type DiffLine = { type: 'added' | 'removed' | 'unchanged'; text: string }

function computeDiff(aLines: string[], bLines: string[]): DiffLine[] {
  const m = aLines.length
  const n = bLines.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: 'unchanged', text: aLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: bLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'removed', text: aLines[i - 1] })
      i--
    }
  }
  return result
}

// ── Side-by-side alignment: pair removed/added lines ─────────────────────────
type SidePair = { left: DiffLine | null; right: DiffLine | null }

function toSideBySide(diff: DiffLine[]): SidePair[] {
  const pairs: SidePair[] = []
  let k = 0
  while (k < diff.length) {
    const d = diff[k]
    if (d.type === 'unchanged') {
      pairs.push({ left: d, right: d })
      k++
    } else if (d.type === 'removed') {
      // look ahead for an added line to pair with
      const next = diff[k + 1]
      if (next && next.type === 'added') {
        pairs.push({ left: d, right: next })
        k += 2
      } else {
        pairs.push({ left: d, right: null })
        k++
      }
    } else {
      pairs.push({ left: null, right: d })
      k++
    }
  }
  return pairs
}

// ── Styles ───────────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background: 'var(--bg-1)', borderRadius: 12, border: '1px solid var(--line-strong)', overflow: 'hidden' }
const taStyle: React.CSSProperties = { width: '100%', minHeight: 240, padding: 14, background: 'transparent', border: 'none', outline: 'none', color: 'var(--fg)', fontSize: 13, fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box' }
const btnBase: React.CSSProperties = { padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: '1px solid var(--line-strong)', background: 'var(--bg-2)', color: 'var(--fg)' }
const accentBtn: React.CSSProperties = { ...btnBase, background: '#7c3aed', border: 'none', color: '#fff', padding: '10px 28px' }

function lineStyle(type: DiffLine['type']): React.CSSProperties {
  if (type === 'added') return { background: 'rgba(34,197,94,0.12)', color: 'var(--diff-added-text)', borderLeft: '3px solid #22c55e' }
  if (type === 'removed') return { background: 'rgba(239,68,68,0.12)', color: 'var(--diff-removed-text)', borderLeft: '3px solid #ef4444' }
  return { background: 'transparent', color: 'var(--fg-3)', borderLeft: '3px solid transparent' }
}

function prefix(type: DiffLine['type']) {
  if (type === 'added') return '+ '
  if (type === 'removed') return '- '
  return '  '
}

// ── Component ────────────────────────────────────────────────────────────────
export default function DiffCheckerClient() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [diff, setDiff] = useState<DiffLine[] | null>(null)
  const [ignoreWs, setIgnoreWs] = useState(false)
  const [viewMode, setViewMode] = useState<'unified' | 'sidebyside'>('unified')

  function handleCompare() {
    const norm = (s: string) => ignoreWs ? s.trim() : s
    const aLines = original.split('\n').map(norm)
    const bLines = modified.split('\n').map(norm)
    setDiff(computeDiff(aLines, bLines))
  }

  const stats = diff ? {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length,
  } : null

  const sidePairs = diff && viewMode === 'sidebyside' ? toSideBySide(diff) : null

  return (
    <div>
      {/* Input panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div style={card}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line-strong)', fontSize: 12, color: 'var(--fg-3)', fontWeight: 600 }}>ORIGINAL TEXT</div>
          <textarea style={taStyle} value={original} onChange={e => { setOriginal(e.target.value); setDiff(null) }} placeholder="Paste original text here..." spellCheck={false} />
        </div>
        <div style={card}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line-strong)', fontSize: 12, color: 'var(--fg-3)', fontWeight: 600 }}>MODIFIED TEXT</div>
          <textarea style={taStyle} value={modified} onChange={e => { setModified(e.target.value); setDiff(null) }} placeholder="Paste modified text here..." spellCheck={false} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
        <button style={accentBtn} onClick={handleCompare}>Compare</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--fg-2)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={ignoreWs}
            onChange={e => { setIgnoreWs(e.target.checked); setDiff(null) }}
            style={{ accentColor: '#7c3aed', width: 15, height: 15 }}
          />
          Ignore whitespace
        </label>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          <button
            style={{ ...btnBase, background: viewMode === 'unified' ? '#7c3aed' : 'var(--bg-2)', border: '1px solid var(--line-strong)', color: viewMode === 'unified' ? '#fff' : 'var(--fg)', padding: '7px 14px', fontSize: 12 }}
            onClick={() => setViewMode('unified')}
          >Unified</button>
          <button
            style={{ ...btnBase, background: viewMode === 'sidebyside' ? '#7c3aed' : 'var(--bg-2)', border: '1px solid var(--line-strong)', color: viewMode === 'sidebyside' ? '#fff' : 'var(--fg)', padding: '7px 14px', fontSize: 12 }}
            onClick={() => setViewMode('sidebyside')}
          >Side by Side</button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: 20, marginBottom: 14, flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ color: 'var(--diff-added-text)' }}>+ {stats.added} added</span>
          <span style={{ color: 'var(--diff-removed-text)' }}>- {stats.removed} removed</span>
          <span style={{ color: 'var(--fg-3)' }}>{stats.unchanged} unchanged</span>
        </div>
      )}

      {/* Diff output */}
      {diff && diff.length === 0 && (
        <div style={{ padding: 20, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--diff-added-text)', textAlign: 'center', fontSize: 15 }}>
          The two texts are identical.
        </div>
      )}

      {diff && diff.length > 0 && viewMode === 'unified' && (
        <div style={{ ...card, overflowX: 'auto' }}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line-strong)', fontSize: 12, color: 'var(--fg-3)', fontWeight: 600 }}>UNIFIED DIFF</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
            {diff.map((line, idx) => (
              <div
                key={idx}
                style={{ ...lineStyle(line.type), padding: '2px 14px', whiteSpace: 'pre', display: 'flex', gap: 8 }}
              >
                <span style={{ userSelect: 'none', opacity: 0.6, minWidth: 16 }}>{prefix(line.type)}</span>
                <span>{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {diff && diff.length > 0 && viewMode === 'sidebyside' && sidePairs && (
        <div style={{ ...card, overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--line-strong)' }}>
            <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, borderRight: '1px solid var(--line-strong)' }}>ORIGINAL</div>
            <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--fg-3)', fontWeight: 600 }}>MODIFIED</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
            {sidePairs.map((pair, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--line)' }}>
                <div style={{ ...lineStyle(pair.left ? pair.left.type : 'unchanged'), padding: '2px 14px', whiteSpace: 'pre', borderRight: '1px solid var(--line)' }}>
                  {pair.left ? `${prefix(pair.left.type)}${pair.left.text}` : ''}
                </div>
                <div style={{ ...lineStyle(pair.right ? pair.right.type : 'unchanged'), padding: '2px 14px', whiteSpace: 'pre' }}>
                  {pair.right ? `${prefix(pair.right.type)}${pair.right.text}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
