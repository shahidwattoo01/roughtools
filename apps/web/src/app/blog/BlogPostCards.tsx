'use client'

import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/blog'

const CATEGORY_COLORS: Record<string, string> = {
  'PDF Tools': '#6366f1',
  'Calculators': '#10b981',
  'Developer Tools': '#f59e0b',
  'Security': '#ef4444',
  'Converters': '#06b6d4',
}

export function FeaturedPost({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 40 }}>
      <article
        className="blog-featured-card"
        style={{
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 20, padding: '40px', cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)' }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#a5b4fc', letterSpacing: 1 }}>
            FEATURED
          </span>
          <span style={{ fontSize: 12, color: CATEGORY_COLORS[post.category] || '#888', fontWeight: 600 }}>{post.category}</span>
        </div>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: '#e0e0ff', marginBottom: 12, lineHeight: 1.2, letterSpacing: -0.5 }}>
          {post.title}
        </h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 700 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#666' }}>
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
      </article>
    </Link>
  )
}

export function PostGrid({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
      {posts.map(post => (
        <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
          <article
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '28px', height: '100%', display: 'flex',
              flexDirection: 'column', cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.06)'
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.03)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: CATEGORY_COLORS[post.category] || '#888', letterSpacing: 1, marginBottom: 12, display: 'block' }}>
              {post.category.toUpperCase()}
            </span>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#e0e0ff', marginBottom: 10, lineHeight: 1.3, flex: 1 }}>
              {post.title}
            </h2>
            <p style={{ color: '#777', fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>
              {post.excerpt}
            </p>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#555', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
