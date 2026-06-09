'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type Category = 'Travel — Flights' | 'Travel — Ground' | 'Accommodation' | 'Meals & Entertainment' | 'Office Supplies' | 'Software & Subscriptions' | 'Marketing & Advertising' | 'Professional Services' | 'Equipment' | 'Training & Education' | 'Client Gifts' | 'Other'
type Currency = { code:string; symbol:string; label:string }

interface ExpenseItem {
  id: string; date: string; category: Category; description: string
  vendor: string; amount: string; receipt: boolean; notes: string
}
interface ExpenseData {
  employeeName: string; employeeId: string; department: string; position: string
  managerName: string; email: string; currency: string; currencySymbol: string
  periodFrom: string; periodTo: string; purpose: string; projectCode: string
  items: ExpenseItem[]
  result: string; isEditing: boolean
}

const CATEGORIES: Category[] = ['Travel — Flights','Travel — Ground','Accommodation','Meals & Entertainment','Office Supplies','Software & Subscriptions','Marketing & Advertising','Professional Services','Equipment','Training & Education','Client Gifts','Other']
const CURRENCIES: Currency[] = [
  {code:'USD',symbol:'$',label:'US Dollar'},{code:'EUR',symbol:'€',label:'Euro'},{code:'GBP',symbol:'£',label:'British Pound'},
  {code:'CAD',symbol:'CA$',label:'Canadian Dollar'},{code:'AUD',symbol:'A$',label:'Australian Dollar'},
  {code:'INR',symbol:'₹',label:'Indian Rupee'},{code:'AED',symbol:'AED',label:'UAE Dirham'},
  {code:'SGD',symbol:'S$',label:'Singapore Dollar'},{code:'PKR',symbol:'₨',label:'Pakistani Rupee'},
  {code:'SAR',symbol:'SAR',label:'Saudi Riyal'},{code:'CHF',symbol:'Fr',label:'Swiss Franc'},
]
const uid = () => Math.random().toString(36).slice(2,8)
const blankItem = (): ExpenseItem => ({id:uid(),date:'',category:'Travel — Flights',description:'',vendor:'',amount:'',receipt:false,notes:''})

