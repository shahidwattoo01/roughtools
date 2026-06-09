import { getCalcSEO, CalcSEOConfig } from '@/app/tools/calculators/_components/calc-seo-configs'

// ─── getCalcSEO ───────────────────────────────────────────────────────────────
// God node with 50 edges: every calculator page calls this to get its metadata.
// A broken return here means broken titles, descriptions, and SEO for ALL calcs.

describe('getCalcSEO', () => {

  // ── Shape ──────────────────────────────────────────────────────────────────

  it('returns a defined object for a known slug', () => {
    const result = getCalcSEO('auto-loan-calculator')
    expect(result).toBeDefined()
  })

  it('returns undefined for an unknown slug', () => {
    expect(getCalcSEO('this-slug-does-not-exist')).toBeUndefined()
  })

  it('returns an object with all required shape fields', () => {
    const result = getCalcSEO('auto-loan-calculator') as CalcSEOConfig

    expect(typeof result.slug).toBe('string')
    expect(typeof result.seoTitle).toBe('string')
    expect(typeof result.metaDescription).toBe('string')
    expect(typeof result.pageDescription).toBe('string')
    expect(typeof result.badge).toBe('string')
    expect(Array.isArray(result.howToUse)).toBe(true)
    expect(Array.isArray(result.faqs)).toBe(true)
    expect(Array.isArray(result.relatedSlugs)).toBe(true)
  })

  // ── Content quality ────────────────────────────────────────────────────────

  it('seoTitle is a non-empty string', () => {
    const result = getCalcSEO('auto-loan-calculator') as CalcSEOConfig
    expect(result.seoTitle.length).toBeGreaterThan(0)
  })

  it('metaDescription is between 100 and 160 characters', () => {
    const result = getCalcSEO('auto-loan-calculator') as CalcSEOConfig
    expect(result.metaDescription.length).toBeGreaterThanOrEqual(100)
    expect(result.metaDescription.length).toBeLessThanOrEqual(160)
  })

  it('slug in the returned object matches the slug passed in', () => {
    const slug = 'auto-loan-calculator'
    const result = getCalcSEO(slug) as CalcSEOConfig
    expect(result.slug).toBe(slug)
  })

  // ── Brand integrity: must reference roughtools.com, never toolverse.app ───

  it('seoTitle does not reference the old brand domain toolverse.app', () => {
    const result = getCalcSEO('auto-loan-calculator') as CalcSEOConfig
    expect(result.seoTitle).not.toMatch(/toolverse\.app/i)
  })

  it('metaDescription does not reference toolverse.app', () => {
    const result = getCalcSEO('auto-loan-calculator') as CalcSEOConfig
    expect(result.metaDescription).not.toMatch(/toolverse\.app/i)
  })

  it('canonical URL built from slug points to roughtools.com not toolverse.app', () => {
    const result = getCalcSEO('bmi-calculator') as CalcSEOConfig
    const canonical = `https://roughtools.com/tools/calculators/${result.slug}`
    expect(canonical).toContain('roughtools.com')
    expect(canonical).not.toContain('toolverse.app')
  })

  // ── FAQ structure ──────────────────────────────────────────────────────────

  it('every FAQ entry has a non-empty q and a string', () => {
    const result = getCalcSEO('bmi-calculator') as CalcSEOConfig
    expect(result.faqs.length).toBeGreaterThan(0)
    for (const faq of result.faqs) {
      expect(typeof faq.q).toBe('string')
      expect(faq.q.length).toBeGreaterThan(0)
      expect(typeof faq.a).toBe('string')
      expect(faq.a.length).toBeGreaterThan(0)
    }
  })

  // ── Multiple slugs from different categories ───────────────────────────────

  it.each([
    'auto-loan-calculator',
    'bmi-calculator',
    'compound-interest-calculator',
    'tip-calculator',
    'age-calculator',
  ])('returns a valid config for %s', (slug) => {
    const result = getCalcSEO(slug)
    expect(result).toBeDefined()
    expect(result!.slug).toBe(slug)
    expect(result!.seoTitle.length).toBeGreaterThan(0)
  })
})
