// ============================================================
// ROUGHTOOLS — STRUCTURED DATA (JSON-LD)
// Schema.org markup for better SEO & rich snippets
// ============================================================

import { Tool, ToolCategory } from './tools-registry'
import { SEO_CONFIG } from './seo-config'

const { siteUrl, siteName } = SEO_CONFIG

// ─── WEBSITE SCHEMA ─────────────────────────────────────────
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─── ORGANIZATION SCHEMA ────────────────────────────────────
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 200,
      height: 60,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'shahidwattoo0111@gmail.com',
      availableLanguage: 'English',
    },
  }
}

// ─── TOOL PAGE SCHEMA ────────────────────────────────────────
export function getToolPageSchema(tool: Tool) {
  const toolUrl = `${siteUrl}/tools/${tool.category}/${tool.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: toolUrl,
    description: tool.description,
    applicationCategory: getCategoryApplicationType(tool.category),
    operatingSystem: 'All — Web Browser',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to use with 20 uses/day limit',
    },
    creator: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    featureList: tool.keywords,
    keywords: tool.keywords.join(', '),
    inLanguage: 'en',
  }
}

// ─── BREADCRUMB SCHEMA ───────────────────────────────────────
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ─── FAQ SCHEMA ──────────────────────────────────────────────
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ─── TOOL CATEGORY PAGE SCHEMA ───────────────────────────────
export function getCategoryPageSchema(
  category: ToolCategory,
  title: string,
  description: string,
  tools: Tool[]
) {
  const categoryUrl = `${siteUrl}/tools/${category}`

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: categoryUrl,
    description,
    hasPart: tools.slice(0, 10).map((tool) => ({
      '@type': 'WebApplication',
      name: tool.name,
      url: `${siteUrl}/tools/${tool.category}/${tool.slug}`,
      description: tool.description,
    })),
  }
}

// ─── BLOG POST SCHEMA ────────────────────────────────────────
export function getBlogPostSchema(params: {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author?: string
  ogImage?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.title,
    description: params.description,
    url: `${siteUrl}/blog/${params.slug}`,
    datePublished: params.publishedAt,
    dateModified: params.updatedAt || params.publishedAt,
    author: {
      '@type': 'Person',
      name: params.author || siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    image: params.ogImage || `${siteUrl}/og-image.png`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${params.slug}`,
    },
  }
}

// ─── HOW-TO SCHEMA ───────────────────────────────────────────
/** For tool how-to guides / instructions */
export function getHowToSchema(params: {
  toolName: string
  toolUrl: string
  steps: Array<{ name: string; text: string }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${params.toolName}`,
    url: params.toolUrl,
    step: params.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

// ─── TOOL COMPARISON SCHEMA ──────────────────────────────────
export function getComparisonPageSchema(tool1: Tool, tool2: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComparisonTable',
    name: `${tool1.name} vs ${tool2.name}`,
    url: `${siteUrl}/compare/${tool1.slug}-vs-${tool2.slug}`,
    about: [
      {
        '@type': 'WebApplication',
        name: tool1.name,
        url: `${siteUrl}/tools/${tool1.category}/${tool1.slug}`,
      },
      {
        '@type': 'WebApplication',
        name: tool2.name,
        url: `${siteUrl}/tools/${tool2.category}/${tool2.slug}`,
      },
    ],
  }
}

// ─── PRICING SCHEMA ──────────────────────────────────────────
export function getPricingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    url: siteUrl,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Forever',
        price: '0',
        priceCurrency: 'USD',
        description: '604+ tools, no signup required, no watermarks',
      },
    ],
  }
}

// ─── HELPER ──────────────────────────────────────────────────
function getCategoryApplicationType(category: ToolCategory): string {
  const types: Record<ToolCategory, string> = {
    pdf: 'UtilitiesApplication',
    calculators: 'FinanceApplication',
    developer: 'DeveloperApplication',
    text: 'UtilitiesApplication',
    converters: 'UtilitiesApplication',
    network: 'NetworkingApplication',
    'legal-tools': 'BusinessApplication',
    'real-estate': 'BusinessApplication',
    'image-tools': 'MultimediaApplication',
    security: 'SecurityApplication',
    'document-tools': 'BusinessApplication',
    environment: 'UtilitiesApplication',
    business: 'BusinessApplication',
    engineering: 'UtilitiesApplication',
    medical: 'HealthApplication',
    'iq-test': 'UtilitiesApplication',
  }
  return types[category] || 'WebApplication'
}