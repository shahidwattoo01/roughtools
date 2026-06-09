'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type Template = 'corporate' | 'creative' | 'technical' | 'startup'
type ProjectType = 'Web Design & Development' | 'Software Development' | 'Digital Marketing' | 'Business Consulting' | 'Brand Identity' | 'SEO & Content' | 'Data Analytics' | 'IT Infrastructure' | 'Architecture & Design' | 'Custom'
type BudgetRange = 'Under $5,000' | '$5,000 – $15,000' | '$15,000 – $50,000' | '$50,000 – $150,000' | '$150,000+' | 'To be discussed'

interface ProposalData {
  template: Template
  // Your company
  companyName: string; companyTagline: string; companyWebsite: string
  contactName: string; contactTitle: string; contactEmail: string; contactPhone: string
  // Client
  clientCompany: string; clientName: string; clientTitle: string; clientIndustry: string
  clientChallenges: string
  // Project
  projectType: ProjectType; projectTitle: string; budget: BudgetRange
  timeline: string; startDate: string
  // Content
  executiveSummary: string; deliverables: string; methodology: string
  teamMembers: string; whyUs: string; caseStudy: string
  // Output
  result: string; isEditing: boolean
}

const TEMPLATES: { id: Template; name: string; accent: string; desc: string }[] = [
  { id: 'corporate', name: 'Corporate', accent: '#1e40af', desc: 'Clean professional — finance, consulting, enterprise' },
  { id: 'creative', name: 'Creative', accent: '#7c3aed', desc: 'Bold design — agencies, branding, media' },
  { id: 'technical', name: 'Technical', accent: '#0f766e', desc: 'Data-focused — software, IT, engineering' },
  { id: 'startup', name: 'Startup', accent: '#dc2626', desc: 'Growth-oriented — startups, SaaS, scale-ups' },
]
const PROJECT_TYPES: ProjectType[] = ['Web Design & Development','Software Development','Digital Marketing','Business Consulting','Brand Identity','SEO & Content','Data Analytics','IT Infrastructure','Architecture & Design','Custom']
const BUDGET_RANGES: BudgetRange[] = ['Under $5,000','$5,000 – $15,000','$15,000 – $50,000','$50,000 – $150,000','$150,000+','To be discussed']

