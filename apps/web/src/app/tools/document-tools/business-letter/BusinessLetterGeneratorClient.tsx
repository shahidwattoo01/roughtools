'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type LetterType = 'Partnership Request' | 'Business Inquiry' | 'Complaint & Escalation' | 'Meeting Request' | 'Thank You / Follow-up' | 'Termination Notice' | 'Payment Request' | 'Job Offer' | 'Rejection Letter' | 'Reference Request' | 'Apology Letter' | 'Custom'
type Tone = 'Formal' | 'Semi-Formal' | 'Firm & Direct' | 'Cordial & Warm' | 'Urgent'
type Template = 'classic' | 'modern' | 'corporate' | 'minimal'

interface LetterData {
  template: Template; letterType: LetterType; tone: Tone
  senderName: string; senderTitle: string; senderCompany: string
  senderAddress: string; senderCity: string; senderEmail: string; senderPhone: string
  date: string
  recipientName: string; recipientTitle: string; recipientCompany: string
  recipientAddress: string; recipientCity: string
  subject: string; openingContext: string; mainPoints: string
  requestedAction: string; deadline: string; closingNote: string
  result: string; isEditing: boolean
}

const LETTER_TYPES: LetterType[] = ['Partnership Request','Business Inquiry','Complaint & Escalation','Meeting Request','Thank You / Follow-up','Termination Notice','Payment Request','Job Offer','Rejection Letter','Reference Request','Apology Letter','Custom']
const TONES: Tone[] = ['Formal','Semi-Formal','Firm & Direct','Cordial & Warm','Urgent']
const TEMPLATES: {id:Template;name:string;accent:string;desc:string}[] = [
  {id:'classic',name:'Classic Block',accent:'#1a1a1a',desc:'Traditional formal — law, finance, government'},
  {id:'corporate',name:'Corporate',accent:'#1e40af',desc:'Professional — enterprise, B2B'},
  {id:'modern',name:'Modern',accent:'#7c3aed',desc:'Contemporary — tech, marketing'},
  {id:'minimal',name:'Minimal',accent:'#374151',desc:'Clean — consulting, freelance'},
]

function getInitial(): LetterData {
  if (typeof window !== 'undefined') { try { const s = localStorage.getItem('roughtools_bizletter_v2'); if (s) return JSON.parse(s) } catch { /**/ } }
  return { template:'classic', letterType:'Partnership Request', tone:'Formal',
    senderName:'', senderTitle:'', senderCompany:'', senderAddress:'', senderCity:'', senderEmail:'', senderPhone:'',
    date: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),
    recipientName:'', recipientTitle:'', recipientCompany:'', recipientAddress:'', recipientCity:'',
    subject:'', openingContext:'', mainPoints:'', requestedAction:'', deadline:'', closingNote:'',
    result:'', isEditing:false }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1.5'

