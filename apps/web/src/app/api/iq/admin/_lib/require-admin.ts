import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireAdmin(_req: NextRequest): Promise<null | NextResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getServerSession(authOptions) as any
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }
  return null
}
