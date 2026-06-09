'use client'

/**
 * CalculatorSections.tsx
 * Reusable section components for calculator pages:
 *  - ProTipsSection        — 4 expert pro tips
 *  - WhenToUseCards        — 5 use-case scenario cards
 *  - QuickReferenceTable   — input/description/example table
 *  - CalculatorAbout       — expanded about section with formula
 *  - CalculatorFAQ         — FAQ accordion (12 questions)
 *  - RelatedCalculators    — related calculator cards grid
 *  - FinancialDisclaimer   — yellow warning disclaimer
 *  - MedicalCalcDisclaimer — blue medical disclaimer
 */

import React, { useState } from 'react'
import Link from 'next/link'

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  marginTop: 40,
  padding: '28px 32px',
  background: 'var(--bg-1)',
  borderRadius: 16,
  border: '1px solid var(--line-strong)',
}

const h2Style: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: 'var(--fg)',
  marginBottom: 20,
  marginTop: 0,
}

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--fg-2)',
  lineHeight: 1.75,
}

// ─── ProTipsSection ───────────────────────────────────────────────────────────

export interface ProTip { tip: string }

interface ProTipsSectionProps {
  tips: string[]
  title?: string
}

export function ProTipsSection({ tips, title = '💡 Pro Tips' }: ProTipsSectionProps) {
  return (
    <section style={card} aria-labelledby="pro-tips-heading">
      <h2 id="pro-tips-heading" style={h2Style}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            padding: '14px 18px',
            background: 'rgba(139,92,246,0.06)',
            borderRadius: 10,
            border: '1px solid rgba(139,92,246,0.15)',
          }}>
            <span style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--brand-2)',
              marginTop: 1,
            }}>
              {i + 1}
            </span>
            <p style={{ ...bodyText, margin: 0 }}>{tip}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── WhenToUseCards ───────────────────────────────────────────────────────────

export interface WhenToUseCard {
  title: string
  description: string
  icon?: string
}

interface WhenToUseCardsProps {
  cards: WhenToUseCard[]
  title?: string
}

