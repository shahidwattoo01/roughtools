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

function buildWill(f: {
  name: string; dob: string; address: string; state: string
  maritalStatus: string; executorName: string; executorRel: string
  successorExecutor: string
  beneficiaries: string; residuaryBeneficiary: string
  specificBequests: string
  hasMinorChildren: boolean; guardianName: string; guardianRel: string; successorGuardian: string
  digitalAssets: boolean; digitalExecutor: string
  healthcareDirective: boolean; healthcareAgent: string; healthcareWishes: string
  funeralPreferences: string
  noContest: boolean; debtPayment: boolean
  signingDate: string
}): string {
  const date = f.signingDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const nameUpper = (f.name || '[TESTATOR NAME]').toUpperCase()

  return `LAST WILL AND TESTAMENT OF ${nameUpper}

I, ${f.name || '[YOUR FULL LEGAL NAME]'}${f.dob ? ', born ' + f.dob : ''}${f.address ? ', residing at ' + f.address : ''}, ${f.state ? 'County of [COUNTY], State of ' + f.state + ',' : ''} being of sound and disposing mind, memory, and understanding, and not acting under duress, menace, fraud, or undue influence of any person, do hereby make, publish, and declare this instrument to be my Last Will and Testament, and I hereby revoke all former wills, codicils, and testamentary dispositions previously made by me.

ARTICLE I — DECLARATION OF TESTATOR

I declare that I am of legal age (at least 18 years of age), of sound mind, and fully competent to make this Last Will and Testament. I make this Will freely, voluntarily, and with a clear understanding of its provisions and the nature of my estate.${f.maritalStatus ? '\n\nI am currently ' + f.maritalStatus + '.' : ''}

ARTICLE II — PAYMENT OF DEBTS AND EXPENSES

I direct my Executor to pay, as soon as practicable after my death from my estate, all of my legally enforceable debts, final medical and hospital expenses, costs of my last illness, and all expenses of administering my estate, including any estate or inheritance taxes legally due from my estate.${f.debtPayment ? ' I direct that all secured debts (mortgages, car loans) be paid in full from my estate before distribution to beneficiaries.' : ''}

ARTICLE III — APPOINTMENT OF EXECUTOR

3.1 Executor. I hereby appoint ${f.executorName || '[EXECUTOR NAME]'}${f.executorRel ? ' (' + f.executorRel + ')' : ''} as the Executor of this Will ("Executor"). If ${f.executorName || 'this person'} is unable or unwilling to serve, I appoint ${f.successorExecutor || '[SUCCESSOR EXECUTOR NAME]'} as successor Executor.

3.2 Powers of Executor. My Executor shall have full power and authority, without court approval, to:
   (a) Collect, manage, and preserve all assets of my estate
   (b) Pay all valid debts, expenses, and taxes from my estate
   (c) Sell, mortgage, or otherwise dispose of estate property as needed
   (d) Invest estate funds as a prudent investor would
   (e) Distribute assets to beneficiaries as directed in this Will
   (f) File all required tax returns and pay all taxes
   (g) Take all other actions necessary to administer my estate efficiently

3.3 Executor Compensation. My Executor shall be entitled to reasonable compensation for services rendered, as permitted by applicable state law.

3.4 Bond. No bond shall be required of my Executor.

ARTICLE IV — DISPOSITION OF ESTATE

4.1 Specific Bequests. I give, devise, and bequeath the following specific items:
${f.specificBequests
  ? f.specificBequests.split('\n').filter(l => l.trim()).map(l => '   • ' + l.trim()).join('\n')
  : '   [No specific bequests — all property passes under the residuary clause below]'}

4.2 Distribution of Residuary Estate. I give, devise, and bequeath all of the rest, residue, and remainder of my estate, both real and personal, of whatever kind and wherever situated, to:
${f.beneficiaries
  ? f.beneficiaries.split('\n').filter(l => l.trim()).map(l => '   • ' + l.trim()).join('\n')
  : '   [BENEFICIARIES AND THEIR SHARES TO BE LISTED HERE]'}

4.3 Residuary Beneficiary. If any beneficiary listed above predeceases me or fails to survive me by 30 days, their share shall pass to ${f.residuaryBeneficiary || '[RESIDUARY BENEFICIARY — e.g., "to the surviving beneficiaries in equal shares"]'}.

4.4 Lapse. If any specific bequest fails for any reason, it shall fall into the residuary estate.
${f.hasMinorChildren ? `
ARTICLE V — GUARDIAN FOR MINOR CHILDREN

5.1 Appointment of Guardian. If, at the time of my death, I have minor children (under 18 years of age), I hereby nominate and appoint ${f.guardianName || '[GUARDIAN NAME]'}${f.guardianRel ? ' (' + f.guardianRel + ')' : ''} as guardian of the person and property of my minor children.

5.2 Successor Guardian. If ${f.guardianName || 'the above guardian'} is unable or unwilling to serve, I nominate ${f.successorGuardian || '[SUCCESSOR GUARDIAN]'} as successor guardian.

5.3 Guardian's Authority. My guardian shall have all powers necessary to care for, maintain, and educate my minor children in the manner to which they are accustomed, without court approval for day-to-day decisions.

5.4 Trust for Minor Beneficiaries. Any inheritance left to a beneficiary who is under 21 years of age at the time of distribution shall be held in trust by my Executor until such beneficiary reaches age 21, to be used for the beneficiary's health, education, maintenance, and support.
` : ''}${f.digitalAssets ? `
ARTICLE ${f.hasMinorChildren ? 'VI' : 'V'} — DIGITAL ASSETS

I give my Executor and${f.digitalExecutor ? ' digital executor ' + f.digitalExecutor + ' the' : ' the'} legal authority to access, manage, and distribute my digital assets, including but not limited to: social media accounts, email accounts, cryptocurrency and digital wallets, online financial accounts, domain names, websites, digital files, and other electronically stored property. I authorize my Executor to access these assets using any passwords, authentication methods, or account recovery tools available. My Executor shall follow my stated wishes regarding each digital asset, or if unstated, shall distribute, transfer, or close such accounts as my Executor deems appropriate.
` : ''}${f.healthcareDirective ? `
ARTICLE ${[f.hasMinorChildren, f.digitalAssets].filter(Boolean).length + 5} — HEALTHCARE DIRECTIVE

${f.healthcareAgent ? `I appoint ${f.healthcareAgent} as my healthcare agent and attorney-in-fact for healthcare decisions. My agent shall have the authority to make all healthcare decisions for me if I become incapacitated or unable to communicate my wishes.` : ''}${f.healthcareWishes ? `\n\nMy healthcare wishes include: ${f.healthcareWishes}` : `\n\nIn the event that I am terminally ill, in a persistent vegetative state, or otherwise unable to communicate my wishes, I direct that my healthcare agent and medical providers use their best judgment to provide comfort care and relieve pain, and I leave specific medical decisions to my healthcare agent consistent with my values and beliefs.`}
` : ''}${f.funeralPreferences ? `
ARTICLE ${[f.hasMinorChildren, f.digitalAssets, f.healthcareDirective].filter(Boolean).length + 5} — FUNERAL AND BURIAL PREFERENCES

I express (but do not legally require) the following preferences for my funeral and burial:
${f.funeralPreferences}
` : ''}
ARTICLE ${[f.hasMinorChildren, f.digitalAssets, f.healthcareDirective, !!f.funeralPreferences].filter(Boolean).length + 5} — GENERAL PROVISIONS

No-Contest Clause. ${f.noContest ? 'If any beneficiary named in this Will contests this Will or any of its provisions, or assists anyone else in doing so, that beneficiary shall forfeit any share they would otherwise receive under this Will, and such share shall pass as if that beneficiary had predeceased me.' : 'I encourage all beneficiaries to respect the terms of this Will.'}

Governing Law. This Will shall be construed and governed by the laws of the State of ${f.state || '[STATE]'}.

Severability. If any provision of this Will is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

IN WITNESS WHEREOF, I hereby subscribe my name to this, my Last Will and Testament, consisting of this and preceding pages, on ${date}.

Testator: ${f.name || '[YOUR NAME]'}
Signature: _________________________________ Date: __________________

────────────────────────────────────────────

ATTESTATION OF WITNESSES

We, the undersigned, being adults of legal age, do hereby certify and attest that:
(a) The above-named Testator signed this instrument as their Last Will and Testament in our joint presence;
(b) The Testator appeared to be of sound mind and was not acting under any duress or undue influence;
(c) Each of us signed as witnesses in the presence of the Testator and in each other's presence.

Witness 1:
Signature: _________________________________ Date: __________________
Printed Name: _______________________________________________________
Address: ____________________________________________________________

Witness 2:
Signature: _________________________________ Date: __________________
Printed Name: _______________________________________________________
Address: ____________________________________________________________

────────────────────────────────────────────

NOTARIZATION (Recommended — creates self-proving will)

State of ${f.state || '___________'}, County of ____________________

Before me, a Notary Public, duly commissioned and qualified in the above jurisdiction, personally appeared the Testator and the above witnesses, known to me, and acknowledged the execution of this instrument for the purposes expressed.

Notary Public: _________________________________ Date: __________________
Commission Expires: __________________________`
}

