'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'
import ToolAdUnit from '@/components/ToolAdUnit'

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box' }
const TEXTAREA: CSSProperties = { ...INPUT as object, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' } as CSSProperties
const BTN: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const BTN_PRIMARY: CSSProperties = { ...BTN as object, background: 'var(--brand-2)', border: 'none', color: '#fff' } as CSSProperties
const SECTION_HDR: CSSProperties = { fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--line-strong)' }
const GRID2: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

function Field({ label, value, onChange, placeholder, type = 'text', hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; hint?: string }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={INPUT} />
      {hint && <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 3 }}>{hint}</div>}
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={INPUT}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: 'var(--brand-2)', width: 15, height: 15 }} />
      {label}
    </label>
  )
}

function buildEmployment(f: {
  company: string; companyAddress: string
  employee: string; employeeAddress: string
  title: string; department: string
  employmentType: string; workLocation: string; workAddress: string
  startDate: string; endDate: string; isAtWill: boolean
  salary: string; payPeriod: string; bonus: string
  probationMonths: string
  ptodays: string; sickDays: string; holidays: string
  benefits: string[]
  duties: string; reportsTo: string
  nonCompete: boolean; nonCompeteDuration: string; nonCompeteScope: string
  ipAssignment: boolean; confidentiality: boolean
  noticePeriod: string; state: string
}): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const benefitMap: Record<string, string> = {
    health: 'Health insurance', dental: 'Dental insurance', vision: 'Vision insurance',
    '401k': '401(k) retirement plan', pto: 'Paid time off', life: 'Life insurance',
    disability: 'Short/long-term disability', equity: 'Equity / stock options',
  }
  const benefitsList = f.benefits.map(b => benefitMap[b] || b)

  return `EMPLOYMENT AGREEMENT

This Employment Agreement (this "Agreement") is entered into as of ${date} by and between:

EMPLOYER:
${f.company || '[COMPANY NAME]'}${f.companyAddress ? '\n' + f.companyAddress : ''}

EMPLOYEE:
${f.employee || '[EMPLOYEE NAME]'}${f.employeeAddress ? '\n' + f.employeeAddress : ''}

ARTICLE 1: POSITION AND DUTIES

1.1 Position. Employer hereby employs Employee in the position of ${f.title || '[JOB TITLE]'}${f.department ? `, ${f.department} Department` : ''}, commencing on ${f.startDate || '[START DATE]'}.

1.2 Reporting. Employee shall report to ${f.reportsTo || 'the direct supervisor or manager designated by Employer'}.

1.3 Primary Duties. Employee's primary duties and responsibilities shall include:
${f.duties
  ? f.duties.split('\n').filter(d => d.trim()).map(d => `   • ${d.trim()}`).join('\n')
  : '   • Perform all duties associated with the above position\n   • Meet performance standards and KPIs as established by Employer\n   • Represent Employer professionally at all times\n   • Collaborate with team members and stakeholders'}

1.4 Work Location. Employee's primary work location shall be ${f.workLocation === 'remote' ? 'remote (home office)' : f.workLocation === 'hybrid' ? `hybrid — ${f.workAddress || '[OFFICE ADDRESS]'} and remote` : f.workAddress || '[OFFICE ADDRESS]'}.

1.5 Devotion of Time. Employee agrees to devote their full professional time and attention to the performance of duties hereunder${f.employmentType === 'Part-time' ? ', consistent with a part-time schedule as agreed' : ''}.

ARTICLE 2: EMPLOYMENT TERM
${f.isAtWill
  ? `\n2.1 At-Will Employment. Employee's employment is at-will. Either party may terminate this Agreement at any time, with or without cause, subject to the notice requirements in Article 7.\n`
  : `\n2.1 Term. The term of this Agreement shall commence on ${f.startDate || '[START DATE]'} and continue through ${f.endDate || '[END DATE]'} (the "Initial Term"), unless earlier terminated in accordance with Article 7. After the Initial Term, employment shall continue on an at-will basis.\n`}
2.2 Employment Classification. Employee is classified as ${f.employmentType || 'Full-time'}, ${f.employmentType === 'Exempt' ? 'exempt from' : 'non-exempt and entitled to'} overtime pay under applicable law.

