'use client'
import { useState, useMemo } from 'react'
import type { CSSProperties } from 'react'

const CARD: CSSProperties = { background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }
const LABEL: CSSProperties = { display: 'block', marginBottom: 5, fontSize: 12, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }
const INPUT: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line-strong)', color: 'var(--fg)', fontSize: 14, boxSizing: 'border-box' }
const TEXTAREA: CSSProperties = { ...INPUT as object, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' } as CSSProperties
const BTN: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-3)', border: '1px solid var(--line-strong)', borderRadius: 8, padding: '9px 18px', color: 'var(--brand-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const BTN_PRIMARY: CSSProperties = { ...BTN as object, background: 'var(--brand-2)', border: 'none', color: '#fff' } as CSSProperties
const SECTION_HDR: CSSProperties = { fontSize: 13, fontWeight: 700, color: 'var(--brand-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--line-strong)' }
const GRID2: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const STATE_DISCLOSURES: Record<string, string[]> = {
  California: ['Lead-based paint disclosure required for pre-1978 properties','Mold and air quality disclosure required','Smoke detector and CO detector compliance required','Bedbug history disclosure required if known','Security deposit limited to 2 months rent (unfurnished), 3 months (furnished)'],
  'New York': ['Lead-based paint disclosure required for pre-1978 properties','Window guard notice required if children under 10 present','Mold disclosure required','Security deposit limited to 1 month rent (most residential leases)'],
  Texas: ['Lead-based paint disclosure required for pre-1978 properties','Written notice of landlord name and address required','Security deposit return within 30 days of lease end','Smoke detectors required by law'],
  Florida: ['Lead-based paint disclosure required for pre-1978 properties','Landlord must provide written receipt for security deposits','Seven-day notice to cure for most lease violations','Radon gas disclosure required'],
  Illinois: ['Lead-based paint disclosure required for pre-1978 properties','Chicago RLTO may apply for Chicago properties','Security deposit interest required for 25+ unit buildings'],
  Washington: ['Lead-based paint disclosure required for pre-1978 properties','Move-in checklist required','Mold disclosure required','Security deposit return within 21 days'],
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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: '#8b5cf6', width: 15, height: 15 }} />
      {label}
    </label>
  )
}