function F({label,value,onChange,placeholder,hint}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;hint?:string}) {
  return <div><label className={LBL}>{label}</label><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={CLS}/>{hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
}
function TA({label,value,onChange,placeholder,rows=3,hint}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;rows?:number;hint?:string}) {
  return <div><label className={LBL}>{label}</label><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${CLS} resize-none`}/>{hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
}
function Sec({title,icon,children}:{title:string;icon:string;children:React.ReactNode}) {
  const [open,setOpen]=useState(true)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50">
        <span className="text-lg">{icon}</span><span className="font-semibold text-gray-800 text-sm flex-1">{title}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open&&<div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">{children}</div>}
    </div>
  )
}

function buildPrompt(d: LetterData) {
  return `Write a ${d.tone.toLowerCase()} business letter (type: ${d.letterType}) from "${d.senderName}"${d.senderTitle?`, ${d.senderTitle}`:''}${d.senderCompany?` at ${d.senderCompany}`:''} to "${d.recipientName}"${d.recipientTitle?`, ${d.recipientTitle}`:''}${d.recipientCompany?` at ${d.recipientCompany}`:''}.

Subject: ${d.subject || `Re: ${d.letterType}`}
Opening context: ${d.openingContext || `Standard opening for a ${d.letterType}`}
Main points to cover: ${d.mainPoints || `Core points appropriate for a ${d.letterType} letter`}
Requested action / call to action: ${d.requestedAction || 'Standard professional request'}
${d.deadline?`Deadline / timeframe: ${d.deadline}`:''}
Closing note: ${d.closingNote || 'Professional closing'}

Format: Full formal business letter with ${d.date} date, sender and recipient address blocks (if provided), formal salutation, 3-4 well-structured paragraphs, and professional sign-off. Tone: ${d.tone}. Length: 250-400 words.`
}

function printLetter(d: LetterData) {
  const themeMap:{[k:string]:string} = {classic:'#1a1a1a',corporate:'#1e40af',modern:'#7c3aed',minimal:'#374151'}
  const accent = themeMap[d.template]
  const win = window.open('','_blank'); if(!win) return
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Business Letter</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;color:#1a1a1a;line-height:1.8;font-size:13.5px;max-width:800px;margin:0 auto}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="padding:48px 56px">
  <div style="border-bottom:3px solid ${accent};padding-bottom:20px;margin-bottom:28px">
    <div style="font-size:18px;font-weight:800;color:${accent}">${d.senderCompany||d.senderName}</div>
    ${d.senderName&&d.senderCompany?`<div style="color:#555;font-size:12px">${d.senderName}${d.senderTitle?', '+d.senderTitle:''}</div>`:''}
    <div style="font-size:11px;color:#888;margin-top:4px">${[d.senderAddress,d.senderCity].filter(Boolean).join(', ')}${d.senderEmail?' · '+d.senderEmail:''}</div>
  </div>
  <div style="font-size:13px;color:#555;margin-bottom:24px">${d.date}</div>
  ${d.recipientName?`<div style="margin-bottom:28px;font-size:13px"><div style="font-weight:600">${d.recipientName}</div>${d.recipientTitle?`<div style="color:#555">${d.recipientTitle}</div>`:''}${d.recipientCompany?`<div style="color:#555">${d.recipientCompany}</div>`:''}${d.recipientAddress||d.recipientCity?`<div style="color:#555">${[d.recipientAddress,d.recipientCity].filter(Boolean).join(', ')}</div>`:''}</div>`:''}
  ${d.subject?`<div style="font-weight:700;margin-bottom:20px;font-size:13px">Re: ${d.subject}</div>`:''}
  <div style="margin-bottom:20px">Dear ${d.recipientName?d.recipientName.split(' ').slice(-1)[0]:'Sir/Madam'},</div>
  <div style="white-space:pre-wrap;line-height:1.85;color:#1a1a1a">${d.result||''}</div>
  <div style="margin-top:36px"><div>Yours sincerely,</div><div style="font-weight:700;margin-top:28px;font-size:14px">${d.senderName}</div>${d.senderTitle?`<div style="color:#555;font-size:12px">${d.senderTitle}</div>`:''}${d.senderCompany?`<div style="color:#555;font-size:12px">${d.senderCompany}</div>`:''}${d.senderPhone?`<div style="color:#555;font-size:12px">${d.senderPhone}</div>`:''}</div>
</div></body></html>`)
  win.document.close(); win.onload=()=>win.print()
}

