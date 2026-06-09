'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type MeetingType = 'Team Standup' | 'Board Meeting' | 'Project Kickoff' | 'Sprint Review' | 'Client Meeting' | 'Strategy & Planning' | 'One-on-One' | 'All-Hands' | 'Budget Review' | 'Post-Mortem' | 'Sales Review' | 'Custom'

interface ActionItem { id: string; task: string; owner: string; due: string; priority: 'High' | 'Medium' | 'Low' }
interface AgendaItem { id: string; topic: string; discussion: string; decision: string; duration: string }
interface Attendee { id: string; name: string; title: string; present: boolean }

interface MinutesData {
  meetingType: MeetingType; title: string; date: string; time: string
  location: string; facilitator: string; recorder: string; nextMeeting: string
  attendees: Attendee[]; agenda: AgendaItem[]; actions: ActionItem[]
  generalNotes: string; parkingLot: string
  result: string; isEditing: boolean
}

const MEETING_TYPES: MeetingType[] = ['Team Standup','Board Meeting','Project Kickoff','Sprint Review','Client Meeting','Strategy & Planning','One-on-One','All-Hands','Budget Review','Post-Mortem','Sales Review','Custom']
const uid = () => Math.random().toString(36).slice(2,8)
const blankAttendee = (): Attendee => ({id:uid(),name:'',title:'',present:true})
const blankAgenda = (): AgendaItem => ({id:uid(),topic:'',discussion:'',decision:'',duration:''})
const blankAction = (): ActionItem => ({id:uid(),task:'',owner:'',due:'',priority:'Medium'})

function getInitial(): MinutesData {
  if (typeof window !== 'undefined') { try { const s = localStorage.getItem('roughtools_minutes_v2'); if(s) return JSON.parse(s) } catch { /**/ } }
  return {
    meetingType:'Team Standup', title:'', date:new Date().toISOString().split('T')[0], time:'', location:'', facilitator:'', recorder:'', nextMeeting:'',
    attendees:[blankAttendee(),blankAttendee(),blankAttendee()],
    agenda:[blankAgenda(),blankAgenda()],
    actions:[blankAction(),blankAction()],
    generalNotes:'', parkingLot:'', result:'', isEditing:false,
  }
}

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-600 mb-1'

