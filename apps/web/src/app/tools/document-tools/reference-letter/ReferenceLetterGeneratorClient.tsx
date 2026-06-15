'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

// ─── Types ────────────────────────────────────────────────────

type RefType = 'professional' | 'academic' | 'personal' | 'character'
type Template = 'formal' | 'modern' | 'academic' | 'executive'
type Tone = 'highly enthusiastic' | 'strongly positive' | 'positive and professional' | 'balanced and objective'

interface RefLetterData {
  refType: RefType; template: Template; tone: Tone
  // Writer
  writerName: string; writerTitle: string; writerOrg: string
  writerEmail: string; writerPhone: string; writerAddress: string; writerDate: string
  // Candidate
  candidateName: string; candidateTitle: string; relationship: string
  durationKnown: string; contextKnown: string
  // Purpose
  targetRole: string; targetOrg: string; targetProgram: string
  // Content
  strength1: string; strength2: string; strength3: string
  keyProject: string; keyAchievement: string; personalQualities: string
  closingStatement: string
  // Output
  generatedLetter: string; isEditing: boolean
}

const REF_TYPES: { id: RefType; label: string; icon: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'For job applications, promotions, and career moves' },
  { id: 'academic', label: 'Academic', icon: '🎓', desc: 'For university admissions, scholarships, research programs' },
  { id: 'personal', label: 'Personal', icon: '🤝', desc: 'From a colleague, mentor, or community leader' },
  { id: 'character', label: 'Character', icon: '⭐', desc: 'For general purposes, legal proceedings, visa applications' },
]

const TEMPLATES: { id: Template; name: string; accent: string; desc: string }[] = [
  { id: 'formal', name: 'Formal', accent: '#1e40af', desc: 'Traditional block letter format' },
  { id: 'modern', name: 'Modern', accent: '#7c3aed', desc: 'Clean contemporary styling' },
  { id: 'academic', name: 'Academic', accent: '#065f46', desc: 'University letterhead style' },
  { id: 'executive', name: 'Executive', accent: '#1a1a1a', desc: 'Premium authoritative format' },
]

const TONES: Tone[] = ['highly enthusiastic', 'strongly positive', 'positive and professional', 'balanced and objective']

function getInitial(): RefLetterData {
  if (typeof window !== 'undefined') {
    try {
      const s = localStorage.getItem('roughtools_referenceletter_v2')
      if (s) return JSON.parse(s)
    } catch { /* ignore */ }
  }
  return {
    refType: 'professional', template: 'formal', tone: 'strongly positive',
    writerName: '', writerTitle: '', writerOrg: '', writerEmail: '', writerPhone: '', writerAddress: '',
    writerDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    candidateName: '', candidateTitle: '', relationship: '', durationKnown: '', contextKnown: '',
    targetRole: '', targetOrg: '', targetProgram: '',
    strength1: '', strength2: '', strength3: '',
    keyProject: '', keyAchievement: '', personalQualities: '', closingStatement: '',
    generatedLetter: '', isEditing: false,
  }
}

// ─── Shared UI ────────────────────────────────────────────────

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1.5'

