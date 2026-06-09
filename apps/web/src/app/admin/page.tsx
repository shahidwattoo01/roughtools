'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashData {
  vitals: {
    iqSessionsToday: number
    iqSessionsYesterday: number
    iqSessionsChange: number | null
    iqCompletedTotal: number
    iqValidTotal: number
    iqAvgScore: number | null
    totalUsers: number
    usersToday: number
    dbLatencyMs: number
  }
  thirtyDayChart: { date: string; sessions: number }[]
  recentSessions: {
    id: string
    iqScore: number | null
    percentile: number | null
    isValid: boolean
    ageGroup: string
    completedAt: string | null
  }[]
}

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({
  label, value, sub, delta, color = '#1a6b3c',
}: {
  label: string; value: string | number; sub?: string; delta?: number | null; color?: string
}) {
  return (
    <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
      <div className="text-[11px] text-[#555] uppercase tracking-wide mb-2">{label}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {sub && <div className="text-[11px] text-[#666] mt-0.5">{sub}</div>}
      {delta !== undefined && delta !== null && (
        <div className={`text-[11px] mt-1 font-medium ${delta >= 0 ? 'text-[#6fcf97]' : 'text-[#f87171]'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs yesterday
        </div>
      )}
    </div>
  )
}

// ─── Alert banner ─────────────────────────────────────────────────────────────

function AlertItem({ level, msg, action }: { level: 'warn' | 'error' | 'info'; msg: string; action?: string }) {
  const colors = {
    error: 'border-l-[#f87171] bg-red-900/10',
    warn:  'border-l-[#fbbf24] bg-yellow-900/10',
    info:  'border-l-[#60a5fa] bg-blue-900/10',
  }
  return (
    <div className={`border-l-2 ${colors[level]} px-4 py-2.5 flex items-center justify-between`}>
      <span className="text-[13px] text-[#ccc]">{msg}</span>
      {action && <span className="text-[11px] text-[#1a6b3c] cursor-pointer hover:underline">{action}</span>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [load])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1a6b3c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const v = data?.vitals

  return (
    <div className="p-6 max-w-[1400px] space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Command Center</h1>
          <p className="text-[12px] text-[#555] mt-0.5">
            Auto-refreshes every 60s · Last: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Add Tool', href: '/admin/tools/new' },
            { label: 'Bulk SEO', href: '/admin/content' },
            { label: 'Clear Cache', href: '#', onClick: () => alert('Cache cleared') },
          ].map(({ label, href, onClick }) => (
            <Link key={label} href={href as any}
              onClick={onClick ? (e) => { e.preventDefault(); onClick() } : undefined}
              className="text-[12px] border border-white/10 hover:border-[#1a6b3c] rounded-lg px-3 py-1.5 text-[#aaa] hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Row 1 — Vital metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="IQ Tests Today"    value={v?.iqSessionsToday ?? '—'}    delta={v?.iqSessionsChange} />
        <MetricCard label="Completed Total"   value={v?.iqCompletedTotal ?? '—'}   sub="all time" />
        <MetricCard label="Valid Sessions"    value={v?.iqValidTotal ?? '—'}        sub="all time" />
        <MetricCard label="Avg IQ Score"      value={v?.iqAvgScore ?? '—'}          sub="valid sessions" />
        <MetricCard label="Total Users"       value={v?.totalUsers ?? '—'}          sub={`+${v?.usersToday ?? 0} today`} />
        <MetricCard
          label="DB Latency"
          value={`${v?.dbLatencyMs ?? '—'}ms`}
          color={v?.dbLatencyMs && v.dbLatencyMs < 50 ? '#1a6b3c' : '#fbbf24'}
          sub={v?.dbLatencyMs && v.dbLatencyMs < 50 ? 'Healthy' : 'Slow'}
        />
      </div>

      {/* Row 2 — Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* 30-day sessions */}
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
          <div className="text-[12px] text-[#666] mb-3">IQ Test Sessions — Last 30 Days</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data?.thirtyDayChart ?? []} barSize={6}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#444' }}
                tickFormatter={v => v.slice(5)} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#444' }} width={28} />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }}
                labelFormatter={v => String(v)}
              />
              <Bar dataKey="sessions" fill="#1a6b3c" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sessions trend line */}
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
          <div className="text-[12px] text-[#666] mb-3">7-Day Session Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={(data?.thirtyDayChart ?? []).slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#444' }}
                tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 9, fill: '#444' }} width={28} />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }}
              />
              <Line type="monotone" dataKey="sessions" stroke="#6fcf97" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 — Recent completions */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
          <span className="text-[13px] font-medium">Recent IQ Completions</span>
          <Link href="/admin/iq" className="text-[11px] text-[#1a6b3c] hover:underline">View all →</Link>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-white/5">
              {['Session', 'IQ Score', 'Percentile', 'Age Group', 'Valid', 'Completed'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-[#444] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.recentSessions ?? []).map(s => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-4 py-2.5 font-mono text-[10px] text-[#555]">{s.id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-2.5 font-semibold text-[#6fcf97]">{s.iqScore ?? '—'}</td>
                <td className="px-4 py-2.5">{s.percentile != null ? `${s.percentile}th` : '—'}</td>
                <td className="px-4 py-2.5 text-[#888]">{s.ageGroup.replace('AGE_', '').replace('_', '–')}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[10px] font-medium ${s.isValid ? 'text-[#6fcf97]' : 'text-[#f87171]'}`}>
                    {s.isValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[#555]">
                  {s.completedAt ? new Date(s.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
              </tr>
            ))}
            {!data?.recentSessions?.length && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[#444]">No completed sessions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Row 4 — Alert center */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/6">
          <span className="text-[13px] font-medium">Alert Center</span>
        </div>
        <div className="divide-y divide-white/5">
          {v?.dbLatencyMs && v.dbLatencyMs > 100 ? (
            <AlertItem level="warn" msg={`DB latency is ${v.dbLatencyMs}ms — above normal threshold`} action="Investigate" />
          ) : (
            <AlertItem level="info" msg="All systems operational" />
          )}
          <AlertItem level="info" msg={`GA4 and AdSense integrations not configured — add OAuth credentials in Settings`} action="Configure →" />
        </div>
      </div>

      {/* Row 5 — Quick actions */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: '+ New Tool',          href: '/admin/tools/new' },
          { label: 'Bulk Meta Tags',      href: '/admin/content' },
          { label: 'Export Analytics',    href: '/admin/analytics' },
          { label: 'Regen Sitemap',       href: '/admin/seo/sitemap' },
          { label: 'Clear Redis Cache',   href: '/admin/database' },
          { label: 'View Error Log',      href: '/admin/monitoring' },
        ].map(({ label, href }) => (
          <Link key={label} href={href as any}
            className="bg-[#1a1a1a] border border-white/8 hover:border-[#1a6b3c] rounded-xl px-4 py-3 text-[12px] text-[#aaa] hover:text-white transition-colors text-center">
            {label}
          </Link>
        ))}
      </div>

    </div>
  )
}
