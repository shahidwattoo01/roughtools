'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useVirtualizer } from '@tanstack/react-virtual'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tool {
  slug: string; name: string; category: string; status: string
  monthlyPageviews: number; avgSessionSeconds: number; bounceRate: number
  adsenseRpm: number; seoScore: number; indexStatus: string
  avgPosition: number; featured: boolean; popular: boolean; isNew: boolean
  priority: number
}

const CATEGORY_COLORS: Record<string, string> = {
  pdf: '#ef4444', calculators: '#3b82f6', developer: '#8b5cf6', text: '#f59e0b',
  converters: '#f97316', network: '#06b6d4', 'legal-tools': '#64748b',
  'real-estate': '#f59e0b', 'image-tools': '#ec4899', security: '#10b981',
  'document-tools': '#6366f1', business: '#a855f7', environment: '#84cc16',
  engineering: '#0ea5e9', medical: '#14b8a6', 'iq-test': '#a21caf',
}

const STATUS_STYLES: Record<string, string> = {
  published:   'text-[#6fcf97] bg-[#6fcf97]/10',
  draft:       'text-[#fbbf24] bg-[#fbbf24]/10',
  maintenance: 'text-[#f97316] bg-[#f97316]/10',
  deprecated:  'text-[#f87171] bg-[#f87171]/10',
}

const SEO_COLOR = (s: number) => s >= 80 ? '#6fcf97' : s >= 60 ? '#fbbf24' : '#f87171'

