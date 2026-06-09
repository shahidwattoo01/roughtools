'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ALL_TOOLS } from '@/lib/tools-registry'

const CATEGORY_COLORS: Record<string, string> = {
  pdf: '#ef4444', calculators: '#3b82f6', developer: '#8b5cf6', text: '#f59e0b',
  converters: '#f97316', network: '#06b6d4', 'legal-tools': '#64748b',
  'real-estate': '#f59e0b', 'image-tools': '#ec4899', security: '#10b981',
  'document-tools': '#6366f1', business: '#a855f7', environment: '#84cc16',
  engineering: '#0ea5e9', medical: '#14b8a6', 'iq-test': '#a21caf',
}

export default function AdminCategoriesPage() {
  const categories = useMemo(() => {
    const map = new Map<string, { name: string; tools: typeof ALL_TOOLS }>()
    for (const t of ALL_TOOLS) {
      if (!map.has(t.category)) map.set(t.category, { name: t.category, tools: [] })
      map.get(t.category)!.tools.push(t)
    }
    return [...map.entries()].map(([slug, { tools }]) => ({
      slug,
      toolCount: tools.length,
      featuredCount: tools.filter(t => t.featured).length,
      popularCount: tools.filter(t => t.popular).length,
      newCount: tools.filter(t => t.isNew).length,
      avgPriority: +(tools.reduce((s, t) => s + (t.priority ?? 0.7), 0) / tools.length).toFixed(2),
      color: CATEGORY_COLORS[slug] ?? '#888',
    })).sort((a, b) => b.toolCount - a.toolCount)
  }, [])

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-[12px] text-[#555] mt-0.5">{categories.length} categories · {ALL_TOOLS.length} tools total</p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold">{categories.length}</div>
          <div className="text-[11px] text-[#555] mt-1">Categories</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold">{ALL_TOOLS.length}</div>
          <div className="text-[11px] text-[#555] mt-1">Total tools</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 text-center">
          <div className="text-2xl font-semibold">{ALL_TOOLS.filter(t => t.popular).length}</div>
          <div className="text-[11px] text-[#555] mt-1">Popular tools</div>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.slug} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <h3 className="text-[14px] font-semibold capitalize">{cat.slug.replace(/-/g, ' ')}</h3>
                </div>
                <code className="text-[10px] text-[#555]">/tools/{cat.slug}</code>
              </div>
              <Link href={`/admin/tools?category=${cat.slug}` as any}
                className="text-[11px] text-[#1a6b3c] hover:underline flex-shrink-0">
                View tools →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Total tools', value: cat.toolCount },
                { label: 'Featured',    value: cat.featuredCount },
                { label: 'Popular',     value: cat.popularCount },
                { label: 'New',         value: cat.newCount },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/3 rounded-lg p-2.5">
                  <div className="text-[16px] font-semibold">{value}</div>
                  <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#555]">
              <span>Avg priority: {cat.avgPriority}</span>
              <Link href={`/tools/${cat.slug}` as any} target="_blank"
                className="hover:text-[#aaa] transition-colors">
                View live ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