${parseInt(f.probationMonths) > 0 ? `2.3 Probationary Period. Employee's first ${f.probationMonths} month${parseInt(f.probationMonths) > 1 ? 's' : ''} shall be a probationary period during which Employer may evaluate Employee's performance. During this period, either party may terminate employment with 5 business days' notice.` : ''}

ARTICLE 3: COMPENSATION

3.1 Base Salary. In consideration for services rendered, Employer shall pay Employee a base ${f.employmentType === 'Part-time' ? 'wage' : 'salary'} of ${f.salary ? '$' + parseInt(f.salary).toLocaleString() + ' per year' : '$[AMOUNT] per year'}, payable ${f.payPeriod || 'bi-weekly'} in accordance with Employer's standard payroll practices, less required deductions and withholdings.
${f.bonus ? `\n3.2 Performance Bonus. Employee may be eligible for a performance-based bonus of up to ${f.bonus}, subject to achievement of performance goals established by Employer. Bonus payments are discretionary and do not constitute a guaranteed component of compensation.\n` : ''}
3.3 Overtime. ${f.employmentType === 'Exempt' ? 'As an exempt employee, Employee is not entitled to overtime pay.' : 'Employee shall be compensated for overtime hours at the applicable rate required by law.'}

ARTICLE 4: BENEFITS
${benefitsList.length > 0
  ? `\n4.1 Employee Benefits. Employee shall be eligible to participate in the following benefit programs, subject to applicable plan terms and eligibility requirements:\n${benefitsList.map(b => `   • ${b}`).join('\n')}`
  : `\n4.1 Employee Benefits. Employee shall be eligible for company benefits as described in the Employee Handbook, subject to plan terms and eligibility requirements.`}
${parseInt(f.ptodays) > 0 || parseInt(f.sickDays) > 0 || parseInt(f.holidays) > 0 ? `
4.2 Paid Leave.
${parseInt(f.ptodays) > 0 ? `   • Paid Time Off (PTO): ${f.ptodays} days per calendar year\n` : ''}${parseInt(f.sickDays) > 0 ? `   • Sick Leave: ${f.sickDays} days per calendar year\n` : ''}${parseInt(f.holidays) > 0 ? `   • Company Holidays: ${f.holidays} paid holidays per year\n` : ''}   PTO accrues in accordance with Employer's current policy and must be approved in advance. Unused PTO handling is governed by applicable state law.` : ''}

ARTICLE 5: WORK STANDARDS

5.1 Work Hours. Standard work hours are ${f.employmentType === 'Part-time' ? 'as agreed and scheduled' : 'Monday through Friday, approximately 40 hours per week'}. Employer may require reasonable additional hours as business needs dictate.

5.2 Workplace Policies. Employee agrees to comply with all of Employer's current and future workplace policies, procedures, and codes of conduct, including those in the Employee Handbook, as amended from time to time.

5.3 Performance Standards. Employee shall perform all duties to the best of their abilities and in accordance with applicable professional standards. Employer will conduct periodic performance reviews.

ARTICLE 6: CONFIDENTIALITY AND PROPRIETARY RIGHTS
${f.confidentiality ? `
6.1 Confidentiality. During and after employment, Employee shall not disclose or use any Confidential Information of Employer. "Confidential Information" includes all non-public business information, trade secrets, customer lists, financial data, proprietary technology, and similar information. Employee shall take reasonable precautions to prevent unauthorized disclosure.
` : ''}${f.ipAssignment ? `
6.2 Intellectual Property Assignment. All inventions, works of authorship, developments, improvements, and discoveries ("Work Product") created by Employee during the term of employment and within the scope of employment shall be the exclusive property of Employer. Employee hereby assigns and agrees to assign to Employer all right, title, and interest in any such Work Product.
` : ''}
6.3 Return of Property. Upon termination of employment, Employee shall promptly return all Employer property, including equipment, documents, and electronically stored information.
${f.nonCompete ? `
ARTICLE 7: RESTRICTIVE COVENANTS

7.1 Non-Compete. During employment and for ${f.nonCompeteDuration || '12 months'} following termination, Employee agrees not to engage in, own, manage, operate, or participate in any business that directly competes with Employer in ${f.nonCompeteScope || 'the same geographic market'}. Employee acknowledges this restriction is reasonable and necessary.

Note: Non-compete enforceability varies by state. This clause may be unenforceable in California, North Dakota, Minnesota, Oklahoma, and other states with restrictions.

7.2 Non-Solicitation. For ${f.nonCompeteDuration || '12 months'} following termination, Employee agrees not to solicit, recruit, or hire any employee of Employer, nor solicit any current customer of Employer that Employee had contact with during employment.` : ''}

