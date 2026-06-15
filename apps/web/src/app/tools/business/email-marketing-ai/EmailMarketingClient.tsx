'use client'
import { useState, useMemo, CSSProperties } from 'react'

// ─── Style constants ──────────────────────────────────────────────────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, overflow: 'hidden' }
const LABEL: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6 }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const SELECT: CSSProperties = { ...INPUT, cursor: 'pointer' }
const SECTION_HDR: CSSProperties = { background: 'linear-gradient(135deg,#7c5bf6,#9333ea)', padding: '16px 20px' }
const PANEL_HDR: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }

const EMAIL_TYPES     = ['Welcome Email', 'Nurture Sequence (5 emails)', 'Promotional / Sales Email', 'Cart Abandonment (3-email series)', 'Re-engagement', 'Newsletter', 'Onboarding Sequence (7 days)', 'Referral Request']
const TONES           = ['Friendly', 'Professional', 'Urgent', 'Storytelling', 'Educational', 'Conversational', 'Empathetic']
const _SEQUENCE_LENGTHS = ['3 emails', '5 emails', '7 emails']

// ─── Generation ───────────────────────────────────────────────────────────────
function generateEmail(
  product: string, brand: string, senderName: string,
  benefit: string, audience: string,
  sequenceType: string, tone: string,
  discount: string, daysLeft: string, psLine: string,
): string {
  const p  = product    || 'our product'
  const br = brand      || p
  const sn = senderName || 'The Team'
  const b  = benefit    || 'save time and grow faster'
  const a  = audience   || 'subscribers'
  const hasDiscount = discount.trim().length > 0
  const hasDays     = daysLeft.trim().length > 0
  const ps          = psLine.trim() || `P.S. Over 10,000 ${a} already use ${p} to ${b}. Join them today.`
  const lines: string[] = []

  if (sequenceType === 'Welcome Email') {
    lines.push(
      `━━━━ WELCOME EMAIL — ${tone.toUpperCase()} TONE ━━━━`,``,
      `From: ${sn} <hello@${br.replace(/\s+/g,'').toLowerCase()}.com>`,
      `Subject Line Options:`,
      `• "Welcome to ${br} — here's how to get started 🎉"`,
      `• "You're in! Here's your first step with ${p}"`,
      `• "Hi [First Name], thanks for joining ${br}"`,
      `• "Your journey to ${b} starts now"`,``,
      `Preview Text: "Everything you need to ${b} — starting right now."`,``,
      `────────────────────────`,
      `EMAIL BODY:`,
      `────────────────────────`,``,
      `Hi [First Name],`,``,
      `Welcome to ${br}! 🙌`,``,
      `You just made a smart decision. You're now part of a community of ${a} who use ${p} to ${b}.`,``,
      `Here's what happens next:`,``,
      `✅ Step 1: [Complete your profile / Finish your setup]`,
      `✅ Step 2: [Connect your first integration / Start your first project]`,
      `✅ Step 3: [Achieve your first quick win — takes under 5 minutes]`,``,
      `────────────────────────`,``,
      `🎁 QUICK-START BONUS:`,
      `We've put together a free resource to help you ${b} faster.`,``,
      `[→ Download Your Free Guide / Watch the 3-Min Walkthrough]`,``,
      `────────────────────────`,``,
      `Questions? Just reply to this email — we read every message.`,``,
      `Excited to see what you build,`,
      `${sn}`,
      `${br}`,``,
      `${ps}`,
    )
  }

  else if (sequenceType === 'Nurture Sequence (5 emails)') {
    lines.push(
      `━━━━ NURTURE SEQUENCE — 5 EMAILS (${tone.toUpperCase()}) ━━━━`,``,
      `📧 EMAIL 1 — Day 0 (Send immediately after opt-in):`,
      `Subject: "The #1 mistake ${a} make about [topic]"`,
      `Preview: "We see this constantly — here's the fix."`,``,
      `Body: [Hook: relatable problem or surprising stat] → [1 key insight that challenges assumptions] → [Soft CTA: "Want to see how ${p} fixes this? [link]"]`,``,
      `────────────────────────`,``,
      `📧 EMAIL 2 — Day 2:`,
      `Subject: "How ${a} use ${p} to ${b} (real example)"`,
      `Preview: "A real story from one of our users…"`,``,
      `Body: [Short before/after case study — real numbers if possible] → [3 key takeaways] → [CTA: "Try it yourself — free: [link]"]`,``,
      `────────────────────────`,``,
      `📧 EMAIL 3 — Day 4 (Value email):`,
      `Subject: "3 tips to ${b} this week"`,
      `Preview: "Quick wins you can implement today."`,``,
      `Body:`,
      `Tip 1: [Actionable tip related to ${b} — no product mention needed]`,
      `Tip 2: [Second practical tip — works even without ${p}]`,
      `Tip 3: [Third tip — this one naturally leads to using ${p}]`,
      `[CTA: "See how ${p} automates Tip 3 for you → [link]"]`,``,
      `────────────────────────`,``,
      `📧 EMAIL 4 — Day 7 (Objection handling):`,
      `Subject: "What makes ${p} different from [alternative]? (honest answer)"`,
      `Preview: "We'll be straight with you."`,``,
      `Body: [Acknowledge the comparison] → [Key difference in plain English] → [Who ${p} is (and isn't) for] → [Social proof] → [CTA: Book demo / Start free trial]`,``,
      `────────────────────────`,``,
      `📧 EMAIL 5 — Day 10 (Conversion email):`,
      `Subject: "Last email about this — promise"`,
      `Preview: "I just want to make sure you don't miss this."`,``,
      `Body: [Brief value recap in 2–3 sentences] → [Remove risk: ${hasDiscount ? 'Special offer: '+discount : 'free trial + money-back guarantee'}] → [Strong CTA: "Get Started — No Risk"]`,
      `CTA: "Start Free — No Credit Card Required →"`,``,
      `${ps}`,
    )
  }

  else if (sequenceType === 'Promotional / Sales Email') {
    lines.push(
      `━━━━ PROMOTIONAL / SALES EMAIL (${tone.toUpperCase()}) ━━━━`,``,
      `From: ${sn} <deals@${br.replace(/\s+/g,'').toLowerCase()}.com>`,
      `Subject Line Options:`,
      ...(hasDiscount ? [
        `• "🔥 ${discount} — ${hasDays ? 'today only' : 'limited time'}${hasDays ? ` (${daysLeft} days left)` : ''}"`,
        `• "${a.charAt(0).toUpperCase()+a.slice(1)}: your exclusive ${discount} expires ${hasDays ? `in ${daysLeft} days` : 'soon'}"`,
      ] : [
        `• "🔥 Special offer for ${a} — [X]% off ${p}"`,
        `• "${a.charAt(0).toUpperCase()+a.slice(1)}: your exclusive deal expires [date]"`,
      ]),
      `• "[First Name], this offer is just for you"`,
      `• "Last chance: save on ${p}"`,``,
      `Preview Text: "This is the best deal we've offered this year — don't miss it."`,``,
      `────────────────────────`,
      `EMAIL BODY:`,
      `────────────────────────`,``,
      `Hi [First Name],`,``,
      `We're running a special ${hasDiscount ? discount+' ' : ''}offer for ${a} — and we wanted you to be among the first to know.`,``,
      `${hasDays ? `⏰ This offer expires in ${daysLeft} days.` : '⏰ This offer expires at midnight [Date/Time] [Timezone].'}`,``,
      `────────────────────────`,``,
      `✨ Here's what you get:`,
      `✅ [Core benefit / feature 1]`,
      `✅ [Core benefit / feature 2]`,
      `✅ [Core benefit / feature 3]`,
      `✅ BONUS: [Extra for acting now]`,``,
      `────────────────────────`,``,
      `[→ CLAIM YOUR ${hasDiscount ? discount.toUpperCase()+' ' : ''}OFFER NOW]`,
      hasDiscount ? `[${discount.includes('code') ? discount : 'Use code: SAVE20 at checkout'}]` : `[Button: Get My Discount]`,``,
      `────────────────────────`,``,
      `"${p} helped me ${b} in under a week. Worth every penny." — [Customer], ${a.replace(/s$/,'')}`,``,
      `Don't wait — this price disappears ${hasDays ? `in ${daysLeft} days` : 'at midnight'}.`,``,
      `${sn}`,
      `${br}`,``,
      `${ps}`,
    )
  }

  else if (sequenceType === 'Cart Abandonment (3-email series)') {
    lines.push(
      `━━━━ CART ABANDONMENT — 3-EMAIL SERIES (${tone.toUpperCase()}) ━━━━`,``,
      `📧 EMAIL 1 — Send: 1 hour after abandonment`,
      `Subject: "Did you forget something, [First Name]? 👀"`,
      `Preview: "Your ${p} is waiting — we saved your cart."`,``,
      `Body:`,
      `Hi [First Name],`,``,
      `Looks like you left something behind!`,``,
      `You were so close to getting ${p} — the tool that helps ${a} ${b}.`,``,
      `Your cart is still saved: [Cart recovery link]`,``,
      `Questions before you buy? Just reply — we respond within 1 hour.`,``,
      `────────────────────────`,``,
      `📧 EMAIL 2 — Send: 24 hours after abandonment`,
      `Subject: "Still thinking it over? Here's what ${a} say…"`,
      `Preview: "Real results from real people."`,``,
      `Body:`,
      `Hi [First Name],`,``,
      `We get it — important decisions take time.`,``,
      `Here's what ${a} said after their first week with ${p}:`,``,
      `⭐⭐⭐⭐⭐ "[Testimonial about ${b}]" — [Name], ${a.replace(/s$/,'')}`,
      `⭐⭐⭐⭐⭐ "[Second testimonial]" — [Name], ${a.replace(/s$/,'')}`,``,
      `${hasDiscount ? `🎁 We'll even throw in ${discount} if you complete your order today.` : '🛡️ Remember: full money-back guarantee. Zero risk.'}`,``,
      `Still reserved for you: [Cart recovery link]`,``,
      `────────────────────────`,``,
      `📧 EMAIL 3 — Send: 48 hours after abandonment (final)`,
      `Subject: "Last chance — your cart expires in 24 hours"`,
      `Preview: "After that, we can't guarantee your price or stock."`,``,
      `Body:`,
      `Hi [First Name],`,``,
      `Your saved cart for ${p} expires tomorrow.`,``,
      `This is our final reminder — after this, we're releasing your spot.`,``,
      `${hasDiscount ? `⚡ Final offer: ${discount} — this expires with your cart.` : 'If you\'re on the fence: full refund if you\'re not 100% satisfied. No questions.'}`,``,
      `[→ Complete My Purchase — Secure & Fast]`,``,
      `${ps}`,
    )
  }

  else if (sequenceType === 'Re-engagement') {
    lines.push(
      `━━━━ RE-ENGAGEMENT EMAIL (${tone.toUpperCase()}) ━━━━`,``,
      `From: ${sn} <${br.replace(/\s+/g,'').toLowerCase()}@${br.replace(/\s+/g,'').toLowerCase()}.com>`,
      `Subject Line Options:`,
      `• "We miss you, [First Name] 👋"`,
      `• "[First Name], is everything okay?"`,
      `• "We've been busy — here's what's new at ${br}"`,
      `• "A lot has changed since you last visited ${p}"`,``,
      `Preview Text: "Here's what's new — and a special offer to welcome you back."`,``,
      `────────────────────────`,
      `EMAIL BODY:`,
      `────────────────────────`,``,
      `Hi [First Name],`,``,
      `It's been a while since we've heard from you — and we miss having you around.`,``,
      `A lot has changed with ${p} since you last visited:`,``,
      `🆕 [New feature 1 — with specific benefit]`,
      `🆕 [New feature 2 — with specific benefit]`,
      `🆕 [New feature 3 — with specific benefit]`,``,
      `To celebrate your return, here's something special:`,``,
      `🎁 ${hasDiscount ? discount : '[Exclusive offer: extended trial / bonus feature / discount]'}`,
      `${hasDiscount && hasDays ? `Offer expires in ${daysLeft} days.` : hasDiscount ? 'Limited time — act fast.' : 'Use code: WELCOMEBACK'}`,``,
      `[→ Come Back and Claim Your Offer]`,``,
      `If you'd rather not hear from us anymore, that's okay — [unsubscribe here]. No hard feelings.`,``,
      `We'd love to have you back,`,
      `${sn}`,
      `${br}`,``,
      `${ps}`,
    )
  }

  else if (sequenceType === 'Onboarding Sequence (7 days)') {
    lines.push(
      `━━━━ 7-DAY ONBOARDING SEQUENCE (${tone.toUpperCase()}) ━━━━`,``,
      `📧 Day 0 — Welcome & Quick Win:`,
      `Subject: "You're in! Start here 🎉" | Preview: "Your first win with ${p} takes 5 minutes."`,
      `Goal: Orient the user, deliver first value, set expectations for the week ahead.`,``,
      `📧 Day 1 — Core Feature #1:`,
      `Subject: "The most important thing to do in ${p} first" | Preview: "Most users skip this — don't."`,
      `Goal: Walk through primary feature. Include screenshot / gif. Link to help doc.`,``,
      `📧 Day 2 — Use Case / Inspiration:`,
      `Subject: "How [Name] used ${p} to ${b} in 3 days" | Preview: "A real story (with screenshots)."`,
      `Goal: Social proof + inspiration. Show a real before/after. Soft CTA to explore further.`,``,
      `📧 Day 3 — Tip / Power Feature:`,
      `Subject: "Unlock this ${p} feature most users never find" | Preview: "It takes 60 seconds to set up."`,
      `Goal: Deliver a 'power user tip' that creates an aha moment. Link to video tutorial.`,``,
      `📧 Day 5 — Objection Handling:`,
      `Subject: "Still figuring things out? Here's help." | Preview: "Most common questions — answered."`,
      `Goal: Proactively handle top 3 support questions. Include chat/support link.`,``,
      `📧 Day 6 — Community / Integration:`,
      `Subject: "Join 10,000+ ${a} doing this with ${p}" | Preview: "The community + integrations you'll love."`,
      `Goal: Introduce community (Slack/Discord/Forum). Highlight 2–3 popular integrations.`,``,
      `📧 Day 7 — Conversion Push:`,
      `Subject: "Your free trial ends soon — here's what happens next" | Preview: "One easy step to keep going."`,
      `Goal: Convert trial to paid. Recap value delivered this week. ${hasDiscount ? 'Offer: '+discount+'.' : 'Offer upgrade/plan selection.'} Strong CTA.`,``,
      `${ps}`,
    )
  }

  else if (sequenceType === 'Referral Request') {
    lines.push(
      `━━━━ REFERRAL REQUEST EMAIL (${tone.toUpperCase()}) ━━━━`,``,
      `From: ${sn} <hello@${br.replace(/\s+/g,'').toLowerCase()}.com>`,
      `Subject Line Options:`,
      `• "Know someone who'd love ${p}? (We'll reward you both)"`,
      `• "You + a friend + ${p} = better results for everyone"`,
      `• "[First Name], earn [reward] for every friend you refer"`,``,
      `Preview Text: "Share ${p} and you both win. Here's how."`,``,
      `────────────────────────`,
      `EMAIL BODY:`,
      `────────────────────────`,``,
      `Hi [First Name],`,``,
      `You've been using ${p} for [X days / months], and we hope it's been helping you ${b}.`,``,
      `We have a favour to ask — and a reward to say thank you.`,``,
      `───`,``,
      `🎁 OUR REFERRAL PROGRAM:`,
      `• YOU get: [Reward for referrer — e.g., 1 month free / $20 credit / upgrade]`,
      `• YOUR FRIEND gets: [Reward for referee — e.g., 30% off first payment / extended trial]`,``,
      `Share your unique link: [referral link]`,``,
      `───`,``,
      `The best testimonial we ever get is a referral from a happy user. If ${p} has helped you ${b}, we'd be grateful for the introduction.`,``,
      `Thank you for being part of the ${br} community.`,``,
      `${sn}`,
      `${br}`,``,
      `${ps}`,
    )
  }

  else {
    // Newsletter
    lines.push(
      `━━━━ NEWSLETTER TEMPLATE (${tone.toUpperCase()}) ━━━━`,``,
      `From: ${sn} <newsletter@${br.replace(/\s+/g,'').toLowerCase()}.com>`,
      `Subject Line Options:`,
      `• "[${br} Weekly] ${b.charAt(0).toUpperCase()+b.slice(1)} — Issue #[N]"`,
      `• "This week: [Main topic] + [Secondary topic]"`,
      `• "3 things ${a} need to know this week"`,``,
      `Preview Text: "Your weekly dose of tips to ${b}."`,``,
      `────────────────────────`,
      `NEWSLETTER TEMPLATE:`,
      `────────────────────────`,``,
      `👋 Hey [First Name],`,``,
      `Welcome to this week's edition of [Newsletter Name] from ${br}.`,``,
      `This week we're covering:`,
      `→ [Topic 1 — the main story]`,
      `→ [Topic 2 — the secondary story]`,
      `→ [Quick tip or tool of the week]`,``,
      `────────────────────────`,``,
      `📌 MAIN STORY:`,
      `[Headline: How ${a} are using [strategy] to ${b}]`,``,
      `[2–3 paragraphs with a real insight, data, or story. Start with the most interesting point — don't bury the lede.]`,``,
      `[→ Read the Full Story / Learn More]`,``,
      `────────────────────────`,``,
      `💡 QUICK TIP OF THE WEEK:`,
      `[One actionable tip related to ${p} or ${b}. Keep it under 80 words.]`,``,
      `────────────────────────`,``,
      `🛠️ TOOL SPOTLIGHT:`,
      `This week: ${p}`,
      `[One sentence on what it does and why ${a} love it.]`,
      `[→ Try ${p} Free]`,``,
      `────────────────────────`,``,
      `That's it for this week!`,``,
      `If you found this useful, forward it to a ${a.replace(/s$/,'')} who'd benefit. 📨`,``,
      `Until next week,`,
      `${sn}`,
      `${br}`,``,
      `[Unsubscribe] · [View in browser] · [Follow us on social]`,``,
      `${ps}`,
    )
  }

  return lines.join('\n')
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EmailMarketingClient() {
  const [product,      setProduct]      = useState('')
  const [brand,        setBrand]        = useState('')
  const [senderName,   setSenderName]   = useState('')
  const [benefit,      setBenefit]      = useState('')
  const [audience,     setAudience]     = useState('')
  const [sequenceType, setSequenceType] = useState('Welcome Email')
  const [tone,         setTone]         = useState('Friendly')
  const [discount,     setDiscount]     = useState('')
  const [daysLeft,     setDaysLeft]     = useState('')
  const [psLine,       setPsLine]       = useState('')
  const [copied,       setCopied]       = useState(false)

  const output = useMemo(() =>
    generateEmail(product, brand, senderName, benefit, audience, sequenceType, tone, discount, daysLeft, psLine),
    [product, brand, senderName, benefit, audience, sequenceType, tone, discount, daysLeft, psLine]
  )

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const print = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><title>${product || 'Email'} — ${sequenceType}</title>
      <style>body{font-family:monospace;font-size:13px;line-height:1.7;max-width:720px;margin:40px auto;padding:0 20px}pre{white-space:pre-wrap}</style>
      </head><body><pre>${output.replace(/</g,'&lt;')}</pre></body></html>`)
    w.document.close(); w.print()
  }

  const hasContent = product.trim() || benefit.trim()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* ── Form ── */}
      <div style={CARD}>
        <div style={SECTION_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Email Campaign Details</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-1)', margin: '4px 0 0' }}>Fill in details — email updates live</p>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Product / Service Name</label>
              <input style={INPUT} value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. CloudHR Software" />
            </div>
            <div>
              <label style={LABEL}>Brand / Company Name</label>
              <input style={INPUT} value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. CloudHR Inc." />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Sender Name</label>
              <input style={INPUT} value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="e.g. Alex from CloudHR" />
            </div>
            <div>
              <label style={LABEL}>Target Audience</label>
              <input style={INPUT} value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. HR managers" />
            </div>
          </div>

          <div>
            <label style={LABEL}>Core Benefit</label>
            <input style={INPUT} value={benefit} onChange={e => setBenefit(e.target.value)} placeholder="e.g. automate payroll in one click" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Discount / Offer <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(optional)</span></label>
              <input style={INPUT} value={discount} onChange={e => setDiscount(e.target.value)} placeholder="e.g. 30% off with code HR30" />
            </div>
            <div>
              <label style={LABEL}>Offer Expires In <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(days)</span></label>
              <input style={INPUT} value={daysLeft} onChange={e => setDaysLeft(e.target.value)} placeholder="e.g. 3" type="number" min="1" max="60" />
            </div>
          </div>

          {/* Email Type picker */}
          <div>
            <label style={{ ...LABEL, marginBottom: 8 }}>Email Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {EMAIL_TYPES.map(t => (
                <button key={t} onClick={() => setSequenceType(t)} style={{
                  padding: '7px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                  background: sequenceType === t ? 'var(--brand-2)' : 'var(--bg-2)',
                  border: `1px solid ${sequenceType === t ? 'var(--brand-2)' : 'var(--line-strong)'}`,
                  color: sequenceType === t ? '#fff' : 'var(--fg-1)',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={LABEL}>Tone</label>
            <select style={SELECT} value={tone} onChange={e => setTone(e.target.value)}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label style={LABEL}>Custom P.S. Line <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(optional)</span></label>
            <input style={INPUT} value={psLine} onChange={e => setPsLine(e.target.value)} placeholder="e.g. P.S. This offer disappears at midnight — seriously." />
          </div>
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
        <div style={PANEL_HDR}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Live Email Preview</h2>
            <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '2px 0 0' }}>{sequenceType} · {tone} tone</p>
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
                  { label: 'Type', value: sequenceType.split('(')[0].trim() },
                  { label: 'Tone', value: tone },
                  { label: 'Audience', value: audience || '—' },
                  ...(discount ? [{ label: 'Offer', value: discount.substring(0, 20) }] : []),
                ].map(i => (
                  <div key={i.label} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{i.label}: </span>
                    <span style={{ color: 'var(--brand-2)', fontWeight: 600 }}>{i.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 10, padding: 20 }}>
                <pre style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>
                  {output}
                </pre>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>📧</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Your email will appear here</p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 0' }}>Choose an email type and fill in the details on the left</p>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {EMAIL_TYPES.map(t => (
                  <span key={t} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11, color: 'var(--fg-2)' }}>{t.split('(')[0].trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
