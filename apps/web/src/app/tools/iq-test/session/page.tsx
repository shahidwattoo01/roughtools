'use client'

export const dynamic = 'force-dynamic'

import { useReducer, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SessionState, SessionAction, AgeGroup, Question } from '../_lib/types'
import * as api from '../_lib/api'
import { QuestionRenderer } from './_components/QuestionRenderer'

// ─── FSM reducer ─────────────────────────────────────────────────────────────

function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SHOW_AGE_SELECT':
      return { ...state, phase: 'AGE_SELECT' }

    case 'START_LOADING':
      return { ...state, phase: 'LOADING' }

    case 'SESSION_STARTED':
      return {
        ...state,
        sessionId: action.sessionId,
        currentQuestion: action.firstQuestion,
        questionIndex: action.firstQuestion.questionNumber,
        totalEstimate: action.firstQuestion.totalEstimate,
        timeRemaining: action.firstQuestion.timeLimitSeconds,
        phase: action.firstQuestion.format === 'MEMORY' ? 'BETWEEN_QUESTIONS' : 'ACTIVE_QUESTION',
        memoryPhase: 'display',
      }

    case 'QUESTION_LOADED':
      return {
        ...state,
        currentQuestion: action.question,
        questionIndex: action.question.questionNumber,
        totalEstimate: action.question.totalEstimate,
        timeRemaining: action.question.timeLimitSeconds,
        phase: action.question.format === 'MEMORY' ? 'BETWEEN_QUESTIONS' : 'ACTIVE_QUESTION',
        memoryPhase: 'display',
      }

    case 'ANSWER_SUBMITTED':
      return { ...state, phase: 'SUBMITTING' }

    case 'TICK':
      if (state.phase !== 'ACTIVE_QUESTION') return state
      if (state.timeRemaining <= 1) return { ...state, timeRemaining: 0, phase: 'SUBMITTING' }
      return { ...state, timeRemaining: state.timeRemaining - 1 }

    case 'TIMEOUT':
      return { ...state, phase: 'SUBMITTING' }

    case 'PAUSE':
      if (state.pauseCount >= 2) return state
      return { ...state, phase: 'PAUSED', pauseCount: state.pauseCount + 1 }

    case 'RESUME':
      return { ...state, phase: 'ACTIVE_QUESTION' }

    case 'FOCUS_LOST':
      return { ...state, focusLossCount: action.count }

    case 'MEMORY_DISPLAY_DONE':
      return { ...state, memoryPhase: 'respond', phase: 'ACTIVE_QUESTION' }

    case 'TEST_COMPLETE':
      return { ...state, phase: 'DONE', redirectUrl: action.redirectUrl }

    case 'ERROR':
      return { ...state, phase: 'ERROR', error: action.message }

    default:
      return state
  }
}

const initial: SessionState = {
  phase: 'INSTRUCTIONS',
  ageGroup: null,
  sessionId: null,
  currentQuestion: null,
  questionIndex: 0,
  totalEstimate: 50,
  focusLossCount: 0,
  pauseCount: 0,
  timeRemaining: 60,
  memoryPhase: 'display',
  error: null,
  redirectUrl: null,
}

