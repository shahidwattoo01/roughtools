import { pdfTools } from '@/data/pdfTools';
import { buildSitemapXml } from '@/lib/sitemap-xml';

export function GET() {
  const now = new Date();

  const entries = pdfTools.map((tool) => ({
    url: tool.canonicalUrl,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return new Response(buildSitemapXml(entries), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
