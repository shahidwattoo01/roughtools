'use client'

import { useEffect, useState } from 'react'

interface ReportsData {
  snapshots: { id: string; version: string; sampleSize: number; createdAt: string; isActive: boolean }[]
  weeklyStats: { sessionsThisWeek: number; completedTotal: number; validTotal: number; avgIq: number | null }
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/reports').then(r => r.json()).then(setData)
  }, [])

  const trigger = async (type: string, label: string) => {
    setGenerating(type); setMsg('')
    const res = await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    })
    const d = await res.json()
    setMsg(d.note ?? `${label} job queued successfully`)
    setGenerating(null)
  }

  const s = data?.weeklyStats

  return (
    <div className="p-6 space-y-6 max-w-[900px]">
      <div>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="text-[12px] text-[#555] mt-0.5">Generate automated reports and manage norming snapshots</p>
      </div>

      {/* Weekly snapshot */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
        <h2 className="text-[14px] font-semibold mb-4">This Week&apos;s Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Sessions this week', value: s?.sessionsThisWeek ?? '—' },
            { label: 'Completed (total)',  value: s?.completedTotal ?? '—' },
            { label: 'Valid (total)',       value: s?.validTotal ?? '—' },
            { label: 'Avg IQ Score',        value: s?.avgIq ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/3 rounded-xl p-3 text-center">
              <div className="text-xl font-semibold">{value}</div>
              <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {msg && <div className="text-[12px] text-[#6fcf97] bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 rounded-lg px-3 py-2 mb-3">{msg}</div>}

        <div className="flex flex-wrap gap-2">
          <button onClick={() => trigger('weekly', 'Weekly PDF Report')} disabled={!!generating}
            className="bg-[#1a6b3c] hover:bg-[#145230] disabled:opacity-50 text-white rounded-lg px-5 py-2.5 text-[13px] font-medium transition-colors">
            {generating === 'weekly' ? '⏳ Queuing…' : '📄 Generate Weekly PDF'}
          </button>
          <button onClick={() => trigger('norming', 'Norming Recalculation')} disabled={!!generating}
            className="border border-white/10 hover:border-[#1a6b3c] disabled:opacity-50 text-[#aaa] hover:text-white rounded-lg px-5 py-2.5 text-[13px] transition-colors">
            {generating === 'norming' ? '⏳ Queuing…' : '🧮 Recalculate Norms'}
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
        <h2 className="text-[14px] font-semibold mb-4">Automated Schedule</h2>
        <div className="space-y-3">
          {[
            { job: 'Weekly Summary PDF',           schedule: 'Every Monday 08:00',        status: 'active' },
            { job: 'IQ Analytics Update',          schedule: 'Every 15 minutes',           status: 'active' },
            { job: 'Session Expiry Check',         schedule: 'Every 5 minutes',            status: 'active' },
            { job: 'Norming Recalculation',        schedule: 'On threshold (500/2k/5k)',    status: 'conditional' },
          ].map(({ job, schedule, status }) => (
            <div key={job} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <div>
                <div className="text-[13px] font-medium">{job}</div>
                <div className="text-[11px] text-[#555] mt-0.5">{schedule}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status === 'active' ? 'bg-[#1a6b3c]/20 text-[#6fcf97]' : 'bg-[#fbbf24]/20 text-[#fbbf24]'}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Norming history */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/6 text-[13px] font-medium">Norming Snapshot History</div>
        {!data?.snapshots?.length ? (
          <div className="px-4 py-6 text-center text-[#555] text-[12px]">No snapshots yet — run norming recalculation first.</div>
        ) : (
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-white/5">
              {['Version','Sample Size','Created','Status'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-[#444] font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {data.snapshots.map(s => (
                <tr key={s.id} className="border-b border-white/4 hover:bg-white/2">
                  <td className="px-4 py-2.5 font-mono text-[#aaa]">{s.version}</td>
                  <td className="px-4 py-2.5 tabular-nums">{s.sampleSize.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-[#555]">
                    {new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-2.5">
                    {s.isActive
                      ? <span className="text-[10px] bg-[#1a6b3c]/20 text-[#6fcf97] px-2 py-0.5 rounded-full font-medium">Active</span>
                      : <span className="text-[10px] bg-white/5 text-[#555] px-2 py-0.5 rounded-full">Archived</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
