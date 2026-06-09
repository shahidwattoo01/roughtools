export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../_lib/db'
import { requireAdmin } from '../_lib/require-admin'

// GET /api/iq/admin/questions — paginated question bank list with analytics
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const page    = Math.max(1, parseInt(searchParams.get('page')  ?? '1'))
  const limit   = Math.min(100, parseInt(searchParams.get('limit') ?? '50'))
  const domain  = searchParams.get('domain')  ?? undefined
  const format  = searchParams.get('format')  ?? undefined
  const pilotQ  = searchParams.get('pilot')
  const activeQ = searchParams.get('active')

  const where = {
    ...(domain ? { domain: domain as Parameters<typeof prisma.iqQuestionBank.findMany>[0]['where']['domain'] } : {}),
    ...(format ? { format: format as Parameters<typeof prisma.iqQuestionBank.findMany>[0]['where']['format'] } : {}),
    ...(pilotQ  !== null ? { pilot:    pilotQ  === 'true' } : {}),
    ...(activeQ !== null ? { isActive: activeQ === 'true' } : {}),
  }

  const [total, questions] = await Promise.all([
    prisma.iqQuestionBank.count({ where }),
    prisma.iqQuestionBank.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, domain: true, format: true, difficulty: true,
        discriminationIndex: true, pilot: true, isActive: true,
        createdAt: true,
        analytics: {
          select: {
            totalPresentations: true, totalCorrect: true,
            difficultyEmpirical: true, exposureThisMonth: true,
          },
        },
      },
    }),
  ])

  return NextResponse.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    questions: questions.map(q => ({
      ...q,
      correctRate: q.analytics && q.analytics.totalPresentations > 0
        ? q.analytics.totalCorrect / q.analytics.totalPresentations
        : null,
    })),
  })
}

// PATCH /api/iq/admin/questions — bulk update (activate/deactivate/pilot toggle)
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const body = await req.json() as {
    ids: string[]
    action: 'activate' | 'deactivate' | 'set-pilot' | 'unset-pilot'
  }

  const dataMap = {
    activate:    { isActive: true },
    deactivate:  { isActive: false },
    'set-pilot': { pilot: true },
    'unset-pilot': { pilot: false },
  }

  const data = dataMap[body.action]
  if (!data) return NextResponse.json({ message: 'Invalid action' }, { status: 400 })

  const result = await prisma.iqQuestionBank.updateMany({
    where: { id: { in: body.ids } },
    data,
  })

  return NextResponse.json({ updated: result.count })
}
