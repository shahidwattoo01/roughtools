export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../_lib/db'
import { requireAdmin } from '../_lib/require-admin'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const q      = searchParams.get('q')       // search by sessionId prefix
  const status = searchParams.get('status')
  const valid  = searchParams.get('valid')
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit  = Math.min(100, parseInt(searchParams.get('limit') ?? '25'))

  const where = {
    ...(q ? { id: { startsWith: q } } : {}),
    ...(status ? { status: status as Parameters<typeof prisma.iqSession.findMany>[0]['where']['status'] } : {}),
    ...(valid !== null ? { isValid: valid === 'true' } : {}),
  }

  const [total, sessions] = await Promise.all([
    prisma.iqSession.count({ where }),
    prisma.iqSession.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startedAt: 'desc' },
      select: {
        id: true, status: true, ageGroup: true, iqScore: true,
        percentile: true, isValid: true, invalidityFlags: true,
        focusLossCount: true, pauseCount: true, totalQuestions: true,
        startedAt: true, completedAt: true, reportReady: true,
      },
    }),
  ])

  return NextResponse.json({ total, page, pages: Math.ceil(total / limit), sessions })
}
