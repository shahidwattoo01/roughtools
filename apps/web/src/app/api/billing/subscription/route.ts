export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

  // Look up active subscription
  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ['ACTIVE', 'TRIALING'] } },
    orderBy: { createdAt: 'desc' },
    select: { plan: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  })

  if (!sub) {
    return NextResponse.json({ plan: 'free', status: 'active' })
  }

  return NextResponse.json({
    plan:               sub.plan,
    status:             sub.status,
    currentPeriodEnd:   sub.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd:  sub.cancelAtPeriodEnd,
  })
}
