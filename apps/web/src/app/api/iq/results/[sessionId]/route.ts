import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../_lib/db'
import { requireSession } from '../../_lib/session'

function iqClassification(iq: number): string {
  if (iq >= 130) return 'Very Superior'
  if (iq >= 120) return 'Superior'
  if (iq >= 110) return 'High Average'
  if (iq >= 90)  return 'Average'
  if (iq >= 80)  return 'Low Average'
  if (iq >= 70)  return 'Borderline'
  return 'Extremely Low'
}

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  if (session.status !== 'COMPLETED') {
    return NextResponse.json({ message: 'Session not yet completed' }, { status: 404 })
  }

  const AGE_LABELS: Record<string, string> = {
    AGE_18_24: '18–24', AGE_25_34: '25–34', AGE_35_44: '35–44',
    AGE_45_54: '45–54', AGE_55_64: '55–64', AGE_65_PLUS: '65+',
  }

  return NextResponse.json({
    sessionId: session.id,
    iqScore: session.iqScore,
    confidenceLower: session.confidenceLower,
    confidenceUpper: session.confidenceUpper,
    percentile: session.percentile,
    classification: session.iqScore ? iqClassification(session.iqScore) : null,
    isValid: session.isValid,
    invalidityFlags: session.invalidityFlags,
    domainScores: session.domainScores,
    ageGroup: AGE_LABELS[session.ageGroup] ?? session.ageGroup,
    questionCount: session.totalQuestions,
    completedAt: session.completedAt?.toISOString() ?? null,
    normingVersion: session.normingVersion,
    reportReady: session.reportReady,
    reportUrl: session.reportUrl,
  })
}
