'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type NDAType = 'Mutual (Both parties disclose)' | 'Unilateral (One party discloses)' | 'Multilateral (Three or more parties)'
type EntityType = 'Individual' | 'Sole Trader' | 'Limited Company' | 'LLC' | 'Partnership' | 'Charity / Non-profit' | 'Government Body'
type ConfidentialScope = 'Business plans and strategies' | 'Technical specifications and source code' | 'Financial information and projections' | 'Customer and supplier data' | 'Product designs and prototypes' | 'All business information shared between parties'

interface NDAData {
  ndaType: NDAType; jurisdiction: string; effectiveDate: string
  party1Name: string; party1Type: EntityType; party1Address: string; party1Rep: string
  party2Name: string; party2Type: EntityType; party2Address: string; party2Rep: string
  purposeOfDisclosure: string; confidentialScope: string; exclusions: string
  duration: string; returnOfMaterials: boolean; remedy: string; additionalTerms: string
  result: string; isEditing: boolean
}

const NDA_TYPES: NDAType[] = ['Mutual (Both parties disclose)','Unilateral (One party discloses)','Multilateral (Three or more parties)']
const ENTITY_TYPES: EntityType[] = ['Individual','Sole Trader','Limited Company','LLC','Partnership','Charity / Non-profit','Government Body']
const CONF_SCOPES: ConfidentialScope[] = ['Business plans and strategies','Technical specifications and source code','Financial information and projections','Customer and supplier data','Product designs and prototypes','All business information shared between parties']

