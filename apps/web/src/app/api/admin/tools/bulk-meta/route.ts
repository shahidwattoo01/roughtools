export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, prisma } from '../../_lib/index'
import { revalidatePath } from 'next/cache'

interface MetaRow {
  slug: string
  title: string
  description: string
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { rows } = await req.json() as { rows: MetaRow[] }
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ message: 'rows array required' }, { status: 400 })
  }

  let updated = 0
  const errors: string[] = []

  for (const row of rows.slice(0, 200)) { // cap at 200 per batch
    try {
      const existing = await prisma.tool.findUnique({ where: { slug: row.slug } })
      if (!existing) { errors.push(`${row.slug}: not found`); continue }

      // Merge SEO fields into the existing features JSONB
      const currentFeatures = (existing.features as Record<string, unknown>) ?? {}
      await prisma.tool.update({
        where: { slug: row.slug },
        data: {
          description: row.description,
          features: {
            ...currentFeatures,
            seo: {
              title:       row.title,
              description: row.description,
            },
          },
        },
      })
      updated++

      // Revalidate the static page
      try { revalidatePath(`/tools/${existing.categoryId}/${row.slug}`) } catch { /* non-fatal */ }
    } catch (e) {
      errors.push(`${row.slug}: ${(e as Error).message}`)
    }
  }

  return NextResponse.json({ updated, errors })
}
