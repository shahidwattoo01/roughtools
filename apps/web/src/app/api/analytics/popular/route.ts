export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const limit = Math.min(20, parseInt(searchParams.get('limit') ?? '5', 10))

  const topTools = await prisma.toolUsage.groupBy({
    by: ['toolSlug'],
    where: { userId: user.id },
    _count: { toolSlug: true },
    orderBy: { _count: { toolSlug: 'desc' } },
    take: limit,
  })

  return NextResponse.json(
    topTools.map(t => ({ toolSlug: t.toolSlug, count: t._count.toolSlug }))
  )
}