function getInitial(): NDAData {
  if (typeof window !== 'undefined') { try { const s=localStorage.getItem('roughtools_nda_v2'); if(s) return JSON.parse(s) } catch { /**/ } }
  return {
    ndaType:'Mutual (Both parties disclose)', jurisdiction:'California, USA', effectiveDate:'',
    party1Name:'', party1Type:'Limited Company', party1Address:'', party1Rep:'',
    party2Name:'', party2Type:'Limited Company', party2Address:'', party2Rep:'',
    purposeOfDisclosure:'Evaluating a potential business partnership or collaboration',
    confidentialScope:'All business information shared between parties',
    exclusions:'Information that is publicly known, independently developed, or disclosed by legal requirement',
    duration:'2 years', returnOfMaterials:true, remedy:'Injunctive relief in addition to monetary damages',
    additionalTerms:'',
    result:'', isEditing:false,
  }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1.5'

function F({l,v,onChange,ph,hint}:{l:string;v:string;onChange:(x:string)=>void;ph?:string;hint?:string}) {
  return <div><label className={LBL}>{l}</label><input value={v} onChange={e=>onChange(e.target.value)} placeholder={ph} className={CLS}/>{hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
}
function TA({l,v,onChange,ph,rows=3,hint}:{l:string;v:string;onChange:(x:string)=>void;ph?:string;rows?:number;hint?:string}) {
  return <div><label className={LBL}>{l}</label><textarea value={v} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} className={`${CLS} resize-none`}/>{hint&&<p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
}
function Sec({title,icon,children}:{title:string;icon:string;children:React.ReactNode}){
  const [open,setOpen]=useState(true)
  return(<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"><button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50"><span className="text-lg">{icon}</span><span className="font-semibold text-gray-800 text-sm flex-1">{title}</span><svg className={`w-4 h-4 text-gray-400 transition-transform ${open?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg></button>{open&&<div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">{children}</div>}</div>)
}

function buildPrompt(d: NDAData) {
  const isMutual = d.ndaType.includes('Mutual')
  return `Generate a comprehensive, professional Non-Disclosure Agreement (NDA).

NDA Type: ${d.ndaType}
Governing Law: ${d.jurisdiction}
Effective Date: ${d.effectiveDate||'Upon signing by both parties'}

${isMutual?'Party A':'Disclosing Party'}: ${d.party1Name} (${d.party1Type})${d.party1Address?', '+d.party1Address:''}${d.party1Rep?', represented by: '+d.party1Rep:''}

${isMutual?'Party B':'Receiving Party'}: ${d.party2Name} (${d.party2Type})${d.party2Address?', '+d.party2Address:''}${d.party2Rep?', represented by: '+d.party2Rep:''}

Purpose of Disclosure: ${d.purposeOfDisclosure}

Confidential Information covers: ${d.confidentialScope}
Standard Exclusions: ${d.exclusions}

Key Terms:
- Confidentiality Obligation Duration: ${d.duration} after the date of disclosure or termination of discussions
- Return or Destruction of Materials: ${d.returnOfMaterials?'Required upon request or termination':'Not required'}
- Remedy for Breach: ${d.remedy}
${d.additionalTerms?'Additional Terms: '+d.additionalTerms:''}

Generate a complete NDA with these numbered sections:
1. DEFINITIONS (Confidential Information, Disclosing Party, Receiving Party)
2. DISCLOSURE AND PURPOSE
3. OBLIGATIONS OF RECEIVING PARTY
4. EXCLUSIONS FROM CONFIDENTIAL INFORMATION
5. TERM AND DURATION
6. RETURN OF MATERIALS
7. NO LICENCE GRANTED
8. ${isMutual?'MUTUAL OBLIGATIONS':'UNILATERAL OBLIGATIONS'}
9. REMEDIES FOR BREACH
10. GENERAL PROVISIONS (entire agreement, no waiver, severability, governing law)
11. SIGNATURES

Use professional legal language appropriate for ${d.jurisdiction}. Include signature blocks with date lines.

DISCLAIMER TO INCLUDE: "This NDA template is for informational purposes only. Consult a qualified attorney for legal advice specific to your situation."`
}

function printNDA(d: NDAData) {
  const win=window.open('','_blank'); if(!win) return
  const paras = d.result.split(/\n{2,}/).filter(Boolean)
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>NDA — ${d.party1Name} & ${d.party2Name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;color:#1a1a1a;line-height:1.85;font-size:13px}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="max-width:800px;margin:0 auto">
<div style="background:#4c1d95;color:#fff;padding:28px 44px">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:0.6;margin-bottom:6px">Legal Document</div>
  <div style="font-size:22px;font-weight:800">Non-Disclosure Agreement</div>
  <div style="opacity:0.75;font-size:12px;margin-top:8px">${d.ndaType} · ${d.party1Name||'Party A'} & ${d.party2Name||'Party B'} · ${d.effectiveDate||'Effective upon signing'}</div>
</div>
<div style="padding:40px 44px">${paras.map(p=>{
  const isHead=/^\d+\.\s+[A-Z]/.test(p)||/^[A-Z][A-Z\s]{6,}$/.test(p)
  return isHead?`<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #ccc">${p}</h2>`:`<p style="margin-bottom:14px">${p.replace(/\n/g,'<br>')}</p>`
}).join('')}</div>
</div></body></html>`)
  win.document.close(); win.onload=()=>win.print()
}

const FAQS = [
  {q:'Is the NDA Generator free to use without an account?',a:'Yes, completely free with no account, subscription, or email required. You can generate, edit, and download unlimited NDAs at no cost. Roughtools is funded through non-intrusive advertising. Your form data is saved automatically in your browser\'s local storage between sessions so you can return and refine your NDA without re-entering information. Nothing you type is stored on Roughtools servers beyond what is needed for generation.'},
  {q:'What is the difference between a mutual and unilateral NDA?',a:'A mutual NDA (also called a two-way or bilateral NDA) means both parties are disclosing confidential information to each other and both are bound by the same confidentiality obligations. This is common for partnerships, joint ventures, and early-stage business discussions where both sides are sharing sensitive information. A unilateral NDA (one-way NDA) means only one party is disclosing information — the disclosing party shares it and the receiving party agrees to keep it confidential. This is typical for employment relationships, vendor engagements, or when sharing proprietary information with a potential investor or client.'},
  {q:'Are NDAs generated by this tool legally enforceable?',a:'NDAs generated by this tool are based on professional legal templates and follow standard drafting conventions for the selected jurisdiction. A well-drafted NDA is legally enforceable provided it is signed by both parties, contains clear definitions of confidential information, specifies the obligations of the receiving party, and identifies the governing law. However, enforceability also depends on jurisdiction-specific requirements that may not be fully captured by a template. For high-stakes disclosures involving trade secrets, source code, clinical data, or significant financial information, we strongly recommend review by a qualified attorney before signing.'},
  {q:'What types of information can an NDA cover?',a:'An NDA can cover any information that a party designates as confidential, typically including: business plans and corporate strategy, technical specifications and source code, financial projections and investor materials, customer lists and supplier relationships, product designs, prototypes, and formulas, and any other proprietary information shared between the parties. Standard exclusions — information that is already publicly known, independently developed by the receiving party, or disclosed by legal compulsion — are included automatically in the generated NDA.'},
  {q:'How long does an NDA obligation last?',a:'The duration of an NDA\'s confidentiality obligation is negotiable and depends on the sensitivity and commercial life of the information being protected. Common durations are: 1–2 years for general business discussions and market information; 3–5 years for technology, product designs, and significant commercial information; and indefinite or perpetual for trade secrets and genuinely proprietary know-how in some jurisdictions (though perpetual NDAs are difficult to enforce in some countries, particularly in Europe). The tool defaults to 2 years, which is the most common commercial standard for mutual business NDAs.'},
  {q:'Can I edit the generated NDA before downloading?',a:'Yes. After the AI generates your NDA, click "Edit NDA" to open a fully editable textarea where you can modify any clause, tighten definitions, add jurisdiction-specific language, or adjust any provision to match your specific situation. Common edits include: specifying exactly what categories of information are and are not confidential, adding a clause about return of physical materials, including a specific dispute resolution mechanism, or adding a representation that the disclosing party has the right to share the information. Once satisfied, click "Download PDF."'},
  {q:'Does the NDA include a return of materials clause?',a:'Yes, when the "Return or Destruction of Materials" option is toggled on (which is the default), the generated NDA includes a standard clause requiring the receiving party to return or certifiably destroy all confidential materials — including documents, copies, digital files, and notes containing confidential information — within a specified period upon request or at the end of the agreement. This clause is important for protecting against retained copies of sensitive information after a business relationship ends.'},
  {q:'Can an NDA prevent someone from working for a competitor?',a:'An NDA alone typically does not prevent someone from working for a competitor — that requires a separate non-compete clause or agreement. An NDA only restricts the use and disclosure of specific confidential information; it does not restrict a person\'s general right to work. If you need to restrict someone from working for competitors, use the Contract Creator tool and select "Non-Compete Agreement" as the contract type, or include a non-compete clause in a broader employment or service agreement. Note that non-compete enforceability varies significantly by jurisdiction — they are largely unenforceable in California, for example.'},
  {q:'What happens if someone breaches an NDA?',a:'The remedy for breach depends on the governing law and what is specified in the NDA. The generated NDA includes a clause stating that breach may entitle the disclosing party to seek injunctive relief — a court order to stop the breach immediately — in addition to monetary damages. Injunctive relief is particularly important for NDA breaches because monetary damages are often difficult to calculate precisely and the harm caused by disclosure may be irreparable. In practice, pursuing an NDA breach requires demonstrating that confidential information was actually disclosed or misused, which requires documentation of what was shared and when.'},
  {q:'Do I need to register an NDA anywhere to make it valid?',a:'No. An NDA does not need to be registered with any government body or authority to be legally valid. It becomes binding once it is signed by all parties. However, keeping a signed copy on file is essential for enforcement — store digital copies in a secure, backed-up location and retain physical originals where possible. For NDAs covering patentable inventions or trade secrets, having the signing date documented is particularly important as it can be relevant in intellectual property disputes.'},
]
function FAQSection(){const [open,setOpen]=useState<number|null>(null);return(<section className="mt-16 max-w-4xl mx-auto px-4 pb-16"><h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2><p className="text-gray-500 text-sm mb-8">Everything you need to know about Non-Disclosure Agreements.</p><div className="space-y-3">{FAQS.map((faq,i)=>(<details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}><h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3><span className="text-purple-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span></summary>{open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}</details>))}</div></section>)}

export default function NDAGenerator() {
  const [data,setData]=useState<NDAData>(getInitial)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const update=(next:NDAData)=>{setData(next);if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>{try{localStorage.setItem('roughtools_nda_v2',JSON.stringify(next))}catch{/**/}},500)}
  const set=(k:keyof NDAData,v:string|boolean)=>update({...data,[k]:v} as NDAData)
  const generate=async()=>{
    if(!data.party1Name||!data.party2Name){setError('Please enter both party names.');return}
    setError('');setLoading(true);update({...data,result:'',isEditing:false})
    try{const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt(data)})});const json=await res.json();update({...data,result:json.text||'Error generating NDA.',isEditing:false})}
    catch{update({...data,result:'Connection error. Please try again.'})}
    setLoading(false)
  }
  return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back</Link>
          <span className="text-gray-300">|</span><h1 className="font-bold text-gray-900 text-sm">NDA Generator</h1>
          {data.result&&<button onClick={()=>printNDA(data)} className="ml-auto bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">Professional NDA Generator</h2>
          <p className="text-purple-100 text-sm">Mutual & Unilateral NDAs · 3 party types · Full clause editor · PDF download · 100% free</p>
          <p className="text-purple-200 text-xs mt-2">⚠️ For informational use only — consult a licensed attorney for NDAs covering high-value trade secrets or regulated industries.</p>
        </div>

        <Sec title="NDA Type & Jurisdiction" icon="🔏">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={LBL}>NDA Type</label><div className="grid grid-cols-3 gap-2">{NDA_TYPES.map(t=><button key={t} onClick={()=>update({...data,ndaType:t})} className={`p-3 rounded-xl border-2 text-xs font-medium text-left transition-all ${data.ndaType===t?'border-purple-500 bg-purple-50 text-purple-900':'border-gray-200 bg-white text-gray-700 hover:border-purple-300'}`}>{t}</button>)}</div></div>
            <F l="Governing Law / Jurisdiction" v={data.jurisdiction} onChange={v=>set('jurisdiction',v)} ph="California, USA"/>
            <F l="Effective Date" v={data.effectiveDate} onChange={v=>set('effectiveDate',v)} ph="January 15, 2025"/>
          </div>
        </Sec>

        <Sec title={data.ndaType.includes('Mutual')?'Party A':'Disclosing Party'} icon="🏢">
          <div className="grid grid-cols-2 gap-3">
            <F l="Full Legal Name" v={data.party1Name} onChange={v=>set('party1Name',v)} ph="TechCorp Inc"/>
            <div><label className={LBL}>Entity Type</label><select value={data.party1Type} onChange={e=>update({...data,party1Type:e.target.value as EntityType})} className={CLS}>{ENTITY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div className="col-span-2"><F l="Registered Address" v={data.party1Address} onChange={v=>set('party1Address',v)} ph="123 Main Street, San Francisco, CA 94102, USA"/></div>
            <F l="Representative / Signatory" v={data.party1Rep} onChange={v=>set('party1Rep',v)} ph="Jane Smith, CEO"/>
          </div>
        </Sec>

        <Sec title={data.ndaType.includes('Mutual')?'Party B':'Receiving Party'} icon="👤">
          <div className="grid grid-cols-2 gap-3">
            <F l="Full Legal Name" v={data.party2Name} onChange={v=>set('party2Name',v)} ph="John Smith / XYZ Agency Ltd"/>
            <div><label className={LBL}>Entity Type</label><select value={data.party2Type} onChange={e=>update({...data,party2Type:e.target.value as EntityType})} className={CLS}>{ENTITY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div className="col-span-2"><F l="Registered Address" v={data.party2Address} onChange={v=>set('party2Address',v)} ph="456 Innovation Blvd, New York, NY 10001, USA"/></div>
            <F l="Representative / Signatory" v={data.party2Rep} onChange={v=>set('party2Rep',v)} ph="Michael Chen, Managing Director"/>
          </div>
        </Sec>

        <Sec title="Confidentiality Terms" icon="🔒">
          <TA l="Purpose of Disclosure" v={data.purposeOfDisclosure} onChange={v=>set('purposeOfDisclosure',v)} ph="Evaluating a potential technology licensing partnership and joint product development collaboration" rows={2}/>
          <div><label className={LBL}>Scope of Confidential Information</label><select value={data.confidentialScope} onChange={e=>update({...data,confidentialScope:e.target.value})} className={CLS}>{CONF_SCOPES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <TA l="Standard Exclusions (what is NOT confidential)" v={data.exclusions} onChange={v=>set('exclusions',v)} ph="Information in the public domain, independently developed by receiving party, or disclosed under legal obligation" rows={2}/>
          <div className="grid grid-cols-2 gap-3">
            <F l="Confidentiality Duration" v={data.duration} onChange={v=>set('duration',v)} ph="2 years from effective date"/>
            <F l="Remedy for Breach" v={data.remedy} onChange={v=>set('remedy',v)} ph="Injunctive relief + monetary damages"/>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={data.returnOfMaterials} onChange={e=>set('returnOfMaterials',e.target.checked)} className="rounded border-gray-300 text-purple-600"/>
            <span className="text-sm text-gray-700 font-medium">Require return or destruction of materials on termination</span>
          </label>
          <TA l="Additional Terms (optional)" v={data.additionalTerms} onChange={v=>set('additionalTerms',v)} ph="E.g. This NDA does not grant either party any intellectual property rights in the disclosed information..." rows={2}/>
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
        <button onClick={generate} disabled={loading} className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Generating NDA...</>):'🔏 Generate NDA with AI'}
        </button>
        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Your NDA</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printNDA(data)} className="text-xs bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing?<textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 font-serif" rows={26}/>:<div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-serif max-h-[700px] overflow-y-auto">{data.result}</div>}
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-purple-600 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection/>
      <ToolPageExtras
        toolName="NDA Generator"
        toolSlug="nda-generator"
        toolUrl="https://roughtools.com/tools/document-tools/nda-generator"
        type="legal"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
