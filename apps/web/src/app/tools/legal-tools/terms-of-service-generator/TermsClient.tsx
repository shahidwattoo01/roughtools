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
const GRID2: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }

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

function buildTerms(f: {
  siteName: string; siteUrl: string; email: string
  country: string; state: string; effectiveDate: string
  minAge: string; productType: string
  hasPaid: boolean; hasSubscription: boolean; refundDays: string
  hasUserContent: boolean; hasAccounts: boolean
  disputeResolution: string; arbitrationProvider: string
  customProhibited: string; terminationPolicy: string
  dmca: boolean; contactAddress: string
}): string {
  const date = f.effectiveDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const govLaw = f.country === 'US' ? `the State of ${f.state || 'California'}, United States` : f.country

  return `TERMS OF SERVICE

Last Updated: ${date}

PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING ${(f.siteName || 'OUR SERVICE').toUpperCase()}.

1. ACCEPTANCE OF TERMS

By accessing or using ${f.siteUrl || 'our website'} and any related services (collectively, the "Service") operated by ${f.siteName || '[COMPANY NAME]'} ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access or use the Service.

These Terms apply to all visitors, users, and others who access or use the Service. Your continued use of the Service following posting of any changes to these Terms constitutes your acceptance of those changes.

2. DESCRIPTION OF SERVICE

${f.siteName || '[COMPANY NAME]'} provides ${f.productType || 'an online platform and related services'} (the "Service"). We reserve the right to modify, suspend, or discontinue any part of the Service at any time without liability.

${f.hasAccounts ? `3. USER ACCOUNTS

3.1 Registration. To access certain features, you must register for an account. You agree to provide accurate, current, and complete information and to keep it updated.

3.2 Account Security. You are responsible for safeguarding your password and for all activities that occur under your account. Notify us immediately of any unauthorized use at: ${f.email || '[EMAIL]'}

3.3 Account Termination. We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

4. PERMITTED USE AND RESTRICTIONS` : '3. PERMITTED USE AND RESTRICTIONS'}

You may use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:

   (a) Use the Service in any way that violates applicable local, national, or international law or regulation
   (b) Transmit any unsolicited or unauthorized advertising, spam, or promotional material
   (c) Impersonate any person or entity, or falsely represent your affiliation with any person or entity
   (d) Attempt to gain unauthorized access to any portion of the Service or related systems
   (e) Interfere with or disrupt the integrity, security, or performance of the Service
   (f) Use automated tools (bots, scrapers, crawlers) to access the Service without written permission
   (g) Reverse engineer, decompile, or disassemble any portion of the Service
   (h) Collect personal information about other users without their consent${f.customProhibited ? '\n   (i) ' + f.customProhibited : ''}

${f.hasUserContent ? `${f.hasAccounts ? '5' : '4'}. USER-GENERATED CONTENT

5.1 Your Content. You retain ownership of content you post, upload, or submit through the Service ("User Content"). By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free, sublicensable license to use, reproduce, distribute, prepare derivative works of, and display your User Content in connection with operating and improving the Service.

5.2 Content Standards. User Content must not: (a) be false, inaccurate, or misleading; (b) infringe any intellectual property rights; (c) contain defamatory, obscene, or harmful material; (d) contain malware or harmful code; or (e) violate any applicable law.

5.3 Content Removal. We reserve the right (but not the obligation) to remove any User Content at our sole discretion.

` : ''}${f.hasPaid ? `${[f.hasAccounts, f.hasUserContent].filter(Boolean).length + 4}. PAYMENT TERMS

${[f.hasAccounts, f.hasUserContent].filter(Boolean).length + 4}.1 Fees. Certain features of the Service require payment of fees. All fees are quoted in U.S. dollars unless otherwise stated and are exclusive of taxes. You agree to pay all applicable fees when due.

${[f.hasAccounts, f.hasUserContent].filter(Boolean).length + 4}.2 Billing. By providing payment information, you authorize us to charge you for the Service. All payments are non-refundable unless otherwise specified.${f.refundDays !== '0' ? `\n\n${[f.hasAccounts, f.hasUserContent].filter(Boolean).length + 4}.3 Refunds. We offer a ${f.refundDays}-day money-back guarantee for new subscriptions. Refund requests outside this window are evaluated case by case.` : ''}

` : ''}${f.hasSubscription ? `SUBSCRIPTION TERMS

Subscription fees are billed on a recurring basis (monthly or annually, as selected). Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date. You may cancel at any time through your account settings. Cancellation takes effect at the end of the current billing period; no partial refunds are provided for unused time.

` : ''}INTELLECTUAL PROPERTY

The Service and its original content (excluding User Content), features, software, and functionality are owned by ${f.siteName || '[COMPANY NAME]'} and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of ${f.siteName || 'our'} Service without express written permission.

${f.dmca ? `DMCA / COPYRIGHT POLICY

We respect intellectual property rights. If you believe any content on the Service infringes your copyright, please send a DMCA notice to: ${f.email || '[EMAIL]'} with (a) identification of the copyrighted work, (b) identification of the infringing material and its location, (c) your contact information, (d) a statement of good faith belief, and (e) your signature. We will remove infringing content upon receiving a valid notice.

` : ''}MINIMUM AGE

You must be at least ${f.minAge} years of age to use this Service. By using the Service, you represent and warrant that you meet this age requirement. If you are under ${f.minAge}, you may not use the Service under any circumstances.

DISCLAIMER OF WARRANTIES

THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.

LIMITATION OF LIABILITY

TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ${(f.siteName || 'THE COMPANY').toUpperCase()}, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING UNDER THESE TERMS SHALL NOT EXCEED THE GREATER OF $100 OR THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.

INDEMNIFICATION

You agree to defend, indemnify, and hold harmless ${f.siteName || '[COMPANY NAME]'} and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses (including reasonable attorneys' fees) arising from (a) your use of the Service, (b) your User Content, (c) your violation of these Terms, or (d) your violation of any third-party rights.

DISPUTE RESOLUTION
${f.disputeResolution === 'arbitration'
  ? `\nANY DISPUTE ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL BE RESOLVED BY BINDING ARBITRATION UNDER THE RULES OF THE ${(f.arbitrationProvider || 'AMERICAN ARBITRATION ASSOCIATION').toUpperCase()}, RATHER THAN IN COURT. THE ARBITRATION SHALL BE CONDUCTED IN ${govLaw.toUpperCase()}. YOU WAIVE THE RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.\n`
  : `\nAny dispute arising from these Terms shall be resolved in the state or federal courts located in ${govLaw}. You irrevocably consent to the exclusive jurisdiction of those courts.\n`}
GOVERNING LAW

These Terms are governed by and construed in accordance with the laws of ${govLaw}, without regard to its conflict of law provisions.

CHANGES TO TERMS

We reserve the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date and, where appropriate, by sending an email or posting a notice on the Service. Your continued use after changes take effect constitutes acceptance.${f.terminationPolicy ? `\n\nTERMINATION\n\n${f.terminationPolicy}` : `\n\nTERMINATION\n\nWe may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.`}

CONTACT

For questions about these Terms, contact us at:

${f.siteName || '[COMPANY NAME]'}${f.contactAddress ? '\n' + f.contactAddress : ''}
Email: ${f.email || '[EMAIL]'}${f.siteUrl ? '\nWebsite: ' + f.siteUrl : ''}`
}

