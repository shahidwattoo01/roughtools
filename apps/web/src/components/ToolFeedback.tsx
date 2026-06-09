'use client'

/**
 * ToolFeedback.tsx
 * Rule F-2 — Feedback / bug-report mechanism required on every tool page.
 * Frontend-only form (mailto fallback). Shows success state after submit.
 */

import { useState } from 'react'

interface ToolFeedbackProps {
  toolName: string
}

export function ToolFeedback({ toolName }: ToolFeedbackProps) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    // mailto: fallback — opens email client if configured
    const subject = encodeURIComponent(`Feedback: ${toolName}`)
    const body = encodeURIComponent(message)
    window.open(`mailto:shahidwattoo0111@gmail.com?subject=${subject}&body=${body}`, '_blank')
    setSent(true)
    setMessage('')
  }

  return (
    <section
      aria-labelledby="feedback-heading"
      style={{
        margin: '24px 0',
        padding: '20px 24px',
        background: 'var(--bg-2)',
        borderRadius: 12,
        border: '1px solid var(--line)',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
        role="button"
        aria-expanded={open}
        aria-controls="feedback-form"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <h2
          id="feedback-heading"
          style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', margin: 0 }}
        >
          💬 Feedback or Bug Report
        </h2>
        <span aria-hidden="true" style={{ color: 'var(--brand)', fontSize: 18 }}>{open ? '−' : '+'}</span>
      </div>

      {open && (
        <div id="feedback-form" style={{ marginTop: 16 }}>
          {sent ? (
            <p style={{ margin: 0, fontSize: 13, color: '#10b981' }}>
              ✓ Thank you! Your feedback has been sent. We review all reports and aim to respond within 48 hours.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="feedback-message"
                style={{ display: 'block', fontSize: 12, color: 'var(--fg-2)', marginBottom: 6 }}
              >
                Describe the issue or share your feedback about <strong style={{ color: 'var(--fg)' }}>{toolName}</strong>:
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. The calculator gives incorrect results when I enter…"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-1)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 8,
                  color: 'var(--fg)',
                  fontSize: 13,
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  marginTop: 10,
                  padding: '8px 18px',
                  background: 'rgba(91,108,255,0.12)',
                  border: '1px solid rgba(91,108,255,0.3)',
                  borderRadius: 8,
                  color: 'var(--brand)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Send Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  )
}
