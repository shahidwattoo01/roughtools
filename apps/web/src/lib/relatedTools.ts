// ============================================================
// ROUGHTOOLS — INTERNAL LINKING SYSTEM (Phase 3.7)
// Maps every tool to 4 related tools for internal SEO linking
// "Every page shows 4 related tools"
// ============================================================

import { ALL_TOOLS, Tool, ToolCategory, getToolsByCategory } from './tools-registry';

// ─── EXPLICIT RELATED TOOL MAPPINGS ─────────────────────────
// Hand-curated for highest-traffic tools. Falls back to same-category.
const RELATED_MAP: Record<string, string[]> = {
  // PDF
  'compress-pdf': ['merge-pdf', 'split-pdf', 'pdf-to-word', 'pdf-to-jpg'],
  'merge-pdf': ['split-pdf', 'compress-pdf', 'organize-pdf', 'rotate-pdf'],
  'split-pdf': ['merge-pdf', 'extract-pdf-pages', 'remove-pdf-pages', 'compress-pdf'],
  'pdf-to-word': ['word-to-pdf', 'pdf-to-excel', 'compress-pdf', 'ocr-pdf'],
  'pdf-to-excel': ['pdf-to-word', 'excel-to-pdf', 'compress-pdf', 'ocr-pdf'],
  'word-to-pdf': ['pdf-to-word', 'excel-to-pdf', 'jpg-to-pdf', 'compress-pdf'],
  'jpg-to-pdf': ['pdf-to-jpg', 'compress-pdf', 'merge-pdf', 'word-to-pdf'],
  'pdf-to-jpg': ['jpg-to-pdf', 'compress-pdf', 'pdf-to-word', 'merge-pdf'],
  'sign-pdf': ['protect-pdf', 'watermark-pdf', 'merge-pdf', 'compress-pdf'],
  'protect-pdf': ['unlock-pdf', 'sign-pdf', 'watermark-pdf', 'compress-pdf'],
  'unlock-pdf': ['protect-pdf', 'compress-pdf', 'merge-pdf', 'split-pdf'],
  'ocr-pdf': ['compress-pdf', 'pdf-to-word', 'repair-pdf', 'rotate-pdf'],

  // Calculators
  'bmi-calculator': [
    'calorie-calculator',
    'body-fat-calculator',
    'age-calculator',
    'due-date-calculator',
  ],
  'loan-calculator': [
    'mortgage-calculator',
    'compound-interest-calculator',
    'roi-calculator',
    'salary-calculator',
  ],
  'mortgage-calculator': [
    'loan-calculator',
    'compound-interest-calculator',
    'inflation-calculator',
    'retirement-calculator',
  ],
  'compound-interest-calculator': [
    'loan-calculator',
    'retirement-calculator',
    'roi-calculator',
    'inflation-calculator',
  ],
  'age-calculator': [
    'date-difference-calculator',
    'due-date-calculator',
    'ovulation-calculator',
    'bmi-calculator',
  ],
  'percentage-calculator': [
    'discount-calculator',
    'tip-calculator',
    'tax-calculator',
    'salary-calculator',
  ],
  'currency-converter': [
    'tip-calculator',
    'percentage-calculator',
    'salary-calculator',
    'compound-interest-calculator',
  ],
  'tax-calculator': [
    'salary-calculator',
    'percentage-calculator',
    'roi-calculator',
    'retirement-calculator',
  ],
  'salary-calculator': [
    'tax-calculator',
    'tip-calculator',
    'retirement-calculator',
    'loan-calculator',
  ],
  'tip-calculator': [
    'percentage-calculator',
    'discount-calculator',
    'currency-converter',
    'tax-calculator',
  ],
  'retirement-calculator': [
    'compound-interest-calculator',
    'inflation-calculator',
    'salary-calculator',
    'roi-calculator',
  ],
  'calorie-calculator': [
    'bmi-calculator',
    'body-fat-calculator',
    'age-calculator',
    'due-date-calculator',
  ],

  // Developer
  'json-formatter': ['xml-formatter', 'yaml-validator', 'diff-checker', 'base64-encoder'],
  'base64-encoder': ['url-encoder', 'html-encoder', 'hash-generator', 'json-formatter'],
  'regex-tester': ['diff-checker', 'find-replace', 'json-formatter', 'sql-formatter'],
  'hash-generator': ['base64-encoder', 'uuid-generator', 'jwt-decoder', 'url-encoder'],
  'uuid-generator': ['hash-generator', 'timestamp-converter', 'base64-encoder', 'chmod-calculator'],
  'ip-checker': ['dns-lookup', 'whois-lookup', 'port-checker', 'http-headers-checker'],
  'color-picker': ['css-minifier', 'markdown-editor', 'json-formatter', 'diff-checker'],
  'diff-checker': ['json-formatter', 'regex-tester', 'find-replace', 'xml-formatter'],
  'jwt-decoder': ['base64-encoder', 'hash-generator', 'timestamp-converter', 'json-formatter'],

  // Text
  'word-counter': ['case-converter', 'readability-score', 'text-summarizer', 'grammar-checker'],
  'case-converter': ['word-counter', 'find-replace', 'text-reverser', 'remove-duplicate-lines'],
  'grammar-checker': ['word-counter', 'readability-score', 'text-summarizer', 'case-converter'],
  'text-summarizer': ['grammar-checker', 'word-counter', 'readability-score', 'text-to-speech'],

  // Network
  'dns-lookup': ['whois-lookup', 'ip-checker', 'port-checker', 'http-headers-checker'],
  'whois-lookup': ['dns-lookup', 'ip-checker', 'http-headers-checker', 'website-speed-test'],
  'website-speed-test': ['http-headers-checker', 'dns-lookup', 'ping-tool', 'whois-lookup'],

  // Converters
  'temperature-converter': [
    'length-converter',
    'weight-converter',
    'speed-converter',
    'volume-converter',
  ],
  'length-converter': [
    'weight-converter',
    'area-converter',
    'speed-converter',
    'temperature-converter',
  ],
  'weight-converter': [
    'length-converter',
    'area-converter',
    'digital-storage-converter',
    'speed-converter',
  ],
};

