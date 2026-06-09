'use client'
import { useState } from 'react'

const SOURCE_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const SOURCE_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  'Eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.',
  'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus nulla mauris pharetra condimentum.',
  'Pellentesque habitant morbi tristique senectus et netus et malesuada fames.',
  'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.',
]

function getWords(count: number) {
  const result: string[] = []
  for (let i = 0; i < count; i++) result.push(SOURCE_WORDS[i % SOURCE_WORDS.length])
  return result.join(' ') + '.'
}

function getSentences(count: number) {
  const result: string[] = []
  for (let i = 0; i < count; i++) result.push(SOURCE_SENTENCES[i % SOURCE_SENTENCES.length])
  return result.join(' ')
}

function getParagraphs(count: number) {
  const paragraphs: string[] = []
  for (let p = 0; p < count; p++) {
    const sentences: string[] = []
    const sentCount = 4 + (p % 3)
    for (let s = 0; s < sentCount; s++) sentences.push(SOURCE_SENTENCES[(p * 4 + s) % SOURCE_SENTENCES.length])
    paragraphs.push(sentences.join(' '))
  }
  return paragraphs.join('\n\n')
}

type Mode = 'paragraphs' | 'sentences' | 'words'

export default function LoremIpsumClient() {
  const [mode, setMode] = useState<Mode>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    let text = ''
    if (mode === 'paragraphs') text = getParagraphs(count)
    else if (mode === 'sentences') text = getSentences(count)
    else text = getWords(count)
    setOutput(text)
    setCopied(false)
  }

  function copy() {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const maxCount = mode === 'words' ? 200 : 20

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 14, border: '1px solid var(--line)', padding: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Generate</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['paragraphs', 'sentences', 'words'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setCount(m === 'words' ? 50 : 3) }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: mode === m ? '#6366f1' : 'var(--bg-3)',
                  border: '1px solid ' + (mode === m ? '#6366f1' : 'var(--bg-3)'),
                  color: mode === m ? '#fff' : '#999',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>Count (1–{maxCount})</label>
          <input
            type="number"
            min={1}
            max={maxCount}
            value={count}
            onChange={e => setCount(Math.min(maxCount, Math.max(1, parseInt(e.target.value) || 1)))}
            style={{ width: 80, padding: '8px 12px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: 14, outline: 'none' }}
          />
        </div>
        <button
          onClick={generate}
          style={{ padding: '10px 24px', borderRadius: 10, background: '#6366f1', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          Generate
        </button>
      </div>
      {output && (
        <div style={{ position: 'relative' }}>
          <textarea
            value={output}
            readOnly
            style={{
              width: '100%',
              minHeight: 200,
              padding: 14,
              borderRadius: 10,
              background: 'var(--bg-3)',
              border: '1px solid var(--line)',
              color: 'var(--fg-2)',
              fontSize: 14,
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={copy}
            style={{ position: 'absolute', top: 10, right: 10, padding: '6px 14px', borderRadius: 7, background: copied ? '#10b981' : '#6366f1', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
