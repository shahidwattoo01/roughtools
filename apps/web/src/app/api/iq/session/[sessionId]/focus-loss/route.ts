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

  const updated = await prisma.iqSession.update({
    where: { id: session.id },
    data: { focusLossCount: { increment: 1 } },
    select: { focusLossCount: true },
  })

  return NextResponse.json({ count: updated.focusLossCount })
}