export default function WillClient() {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState('California')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [executorName, setExecutorName] = useState('')
  const [executorRel, setExecutorRel] = useState('')
  const [successorExecutor, setSuccessorExecutor] = useState('')
  const [beneficiaries, setBeneficiaries] = useState('')
  const [residuaryBeneficiary, setResiduaryBeneficiary] = useState('')
  const [specificBequests, setSpecificBequests] = useState('')
  const [hasMinorChildren, setHasMinorChildren] = useState(false)
  const [guardianName, setGuardianName] = useState('')
  const [guardianRel, setGuardianRel] = useState('')
  const [successorGuardian, setSuccessorGuardian] = useState('')
  const [digitalAssets, setDigitalAssets] = useState(false)
  const [digitalExecutor, setDigitalExecutor] = useState('')
  const [healthcareDirective, setHealthcareDirective] = useState(false)
  const [healthcareAgent, setHealthcareAgent] = useState('')
  const [healthcareWishes, setHealthcareWishes] = useState('')
  const [funeralPreferences, setFuneralPreferences] = useState('')
  const [noContest, setNoContest] = useState(true)
  const [debtPayment, setDebtPayment] = useState(false)
  const [signingDate, setSigningDate] = useState('')
  const [copied, setCopied] = useState(false)

  const docText = useMemo(() => buildWill({
    name, dob, address, state, maritalStatus, executorName, executorRel, successorExecutor,
    beneficiaries, residuaryBeneficiary, specificBequests,
    hasMinorChildren, guardianName, guardianRel, successorGuardian,
    digitalAssets, digitalExecutor, healthcareDirective, healthcareAgent, healthcareWishes,
    funeralPreferences, noContest, debtPayment, signingDate,
  }), [name, dob, address, state, maritalStatus, executorName, executorRel, successorExecutor, beneficiaries, residuaryBeneficiary, specificBequests, hasMinorChildren, guardianName, guardianRel, successorGuardian, digitalAssets, digitalExecutor, healthcareDirective, healthcareAgent, healthcareWishes, funeralPreferences, noContest, debtPayment, signingDate])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Last Will and Testament - ${name || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const stateOptions = US_STATES.map(s => ({ value: s, label: s }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* LEFT: FORM */}
      <div>
        <div style={{ ...CARD, background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.3)' }}>
          <div style={{ fontSize: 12, color: '#f87171', lineHeight: 1.6 }}>
            <strong>Critical Notice:</strong> A will must be signed in the presence of at least 2 witnesses and typically notarized to be legally valid. Requirements vary by state. This template is a starting point only — consult an estate attorney for your specific situation.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Testator (You)</div>
          <div style={GRID2}>
            <Field label="Your Full Legal Name *" value={name} onChange={setName} placeholder="John Michael Smith" />
            <Select label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} options={[
              { value: '', label: 'Prefer not to state' },
              { value: 'single', label: 'Single' },
              { value: 'married', label: 'Married' },
              { value: 'divorced', label: 'Divorced' },
              { value: 'widowed', label: 'Widowed' },
            ]} />
            <Field label="Date of Birth" value={dob} onChange={setDob} placeholder="January 1, 1970" />
            <Select label="State of Residence" value={state} onChange={setState} options={stateOptions} />
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Home Address" value={address} onChange={setAddress} placeholder="123 Main Street, City, State ZIP" />
            </div>
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Executor</div>
          <div style={GRID2}>
            <Field label="Executor Name *" value={executorName} onChange={setExecutorName} placeholder="Jane Doe" hint="Person responsible for carrying out your wishes" />
            <Field label="Relationship" value={executorRel} onChange={setExecutorRel} placeholder="e.g. spouse, sibling, friend" />
            <Field label="Successor Executor" value={successorExecutor} onChange={setSuccessorExecutor} placeholder="Backup executor if primary is unavailable" />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Estate Distribution</div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Beneficiaries & Shares (one per line)</label>
            <textarea style={{ ...TEXTAREA, minHeight: 100 } as CSSProperties} value={beneficiaries} onChange={e => setBeneficiaries(e.target.value)}
              placeholder={'50% to Jane Smith (spouse)\n25% to Tom Smith (son)\n25% to Amy Smith (daughter)'} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Field label="Residuary / Backup Beneficiary" value={residuaryBeneficiary} onChange={setResiduaryBeneficiary}
              placeholder="e.g. to the surviving beneficiaries in equal shares"
              hint="Who inherits if a named beneficiary predeceases you" />
          </div>
          <div>
            <label style={LABEL}>Specific Bequests (one per line)</label>
            <textarea style={TEXTAREA} value={specificBequests} onChange={e => setSpecificBequests(e.target.value)}
              placeholder={'My 2020 Honda Civic to Tom Smith\nMy jewelry collection to Amy Smith\n$10,000 to Charity ABC'} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 4: Children & Guardian</div>
          <div style={{ marginBottom: 12 }}>
            <Checkbox label="I have minor children (under 18)" checked={hasMinorChildren} onChange={setHasMinorChildren} />
          </div>
          {hasMinorChildren && (
            <div style={GRID2}>
              <Field label="Guardian Name *" value={guardianName} onChange={setGuardianName} placeholder="Guardian full name" />
              <Field label="Relationship" value={guardianRel} onChange={setGuardianRel} placeholder="e.g. aunt, uncle, family friend" />
              <Field label="Successor Guardian" value={successorGuardian} onChange={setSuccessorGuardian} placeholder="Backup guardian" />
            </div>
          )}
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 5: Additional Provisions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Checkbox label="Include digital assets clause (social media, crypto, online accounts)" checked={digitalAssets} onChange={setDigitalAssets} />
            {digitalAssets && (
              <div style={{ paddingLeft: 24 }}>
                <Field label="Digital Executor (optional)" value={digitalExecutor} onChange={setDigitalExecutor} placeholder="Person to manage digital accounts" />
              </div>
            )}
            <Checkbox label="Include healthcare directive / advance directive" checked={healthcareDirective} onChange={setHealthcareDirective} />
            {healthcareDirective && (
              <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Field label="Healthcare Agent" value={healthcareAgent} onChange={setHealthcareAgent} placeholder="Name of healthcare decision maker" />
                <label style={LABEL}>Healthcare Wishes (optional)</label>
                <textarea style={TEXTAREA} value={healthcareWishes} onChange={e => setHealthcareWishes(e.target.value)}
                  placeholder="e.g. I do not wish to be kept alive by artificial means if there is no reasonable chance of recovery" />
              </div>
            )}
            <Checkbox label="Include no-contest clause (forfeiture for contesting)" checked={noContest} onChange={setNoContest} />
            <Checkbox label="Direct payment of all secured debts before distribution" checked={debtPayment} onChange={setDebtPayment} />
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={LABEL}>Funeral & Burial Preferences (optional)</label>
            <textarea style={TEXTAREA} value={funeralPreferences} onChange={e => setFuneralPreferences(e.target.value)}
              placeholder={'I wish to be cremated and have my ashes scattered at sea.\nI prefer a simple, private ceremony with immediate family only.'} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Field label="Date of Signing" value={signingDate} onChange={setSigningDate} placeholder={today} />
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
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Last Will & Testament</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {name || '[Testator Name]'} · {state}
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Will Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Executor', value: executorName || '—' },
              { label: 'Successor Executor', value: successorExecutor || '—' },
              { label: 'Beneficiaries', value: beneficiaries ? `${beneficiaries.split('\n').filter(l => l.trim()).length} named` : '—' },
              { label: 'Guardian for Children', value: hasMinorChildren ? (guardianName || '—') : 'N/A' },
              { label: 'Digital Assets', value: digitalAssets ? 'Included' : 'Not included' },
              { label: 'Healthcare Directive', value: healthcareDirective ? 'Included' : 'Not included' },
              { label: 'No-Contest Clause', value: noContest ? 'Included' : 'Not included' },
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
