'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type ContractType = 'Freelance Service Agreement' | 'Client Service Agreement' | 'Employment Contract' | 'Independent Contractor Agreement' | 'SaaS Subscription Agreement' | 'Vendor Agreement' | 'Consulting Agreement' | 'Partnership Agreement' | 'Non-Compete Agreement' | 'Retainer Agreement' | 'Custom'
type PaymentStructure = 'Fixed Price' | 'Hourly Rate' | 'Monthly Retainer' | 'Milestone-Based' | 'Revenue Share' | 'Equity + Salary'
type IPOwnership = 'Client owns all IP' | 'Contractor retains IP, grants licence' | 'Jointly owned' | 'Contractor owns IP' | 'Custom arrangement'

interface ContractData {
  contractType: ContractType; jurisdiction: string; effectiveDate: string
  party1Name: string; party1Type: string; party1Address: string; party1Rep: string
  party2Name: string; party2Type: string; party2Address: string; party2Rep: string
  scopeOfWork: string; deliverables: string; timeline: string; startDate: string; endDate: string
  paymentAmount: string; paymentCurrency: string; paymentStructure: PaymentStructure
  paymentSchedule: string; lateFeePercent: string
  ipOwnership: IPOwnership; confidentialityDuration: string; nonCompeteDuration: string
  terminationNotice: string; disputeResolution: string; additionalClauses: string
  result: string; isEditing: boolean
}

const CONTRACT_TYPES: ContractType[] = ['Freelance Service Agreement','Client Service Agreement','Employment Contract','Independent Contractor Agreement','SaaS Subscription Agreement','Vendor Agreement','Consulting Agreement','Partnership Agreement','Non-Compete Agreement','Retainer Agreement','Custom']
const PAY_STRUCTURES: PaymentStructure[] = ['Fixed Price','Hourly Rate','Monthly Retainer','Milestone-Based','Revenue Share','Equity + Salary']
const IP_OPTIONS: IPOwnership[] = ['Client owns all IP','Contractor retains IP, grants licence','Jointly owned','Contractor owns IP','Custom arrangement']

