/**
 * Guard tests for tool counts.
 *
 * BACKGROUND: calculators live in calculator-tool-configs.ts (203 entries),
 * but the registry (ALL_TOOLS) historically hand-listed only ~21. Several
 * count constants are duplicated across files for client-bundle reasons.
 * These tests fail the build if any of those sources ever drift apart,
 * so the "21 vs 203" mismatch can never silently come back.
 */
import { ALL_TOOLS, TOTAL_REAL_TOOLS as REGISTRY_TOTAL } from '@/lib/tools-registry'
import {
  TOTAL_CALC_COUNT as COUNTS_CALC,
  TOTAL_REAL_TOOLS as COUNTS_TOTAL,
} from '@/lib/tool-counts'
import {
  CALC_SUBCATEGORIES,
  TOTAL_CALC_COUNT as SOURCE_CALC,
} from '@/app/tools/calculators/_components/calculator-tool-configs'

describe('tool counts stay in sync', () => {
  const sourceCalcCount = CALC_SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)

  it('calculator config self-count matches its subcategory totals', () => {
    expect(SOURCE_CALC).toBe(sourceCalcCount)
  })

  it('the lightweight UI calc count matches the calculator source', () => {
    expect(COUNTS_CALC).toBe(sourceCalcCount)
  })

  it('ALL_TOOLS contains every calculator (no under-counting)', () => {
    const calcInRegistry = ALL_TOOLS.filter((t) => t.category === 'calculators').length
    expect(calcInRegistry).toBe(sourceCalcCount)
  })

  it('the two TOTAL_REAL_TOOLS constants agree', () => {
    expect(COUNTS_TOTAL).toBe(REGISTRY_TOTAL)
  })

  it('registry has no duplicate pages (category + slug) after deriving calculators', () => {
    // Slug alone is intentionally not unique — some tools (e.g. bmi-calculator)
    // exist in multiple categories as distinct pages. The real invariant is
    // that each category+slug pair (i.e. each URL) is unique.
    const keys = ALL_TOOLS.map((t) => `${t.category}/${t.slug}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
