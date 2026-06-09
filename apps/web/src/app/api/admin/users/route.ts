export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, prisma } from '../_lib/index'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const { searchParams } = new URL(req.url)
  const q     = searchParams.get('q') ?? ''
  const page  = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '25'))

  const where = q ? {
    OR: [
      { email: { contains: q, mode: 'insensitive' as const } },
      { name:  { contains: q, mode: 'insensitive' as const } },
    ],
  } : {}

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true,
        createdAt: true, updatedAt: true,
      },
    }),
  ])

  // Join IQ session counts
  const ids = users.map(u => u.id)
  const iqCounts = ids.length ? await prisma.iqSession.groupBy({
    by: ['userId'],
    where: { userId: { in: ids }, status: 'COMPLETED' },
    _count: true,
  }) : []
  const iqMap = Object.fromEntries(iqCounts.map(r => [r.userId, r._count]))

  return NextResponse.json({
    total,
    users: users.map(u => ({
      id:             u.id,
      email:          u.email,
      name:           u.name,
      createdAt:      u.createdAt.toISOString(),
      lastLogin:      u.updatedAt?.toISOString() ?? null,
      status:         'active',
      plan:           'free',
      totalSessions:  iqMap[u.id] ?? 0,
    })),
  })
}