function buildLease(f: {
  propertyAddress: string; propertyCity: string; propertyState: string; propertyZip: string
  propertyType: string; sqft: string; furnished: string
  landlordName: string; landlordAddress: string; landlordCity: string; landlordState: string; landlordEmail: string; landlordPhone: string
  tenants: string
  startDate: string; endDate: string; monthToMonth: boolean
  monthlyRent: string; securityDeposit: string; lateFee: string; gracePeriodDays: string
  rentDueDay: string; paymentMethod: string; proratedFirstMonth: boolean
  electricity: boolean; gas: boolean; water: boolean; internet: boolean; trash: boolean
  petsAllowed: string; petDeposit: string; smokingAllowed: boolean; maxGuestStay: string; sublettingAllowed: boolean
  earlyTermFee: string; renewalTerms: string; hoaRules: boolean; parking: string; maintenanceNotes: string
}): string {
  const tenantList = f.tenants.split('\n').filter(t => t.trim()).map(t => t.trim())
  const tenantStr = tenantList.length === 0 ? '[TENANT NAME(S)]' : tenantList.join(', ')
  const propFullAddr = [f.propertyAddress, f.propertyCity, f.propertyState, f.propertyZip].filter(Boolean).join(', ')
  const landlordFullAddr = [f.landlordAddress, f.landlordCity, f.landlordState].filter(Boolean).join(', ')
  const utilities: string[] = []
  if (f.electricity) utilities.push('Electricity')
  if (f.gas) utilities.push('Gas')
  if (f.water) utilities.push('Water/Sewer')
  if (f.internet) utilities.push('Internet')
  if (f.trash) utilities.push('Trash/Recycling')

  return `RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement (this "Agreement" or "Lease") is entered into as of ${f.startDate || '[DATE]'}, between:

LANDLORD:
${f.landlordName || '[LANDLORD NAME]'}
${landlordFullAddr ? landlordFullAddr + '\n' : ''}${f.landlordEmail ? 'Email: ' + f.landlordEmail + '\n' : ''}${f.landlordPhone ? 'Phone: ' + f.landlordPhone + '\n' : ''}
TENANT(S):
${tenantStr}

PROPERTY:
${propFullAddr || '[PROPERTY ADDRESS]'}
Property Type: ${f.propertyType === 'residential' ? 'Residential' : 'Commercial'} | ${f.sqft ? f.sqft + ' sq ft | ' : ''}${f.furnished === 'furnished' ? 'Furnished' : f.furnished === 'partially' ? 'Partially Furnished' : 'Unfurnished'}

ARTICLE 1: LEASE TERM

${f.monthToMonth
  ? 'This Lease shall commence on ' + (f.startDate || '[START DATE]') + ' and shall continue on a month-to-month basis until terminated by either party upon thirty (30) days\' written notice.'
  : 'This Lease shall commence on ' + (f.startDate || '[START DATE]') + ' and shall expire on ' + (f.endDate || '[END DATE]') + ' ("Lease Term"), unless sooner terminated in accordance with this Agreement.'}

ARTICLE 2: RENT

2.1 Monthly Rent. Tenant agrees to pay Landlord the sum of $${f.monthlyRent || '______'} per month as rent for the Property ("Monthly Rent").

2.2 Due Date. Rent is due on the ${f.rentDueDay || '1st'} day of each calendar month.

2.3 Payment Method. Rent shall be paid by ${f.paymentMethod || 'check, money order, or electronic transfer'}.

2.4 Late Fee. If rent is not received within ${f.gracePeriodDays || '5'} days of the due date, a late fee of $${f.lateFee || '______'} shall be assessed. This fee is in addition to the rent due and does not constitute permission to pay rent late.
${f.proratedFirstMonth ? '\n2.5 Prorated First Month. The first month\'s rent shall be prorated based on the commencement date of this Lease.\n' : ''}
ARTICLE 3: SECURITY DEPOSIT

3.1 Amount. Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $${f.securityDeposit || '______'} as a security deposit ("Security Deposit").

3.2 Purpose. The Security Deposit shall be held as security for Tenant's faithful performance of all obligations under this Lease. Tenant may not apply the Security Deposit as rent.

3.3 Return. The Security Deposit, less lawful deductions, shall be returned to Tenant within the period required by applicable state law after Tenant vacates, along with an itemized statement of deductions.

3.4 Deductions. Landlord may deduct for: (a) unpaid rent or other charges; (b) damage beyond normal wear and tear; (c) cleaning costs; and (d) other amounts permitted by law.

ARTICLE 4: UTILITIES AND SERVICES

4.1 Landlord-Provided Utilities. The following utilities are included in the Monthly Rent: ${utilities.length > 0 ? utilities.join(', ') : 'None — Tenant is responsible for all utilities'}.

4.2 Tenant-Provided Utilities. Tenant is responsible for establishing and paying all costs for utilities not listed above, including any connection or activation fees.

ARTICLE 5: USE OF PROPERTY

5.1 Residential Use. Tenant shall use the Property solely for residential purposes and as a private dwelling. No commercial activity is permitted without Landlord's prior written consent.

5.2 Pets. ${f.petsAllowed === 'no' ? 'No pets are permitted on the Property without the prior written consent of Landlord.' : f.petsAllowed === 'yes' ? `Pets are permitted. Tenant shall pay a pet deposit of $${f.petDeposit || '______'}. Tenant is responsible for all damages caused by pets. Landlord reserves the right to revoke pet privileges if pets become a nuisance.` : `Pets require prior written approval from Landlord. A pet deposit of $${f.petDeposit || '______'} is required upon approval.`}

5.3 Smoking. Smoking ${f.smokingAllowed ? 'is permitted only in designated outdoor areas. No smoking is permitted inside the Property or within 25 feet of any entrance or window.' : 'of any substance — including cigarettes, cigars, pipes, vaping devices, and marijuana — is strictly prohibited inside the Property and within 25 feet of any entrance.'}

5.4 Guests. Guests may not stay at the Property for more than ${f.maxGuestStay || '14'} consecutive days or 30 total days in any 12-month period without Landlord's prior written approval. Unauthorized occupants constitute a material breach of this Lease.

5.5 Subletting. Tenant ${f.sublettingAllowed ? 'may sublet the Property only with Landlord\'s prior written consent, which shall not be unreasonably withheld.' : 'shall not sublet all or any portion of the Property, nor assign this Lease, without Landlord\'s prior written consent, which may be withheld in Landlord\'s sole discretion.'}

ARTICLE 6: MAINTENANCE AND REPAIRS

6.1 Landlord Obligations. Landlord shall maintain the Property in habitable condition, including structural components, plumbing, electrical systems, heating/cooling systems, and common areas in good working order as required by applicable law.

6.2 Tenant Obligations. Tenant shall: (a) keep the Property in clean and sanitary condition; (b) properly dispose of all garbage and recyclables; (c) promptly report any damage or maintenance issues to Landlord in writing; (d) not intentionally or negligently damage the Property or fixtures; and (e) handle minor maintenance costing less than $${f.maintenanceNotes || '100'} such as replacing light bulbs, batteries in smoke detectors, and minor caulking.

6.3 Tenant Damage. Tenant shall be liable for all damage to the Property caused by Tenant, Tenant's guests, occupants, or pets, beyond normal wear and tear.
${f.hoaRules ? '\n6.4 HOA Compliance. The Property is subject to a Homeowners Association (HOA). Tenant agrees to comply with all HOA rules and regulations, as may be amended from time to time. HOA fines imposed due to Tenant\'s violation of HOA rules shall be Tenant\'s sole responsibility.\n' : ''}
${f.parking ? `\nARTICLE 7: PARKING\n\n${f.parking}\n` : ''}
ARTICLE 8: ENTRY BY LANDLORD

Landlord or Landlord's agents may enter the Property at reasonable times upon 24-hour advance written notice for: inspections, repairs, improvements, showing the Property to prospective tenants or buyers, or other lawful purposes. In case of emergency, Landlord may enter without notice to prevent injury or property damage.

ARTICLE 9: EARLY TERMINATION
${f.earlyTermFee
  ? `\n9.1 Early Termination Fee. If Tenant terminates this Lease before the Lease Term expires, Tenant shall pay an early termination fee of $${f.earlyTermFee} in addition to rent owed through the termination date.\n\n9.2 Mitigation. Landlord shall make commercially reasonable efforts to re-rent the Property. Early termination fee shall be reduced by rent collected from a successor tenant.\n`
  : '\n9.1 No Early Termination Right. This Lease does not provide a right of early termination. Tenant remains responsible for rent through the end of the Lease Term unless Landlord agrees in writing to release Tenant from this obligation.\n'}
ARTICLE 10: RENEWAL AND HOLDOVER
${f.renewalTerms
  ? `\n${f.renewalTerms}\n`
  : '\nUnless either party provides written notice of non-renewal at least 30 days before expiration, this Lease shall convert to a month-to-month tenancy upon the same terms and conditions. Either party may then terminate with 30 days written notice.\n'}
If Tenant remains in possession after the Lease Term without a written renewal agreement, Tenant shall be a holdover tenant on a month-to-month basis, and Landlord may accept or refuse rent at its discretion.

ARTICLE 11: LEAD-BASED PAINT DISCLOSURE

If the Property was built before 1978, Tenant acknowledges receipt of the EPA-required pamphlet "Protect Your Family From Lead In Your Home" and any known lead-based paint hazard disclosures for the Property.

ARTICLE 12: DEFAULT AND REMEDIES

12.1 Tenant Default. Tenant shall be in default if: (a) Tenant fails to pay rent when due; (b) Tenant materially breaches any term of this Lease; (c) Tenant abandons the Property; or (d) Tenant becomes bankrupt or insolvent.

12.2 Landlord Remedies. Upon Tenant default, Landlord may terminate this Lease and pursue all remedies available under applicable law, including eviction, recovery of unpaid rent, and damages.

ARTICLE 13: GENERAL PROVISIONS

13.1 Entire Agreement. This Lease is the entire agreement between the parties and supersedes all prior negotiations and representations.

13.2 Governing Law. This Lease shall be governed by the laws of the State of ${f.propertyState || '[STATE]'}.

13.3 Severability. If any provision is unenforceable, the remaining provisions remain in effect.

13.4 Notices. All notices shall be in writing delivered by certified mail, hand delivery, or email with acknowledgment.

13.5 Joint and Several Liability. If more than one person is named as Tenant, each is jointly and severally liable for all obligations under this Lease.

IN WITNESS WHEREOF, the parties have executed this Lease Agreement as of the date first written above.

LANDLORD:

Signature: _________________________________
Printed Name: ${f.landlordName || '________________________________'}
Date: _________________________________


TENANT(S):

Signature: _________________________________
Printed Name: ${tenantList[0] || '________________________________'}
Date: _________________________________
${tenantList.slice(1).map(t => `\nSignature: _________________________________\nPrinted Name: ${t}\nDate: _________________________________\n`).join('')}
`
}

