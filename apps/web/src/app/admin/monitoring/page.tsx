'use client'

import { useEffect, useState, useCallback } from 'react'

interface MonitorData {
  db: {
    latencyMs: number
    tableStats: { name: string; rows: number }[]
  }
  queues: { pdfPending: number; sessionsPending: number; completedToday: number }
  uptime: { name: string; url: string; status: string; latencyMs: number | null; uptimePct: number | null }[]
  sentry: { connected: boolean; issuesUrl: string }
}

const STATUS_DOT = (s: string) =>
  s === 'up' ? 'bg-[#6fcf97]' : s === 'down' ? 'bg-[#f87171]' : 'bg-[#fbbf24]'
const STATUS_LABEL = (s: string) =>
  s === 'up' ? 'text-[#6fcf97]' : s === 'down' ? 'text-[#f87171]' : 'text-[#fbbf24]'

function Stat({ label, value, sub, warn }: { label: string; value: string | number; sub?: string; warn?: boolean }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
      <div className="text-[10px] text-[#555] uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${warn ? 'text-[#fbbf24]' : 'text-white'}`}>{value}</div>
      {sub && <div className="text-[10px] text-[#555] mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminMonitoringPage() {
  const [data, setData] = useState<MonitorData | null>(null)
  const [_loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/monitoring')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load(); const id = setInterval(load, 30_000); return () => clearInterval(id) }, [load])

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Monitoring</h1>
        <span className="text-[11px] text-[#555]">Auto-refreshes every 30s</span>
      </div>

      {/* DB health */}
      <div>
        <h2 className="text-[13px] font-medium text-[#888] mb-3 uppercase tracking-wide">Database</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Stat label="DB Latency" value={`${data?.db?.latencyMs ?? '—'}ms`} warn={(data?.db?.latencyMs ?? 0) > 100} sub="PostgreSQL round-trip" />
          <Stat label="Tables" value={data?.db?.tableStats?.length ?? '—'} sub="user tables" />
          <Stat label="Largest Table" value={data?.db?.tableStats?.[0]?.name ?? '—'} sub={`${(data?.db?.tableStats?.[0]?.rows ?? 0).toLocaleString()} rows`} />
          <Stat label="DB Status" value={data?.db?.latencyMs ? 'Connected' : '—'} />
        </div>

        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/6 text-[13px] font-medium">Table Row Counts</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-white/5">
              <th className="text-left px-4 py-2 text-[10px] uppercase text-[#444]">Table</th>
              <th className="text-left px-4 py-2 text-[10px] uppercase text-[#444]">Rows (estimate)</th>
            </tr></thead>
            <tbody>
              {(data?.db?.tableStats ?? []).map(t => (
                <tr key={t.name} className="border-b border-white/4 hover:bg-white/2">
                  <td className="px-4 py-2.5 font-mono text-[#aaa]">{t.name}</td>
                  <td className="px-4 py-2.5 tabular-nums">{t.rows.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BullMQ queues */}
      <div>
        <h2 className="text-[13px] font-medium text-[#888] mb-3 uppercase tracking-wide">BullMQ Queues</h2>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="PDF Reports Pending"   value={data?.queues?.pdfPending ?? '—'}       warn={(data?.queues?.pdfPending ?? 0) > 5} sub="iq-pdf-generate" />
          <Stat label="Active IQ Sessions"    value={data?.queues?.sessionsPending ?? '—'}  sub="ACTIVE status" />
          <Stat label="Completed Today"       value={data?.queues?.completedToday ?? '—'}   sub="IQ sessions" />
        </div>
      </div>

      {/* Uptime */}
      <div>
        <h2 className="text-[13px] font-medium text-[#888] mb-3 uppercase tracking-wide">Uptime</h2>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          {(data?.uptime ?? []).map((u, i) => (
            <div key={u.name} className={`flex items-center justify-between px-4 py-3 ${i < (data?.uptime ?? []).length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT(u.status)}`} />
                <div>
                  <div className="text-[13px] font-medium">{u.name}</div>
                  <div className="text-[10px] text-[#555] font-mono">{u.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[12px]">
                {u.latencyMs && <span className="text-[#888]">{u.latencyMs}ms</span>}
                {u.uptimePct && <span className="text-[#6fcf97]">{u.uptimePct}% uptime</span>}
                <span className={`font-medium ${STATUS_LABEL(u.status)}`}>{u.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentry */}
      <div>
        <h2 className="text-[13px] font-medium text-[#888] mb-3 uppercase tracking-wide">Error Tracking (Sentry)</h2>
        <div className={`bg-[#1a1a1a] border rounded-xl p-5 ${data?.sentry?.connected ? 'border-[#1a6b3c]/30' : 'border-[#fbbf24]/30'}`}>
          {data?.sentry?.connected ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#6fcf97]">✓ Sentry connected</div>
                <p className="text-[12px] text-[#888] mt-1">Error tracking active. View issues directly in Sentry.</p>
              </div>
              <a href={data.sentry.issuesUrl} target="_blank" rel="noopener noreferrer"
                className="text-[12px] border border-white/10 hover:border-[#1a6b3c] rounded-lg px-4 py-2 text-[#aaa] hover:text-white transition-colors">
                Open Sentry ↗
              </a>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium text-[#fbbf24]">⚠ Sentry not configured</div>
              <p className="text-[12px] text-[#888] mt-1">Add <code className="font-mono text-[#aaa]">SENTRY_DSN</code> to your environment variables to enable error tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
