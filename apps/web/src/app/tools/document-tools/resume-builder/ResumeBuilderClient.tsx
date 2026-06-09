'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────

type Template = 'modern' | 'classic' | 'minimal'

interface Header {
  name: string; title: string; email: string; phone: string
  location: string; website: string; linkedin: string; github: string
  summary: string; photo: string
}

interface ExpEntry {
  id: string; company: string; role: string; location: string
  start: string; end: string; current: boolean; bullets: string[]
}
interface EduEntry {
  id: string; school: string; degree: string; field: string
  start: string; end: string; gpa: string; honors: string
}
interface ProjectEntry {
  id: string; name: string; description: string; url: string
  tech: string; bullets: string[]
}
interface CertEntry {
  id: string; name: string; issuer: string; date: string; url: string
}
interface LangEntry {
  id: string; language: string; proficiency: string
}
interface AwardEntry {
  id: string; title: string; issuer: string; date: string; description: string
}
interface VolunteerEntry {
  id: string; org: string; role: string; start: string; end: string; description: string
}
interface SkillGroup {
  id: string; category: string; skills: string
}
interface LinkEntry {
  id: string; label: string; url: string
}

type SectionId = 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'awards' | 'volunteering' | 'links'

interface SectionMeta { id: SectionId; label: string; icon: string; enabled: boolean }

interface ResumeData {
  header: Header
  sections: SectionMeta[]
  experience: ExpEntry[]
  education: EduEntry[]
  skills: SkillGroup[]
  projects: ProjectEntry[]
  certifications: CertEntry[]
  languages: LangEntry[]
  awards: AwardEntry[]
  volunteering: VolunteerEntry[]
  links: LinkEntry[]
  template: Template
}

// ─── Helpers ─────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9)

const DEFAULT_SECTIONS: SectionMeta[] = [
  { id: 'experience',     label: 'Work Experience',  icon: '💼', enabled: true  },
  { id: 'education',      label: 'Education',         icon: '🎓', enabled: true  },
  { id: 'skills',         label: 'Skills',            icon: '⚡', enabled: true  },
  { id: 'projects',       label: 'Projects',          icon: '🚀', enabled: false },
  { id: 'certifications', label: 'Certifications',    icon: '🏆', enabled: false },
  { id: 'languages',      label: 'Languages',         icon: '🌐', enabled: false },
  { id: 'awards',         label: 'Awards & Honours',  icon: '🥇', enabled: false },
  { id: 'volunteering',   label: 'Volunteering',      icon: '🤝', enabled: false },
  { id: 'links',          label: 'Links & Portfolio', icon: '🔗', enabled: false },
]

const blankExp  = (): ExpEntry      => ({ id: uid(), company:'', role:'', location:'', start:'', end:'', current:false, bullets:[''] })
const blankEdu  = (): EduEntry      => ({ id: uid(), school:'', degree:'', field:'', start:'', end:'', gpa:'', honors:'' })
const blankProj = (): ProjectEntry  => ({ id: uid(), name:'', description:'', url:'', tech:'', bullets:[''] })
const blankCert = (): CertEntry     => ({ id: uid(), name:'', issuer:'', date:'', url:'' })
const blankLang = (): LangEntry     => ({ id: uid(), language:'', proficiency:'Conversational' })
const blankAward= (): AwardEntry    => ({ id: uid(), title:'', issuer:'', date:'', description:'' })
const blankVol  = (): VolunteerEntry=> ({ id: uid(), org:'', role:'', start:'', end:'', description:'' })
const blankSkill= (): SkillGroup    => ({ id: uid(), category:'', skills:'' })
const blankLink = (): LinkEntry     => ({ id: uid(), label:'', url:'' })

function getInitial(): ResumeData {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('roughtools_resume_v2')
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
  }
  return {
    header: { name:'', title:'', email:'', phone:'', location:'', website:'', linkedin:'', github:'', summary:'', photo:'' },
    sections: DEFAULT_SECTIONS,
    experience: [blankExp()],
    education: [blankEdu()],
    skills: [blankSkill()],
    projects: [blankProj()],
    certifications: [blankCert()],
    languages: [blankLang()],
    awards: [blankAward()],
    volunteering: [blankVol()],
    links: [blankLink()],
    template: 'modern',
  }
}

// ─── Shared UI ───────────────────────────────────────────────

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white'
const TEXTAREA = INPUT + ' resize-none'
const LABEL = 'block text-xs font-medium text-gray-500 mb-1'

function Field({ label, value, onChange, placeholder, type='text', required, hasError }: {
  label: string; value: string; onChange: (v:string)=>void; placeholder?: string
  type?: string; required?: boolean; hasError?: boolean
}) {
  return (
    <div>
      <label className={LABEL}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className={`${INPUT} ${hasError ? 'border-red-400 ring-1 ring-red-400' : ''}`} />
      {hasError && <p className="text-xs text-red-500 mt-0.5">Required</p>}
    </div>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows=3 }: {
  label: string; value: string; onChange: (v:string)=>void; placeholder?: string; rows?: number
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className={TEXTAREA} />
    </div>
  )
}

function DeleteBtn({ onClick }: { onClick: ()=>void }) {
  return (
    <button onClick={onClick} type="button"
      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      title="Remove entry">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  )
}

function AddBtn({ label, onClick }: { label: string; onClick: ()=>void }) {
  return (
    <button onClick={onClick} type="button"
      className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
      {label}
    </button>
  )
}

function EntryCard({ children, onDelete, canDelete }: { children: React.ReactNode; onDelete: ()=>void; canDelete: boolean }) {
  return (
    <div className="relative bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100 group">
      {canDelete && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteBtn onClick={onDelete} />
        </div>
      )}
      {children}
    </div>
  )
}

// ─── BulletsEditor ───────────────────────────────────────────

function BulletsEditor({ bullets, onChange }: { bullets: string[]; onChange: (b:string[])=>void }) {
  const upd = (i: number, v: string) => onChange(bullets.map((b,idx) => idx===i ? v : b))
  const add = () => onChange([...bullets, ''])
  const del = (i: number) => onChange(bullets.length > 1 ? bullets.filter((_,idx)=>idx!==i) : [''])

  return (
    <div>
      <label className={LABEL}>Bullet Points</label>
      <div className="space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-400 text-sm flex-shrink-0">•</span>
            <input value={b} onChange={e=>upd(i, e.target.value)}
              placeholder="Describe an accomplishment with a metric..."
              className={`${INPUT} flex-1`} />
            <DeleteBtn onClick={()=>del(i)} />
          </div>
        ))}
      </div>
      <button onClick={add} type="button" className="text-xs text-indigo-500 hover:underline mt-1 ml-5">+ Add bullet</button>
    </div>
  )
}

// ─── Section Editors ─────────────────────────────────────────

