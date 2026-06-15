import type {
  AgeGroup,
  StartSessionResponse,
  SubmitAnswerResponse,
  FocusLossResponse,
  Question,
} from './types'
import {
  MOCK_START_SESSION,
  MOCK_NEXT_QUESTION,
  mockQuestionIndex,
  mockAnswers,
  calculateMockResult,
} from './mock-data'

const BASE = '/api/iq'
const TOKEN_KEY = 'iq_session_token'
const MOCK_AGE_KEY = 'iq_mock_age_group'

function getToken(): string {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(TOKEN_KEY) ?? ''
}

function saveToken(token: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(TOKEN_KEY)
}

const USE_MOCK = process.env.NEXT_PUBLIC_IQ_MOCK === 'true' || process.env.NODE_ENV === 'development'

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function startSession(ageGroup: AgeGroup): Promise<StartSessionResponse> {
  if (USE_MOCK) {
    mockQuestionIndex.value = 0
    mockAnswers.length = 0
    if (typeof window !== 'undefined') sessionStorage.setItem(MOCK_AGE_KEY, ageGroup)
    return MOCK_START_SESSION(ageGroup)
  }
  clearToken()
  const result = await post<StartSessionResponse>('/session/start', { ageGroup })
  saveToken(result.sessionToken)
  return result
}

export async function getNextQuestion(sessionId: string): Promise<Question> {
  if (USE_MOCK) return MOCK_NEXT_QUESTION()
  return get<Question>(`/session/${sessionId}/question`)
}

export async function submitAnswer(
  sessionId: string,
  questionToken: string,
  selectedOption: number,
  timeTakenMs: number,
): Promise<SubmitAnswerResponse> {
  if (USE_MOCK) {
    // Record correctness before advancing index
    const currentQ = MOCK_NEXT_QUESTION()
    const isCorrect = currentQ
      ? selectedOption === (currentQ.content as { correct?: number }).correct
      : false
    mockAnswers.push({ correct: isCorrect, timeTakenMs, domain: currentQ?.domain ?? 'FLUID_REASONING' })

    mockQuestionIndex.value += 1
    const next = MOCK_NEXT_QUESTION()
    if (!next) return { complete: true }
    return { complete: false, nextQuestion: next }
  }
  return post<SubmitAnswerResponse>(`/session/${sessionId}/answer`, {
    questionToken,
    selectedOption,
    timeTakenMs,
  })
}

export async function submitTimeout(
  sessionId: string,
  questionToken: string,
  timeTakenMs: number,
): Promise<SubmitAnswerResponse> {
  if (USE_MOCK) {
    // Timeouts count as incorrect
    const currentQ = MOCK_NEXT_QUESTION()
    mockAnswers.push({ correct: false, timeTakenMs, domain: currentQ?.domain ?? 'FLUID_REASONING' })

    mockQuestionIndex.value += 1
    const next = MOCK_NEXT_QUESTION()
    if (!next) return { complete: true }
    return { complete: false, nextQuestion: next }
  }
  return post<SubmitAnswerResponse>(`/session/${sessionId}/timeout`, {
    questionToken,
    timeTakenMs,
  })
}

export async function reportFocusLoss(sessionId: string): Promise<FocusLossResponse> {
  if (USE_MOCK) return { count: 1 }
  return post<FocusLossResponse>(`/session/${sessionId}/focus-loss`)
}

export async function pauseSession(sessionId: string): Promise<void> {
  if (USE_MOCK) return
  await post(`/session/${sessionId}/pause`)
}

export async function completeSession(sessionId: string): Promise<{ redirectUrl: string }> {
  if (USE_MOCK) {
    const ageGroup = typeof window !== 'undefined'
      ? (sessionStorage.getItem(MOCK_AGE_KEY) ?? 'ADULT')
      : 'ADULT'
    const result = calculateMockResult(sessionId, [...mockAnswers], ageGroup)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`mock-result-${sessionId}`, JSON.stringify(result))
    }
    return { redirectUrl: `/tools/iq-test/results/${sessionId}?token=mock` }
  }
  return post<{ redirectUrl: string }>(`/session/${sessionId}/complete`)
}