const FAQS = [
  {q:'Is this business letter generator free?',a:'Yes, completely free with no subscription or signup required. You can generate unlimited business letters across all 12 letter types at no cost. Roughtools is funded through non-intrusive advertising, keeping every tool permanently free for professionals, freelancers, and businesses of all sizes. There are no usage limits, watermarks, or premium tiers — every feature is available to all users at all times.'},
  {q:'Do I need an account to generate a business letter?',a:'No account or email is required. Simply fill in the form fields, select your letter type and tone, and click generate. Your form data is automatically saved to your browser\'s local storage so you can return and make edits without re-entering your information. Nothing you type is ever transmitted to or stored by Roughtools beyond what is needed for AI generation.'},
  {q:'Is my business letter content and recipient information kept private?',a:'Yes. Form data is stored in your browser\'s local storage only and is never shared with third parties. The AI prompt is sent to our generation API to create the letter text, but your recipient names, business details, and correspondence content are not retained on our servers after the response is returned. Your letter remains private and accessible only on your device.'},
  {q:'What types of business letters can I generate?',a:'The tool supports 12 professional letter types: Partnership Request, Business Inquiry, Complaint & Escalation, Meeting Request, Thank You / Follow-up, Termination Notice, Payment Request, Job Offer, Rejection Letter, Reference Request, Apology Letter, and Custom (for any purpose not covered by the other categories). Each type informs the AI\'s structure, salutation style, paragraph flow, and call-to-action framing to produce a purpose-appropriate letter.'},
  {q:'How do I choose the right tone for my business letter?',a:'Select "Formal" for traditional corporate, legal, government, or institutional correspondence where conventional language and structure are expected. Choose "Semi-Formal" for established business relationships where some warmth is appropriate without losing professionalism. Use "Firm & Direct" for complaints, escalations, payment demands, or contractual notices where clarity and assertiveness matter. Choose "Cordial & Warm" for thank-you letters, follow-ups, and partnership approaches where relationship-building tone is beneficial. Use "Urgent" when the matter requires immediate attention.'},
  {q:'Can I edit the generated letter before downloading?',a:'Yes. After the AI generates your letter, click "Edit Letter" to open a fully editable textarea. You can modify any sentence, adjust phrasing, add specific details, change the opening or closing, or rewrite any paragraph to better match your voice and relationship with the recipient. Once satisfied, click "Download PDF" to save the formatted letter. You can also regenerate the letter with different inputs if the first result doesn\'t meet your needs.'},
  {q:'How do I generate a professional business letter?',a:'To generate your letter: (1) Choose a template style — Classic Block, Corporate, Modern, or Minimal. (2) Select the letter type that matches your purpose. (3) Choose the appropriate tone. (4) Fill in your details in the "From" section including your name, title, company, and contact information. (5) Enter the recipient\'s details. (6) Complete the Content section — provide the subject, opening context, main points you want covered, requested action, and any deadline. (7) Click "Generate Business Letter" and review the result. Edit as needed, then download as PDF.'},
  {q:'Does the business letter tool work on mobile?',a:'Yes, the Business Letter Generator is fully responsive and works on all modern smartphones and tablets. All form sections, template selection, and generate/edit/download functions work on touchscreens. For PDF saving on iOS, use Safari\'s "Share → Print" option. On Android Chrome, use the print dialog and select "Save as PDF." For the most accurate letter formatting in the PDF output, using a desktop or laptop browser is recommended.'},
  {q:'Which letter template style should I choose?',a:'"Classic Block" uses traditional full block format appropriate for formal correspondence in law, finance, government, and academia — all paragraphs left-aligned, no indentation. "Corporate" uses a clean branded header suitable for enterprise and B2B correspondence. "Modern" has a contemporary header with a colour accent, suitable for technology, marketing, and creative industries. "Minimal" is a clean, understated format suitable for consulting, freelance, and industries where simplicity signals confidence.'},
  {q:'Can I generate letters in different languages?',a:'The tool currently generates letters in English. However, you can type your inputs in another language and the AI will attempt to generate the letter in that language — though the quality may vary depending on the complexity of the language and the specificity of the letter type. For professional correspondence in languages other than English, we recommend generating in English first and then having a native speaker translate and adapt the result as needed.'},
  {q:'Why use this tool instead of writing the letter manually?',a:'Writing a formal business letter from scratch requires knowledge of correct formatting conventions, appropriate salutation and closing language for different contexts, and a structured 3-4 paragraph flow that covers the opening, context, request, and call to action. This tool eliminates that overhead by generating a structurally correct, appropriately toned letter in under 30 seconds. You can then edit any detail, add company-specific language, and download a professionally formatted PDF — a task that would otherwise take 15-30 minutes.'},
]
function FAQSection(){const [open,setOpen]=useState<number|null>(null);return(<section className="mt-16 max-w-4xl mx-auto px-4 pb-16"><h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2><p className="text-gray-500 text-sm mb-8">Everything you need to know about the Business Letter Generator.</p><div className="space-y-3">{FAQS.map((faq,i)=>(<details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}><h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3><span className="text-blue-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span></summary>{open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}</details>))}</div></section>)}

export default function BusinessLetterGenerator() {
  const [data,setData]=useState<LetterData>(getInitial)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const update=(next:LetterData)=>{setData(next);if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>{try{localStorage.setItem('roughtools_bizletter_v2',JSON.stringify(next))}catch{/**/}},500)}
  const set=(k:keyof LetterData,v:string)=>update({...data,[k]:v} as LetterData)
  const generate=async()=>{
    if(!data.senderName||!data.subject){setError('Please enter your name and a subject line.');return}
    setError('');setLoading(true);update({...data,result:'',isEditing:false})
    try{const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt(data)})});const json=await res.json();update({...data,result:json.text||'Error generating.',isEditing:false})}
    catch{update({...data,result:'Connection error. Please try again.'})}
    setLoading(false)
  }
  return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back</Link>
          <span className="text-gray-300">|</span><h1 className="font-bold text-gray-900 text-sm">Business Letter Generator</h1>
          {data.result&&<button onClick={()=>printLetter(data)} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">Professional Business Letter Generator</h2>
          <p className="text-blue-100 text-sm">12 letter types · 4 templates · 5 tones · Full editing · PDF download · 100% free</p>
        </div>

        <Sec title="Template & Letter Type" icon="🎨">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {TEMPLATES.map(t=>(<button key={t.id} onClick={()=>update({...data,template:t.id})} className={`rounded-xl border-2 p-3 text-left transition-all ${data.template===t.id?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300 bg-white'}`}><div className="h-8 rounded mb-2" style={{background:t.accent}}/><div className="font-semibold text-xs text-gray-800">{t.name}</div><div className="text-xs text-gray-400 mt-0.5">{t.desc.split(' — ')[1]}</div>{data.template===t.id&&<div className="text-xs text-blue-600 font-semibold mt-1">✓ Selected</div>}</button>))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LBL}>Letter Type</label><select value={data.letterType} onChange={e=>update({...data,letterType:e.target.value as LetterType})} className={CLS}>{LETTER_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className={LBL}>Tone</label><div className="flex flex-wrap gap-2">{TONES.map(t=><button key={t} onClick={()=>update({...data,tone:t})} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${data.tone===t?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>{t}</button>)}</div></div>
          </div>
        </Sec>

        <Sec title="From (Your Details)" icon="🏢">
          <div className="grid grid-cols-2 gap-3">
            <F label="Your Full Name" value={data.senderName} onChange={v=>set('senderName',v)} placeholder="Jane Smith"/>
            <F label="Your Title" value={data.senderTitle} onChange={v=>set('senderTitle',v)} placeholder="Managing Director"/>
            <F label="Company" value={data.senderCompany} onChange={v=>set('senderCompany',v)} placeholder="Acme Corporation"/>
            <F label="Email" value={data.senderEmail} onChange={v=>set('senderEmail',v)} placeholder="jane@acme.com"/>
            <F label="Phone" value={data.senderPhone} onChange={v=>set('senderPhone',v)} placeholder="+1 555 000 0000"/>
            <F label="Date" value={data.date} onChange={v=>set('date',v)} placeholder="January 15, 2025"/>
            <F label="Street Address" value={data.senderAddress} onChange={v=>set('senderAddress',v)} placeholder="123 Business Ave"/>
            <F label="City, State, ZIP" value={data.senderCity} onChange={v=>set('senderCity',v)} placeholder="New York, NY 10001"/>
          </div>
        </Sec>

        <Sec title="To (Recipient Details)" icon="👤">
          <div className="grid grid-cols-2 gap-3">
            <F label="Recipient Name" value={data.recipientName} onChange={v=>set('recipientName',v)} placeholder="Michael Chen"/>
            <F label="Recipient Title" value={data.recipientTitle} onChange={v=>set('recipientTitle',v)} placeholder="CEO"/>
            <F label="Company" value={data.recipientCompany} onChange={v=>set('recipientCompany',v)} placeholder="TechStart Inc"/>
            <F label="Address" value={data.recipientAddress} onChange={v=>set('recipientAddress',v)} placeholder="456 Innovation Blvd"/>
            <F label="City, State, ZIP" value={data.recipientCity} onChange={v=>set('recipientCity',v)} placeholder="San Francisco, CA 94102"/>
          </div>
        </Sec>

        <Sec title="Letter Content" icon="✍️">
          <F label="Subject Line" value={data.subject} onChange={v=>set('subject',v)} placeholder="Partnership Opportunity — Q2 Collaboration Proposal"/>
          <TA label="Opening Context" value={data.openingContext} onChange={v=>set('openingContext',v)} placeholder="E.g. I am writing following our meeting at the SaaS Summit last week where we discussed potential synergies between our companies..." rows={2}/>
          <TA label="Main Points to Cover" value={data.mainPoints} onChange={v=>set('mainPoints',v)} placeholder="E.g. Overview of our services, specific areas of collaboration, mutual benefits, initial proposal terms..." rows={3} hint="List the key information or arguments you want the letter to include. Bullet points are fine."/>
          <TA label="Requested Action / Call to Action" value={data.requestedAction} onChange={v=>set('requestedAction',v)} placeholder="E.g. Schedule a 30-minute discovery call within the next two weeks" rows={2}/>
          <div className="grid grid-cols-2 gap-3">
            <F label="Deadline / Timeframe (optional)" value={data.deadline} onChange={v=>set('deadline',v)} placeholder="Response requested by February 28, 2025"/>
            <F label="Closing Note (optional)" value={data.closingNote} onChange={v=>set('closingNote',v)} placeholder="Looking forward to a productive partnership"/>
          </div>
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
        <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Writing your letter...</>):'✉️ Generate Business Letter with AI'}
        </button>
        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Your Business Letter</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printLetter(data)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing?<textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 font-serif" rows={20}/>:<div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-serif max-h-[600px] overflow-y-auto">{data.result}</div>}
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-blue-600 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection/>
      <ToolPageExtras
        toolName="Business Letter Generator"
        toolSlug="business-letter"
        toolUrl="https://roughtools.com/tools/document-tools/business-letter"
        type="general"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
