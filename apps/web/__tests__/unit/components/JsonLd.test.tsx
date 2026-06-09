import React from 'react'
import { render } from '@testing-library/react'
import { JsonLd } from '@/components/JsonLd'

const BASE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Test Tool',
}

describe('JsonLd', () => {
  // ── Test 1: correct script type attribute ─────────────────────────────────
  it('renders a script tag with type="application/ld+json"', () => {
    const { container } = render(<JsonLd data={BASE_SCHEMA} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('type', 'application/ld+json')
  })

  // ── Test 2: script content is valid parseable JSON ─────────────────────────
  it('renders valid, parseable JSON in the script tag', () => {
    const { container } = render(<JsonLd data={BASE_SCHEMA} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    // Must not throw — malformed JSON here breaks every tool page's rich results
    expect(() => JSON.parse(script!.innerHTML)).not.toThrow()

    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('WebApplication')
    expect(parsed.name).toBe('Test Tool')
  })

  // ── Test 3: array of schemas renders one script tag per schema ────────────
  it('renders one <script> per schema when passed an array', () => {
    const schemas = [
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Tool A' },
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'RoughTools' },
    ]
    const { container } = render(<JsonLd data={schemas} />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')

    expect(scripts).toHaveLength(2)

    const first = JSON.parse(scripts[0].innerHTML)
    expect(first['@type']).toBe('WebApplication')
    expect(first.name).toBe('Tool A')

    const second = JSON.parse(scripts[1].innerHTML)
    expect(second['@type']).toBe('Organization')
    expect(second.name).toBe('RoughTools')
  })

  // ── Test 4: single object does not produce multiple script tags ───────────
  it('renders exactly one <script> tag for a single schema object', () => {
    const { container } = render(<JsonLd data={BASE_SCHEMA} />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts).toHaveLength(1)
  })

  // ── Test 5: deeply nested schemas serialize without loss ──────────────────
  it('serializes nested schema objects correctly', () => {
    const complex = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'PDF Compressor',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://roughtools.com/search?q={q}' },
      },
    }
    const { container } = render(<JsonLd data={complex} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(() => JSON.parse(script!.innerHTML)).not.toThrow()

    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed.offers['@type']).toBe('Offer')
    expect(parsed.offers.price).toBe('0')
    expect(parsed.potentialAction.target.urlTemplate).toBe(
      'https://roughtools.com/search?q={q}'
    )
  })

  // ── Test 6: special characters in values do not break JSON output ─────────
  it('handles special characters in schema values without breaking JSON', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Tool with "quotes" & <brackets>',
      description: "It's a tool with a backslash: \\end",
    }
    const { container } = render(<JsonLd data={schema} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(() => JSON.parse(script!.innerHTML)).not.toThrow()

    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed.name).toBe('Tool with "quotes" & <brackets>')
    expect(parsed.description).toBe("It's a tool with a backslash: \\end")
  })

  // ── Test 7: empty array renders nothing ──────────────────────────────────
  it('renders no script tags when passed an empty array', () => {
    const { container } = render(<JsonLd data={[]} />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts).toHaveLength(0)
  })
})
