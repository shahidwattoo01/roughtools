'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ──────────────────────────────────────────────────────────────
const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box' }
const TEXTAREA: CSSProperties = { ...INPUT as object, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' } as CSSProperties
const BTN: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const BTN_PRIMARY: CSSProperties = { ...BTN as object, background: 'var(--brand-2)', border: 'none', color: '#fff' } as CSSProperties
const SECTION_HDR: CSSProperties = { fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--line-strong)' }
const GRID2: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }

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
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: '#8b5cf6', width: 15, height: 15 }} />
      {label}
    </label>
  )
}

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

// ─── Document generator ────────────────────────────────────────────────────────
function buildNDA(f: {
  disclosingName: string; disclosingType: string; disclosingState: string
  receivingName: string; receivingType: string; receivingState: string
  ndaType: string; purpose: string; ciDefinition: string
  tradeSecrets: boolean; financials: boolean; technicalData: boolean; businessPlans: boolean
  duration: string; perpetualTradeSecrets: boolean
  govState: string; date: string
  nonSolicitation: boolean; nonCompete: boolean; nonCompeteDuration: string; nonCompeteScope: string
  liquidatedDamages: boolean; liquidatedAmount: string
}): string {
  const today = f.date || new Date().toISOString().split('T')[0]
  const discType = f.disclosingType === 'company' ? 'a company organized under the laws of' : 'an individual residing in'
  const recType = f.receivingType === 'company' ? 'a company organized under the laws of' : 'an individual residing in'
  const isMutual = f.ndaType === 'mutual'
  const termYears = parseInt(f.duration) || 2
  const ciExamples = [f.tradeSecrets && 'trade secrets', f.financials && 'financial data and projections', f.technicalData && 'technical data, processes, and know-how', f.businessPlans && 'business plans, strategies, and customer lists'].filter(Boolean).join(', ')

  return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (this "Agreement") is entered into as of ${today}, by and between:

${f.disclosingName || '[DISCLOSING PARTY NAME]'}, ${discType} the State of ${f.disclosingState || '[STATE]'} ("Disclosing Party");

and

${f.receivingName || '[RECEIVING PARTY NAME]'}, ${recType} the State of ${f.receivingState || '[STATE]'} ("Receiving Party").

${isMutual ? 'Each party may act as both a Disclosing Party and a Receiving Party under this Agreement.' : ''}

RECITALS

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to its business; and

WHEREAS, the Receiving Party desires to receive certain confidential information for the purpose of ${f.purpose || 'evaluating a potential business relationship or transaction'};

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public information, data, results, concepts, ideas, methods, techniques, or materials disclosed by the Disclosing Party to the Receiving Party, whether disclosed orally, in writing, electronically, visually, or by any other means, and whether or not marked as "confidential."${f.ciDefinition ? '\n\nIn particular, Confidential Information includes, without limitation: ' + f.ciDefinition + '.' : ''}${ciExamples ? '\n\nConfidential Information specifically includes, but is not limited to: ' + ciExamples + '.' : ''}

2. EXCLUSIONS FROM CONFIDENTIAL INFORMATION

The obligations of this Agreement do not apply to information that:

   (a) is or becomes publicly known through no act or omission of the Receiving Party;

   (b) was rightfully in the Receiving Party's possession prior to disclosure by the Disclosing Party, without restriction on disclosure;

   (c) is independently developed by the Receiving Party without use of or reference to the Confidential Information;

   (d) is rightfully obtained by the Receiving Party from a third party without restriction on disclosure; or

   (e) is required to be disclosed by applicable law, regulation, court order, or governmental authority, provided that the Receiving Party gives the Disclosing Party prompt written notice of such requirement prior to disclosure and cooperates with the Disclosing Party in seeking a protective order or other appropriate relief.

3. OBLIGATIONS OF THE RECEIVING PARTY

The Receiving Party agrees to:

   (a) hold all Confidential Information in strict confidence using at least the same degree of care used to protect its own confidential information, but in no event less than reasonable care;

   (b) not disclose Confidential Information to any third party without the prior written consent of the Disclosing Party;

   (c) limit access to Confidential Information to those employees, contractors, and agents who have a need to know and who are bound by confidentiality obligations no less restrictive than those contained herein;

   (d) use the Confidential Information solely for the Purpose described herein;

   (e) not reproduce, copy, or duplicate any Confidential Information except as necessary for the Purpose; and

   (f) not reverse engineer, disassemble, decompile, or otherwise attempt to derive the source code, underlying ideas, algorithms, or structure of any Confidential Information.

4. PURPOSE

The Receiving Party is authorized to use the Confidential Information solely for the following purpose: ${f.purpose || 'evaluating a potential business relationship or transaction'} (the "Purpose"). Any use beyond the Purpose is strictly prohibited without prior written authorization from the Disclosing Party.

5. TERM

${f.perpetualTradeSecrets
  ? `This Agreement shall remain in effect for a period of ${termYears} year${termYears !== 1 ? 's' : ''} from the date first written above (the "Term"). Notwithstanding the foregoing, obligations with respect to trade secrets shall survive the Term and continue for as long as the information qualifies as a trade secret under applicable law.`
  : `This Agreement shall remain in effect for a period of ${termYears} year${termYears !== 1 ? 's' : ''} from the date first written above (the "Term"). Upon expiration of the Term, all obligations under this Agreement shall terminate, except as otherwise provided herein.`}

6. RETURN OR DESTRUCTION OF INFORMATION

Upon the request of the Disclosing Party, or upon the termination or expiration of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof, and shall certify in writing to the Disclosing Party that such return or destruction has been completed.

7. INJUNCTIVE RELIEF

The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages would be an inadequate remedy. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief, specific performance, and other equitable remedies without the requirement of posting a bond or other security, and without the necessity of proving actual damages. Such remedies shall not be deemed exclusive but shall be in addition to all other remedies available at law or in equity.
${f.liquidatedDamages ? `
8. LIQUIDATED DAMAGES

The parties agree that in the event of a breach of this Agreement, the actual damages suffered by the Disclosing Party may be difficult to ascertain. The Receiving Party shall pay liquidated damages in the amount of $${f.liquidatedAmount || '10,000'} per breach, which the parties agree is a reasonable estimate of the Disclosing Party's damages and not a penalty.` : ''}
${f.nonSolicitation ? `
${f.liquidatedDamages ? '9' : '8'}. NON-SOLICITATION

During the Term of this Agreement and for a period of one (1) year thereafter, the Receiving Party agrees not to solicit, recruit, induce, or attempt to induce any employee, contractor, or consultant of the Disclosing Party to terminate their relationship with the Disclosing Party, whether directly or indirectly.` : ''}
${f.nonCompete ? `
${[f.liquidatedDamages, f.nonSolicitation].filter(Boolean).length + 8}. NON-COMPETE

During the Term of this Agreement and for a period of ${f.nonCompeteDuration || '1 year'} thereafter, the Receiving Party agrees not to engage in, own, manage, operate, or participate in any business that competes directly with the Disclosing Party in the following geographic area: ${f.nonCompeteScope || 'within the United States'}. The Receiving Party acknowledges that this restriction is reasonable and necessary to protect the legitimate business interests of the Disclosing Party.` : ''}

MISCELLANEOUS PROVISIONS

GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of the State of ${f.govState || '[GOVERNING STATE]'}, without regard to its conflict of laws principles.

ENTIRE AGREEMENT. This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous negotiations, representations, warranties, and agreements.

AMENDMENTS. No amendment, modification, or waiver of any provision of this Agreement shall be effective unless in writing signed by both parties.

SEVERABILITY. If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.

WAIVER. Failure to enforce any provision of this Agreement shall not constitute a waiver of the right to enforce such provision in the future.

COUNTERPARTS. This Agreement may be executed in counterparts, each of which shall be deemed an original, and electronic signatures shall be deemed valid.

IN WITNESS WHEREOF, the parties have executed this Non-Disclosure Agreement as of the date first written above.

DISCLOSING PARTY:

Signature: _________________________________
Name: ${f.disclosingName || '________________________________'}
Title: _________________________________
Date: _________________________________


RECEIVING PARTY:

Signature: _________________________________
Name: ${f.receivingName || '________________________________'}
Title: _________________________________
Date: _________________________________
`
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function NdaClient() {
  const today = new Date().toISOString().split('T')[0]

  // Party info
  const [disclosingName, setDisclosingName] = useState('')
  const [disclosingType, setDisclosingType] = useState('company')
  const [disclosingState, setDisclosingState] = useState('California')
  const [receivingName, setReceivingName] = useState('')
  const [receivingType, setReceivingType] = useState('company')
  const [receivingState, setReceivingState] = useState('California')

  // NDA type & purpose
  const [ndaType, setNdaType] = useState('unilateral')
  const [purpose, setPurpose] = useState('')
  const [ciDefinition, setCiDefinition] = useState('')
  const [date, setDate] = useState(today)

  // CI examples
  const [tradeSecrets, setTradeSecrets] = useState(true)
  const [financials, setFinancials] = useState(true)
  const [technicalData, setTechnicalData] = useState(false)
  const [businessPlans, setBusinessPlans] = useState(false)

  // Term
  const [duration, setDuration] = useState('2')
  const [perpetualTradeSecrets, setPerpetualTradeSecrets] = useState(false)

  // Governing law
  const [govState, setGovState] = useState('California')

  // Advanced
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [nonSolicitation, setNonSolicitation] = useState(false)
  const [nonCompete, setNonCompete] = useState(false)
  const [nonCompeteDuration, setNonCompeteDuration] = useState('1 year')
  const [nonCompeteScope, setNonCompeteScope] = useState('')
  const [liquidatedDamages, setLiquidatedDamages] = useState(false)
  const [liquidatedAmount, setLiquidatedAmount] = useState('10000')

  const [copied, setCopied] = useState(false)

  const docText = useMemo(() => buildNDA({
    disclosingName, disclosingType, disclosingState,
    receivingName, receivingType, receivingState,
    ndaType, purpose, ciDefinition, date,
    tradeSecrets, financials, technicalData, businessPlans,
    duration, perpetualTradeSecrets,
    govState,
    nonSolicitation, nonCompete, nonCompeteDuration, nonCompeteScope,
    liquidatedDamages, liquidatedAmount,
  }), [disclosingName, disclosingType, disclosingState, receivingName, receivingType, receivingState, ndaType, purpose, ciDefinition, date, tradeSecrets, financials, technicalData, businessPlans, duration, perpetualTradeSecrets, govState, nonSolicitation, nonCompete, nonCompeteDuration, nonCompeteScope, liquidatedDamages, liquidatedAmount])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>NDA - ${disclosingName || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const stateOptions = [{ value: '', label: 'Select State' }, ...US_STATES.map(s => ({ value: s, label: s }))]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* ── LEFT: FORM ── */}
      <div>
        {/* Disclaimer */}
        <div style={{ ...CARD, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)', marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--accent-text-b)', lineHeight: 1.6 }}>
            <strong>Legal Disclaimer:</strong> This tool generates a template NDA for general informational purposes only. It does not constitute legal advice. Every business situation is unique — have a licensed attorney in your state review any NDA before signing.
          </div>
        </div>

        {/* Parties */}
        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Parties</div>
          <div style={{ marginBottom: 16 }}>
            <Select label="NDA Type" value={ndaType} onChange={setNdaType} options={[{ value: 'unilateral', label: 'One-Way (Unilateral) — One party discloses' }, { value: 'mutual', label: 'Mutual — Both parties share confidential info' }]} />
          </div>
          <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disclosing Party</div>
          <div style={GRID2}>
            <Field label="Full Name / Company Name" value={disclosingName} onChange={setDisclosingName} placeholder="Acme Corp" />
            <Select label="Type" value={disclosingType} onChange={setDisclosingType} options={[{ value: 'company', label: 'Company / Organization' }, { value: 'individual', label: 'Individual' }]} />
            <Select label="State of Formation / Residence" value={disclosingState} onChange={setDisclosingState} options={stateOptions} />
          </div>
          <div style={{ marginTop: 20, marginBottom: 12, fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receiving Party</div>
          <div style={GRID2}>
            <Field label="Full Name / Company Name" value={receivingName} onChange={setReceivingName} placeholder="Beta Inc" />
            <Select label="Type" value={receivingType} onChange={setReceivingType} options={[{ value: 'company', label: 'Company / Organization' }, { value: 'individual', label: 'Individual' }]} />
            <Select label="State of Formation / Residence" value={receivingState} onChange={setReceivingState} options={stateOptions} />
          </div>
          <div style={{ marginTop: 16 }}>
            <Field label="Effective Date" value={date} onChange={setDate} type="date" />
          </div>
        </div>

        {/* Confidential Info */}
        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Confidential Information</div>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Purpose of Disclosure</label>
            <input style={INPUT} value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. evaluating a potential acquisition or partnership" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Custom CI Definition (optional)</label>
            <textarea style={TEXTAREA} value={ciDefinition} onChange={e => setCiDefinition(e.target.value)} placeholder="Describe specific types of confidential information involved..." />
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Include These Common Examples:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Checkbox label="Trade secrets and proprietary technology" checked={tradeSecrets} onChange={setTradeSecrets} />
            <Checkbox label="Financial data and projections" checked={financials} onChange={setFinancials} />
            <Checkbox label="Technical data, processes, and know-how" checked={technicalData} onChange={setTechnicalData} />
            <Checkbox label="Business plans, strategies, and customer lists" checked={businessPlans} onChange={setBusinessPlans} />
          </div>
        </div>

        {/* Term */}
        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Term & Governing Law</div>
          <div style={GRID2}>
            <Select label="Agreement Duration" value={duration} onChange={setDuration} options={[
              { value: '1', label: '1 Year' }, { value: '2', label: '2 Years' }, { value: '3', label: '3 Years' },
              { value: '5', label: '5 Years' }, { value: '10', label: '10 Years' },
            ]} />
            <Select label="Governing Law (State)" value={govState} onChange={setGovState} options={stateOptions} />
          </div>
          <div style={{ marginTop: 14 }}>
            <Checkbox label="Trade secret obligations survive the term (perpetual)" checked={perpetualTradeSecrets} onChange={setPerpetualTradeSecrets} />
          </div>
        </div>

        {/* Advanced */}
        <div style={CARD}>
          <button onClick={() => setShowAdvanced(v => !v)} style={{ ...BTN, marginBottom: showAdvanced ? 16 : 0 }}>
            {showAdvanced ? '▾' : '▸'} Advanced Clauses
          </button>
          {showAdvanced && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <Checkbox label="Non-solicitation clause (cannot poach employees)" checked={nonSolicitation} onChange={setNonSolicitation} />
                <Checkbox label="Non-compete clause" checked={nonCompete} onChange={setNonCompete} />
                {nonCompete && (
                  <div style={{ ...GRID2, paddingLeft: 24 }}>
                    <Field label="Non-compete duration" value={nonCompeteDuration} onChange={setNonCompeteDuration} placeholder="1 year" />
                    <Field label="Geographic scope" value={nonCompeteScope} onChange={setNonCompeteScope} placeholder="United States" hint="Note: Non-competes are restricted or banned in CA, ND, OK, MN, and other states" />
                  </div>
                )}
                <Checkbox label="Liquidated damages clause" checked={liquidatedDamages} onChange={setLiquidatedDamages} />
                {liquidatedDamages && (
                  <div style={{ paddingLeft: 24, maxWidth: 220 }}>
                    <Field label="Amount per breach ($)" value={liquidatedAmount} onChange={setLiquidatedAmount} type="number" placeholder="10000" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleCopy} style={BTN_PRIMARY}>{copied ? '✓ Copied!' : '📋 Copy Full Text'}</button>
          <button onClick={handlePrint} style={BTN}>🖨 Print / Download PDF</button>
        </div>
      </div>

      {/* ── RIGHT: PREVIEW ── */}
      <div style={{ position: 'sticky', top: 20 }}>
        {/* Header card */}
        <div style={{ ...CARD, background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Document Preview</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Non-Disclosure Agreement</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {disclosingName || '[Disclosing Party]'} → {receivingName || '[Receiving Party]'} &nbsp;·&nbsp; {ndaType === 'mutual' ? 'Mutual' : 'One-Way'} &nbsp;·&nbsp; {duration} yr{parseInt(duration) !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Key terms summary */}
        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Key Terms Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Type', value: ndaType === 'mutual' ? 'Mutual NDA' : 'One-Way NDA' },
              { label: 'Effective Date', value: date || 'Not set' },
              { label: 'Duration', value: `${duration} year${parseInt(duration) !== 1 ? 's' : ''}${perpetualTradeSecrets ? ' (+ perpetual for trade secrets)' : ''}` },
              { label: 'Governing Law', value: govState || 'Not set' },
              { label: 'Injunctive Relief', value: 'Included (standard)' },
              { label: 'Non-solicitation', value: nonSolicitation ? 'Included' : 'Not included' },
              { label: 'Non-compete', value: nonCompete ? `Included (${nonCompeteDuration})` : 'Not included' },
              { label: 'Liquidated Damages', value: liquidatedDamages ? `$${parseInt(liquidatedAmount).toLocaleString()} per breach` : 'Not included' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--fg-3)' }}>{row.label}</span>
                <span style={{ color: 'var(--fg-2)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document */}
        <div style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', maxHeight: 600, overflowY: 'auto' }}>
          <div style={{ background: 'white', color: '#000', padding: '60px 80px', fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: '11pt', whiteSpace: 'pre-wrap', maxWidth: 800, margin: '0 auto' }}>
            {docText}
          </div>
        </div>
      </div>
    </div>
  )
}
