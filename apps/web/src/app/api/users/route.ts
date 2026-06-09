export const dynamic = 'force-dynamic'

/**
 * Users admin route — admin-only user listing.
 * Protected by JWT admin token (same as /api/admin/auth/login).
 */

import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'admin-dev-secret-change-in-prod'
)

async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  const auth = request.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return false
  const token = auth.slice(7)
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.role === 'ADMIN'
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdminToken(request))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? undefined
  const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit  = Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10))

  const where = search
    ? {
        OR: [
          { name:  { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : undefined

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, page, limit, total })
}
