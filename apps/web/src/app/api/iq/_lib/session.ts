import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import type { IqSession } from '@platform/db'
import { prisma } from './db'

const SECRET = new TextEncoder().encode(
  process.env.IQ_SESSION_SECRET ?? 'iq-dev-secret-change-in-production',
)

export interface SessionTokenPayload {
  sessionId: string
  sub: string
}

export async function signSessionToken(sessionId: string): Promise<string> {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sessionId)
    .setIssuedAt()
    .setExpirationTime('90m')
    .sign(SECRET)
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return (payload as unknown as SessionTokenPayload).sessionId ?? null
  } catch {
    return null
  }
}

export function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') ?? ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : null
}

/** Validate request token and return the live session, or a 401/403 response */
export async function requireSession(
  req: NextRequest,
  paramSessionId: string,
): Promise<{ session: IqSession } | NextResponse> {
  const token = extractBearerToken(req)
  if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 })

  const sessionId = await verifySessionToken(token)
  if (!sessionId || sessionId !== paramSessionId) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const session = await prisma.iqSession.findUnique({ where: { id: sessionId } })
  if (!session) return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  if (session.status === 'EXPIRED' || session.status === 'VOIDED') {
    return NextResponse.json({ message: 'Session expired' }, { status: 410 })
  }
  if (new Date() > session.expiresAt) {
    await prisma.iqSession.update({ where: { id: sessionId }, data: { status: 'EXPIRED' } })
    return NextResponse.json({ message: 'Session expired' }, { status: 410 })
  }

  return { session }
}

/** Format a DB question row into the API response payload (strips correct answer) */
export function formatQuestion(
  dbQuestion: { id: string; domain: string; format: string; content: unknown; timeLimitSeconds: number },
  questionNumber: number,
  totalEstimate: number,
  sessionId: string,
): object {
  // Strip `correct` field from content before sending to client
  const content = { ...(dbQuestion.content as Record<string, unknown>) }
  delete content['correct']

  return {
    questionNumber,
    totalEstimate,
    domain: dbQuestion.domain,
    format: dbQuestion.format,
    timeLimitSeconds: dbQuestion.timeLimitSeconds,
    content,
    // question_token = HMAC(questionId + sessionId) — prevents answer guessing
    questionToken: Buffer.from(`${dbQuestion.id}:${sessionId}`).toString('base64url'),
  }
}

/** Decode a question token back to questionId */
export function decodeQuestionToken(token: string, sessionId: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [qId, sId] = decoded.split(':')
    return sId === sessionId ? qId : null
  } catch {
    return null
  }
}
