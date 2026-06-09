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

  const refCode = await prisma.referralCode.findUnique({
    where: { userId: user.id },
    select: { code: true },
  })

  const [total, successful] = await Promise.all([
    prisma.referral.count({ where: { referrerId: user.id } }),
    prisma.referral.count({ where: { referrerId: user.id, rewardGranted: true } }),
  ])

  const earned = await prisma.referral.aggregate({
    where: { referrerId: user.id, rewardGranted: true },
    _sum: { rewardValue: true },
  })

  return NextResponse.json({
    code: refCode?.code ?? null,
    totalReferrals: total,
    successfulReferrals: successful,
    totalEarnedCents: earned._sum.rewardValue ?? 0,
  })
}
