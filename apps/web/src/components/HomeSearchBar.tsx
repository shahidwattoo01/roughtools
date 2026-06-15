'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ALL_TOOLS, type Tool } from '@/lib/tools-registry'
import { useRouter } from 'next/navigation'

function search(q: string): Tool[] {
  if (!q.trim()) return []
  const lq = q.toLowerCase()
  return ALL_TOOLS
    .map(t => {
      let s = 0
      const n = t.name.toLowerCase()
      if (n === lq)          s = 100
      else if (n.startsWith(lq)) s = 80
      else if (n.includes(lq))   s = 60
      else if (t.keywords.join(' ').toLowerCase().includes(lq)) s = 40
      else if (t.description.toLowerCase().includes(lq))        s = 20
      if (t.popular && s > 0) s += 10
      return { t, s }
    })
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)
    .map(r => r.t)
}

export function HomeSearchBar() {
  const [q, setQ]         = useState('')
  const [results, setRes] = useState<Tool[]>([])
  const [open, setOpen]   = useState(false)
  const [idx, setIdx]     = useState(-1)
  const ref               = useRef<HTMLDivElement>(null)
  const router            = useRouter()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQ(v); setIdx(-1)
    const r = search(v)
    setRes(r); setOpen(r.length > 0 || v.length > 0)
  }, [])

  const go = useCallback((tool: Tool) => {
    setOpen(false); setQ('')
    router.push(`/tools/${tool.category}/${tool.slug}`)
  }, [router])

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); go(results[idx]) }
    if (e.key === 'Escape') setOpen(false)
  }, [open, results, idx, go])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative max-w-[560px]">
      {/* Input — spec: bg-white dark:bg-[#1e1e1e] border border-black/8 rounded-xl h-12 */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e1e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl h-12 px-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
          strokeLinecap="round" strokeLinejoin="round"
          className="w-[18px] h-[18px] flex-shrink-0 text-[#555] dark:text-[#aaa]" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="search"
          value={q}
          onChange={handleChange}
          onKeyDown={handleKey}
          onFocus={() => q && setOpen(true)}
          placeholder="Search 400+ tools — e.g. image converter, word counter…"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search tools"
          aria-expanded={open}
          aria-controls="home-searchbar-listbox"
          role="combobox"
          aria-haspopup="listbox"
          className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#1a1a1a] dark:text-[#f0f0f0] placeholder:text-[#555] dark:placeholder:text-[#aaa]"
        />
        <span className="text-[11px] text-[#555] dark:text-[#aaa] bg-[#f5f5f3] dark:bg-[#121212] border border-black/[0.08] dark:border-white/[0.08] rounded-[5px] px-1.5 py-0.5 flex-shrink-0">
          ⌘K
        </span>
      </div>

      {/* Dropdown results */}
      {open && (
        <div
          id="home-searchbar-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white dark:bg-[#1e1e1e] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-xl overflow-hidden"
        >
          {results.length > 0 ? (
            <>
              <ul style={{ margin: 0, padding: '6px 0', listStyle: 'none' }}>
                {results.map((tool, i) => (
                  <li key={tool.slug} role="option" aria-selected={i === idx}>
                    <button
                      onClick={() => go(tool)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: 12, padding: '10px 16px', border: 'none',
                        background: i === idx ? '#f0faf4' : 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={() => setIdx(i)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: '#111',
                                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tool.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1,
                                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tool.description}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 500, flexShrink: 0,
                        padding: '2px 8px', borderRadius: 12,
                        background: '#f3f4f6', color: '#6b7280',
                      }}>
                        {tool.category.replace(/-/g, ' ')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{
                borderTop: '1px solid #f3f4f6', padding: '10px 16px',
              }}>
                <Link
                  href={`/search?q=${encodeURIComponent(q)}`}
                  onClick={() => setOpen(false)}
                  style={{ fontSize: 13, color: '#1a6b3c', fontWeight: 500,
                           display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                    strokeLinecap="round" strokeLinejoin="round" width={14} height={14} aria-hidden="true">
                    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  See all results for &ldquo;{q}&rdquo;
                </Link>
              </div>
            </>
          ) : q.length > 0 ? (
            <div style={{ padding: '20px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                No results for &ldquo;{q}&rdquo;
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                Try &ldquo;pdf&rdquo;, &ldquo;calculator&rdquo;, &ldquo;json&rdquo;…
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
