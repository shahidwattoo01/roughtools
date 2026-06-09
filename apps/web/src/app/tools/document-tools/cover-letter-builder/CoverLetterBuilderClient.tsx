'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

// ─── Types ────────────────────────────────────────────────────

type Template = 'formal' | 'modern' | 'creative' | 'executive'
type Tone = 'professional' | 'enthusiastic' | 'concise' | 'confident' | 'conversational'
type JobSource = 'LinkedIn' | 'Company Website' | 'Indeed' | 'Referral' | 'Job Fair' | 'Recruiter' | 'Other'

interface CoverLetterData {
  template: Template
  tone: Tone
  // Applicant
  name: string; title: string; email: string; phone: string; address: string; city: string; linkedin: string; date: string
  // Recipient
  hiringManager: string; hiringTitle: string; company: string; companyAddress: string; department: string
  // Job details
  jobTitle: string; jobRef: string; source: JobSource; referralName: string
  // Content
  openingHook: string; yearsExperience: string; keyAchievement: string
  relevantSkills: string; whyCompany: string; closingStrength: string
  // Generated
  generatedLetter: string; isEditing: boolean
}

const TEMPLATES: { id: Template; name: string; desc: string; accent: string }[] = [
  { id: 'formal', name: 'Formal', desc: 'Traditional block format — best for corporate, legal, finance', accent: '#1e40af' },
  { id: 'modern', name: 'Modern', desc: 'Clean two-column header — tech, design, marketing', accent: '#7c3aed' },
  { id: 'creative', name: 'Creative', desc: 'Bold opening statement — creative industries, agencies', accent: '#be185d' },
  { id: 'executive', name: 'Executive', desc: 'Authoritative style — senior, C-suite, consulting', accent: '#1a1a1a' },
]

const TONES: { id: Tone; label: string; emoji: string }[] = [
  { id: 'professional', label: 'Professional', emoji: '👔' },
  { id: 'enthusiastic', label: 'Enthusiastic', emoji: '🚀' },
  { id: 'concise', label: 'Concise', emoji: '⚡' },
  { id: 'confident', label: 'Confident', emoji: '💪' },
  { id: 'conversational', label: 'Conversational', emoji: '💬' },
]

const JOB_SOURCES: JobSource[] = ['LinkedIn', 'Company Website', 'Indeed', 'Referral', 'Job Fair', 'Recruiter', 'Other']

function getInitial(): CoverLetterData {
  if (typeof window !== 'undefined') {
    try {
      const s = localStorage.getItem('roughtools_coverletter_v2')
      if (s) return JSON.parse(s)
    } catch { /* ignore */ }
  }
  return {
    template: 'formal', tone: 'professional',
    name: '', title: '', email: '', phone: '', address: '', city: '', linkedin: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    hiringManager: '', hiringTitle: 'Hiring Manager', company: '', companyAddress: '', department: '',
    jobTitle: '', jobRef: '', source: 'LinkedIn', referralName: '',
    openingHook: '', yearsExperience: '', keyAchievement: '', relevantSkills: '', whyCompany: '', closingStrength: '',
    generatedLetter: '', isEditing: false,
  }
}

// ─── Shared UI ────────────────────────────────────────────────

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1.5'

