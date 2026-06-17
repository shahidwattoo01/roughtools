'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

interface AnalyticsData {
  summary: {
    totalPageviews: number; totalSessions: number; totalUsers: number
    avgBounceRate: number; avgSessionDuration: number; pagesPerSession: number
    ga4Connected: boolean
  }
  charts: { pageviews: { date: string; value: number }[]; sessions: { date: string; value: number }[]; users: { date: string; value: number }[] }
  topTools: { name: string; slug: string; category: string; pageviews: number; change: number; avgDuration: number }[]
  channels: { channel: string; sessions: number; bounce: number; avgDuration: number }[]
  countries: { country: string; sessions: number }[]
  queries:   { query: string; impressions: number; clicks: number; ctr: number; position: number }[]
  devices:   { device: string; pct: number }[]
}

const PRESET_DAYS = [{ label: '7D', days: 7 }, { label: '30D', days: 30 }, { label: '90D', days: 90 }, { label: '1Y', days: 365 }]
const TT = { contentStyle: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 11 } }
const PIE_COLORS = ['#1a6b3c', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#0891b2']
const fmt = (n: number) => n >= 1_000_000 ? `${(n/1e6).toFixed(1)}M` : n >= 1_000 ? `${(n/1e3).toFixed(1)}K` : String(n)

function Num({ n, label, sub }: { n: string | number; label: string; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-semibold text-[#111]">{n}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [days, setDays] = useState(30)
  const [metric, setMetric] = useState<'pageviews' | 'sessions' | 'users'>('pageviews')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/analytics?days=${days}`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [days])

  useEffect(() => { load() }, [load])

  const d = data
  const chartData = d?.charts[metric] ?? []

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          {d?.summary?.ga4Connected === false && (
            <p className="text-[11px] text-[#fbbf24] mt-0.5">⚠ Estimated data — connect GA4 in Settings for live data</p>
          )}
        </div>
        <div className="flex gap-1">
          {PRESET_DAYS.map(p => (
            <button key={p.days} onClick={() => setDays(p.days)}
              className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${days === p.days ? 'bg-[#1a6b3c] text-white' : 'border border-gray-200 text-gray-500 hover:text-[#111] bg-white shadow-sm'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <Num n={fmt(d?.summary?.totalPageviews ?? 0)} label="Pageviews" />
        <Num n={fmt(d?.summary?.totalSessions ?? 0)} label="Sessions" />
        <Num n={fmt(d?.summary?.totalUsers ?? 0)} label="Users" />
        <Num n={`${d?.summary?.avgBounceRate ?? 0}%`} label="Bounce Rate" />
        <Num n={`${d?.summary?.avgSessionDuration ?? 0}s`} label="Avg Duration" />
        <Num n={d?.summary?.pagesPerSession ?? 0} label="Pages/Session" />
      </div>

      {/* Main area chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-medium capitalize text-[#111]">{metric} — last {days} days</span>
          <div className="flex gap-1">
            {(['pageviews','sessions','users'] as const).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded text-[11px] capitalize transition-colors ${metric === m ? 'bg-[#1a6b3c] text-white' : 'text-gray-400 hover:text-[#111]'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        {loading ? <div className="h-[200px] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#1a6b3c] border-t-transparent rounded-full animate-spin" /></div> : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a6b3c" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a6b3c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#999' }} tickFormatter={v => v.slice(5)} interval={Math.floor(chartData.length / 8)} />
              <YAxis tick={{ fontSize: 9, fill: '#999' }} width={40} tickFormatter={fmt} />
              <Tooltip {...TT} formatter={(v: number) => [fmt(v), metric]} />
              <Area type="monotone" dataKey="value" stroke="#1a6b3c" fill="url(#ag)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sources + Devices */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 text-[13px] font-medium text-[#111]">Traffic Sources</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50">{['Channel','Sessions','Bounce','Duration'].map(h=><th key={h} className="text-left px-4 py-2 text-[10px] uppercase tracking-wide text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {(d?.channels ?? []).map((c, i) => (
                <tr key={c.channel} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 flex items-center gap-2 text-[#111]">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {c.channel}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-[#111]">{c.sessions.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-gray-600">{c.bounce}%</td>
                  <td className="px-4 py-2.5 text-gray-400">{c.avgDuration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-[13px] font-medium mb-3 text-[#111]">Devices</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={d?.devices ?? []} dataKey="pct" nameKey="device" cx="50%" cy="50%" outerRadius={58}>
              {(d?.devices ?? []).map((entry, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie><Tooltip {...TT} formatter={(v, name) => [`${v}%`, name]} /></PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1">
            {(d?.countries ?? []).slice(0, 5).map(c => (
              <div key={c.country} className="flex justify-between text-[11px]">
                <span className="text-gray-400">{c.country}</span>
                <span className="tabular-nums text-[#111]">{c.sessions.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top tools */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 text-[13px] font-medium text-[#111]">Top Tools — {days}D</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50">{['#','Tool','Category','Pageviews','Δ','Duration'].map(h=><th key={h} className="text-left px-4 py-2 text-[10px] uppercase tracking-wide text-gray-400 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {(d?.topTools ?? []).map((t, i) => (
              <tr key={t.slug} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-gray-400 w-8">{i+1}</td>
                <td className="px-4 py-2.5 font-medium text-[#111]">{t.name}</td>
                <td className="px-4 py-2.5 text-gray-400">{t.category}</td>
                <td className="px-4 py-2.5 tabular-nums text-[#111]">{t.pageviews.toLocaleString()}</td>
                <td className="px-4 py-2.5"><span className={t.change >= 0 ? 'text-green-600' : 'text-red-500'}>{t.change >= 0 ? '▲' : '▼'}{Math.abs(t.change)}%</span></td>
                <td className="px-4 py-2.5 text-gray-400">{t.avgDuration}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search queries */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
          <span className="text-[13px] font-medium text-[#111]">Top Search Queries</span>
          <span className="text-[10px] text-gray-400">Search Console · estimated</span>
        </div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50">{['Query','Impressions','Clicks','CTR','Position'].map(h=><th key={h} className="text-left px-4 py-2 text-[10px] uppercase tracking-wide text-gray-400 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {(d?.queries ?? []).map(q => (
              <tr key={q.query} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2.5 text-[#111]">{q.query}</td>
                <td className="px-4 py-2.5 tabular-nums text-[#111]">{q.impressions.toLocaleString()}</td>
                <td className="px-4 py-2.5 tabular-nums text-[#111]">{q.clicks.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-gray-600">{q.ctr}%</td>
                <td className="px-4 py-2.5 tabular-nums">
                  <span className={q.position <= 3 ? 'text-green-600' : q.position <= 10 ? 'text-yellow-500' : 'text-gray-400'}>
                    {q.position.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
