export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'

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

  // Create referral code if one doesn't exist yet
  let refCode = await prisma.referralCode.findUnique({ where: { userId: user.id } })
  if (!refCode) {
    const code = crypto.randomBytes(5).toString('hex').toUpperCase()
    refCode = await prisma.referralCode.create({
      data: { userId: user.id, code },
    })
  }

  return NextResponse.json({
    code:    refCode.code,
    link:    `${SITE}/?ref=${refCode.code}`,
  })
}
