import { buildSitemapXml } from '@/lib/sitemap-xml';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com';

// ============================================================
// Real Estate Tools Directory — 42 pages (Phase 12)
// Directory pages for external real estate tools
// ============================================================

const REAL_ESTATE_TOOLS = [
  'zillow',
  'realtor',
  'redfin',
  'trulia',
  'homes',
  'mls',
  'bright-mls',
  'corelogic',
  'first-american',
  'black-knight',
  'dotloop',
  'transaction-desk',
  'skyslope',
  'lone-wolf',
  'authentisign',
  'propertybase',
  'follow-up-boss',
  'kvcore',
  'lofty',
  'top-producer',
  'buildium',
  'appfolio',
  'propertyware',
  'yardi',
  'rent-manager',
  'costar',
  'loopnet',
  'crexi',
  'reonomy',
  'buildout',
  'compass',
  'moxiworks',
  'boomtown',
  'real-geeks',
  'sierra-interactive',
  'homelight',
  'opcity',
  'ylopo',
  'structurely',
  'zurple',
  'rpr',
  'cloud-cma',
];

export function GET() {
  const now = new Date();

  const entries = REAL_ESTATE_TOOLS.map((slug) => ({
    url: `${BASE_URL}/tools/real-estate/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return new Response(buildSitemapXml(entries), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