export default function TermsClient() {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('US')
  const [state, setState] = useState('California')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [minAge, setMinAge] = useState('13')
  const [productType, setProductType] = useState('an online platform and tools')

  const [hasPaid, setHasPaid] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [refundDays, setRefundDays] = useState('30')
  const [hasUserContent, setHasUserContent] = useState(false)
  const [hasAccounts, setHasAccounts] = useState(true)
  const [dmca, setDmca] = useState(false)

  const [disputeResolution, setDisputeResolution] = useState('courts')
  const [arbitrationProvider, setArbitrationProvider] = useState('American Arbitration Association')
  const [customProhibited, setCustomProhibited] = useState('')
  const [terminationPolicy, setTerminationPolicy] = useState('')

  const [copied, setCopied] = useState(false)

  const docText = useMemo(() => buildTerms({
    siteName, siteUrl, email, country, state, effectiveDate, minAge, productType,
    hasPaid, hasSubscription, refundDays, hasUserContent, hasAccounts,
    disputeResolution, arbitrationProvider, customProhibited, terminationPolicy,
    dmca, contactAddress,
  }), [siteName, siteUrl, email, country, state, effectiveDate, minAge, productType, hasPaid, hasSubscription, refundDays, hasUserContent, hasAccounts, disputeResolution, arbitrationProvider, customProhibited, terminationPolicy, dmca, contactAddress])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Terms of Service - ${siteName || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const stateOptions = US_STATES.map(s => ({ value: s, label: s }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* LEFT: FORM */}
      <div>
        <div style={{ ...CARD, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: 12, color: 'var(--accent-text-b)', lineHeight: 1.6 }}>
            <strong>Legal Disclaimer:</strong> This tool generates a template Terms of Service for informational purposes only. It does not constitute legal advice. Consult a licensed attorney for your specific situation.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Service Information</div>
          <div style={GRID2}>
            <Field label="Website / App Name *" value={siteName} onChange={setSiteName} placeholder="RoughTools" />
            <Field label="Website URL" value={siteUrl} onChange={setSiteUrl} placeholder="https://yoursite.com" />
            <Field label="Contact Email *" value={email} onChange={setEmail} placeholder="legal@yoursite.com" type="email" />
            <Field label="Mailing Address" value={contactAddress} onChange={setContactAddress} placeholder="123 Main St, City, State" />
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={LABEL}>Description of Service</label>
            <input style={INPUT} value={productType} onChange={e => setProductType(e.target.value)} placeholder="an online platform providing tools and calculators" />
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} placeholder={today} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Governing Law</div>
          <div style={GRID2}>
            <Select label="Country" value={country} onChange={setCountry} options={[
              { value: 'US', label: 'United States' },
              { value: 'United Kingdom', label: 'United Kingdom' },
              { value: 'Canada', label: 'Canada' },
              { value: 'Australia', label: 'Australia' },
              { value: 'European Union', label: 'European Union' },
            ]} />
            {country === 'US' && (
              <Select label="Governing State" value={state} onChange={setState} options={stateOptions} />
            )}
            <Select label="Minimum Age" value={minAge} onChange={setMinAge} options={[
              { value: '13', label: '13 years (COPPA standard)' },
              { value: '16', label: '16 years (GDPR standard)' },
              { value: '18', label: '18 years (adult services)' },
            ]} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Features & Content</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Checkbox label="Users create accounts / profiles" checked={hasAccounts} onChange={setHasAccounts} />
            <Checkbox label="Users can post or upload content" checked={hasUserContent} onChange={setHasUserContent} />
            <Checkbox label="Service includes paid features" checked={hasPaid} onChange={setHasPaid} />
            {hasPaid && (
              <div style={{ paddingLeft: 24 }}>
                <Checkbox label="Subscription / recurring billing" checked={hasSubscription} onChange={setHasSubscription} />
                {hasPaid && (
                  <div style={{ marginTop: 10 }}>
                    <Select label="Refund Window" value={refundDays} onChange={setRefundDays} options={[
                      { value: '0', label: 'No refunds' },
                      { value: '7', label: '7-day money-back guarantee' },
                      { value: '14', label: '14-day money-back guarantee' },
                      { value: '30', label: '30-day money-back guarantee' },
                    ]} />
                  </div>
                )}
              </div>
            )}
            <Checkbox label="DMCA / copyright policy (recommended for UGC sites)" checked={dmca} onChange={setDmca} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 4: Dispute Resolution</div>
          <div style={{ marginBottom: 16 }}>
            <Select label="Dispute Resolution Method" value={disputeResolution} onChange={setDisputeResolution} options={[
              { value: 'courts', label: 'Courts (litigation)' },
              { value: 'arbitration', label: 'Binding arbitration (waives class action)' },
            ]} />
          </div>
          {disputeResolution === 'arbitration' && (
            <Select label="Arbitration Provider" value={arbitrationProvider} onChange={setArbitrationProvider} options={[
              { value: 'American Arbitration Association', label: 'American Arbitration Association (AAA)' },
              { value: 'JAMS', label: 'JAMS' },
              { value: 'National Arbitration Forum', label: 'National Arbitration Forum' },
            ]} />
          )}
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 5: Custom Clauses (Optional)</div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Additional Prohibited Uses</label>
            <textarea style={TEXTAREA} value={customProhibited} onChange={e => setCustomProhibited(e.target.value)}
              placeholder="e.g. use the Service to generate spam content for third-party distribution" />
          </div>
          <div>
            <label style={LABEL}>Custom Termination Policy</label>
            <textarea style={TEXTAREA} value={terminationPolicy} onChange={e => setTerminationPolicy(e.target.value)}
              placeholder="Leave blank to use the standard termination clause" />
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
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Terms of Service</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {siteName || '[Site Name]'} · {effectiveDate || today}
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Terms Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Governing Law', value: country === 'US' ? `${state || 'California'}, US` : country },
              { label: 'Minimum Age', value: `${minAge} years` },
              { label: 'User Accounts', value: hasAccounts ? 'Yes' : 'No' },
              { label: 'User Content', value: hasUserContent ? 'Yes' : 'No' },
              { label: 'Paid Features', value: hasPaid ? (hasSubscription ? 'Yes (subscription)' : 'Yes') : 'No' },
              { label: 'Refund Policy', value: hasPaid ? (refundDays === '0' ? 'No refunds' : `${refundDays}-day guarantee`) : 'N/A' },
              { label: 'Dispute Resolution', value: disputeResolution === 'arbitration' ? 'Binding arbitration' : 'Courts / litigation' },
              { label: 'DMCA Policy', value: dmca ? 'Included' : 'Not included' },
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
