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

const COLLECT_MAP: Record<string, string> = {
  email: 'Email addresses',
  name: 'Full names',
  phone: 'Phone numbers',
  payment: 'Payment and billing information',
  location: 'Location data (city, state, country)',
  analytics: 'Usage and analytics data (pages visited, session duration, clicks)',
  device: 'Device information (browser type, operating system, IP address)',
  social: 'Social media profile information (if you connect social accounts)',
  preferences: 'User preferences and account settings',
}

function buildPrivacyPolicy(f: {
  siteName: string; siteUrl: string; email: string; companyType: string
  state: string; country: string; effectiveDate: string; contactAddress: string
  collects: string[]; retentionPeriod: string
  gdpr: boolean; ccpa: boolean; coppa: boolean
  cookies: boolean; analytics: boolean; analyticsTools: string
  thirdParty: boolean; thirdPartyList: string
  marketing: boolean; securityMeasures: string
}): string {
  const date = f.effectiveDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const collectList = f.collects.map(c => COLLECT_MAP[c] || c)
  const entity = f.companyType === 'individual' ? 'I' : 'we'
  const entityPossessive = f.companyType === 'individual' ? 'my' : 'our'

  const doc = `PRIVACY POLICY

Last Updated: ${date}

1. INTRODUCTION

${f.siteName || '[COMPANY NAME]'} ("${entity === 'I' ? 'I' : 'we'}", "us", or "our") operates ${f.siteUrl || 'our website'} (the "Service"). This Privacy Policy describes how ${entity} collect, use, store, and protect information about you when you use ${entityPossessive} Service.

By accessing or using ${entityPossessive} Service, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use the Service.

2. INFORMATION WE COLLECT

${entity === 'I' ? 'I collect' : 'We collect'} the following categories of personal information:

${collectList.length > 0 ? collectList.map(c => `   • ${c}`).join('\n') : '   • Basic usage data'}

${entity === 'I' ? 'I' : 'We'} collect this information when you:
   • Register or create an account on ${entityPossessive} Service
   • Use, access, or interact with ${entityPossessive} Service
   • Contact ${entityPossessive} support team or submit forms
   • Make purchases or subscribe to services (if applicable)
   • Voluntarily provide information in surveys or feedback

3. HOW WE USE YOUR INFORMATION

${entity === 'I' ? 'I use' : 'We use'} the information ${entity} collect to:

   (a) Provide, operate, and maintain ${entityPossessive} Service
   (b) Improve, personalize, and expand ${entityPossessive} Service
   (c) Understand how you use ${entityPossessive} Service to develop better features
   (d) Communicate with you for customer service, updates, and notices${f.marketing ? '\n   (e) Send marketing and promotional communications (you may opt out at any time)' : '\n   (e) Send transactional emails and service notifications (no unsolicited marketing)'}
   (f) Process transactions and send related confirmations
   (g) Detect, prevent, and address fraud, abuse, or security incidents
   (h) Comply with applicable legal obligations

4. LEGAL BASIS FOR PROCESSING

${entity === 'I' ? 'I process' : 'We process'} your personal data on the following legal bases:
   • Performance of a contract when providing you with ${entityPossessive} Service
   • Legitimate interests in operating, securing, and improving ${entityPossessive} Service
   • Compliance with legal obligations
   • Your consent, where ${entity} ${entity === 'I' ? 'have' : 'has'} obtained it

5. COOKIES AND TRACKING TECHNOLOGIES
${f.cookies
  ? `
${entity === 'I' ? 'I use' : 'We use'} cookies and similar tracking technologies. Types of cookies ${entity} use:
   • Essential cookies: Required for the Service to function properly
   • Preference cookies: Remember your settings and preferences
   • Analytics cookies: Help understand how visitors use the Service${f.analytics ? `\n   • Third-party analytics (${f.analyticsTools || 'analytics provider'}): Aggregate usage statistics` : ''}

You can control cookies through your browser settings. Disabling certain cookies may affect Service functionality.`
  : `
${entity === 'I' ? 'I do' : 'We do'} not use cookies or similar tracking technologies on ${entityPossessive} Service.`}

${f.analytics && f.analyticsTools
  ? `\n6. ANALYTICS SERVICES\n\n${entity === 'I' ? 'I use' : 'We use'} ${f.analyticsTools} to analyze how users interact with ${entityPossessive} Service. This service may collect information such as pages visited, session duration, and general location. Please review ${f.analyticsTools}'s privacy policy for more information on how it processes data.\n`
  : ''}
