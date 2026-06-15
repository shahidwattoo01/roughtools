import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Resolved relative to the Next.js app root (apps/web/) at runtime
const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  author: string
  category: string
  keywords: string[]
}

export type BlogPostMeta = Omit<BlogPost, 'content'>

function parseFile(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug: (data.slug as string | undefined) ?? slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    date: data.date as string,
    readTime: (data.readTime as string | undefined) ?? '5 min read',
    author: (data.author as string | undefined) ?? 'RoughTools Team',
    category: data.category as string,
    keywords: (data.keywords as string[] | undefined) ?? [],
    content,
  }
}

export function getAllPosts(): BlogPostMeta[] {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.mdx?$/.test(f))
  return files
    .map(f => {
      const { content: _content, ...meta } = parseFile(f)
      return meta
    })
    .filter(post => new Date(post.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const mdx = path.join(CONTENT_DIR, `${slug}.mdx`)
  const md = path.join(CONTENT_DIR, `${slug}.md`)
  const filepath = fs.existsSync(mdx) ? mdx : fs.existsSync(md) ? md : null
  if (!filepath) return undefined
  return parseFile(path.basename(filepath))
}
