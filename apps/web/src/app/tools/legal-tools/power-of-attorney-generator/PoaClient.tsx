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

const POWERS_BY_TYPE: Record<string, { category: string; items: { id: string; label: string }[] }[]> = {
  General: [
    { category: 'Financial & Banking', items: [
      { id: 'banking', label: 'Manage bank accounts and conduct banking transactions' },
      { id: 'investments', label: 'Manage investments, stocks, bonds, and securities' },
      { id: 'bills', label: 'Pay bills, debts, and obligations' },
      { id: 'taxes', label: 'File tax returns and handle tax matters' },
    ]},
    { category: 'Real Estate & Property', items: [
      { id: 'real_estate', label: 'Buy, sell, mortgage, or manage real property' },
      { id: 'personal_property', label: 'Buy, sell, or manage personal property' },
      { id: 'leases', label: 'Execute, modify, or terminate leases' },
    ]},
    { category: 'Legal & Business', items: [
      { id: 'contracts', label: 'Enter into, modify, or terminate contracts' },
      { id: 'litigation', label: 'Institute and defend legal proceedings' },
      { id: 'business', label: 'Operate or manage any business interest' },
      { id: 'insurance', label: 'Manage insurance policies and make claims' },
      { id: 'retirement', label: 'Manage retirement accounts and benefits' },
    ]},
  ],
  Healthcare: [
    { category: 'Medical Decisions', items: [
      { id: 'medical_decisions', label: 'Make medical treatment decisions on my behalf' },
      { id: 'consent_treatment', label: 'Consent to or refuse any medical treatment, test, or procedure' },
      { id: 'surgery', label: 'Authorize surgical procedures and hospitalization' },
      { id: 'medication', label: 'Authorize medication and pain management' },
    ]},
    { category: 'Healthcare Administration', items: [
      { id: 'medical_records', label: 'Access all medical records and information (HIPAA authorization)' },
      { id: 'providers', label: 'Choose, change, and dismiss healthcare providers' },
      { id: 'facilities', label: 'Choose among home care, hospital, or care facility' },
      { id: 'end_of_life', label: 'Make end-of-life care decisions including withholding treatment' },
    ]},
  ],
  Financial: [
    { category: 'Banking & Accounts', items: [
      { id: 'banking', label: 'Open, manage, and close bank accounts' },
      { id: 'safe_deposit', label: 'Access safe deposit boxes' },
      { id: 'wire_transfers', label: 'Conduct wire transfers and electronic transactions' },
    ]},
    { category: 'Investments & Assets', items: [
      { id: 'investments', label: 'Buy, sell, and manage investment accounts and securities' },
      { id: 'retirement', label: 'Manage IRA, 401(k), and pension accounts' },
      { id: 'insurance', label: 'Manage insurance policies, pay premiums, collect proceeds' },
    ]},
    { category: 'Bills & Obligations', items: [
      { id: 'bills', label: 'Pay bills and satisfy financial obligations' },
      { id: 'taxes', label: 'File federal and state tax returns, pay taxes' },
      { id: 'debts', label: 'Negotiate and settle debts' },
    ]},
  ],
  Limited: [],
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: 'var(--brand-2)', width: 15, height: 15 }} />
      {label}
    </label>
  )
}

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

