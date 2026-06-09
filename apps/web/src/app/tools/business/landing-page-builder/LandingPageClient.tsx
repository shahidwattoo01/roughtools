'use client'
import { useState, useMemo, CSSProperties } from 'react'

// ─── Style constants ──────────────────────────────────────────────────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, overflow: 'hidden' }
const LABEL: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6 }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const SELECT: CSSProperties = { ...INPUT, cursor: 'pointer' }
const TEXTAREA: CSSProperties = { ...INPUT, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }
const SECTION_HDR: CSSProperties = { background: 'linear-gradient(135deg,#7c5bf6,#9333ea)', padding: '16px 20px' }
const PANEL_HDR: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }

const PAGE_GOALS  = ['Generate Leads', 'Drive Sign-ups', 'Sell a Product', 'Book a Demo', 'Download a Resource', 'Webinar Registration', 'Waitlist / Coming Soon', 'Fundraising / Donation']
const INDUSTRIES  = ['SaaS / Software', 'E-commerce', 'Consulting', 'Coaching', 'Agency', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Non-profit', 'Other']
const TONES       = ['Professional', 'Friendly', 'Urgent', 'Premium / Luxury', 'Bold / Direct', 'Empathetic']
const GUARANTEES  = ['30-day money-back guarantee', '60-day money-back guarantee', 'Results guarantee or full refund', 'Free trial — no credit card', 'Cancel anytime, no fees', 'None']
const PRICING_MODELS = ['Free forever', 'Freemium', 'Free trial then paid', 'One-time payment', 'Monthly subscription', 'Annual subscription', 'Enterprise / Quote-based']

// ─── Generation ───────────────────────────────────────────────────────────────
function buildLandingPage(
  product: string, brand: string, headline: string, benefit: string,
  secondBenefit: string, audience: string, goal: string, industry: string,
  tone: string, price: string, pricingModel: string, socialProof: string,
  features: string, guarantee: string, showPricing: boolean,
): string {
  const p   = product       || 'your product'
  const br  = brand         || p
  const b   = benefit       || 'save time and grow faster'
  const b2  = secondBenefit || 'get professional results'
  const a   = audience      || 'professionals'
  const sp  = socialProof   || '10,000+'
  const g   = guarantee     || '30-day money-back guarantee'
  const h   = headline      || `The Smartest Way for ${a} to ${b.charAt(0).toUpperCase()+b.slice(1)}`

  // Parse features (one per line)
  const featureList = features.trim()
    ? features.trim().split('\n').filter(f => f.trim()).slice(0, 8)
    : ['[Feature 1 — with direct benefit]', '[Feature 2 — with direct benefit]', '[Feature 3 — with direct benefit]', '[Feature 4 — with direct benefit]', '[Feature 5 — with direct benefit]', '[Feature 6 — with direct benefit]']

  const ctaMap: Record<string, string> = {
    'Generate Leads':         'Get Your Free Quote →',
    'Drive Sign-ups':         'Start Free — No Credit Card →',
    'Sell a Product':         `Buy Now${price ? ` — ${price}` : ''} →`,
    'Book a Demo':            'Book My Free Demo →',
    'Download a Resource':    'Download Free Guide →',
    'Webinar Registration':   'Reserve My Spot →',
    'Waitlist / Coming Soon': 'Join the Waitlist →',
    'Fundraising / Donation': 'Donate Now →',
  }
  const cta = ctaMap[goal] || 'Get Started Free →'

  const urgencyMap: Record<string, string> = {
    'Generate Leads':         `Join ${sp} businesses already getting results.`,
    'Drive Sign-ups':         `Over ${sp} users signed up this month.`,
    'Sell a Product':         'Limited stock available — order today.',
    'Book a Demo':            'Only 5 demo slots left this week.',
    'Download a Resource':    `Downloaded ${sp} times.`,
    'Webinar Registration':   'Seats are limited — register before they fill up.',
    'Waitlist / Coming Soon': `${sp} people already on the waitlist.`,
    'Fundraising / Donation': `${sp} supporters and counting.`,
  }
  const urgency = urgencyMap[goal] || `Trusted by ${sp} users worldwide.`

  const lines: string[] = []

  lines.push(
    `╔══════════════════════════════════════════╗`,
    `         LANDING PAGE COPY STRUCTURE        `,
    `╚══════════════════════════════════════════╝`,
    ``,
    `📋 CONFIG: Goal: ${goal} · Industry: ${industry} · Tone: ${tone}`,
    `          Pricing: ${pricingModel}${price ? ` · Price: ${price}` : ''}`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION 1 — HERO  (above the fold)`,
    `══════════════════════════════════════════`,
    ``,
    `🏷️  TRUST BADGE / PRE-HEADLINE:`,
    `"${urgency}"`,
    ``,
    `📢 MAIN HEADLINE:`,
    `"${h}"`,
    ``,
    `📝 SUB-HEADLINE:`,
    `"${p} gives ${a} everything they need to ${b} and ${b2} — without the complexity, cost, or steep learning curve."`,
    ``,
    `🔘 PRIMARY CTA BUTTON:`,
    `[ ${cta} ]`,
    ``,
    `🔒 MICRO-COPY (below button):`,
    `"${g !== 'None' ? g+' · ' : ''}No credit card required · Setup in under 5 minutes"`,
    ``,
    `🖼️  HERO VISUAL SUGGESTION:`,
    `[Product screenshot/mockup OR happy ${a} achieving ${b}. Use real imagery, not stock.]`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION 2 — SOCIAL PROOF / LOGO BAR`,
    `══════════════════════════════════════════`,
    ``,
    `"Trusted by ${a} at leading ${industry} companies:"`,
    `[Logo 1] · [Logo 2] · [Logo 3] · [Logo 4] · [Logo 5]`,
    ``,
    `📊 STATS STRIP:`,
    `| ${sp} ${a} | 4.9 ★ avg rating | #1 in ${industry} | 99% satisfaction |`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION 3 — PROBLEM / AGITATE`,
    `══════════════════════════════════════════`,
    ``,
    `😤 SECTION HEADLINE: "Sound familiar?"`,
    ``,
    `PAIN POINTS:`,
    `✗ Spending hours manually doing what ${p} automates in minutes`,
    `✗ Expensive tools that promise results but deliver headaches`,
    `✗ Falling behind while competitors ${b} effortlessly`,
    `✗ No clear, repeatable system to [achieve your core outcome]`,
    `✗ Generic solutions not built for ${industry}`,
    ``,
    `📌 TRANSITION LINE:`,
    `"There's a better way. And it doesn't require a massive budget or a technical team."`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION 4 — SOLUTION / HOW IT WORKS`,
    `══════════════════════════════════════════`,
    ``,
    `✅ SECTION HEADLINE:`,
    `"Introducing ${p} — the ${tone.toLowerCase().split('/')[0].trim()} platform built for ${a} in ${industry}"`,
    ``,
    `3-STEP HOW IT WORKS:`,
    ``,
    `Step 1 🔵  Set up in minutes`,
    `"[Connect / import / start] in under 5 minutes — no technical skills, no IT team needed."`,
    ``,
    `Step 2 🟣  ${p} does the heavy lifting`,
    `"${p} automatically [performs core function] so you can ${b} without the grind."`,
    ``,
    `Step 3 🟢  See real, measurable results`,
    `"Track your progress and see measurable outcomes within [days/weeks] — or get your money back."`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION 5 — FEATURES + BENEFITS`,
    `══════════════════════════════════════════`,
    ``,
    `🏆 SECTION HEADLINE: "Everything ${a} need to ${b}"`,
    ``,
    `FEATURE CARDS (Feature Name → What it does → Benefit delivered):`,
    ``,
    ...featureList.map((f, i) => [
      `🔹 ${f.startsWith('[') ? `Feature ${i+1}` : f.split('—')[0].trim()}`,
      `"${f.startsWith('[') ? f : `${f} so you can get more done in less time.`}"`,
      ``,
    ].join('\n')),
    `══════════════════════════════════════════`,
    `  SECTION 6 — TESTIMONIALS / SOCIAL PROOF`,
    `══════════════════════════════════════════`,
    ``,
    `💬 SECTION HEADLINE: "See why ${a} love ${p}"`,
    ``,
    `TESTIMONIAL 1 (specific result):`,
    `⭐⭐⭐⭐⭐`,
    `"${p} helped me ${b} in literally the first week. I only wish I'd found it sooner."`,
    `— [Full Name], [Job Title] at [Company Name]  📸 [Photo]`,
    ``,
    `TESTIMONIAL 2 (emotional + logical):`,
    `⭐⭐⭐⭐⭐`,
    `"Finally, a ${industry} tool that actually does what it promises. ${p} is a game-changer for ${a}."`,
    `— [Full Name], [Job Title] at [Company Name]  📸 [Photo]`,
    ``,
    `TESTIMONIAL 3 (ROI / numbers):`,
    `⭐⭐⭐⭐⭐`,
    `"We saved [X hours/week] and [increased revenue / reduced cost] by [X]% since switching to ${p}."`,
    `— [Full Name], [Job Title] at [Company Name]  📸 [Photo]`,
    ``,
    `📊 AGGREGATE PROOF BAR:`,
    `⭐ 4.9/5 from ${sp} reviews · Rated #1 in ${industry} · [Award badge]`,
  )

  if (showPricing) {
    lines.push(
      ``,
      `══════════════════════════════════════════`,
      `  SECTION 7 — PRICING`,
      `══════════════════════════════════════════`,
      ``,
      `💰 SECTION HEADLINE: "Simple, transparent pricing for ${a}"`,
      `SUB: "No hidden fees. No long-term contracts. Cancel anytime."`,
      ``,
      `PLAN 1 — STARTER (${pricingModel === 'Free forever' ? 'Free Forever' : 'Free Trial'}):`,
      `"Perfect for ${a} just getting started"`,
      `[Feature 1] · [Feature 2] · [Feature 3]`,
      `Price: ${pricingModel === 'Free forever' ? '$0/month — free forever' : 'Free for [X] days — no credit card'}`,
      `CTA: "Start Free →"`,
      ``,
      `PLAN 2 — PRO (recommended) ⭐ Most Popular:`,
      `"For ${a} serious about ${b}"`,
      `Everything in Starter, plus:`,
      `[Advanced feature 1] · [Advanced feature 2] · Priority support`,
      `Price: ${price || '[Your price]/month'}`,
      `CTA: "Start Pro Trial →"`,
      ``,
      `PLAN 3 — ENTERPRISE:`,
      `"For teams and organisations in ${industry}"`,
      `Everything in Pro, plus: Custom integrations, SSO, dedicated CSM`,
      `Price: Custom — contact us`,
      `CTA: "Contact Sales →"`,
      ``,
      `💡 PRICING PAGE TIPS:`,
      `• Anchor: Show most expensive plan first (left to right)`,
      `• Highlight 'Most Popular' plan visually`,
      `• Add annual discount toggle (e.g., 'Save 20% annually')`,
      `• Show per-user cost if team pricing`,
    )
  }

  lines.push(
    ``,
    `══════════════════════════════════════════`,
    `  SECTION ${showPricing ? '8' : '7'} — FAQ`,
    `══════════════════════════════════════════`,
    ``,
    `❓ SECTION HEADLINE: "Everything you need to know"`,
    ``,
    `Q: How long does it take to set up ${p}?`,
    `A: Most ${a} are up and running in under 10 minutes. Zero technical skills required.`,
    ``,
    `Q: Do I need a credit card to start?`,
    `A: No — your free trial gives you full access for [X] days with no credit card.`,
    ``,
    `Q: Can I cancel anytime?`,
    `A: Yes. Cancel with one click. No contracts, no cancellation fees, no hassle.`,
    ``,
    `Q: Is ${p} right for ${industry}?`,
    `A: Yes — ${p} was built specifically with ${industry} workflows in mind. [Specific proof.]`,
    ``,
    `Q: What if I need help?`,
    `A: Our support team responds in under [X hours]. Live chat available [hours/days].`,
    ``,
    `Q: Is my data secure?`,
    `A: Yes. We use [SSL / SOC 2 / end-to-end encryption] to keep your data safe.`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION ${showPricing ? '9' : '8'} — GUARANTEE`,
    `══════════════════════════════════════════`,
    ``,
    `🛡️ GUARANTEE HEADLINE: "Try ${p} completely risk-free"`,
    ``,
    `"${g !== 'None' ? g.charAt(0).toUpperCase()+g.slice(1) : 'We stand behind our product 100%.'}`,
    `If ${p} doesn't help you ${b}, we'll [make it right / refund you in full]. No questions. No hoops."`,
    ``,
    `══════════════════════════════════════════`,
    `  SECTION ${showPricing ? '10' : '9'} — FINAL CTA`,
    `══════════════════════════════════════════`,
    ``,
    `🚀 FINAL HEADLINE: "Ready to ${b}?"`,
    ``,
    `SUB: "Join ${sp} ${a} already using ${p}. ${goal === 'Generate Leads' ? 'Get your free quote today.' : 'Start free — no credit card required.'}"`,
    ``,
    `[ ${cta} ]`,
    ``,
    `TRUST ICONS: 🔒 Secure · 🆓 Free to start · ⚡ Setup in minutes · 💬 Live support · 🛡️ ${g !== 'None' ? g.split(' ').slice(0,2).join(' ')+'…' : 'Trusted'}`,
    ``,
    `──────────────────────────────────────────`,
    `  FOOTER`,
    `──────────────────────────────────────────`,
    ``,
    `[${br} Logo]`,
    `© ${new Date().getFullYear()} ${br}. All rights reserved.`,
    `[Privacy Policy] · [Terms of Service] · [Contact] · [Social Links]`,
  )

  return lines.join('\n')
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPageClient() {
  const [product,      setProduct]      = useState('')
  const [brand,        setBrand]        = useState('')
  const [headline,     setHeadline]     = useState('')
  const [benefit,      setBenefit]      = useState('')
  const [secondBenefit,setSecondBenefit]= useState('')
  const [audience,     setAudience]     = useState('')
  const [goal,         setGoal]         = useState('Drive Sign-ups')
  const [industry,     setIndustry]     = useState('SaaS / Software')
  const [tone,         setTone]         = useState('Professional')
  const [price,        setPrice]        = useState('')
  const [pricingModel, setPricingModel] = useState('Free trial then paid')
  const [socialProof,  setSocialProof]  = useState('')
  const [features,     setFeatures]     = useState('')
  const [guarantee,    setGuarantee]    = useState('30-day money-back guarantee')
  const [showPricing,  setShowPricing]  = useState(true)
  const [copied,       setCopied]       = useState(false)

  const output = useMemo(() =>
    buildLandingPage(product, brand, headline, benefit, secondBenefit, audience, goal, industry, tone, price, pricingModel, socialProof, features, guarantee, showPricing),
    [product, brand, headline, benefit, secondBenefit, audience, goal, industry, tone, price, pricingModel, socialProof, features, guarantee, showPricing]
  )

  const featureCount = features.trim() ? features.trim().split('\n').filter(f => f.trim()).length : 0

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const print = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><title>${product || 'Landing Page'} — Copy</title>
      <style>body{font-family:monospace;font-size:13px;line-height:1.7;max-width:800px;margin:40px auto;padding:0 20px}pre{white-space:pre-wrap}</style>
      </head><body><pre>${output.replace(/</g,'&lt;')}</pre></body></html>`)
    w.document.close(); w.print()
  }

  const hasContent = product.trim() || benefit.trim()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* ── Form ── */}
      <div style={CARD}>
        <div style={SECTION_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Page Details</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0' }}>Fill in the basics — full page structure updates live</p>
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
            <label style={LABEL}>Hero Headline <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(leave blank to auto-generate)</span></label>
            <input style={INPUT} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. The #1 Project Tool for Remote Teams" />
          </div>

          <div>
            <label style={LABEL}>Primary Key Benefit</label>
            <input style={INPUT} value={benefit} onChange={e => setBenefit(e.target.value)} placeholder="e.g. manage projects 3× faster" />
          </div>

          <div>
            <label style={LABEL}>Secondary Benefit</label>
            <input style={INPUT} value={secondBenefit} onChange={e => setSecondBenefit(e.target.value)} placeholder="e.g. cut communication overhead by 50%" />
          </div>

          <div>
            <label style={LABEL}>Target Audience</label>
            <input style={INPUT} value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. remote teams at growing startups" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Page Goal</label>
              <select style={SELECT} value={goal} onChange={e => setGoal(e.target.value)}>
                {PAGE_GOALS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Industry</label>
              <select style={SELECT} value={industry} onChange={e => setIndustry(e.target.value)}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Pricing Model</label>
              <select style={SELECT} value={pricingModel} onChange={e => setPricingModel(e.target.value)}>
                {PRICING_MODELS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Price <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(optional)</span></label>
              <input style={INPUT} value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. $49/mo" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Social Proof Number</label>
              <input style={INPUT} value={socialProof} onChange={e => setSocialProof(e.target.value)} placeholder="e.g. 10,000+" />
            </div>
            <div>
              <label style={LABEL}>Guarantee</label>
              <select style={SELECT} value={guarantee} onChange={e => setGuarantee(e.target.value)}>
                {GUARANTEES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={LABEL}>
              Features List <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(one per line, up to 8)</span>
              {featureCount > 0 && <span style={{ marginLeft: 8, color: 'var(--brand-2)', fontSize: 11 }}>{featureCount} entered</span>}
            </label>
            <textarea style={TEXTAREA} value={features} onChange={e => setFeatures(e.target.value)}
              placeholder={'e.g.\nReal-time collaboration — work together without version conflicts\nAI task suggestions — auto-prioritise your backlog\nOne-click reporting — send client reports in seconds'} />
          </div>

          {/* Tone picker */}
          <div>
            <label style={{ ...LABEL, marginBottom: 8 }}>Tone</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: tone === t ? 'var(--brand-2)' : 'var(--bg-2)',
                  border: `1px solid ${tone === t ? 'var(--brand-2)' : 'var(--line-strong)'}`,
                  color: tone === t ? '#fff' : 'var(--fg-1)',
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Include pricing toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div onClick={() => setShowPricing(!showPricing)} style={{
              width: 40, height: 22, borderRadius: 11, background: showPricing ? 'var(--brand-2)' : 'var(--line-strong)',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{ position: 'absolute', top: 3, left: showPricing ? 21 : 3, width: 16, height: 16, borderRadius: 8, background: '#fff', transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>Include pricing section</span>
          </label>
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
        <div style={PANEL_HDR}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Live Landing Page Copy</h2>
            <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '2px 0 0' }}>{showPricing ? '10' : '9'} sections · {goal} · {tone}</p>
          </div>
          {hasContent && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={print} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg-1)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🖨️ Print</button>
              <button onClick={copy} style={{ padding: '6px 12px', borderRadius: 8, background: copied ? '#16a34a' : 'var(--brand-2)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {copied ? '✅ Copied!' : '📋 Copy All'}
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {hasContent ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Goal', value: goal.split('/')[0].trim() },
                  { label: 'Industry', value: industry.split('/')[0].trim() },
                  { label: 'Tone', value: tone.split('/')[0].trim() },
                  { label: 'Pricing', value: showPricing ? '✅ included' : '✗ hidden' },
                  ...(featureCount > 0 ? [{ label: 'Features', value: `${featureCount} custom` }] : []),
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
              <span style={{ fontSize: 48, marginBottom: 12 }}>🖥️</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Full landing page copy will appear here</p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 0' }}>Hero → Problem → Solution → Features → Proof → Pricing → FAQ → Guarantee → CTA → Footer</p>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {['Hero', 'Social Proof', 'Problem', 'Solution', 'Features', 'Testimonials', 'Pricing', 'FAQ', 'Guarantee', 'CTA', 'Footer'].map(s => (
                  <span key={s} style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-2)', border: '1px solid var(--line)', fontSize: 11, color: 'var(--fg-2)' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
