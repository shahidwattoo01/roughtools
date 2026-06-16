import { getToolsByCategory } from '@/lib/tools-registry';
import { buildSitemapXml } from '@/lib/sitemap-xml';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com';

export function GET() {
  const now = new Date();
  const tools = getToolsByCategory('network');

  const entries = tools.map((tool) => ({
    url: `${BASE_URL}/tools/network/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: tool.priority ?? 0.8,
  }));

  return new Response(buildSitemapXml(entries), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
