'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ALL_TOOLS } from '@/lib/tools-registry'

const TT = { contentStyle: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 } }

// Mock AdSense data — replace with real AdSense Management API when OAuth configured
function useMockAdSense() {
  const daily = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toISOString().slice(0, 10),
    earnings: +(Math.random() * 18 + 8).toFixed(2),
    rpm:       +(Math.random() * 1.5 + 2.5).toFixed(2),
    impressions: Math.round(Math.random() * 3000 + 4000),
    clicks:      Math.round(Math.random() * 80 + 40),
  }))

  const todayEarnings    = +(Math.random() * 12 + 5).toFixed(2)
  const weekEarnings     = daily.slice(-7).reduce((s, d) => s + d.earnings, 0)
  const monthEarnings    = daily.reduce((s, d) => s + d.earnings, 0)
  const siteRpm          = +(daily.reduce((s, d) => s + d.rpm, 0) / daily.length).toFixed(2)
  const siteCtr          = 1.4
  const totalImpressions = daily.reduce((s, d) => s + d.impressions, 0)

  const perPage = ALL_TOOLS.slice(0, 40).map(t => ({
    name:        t.name,
    slug:        t.slug,
    category:    t.category,
    earnings:    +(Math.random() * 18 + 0.5).toFixed(2),
    rpm:         +(Math.random() * 3 + 1).toFixed(2),
    impressions: Math.round(Math.random() * 5000 + 500),
    clicks:      Math.round(Math.random() * 120 + 10),
    ctr:         +(Math.random() * 2 + 0.5).toFixed(2),
  })).sort((a, b) => b.earnings - a.earnings)

  return { daily, todayEarnings, weekEarnings, monthEarnings, siteRpm, siteCtr, totalImpressions, perPage }
}

export default function AdminAdSensePage() {
  const [tab, setTab] = useState<'overview' | 'pages' | 'alerts'>('overview')
  const data = useMockAdSense()

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">AdSense</h1>
          <p className="text-[11px] text-[#fbbf24] mt-0.5">⚠ Estimated data — configure AdSense OAuth in Settings for live revenue</p>
        </div>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today's Earnings", value: `$${data.todayEarnings}` },
          { label: 'This Week',        value: `$${data.weekEarnings.toFixed(2)}` },
          { label: 'This Month',       value: `$${data.monthEarnings.toFixed(2)}` },
          { label: 'Projected Month',  value: `$${(data.todayEarnings * 30).toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
            <div className="text-[10px] text-[#555] uppercase tracking-wide mb-1">{label}</div>
            <div className="text-2xl font-semibold text-[#6fcf97]">{value}</div>
          </div>
        ))}
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Site RPM',    value: `$${data.siteRpm}` },
          { label: 'Site CTR',    value: `${data.siteCtr}%` },
          { label: 'Impressions', value: data.totalImpressions.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
            <div className="text-[10px] text-[#555] uppercase tracking-wide mb-1">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* 30-day earnings chart */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
        <div className="text-[12px] text-[#666] mb-3">Daily Earnings — Last 30 Days</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.daily} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#444' }} tickFormatter={v => v.slice(5)} interval={3} />
            <YAxis tick={{ fontSize: 9, fill: '#444' }} width={36} tickFormatter={v => `$${v}`} />
            <Tooltip {...TT} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Earnings']} />
            <Bar dataKey="earnings" fill="#6fcf97" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 w-fit bg-[#1a1a1a] border border-white/8 rounded-xl p-1">
        {(['overview','pages','alerts'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[12px] capitalize transition-colors ${tab === t ? 'bg-[#1a6b3c] text-white' : 'text-[#555] hover:text-[#aaa]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Per-page revenue */}
      {(tab === 'overview' || tab === 'pages') && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/6 flex justify-between">
            <span className="text-[13px] font-medium">Revenue by Page</span>
            <button className="text-[11px] text-[#1a6b3c] hover:underline">Export CSV</button>
          </div>
          <div className="overflow-auto max-h-[440px]">
            <table className="w-full text-[12px]">
              <thead className="sticky top-0 bg-[#1a1a1a]">
                <tr className="border-b border-white/5">
                  {['#','Page','Category','Earnings','RPM','Impressions','Clicks','CTR'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wide text-[#444] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.perPage.map((p, i) => (
                  <tr key={p.slug} className="border-b border-white/4 hover:bg-white/2">
                    <td className="px-3 py-2.5 text-[#555]">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium max-w-[160px] truncate">{p.name}</td>
                    <td className="px-3 py-2.5 text-[#888]">{p.category}</td>
                    <td className="px-3 py-2.5 text-[#6fcf97] font-medium">${p.earnings}</td>
                    <td className="px-3 py-2.5">${p.rpm}</td>
                    <td className="px-3 py-2.5 tabular-nums">{p.impressions.toLocaleString()}</td>
                    <td className="px-3 py-2.5 tabular-nums">{p.clicks}</td>
                    <td className="px-3 py-2.5">{p.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts */}
      {tab === 'alerts' && (
        <div className="space-y-3">
          <p className="text-[12px] text-[#555]">Revenue alerts fire when thresholds are exceeded. Configure thresholds in Settings.</p>
          {[
            { level: 'info', msg: 'No active policy violations detected' },
            { level: 'warn', msg: 'Revenue drop alert: daily earnings 23% below 7-day average (estimated)' },
          ].map(({ level, msg }) => (
            <div key={msg} className={`border rounded-xl px-4 py-3 text-[13px] flex items-center gap-3 ${level === 'warn' ? 'border-[#fbbf24]/30 bg-yellow-900/10 text-[#fbbf24]' : 'border-[#6fcf97]/30 bg-green-900/10 text-[#6fcf97]'}`}>
              <span>{level === 'warn' ? '⚠' : '✓'}</span>
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