export default function LeaseClient() {
  const today = new Date().toISOString().split('T')[0]
  const twelveMonths = new Date(); twelveMonths.setMonth(twelveMonths.getMonth() + 12)
  const endDefault = twelveMonths.toISOString().split('T')[0]

  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertyCity, setPropertyCity] = useState('')
  const [propertyState, setPropertyState] = useState('California')
  const [propertyZip, setPropertyZip] = useState('')
  const [propertyType, setPropertyType] = useState('residential')
  const [sqft, setSqft] = useState('')
  const [furnished, setFurnished] = useState('unfurnished')
  const [landlordName, setLandlordName] = useState('')
  const [landlordAddress, setLandlordAddress] = useState('')
  const [landlordCity, setLandlordCity] = useState('')
  const [landlordState, setLandlordState] = useState('California')
  const [landlordEmail, setLandlordEmail] = useState('')
  const [landlordPhone, setLandlordPhone] = useState('')
  const [tenants, setTenants] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(endDefault)
  const [monthToMonth, setMonthToMonth] = useState(false)
  const [monthlyRent, setMonthlyRent] = useState('')
  const [securityDeposit, setSecurityDeposit] = useState('')
  const [lateFee, setLateFee] = useState('')
  const [gracePeriodDays, setGracePeriodDays] = useState('5')
  const [rentDueDay, setRentDueDay] = useState('1st')
  const [paymentMethod, setPaymentMethod] = useState('check, money order, or electronic transfer')
  const [proratedFirstMonth, setProratedFirstMonth] = useState(false)
  const [electricity, setElectricity] = useState(false)
  const [gas, setGas] = useState(false)
  const [water, setWater] = useState(false)
  const [internet, setInternet] = useState(false)
  const [trash, setTrash] = useState(false)
  const [petsAllowed, setPetsAllowed] = useState('no')
  const [petDeposit, setPetDeposit] = useState('')
  const [smokingAllowed, setSmokingAllowed] = useState(false)
  const [maxGuestStay, setMaxGuestStay] = useState('14')
  const [sublettingAllowed, setSublettingAllowed] = useState(false)
  const [earlyTermFee, setEarlyTermFee] = useState('')
  const [renewalTerms, setRenewalTerms] = useState('')
  const [hoaRules, setHoaRules] = useState(false)
  const [parking, setParking] = useState('')
  const [maintenanceNotes, setMaintenanceNotes] = useState('100')
  const [copied, setCopied] = useState(false)

  const docText = useMemo(() => buildLease({ propertyAddress, propertyCity, propertyState, propertyZip, propertyType, sqft, furnished, landlordName, landlordAddress, landlordCity, landlordState, landlordEmail, landlordPhone, tenants, startDate, endDate, monthToMonth, monthlyRent, securityDeposit, lateFee, gracePeriodDays, rentDueDay, paymentMethod, proratedFirstMonth, electricity, gas, water, internet, trash, petsAllowed, petDeposit, smokingAllowed, maxGuestStay, sublettingAllowed, earlyTermFee, renewalTerms, hoaRules, parking, maintenanceNotes }), [propertyAddress, propertyCity, propertyState, propertyZip, propertyType, sqft, furnished, landlordName, landlordAddress, landlordCity, landlordState, landlordEmail, landlordPhone, tenants, startDate, endDate, monthToMonth, monthlyRent, securityDeposit, lateFee, gracePeriodDays, rentDueDay, paymentMethod, proratedFirstMonth, electricity, gas, water, internet, trash, petsAllowed, petDeposit, smokingAllowed, maxGuestStay, sublettingAllowed, earlyTermFee, renewalTerms, hoaRules, parking, maintenanceNotes])

  const handleCopy = () => { navigator.clipboard.writeText(docText); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handlePrint = () => {
    const win = window.open('', '_blank'); if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Lease Agreement</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:60px 80px;color:#000;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-family:Georgia,serif}</style></head><body><pre>${docText}</pre></body></html>`)
    win.document.close(); win.onload = () => win.print()
  }

  const stateOptions = [{ value: '', label: 'Select State' }, ...US_STATES.map(s => ({ value: s, label: s }))]
  const stateDisclosures = STATE_DISCLOSURES[propertyState] || ['Lead-based paint disclosure required for pre-1978 properties', 'Comply with all applicable state landlord-tenant laws']
  const utilitiesIncluded = [electricity && 'Electricity', gas && 'Gas', water && 'Water', internet && 'Internet', trash && 'Trash'].filter(Boolean).join(', ')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        <div style={{ ...CARD, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)', marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--accent-text-b)', lineHeight: 1.6 }}>
            <strong>Legal Disclaimer:</strong> This lease template is for general informational purposes only. Landlord-tenant laws vary significantly by state and municipality. Consult a licensed real estate attorney in your state before executing any lease agreement.
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Property Details</div>
          <div style={GRID2}>
            <div style={{ gridColumn: '1/-1' }}><Field label="Street Address" value={propertyAddress} onChange={setPropertyAddress} placeholder="123 Main Street, Apt 4B" /></div>
            <Field label="City" value={propertyCity} onChange={setPropertyCity} placeholder="Los Angeles" />
            <Select label="State" value={propertyState} onChange={setPropertyState} options={stateOptions} />
            <Field label="ZIP Code" value={propertyZip} onChange={setPropertyZip} placeholder="90001" />
            <Select label="Property Type" value={propertyType} onChange={setPropertyType} options={[{ value: 'residential', label: 'Residential' }, { value: 'commercial', label: 'Commercial' }]} />
            <Field label="Square Footage" value={sqft} onChange={setSqft} placeholder="800" type="number" />
            <Select label="Furnished Status" value={furnished} onChange={setFurnished} options={[{ value: 'unfurnished', label: 'Unfurnished' }, { value: 'furnished', label: 'Furnished' }, { value: 'partially', label: 'Partially Furnished' }]} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Parties</div>
          <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase' }}>Landlord</div>
          <div style={GRID2}>
            <Field label="Full Name / Company" value={landlordName} onChange={setLandlordName} placeholder="Jane Smith" />
            <Field label="Email" value={landlordEmail} onChange={setLandlordEmail} placeholder="landlord@example.com" type="email" />
            <Field label="Phone" value={landlordPhone} onChange={setLandlordPhone} placeholder="555-000-0000" />
            <Field label="Mailing Address" value={landlordAddress} onChange={setLandlordAddress} placeholder="456 Oak Ave" />
            <Field label="City" value={landlordCity} onChange={setLandlordCity} placeholder="Los Angeles" />
            <Select label="State" value={landlordState} onChange={setLandlordState} options={stateOptions} />
          </div>
          <div style={{ marginTop: 20, marginBottom: 10, fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase' }}>Tenant(s)</div>
          <div>
            <label style={LABEL}>Tenant Full Names (one per line)</label>
            <textarea style={TEXTAREA} value={tenants} onChange={e => setTenants(e.target.value)} placeholder={'John Doe\nJane Doe'} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Lease Terms</div>
          <div style={{ marginBottom: 12 }}><Checkbox label="Month-to-month lease (no fixed end date)" checked={monthToMonth} onChange={setMonthToMonth} /></div>
          <div style={GRID2}>
            <Field label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            {!monthToMonth && <Field label="End Date" value={endDate} onChange={setEndDate} type="date" />}
            <Field label="Monthly Rent ($)" value={monthlyRent} onChange={setMonthlyRent} placeholder="1500" type="number" />
            <Field label="Security Deposit ($)" value={securityDeposit} onChange={setSecurityDeposit} placeholder="1500" type="number" />
            <Field label="Late Fee ($)" value={lateFee} onChange={setLateFee} placeholder="100" type="number" />
            <Field label="Grace Period (days)" value={gracePeriodDays} onChange={setGracePeriodDays} placeholder="5" type="number" />
            <Select label="Rent Due Date" value={rentDueDay} onChange={setRentDueDay} options={['1st','2nd','3rd','4th','5th','10th','15th'].map(d => ({ value: d, label: d + ' of each month' }))} />
            <Select label="Payment Method" value={paymentMethod} onChange={setPaymentMethod} options={[
              { value: 'check, money order, or electronic transfer', label: 'Check / Money Order / Electronic' },
              { value: 'check or money order only', label: 'Check or Money Order only' },
              { value: 'electronic transfer (ACH/Zelle/Venmo) only', label: 'Electronic Transfer only' },
              { value: 'online portal only', label: 'Online Portal only' },
            ]} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Checkbox label="Prorate first month's rent based on start date" checked={proratedFirstMonth} onChange={setProratedFirstMonth} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Utilities Included in Rent</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            <Checkbox label="Electricity" checked={electricity} onChange={setElectricity} />
            <Checkbox label="Gas / Heat" checked={gas} onChange={setGas} />
            <Checkbox label="Water / Sewer" checked={water} onChange={setWater} />
            <Checkbox label="Internet" checked={internet} onChange={setInternet} />
            <Checkbox label="Trash / Recycling" checked={trash} onChange={setTrash} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Property Rules</div>
          <div style={GRID2}>
            <Select label="Pets Policy" value={petsAllowed} onChange={setPetsAllowed} options={[{ value: 'no', label: 'No Pets' }, { value: 'yes', label: 'Pets Allowed' }, { value: 'approval', label: 'Pets with Prior Written Approval' }]} />
            {petsAllowed !== 'no' && <Field label="Pet Deposit ($)" value={petDeposit} onChange={setPetDeposit} placeholder="500" type="number" />}
            <Field label="Max Guest Stay (consecutive days)" value={maxGuestStay} onChange={setMaxGuestStay} placeholder="14" type="number" />
            <Field label="Tenant Minor Maintenance Threshold ($)" value={maintenanceNotes} onChange={setMaintenanceNotes} placeholder="100" type="number" hint="Minor repairs up to this amount are tenant's responsibility" />
            <Field label="Parking Details" value={parking} onChange={setParking} placeholder="1 assigned space included" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            <Checkbox label="Smoking permitted (outdoor only)" checked={smokingAllowed} onChange={setSmokingAllowed} />
            <Checkbox label="Subletting allowed (with written approval)" checked={sublettingAllowed} onChange={setSublettingAllowed} />
            <Checkbox label="Property subject to HOA rules" checked={hoaRules} onChange={setHoaRules} />
          </div>
        </div>

        <div style={CARD}>
          <div style={SECTION_HDR}>Advanced Terms</div>
          <div style={GRID2}>
            <Field label="Early Termination Fee ($)" value={earlyTermFee} onChange={setEarlyTermFee} placeholder="2000" type="number" hint="Leave blank to exclude" />
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={LABEL}>Renewal Terms (optional)</label>
            <textarea style={TEXTAREA} value={renewalTerms} onChange={e => setRenewalTerms(e.target.value)} placeholder="Lease renews for 12-month terms unless either party gives 60-day notice of non-renewal. Rent may be adjusted upon renewal with 60-day written notice." />
          </div>
        </div>

        <div style={{ ...CARD, background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            {propertyState} Required Disclosures
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {stateDisclosures.map((d, i) => <li key={i} style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6 }}>{d}</li>)}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleCopy} style={BTN_PRIMARY}>{copied ? '✓ Copied!' : '📋 Copy Full Text'}</button>
          <button onClick={handlePrint} style={BTN}>🖨 Print / Download PDF</button>
        </div>
      </div>

      <div style={{ position: 'sticky', top: 20 }}>
        <div style={{ ...CARD, background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Document Preview</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-2)' }}>Residential Lease Agreement</div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>{propertyAddress || '[Property Address]'} · {propertyState}</div>
        </div>
        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Key Terms</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Monthly Rent', value: monthlyRent ? '$' + parseInt(monthlyRent).toLocaleString() : 'Not set' },
              { label: 'Security Deposit', value: securityDeposit ? '$' + parseInt(securityDeposit).toLocaleString() : 'Not set' },
              { label: 'Lease Type', value: monthToMonth ? 'Month-to-Month' : `Fixed (${startDate} to ${endDate})` },
              { label: 'Late Fee', value: lateFee ? `$${lateFee} after ${gracePeriodDays} days` : 'Not set' },
              { label: 'Pets', value: petsAllowed === 'no' ? 'Not allowed' : petsAllowed === 'yes' ? `Allowed (deposit: $${petDeposit || 'TBD'})` : 'With approval' },
              { label: 'Utilities Included', value: utilitiesIncluded || 'None' },
              { label: 'Smoking', value: smokingAllowed ? 'Outdoor only' : 'Prohibited' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--fg-3)' }}>{row.label}</span>
                <span style={{ color: 'var(--fg-2)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', maxHeight: 600, overflowY: 'auto' }}>
          <div style={{ background: 'white', color: '#000', padding: '60px 80px', fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: '11pt', whiteSpace: 'pre-wrap', maxWidth: 800, margin: '0 auto' }}>
            {docText}
          </div>
        </div>
      </div>
    </div>
  )
}
