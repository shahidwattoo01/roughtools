'use client'

import { useEffect, useState, useCallback } from 'react'
import { ALL_TOOLS } from '@/lib/tools-registry'

interface EditRow {
  slug: string; name: string; category: string
  title: string; description: string
  titleDirty: boolean; descDirty: boolean
}

const TITLE_MIN = 45; const TITLE_MAX = 65
const DESC_MIN = 140; const DESC_MAX = 165

function lenColor(len: number, min: number, max: number) {
  if (len === 0) return 'text-[#f87171]'
  if (len < min) return 'text-[#fbbf24]'
  if (len > max) return 'text-[#f87171]'
  return 'text-[#6fcf97]'
}

export default function AdminContentPage() {
  const [rows, setRows] = useState<EditRow[]>([])
  const [q, setQ] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterIssues, setFilterIssues] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const [generating, setGenerating] = useState<Set<string>>(new Set())

  useEffect(() => {
    const initial = ALL_TOOLS.map(t => ({
      slug: t.slug, name: t.name, category: t.category,
      title: `${t.name} — Free Online Tool | RoughTools`,
      description: t.description,
      titleDirty: false, descDirty: false,
    }))
    setRows(initial)
  }, [])

  const filtered = rows.filter(r => {
    if (q && !r.name.toLowerCase().includes(q.toLowerCase()) && !r.slug.includes(q.toLowerCase())) return false
    if (filterCat && r.category !== filterCat) return false
    if (filterIssues) {
      const titleLen = r.title.length; const descLen = r.description.length
      if (titleLen >= TITLE_MIN && titleLen <= TITLE_MAX && descLen >= DESC_MIN && descLen <= DESC_MAX) return false
    }
    return true
  })

  const cats = [...new Set(ALL_TOOLS.map(t => t.category))].sort()
  const dirtyCount = rows.filter(r => r.titleDirty || r.descDirty).length

  const updateRow = (slug: string, field: 'title' | 'description', value: string) => {
    setRows(prev => prev.map(r => r.slug !== slug ? r : {
      ...r, [field]: value,
      [`${field}Dirty`]: true,
    }))
  }

  const saveAll = useCallback(async () => {
    const dirty = rows.filter(r => r.titleDirty || r.descDirty)
    if (!dirty.length) return
    setSaving(true)
    const res = await fetch('/api/admin/tools/bulk-meta', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: dirty.map(r => ({ slug: r.slug, title: r.title, description: r.description })) }),
    })
    const d = await res.json() as { updated: number; errors: string[] }
    setSavedCount(d.updated)
    setRows(prev => prev.map(r => ({ ...r, titleDirty: false, descDirty: false })))
    setSaving(false)
    if (d.errors?.length) console.warn('Bulk meta errors:', d.errors)
    setTimeout(() => setSavedCount(0), 3000)
  }, [rows])

  const generateMeta = useCallback(async (slug: string) => {
    setGenerating(prev => new Set(prev).add(slug))
    try {
      const res = await fetch('/api/admin/tools/generate-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: [slug] }),
      })
      if (res.ok) {
        const { generated } = await res.json() as { generated: { slug: string; title: string; description: string }[] }
        const meta = generated.find(g => g.slug === slug)
        if (meta) {
          updateRow(slug, 'title', meta.title)
          updateRow(slug, 'description', meta.description)
        }
      }
    } catch { /* non-fatal */ }
    setGenerating(prev => { const n = new Set(prev); n.delete(slug); return n })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Bulk Metadata Editor</h1>
          <p className="text-[12px] text-[#555] mt-0.5">Edit title and meta description for all {ALL_TOOLS.length} tools</p>
        </div>
        <div className="flex items-center gap-3">
          {savedCount > 0 && <span className="text-[12px] text-[#6fcf97]">✓ Saved {savedCount} pages</span>}
          {dirtyCount > 0 && (
            <button onClick={saveAll} disabled={saving}
              className="text-[12px] bg-[#1a6b3c] hover:bg-[#145230] disabled:opacity-50 text-white rounded-lg px-4 py-2 transition-colors">
              {saving ? 'Saving…' : `Save ${dirtyCount} changes`}
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tools…"
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white placeholder-[#444] focus:outline-none focus:border-[#1a6b3c] w-[220px]" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-[12px] text-[#aaa] focus:outline-none">
          <option value="">All categories</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-[12px] text-[#aaa] cursor-pointer">
          <input type="checkbox" checked={filterIssues} onChange={e => setFilterIssues(e.target.checked)} className="accent-[#1a6b3c]" />
          Issues only
        </label>
        <span className="ml-auto text-[12px] text-[#555] self-center">{filtered.length} tools shown</span>
      </div>

      {/* Character guide */}
      <div className="flex gap-4 text-[11px]">
        <span><span className="text-[#6fcf97]">■</span> In range</span>
        <span><span className="text-[#fbbf24]">■</span> Too short</span>
        <span><span className="text-[#f87171]">■</span> Too long / empty</span>
        <span className="text-[#555]">Title: {TITLE_MIN}–{TITLE_MAX} chars · Desc: {DESC_MIN}–{DESC_MAX} chars</span>
      </div>

      {/* Table */}
      <div className="space-y-2">
        {filtered.slice(0, 50).map(r => (
          <div key={r.slug} className={`bg-[#1a1a1a] border rounded-xl p-4 transition-colors ${r.titleDirty || r.descDirty ? 'border-[#1a6b3c]/40' : 'border-white/8'}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[13px] font-medium">{r.name}</span>
                <span className="ml-2 text-[10px] text-[#555]">{r.category}</span>
                <span className="ml-2 font-mono text-[10px] text-[#444]">/tools/{r.category}/{r.slug}</span>
              </div>
              <button onClick={() => generateMeta(r.slug)} disabled={generating.has(r.slug)}
                className="text-[11px] border border-white/10 hover:border-[#1a6b3c] rounded px-3 py-1 text-[#aaa] hover:text-white transition-colors flex-shrink-0 disabled:opacity-40">
                {generating.has(r.slug) ? '⏳ Generating…' : '✨ AI Generate'}
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-[#555] uppercase tracking-wide">Page Title</label>
                  <span className={`text-[10px] ${lenColor(r.title.length, TITLE_MIN, TITLE_MAX)}`}>
                    {r.title.length} chars
                  </span>
                </div>
                <input value={r.title} onChange={e => updateRow(r.slug, 'title', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#1a6b3c] transition-colors" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-[#555] uppercase tracking-wide">Meta Description</label>
                  <span className={`text-[10px] ${lenColor(r.description.length, DESC_MIN, DESC_MAX)}`}>
                    {r.description.length} chars
                  </span>
                </div>
                <textarea value={r.description} onChange={e => updateRow(r.slug, 'description', e.target.value)} rows={2}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#1a6b3c] transition-colors resize-none" />
              </div>
            </div>
          </div>
        ))}
        {filtered.length > 50 && (
          <p className="text-center text-[12px] text-[#555] py-2">Showing 50 of {filtered.length} — refine filters to see more</p>
        )}
      </div>
    </div>
  )
}
