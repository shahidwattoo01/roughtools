// ============================================================
// ROUGHTOOLS â€” OG IMAGE UTILITIES
// Helpers for dynamic Open Graph image generation
// ============================================================

import { ToolCategory } from './tools-registry'

export const OG_CATEGORY_GRADIENTS: Record<ToolCategory, { from: string; to: string }> = {
  pdf: { from: '#ef4444', to: '#b91c1c' },
  calculators: { from: '#3b82f6', to: '#1d4ed8' },
  developer: { from: '#8b5cf6', to: '#6d28d9' },
  text: { from: '#10b981', to: '#047857' },
  converters: { from: '#f97316', to: '#c2410c' },
  network: { from: '#06b6d4', to: '#0e7490' },
  'legal-tools': { from: '#64748b', to: '#334155' },
  'real-estate': { from: '#f59e0b', to: '#b45309' },
  'image-tools': { from: '#ec4899', to: '#be185d' },
  security: { from: '#14b8a6', to: '#0f766e' },
  'document-tools': { from: '#6366f1', to: '#4338ca' },
  environment: { from: '#10b981', to: '#065f46' },
  business: { from: '#7c3aed', to: '#4c1d95' },
  engineering: { from: '#0ea5e9', to: '#1e40af' },
  medical: { from: '#10b981', to: '#065f46' },
  'iq-test': { from: '#a21caf', to: '#581c87' },
}

export const OG_CATEGORY_EMOJIS: Record<ToolCategory, string> = {
  pdf: 'ðŸ“„',
  calculators: 'ðŸ§®',
  developer: 'ðŸ’»',
  text: 'âœï¸',
  converters: 'ðŸ”„',
  network: 'ðŸŒ',
  'legal-tools': 'âš–ï¸',
  'real-estate': 'ðŸ ',
  'image-tools': 'ðŸ–¼ï¸',
  security: 'ðŸ”’',
  'document-tools': 'ðŸ“‹',
  environment: 'ðŸŒ±',
  business: 'ðŸ’¼',
  engineering: 'âš™ï¸',
  medical: 'ðŸ©º',
  'iq-test': 'ðŸ§ ',
}

export const OG_CATEGORY_LABELS: Record<ToolCategory, string> = {
  pdf: 'PDF Tools',
  calculators: 'Calculators',
  developer: 'Developer Tools',
  text: 'Text Tools',
  converters: 'Unit Converters',
  network: 'Network Tools',
  'legal-tools': 'Legal Tools Directory',
  'real-estate': 'Real Estate Tools Directory',
  'image-tools': 'Image Tools',
  security: 'Security & Privacy Tools',
  'document-tools': 'Document Tools',
  environment: 'Environment & Eco Tools',
  business: 'Business & Marketing Tools',
  engineering: 'Engineering Tools',
  medical: 'Medical & Health Tools',
  'iq-test': 'IQ Test â€” Cognitive Assessment',
}

/** Get OG image URL for a tool */
export function getToolOgImageUrl(category: string, slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'
  return `${base}/tools/${category}/${slug}/opengraph-image`
}

/** Get OG image URL for a category */
export function getCategoryOgImageUrl(category: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'
  return `${base}/tools/${category}/opengraph-image`
}