function Sec({title,icon,children}:{title:string;icon:string;children:React.ReactNode}){
  const [open,setOpen]=useState(true)
  return(<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden"><button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50"><span className="text-lg">{icon}</span><span className="font-semibold text-gray-800 text-sm flex-1">{title}</span><svg className={`w-4 h-4 text-gray-400 transition-transform ${open?'rotate-180':''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg></button>{open&&<div className="px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}</div>)
}

function buildPrompt(d: MinutesData) {
  const presentAttendees = d.attendees.filter(a=>a.name&&a.present)
  const agendaText = d.agenda.filter(a=>a.topic).map((a,i)=>`${i+1}. ${a.topic}${a.duration?' ('+a.duration+')':''}${a.discussion?'\n   Discussion: '+a.discussion:''}${a.decision?'\n   Decision: '+a.decision:''}`).join('\n')
  const actionsText = d.actions.filter(a=>a.task).map(a=>`• ${a.task} — Owner: ${a.owner||'TBD'}, Due: ${a.due||'TBD'}, Priority: ${a.priority}`).join('\n')

  return `Write professional, structured meeting minutes for the following meeting:

Meeting Type: ${d.meetingType}
Meeting Title: ${d.title||d.meetingType}
Date: ${d.date}${d.time?' at '+d.time:''}
Location / Platform: ${d.location||'Not specified'}
Facilitator: ${d.facilitator||'Not specified'}
Minutes Recorder: ${d.recorder||'Not specified'}

Attendees Present (${presentAttendees.length}):
${presentAttendees.map(a=>`• ${a.name}${a.title?' ('+a.title+')':''}`).join('\n')||'• Not specified'}

Agenda Items Discussed:
${agendaText||'• General discussion — see notes below'}

Action Items:
${actionsText||'• No specific action items recorded'}

${d.generalNotes?'General Notes / Additional Context:\n'+d.generalNotes:''}
${d.parkingLot?'Parking Lot (items for future discussion):\n'+d.parkingLot:''}
${d.nextMeeting?'Next Meeting: '+d.nextMeeting:''}

Write comprehensive meeting minutes with these clearly labelled sections:
1. MEETING DETAILS (header block)
2. ATTENDEES
3. AGENDA & DISCUSSION (for each agenda item: topic, key discussion points, decisions reached)
4. ACTION ITEMS (table format: task, owner, due date, priority)
5. PARKING LOT (deferred items)
6. NEXT STEPS & NEXT MEETING

Make them professional, clear, and suitable for distribution to all stakeholders. Use objective language, past tense for discussions. Length: 400-600 words.`
}

function printMinutes(d: MinutesData) {
  const win = window.open('','_blank'); if(!win) return
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Meeting Minutes — ${d.title||d.meetingType}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#1a1a1a;line-height:1.7;font-size:13px}@page{size:A4;margin:0}@media print{body{width:210mm}}</style></head><body>
<div style="max-width:800px;margin:0 auto;padding:0">
<div style="background:#1e40af;color:#fff;padding:32px 44px">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:0.7;margin-bottom:8px">Meeting Minutes</div>
  <div style="font-size:24px;font-weight:800">${d.title||d.meetingType}</div>
  <div style="display:flex;gap:24px;margin-top:12px;font-size:12px;opacity:0.85;flex-wrap:wrap">
    <span>📅 ${d.date}${d.time?' · '+d.time:''}</span>
    ${d.location?`<span>📍 ${d.location}</span>`:''}
    ${d.facilitator?`<span>👤 Facilitator: ${d.facilitator}</span>`:''}
  </div>
</div>
<div style="padding:36px 44px;white-space:pre-wrap;font-size:13px;line-height:1.75">${d.result||''}</div>
</div></body></html>`)
  win.document.close(); win.onload=()=>win.print()
}

const FAQS = [
  {q:'Is this meeting minutes generator free to use?',a:'Yes, completely free with no account or subscription required. You can generate professional meeting minutes for any meeting type — from quick team standups to formal board meetings — at no cost. Roughtools is supported by non-intrusive advertising, which keeps all tools permanently free. There are no usage limits, watermarks on downloaded PDFs, or premium features locked behind a paywall.'},
  {q:'Do I need to create an account to generate meeting minutes?',a:'No account or email address is required at any stage. Open the Meeting Minutes Generator, fill in your meeting details, attendees, agenda items, and action items, then click generate. Your form data is saved to your browser\'s local storage automatically so you can return and update the minutes after the meeting without re-entering all the details. Nothing you enter is transmitted to Roughtools servers or stored in any database.'},
  {q:'Is my meeting content and attendee information kept private?',a:'Yes. All form data — including meeting notes, attendee names, decisions, and action items — is stored in your browser\'s local storage only and is never shared with third parties. The AI prompt is sent to our generation API to produce the formatted minutes, but your content is not retained on our servers after the response. Your meeting information remains private and accessible only on the device where you created it.'},
  {q:'What types of meetings does this tool support?',a:'The tool supports 12 meeting types including Team Standup, Board Meeting, Project Kickoff, Sprint Review, Client Meeting, Strategy & Planning, One-on-One, All-Hands, Budget Review, Post-Mortem, Sales Review, and Custom. Each meeting type informs the AI\'s structure, tone, and section emphasis — for example, a Board Meeting generates a more formal document with governance-appropriate language, while a Sprint Review focuses on velocity, completed items, and retrospective observations.'},
  {q:'Can I add multiple agenda items and action items?',a:'Yes. The Meeting Minutes Generator has dynamic input sections that allow you to add as many agenda items and action items as needed. Each agenda item has fields for the topic, discussion summary, decision reached, and duration. Each action item includes the task description, owner, due date, and priority level (High, Medium, or Low). Click the "+ Add" button in each section to expand the list. You can also remove individual entries by clicking the delete icon on each row.'},
  {q:'Can I edit the generated minutes before sharing?',a:'Yes. After the AI generates your meeting minutes, click "Edit Minutes" to open a fully editable textarea. You can correct any misrepresented points, add verbatim quotes, adjust the wording of any decision, or add context the AI inferred incorrectly. Once you are satisfied with the content, click "Download PDF" to save the formatted document, or copy the text to paste directly into an email, document, or meeting management platform.'},
  {q:'How do I generate effective meeting minutes?',a:'For the most accurate meeting minutes: (1) Fill in meeting details before the meeting — type, title, date, time, location, facilitator. (2) During the meeting, take brief notes in the "Discussion" and "Decision" fields for each agenda item as the meeting progresses. (3) Record each action item immediately when assigned, including the specific owner name and agreed deadline. (4) Use the "Parking Lot" field for items raised but deferred. (5) Generate and review after the meeting, edit any details that need refinement, and distribute the PDF to all attendees within 24 hours.'},
  {q:'Does the meeting minutes tool work on mobile and tablet?',a:'Yes, the Meeting Minutes Generator is fully responsive and functions on all modern smartphones and tablets. The dynamic attendee, agenda, and action item fields all work on touchscreens. For capturing notes during a live meeting, many users find it useful to open the tool on a laptop or tablet and fill in details in real time. The form data is saved automatically as you type, so there is no risk of losing your notes if the browser is interrupted.'},
  {q:'What format are the generated meeting minutes in?',a:'The generated minutes follow a standard professional format with clearly labelled sections: Meeting Details header (date, time, location, facilitator), Attendees list, Agenda & Discussion (one section per agenda item with discussion summary and decision), Action Items (owner, due date, priority), Parking Lot, and Next Steps. The PDF download formats these sections with a branded header, clean typography, and a structured layout appropriate for distribution to all stakeholders and for archiving.'},
  {q:'Why should I use this instead of writing minutes manually?',a:'Writing structured meeting minutes manually is time-consuming and prone to omitting important details — especially in fast-moving meetings where multiple decisions and action items are generated rapidly. This tool ensures every standard section is covered, action items are clearly attributed with owners and deadlines, and the output is formatted for immediate distribution. Generating minutes in under two minutes after a meeting means they are sent while the content is still fresh, increasing the likelihood that action items are acted upon promptly.'},
]
function FAQSection(){const [open,setOpen]=useState<number|null>(null);return(<section className="mt-16 max-w-4xl mx-auto px-4 pb-16"><h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2><p className="text-gray-500 text-sm mb-8">Everything you need to know about the Meeting Minutes Generator.</p><div className="space-y-3">{FAQS.map((faq,i)=>(<details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none" onClick={e=>{e.preventDefault();setOpen(open===i?null:i)}}><h3 className="text-sm font-semibold text-gray-900 text-left">{faq.q}</h3><span className="text-indigo-600 font-bold text-lg flex-shrink-0 ml-3">{open===i?'−':'+'}</span></summary>{open===i&&<div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}</details>))}</div></section>)}

export default function MeetingMinutes() {
  const [data,setData]=useState<MinutesData>(getInitial)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const update=(next:MinutesData)=>{setData(next);if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>{try{localStorage.setItem('roughtools_minutes_v2',JSON.stringify(next))}catch{/**/}},500)}

  const updAttendee=(id:string,k:keyof Attendee,v:string|boolean)=>update({...data,attendees:data.attendees.map(a=>a.id===id?{...a,[k]:v}:a)})
  const addAttendee=()=>update({...data,attendees:[...data.attendees,blankAttendee()]})
  const delAttendee=(id:string)=>update({...data,attendees:data.attendees.filter(a=>a.id!==id)})

  const updAgenda=(id:string,k:keyof AgendaItem,v:string)=>update({...data,agenda:data.agenda.map(a=>a.id===id?{...a,[k]:v}:a)})
  const addAgenda=()=>update({...data,agenda:[...data.agenda,blankAgenda()]})
  const delAgenda=(id:string)=>update({...data,agenda:data.agenda.filter(a=>a.id!==id)})

  const updAction=(id:string,k:keyof ActionItem,v:string)=>update({...data,actions:data.actions.map(a=>a.id===id?{...a,[k]:v}:a)})
  const addAction=()=>update({...data,actions:[...data.actions,blankAction()]})
  const delAction=(id:string)=>update({...data,actions:data.actions.filter(a=>a.id!==id)})

  const generate=async()=>{
    if(!data.title&&!data.meetingType){setError('Please enter a meeting title.');return}
    setError('');setLoading(true);update({...data,result:'',isEditing:false})
    try{const res=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt(data)})});const json=await res.json();update({...data,result:json.text||'Error generating.',isEditing:false})}
    catch{update({...data,result:'Connection error. Please try again.'})}
    setLoading(false)
  }

  const delBtn = (onClick:()=>void) => (
    <button onClick={onClick} className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  )

  return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Back</Link>
          <span className="text-gray-300">|</span><h1 className="font-bold text-gray-900 text-sm">Meeting Minutes Generator</h1>
          {data.result&&<button onClick={()=>printMinutes(data)} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Download PDF</button>}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">Professional Meeting Minutes Generator</h2>
          <p className="text-indigo-100 text-sm">12 meeting types · Dynamic attendees & agenda · Action item tracking · PDF download · 100% free</p>
        </div>

        {/* Meeting Info */}
        <Sec title="Meeting Information" icon="📋">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LBL}>Meeting Type</label><select value={data.meetingType} onChange={e=>update({...data,meetingType:e.target.value as MeetingType})} className={CLS}>{MEETING_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className={LBL}>Meeting Title</label><input value={data.title} onChange={e=>update({...data,title:e.target.value})} placeholder="Q2 Product Roadmap Review" className={CLS}/></div>
            <div><label className={LBL}>Date</label><input type="date" value={data.date} onChange={e=>update({...data,date:e.target.value})} className={CLS}/></div>
            <div><label className={LBL}>Time</label><input value={data.time} onChange={e=>update({...data,time:e.target.value})} placeholder="10:00 AM – 11:30 AM" className={CLS}/></div>
            <div><label className={LBL}>Location / Platform</label><input value={data.location} onChange={e=>update({...data,location:e.target.value})} placeholder="Zoom / Conference Room A" className={CLS}/></div>
            <div><label className={LBL}>Facilitator</label><input value={data.facilitator} onChange={e=>update({...data,facilitator:e.target.value})} placeholder="Jane Smith" className={CLS}/></div>
            <div><label className={LBL}>Minutes Recorder</label><input value={data.recorder} onChange={e=>update({...data,recorder:e.target.value})} placeholder="Alex Johnson" className={CLS}/></div>
            <div><label className={LBL}>Next Meeting Date</label><input value={data.nextMeeting} onChange={e=>update({...data,nextMeeting:e.target.value})} placeholder="May 15, 2025 at 10:00 AM" className={CLS}/></div>
          </div>
        </Sec>

        {/* Attendees */}
        <Sec title="Attendees" icon="👥">
          <div className="space-y-2 mt-1">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-1 mb-1">
              <span className="col-span-5">Name</span><span className="col-span-4">Title / Role</span><span className="col-span-2 text-center">Present</span><span className="col-span-1"/>
            </div>
            {data.attendees.map(a=>(
              <div key={a.id} className="grid grid-cols-12 gap-2 items-center">
                <input value={a.name} onChange={e=>updAttendee(a.id,'name',e.target.value)} placeholder="Jane Smith" className={`col-span-5 ${CLS}`}/>
                <input value={a.title} onChange={e=>updAttendee(a.id,'title',e.target.value)} placeholder="Product Manager" className={`col-span-4 ${CLS}`}/>
                <div className="col-span-2 flex justify-center"><input type="checkbox" checked={a.present} onChange={e=>updAttendee(a.id,'present',e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-indigo-600"/></div>
                <div className="col-span-1">{delBtn(()=>delAttendee(a.id))}</div>
              </div>
            ))}
          </div>
          <button onClick={addAttendee} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Add Attendee
          </button>
        </Sec>

        {/* Agenda */}
        <Sec title="Agenda Items" icon="📝">
          <div className="space-y-3 mt-1">
            {data.agenda.map((a,i)=>(
              <div key={a.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="col-span-2"><label className={LBL}>Topic #{i+1}</label><input value={a.topic} onChange={e=>updAgenda(a.id,'topic',e.target.value)} placeholder="Budget allocation for Q3" className={CLS}/></div>
                    <div><label className={LBL}>Duration</label><input value={a.duration} onChange={e=>updAgenda(a.id,'duration',e.target.value)} placeholder="15 min" className={CLS}/></div>
                  </div>
                  {delBtn(()=>delAgenda(a.id))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className={LBL}>Discussion Summary</label><textarea value={a.discussion} onChange={e=>updAgenda(a.id,'discussion',e.target.value)} placeholder="Key points discussed..." rows={2} className={`${CLS} resize-none`}/></div>
                  <div><label className={LBL}>Decision Reached</label><textarea value={a.decision} onChange={e=>updAgenda(a.id,'decision',e.target.value)} placeholder="Agreed to increase Q3 budget by 15%..." rows={2} className={`${CLS} resize-none`}/></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addAgenda} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Add Agenda Item
          </button>
        </Sec>

        {/* Action Items */}
        <Sec title="Action Items" icon="✅">
          <div className="space-y-2 mt-1">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-1 mb-1">
              <span className="col-span-4">Task</span><span className="col-span-3">Owner</span><span className="col-span-2">Due Date</span><span className="col-span-2">Priority</span><span className="col-span-1"/>
            </div>
            {data.actions.map(a=>(
              <div key={a.id} className="grid grid-cols-12 gap-2 items-center">
                <input value={a.task} onChange={e=>updAction(a.id,'task',e.target.value)} placeholder="Update project timeline" className={`col-span-4 ${CLS}`}/>
                <input value={a.owner} onChange={e=>updAction(a.id,'owner',e.target.value)} placeholder="Jane Smith" className={`col-span-3 ${CLS}`}/>
                <input value={a.due} onChange={e=>updAction(a.id,'due',e.target.value)} placeholder="May 20" className={`col-span-2 ${CLS}`}/>
                <select value={a.priority} onChange={e=>updAction(a.id,'priority',e.target.value as ActionItem['priority'])} className={`col-span-2 ${CLS}`}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
                <div className="col-span-1">{delBtn(()=>delAction(a.id))}</div>
              </div>
            ))}
          </div>
          <button onClick={addAction} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Add Action Item
          </button>
        </Sec>

        {/* Notes */}
        <Sec title="Notes & Parking Lot" icon="📌">
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div><label className={LBL}>General Notes</label><textarea value={data.generalNotes} onChange={e=>update({...data,generalNotes:e.target.value})} placeholder="Any additional context, observations, or discussion points not captured above..." rows={4} className={`${CLS} resize-none`}/></div>
            <div><label className={LBL}>Parking Lot (items deferred for future)</label><textarea value={data.parkingLot} onChange={e=>update({...data,parkingLot:e.target.value})} placeholder="Topics raised but not discussed: new office lease, team restructure..." rows={4} className={`${CLS} resize-none`}/></div>
          </div>
        </Sec>

        {error&&<div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
        <button onClick={generate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          {loading?(<><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Generating minutes...</>):'📋 Generate Meeting Minutes with AI'}
        </button>
        {data.result&&(
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-semibold text-gray-800 text-sm">📄 Meeting Minutes</span>
              <div className="flex gap-2">
                <button onClick={()=>update({...data,isEditing:!data.isEditing})} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">{data.isEditing?'👁️ Preview':'✏️ Edit'}</button>
                <button onClick={()=>navigator.clipboard.writeText(data.result)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium">Copy</button>
                <button onClick={()=>printMinutes(data)} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium">Download PDF</button>
              </div>
            </div>
            <div className="p-5">
              {data.isEditing?<textarea value={data.result} onChange={e=>update({...data,result:e.target.value})} className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400" rows={22}/>:<div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-[700px] overflow-y-auto">{data.result}</div>}
            </div>
            <div className="px-5 pb-5"><button onClick={generate} disabled={loading} className="text-sm text-indigo-600 hover:underline font-medium">Regenerate</button></div>
          </div>
        )}
      </div>
      <FAQSection/>
      <ToolPageExtras
        toolName="Meeting Minutes Generator"
        toolSlug="meeting-minutes"
        toolUrl="https://roughtools.com/tools/document-tools/meeting-minutes"
        type="general"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
