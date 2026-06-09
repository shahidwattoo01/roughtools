import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../_lib/db'
import { requireSession, decodeQuestionToken, formatQuestion } from '../../../_lib/session'
import { pickNextQuestion, estimateTotalQuestions, shouldEndTest, stateFromSession } from '../../../_lib/adaptive-state'

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  const auth = await requireSession(req, params.sessionId)
  if (auth instanceof NextResponse) return auth
  const { session } = auth

  let body: { questionToken?: string; timeTakenMs?: number }
  try { body = await req.json() } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  const { questionToken, timeTakenMs = session.currentIndex * 1000 } = body
  if (!questionToken) return NextResponse.json({ message: 'Missing questionToken' }, { status: 400 })

  const questionId = decodeQuestionToken(questionToken, session.id)
  if (!questionId) return NextResponse.json({ message: 'Invalid question token' }, { status: 400 })

  const dbQuestion = await prisma.iqQuestionBank.findUnique({ where: { id: questionId } })
  if (!dbQuestion) return NextResponse.json({ message: 'Question not found' }, { status: 404 })

  await prisma.iqResponse.create({
    data: {
      sessionId: session.id,
      questionId,
      domain: dbQuestion.domain,
      difficulty: dbQuestion.difficulty,
      presentedAt: new Date(Date.now() - timeTakenMs),
      answeredAt: new Date(),
      timeTakenMs,
      selectedOption: null,
      isCorrect: false,
      isTimeout: true,
      isPilot: dbQuestion.pilot,
      weightedScore: 0,
      timePenalty: 0,
      finalScore: 0,
    },
  })

  const currentState = stateFromSession(session)
  if (shouldEndTest(currentState)) return NextResponse.json({ complete: true })

  const freshSession = await prisma.iqSession.findUnique({ where: { id: session.id } })
  if (!freshSession) return NextResponse.json({ complete: true })

  const result = await pickNextQuestion(freshSession)
  if ('isComplete' in result && result.isComplete) return NextResponse.json({ complete: true })

  const { dbQuestion: nextQ, state } = result as Exclude<typeof result, { isComplete: true }>
  if (!nextQ) return NextResponse.json({ complete: true })

  const questionNumber = freshSession.currentIndex + 1
  const totalEstimate = Math.max(questionNumber + 1, 40 + estimateTotalQuestions(state))

  return NextResponse.json({
    complete: false,
    nextQuestion: formatQuestion(nextQ, questionNumber, totalEstimate, session.id),
  })
}
