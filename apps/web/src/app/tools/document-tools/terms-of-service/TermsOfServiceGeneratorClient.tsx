'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type ServiceType = 'SaaS / Web Application' | 'E-commerce Store' | 'Mobile App' | 'Marketplace / Platform' | 'Content / Blog / Media' | 'API / Developer Service' | 'Subscription Service' | 'Online Course / Education' | 'Professional Services Website' | 'Community / Forum' | 'Custom'
type Jurisdiction = 'California, USA' | 'Delaware, USA' | 'New York, USA' | 'England and Wales, UK' | 'European Union (GDPR)' | 'Australia' | 'Canada' | 'Singapore' | 'UAE' | 'Custom'

interface ToSData {
  serviceType: ServiceType; jurisdiction: Jurisdiction; customJurisdiction: string
  companyName: string; companyLegalName: string; website: string; contactEmail: string
  supportEmail: string; companyAddress: string; effectiveDate: string
  minimumAge: string; requiresAccount: boolean; freeOrPaid: string
  subscriptionTerms: string; refundPolicy: string; trialPeriod: string
  prohibitedUses: string; userDataPolicy: string; ipPolicy: string
  limitationOfLiability: string; terminationPolicy: string; additionalClauses: string
  result: string; isEditing: boolean
}

const SERVICE_TYPES: ServiceType[] = ['SaaS / Web Application','E-commerce Store','Mobile App','Marketplace / Platform','Content / Blog / Media','API / Developer Service','Subscription Service','Online Course / Education','Professional Services Website','Community / Forum','Custom']
const JURISDICTIONS: Jurisdiction[] = ['California, USA','Delaware, USA','New York, USA','England and Wales, UK','European Union (GDPR)','Australia','Canada','Singapore','UAE','Custom']

function getInitial(): ToSData {
  if (typeof window !== 'undefined') { try { const s=localStorage.getItem('roughtools_tos_v2'); if(s) return JSON.parse(s) } catch { /**/ } }
  return {
    serviceType:'SaaS / Web Application', jurisdiction:'California, USA', customJurisdiction:'',
    companyName:'', companyLegalName:'', website:'', contactEmail:'', supportEmail:'', companyAddress:'',
    effectiveDate: new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),
    minimumAge:'18', requiresAccount:true, freeOrPaid:'Paid subscription with free tier',
    subscriptionTerms:'Monthly and annual subscription plans. Subscriptions auto-renew unless cancelled.',
    refundPolicy:'14-day money-back guarantee for new subscribers on paid plans.',
    trialPeriod:'14-day free trial, no credit card required.',
    prohibitedUses:'Spam, illegal activity, harassment, scraping, reselling without permission, violating third-party rights.',
    userDataPolicy:'We collect and process user data as described in our Privacy Policy. We do not sell user data.',
    ipPolicy:'All content and IP belongs to the company. Users retain rights to their own content uploaded to the platform.',
    limitationOfLiability:'Maximum liability limited to fees paid in the previous 12 months.',
    terminationPolicy:'We may terminate accounts for breach of these terms. Users may cancel at any time.',
    additionalClauses:'',
    result:'', isEditing:false,
  }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1.5'