${(f.analytics && f.analyticsTools) ? '7' : '6'}. HOW WE SHARE YOUR INFORMATION
${f.thirdParty
  ? `
${entity === 'I' ? 'I may share' : 'We may share'} your personal information with:
${f.thirdPartyList
    ? f.thirdPartyList.split('\n').filter(t => t.trim()).map(t => `   • ${t.trim()}`).join('\n')
    : '   • Cloud hosting and infrastructure providers\n   • Payment processors\n   • Analytics and performance platforms\n   • Customer support tools'}

All third-party service providers are contractually obligated to protect your data and use it only for the purposes ${entity} have authorized. ${entity === 'I' ? 'I do' : 'We do'} not sell, trade, or rent your personal information to third parties for their own marketing purposes.`
  : `
${entity === 'I' ? 'I do' : 'We do'} not sell, trade, or share your personal information with third parties, except:
   • With your explicit consent
   • To comply with applicable law, regulation, or court order
   • To protect the rights, safety, or property of ${entityPossessive} users or the public
   • In connection with a merger, acquisition, or sale of business assets (with prior notice)`}

${(f.analytics && f.analyticsTools) ? '8' : '7'}. DATA RETENTION

${entity === 'I' ? 'I retain' : 'We retain'} your personal information for ${f.retentionPeriod || 'as long as necessary to provide the Service'}, unless a longer retention period is required by law or legitimate business purposes. When data is no longer needed, ${entity} securely delete or anonymize it. You may request deletion of your data at any time (see Your Rights below).

${(f.analytics && f.analyticsTools) ? '9' : '8'}. YOUR RIGHTS

Depending on your location, you may have the following rights:
   • Right to Access: Request a copy of the personal data ${entity} hold about you
   • Right to Rectification: Request correction of inaccurate or incomplete data
   • Right to Erasure: Request deletion of your personal data ("right to be forgotten")
   • Right to Restriction: Request that ${entity} limit how ${entity} process your data
   • Right to Data Portability: Receive your data in a structured, machine-readable format
   • Right to Object: Object to processing based on legitimate interests
   • Right to Withdraw Consent: Where processing is consent-based, withdraw at any time

To exercise any of these rights, contact us at: ${f.email || '[CONTACT EMAIL]'}
${f.gdpr
  ? `\n${(f.analytics && f.analyticsTools) ? '10' : '9'}. GDPR — EUROPEAN USERS\n\nIf you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR). ${entity === 'I' ? 'I act' : 'We act'} as the data controller for your information. To submit a GDPR request or contact ${entityPossessive} Data Protection representative: ${f.email || '[EMAIL]'}\n`
  : ''}${f.ccpa
  ? `\n${(f.analytics && f.analyticsTools) ? (f.gdpr ? '11' : '10') : (f.gdpr ? '10' : '9')}. CCPA — CALIFORNIA RESIDENTS\n\nIf you are a California resident, the California Consumer Privacy Act (CCPA) provides you with additional rights:\n   • Know what personal information is collected and how it is used or disclosed\n   • Delete personal information ${entity} have collected (with certain exceptions)\n   • Opt-out of the sale of personal information — ${entity === 'I' ? 'I do' : 'We do'} not sell personal data\n   • Non-discrimination for exercising your CCPA rights\n\nTo submit a CCPA request: ${f.email || '[EMAIL]'}\n`
  : ''}
${f.coppa
  ? `CHILDREN'S PRIVACY (COPPA)\n\nThis Service is intended for children, and ${entity === 'I' ? 'I comply' : 'we comply'} with the Children's Online Privacy Protection Act (COPPA). ${entity === 'I' ? 'I collect' : 'We collect'} personal information from children under 13 only with verifiable parental consent. Parents may review, update, or request deletion of their child's information by contacting us at: ${f.email || '[EMAIL]'}\n`
  : `CHILDREN'S PRIVACY\n\n${entityPossessive.charAt(0).toUpperCase() + entityPossessive.slice(1)} Service is not directed to children under 13. ${entity === 'I' ? 'I do' : 'We do'} not knowingly collect personal information from children under 13. If you become aware that a child has provided ${entity === 'I' ? 'me' : 'us'} with personal data, please contact ${entity === 'I' ? 'me' : 'us'} immediately.\n`}
DATA SECURITY

