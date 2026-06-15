import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '../../../_lib/session'
import { enqueueIqPdf } from '@toolverse/queue'

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  if (session.status !== 'COMPLETED') {
    return NextResponse.json({ status: 'not_ready', message: 'Session not completed' }, { status: 404 })
  }

  if (session.reportReady && session.reportUrl) {
    return NextResponse.json({ status: 'ready', url: session.reportUrl })
  }

  // Enqueue generation if not already in progress (idempotent — same jobId)
  try {
    await enqueueIqPdf(session.id, session.userId ?? undefined)
  } catch {
    // Job already queued — safe to ignore duplicate
  }

  return NextResponse.json({ status: 'pending' })
}