function ExperienceEditor({ entries, onChange }: { entries: ExpEntry[]; onChange: (e:ExpEntry[])=>void }) {
  const upd = (i:number, k:keyof ExpEntry, v:unknown) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No experience added yet. Click below to add your first role.</p>
      )}
      {entries.map((exp, i) => (
        <EntryCard key={exp.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Job Title" value={exp.role} onChange={v=>upd(i,'role',v)} placeholder="Software Engineer" required />
            <Field label="Company" value={exp.company} onChange={v=>upd(i,'company',v)} placeholder="Acme Corp" required />
            <Field label="Location" value={exp.location} onChange={v=>upd(i,'location',v)} placeholder="New York, NY" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start" value={exp.start} onChange={v=>upd(i,'start',v)} placeholder="Jan 2022" />
              <Field label="End" value={exp.current ? 'Present' : exp.end} onChange={v=>upd(i,'end',v)} placeholder="Present" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input type="checkbox" id={`cur-${exp.id}`} checked={exp.current} onChange={e=>upd(i,'current',e.target.checked)}
              className="rounded border-gray-300 text-indigo-600" />
            <label htmlFor={`cur-${exp.id}`} className="text-xs text-gray-600">Currently working here</label>
          </div>
          <BulletsEditor bullets={exp.bullets} onChange={b=>upd(i,'bullets',b)} />
        </EntryCard>
      ))}
      <AddBtn label="Add Role" onClick={()=>onChange([...entries, blankExp()])} />
    </div>
  )
}

function EducationEditor({ entries, onChange }: { entries: EduEntry[]; onChange: (e:EduEntry[])=>void }) {
  const upd = (i:number, k:keyof EduEntry, v:string) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No education added yet.</p>
      )}
      {entries.map((edu, i) => (
        <EntryCard key={edu.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="School / University" value={edu.school} onChange={v=>upd(i,'school',v)} placeholder="MIT" required />
            <Field label="Degree" value={edu.degree} onChange={v=>upd(i,'degree',v)} placeholder="Bachelor of Science" />
            <Field label="Field of Study" value={edu.field} onChange={v=>upd(i,'field',v)} placeholder="Computer Science" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start" value={edu.start} onChange={v=>upd(i,'start',v)} placeholder="2018" />
              <Field label="End" value={edu.end} onChange={v=>upd(i,'end',v)} placeholder="2022" />
            </div>
            <Field label="GPA (optional)" value={edu.gpa} onChange={v=>upd(i,'gpa',v)} placeholder="3.8/4.0" />
            <Field label="Honors (optional)" value={edu.honors} onChange={v=>upd(i,'honors',v)} placeholder="Magna Cum Laude" />
          </div>
        </EntryCard>
      ))}
      <AddBtn label="Add Education" onClick={()=>onChange([...entries, blankEdu()])} />
    </div>
  )
}

function SkillsEditor({ groups, onChange }: { groups: SkillGroup[]; onChange: (g:SkillGroup[])=>void }) {
  const upd = (i:number, k:keyof SkillGroup, v:string) => onChange(groups.map((g,idx)=>idx===i?{...g,[k]:v}:g))
  const del = (i:number) => onChange(groups.filter((_,idx)=>idx!==i))

  return (
    <div>
      {groups.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No skills added yet.</p>
      )}
      {groups.map((g, i) => (
        <EntryCard key={g.id} onDelete={()=>del(i)} canDelete={groups.length > 1}>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Category (optional)" value={g.category} onChange={v=>upd(i,'category',v)} placeholder="Frontend" />
            <div className="col-span-2">
              <Field label="Skills (comma-separated)" value={g.skills} onChange={v=>upd(i,'skills',v)}
                placeholder="React, TypeScript, CSS, Figma" required />
            </div>
          </div>
        </EntryCard>
      ))}
      <AddBtn label="Add Skill Group" onClick={()=>onChange([...groups, blankSkill()])} />
    </div>
  )
}

function ProjectsEditor({ entries, onChange }: { entries: ProjectEntry[]; onChange: (e:ProjectEntry[])=>void }) {
  const upd = (i:number, k:keyof ProjectEntry, v:unknown) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No projects added yet.</p>}
      {entries.map((proj, i) => (
        <EntryCard key={proj.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Project Name" value={proj.name} onChange={v=>upd(i,'name',v)} placeholder="RoughTools" required />
            <Field label="URL (optional)" value={proj.url} onChange={v=>upd(i,'url',v)} placeholder="https://roughtools.com" />
            <div className="col-span-2">
              <Field label="Tech Stack" value={proj.tech} onChange={v=>upd(i,'tech',v)} placeholder="Next.js, TypeScript, Tailwind" />
            </div>
          </div>
          <BulletsEditor bullets={proj.bullets} onChange={b=>upd(i,'bullets',b)} />
        </EntryCard>
      ))}
      <AddBtn label="Add Project" onClick={()=>onChange([...entries, blankProj()])} />
    </div>
  )
}

function CertificationsEditor({ entries, onChange }: { entries: CertEntry[]; onChange: (e:CertEntry[])=>void }) {
  const upd = (i:number, k:keyof CertEntry, v:string) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No certifications added yet.</p>}
      {entries.map((cert, i) => (
        <EntryCard key={cert.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Certification Name" value={cert.name} onChange={v=>upd(i,'name',v)} placeholder="AWS Solutions Architect" required />
            <Field label="Issuing Organization" value={cert.issuer} onChange={v=>upd(i,'issuer',v)} placeholder="Amazon Web Services" />
            <Field label="Date" value={cert.date} onChange={v=>upd(i,'date',v)} placeholder="Jun 2023" />
            <Field label="Credential URL" value={cert.url} onChange={v=>upd(i,'url',v)} placeholder="https://..." />
          </div>
        </EntryCard>
      ))}
      <AddBtn label="Add Certification" onClick={()=>onChange([...entries, blankCert()])} />
    </div>
  )
}

function LanguagesEditor({ entries, onChange }: { entries: LangEntry[]; onChange: (e:LangEntry[])=>void }) {
  const upd = (i:number, k:keyof LangEntry, v:string) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))
  const levels = ['Native','Fluent','Advanced','Conversational','Basic']

  return (
    <div>
      {entries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No languages added yet.</p>}
      {entries.map((lang, i) => (
        <EntryCard key={lang.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Language" value={lang.language} onChange={v=>upd(i,'language',v)} placeholder="Spanish" required />
            <div>
              <label className={LABEL}>Proficiency</label>
              <select value={lang.proficiency} onChange={e=>upd(i,'proficiency',e.target.value)} className={INPUT}>
                {levels.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </EntryCard>
      ))}
      <AddBtn label="Add Language" onClick={()=>onChange([...entries, blankLang()])} />
    </div>
  )
}

function AwardsEditor({ entries, onChange }: { entries: AwardEntry[]; onChange: (e:AwardEntry[])=>void }) {
  const upd = (i:number, k:keyof AwardEntry, v:string) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No awards added yet.</p>}
      {entries.map((award, i) => (
        <EntryCard key={award.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Award Title" value={award.title} onChange={v=>upd(i,'title',v)} placeholder="Employee of the Year" required />
            <Field label="Issuer" value={award.issuer} onChange={v=>upd(i,'issuer',v)} placeholder="Acme Corp" />
            <Field label="Date" value={award.date} onChange={v=>upd(i,'date',v)} placeholder="Dec 2023" />
            <div />
          </div>
          <TextareaField label="Description (optional)" value={award.description} onChange={v=>upd(i,'description',v)}
            placeholder="Brief description of the award..." rows={2} />
        </EntryCard>
      ))}
      <AddBtn label="Add Award" onClick={()=>onChange([...entries, blankAward()])} />
    </div>
  )
}

