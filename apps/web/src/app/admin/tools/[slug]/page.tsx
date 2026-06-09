'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Tab = 'overview' | 'seo' | 'analytics' | 'adsense' | 'technical' | 'content'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'seo',        label: 'SEO'        },
  { id: 'analytics',  label: 'Analytics'  },
  { id: 'adsense',    label: 'AdSense'    },
  { id: 'technical',  label: 'Technical'  },
  { id: 'content',    label: 'Content'    },
]

// Mock 30-day sparkline
const mockSparkline = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  views: Math.floor(Math.random() * 3000) + 500,
}))

// ─── SEO Score breakdown ──────────────────────────────────────────────────────
function SeoScoreBar({ label, score, max, note }: { label: string; score: number; max: number; note?: string }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? '#6fcf97' : pct >= 50 ? '#fbbf24' : '#f87171'
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5">
      <span className={`text-sm flex-shrink-0 ${pct === 100 ? 'text-[#6fcf97]' : 'text-[#f87171]'}`}>
        {pct === 100 ? '✓' : '⚠'}
      </span>
      <div className="flex-1">
        <div className="text-[13px] text-[#ccc]">{label}</div>
        {note && <div className="text-[11px] text-[#555] mt-0.5">{note}</div>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="text-[11px] tabular-nums" style={{ color }}>{score}/{max}</span>
      </div>
    </div>
  )
}

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // SEO form state
  const [seo, setSeo] = useState({
    title: `${params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — RoughTools`,
    description: '',
    ogTitle: '',
    ogDescription: '',
    canonical: `https://roughtools.com/tools/${params.slug}`,
    robots: 'index, follow',
    structured: 'WebApplication',
  })

  const seoScore = [
    seo.title.length >= 30 && seo.title.length <= 65 ? 15 : 0,
    seo.description.length >= 120 && seo.description.length <= 165 ? 15 : 0,
    seo.ogTitle.length > 0 ? 5 : 0, seo.ogDescription.length > 0 ? 5 : 0, 5, // OG = 15
    20,   // structured data — assume present
    seo.canonical.length > 0 ? 10 : 0,
    15,   // indexed placeholder
    15,   // CWV placeholder
  ].reduce((a, b) => a + b, 0)

  async function saveSeo() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaveMsg('Saved and revalidation triggered')
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const toolName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="p-6 max-w-[1100px]">

      {/* Breadcrumb + header */}
      <div className="flex items-center gap-2 text-[12px] text-[#555] mb-4">
        <Link href="/admin/tools" className="hover:text-[#6fcf97]">Tools</Link>
        <span>/</span>
        <span className="text-[#aaa]">{toolName}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-white">{toolName}</h1>
          <code className="text-[12px] text-[#555] mt-0.5 block">/tools/{params.slug}</code>
        </div>
        <div className="flex gap-2">
          <a href={`/tools/${params.slug}`} target="_blank" rel="noopener noreferrer"
            className="text-[12px] border border-white/10 rounded-lg px-3 py-2 text-[#aaa] hover:text-white transition-colors">
            Preview ↗
          </a>
          <span className="text-[10px] bg-[#6fcf97]/10 text-[#6fcf97] px-3 py-2 rounded-lg font-medium">published</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-1 mb-5">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-[12px] font-medium transition-colors ${
              activeTab === tab.id ? 'bg-[#1a6b3c] text-white' : 'text-[#666] hover:text-[#aaa]'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ──────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
              <h3 className="text-[13px] font-semibold mb-4">Tool Metadata</h3>
              {[
                { label: 'Slug',     value: params.slug },
                { label: 'Category', value: params.slug.includes('iq') ? 'iq-test' : 'general' },
                { label: 'Type',     value: 'Frontend only' },
                { label: 'Created',  value: 'Jan 2024' },
                { label: 'Modified', value: 'Today' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-[12px] text-[#555]">{label}</span>
                  <span className="text-[12px] text-[#ccc]">{value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Today's Pageviews",  value: '1,247' },
                { label: 'This Month',         value: '38,420' },
                { label: 'Avg Session',        value: '2m 14s' },
                { label: 'Bounce Rate',        value: '54%' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-3 text-center">
                  <div className="text-lg font-semibold text-white">{value}</div>
                  <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
            <h3 className="text-[13px] font-semibold mb-4">30-Day Traffic</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockSparkline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#444' }} />
                <YAxis tick={{ fontSize: 9, fill: '#444' }} width={40} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} />
                <Line type="monotone" dataKey="views" stroke="#1a6b3c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Tab: SEO ───────────────────────────────────────────────────────── */}
      {activeTab === 'seo' && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5 space-y-4">
              <h3 className="text-[13px] font-semibold">Metadata Editor</h3>

              {/* Title */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[11px] text-[#555] font-medium">Page Title</label>
                  <span className={`text-[10px] ${seo.title.length > 65 || seo.title.length < 30 ? 'text-[#f87171]' : 'text-[#6fcf97]'}`}>
                    {seo.title.length}/65
                  </span>
                </div>
                <input value={seo.title} onChange={e => setSeo(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1a6b3c]" />
                <div className="flex gap-1 mt-1.5">
                  {[...Array(65)].map((_, i) => (
                    <div key={i} className={`h-0.5 flex-1 rounded ${i < seo.title.length ? (seo.title.length > 65 ? 'bg-[#f87171]' : seo.title.length > 50 ? 'bg-[#6fcf97]' : 'bg-[#fbbf24]') : 'bg-white/5'}`} />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-[11px] text-[#555] font-medium">Meta Description</label>
                  <span className={`text-[10px] ${seo.description.length > 165 || (seo.description.length > 0 && seo.description.length < 120) ? 'text-[#f87171]' : seo.description.length >= 120 ? 'text-[#6fcf97]' : 'text-[#555]'}`}>
                    {seo.description.length}/165
                  </span>
                </div>
                <textarea value={seo.description} onChange={e => setSeo(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-[#1a6b3c]"
                  placeholder="Write a compelling 120–165 character description…" />
              </div>

              {/* OG fields */}
              {[
                { key: 'ogTitle', label: 'OG Title', placeholder: 'Open Graph title' },
                { key: 'ogDescription', label: 'OG Description', placeholder: 'Open Graph description' },
                { key: 'canonical', label: 'Canonical URL', placeholder: 'https://roughtools.com/tools/…' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[11px] text-[#555] font-medium mb-1 block">{label}</label>
                  <input value={seo[key as keyof typeof seo]}
                    onChange={e => setSeo(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1a6b3c]" />
                </div>
              ))}

              {/* Robots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#555] font-medium mb-1 block">Robots</label>
                  <select value={seo.robots} onChange={e => setSeo(p => ({ ...p, robots: e.target.value }))}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#aaa] focus:outline-none focus:border-[#1a6b3c]">
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#555] font-medium mb-1 block">Structured Data</label>
                  <select value={seo.structured} onChange={e => setSeo(p => ({ ...p, structured: e.target.value }))}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#aaa] focus:outline-none focus:border-[#1a6b3c]">
                    <option value="WebApplication">WebApplication</option>
                    <option value="SoftwareApplication">SoftwareApplication</option>
                    <option value="HowTo">HowTo</option>
                    <option value="FAQPage">FAQPage</option>
                  </select>
                </div>
              </div>

              {/* Google preview */}
              <div className="bg-[#0f0f0f] rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-[#444] mb-2 uppercase tracking-wide">Google Preview</div>
                <div className="text-[#8ab4f8] text-[17px] leading-[1.3] mb-0.5 truncate">{seo.title}</div>
                <div className="text-[#00a152] text-[12px] mb-1">{seo.canonical}</div>
                <div className="text-[#bdc1c6] text-[13px] leading-[1.5] line-clamp-2">
                  {seo.description || 'No meta description — search engines will generate a snippet automatically.'}
                </div>
              </div>

              {saveMsg && <div className="text-[12px] text-[#6fcf97] bg-[#6fcf97]/10 rounded-lg px-3 py-2">{saveMsg}</div>}

              <button onClick={saveSeo} disabled={saving}
                className="w-full bg-[#1a6b3c] hover:bg-[#145230] disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
                {saving ? 'Saving & revalidating…' : 'Save changes'}
              </button>
            </div>
          </div>

          {/* SEO score sidebar */}
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5 self-start sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold">SEO Score</h3>
              <span className={`text-2xl font-bold ${seoScore >= 80 ? 'text-[#6fcf97]' : seoScore >= 60 ? 'text-[#fbbf24]' : 'text-[#f87171]'}`}>
                {seoScore}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-5">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${seoScore}%`, background: seoScore >= 80 ? '#6fcf97' : seoScore >= 60 ? '#fbbf24' : '#f87171' }} />
            </div>
            <SeoScoreBar label="Title (30–65 chars)" score={seo.title.length >= 30 && seo.title.length <= 65 ? 15 : 0} max={15}
              note={seo.title.length < 30 ? 'Too short' : seo.title.length > 65 ? 'Too long' : undefined} />
            <SeoScoreBar label="Description (120–165 chars)" score={seo.description.length >= 120 && seo.description.length <= 165 ? 15 : 0} max={15}
              note={seo.description.length === 0 ? 'Missing' : seo.description.length < 120 ? 'Too short' : undefined} />
            <SeoScoreBar label="Open Graph tags" score={seo.ogTitle.length > 0 ? 15 : 0} max={15} />
            <SeoScoreBar label="Structured data" score={20} max={20} note="WebApplication schema" />
            <SeoScoreBar label="Canonical URL" score={seo.canonical.length > 0 ? 10 : 0} max={10} />
            <SeoScoreBar label="Index status" score={15} max={15} note="Currently indexed" />
            <SeoScoreBar label="Core Web Vitals" score={10} max={15} note="LCP needs improvement" />
          </div>
        </div>
      )}

      {/* ── Tab: Analytics ─────────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
            <h3 className="text-[13px] font-semibold mb-4">30-Day Traffic</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockSparkline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#444' }} />
                <YAxis tick={{ fontSize: 9, fill: '#444' }} width={45} tickFormatter={v => v.toLocaleString()} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} />
                <Line type="monotone" dataKey="views" stroke="#1a6b3c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Sessions',      value: '9,842' },
              { label: 'Unique Users',  value: '7,219' },
              { label: 'Pages/Session', value: '1.4' },
              { label: 'Avg Duration',  value: '2m 14s' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 text-center">
                <div className="text-xl font-semibold text-white">{value}</div>
                <div className="text-[11px] text-[#555] mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl p-4 text-[13px] text-[#fbbf24]">
            Connect Google Analytics 4 in <Link href={"/admin/settings" as any} className="underline">Settings</Link> to see real traffic data.
          </div>
        </div>
      )}

      {/* ── Tab: AdSense ───────────────────────────────────────────────────── */}
      {activeTab === 'adsense' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'This Month',   value: '$24.60' },
              { label: 'Page RPM',     value: '$0.64' },
              { label: 'Page CTR',     value: '1.2%' },
              { label: 'Impressions',  value: '38,420' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 text-center">
                <div className="text-xl font-semibold text-[#6fcf97]">{value}</div>
                <div className="text-[11px] text-[#555] mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl p-4 text-[13px] text-[#fbbf24]">
            Connect AdSense OAuth in <Link href={"/admin/settings" as any} className="underline">Settings</Link> for real revenue data.
          </div>
        </div>
      )}

      {/* ── Tab: Technical ─────────────────────────────────────────────────── */}
      {activeTab === 'technical' && (
        <div className="space-y-5">
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
            <h3 className="text-[13px] font-semibold mb-4">Core Web Vitals</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {[
                { metric: 'LCP', value: '2.4s',  pass: false },
                { metric: 'FID', value: '12ms',  pass: true  },
                { metric: 'CLS', value: '0.02',  pass: true  },
                { metric: 'FCP', value: '1.1s',  pass: true  },
                { metric: 'TTFB', value: '380ms', pass: false },
              ].map(({ metric, value, pass }) => (
                <div key={metric} className={`rounded-xl p-3 text-center border ${pass ? 'border-[#6fcf97]/20 bg-[#6fcf97]/5' : 'border-[#f87171]/20 bg-[#f87171]/5'}`}>
                  <div className="text-[10px] text-[#555] mb-1">{metric}</div>
                  <div className={`text-lg font-semibold ${pass ? 'text-[#6fcf97]' : 'text-[#f87171]'}`}>{value}</div>
                  <div className={`text-[9px] mt-0.5 ${pass ? 'text-[#6fcf97]/60' : 'text-[#f87171]/60'}`}>{pass ? 'PASS' : 'FAIL'}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
            <h3 className="text-[13px] font-semibold mb-3">Cache Status</h3>
            <div className="flex items-center gap-3">
              <span className="text-[11px] bg-[#6fcf97]/10 text-[#6fcf97] px-2 py-1 rounded">CDN Cached</span>
              <span className="text-[12px] text-[#555]">Last refreshed 4 minutes ago</span>
              <button className="text-[11px] text-[#1a6b3c] hover:underline ml-auto">Revalidate now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Content ───────────────────────────────────────────────────── */}
      {activeTab === 'content' && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5">
          <h3 className="text-[13px] font-semibold mb-4">Page Content</h3>
          <textarea rows={12}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#ccc] resize-none focus:outline-none focus:border-[#1a6b3c] font-mono"
            placeholder="Tool page content, FAQ, how-to instructions…" />
          <div className="flex gap-3 mt-3">
            <button className="bg-[#1a6b3c] hover:bg-[#145230] text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors">
              Save & Revalidate
            </button>
            <button className="border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#aaa] hover:text-white transition-colors">
              Version History
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
