'use client'
import { useState, useMemo, CSSProperties } from 'react'

// ─── Style constants ──────────────────────────────────────────────────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, overflow: 'hidden' }
const LABEL: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6 }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const TEXTAREA: CSSProperties = { ...INPUT, resize: 'vertical', lineHeight: 1.6 }
const SECTION_HDR: CSSProperties = { background: 'linear-gradient(135deg,#7c5bf6,#9333ea)', padding: '16px 20px' }
const PANEL_HDR: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--line)' }

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'good' | 'warn' | 'bad' | 'info'

interface Check {
  label: string
  status: Status
  message: string
  detail?: string
}

interface SeoResult {
  score: number
  grade: string
  checks: Check[]
  suggestions: string[]
  lsiKeywords: string[]
  optimised: { title: string; meta: string }
  schemaRecommendation: string
  technicalTips: string[]
}

// ─── Analysis engine ──────────────────────────────────────────────────────────
function analyseSeo(
  title: string, meta: string, keyword: string, content: string,
  h1: string, h2s: string, imageAlts: string, internalLinks: string, canonicalUrl: string,
): SeoResult {
  const suggestions: string[] = []
  const checks: Check[] = []
  let score = 0

  const kw = keyword.trim().toLowerCase()
  const words = content.trim().split(/\s+/).filter(w => w.length > 0)
  const wordCount = words.length

  // ── 1. Title ──────────────────────────────────────────────────────────────
  const titleLen = title.trim().length
  if (titleLen === 0) {
    checks.push({ label: 'Page Title', status: 'bad', message: 'No title. Add a keyword-rich title (50–60 chars).', detail: 'Missing page title is a critical SEO error.' })
    suggestions.push('❌ Add a page title containing your primary keyword.')
  } else if (titleLen < 30) {
    checks.push({ label: `Page Title (${titleLen} chars)`, status: 'warn', message: `Too short (${titleLen} chars). Aim for 50–60.`, detail: 'Google may generate its own title instead.' })
    suggestions.push('⚠️ Expand your title — it\'s too short. Google may override it.')
    score += 5
  } else if (titleLen > 60) {
    checks.push({ label: `Page Title (${titleLen} chars)`, status: 'warn', message: `May be truncated (${titleLen} chars). Keep under 60.`, detail: 'Google truncates titles above ~60 chars in SERPs.' })
    suggestions.push('⚠️ Shorten your title to 60 chars or fewer to avoid truncation.')
    score += 10
  } else {
    checks.push({ label: `Page Title (${titleLen} chars)`, status: 'good', message: `Perfect length (${titleLen} chars). ✓` })
    score += 20
  }
  if (kw && title.toLowerCase().includes(kw)) {
    score += 10
  } else if (kw) {
    suggestions.push(`❌ Add your keyword "${keyword}" to the page title.`)
  }

  // ── 2. Meta Description ───────────────────────────────────────────────────
  const metaLen = meta.trim().length
  if (metaLen === 0) {
    checks.push({ label: 'Meta Description', status: 'bad', message: 'No meta description. Add one (140–160 chars).', detail: 'Google will auto-generate one, often poor quality.' })
    suggestions.push('❌ Add a meta description between 140–160 characters.')
  } else if (metaLen < 70) {
    checks.push({ label: `Meta Description (${metaLen} chars)`, status: 'warn', message: `Too short (${metaLen} chars). Aim for 140–160.`, detail: 'Short meta descriptions reduce SERP click-through rates.' })
    suggestions.push('⚠️ Expand your meta description to 140–160 characters.')
    score += 5
  } else if (metaLen > 160) {
    checks.push({ label: `Meta Description (${metaLen} chars)`, status: 'warn', message: `Too long (${metaLen} chars). Keep under 160.`, detail: 'Google will cut it off mid-sentence in search results.' })
    suggestions.push('⚠️ Shorten meta description to 160 chars to avoid truncation.')
    score += 8
  } else {
    checks.push({ label: `Meta Description (${metaLen} chars)`, status: 'good', message: `Good length (${metaLen} chars). ✓` })
    score += 15
  }
  if (kw && meta.toLowerCase().includes(kw)) {
    score += 5
  } else if (kw) {
    suggestions.push(`❌ Include your keyword "${keyword}" in the meta description.`)
  }

  // ── 3. H1 Heading ─────────────────────────────────────────────────────────
  if (!h1.trim()) {
    checks.push({ label: 'H1 Heading', status: 'bad', message: 'No H1 provided. Every page needs exactly one H1.', detail: 'H1 is one of the strongest on-page SEO signals.' })
    suggestions.push('❌ Add an H1 heading to your page. It should include your primary keyword.')
  } else {
    const h1HasKw = kw && h1.toLowerCase().includes(kw)
    checks.push({ label: 'H1 Heading', status: h1HasKw ? 'good' : 'warn',
      message: h1HasKw ? `H1 contains keyword. ✓` : `H1 present but missing keyword "${keyword}".`,
      detail: h1HasKw ? undefined : 'Including your primary keyword in H1 improves relevance signals.'
    })
    if (h1HasKw) score += 8
    else { score += 4; suggestions.push(`⚠️ Include your keyword "${keyword}" in the H1 heading.`) }
  }

  // ── 4. H2 Headings ────────────────────────────────────────────────────────
  const h2Count = h2s.trim() ? h2s.trim().split('\n').filter(h => h.trim()).length : 0
  if (h2Count === 0) {
    checks.push({ label: 'H2 Subheadings', status: 'warn', message: 'No H2 headings entered. Add 3–6 subheadings.', detail: 'H2s improve content scannability and topic coverage.' })
    suggestions.push('💡 Add H2/H3 headings to structure your content and signal topic depth.')
  } else {
    const h2sWithKw = h2s.toLowerCase().split('\n').filter(h => h.includes(kw)).length
    checks.push({ label: `H2 Subheadings (${h2Count} found)`, status: 'good',
      message: `${h2Count} subheading${h2Count > 1 ? 's' : ''} found.${kw && h2sWithKw > 0 ? ` ${h2sWithKw} contain keyword. ✓` : ''}` })
    score += Math.min(h2Count * 2, 8)
  }

  // ── 5. Keyword Density ────────────────────────────────────────────────────
  if (!kw) {
    checks.push({ label: 'Keyword Density', status: 'warn', message: 'No keyword entered — add a target keyword.', detail: 'A target keyword is needed for density analysis.' })
    suggestions.push('⚠️ Enter a target keyword to analyse keyword density.')
  } else if (wordCount === 0) {
    checks.push({ label: 'Keyword Density', status: 'bad', message: 'No content to analyse.', detail: 'Paste your page body content for analysis.' })
    suggestions.push('❌ Add your page content for keyword density analysis.')
  } else {
    const kwRegex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = content.match(kwRegex) || []
    const density = (matches.length / wordCount) * 100
    const densityStr = `${density.toFixed(1)}%`
    if (density < 0.5) {
      checks.push({ label: `Keyword Density (${densityStr})`, status: 'warn', message: `Too low (${densityStr}). Aim for 1–2%.`, detail: `Keyword appears ${matches.length}× in ${wordCount} words.` })
      suggestions.push(`⚠️ Keyword "${keyword}" appears only ${matches.length}× — aim for 1–2% density.`)
      score += 3
    } else if (density > 3.5) {
      checks.push({ label: `Keyword Density (${densityStr})`, status: 'warn', message: `Too high (${densityStr}) — keyword stuffing risk.`, detail: 'Over-optimisation can trigger a Google penalty.' })
      suggestions.push(`⚠️ Keyword "${keyword}" appears ${matches.length}× — reduce to 1–2% to avoid penalty.`)
      score += 5
    } else {
      checks.push({ label: `Keyword Density (${densityStr})`, status: 'good', message: `Ideal density (${densityStr}). ✓` })
      score += 15
    }
  }

  // ── 6. Content Length ─────────────────────────────────────────────────────
  if (wordCount === 0) {
    checks.push({ label: 'Content Length', status: 'bad', message: 'No content analysed. Paste your page body.', detail: 'Content length is a major ranking factor.' })
  } else if (wordCount < 300) {
    checks.push({ label: `Content Length (${wordCount} words)`, status: 'bad', message: `Only ${wordCount} words — Google may consider this thin.`, detail: 'Thin content (under 300 words) rarely ranks well.' })
    suggestions.push(`❌ Add more content — ${wordCount} words is too thin. Aim for 800+ words.`)
    score += 2
  } else if (wordCount < 600) {
    checks.push({ label: `Content Length (${wordCount} words)`, status: 'warn', message: `${wordCount} words — acceptable but 800+ is recommended.`, detail: 'Longer content typically ranks better for competitive terms.' })
    suggestions.push(`⚠️ Expand content to 800+ words for better ranking potential.`)
    score += 8
  } else if (wordCount < 1200) {
    checks.push({ label: `Content Length (${wordCount} words)`, status: 'good', message: `${wordCount} words — good length for ranking. ✓` })
    score += 12
  } else {
    checks.push({ label: `Content Length (${wordCount} words)`, status: 'good', message: `${wordCount} words — excellent depth. ✓`, detail: 'Long-form content earns more backlinks and ranks for more queries.' })
    score += 15
  }

  // ── 7. Readability ────────────────────────────────────────────────────────
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const avgWPS = sentences.length > 0 ? wordCount / sentences.length : 0
  if (wordCount < 30) {
    checks.push({ label: 'Readability', status: 'bad', message: 'Not enough content for readability analysis.', detail: 'Need at least 30 words to assess readability.' })
  } else if (avgWPS > 25) {
    checks.push({ label: `Readability (avg ${avgWPS.toFixed(0)} words/sentence)`, status: 'warn', message: 'Sentences too long — complex to read.', detail: 'Aim for 15–20 words/sentence for Grade 8 reading level.' })
    suggestions.push('⚠️ Break up long sentences. Aim for 15–20 words per sentence.')
    score += 3
  } else if (avgWPS > 18) {
    checks.push({ label: `Readability (avg ${avgWPS.toFixed(0)} words/sentence)`, status: 'warn', message: 'Moderate — consider simplifying sentences.', detail: 'Shorter sentences improve dwell time and reduce bounce rate.' })
    score += 6
  } else {
    checks.push({ label: `Readability (avg ${avgWPS.toFixed(0)} words/sentence)`, status: 'good', message: `Easy to read (${avgWPS.toFixed(0)} words/sentence avg). ✓` })
    score += 8
  }

  // ── 8. Image Alt Text ─────────────────────────────────────────────────────
  if (!imageAlts.trim()) {
    checks.push({ label: 'Image Alt Text', status: 'info', message: 'No alt text entered. Check all images have descriptive alt text.', detail: 'Alt text helps Google understand image content and improves accessibility.' })
    suggestions.push('💡 Add descriptive alt text to all images, including your target keyword where natural.')
  } else {
    const altHasKw = kw && imageAlts.toLowerCase().includes(kw)
    checks.push({ label: 'Image Alt Text', status: altHasKw ? 'good' : 'warn',
      message: altHasKw ? 'Alt text contains keyword. ✓' : 'Alt text present but consider adding keyword naturally.',
    })
    if (altHasKw) score += 5
    else score += 2
  }

  // ── 9. Internal Links ─────────────────────────────────────────────────────
  const linkCount = internalLinks.trim() ? internalLinks.trim().split('\n').filter(l => l.trim()).length : 0
  if (linkCount === 0) {
    checks.push({ label: 'Internal Links', status: 'warn', message: 'No internal links listed. Add 2–5 links to related pages.', detail: 'Internal links distribute PageRank and help crawlers discover content.' })
    suggestions.push('💡 Add 2–5 internal links to related pages to improve crawlability and UX.')
  } else if (linkCount < 2) {
    checks.push({ label: `Internal Links (${linkCount} found)`, status: 'warn', message: 'Only 1 internal link — add at least 2–3 more.', detail: 'More internal links = better crawl coverage and link equity distribution.' })
    score += 3
  } else {
    checks.push({ label: `Internal Links (${linkCount} found)`, status: 'good', message: `${linkCount} internal links. ✓`, detail: 'Good internal link structure helps PageRank flow.' })
    score += Math.min(linkCount * 2, 8)
  }

  // ── 10. Canonical URL ─────────────────────────────────────────────────────
  if (!canonicalUrl.trim()) {
    checks.push({ label: 'Canonical URL', status: 'info', message: 'No canonical URL entered. Always set a canonical tag to avoid duplicate content.', detail: 'Canonical tags prevent Google from seeing www vs non-www, HTTP vs HTTPS as duplicates.' })
    suggestions.push('💡 Add a canonical tag (<link rel="canonical">) to every page.')
  } else {
    const isHttps = canonicalUrl.startsWith('https://')
    checks.push({ label: 'Canonical URL', status: isHttps ? 'good' : 'warn',
      message: isHttps ? 'Canonical URL set and uses HTTPS. ✓' : 'Canonical URL set but should use HTTPS.',
    })
    if (isHttps) score += 5
    else suggestions.push('⚠️ Switch canonical URL to HTTPS.')
  }

  // ── Generic tips ──────────────────────────────────────────────────────────
  if (wordCount > 300 && !content.includes('http')) {
    suggestions.push('💡 Add 2–3 outbound links to authoritative sources to signal topic authority.')
  }
  if (wordCount > 500 && avgWPS < 25) {
    suggestions.push('💡 Consider adding a table of contents for pages over 1 000 words.')
  }
  if (suggestions.length === 0) {
    suggestions.push('🎉 Great work! Your page is well-optimised. Keep monitoring rankings and update content regularly.')
  }

  // ── Grade ─────────────────────────────────────────────────────────────────
  const finalScore = Math.min(100, score)
  let grade: string
  if (finalScore >= 85) grade = 'A'
  else if (finalScore >= 70) grade = 'B'
  else if (finalScore >= 50) grade = 'C'
  else if (finalScore >= 30) grade = 'D'
  else grade = 'F'

  // ── LSI keywords ──────────────────────────────────────────────────────────
  const lsiBase = kw ? [
    `best ${kw}`, `${kw} tool`, `${kw} software`, `how to ${kw}`,
    `${kw} tips`, `${kw} guide`, `${kw} free`, `${kw} examples`,
    `${kw} vs [alternative]`, `${kw} for beginners`, `[industry] ${kw}`,
    `${kw} strategy`, `${kw} checklist`, `${kw} cost`,
  ] : ['Enter a target keyword to generate LSI suggestions']

  // ── Schema recommendation ──────────────────────────────────────────────────
  const schemaMap: Record<string, string> = {
    guide: 'Article / HowTo', review: 'Review', product: 'Product', faq: 'FAQPage',
    price: 'Product + Offer', 'how to': 'HowTo', recipe: 'Recipe', event: 'Event',
  }
  let schemaRec = 'WebPage (default)'
  const contentLower = (title + ' ' + content).toLowerCase()
  for (const [trigger, schema] of Object.entries(schemaMap)) {
    if (contentLower.includes(trigger)) { schemaRec = schema; break }
  }

  // ── Optimised snippets ────────────────────────────────────────────────────
  const optimisedTitle = title
    ? (title.toLowerCase().includes(kw)
        ? title.substring(0, 60)
        : kw ? `${title.substring(0, 44)} | ${kw.substring(0, 14)}` : title.substring(0, 60))
    : kw ? `[Page Topic] — ${kw} | [Brand]` : '[Add a keyword-rich page title here]'

  const optimisedMeta = meta
    ? (meta.length > 160 ? meta.substring(0, 157) + '…' : meta)
    : kw
    ? `Discover how [your product] helps [audience] ${kw}. No signup required — try it free today. [Add more detail to reach 140–160 chars.]`
    : '[Add a compelling meta description with your keyword that\'s 140–160 characters long.]'

  // ── Technical tips ────────────────────────────────────────────────────────
  const technicalTips = [
    'Ensure page loads in under 3 seconds (check: PageSpeed Insights)',
    'Use HTTPS on all pages — required for modern SEO',
    'Submit your sitemap to Google Search Console',
    'Check for crawl errors in Google Search Console weekly',
    'Ensure all redirect chains are 1-hop (301) redirects',
    'Compress images — use WebP format for 30% smaller file sizes',
    'Add Open Graph (og:title, og:description, og:image) meta tags for social sharing',
    'Enable lazy loading for images below the fold',
  ]

  return { score: finalScore, grade, checks, suggestions, lsiKeywords: lsiBase, optimised: { title: optimisedTitle, meta: optimisedMeta }, schemaRecommendation: schemaRec, technicalTips }
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<Status, CSSProperties> = {
  good: { background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', color: '#16a34a' },
  warn: { background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', color: '#b45309' },
  bad:  { background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626' },
  info: { background: 'rgba(124,91,246,0.08)', border: '1px solid rgba(124,91,246,0.25)', color: 'var(--brand-2)' },
}
const STATUS_ICON: Record<Status, string> = { good: '✅', warn: '⚠️', bad: '❌', info: '💡' }

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const color = score >= 85 ? '#16a34a' : score >= 70 ? '#2563eb' : score >= 50 ? '#d97706' : '#dc2626'
  const r = 15.9
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
        <svg viewBox="0 0 36 36" width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="18" cy="18" r={r} fill="none" stroke="var(--line-strong)" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color }}>{score}</span>
        </div>
      </div>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, border: '1px solid', marginBottom: 6, fontSize: 13, fontWeight: 700,
          ...STATUS_STYLE[score >= 70 ? 'good' : score >= 50 ? 'warn' : 'bad'] }}>
          SEO Grade: {grade}
        </div>
        <p style={{ fontSize: 12, color: 'var(--fg-2)', margin: 0, lineHeight: 1.4 }}>
          {score >= 85 ? '🎉 Excellent! Well-optimised page.'
          : score >= 70 ? '👍 Good — a few tweaks will push this higher.'
          : score >= 50 ? '⚠️ Fair — several important improvements needed.'
          : '🚨 Needs work — follow the suggestions below carefully.'}
        </p>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SeoOptimizerClient() {
  const [title,         setTitle]         = useState('')
  const [meta,          setMeta]          = useState('')
  const [keyword,       setKeyword]       = useState('')
  const [content,       setContent]       = useState('')
  const [h1,            setH1]            = useState('')
  const [h2s,           setH2s]           = useState('')
  const [imageAlts,     setImageAlts]     = useState('')
  const [internalLinks, setInternalLinks] = useState('')
  const [canonicalUrl,  setCanonicalUrl]  = useState('')
  const [activeTab,     setActiveTab]     = useState<'overview' | 'technical' | 'lsi'>('overview')
  const [hasAnalysed,   setHasAnalysed]   = useState(false)

  const result = useMemo(() => {
    if (!hasAnalysed) return null
    return analyseSeo(title, meta, keyword, content, h1, h2s, imageAlts, internalLinks, canonicalUrl)
  }, [hasAnalysed, title, meta, keyword, content, h1, h2s, imageAlts, internalLinks, canonicalUrl])

  const wordCount = content.trim().split(/\s+/).filter(w => w).length

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const printReport = () => {
    if (!result) return
    const w = window.open('', '_blank')!
    const checkLines = result.checks.map(c => `${STATUS_ICON[c.status]} ${c.label}: ${c.message}`).join('\n')
    const suggLines  = result.suggestions.join('\n')
    w.document.write(`<!DOCTYPE html><html><head><title>SEO Report — ${title || 'Page'}</title>
      <style>body{font-family:system-ui;font-size:13px;line-height:1.7;max-width:760px;margin:40px auto;padding:0 20px;color:#111}h2{margin-top:24px}pre{white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:8px}</style>
      </head><body>
      <h1>SEO Analysis Report</h1>
      <p><strong>Score:</strong> ${result.score}/100 — Grade ${result.grade}</p>
      <h2>Checks</h2><pre>${checkLines}</pre>
      <h2>Optimised Title</h2><pre>${result.optimised.title}</pre>
      <h2>Optimised Meta</h2><pre>${result.optimised.meta}</pre>
      <h2>Suggestions</h2><pre>${suggLines}</pre>
      <h2>Schema Recommendation</h2><p>${result.schemaRecommendation}</p>
      </body></html>`)
    w.document.close(); w.print()
  }

  const TAB_STYLE = (active: boolean): CSSProperties => ({
    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
    background: active ? 'var(--brand-2)' : 'var(--bg-2)',
    color: active ? '#fff' : 'var(--fg-1)',
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* ── Form ── */}
      <div style={CARD}>
        <div style={SECTION_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Page SEO Details</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-1)', margin: '4px 0 0' }}>Paste your page info for a full SEO health check</p>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div>
            <label style={LABEL}>
              Page Title{' '}
              <span style={{ fontWeight: 400, color: title.length > 60 ? '#dc2626' : title.length >= 50 ? '#16a34a' : 'var(--fg-3)' }}>
                ({title.length}/60 chars{title.length > 60 ? ' — too long!' : title.length >= 50 ? ' ✓' : ''})
              </span>
            </label>
            <input style={{ ...INPUT, borderColor: title.length > 60 ? '#dc2626' : 'var(--line-strong)' }}
              value={title} onChange={e => setTitle(e.target.value)} maxLength={80}
              placeholder="e.g. Free HR Software for Small Business | CloudHR" />
          </div>

          <div>
            <label style={LABEL}>
              Meta Description{' '}
              <span style={{ fontWeight: 400, color: meta.length > 160 ? '#dc2626' : meta.length >= 140 ? '#16a34a' : 'var(--fg-3)' }}>
                ({meta.length}/160 chars{meta.length > 160 ? ' — too long!' : meta.length >= 140 ? ' ✓' : ''})
              </span>
            </label>
            <textarea style={{ ...TEXTAREA, minHeight: 72, borderColor: meta.length > 160 ? '#dc2626' : 'var(--line-strong)' }}
              value={meta} onChange={e => setMeta(e.target.value)} maxLength={200} rows={3}
              placeholder="e.g. CloudHR helps small businesses manage payroll and HR in one place. Try free — no credit card required." />
          </div>

          <div>
            <label style={LABEL}>Target Keyword</label>
            <input style={INPUT} value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="e.g. HR software for small business" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>H1 Heading</label>
              <input style={INPUT} value={h1} onChange={e => setH1(e.target.value)}
                placeholder="e.g. Free HR Software for Small Business" />
            </div>
            <div>
              <label style={LABEL}>Canonical URL</label>
              <input style={INPUT} value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)}
                placeholder="e.g. https://yoursite.com/page" />
            </div>
          </div>

          <div>
            <label style={LABEL}>H2 Subheadings <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(one per line)</span></label>
            <textarea style={{ ...TEXTAREA, minHeight: 64 }} value={h2s} onChange={e => setH2s(e.target.value)} rows={3}
              placeholder={'e.g.\nWhat is HR software?\nBenefits of CloudHR for small teams\nHow to get started in 5 minutes'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Image Alt Text <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(describe key images)</span></label>
              <textarea style={{ ...TEXTAREA, minHeight: 60 }} value={imageAlts} onChange={e => setImageAlts(e.target.value)} rows={2}
                placeholder="e.g. CloudHR dashboard showing payroll automation for small business" />
            </div>
            <div>
              <label style={LABEL}>Internal Links <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(one per line)</span></label>
              <textarea style={{ ...TEXTAREA, minHeight: 60 }} value={internalLinks} onChange={e => setInternalLinks(e.target.value)} rows={2}
                placeholder={'e.g.\n/features/payroll\n/blog/hr-tips\n/pricing'} />
            </div>
          </div>

          <div>
            <label style={LABEL}>
              Page Content{' '}
              <span style={{ fontWeight: 400, color: wordCount >= 800 ? '#16a34a' : wordCount >= 300 ? '#d97706' : 'var(--fg-3)' }}>
                ({wordCount} words{wordCount >= 800 ? ' ✓ good' : wordCount >= 300 ? ' — consider expanding' : wordCount > 0 ? ' — too thin' : ''})
              </span>
            </label>
            <textarea style={{ ...TEXTAREA, minHeight: 120 }} value={content} onChange={e => setContent(e.target.value)} rows={7}
              placeholder="Paste your page body content here for keyword density, readability, and content-length analysis…" />
          </div>

          <button onClick={() => setHasAnalysed(true)}
            style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'var(--brand-2)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            🔍 Analyse SEO
          </button>

          {hasAnalysed && (
            <button onClick={() => setHasAnalysed(false)}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg-1)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ↺ Reset Analysis
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
        <div style={PANEL_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', margin: '0 0 10px' }}>SEO Analysis Report</h2>
          {result && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button style={TAB_STYLE(activeTab === 'overview')}  onClick={() => setActiveTab('overview')}>Overview</button>
              <button style={TAB_STYLE(activeTab === 'technical')} onClick={() => setActiveTab('technical')}>Technical</button>
              <button style={TAB_STYLE(activeTab === 'lsi')}       onClick={() => setActiveTab('lsi')}>LSI Keywords</button>
              <button onClick={printReport} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg-1)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🖨️ Print</button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {result ? (
            <>
              <ScoreRing score={result.score} grade={result.grade} />

              {activeTab === 'overview' && (
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Check rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>On-Page Checks ({result.checks.length})</h3>
                    {result.checks.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 12, ...STATUS_STYLE[c.status] }}>
                        <span style={{ flexShrink: 0, marginTop: 1 }}>{STATUS_ICON[c.status]}</span>
                        <div>
                          <div style={{ fontWeight: 700 }}>{c.label}</div>
                          <div style={{ opacity: 0.85 }}>{c.message}</div>
                          {c.detail && <div style={{ opacity: 0.65, marginTop: 2, fontSize: 11 }}>{c.detail}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', margin: '0 0 8px' }}>Actionable Suggestions</h3>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {result.suggestions.map((s, i) => (
                        <li key={i} style={{ fontSize: 12, color: 'var(--fg-1)', display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: 'var(--bg-2)', borderRadius: 8, border: '1px solid var(--line)' }}>
                          <span style={{ flexShrink: 0 }}>{s.charAt(0)}</span>
                          <span>{s.substring(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Optimised snippets */}
                  <div style={{ background: 'rgba(124,91,246,0.06)', border: '1px solid rgba(124,91,246,0.2)', borderRadius: 12, padding: 16 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', margin: '0 0 12px' }}>✨ Optimised Snippet Suggestions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-2)', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>Title ({result.optimised.title.length} chars)</span>
                          <button onClick={() => copy(result.optimised.title)} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--fg-1)', cursor: 'pointer' }}>Copy</button>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--fg)', background: 'var(--bg-1)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--line)' }}>{result.optimised.title}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-2)', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>Meta Description ({result.optimised.meta.length} chars)</span>
                          <button onClick={() => copy(result.optimised.meta)} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--fg-1)', cursor: 'pointer' }}>Copy</button>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--fg)', background: 'var(--bg-1)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--line)' }}>{result.optimised.meta}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-2)', marginBottom: 4 }}>Recommended Schema Type</div>
                        <div style={{ fontSize: 12, color: 'var(--fg)', background: 'var(--bg-1)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--line)' }}>
                          {result.schemaRecommendation} — <a href="https://schema.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-2)' }}>schema.org docs →</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', margin: '0 0 12px' }}>Technical SEO Checklist</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.technicalTips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 12, color: 'var(--fg-1)' }}>
                        <span style={{ flexShrink: 0, color: 'var(--brand-2)', fontWeight: 700 }}>{i + 1}.</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: 'rgba(124,91,246,0.06)', border: '1px solid rgba(124,91,246,0.2)' }}>
                    <p style={{ fontSize: 12, color: 'var(--fg-1)', margin: 0 }}>
                      <strong style={{ color: 'var(--brand-2)' }}>Recommended Tools:</strong> Google Search Console (free) · Google PageSpeed Insights (free) · Screaming Frog (free up to 500 URLs) · Ahrefs / Semrush (paid — for backlink analysis)
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'lsi' && (
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', margin: '0 0 4px' }}>LSI & Semantic Keyword Suggestions</h3>
                  <p style={{ fontSize: 12, color: 'var(--fg-2)', margin: '0 0 12px' }}>Latent Semantic Index (LSI) keywords help Google understand your page topic. Sprinkle these naturally in your content.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.lsiKeywords.map((kwd, i) => (
                      <button key={i} onClick={() => copy(kwd)}
                        style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg-1)', transition: 'all 0.15s' }}
                        title="Click to copy">
                        {kwd}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '12px 0 0' }}>Click any keyword to copy it. Replace [industry] and [alternative] with specific terms from your niche.</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>🔍</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Your SEO analysis will appear here</p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 16px' }}>Fill in your page details and click Analyse SEO</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 360 }}>
                {['Page Title', 'Meta Description', 'H1 Heading', 'H2 Subheadings', 'Keyword Density', 'Content Length', 'Readability', 'Image Alt Text', 'Internal Links', 'Canonical URL', 'Schema Type', 'LSI Keywords'].map(c => (
                  <span key={c} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11, color: 'var(--fg-2)' }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