export function WhenToUseCards({ cards, title = 'When to Use This Calculator' }: WhenToUseCardsProps) {
  return (
    <section style={{ ...card, marginTop: 40 }} aria-labelledby="when-to-use-heading">
      <h2 id="when-to-use-heading" style={h2Style}>{title}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
      }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            padding: '18px 20px',
            background: 'var(--bg-2)',
            borderRadius: 12,
            border: '1px solid var(--line)',
          }}>
            {c.icon && (
              <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
            )}
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--fg-1)',
              marginBottom: 6,
            }}>
              {c.title}
            </div>
            <p style={{ ...bodyText, fontSize: 13, margin: 0 }}>{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── QuickReferenceTable ──────────────────────────────────────────────────────

export interface QuickRefRow {
  input: string
  description: string
  example: string
}

interface QuickReferenceTableProps {
  rows: QuickRefRow[]
  title?: string
}

export function QuickReferenceTable({ rows, title = 'Quick Reference' }: QuickReferenceTableProps) {
  return (
    <section style={{ ...card, padding: '24px 0', overflow: 'hidden' }} aria-labelledby="quick-ref-heading">
      <h2 id="quick-ref-heading" style={{ ...h2Style, padding: '0 32px' }}>{title}</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(139,92,246,0.1)' }}>
              {['Input / Parameter', 'Description', 'Example Value'].map(col => (
                <th key={col} style={{
                  textAlign: 'left',
                  padding: '10px 20px',
                  color: 'var(--brand-2)',
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(139,92,246,0.2)',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{
                borderBottom: '1px solid var(--line)',
                background: i % 2 === 0 ? 'transparent' : 'var(--bg-2)',
              }}>
                <td style={{ padding: '10px 20px', color: 'var(--fg-1)', fontWeight: 600 }}>
                  {row.input}
                </td>
                <td style={{ padding: '10px 20px', color: 'var(--fg-2)', lineHeight: 1.6 }}>
                  {row.description}
                </td>
                <td style={{
                  padding: '10px 20px',
                  fontFamily: 'monospace',
                  color: 'var(--brand)',
                  fontSize: 12,
                }}>
                  {row.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ─── CalculatorFAQ (Accordion) ────────────────────────────────────────────────

export interface FAQ { q: string; a: string }

interface CalculatorFAQProps {
  faqs: FAQ[]
  title?: string
}

export function CalculatorFAQ({ faqs, title = 'Frequently Asked Questions' }: CalculatorFAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i)

  const handleKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(i)
    }
  }

  return (
    <section style={{ marginTop: 40 }} aria-labelledby="faq-heading">
      <h2 id="faq-heading" style={h2Style}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--line-strong)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => toggle(i)}
              onKeyDown={e => handleKey(e, i)}
              aria-expanded={open === i}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '14px 18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>
                {faq.q}
              </span>
              <span style={{
                fontSize: 18,
                color: '#8b5cf6',
                flexShrink: 0,
                transition: 'transform 0.2s',
                transform: open === i ? 'rotate(45deg)' : 'none',
              }}>
                +
              </span>
            </button>
            {open === i && (
              <div
                role="region"
                style={{
                  padding: '0 18px 14px',
                  fontSize: 13,
                  color: 'var(--fg-2)',
                  lineHeight: 1.75,
                  borderTop: '1px solid var(--line)',
                  paddingTop: 12,
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── RelatedCalculators ───────────────────────────────────────────────────────

export interface RelatedCalc {
  name: string
  slug: string
  description: string
  icon?: string
}

interface RelatedCalculatorsProps {
  calculators: RelatedCalc[]
  title?: string
}

export function RelatedCalculators({ calculators, title = 'Related Calculators' }: RelatedCalculatorsProps) {
  return (
    <section style={{ marginTop: 40 }} aria-labelledby="related-heading">
      <h2 id="related-heading" style={h2Style}>{title}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}>
        {calculators.map(c => (
          <Link key={c.slug} href={`/tools/calculators/${c.slug}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            background: 'var(--bg-1)',
            border: '1px solid var(--line-strong)',
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}>
            <span style={{
              fontSize: 22,
              flexShrink: 0,
              background: 'rgba(139,92,246,0.12)',
              borderRadius: 8,
              padding: '6px 8px',
              lineHeight: 1,
            }}>
              {c.icon ?? '🧮'}
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2, lineHeight: 1.4 }}>
                {c.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── FinancialDisclaimer ──────────────────────────────────────────────────────

interface DisclaimerProps {
  toolName?: string
  text?: string
}

export function FinancialDisclaimerBox({ toolName, text }: DisclaimerProps) {
  const defaultText = toolName
    ? `${toolName} — Results are estimates based on inputs provided and do not constitute financial, investment, or professional advice. Actual results will vary based on market conditions, individual circumstances, and other factors not captured in this calculator. Always consult a qualified financial professional before making important financial decisions.`
    : 'Results are estimates for informational purposes only and do not constitute financial, investment, or professional advice. Consult a qualified financial professional before making important financial decisions.'

  return (
    <div style={{
      background: 'rgba(245,158,11,0.07)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 12,
      padding: '16px 20px',
      marginTop: 32,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>⚠️</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', margin: '0 0 4px' }}>
          Financial Disclaimer
        </p>
        <p style={{ fontSize: 13, color: '#d97706', lineHeight: 1.65, margin: 0 }}>
          {text ?? defaultText}
        </p>
      </div>
    </div>
  )
}

// ─── MedicalCalcDisclaimer ────────────────────────────────────────────────────

export function MedicalCalcDisclaimer({ toolName, text }: DisclaimerProps) {
  const defaultText = toolName
    ? `${toolName} — Results are general estimates and screening values only. This tool does not diagnose any medical condition or replace professional medical evaluation. Always consult a qualified healthcare provider for personalised health advice and before making any health-related decisions.`
    : 'Results are general estimates and do not diagnose any medical condition. Consult a qualified healthcare provider before making health-related decisions.'

  return (
    <div style={{
      background: 'rgba(59,130,246,0.07)',
      border: '1px solid rgba(59,130,246,0.25)',
      borderRadius: 12,
      padding: '16px 20px',
      marginTop: 32,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>🩺</span>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', margin: '0 0 4px' }}>
          Medical Disclaimer
        </p>
        <p style={{ fontSize: 13, color: '#60a5fa', lineHeight: 1.65, margin: 0 }}>
          {text ?? defaultText}
        </p>
      </div>
    </div>
  )
}