function getInitial(): ContractData {
  if (typeof window !== 'undefined') { try { const s=localStorage.getItem('roughtools_contract_v2'); if(s) return JSON.parse(s) } catch { /**/ } }
  return {
    contractType:'Freelance Service Agreement', jurisdiction:'California, USA', effectiveDate:'',
    party1Name:'', party1Type:'Individual / Sole Trader', party1Address:'', party1Rep:'',
    party2Name:'', party2Type:'Limited Company', party2Address:'', party2Rep:'',
    scopeOfWork:'', deliverables:'', timeline:'', startDate:'', endDate:'',
    paymentAmount:'', paymentCurrency:'USD', paymentStructure:'Fixed Price',
    paymentSchedule:'50% upfront, 50% on delivery', lateFeePercent:'1.5',
    ipOwnership:'Client owns all IP', confidentialityDuration:'2 years', nonCompeteDuration:'',
    terminationNotice:'14 days written notice', disputeResolution:'Arbitration',
    additionalClauses:'',
    result:'', isEditing:false,
  }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white'
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

function buildPrompt(d: ContractData) {
  return `Generate a comprehensive, professional ${d.contractType} between:

Party 1 (Service Provider / First Party): ${d.party1Name} (${d.party1Type})${d.party1Address?', '+d.party1Address:''}${d.party1Rep?', represented by '+d.party1Rep:''}

Party 2 (Client / Second Party): ${d.party2Name} (${d.party2Type})${d.party2Address?', '+d.party2Address:''}${d.party2Rep?', represented by '+d.party2Rep:''}

Effective Date: ${d.effectiveDate||'Upon signing'}
Governing Law / Jurisdiction: ${d.jurisdiction}

Scope of Work / Services: ${d.scopeOfWork||'Professional services as discussed and agreed between the parties'}
Key Deliverables: ${d.deliverables||'As specified in attached Schedule A or as agreed in writing'}
Timeline: ${d.timeline||'As mutually agreed'}${d.startDate?'\nStart Date: '+d.startDate:''}${d.endDate?'\nEnd Date / Expiry: '+d.endDate:''}

Payment Terms:
- Amount: ${d.paymentAmount||'As agreed'} ${d.paymentCurrency}
- Payment Structure: ${d.paymentStructure}
- Payment Schedule: ${d.paymentSchedule}
- Late Payment Fee: ${d.lateFeePercent}% per month on overdue amounts

Intellectual Property: ${d.ipOwnership}
Confidentiality Duration: ${d.confidentialityDuration}
${d.nonCompeteDuration?'Non-Compete / Non-Solicitation Duration: '+d.nonCompeteDuration:''}
Termination Notice Period: ${d.terminationNotice}
Dispute Resolution: ${d.disputeResolution}
${d.additionalClauses?'Additional Clauses / Special Terms: '+d.additionalClauses:''}

Write a complete, legally structured contract with numbered sections including:
1. PARTIES AND EFFECTIVE DATE
2. SCOPE OF SERVICES / WORK
3. DELIVERABLES AND TIMELINE
4. PAYMENT TERMS AND INVOICING
5. INTELLECTUAL PROPERTY RIGHTS
6. CONFIDENTIALITY AND NON-DISCLOSURE
${d.nonCompeteDuration?'7. NON-COMPETE AND NON-SOLICITATION\n':''}7. REPRESENTATIONS AND WARRANTIES
8. LIMITATION OF LIABILITY
9. TERMINATION
10. DISPUTE RESOLUTION
11. GENERAL PROVISIONS (entire agreement, amendments, severability, notices)
12. SIGNATURES

Use professional legal language appropriate for ${d.jurisdiction}. Include placeholder brackets [INITIALS] for signature pages. Length: 700-1000 words.

IMPORTANT DISCLAIMER TO INCLUDE AT TOP: "This document is a template generated for informational purposes only and does not constitute legal advice. Parties are advised to seek independent legal counsel before signing any contract."`
}

function printContract(d: ContractData) {
  const win=window.open('','_blank'); if(!win) return
  const paras = d.result.split(/\n{2,}/).filter(Boolean)
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Contract — ${d.contractType}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;color:#1a1a1a;line-height:1.8;font-size:13px}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="max-width:800px;margin:0 auto;padding:0">
<div style="background:#1a1a1a;color:#fff;padding:28px 44px">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:0.6;margin-bottom:6px">Legal Document</div>
  <div style="font-size:22px;font-weight:800">${d.contractType}</div>
  <div style="opacity:0.7;font-size:12px;margin-top:6px">Between ${d.party1Name||'Party 1'} and ${d.party2Name||'Party 2'} · Effective: ${d.effectiveDate||'Upon signing'}</div>
</div>
<div style="padding:40px 44px">${paras.map(p=>{
  const isSectionHead = /^\d+\.\s+[A-Z]/.test(p)||/^[A-Z\s]{8,}$/.test(p)
  return isSectionHead
    ? `<h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#1a1a1a;margin:24px 0 10px;padding-bottom:4px;border-bottom:1px solid #ccc">${p}</h2>`
    : `<p style="margin-bottom:14px;color:#1a1a1a;line-height:1.8">${p.replace(/\n/g,'<br>')}</p>`
}).join('')}</div>
</div></body></html>`)
  win.document.close(); win.onload=()=>win.print()
}

const FAQS = [
  {q:'Is this contract generator free and do I need an account?',a:'Yes, completely free with no account, subscription, or sign-up required. You can generate unlimited contracts across 11 contract types at no cost. Your form data is automatically saved in your browser\'s local storage so you can return and refine your contract without re-entering information. Nothing you type is sent to Roughtools servers or stored beyond what is needed for AI generation.'},
  {q:'Are the contracts generated by this tool legally binding?',a:'The contracts generated by this tool are professional templates based on standard legal principles for the selected jurisdiction, but they are not substitutes for advice from a licensed attorney. A contract becomes legally binding when both parties agree to the terms and sign it — not simply because it was generated by a tool. For high-value or complex engagements, we strongly recommend having a solicitor or lawyer review the contract before signing. This tool is appropriate for straightforward service agreements, freelance contracts, and NDAs where legal risk is moderate.'},
  {q:'What types of contracts can I generate with this tool?',a:'The tool supports 11 contract types: Freelance Service Agreement, Client Service Agreement, Employment Contract, Independent Contractor Agreement, SaaS Subscription Agreement, Vendor Agreement, Consulting Agreement, Partnership Agreement, Non-Compete Agreement, Retainer Agreement, and Custom. Each contract type generates appropriate clauses, language, and section structure for that contract category. For unique or highly specialised contracts, choose "Custom" and describe the arrangement fully in the scope and additional clauses fields.'},
  {q:'Can I edit the generated contract before downloading?',a:'Yes. After the AI generates your contract, click "Edit Contract" to open a fully editable textarea where you can modify any clause, add company-specific provisions, adjust payment amounts, or change any language to match your specific situation. Many users generate a draft, then refine specific clauses to match their standard terms. Once complete, click "Download PDF" to save the formatted document. You can also copy the text to paste into a Word document for further editing.'},
  {q:'Which governing law / jurisdiction should I select?',a:'Select the jurisdiction where your business is registered or where you typically resolve disputes. For US-based freelancers and agencies, enter your state (e.g., "California, USA" or "New York, USA"). For UK businesses, enter "England and Wales" or "Scotland" as appropriate. For international contracts, the party with more bargaining power typically negotiates for their home jurisdiction. If both parties are in different countries, neutral jurisdictions such as "Delaware, USA" or "England and Wales" are commonly used for international commercial agreements.'},
  {q:'How does the IP ownership clause work?',a:'The intellectual property clause determines who owns the work created under the contract. "Client owns all IP" (work-for-hire) means the client owns everything the contractor creates — this is standard for custom software development and bespoke design work. "Contractor retains IP, grants licence" means the contractor keeps ownership but gives the client the right to use the work — common for template-based or reused components. "Jointly owned" means both parties share ownership, which can complicate future use. Choose the option that reflects your agreement and adjust the generated language if needed.'},
  {q:'What is included in the confidentiality / NDA clause?',a:'The generated contract includes a confidentiality clause that defines what constitutes confidential information, the obligations of the receiving party to protect it, standard exclusions (information that is public, independently developed, or disclosed by law), and the duration of the obligation. The duration you specify in the "Confidentiality Duration" field determines how long the obligations last after the contract ends. Standard commercial agreements typically run for 2 years post-termination; highly sensitive information may warrant longer periods.'},
  {q:'Can I generate a contract in a language other than English?',a:'The tool currently generates contracts in English only. For international contracts requiring a specific language, generate the English version and have a qualified legal translator produce a certified translation. Note that in many jurisdictions, the version in the local official language takes legal precedence — this is particularly important in France, Germany, and several MENA countries where local language requirements apply to employment and commercial contracts.'},
  {q:'How do I specify payment terms for milestone-based projects?',a:'Select "Milestone-Based" as the payment structure and describe your milestone schedule in the "Payment Schedule" field. For example: "30% on contract signing, 30% on design approval, 40% on final delivery and sign-off." You can also specify milestone names and corresponding percentages in the "Key Deliverables" field. The generated contract will include payment provisions tied to these milestones and standard consequences for missed milestone approvals.'},
  {q:'Why use Roughtools Contract Creator instead of paying a lawyer?',a:'For straightforward freelance and service agreements between experienced parties, a professionally structured template covers the essential clauses at no cost. This tool is most appropriate for contracts under $50,000 where both parties understand the terms and risk is manageable. For contracts above $100,000, employment agreements in regulated industries, partnership agreements involving equity, or any situation involving significant legal or financial risk, we recommend budgeting for legal review. The cost of a lawyer reviewing a well-drafted template is significantly lower than drafting from scratch.'},
]
function FAQSection(){const [open,setOpen]=useState<number|null>(null);return(<section className="mt-16 max-w-4xl mx-auto px-4 pb-16"><h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2><p className="text-gray-500 text-sm mb-8">Everything you need to know about the Contract Creator.</p><div className="space-y-3">{FAQS.map((faq,i)=>(<details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}><h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3><span className="text-amber-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span></summary>{open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}</details>))}</div></section>)}

export default function ContractCreator() {
  const [data,setData]=useState<ContractData>(getInitial)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const update=(next:ContractData)=>{setData(next);if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>{try{localStorage.setItem('roughtools_contract_v2',JSON.stringify(next))}catch{/**/}},500)}
  const set=(k:keyof ContractData,v:string)=>update({...data,[k]:v} as ContractData)
  const generate=async()=>{
    if(!data.party1Name||!data.party2Name){setError('Please enter both party names.');return}
    setError('');setLoading(true);update({...data,result:'',isEditing:false})
    try{const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt(data)})});const json=await res.json();update({...data,result:json.text||'Error generating contract.',isEditing:false})}
    catch{update({...data,result:'Connection error. Please try again.'})}
    setLoading(false)
  }
  return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back</Link>
          <span className="text-gray-300">|</span><h1 className="font-bold text-gray-900 text-sm">Contract Creator</h1>
          {data.result&&<button onClick={()=>printContract(data)} className="ml-auto bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">Professional Contract Creator</h2>
          <p className="text-amber-100 text-sm">11 contract types · Full clause editor · IP & payment terms · PDF download · 100% free</p>
          <p className="text-amber-200 text-xs mt-2">⚠️ For informational use only — consult a licensed attorney for contracts above $50,000 or involving complex legal risk.</p>
        </div>

        <Sec title="Contract Type & Jurisdiction" icon="⚖️">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LBL}>Contract Type</label><select value={data.contractType} onChange={e=>update({...data,contractType:e.target.value as ContractType})} className={CLS}>{CONTRACT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <F l="Governing Law / Jurisdiction" v={data.jurisdiction} onChange={v=>set('jurisdiction',v)} ph="California, USA" hint="The legal jurisdiction whose laws govern this contract"/>
            <F l="Effective Date" v={data.effectiveDate} onChange={v=>set('effectiveDate',v)} ph="January 15, 2025"/>
          </div>
        </Sec>

        <Sec title="Party 1 — Service Provider / First Party" icon="🏢">
          <div className="grid grid-cols-2 gap-3">
            <F l="Full Legal Name" v={data.party1Name} onChange={v=>set('party1Name',v)} ph="Jane Smith / Creative Agency Ltd"/>
            <F l="Entity Type" v={data.party1Type} onChange={v=>set('party1Type',v)} ph="Individual / Limited Company / LLC"/>
            <div className="col-span-2"><F l="Registered Address" v={data.party1Address} onChange={v=>set('party1Address',v)} ph="123 Main Street, New York, NY 10001, USA"/></div>
            <F l="Signatory / Representative" v={data.party1Rep} onChange={v=>set('party1Rep',v)} ph="Jane Smith, Managing Director"/>
          </div>
        </Sec>

        <Sec title="Party 2 — Client / Second Party" icon="👤">
          <div className="grid grid-cols-2 gap-3">
            <F l="Full Legal Name" v={data.party2Name} onChange={v=>set('party2Name',v)} ph="TechStart Inc"/>
            <F l="Entity Type" v={data.party2Type} onChange={v=>set('party2Type',v)} ph="Limited Company / LLC"/>
            <div className="col-span-2"><F l="Registered Address" v={data.party2Address} onChange={v=>set('party2Address',v)} ph="456 Innovation Blvd, San Francisco, CA 94102, USA"/></div>
            <F l="Signatory / Representative" v={data.party2Rep} onChange={v=>set('party2Rep',v)} ph="Michael Chen, CEO"/>
          </div>
        </Sec>

        <Sec title="Scope, Deliverables & Timeline" icon="📋">
          <TA l="Scope of Work / Services" v={data.scopeOfWork} onChange={v=>set('scopeOfWork',v)} ph="Design and development of a responsive e-commerce website including UX design, frontend development, CMS integration, and 30-day post-launch support..." rows={3}/>
          <TA l="Key Deliverables" v={data.deliverables} onChange={v=>set('deliverables',v)} ph="1. Wireframes and UX prototypes\n2. Responsive web design (5 templates)\n3. Fully functional CMS-powered website\n4. Technical documentation\n5. 30-day post-launch support" rows={4}/>
          <div className="grid grid-cols-3 gap-3">
            <F l="Timeline / Duration" v={data.timeline} onChange={v=>set('timeline',v)} ph="10 weeks"/>
            <F l="Start Date" v={data.startDate} onChange={v=>set('startDate',v)} ph="February 1, 2025"/>
            <F l="End / Expiry Date" v={data.endDate} onChange={v=>set('endDate',v)} ph="April 15, 2025"/>
          </div>
        </Sec>

        <Sec title="Payment Terms" icon="💰">
          <div className="grid grid-cols-2 gap-3">
            <F l="Total Amount" v={data.paymentAmount} onChange={v=>set('paymentAmount',v)} ph="15,000"/>
            <F l="Currency" v={data.paymentCurrency} onChange={v=>set('paymentCurrency',v)} ph="USD"/>
            <div><label className={LBL}>Payment Structure</label><select value={data.paymentStructure} onChange={e=>update({...data,paymentStructure:e.target.value as PaymentStructure})} className={CLS}>{PAY_STRUCTURES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            <F l="Payment Schedule" v={data.paymentSchedule} onChange={v=>set('paymentSchedule',v)} ph="50% upfront, 50% on final delivery"/>
            <F l="Late Payment Fee (%/month)" v={data.lateFeePercent} onChange={v=>set('lateFeePercent',v)} ph="1.5"/>
          </div>
        </Sec>

        <Sec title="Key Clauses" icon="📜">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LBL}>Intellectual Property Ownership</label><select value={data.ipOwnership} onChange={e=>update({...data,ipOwnership:e.target.value as IPOwnership})} className={CLS}>{IP_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
            <F l="Confidentiality Duration" v={data.confidentialityDuration} onChange={v=>set('confidentialityDuration',v)} ph="2 years after contract end"/>
            <F l="Non-Compete Duration (if any)" v={data.nonCompeteDuration} onChange={v=>set('nonCompeteDuration',v)} ph="12 months within same industry"/>
            <F l="Termination Notice Period" v={data.terminationNotice} onChange={v=>set('terminationNotice',v)} ph="14 days written notice"/>
            <div><label className={LBL}>Dispute Resolution</label><select value={data.disputeResolution} onChange={e=>update({...data,disputeResolution:e.target.value})} className={CLS}><option>Arbitration</option><option>Mediation then Litigation</option><option>Court proceedings in governing jurisdiction</option><option>JAMS Arbitration (US)</option><option>ICC Arbitration (International)</option></select></div>
          </div>
          <TA l="Additional Clauses or Special Terms (optional)" v={data.additionalClauses} onChange={v=>set('additionalClauses',v)} ph="E.g. Client may not resell deliverables without written consent. Contractor may showcase the project in their portfolio unless otherwise agreed in writing." rows={3}/>
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
        <button onClick={generate} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Generating contract...</>):'📜 Generate Contract with AI'}
        </button>
        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Your Contract</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printContract(data)} className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing?<textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif" rows={28}/>:<div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-serif max-h-[700px] overflow-y-auto">{data.result}</div>}
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-amber-600 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection/>
      <ToolPageExtras
        toolName="Contract Creator"
        toolSlug="contract-creator"
        toolUrl="https://roughtools.com/tools/document-tools/contract-creator"
        type="legal"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
