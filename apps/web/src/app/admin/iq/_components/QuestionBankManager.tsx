'use client'

import { useState, useEffect, useCallback } from 'react'

type Domain = 'FLUID_REASONING' | 'CRYSTALLIZED_INTELLIGENCE' | 'QUANTITATIVE_REASONING'
  | 'SPATIAL_REASONING' | 'WORKING_MEMORY' | 'PROCESSING_SPEED'
type Format = 'MATRIX' | 'SEQUENCE' | 'ANALOGY' | 'MEMORY' | 'SPATIAL' | 'DEDUCTION'

interface Question {
  id: string
  domain: Domain
  format: Format
  difficulty: number
  discriminationIndex: number
  pilot: boolean
  isActive: boolean
  createdAt: string
  correctRate: number | null
  analytics: {
    totalPresentations: number
    totalCorrect: number
    difficultyEmpirical: number | null
    exposureThisMonth: number
  } | null
}

const DOMAIN_SHORT: Record<Domain, string> = {
  FLUID_REASONING: 'Fluid', CRYSTALLIZED_INTELLIGENCE: 'Crystal',
  QUANTITATIVE_REASONING: 'Quant', SPATIAL_REASONING: 'Spatial',
  WORKING_MEMORY: 'Memory', PROCESSING_SPEED: 'Speed',
}

const DOMAIN_COLOR: Record<Domain, string> = {
  FLUID_REASONING: '#7c3aed', CRYSTALLIZED_INTELLIGENCE: '#2563eb',
  QUANTITATIVE_REASONING: '#0891b2', SPATIAL_REASONING: '#059669',
  WORKING_MEMORY: '#d97706', PROCESSING_SPEED: '#dc2626',
}

export function QuestionBankManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterDomain, setFilterDomain] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [filterPilot, setFilterPilot] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '50' })
    if (filterDomain) params.set('domain', filterDomain)
    if (filterActive) params.set('active', filterActive)
    if (filterPilot)  params.set('pilot', filterPilot)
    const res = await fetch(`/api/iq/admin/questions?${params}`)
    if (res.ok) {
      const data = await res.json()
      setQuestions(data.questions)
      setTotal(data.total)
    }
    setLoading(false)
  }, [page, filterDomain, filterActive, filterPilot])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const selectAll = () => setSelected(new Set(questions.map(q => q.id)))
  const clearSelection = () => setSelected(new Set())

  const bulkAction = async (action: string) => {
    if (!selected.size) return
    const res = await fetch('/api/iq/admin/questions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selected], action }),
    })
    if (res.ok) {
      const data = await res.json()
      setActionMsg(`Updated ${data.updated} questions`)
      clearSelection()
      fetchQuestions()
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterDomain}
          onChange={e => { setFilterDomain(e.target.value); setPage(1) }}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 bg-white dark:bg-[#1e1e1e]"
        >
          <option value="">All domains</option>
          {Object.keys(DOMAIN_SHORT).map(d => <option key={d} value={d}>{DOMAIN_SHORT[d as Domain]}</option>)}
        </select>
        <select
          value={filterActive}
          onChange={e => { setFilterActive(e.target.value); setPage(1) }}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 bg-white dark:bg-[#1e1e1e]"
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          value={filterPilot}
          onChange={e => { setFilterPilot(e.target.value); setPage(1) }}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 bg-white dark:bg-[#1e1e1e]"
        >
          <option value="">All types</option>
          <option value="false">Scored</option>
          <option value="true">Pilot</option>
        </select>
        <span className="ml-auto text-[12px] text-[#555] dark:text-[#aaa] self-center">{total} questions</span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-[#fdf4ff] dark:bg-[#a21caf]/10 rounded-lg border border-[#a21caf]/20">
          <span className="text-[13px] font-medium text-[#a21caf]">{selected.size} selected</span>
          {[
            { label: 'Activate', action: 'activate' },
            { label: 'Deactivate', action: 'deactivate' },
            { label: 'Mark pilot', action: 'set-pilot' },
            { label: 'Unmark pilot', action: 'unset-pilot' },
          ].map(({ label, action }) => (
            <button key={action} onClick={() => bulkAction(action)}
              className="text-[12px] bg-white dark:bg-[#1e1e1e] border border-black/10 dark:border-white/15 rounded px-3 py-1.5 hover:border-[#a21caf] transition-colors">
              {label}
            </button>
          ))}
          <button onClick={clearSelection} className="text-[12px] text-[#555] ml-auto hover:text-[#a21caf]">Clear</button>
        </div>
      )}

      {actionMsg && (
        <div className="mb-3 text-[12px] text-[#059669] bg-[#d1fae5] rounded-lg px-3 py-2">{actionMsg}</div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5">
              <th className="w-8 p-3">
                <input type="checkbox" onChange={e => e.target.checked ? selectAll() : clearSelection()}
                  checked={selected.size === questions.length && questions.length > 0}
                  className="rounded" />
              </th>
              {['Domain', 'Format', 'Diff.', 'Disc.', 'Presentations', 'Correct %', 'Exposure', 'Status'].map(h => (
                <th key={h} className="text-left p-3 text-[11px] uppercase tracking-wide text-[#555] dark:text-[#aaa] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="p-6 text-center text-[#555]">Loading…</td></tr>
            ) : questions.map(q => (
              <tr key={q.id}
                className={`border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors ${selected.has(q.id) ? 'bg-[#fdf4ff] dark:bg-[#a21caf]/5' : ''}`}>
                <td className="p-3">
                  <input type="checkbox" checked={selected.has(q.id)} onChange={() => toggleSelect(q.id)} className="rounded" />
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-medium"
                    style={{ background: DOMAIN_COLOR[q.domain] }}>
                    {DOMAIN_SHORT[q.domain]}
                  </span>
                </td>
                <td className="p-3 font-mono">{q.format}</td>
                <td className="p-3 text-center font-semibold">
                  <span className={q.difficulty >= 8 ? 'text-[#dc2626]' : q.difficulty >= 5 ? 'text-[#d97706]' : 'text-[#059669]'}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="p-3 text-center">{q.discriminationIndex.toFixed(2)}</td>
                <td className="p-3 text-center">{q.analytics?.totalPresentations ?? 0}</td>
                <td className="p-3 text-center">
                  {q.correctRate != null ? `${(q.correctRate * 100).toFixed(0)}%` : '—'}
                </td>
                <td className="p-3 text-center">{q.analytics?.exposureThisMonth ?? 0}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {q.isActive
                      ? <span className="text-[10px] bg-[#d1fae5] text-[#059669] px-1.5 py-0.5 rounded-full">Active</span>
                      : <span className="text-[10px] bg-[#f3f4f6] text-[#555] px-1.5 py-0.5 rounded-full">Inactive</span>}
                    {q.pilot && <span className="text-[10px] bg-[#dbeafe] text-[#2563eb] px-1.5 py-0.5 rounded-full">Pilot</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-4 py-2 disabled:opacity-40 hover:border-[#a21caf] transition-colors">
          Previous
        </button>
        <span className="text-[12px] text-[#555] dark:text-[#aaa]">Page {page} of {Math.ceil(total / 50)}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 50)}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-4 py-2 disabled:opacity-40 hover:border-[#a21caf] transition-colors">
          Next
        </button>
      </div>
    </div>
  )
}