function buildPOA(f: {
  principal: string; principalAddress: string; principalDob: string; state: string
  agentName: string; agentAddress: string; agentRel: string
  successorAgent: string; successorAgentRel: string
  poaType: string; isDurable: boolean; isSpringing: string
  selectedPowers: string[]; customPowers: string; limitedPowers: string
  agentCompensation: string; effectiveDate: string; expiryDate: string
  witnessNotarization: boolean
}): string {
  const date = f.effectiveDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const powerGroups = POWERS_BY_TYPE[f.poaType] || []
  const selectedPowerLabels = powerGroups.flatMap(g => g.items).filter(i => f.selectedPowers.includes(i.id)).map(i => i.label)

  return `${f.poaType.toUpperCase()} POWER OF ATTORNEY
${f.isDurable ? '(DURABLE — Survives Incapacity)' : '(Standard — Terminates Upon Incapacity)'}

KNOW ALL PERSONS BY THESE PRESENTS:

I, ${f.principal || '[PRINCIPAL NAME]'}${f.principalDob ? ', born ' + f.principalDob : ''}${f.principalAddress ? ', residing at ' + f.principalAddress : ''}, State of ${f.state || '[STATE]'} ("Principal"), hereby grant a Power of Attorney to:

AGENT (ATTORNEY-IN-FACT):
${f.agentName || '[AGENT NAME]'}${f.agentAddress ? '\n' + f.agentAddress : ''}${f.agentRel ? '\nRelationship to Principal: ' + f.agentRel : ''}

SUCCESSOR AGENT (if primary Agent is unable or unwilling to serve):
${f.successorAgent || '[SUCCESSOR AGENT NAME]'}${f.successorAgentRel ? '\nRelationship to Principal: ' + f.successorAgentRel : ''}

ARTICLE 1: GRANT OF AUTHORITY

Subject to the terms and limitations set forth in this Power of Attorney, I hereby grant my Agent the authority to act on my behalf with respect to the following:
${f.poaType === 'Limited'
  ? (f.limitedPowers
    ? f.limitedPowers.split('\n').filter(l => l.trim()).map((l, i) => `   ${i + 1}. ${l.trim()}`).join('\n')
    : '   [DESCRIBE THE SPECIFIC LIMITED POWERS GRANTED]')
  : selectedPowerLabels.length > 0
    ? selectedPowerLabels.map((p, i) => `   ${i + 1}. ${p}`).join('\n')
    : powerGroups.flatMap(g => g.items).map((p, i) => `   ${i + 1}. ${p.label}`).join('\n')}${f.customPowers ? '\n\nAdditional powers specifically granted:\n' + f.customPowers.split('\n').filter(l => l.trim()).map(l => '   • ' + l.trim()).join('\n') : ''}

ARTICLE 2: DURABILITY
${f.isDurable
  ? `\nThis is a DURABLE Power of Attorney. This Power of Attorney shall NOT be affected by my subsequent disability, incapacity, or mental incompetence. This Power of Attorney is made under and pursuant to applicable state law authorizing durable powers of attorney.\n`
  : `\nThis Power of Attorney shall automatically terminate if I become disabled, incapacitated, or mentally incompetent.\n`}

ARTICLE 3: EFFECTIVE DATE AND TERM
${f.isSpringing === 'immediate'
  ? `\nThis Power of Attorney is effective immediately upon execution and shall remain in effect until ${f.expiryDate ? f.expiryDate : 'revoked by me in writing'}.`
  : `\nThis Power of Attorney shall become effective only upon a written determination by a licensed physician that I am unable to manage my own affairs ("Springing POA"). This Power of Attorney shall remain in effect until I regain capacity or this document is revoked.`}

ARTICLE 4: AGENT'S AUTHORITY AND LIMITATIONS

4.1 General Authority. My Agent may take any and all actions reasonably necessary to exercise the powers granted in Article 1, including executing documents, making payments, and entering into agreements.

4.2 Fiduciary Duty. My Agent shall act in a fiduciary capacity and in my best interests at all times. My Agent shall keep accurate records of all transactions and shall keep my property separate from the Agent's own property.

4.3 Limitations. My Agent is NOT authorized to:
   (a) Make or change a will or other testamentary disposition on my behalf
   (b) Make gifts to themselves or their family members, unless specifically authorized above
   (c) Appoint a successor agent, unless specifically authorized
   (d) Exercise powers in a manner inconsistent with applicable law

4.4 Multiple Agents. If I have appointed more than one Agent, each Agent may act independently unless this document expressly requires them to act jointly.

ARTICLE 5: AGENT COMPENSATION

My Agent shall ${f.agentCompensation === 'none' ? 'receive no compensation for services rendered under this Power of Attorney' : f.agentCompensation === 'reasonable' ? 'be entitled to reasonable compensation for services rendered, as permitted by applicable law' : f.agentCompensation || 'receive no compensation for services rendered'}.

ARTICLE 6: THIRD-PARTY RELIANCE

Any person, financial institution, or entity that relies on this Power of Attorney in good faith may act in reliance on it and may assume, without further inquiry, that this Power of Attorney is valid and in full force. A copy of this Power of Attorney shall be given the same effect as the original.

ARTICLE 7: REVOCATION

I reserve the right to revoke this Power of Attorney at any time and for any reason by delivering a written, signed, and notarized notice of revocation to my Agent. Revocation is not effective as to third parties until they receive actual notice of the revocation. This Power of Attorney automatically terminates upon my death.

ARTICLE 8: GOVERNING LAW

This Power of Attorney shall be governed by and construed in accordance with the laws of the State of ${f.state || '[STATE]'}, including all applicable statutes relating to powers of attorney.

IN WITNESS WHEREOF, I have signed and executed this Power of Attorney on ${date}.

PRINCIPAL:

Signature: _________________________________
Printed Name: ${f.principal || '________________________________'}
Date: _________________________________
${f.state ? 'State of ' + f.state : 'State of _______________'}

────────────────────────────────────────────

NOTARIZATION (Required in most states)

State of ${f.state || '_______________'}, County of ____________________

Before me, the undersigned, a Notary Public in and for the above jurisdiction, personally appeared ${f.principal || '[PRINCIPAL NAME]'}, personally known to me or proved to be the same through satisfactory evidence, and acknowledged that they signed and executed the foregoing instrument as their free and voluntary act for the purposes expressed.

Notary Public: _________________________________
Commission Expires: _________________________________
[NOTARY SEAL]

────────────────────────────────────────────

AGENT ACCEPTANCE (Recommended)

I, ${f.agentName || '[AGENT NAME]'}, accept the appointment as Agent under this Power of Attorney and agree to act in a fiduciary capacity and in the best interests of the Principal.

Agent Signature: _________________________________
Printed Name: ${f.agentName || '________________________________'}
Date: _________________________________`
}

