export const dynamic = 'force-dynamic'

/**
 * API Keys route — manages user API keys via Prisma directly.
 * Replaced the old proxy to Express (apps/api is unused).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

function generateApiKey(): string {
  return 'rt_' + crypto.randomBytes(32).toString('hex')
}

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

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, keyPrefix: true, createdAt: true, lastUsed: true, isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ keys })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

  const body = await request.json() as { name?: string }
  const name = body.name?.trim() || 'Default Key'

  const key = generateApiKey()
  const keyPrefix = key.slice(0, 10) + '...'
  const keyHash = crypto.createHash('sha256').update(key).digest('hex')

  const apiKey = await prisma.apiKey.create({
    data: { userId: user.id, name, keyHash, keyPrefix, isActive: true },
    select: { id: true, name: true, keyPrefix: true, createdAt: true },
  })

  // Return the full key ONCE — it cannot be retrieved again
  return NextResponse.json({ apiKey, key }, { status: 201 })
}
