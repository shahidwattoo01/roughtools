'use client'
import { useState } from 'react'

const MIRROR_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
  k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
  u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ɾ',
  K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'd', Q: 'Q', R: 'ɹ', S: 'S', T: '┴',
  U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
  '8': '8', '9': '6', '.': '˙', ',': "'", '?': '¿', '!': '¡', '(': ')', ')': '(',
  '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
}

function mirrorChar(c: string): string { return MIRROR_MAP[c] || c }

function reverseText(s: string) { return [...s].reverse().join('') }
function reverseWords(s: string) { return s.split(/\n/).map(line => line.split(/\s+/).reverse().join(' ')).join('\n') }
function reverseLines(s: string) { return s.split('\n').reverse().join('\n') }
function mirrorText(s: string) { return [...s].map(mirrorChar).reverse().join('') }

const TRANSFORMS = [
  { label: 'Reverse Text', fn: reverseText, color: '#6366f1' },
  { label: 'Reverse Words', fn: reverseWords, color: '#8b5cf6' },
  { label: 'Reverse Lines', fn: reverseLines, color: '#06b6d4' },
  { label: 'Mirror Text', fn: mirrorText, color: '#f59e0b' },
]

export default function TextReverserClient() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeTransform, setActiveTransform] = useState('')
  const [copied, setCopied] = useState(false)

  function apply(label: string, fn: (s: string) => string) {
    setOutput(fn(input))
    setActiveTransform(label)
    setCopied(false)
  }

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const taStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 140,
    padding: 14,
    borderRadius: 10,
    background: 'var(--bg-3)',
    border: '1px solid var(--line-strong)',
    color: 'var(--fg)',
    fontSize: 14,
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Input Text</label>
      <textarea value={input} onChange={e => { setInput(e.target.value); if (activeTransform) { const t = TRANSFORMS.find(t => t.label === activeTransform); if (t) setOutput(t.fn(e.target.value)) } }} placeholder="Type or paste text here…" style={taStyle} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '14px 0' }}>
        {TRANSFORMS.map(({ label, fn, color }) => (
          <button
            key={label}
            onClick={() => apply(label, fn)}
            disabled={!input}
            style={{
              padding: '9px 18px',
              borderRadius: 9,
              background: activeTransform === label ? color : 'var(--bg-3)',
              border: '1px solid ' + (activeTransform === label ? color : 'var(--bg-3)'),
              color: activeTransform === label ? '#fff' : '#bbb',
              fontSize: 13,
              fontWeight: 700,
              cursor: input ? 'pointer' : 'default',
              opacity: input ? 1 : 0.5,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {output !== '' && (
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Output</label>
          <textarea value={output} readOnly style={{ ...taStyle, background: 'rgba(0,0,0,0.15)' }} />
          <button onClick={copy} style={{ position: 'absolute', top: 32, right: 10, padding: '6px 14px', borderRadius: 7, background: copied ? '#10b981' : '#6366f1', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