// Column visibility state
const ALL_COLS = [
  'name', 'category', 'status', 'pageviews', 'session', 'bounce',
  'rpm', 'seo', 'index', 'position',
] as const
type Col = typeof ALL_COLS[number]
const DEFAULT_VISIBLE: Col[] = ['name', 'category', 'status', 'pageviews', 'seo', 'index', 'rpm']

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortCol, setSortCol] = useState<Col>('pageviews')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [visibleCols, setVisibleCols] = useState<Set<Col>>(new Set(DEFAULT_VISIBLE))
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showColMenu, setShowColMenu] = useState(false)

  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/tools')
      .then(r => r.json())
      .then(d => setTools(d.tools ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let out = tools
    if (q) {
      const ql = q.toLowerCase()
      out = out.filter(t => t.name.toLowerCase().includes(ql) || t.slug.includes(ql) || t.category.includes(ql))
    }
    if (filterCat)    out = out.filter(t => t.category === filterCat)
    if (filterStatus) out = out.filter(t => t.status === filterStatus)

    const colMap: Record<Col, keyof Tool> = {
      name: 'name', category: 'category', status: 'status', pageviews: 'monthlyPageviews',
      session: 'avgSessionSeconds', bounce: 'bounceRate', rpm: 'adsenseRpm',
      seo: 'seoScore', index: 'indexStatus', position: 'avgPosition',
    }
    out = [...out].sort((a, b) => {
      const av = a[colMap[sortCol]] as number | string
      const bv = b[colMap[sortCol]] as number | string
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return out
  }, [tools, q, filterCat, filterStatus, sortCol, sortDir])

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  const toggleSort = useCallback((col: Col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }, [sortCol])

  const toggleCol = (col: Col) => setVisibleCols(prev => {
    const next = new Set(prev)
    next.has(col) ? next.delete(col) : next.add(col)
    return next
  })

  const cats = useMemo(() => [...new Set(tools.map(t => t.category))].sort(), [tools])

  const COL_HEADERS: Record<Col, string> = {
    name: 'Tool', category: 'Category', status: 'Status', pageviews: 'Monthly PVs',
    session: 'Avg Session', bounce: 'Bounce %', rpm: 'RPM ($)', seo: 'SEO Score',
    index: 'Index', position: 'Avg Pos.',
  }

  const renderCell = (t: Tool, col: Col) => {
    switch (col) {
      case 'name': return (
        <Link href={`/admin/tools/${t.slug}`}
          className="font-medium text-white hover:text-[#6fcf97] transition-colors">
          {t.name}
          {t.isNew && <span className="ml-1.5 text-[9px] bg-[#1a6b3c]/20 text-[#6fcf97] px-1 py-0.5 rounded">NEW</span>}
        </Link>
      )
      case 'category': return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
          style={{ background: `${CATEGORY_COLORS[t.category]}30`, color: CATEGORY_COLORS[t.category] ?? '#aaa' }}>
          {t.category}
        </span>
      )
      case 'status': return (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[t.status] ?? ''}`}>
          {t.status}
        </span>
      )
      case 'pageviews': return <span className="tabular-nums">{t.monthlyPageviews.toLocaleString()}</span>
      case 'session':   return <span className="text-[#888]">{t.avgSessionSeconds}s</span>
      case 'bounce':    return <span className={t.bounceRate > 70 ? 'text-[#f87171]' : 'text-[#888]'}>{t.bounceRate}%</span>
      case 'rpm':       return <span className="text-[#6fcf97]">${t.adsenseRpm.toFixed(2)}</span>
      case 'seo':       return (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden w-12">
            <div className="h-full rounded-full" style={{ width: `${t.seoScore}%`, background: SEO_COLOR(t.seoScore) }} />
          </div>
          <span style={{ color: SEO_COLOR(t.seoScore) }}>{t.seoScore}</span>
        </div>
      )
      case 'index':     return (
        <span className={`text-[10px] font-medium ${t.indexStatus === 'indexed' ? 'text-[#6fcf97]' : 'text-[#f87171]'}`}>
          {t.indexStatus}
        </span>
      )
      case 'position':  return <span className="text-[#888] tabular-nums">{t.avgPosition.toFixed(1)}</span>
      default: return null
    }
  }

  return (
    <div className="p-6 flex flex-col h-screen max-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Tools Management</h1>
          <p className="text-[12px] text-[#555] mt-0.5">{filtered.length} of {tools.length} tools</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/tools/new"
            className="text-[12px] bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-4 py-2 transition-colors">
            + Add Tool
          </Link>
          <button onClick={() => { /* export CSV */ }}
            className="text-[12px] border border-white/10 hover:border-[#1a6b3c] rounded-lg px-3 py-2 text-[#aaa] hover:text-white transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
        <input type="text" placeholder="Search tools, slugs, categories…"
          value={q} onChange={e => setQ(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#444]
                     focus:outline-none focus:border-[#1a6b3c] transition-colors flex-1 min-w-[200px]" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#aaa] focus:outline-none focus:border-[#1a6b3c]">
          <option value="">All categories</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#aaa] focus:outline-none focus:border-[#1a6b3c]">
          <option value="">All statuses</option>
          {['published','draft','maintenance','deprecated'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Column toggle */}
        <div className="relative">
          <button onClick={() => setShowColMenu(v => !v)}
            className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#aaa] hover:text-white transition-colors">
            Columns ▾
          </button>
          {showColMenu && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl p-3 z-50 shadow-xl min-w-[160px]">
              {ALL_COLS.map(col => (
                <label key={col} className="flex items-center gap-2 py-1 cursor-pointer text-[12px] text-[#aaa] hover:text-white">
                  <input type="checkbox" checked={visibleCols.has(col)} onChange={() => toggleCol(col)}
                    className="rounded accent-[#1a6b3c]" />
                  {COL_HEADERS[col]}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 rounded-lg px-3 py-1.5">
            <span className="text-[11px] text-[#6fcf97]">{selected.size} selected</span>
            <button className="text-[11px] text-[#aaa] hover:text-white">Publish</button>
            <button className="text-[11px] text-[#aaa] hover:text-white">Draft</button>
            <button className="text-[11px] text-[#aaa] hover:text-white">Export</button>
          </div>
        )}
      </div>

      {/* Virtual scroll table */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Table header */}
        <div className="grid border-b border-white/6 flex-shrink-0"
          style={{ gridTemplateColumns: `32px ${[...visibleCols].map(c => c === 'name' ? '2fr' : '1fr').join(' ')}` }}>
          <div className="px-3 py-2.5">
            <input type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t.slug)) : new Set())}
              className="rounded accent-[#1a6b3c]" />
          </div>
          {[...visibleCols].map(col => (
            <button key={col} onClick={() => toggleSort(col)}
              className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wide text-[#444] font-medium hover:text-[#aaa] transition-colors flex items-center gap-1">
              {COL_HEADERS[col]}
              {sortCol === col && <span className="opacity-60">{sortDir === 'asc' ? '↑' : '↓'}</span>}
            </button>
          ))}
        </div>

        {/* Scrollable virtual body */}
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="w-6 h-6 border-2 border-[#1a6b3c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={parentRef} className="overflow-auto flex-1">
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map(vrow => {
                const t = filtered[vrow.index]
                return (
                  <div
                    key={t.slug}
                    data-index={vrow.index}
                    ref={virtualizer.measureElement}
                    className={`absolute left-0 right-0 grid border-b border-white/4 hover:bg-white/2 transition-colors ${selected.has(t.slug) ? 'bg-[#1a6b3c]/5' : ''}`}
                    style={{
                      top: vrow.start,
                      gridTemplateColumns: `32px ${[...visibleCols].map(c => c === 'name' ? '2fr' : '1fr').join(' ')}`,
                    }}
                  >
                    <div className="px-3 py-2.5 flex items-center">
                      <input type="checkbox" checked={selected.has(t.slug)}
                        onChange={() => setSelected(prev => {
                          const next = new Set(prev)
                          next.has(t.slug) ? next.delete(t.slug) : next.add(t.slug)
                          return next
                        })}
                        className="rounded accent-[#1a6b3c]" />
                    </div>
                    {[...visibleCols].map(col => (
                      <div key={col} className="px-3 py-2.5 text-[12px] flex items-center">
                        {renderCell(t, col)}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