${entity === 'I' ? 'I implement' : 'We implement'} ${f.securityMeasures || 'appropriate technical and organizational security measures, including SSL/TLS encryption and access controls,'} to protect your information against unauthorized access, alteration, disclosure, or destruction. Despite ${entityPossessive} efforts, no method of transmission over the Internet is completely secure.

THIRD-PARTY LINKS

${entityPossessive.charAt(0).toUpperCase() + entityPossessive.slice(1)} Service may contain links to third-party websites. ${entity === 'I' ? 'I have' : 'We have'} no control over and assume no responsibility for the privacy practices of any third-party sites. ${entity === 'I' ? 'I encourage' : 'We encourage'} you to review their privacy policies before providing them with your information.

CHANGES TO THIS PRIVACY POLICY

${entity === 'I' ? 'I may update' : 'We may update'} this Privacy Policy from time to time. ${entity === 'I' ? 'I will notify' : 'We will notify'} you of material changes by posting the updated policy on this page with a revised "Last Updated" date. For significant changes, ${entity} may also send notice via email. Your continued use of the Service after changes are posted constitutes acceptance.

CONTACT US

If you have questions, concerns, or requests regarding this Privacy Policy or ${entityPossessive} data practices, please contact:

${f.siteName || '[COMPANY NAME]'}${f.contactAddress ? '\n' + f.contactAddress : ''}
Email: ${f.email || '[EMAIL]'}${f.siteUrl ? '\nWebsite: ' + f.siteUrl : ''}${f.state ? '\nJurisdiction: ' + f.state + (f.country && f.country !== 'US' ? ', ' + f.country : ', United States') : ''}`

  return doc
}

export default function PrivacyPolicyClient() {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [email, setEmail] = useState('')
  const [companyType, setCompanyType] = useState('company')
  const [state, setState] = useState('California')
  const [country, _setCountry] = useState('US')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [contactAddress, setContactAddress] = useState('')

  const [collects, setCollects] = useState<string[]>(['email', 'analytics', 'device'])
  const [retentionPeriod, setRetentionPeriod] = useState('3 years')

  const [gdpr, setGdpr] = useState(false)
  const [ccpa, setCcpa] = useState(false)
  const [coppa, setCoppa] = useState(false)

  const [cookies, setCookies] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [analyticsTools, setAnalyticsTools] = useState('Google Analytics')

  const [thirdParty, setThirdParty] = useState(true)
  const [thirdPartyList, setThirdPartyList] = useState('')
  const [marketing, setMarketing] = useState(false)
  const [securityMeasures, setSecurityMeasures] = useState('')

  const [copied, setCopied] = useState(false)

  const collectOptions = [
    { id: 'email', label: 'Email addresses' }, { id: 'name', label: 'Names' },
    { id: 'phone', label: 'Phone numbers' }, { id: 'payment', label: 'Payment info' },
    { id: 'location', label: 'Location data' }, { id: 'analytics', label: 'Usage analytics' },
    { id: 'device', label: 'Device info' }, { id: 'social', label: 'Social media' },
    { id: 'preferences', label: 'User preferences' },
  ]
  const toggleCollect = (id: string) => setCollects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const docText = useMemo(() => buildPrivacyPolicy({
    siteName, siteUrl, email, companyType, state, country, effectiveDate, contactAddress,
    collects, retentionPeriod, gdpr, ccpa, coppa,
    cookies, analytics, analyticsTools,
    thirdParty, thirdPartyList, marketing, securityMeasures,
  }), [siteName, siteUrl, email, companyType, state, country, effectiveDate, contactAddress, collects, retentionPeriod, gdpr, ccpa, coppa, cookies, analytics, analyticsTools, thirdParty, thirdPartyList, marketing, securityMeasures])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Privacy Policy - ${siteName || 'Draft'}</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  const stateOptions = US_STATES.map(s => ({ value: s, label: s }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* LEFT: FORM */}
      <div>
        <div style={{ ...CARD, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)', marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--accent-text-b)', lineHeight: 1.6 }}>
            <strong>Legal Disclaimer:</strong> This generates a template privacy policy for informational purposes. It is not legal advice. Ensure compliance with GDPR, CCPA, and other applicable laws with qualified legal counsel.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 1: Business Information</div>
          <div style={GRID2}>
            <Field label="Website / App Name *" value={siteName} onChange={setSiteName} placeholder="RoughTools" />
            <Select label="Entity Type" value={companyType} onChange={setCompanyType} options={[
              { value: 'company', label: 'Company / Organization' },
              { value: 'individual', label: 'Individual / Sole Proprietor' },
              { value: 'nonprofit', label: 'Nonprofit' },
            ]} />
            <Field label="Website URL" value={siteUrl} onChange={setSiteUrl} placeholder="https://yoursite.com" />
            <Field label="Contact Email *" value={email} onChange={setEmail} placeholder="privacy@yoursite.com" type="email" />
            <Field label="Mailing Address" value={contactAddress} onChange={setContactAddress} placeholder="123 Main St, City, State" />
            <Select label="Governing State" value={state} onChange={setState} options={stateOptions} />
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} placeholder={today} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 2: Data You Collect</div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select all that apply:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 8, marginBottom: 16 }}>
            {collectOptions.map(opt => (
              <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
                <input type="checkbox" checked={collects.includes(opt.id)} onChange={() => toggleCollect(opt.id)} style={{ accentColor: 'var(--brand-2)', width: 15, height: 15 }} />
                {opt.label}
              </label>
            ))}
          </div>
          <Select label="Data Retention Period" value={retentionPeriod} onChange={setRetentionPeriod} options={[
            { value: '1 year', label: '1 Year' }, { value: '2 years', label: '2 Years' },
            { value: '3 years', label: '3 Years' }, { value: '5 years', label: '5 Years' },
            { value: 'as long as account is active', label: 'Life of account' },
            { value: 'as required by law', label: 'As required by law' },
          ]} />
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 3: Cookies & Analytics</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            <Checkbox label="Use cookies" checked={cookies} onChange={setCookies} />
            <Checkbox label="Use analytics tools" checked={analytics} onChange={setAnalytics} />
            {analytics && (
              <div style={{ paddingLeft: 24 }}>
                <Select label="Analytics Provider" value={analyticsTools} onChange={setAnalyticsTools} options={[
                  { value: 'Google Analytics', label: 'Google Analytics (UA)' },
                  { value: 'Google Analytics 4', label: 'Google Analytics 4 (GA4)' },
                  { value: 'Plausible Analytics', label: 'Plausible Analytics' },
                  { value: 'Mixpanel', label: 'Mixpanel' },
                  { value: 'Amplitude', label: 'Amplitude' },
                  { value: 'Hotjar', label: 'Hotjar' },
                  { value: 'PostHog', label: 'PostHog' },
                ]} />
              </div>
            )}
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 4: Data Sharing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            <Checkbox label="Share data with third-party service providers" checked={thirdParty} onChange={setThirdParty} />
            {thirdParty && (
              <div style={{ paddingLeft: 24 }}>
                <label style={LABEL}>List Services (one per line, optional)</label>
                <textarea style={TEXTAREA} value={thirdPartyList} onChange={e => setThirdPartyList(e.target.value)}
                  placeholder={'Stripe (payment processing)\nSendGrid (email delivery)\nAWS (cloud hosting)'} />
              </div>
            )}
            <Checkbox label="Send marketing / promotional emails to users" checked={marketing} onChange={setMarketing} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Step 5: Compliance & Security</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <Checkbox label="GDPR compliance (EU / UK users)" checked={gdpr} onChange={setGdpr} />
            <Checkbox label="CCPA compliance (California residents)" checked={ccpa} onChange={setCcpa} />
            <Checkbox label="COPPA — service directed at children under 13" checked={coppa} onChange={setCoppa} />
          </div>
          <Field label="Security Measures (optional)" value={securityMeasures} onChange={setSecurityMeasures}
            placeholder="SSL/TLS encryption, two-factor authentication, regular audits"
            hint="Briefly describe your security practices for inclusion in the policy" />
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
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Privacy Policy</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>
            {siteName || '[Site Name]'} · {effectiveDate || today}
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Policy Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Data Categories', value: collects.length > 0 ? `${collects.length} types selected` : 'None' },
              { label: 'Retention Period', value: retentionPeriod },
              { label: 'Cookies', value: cookies ? 'Yes' : 'No' },
              { label: 'Analytics', value: analytics ? analyticsTools : 'None' },
              { label: 'Third-Party Sharing', value: thirdParty ? 'Yes (with providers)' : 'No' },
              { label: 'Marketing Emails', value: marketing ? 'Yes (opt-out available)' : 'No' },
              { label: 'GDPR', value: gdpr ? 'Included' : 'Not included' },
              { label: 'CCPA', value: ccpa ? 'Included' : 'Not included' },
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
