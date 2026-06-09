'use client'

import { useState, useEffect } from 'react'

interface Snapshot {
  id: string
  version: string
  ageGroup: string
  sampleSize: number
  meanRaw: number
  stdDevRaw: number
  createdAt: string
}

interface Stats {
  totalValid: number
  totalCompleted: number
  validityRate: number
  avgIq: number | null
}

const AGE_LABELS: Record<string, string> = {
  AGE_18_24: '18–24', AGE_25_34: '25–34', AGE_35_44: '35–44',
  AGE_45_54: '45–54', AGE_55_64: '55–64', AGE_65_PLUS: '65+',
}

export function NormingDashboard() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/iq/admin/norming')
      .then(r => r.json())
      .then(data => { setSnapshots(data.snapshots); setStats(data.stats) })
      .finally(() => setLoading(false))
  }, [])

  const triggerRecalc = async () => {
    setTriggering(true)
    const res = await fetch('/api/iq/admin/norming', { method: 'POST' })
    if (res.ok) {
      setMsg('Norming recalculation job queued successfully. Results will appear when the worker completes.')
    } else {
      setMsg('Failed to queue job. Check worker logs.')
    }
    setTriggering(false)
    setTimeout(() => setMsg(''), 8000)
  }

  if (loading) return <div className="p-8 text-center text-[#555]">Loading norming data…</div>

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Completed sessions', value: stats.totalCompleted },
            { label: 'Valid sessions',     value: stats.totalValid },
            { label: 'Validity rate',      value: `${stats.validityRate}%` },
            { label: 'Mean IQ (valid)',    value: stats.avgIq ?? 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-4 text-center">
              <div className="text-2xl font-semibold text-[#a21caf] dark:text-[#e879f9]">{value}</div>
              <div className="text-[11px] text-[#555] dark:text-[#aaa] mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Norming thresholds */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-5">
        <h3 className="text-sm font-semibold mb-3">Next recalculation thresholds</h3>
        {[500, 2000, 5000, 10000].map(threshold => (
          <div key={threshold} className="flex items-center gap-3 py-2 border-b border-black/5 dark:border-white/5 last:border-0">
            <div className="flex-1 text-[13px]">{threshold.toLocaleString()} valid sessions</div>
            {stats && stats.totalValid >= threshold
              ? <span className="text-[11px] text-[#059669] font-medium">✓ Reached</span>
              : <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1 h-1.5 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full bg-[#a21caf] rounded-full"
                      style={{ width: `${Math.min(100, ((stats?.totalValid ?? 0) / threshold) * 100)}%` }} />
                  </div>
                  <span className="text-[11px] text-[#555] dark:text-[#aaa] w-16 text-right">
                    {stats ? `${((stats.totalValid / threshold) * 100).toFixed(0)}%` : '—'}
                  </span>
                </div>}
          </div>
        ))}
      </div>

      {/* Active norming snapshots */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 overflow-hidden">
        <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Active norming snapshots</h3>
          {snapshots.length > 0 && (
            <span className="text-[11px] text-[#555] dark:text-[#aaa]">
              Version: <code className="font-mono">{snapshots[0].version}</code>
            </span>
          )}
        </div>
        {snapshots.length === 0 ? (
          <p className="p-5 text-[13px] text-[#555]">
            No active norming snapshots. Initial simulated norms are used until real data is available.
          </p>
        ) : (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                {['Age Group', 'Sample Size', 'Mean Raw', 'Std Dev', 'Created'].map(h => (
                  <th key={h} className="text-left p-3 text-[11px] uppercase tracking-wide text-[#555] dark:text-[#aaa] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshots.map(s => (
                <tr key={s.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="p-3 font-medium">{AGE_LABELS[s.ageGroup] ?? s.ageGroup}</td>
                  <td className="p-3">{s.sampleSize.toLocaleString()}</td>
                  <td className="p-3 font-mono">{s.meanRaw.toFixed(4)}</td>
                  <td className="p-3 font-mono">{s.stdDevRaw.toFixed(4)}</td>
                  <td className="p-3 text-[#555] dark:text-[#aaa]">
                    {new Date(s.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Manual trigger */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-5">
        <h3 className="text-sm font-semibold mb-2">Manual recalculation</h3>
        <p className="text-[12px] text-[#555] dark:text-[#aaa] mb-4">
          Triggers the norming recalculate BullMQ job. Only runs if ≥50 valid sessions exist.
          The job archives the current snapshot and creates a new one versioned by session count.
        </p>
        {msg && (
          <div className="mb-3 text-[12px] text-[#059669] bg-[#d1fae5] rounded-lg px-3 py-2">{msg}</div>
        )}
        <button onClick={triggerRecalc} disabled={triggering}
          className="bg-[#a21caf] hover:bg-[#86198f] disabled:opacity-50 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors">
          {triggering ? 'Queuing…' : 'Trigger recalculation'}
        </button>
      </div>
    </div>
  )
}