export default function PoaClient() {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const [principal, setPrincipal] = useState('')
  const [principalAddress, setPrincipalAddress] = useState('')
  const [principalDob, setPrincipalDob] = useState('')
  const [state, setState] = useState('California')
  const [agentName, setAgentName] = useState('')
  const [agentAddress, setAgentAddress] = useState('')
  const [agentRel, setAgentRel] = useState('')
  const [successorAgent, setSuccessorAgent] = useState('')
  const [successorAgentRel, setSuccessorAgentRel] = useState('')
  const [poaType, setPoaType] = useState('General')
  const [isDurable, setIsDurable] = useState(true)
  const [isSpringing, setIsSpringing] = useState('immediate')
  const [selectedPowers, setSelectedPowers] = useState<string[]>(['banking', 'investments', 'bills', 'taxes', 'real_estate', 'insurance', 'retirement'])
  const [customPowers, setCustomPowers] = useState('')
  const [limitedPowers, setLimitedPowers] = useState('')
  const [agentCompensation, setAgentCompensation] = useState('none')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [witnessNotarization, _setWitnessNotarization] = useState(true)
  const [copied, setCopied] = useState(false)

  const togglePower = (id: string) => setSelectedPowers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const selectAll = (type: string) => {
    const allIds = (POWERS_BY_TYPE[type] || []).flatMap(g => g.items).map(i => i.id)
    setSelectedPowers(allIds)
  }

  const docText = useMemo(() => buildPOA({
    principal, principalAddress, principalDob, state,
    agentName, agentAddress, agentRel, successorAgent, successorAgentRel,
    poaType, isDurable, isSpringing,
    selectedPowers, customPowers, limitedPowers,
    agentCompensation, effectiveDate, expiryDate, witnessNotarization,
  }), [principal, principalAddress, principalDob, state, agentName, agentAddress, agentRel, successorAgent, successorAgentRel, poaType, isDurable, isSpringing, selectedPowers, customPowers, limitedPowers, agentCompensation, effectiveDate, expiryDate, witnessNotarization])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Power of Attorney - ${principal || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const stateOptions = US_STATES.map(s => ({ value: s, label: s }))
  const powerGroups = POWERS_BY_TYPE[poaType] || []

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* LEFT: FORM */}
      <div>
        <div style={{ ...CARD, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: 12, color: 'var(--accent-text-b)', lineHeight: 1.6 }}>
            <strong>Important:</strong> A Power of Attorney must be notarized in most states to be legally valid. Healthcare POAs typically require two witnesses. Consult a licensed attorney for your specific situation.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Principal (You)</div>
          <div style={GRID2}>
            <Field label="Your Full Legal Name *" value={principal} onChange={setPrincipal} placeholder="John Michael Smith" />
            <Field label="Date of Birth" value={principalDob} onChange={setPrincipalDob} placeholder="January 1, 1960" />
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Your Address" value={principalAddress} onChange={setPrincipalAddress} placeholder="123 Main Street, City, State ZIP" />
            </div>
            <Select label="State" value={state} onChange={setState} options={stateOptions} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Agent (Attorney-in-Fact)</div>
          <div style={GRID2}>
            <Field label="Agent Name *" value={agentName} onChange={setAgentName} placeholder="Jane Doe" hint="Person you are granting authority to" />
            <Field label="Relationship" value={agentRel} onChange={setAgentRel} placeholder="e.g. spouse, child, trusted friend" />
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Agent Address" value={agentAddress} onChange={setAgentAddress} placeholder="456 Oak Ave, City, State ZIP" />
            </div>
            <Field label="Successor Agent" value={successorAgent} onChange={setSuccessorAgent} placeholder="Backup agent name" hint="If primary agent is unavailable" />
            <Field label="Successor Relationship" value={successorAgentRel} onChange={setSuccessorAgentRel} placeholder="e.g. sibling, attorney" />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Type & Scope</div>
          <div style={GRID2}>
            <Select label="Type of Power of Attorney" value={poaType} onChange={v => { setPoaType(v); if (v !== 'Limited') selectAll(v) }} options={[
              { value: 'General', label: 'General (broad authority)' },
              { value: 'Healthcare', label: 'Healthcare / Medical only' },
              { value: 'Financial', label: 'Financial only' },
              { value: 'Limited', label: 'Limited (specific tasks)' },
            ]} />
            <Select label="Activation" value={isSpringing} onChange={setIsSpringing} options={[
              { value: 'immediate', label: 'Immediate (effective now)' },
              { value: 'springing', label: 'Springing (on incapacity only)' },
            ]} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Checkbox label={`Durable — survives my incapacity${isDurable ? ' (RECOMMENDED)' : ''}`} checked={isDurable} onChange={setIsDurable} />
          </div>
          {effectiveDate !== undefined && (
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} placeholder={today} />
              <Field label="Expiry Date (optional)" value={expiryDate} onChange={setExpiryDate} placeholder="Leave blank for indefinite" />
            </div>
          )}
        </div>

        {poaType === 'Limited' ? (
          <div style={CARD}>
            <div style={SECTION_HDR}>Powers Granted</div>
            <label style={LABEL}>Describe the specific authority granted (one per line)</label>
            <textarea style={{ ...TEXTAREA, minHeight: 120 } as CSSProperties} value={limitedPowers} onChange={e => setLimitedPowers(e.target.value)}
              placeholder={'Sell my 2020 Honda Civic (VIN: XXXXXXX) and deposit proceeds to my bank account\nSign lease renewal for my apartment at 123 Main St'} />
          </div>
        ) : (
          <div style={CARD}>
            <div style={SECTION_HDR}>Powers Granted</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Select the powers to grant your agent:</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => selectAll(poaType)} style={{ ...BTN, fontSize: 11, padding: '5px 10px' }}>Select All</button>
                <button onClick={() => setSelectedPowers([])} style={{ ...BTN, fontSize: 11, padding: '5px 10px' }}>Clear All</button>
              </div>
            </div>
            {powerGroups.map(group => (
              <div key={group.category} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{group.category}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 8 }}>
                  {group.items.map(item => (
                    <Checkbox key={item.id} label={item.label} checked={selectedPowers.includes(item.id)} onChange={() => togglePower(item.id)} />
                  ))}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <label style={LABEL}>Additional Custom Powers (optional)</label>
              <textarea style={TEXTAREA} value={customPowers} onChange={e => setCustomPowers(e.target.value)}
                placeholder="Describe any additional powers not listed above" />
            </div>
          </div>
        )}

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 4: Compensation & Details</div>
          <Select label="Agent Compensation" value={agentCompensation} onChange={setAgentCompensation} options={[
            { value: 'none', label: 'No compensation (volunteer)' },
            { value: 'reasonable', label: 'Reasonable compensation allowed' },
          ]} />
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
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Power of Attorney</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {poaType} · {isDurable ? 'Durable' : 'Non-Durable'} · {isSpringing === 'immediate' ? 'Immediate' : 'Springing'}
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>POA Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Principal', value: principal || '—' },
              { label: 'Agent', value: agentName || '—' },
              { label: 'Successor Agent', value: successorAgent || '—' },
              { label: 'Type', value: poaType },
              { label: 'Durable', value: isDurable ? 'Yes (survives incapacity)' : 'No' },
              { label: 'Activation', value: isSpringing === 'immediate' ? 'Immediate' : 'Springing (on incapacity)' },
              { label: 'Powers Granted', value: poaType === 'Limited' ? 'Custom (limited)' : `${selectedPowers.length} authorities` },
              { label: 'Governing State', value: state },
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
