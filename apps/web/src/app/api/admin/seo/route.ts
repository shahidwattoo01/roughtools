export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../_lib/index'
import { ALL_TOOLS } from '@/lib/tools-registry'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  // Build SEO audit for every tool based on what we know from the registry
  const tools = ALL_TOOLS.map(t => {
    const hasTitle       = true   // all tools have names
    const titleLen       = t.name.length + 20  // approximate with site name
    const titleOk        = titleLen >= 45 && titleLen <= 65
    const hasDesc        = !!t.description
    const descLen        = t.description?.length ?? 0
    const descOk         = descLen >= 140 && descLen <= 165
    const hasOg          = true   // assume OG is generated from meta
    const hasStructured  = t.featured ?? false  // only featured tools have JSON-LD
    const hasCanonical   = true
    const isIndexed      = t.priority !== undefined && t.priority > 0.5

    const score = (
      (hasTitle    ? 10 : 0) + (titleOk  ? 5 : 0) +
      (hasDesc     ? 10 : 0) + (descOk   ? 5 : 0) +
      (hasOg       ? 10 : 0) +
      (hasStructured ? 20 : 0) +
      (hasCanonical  ? 10 : 0) +
      (isIndexed     ? 15 : 0) +
      15  // CWV placeholder — all passing
    )

    return {
      slug: t.slug, name: t.name, category: t.category,
      titleLen, descLen, hasOg, hasStructured, isIndexed,
      titleOk, descOk, score,
      issues: [
        !titleOk        && `Title length ${titleLen} (ideal 50–60)`,
        !descOk         && `Description length ${descLen} (ideal 150–160)`,
        !hasStructured  && 'No structured data',
      ].filter(Boolean) as string[],
    }
  })

  const sorted   = [...tools].sort((a, b) => a.score - b.score)
  const buckets  = { red: 0, yellow: 0, green: 0 }
  tools.forEach(t => {
    if (t.score >= 80) buckets.green++
    else if (t.score >= 50) buckets.yellow++
    else buckets.red++
  })

  // Duplicate title detection (same first 30 chars)
  const titleMap = new Map<string, string[]>()
  tools.forEach(t => {
    const key = t.name.toLowerCase().slice(0, 30)
    if (!titleMap.has(key)) titleMap.set(key, [])
    titleMap.get(key)!.push(t.slug)
  })
  const duplicates = [...titleMap.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([key, slugs]) => ({ key, slugs }))

  return NextResponse.json({
    buckets,
    avgScore: Math.round(tools.reduce((s, t) => s + t.score, 0) / tools.length),
    worstTools:   sorted.slice(0, 20),
    allTools:     tools,
    duplicates,
  })
}
