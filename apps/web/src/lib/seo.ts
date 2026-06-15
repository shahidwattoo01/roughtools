import { Metadata } from 'next'
import { SEO_CONFIG, CATEGORY_SEO } from './seo-config'
import { Tool, ToolCategory } from './tools-registry'

// ============================================================
// ROUGHTOOLS — SEO UTILITIES
// Generates consistent metadata for all pages
// ============================================================

const { siteName, siteUrl, twitterHandle } = SEO_CONFIG

/** Generate metadata for homepage */
export function generateHomeMetadata(): Metadata {
  const title = SEO_CONFIG.defaultTitle
  const description = SEO_CONFIG.defaultDescription

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: SEO_CONFIG.defaultKeywords,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title,
      description,
      siteName,
      locale: SEO_CONFIG.locale,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${siteName} — Free Online Tools`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: twitterHandle,
      site: twitterHandle,
      images: [`${siteUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  }
}

/** Generate metadata for a category page */
export function generateCategoryMetadata(category: ToolCategory): Metadata {
  const categorySeo = CATEGORY_SEO[category]
  const canonicalUrl = `${siteUrl}/tools/${category}`

  if (!categorySeo) {
    return {
      title: `${category} Tools | ${siteName}`,
      description: `Free online ${category} tools`,
    }
  }

  return {
    title: categorySeo.title,
    description: categorySeo.description,
    keywords: categorySeo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: categorySeo.title,
      description: categorySeo.description,
      siteName,
      images: [
        {
          url: `${siteUrl}/tools/${category}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: categorySeo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: categorySeo.title,
      description: categorySeo.description,
      creator: twitterHandle,
      site: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/** Generate metadata for an individual tool page */
export function generateToolMetadata(tool: Tool): Metadata {
  const canonicalUrl = `${siteUrl}/tools/${tool.category}/${tool.slug}`

  // Title pattern: "[Tool Name] — Free Online Tool | RoughTools"
  const title = `${tool.name} — Free Online Tool | ${siteName}`
  const description = tool.description

  return {
    title,
    description,
    keywords: [...tool.keywords, 'free online tool', 'roughtools', tool.category],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName,
      images: [
        {
          url: `${siteUrl}/tools/${tool.category}/${tool.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: twitterHandle,
      site: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  }
}

/** Generate metadata for blog post */
export function generateBlogMetadata(params: {
  title: string
  description: string
  slug: string
  publishedAt: Date
  updatedAt?: Date
  author?: string
  tags?: string[]
  ogImage?: string
}): Metadata {
  const { title, description, slug, publishedAt, updatedAt, author, tags, ogImage } = params
  const canonicalUrl = `${siteUrl}/blog/${slug}`
  const fullTitle = `${title} | ${siteName} Blog`

  return {
    title: fullTitle,
    description,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName,
      publishedTime: publishedAt.toISOString(),
      modifiedTime: updatedAt?.toISOString(),
      authors: author ? [author] : undefined,
      tags,
      images: [
        {
          url: ogImage || `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: twitterHandle,
    },
  }
}

/** Generate metadata for pricing page */
export function generatePricingMetadata(): Metadata {
  const title = `Pricing — Free vs Pro vs Team | ${siteName}`
  const description =
    'Start free. Upgrade to Pro for $9/month for unlimited uses, 200MB files, no watermarks, and full history. Team plan at $29/month for 5 seats.'
  const canonicalUrl = `${siteUrl}/pricing`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

/** Get breadcrumb label for a category */
export function getCategoryLabel(category: ToolCategory): string {
  const labels: Record<ToolCategory, string> = {
    pdf: 'PDF Tools',
    calculators: 'Calculators',
    developer: 'Developer Tools',
    text: 'Text Tools',
    converters: 'Unit Converters',
    network: 'Network Tools',
    'legal-tools': 'Legal Tools',
    'real-estate': 'Real Estate Tools',
    'image-tools': 'Image Tools',
    security: 'Security & Privacy Tools',
    'document-tools': 'Document Tools',
    environment: 'Environment & Eco Tools',
    business: 'Business & Marketing Tools',
    engineering: 'Engineering Tools',
    medical: 'Medical & Health Tools',
    'iq-test': 'IQ Test',
  }
  return labels[category] || category
}