ARTICLE ${f.nonCompete ? '8' : '7'}: TERMINATION

${f.nonCompete ? '8' : '7'}.1 Notice. ${f.isAtWill ? `Either party may terminate this Agreement at any time upon ${f.noticePeriod || '2 weeks'} written notice. Employer may terminate immediately for cause.` : `Either party may terminate this Agreement before the end of the Initial Term by providing ${f.noticePeriod || '30 days'} written notice.`}

${f.nonCompete ? '8' : '7'}.2 Cause. Employer may terminate Employee immediately without notice or severance for cause, including but not limited to: material breach of this Agreement, gross misconduct, insubordination, fraud, or violation of applicable law.

${f.nonCompete ? '8' : '7'}.3 Final Pay. Upon termination, Employee shall receive all earned but unpaid wages through the final day of work, in accordance with applicable state law.

ARTICLE ${f.nonCompete ? '9' : '8'}: GENERAL PROVISIONS

${f.nonCompete ? '9' : '8'}.1 Governing Law. This Agreement shall be governed by the laws of the State of ${f.state || '[STATE]'}, without regard to conflict of law provisions.

${f.nonCompete ? '9' : '8'}.2 Entire Agreement. This Agreement constitutes the entire agreement between the parties and supersedes all prior understandings, representations, and negotiations.

${f.nonCompete ? '9' : '8'}.3 Amendments. This Agreement may be amended only by a written instrument signed by both parties.

${f.nonCompete ? '9' : '8'}.4 Severability. If any provision is found unenforceable, the remaining provisions remain in full force.

${f.nonCompete ? '9' : '8'}.5 Counterparts. This Agreement may be executed in counterparts; electronic signatures are valid.

IN WITNESS WHEREOF, the parties have executed this Employment Agreement as of the date first written above.

EMPLOYER:

Signature: _________________________________
Name: ${f.company || '________________________________'}
Title: _________________________________
Date: _________________________________


EMPLOYEE:

