'use client'
import { useState, useMemo, CSSProperties } from 'react'

// ─── Style constants ──────────────────────────────────────────────────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, overflow: 'hidden' }
const LABEL: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 6 }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
const SELECT: CSSProperties = { ...INPUT, cursor: 'pointer' }
const SECTION_HDR: CSSProperties = { background: 'linear-gradient(135deg,#7c5bf6,#9333ea)', padding: '16px 20px' }
const PANEL_HDR: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }

const PLATFORMS  = ['Google Ads', 'Facebook / Instagram', 'LinkedIn', 'Twitter / X', 'TikTok', 'YouTube', 'All Platforms']
const OBJECTIVES = ['Generate Leads', 'Drive Sales / Conversions', 'Boost Brand Awareness', 'App Installs', 'Website Traffic', 'Retargeting / Remarketing', 'Event Promotion']
const BUDGETS    = ['Bootstrapped (lean copy)', 'Growth Stage (test & iterate)', 'Scale Stage (proven offer)']
const AGE_RANGES = ['18–24', '25–34', '35–44', '45–54', '55+', 'All Ages']

// ─── Generation ───────────────────────────────────────────────────────────────
function generate(
  product: string, brand: string, usp: string, audience: string,
  platform: string, objective: string, offer: string, ageRange: string, budget: string,
): string {
  const p  = product  || 'your product'
  const br = brand    || p
  const u  = usp      || 'saves time and money'
  const a  = audience || 'professionals'
  const obj = objective.toLowerCase()
  const ofr = offer   || ''
  const hasOffer = ofr.trim().length > 0

  const lines: string[] = []

  const ctaForObj: Record<string, string> = {
    'generate leads':               'Get Your Free Quote',
    'drive sales / conversions':    'Buy Now — Limited Time',
    'boost brand awareness':        'Learn More',
    'app installs':                 'Download Free',
    'website traffic':              'Visit Our Site',
    'retargeting / remarketing':    'Come Back & Save',
    'event promotion':              'Reserve My Spot',
  }
  const cta = ctaForObj[obj] || 'Get Started Free'

  if (platform === 'Google Ads' || platform === 'All Platforms') {
    lines.push(
      `━━━━━━━━ GOOGLE ADS ━━━━━━━━`,``,
      `📣 RESPONSIVE SEARCH AD:`,``,
      `Headlines (write 8–10; Google picks the best combos):`,
      `H1: ${p} for ${a} — Free Trial`,
      `H2: ${u.substring(0,28).charAt(0).toUpperCase()+u.slice(0,28).substring(1)}`,
      `H3: Trusted by 10,000+ ${a.substring(0,12)}`,
      `H4: ${hasOffer ? ofr.substring(0,25) : 'No Setup Fees · Cancel Anytime'}`,
      `H5: See Results in Minutes`,
      `H6: ${br} — ${a} Love Us`,``,
      `Descriptions (write 4; Google picks 2):`,
      `D1: Join thousands of ${a} using ${p} to ${u}. Start free — no credit card needed.`,
      `D2: ${p} helps ${a} ${u}. Results in minutes. No setup hassle. Try today for free.`,
      `D3: ${hasOffer ? `${ofr} — ` : ''}${u.charAt(0).toUpperCase()+u.slice(1)} with ${p}. ${cta}.`,
      `D4: The #1 ${obj.includes('leads') ? 'lead generation' : obj.includes('sales') ? 'conversion' : 'growth'} tool for ${a}.`,``,
      `📊 PERFORMANCE MAX ASSET SUGGESTIONS:`,
      `Short headline (30 chars): ${p} — Free Trial`,
      `Long headline 1: ${u.charAt(0).toUpperCase()+u.slice(1)} for ${a} — Join Free`,
      `Long headline 2: The ${obj.includes('brand') ? 'Trusted' : 'Fastest'} Way to ${u.charAt(0).toUpperCase()+u.slice(1)}`,``,
    )
  }

  if (platform === 'Facebook / Instagram' || platform === 'All Platforms') {
    lines.push(
      `━━━━━━━━ FACEBOOK / INSTAGRAM ADS ━━━━━━━━`,``,
      `🎯 AUDIENCE TARGETING NOTES:`,
      `• Age range: ${ageRange}  |  Budget tier: ${budget}`,
      `• Interests: [${a} communities, ${p.toLowerCase()} alternatives, competitors]`,
      `• Custom audiences: website visitors, email list, lookalikes`,``,
      `📘 FACEBOOK AD — Primary Text (125 chars optimal):`,
      `🚨 Attention ${a}!`,``,
      `Struggling to ${u}? You're not alone.`,
      `That's why we built ${p} — the fastest way for ${a} to ${u}, without the usual headaches.`,``,
      `✅ ${u.charAt(0).toUpperCase()+u.slice(1)}`,
      `✅ Works in under 10 minutes`,
      `✅ Join 10,000+ happy users`,
      ...(hasOffer ? [`🎁 Special offer: ${ofr}`] : []),``,
      `👉 ${cta} — no credit card.`,``,
      `Facebook Headline: ${p} — ${u.charAt(0).toUpperCase()+u.slice(1)}`,
      `Facebook Description: The #1 tool for ${a}. ${cta}.`,
      `CTA Button: [Learn More / Sign Up Free / Get Offer]`,``,
      `📸 INSTAGRAM — Caption:`,
      `Ready to ${u}? 💪`,
      `${p} is what ${a} have been waiting for.`,``,
      `No fluff. Just results. 🎯`,
      ...(hasOffer ? [`⚡ ${ofr}`] : []),``,
      `🔗 Link in bio to ${cta.toLowerCase()}.`,``,
      `#${p.replace(/\s+/g,'').toLowerCase()} #${a.replace(/\s+/g,'').toLowerCase().substring(0,12)} #${obj.replace(/\s+/g,'').toLowerCase().substring(0,10)} #business #marketing`,``,
    )
  }

  if (platform === 'LinkedIn' || platform === 'All Platforms') {
    lines.push(
      `━━━━━━━━ LINKEDIN ADS ━━━━━━━━`,``,
      `💼 SPONSORED CONTENT:`,``,
      `Headline (70 chars): ${p}: The #1 Platform for ${a} Who Want to ${u.charAt(0).toUpperCase()+u.slice(1)}`,
      `Intro Text (150 chars): ${a.charAt(0).toUpperCase()+a.slice(1)} trust ${p} to ${u}. See how in a free demo.`,
      `CTA Button: [Request Demo / Learn More / Sign Up]`,``,
      `💼 CONVERSATION AD INTRO:`,
      `Hi [First Name],`,``,
      `As a ${a.replace(/s$/,'')}, you know how hard it is to ${u}. At ${br}, we've helped ${a} [specific result] — and we'd love to show you how.`,``,
      `Would a quick 15-min demo be worthwhile?`,``,
      `Buttons:`,
      `→ "Yes, show me a demo" (leads to calendar)`,
      `→ "Send me the case study" (lead magnet)`,
      `→ "Maybe later" (polite decline)`,``,
    )
  }

  if (platform === 'Twitter / X' || platform === 'All Platforms') {
    lines.push(
      `━━━━━━━━ TWITTER / X ADS ━━━━━━━━`,``,
      `🐦 PROMOTED TWEET (280 chars):`,
      `${a.charAt(0).toUpperCase()+a.slice(1)}: Want to ${u} without the complexity?`,``,
      `${p} makes it effortless. Join 10,000+ users already getting results. 👇`,``,
      `${hasOffer ? `💥 ${ofr} — ` : ''}${cta} [link]`,``,
      `🐦 WEBSITE CARD:`,
      `Headline: Try ${p} Free Today`,
      `Description: ${u.charAt(0).toUpperCase()+u.slice(1)} in minutes. ${hasOffer ? ofr+'.' : 'No credit card needed.'}`,``,
    )
  }

  if (platform === 'TikTok' || platform === 'All Platforms') {
    lines.push(
      `━━━━━━━━ TIKTOK ADS ━━━━━━━━`,``,
      `🎵 IN-FEED AD SCRIPT (15–30 sec):`,``,
      `0:00–0:03 — HOOK (stop the scroll):`,
      `"If you're a ${a.replace(/s$/,'')} who [specific pain], this is for you. 👀"`,``,
      `0:03–0:10 — PROBLEM:`,
      `"Most ${a} struggle to ${u} because [reason]. Sound familiar?"`,``,
      `0:10–0:20 — SOLUTION:`,
      `"We built ${p} to change that. Here's how it works: [quick demo/visual]"`,``,
      `0:20–0:27 — PROOF + CTA:`,
      `"${hasOffer ? ofr+'. ' : ''}Join thousands of ${a}. ${cta} — link in bio."`,``,
    )
  }

  if (platform === 'YouTube' || platform === 'All Platforms') {
    lines.push(
      `━━━━━━━━ YOUTUBE ADS ━━━━━━━━`,``,
      `▶️ PRE-ROLL (skippable, 5-sec hook is critical):`,``,
      `0:00–0:05 — NON-SKIPPABLE HOOK:`,
      `"If you want to ${u} — stay for the next 30 seconds."`,``,
      `0:05–0:20 — PROBLEM + AUTHORITY:`,
      `"Most ${a} waste hours on [problem]. At ${br}, we've helped [X] ${a} ${u} — without the usual cost and complexity."`,``,
      `0:20–0:35 — SOLUTION DEMO:`,
      `"${p} is the only [category] that [key differentiator]. Let me show you how."`,
      `[Screen recording / product demo]`,``,
      `0:35–0:45 — CTA:`,
      `"${hasOffer ? ofr+'. ' : ''}${cta} at [URL]. Link in description."`,``,
    )
  }

  // A/B test suggestions
  lines.push(
    `━━━━━━━━ A/B TEST SUGGESTIONS ━━━━━━━━`,``,
    `📊 Always test these variants:`,
    `• Headline A (benefit-led): "${u.charAt(0).toUpperCase()+u.slice(1)}"`,
    `• Headline B (curiosity): "Why ${a} Switch to ${p}"`,
    `• CTA A: "${cta}"`,
    `• CTA B: "See How It Works →"`,
    `• Offer A: Free trial  →  Offer B: ${hasOffer ? ofr : 'Money-back guarantee'}`,
    `• Audience A: ${ageRange} ${a}  →  Audience B: Lookalike audience`,
  )

  return lines.join('\n')
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdCreativeClient() {
  const [product,   setProduct]   = useState('')
  const [brand,     setBrand]     = useState('')
  const [usp,       setUsp]       = useState('')
  const [audience,  setAudience]  = useState('')
  const [platform,  setPlatform]  = useState('All Platforms')
  const [objective, setObjective] = useState('Generate Leads')
  const [offer,     setOffer]     = useState('')
  const [ageRange,  setAgeRange]  = useState('25–34')
  const [budget,    setBudget]    = useState('Growth Stage (test & iterate)')
  const [copied,    setCopied]    = useState(false)

  const output = useMemo(() =>
    generate(product, brand, usp, audience, platform, objective, offer, ageRange, budget),
    [product, brand, usp, audience, platform, objective, offer, ageRange, budget]
  )

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const print = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><title>${product || 'Ad Creative'} — Creatives</title>
      <style>body{font-family:monospace;font-size:13px;line-height:1.7;max-width:800px;margin:40px auto;padding:0 20px}pre{white-space:pre-wrap}</style>
      </head><body><pre>${output.replace(/</g,'&lt;')}</pre></body></html>`)
    w.document.close(); w.print()
  }

  const hasContent = product.trim() || usp.trim()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* ── Form ── */}
      <div style={CARD}>
        <div style={SECTION_HDR}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Ad Campaign Details</h2>
          <p style={{ fontSize: 12, color: 'var(--fg-1)', margin: '4px 0 0' }}>Fill in your details — ads update live</p>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Product / Service</label>
              <input style={INPUT} value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g. CloudHR Software" />
            </div>
            <div>
              <label style={LABEL}>Brand / Company Name</label>
              <input style={INPUT} value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. CloudHR Inc." />
            </div>
          </div>

          <div>
            <label style={LABEL}>Unique Selling Point (USP)</label>
            <input style={INPUT} value={usp} onChange={e => setUsp(e.target.value)} placeholder="e.g. automate payroll in one click, cutting 8 hrs/week" />
          </div>

          <div>
            <label style={LABEL}>Target Audience</label>
            <input style={INPUT} value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. HR managers at companies with 10–200 staff" />
          </div>

          <div>
            <label style={LABEL}>Special Offer / Discount <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>(optional)</span></label>
            <input style={INPUT} value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. 30% off first 3 months · use code HR30" />
          </div>

          {/* Platform picker */}
          <div>
            <label style={{ ...LABEL, marginBottom: 8 }}>Platform</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PLATFORMS.map(plat => (
                <button key={plat} onClick={() => setPlatform(plat)} style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: platform === plat ? 'var(--brand-2)' : 'var(--bg-2)',
                  border: `1px solid ${platform === plat ? 'var(--brand-2)' : 'var(--line-strong)'}`,
                  color: platform === plat ? '#fff' : 'var(--fg-1)',
                }}>{plat}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Campaign Objective</label>
              <select style={SELECT} value={objective} onChange={e => setObjective(e.target.value)}>
                {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={LABEL}>Target Age Range</label>
              <select style={SELECT} value={ageRange} onChange={e => setAgeRange(e.target.value)}>
                {AGE_RANGES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={LABEL}>Campaign Maturity / Budget Stage</label>
            <select style={SELECT} value={budget} onChange={e => setBudget(e.target.value)}>
              {BUDGETS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ ...CARD, display: 'flex', flexDirection: 'column' }}>
        <div style={PANEL_HDR}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', margin: 0 }}>Live Ad Creatives</h2>
            <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '2px 0 0' }}>Platform: {platform} · {objective}</p>
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
              {/* Stats bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Platform', value: platform },
                  { label: 'Objective', value: objective.split('/')[0].trim() },
                  { label: 'Age', value: ageRange },
                  { label: 'Stage', value: budget.split(' ')[0] },
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
              <span style={{ fontSize: 48, marginBottom: 12 }}>🎯</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-1)', margin: 0 }}>Ad creatives will appear here</p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '6px 0 0' }}>Supports Google, Facebook, Instagram, LinkedIn, Twitter, TikTok & YouTube</p>
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