// ─── FEATURED TOOLS FOR HOMEPAGE ────────────────────────────
export const FEATURED_TOOL_SLUGS = [
  'pdf-to-word',
  'compress-pdf',
  'bmi-calculator',
  'json-formatter',
  'word-counter',
  'mortgage-calculator',
  'merge-pdf',
  'currency-converter',
  'ip-checker',
  'temperature-converter',
  'compound-interest-calculator',
  'regex-tester',
];

// ─── POPULAR TOOLS FOR HOMEPAGE HERO ────────────────────────
export const POPULAR_TOOL_SLUGS_BY_CATEGORY: Record<ToolCategory, string[]> = {
  pdf: ['compress-pdf', 'merge-pdf', 'pdf-to-word', 'split-pdf'],
  calculators: [
    'bmi-calculator',
    'mortgage-calculator',
    'compound-interest-calculator',
    'age-calculator',
  ],
  developer: ['json-formatter', 'base64-encoder', 'regex-tester', 'ip-checker'],
  text: ['word-counter', 'grammar-checker', 'case-converter', 'text-summarizer'],
  converters: [
    'temperature-converter',
    'length-converter',
    'weight-converter',
    'currency-converter',
  ],
  network: ['dns-lookup', 'whois-lookup', 'website-speed-test', 'ip-checker'],
  'legal-tools': [],
  'real-estate': [],
  'image-tools': [
    'background-remover',
    'image-compressor',
    'passport-photo-maker',
    'image-converter',
    'image-upscaler',
  ],
  security: ['qr-code-generator', 'password-generator', 'url-shortener', 'temporary-email'],
  'document-tools': [
    'invoice-generator',
    'resume-builder',
    'cover-letter-builder',
    'proposal-generator',
  ],
  environment: [],
  business: [],
  engineering: [
    'ohms-law-calculator',
    'beam-deflection-calculator',
    'gear-ratio-calculator',
    'reynolds-number-calculator',
  ],
  medical: [
    'bmi-calculator',
    'heart-score-calculator',
    'egfr-ckd-epi-calculator',
    'phq9-depression-screen',
  ],
  'iq-test': [],
  'paper-maker': [],
};

// ─── CORE FUNCTIONS ──────────────────────────────────────────

/**
 * Get 4 related tools for a given tool slug.
 * Uses curated map first, falls back to same-category tools.
 */
export function getRelatedTools(toolSlug: string, limit = 4): Tool[] {
  // 1. Check curated map
  const curatedSlugs = RELATED_MAP[toolSlug];
  if (curatedSlugs) {
    const tools = curatedSlugs
      .slice(0, limit)
      .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
      .filter((t): t is Tool => t !== undefined);

    if (tools.length === limit) return tools;
  }

  // 2. Fallback: same category, excluding self
  const currentTool = ALL_TOOLS.find((t) => t.slug === toolSlug);
  if (!currentTool) return [];

  const sameCategory = getToolsByCategory(currentTool.category)
    .filter((t) => t.slug !== toolSlug)
    .sort((a, b) => (b.priority ?? 0.5) - (a.priority ?? 0.5))
    .slice(0, limit);

  // 3. If not enough in category, fill with popular tools from other categories
  if (sameCategory.length < limit) {
    const others = ALL_TOOLS.filter(
      (t) => t.slug !== toolSlug && t.category !== currentTool.category && t.popular
    ).slice(0, limit - sameCategory.length);

    return [...sameCategory, ...others];
  }

  return sameCategory;
}

/**
 * Get all tools to show on a category page.
 * Sorted by priority (popular first).
 */
export function getCategoryTools(category: ToolCategory): Tool[] {
  return getToolsByCategory(category).sort((a, b) => (b.priority ?? 0.5) - (a.priority ?? 0.5));
}

/**
 * Get featured tools for homepage.
 */
export function getFeaturedTools(limit = 12): Tool[] {
  return FEATURED_TOOL_SLUGS.slice(0, limit)
    .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
    .filter((t): t is Tool => t !== undefined);
}

/**
 * Get popular tools per category for homepage sections.
 */
export function getHomepageSections(): Array<{
  category: ToolCategory;
  tools: Tool[];
}> {
  return (Object.entries(POPULAR_TOOL_SLUGS_BY_CATEGORY) as [ToolCategory, string[]][])
    .filter(([, slugs]) => slugs.length > 0)
    .map(([category, slugs]) => ({
      category,
      tools: slugs
        .map((slug) => ALL_TOOLS.find((t) => t.slug === slug))
        .filter((t): t is Tool => t !== undefined),
    }));
}
