import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'

// ─── MDX component map — matches the existing dark-theme article styles ───────

const mdxComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#e0e0ff', margin: '40px 0 16px', letterSpacing: -0.5 }}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#c0c0ff', margin: '28px 0 10px' }}>
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ margin: '0 0 16px', color: '#aaa', lineHeight: 1.8 }}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ margin: '0 0 16px', paddingLeft: 24, color: '#aaa' }}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ margin: '0 0 16px', paddingLeft: 24, color: '#aaa' }}>{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ marginBottom: 8, lineHeight: 1.7 }}>{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ color: '#e0e0ff', fontWeight: 700 }}>{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} style={{ color: '#818cf8', textDecoration: 'underline' }}>{children}</a>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code style={{ background: 'rgba(99,102,241,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 13, color: '#a5b4fc' }}>
      {children}
    </code>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0', fontSize: 14 }}>{children}</table>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead style={{ background: 'rgba(99,102,241,0.15)' }}>{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#a5b4fc', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#999' }}>
      {children}
    </td>
  ),
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: `${post.title} | RoughTools Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `https://roughtools.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const publishDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const allPosts = getAllPosts()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://roughtools.com/blog/${post.slug}`,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'RoughTools', url: 'https://roughtools.com' },
    publisher: { '@type': 'Organization', name: 'RoughTools', url: 'https://roughtools.com' },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
  }

  return (
    <>
      <JsonLd data={[articleSchema]} />
      <div style={{ minHeight: '100vh', background: 'var(--bg, #0a0a1a)', color: 'var(--white, #fff)' }}>

        {/* Article header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #0a0a1a 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 40px' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <nav style={{ fontSize: 13, color: '#555', marginBottom: 24 }}>
              <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
              {' › '}
              <Link href="/blog" style={{ color: '#555', textDecoration: 'none' }}>Blog</Link>
              {' › '}
              <span style={{ color: '#888' }}>{post.category}</span>
            </nav>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 1.5, marginBottom: 16 }}>
              {post.category.toUpperCase()}
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: -1, marginBottom: 20, color: '#f0f0ff' }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 18, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
              {post.excerpt}
            </p>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#555', flexWrap: 'wrap' }}>
              <span>By {post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>{publishDate}</time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 740, margin: '0 auto', padding: '40px 24px 80px' }}>
          <ToolAdUnit position="top" />

          {/* MDX article content */}
          <article style={{ color: '#ccc', lineHeight: 1.8, fontSize: 16 }}>
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          <ToolAdUnit position="bottom" />

          {/* Related posts */}
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#e0e0ff' }}>More Articles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {allPosts.filter(p => p.slug !== post.slug).slice(0, 4).map(related => (
                <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{related.category.toUpperCase()}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#ccc' }}>{related.title}</div>
                    </div>
                    <span style={{ color: '#555', fontSize: 18, flexShrink: 0, marginLeft: 16 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6366f1', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              ← Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
