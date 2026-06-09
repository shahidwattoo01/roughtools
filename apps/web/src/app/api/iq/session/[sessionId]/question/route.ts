import { NextRequest, NextResponse } from 'next/server'
import { requireSession, formatQuestion } from '../../../_lib/session'
import { pickNextQuestion, estimateTotalQuestions } from '../../../_lib/adaptive-state'

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  const result = await pickNextQuestion(session)

  if ('isComplete' in result && result.isComplete) {
    return NextResponse.json({ complete: true })
  }

  const { dbQuestion, state } = result as Exclude<typeof result, { isComplete: true }>
  if (!dbQuestion) return NextResponse.json({ complete: true })

  const questionNumber = session.currentIndex + 1
  const totalEstimate = Math.max(questionNumber + 1, 40 + estimateTotalQuestions(state))

  return NextResponse.json({
    complete: false,
    question: formatQuestion(dbQuestion, questionNumber, totalEstimate, session.id),
  })
}
