import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { JsonLd } from '@/components/JsonLd'
import { FeaturedPost, PostGrid } from './BlogPostCards'
import ToolAdUnit from '@/components/ToolAdUnit'

export const metadata: Metadata = {
  title: 'Blog — Free Tools Guides, Tips & Tutorials | RoughTools',
  description: 'Guides and tutorials for PDF tools, calculators, developer utilities, security, and productivity. Learn how to get the most out of free online tools.',
  alternates: { canonical: 'https://roughtools.com/blog' },
  openGraph: {
    title: 'RoughTools Blog — Tools Guides & Tutorials',
    description: 'Tips, guides, and tutorials for free online tools.',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'RoughTools Blog',
    url: 'https://roughtools.com/blog',
    description: 'Guides, tips, and tutorials for free online tools.',
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://roughtools.com/blog/${post.slug}`,
      datePublished: post.date,
      description: post.excerpt,
      author: { '@type': 'Organization', name: 'RoughTools' },
    })),
  }

  return (
    <>
      <JsonLd data={[blogListSchema]} />
      <div style={{ minHeight: '100vh', background: 'var(--bg, #0a0a1a)', color: 'var(--white, #fff)' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #0a0a1a 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '64px 24px 48px', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 20, letterSpacing: 1 }}>
              ROUGHTOOLS BLOG
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
              Guides, Tips &amp; Tutorials
            </h1>
            <p style={{ fontSize: 18, color: '#888', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
              Learn how to use free online tools effectively. PDF guides, calculator tutorials, security tips, and developer tricks.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
          <ToolAdUnit position="top" />
          <FeaturedPost post={featured} />
          <PostGrid posts={rest} />
          <ToolAdUnit position="bottom" />
        </div>
      </div>
    </>
  )
}
