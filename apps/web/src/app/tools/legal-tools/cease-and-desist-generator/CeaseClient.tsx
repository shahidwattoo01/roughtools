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

const VIOLATION_DETAILS: Record<string, { subject: string; legalBasis: string; demands: string[]; consequences: string }> = {
  copyright: {
    subject: 'Copyright Infringement',
    legalBasis: 'Your actions constitute infringement of our copyrighted works in violation of the Copyright Act, 17 U.S.C. §§ 101 et seq., and applicable international copyright treaties.',
    demands: [
      'Immediately cease and desist all use, reproduction, distribution, and display of our copyrighted material',
      'Remove all infringing content from your website(s), social media, and any other platforms within the deadline stated below',
      'Provide written confirmation that all infringing material has been removed',
      'Preserve all evidence, records, and communications related to the infringement',
    ],
    consequences: 'legal action for copyright infringement under 17 U.S.C. § 504, including statutory damages of up to $150,000 per work for willful infringement, actual damages, disgorgement of profits, injunctive relief, and recovery of attorneys\' fees and costs',
  },
  trademark: {
    subject: 'Trademark Infringement',
    legalBasis: 'Your actions constitute infringement of our registered trademark(s) in violation of the Lanham Act, 15 U.S.C. §§ 1051 et seq., creating a likelihood of consumer confusion and dilution of our brand.',
    demands: [
      'Immediately cease and desist all use of our trademark(s) or any confusingly similar marks',
      'Remove all infringing marks from your products, packaging, website, advertising, and marketing materials',
      'Destroy or deliver to us all inventory bearing the infringing marks',
      'Provide written confirmation of compliance within the deadline stated below',
      'Preserve all evidence related to past use of the infringing mark',
    ],
    consequences: 'trademark infringement action under 15 U.S.C. § 1117, including actual damages, disgorgement of your profits, statutory damages of up to $2,000,000 per mark for counterfeiting, injunctive relief, and attorneys\' fees',
  },
  defamation: {
    subject: 'Defamation and Libel/Slander',
    legalBasis: 'Your statements constitute defamation per se (or defamation per quod) under applicable state law. Your false statements of fact have caused and continue to cause reputational harm, emotional distress, and financial damages.',
    demands: [
      'Immediately cease and desist from making or publishing any further defamatory statements about us',
      'Retract all defamatory statements, posts, reviews, or publications in their entirety',
      'Publish a full public retraction and correction in all locations where the defamatory content appeared',
      'Preserve all evidence related to the defamatory statements, including drafts and communications',
    ],
    consequences: 'legal action for defamation, libel, and/or slander seeking actual compensatory damages, special damages for economic losses, presumed damages, and punitive damages where permitted by law, together with injunctive relief and attorneys\' fees',
  },
  harassment: {
    subject: 'Harassment and Unwanted Contact',
    legalBasis: 'Your conduct constitutes harassment and unwanted contact in violation of applicable state civil and/or criminal harassment statutes. Your actions have caused significant distress and a reasonable fear of harm.',
    demands: [
      'Immediately cease and desist all forms of contact, communication, and harassment',
      'Do not contact us or any of our representatives, employees, or family members by any means',
      'Do not appear at our home, workplace, or any location we frequent',
      'Remove all content targeting, threatening, or disparaging us from all public or online platforms',
    ],
    consequences: 'all available legal remedies, including seeking a civil restraining order or protective order, filing criminal harassment charges, and pursuing a civil lawsuit for intentional infliction of emotional distress, invasion of privacy, and related claims',
  },
  trade_secret: {
    subject: 'Misappropriation of Trade Secrets',
    legalBasis: 'Your actions constitute misappropriation of our trade secrets in violation of the Defend Trade Secrets Act (DTSA), 18 U.S.C. § 1836, and applicable state trade secret laws, including the Uniform Trade Secrets Act.',
    demands: [
      'Immediately cease and desist all use, disclosure, or exploitation of our trade secrets',
      'Return or destroy all documents, files, and materials containing our trade secret information',
      'Confirm in writing that no copies have been retained in any form',
      'Identify all persons who have received or had access to our trade secret information',
      'Preserve all evidence relating to the misappropriation',
    ],
    consequences: 'legal action under the DTSA and applicable state law seeking injunctive relief, actual damages, unjust enrichment recovery, and exemplary damages of up to two times the actual damages for willful misappropriation, plus attorneys\' fees',
  },
  patent: {
    subject: 'Patent Infringement',
    legalBasis: 'Your products, processes, and/or services infringe one or more claims of our patent(s) in violation of 35 U.S.C. § 271. We have a good faith belief that your activities constitute direct and/or indirect infringement.',
    demands: [
      'Immediately cease and desist all manufacture, use, sale, offer for sale, and importation of infringing products, processes, or services',
      'Withdraw from the market all infringing products',
      'Provide written confirmation of compliance within the deadline stated below',
      'Preserve all evidence related to the design, development, and commercialization of infringing products',
    ],
    consequences: 'patent infringement litigation under 35 U.S.C. §§ 281 et seq. seeking injunctive relief, damages adequate to compensate for infringement (at least a reasonable royalty), enhanced damages of up to three times actual damages for willful infringement, and attorneys\' fees in exceptional cases',
  },
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

function _Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={INPUT}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function buildCeaseAndDesist(f: {
  senderName: string; senderAddress: string; senderEmail: string; senderPhone: string
  senderIsAttorney: boolean; clientName: string
  recipientName: string; recipientAddress: string
  violationType: string; violationDescription: string; violationDates: string
  deadline: string; additionalDemands: string
  seekingDamages: boolean; damageAmount: string
}): string {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const deadlineDate = new Date(Date.now() + parseInt(f.deadline) * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const details = VIOLATION_DETAILS[f.violationType] || VIOLATION_DETAILS.copyright
  const fromLine = f.senderIsAttorney ? `${f.senderName}, Attorney at Law\nOn behalf of: ${f.clientName || '[CLIENT NAME]'}` : f.senderName

  return `CEASE AND DESIST LETTER — FORMAL LEGAL NOTICE

${today}

TO:
${f.recipientName || '[RECIPIENT NAME]'}${f.recipientAddress ? '\n' + f.recipientAddress : ''}

FROM:
${fromLine}${f.senderAddress ? '\n' + f.senderAddress : ''}${f.senderEmail ? '\nEmail: ' + f.senderEmail : ''}${f.senderPhone ? '\nPhone: ' + f.senderPhone : ''}

RE: FORMAL DEMAND TO CEASE AND DESIST — ${details.subject.toUpperCase()}

Dear ${f.recipientName || 'Sir/Madam'},

This letter constitutes formal legal notice that you are engaged in unlawful conduct and serves as a demand that you immediately cease and desist from such activities. ${f.senderIsAttorney ? `I represent ${f.clientName || '[CLIENT NAME]'} ("our client") in connection with the matters described herein.` : `We are writing on our own behalf regarding the serious matter described below.`}

BACKGROUND AND NOTICE OF VIOLATION

It has come to ${f.senderIsAttorney ? 'our client\'s' : 'our'} attention that you have engaged in the following unlawful conduct:

${f.violationDescription || '[DESCRIBE THE SPECIFIC CONDUCT HERE — INCLUDE DATES, SPECIFIC INCIDENTS, URLs, EXAMPLES, OR OTHER IDENTIFYING INFORMATION]'}
${f.violationDates ? '\nRelevant Dates / Incidents:\n' + f.violationDates : ''}

LEGAL BASIS

${details.legalBasis}

${f.senderIsAttorney ? 'Our client has' : 'We have'} a good faith, reasonable belief that your conduct is unlawful and has caused, and continues to cause, significant harm.

DEMANDS

You are hereby formally demanded to take the following actions immediately:

${details.demands.map((d, i) => `${i + 1}. ${d}`).join('\n\n')}${f.additionalDemands ? '\n\n' + (details.demands.length + 1) + '. ' + f.additionalDemands : ''}

COMPLIANCE DEADLINE

You must comply fully with all of the above demands no later than: ${deadlineDate} (${f.deadline} days from the date of this letter).

CONSEQUENCES OF NON-COMPLIANCE

Should you fail to comply with the demands set forth in this letter by the specified deadline, ${f.senderIsAttorney ? 'we are authorized and prepared' : 'we will not hesitate'} to pursue ${details.consequences}.
${f.seekingDamages && f.damageAmount ? `\nIn addition, we are already seeking damages of approximately $${parseInt(f.damageAmount).toLocaleString()} as a result of the harm caused by your conduct to date.\n` : ''}
RESERVATION OF RIGHTS

Nothing in this letter shall be construed as a waiver of any rights, claims, defenses, or remedies, all of which are expressly reserved. This letter is written without prejudice to any legal rights or remedies that may be pursued.

EVIDENCE PRESERVATION NOTICE

You are hereby notified to preserve all documents, communications, electronic files, and other materials relating to the matters described in this letter. Failure to preserve relevant evidence may result in adverse legal consequences.

This letter does not constitute legal advice to you. We strongly recommend that you consult with your own legal counsel immediately upon receipt of this letter.

Sincerely,

${f.senderIsAttorney ? f.senderName + '\nAttorney at Law' : f.senderName}
${f.senderEmail || ''}
${f.senderPhone || ''}
Dated: ${today}

---
IMPORTANT NOTICE: This is a formal legal notice. Failure to comply may result in immediate legal action. Consult an attorney immediately upon receipt of this letter.`
}

export default function CeaseClient() {
  const [senderName, setSenderName] = useState('')
  const [senderAddress, setSenderAddress] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [senderIsAttorney, setSenderIsAttorney] = useState(false)
  const [clientName, setClientName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [violationType, setViolationType] = useState('copyright')
  const [violationDescription, setViolationDescription] = useState('')
  const [violationDates, setViolationDates] = useState('')
  const [deadline, setDeadline] = useState('10')
  const [additionalDemands, setAdditionalDemands] = useState('')
  const [seekingDamages, setSeekingDamages] = useState(false)
  const [damageAmount, setDamageAmount] = useState('')
  const [copied, setCopied] = useState(false)

  const docText = useMemo(() => buildCeaseAndDesist({
    senderName, senderAddress, senderEmail, senderPhone, senderIsAttorney, clientName,
    recipientName, recipientAddress, violationType, violationDescription, violationDates,
    deadline, additionalDemands, seekingDamages, damageAmount,
  }), [senderName, senderAddress, senderEmail, senderPhone, senderIsAttorney, clientName, recipientName, recipientAddress, violationType, violationDescription, violationDates, deadline, additionalDemands, seekingDamages, damageAmount])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Cease & Desist - ${recipientName || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const details = VIOLATION_DETAILS[violationType] || VIOLATION_DETAILS.copyright
  const deadlineDate = new Date(Date.now() + parseInt(deadline) * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* LEFT: FORM */}
      <div>
        <div style={{ ...CARD, background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.3)' }}>
          <div style={{ fontSize: 12, color: '#f87171', lineHeight: 1.6 }}>
            <strong>Important:</strong> A cease and desist letter is a serious legal document. For significant matters, consult a licensed attorney before sending. This template is for informational purposes only.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Sender Information</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
              <input type="checkbox" checked={senderIsAttorney} onChange={e => setSenderIsAttorney(e.target.checked)} style={{ accentColor: 'var(--brand-2)', width: 15, height: 15 }} />
              I am an attorney sending this letter on behalf of a client
            </label>
          </div>
          <div style={GRID2}>
            <Field label={senderIsAttorney ? 'Attorney Name *' : 'Your Full Name / Company *'} value={senderName} onChange={setSenderName} placeholder={senderIsAttorney ? 'John Smith, Esq.' : 'Your full name or company'} />
            {senderIsAttorney && <Field label="Client Name *" value={clientName} onChange={setClientName} placeholder="Client company or individual" />}
            <Field label="Address" value={senderAddress} onChange={setSenderAddress} placeholder="123 Main St, City, State" />
            <Field label="Email" value={senderEmail} onChange={setSenderEmail} placeholder="your@email.com" type="email" />
            <Field label="Phone" value={senderPhone} onChange={setSenderPhone} placeholder="555-000-0000" />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Recipient</div>
          <div style={GRID2}>
            <Field label="Recipient Name / Company *" value={recipientName} onChange={setRecipientName} placeholder="John Doe or Infringing Corp" />
            <Field label="Recipient Address" value={recipientAddress} onChange={setRecipientAddress} placeholder="456 Oak Ave, City, State" />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Violation Details</div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Type of Violation</label>
            <select value={violationType} onChange={e => setViolationType(e.target.value)} style={INPUT}>
              <option value="copyright">Copyright Infringement</option>
              <option value="trademark">Trademark Infringement</option>
              <option value="defamation">Defamation / Libel / Slander</option>
              <option value="harassment">Harassment / Unwanted Contact</option>
              <option value="trade_secret">Trade Secret Misappropriation</option>
              <option value="patent">Patent Infringement</option>
            </select>
          </div>
          <div style={{ ...CARD, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)', padding: '12px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--fg-2)' }}>Violation: {details.subject}</strong><br />
              {details.demands.length} formal demands will be included automatically based on violation type.
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Describe the Violation *</label>
            <textarea style={{ ...TEXTAREA, minHeight: 120 } as CSSProperties} value={violationDescription} onChange={e => setViolationDescription(e.target.value)}
              placeholder="Describe what the recipient has done: include specific dates, URLs, product names, post content, or any identifying details that prove the infringement or harm." />
          </div>
          <div>
            <label style={LABEL}>Relevant Dates / Incidents (optional)</label>
            <textarea style={TEXTAREA} value={violationDates} onChange={e => setViolationDates(e.target.value)}
              placeholder={'January 5, 2026 — Infringing content first appeared at example.com/page\nJanuary 12, 2026 — Content shared on social media causing additional harm'} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 4: Demands & Deadline</div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Compliance Deadline</label>
            <select value={deadline} onChange={e => setDeadline(e.target.value)} style={INPUT}>
              <option value="3">3 days (emergency)</option>
              <option value="7">7 days</option>
              <option value="10">10 days (standard)</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>Deadline will be: {deadlineDate}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Additional Demand (optional)</label>
            <textarea style={TEXTAREA} value={additionalDemands} onChange={e => setAdditionalDemands(e.target.value)}
              placeholder="Any custom demand specific to your situation" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
              <input type="checkbox" checked={seekingDamages} onChange={e => setSeekingDamages(e.target.checked)} style={{ accentColor: 'var(--brand-2)', width: 15, height: 15 }} />
              Include estimated damages amount
            </label>
            {seekingDamages && (
              <div style={{ paddingLeft: 24, maxWidth: 220 }}>
                <Field label="Estimated Damages ($)" value={damageAmount} onChange={setDamageAmount} placeholder="50000" type="number" />
              </div>
            )}
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
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Cease & Desist Letter</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {details.subject} · Deadline: {deadlineDate}
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Letter Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Violation Type', value: details.subject },
              { label: 'From', value: senderIsAttorney ? `${senderName || '—'} (Attorney)` : senderName || '—' },
              { label: 'To', value: recipientName || '—' },
              { label: 'Compliance Deadline', value: `${deadline} days (${deadlineDate})` },
              { label: 'Formal Demands', value: `${details.demands.length + (additionalDemands ? 1 : 0)} items` },
              { label: 'Damages Claimed', value: seekingDamages && damageAmount ? `$${parseInt(damageAmount).toLocaleString()}` : 'Not specified' },
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
