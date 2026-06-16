import { MetadataRoute } from 'next';

export function buildSitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((entry) => {
      const lastMod =
        entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;

      return `  <url>
    <loc>${entry.url}</loc>${lastMod ? `\n    <lastmod>${lastMod}</lastmod>` : ''}${entry.changeFrequency ? `\n    <changefreq>${entry.changeFrequency}</changefreq>` : ''}${entry.priority !== undefined ? `\n    <priority>${entry.priority}</priority>` : ''}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
