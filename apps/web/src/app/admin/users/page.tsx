'use client'

import { useEffect, useState, useCallback } from 'react'

interface UserRow {
  id: string; email: string; name: string | null
  createdAt: string; lastLogin: string | null
  status: string; plan: string; totalSessions: number
}

interface UsersData { total: number; users: UserRow[] }

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersData | null>(null)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '25' })
    if (q) params.set('q', q)
    const res = await fetch(`/api/admin/users?${params}`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [page, q])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-[12px] text-[#555] mt-0.5">{data?.total ?? 0} registered users</p>
        </div>
        <button className="text-[12px] border border-white/10 hover:border-[#1a6b3c] rounded-lg px-3 py-2 text-[#aaa] hover:text-white transition-colors">
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Search by email or name…"
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white placeholder-[#444] focus:outline-none focus:border-[#1a6b3c] w-[280px]" />
        <button onClick={load} className="bg-[#1a6b3c] text-white rounded-lg px-4 py-2 text-[12px] hover:bg-[#145230] transition-colors">Search</button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-white/5">
              {['Email','Name','Joined','Last Login','Plan','IQ Sessions','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-[#444] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#555]">Loading…</td></tr>
            ) : !data?.users.length ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#555]">No users found.</td></tr>
            ) : data.users.map(u => (
              <tr key={u.id} className="border-b border-white/4 hover:bg-white/2">
                <td className="px-4 py-2.5">{u.email}</td>
                <td className="px-4 py-2.5 text-[#888]">{u.name ?? '—'}</td>
                <td className="px-4 py-2.5 text-[#555]">
                  {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                </td>
                <td className="px-4 py-2.5 text-[#555]">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${u.plan === 'pro' ? 'bg-[#1a6b3c]/20 text-[#6fcf97]' : 'bg-white/5 text-[#888]'}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">{u.totalSessions}</td>
                <td className="px-4 py-2.5">
                  <button className="text-[11px] text-[#1a6b3c] hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="text-[12px] border border-white/10 rounded-lg px-4 py-2 disabled:opacity-40 hover:border-[#1a6b3c] transition-colors">
          Previous
        </button>
        <span className="text-[12px] text-[#555]">Page {page} of {Math.ceil((data?.total ?? 0) / 25)}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil((data?.total ?? 0) / 25)}
          className="text-[12px] border border-white/10 rounded-lg px-4 py-2 disabled:opacity-40 hover:border-[#1a6b3c] transition-colors">
          Next
        </button>
      </div>
    </div>
  )
}
