export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '../../_lib/db'
import { signSessionToken, formatQuestion } from '../../_lib/session'
import { pickNextQuestion, estimateTotalQuestions, initAdaptiveState } from '../../_lib/adaptive-state'

const VALID_AGE_GROUPS = [
  'AGE_18_24', 'AGE_25_34', 'AGE_35_44',
  'AGE_45_54', 'AGE_55_64', 'AGE_65_PLUS',
] as const

// Rate limiting: max 3 session starts per IP per minute (in-memory for simplicity)
const ipRateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipRateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ message: 'Too many requests. Try again in a minute.' }, { status: 429 })
  }

  let body: { ageGroup?: string; userId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const { ageGroup, userId } = body
  if (!ageGroup || !VALID_AGE_GROUPS.includes(ageGroup as typeof VALID_AGE_GROUPS[number])) {
    return NextResponse.json({ message: 'Invalid age group' }, { status: 400 })
  }

  // Cooldown check: last completed session within 24 h for this user/IP
  const ipHash = createHash('sha256').update(ip).digest('hex')
  const oneDayAgo = new Date(Date.now() - 24 * 3_600_000)

  if (userId) {
    const recent = await prisma.iqSession.findFirst({
      where: { userId, status: 'COMPLETED', completedAt: { gte: oneDayAgo } },
    })
    if (recent) {
      return NextResponse.json({ message: 'Cooldown active. Please wait 24 hours between attempts.' }, { status: 429 })
    }
  }

  const expiresAt = new Date(Date.now() + 90 * 60_000)

  // Initialise adaptive state
  const adaptiveInit = initAdaptiveState()

  const session = await prisma.iqSession.create({
    data: {
      userId: userId ?? null,
      sessionToken: crypto.randomUUID(),
      status: 'ACTIVE',
      ageGroup: ageGroup as typeof VALID_AGE_GROUPS[number],
      expiresAt,
      ipAddressHash: ipHash,
      userAgent: req.headers.get('user-agent') ?? null,
      thetaEstimates: adaptiveInit.thetaByDomain,
      stdErrors: adaptiveInit.seByDomain,
    },
  })

  const token = await signSessionToken(session.id)

  // Pick first question
  const result = await pickNextQuestion(session)
  if ('isComplete' in result && result.isComplete) {
    return NextResponse.json({ message: 'No questions available' }, { status: 503 })
  }

  const { dbQuestion, state } = result as Exclude<typeof result, { isComplete: true }>
  if (!dbQuestion) {
    return NextResponse.json({ message: 'No questions available' }, { status: 503 })
  }

  const totalEstimate = 40 + estimateTotalQuestions(state)

  return NextResponse.json({
    sessionId: session.id,
    sessionToken: token,
    expiresAt: expiresAt.toISOString(),
    firstQuestion: formatQuestion(dbQuestion, 1, totalEstimate, session.id),
  })
}