function VolunteeringEditor({ entries, onChange }: { entries: VolunteerEntry[]; onChange: (e:VolunteerEntry[])=>void }) {
  const upd = (i:number, k:keyof VolunteerEntry, v:string) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No volunteering added yet.</p>}
      {entries.map((vol, i) => (
        <EntryCard key={vol.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Organization" value={vol.org} onChange={v=>upd(i,'org',v)} placeholder="Red Cross" required />
            <Field label="Role" value={vol.role} onChange={v=>upd(i,'role',v)} placeholder="Volunteer Coordinator" />
            <Field label="Start" value={vol.start} onChange={v=>upd(i,'start',v)} placeholder="Jan 2022" />
            <Field label="End" value={vol.end} onChange={v=>upd(i,'end',v)} placeholder="Present" />
          </div>
          <TextareaField label="Description" value={vol.description} onChange={v=>upd(i,'description',v)}
            placeholder="What you did and the impact..." rows={2} />
        </EntryCard>
      ))}
      <AddBtn label="Add Volunteering" onClick={()=>onChange([...entries, blankVol()])} />
    </div>
  )
}

function LinksEditor({ entries, onChange }: { entries: LinkEntry[]; onChange: (e:LinkEntry[])=>void }) {
  const upd = (i:number, k:keyof LinkEntry, v:string) => onChange(entries.map((e,idx)=>idx===i?{...e,[k]:v}:e))
  const del = (i:number) => onChange(entries.filter((_,idx)=>idx!==i))

  return (
    <div>
      {entries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No links added yet.</p>}
      {entries.map((link, i) => (
        <EntryCard key={link.id} onDelete={()=>del(i)} canDelete={entries.length > 1}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" value={link.label} onChange={v=>upd(i,'label',v)} placeholder="Portfolio" />
            <Field label="URL" value={link.url} onChange={v=>upd(i,'url',v)} placeholder="https://myportfolio.com" />
          </div>
        </EntryCard>
      ))}
      <AddBtn label="Add Link" onClick={()=>onChange([...entries, blankLink()])} />
    </div>
  )
}

// ─── Resume Preview ───────────────────────────────────────────

function ResumePreview({ data }: { data: ResumeData }) {
  const enabledSections = data.sections.filter(s => s.enabled)
  const h = data.header
  const contactLine = [h.email, h.phone, h.location].filter(Boolean).join(' · ')
  const linksLine = [h.website, h.linkedin, h.github].filter(Boolean).join(' · ')

  if (data.template === 'modern') return <ModernTemplate data={data} enabledSections={enabledSections} contactLine={contactLine} linksLine={linksLine} />
  if (data.template === 'classic') return <ClassicTemplate data={data} enabledSections={enabledSections} contactLine={contactLine} linksLine={linksLine} />
  return <MinimalTemplate data={data} enabledSections={enabledSections} contactLine={contactLine} linksLine={linksLine} />
}

interface TplProps {
  data: ResumeData
  enabledSections: SectionMeta[]
  contactLine: string
  linksLine: string
}

