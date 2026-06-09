/**
 * ResultRow — god node with 25 edges.
 * Renders every line in every calculator's results panel. If the label or value
 * disappears from the output, every calculator silently shows blank results.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ResultRow } from '@/components/ui'

describe('ResultRow', () => {

  // ── Core contract: label and value must always be visible ─────────────────

  it('renders the label text', () => {
    render(<ResultRow label="Monthly Payment" value={188.71} />)
    expect(screen.getByText('Monthly Payment')).toBeInTheDocument()
  })

  it('renders the value', () => {
    render(<ResultRow label="Monthly Payment" value={188.71} />)
    expect(screen.getByText('188.71')).toBeInTheDocument()
  })

  it('renders a string value', () => {
    render(<ResultRow label="Category" value="Normal weight" />)
    expect(screen.getByText('Normal weight')).toBeInTheDocument()
  })

  it('renders a numeric value of 0', () => {
    render(<ResultRow label="Total Interest" value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  // ── Optional unit ─────────────────────────────────────────────────────────

  it('renders unit when provided', () => {
    render(<ResultRow label="Rate" value={5.25} unit="%" />)
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('does not render a unit element when unit is omitted', () => {
    const { container } = render(<ResultRow label="Rate" value={5.25} />)
    // No span with font-size 12 containing a unit should appear
    const spans = container.querySelectorAll('span')
    // The value span and label span are present; no unit span
    for (const span of spans) {
      expect(span.textContent).not.toBe('%')
    }
  })

  // ── Highlight variant ─────────────────────────────────────────────────────

  it('applies larger font-size to value when highlight=true', () => {
    const { container } = render(
      <ResultRow label="Total" value={9999} highlight />
    )
    // The value is the second span; highlight gives it fontSize 20
    const spans = container.querySelectorAll('span')
    const valueSpan = spans[1] as HTMLElement
    expect(valueSpan.style.fontSize).toBe('20px')
  })

  it('applies normal font-size to value when highlight is not set', () => {
    const { container } = render(<ResultRow label="Fee" value={50} />)
    const spans = container.querySelectorAll('span')
    const valueSpan = spans[1] as HTMLElement
    expect(valueSpan.style.fontSize).toBe('15px')
  })

  // ── Layout ────────────────────────────────────────────────────────────────

  it('renders as a flex container with space-between', () => {
    const { container } = render(<ResultRow label="Test" value="ok" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.display).toBe('flex')
    expect(wrapper.style.justifyContent).toBe('space-between')
  })

  // ── Snapshot ──────────────────────────────────────────────────────────────

  it('matches snapshot for a standard result row', () => {
    const { container } = render(
      <ResultRow label="Monthly Payment" value={188.71} unit="$" highlight />
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
