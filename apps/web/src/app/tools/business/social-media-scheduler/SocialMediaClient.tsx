'use client'
import { useState, useMemo, CSSProperties } from 'react'

// ─── Style constants ──────────────────────────────────────────────────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, overflow: 'hidden' }
const LABEL: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6 }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const SELECT: CSSProperties = { ...INPUT, cursor: 'pointer' }
const SECTION_HDR: CSSProperties = { background: 'linear-gradient(135deg,#7c5bf6,#9333ea)', padding: '16px 20px' }
const PANEL_HDR: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }

const PLATFORMS     = ['Twitter / X', 'LinkedIn', 'Instagram', 'Facebook', 'Threads', 'TikTok (caption)']
const TONES         = ['Professional', 'Casual', 'Inspiring', 'Educational', 'Humorous', 'Promotional', 'Authentic', 'Controversial']
const CONTENT_TYPES = ['Product Launch', 'Tip / How-To', 'Behind the Scenes', 'Engagement Question', 'Announcement', 'Testimonial / Case Study', 'Thought Leadership', 'Trending / Reactive']
const POST_GOALS    = ['Brand Awareness', 'Drive Engagement', 'Generate Leads', 'Drive Website Traffic', 'Build Community', 'Direct Sales']
const HASHTAG_COUNTS = ['0 (no hashtags)', '3–5 (minimal)', '5–10 (moderate)', '15–20 (maximum)']

const BEST_TIMES: Record<string, string> = {
  'Twitter / X':     'Tue–Thu, 9 AM – 12 PM (your audience timezone)',
  'LinkedIn':        'Tue–Thu, 8–10 AM or 12–1 PM (weekdays only)',
  'Instagram':       'Mon–Fri, 9 AM–11 AM or 7–9 PM',
  'Facebook':        'Wed–Fri, 1–3 PM or Thu 9 AM–10 AM',
  'Threads':         'Daily, 9 AM–11 AM or match Instagram cadence',
  'TikTok (caption)':'Tue–Fri, 7–9 AM or 7–11 PM',
}

const CHAR_LIMITS: Record<string, number> = {
  'Twitter / X': 280, LinkedIn: 3000, Instagram: 2200, Facebook: 63206, Threads: 500, 'TikTok (caption)': 2200,
}