function getInitial(): ExpenseData {
  if (typeof window !== 'undefined') { try { const s=localStorage.getItem('roughtools_expense_v2'); if(s) return JSON.parse(s) } catch { /**/ } }
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  return {
    employeeName:'', employeeId:'', department:'', position:'', managerName:'', email:'',
    currency:'USD', currencySymbol:'$',
    periodFrom: firstDay.toISOString().split('T')[0], periodTo: today.toISOString().split('T')[0],
    purpose:'', projectCode:'',
    items: [blankItem(), blankItem(), blankItem()],
    result:'', isEditing:false,
  }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1'

function Sec({title,icon,children}:{title:string;icon:string;children:React.ReactNode}){
  const [open,setOpen]=useState(true)
  return(<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"><button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50"><span className="text-lg">{icon}</span><span className="font-semibold text-gray-800 text-sm flex-1">{title}</span><svg className={`w-4 h-4 text-gray-400 transition-transform ${open?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg></button>{open&&<div className="px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}</div>)
}

function buildPrompt(d: ExpenseData) {
  const validItems = d.items.filter(i=>i.description||i.amount)
  const total = validItems.reduce((s,i)=>s+(parseFloat(i.amount)||0),0)
  const byCat: Record<string,number> = {}
  validItems.forEach(i=>{ byCat[i.category]=(byCat[i.category]||0)+(parseFloat(i.amount)||0) })
  const itemsText = validItems.map(i=>`• ${i.date||'—'} | ${i.category} | ${i.description||'—'} | ${i.vendor?'Vendor: '+i.vendor+' | ':''}${d.currencySymbol}${parseFloat(i.amount||'0').toFixed(2)} | Receipt: ${i.receipt?'Yes':'No'}${i.notes?' | Note: '+i.notes:''}`).join('\n')
  const catSummary = Object.entries(byCat).map(([c,a])=>`${c}: ${d.currencySymbol}${a.toFixed(2)}`).join(', ')

  return `Write a professional expense report for ${d.employeeName}${d.position?' ('+d.position+')':''}${d.department?' in the '+d.department+' department':''}.

Employee Details:
- Name: ${d.employeeName}
- ID / Reference: ${d.employeeId||'N/A'}
- Department: ${d.department||'N/A'}
- Reports To: ${d.managerName||'N/A'}
- Email: ${d.email||'N/A'}
- Project / Cost Code: ${d.projectCode||'N/A'}

Reporting Period: ${d.periodFrom} to ${d.periodTo}
Purpose / Business Justification: ${d.purpose||'Business travel and operational expenses'}
Currency: ${d.currency}

Expense Items:
${itemsText||'No itemised expenses entered'}

Summary by Category: ${catSummary||'See items above'}
Total Amount: ${d.currencySymbol}${total.toFixed(2)} ${d.currency}

Write a complete expense report with these sections:
1. EXPENSE REPORT HEADER (employee info, period, purpose, submission date)
2. ITEMISED EXPENSE TABLE (date, category, description, vendor, amount, receipt Y/N)
3. SUMMARY BY CATEGORY (subtotal per category)
4. TOTAL REIMBURSEMENT REQUESTED
5. BUSINESS JUSTIFICATION (brief paragraph explaining the business purpose)
6. EMPLOYEE DECLARATION (standard declaration statement that expenses are accurate and in accordance with company policy)
7. APPROVAL SECTION (blank fields for manager name, signature, date, and approval status)

Format it as a professional document suitable for submission to an accounts payable or HR team. Use a table for the itemised expenses section.`
}

function printReport(d: ExpenseData) {
  const win=window.open('','_blank'); if(!win) return
  const validItems = d.items.filter(i=>i.description||i.amount)
  const total = validItems.reduce((s,i)=>s+(parseFloat(i.amount)||0),0)
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Expense Report — ${d.employeeName}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;line-height:1.6;font-size:13px}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="max-width:800px;margin:0 auto">
<div style="background:#065f46;color:#fff;padding:28px 44px;display:flex;justify-content:space-between;align-items:flex-start">
  <div><div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:0.7;margin-bottom:6px">Expense Report</div><div style="font-size:22px;font-weight:800">${d.employeeName}</div>${d.department?`<div style="opacity:0.8;font-size:12px">${d.department}${d.position?' · '+d.position:''}</div>`:''}</div>
  <div style="text-align:right;font-size:12px;opacity:0.85">${d.periodFrom?`<div>Period: ${d.periodFrom} – ${d.periodTo}</div>`:''}${d.projectCode?`<div>Project: ${d.projectCode}</div>`:''}</div>
</div>
<div style="padding:36px 44px;white-space:pre-wrap;font-size:13px;line-height:1.75">${d.result||''}</div>
<div style="padding:0 44px 36px;border-top:1px solid #e5e7eb;margin:0 44px;padding-top:24px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;font-size:12px">
    <div><div style="font-weight:700;margin-bottom:8px">Employee Signature</div><div style="border-bottom:1px solid #999;height:40px;margin-bottom:4px"/><div style="color:#555">Date: _______________</div></div>
    <div><div style="font-weight:700;margin-bottom:8px">Manager Approval</div><div style="border-bottom:1px solid #999;height:40px;margin-bottom:4px"/><div style="color:#555">Date: _______________</div></div>
  </div>
</div>
</div></body></html>`)
  win.document.close(); win.onload=()=>win.print()
}

const FAQS = [
  {q:'Is this expense report generator free to use?',a:'Yes, completely free with no subscription or account required. You can generate, edit, and download professional expense reports for any reporting period, employee, and currency at no cost. Roughtools is supported by non-intrusive advertising, which keeps all tools permanently free. There are no per-report charges, usage limits, or premium features — every capability including multi-currency support, category breakdown, and PDF export is available to all users.'},
  {q:'Do I need to create an account to generate an expense report?',a:'No account, sign-up, or email address is required. Open the Expense Report Generator, fill in the employee details and your expense items, and click generate. Your form data is automatically saved in your browser\'s local storage so you can add expenses throughout the reporting period and return to submit later without losing any data. Nothing you enter is transmitted to Roughtools servers or stored in any external database.'},
  {q:'Is my expense data and personal information private?',a:'Yes. All form data — including your name, department, expense amounts, vendor names, and dates — is stored exclusively in your browser\'s local storage and is never shared with third parties. The AI prompt is sent to our generation API to format the expense report, but your financial data is not retained on our servers after the response is returned. Your expense information remains private and accessible only on your device.'},
  {q:'What currencies are supported in the expense report?',a:'The Expense Report Generator supports 11 currencies including USD, EUR, GBP, CAD, AUD, INR, AED, SGD, PKR, SAR, and CHF. Select your preferred currency from the settings section and all amounts will be displayed with the correct symbol throughout the report and in the PDF download. For reports covering expenses in multiple currencies, enter each amount in the currency you spent it and add a note in the description field indicating the local currency and exchange rate used.'},
  {q:'What expense categories are available?',a:'The generator includes 12 expense categories: Travel — Flights, Travel — Ground Transport, Accommodation, Meals & Entertainment, Office Supplies, Software & Subscriptions, Marketing & Advertising, Professional Services, Equipment, Training & Education, Client Gifts, and Other. Each item in your expense report is assigned to one of these categories, and the generated report automatically summarises the total spent per category — making it easier for your finance team to code expenses to the correct budget lines.'},
  {q:'How do I generate and submit a professional expense report?',a:'To generate your expense report: (1) Fill in your employee details including name, department, manager, and email. (2) Set the reporting period (from and to dates) and the purpose or business justification for the expenses. (3) Enter each expense item with date, category, description, vendor, amount, and whether you have a receipt. (4) Click "Generate Expense Report" to create a professionally formatted document. (5) Review and edit the result if needed. (6) Download as PDF and submit to your manager or finance department along with your physical or digital receipts.'},
  {q:'Can I edit the generated expense report before downloading?',a:'Yes. After the AI generates your expense report, click "Edit Report" to open a fully editable textarea. You can correct any figures, add a more detailed business justification, adjust the declaration wording to match your company\'s standard language, or modify the approval section layout. Once you are satisfied with the content, click "Download PDF" to save the formatted report. You can also regenerate with different inputs if needed.'},
  {q:'Does the expense report include an approval section?',a:'Yes. The generated expense report includes a standard approval section with signature lines and date fields for both the employee and the approving manager. This section is blank by design — the actual signatures are added manually after printing. The report also includes an employee declaration statement confirming that all expenses are accurate, business-related, and submitted in accordance with company expense policy. This language can be edited to match your organisation\'s specific policy wording.'},
  {q:'Does the expense report tool work on mobile?',a:'Yes, the Expense Report Generator is fully responsive and works on smartphones and tablets. All fields, the dynamic expense item rows, and the currency selector work on touchscreens. For the best experience when adding many expense items, a tablet or laptop is recommended. For PDF download on iOS, use Safari\'s "Share → Print" option and save to PDF. On Android Chrome, use the print dialog and select "Save as PDF" as the destination printer.'},
  {q:'Can I add as many expense items as I need?',a:'Yes. The expense items section is fully dynamic — click "Add Expense Item" to add as many rows as your reporting period requires. Each row includes fields for date, category, description, vendor name, amount, receipt availability (checkbox), and any notes. You can remove individual items using the delete button on each row. There is no limit to the number of expense items you can include in a single report.'},
  {q:'Why use this tool instead of a company expense management system?',a:'Roughtools Expense Report Generator is ideal for freelancers, contractors, and small businesses that do not use enterprise expense management software, as well as employees who need to submit occasional ad-hoc expenses outside their company\'s standard process. It produces a professionally formatted, printable PDF that includes all the standard sections expected by finance teams — itemised breakdown, category summary, business justification, declaration, and approval fields — at zero cost and with no system access required.'},
]
function FAQSection(){const [open,setOpen]=useState<number|null>(null);return(<section className="mt-16 max-w-4xl mx-auto px-4 pb-16"><h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2><p className="text-gray-500 text-sm mb-8">Everything you need to know about the Expense Report Generator.</p><div className="space-y-3">{FAQS.map((faq,i)=>(<details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}><h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3><span className="text-green-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span></summary>{open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}</details>))}</div></section>)}

export default function ExpenseReportGenerator() {
  const [data,setData]=useState<ExpenseData>(getInitial)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const update=(next:ExpenseData)=>{setData(next);if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>{try{localStorage.setItem('roughtools_expense_v2',JSON.stringify(next))}catch{/**/}},500)}
  const updItem=(id:string,k:keyof ExpenseItem,v:string|boolean)=>update({...data,items:data.items.map(i=>i.id===id?{...i,[k]:v}:i)})
  const addItem=()=>update({...data,items:[...data.items,blankItem()]})
  const delItem=(id:string)=>update({...data,items:data.items.filter(i=>i.id!==id)})
  const generate=async()=>{
    if(!data.employeeName){setError('Please enter the employee name.');return}
    setError('');setLoading(true);update({...data,result:'',isEditing:false})
    try{const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt(data)})});const json=await res.json();update({...data,result:json.text||'Error generating.',isEditing:false})}
    catch{update({...data,result:'Connection error. Please try again.'})}
    setLoading(false)
  }
  const total=data.items.reduce((s,i)=>s+(parseFloat(i.amount)||0),0)
  const sym=data.currencySymbol
  const delBtn=(onClick:()=>void)=>(<button onClick={onClick} className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>)

  return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back</Link>
          <span className="text-gray-300">|</span><h1 className="font-bold text-gray-900 text-sm">Expense Report Generator</h1>
          {data.result&&<button onClick={()=>printReport(data)} className="ml-auto bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div><h2 className="text-xl font-bold mb-1">Professional Expense Report Generator</h2><p className="text-green-100 text-sm">11 currencies · 12 categories · Itemised table · Auto-totals · Approval section · PDF download</p></div>
          <div className="text-right"><div className="text-xs text-green-200 mb-1">Total to Date</div><div className="text-2xl font-bold">{sym}{total.toFixed(2)}</div></div>
        </div>

        {/* Employee */}
        <Sec title="Employee Information" icon="👤">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div><label className={LBL}>Full Name</label><input value={data.employeeName} onChange={e=>update({...data,employeeName:e.target.value})} placeholder="Jane Smith" className={CLS}/></div>
            <div><label className={LBL}>Employee ID</label><input value={data.employeeId} onChange={e=>update({...data,employeeId:e.target.value})} placeholder="EMP-001" className={CLS}/></div>
            <div><label className={LBL}>Department</label><input value={data.department} onChange={e=>update({...data,department:e.target.value})} placeholder="Sales" className={CLS}/></div>
            <div><label className={LBL}>Job Title</label><input value={data.position} onChange={e=>update({...data,position:e.target.value})} placeholder="Account Executive" className={CLS}/></div>
            <div><label className={LBL}>Manager Name</label><input value={data.managerName} onChange={e=>update({...data,managerName:e.target.value})} placeholder="Michael Chen" className={CLS}/></div>
            <div><label className={LBL}>Email</label><input value={data.email} onChange={e=>update({...data,email:e.target.value})} placeholder="jane@company.com" className={CLS}/></div>
            <div><label className={LBL}>Period From</label><input type="date" value={data.periodFrom} onChange={e=>update({...data,periodFrom:e.target.value})} className={CLS}/></div>
            <div><label className={LBL}>Period To</label><input type="date" value={data.periodTo} onChange={e=>update({...data,periodTo:e.target.value})} className={CLS}/></div>
            <div><label className={LBL}>Currency</label><select value={data.currency} onChange={e=>{const c=CURRENCIES.find(c=>c.code===e.target.value)!;update({...data,currency:c.code,currencySymbol:c.symbol})}} className={CLS}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}</select></div>
            <div><label className={LBL}>Business Purpose</label><input value={data.purpose} onChange={e=>update({...data,purpose:e.target.value})} placeholder="NYC client visit — Q2 pitch" className={CLS}/></div>
            <div><label className={LBL}>Project / Cost Code</label><input value={data.projectCode} onChange={e=>update({...data,projectCode:e.target.value})} placeholder="PROJ-2025-NYC" className={CLS}/></div>
          </div>
        </Sec>

        {/* Expense Items */}
        <Sec title={`Expense Items (${data.items.filter(i=>i.description||i.amount).length} items · Total: ${sym}${total.toFixed(2)})`} icon="🧾">
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-1 mb-1 mt-1">
            <span className="col-span-1">Date</span><span className="col-span-2">Category</span><span className="col-span-3">Description</span><span className="col-span-2">Vendor</span><span className="col-span-1">Amount</span><span className="col-span-1 text-center">Receipt</span><span className="col-span-1">Notes</span><span className="col-span-1"/>
          </div>
          <div className="space-y-2">
            {data.items.map(item=>(
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-2 border border-gray-100">
                <input type="date" value={item.date} onChange={e=>updItem(item.id,'date',e.target.value)} className={`col-span-1 ${CLS} text-xs`}/>
                <select value={item.category} onChange={e=>updItem(item.id,'category',e.target.value)} className={`col-span-2 ${CLS} text-xs`}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                <input value={item.description} onChange={e=>updItem(item.id,'description',e.target.value)} placeholder="Flight to NYC" className={`col-span-3 ${CLS} text-xs`}/>
                <input value={item.vendor} onChange={e=>updItem(item.id,'vendor',e.target.value)} placeholder="Delta Airlines" className={`col-span-2 ${CLS} text-xs`}/>
                <div className="col-span-1 flex items-center gap-1">
                  <span className="text-xs text-gray-400 flex-shrink-0">{sym}</span>
                  <input type="number" value={item.amount} onChange={e=>updItem(item.id,'amount',e.target.value)} placeholder="0.00" className={`${CLS} text-xs w-full`} min="0" step="0.01"/>
                </div>
                <div className="col-span-1 flex justify-center"><input type="checkbox" checked={item.receipt} onChange={e=>updItem(item.id,'receipt',e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-600"/></div>
                <input value={item.notes} onChange={e=>updItem(item.id,'notes',e.target.value)} placeholder="Note" className={`col-span-1 ${CLS} text-xs`}/>
                <div className="col-span-1 flex justify-end">{delBtn(()=>delItem(item.id))}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <button onClick={addItem} className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Add Expense Item
            </button>
            <div className="text-sm font-bold text-gray-900">Total: <span className="text-green-700">{sym}{total.toFixed(2)} {data.currency}</span></div>
          </div>
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
        <button onClick={generate} disabled={loading} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Generating report...</>):'💰 Generate Expense Report'}
        </button>
        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Expense Report</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printReport(data)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing?<textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-green-400" rows={22}/>:<div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-[700px] overflow-y-auto">{data.result}</div>}
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-green-700 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection/>
      <ToolPageExtras
        toolName="Expense Report Generator"
        toolSlug="expense-report"
        toolUrl="https://roughtools.com/tools/document-tools/expense-report"
        type="financial"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