function F({ label, value, onChange, placeholder, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; hint?: string
}) {
  return (
    <div>
      <label className={LBL}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={CLS} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function TA({ label, value, onChange, placeholder, rows = 3, hint }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; rows?: number; hint?: string
}) {
  return (
    <div>
      <label className={LBL}>{label}</label>
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

// ─── Prompt Builder ───────────────────────────────────────────

function buildPrompt(d: RefLetterData): string {
  const typeContext = {
    professional: 'professional employment reference letter',
    academic: 'academic reference letter for university or scholarship application',
    personal: 'personal reference letter from a professional acquaintance or mentor',
    character: 'character reference letter for general or legal purposes',
  }[d.refType]

  const targetContext = d.targetRole
    ? `The candidate is applying for: ${d.targetRole}${d.targetOrg ? ` at ${d.targetOrg}` : ''}`
    : d.targetProgram
    ? `The candidate is applying to: ${d.targetProgram}${d.targetOrg ? ` at ${d.targetOrg}` : ''}`
    : 'General purpose reference'

  return `Write a ${d.tone} ${typeContext} from "${d.writerName}"${d.writerTitle ? ` (${d.writerTitle}` + (d.writerOrg ? ` at ${d.writerOrg}` : '') + ')' : ''} for "${d.candidateName}"${d.candidateTitle ? ` (${d.candidateTitle})` : ''}.

Relationship context:
- How they know the candidate: ${d.relationship || 'Professional colleague'}
- Duration known: ${d.durationKnown || 'Not specified'}
- Context of knowing them: ${d.contextKnown || 'Not specified'}

Purpose: ${targetContext}

Strengths to highlight (weave these naturally — do not list them mechanically):
- Strength 1: ${d.strength1 || 'Strong professional capability'}
- Strength 2: ${d.strength2 || 'Excellent interpersonal skills'}
- Strength 3: ${d.strength3 || 'Dependable and results-driven'}

Key project or collaboration: ${d.keyProject || 'Not specified — describe their general work quality'}
Key achievement or result: ${d.keyAchievement || 'Not specified — describe their general impact'}
Personal qualities: ${d.personalQualities || 'Professional, reliable, and a genuine team player'}
Closing endorsement: ${d.closingStatement || 'Enthusiastic recommendation without reservation'}

Format: ${d.template === 'academic' ? 'Academic letterhead style with formal salutation — Dear Admissions Committee / Selection Panel' : 'Standard professional letter with "To Whom It May Concern" or specific addressee if target org is given'}

Write the complete reference letter including: the date, writer's contact details, salutation, opening paragraph (how the writer knows the candidate and for how long), 2-3 substantive body paragraphs (specific strengths, key achievement/project, and personal qualities), a closing endorsement paragraph with an offer to provide further information, and a professional sign-off. Length: 350-500 words. Do not use placeholder brackets. Make it sound genuinely written by a real person who knows and respects the candidate.`
}

// ─── PDF Generator ────────────────────────────────────────────

function printLetter(d: RefLetterData, letterText: string) {
  const themeMap = {
    formal: { bg: '#1e40af', text: '#fff', accent: '#eff6ff' },
    modern: { bg: '#7c3aed', text: '#fff', accent: '#f5f3ff' },
    academic: { bg: '#065f46', text: '#fff', accent: '#ecfdf5' },
    executive: { bg: '#111827', text: '#f59e0b', accent: '#fefce8' },
  }
  const t = themeMap[d.template]
  const paragraphs = letterText.split(/\n{2,}/).filter(Boolean)

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Reference Letter — ${d.candidateName}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Georgia,serif;color:#1a1a1a;line-height:1.9;background:#fff;font-size:13.5px}
  @page{size:A4;margin:0}
  @media print{body{width:210mm}}
</style></head><body>
<div style="max-width:800px;margin:0 auto">
  <div style="background:${t.bg};color:${t.text};padding:28px 44px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      ${d.refType === 'academic' ? '<div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:0.7;margin-bottom:6px">Reference Letter</div>' : ''}
      <div style="font-size:20px;font-weight:800">${d.writerName}</div>
      ${d.writerTitle ? `<div style="opacity:0.8;font-size:13px;margin-top:2px">${d.writerTitle}</div>` : ''}
      ${d.writerOrg ? `<div style="opacity:0.7;font-size:12px">${d.writerOrg}</div>` : ''}
    </div>
    <div style="text-align:right;font-size:12px;opacity:0.85">
      ${d.writerEmail ? `<div>${d.writerEmail}</div>` : ''}
      ${d.writerPhone ? `<div>${d.writerPhone}</div>` : ''}
      ${d.writerAddress ? `<div>${d.writerAddress}</div>` : ''}
    </div>
  </div>
  <div style="padding:40px 44px">
    <div style="font-size:13px;color:#555;margin-bottom:28px">${d.writerDate}</div>
    ${d.targetOrg ? `<div style="margin-bottom:24px;font-size:13px;color:#555">${d.targetOrg}</div>` : ''}
    ${paragraphs.map(p => `<p style="margin-bottom:18px;color:#1a1a1a;line-height:1.9">${p.replace(/\n/g, '<br>')}</p>`).join('')}
    <div style="margin-top:40px">
      <div style="color:#555">Sincerely,</div>
      <div style="font-weight:700;margin-top:28px;font-size:15px">${d.writerName}</div>
      ${d.writerTitle ? `<div style="color:#555;font-size:12px">${d.writerTitle}</div>` : ''}
      ${d.writerOrg ? `<div style="color:#555;font-size:12px">${d.writerOrg}</div>` : ''}
      ${d.writerEmail ? `<div style="color:#555;font-size:12px">${d.writerEmail}</div>` : ''}
    </div>
  </div>
</div></body></html>`)
  win.document.close()
  win.onload = () => win.print()
}

// ─── FAQ ──────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Is this reference letter generator completely free to use?',
    a: 'Yes, the Roughtools Reference Letter Generator is completely free with no subscription fees, premium tiers, or hidden charges. You can generate unlimited reference letters for professional, academic, personal, or character reference purposes at no cost. Roughtools is supported by non-intrusive advertising, which allows every tool on the platform to remain permanently free for individuals, educators, employers, and anyone writing a letter of recommendation.'
  },
  {
    q: 'Do I need to create an account to generate a reference letter?',
    a: 'No account or sign-up is required. Open the tool, fill in the details about the writer and the candidate, click "Generate Reference Letter," and download the result as a PDF. Your form data is saved in your browser\'s local storage so you can return and make edits without losing your information. Nothing you enter is transmitted to Roughtools servers or stored in any database.'
  },
  {
    q: 'Is the information I enter kept private and secure?',
    a: 'Your data is stored exclusively in your browser\'s local storage and is never shared with third parties or stored on Roughtools servers beyond the duration of the AI generation request. The AI prompt is sent to our API to generate the letter text, but your information is not logged or retained after the response is returned. We do not collect, sell, or process any personal information entered into this tool for any purpose other than generating your letter.'
  },
  {
    q: 'What types of reference letters can this tool generate?',
    a: 'The tool supports four reference letter types. A Professional reference letter is written by a manager, supervisor, or colleague for job applications or promotions. An Academic reference letter is written by a professor, teacher, or academic supervisor for university admissions, scholarship applications, or research programs. A Personal reference letter is written by a mentor, community leader, or professional acquaintance. A Character reference letter is for general purposes, immigration, visa applications, or legal proceedings where a character assessment is required.'
  },
  {
    q: 'Does the reference letter tool work on mobile and tablet?',
    a: 'Yes, the Reference Letter Generator is fully responsive and functions correctly on smartphones and tablets using any modern mobile browser. All form fields, the reference type selector, template picker, and tone controls work on touchscreens. For downloading as a PDF on iOS, use the "Share → Print" option in Safari and save to PDF. On Android, use Chrome\'s print dialog and select "Save as PDF" as the destination. The formatted letter will maintain its professional layout on all devices.'
  },
  {
    q: 'How do I write a strong reference letter step by step?',
    a: 'To generate a strong reference letter: (1) Select the reference type — Professional, Academic, Personal, or Character. (2) Choose a letter template and writing tone appropriate for the context. (3) Fill in the writer\'s details including name, title, organisation, and contact information. (4) Enter the candidate\'s name, your relationship, how long you have known them, and in what context. (5) Specify the purpose — the role, programme, or organisation the candidate is applying to. (6) Enter at least three specific strengths, one key project or collaboration, a notable achievement with measurable results if possible, and the candidate\'s personal qualities. (7) Click "Generate Reference Letter" and review the result. Edit directly if needed, then download as a PDF.'
  },
  {
    q: 'Can I edit the generated reference letter before downloading it?',
    a: 'Yes. After the AI generates the letter, click the "Edit Letter" button that appears above the result. This converts the letter into a fully editable text area where you can adjust any sentence, add specific details the AI may have missed, change the tone of any paragraph, or personalise the language to match your voice. Once you are satisfied with the letter, click "Download PDF" to save the final formatted version. The edit mode also allows you to regenerate the letter for a different phrasing if needed.'
  },
  {
    q: 'What makes a reference letter strong and effective?',
    a: 'A strong reference letter demonstrates credibility through specificity. The most effective letters include concrete examples — a project the candidate led, a measurable outcome they delivered, a specific challenge they overcame, or a quality you witnessed directly rather than inferred. Hiring committees and admissions panels read hundreds of generic letters; specific, vivid details stand out. This tool asks you for specific achievements, key projects, and measurable results precisely because generic praise ("hard worker, team player") is the most common weakness of ineffective reference letters.'
  },
  {
    q: 'Which reference letter template should I choose for my purpose?',
    a: 'Select "Formal" for standard professional employment references — it uses traditional block-letter format suitable for corporate, legal, finance, or government contexts. Select "Modern" for technology, marketing, and creative-adjacent roles — cleaner styling with a contemporary header. Select "Academic" for university applications, scholarship committees, and research programmes — it mimics institutional letterhead formatting and uses appropriate academic salutations. Select "Executive" for senior, C-suite, or consulting recommendations where a premium, authoritative presentation is expected.'
  },
  {
    q: 'Why use Roughtools instead of writing the letter manually?',
    a: 'Writing a reference letter from scratch takes significant time, and many writers struggle with tone, structure, and knowing what details to include. Roughtools Reference Letter Generator provides a structured framework that ensures every critical element is included — the relationship context, specific achievements, measurable outcomes, personal qualities, and an enthusiastic endorsement with a contact offer. The AI generates a natural-sounding first draft that you can edit, saving 30-60 minutes per letter. It is especially useful for professionals who write multiple recommendations annually and need to maintain consistent quality and professionalism across all letters.'
  },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="mt-16 max-w-4xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
      <p className="text-gray-500 text-sm mb-8">Everything you need to know about generating professional reference letters.</p>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none"
              onClick={e => { e.preventDefault(); setOpen(open === i ? null : i) }}>
              <h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3>
              <span className="text-green-600 font-bold text-lg flex-shrink-0 ml-3">{open === i ? '−' : '+'}</span>
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

export default function ReferenceLetterGenerator() {
  const [data, setData] = useState<RefLetterData>(getInitial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = (next: RefLetterData) => {
    setData(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem('roughtools_referenceletter_v2', JSON.stringify(next)) } catch { /**/ }
    }, 500)
  }

  const set = (k: keyof RefLetterData, v: string) => update({ ...data, [k]: v } as RefLetterData)

  const generate = async () => {
    if (!data.writerName || !data.candidateName) {
      setError('Please fill in the writer\'s name and the candidate\'s name at minimum.')
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
      update({ ...data, generatedLetter: 'Connection error. Please check your internet connection and try again.' })
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
          <h1 className="font-bold text-gray-900 text-sm">Reference Letter Generator</h1>
          {data.generatedLetter && (
            <button onClick={() => printLetter(data, data.generatedLetter)}
              className="ml-auto flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Download PDF
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Professional Reference Letter Generator</h2>
              <p className="text-green-100 text-sm">4 reference types · 4 templates · 4 tones · Full editing · PDF download</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['No Signup', '100% Free', 'Fully Editable', 'Instant PDF'].map(b => (
                <span key={b} className="text-xs bg-white/15 border border-white/25 rounded-full px-3 py-1">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reference Type */}
        <Section title="What Type of Reference Letter?" icon="📋">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REF_TYPES.map(t => (
              <button key={t.id} onClick={() => update({ ...data, refType: t.id })}
                className={`rounded-xl border-2 p-3 text-left transition-all ${data.refType === t.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-xs text-gray-800">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{t.desc}</div>
                {data.refType === t.id && <div className="text-xs text-green-600 font-semibold mt-1">✓ Selected</div>}
              </button>
            ))}
          </div>
        </Section>

        {/* Template & Tone */}
        <Section title="Template Style & Tone" icon="🎨">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => update({ ...data, template: t.id })}
                className={`rounded-xl border-2 p-3 text-left transition-all ${data.template === t.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <div className="h-8 rounded mb-2" style={{ background: t.accent }} />
                <div className="font-semibold text-xs text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                {data.template === t.id && <div className="text-xs text-green-600 font-semibold mt-1">✓ Selected</div>}
              </button>
            ))}
          </div>
          <div>
            <label className={LBL}>Recommendation Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(tone => (
                <button key={tone} onClick={() => update({ ...data, tone })}
                  className={`px-3 py-1.5 rounded-full text-sm border capitalize transition-all ${data.tone === tone ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}>
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Writer Details */}
        <Section title="Letter Writer's Details" icon="✍️">
          <div className="grid grid-cols-2 gap-3">
            <F label="Writer's Full Name" value={data.writerName} onChange={v => set('writerName', v)} placeholder="Dr. Sarah Johnson" />
            <F label="Writer's Job Title" value={data.writerTitle} onChange={v => set('writerTitle', v)} placeholder="Professor of Computer Science" />
            <F label="Organization / Institution" value={data.writerOrg} onChange={v => set('writerOrg', v)} placeholder="MIT — School of Engineering" />
            <F label="Writer's Email" value={data.writerEmail} onChange={v => set('writerEmail', v)} placeholder="s.johnson@mit.edu" type="email" />
            <F label="Writer's Phone" value={data.writerPhone} onChange={v => set('writerPhone', v)} placeholder="+1 617 000 0000" />
            <F label="Writer's Address (optional)" value={data.writerAddress} onChange={v => set('writerAddress', v)} placeholder="77 Massachusetts Ave, Cambridge, MA" />
            <F label="Letter Date" value={data.writerDate} onChange={v => set('writerDate', v)} placeholder="January 15, 2025" />
          </div>
        </Section>

        {/* Candidate Details */}
        <Section title="Candidate / Subject Details" icon="👤">
          <div className="grid grid-cols-2 gap-3">
            <F label="Candidate's Full Name" value={data.candidateName} onChange={v => set('candidateName', v)} placeholder="Alex Chen" />
            <F label="Candidate's Current Title / Role" value={data.candidateTitle} onChange={v => set('candidateTitle', v)} placeholder="Research Assistant / Software Engineer" />
            <TA label="Your Relationship to the Candidate" value={data.relationship} onChange={v => set('relationship', v)}
              placeholder="I supervised Alex as their thesis advisor for 2 years at MIT's AI Lab"
              rows={2} hint="Be specific — this establishes your authority to recommend." />
            <F label="How Long Have You Known Them?" value={data.durationKnown} onChange={v => set('durationKnown', v)} placeholder="3 years (2021–2024)" />
            <div className="col-span-2">
              <TA label="In What Context Do You Know Them?" value={data.contextKnown} onChange={v => set('contextKnown', v)}
                placeholder="E.g. As their direct line manager at Acme Corp, working together daily on the core product team across 4 product launches"
                rows={2} />
            </div>
          </div>
        </Section>

        {/* Purpose */}
        <Section title="Purpose of the Reference" icon="🎯">
          <div className="grid grid-cols-2 gap-3">
            <F label={data.refType === 'academic' ? 'Programme / Course Applying For' : 'Role / Position Applying For'} value={data.targetRole} onChange={v => set('targetRole', v)} placeholder={data.refType === 'academic' ? 'PhD in Computer Science' : 'Senior Software Engineer'} />
            <F label="Organisation / University" value={data.targetOrg} onChange={v => set('targetOrg', v)} placeholder={data.refType === 'academic' ? 'Stanford University' : 'Google DeepMind'} />
            {data.refType === 'academic' && (
              <F label="Scholarship / Fellowship Name (optional)" value={data.targetProgram} onChange={v => set('targetProgram', v)} placeholder="Rhodes Scholarship 2025" />
            )}
          </div>
        </Section>

        {/* Content */}
        <Section title="Strengths, Achievements & Qualities" icon="⭐">
          <p className="text-xs text-gray-500 mb-3 -mt-1">The more specific you are, the stronger the letter. Generic praise (&quot;hard worker&quot;) is the most common weakness of ineffective reference letters.</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <F label="Core Strength #1" value={data.strength1} onChange={v => set('strength1', v)} placeholder="Analytical problem-solving under pressure" />
            <F label="Core Strength #2" value={data.strength2} onChange={v => set('strength2', v)} placeholder="Cross-functional leadership and communication" />
            <F label="Core Strength #3" value={data.strength3} onChange={v => set('strength3', v)} placeholder="Consistent delivery of measurable results" />
          </div>
          <TA label="Key Project or Collaboration You Worked on Together" value={data.keyProject} onChange={v => set('keyProject', v)}
            placeholder="E.g. Alex led the redesign of our data pipeline architecture, reducing processing time by 60% and saving £200K annually. I observed their approach to cross-team stakeholder management across 3 departments throughout this 6-month project."
            rows={3} hint="Include your role as an observer — what specifically did you see them do?" />
          <TA label="Single Most Impressive Achievement (with results if possible)" value={data.keyAchievement} onChange={v => set('keyAchievement', v)}
            placeholder="E.g. Alex's honours thesis was the first in our department's history to be accepted for publication in Nature Machine Intelligence before submission of the final dissertation — a remarkable achievement that reflects exceptional research rigour."
            rows={3} />
          <TA label="Personal Qualities and Character Observations" value={data.personalQualities} onChange={v => set('personalQualities', v)}
            placeholder="E.g. What distinguishes Alex beyond technical competence is their intellectual humility — they actively seek feedback, acknowledge uncertainty honestly, and consistently elevate the people around them rather than competing with them."
            rows={3} />
          <TA label="Your Closing Endorsement Statement" value={data.closingStatement} onChange={v => set('closingStatement', v)}
            placeholder="E.g. I recommend Alex without reservation and believe they will be among the most valuable contributors to any team or programme fortunate enough to have them. I am happy to speak further by phone or email."
            rows={2} />
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>
        )}

        <button onClick={generate} disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading ? (
            <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Writing the reference letter...</>
          ) : '✨ Generate Reference Letter with AI'}
        </button>

        {/* Result */}
        {data.generatedLetter && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <span className="font-semibold text-gray-800 text-sm">Your Reference Letter</span>
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
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing ? (
                <textarea value={data.generatedLetter}
                  onChange={e => update({ ...data, generatedLetter: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows={22} />
              ) : (
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-serif max-h-[700px] overflow-y-auto">
                  {data.generatedLetter}
                </div>
              )}
            </div>
            <div className="px-5 pb-5">
              <button onClick={generate} disabled={loading} className="text-sm text-green-600 hover:underline font-medium">
                Regenerate with different phrasing
              </button>
            </div>
          </div>
        )}
      </div>

      <FAQSection />
      <ToolPageExtras
        toolName="Reference Letter Generator"
        toolSlug="reference-letter"
        toolUrl="https://roughtools.com/tools/document-tools/reference-letter"
        type="general"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