function F({l,v,onChange,ph,hint,type='text'}:{l:string;v:string;onChange:(x:string)=>void;ph?:string;hint?:string;type?:string}) {
  return <div><label className={LBL}>{l}</label><input type={type} value={v} onChange={e=>onChange(e.target.value)} placeholder={ph} className={CLS}/>{hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
}
function TA({l,v,onChange,ph,rows=3,hint}:{l:string;v:string;onChange:(x:string)=>void;ph?:string;rows?:number;hint?:string}) {
  return <div><label className={LBL}>{l}</label><textarea value={v} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} className={`${CLS} resize-none`}/>{hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
}
function Sec({title,icon,children}:{title:string;icon:string;children:React.ReactNode}){
  const [open,setOpen]=useState(true)
  return(<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"><button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50"><span className="text-lg">{icon}</span><span className="font-semibold text-gray-800 text-sm flex-1">{title}</span><svg className={`w-4 h-4 text-gray-400 transition-transform ${open?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg></button>{open&&<div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">{children}</div>}</div>)
}

function buildPrompt(d: ToSData) {
  const jur = d.jurisdiction === 'Custom' ? d.customJurisdiction : d.jurisdiction
  return `Generate comprehensive Terms of Service (Terms and Conditions) for the following:

Company: ${d.companyName}${d.companyLegalName&&d.companyLegalName!==d.companyName?' (Legal name: '+d.companyLegalName+')':''}
Website / Platform: ${d.website||'[website URL]'}
Service Type: ${d.serviceType}
Governing Law: ${jur}
Effective Date: ${d.effectiveDate}
Contact Email: ${d.contactEmail||'[contact email]'}
Support Email: ${d.supportEmail||d.contactEmail||'[support email]'}
Company Address: ${d.companyAddress||'[company address]'}

Key Service Details:
- Minimum User Age: ${d.minimumAge} years old
- Account Required: ${d.requiresAccount?'Yes — users must create an account':'No — available without registration'}
- Pricing Model: ${d.freeOrPaid}
${d.trialPeriod?'- Trial Period: '+d.trialPeriod:''}
${d.subscriptionTerms?'- Subscription Terms: '+d.subscriptionTerms:''}
${d.refundPolicy?'- Refund Policy: '+d.refundPolicy:''}

Policy Details:
- Prohibited Uses: ${d.prohibitedUses}
- User Data Policy: ${d.userDataPolicy}
- Intellectual Property: ${d.ipPolicy}
- Limitation of Liability: ${d.limitationOfLiability}
- Termination Policy: ${d.terminationPolicy}
${d.additionalClauses?'Additional Clauses: '+d.additionalClauses:''}

Write complete, comprehensive Terms of Service with these numbered sections:
1. ACCEPTANCE OF TERMS
2. DESCRIPTION OF SERVICE
3. ELIGIBILITY AND ACCOUNTS (age requirements, account responsibilities, passwords)
4. SUBSCRIPTION AND PAYMENT TERMS (if applicable: plans, billing, auto-renewal, cancellation)
5. REFUND POLICY (if applicable)
6. ACCEPTABLE USE AND PROHIBITED ACTIVITIES
7. INTELLECTUAL PROPERTY RIGHTS
8. USER-GENERATED CONTENT (if applicable)
9. PRIVACY AND DATA PROTECTION (reference to Privacy Policy, ${jur.includes('EU')||jur.includes('GDPR')?'GDPR compliance, ':''} data handling)
10. DISCLAIMERS AND WARRANTIES
11. LIMITATION OF LIABILITY
12. INDEMNIFICATION
13. TERMINATION
14. GOVERNING LAW AND DISPUTE RESOLUTION
15. CHANGES TO TERMS
16. CONTACT INFORMATION
17. ENTIRE AGREEMENT

Use professional legal language appropriate for ${jur}. ${jur.includes('EU')||jur.includes('GDPR')?'Include GDPR-specific provisions for EU users including data subject rights and lawful basis for processing.':''}
Length: 800-1200 words. Include headings for each section.`
}

function printToS(d: ToSData) {
  const win=window.open('','_blank'); if(!win) return
  const sections = d.result.split(/\n{2,}/).filter(Boolean)
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Terms of Service — ${d.companyName}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;line-height:1.7;font-size:13px}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="max-width:800px;margin:0 auto">
<div style="background:#1c1917;color:#fff;padding:28px 44px">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:0.6;margin-bottom:6px">Legal Document</div>
  <div style="font-size:22px;font-weight:800">Terms of Service</div>
  <div style="opacity:0.75;font-size:12px;margin-top:6px">${d.companyName} · ${d.website||''} · Effective: ${d.effectiveDate}</div>
</div>
<div style="padding:40px 44px">${sections.map(p=>{
  const isHead=/^\d+\.\s+[A-Z]/.test(p)||/^[A-Z][A-Z\s]{8,}$/.test(p)
  return isHead?`<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb">${p}</h2>`:`<p style="margin-bottom:12px;line-height:1.75">${p.replace(/\n/g,'<br>')}</p>`
}).join('')}</div>
</div></body></html>`)
  win.document.close(); win.onload=()=>win.print()
}

const FAQS = [
  {q:'Is this Terms of Service generator free to use?',a:'Yes, the Roughtools Terms of Service Generator is completely free with no account, subscription, or payment required. You can generate and download unlimited Terms of Service documents for any type of web service, app, or platform at no cost. Roughtools is funded through non-intrusive advertising. Your form data is saved automatically in your browser\'s local storage between sessions, so you can return and update your ToS as your service evolves without starting over.'},
  {q:'Does a generated Terms of Service have legal force?',a:'A Terms of Service document has legal force when it is properly displayed on your website or app and users are given a meaningful opportunity to review and accept it before using your service — typically through a checkbox, sign-up confirmation, or prominent notice that continued use constitutes acceptance. The generated document covers the standard provisions that courts in most jurisdictions look for when assessing ToS enforceability. However, for platforms operating in regulated industries (financial services, healthcare, children\'s products) or for users in multiple jurisdictions, having a lawyer review or customise the document is strongly advised.'},
  {q:'Does this generator create GDPR-compliant terms?',a:'When you select "European Union (GDPR)" as your jurisdiction, the generator includes GDPR-specific provisions covering data subject rights (access, deletion, portability, objection), lawful basis for processing, data retention periods, cross-border data transfer mechanisms, and references to the requirement for a separate GDPR-compliant Privacy Policy. Note that GDPR compliance is not achieved through terms alone — it requires technical and organisational measures in your actual systems, a proper Privacy Policy, and potentially a Data Processing Agreement for B2B services. The generated ToS provides the legal text framework.'},
  {q:'Can I edit the generated terms before publishing?',a:'Yes. After generation, click "Edit ToS" to open a fully editable textarea. Most businesses need to customise at least a few sections: the refund policy often needs to match the specific conditions of your payment processor, the prohibited uses list should reflect your platform\'s unique risks, and the liability limitation amount should match your insurance coverage or risk tolerance. Once satisfied, download as PDF for record-keeping, and copy the text to paste into your website\'s Terms of Service page.'},
  {q:'What is the difference between Terms of Service and a Privacy Policy?',a:'Terms of Service (ToS) — also called Terms and Conditions or Terms of Use — govern the relationship between you and your users: what they can and cannot do on your platform, payment terms, your IP rights, liability limits, and how disputes are resolved. A Privacy Policy governs how you collect, use, store, and share users\' personal data. Both documents are legally required for most online services, and they work in tandem — the ToS typically references the Privacy Policy. Use this tool for the ToS, and use the Privacy Policy Generator tool (under Legal Tools) for your privacy document.'},
  {q:'How often should I update my Terms of Service?',a:'You should review and update your Terms of Service whenever: you add or significantly change a product feature that affects user rights or obligations, you change your pricing or subscription model, a significant legal change occurs in your operating jurisdiction (e.g., a new data protection law), or a legal event highlights a gap in your current terms. The generated ToS includes a "Changes to Terms" section that specifies how you will notify users of updates. Most businesses update their ToS at least once per year. Always maintain an archive of previous versions with their effective dates.'},
  {q:'Do I need separate terms for different countries?',a:'For most small and medium businesses, a single ToS governed by one jurisdiction is sufficient, with a note that users in certain regions are subject to additional rights. For example, EU users have statutory consumer rights that cannot be waived by ToS, regardless of governing law. Large platforms operating at scale in multiple countries typically maintain jurisdiction-specific terms — particularly for the EU, USA, and Australia, which have distinct consumer protection and data protection frameworks. The "European Union (GDPR)" jurisdiction option in this tool generates terms with EU-specific provisions included.'},
  {q:'What should I include in the Prohibited Uses section?',a:'Your Prohibited Uses section should be specific to your platform\'s real risks, not just generic. Standard items include: spam, illegal activity, harassment, uploading malware, reverse-engineering, unauthorised scraping, reselling access without permission, impersonating others, and violating intellectual property rights. Platforms with user-generated content should add: posting defamatory content, sharing non-consensual intimate images, and inciting violence or discrimination. Marketplaces should add: listing prohibited products, providing false reviews, and circumventing the platform\'s fee structure. The more specific your prohibited uses, the stronger your legal basis for account termination.'},
  {q:'Does the generated ToS include a limitation of liability clause?',a:'Yes. Every generated Terms of Service includes a Limitation of Liability clause that limits your company\'s maximum liability to users — typically capped at the amount they paid in the previous 12 months or a fixed sum. This clause is one of the most commercially important parts of the ToS, as it protects you from unlimited damages claims. The clause also includes disclaimers of implied warranties and exclusions for indirect, consequential, and incidental damages. Note that some jurisdictions (particularly in the EU and Australia) restrict how broadly liability can be limited for consumer-facing services.'},
  {q:'How do I display Terms of Service on my website?',a:'For ToS to be legally enforceable, users must have a genuine opportunity to read them before using your service. Best practices: (1) Include a checkbox during sign-up saying "I agree to the Terms of Service" with a clickable link — this creates a clear record of acceptance. (2) Link to the ToS from your website footer on every page. (3) For SaaS products, display a notice inside the app and at each major upgrade. (4) For significant ToS changes, send an email notification to existing users with the effective date of the new terms and what changed. Keep a record of when each user accepted which version of your terms.'},
]
function FAQSection(){const [open,setOpen]=useState<number|null>(null);return(<section className="mt-16 max-w-4xl mx-auto px-4 pb-16"><h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2><p className="text-gray-500 text-sm mb-8">Everything you need to know about generating Terms of Service.</p><div className="space-y-3">{FAQS.map((faq,i)=>(<details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}><h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3><span className="text-yellow-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span></summary>{open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}</details>))}</div></section>)}

export default function TermsOfServiceGenerator() {
  const [data,setData]=useState<ToSData>(getInitial)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const update=(next:ToSData)=>{setData(next);if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>{try{localStorage.setItem('roughtools_tos_v2',JSON.stringify(next))}catch{/**/}},500)}
  const set=(k:keyof ToSData,v:string|boolean)=>update({...data,[k]:v} as ToSData)
  const generate=async()=>{
    if(!data.companyName||!data.website){setError('Please enter your company name and website URL.');return}
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
          <span className="text-gray-300">|</span><h1 className="font-bold text-gray-900 text-sm">Terms of Service Generator</h1>
          {data.result&&<button onClick={()=>printToS(data)} className="ml-auto bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-yellow-600 to-amber-500 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">Terms of Service Generator</h2>
          <p className="text-yellow-100 text-sm">11 service types · GDPR option · 17 ToS sections · Full editing · PDF download · 100% free</p>
        </div>

        <Sec title="Service & Jurisdiction" icon="⚖️">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LBL}>Service Type</label><select value={data.serviceType} onChange={e=>update({...data,serviceType:e.target.value as ServiceType})} className={CLS}>{SERVICE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className={LBL}>Governing Law / Jurisdiction</label><select value={data.jurisdiction} onChange={e=>update({...data,jurisdiction:e.target.value as Jurisdiction})} className={CLS}>{JURISDICTIONS.map(j=><option key={j} value={j}>{j}</option>)}</select></div>
            {data.jurisdiction==='Custom'&&<div className="col-span-2"><F l="Custom Jurisdiction" v={data.customJurisdiction} onChange={v=>set('customJurisdiction',v)} ph="New South Wales, Australia"/></div>}
            <F l="Effective Date" v={data.effectiveDate} onChange={v=>set('effectiveDate',v)} ph="January 1, 2025"/>
          </div>
        </Sec>

        <Sec title="Company Information" icon="🏢">
          <div className="grid grid-cols-2 gap-3">
            <F l="Company / Brand Name" v={data.companyName} onChange={v=>set('companyName',v)} ph="MyApp"/>
            <F l="Full Legal Name" v={data.companyLegalName} onChange={v=>set('companyLegalName',v)} ph="MyApp Technologies Inc." hint="If different from brand name"/>
            <F l="Website URL" v={data.website} onChange={v=>set('website',v)} ph="https://myapp.com" type="url"/>
            <F l="Legal / Contact Email" v={data.contactEmail} onChange={v=>set('contactEmail',v)} ph="legal@myapp.com" type="email"/>
            <F l="Support Email" v={data.supportEmail} onChange={v=>set('supportEmail',v)} ph="support@myapp.com" type="email"/>
            <div className="col-span-2"><F l="Company Address" v={data.companyAddress} onChange={v=>set('companyAddress',v)} ph="123 Tech Street, San Francisco, CA 94102, USA"/></div>
          </div>
        </Sec>

        <Sec title="Service & Account Details" icon="⚙️">
          <div className="grid grid-cols-2 gap-3">
            <F l="Minimum User Age" v={data.minimumAge} onChange={v=>set('minimumAge',v)} ph="18" hint="13 for COPPA-compliant services, 16 for GDPR-subject minors, 18 for general"/>
            <div><label className={LBL}>Account Required?</label><div className="flex gap-2 mt-1">
              <button onClick={()=>set('requiresAccount',true)} className={`px-4 py-2 rounded-lg text-sm border transition-all ${data.requiresAccount?'bg-yellow-600 text-white border-yellow-600':'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'}`}>Yes</button>
              <button onClick={()=>set('requiresAccount',false)} className={`px-4 py-2 rounded-lg text-sm border transition-all ${!data.requiresAccount?'bg-yellow-600 text-white border-yellow-600':'bg-white text-gray-600 border-gray-200 hover:border-yellow-300'}`}>No</button>
            </div></div>
            <F l="Pricing Model" v={data.freeOrPaid} onChange={v=>set('freeOrPaid',v)} ph="Free with paid premium plans"/>
            <F l="Trial Period (if any)" v={data.trialPeriod} onChange={v=>set('trialPeriod',v)} ph="14-day free trial, no credit card required"/>
            <div className="col-span-2"><TA l="Subscription / Payment Terms" v={data.subscriptionTerms} onChange={v=>set('subscriptionTerms',v)} ph="Monthly and annual plans. Subscriptions auto-renew. Cancel anytime from your account dashboard." rows={2}/></div>
            <div className="col-span-2"><TA l="Refund Policy" v={data.refundPolicy} onChange={v=>set('refundPolicy',v)} ph="30-day money-back guarantee for first-time subscribers. No refunds for partial months." rows={2}/></div>
          </div>
        </Sec>

        <Sec title="Policies & Legal Provisions" icon="📋">
          <TA l="Prohibited Uses" v={data.prohibitedUses} onChange={v=>set('prohibitedUses',v)} ph="Spam, illegal activity, harassment, scraping, reverse engineering, reselling without permission, uploading malicious code, infringing third-party IP..." rows={3}/>
          <TA l="User Data & Privacy Summary" v={data.userDataPolicy} onChange={v=>set('userDataPolicy',v)} ph="We collect usage data and personal information as described in our Privacy Policy. We do not sell user data to third parties." rows={2}/>
          <TA l="Intellectual Property Policy" v={data.ipPolicy} onChange={v=>set('ipPolicy',v)} ph="All platform IP belongs to [Company]. Users retain rights to their own uploaded content but grant us a licence to host and display it." rows={2}/>
          <TA l="Limitation of Liability" v={data.limitationOfLiability} onChange={v=>set('limitationOfLiability',v)} ph="Maximum liability limited to fees paid in the last 12 months. Not liable for indirect or consequential damages." rows={2}/>
          <TA l="Termination Policy" v={data.terminationPolicy} onChange={v=>set('terminationPolicy',v)} ph="We may terminate accounts for ToS violations. Users may delete their account at any time. Data deleted within 30 days of termination." rows={2}/>
          <TA l="Additional Clauses (optional)" v={data.additionalClauses} onChange={v=>set('additionalClauses',v)} ph="E.g. API rate limits, export control, government use provisions, accessibility commitment..." rows={2}/>
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
        <button onClick={generate} disabled={loading} className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Generating Terms of Service...</>):'⚖️ Generate Terms of Service with AI'}
        </button>
        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Your Terms of Service</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printToS(data)} className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing?<textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400" rows={28}/>:<div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-[700px] overflow-y-auto">{data.result}</div>}
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-yellow-700 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection/>
      <ToolPageExtras
        toolName="Terms of Service Generator"
        toolSlug="terms-of-service"
        toolUrl="https://roughtools.com/tools/document-tools/terms-of-service"
        type="legal"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
