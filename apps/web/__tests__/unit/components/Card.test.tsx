/**
 * Card — god node with 25 edges.
 * Used as the primary layout wrapper in every calculator widget. A structural
 * change here ripples across the entire calculator UI simultaneously.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui'

describe('Card', () => {

  // ── Snapshot: intentional change gate ────────────────────────────────────
  // Fails if anyone restructures the Card DOM without reviewing the diff.

  it('matches snapshot with minimal props', () => {
    const { container } = render(<Card>Snapshot content</Card>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot with accent prop enabled', () => {
    const { container } = render(<Card accent>Accent card</Card>)
    expect(container.firstChild).toMatchSnapshot()
  })

  // ── Rendering ────────────────────────────────────────────────────────────

  it('renders children', () => {
    render(<Card>Hello Card</Card>)
    expect(screen.getByText('Hello Card')).toBeInTheDocument()
  })

  it('renders nested children', () => {
    render(
      <Card>
        <span data-testid="inner">inner content</span>
      </Card>
    )
    expect(screen.getByTestId('inner')).toBeInTheDocument()
  })

  // ── Styling variants ─────────────────────────────────────────────────────

  it('applies default (non-accent) background style', () => {
    const { container } = render(<Card>Default</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.style.background).toContain('rgba(255,255,255,0.03)')
  })

  it('applies accent background and border style when accent=true', () => {
    const { container } = render(<Card accent>Accented</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.style.background).toContain('rgba(139,92,246,0.1)')
    expect(div.style.border).toContain('rgba(139,92,246,0.35)')
  })

  it('merges custom inline style with default styles', () => {
    const { container } = render(<Card style={{ marginTop: '16px' }}>Styled</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.style.marginTop).toBe('16px')
    // Default styles still applied
    expect(div.style.borderRadius).toBe('14px')
  })

  it('forwards className to the wrapper div', () => {
    const { container } = render(<Card className="my-custom-class">Classed</Card>)
    const div = container.firstChild as HTMLElement
    expect(div.className).toBe('my-custom-class')
  })

  // ── Accessibility ────────────────────────────────────────────────────────

  it('renders as a div element', () => {
    const { container } = render(<Card>Div check</Card>)
    expect(container.firstChild!.nodeName).toBe('DIV')
  })
})
