/**
 * Bulk-submits all site URLs to IndexNow (Bing, Yandex, etc. all read from
 * the same shared endpoint). Run after publishing/updating pages so search
 * engines pick up changes faster than waiting for a crawl.
 *
 * Usage: pnpm --filter @workspace/web submit-indexnow
 */
import { ALL_TOOLS } from '../src/lib/tools-registry'
import { BLOG_POSTS } from '../src/lib/blog-posts'
import { pdfTools } from '../src/data/pdfTools'

const HOST = 'www.roughtools.com'
const BASE_URL = `https://${HOST}`
const KEY = 'ad6e928e0e85a4e444451c69fb14dccb'
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`

function buildUrlList(): string[] {
  const staticPages = [
    '',
    '/tools',
    '/blog',
    '/pricing',
    '/about',
    '/contact',
  ]

  const toolPages = ALL_TOOLS.map((tool) => `/tools/${tool.category}/${tool.slug}`)
  const pdfPages = pdfTools.map((tool) => tool.canonicalUrl.replace(BASE_URL, ''))
  const blogPages = BLOG_POSTS.map((post) => `/blog/${post.slug}`)

  const all = [...staticPages, ...toolPages, ...pdfPages, ...blogPages]
  const unique = Array.from(new Set(all))

  return unique.map((path) => `${BASE_URL}${path}`)
}

async function submit() {
  const urlList = buildUrlList()
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`)

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  })

  console.log(`IndexNow responded: ${res.status} ${res.statusText}`)
  if (!res.ok) {
    const text = await res.text()
    console.error(text)
    process.exit(1)
  }
}

submit()
