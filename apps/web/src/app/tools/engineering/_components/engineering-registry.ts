// ============================================================
// ENGINEERING CALCULATOR REGISTRY
// Single lookup point — merges legacy configs + rich configs.
// Rich configs take precedence (calculateRich present).
// ============================================================

import { ENGINEERING_CONFIGS, getFallbackConfig } from './engineering-configs'
import type { EngineeringCalcConfig } from './engineering-configs'
import { RICH_ENGINEERING_CONFIGS } from './engineering-rich-configs'

const REGISTRY: Record<string, EngineeringCalcConfig> = {
  ...ENGINEERING_CONFIGS,
  ...RICH_ENGINEERING_CONFIGS,
}

export function getEngineeringConfig(slug: string, toolName: string): EngineeringCalcConfig {
  return REGISTRY[slug] ?? getFallbackConfig(slug, toolName)
}

export { REGISTRY as ENGINEERING_REGISTRY }