// ─── Age group labels ─────────────────────────────────────────────────────────

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'AGE_18_24',   label: '18–24' },
  { value: 'AGE_25_34',   label: '25–34' },
  { value: 'AGE_35_44',   label: '35–44' },
  { value: 'AGE_45_54',   label: '45–54' },
  { value: 'AGE_55_64',   label: '55–64' },
  { value: 'AGE_65_PLUS', label: '65+' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function IqTestSessionPage() {
  const [state, dispatch] = useReducer(reducer, initial)
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const questionStartRef = useRef<number>(Date.now())

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase === 'ACTIVE_QUESTION') {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state.phase])

  // ── Auto-timeout when tick reaches 0 ─────────────────────────────────────
  useEffect(() => {
    if (state.phase === 'SUBMITTING' && state.timeRemaining === 0 && state.sessionId && state.currentQuestion) {
      const elapsed = Date.now() - questionStartRef.current
      api.submitTimeout(state.sessionId, state.currentQuestion.questionToken, elapsed)
        .then(handleSubmitResponse)
        .catch((e: Error) => dispatch({ type: 'ERROR', message: e.message }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.timeRemaining])

  // ── Focus loss detection ──────────────────────────────────────────────────
  useEffect(() => {
    if (!state.sessionId) return
    let lostAt: number | null = null

    const onVisibility = () => {
      if (document.hidden) {
        lostAt = Date.now()
      } else if (lostAt !== null) {
        const gap = Date.now() - lostAt
        lostAt = null
        if (gap > 5000 && state.phase === 'ACTIVE_QUESTION') {
          api.reportFocusLoss(state.sessionId!)
            .then(({ count }) => dispatch({ type: 'FOCUS_LOST', count }))
            .catch(() => {})
        }
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [state.sessionId, state.phase])

  // ── Redirect when done ───────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase === 'DONE' && state.redirectUrl) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(state.redirectUrl as any)
    }
  }, [state.phase, state.redirectUrl, router])

  // ── Shared answer handler ─────────────────────────────────────────────────

  function handleSubmitResponse(res: { complete: boolean; nextQuestion?: Question }) {
    if (res.complete) {
      api.completeSession(state.sessionId!)
        .then(({ redirectUrl }) => dispatch({ type: 'TEST_COMPLETE', redirectUrl }))
        .catch((e: Error) => dispatch({ type: 'ERROR', message: e.message }))
    } else if (res.nextQuestion) {
      setTimeout(() => {
        questionStartRef.current = Date.now()
        dispatch({ type: 'QUESTION_LOADED', question: res.nextQuestion! })
      }, 500)
    }
  }

  const submitAnswer = useCallback((optionIndex: number) => {
    if (state.phase !== 'ACTIVE_QUESTION' || !state.sessionId || !state.currentQuestion) return
    dispatch({ type: 'ANSWER_SUBMITTED' })
    const elapsed = Date.now() - questionStartRef.current
    api.submitAnswer(state.sessionId, state.currentQuestion.questionToken, optionIndex, elapsed)
      .then(handleSubmitResponse)
      .catch((e: Error) => dispatch({ type: 'ERROR', message: e.message }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.sessionId, state.currentQuestion])

  const startSession = useCallback((ageGroup: AgeGroup) => {
    dispatch({ type: 'START_LOADING' })
    api.startSession(ageGroup)
      .then((res) => {
        questionStartRef.current = Date.now()
        dispatch({ type: 'SESSION_STARTED', sessionId: res.sessionId, firstQuestion: res.firstQuestion })
      })
      .catch((e: Error) => dispatch({ type: 'ERROR', message: e.message }))
  }, [])

  // ── Render: Instructions ──────────────────────────────────────────────────
  if (state.phase === 'INSTRUCTIONS') {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-[600px] w-full">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8">
            <div className="text-3xl mb-4" aria-hidden="true">🧠</div>
            <h1 className="text-xl font-semibold mb-1">Before you begin</h1>
            <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-6 leading-[1.65]">
              Read each instruction carefully before starting.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Find a quiet place with no distractions. Close other browser tabs.',
                'Each question has its own time limit shown by a countdown bar.',
                'Answer honestly — do not look up answers. Results only have value if genuine.',
                'You may pause twice. Each pause voids the current question\'s timer.',
                'Switching browser tabs or minimising the window is recorded. Three focus-loss events lasting more than 5 seconds may affect your validity score.',
                'The test adapts to your ability. It contains 40–50 questions and takes 25–40 minutes.',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[13px] text-[#374151] dark:text-[#ccc] leading-[1.6]">
                  <span className="text-[#a21caf] dark:text-[#e879f9] font-semibold flex-shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-[#fdf4ff] dark:bg-[#a21caf]/10 border border-[#a21caf]/15 rounded-xl p-4 mb-6 text-[12px] text-[#7e22ce] dark:text-[#d8b4fe] leading-[1.6]">
              <strong>Important:</strong> This is a self-assessment tool for personal insight only. It is not
              a clinical evaluation and must not be used for diagnostic, employment, or placement
              purposes without qualified professional oversight.
            </div>

            <button
              onClick={() => dispatch({ type: 'SHOW_AGE_SELECT' })}
              className="w-full bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg py-3 text-sm font-medium transition-colors"
            >
              I understand — Select age group
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Render: Age Select ────────────────────────────────────────────────────
  if (state.phase === 'AGE_SELECT') {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-[480px] w-full">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8">
            <h2 className="text-lg font-semibold mb-1">Select your age group</h2>
            <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-6 leading-[1.6]">
              Scores are age-normalised. Your result will be compared against peers in your age group.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {AGE_GROUPS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => startSession(value)}
                  className="border-2 border-black/10 dark:border-white/15 rounded-xl py-3.5 text-sm font-medium
                             hover:border-[#a21caf] hover:text-[#a21caf] dark:hover:text-[#e879f9]
                             transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Render: Loading ───────────────────────────────────────────────────────
  if (state.phase === 'LOADING') {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#a21caf] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-[#555] dark:text-[#aaa]">Preparing your test…</p>
        </div>
      </div>
    )
  }

  // ── Render: Active Question ───────────────────────────────────────────────
  if ((state.phase === 'ACTIVE_QUESTION' || state.phase === 'SUBMITTING' || state.phase === 'BETWEEN_QUESTIONS') && state.currentQuestion) {
    const q = state.currentQuestion
    const timerPct = (state.timeRemaining / q.timeLimitSeconds) * 100
    const timerColor = timerPct > 50 ? '#059669' : timerPct > 25 ? '#d97706' : '#dc2626'
    const isMemoryDisplay = state.phase === 'BETWEEN_QUESTIONS'
    const isSubmitting = state.phase === 'SUBMITTING'

    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-black/8 dark:border-white/8 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm">
          <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-[13px] text-[#555] dark:text-[#aaa] flex-shrink-0">
              Q{state.questionIndex} / ~{state.totalEstimate}
            </span>

            <div className="flex-1 h-1.5 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-[#a21caf]"
                style={{ width: `${(state.questionIndex / state.totalEstimate) * 100}%` }}
              />
            </div>

            {state.focusLossCount > 0 && (
              <span className="text-[11px] text-[#dc2626] font-medium flex-shrink-0">
                ⚠ {state.focusLossCount}/3 focus
              </span>
            )}

            {state.pauseCount < 2 && !isSubmitting && !isMemoryDisplay && (
              <button
                onClick={() => {
                  dispatch({ type: 'PAUSE' })
                  // server-side pause — fire and forget
                  if (state.sessionId) api.pauseSession(state.sessionId).catch(() => {})
                }}
                className="text-[11px] border border-black/10 dark:border-white/15 rounded px-2.5 py-1
                           text-[#555] dark:text-[#aaa] hover:text-[#1a1a1a] dark:hover:text-white transition-colors flex-shrink-0"
              >
                Pause ({2 - state.pauseCount})
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-12">
          <div className="max-w-[620px] w-full">

            {/* Timer bar (hidden during memory display phase) */}
            {!isMemoryDisplay && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-2 bg-black/8 dark:bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${timerPct}%`, background: timerColor }}
                  />
                </div>
                <span
                  className="text-sm font-mono font-semibold w-9 text-right flex-shrink-0"
                  style={{ color: timerColor }}
                >
                  {state.timeRemaining}s
                </span>
              </div>
            )}

            {/* Question card */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-6">
              <QuestionRenderer
                question={q}
                disabled={isSubmitting}
                memoryPhase={state.memoryPhase}
                onAnswer={submitAnswer}
                onMemoryDisplayDone={() => dispatch({ type: 'MEMORY_DISPLAY_DONE' })}
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ── Render: Paused ────────────────────────────────────────────────────────
  if (state.phase === 'PAUSED') {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-[400px] w-full bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8 text-center">
          <div className="text-4xl mb-4" aria-hidden="true">⏸</div>
          <h2 className="text-lg font-semibold mb-2">Test paused</h2>
          <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-6 leading-[1.65]">
            The current question timer has been voided. A fresh question will be served when you resume.
            {state.pauseCount >= 2 ? ' This was your final pause.' : ` ${2 - state.pauseCount} pause remaining.`}
          </p>
          <button
            onClick={() => {
              dispatch({ type: 'RESUME' })
              // Fetch next question on resume
              if (state.sessionId) {
                api.getNextQuestion(state.sessionId)
                  .then((q) => { questionStartRef.current = Date.now(); dispatch({ type: 'QUESTION_LOADED', question: q }) })
                  .catch((e: Error) => dispatch({ type: 'ERROR', message: e.message }))
              }
            }}
            className="bg-[#a21caf] hover:bg-[#86198f] text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Resume test
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Completing ────────────────────────────────────────────────────
  if (state.phase === 'COMPLETING' || state.phase === 'DONE') {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#a21caf] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-[#555] dark:text-[#aaa]">Calculating your results…</p>
        </div>
      </div>
    )
  }

  // ── Render: Error ─────────────────────────────────────────────────────────
  if (state.phase === 'ERROR') {
    return (
      <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-[400px] w-full bg-white dark:bg-[#1e1e1e] rounded-2xl border border-black/8 dark:border-white/8 p-8 text-center">
          <div className="text-3xl mb-4" aria-hidden="true">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-[13px] text-[#dc2626] mb-6">{state.error}</p>
          <Link href="/tools/iq-test" className="text-[13px] text-[#a21caf] hover:underline">
            ← Back to IQ Test
          </Link>
        </div>
      </div>
    )
  }

  return null
}