// ─── Generation ───────────────────────────────────────────────────────────────
function generatePost(
  topic: string, brand: string, audience: string, url: string,
  platform: string, tone: string, contentType: string, goal: string,
  hashtagCount: string, includeEmoji: boolean,
): string {
  const t  = topic    || 'our latest update'
  const br = brand    || 'our brand'
  const a  = audience || 'our community'
  const link = url    || '[your link]'
  const lines: string[] = []

  const toneEmoji: Record<string, string> = {
    Professional: '💼', Casual: '👋', Inspiring: '✨', Educational: '💡',
    Humorous: '😄', Promotional: '🎉', Authentic: '🤝', Controversial: '🔥',
  }
  const em = includeEmoji ? (toneEmoji[tone] || '📌') : ''
  const bestTime = BEST_TIMES[platform] || 'Check your analytics for optimal time'
  const charLimit = CHAR_LIMITS[platform] || 280

  // Hashtag block
  const getHashtags = () => {
    if (hashtagCount === '0 (no hashtags)') return ''
    const tags = [
      `#${br.replace(/\s+/g,'').toLowerCase()}`,
      `#${t.replace(/\s+/g,'').toLowerCase().substring(0,15)}`,
      `#${a.replace(/\s+/g,'').toLowerCase().substring(0,12)}`,
      `#${tone.toLowerCase()}`, '#business', '#marketing',
      '#growth', '#startup', '#entrepreneur', '#digitalmarketing',
      '#socialmedia', '#brand', '#content', '#success', '#innovation',
      '#leadership', '#productivity', '#community', '#networking', '#tips',
    ]
    const counts: Record<string,number> = { '3–5 (minimal)': 5, '5–10 (moderate)': 10, '15–20 (maximum)': 20 }
    const n = counts[hashtagCount] || 5
    return `\n\nHashtags:\n${tags.slice(0, n).join(' ')}`
  }

  lines.push(`━━━━ ${platform.toUpperCase()} — ${contentType.toUpperCase()} ━━━━`, ``)
  lines.push(`⏰ Best time to post: ${bestTime}`, `📏 Character limit: ${charLimit.toLocaleString()} chars`, `🎯 Post goal: ${goal}`, ``)

  // Platform-specific post
  if (platform === 'Twitter / X') {
    if (contentType === 'Product Launch') {
      lines.push(`${em} Introducing ${t}!`, ``, `Built specifically for ${a} who want more. Here's what changes today:`, ``, `→ [Key benefit 1]`, `→ [Key benefit 2]`, `→ [Key benefit 3]`, ``, `Try it free 👇`, link)
    } else if (contentType === 'Tip / How-To') {
      lines.push(`${em} Quick tip for ${a}:`, ``, `Most people don't know this about ${t}…`, ``, `Here's how to get the most out of it:`, ``, `🧵 Thread below ↓`)
    } else if (contentType === 'Engagement Question') {
      lines.push(`${em} Hot take: ${t} is the most underrated thing in [your niche].`, ``, `Agree or disagree? Drop your take below 👇`, ``, `(RT if you think ${a} needs to see this)`)
    } else if (contentType === 'Thought Leadership') {
      lines.push(`Unpopular opinion:`, ``, `[Bold statement about ${t}]`, ``, `Here's why I think this matters for ${a}:`, `1. [Point 1]`, `2. [Point 2]`, `3. [Point 3]`, ``, `What's your take? Reply below 👇`)
    } else if (contentType === 'Testimonial / Case Study') {
      lines.push(`${em} "${t} changed the way we work completely."`, ``, `— Happy ${a.replace(/s$/,'')}, ${br} customer`, ``, `See why 10,000+ people love ${br}:`, link)
    } else if (contentType === 'Trending / Reactive') {
      lines.push(`${em} [Insert trending hook / news headline]`, ``, `Here's what this means for ${a}:`, ``, `→ [Your unique angle / insight]`, ``, `Tag someone in ${a} who needs to hear this.`)
    } else {
      lines.push(`${em} Here's what ${a} need to know about ${t}:`, ``, `We've been quietly working on something at ${br}.`, ``, `Stay tuned — you won't want to miss this.`, link)
    }
    lines.push(getHashtags(), ``, `📊 Character count tip: Keep under 280. Threads work great for longer content.`)
  }

  else if (platform === 'LinkedIn') {
    lines.push(`📌 LinkedIn Post (aim for 1 200–1 800 chars for best reach):`, ``)
    if (contentType === 'Product Launch') {
      lines.push(`${em} We just launched something ${a} have been asking for.`, ``, `Introducing ${t}.`, ``, `Here's the backstory:`, ``, `[Problem]: ${a} were struggling with [specific pain point].`, `[Solution]: We built ${t} from the ground up to solve exactly this.`, `[Result]: Early users saw [X% improvement / Y hours saved] in week one.`, ``, `What makes ${t} different?`, ``, `✅ [Feature 1 — with specific benefit]`, `✅ [Feature 2 — with specific benefit]`, `✅ [Feature 3 — with specific benefit]`, ``, `Try it free: ${link}`, ``, `Drop a 🙌 in the comments if this is something you'd use.`)
    } else if (contentType === 'Thought Leadership') {
      lines.push(`${em} [Counterintuitive statement about ${t}]`, ``, `I've been thinking about this for a while.`, ``, `[Context — 2–3 sentences explaining your perspective]`, ``, `Here's what the data says:`, `→ [Insight 1]`, `→ [Insight 2]`, `→ [Insight 3]`, ``, `The implication for ${a}?`, `[Your unique takeaway]`, ``, `I'd love to hear how you think about this. Drop your perspective below.`)
    } else if (contentType === 'Tip / How-To') {
      lines.push(`${em} Here's a tip most ${a} overlook about ${t}:`, ``, `[Hook — surprising stat or bold claim]`, ``, `Here's the step-by-step:`, ``, `Step 1: [Action]`, `Step 2: [Action]`, `Step 3: [Action]`, `Step 4: [Measure results]`, ``, `The result? [Specific outcome].`, ``, `Save this post — you'll thank yourself later.`, ``, `What's your biggest challenge with ${t}? Tell me in the comments.`)
    } else if (contentType === 'Engagement Question') {
      lines.push(`${em} Genuine question for ${a}:`, ``, `When it comes to ${t}, what's the #1 thing holding you back?`, ``, `A) [Option 1]`, `B) [Option 2]`, `C) [Option 3]`, `D) Something else (drop it below)`, ``, `I've been thinking about this a lot at ${br} and would love your honest perspective.`, ``, `Drop your vote 👇`)
    } else {
      lines.push(`${em} ${br} update: ${t}`, ``, `Here's what this means for ${a}:`, ``, `[Context — 2–3 sentences]`, ``, `What we're doing about it:`, `→ [Action 1]`, `→ [Action 2]`, `→ [Action 3]`, ``, `Follow ${br} so you don't miss what's coming next. 🔔`)
    }
    lines.push(``, `───────────────`, `💡 LinkedIn tip: Add hashtags as a comment (not in post) for cleaner formatting.`, `Hashtags (3–5): #${tone.toLowerCase()} #${a.replace(/\s+/g,'').toLowerCase().substring(0,12)} #leadership #business #growth`)
  }

  else if (platform === 'Instagram') {
    lines.push(`📸 Instagram Caption:`, ``)
    if (contentType === 'Product Launch') {
      lines.push(`${em} It's finally here.`, ``, `${t} was built for ${a} who want [core benefit] without [pain point].`, ``, `✨ [Benefit 1]`, `✨ [Benefit 2]`, `✨ [Benefit 3]`, ``, `🔗 Link in bio to try it free.`)
    } else if (contentType === 'Behind the Scenes') {
      lines.push(`${em} Behind the scenes at ${br}. 👀`, ``, `Here's what we've been working on: ${t}`, ``, `[2–3 sentences about the process / team / challenge]`, ``, `More details dropping soon. Turn on post notifications so you don't miss it. 🔔`)
    } else if (contentType === 'Tip / How-To') {
      lines.push(`Save this! 📌`, ``, `[Bold tip intro about ${t}]`, ``, `Here's how it works:`, `1️⃣ [Step 1]`, `2️⃣ [Step 2]`, `3️⃣ [Step 3]`, ``, `Tag a ${a.replace(/s$/,'')} who needs to see this 👇`)
    } else if (contentType === 'Engagement Question') {
      lines.push(`${em} Quick question for ${a} 👀`, ``, `When it comes to ${t}…`, ``, `Are you Team A or Team B?`, ``, `Drop your answer in the comments! ⬇️`)
    } else if (contentType === 'Testimonial / Case Study') {
      lines.push(`${em} Real results from a real ${a.replace(/s$/,'')}.`, ``, `"${t}" — [Customer name], [role]`, ``, `This is why we do what we do at ${br}. 💙`, ``, `Your story could be next. Link in bio.`)
    } else {
      lines.push(`${em} ${t.charAt(0).toUpperCase()+t.slice(1)}.`, ``, `[2–3 sentences about this update / announcement]`, ``, `Comment '🙌' if you're excited about this!`)
    }
    lines.push(getHashtags(), ``, `💡 Instagram tip: Post hashtags as first comment for a cleaner caption.`)
  }

  else if (platform === 'Facebook') {
    lines.push(`📘 Facebook Post:`, ``)
    if (contentType === 'Product Launch') {
      lines.push(`${em} Big news for ${a}! 🎉`, ``, `We just launched ${t} — and we're incredibly excited to share it with you.`, ``, `Here's what you get:`, `✅ [Benefit 1]`, `✅ [Benefit 2]`, `✅ [Benefit 3]`, ``, `For a limited time, try it completely free — no credit card required.`, ``, `👇 Click the link to get started:`, link, ``, `Share this with a friend who'd love it! 🙌`)
    } else if (contentType === 'Engagement Question') {
      lines.push(`We want to hear from our community!`, ``, `When it comes to ${t}, what matters most to ${a}?`, ``, `A) [Option 1]`, `B) [Option 2]`, `C) [Option 3]`, ``, `Comment your answer — we read every reply! 👇`)
    } else if (contentType === 'Testimonial / Case Study') {
      lines.push(`Here's what ${a} are saying about ${br}:`, ``, `"${t} — this is exactly what I was looking for. [Specific result achieved]."`, ``, `We love hearing stories like this. 💙`, ``, `If ${br} has helped you, drop a ❤️ below or share your story in the comments!`, ``, `Want similar results? Try ${br} free: ${link}`)
    } else {
      lines.push(`${em} Hey ${a}!`, ``, `We have some exciting news about ${t}.`, ``, `[Key update — 2–3 sentences]`, ``, `We'd love your thoughts! Comment below 👇`, ``, `If this was helpful, give it a LIKE so more people see it! 👍`)
    }
    lines.push(``, `───────────────`, `💡 Facebook tip: Tag relevant pages. Use 1–3 hashtags max.`, `#${br.replace(/\s+/g,'').toLowerCase()} #${t.replace(/\s+/g,'').toLowerCase().substring(0,15)} #${tone.toLowerCase()}`)
  }

  else if (platform === 'Threads') {
    lines.push(`🧵 Threads Post (500 char limit):`, ``)
    lines.push(`${em} ${t}.`, ``, `[Short, punchy take — 1–2 sentences max]`, ``, `Drop your thoughts below 👇`)
    lines.push(``, `💡 Threads tip: Conversational, direct posts outperform polished marketing. Be real.`)
  }

  else if (platform === 'TikTok (caption)') {
    lines.push(`🎵 TikTok Caption:`, ``)
    lines.push(`${em} ${t}`, ``, `[1–2 sentence hook that matches your video opening]`, ``)
    lines.push(getHashtags(), ``, `💡 TikTok tip: The hook in your first 1–3 seconds of video matters more than the caption.`)
  }

  // Scheduling block
  lines.push(``, `━━━━ PUBLISHING CHECKLIST ━━━━`, ``,
    `✅ Best time: ${bestTime}`,
    `✅ Visual: [Match post tone — bright/clean for Instagram, data/chart for LinkedIn]`,
    `✅ CTA: ${goal === 'Drive Website Traffic' ? `Link: ${link}` : goal === 'Generate Leads' ? 'Lead magnet / landing page link in bio/post' : goal === 'Drive Engagement' ? 'End with a question' : 'Clear next step for reader'}`,
    `✅ Accessibility: Add alt text to images, captions to video`,
    `✅ Response plan: Reply to comments within 1 hour of posting`,
  )

  return lines.join('\n')
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SocialMediaClient() {
  const [topic,       setTopic]       = useState('')
  const [brand,       setBrand]       = useState('')
  const [audience,    setAudience]    = useState('')
  const [url,         setUrl]         = useState('')
  const [platform,    setPlatform]    = useState('LinkedIn')
  const [tone,        setTone]        = useState('Professional')
  const [contentType, setContentType] = useState('Product Launch')
  const [goal,        setGoal]        = useState('Brand Awareness')
  const [hashtagCount,setHashtagCount]= useState('5–10 (moderate)')
  const [includeEmoji,setIncludeEmoji]= useState(true)
  const [copied,      setCopied]      = useState(false)

  const output = useMemo(() =>
    generatePost(topic, brand, audience, url, platform, tone, contentType, goal, hashtagCount, includeEmoji),
    [topic, brand, audience, url, platform, tone, contentType, goal, hashtagCount, includeEmoji]
  )

  const charCount = output.split('\n').filter(l => !l.startsWith('━') && !l.startsWith('⏰') && !l.startsWith('📏') && !l.startsWith('🎯') && !l.startsWith('💡') && !l.startsWith('📊') && !l.startsWith('✅')).join('\n').length
  const charLimit = CHAR_LIMITS[platform] || 280
  const isOverLimit = charCount > charLimit

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const print = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><title>${brand || 'Social Post'} — ${platform}</title>
      <style>body{font-family:monospace;font-size:13px;line-height:1.7;max-width:720px;margin:40px auto;padding:0 20px}pre{white-space:pre-wrap}</style>
      </head><body><pre>${output.replace(/</g,'&lt;')}</pre></body></html>`)
    w.document.close(); w.print()
  }

  const hasContent = topic.trim() || brand.trim()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* ── Form ── */}
      <div style={CARD}>
        <div style={SECTION_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Post Details</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>Tell us what to write — post updates live</p>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div>
            <label style={LABEL}>Topic / Main Message</label>
            <input style={INPUT} value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. our new AI-powered project management feature" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Brand / Company Name</label>
              <input style={INPUT} value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. TaskFlow Pro" />
            </div>
            <div>
              <label style={LABEL}>Target Audience</label>
              <input style={INPUT} value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. startup founders" />
            </div>
          </div>

          <div>
            <label style={LABEL}>Link / URL <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(optional — added to post)</span></label>
            <input style={INPUT} value={url} onChange={e => setUrl(e.target.value)} placeholder="e.g. https://yoursite.com/new-feature" />
          </div>

          {/* Platform picker */}
          <div>
            <label style={{ ...LABEL, marginBottom: 8 }}>Platform</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {PLATFORMS.map(plat => (
                <button key={plat} onClick={() => setPlatform(plat)} style={{
                  padding: '7px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: platform === plat ? 'var(--brand-2)' : 'var(--bg-2)',
                  border: `1px solid ${platform === plat ? 'var(--brand-2)' : 'var(--line-strong)'}`,
                  color: platform === plat ? '#fff' : 'var(--fg-1)',
                }}>{plat}</button>
              ))}
            </div>
          </div>

          {/* Content type */}
          <div>
            <label style={{ ...LABEL, marginBottom: 8 }}>Content Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
              {CONTENT_TYPES.map(ct => (
                <button key={ct} onClick={() => setContentType(ct)} style={{
                  padding: '6px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                  background: contentType === ct ? 'var(--brand-2)' : 'var(--bg-2)',
                  border: `1px solid ${contentType === ct ? 'var(--brand-2)' : 'var(--line-strong)'}`,
                  color: contentType === ct ? '#fff' : 'var(--fg-1)',
                }}>{ct}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Tone</label>
              <select style={SELECT} value={tone} onChange={e => setTone(e.target.value)}>
                {TONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Post Goal</label>
              <select style={SELECT} value={goal} onChange={e => setGoal(e.target.value)}>
                {POST_GOALS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Hashtag Volume</label>
              <select style={SELECT} value={hashtagCount} onChange={e => setHashtagCount(e.target.value)}>
                {HASHTAG_COUNTS.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 2 }}>
              <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 0, paddingBottom: 10 }}>
                <div onClick={() => setIncludeEmoji(!includeEmoji)} style={{
                  width: 40, height: 22, borderRadius: 11, background: includeEmoji ? 'var(--brand-2)' : 'var(--line-strong)',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{ position: 'absolute', top: 3, left: includeEmoji ? 21 : 3, width: 16, height: 16, borderRadius: 8, background: '#fff', transition: 'left 0.2s' }} />
                </div>
                Include Emoji
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
        <div style={PANEL_HDR}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Live Post Preview</h2>
            <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '2px 0 0' }}>{platform} · {contentType}</p>
          </div>
          {hasContent && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={print} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg-1)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🖨️ Print</button>
              <button onClick={copy} style={{ padding: '6px 12px', borderRadius: 8, background: copied ? '#16a34a' : 'var(--brand-2)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {hasContent ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Platform', value: platform },
                  { label: 'Goal', value: goal.split(' ').slice(-1)[0] },
                  { label: 'Best Time', value: BEST_TIMES[platform]?.split(',')[0] || '—' },
                ].map(i => (
                  <div key={i.label} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{i.label}: </span>
                    <span style={{ color: 'var(--brand-2)', fontWeight: 600 }}>{i.value}</span>
                  </div>
                ))}
                <div style={{ padding: '4px 10px', borderRadius: 20, background: isOverLimit ? 'rgba(220,38,38,0.1)' : 'var(--bg-2)', border: `1px solid ${isOverLimit ? '#dc2626' : 'var(--line)'}`, fontSize: 11 }}>
                  <span style={{ color: 'var(--fg-3)' }}>Chars: </span>
                  <span style={{ color: isOverLimit ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{charLimit.toLocaleString()} limit</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 10, padding: 20 }}>
                <pre style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>
                  {output}
                </pre>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>📅</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Your social post will appear here</p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 0' }}>Select a platform, content type & tone, then fill in the details</p>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {PLATFORMS.map(plat => (
                  <span key={plat} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11, color: 'var(--fg-2)' }}>{plat}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
