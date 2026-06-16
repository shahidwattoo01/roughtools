import { buildSitemapXml } from '@/lib/sitemap-xml';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com';

// ============================================================
// Legal Tools Directory — 50 pages (Phase 12)
// These are directory pages for external legal tools, not RoughTools tools
// ============================================================

const LEGAL_TOOLS = [
  'clio',
  'mycase',
  'practicepanther',
  'smokeball',
  'filevine',
  'litify',
  'casetext',
  'westlaw',
  'lexisnexis',
  'fastcase',
  'relativity',
  'logikcull',
  'everlaw',
  'nuix',
  'reveal',
  'litera',
  'contract-express',
  'document-automation-by-business-integrity',
  'highq',
  'netdocuments',
  'imanage',
  'worldox',
  'filevault',
  'docuware',
  'laserfiche',
  'lawmatics',
  'lexicata',
  'lawyaw',
  'juro',
  'ironclad',
  'docusign',
  'hellosign',
  'adobe-sign',
  'pandadoc',
  'rightSignature',
  'aderant',
  'legal-tracker',
  'brightflag',
  'apperio',
  'ravn',
  'kira',
  'luminance',
  'diligence-engine',
  'lawgeex',
  'evisort',
  'legal-hold-pro',
  'zylab',
  'disco',
  'exterro',
  'zapproved',
];

export function GET() {
  const now = new Date();

  const entries = LEGAL_TOOLS.map((slug) => ({
    url: `${BASE_URL}/tools/legal-tools/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return new Response(buildSitemapXml(entries), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