Signature: _________________________________
Name: ${f.employee || '________________________________'}
Date: _________________________________`
}

export default function EmploymentClient() {
  const today = new Date().toISOString().split('T')[0]

  const [company, setCompany] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [employee, setEmployee] = useState('')
  const [employeeAddress, setEmployeeAddress] = useState('')
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [employmentType, setEmploymentType] = useState('Full-time')
  const [workLocation, setWorkLocation] = useState('office')
  const [workAddress, setWorkAddress] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [isAtWill, setIsAtWill] = useState(true)
  const [salary, setSalary] = useState('')
  const [payPeriod, setPayPeriod] = useState('bi-weekly')
  const [bonus, setBonus] = useState('')
  const [probationMonths, setProbationMonths] = useState('3')
  const [ptodays, setPtodays] = useState('15')
  const [sickDays, setSickDays] = useState('5')
  const [holidays, setHolidays] = useState('10')
  const [benefits, setBenefits] = useState<string[]>(['health', 'dental', '401k', 'pto'])
  const [duties, setDuties] = useState('')
  const [reportsTo, setReportsTo] = useState('')
  const [nonCompete, setNonCompete] = useState(false)
  const [nonCompeteDuration, setNonCompeteDuration] = useState('12 months')
  const [nonCompeteScope, setNonCompeteScope] = useState('')
  const [ipAssignment, setIpAssignment] = useState(true)
  const [confidentiality, setConfidentiality] = useState(true)
  const [noticePeriod, setNoticePeriod] = useState('2 weeks')
  const [state, setState] = useState('California')
  const [copied, setCopied] = useState(false)

  const benefitOptions = [
    { id: 'health', label: 'Health insurance' }, { id: 'dental', label: 'Dental' },
    { id: 'vision', label: 'Vision' }, { id: '401k', label: '401(k)' },
    { id: 'pto', label: 'Paid time off' }, { id: 'life', label: 'Life insurance' },
    { id: 'disability', label: 'Disability' }, { id: 'equity', label: 'Equity / options' },
  ]
  const toggleBenefit = (id: string) => setBenefits(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const docText = useMemo(() => buildEmployment({
    company, companyAddress, employee, employeeAddress, title, department,
    employmentType, workLocation, workAddress, startDate, endDate, isAtWill,
    salary, payPeriod, bonus, probationMonths, ptodays, sickDays, holidays, benefits,
    duties, reportsTo, nonCompete, nonCompeteDuration, nonCompeteScope,
    ipAssignment, confidentiality, noticePeriod, state,
  }), [company, companyAddress, employee, employeeAddress, title, department, employmentType, workLocation, workAddress, startDate, endDate, isAtWill, salary, payPeriod, bonus, probationMonths, ptodays, sickDays, holidays, benefits, duties, reportsTo, nonCompete, nonCompeteDuration, nonCompeteScope, ipAssignment, confidentiality, noticePeriod, state])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Employment Agreement - ${employee || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const stateOptions = [{ value: '', label: 'Select State' }, ...US_STATES.map(s => ({ value: s, label: s }))]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* LEFT: FORM */}
      <div>
        <div style={{ ...CARD, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: 12, color: 'var(--accent-text-b)', lineHeight: 1.6 }}>
            <strong>Legal Disclaimer:</strong> This is a template employment agreement. Employment laws vary by state. Consult an HR attorney before executing any employment contract.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Parties</div>
          <div style={{ marginBottom: 14, fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase' }}>Employer</div>
          <div style={GRID2}>
            <Field label="Company Name *" value={company} onChange={setCompany} placeholder="Acme Corp" />
            <Field label="Company Address" value={companyAddress} onChange={setCompanyAddress} placeholder="123 Main St, City, State" />
          </div>
          <div style={{ marginTop: 18, marginBottom: 14, fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase' }}>Employee</div>
          <div style={GRID2}>
            <Field label="Employee Full Name *" value={employee} onChange={setEmployee} placeholder="Jane Doe" />
            <Field label="Employee Address" value={employeeAddress} onChange={setEmployeeAddress} placeholder="456 Oak Ave, City, State" />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Position Details</div>
          <div style={GRID2}>
            <Field label="Job Title *" value={title} onChange={setTitle} placeholder="Software Engineer" />
            <Field label="Department" value={department} onChange={setDepartment} placeholder="Engineering" />
            <Field label="Reports To" value={reportsTo} onChange={setReportsTo} placeholder="VP of Engineering" />
            <Select label="Employment Type" value={employmentType} onChange={setEmploymentType} options={[
              { value: 'Full-time', label: 'Full-time' }, { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contractor' }, { value: 'Temporary', label: 'Temporary' },
              { value: 'Exempt', label: 'Full-time (Exempt/Salaried)' },
            ]} />
            <Select label="Work Location" value={workLocation} onChange={setWorkLocation} options={[
              { value: 'office', label: 'On-site / Office' },
              { value: 'remote', label: 'Fully Remote' },
              { value: 'hybrid', label: 'Hybrid' },
            ]} />
            {workLocation !== 'remote' && (
              <Field label="Office Address" value={workAddress} onChange={setWorkAddress} placeholder="100 Corporate Blvd, City, State" />
            )}
            <Field label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <Select label="Employment Term" value={isAtWill ? 'atwill' : 'fixed'} onChange={v => setIsAtWill(v === 'atwill')} options={[
              { value: 'atwill', label: 'At-will (no fixed end date)' },
              { value: 'fixed', label: 'Fixed-term contract' },
            ]} />
            {!isAtWill && <Field label="End Date" value={endDate} onChange={setEndDate} type="date" />}
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={LABEL}>Primary Duties (one per line)</label>
            <textarea style={TEXTAREA} value={duties} onChange={e => setDuties(e.target.value)}
              placeholder={'Design and develop software features\nParticipate in code reviews\nCollaborate with cross-functional teams'} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Compensation</div>
          <div style={GRID2}>
            <Field label="Annual Salary ($)" value={salary} onChange={setSalary} placeholder="85000" type="number" />
            <Select label="Pay Frequency" value={payPeriod} onChange={setPayPeriod} options={[
              { value: 'bi-weekly', label: 'Bi-weekly (26x/yr)' },
              { value: 'semi-monthly', label: 'Semi-monthly (24x/yr)' },
              { value: 'monthly', label: 'Monthly (12x/yr)' },
              { value: 'weekly', label: 'Weekly (52x/yr)' },
            ]} />
            <Field label="Bonus Potential" value={bonus} onChange={setBonus} placeholder="10% of annual salary" hint="Leave blank to exclude bonus clause" />
            <Select label="Probationary Period" value={probationMonths} onChange={setProbationMonths} options={[
              { value: '0', label: 'No probationary period' },
              { value: '1', label: '1 month' }, { value: '3', label: '3 months' },
              { value: '6', label: '6 months' },
            ]} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 4: Benefits & Leave</div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benefits Package</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 8, marginBottom: 16 }}>
            {benefitOptions.map(opt => (
              <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
                <input type="checkbox" checked={benefits.includes(opt.id)} onChange={() => toggleBenefit(opt.id)} style={{ accentColor: 'var(--brand-2)', width: 15, height: 15 }} />
                {opt.label}
              </label>
            ))}
          </div>
          <div style={GRID2}>
            <Field label="PTO Days / Year" value={ptodays} onChange={setPtodays} placeholder="15" type="number" />
            <Field label="Sick Days / Year" value={sickDays} onChange={setSickDays} placeholder="5" type="number" />
            <Field label="Paid Holidays / Year" value={holidays} onChange={setHolidays} placeholder="10" type="number" />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 5: Restrictive Covenants</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            <Checkbox label="Confidentiality clause (recommended)" checked={confidentiality} onChange={setConfidentiality} />
            <Checkbox label="IP assignment clause (recommended)" checked={ipAssignment} onChange={setIpAssignment} />
            <Checkbox label="Non-compete clause" checked={nonCompete} onChange={setNonCompete} />
            {nonCompete && (
              <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Select label="Non-compete Duration" value={nonCompeteDuration} onChange={setNonCompeteDuration} options={[
                  { value: '6 months', label: '6 months' }, { value: '12 months', label: '12 months' },
                  { value: '18 months', label: '18 months' }, { value: '24 months', label: '2 years' },
                ]} />
                <Field label="Geographic Scope" value={nonCompeteScope} onChange={setNonCompeteScope}
                  placeholder="United States" hint="Non-competes are unenforceable in CA, ND, MN, OK and other states" />
              </div>
            )}
          </div>
          <div style={GRID2}>
            <Select label="Notice Period for Termination" value={noticePeriod} onChange={setNoticePeriod} options={[
              { value: '1 week', label: '1 week' }, { value: '2 weeks', label: '2 weeks (standard)' },
              { value: '30 days', label: '30 days' }, { value: '60 days', label: '60 days' },
            ]} />
            <Select label="Governing State" value={state} onChange={setState} options={stateOptions} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleCopy} style={BTN_PRIMARY}>{copied ? '✓ Copied!' : '📋 Copy Full Text'}</button>
          <button onClick={handlePrint} style={BTN}>🖨 Print / Download PDF</button>
        </div>
      </div>

      {/* RIGHT: PREVIEW */}
      <div style={{ position: 'sticky', top: 20 }}>
        <div style={{ ...CARD, background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Document Preview</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Employment Agreement</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {company || '[Company]'} → {employee || '[Employee]'} · {title || '[Title]'}
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Key Terms</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Position', value: title || 'Not set' },
              { label: 'Type', value: employmentType },
              { label: 'Location', value: workLocation === 'office' ? 'On-site' : workLocation === 'remote' ? 'Remote' : 'Hybrid' },
              { label: 'Salary', value: salary ? `$${parseInt(salary).toLocaleString()}/yr` : 'Not set' },
              { label: 'Start Date', value: startDate || 'Not set' },
              { label: 'Benefits', value: benefits.length > 0 ? `${benefits.length} included` : 'None' },
              { label: 'PTO', value: ptodays ? `${ptodays} days/yr` : 'Not set' },
              { label: 'Non-compete', value: nonCompete ? `Yes (${nonCompeteDuration})` : 'No' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--fg-3)' }}>{row.label}</span>
                <span style={{ color: 'var(--fg-2)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderRadius: 4, overflow: 'hidden', maxHeight: 560, overflowY: 'auto' }}>
          <div style={{ background: 'white', color: '#000', padding: '50px 60px', fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: '11pt', whiteSpace: 'pre-wrap', maxWidth: 800, margin: '0 auto' }}>
            {docText}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <ToolAdUnit position="middle" />
        </div>
      </div>
    </div>
  )
}
