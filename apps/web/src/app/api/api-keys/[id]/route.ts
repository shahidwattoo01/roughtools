import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

  // Ensure the key belongs to this user before deleting
  const key = await prisma.apiKey.findFirst({
    where: { id: params.id, userId: user.id },
  })
  if (!key) return NextResponse.json({ message: 'API key not found' }, { status: 404 })

  await prisma.apiKey.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'API key deleted' })
}