function getInitial(): ProposalData {
  if (typeof window !== 'undefined') {
    try { const s = localStorage.getItem('roughtools_proposal_v2'); if (s) return JSON.parse(s) } catch { /**/ }
  }
  return {
    template: 'corporate',
    companyName: '', companyTagline: '', companyWebsite: '',
    contactName: '', contactTitle: '', contactEmail: '', contactPhone: '',
    clientCompany: '', clientName: '', clientTitle: '', clientIndustry: '', clientChallenges: '',
    projectType: 'Web Design & Development', projectTitle: '', budget: '$5,000 – $15,000',
    timeline: '', startDate: '',
    executiveSummary: '', deliverables: '', methodology: '', teamMembers: '', whyUs: '', caseStudy: '',
    result: '', isEditing: false,
  }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1.5'
const spin = 'animate-spin'

function F({ label, value, onChange, placeholder, hint }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; hint?:string }) {
  return (
    <div>
      <label className={LBL}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={CLS} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
function TA({ label, value, onChange, placeholder, rows=3, hint }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; rows?:number; hint?:string }) {
  return (
    <div>
      <label className={LBL}>{label}</label>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${CLS} resize-none`} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
function Sec({ title, icon, children }: { title:string; icon:string; children:React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-gray-800 text-sm flex-1">{title}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">{children}</div>}
    </div>
  )
}

function buildPrompt(d: ProposalData) {
  return `Write a detailed, professional business proposal from "${d.companyName}"${d.companyTagline ? ` (${d.companyTagline})` : ''} to "${d.clientCompany}"${d.clientName ? ` (attention: ${d.clientName}${d.clientTitle ? ', ' + d.clientTitle : ''})` : ''}.

Project: ${d.projectTitle || d.projectType}
Industry: ${d.clientIndustry || 'Not specified'}
Budget: ${d.budget}
Timeline: ${d.timeline || 'To be confirmed'}
${d.startDate ? `Proposed Start Date: ${d.startDate}` : ''}

Client's challenges / pain points: ${d.clientChallenges || 'Not specified'}

Content to include:
- Executive Summary: ${d.executiveSummary || 'Write a compelling 2-3 sentence overview of the proposal value'}
- Deliverables: ${d.deliverables || 'List typical deliverables for a ' + d.projectType + ' project'}
- Methodology / Approach: ${d.methodology || 'Describe a professional project methodology appropriate for this project type'}
- Team: ${d.teamMembers || 'Describe a typical team composition for this type of project'}
- Why Us: ${d.whyUs || 'Write compelling differentiators for a professional agency'}
${d.caseStudy ? `- Relevant Case Study: ${d.caseStudy}` : ''}

Template style: ${d.template} (${d.template === 'corporate' ? 'formal, measured, trust-focused' : d.template === 'creative' ? 'bold, design-forward, personality-driven' : d.template === 'technical' ? 'data-driven, process-focused, precision language' : 'growth-oriented, results-focused, energetic'})

Write a complete proposal with these sections clearly labelled:
1. EXECUTIVE SUMMARY
2. UNDERSTANDING YOUR CHALLENGE
3. OUR PROPOSED SOLUTION
4. DELIVERABLES & SCOPE
5. PROJECT TIMELINE
6. OUR METHODOLOGY
7. INVESTMENT SUMMARY
8. WHY ${(d.companyName || 'US').toUpperCase()}
9. NEXT STEPS

Make it persuasive, specific, and professional. Use active voice. Length: 600-900 words.`
}

function printProposal(d: ProposalData) {
  const themeMap = { corporate:'#1e40af', creative:'#7c3aed', technical:'#0f766e', startup:'#dc2626' }
  const accent = themeMap[d.template]
  const sections = d.result.split(/\n{2,}/).filter(Boolean)
  const win = window.open('','_blank')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Proposal — ${d.projectTitle || d.projectType}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;line-height:1.7;font-size:13px}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="max-width:800px;margin:0 auto">
<div style="background:${accent};color:#fff;padding:40px 48px">
  <div style="font-size:28px;font-weight:900;margin-bottom:6px">${d.projectTitle || d.projectType}</div>
  <div style="opacity:0.8;font-size:14px">Business Proposal · Prepared for ${d.clientCompany || 'Client'}</div>
  ${d.companyName ? `<div style="margin-top:16px;opacity:0.7;font-size:12px">Prepared by: ${d.companyName}${d.contactName ? ' · ' + d.contactName : ''}</div>` : ''}
  ${d.startDate ? `<div style="opacity:0.7;font-size:12px">Proposed Start: ${d.startDate}</div>` : ''}
</div>
<div style="padding:40px 48px">${sections.map(p=>{
  const heading = p.match(/^[A-Z\s&]+$/)
  return heading
    ? `<h2 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${accent};font-weight:700;margin:24px 0 10px;padding-bottom:4px;border-bottom:2px solid ${accent}20">${p}</h2>`
    : `<p style="margin-bottom:14px;color:#222;line-height:1.75">${p.replace(/\n/g,'<br>')}</p>`
}).join('')}</div>
${d.companyName ? `<div style="background:#f9f9f9;padding:24px 48px;border-top:2px solid ${accent}20;display:flex;justify-content:space-between;font-size:12px;color:#555">
  <div><strong>${d.companyName}</strong>${d.companyWebsite ? '<br>' + d.companyWebsite : ''}</div>
  <div style="text-align:right">${d.contactName ? d.contactName + '<br>' : ''}${d.contactEmail || ''}${d.contactPhone ? '<br>' + d.contactPhone : ''}</div>
</div>` : ''}
</div></body></html>`)
  win.document.close(); win.onload = ()=>win.print()
}

const FAQS = [
  { q:'Is this business proposal generator completely free?', a:'Yes, the Roughtools Business Proposal Generator is completely free with no subscription, hidden charges, or premium tier required. You can generate, edit, and download unlimited business proposals at no cost. Roughtools is funded by non-intrusive advertising, which keeps every tool permanently free. Whether you are a freelancer creating your first client proposal or an agency generating dozens of proposals per month, there are no usage limits or paywalls.' },
  { q:'Do I need to create an account to generate a proposal?', a:'No account, sign-up, or email address is required. Open the Proposal Generator, fill in your company and project details, and click generate. Your form data is automatically saved in your browser\'s local storage so you can return and refine your inputs without starting from scratch. Nothing you type is ever transmitted to Roughtools servers or stored in any database beyond what is needed to generate the AI output.' },
  { q:'Is my proposal content and client information private?', a:'Yes. All form data is stored exclusively in your browser\'s local storage and is never shared with third parties. The AI prompt is sent to our generation API to produce the proposal text, but your client names, project details, and budget figures are not logged or retained on our servers after the response is returned. Your proposal data remains private and is only accessible on the device where you created it.' },
  { q:'Can I edit the generated proposal before downloading?', a:'Yes. After the AI generates your proposal, click the "Edit Proposal" button to open a fully editable textarea. You can modify any section — rewrite a paragraph, adjust the pricing language, add specific details the AI missed, or change the tone of any section. Once you are satisfied with the content, click "Download PDF" to save the formatted proposal. You can also regenerate the proposal with slightly different phrasing if the first result does not match your style.' },
  { q:'Which proposal template should I choose?', a:'Choose "Corporate" for traditional enterprise clients in finance, consulting, law, or government — it uses measured, trust-focused language appropriate for formal procurement processes. Choose "Creative" for design, advertising, or media clients — bold and personality-driven. Choose "Technical" for software development, IT, and data analytics clients — precise, process-oriented, and data-referenced. Choose "Startup" for technology startups or growth-stage companies — energetic, results-focused, and growth-oriented in tone and framing.' },
  { q:'How do I write a winning business proposal?', a:'A winning proposal does five things: (1) demonstrates you understand the client\'s specific challenge — not just what they asked for, but why it matters to their business; (2) presents a clear, structured solution with defined deliverables and no scope ambiguity; (3) shows social proof through a relevant case study or named past client result; (4) justifies the investment by connecting deliverables to measurable business outcomes; and (5) makes the next step obvious with a clear call to action. Use the content input fields in this tool to provide specific details in each category, and the AI will structure them into a persuasive proposal framework.' },
  { q:'Can I use this for any industry or project type?', a:'Yes. The generator supports ten project categories including Web Design, Software Development, Digital Marketing, Business Consulting, Brand Identity, SEO, Data Analytics, IT Infrastructure, Architecture, and Custom. Each category informs the AI\'s choice of terminology, deliverable structure, and methodology framing. For specialised industries not listed, choose "Custom" and describe your project fully in the Executive Summary and Deliverables fields. The AI adapts its output based on the project context you provide.' },
  { q:'Does the proposal include pricing and timeline sections?', a:'Yes. The generated proposal includes an Investment Summary section that reflects the budget range you select, and a Project Timeline section based on the timeline you specify. To make these sections as accurate as possible, provide a specific timeline such as "12 weeks" or "3 months" and select the closest budget range. For proposals where pricing is not finalised, select "To be discussed" and the tool will generate appropriate placeholder language that invites a follow-up conversation.' },
  { q:'Does this proposal generator work on mobile and tablet?', a:'Yes, the Proposal Generator is fully responsive and works on all modern smartphones and tablets. All form sections, the template selector, and the generate and edit functions work on touchscreens. For downloading as a PDF on iOS, use Safari\'s "Share → Print" option and save to PDF. On Android, use Chrome\'s print dialog and select "Save as PDF" as the destination. For the best formatting on the printed proposal, using a desktop browser is recommended.' },
  { q:'Why should I use this tool instead of a paid proposal software?', a:'Roughtools Proposal Generator gives you a structured, professional first draft in under two minutes at zero cost. Unlike paid proposal platforms that charge $20–$150 per month and require complex account setup, this tool needs no subscription, no onboarding, and no design skills. You get four industry-appropriate template styles, full editing control over every sentence, and a clean PDF download. For freelancers and small agencies that send occasional proposals, it eliminates the overhead of maintaining a paid tool for a task that happens a few times per month.' },
]

function FAQSection() {
  const [open, setOpen] = useState<number|null>(null)
  return (
    <section className="mt-16 max-w-4xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
      <p className="text-gray-500 text-sm mb-8">Everything you need to know about generating professional business proposals.</p>
      <div className="space-y-3">
        {FAQS.map((faq,i)=>(
          <details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}>
              <h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3>
              <span className="text-indigo-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span>
            </summary>
            {open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}
          </details>
        ))}
      </div>
    </section>
  )
}

export default function ProposalGenerator() {
  const [data, setData] = useState<ProposalData>(getInitial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null)

  const update = (next: ProposalData) => {
    setData(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(()=>{ try { localStorage.setItem('roughtools_proposal_v2', JSON.stringify(next)) } catch { /**/ }}, 500)
  }
  const set = (k: keyof ProposalData, v: string) => update({ ...data, [k]: v } as ProposalData)

  const generate = async () => {
    if (!data.companyName || !data.clientCompany) { setError('Please enter your company name and the client company name.'); return }
    setError(''); setLoading(true)
    update({ ...data, result: '', isEditing: false })
    try {
      const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: buildPrompt(data) }) })
      const json = await res.json()
      update({ ...data, result: json.text || 'Error generating proposal. Please try again.', isEditing: false })
    } catch { update({ ...data, result: 'Connection error. Please check your internet and try again.' }) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-900 text-sm">Business Proposal Generator</h1>
          {data.result && <button onClick={()=>printProposal(data)} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">AI Business Proposal Generator</h2>
          <p className="text-indigo-100 text-sm">4 templates · 10 project types · Full editing · PDF download · 100% free</p>
        </div>

        <Sec title="Choose Proposal Template" icon="🎨">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATES.map(t=>(
              <button key={t.id} onClick={()=>update({...data,template:t.id})}
                className={`rounded-xl border-2 p-3 text-left transition-all ${data.template===t.id?'border-indigo-500 bg-indigo-50':'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <div className="h-10 rounded-lg mb-2" style={{background:t.accent}}/>
                <div className="font-semibold text-xs text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{t.desc.split(' — ')[1]}</div>
                {data.template===t.id&&<div className="text-xs text-indigo-600 font-semibold mt-1">✓ Selected</div>}
              </button>
            ))}
          </div>
        </Sec>

        <Sec title="Your Company" icon="🏢">
          <div className="grid grid-cols-2 gap-3">
            <F label="Company Name" value={data.companyName} onChange={v=>set('companyName',v)} placeholder="Creative Agency Co" />
            <F label="Tagline / Short Description" value={data.companyTagline} onChange={v=>set('companyTagline',v)} placeholder="Award-winning digital experiences" />
            <F label="Website" value={data.companyWebsite} onChange={v=>set('companyWebsite',v)} placeholder="creativeagency.com" />
            <F label="Contact Name" value={data.contactName} onChange={v=>set('contactName',v)} placeholder="Jane Smith" />
            <F label="Contact Title" value={data.contactTitle} onChange={v=>set('contactTitle',v)} placeholder="Managing Director" />
            <F label="Email" value={data.contactEmail} onChange={v=>set('contactEmail',v)} placeholder="jane@creativeagency.com" />
            <F label="Phone" value={data.contactPhone} onChange={v=>set('contactPhone',v)} placeholder="+1 555 000 0000" />
          </div>
        </Sec>

        <Sec title="Client Details" icon="👤">
          <div className="grid grid-cols-2 gap-3">
            <F label="Client Company" value={data.clientCompany} onChange={v=>set('clientCompany',v)} placeholder="TechStart Inc" />
            <F label="Client Contact Name" value={data.clientName} onChange={v=>set('clientName',v)} placeholder="Michael Chen" />
            <F label="Client Title" value={data.clientTitle} onChange={v=>set('clientTitle',v)} placeholder="Head of Marketing" />
            <F label="Client Industry" value={data.clientIndustry} onChange={v=>set('clientIndustry',v)} placeholder="SaaS / B2B Software" />
            <div className="col-span-2">
              <TA label="Client's Challenges / Pain Points" value={data.clientChallenges} onChange={v=>set('clientChallenges',v)}
                placeholder="E.g. Their current website converts at 1.2% against an industry average of 3.5%. They have no clear content strategy and their brand is perceived as dated compared to competitors like XYZ..."
                rows={3} hint="The more specific the challenge, the more targeted the proposal. Research the client before filling this in." />
            </div>
          </div>
        </Sec>

        <Sec title="Project Details" icon="📋">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LBL}>Project Type</label>
              <select value={data.projectType} onChange={e=>update({...data,projectType:e.target.value as ProjectType})} className={CLS}>
                {PROJECT_TYPES.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <F label="Project Title / Name" value={data.projectTitle} onChange={v=>set('projectTitle',v)} placeholder="Website Redesign & Conversion Optimisation" />
            <div>
              <label className={LBL}>Budget Range</label>
              <select value={data.budget} onChange={e=>update({...data,budget:e.target.value as BudgetRange})} className={CLS}>
                {BUDGET_RANGES.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <F label="Timeline" value={data.timeline} onChange={v=>set('timeline',v)} placeholder="10 weeks" />
            <F label="Proposed Start Date" value={data.startDate} onChange={v=>set('startDate',v)} placeholder="June 1, 2025" />
          </div>
        </Sec>

        <Sec title="Content & Differentiators" icon="✍️">
          <p className="text-xs text-gray-500 -mt-1 mb-2">Fill in what you can — leave blank for AI to generate appropriate content for your project type.</p>
          <TA label="Executive Summary (2–3 sentence pitch)" value={data.executiveSummary} onChange={v=>set('executiveSummary',v)}
            placeholder="E.g. We propose a full brand-led website redesign that will increase TechStart's conversion rate from 1.2% to 3%+ within 90 days of launch. Our data-first UX process and 12 years of B2B SaaS experience make us uniquely positioned to deliver measurable ROI on this investment." rows={3} />
          <TA label="Key Deliverables (bullet points)" value={data.deliverables} onChange={v=>set('deliverables',v)}
            placeholder="E.g. Discovery & UX audit, 3 homepage concepts, full responsive website build, CMS training, 90-day post-launch support..." rows={3} />
          <TA label="Methodology / Approach" value={data.methodology} onChange={v=>set('methodology',v)}
            placeholder="E.g. We use a 5-phase process: Discovery → Strategy → Design → Build → Launch & Optimise. Each phase has defined deliverables and sign-off points to ensure full alignment throughout." rows={3} />
          <TA label="Team Members / Roles" value={data.teamMembers} onChange={v=>set('teamMembers',v)}
            placeholder="E.g. Jane Smith (Project Lead), David Lee (UX Lead), Maria Santos (Lead Developer), Tom Harris (SEO Strategist)..." rows={2} />
          <TA label="Why Us — Key Differentiators" value={data.whyUs} onChange={v=>set('whyUs',v)}
            placeholder="E.g. We have delivered 47 B2B SaaS website projects in the past 3 years with an average post-launch conversion improvement of 2.4x. We are the only agency in this space that guarantees a minimum performance baseline or works for free until we hit it." rows={3} />
          <TA label="Relevant Case Study (optional)" value={data.caseStudy} onChange={v=>set('caseStudy',v)}
            placeholder="E.g. For DataFlow CRM (similar B2B SaaS), we redesigned their website and conversion funnel. Within 60 days of launch, their trial sign-up rate increased from 1.8% to 4.2% and demo bookings rose 67%." rows={2} />
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}

        <button onClick={generate} disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className={`w-5 h-5 ${spin}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Generating proposal...</>):'📊 Generate Business Proposal with AI'}
        </button>

        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Your Business Proposal</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printProposal(data)} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing
                ? <textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" rows={24}/>
                : <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-[700px] overflow-y-auto">{data.result}</div>
              }
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-indigo-600 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection />
      <ToolPageExtras
        toolName="Business Proposal Generator"
        toolSlug="proposal-generator"
        toolUrl="https://roughtools.com/tools/document-tools/proposal-generator"
        type="general"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
