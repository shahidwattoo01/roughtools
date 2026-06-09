import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../_lib/db'
import { requireSession } from '../../../_lib/session'

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  if (session.pauseCount >= 2) {
    return NextResponse.json({ message: 'Maximum pauses reached' }, { status: 400 })
  }

  await prisma.iqSession.update({
    where: { id: session.id },
    data: { status: 'PAUSED', pauseCount: { increment: 1 } },
  })

  return NextResponse.json({ ok: true })
}
