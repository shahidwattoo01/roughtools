import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export interface SocialLinks {
  twitter: string;
  github: string;
  linkedin: string;
}

const SOCIAL_KEYS = ['social.twitter', 'social.github', 'social.linkedin'] as const;

export const getSocialLinks = unstable_cache(
  async (): Promise<SocialLinks> => {
    try {
      const rows = await prisma.siteConfig.findMany({
        where: { key: { in: [...SOCIAL_KEYS] } },
      });
      const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      const clean = (v: string | undefined) => (v && !v.includes('undefined') ? v : '');
      return {
        twitter: clean(map['social.twitter']),
        github: clean(map['social.github']),
        linkedin: clean(map['social.linkedin']),
      };
    } catch {
      return { twitter: '', github: '', linkedin: '' };
    }
  },
  ['social-links'],
  { revalidate: 60, tags: ['site-config'] }
);

export async function setSocialLinks(links: Partial<SocialLinks>): Promise<void> {
  const updates = Object.entries(links)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) =>
      prisma.siteConfig.upsert({
        where: { key: `social.${k}` },
        update: { value: v as string },
        create: { key: `social.${k}`, value: v as string },
      })
    );
  await Promise.all(updates);
}
