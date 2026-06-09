'use client'

import { useState, useCallback } from 'react'

interface SessionRow {
  id: string
  status: string
  ageGroup: string
  iqScore: number | null
  percentile: number | null
  isValid: boolean
  invalidityFlags: string[]
  focusLossCount: number
  pauseCount: number
  totalQuestions: number
  startedAt: string
  completedAt: string | null
  reportReady: boolean
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'text-[#059669] bg-[#d1fae5]',
  ACTIVE:    'text-[#2563eb] bg-[#dbeafe]',
  EXPIRED:   'text-[#d97706] bg-[#fef3c7]',
  VOIDED:    'text-[#dc2626] bg-[#fee2e2]',
  PAUSED:    'text-[#7c3aed] bg-[#ede9fe]',
}

export function SessionInspector() {
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQ, setSearchQ] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterValid, setFilterValid] = useState('')
  const [loading, setLoading] = useState(false)

  const search = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25' })
    if (searchQ)      params.set('q', searchQ)
    if (filterStatus) params.set('status', filterStatus)
    if (filterValid)  params.set('valid', filterValid)
    const res = await fetch(`/api/iq/admin/sessions?${params}`)
    if (res.ok) {
      const data = await res.json()
      setSessions(data.sessions)
      setTotal(data.total)
    }
    setLoading(false)
  }, [page, searchQ, filterStatus, filterValid])

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Session ID prefix…"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 bg-white dark:bg-[#1e1e1e] flex-1 min-w-[200px]"
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 bg-white dark:bg-[#1e1e1e]">
          <option value="">All statuses</option>
          {['COMPLETED','ACTIVE','PAUSED','EXPIRED','VOIDED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterValid} onChange={e => setFilterValid(e.target.value)}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-2 bg-white dark:bg-[#1e1e1e]">
          <option value="">All validity</option>
          <option value="true">Valid</option>
          <option value="false">Invalid</option>
        </select>
        <button onClick={() => { setPage(1); search() }}
          className="bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
          Search
        </button>
        <span className="self-center text-[12px] text-[#555] dark:text-[#aaa]">{total} results</span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5">
              {['Session ID', 'Status', 'Age', 'IQ', 'Pct.', 'Valid', 'Flags', 'Qs', 'Focus', 'Started', 'PDF'].map(h => (
                <th key={h} className="text-left p-3 text-[11px] uppercase tracking-wide text-[#555] dark:text-[#aaa] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} className="p-6 text-center text-[#555]">Loading…</td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan={11} className="p-6 text-center text-[#555]">No sessions found. Run a search.</td></tr>
            ) : sessions.map(s => (
              <tr key={s.id}
                className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                <td className="p-3 font-mono text-[10px] text-[#555]">{s.id.slice(-10)}</td>
                <td className="p-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status] ?? 'text-[#555] bg-[#f3f4f6]'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-[#555] dark:text-[#aaa]">{s.ageGroup.replace('AGE_', '').replace('_', '–')}</td>
                <td className="p-3 text-center font-semibold">{s.iqScore ?? '—'}</td>
                <td className="p-3 text-center">{s.percentile != null ? `${s.percentile}th` : '—'}</td>
                <td className="p-3 text-center">
                  <span className={`text-[10px] font-medium ${s.isValid ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                    {s.isValid ? '✓' : '✗'}
                  </span>
                </td>
                <td className="p-3">
                  {s.invalidityFlags.length > 0
                    ? <span className="text-[10px] text-[#dc2626]">{s.invalidityFlags.length} flag{s.invalidityFlags.length > 1 ? 's' : ''}</span>
                    : <span className="text-[10px] text-[#059669]">None</span>}
                </td>
                <td className="p-3 text-center">{s.totalQuestions}</td>
                <td className="p-3 text-center">{s.focusLossCount}</td>
                <td className="p-3 text-[#555] dark:text-[#aaa]">
                  {new Date(s.startedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </td>
                <td className="p-3 text-center">
                  {s.reportReady
                    ? <span className="text-[10px] text-[#059669]">Ready</span>
                    : <span className="text-[10px] text-[#555]">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={() => { setPage(p => Math.max(1, p - 1)); search() }} disabled={page === 1}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-4 py-2 disabled:opacity-40 hover:border-[#a21caf] transition-colors">
          Previous
        </button>
        <span className="text-[12px] text-[#555] dark:text-[#aaa]">Page {page} of {Math.ceil(total / 25)}</span>
        <button onClick={() => { setPage(p => p + 1); search() }} disabled={page >= Math.ceil(total / 25)}
          className="text-sm border border-black/10 dark:border-white/15 rounded-lg px-4 py-2 disabled:opacity-40 hover:border-[#a21caf] transition-colors">
          Next
        </button>
      </div>
    </div>
  )
}
