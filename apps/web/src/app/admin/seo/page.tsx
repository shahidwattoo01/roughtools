'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface SeoTool {
  slug: string; name: string; category: string; score: number
  titleLen: number; descLen: number; hasOg: boolean
  hasStructured: boolean; isIndexed: boolean; titleOk: boolean; descOk: boolean
  issues: string[]
}
interface SeoData {
  buckets: { red: number; yellow: number; green: number }
  avgScore: number
  worstTools: SeoTool[]
  allTools: SeoTool[]
  duplicates: { key: string; slugs: string[] }[]
}

type TabId = 'audit' | 'worst' | 'duplicates' | 'sitemap'

const SCORE_COLOR = (s: number) => s >= 80 ? '#6fcf97' : s >= 50 ? '#fbbf24' : '#f87171'
const TT = { contentStyle: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 } }

export default function AdminSeoPage() {
  const [data, setData] = useState<SeoData | null>(null)
  const [tab, setTab] = useState<TabId>('audit')
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/admin/seo').then(r => r.json()).then(setData)
  }, [])

  const filtered = (data?.allTools ?? []).filter(t =>
    !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.slug.includes(q.toLowerCase())
  )

  const scoreDistribution = [
    { range: '0–20',   count: (data?.allTools ?? []).filter(t => t.score <= 20).length,  fill: '#f87171' },
    { range: '21–40',  count: (data?.allTools ?? []).filter(t => t.score > 20 && t.score <= 40).length, fill: '#f87171' },
    { range: '41–60',  count: (data?.allTools ?? []).filter(t => t.score > 40 && t.score <= 60).length, fill: '#fbbf24' },
    { range: '61–80',  count: (data?.allTools ?? []).filter(t => t.score > 60 && t.score <= 80).length, fill: '#fbbf24' },
    { range: '81–100', count: (data?.allTools ?? []).filter(t => t.score > 80).length,    fill: '#6fcf97' },
  ]

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">SEO Health</h1>
        <div className="flex items-center gap-4 text-[13px]">
          <span className="text-[#6fcf97]">● {data?.buckets.green ?? 0} good</span>
          <span className="text-[#fbbf24]">● {data?.buckets.yellow ?? 0} ok</span>
          <span className="text-[#f87171]">● {data?.buckets.red ?? 0} poor</span>
          <span className="text-[#aaa] ml-2">Avg: <strong className="text-white">{data?.avgScore ?? 0}/100</strong></span>
        </div>
      </div>

      {/* Score distribution */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
          <div className="text-[12px] text-[#666] mb-3">Score Distribution</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={scoreDistribution} barSize={24}>
              <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#444' }} />
              <YAxis tick={{ fontSize: 9, fill: '#444' }} width={28} />
              <Tooltip {...TT} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {scoreDistribution.map((s, i) => <Cell key={i} fill={s.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary cards */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          {[
            { label: 'Missing Structured Data', count: (data?.allTools ?? []).filter(t => !t.hasStructured).length, color: '#f87171' },
            { label: 'Description Out of Range', count: (data?.allTools ?? []).filter(t => !t.descOk).length, color: '#fbbf24' },
            { label: 'Title Out of Range',       count: (data?.allTools ?? []).filter(t => !t.titleOk).length, color: '#fbbf24' },
            { label: 'Not Indexed',              count: (data?.allTools ?? []).filter(t => !t.isIndexed).length, color: '#f87171' },
            { label: 'Duplicate Title Prefix',   count: data?.duplicates.length ?? 0, color: '#f97316' },
            { label: 'Score 80+',                count: data?.buckets.green ?? 0, color: '#6fcf97' },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-3">
              <div className="text-xl font-semibold" style={{ color }}>{count}</div>
              <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-1 w-fit">
        {([['audit','Full Audit'], ['worst','Worst 20'], ['duplicates','Duplicates'], ['sitemap','Sitemap']] as [TabId, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${tab === id ? 'bg-[#1a6b3c] text-white' : 'text-[#555] hover:text-[#aaa]'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Audit table */}
      {tab === 'audit' && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/6 flex items-center gap-3">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tools…"
              className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-white placeholder-[#444] focus:outline-none focus:border-[#1a6b3c] flex-1 max-w-[300px]" />
            <span className="text-[11px] text-[#555]">{filtered.length} tools</span>
          </div>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-[12px]">
              <thead className="sticky top-0 bg-[#1a1a1a]">
                <tr className="border-b border-white/6">
                  {['Tool','Score','Title len','Desc len','OG','Structured','Indexed','Issues'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[10px] uppercase tracking-wide text-[#444] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.slug} className="border-b border-white/4 hover:bg-white/2">
                    <td className="px-3 py-2 font-medium max-w-[180px] truncate">{t.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${t.score}%`, background: SCORE_COLOR(t.score) }} />
                        </div>
                        <span style={{ color: SCORE_COLOR(t.score) }}>{t.score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2"><span className={t.titleOk ? 'text-[#6fcf97]' : 'text-[#f87171]'}>{t.titleLen}</span></td>
                    <td className="px-3 py-2"><span className={t.descOk ? 'text-[#6fcf97]' : 'text-[#f87171]'}>{t.descLen}</span></td>
                    <td className="px-3 py-2 text-center">{t.hasOg ? '✓' : '✗'}</td>
                    <td className="px-3 py-2 text-center"><span className={t.hasStructured ? 'text-[#6fcf97]' : 'text-[#f87171]'}>{t.hasStructured ? '✓' : '✗'}</span></td>
                    <td className="px-3 py-2 text-center"><span className={t.isIndexed ? 'text-[#6fcf97]' : 'text-[#f87171]'}>{t.isIndexed ? '✓' : '✗'}</span></td>
                    <td className="px-3 py-2 text-[#888] max-w-[200px] truncate">{t.issues.join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Worst 20 */}
      {tab === 'worst' && (
        <div className="space-y-2">
          <p className="text-[12px] text-[#555]">20 tools with the lowest SEO scores — fix these first.</p>
          {(data?.worstTools ?? []).map((t, i) => (
            <div key={t.slug} className="bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 flex items-center gap-4">
              <span className="text-[#555] w-5 text-[12px]">{i + 1}</span>
              <span className="font-medium flex-1">{t.name}</span>
              <span className="text-[11px] text-[#888]">{t.category}</span>
              <div className="flex gap-1 flex-wrap">
                {t.issues.map(issue => (
                  <span key={issue} className="text-[10px] bg-red-900/20 text-[#f87171] px-2 py-0.5 rounded-full">{issue}</span>
                ))}
              </div>
              <span style={{ color: SCORE_COLOR(t.score) }} className="font-semibold w-8 text-right">{t.score}</span>
            </div>
          ))}
        </div>
      )}

      {/* Duplicates */}
      {tab === 'duplicates' && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/6 text-[13px] font-medium">
            Duplicate Title Prefixes — {data?.duplicates.length ?? 0} found
          </div>
          {(data?.duplicates ?? []).length === 0 ? (
            <div className="px-4 py-8 text-center text-[#555]">No duplicate titles detected ✓</div>
          ) : (
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-white/5"><th className="text-left px-4 py-2 text-[10px] uppercase tracking-wide text-[#444]">Common prefix</th><th className="text-left px-4 py-2 text-[10px] uppercase tracking-wide text-[#444]">Affected pages</th></tr></thead>
              <tbody>
                {(data?.duplicates ?? []).map(d => (
                  <tr key={d.key} className="border-b border-white/4">
                    <td className="px-4 py-2.5 font-mono text-[#888]">{d.key}…</td>
                    <td className="px-4 py-2.5">{d.slugs.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Sitemap */}
      {tab === 'sitemap' && (
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Sitemap Manager</h3>
            <p className="text-[12px] text-[#888] mb-4">Your sitemap is auto-generated at <code className="font-mono text-[#aaa]">/sitemap.xml</code> by Next.js. It includes all {data?.allTools.length ?? 0}+ tool pages.</p>
            <div className="flex gap-3">
              <a href="/sitemap.xml" target="_blank"
                className="text-[12px] border border-white/10 rounded-lg px-4 py-2 text-[#aaa] hover:text-white hover:border-[#1a6b3c] transition-colors">
                View sitemap.xml ↗
              </a>
              <button className="text-[12px] bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-4 py-2 transition-colors">
                Ping Google
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