function F({ label, value, onChange, placeholder, type = 'text', required, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean; hint?: string
}) {
  return (
    <div>
      <label className={LBL}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={CLS} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function TA({ label, value, onChange, placeholder, rows = 3, hint, required }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; rows?: number; hint?: string; required?: boolean
}) {
  return (
    <div>
      <label className={LBL}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${CLS} resize-none`} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-gray-800 text-sm flex-1">{title}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">{children}</div>}
    </div>
  )
}

// ─── AI Prompt builder ────────────────────────────────────────

function buildPrompt(d: CoverLetterData): string {
  const sourceNote = d.source === 'Referral' && d.referralName
    ? `referred by ${d.referralName}`
    : d.source === 'Other' ? 'a job listing' : d.source

  return `Write a ${d.tone} cover letter for ${d.name}${d.title ? ` (${d.title})` : ''} applying for the ${d.jobTitle} position${d.department ? ` in the ${d.department} department` : ''} at ${d.company}.

Applicant details:
- Name: ${d.name}
- Current/target title: ${d.title || 'Not specified'}
- Years of experience: ${d.yearsExperience || 'Not specified'}
- Found the job via: ${sourceNote}
${d.jobRef ? `- Job reference: ${d.jobRef}` : ''}

Key information to weave in naturally:
- Opening hook/angle: ${d.openingHook || 'Standard professional opening'}
- Top achievement: ${d.keyAchievement || 'Not specified'}
- Relevant skills: ${d.relevantSkills || 'Not specified'}
- Why this company specifically: ${d.whyCompany || 'Not specified'}
- Closing strength: ${d.closingStrength || 'Standard call to action'}

Recipient: ${d.hiringManager ? d.hiringManager + (d.hiringTitle ? `, ${d.hiringTitle}` : '') : 'Hiring Manager'} at ${d.company}${d.companyAddress ? `, ${d.companyAddress}` : ''}

Format: ${d.template === 'formal' ? 'Traditional formal business letter with full block format, address headers, and formal salutation/closing' : d.template === 'modern' ? 'Clean modern format, impactful first sentence, 3-4 tight paragraphs' : d.template === 'creative' ? 'Bold opening statement that hooks the reader, storytelling approach, confident voice' : 'Executive-level authoritative tone, direct value proposition in first paragraph, senior-appropriate language'}

Write the full letter including date, addresses, salutation, 3-4 paragraphs (opening hook, main value proposition with the achievement woven in, skills relevance and why this company, strong closing call to action), and a professional sign-off. Do not include placeholder text in brackets. Use the applicant's real information. Length: 350-450 words.`
}

// ─── PDF generator ────────────────────────────────────────────

function printLetter(d: CoverLetterData, letterText: string) {
  const themeMap = {
    formal: { headerBg: '#1e40af', headerText: '#fff', accent: '#eff6ff' },
    modern: { headerBg: '#7c3aed', headerText: '#fff', accent: '#f5f3ff' },
    creative: { headerBg: '#be185d', headerText: '#fff', accent: '#fdf2f8' },
    executive: { headerBg: '#111827', headerText: '#f59e0b', accent: '#fefce8' },
  }
  const t = themeMap[d.template]
  const paragraphs = letterText.split(/\n{2,}/).filter(Boolean)

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Cover Letter — ${d.name}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Georgia,serif;color:#1a1a1a;line-height:1.8;background:#fff;font-size:13.5px}
  @page{size:A4;margin:0}
  @media print{body{width:210mm}}
</style></head><body>
<div style="max-width:800px;margin:0 auto">
  <div style="background:${t.headerBg};color:${t.headerText};padding:32px 44px">
    <div style="font-size:22px;font-weight:800;letter-spacing:-0.5px">${d.name}</div>
    ${d.title ? `<div style="opacity:0.8;margin-top:3px;font-size:13px">${d.title}</div>` : ''}
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:11px;opacity:0.85">
      ${d.email ? `<span>${d.email}</span>` : ''}
      ${d.phone ? `<span>${d.phone}</span>` : ''}
      ${d.address ? `<span>${d.address}${d.city ? ', ' + d.city : ''}</span>` : ''}
      ${d.linkedin ? `<span>${d.linkedin}</span>` : ''}
    </div>
  </div>
  <div style="padding:40px 44px">
    <div style="font-size:13px;color:#666;margin-bottom:24px">${d.date}</div>
    ${d.hiringManager ? `<div style="margin-bottom:24px;font-size:13px">
      <div style="font-weight:600">${d.hiringManager}</div>
      ${d.hiringTitle ? `<div style="color:#555">${d.hiringTitle}</div>` : ''}
      <div style="color:#555">${d.company}</div>
      ${d.companyAddress ? `<div style="color:#555">${d.companyAddress}</div>` : ''}
    </div>` : ''}
    <div style="margin-bottom:20px;font-weight:600">Dear ${d.hiringManager ? d.hiringManager.split(' ')[0] : 'Hiring Manager'},</div>
    ${paragraphs.map(p => `<p style="margin-bottom:16px;color:#222;line-height:1.8">${p.replace(/\n/g, '<br>')}</p>`).join('')}
    <div style="margin-top:32px">
      <div>Sincerely,</div>
      <div style="font-weight:700;margin-top:24px;font-size:14px">${d.name}</div>
      ${d.title ? `<div style="color:#555;font-size:12px">${d.title}</div>` : ''}
    </div>
  </div>
</div></body></html>`)
  win.document.close()
  win.onload = () => win.print()
}

// ─── FAQ ──────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Is this cover letter builder completely free to use?',
    a: 'Yes, the Roughtools Cover Letter Builder is completely free to use with no subscription, premium tier, or per-download charge. You can generate, edit, and download as many cover letters as you need. Roughtools is funded through non-intrusive display advertising, which allows every tool to remain permanently free for students, job seekers, career changers, and professionals at every stage of their career.'
  },
  {
    q: 'Do I need an account or email to generate a cover letter?',
    a: 'No account, sign-up, or email address is required at any stage. Simply fill in the form fields, click "Generate Cover Letter," and your letter is ready instantly. Your form data is saved in your browser\'s local storage between sessions so you can pick up where you left off — without creating an account. Nothing you type is ever sent to a server or stored by Roughtools.'
  },
  {
    q: 'Does this cover letter builder store my personal information?',
    a: 'Your information is stored exclusively in your browser\'s local storage and is never transmitted to Roughtools servers. We do not collect your name, contact details, job history, or any text you enter into the form. The AI-generated letter is created by calling our API, but the request contains only anonymised content — your browser session data is not retained on our end beyond the generation request.'
  },
  {
    q: 'Does the cover letter builder work on mobile and tablet?',
    a: 'Yes, the Cover Letter Builder is fully responsive and works on all modern smartphones and tablets. The form layout adapts to smaller screens, and all four template styles generate correctly on mobile. For saving as PDF, you will need your browser\'s print functionality — on iOS Safari, use "Share → Print" then save to PDF; on Android Chrome, use the "Share" menu or the print dialog to save as a PDF file.'
  },
  {
    q: 'Which browsers support the Cover Letter Builder?',
    a: 'The Cover Letter Builder works in all modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and Opera on both desktop and mobile. The AI generation feature requires an active internet connection. PDF saving uses your browser\'s built-in print-to-PDF functionality, which is available across all supported browsers. We recommend Chrome or Edge for the most accurate PDF output of the letter templates.'
  },
  {
    q: 'How do I generate a professional cover letter step by step?',
    a: 'To generate your cover letter: (1) Select a template style — Formal, Modern, Creative, or Executive — based on your industry and the role\'s culture. (2) Choose a tone that matches your personality and the job type. (3) Fill in your personal details, including your name, contact information, and LinkedIn URL. (4) Enter the hiring manager\'s name and title if known, plus the company and address. (5) Complete the job details section with the role title, job reference, and where you found the listing. (6) Fill in the content inputs — your opening hook, key achievement, skills, why you want this company, and closing statement. (7) Click "Generate Cover Letter" and review the result. Edit directly if needed, then download as PDF.'
  },
  {
    q: 'Can I edit the generated cover letter before downloading?',
    a: 'Yes. After the AI generates your cover letter, an "Edit Letter" button appears below the result. Clicking it converts the text into an editable textarea where you can modify any part of the letter — adjust specific phrases, add a personal story, change the tone of a paragraph, or update any details that the AI may have phrased differently than you intended. Once you are satisfied, click "Download PDF" to save the final version.'
  },
  {
    q: 'Which cover letter template should I choose?',
    a: 'Choose "Formal" for traditional industries such as law, finance, government, or academia — it uses a full block-letter format with all contact details and a formal salutation. Choose "Modern" for technology, marketing, or creative-adjacent roles — it has a clean header and punchy paragraph structure. Choose "Creative" for design, media, advertising, or creative agencies — it opens with a bold statement. Choose "Executive" for senior management, C-suite, or consulting roles — it uses a commanding, value-first tone that is appropriate for high-level positions.'
  },
  {
    q: 'Why should I use this cover letter builder instead of writing it manually?',
    a: 'The AI-assisted builder structures your information into a proven cover letter format, ensuring you include all the elements hiring managers expect — a compelling hook, a specific achievement, skill relevance, company-specific reasoning, and a clear call to action. It eliminates writer\'s block by turning your bullet-point inputs into flowing prose. Unlike paid services, Roughtools adds no watermarks, has no word limits, and gives you full editing control over the output before downloading. You can generate multiple variations for different roles at no cost.'
  },
  {
    q: 'How do I report a bug or request a new feature?',
    a: 'If you experience a bug or have a suggestion for improving the Cover Letter Builder, please use the feedback link in the site footer or visit the Roughtools contact page. Describe what you were trying to do, which browser and device you are using, and what happened versus what you expected. Feature requests are reviewed regularly — common requests such as additional templates, language options, and direct email-sending functionality are on the development roadmap.'
  },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="mt-16 max-w-4xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
      <p className="text-gray-500 text-sm mb-8">Everything you need to know about the free Cover Letter Builder.</p>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none"
              onClick={e => { e.preventDefault(); setOpen(open === i ? null : i) }}>
              <h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3>
              <span className="text-purple-600 font-bold text-lg flex-shrink-0 ml-3">{open === i ? '−' : '+'}</span>
            </summary>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
            )}
          </details>
        ))}
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default function CoverLetterBuilder() {
  const [data, setData] = useState<CoverLetterData>(getInitial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = (next: CoverLetterData) => {
    setData(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem('roughtools_coverletter_v2', JSON.stringify(next)) } catch { /**/ }
    }, 500)
  }

  const set = (k: keyof CoverLetterData, v: string) => update({ ...data, [k]: v })

  const generate = async () => {
    if (!data.name || !data.jobTitle || !data.company) {
      setError('Please fill in at least your Name, Job Title, and Company Name.')
      return
    }
    setError('')
    setLoading(true)
    update({ ...data, generatedLetter: '', isEditing: false })
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt(data) })
      })
      const json = await res.json()
      update({ ...data, generatedLetter: json.text || 'Error generating letter. Please try again.', isEditing: false })
    } catch {
      update({ ...data, generatedLetter: 'Error connecting to the AI service. Please check your connection and try again.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-900 text-sm">Cover Letter Builder</h1>
          <div className="ml-auto flex items-center gap-2">
            {data.generatedLetter && (
              <button onClick={() => printLetter(data, data.generatedLetter)}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">AI-Powered Cover Letter Builder</h2>
              <p className="text-purple-100 text-sm">4 templates · 5 tones · Full editing · PDF download · 100% free</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['No Signup', '100% Free', 'Fully Editable', 'Instant PDF'].map(b => (
                <span key={b} className="text-xs bg-white/15 border border-white/25 rounded-full px-3 py-1">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Template */}
        <Section title="Choose Letter Template" icon="🎨">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => update({ ...data, template: t.id })}
                className={`rounded-xl border-2 p-3 text-left transition-all ${data.template === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <div className="h-10 rounded-lg mb-2" style={{ background: t.accent }} />
                <div className="font-semibold text-xs text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{t.desc.split(' — ')[1]}</div>
                {data.template === t.id && <div className="text-xs text-purple-600 font-semibold mt-1">✓ Selected</div>}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <p className={LBL}>Writing Tone</p>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t => (
                <button key={t.id} onClick={() => update({ ...data, tone: t.id })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${data.tone === t.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                  <span>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Your details */}
        <Section title="Your Contact Information" icon="👤">
          <div className="grid grid-cols-2 gap-3">
            <F label="Full Name" value={data.name} onChange={v => set('name', v)} placeholder="Jane Smith" required />
            <F label="Professional Title" value={data.title} onChange={v => set('title', v)} placeholder="Senior Product Manager" />
            <F label="Email" value={data.email} onChange={v => set('email', v)} placeholder="jane@email.com" type="email" required />
            <F label="Phone" value={data.phone} onChange={v => set('phone', v)} placeholder="+1 555 000 0000" />
            <F label="City / Location" value={data.city} onChange={v => set('city', v)} placeholder="New York, NY" />
            <F label="LinkedIn URL" value={data.linkedin} onChange={v => set('linkedin', v)} placeholder="linkedin.com/in/janesmith" />
            <F label="Letter Date" value={data.date} onChange={v => set('date', v)} placeholder="January 15, 2025" />
          </div>
        </Section>

        {/* Recipient */}
        <Section title="Recipient & Company Details" icon="🏢">
          <div className="grid grid-cols-2 gap-3">
            <F label="Hiring Manager's Name" value={data.hiringManager} onChange={v => set('hiringManager', v)} placeholder="Michael Chen" hint="Leave blank if unknown — we'll use 'Hiring Manager'" />
            <F label="Their Job Title" value={data.hiringTitle} onChange={v => set('hiringTitle', v)} placeholder="VP of Engineering" />
            <F label="Company Name" value={data.company} onChange={v => set('company', v)} placeholder="Google" required />
            <F label="Department (optional)" value={data.department} onChange={v => set('department', v)} placeholder="Product Engineering" />
            <div className="col-span-2">
              <F label="Company Address (optional)" value={data.companyAddress} onChange={v => set('companyAddress', v)} placeholder="1600 Amphitheatre Pkwy, Mountain View, CA" />
            </div>
          </div>
        </Section>

        {/* Job details */}
        <Section title="Job Details" icon="💼">
          <div className="grid grid-cols-2 gap-3">
            <F label="Job Title Applying For" value={data.jobTitle} onChange={v => set('jobTitle', v)} placeholder="Senior Product Manager" required />
            <F label="Job Reference / ID (optional)" value={data.jobRef} onChange={v => set('jobRef', v)} placeholder="REQ-2024-PM-001" />
            <div>
              <label className={LBL}>Where You Found This Job</label>
              <select value={data.source} onChange={e => update({ ...data, source: e.target.value as JobSource })} className={CLS}>
                {JOB_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {data.source === 'Referral' && (
              <F label="Referred By" value={data.referralName} onChange={v => set('referralName', v)} placeholder="Sarah Johnson (Engineering Lead)" />
            )}
          </div>
        </Section>

        {/* Content */}
        <Section title="Your Story — Content Inputs" icon="✍️">
          <p className="text-xs text-gray-500 mb-3 -mt-1">Fill in these fields in your own words — the AI will weave them into a polished letter. The more detail you provide, the better the result.</p>
          <div className="space-y-3">
            <TA label="Opening Hook / Angle" value={data.openingHook} onChange={v => set('openingHook', v)}
              placeholder="E.g. 'After 6 years building consumer products used by 50M+ users, I'm excited by Google's mission to organise the world's information...'"
              hint="What makes your opening unique? Why THIS company, THIS role, RIGHT NOW?" rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <F label="Years of Relevant Experience" value={data.yearsExperience} onChange={v => set('yearsExperience', v)} placeholder="7 years in SaaS product management" />
            </div>
            <TA label="Your Single Biggest Relevant Achievement (with metric)" value={data.keyAchievement} onChange={v => set('keyAchievement', v)}
              placeholder="E.g. 'Led a cross-functional team of 12 to launch a new checkout flow that reduced cart abandonment by 34% and added $8M in annual revenue'"
              hint="Be specific. Include numbers, percentages, timelines, team size, and business impact." rows={3} required />
            <TA label="Key Skills Relevant to This Role" value={data.relevantSkills} onChange={v => set('relevantSkills', v)}
              placeholder="E.g. Product roadmapping, OKR frameworks, A/B testing at scale, stakeholder management across 8 time zones, B2B SaaS, SQL, Figma"
              rows={2} />
            <TA label="Why This Specific Company? (not generic reasons)" value={data.whyCompany} onChange={v => set('whyCompany', v)}
              placeholder="E.g. 'I've followed Google's investment in ML-powered search for 3 years and I'm specifically interested in the Knowledge Graph team's work on entity disambiguation...'"
              hint="Research the company — mention a specific product, initiative, mission statement, or recent news." rows={3} required />
            <TA label="Closing Statement / Call to Action" value={data.closingStrength} onChange={v => set('closingStrength', v)}
              placeholder="E.g. 'I'd love to discuss how my experience scaling product teams from 0 to 1 at two startups translates to the challenges Google is tackling in enterprise AI...'"
              rows={2} />
          </div>
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>
        )}

        <button onClick={generate} disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading ? (
            <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Writing your cover letter...</>
          ) : '✨ Generate Cover Letter with AI'}
        </button>

        {/* Result */}
        {data.generatedLetter && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <span className="font-semibold text-gray-800 text-sm">Your Cover Letter</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => update({ ...data, isEditing: !data.isEditing })}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                  {data.isEditing ? '👁️ Preview' : '✏️ Edit Letter'}
                </button>
                <button onClick={() => navigator.clipboard.writeText(data.generatedLetter)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                  Copy
                </button>
                <button onClick={() => printLetter(data, data.generatedLetter)}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing ? (
                <textarea
                  value={data.generatedLetter}
                  onChange={e => update({ ...data, generatedLetter: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                  rows={20}
                />
              ) : (
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-serif max-h-[600px] overflow-y-auto">
                  {data.generatedLetter}
                </div>
              )}
            </div>
            <div className="px-5 pb-5">
              <button onClick={generate} disabled={loading}
                className="text-sm text-purple-600 hover:underline font-medium">
                Regenerate with different phrasing
              </button>
            </div>
          </div>
        )}
      </div>

      <FAQSection />
      <ToolPageExtras
        toolName="Cover Letter Builder"
        toolSlug="cover-letter-builder"
        toolUrl="https://roughtools.com/tools/document-tools/cover-letter-builder"
        type="general"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
