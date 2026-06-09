'use client'
import { useState, useMemo, CSSProperties } from 'react'

// ─── Style constants (CSS-variable based, works in light & dark) ───────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, overflow: 'hidden' }
const LABEL: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6 }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const SELECT: CSSProperties = { ...INPUT, cursor: 'pointer' }
const BTN_PRIMARY: CSSProperties = { width: '100%', padding: '12px', borderRadius: 10, background: 'var(--brand-2)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.2 }
const SECTION_HDR: CSSProperties = { background: 'linear-gradient(135deg,#7c5bf6,#9333ea)', padding: '16px 20px' }
const PANEL_HDR: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }

const TONES    = ['Professional', 'Friendly', 'Urgent', 'Luxury', 'Playful', 'Authoritative', 'Conversational', 'Bold']
const FORMATS  = ['Product Description', 'Email Subject Lines', 'Hero Headlines', 'Ad Copy', 'CTA Buttons', 'Full Sales Page', 'VSL Script Intro', 'Value Proposition']
const PRICE_TIERS = ['Free', 'Budget ($1–$50)', 'Mid-Range ($50–$500)', 'Premium ($500–$2 000)', 'Enterprise / Custom']
const INDUSTRIES  = ['SaaS / Software', 'E-commerce', 'Coaching / Consulting', 'Agency', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Fitness & Wellness', 'Legal', 'Other']

// ─── Generation logic ─────────────────────────────────────────────────────────
function generateCopy(
  product: string, brand: string, benefit: string, secondBenefit: string,
  audience: string, industry: string, priceTier: string, differentiator: string,
  guarantee: string, tone: string, format: string,
): string {
  const p  = product         || 'your product'
  const br = brand           || p
  const b  = benefit         || 'save time and money'
  const b2 = secondBenefit   || 'get better results'
  const a  = audience        || 'busy professionals'
  const d  = differentiator  || `the only ${industry} tool built specifically for ${a}`
  const g  = guarantee       || 'No-questions-asked 30-day money-back guarantee'
  const pt = priceTier

  const toneWords: Record<string, string> = {
    Professional: 'results-driven', Friendly: 'warm and approachable', Urgent: 'time-sensitive',
    Luxury: 'premium and exclusive', Playful: 'fun and energetic', Authoritative: 'expert and confident',
    Conversational: 'natural and human', Bold: 'daring and direct',
  }
  const tw = toneWords[tone] || 'professional'

  if (format === 'Hero Headlines') return [
    `━━━━ HERO HEADLINES (${tone.toUpperCase()}) ━━━━`,``,
    `🎯 Headline 1 — Benefit-Led:`,
    `"${p}: The Smartest Way for ${a} to ${b}"`,``,
    `🎯 Headline 2 — Problem-Solution:`,
    `"Tired of Not Being Able to ${b.charAt(0).toUpperCase()+b.slice(1)}? ${p} Changes Everything"`,``,
    `🎯 Headline 3 — Curiosity-Hook:`,
    `"Why 10,000+ ${a} Switched to ${p} — and Never Looked Back"`,``,
    `🎯 Headline 4 — Number-Led:`,
    `"5 Reasons ${a} Choose ${p} Over Every Other ${industry} Tool"`,``,
    `🎯 Headline 5 — Transformation:`,
    `"From Struggling to ${b.charAt(0).toUpperCase()+b.slice(1)} — ${p} Makes It Effortless"`,``,
    `🎯 Headline 6 — Differentiator:`,
    `"${p}: ${d.charAt(0).toUpperCase()+d.slice(1)}"`,``,
    `📝 SUB-HEADLINES:`,
    `• "${p} gives ${a} everything they need to ${b} — without the complexity, cost, or learning curve."`,
    `• "Join thousands of ${a} who use ${p} to ${b} and ${b2}."`,``,
    `🔒 TRUST LINE (below CTA):`,
    `"${g} · No credit card required · Cancel anytime"`,
  ].join('\n')

  if (format === 'Email Subject Lines') return [
    `━━━━ EMAIL SUBJECT LINES (${tone.toUpperCase()}) ━━━━`,``,
    `📧 Curiosity:`,
    `"The secret ${a} use to ${b} (without the usual headaches)"`,``,
    `📧 Direct Benefit:`,
    `"${p} → ${b} in under 10 minutes"`,``,
    `📧 Social Proof:`,
    `"How 10,000+ ${a} are using ${p} to ${b}"`,``,
    `📧 Urgency:`,
    `"Last chance: ${p} offer for ${a} expires tonight"`,``,
    `📧 Personalised:`,
    `"[First Name], here's the fastest way to ${b}"`,``,
    `📧 Problem-Aware:`,
    `"Are you making this mistake that costs ${a} hours every week?"`,``,
    `📧 Comparison:`,
    `"Why ${a} choose ${p} over [competitor] (honest comparison)"`,``,
    `📧 Re-engagement:`,
    `"We've been busy — here's what's new at ${br}"`,``,
    `💬 PREVIEW TEXT PAIRINGS:`,
    `• (for curiosity) "${p} takes the hard part out of ${b} — here's exactly how."`,
    `• (for direct) "Join ${a} already saving hours every week."`,
    `• (for urgency) "After midnight this price goes. No exceptions."`,
  ].join('\n')

  if (format === 'Ad Copy') return [
    `━━━━ MULTI-PLATFORM AD COPY (${tone.toUpperCase()}) ━━━━`,``,
    `─── GOOGLE ADS ───`,
    `Headline 1 (30 chars max): ${p.substring(0,25)} | Free Trial`,
    `Headline 2 (30 chars max): ${b.substring(0,28).charAt(0).toUpperCase()+b.slice(0,28).substring(1)}`,
    `Headline 3 (30 chars max): Trusted by 10,000+ ${a.substring(0,10)}`,
    `Description 1 (90 chars): Join thousands of ${a} using ${p} to ${b}. Start free — no credit card needed.`,
    `Description 2 (90 chars): ${p} helps ${a} ${b}. See results in minutes. No setup hassle. Try free today.`,``,
    `─── FACEBOOK / INSTAGRAM ADS ───`,
    `🚨 Primary Text:`,
    `Struggling to ${b}? You're not alone.`,
    `That's why we built ${p} — the ${tw} way for ${a} to ${b}, without the usual headaches.`,``,
    `✅ ${b.charAt(0).toUpperCase()+b.slice(1)}`,
    `✅ ${b2.charAt(0).toUpperCase()+b2.slice(1)}`,
    `✅ Join 10,000+ happy users`,``,
    `${priceTier === 'Free' ? '🆓 100% Free — no credit card.' : `💰 Starting at ${pt === 'Budget ($1–$50)' ? 'just $19/mo.' : pt === 'Mid-Range ($50–$500)' ? '$97/mo.' : 'custom pricing.'}`}`,
    `👉 Click below to get started.`,``,
    `Headline: ${p} — ${b.charAt(0).toUpperCase()+b.slice(1)}`,
    `Description: The #1 ${industry} tool for ${a}. Try it free.`,``,
    `─── LINKEDIN ADS ───`,
    `Headline (70 chars): ${p}: The #1 ${industry} Platform for ${a} Who Want Results`,
    `Intro Text: ${a.charAt(0).toUpperCase()+a.slice(1)} trust ${p} to ${b}. Request a free demo and see why.`,
    `CTA: Request Demo / Learn More / Sign Up`,``,
    `─── TWITTER / X ADS ───`,
    `Tweet (280 chars max):`,
    `${a.charAt(0).toUpperCase()+a.slice(1)}: Want to ${b} without the complexity?`,
    `${p} makes it effortless. Join 10,000+ users getting results. 👇`,
    `[link]`,
    `Website Card Headline: Try ${p} Free Today`,
    `Card Description: ${b.charAt(0).toUpperCase()+b.slice(1)} in minutes. ${g.split('.')[0]}.`,
  ].join('\n')

  if (format === 'CTA Buttons') return [
    `━━━━ CTA BUTTON COPY (${tone.toUpperCase()}) ━━━━`,``,
    `🔘 HIGH-INTENT PRIMARY CTAs:`,
    `• "Start For Free — No Credit Card"`,
    `• "Get Instant Access to ${p}"`,
    `• "Try ${p} Free Today"`,
    `• "See ${p} In Action"`,
    `• "${priceTier === 'Free' ? 'Use It Free Forever' : 'Start My Free Trial'}"`,``,
    `🔘 SOFTER SECONDARY CTAs:`,
    `• "Watch 2-Min Demo"`,
    `• "See How ${p} Works"`,
    `• "Learn More About ${p}"`,
    `• "Explore Features"`,``,
    `🔘 URGENCY / SCARCITY CTAs:`,
    `• "Claim Your Free Trial Now"`,
    `• "Limited Spots — Join Today"`,
    `• "Get Early Access"`,
    `• "Lock In Your Price →"`,``,
    `🔘 BENEFIT-DRIVEN CTAs:`,
    `• "Start ${b.charAt(0).toUpperCase()+b.slice(1)} Today"`,
    `• "Get My ${industry} Advantage"`,
    `• "Help Me ${b.charAt(0).toUpperCase()+b.slice(1)} →"`,``,
    `💡 TIP: Match CTA to funnel stage. Cold traffic → low-friction ("See how it works"). Warm leads → high-intent ("Start free trial").`,
  ].join('\n')

  if (format === 'Full Sales Page') return [
    `╔══════════════════════════════════════╗`,
    `         FULL SALES PAGE COPY          `,
    `╚══════════════════════════════════════╝`,
    `PRODUCT: ${p}  |  TONE: ${tone}  |  INDUSTRY: ${industry}`,``,
    `══ HERO ══`,
    `BADGE: "Trusted by 10,000+ ${a}"`,
    `HEADLINE: "Finally — A ${tw} Way for ${a} to ${b}"`,
    `SUB: "${p} does the heavy lifting so you don't have to. Join thousands of ${a} already getting results."`,
    `PRIMARY CTA: [Start Free Today →]`,
    `TRUST LINE: "${g} · No credit card required"`,``,
    `══ PROBLEM / AGITATE ══`,
    `"If you're a ${a.replace(/s$/,'')}, you know the struggle. You want to ${b}, but…"`,
    `✗ Traditional solutions take too long and cost too much`,
    `✗ Generic tools don't understand ${industry}`,
    `✗ You're left doing everything manually while competitors pull ahead`,
    `✗ You've tried [alternative] and got burned — again`,``,
    `══ SOLUTION ══`,
    `"That's exactly why we built ${p}."`,
    `${p} is the ${tw} platform designed for ${a} in ${industry}.`,``,
    `══ KEY BENEFITS ══`,
    `✅ ${b.charAt(0).toUpperCase()+b.slice(1)} — without the usual complexity`,
    `✅ ${b2.charAt(0).toUpperCase()+b2.slice(1)} — faster than any alternative`,
    `✅ Save hours every week on manual tasks`,
    `✅ ${d.charAt(0).toUpperCase()+d.slice(1)}`,``,
    `══ SOCIAL PROOF ══`,
    `⭐⭐⭐⭐⭐  "${p} helped me ${b} in the first week. I only wish I found it sooner." — Sarah K., ${a.replace(/s$/,'')}`,
    `⭐⭐⭐⭐⭐  "Finally, a ${industry} tool that actually delivers. Game changer." — Marcus R., ${a.replace(/s$/,'')}`,
    `⭐⭐⭐⭐⭐  "We saved 12 hours/week and grew revenue 40% since switching to ${p}." — Team at Acme Co.`,``,
    `══ GUARANTEE ══`,
    `🛡️ "${g}"`,
    `No questions asked. No hoops to jump through. Just results — or your money back.`,``,
    `══ FINAL CTA ══`,
    `"Ready to ${b}?"`,
    `"Join 10,000+ ${a} already using ${p}."`,
    `[${priceTier === 'Free' ? 'Use It Free Forever →' : 'Start My Free Trial →'}]`,
    `TRUST ICONS: 🔒 Secure · 🆓 Free to start · ⚡ Setup in minutes · 💬 Live support`,``,
    `P.S. Every day you wait is another day competitors are pulling ahead. ${p} is the ${tw} shortcut ${a} have been waiting for.`,
  ].join('\n')

  if (format === 'VSL Script Intro') return [
    `━━━━ VIDEO SALES LETTER (VSL) INTRO ━━━━`,
    `[TONE: ${tone} | TARGET: ${a} | PRODUCT: ${p}]`,``,
    `⏱️ HOOK (0:00–0:15) — Stop the scroll:`,
    `"If you're a ${a.replace(/s$/,'')} who's tired of [specific pain], then pay close attention — because in the next [2 minutes], I'm going to show you exactly how to ${b}."`,``,
    `⏱️ CREDIBILITY (0:15–0:40) — Who are you:`,
    `"My name is [Your Name], and I've spent [X years] helping ${a} in ${industry} ${b}. I've worked with [notable clients/results] and discovered a method that ${d}."`,``,
    `⏱️ PROBLEM (0:40–1:30) — Agitate the pain:`,
    `"Here's the problem most ${a} face: [describe the struggle in detail]. You've probably tried [common solution 1] and [common solution 2]. And you're still not [desired outcome]."`,``,
    `⏱️ PROMISE (1:30–2:00) — The big reveal:`,
    `"What I found is that the secret to ${b} isn't [common misconception] — it's [core mechanism of ${p}]. And once you understand this one thing, everything changes."`,``,
    `⏱️ PROOF TEASER (2:00–2:30):`,
    `"I've used this with [number] ${a} and the results were [specific outcome]. People like [testimonial name] went from [before] to [after] in just [timeframe]."`,``,
    `⏱️ TRANSITION TO PITCH (2:30+):`,
    `"So let me walk you through exactly how ${p} works — and how you can [start/join/get access] today, ${priceTier === 'Free' ? 'completely free' : `for just ${pt}`}."`,
  ].join('\n')

  if (format === 'Value Proposition') return [
    `━━━━ VALUE PROPOSITION STATEMENTS ━━━━`,``,
    `📌 ONE-LINE VALUE PROP (elevator pitch):`,
    `"${p} helps ${a} ${b} — without [the #1 pain point]."`,``,
    `📌 EXPANDED VALUE PROP (hero section):`,
    `"${p} is the ${tw} ${industry} platform that helps ${a} ${b} and ${b2}. Unlike [generic alternative], ${d}."`,``,
    `📌 POSITIONING STATEMENT:`,
    `"For ${a} in ${industry} who want to ${b}, ${p} is the [category] that [primary differentiator], unlike [alternative] which [limitation]."`,``,
    `📌 TAGLINE OPTIONS:`,
    `• "${b.charAt(0).toUpperCase()+b.slice(1)}, effortlessly."`,
    `• "Built for ${a}. Designed to ${b}."`,
    `• "${p}: The ${tw} ${industry} advantage."`,
    `• "Stop [pain]. Start ${b.charAt(0).toUpperCase()+b.slice(1)}."`,``,
    `📌 ABOUT US BLURB (website / LinkedIn):`,
    `"${br} was founded to solve one problem: ${a} in ${industry} deserved a better way to ${b}. Today, we help [thousands / X companies] ${b} and ${b2} — ${d}. ${g}."`,``,
    `📌 INVESTOR / PITCH DECK SUMMARY:`,
    `"${p} is a ${tw} ${industry} platform targeting ${a}. The market problem: ${a} struggle to ${b}. Our solution: [brief mechanism]. Key differentiator: ${d}. Traction: [insert metrics]."`,
  ].join('\n')

  // Default: Product Description
  return [
    `━━━━ PRODUCT DESCRIPTIONS (${tone.toUpperCase()}) ━━━━`,``,
    `📝 MICRO (under 30 words — for ads/cards):`,
    `"${p} helps ${a} ${b} — without the complexity. ${priceTier === 'Free' ? 'Free forever.' : `Starting at ${pt.split('(')[1]?.replace(')','') || 'custom pricing'}.`}"`,``,
    `📝 SHORT (50–80 words — for product cards):`,
    `${p} is the ${tw} solution for ${a} in ${industry} who want to ${b}. Built with simplicity in mind, it delivers professional results in minutes — not hours. ${d.charAt(0).toUpperCase()+d.slice(1)}. Trusted by thousands of ${a} worldwide.`,``,
    `📝 MEDIUM (100–150 words — for landing pages):`,
    `${p} is the ${tw} ${industry} platform designed from the ground up for ${a}. Whether you want to ${b} or ${b2}, ${p} gives you everything you need in one place.`,``,
    `What makes ${p} different? ${d.charAt(0).toUpperCase()+d.slice(1)}. That means no more [manual workaround], no more [expensive alternative], and no more guesswork.`,``,
    `Over 10,000 ${a} already use ${p} to save time, cut costs, and get better results. ${g}.`,``,
    `📝 LONG (200+ words — for SEO/detail pages):`,
    `If you're a ${a.replace(/s$/,'')}, you already know how hard it can be to ${b}. ${p} changes that completely.`,``,
    `Designed specifically for ${audience || a} in ${industry}, ${p} is the only platform that [primary mechanism]. While other tools offer generic features, ${p} is purpose-built to help ${a} ${b} and ${b2} — all in one ${tw} interface.`,``,
    `Here's what you get with ${p}:`,
    `✅ ${b.charAt(0).toUpperCase()+b.slice(1)} — faster than any other solution`,
    `✅ ${b2.charAt(0).toUpperCase()+b2.slice(1)} — with zero learning curve`,
    `✅ ${d.charAt(0).toUpperCase()+d.slice(1)}`,
    `✅ World-class support and regular updates`,``,
    `And unlike competing tools, ${p} comes with: ${g}.`,``,
    `Join thousands of ${a} who made the switch. Start ${priceTier === 'Free' ? 'for free' : 'your free trial'} today — no credit card required.`,
  ].join('\n')
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SalesCopyClient() {
  const [product,       setProduct]       = useState('')
  const [brand,         setBrand]         = useState('')
  const [benefit,       setBenefit]       = useState('')
  const [secondBenefit, setSecondBenefit] = useState('')
  const [audience,      setAudience]      = useState('')
  const [industry,      setIndustry]      = useState('SaaS / Software')
  const [priceTier,     setPriceTier]     = useState('Free')
  const [differentiator,setDifferentiator]= useState('')
  const [guarantee,     setGuarantee]     = useState('')
  const [tone,          setTone]          = useState('Professional')
  const [format,        setFormat]        = useState('Product Description')
  const [copied,        setCopied]        = useState(false)

  const output = useMemo(() =>
    generateCopy(product, brand, benefit, secondBenefit, audience, industry, priceTier, differentiator, guarantee, tone, format),
    [product, brand, benefit, secondBenefit, audience, industry, priceTier, differentiator, guarantee, tone, format]
  )

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const print = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><title>${product || 'Sales Copy'} — Copy</title>
      <style>body{font-family:monospace;font-size:13px;line-height:1.7;max-width:800px;margin:40px auto;padding:0 20px}pre{white-space:pre-wrap}</style>
      </head><body><pre>${output.replace(/</g,'&lt;')}</pre></body></html>`)
    w.document.close()
    w.print()
  }

  const hasContent = product.trim() || benefit.trim()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* ── Left: Form ────────────────────────────────────────── */}
      <div style={CARD}>
        <div style={SECTION_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Describe Your Product</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>Fill in details — copy updates live as you type</p>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Product / Service Name</label>
              <input style={INPUT} value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. TaskFlow Pro" />
            </div>
            <div>
              <label style={LABEL}>Brand / Company Name</label>
              <input style={INPUT} value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Flowify Inc." />
            </div>
          </div>

          <div>
            <label style={LABEL}>Primary Key Benefit <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(what outcome does it deliver?)</span></label>
            <input style={INPUT} value={benefit} onChange={e => setBenefit(e.target.value)} placeholder="e.g. save 5 hours a week on admin tasks" />
          </div>

          <div>
            <label style={LABEL}>Secondary Benefit</label>
            <input style={INPUT} value={secondBenefit} onChange={e => setSecondBenefit(e.target.value)} placeholder="e.g. cut software costs by 60%" />
          </div>

          <div>
            <label style={LABEL}>Target Audience</label>
            <input style={INPUT} value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. small business owners, HR managers" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Industry</label>
              <select style={SELECT} value={industry} onChange={e => setIndustry(e.target.value)}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Price Tier</label>
              <select style={SELECT} value={priceTier} onChange={e => setPriceTier(e.target.value)}>
                {PRICE_TIERS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={LABEL}>Unique Differentiator <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(what makes it unlike competitors?)</span></label>
            <input style={INPUT} value={differentiator} onChange={e => setDifferentiator(e.target.value)} placeholder="e.g. the only tool with real-time AI coaching built in" />
          </div>

          <div>
            <label style={LABEL}>Guarantee / Risk Reversal</label>
            <input style={INPUT} value={guarantee} onChange={e => setGuarantee(e.target.value)} placeholder="e.g. 30-day no-questions-asked refund" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Tone</label>
              <select style={SELECT} value={tone} onChange={e => setTone(e.target.value)}>
                {TONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Copy Format</label>
              <select style={SELECT} value={format} onChange={e => setFormat(e.target.value)}>
                {FORMATS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Format quick-pick */}
          <div>
            <label style={{ ...LABEL, marginBottom: 8 }}>Quick Format Select</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FORMATS.map(f => (
                <button key={f} onClick={() => setFormat(f)} style={{
                  padding: '5px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: format === f ? 'var(--brand-2)' : 'var(--bg-2)',
                  border: `1px solid ${format === f ? 'var(--brand-2)' : 'var(--line-strong)'}`,
                  color: format === f ? '#fff' : 'var(--fg-1)',
                }}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Live Preview ───────────────────────────────── */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
        <div style={PANEL_HDR}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
              Live Copy Preview
            </h2>
            <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '2px 0 0' }}>Updates as you type · {format}</p>
          </div>
          {hasContent && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={print} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg-1)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                🖨️ Print
              </button>
              <button onClick={copy} style={{ padding: '6px 12px', borderRadius: 8, background: copied ? '#16a34a' : 'var(--brand-2)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {copied ? '✅ Copied!' : '📋 Copy All'}
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {hasContent ? (
            <>
              {/* Summary bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Format', value: format },
                  { label: 'Tone', value: tone },
                  { label: 'Audience', value: audience || '—' },
                  { label: 'Price', value: priceTier },
                ].map(item => (
                  <div key={item.label} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{item.label}: </span>
                    <span style={{ color: 'var(--brand-2)', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Paper-style preview */}
              <div style={{ background: 'var(--bg-0)', border: '1px solid var(--line)', borderRadius: 10, padding: 20 }}>
                <pre style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>
                  {output}
                </pre>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>✍️</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Your copy will appear here</p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 0' }}>Start typing your product details on the left</p>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {FORMATS.map(f => (
                  <span key={f} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11, color: 'var(--fg-2)' }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