function SectionBody({ sectionId, data }: { sectionId: SectionId; data: ResumeData }) {
  if (sectionId === 'experience') {
    return (
      <>
        {data.experience.filter(e=>e.company||e.role).map(exp => (
          <div key={exp.id} style={{marginBottom:'10px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <strong style={{fontSize:'13px'}}>{exp.role || 'Role'}</strong>
              <span style={{fontSize:'11px',color:'#666'}}>{exp.start}{exp.start&&(exp.current?'–Present':exp.end?`–${exp.end}`:'')}</span>
            </div>
            <div style={{fontSize:'12px',color:'#555',marginBottom:'4px'}}>{exp.company}{exp.location?` · ${exp.location}`:''}</div>
            {exp.bullets.filter(Boolean).length > 0 && (
              <ul style={{paddingLeft:'16px',margin:'0'}}>
                {exp.bullets.filter(Boolean).map((b,i)=><li key={i} style={{fontSize:'12px',marginBottom:'2px'}}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'education') {
    return (
      <>
        {data.education.filter(e=>e.school).map(edu => (
          <div key={edu.id} style={{marginBottom:'8px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <strong style={{fontSize:'13px'}}>{edu.degree}{edu.field?` in ${edu.field}`:''}</strong>
              <span style={{fontSize:'11px',color:'#666'}}>{edu.start}{edu.start&&edu.end?`–${edu.end}`:edu.end}</span>
            </div>
            <div style={{fontSize:'12px',color:'#555'}}>{edu.school}{edu.gpa?` · GPA: ${edu.gpa}`:''}{edu.honors?` · ${edu.honors}`:''}</div>
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'skills') {
    return (
      <>
        {data.skills.filter(g=>g.skills).map(g => (
          <div key={g.id} style={{marginBottom:'5px',fontSize:'12px'}}>
            {g.category && <strong style={{fontSize:'12px'}}>{g.category}: </strong>}
            <span style={{color:'#333'}}>{g.skills}</span>
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'projects') {
    return (
      <>
        {data.projects.filter(p=>p.name).map(proj => (
          <div key={proj.id} style={{marginBottom:'10px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <strong style={{fontSize:'13px'}}>{proj.name}</strong>
              {proj.url && <span style={{fontSize:'11px',color:'#4a6cf7'}}>{proj.url.replace(/^https?:\/\//,'')}</span>}
            </div>
            {proj.tech && <div style={{fontSize:'11px',color:'#666',marginBottom:'3px'}}>{proj.tech}</div>}
            {proj.bullets.filter(Boolean).length > 0 && (
              <ul style={{paddingLeft:'16px',margin:'0'}}>
                {proj.bullets.filter(Boolean).map((b,i)=><li key={i} style={{fontSize:'12px',marginBottom:'2px'}}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'certifications') {
    return (
      <>
        {data.certifications.filter(c=>c.name).map(cert => (
          <div key={cert.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'5px',fontSize:'12px'}}>
            <span><strong>{cert.name}</strong>{cert.issuer?` · ${cert.issuer}`:''}</span>
            <span style={{color:'#666'}}>{cert.date}</span>
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'languages') {
    return (
      <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
        {data.languages.filter(l=>l.language).map(lang => (
          <span key={lang.id} style={{fontSize:'12px'}}>
            <strong>{lang.language}</strong> <span style={{color:'#666'}}>({lang.proficiency})</span>
          </span>
        ))}
      </div>
    )
  }
  if (sectionId === 'awards') {
    return (
      <>
        {data.awards.filter(a=>a.title).map(award => (
          <div key={award.id} style={{marginBottom:'6px'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px'}}>
              <strong>{award.title}</strong>
              <span style={{color:'#666'}}>{award.issuer}{award.date?` · ${award.date}`:''}</span>
            </div>
            {award.description && <p style={{fontSize:'11px',color:'#555',margin:'2px 0 0'}}>{award.description}</p>}
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'volunteering') {
    return (
      <>
        {data.volunteering.filter(v=>v.org).map(vol => (
          <div key={vol.id} style={{marginBottom:'8px'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <strong style={{fontSize:'13px'}}>{vol.role}</strong>
              <span style={{fontSize:'11px',color:'#666'}}>{vol.start}{vol.start&&vol.end?`–${vol.end}`:vol.end}</span>
            </div>
            <div style={{fontSize:'12px',color:'#555',marginBottom:'3px'}}>{vol.org}</div>
            {vol.description && <p style={{fontSize:'12px'}}>{vol.description}</p>}
          </div>
        ))}
      </>
    )
  }
  if (sectionId === 'links') {
    return (
      <div style={{display:'flex',flexWrap:'wrap',gap:'8px 16px'}}>
        {data.links.filter(l=>l.url).map(link => (
          <span key={link.id} style={{fontSize:'12px',color:'#4a6cf7'}}>{link.label||link.url}</span>
        ))}
      </div>
    )
  }
  return null
}

function getSectionLabel(id: SectionId, sections: SectionMeta[]): string {
  return sections.find(s=>s.id===id)?.label || id
}

// ── Modern Template ───────────────────────────────────────────

function ModernTemplate({ data, enabledSections, contactLine, linksLine }: TplProps) {
  const h = data.header
  return (
    <div style={{fontFamily:'system-ui,sans-serif',color:'#1a1a2e',fontSize:'13px',lineHeight:'1.5',padding:'32px 36px',maxWidth:'780px',margin:'0 auto',background:'#fff'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',gap:'18px',marginBottom:'20px',borderBottom:'3px solid #4a6cf7',paddingBottom:'16px'}}>
        {h.photo && <img src={h.photo} alt="Profile" style={{width:'72px',height:'72px',borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'3px solid #4a6cf7'}} />}
        <div style={{flex:1}}>
          <h1 style={{fontSize:'26px',fontWeight:800,margin:'0 0 2px',color:'#1a1a2e',letterSpacing:'-0.5px'}}>{h.name||'Your Name'}</h1>
          {h.title && <div style={{fontSize:'14px',color:'#4a6cf7',fontWeight:600,marginBottom:'6px'}}>{h.title}</div>}
          {contactLine && <div style={{fontSize:'11px',color:'#555'}}>{contactLine}</div>}
          {linksLine && <div style={{fontSize:'11px',color:'#4a6cf7',marginTop:'2px'}}>{linksLine}</div>}
        </div>
      </div>
      {/* Summary */}
      {h.summary && (
        <div style={{marginBottom:'16px',fontSize:'12px',color:'#333',lineHeight:'1.6',borderLeft:'3px solid #4a6cf7',paddingLeft:'10px'}}>
          {h.summary}
        </div>
      )}
      {/* Sections */}
      {enabledSections.map(sec => (
        <div key={sec.id} style={{marginBottom:'16px'}}>
          <h2 style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:'#4a6cf7',margin:'0 0 8px',paddingBottom:'3px',borderBottom:'1px solid #e0e7ff'}}>
            {getSectionLabel(sec.id, data.sections)}
          </h2>
          <SectionBody sectionId={sec.id} data={data} />
        </div>
      ))}
    </div>
  )
}

// ── Classic Template ──────────────────────────────────────────

function ClassicTemplate({ data, enabledSections, contactLine, linksLine }: TplProps) {
  const h = data.header
  return (
    <div style={{fontFamily:'Georgia,serif',color:'#1a1a1a',fontSize:'13px',lineHeight:'1.6',padding:'36px 40px',maxWidth:'780px',margin:'0 auto',background:'#fff'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',gap:'18px',marginBottom:'16px',textAlign:h.photo?'left':'center'}}>
        {h.photo && <img src={h.photo} alt="Profile" style={{width:'72px',height:'72px',borderRadius:'4px',objectFit:'cover',flexShrink:0}} />}
        <div style={{flex:1,textAlign:h.photo?'left':'center'}}>
          <h1 style={{fontSize:'28px',fontWeight:700,margin:'0 0 4px',letterSpacing:'1px',textTransform:'uppercase'}}>{h.name||'Your Name'}</h1>
          {h.title && <div style={{fontSize:'13px',color:'#555',fontStyle:'italic',marginBottom:'6px'}}>{h.title}</div>}
          {contactLine && <div style={{fontSize:'11px',color:'#333'}}>{contactLine}</div>}
          {linksLine && <div style={{fontSize:'11px',color:'#333',marginTop:'2px'}}>{linksLine}</div>}
        </div>
      </div>
      <hr style={{border:'none',borderTop:'2px solid #1a1a1a',marginBottom:'16px'}} />
      {/* Summary */}
      {h.summary && (
        <div style={{marginBottom:'14px',fontSize:'12px',color:'#333',lineHeight:'1.6'}}>
          {h.summary}
        </div>
      )}
      {/* Sections */}
      {enabledSections.map(sec => (
        <div key={sec.id} style={{marginBottom:'14px'}}>
          <h2 style={{fontSize:'13px',fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',margin:'0 0 6px',paddingBottom:'3px',borderBottom:'1.5px solid #1a1a1a'}}>
            {getSectionLabel(sec.id, data.sections)}
          </h2>
          <SectionBody sectionId={sec.id} data={data} />
        </div>
      ))}
    </div>
  )
}

// ── Minimal Template ──────────────────────────────────────────

function MinimalTemplate({ data, enabledSections, contactLine, linksLine }: TplProps) {
  const h = data.header
  return (
    <div style={{fontFamily:'"DM Sans",system-ui,sans-serif',color:'#111',fontSize:'12.5px',lineHeight:'1.6',padding:'40px 44px',maxWidth:'780px',margin:'0 auto',background:'#fff'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',gap:'18px',marginBottom:'24px'}}>
        {h.photo && <img src={h.photo} alt="Profile" style={{width:'68px',height:'68px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} />}
        <div>
          <h1 style={{fontSize:'30px',fontWeight:300,margin:'0',letterSpacing:'-1px',color:'#111'}}>{h.name||'Your Name'}</h1>
          {h.title && <div style={{fontSize:'13px',color:'#666',marginTop:'2px'}}>{h.title}</div>}
          <div style={{display:'flex',flexWrap:'wrap',gap:'0 12px',marginTop:'6px'}}>
            {contactLine && <span style={{fontSize:'11px',color:'#888'}}>{contactLine}</span>}
            {linksLine && <span style={{fontSize:'11px',color:'#888'}}>{linksLine}</span>}
          </div>
        </div>
      </div>
      {/* Summary */}
      {h.summary && (
        <div style={{marginBottom:'20px',fontSize:'12px',color:'#444',lineHeight:'1.7',maxWidth:'600px'}}>
          {h.summary}
        </div>
      )}
      {/* Sections */}
      {enabledSections.map(sec => (
        <div key={sec.id} style={{marginBottom:'18px',display:'grid',gridTemplateColumns:'120px 1fr',gap:'0 20px'}}>
          <div style={{paddingTop:'1px'}}>
            <h2 style={{fontSize:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'1.5px',color:'#999',margin:'0'}}>{getSectionLabel(sec.id, data.sections)}</h2>
          </div>
          <div style={{borderLeft:'1px solid #e5e5e5',paddingLeft:'16px'}}>
            <SectionBody sectionId={sec.id} data={data} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Section Card (editor) ────────────────────────────────────

function SectionCard({ section, data, setData, children }: {
  section: SectionMeta
  data: ResumeData
  setData: (d: ResumeData) => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(section.enabled)
  const toggleEnabled = () => {
    const updated = data.sections.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s)
    setData({ ...data, sections: updated })
  }

  return (
    <div className={`bg-white rounded-2xl border ${section.enabled ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-60'} overflow-hidden`}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none" onClick={() => setOpen(o=>!o)}>
        <span className="text-lg">{section.icon}</span>
        <span className="font-semibold text-gray-800 flex-1 text-sm">{section.label}</span>
        <label className="relative inline-flex items-center cursor-pointer" onClick={e=>e.stopPropagation()}>
          <input type="checkbox" checked={section.enabled} onChange={toggleEnabled} className="sr-only peer" />
          <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
        </label>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && section.enabled && (
        <div className="px-5 pb-5 border-t border-gray-100">{children}</div>
      )}
      {open && !section.enabled && (
        <div className="px-5 pb-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center py-2">Toggle on to include this section in your resume.</p>
        </div>
      )}
    </div>
  )
}

// ─── Template Gallery ─────────────────────────────────────────

const TEMPLATE_GALLERY = [
  {
    category: 'Professional',
    icon: '💼',
    desc: 'Ideal for corporate, management, and business roles',
    templates: [
      { id: 'modern', name: 'Modern Pro', accent: '#4a6cf7', layout: 'left-bar', tags: ['Corporate', 'Tech', 'Finance'] },
      { id: 'classic', name: 'Classic', accent: '#1a1a1a', layout: 'top-bar', tags: ['Traditional', 'Law', 'Banking'] },
      { id: 'modern', name: 'Navy Pro', accent: '#1e3a8a', layout: 'left-bar', tags: ['Consulting', 'Strategy'] },
      { id: 'modern', name: 'Teal Pro', accent: '#0d9488', layout: 'sidebar', tags: ['Healthcare', 'Science'] },
      { id: 'classic', name: 'Steel', accent: '#475569', layout: 'top-bar', tags: ['Engineering', 'Operations'] },
      { id: 'classic', name: 'Burgundy', accent: '#9f1239', layout: 'top-bar', tags: ['Legal', 'Government'] },
      { id: 'modern', name: 'Forest', accent: '#166534', layout: 'left-bar', tags: ['Non-profit', 'Education'] },
      { id: 'modern', name: 'Slate Pro', accent: '#334155', layout: 'left-bar', tags: ['IT', 'Consulting'] },
      { id: 'classic', name: 'Oxford', accent: '#1e1b4b', layout: 'top-bar', tags: ['Academia', 'Research'] },
      { id: 'modern', name: 'Sapphire', accent: '#1d4ed8', layout: 'sidebar', tags: ['Sales', 'Marketing'] },
    ],
  },
  {
    category: 'Creative',
    icon: '🎨',
    desc: 'Bold designs for creative, design, and media roles',
    templates: [
      { id: 'modern', name: 'Violet', accent: '#7c3aed', layout: 'sidebar', tags: ['Design', 'UX', 'Agency'] },
      { id: 'modern', name: 'Rose', accent: '#be185d', layout: 'left-bar', tags: ['Fashion', 'Marketing'] },
      { id: 'modern', name: 'Coral', accent: '#ea580c', layout: 'sidebar', tags: ['Advertising', 'PR'] },
      { id: 'modern', name: 'Fuchsia', accent: '#a21caf', layout: 'left-bar', tags: ['Social Media', 'Content'] },
      { id: 'modern', name: 'Amber', accent: '#b45309', layout: 'top-bar', tags: ['Photography', 'Film'] },
      { id: 'modern', name: 'Indigo', accent: '#4338ca', layout: 'sidebar', tags: ['Branding', 'Art Direction'] },
      { id: 'modern', name: 'Emerald', accent: '#059669', layout: 'left-bar', tags: ['Sustainability', 'Eco'] },
      { id: 'modern', name: 'Crimson', accent: '#dc2626', layout: 'sidebar', tags: ['Gaming', 'Entertainment'] },
      { id: 'minimal', name: 'Canvas', accent: '#92400e', layout: 'minimal', tags: ['Illustration', 'Art'] },
      { id: 'modern', name: 'Plum', accent: '#6b21a8', layout: 'left-bar', tags: ['Music', 'Theatre'] },
    ],
  },
  {
    category: 'Tech & Developer',
    icon: '💻',
    desc: 'Clean structured layouts for engineers and developers',
    templates: [
      { id: 'minimal', name: 'Code Dark', accent: '#1e293b', layout: 'minimal', tags: ['Backend', 'Systems'] },
      { id: 'modern', name: 'Dev Blue', accent: '#0284c7', layout: 'left-bar', tags: ['Frontend', 'Fullstack'] },
      { id: 'minimal', name: 'Terminal', accent: '#14532d', layout: 'minimal', tags: ['DevOps', 'SRE'] },
      { id: 'modern', name: 'GitHub', accent: '#24292e', layout: 'sidebar', tags: ['Open Source', 'SWE'] },
      { id: 'minimal', name: 'Mono', accent: '#374151', layout: 'minimal', tags: ['Data Science', 'ML'] },
      { id: 'modern', name: 'Cyan Tech', accent: '#0891b2', layout: 'left-bar', tags: ['Cloud', 'AWS', 'Azure'] },
      { id: 'modern', name: 'Purple Dev', accent: '#6d28d9', layout: 'sidebar', tags: ['AI', 'Research'] },
      { id: 'minimal', name: 'Zero', accent: '#111827', layout: 'minimal', tags: ['Minimalist', 'Senior'] },
      { id: 'modern', name: 'Stack', accent: '#0f766e', layout: 'left-bar', tags: ['Mobile', 'iOS', 'Android'] },
      { id: 'modern', name: 'API', accent: '#1e40af', layout: 'left-bar', tags: ['Backend', 'API Design'] },
    ],
  },
  {
    category: 'Executive & Leadership',
    icon: '🏆',
    desc: 'Premium designs for senior and C-suite professionals',
    templates: [
      { id: 'classic', name: 'C-Suite', accent: '#1a1a1a', layout: 'top-bar', tags: ['CEO', 'CTO', 'COO'] },
      { id: 'classic', name: 'Director', accent: '#1e3a8a', layout: 'top-bar', tags: ['VP', 'Director'] },
      { id: 'classic', name: 'Gold', accent: '#92400e', layout: 'top-bar', tags: ['Consulting', 'Advisory'] },
      { id: 'modern', name: 'Prestige', accent: '#1e1b4b', layout: 'left-bar', tags: ['Board', 'Governance'] },
      { id: 'classic', name: 'Graphite', accent: '#374151', layout: 'top-bar', tags: ['Operations', 'Transformation'] },
      { id: 'classic', name: 'Charcoal', accent: '#292524', layout: 'top-bar', tags: ['Private Equity', 'VC'] },
      { id: 'modern', name: 'Onyx', accent: '#0f172a', layout: 'sidebar', tags: ['Investment Banking'] },
      { id: 'classic', name: 'Cobalt', accent: '#1d4ed8', layout: 'top-bar', tags: ['Tech Leadership'] },
      { id: 'classic', name: 'Emerald Exec', accent: '#064e3b', layout: 'top-bar', tags: ['Sustainability', 'ESG'] },
      { id: 'modern', name: 'Presidential', accent: '#b45309', layout: 'left-bar', tags: ['Founder', 'Entrepreneur'] },
    ],
  },
  {
    category: 'Academic & Research',
    icon: '🎓',
    desc: 'Clean academic formats for scholars and researchers',
    templates: [
      { id: 'classic', name: 'Scholar', accent: '#1e3a8a', layout: 'top-bar', tags: ['PhD', 'Postdoc', 'Faculty'] },
      { id: 'minimal', name: 'Academic', accent: '#374151', layout: 'minimal', tags: ['Research', 'Publications'] },
      { id: 'classic', name: 'Ivory', accent: '#292524', layout: 'top-bar', tags: ['Humanities', 'Social Sciences'] },
      { id: 'classic', name: 'STEM', accent: '#065f46', layout: 'top-bar', tags: ['Science', 'Engineering'] },
      { id: 'minimal', name: 'CV Classic', accent: '#1a1a2e', layout: 'minimal', tags: ['Academic CV', 'Long-form'] },
      { id: 'classic', name: 'Parchment', accent: '#78350f', layout: 'top-bar', tags: ['History', 'Philosophy'] },
      { id: 'modern', name: 'Lab', accent: '#0369a1', layout: 'left-bar', tags: ['Chemistry', 'Biology', 'Physics'] },
      { id: 'minimal', name: 'Thesis', accent: '#1f2937', layout: 'minimal', tags: ['Graduate', 'Masters'] },
      { id: 'classic', name: 'Institute', accent: '#7f1d1d', layout: 'top-bar', tags: ['Medical School', 'Law School'] },
      { id: 'modern', name: 'Grant', accent: '#4338ca', layout: 'left-bar', tags: ['Grant Writing', 'Proposal'] },
    ],
  },
  {
    category: 'Healthcare & Medical',
    icon: '🏥',
    desc: 'Professional medical and healthcare templates',
    templates: [
      { id: 'modern', name: 'Medical Blue', accent: '#0284c7', layout: 'left-bar', tags: ['Doctor', 'Physician'] },
      { id: 'classic', name: 'Clinical', accent: '#1e3a8a', layout: 'top-bar', tags: ['Nurse', 'Nursing'] },
      { id: 'minimal', name: 'Care', accent: '#065f46', layout: 'minimal', tags: ['Allied Health', 'Therapy'] },
      { id: 'modern', name: 'Pulse', accent: '#be123c', layout: 'left-bar', tags: ['Emergency', 'Surgeon'] },
      { id: 'classic', name: 'White Coat', accent: '#374151', layout: 'top-bar', tags: ['Specialist', 'Consultant'] },
      { id: 'modern', name: 'Teal Health', accent: '#0f766e', layout: 'sidebar', tags: ['Pharmacy', 'Biotech'] },
      { id: 'minimal', name: 'Wellness', accent: '#166534', layout: 'minimal', tags: ['Mental Health', 'Counselling'] },
      { id: 'modern', name: 'Dent', accent: '#0369a1', layout: 'left-bar', tags: ['Dentistry', 'Dental'] },
      { id: 'classic', name: 'Research MD', accent: '#1a1a1a', layout: 'top-bar', tags: ['Clinical Research', 'Trials'] },
      { id: 'modern', name: 'Vet', accent: '#92400e', layout: 'left-bar', tags: ['Veterinary', 'Animal Health'] },
    ],
  },
  {
    category: 'Legal & Finance',
    icon: '⚖️',
    desc: 'Authoritative formats for legal and financial professionals',
    templates: [
      { id: 'classic', name: 'Counsel', accent: '#1a1a1a', layout: 'top-bar', tags: ['Lawyer', 'Attorney'] },
      { id: 'classic', name: 'Barrister', accent: '#7f1d1d', layout: 'top-bar', tags: ['Barrister', 'Solicitor'] },
      { id: 'modern', name: 'Ledger', accent: '#1e3a8a', layout: 'left-bar', tags: ['Accountant', 'CPA'] },
      { id: 'classic', name: 'Banker', accent: '#292524', layout: 'top-bar', tags: ['Investment Banking', 'IB'] },
      { id: 'modern', name: 'Analyst', accent: '#0369a1', layout: 'sidebar', tags: ['Financial Analyst', 'FP&A'] },
      { id: 'classic', name: 'Auditor', accent: '#374151', layout: 'top-bar', tags: ['Auditor', 'Risk', 'Compliance'] },
      { id: 'modern', name: 'Forex', accent: '#065f46', layout: 'left-bar', tags: ['Trader', 'Quant', 'Hedge Fund'] },
      { id: 'classic', name: 'Arbitrage', accent: '#78350f', layout: 'top-bar', tags: ['M&A', 'Corporate Finance'] },
      { id: 'minimal', name: 'Clean Law', accent: '#1e1b4b', layout: 'minimal', tags: ['In-house Counsel'] },
      { id: 'classic', name: 'Estate', accent: '#1a1a1a', layout: 'top-bar', tags: ['Tax', 'Estate Planning'] },
    ],
  },
  {
    category: 'Minimal & Clean',
    icon: '✨',
    desc: 'Distraction-free minimal designs that let content shine',
    templates: [
      { id: 'minimal', name: 'Pure', accent: '#374151', layout: 'minimal', tags: ['Any industry'] },
      { id: 'minimal', name: 'Ghost', accent: '#6b7280', layout: 'minimal', tags: ['Freelance', 'Consultant'] },
      { id: 'minimal', name: 'Paper', accent: '#292524', layout: 'minimal', tags: ['Traditional', 'Classic'] },
      { id: 'minimal', name: 'Space', accent: '#0f172a', layout: 'minimal', tags: ['Tech', 'Startup'] },
      { id: 'minimal', name: 'Nordic', accent: '#1e3a8a', layout: 'minimal', tags: ['Scandinavian', 'Clean'] },
      { id: 'minimal', name: 'Stone', accent: '#44403c', layout: 'minimal', tags: ['Architecture', 'Design'] },
      { id: 'minimal', name: 'Ash', accent: '#374151', layout: 'minimal', tags: ['Operations', 'Admin'] },
      { id: 'minimal', name: 'Cotton', accent: '#1f2937', layout: 'minimal', tags: ['Academic', 'Research'] },
      { id: 'minimal', name: 'Birch', accent: '#92400e', layout: 'minimal', tags: ['Non-profit', 'Education'] },
      { id: 'minimal', name: 'Linen', accent: '#6b7280', layout: 'minimal', tags: ['HR', 'Recruiting'] },
    ],
  },
  {
    category: 'Sales & Marketing',
    icon: '📊',
    desc: 'Conversion-focused designs for growth professionals',
    templates: [
      { id: 'modern', name: 'Growth', accent: '#0284c7', layout: 'left-bar', tags: ['Sales', 'BDR', 'AE'] },
      { id: 'modern', name: 'Pitch', accent: '#7c3aed', layout: 'sidebar', tags: ['Marketing', 'Brand'] },
      { id: 'modern', name: 'Revenue', accent: '#059669', layout: 'left-bar', tags: ['Revenue Ops', 'CRO'] },
      { id: 'modern', name: 'Campaign', accent: '#dc2626', layout: 'sidebar', tags: ['Digital Marketing', 'PPC'] },
      { id: 'modern', name: 'Funnel', accent: '#ea580c', layout: 'left-bar', tags: ['Performance', 'Growth Hack'] },
      { id: 'modern', name: 'Content', accent: '#be185d', layout: 'sidebar', tags: ['Content Marketing', 'SEO'] },
      { id: 'modern', name: 'Engage', accent: '#0891b2', layout: 'left-bar', tags: ['Customer Success', 'CS'] },
      { id: 'modern', name: 'Social', accent: '#6d28d9', layout: 'sidebar', tags: ['Social Media', 'Influencer'] },
      { id: 'classic', name: 'Account', accent: '#1e3a8a', layout: 'top-bar', tags: ['Account Management', 'KAM'] },
      { id: 'modern', name: 'eComm', accent: '#b45309', layout: 'left-bar', tags: ['eCommerce', 'D2C'] },
    ],
  },
  {
    category: 'Entry Level & Graduate',
    icon: '🚀',
    desc: 'Fresh designs perfect for new graduates and career starters',
    templates: [
      { id: 'modern', name: 'Launch', accent: '#0284c7', layout: 'left-bar', tags: ['Graduate', 'Entry Level'] },
      { id: 'modern', name: 'Starter', accent: '#7c3aed', layout: 'sidebar', tags: ['Internship', 'Junior'] },
      { id: 'modern', name: 'Campus', accent: '#059669', layout: 'left-bar', tags: ['University', 'College'] },
      { id: 'modern', name: 'Fresh', accent: '#ea580c', layout: 'sidebar', tags: ['Career Change', 'Switch'] },
      { id: 'minimal', name: 'First', accent: '#374151', layout: 'minimal', tags: ['First Job', 'Apprentice'] },
      { id: 'modern', name: 'Boost', accent: '#0891b2', layout: 'left-bar', tags: ['Bootcamp', 'Self-taught'] },
      { id: 'modern', name: 'Spring', accent: '#065f46', layout: 'sidebar', tags: ['Graduate Scheme'] },
      { id: 'modern', name: 'Edge', accent: '#be185d', layout: 'left-bar', tags: ['Part-time', 'Contract'] },
      { id: 'classic', name: 'Graduate', accent: '#1e3a8a', layout: 'top-bar', tags: ['Honours Degree', 'Masters'] },
      { id: 'modern', name: 'Ambition', accent: '#6d28d9', layout: 'sidebar', tags: ['MBA', 'Business School'] },
    ],
  },
]

interface GalleryTemplate {
  id: Template; name: string; accent: string; layout: string; tags: string[]
}

function TemplateGallery({ onSelect, onContinue, hasSavedData }: {
  onSelect: (t: Template, accent: string, name: string) => void
  onContinue: () => void
  hasSavedData: boolean
}) {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-900 text-sm">Resume Builder — Choose a Template</h1>
          <span className="ml-auto text-xs text-gray-400">100 templates · 10 categories</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">

        {/* Continue existing banner */}
        {hasSavedData && (
          <div className="mb-6 flex items-center justify-between bg-indigo-600 text-white rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <div className="font-bold text-sm">You have a saved resume</div>
                <div className="text-indigo-200 text-xs">Continue editing where you left off, or pick a new template below</div>
              </div>
            </div>
            <button onClick={onContinue}
              className="flex-shrink-0 bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
              Continue My Resume →
            </button>
          </div>
        )}

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-sm text-indigo-700 font-medium mb-4">
            📋 100 Professional Templates · 10 Categories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Choose Your Template</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Pick a template that matches your industry and style. Every template is fully editable — change sections, content, and layout once inside the builder.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TEMPLATE_GALLERY.map((cat, i) => (
            <button key={cat.category} onClick={() => setActiveCategory(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all border ${
                activeCategory === i
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}>
              <span>{cat.icon}</span> {cat.category}
            </button>
          ))}
        </div>

        {/* Active category */}
        {TEMPLATE_GALLERY.map((cat, catIdx) => catIdx === activeCategory && (
          <div key={cat.category}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-900">{cat.icon} {cat.category} Templates</h3>
              <p className="text-sm text-gray-500 mt-0.5">{cat.desc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {cat.templates.map((tpl, tplIdx) => (
                <button key={tplIdx} onClick={() => onSelect(tpl.id as Template, tpl.accent, tpl.name)}
                  className="group text-left bg-white border-2 border-gray-200 hover:border-indigo-400 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  {/* Template visual preview */}
                  <div className="relative h-36 bg-white overflow-hidden">
                    {/* Header bar */}
                    <div style={{ background: tpl.accent }} className="px-3 py-2">
                      <div className="w-16 h-1.5 bg-white/70 rounded mb-1" />
                      <div className="w-10 h-1 bg-white/40 rounded" />
                    </div>
                    {/* Body preview */}
                    <div className="px-3 py-2 space-y-1.5">
                      {tpl.layout === 'sidebar' ? (
                        <div className="flex gap-2">
                          <div className="w-1/3 space-y-1">
                            <div className="h-1 bg-gray-200 rounded w-full" />
                            <div className="h-1 bg-gray-200 rounded w-3/4" />
                            <div className="h-1 bg-gray-200 rounded w-4/5" />
                            <div className="mt-1 h-0.5 rounded" style={{ background: tpl.accent, opacity: 0.4 }} />
                            <div className="h-1 bg-gray-200 rounded w-full mt-1" />
                            <div className="h-1 bg-gray-200 rounded w-2/3" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="h-1 bg-gray-300 rounded w-1/2" />
                            <div className="h-1 bg-gray-200 rounded w-full" />
                            <div className="h-1 bg-gray-200 rounded w-4/5" />
                            <div className="h-1 bg-gray-200 rounded w-full mt-2" />
                            <div className="h-1 bg-gray-200 rounded w-3/4" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="h-1 rounded w-1/3 mb-1" style={{ background: tpl.accent, opacity: 0.6 }} />
                          <div className="h-1 bg-gray-200 rounded w-full" />
                          <div className="h-1 bg-gray-200 rounded w-4/5" />
                          <div className="h-1 bg-gray-200 rounded w-full mt-1" />
                          <div className="h-1 rounded w-1/3 mt-2 mb-1" style={{ background: tpl.accent, opacity: 0.6 }} />
                          <div className="h-1 bg-gray-200 rounded w-full" />
                          <div className="h-1 bg-gray-200 rounded w-3/4" />
                        </>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Use Template
                      </div>
                    </div>
                  </div>
                  {/* Card footer */}
                  <div className="px-3 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: tpl.accent }} />
                      <span className="font-semibold text-xs text-gray-800">{tpl.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tpl.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom options */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {/* Start from scratch */}
          <button
            onClick={() => onSelect('modern', '#4a6cf7', 'Blank')}
            className="flex items-center gap-4 p-5 bg-white border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-2xl transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
              ✏️
            </div>
            <div>
              <div className="font-bold text-gray-800 text-sm">Start from Scratch</div>
              <div className="text-xs text-gray-500 mt-0.5">Begin with a blank resume — fill in every field yourself</div>
            </div>
          </button>

          {/* Continue existing (only shown when saved data exists) */}
          {hasSavedData ? (
            <button
              onClick={onContinue}
              className="flex items-center gap-4 p-5 bg-indigo-50 border-2 border-indigo-300 hover:border-indigo-500 rounded-2xl transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                📋
              </div>
              <div>
                <div className="font-bold text-indigo-800 text-sm">Continue My Existing Resume</div>
                <div className="text-xs text-indigo-600 mt-0.5">Pick up where you left off — your data is saved</div>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-4 p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-left opacity-60">
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">📂</div>
              <div>
                <div className="font-bold text-gray-600 text-sm">No Saved Resume</div>
                <div className="text-xs text-gray-400 mt-0.5">Your resume will be auto-saved as you build it</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(getInitial)
  const [showGallery, setShowGallery] = useState(true)
  const hasSavedData = typeof window !== 'undefined' && !!localStorage.getItem('roughtools_resume_v2')
  const [activeTab, setActiveTab] = useState<'edit'|'preview'>('edit')
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string,boolean>>({})
  const previewRef = useRef<HTMLDivElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null)

  const update = useCallback((next: ResumeData) => {
    setData(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem('roughtools_resume_v2', JSON.stringify(next)) } catch { /* ignore */ }
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 600)
  }, [])

  const updHeader = (k: keyof Header, v: string) => update({ ...data, header: { ...data.header, [k]: v } })

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updHeader('photo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const errs: Record<string,boolean> = {}
    if (!data.header.name.trim()) errs.name = true
    if (!data.header.email.trim()) errs.email = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePrint = () => {
    if (!validate()) { alert('Please fill in your name and email before downloading.'); return }
    const content = previewRef.current?.innerHTML || ''
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>${data.header.name} — Resume</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      @page{size:A4;margin:0;}
      @media print{body{width:210mm;}}
    </style></head><body>${content}</body></html>`)
    win.document.close()
    win.onload = () => { win.print(); win.close() }
  }

  const clearAll = () => {
    if (!confirm('Clear all resume data and start fresh?')) return
    const fresh: ResumeData = {
      header: { name:'', title:'', email:'', phone:'', location:'', website:'', linkedin:'', github:'', summary:'', photo:'' },
      sections: DEFAULT_SECTIONS,
      experience: [blankExp()], education: [blankEdu()], skills: [blankSkill()],
      projects: [blankProj()], certifications: [blankCert()], languages: [blankLang()],
      awards: [blankAward()], volunteering: [blankVol()], links: [blankLink()],
      template: 'modern',
    }
    update(fresh)
    localStorage.removeItem('roughtools_resume_v2')
  }

  const enabledCount = data.sections.filter(s=>s.enabled).length

  // Show gallery on first load
  if (showGallery) {
    return (
      <TemplateGallery
        hasSavedData={hasSavedData}
        onSelect={(templateId, _accent, _name) => {
          update({ ...data, template: templateId })
          setShowGallery(false)
        }}
        onContinue={() => setShowGallery(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-900 text-sm">Resume Builder</h1>

          {/* Template switcher */}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowGallery(true)}
              className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-full font-semibold transition-colors hidden sm:flex items-center gap-1">
              🎨 Browse Templates
            </button>
            <span className="text-xs text-gray-500 hidden sm:block">Quick:</span>
            {(['modern','classic','minimal'] as Template[]).map(t => (
              <button key={t} onClick={() => update({ ...data, template: t })}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${data.template===t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {/* Auto-save indicator */}
          <div className={`text-xs transition-opacity ${saved ? 'opacity-100 text-green-600' : 'opacity-0'}`}>
            ✓ Saved
          </div>

          {/* Print */}
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span className="hidden sm:block">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex">
          {(['edit','preview'] as const).map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab===tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
              {tab === 'edit' ? '✏️ Edit' : '👁️ Preview'}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1400px] mx-auto flex h-[calc(100vh-56px)]">

        {/* ── Editor Panel ── */}
        <div className={`${activeTab==='preview' ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[480px] flex-shrink-0 overflow-y-auto`}>
          <div className="p-4 space-y-4">

            {/* Header: Personal Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">👤</span>
                <h2 className="font-semibold text-gray-800 text-sm">Personal Information</h2>
              </div>

              {/* Photo upload */}
              <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                {data.header.photo
                  ? <img src={data.header.photo} alt="Profile" className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-indigo-200" />
                  : <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400 text-xl">👤</div>
                }
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Profile Photo (optional)</p>
                  <p className="text-xs text-gray-400 mb-2">Shown in header only. Use a professional headshot.</p>
                  <div className="flex gap-2">
                    <label className="text-xs bg-indigo-50 text-indigo-700 font-medium px-3 py-1 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                      Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                    </label>
                    {data.header.photo && (
                      <button onClick={() => updHeader('photo','')} className="text-xs text-red-500 hover:underline">Remove</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Field label="Full Name" value={data.header.name} onChange={v=>updHeader('name',v)}
                    placeholder="Alex Johnson" required hasError={errors.name} />
                </div>
                <div className="col-span-2">
                  <Field label="Professional Title / Headline" value={data.header.title} onChange={v=>updHeader('title',v)}
                    placeholder="Senior Software Engineer" />
                </div>
                <Field label="Email" value={data.header.email} onChange={v=>updHeader('email',v)}
                  placeholder="alex@email.com" type="email" required hasError={errors.email} />
                <Field label="Phone" value={data.header.phone} onChange={v=>updHeader('phone',v)} placeholder="+1 555 000 0000" />
                <Field label="Location" value={data.header.location} onChange={v=>updHeader('location',v)} placeholder="New York, NY" />
                <Field label="Website" value={data.header.website} onChange={v=>updHeader('website',v)} placeholder="mysite.com" />
                <Field label="LinkedIn" value={data.header.linkedin} onChange={v=>updHeader('linkedin',v)} placeholder="linkedin.com/in/alex" />
                <Field label="GitHub" value={data.header.github} onChange={v=>updHeader('github',v)} placeholder="github.com/alex" />
                <div className="col-span-2">
                  <TextareaField label="Professional Summary" value={data.header.summary} onChange={v=>updHeader('summary',v)}
                    placeholder="Results-driven engineer with 5+ years building scalable web applications. Passionate about clean code and great user experiences." rows={3} />
                </div>
              </div>
            </div>

            {/* Dynamic sections */}
            {data.sections.map(sec => (
              <SectionCard key={sec.id} section={sec} data={data} setData={update}>
                <div className="pt-4">
                  {sec.id === 'experience'     && <ExperienceEditor entries={data.experience} onChange={v=>update({...data,experience:v})} />}
                  {sec.id === 'education'      && <EducationEditor entries={data.education} onChange={v=>update({...data,education:v})} />}
                  {sec.id === 'skills'         && <SkillsEditor groups={data.skills} onChange={v=>update({...data,skills:v})} />}
                  {sec.id === 'projects'       && <ProjectsEditor entries={data.projects} onChange={v=>update({...data,projects:v})} />}
                  {sec.id === 'certifications' && <CertificationsEditor entries={data.certifications} onChange={v=>update({...data,certifications:v})} />}
                  {sec.id === 'languages'      && <LanguagesEditor entries={data.languages} onChange={v=>update({...data,languages:v})} />}
                  {sec.id === 'awards'         && <AwardsEditor entries={data.awards} onChange={v=>update({...data,awards:v})} />}
                  {sec.id === 'volunteering'   && <VolunteeringEditor entries={data.volunteering} onChange={v=>update({...data,volunteering:v})} />}
                  {sec.id === 'links'          && <LinksEditor entries={data.links} onChange={v=>update({...data,links:v})} />}
                </div>
              </SectionCard>
            ))}

            {/* Section summary + clear */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-1 pb-2">
              <span>{enabledCount} of {data.sections.length} sections enabled</span>
              <button onClick={clearAll} className="hover:text-red-500 transition-colors">Clear all & restart</button>
            </div>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div className={`${activeTab==='edit' ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-gray-200 overflow-y-auto`}>
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">Live Preview</span>
              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full capitalize">{data.template}</span>
            </div>
            <button onClick={handlePrint}
              className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Print / PDF
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white shadow-xl rounded-sm mx-auto" style={{maxWidth:'780px',minHeight:'1050px'}}>
              <div ref={previewRef}>
                <ResumePreview data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
