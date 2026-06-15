// Legal tool configuration — rich per-tool data for all 8 legal tools.
// Each config drives LegalToolShell: hero, document structure, quick ref,
// about text, how-to steps, when-to-use cards, pro tips, FAQs, related tools.

export interface DocumentStructureVariable {
  field: string
  meaning: string
}

export interface DocumentStructure {
  title: string
  content: string
  variables: DocumentStructureVariable[]
  note: string
}

export interface HowToStep {
  name: string
  text: string
}

export interface WhenToUseCard {
  icon: string
  title: string
  description: string
}

export interface QuickRefRow {
  field: string
  description: string
  example: string
}

export interface RelatedTool {
  slug: string
  name: string
  icon: string
  description: string
}

export interface LegalToolConfig {
  icon: string
  categoryIcon: string
  categoryLabel: string
  description: string
  metaTitle: string
  metaDescription: string
  documentStructure: DocumentStructure
  howToSteps: HowToStep[]
  whenToUseCards: WhenToUseCard[]
  proTips: string[]
  quickRefRows: QuickRefRow[]
  aboutParagraphs: (toolName: string) => string[]
  faqs: Array<{ q: string; a: string }>
  relatedTools: RelatedTool[]
}

// ─── NDA Generator ────────────────────────────────────────────────────────────

const ndaConfig: LegalToolConfig = {
  icon: '🤝',
  categoryIcon: '💼',
  categoryLabel: 'Business Documents',
  description: 'Create a free non-disclosure agreement (NDA) for mutual or one-way confidentiality in minutes. Customizable template with legally standard language — no signup required.',
  metaTitle: 'NDA Generator – Free Non-Disclosure Agreement Template | RoughTools',
  metaDescription: 'Create a free non-disclosure agreement (NDA) online in minutes. Customizable mutual and one-way NDA template with standard confidentiality clauses. Download instantly.',
  documentStructure: {
    title: 'NDA Document Structure',
    content: `NON-DISCLOSURE AGREEMENT

1. PARTIES
   Disclosing Party: [Name / Company]
   Receiving Party:  [Name / Company]

2. DEFINITION OF CONFIDENTIAL INFORMATION
   — What counts as confidential (trade secrets, financials, code, etc.)
   — What is excluded (publicly known info, independently developed, etc.)

3. OBLIGATIONS OF RECEIVING PARTY
   — Duty to keep information confidential
   — Permitted use (purpose restriction)
   — No reverse engineering / copying

4. TERM & DURATION
   — Agreement effective date
   — Duration of confidentiality obligation (e.g. 2 years)

5. RETURN OR DESTRUCTION OF INFORMATION
6. REMEDIES — Injunctive relief clause
7. GOVERNING LAW & JURISDICTION
8. SIGNATURES`,
    variables: [
      { field: 'Disclosing Party', meaning: 'The party sharing confidential information' },
      { field: 'Receiving Party', meaning: 'The party receiving and agreeing to protect the information' },
      { field: 'Confidential Information', meaning: 'Specifically defined scope of protected information' },
      { field: 'Purpose', meaning: 'The permitted reason for sharing the information' },
      { field: 'Term', meaning: 'How long the agreement and confidentiality duty lasts' },
      { field: 'Governing Law', meaning: 'The jurisdiction whose laws interpret the agreement' },
    ],
    note: 'A mutual NDA binds both parties equally. A one-way NDA only binds the receiving party. Choose based on whether information flows in one direction or both.',
  },
  howToSteps: [
    { name: 'Choose NDA type', text: 'Select "Mutual" if both parties will share confidential information (e.g. two businesses exploring a joint venture). Select "One-Way" if only one party is disclosing (e.g. sharing your idea with a contractor).' },
    { name: 'Enter party details', text: 'Input the full legal names of both the disclosing party and the receiving party. For companies, use the registered legal entity name, not a trade name.' },
    { name: 'Define the confidential information', text: 'Describe what information is being protected — be specific. Broad definitions increase enforceability but may create obligations you did not intend. Exclude publicly known information.' },
    { name: 'Set the term and purpose', text: 'Specify the permitted purpose (e.g. "evaluating a potential business relationship") and the duration of the confidentiality obligation. Most NDAs run 1–5 years; trade secrets may be protected indefinitely.' },
    { name: 'Review, download, and sign', text: 'Preview the generated document carefully. Both parties should sign — ideally with dated wet or electronic signatures. Keep a copy for your records and provide one to the other party.' },
  ],
  whenToUseCards: [
    { icon: '💡', title: 'Sharing a business idea', description: 'Presenting an invention, startup concept, or product idea to potential investors, partners, or manufacturers before a deal is signed.' },
    { icon: '👩‍💻', title: 'Hiring freelancers or contractors', description: 'Before sharing proprietary code, client data, or internal processes with an outside developer, designer, or consultant.' },
    { icon: '🤝', title: 'Business negotiations', description: 'During M&A due diligence, licensing discussions, or partnership exploration when both parties exchange sensitive financials or strategy documents.' },
    { icon: '🔬', title: 'Research & development', description: 'When collaborating with research institutions, universities, or co-developers and sharing unpublished discoveries or proprietary formulas.' },
    { icon: '👥', title: 'New employees', description: 'As part of onboarding — particularly for roles that involve access to trade secrets, client lists, or proprietary technology not covered by a standard employment contract.' },
  ],
  proTips: [
    'Always specify the purpose of disclosure — courts are more likely to enforce NDAs that clearly limit how confidential information can be used, not just that it must be kept secret.',
    'Include a residuals clause only if you need it: it allows the receiving party to use information retained in unaided memory, which weakens protection but is standard in some tech industries.',
    'Consider "return or destroy" provisions carefully. Requiring destruction of all copies is increasingly impractical with cloud storage — specify a reasonable procedure.',
    'If the other party insists on significant changes to your NDA, treat that as a negotiation signal and involve an attorney before signing — major redlines can signal future disputes.',
  ],
  quickRefRows: [
    { field: 'Mutual NDA', description: 'Both parties share and protect confidential information', example: 'Two startups exploring a merger' },
    { field: 'One-Way NDA', description: 'Only the disclosing party shares; receiving party must protect', example: 'Sharing source code with a freelancer' },
    { field: 'Trade Secret', description: 'Information with commercial value kept secret — protected indefinitely', example: 'Proprietary algorithm or formula' },
    { field: 'Term', description: 'Duration the receiving party must maintain confidentiality', example: '2 years from signing date' },
    { field: 'Governing Law', description: 'Jurisdiction whose courts resolve disputes', example: 'State of Delaware, USA' },
    { field: 'Injunctive Relief', description: 'A court order to stop a breach — faster than waiting for damages', example: 'Emergency court injunction to stop disclosure' },
  ],
  aboutParagraphs: (name) => [
    `A Non-Disclosure Agreement (NDA) is one of the most widely used legal documents in business. It creates a binding confidentiality obligation — the receiving party agrees that they will not disclose or misuse the information you share with them. The ${name} lets you create a standard NDA document in minutes without needing a lawyer for routine, low-stakes situations.`,
    `NDAs are enforceable in most jurisdictions, but enforceability depends heavily on how well-drafted the agreement is. Courts look for specificity: agreements that vaguely protect "all information" are weaker than those that describe specific categories of confidential data. They also look for a legitimate business purpose, a reasonable duration, and fair notice to the receiving party.`,
    `While template NDAs are suitable for many everyday situations — freelancer agreements, early-stage business discussions, or employee onboarding — they are not a substitute for legal counsel in high-stakes contexts. If the potential disclosure involves trade secrets worth significant revenue, complex multi-party relationships, or cross-border jurisdiction issues, consult a licensed attorney.`,
  ],
  faqs: [
    { q: 'What is an NDA?', a: 'A Non-Disclosure Agreement (NDA) is a legally binding contract that establishes a confidential relationship. The party or parties that sign the agreement commit to keeping the specified information secret and not disclosing it to third parties.' },
    { q: 'When do I need an NDA?', a: 'NDAs are used whenever you need to share sensitive information with someone and want legal protection against unauthorized disclosure. Common situations include: sharing a business idea with a potential investor, hiring a contractor who will access proprietary systems, or during merger and acquisition negotiations.' },
    { q: 'What is the difference between a mutual and one-way NDA?', a: 'A one-way (unilateral) NDA protects only the disclosing party — only the receiving party is bound to confidentiality. A mutual (bilateral) NDA protects both parties equally — used when both sides will share confidential information, such as in a joint venture or partnership discussion.' },
    { q: 'How long should an NDA last?', a: 'Most NDAs last between 1 and 5 years. The appropriate duration depends on the nature of the information: highly sensitive trade secrets may warrant longer terms or indefinite protection, while information that becomes public knowledge quickly may only need a short term.' },
    { q: 'Can an NDA protect a business idea?', a: 'An NDA can protect the disclosure of a business idea, but it cannot prevent the other party from independently developing a similar idea. It only prevents them from using YOUR disclosed information. Patent protection is stronger for inventions.' },
    { q: 'Are NDAs legally enforceable?', a: 'Yes, NDAs are generally enforceable if they meet basic contract requirements: offer, acceptance, consideration (something of value exchanged), and reasonably defined scope. Overly broad NDAs that attempt to prevent employees from ever working in their field may be unenforceable.' },
    { q: 'What happens if someone breaks an NDA?', a: 'If someone breaches an NDA, you can seek injunctive relief (a court order to stop the breach) and monetary damages. Many NDAs include a clause acknowledging that breach causes irreparable harm, making it easier to obtain a court injunction quickly.' },
    { q: 'Does an NDA need to be notarized?', a: 'In most jurisdictions, NDAs do not need to be notarized to be enforceable — standard signatures are sufficient. Notarization can be helpful for high-value agreements where you want stronger evidence that the document was genuinely signed.' },
    { q: 'Can I use an NDA to protect client lists?', a: 'Yes. Customer and client lists are commonly treated as confidential information and trade secrets. Your NDA should explicitly list "customer and client information, including contact details and business relationships" as confidential to be effective.' },
    { q: 'Is a verbal NDA enforceable?', a: 'Verbal NDAs are technically possible in some jurisdictions but are very difficult to enforce because there is no written proof of the terms agreed upon. Always use a written NDA for any situation where confidentiality actually matters.' },
    { q: 'What should I do if the other party wants to change the NDA?', a: 'Review all proposed changes carefully. Common requests include: limiting the definition of confidential information, adding a residuals clause, shortening the term, or changing the governing jurisdiction. For significant changes, consult an attorney.' },
    { q: 'Can this generated NDA be used internationally?', a: 'The generated NDA uses standard clauses recognized in most common-law countries (US, UK, Canada, Australia). For use in civil law countries or in situations with significant cross-border elements, have it reviewed by a local attorney to ensure compliance with local legal requirements.' },
  ],
  relatedTools: [
    { slug: 'terms-of-service-generator', name: 'Terms of Service Generator', icon: '📋', description: 'Website terms & conditions' },
    { slug: 'privacy-policy-generator', name: 'Privacy Policy Generator', icon: '🛡️', description: 'GDPR-friendly privacy policy' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Job offer letter & employment terms' },
    { slug: 'cease-and-desist-generator', name: 'Cease & Desist Generator', icon: '✋', description: 'Formal cease and desist letter' },
    { slug: 'lease-agreement-generator', name: 'Lease Agreement Generator', icon: '🏠', description: 'Residential rental contract' },
  ],
}

// ─── Terms of Service Generator ───────────────────────────────────────────────

const tosConfig: LegalToolConfig = {
  icon: '📋',
  categoryIcon: '🌐',
  categoryLabel: 'Website Documents',
  description: 'Generate free Terms of Service (ToS) for your website or app. Covers user obligations, intellectual property, disclaimers, and liability limits. Compliant with standard web practices.',
  metaTitle: 'Terms of Service Generator – Free ToS Template | RoughTools',
  metaDescription: 'Create free Terms of Service for your website or app in minutes. Covers user accounts, intellectual property, disclaimers, and liability. Download and customize instantly.',
  documentStructure: {
    title: 'Terms of Service Document Structure',
    content: `TERMS OF SERVICE

1. ACCEPTANCE OF TERMS
   — How users agree (by using the site)
   — Age requirements

2. DESCRIPTION OF SERVICE
   — What your product/service does
   — Modifications & availability

3. USER ACCOUNTS & RESPONSIBILITIES
   — Account creation, security, termination
   — Prohibited conduct

4. INTELLECTUAL PROPERTY
   — Your IP rights (logo, content, code)
   — User-generated content license

5. DISCLAIMER OF WARRANTIES
   — "As is" / "as available" service
   — No guarantee of accuracy

6. LIMITATION OF LIABILITY
   — Cap on damages
   — Excluded types of harm

7. GOVERNING LAW & DISPUTE RESOLUTION
8. PRIVACY POLICY REFERENCE
9. CHANGES TO TERMS
10. CONTACT INFORMATION`,
    variables: [
      { field: 'Service Name', meaning: 'The name of your website, app, or platform' },
      { field: 'Company Name', meaning: 'Your legal entity or operating name' },
      { field: 'Jurisdiction', meaning: 'State/country whose laws govern the agreement' },
      { field: 'Effective Date', meaning: 'When these terms take effect' },
      { field: 'Contact Email', meaning: 'How users can reach you with questions or complaints' },
      { field: 'Liability Cap', meaning: 'Maximum dollar amount of damages you accept responsibility for' },
    ],
    note: 'Terms of Service agreements are more enforceable when users are required to actively accept them (e.g. a checkbox during signup) rather than just being told "by using this site you agree."',
  },
  howToSteps: [
    { name: 'Enter your service details', text: 'Provide your company or website name, the nature of the service you offer, and the country/state whose laws will govern the agreement. These basics are embedded throughout the document.' },
    { name: 'Describe user account rules', text: 'Specify whether your service requires user accounts, the minimum age requirement (typically 13 or 18 depending on jurisdiction), and what users are prohibited from doing on your platform.' },
    { name: 'Define intellectual property scope', text: 'Clarify who owns what: your content (all rights reserved) and any user-generated content (specify if you need a license to display/distribute it). This section protects your brand and content.' },
    { name: 'Set liability limits and disclaimers', text: 'Choose your disclaimer language and liability cap. Most services disclaim all warranties and limit liability to the amount the user paid in the past 12 months — or $100, whichever is greater.' },
    { name: 'Add contact information and finalize', text: 'Include a contact email for legal notices and questions. Publish the ToS on a public URL, link to it in your site footer, and display it during signup. Update the "last modified" date whenever you make changes.' },
  ],
  whenToUseCards: [
    { icon: '🚀', title: 'Launching a website or app', description: 'Any public-facing website, SaaS product, mobile app, or marketplace should have Terms of Service before accepting users.' },
    { icon: '🛒', title: 'Running an online store', description: 'E-commerce sites need ToS to cover purchase rules, returns, shipping liability, and dispute resolution.' },
    { icon: '👥', title: 'User-generated content platforms', description: 'Blogs, forums, social platforms, or any site where users post content need clear IP and moderation terms.' },
    { icon: '📱', title: 'Mobile app submission', description: 'Apple App Store and Google Play require apps to have a valid Terms of Service and Privacy Policy before approval.' },
    { icon: '🔄', title: 'Updating outdated terms', description: 'If your ToS is more than 2–3 years old or your business model has changed, refresh it with current clauses.' },
  ],
  proTips: [
    'Host your Terms of Service at a permanent URL (e.g. yoursite.com/terms) and never change that URL — link to it in your footer, signup forms, and email footers so there is a consistent, citable reference.',
    'Add a "Changes to These Terms" clause and send users an email notice before significant changes take effect — this strengthens enforceability and builds user trust compared to silent updates.',
    'If your service is available in the EU, your ToS must comply with the Digital Services Act (DSA) and cannot simply exclude all liability for consumer harm — have EU-facing terms reviewed by a local attorney.',
    'Be specific about prohibited conduct. Vague language like "do not misuse the service" is harder to enforce than an explicit list: no scraping, no automated bots, no circumventing access controls.',
  ],
  quickRefRows: [
    { field: 'Acceptance Mechanism', description: 'How users agree to your terms (click-wrap vs. browse-wrap)', example: 'Checkbox: "I agree to the Terms of Service"' },
    { field: 'Disclaimer of Warranties', description: 'Statement that the service is provided "as is" without guarantees', example: '"We make no warranty that the service will be error-free"' },
    { field: 'Limitation of Liability', description: 'Cap on the damages a user can claim from you', example: 'Limited to fees paid in the prior 12 months' },
    { field: 'Indemnification', description: 'User agrees to cover your legal costs for their violations', example: 'User indemnifies company for UGC copyright claims' },
    { field: 'Governing Law', description: 'Which jurisdiction\'s courts and laws apply', example: 'Laws of the State of California, USA' },
    { field: 'Arbitration Clause', description: 'Requires disputes to go to arbitration instead of court', example: 'Binding arbitration under AAA rules' },
  ],
  aboutParagraphs: (name) => [
    `Terms of Service (also called Terms and Conditions or Terms of Use) is a legally binding agreement between you and every person who uses your website or application. It defines what users can and cannot do, what rights you retain over your platform and content, and how disputes will be resolved. The ${name} helps you create a solid foundational document in minutes.`,
    `A well-written ToS protects your business in several important ways: it limits your liability exposure, protects your intellectual property from being scraped or republished without permission, lets you terminate accounts of abusive users, and establishes which jurisdiction handles disputes — saving you from defending lawsuits in distant locations.`,
    `The enforceability of Terms of Service depends on how users accept them. "Click-wrap" agreements — where users must actively check a box or click "I Agree" — are the most enforceable. "Browse-wrap" agreements — where a footer link says "by using this site you agree" — offer weaker protection. For any service that processes payments, personal data, or user content, the effort to implement click-wrap acceptance is well worth it.`,
  ],
  faqs: [
    { q: 'What is a Terms of Service agreement?', a: 'A Terms of Service (ToS) is a legally binding contract between you (the service provider) and your users. It sets the rules for using your website, app, or platform — including user rights, prohibited conduct, intellectual property ownership, and how disputes are resolved.' },
    { q: 'Is a Terms of Service legally required?', a: 'No law requires most websites to have Terms of Service, but it is strongly recommended. Without ToS, you have no legal basis to terminate abusive accounts, claim ownership of your content, limit your liability, or enforce usage restrictions. For apps on the App Store or Google Play, ToS is required.' },
    { q: 'What is the difference between Terms of Service and a Privacy Policy?', a: 'Terms of Service covers the rules of using your product and limits your legal liability. A Privacy Policy specifically covers how you collect, use, store, and share personal data. They are separate documents — many regulations (GDPR, CCPA) legally require a Privacy Policy; ToS is not legally mandated in most jurisdictions but is practically essential.' },
    { q: 'Can I copy Terms of Service from another website?', a: 'Technically Terms of Service can be copied since legal documents are generally not copyrightable, but it is a bad idea. Generic copied ToS may not reflect your actual business model, may reference incorrect jurisdiction or laws, or may omit clauses you need.' },
    { q: 'How do I make my Terms of Service enforceable?', a: 'The strongest enforcement comes from active acceptance ("click-wrap"): require users to check a box confirming they have read and agree to the ToS before completing signup. Store records of when users accepted and what version they accepted.' },
    { q: 'Do I need separate Terms of Service for mobile apps?', a: 'You should have the same core ToS cover both your web and mobile apps, but your mobile app pages in the App Store / Google Play must link to the ToS and Privacy Policy. Some app-specific provisions (in-app purchases, push notifications) may need to be explicitly addressed.' },
    { q: 'What should my Terms of Service say about user content?', a: 'If users can post, upload, or share content on your platform, you need a license grant clause: "By posting content, you grant us a worldwide, royalty-free license to display, distribute, and promote your content as part of operating the service." This protects you from copyright claims for hosting their content.' },
    { q: 'How often should I update my Terms of Service?', a: 'Review your ToS annually, and update it whenever you: add new features, change your data practices, modify pricing, enter new geographic markets, or when relevant new laws are passed. Always update the "last modified" date and notify users of significant changes.' },
    { q: 'What is an arbitration clause and should I include one?', a: 'An arbitration clause requires users to resolve disputes through private arbitration instead of public court. This is popular with businesses because it is faster and cheaper than litigation. However, the enforceability of mandatory arbitration clauses varies by jurisdiction, and some countries restrict their use in consumer contracts.' },
    { q: 'Can I limit my liability to zero in my Terms of Service?', a: 'Complete liability exclusions are not enforceable in most jurisdictions for consumer-facing services. Courts and consumer protection laws typically require at least a minimum standard of care. A reasonable liability cap — such as the amount the user paid in the past 12 months — is more defensible than a complete exclusion.' },
    { q: 'Do my Terms of Service need to be translated for international users?', a: 'There is no universal requirement to translate ToS, but if you actively market to users in a specific country, local consumer protection laws may require key terms to be presented in the local language. The EU and Brazil (LGPD) have requirements around language accessibility for consumer contracts.' },
    { q: 'What happens if I do not have Terms of Service?', a: 'Without ToS, your relationship with users is governed entirely by general contract and consumer protection law — you get no extra protections. This means: you may not be able to ban users who violate policies you never wrote down, you have no IP license for user content, and you cannot rely on jurisdiction or arbitration clauses you never established.' },
  ],
  relatedTools: [
    { slug: 'privacy-policy-generator', name: 'Privacy Policy Generator', icon: '🛡️', description: 'GDPR-compliant privacy policy' },
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Non-disclosure agreement' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Hire with confidence' },
    { slug: 'cease-and-desist-generator', name: 'Cease & Desist Generator', icon: '✋', description: 'Stop IP infringement fast' },
    { slug: 'power-of-attorney-generator', name: 'Power of Attorney Generator', icon: '✍️', description: 'Authorize someone to act for you' },
  ],
}

// ─── Privacy Policy Generator ─────────────────────────────────────────────────

const privacyConfig: LegalToolConfig = {
  icon: '🛡️',
  categoryIcon: '🌐',
  categoryLabel: 'Website Documents',
  description: 'Generate a free, GDPR and CCPA-friendly Privacy Policy for your website or app. Covers data collection, use, cookies, user rights, and third-party sharing — ready in minutes.',
  metaTitle: 'Privacy Policy Generator – Free GDPR Privacy Policy Template | RoughTools',
  metaDescription: 'Create a free Privacy Policy for your website or app. GDPR and CCPA-friendly template covering data collection, cookies, user rights, and third-party sharing. Instant download.',
  documentStructure: {
    title: 'Privacy Policy Document Structure',
    content: `PRIVACY POLICY

1. INTRODUCTION & IDENTITY OF DATA CONTROLLER
   — Company name, contact details, DPO (if applicable)

2. INFORMATION WE COLLECT
   — Personal data (name, email, address, payment info)
   — Usage data (IP, browser, pages visited)
   — Cookies and tracking technologies

3. HOW WE USE YOUR INFORMATION
   — Service provision / account management
   — Marketing communications (with consent)
   — Analytics and product improvement
   — Legal compliance

4. LEGAL BASIS FOR PROCESSING (GDPR)
   — Consent / Contract / Legitimate Interest / Legal Obligation

5. DATA SHARING WITH THIRD PARTIES
   — Service providers (hosting, analytics, payment)
   — Legal requirements

6. DATA RETENTION PERIODS
7. YOUR RIGHTS (GDPR / CCPA)
   — Access, rectification, erasure, portability, objection
8. COOKIES POLICY
9. INTERNATIONAL TRANSFERS
10. CONTACT & COMPLAINTS`,
    variables: [
      { field: 'Data Controller', meaning: 'The entity that determines how personal data is processed (usually you)' },
      { field: 'Personal Data', meaning: 'Any information that can identify a living individual (name, email, IP, etc.)' },
      { field: 'Legal Basis', meaning: 'The GDPR-valid reason for processing data (consent, contract, etc.)' },
      { field: 'Retention Period', meaning: 'How long you keep personal data before deleting it' },
      { field: 'Data Processor', meaning: 'Third-party services you use that handle personal data on your behalf' },
      { field: 'DPA', meaning: 'Data Protection Authority — the regulator you report breaches to' },
    ],
    note: 'Under GDPR, you must have a valid legal basis for every category of data processing. Relying solely on consent is risky — it can be withdrawn at any time. Where possible, rely on "contract" or "legitimate interest" as your legal basis.',
  },
  howToSteps: [
    { name: 'List all data you collect', text: 'Before generating a policy, inventory every type of personal data your site/app collects: registration info, payment data, usage analytics, cookies, IP addresses, device info. The policy must accurately reflect reality.' },
    { name: 'Identify your data processors', text: 'List all third-party services you use that receive or process user data: Google Analytics, Stripe, Mailchimp, AWS, Intercom, etc. Your privacy policy must disclose these third-party processors.' },
    { name: 'Set your legal basis for processing', text: 'For each processing activity, identify the legal basis under GDPR: Consent (e.g. marketing), Contract (e.g. fulfilling an order), Legitimate Interest (e.g. fraud prevention), or Legal Obligation (e.g. tax records).' },
    { name: 'Define retention periods', text: 'Specify how long you keep different types of data before deletion: account data while the account is active plus 30 days, payment records for 7 years (tax requirements), marketing emails until unsubscription.' },
    { name: 'Publish and link prominently', text: 'Host the policy at a permanent URL (e.g. /privacy-policy). Link to it in your footer, signup forms, cookie banners, and checkout flow. Update the "last modified" date on every revision.' },
  ],
  whenToUseCards: [
    { icon: '🌍', title: 'Any website with EU visitors', description: 'GDPR applies to any website that has EU visitors, regardless of where the company is based. A Privacy Policy is legally required.' },
    { icon: '🇺🇸', title: 'California-based businesses or users', description: 'CCPA requires businesses that collect personal data from California residents (above certain thresholds) to have a compliant Privacy Policy.' },
    { icon: '📱', title: 'Mobile app stores', description: 'Both Apple App Store and Google Play require a publicly accessible Privacy Policy URL before publishing any app.' },
    { icon: '💳', title: 'Processing payments', description: 'Payment processors like Stripe require you to have a published Privacy Policy as a condition of using their services.' },
    { icon: '📧', title: 'Email marketing', description: 'CAN-SPAM (US), CASL (Canada), and GDPR (EU) all require disclosure of how you use subscriber email addresses.' },
  ],
  proTips: [
    'Conduct a Data Protection Impact Assessment (DPIA) for any high-risk processing activities (large-scale profiling, sensitive data, automated decision-making) — it is legally required under GDPR Article 35 and demonstrates due diligence.',
    'Create separate sections for cookies and use a consent management platform (CMP) for your cookie banner. Your privacy policy and cookie banner must be consistent — users who reject analytics cookies should not be tracked.',
    'If you use AI or automated decision-making that has a significant effect on users (e.g. credit decisions, content moderation), GDPR Article 22 gives users the right to human review — disclose this in your policy.',
    'Name your third-party sub-processors specifically (Google Analytics, Stripe, AWS) rather than vague language like "trusted partners." Specificity increases trust and reduces regulatory risk.',
  ],
  quickRefRows: [
    { field: 'GDPR', description: 'EU regulation governing personal data protection — applies globally to sites with EU users', example: 'Must have legal basis for each data use' },
    { field: 'CCPA', description: 'California Consumer Privacy Act — gives CA residents data rights', example: 'Right to know, delete, opt out of sale' },
    { field: 'Consent', description: 'User\'s freely given, specific, informed agreement to data processing', example: 'Marketing email opt-in checkbox' },
    { field: 'Data Breach', description: 'Unauthorized access to personal data — must be reported within 72 hours under GDPR', example: 'Notifying ICO after a database hack' },
    { field: 'Right to Erasure', description: 'User\'s right to request deletion of their personal data', example: 'User requests account and data deletion' },
    { field: 'Sub-processor', description: 'Third-party service that processes personal data on your behalf', example: 'Stripe processes payment data for you' },
  ],
  aboutParagraphs: (name) => [
    `A Privacy Policy is a legal document that tells your users what personal data you collect, why you collect it, how you use it, who you share it with, and how long you keep it. It is not optional for most websites — GDPR (EU), CCPA (California), PIPEDA (Canada), and many other privacy laws legally require it. The ${name} helps you create a comprehensive, regulation-aware document in minutes.`,
    `Privacy regulations have grown significantly stricter over the past decade. Under GDPR, violations can result in fines of up to 4% of global annual revenue or 20 million euros, whichever is higher. Under CCPA, intentional violations carry fines of $7,500 per violation. A well-drafted privacy policy is your first line of defense — it demonstrates accountability and helps avoid regulatory action.`,
    `The key to a good privacy policy is accuracy and specificity. A policy that does not reflect your actual data practices is worse than useless — it creates legal liability. Take the time to accurately inventory your data flows before generating your policy. When your practices change, update the policy promptly and notify users where required.`,
  ],
  faqs: [
    { q: 'Is a Privacy Policy legally required?', a: 'Yes, in most jurisdictions if you collect any personal data. GDPR (EU/EEA) requires it for any site with EU visitors. CCPA requires it for California-facing businesses above certain revenue/data thresholds. Australia\'s Privacy Act, Canada\'s PIPEDA, and Brazil\'s LGPD also require privacy disclosures. App stores (Apple, Google) require it for all apps.' },
    { q: 'What is GDPR and does it apply to me?', a: 'GDPR (General Data Protection Regulation) is an EU law governing how personal data is collected and used. It applies to you if you offer goods/services to EU residents OR monitor the behavior of EU residents — regardless of where your company is based. If your website has EU visitors, GDPR applies to you.' },
    { q: 'What personal data must I disclose in a Privacy Policy?', a: 'You must disclose all categories of personal data you collect: identifiers (name, email, IP address), usage data (pages visited, time spent), device info, payment information, location data, and any special categories (health, racial/ethnic origin, biometric data).' },
    { q: 'What is a cookie policy and is it separate from a Privacy Policy?', a: 'A cookie policy explains the specific cookies your site uses, their purpose (essential, analytics, marketing), and how users can control them. It can be a section within your Privacy Policy or a separate document. Under GDPR, you also need a cookie consent banner for non-essential cookies.' },
    { q: 'What are user rights under GDPR?', a: 'GDPR grants users: Right of Access (get a copy of their data), Right to Rectification (correct inaccurate data), Right to Erasure (delete data), Right to Portability (export data), Right to Object (stop certain processing), and the right to withdraw consent. Your privacy policy must explain how users can exercise each right.' },
    { q: 'Do I need a Privacy Policy for a free website?', a: 'If your free website uses Google Analytics, contact forms, email newsletters, social media plugins, or any other tool that collects personal data (even just IP addresses), then yes — you need a Privacy Policy.' },
    { q: 'How long can I retain user data?', a: 'GDPR requires you to keep data only as long as necessary for the purpose it was collected. Typical retention periods: active account data while the account exists plus a short grace period, payment records for 5–7 years (tax law), marketing data until unsubscription, server logs for 30–90 days.' },
    { q: 'What is the difference between a data controller and data processor?', a: 'A data controller determines the purposes and means of processing personal data — this is typically your business. A data processor processes data on behalf of the controller — these are your third-party service providers (Google Analytics, Stripe, AWS).' },
    { q: 'Do I need a Privacy Policy if I only use Google Analytics?', a: 'Yes. Google Analytics collects IP addresses and behavioral data — that is personal data. You must disclose this in your Privacy Policy, list Google as a data processor, obtain cookie consent before loading Analytics, and in the EU, complete a Transfer Impact Assessment.' },
    { q: 'How do I handle a data breach notification requirement?', a: 'Under GDPR, you must notify your Data Protection Authority within 72 hours of discovering a personal data breach that poses a risk to individuals. If the risk is high, you must also notify affected individuals without undue delay.' },
    { q: 'Can I use a Privacy Policy generator for my app?', a: 'Yes — a generated Privacy Policy is a good starting point. Make sure it accurately reflects your app\'s actual data collection (especially mobile-specific data like device ID, location, camera, contacts). Both Apple App Store and Google Play review privacy policy content against actual app behavior.' },
    { q: 'What happens if I do not have a Privacy Policy?', a: 'Without a Privacy Policy you may face: regulatory fines (GDPR fines up to 20M euros or 4% of revenue), rejection from app stores, inability to use payment processors like Stripe, advertising platform bans, and loss of user trust.' },
  ],
  relatedTools: [
    { slug: 'terms-of-service-generator', name: 'Terms of Service Generator', icon: '📋', description: 'Website terms & conditions' },
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Non-disclosure agreement' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Employee hiring document' },
    { slug: 'cease-and-desist-generator', name: 'Cease & Desist Generator', icon: '✋', description: 'Stop IP misuse formally' },
    { slug: 'power-of-attorney-generator', name: 'Power of Attorney Generator', icon: '✍️', description: 'Authorize someone to act for you' },
  ],
}

// ─── Employment Contract Generator ───────────────────────────────────────────

const employmentConfig: LegalToolConfig = {
  icon: '💼',
  categoryIcon: '👥',
  categoryLabel: 'Employment Documents',
  description: 'Create a free employment contract or job offer letter. Covers salary, duties, hours, termination, and confidentiality. Standard template suitable for full-time, part-time, and contractor roles.',
  metaTitle: 'Employment Contract Generator – Free Job Offer Letter Template | RoughTools',
  metaDescription: 'Generate a free employment contract or offer letter online. Covers salary, duties, work hours, probation period, termination terms, and confidentiality. Download instantly.',
  documentStructure: {
    title: 'Employment Contract Structure',
    content: `EMPLOYMENT AGREEMENT

1. PARTIES
   Employer: [Company Name]
   Employee: [Full Name]

2. POSITION & COMMENCEMENT DATE
   — Job title, department, reporting line
   — Start date, work location (on-site / remote / hybrid)

3. COMPENSATION & BENEFITS
   — Salary / hourly rate, pay frequency
   — Bonus structure, equity (if any)
   — Benefits: health, PTO, retirement

4. WORKING HOURS & SCHEDULE
5. PROBATIONARY PERIOD
   — Duration (typically 3 months)
   — Review and confirmation process

6. DUTIES & RESPONSIBILITIES
7. CONFIDENTIALITY & IP ASSIGNMENT
   — Work-for-hire: IP created belongs to employer
   — Non-disclosure obligations

8. NON-COMPETE / NON-SOLICITATION (if applicable)
9. TERMINATION
   — Notice periods (both directions)
   — Grounds for immediate termination (cause)

10. GOVERNING LAW
11. SIGNATURES`,
    variables: [
      { field: 'Job Title', meaning: 'The official role title used in payroll and reporting' },
      { field: 'Commencement Date', meaning: 'The employee\'s first day of work' },
      { field: 'Base Salary', meaning: 'Fixed annual compensation (or hourly rate for non-exempt employees)' },
      { field: 'Probationary Period', meaning: 'Trial period during which either party can terminate with shorter notice' },
      { field: 'Notice Period', meaning: 'How much advance notice is required before resignation or termination' },
      { field: 'IP Assignment', meaning: 'Work created on company time/resources belongs to the employer' },
    ],
    note: 'Non-compete clauses are unenforceable in some US states (California, North Dakota, Oklahoma) and heavily restricted in others. Always check local law before relying on a non-compete.',
  },
  howToSteps: [
    { name: 'Enter employer and employee details', text: 'Input the company\'s legal name and registered address, and the employee\'s full legal name and address. These details form the parties to the contract and are used throughout the document.' },
    { name: 'Define the role and compensation', text: 'Specify the job title, department, start date, work location, and compensation: base salary or hourly rate, pay frequency, and any bonus or commission structure.' },
    { name: 'Set working hours and probation period', text: 'Specify standard working hours per week, any overtime provisions, and whether the role is exempt or non-exempt from overtime law. Set a probationary period (typically 3 months) with appropriate review provisions.' },
    { name: 'Configure termination and notice terms', text: 'Set the required notice period for both resignation and employer-initiated termination. Specify grounds for immediate termination "for cause" (gross misconduct, theft, etc.) vs. termination without cause.' },
    { name: 'Review, customize, and obtain signatures', text: 'Review the generated contract carefully, adding any role-specific clauses. Send to the new employee, obtain a signed copy before the start date, and retain it in your HR records.' },
  ],
  whenToUseCards: [
    { icon: '🆕', title: 'Hiring a new employee', description: 'Every new hire should receive a written employment contract before their start date — it protects both parties and sets clear expectations.' },
    { icon: '📝', title: 'Formalizing a verbal agreement', description: 'If someone has been working without a written contract, put the terms in writing to prevent future disputes about pay, duties, or termination rights.' },
    { icon: '🔄', title: 'Changing employment terms', description: 'Promotions, pay increases, role changes, or moving from part-time to full-time all warrant a new or amended contract.' },
    { icon: '🌎', title: 'Hiring remote or international workers', description: 'Remote hiring across state or national borders requires specific attention to which jurisdiction\'s employment law applies.' },
    { icon: '👔', title: 'Contractor-to-employee conversion', description: 'Converting a freelancer or contractor to an employee requires a proper employment agreement — the contractor agreement is not sufficient.' },
  ],
  proTips: [
    'Always specify whether the role is "at-will" (US) or a fixed-term contract. At-will employment means either party can end employment at any time for any legal reason — this should be stated explicitly.',
    'For roles with access to sensitive data or client relationships, include an IP assignment clause covering inventions created during employment, and a non-solicitation clause (often more enforceable than a non-compete).',
    'Include an "Entire Agreement" clause stating that the written contract supersedes any prior verbal or written understandings — this prevents disputes where the employee claims you promised something not in the document.',
    'Be careful about bonus and commission language. "Discretionary bonus" is very different from "target bonus of X% upon meeting KPIs" — the latter may be legally owed if KPIs are met.',
  ],
  quickRefRows: [
    { field: 'At-Will Employment', description: 'Either party can terminate at any time for any legal reason (US default)', example: 'No cause required; no notice legally required' },
    { field: 'Exempt vs Non-Exempt', description: 'Exempt employees do not receive overtime pay; non-exempt do (FLSA, US)', example: 'Salaried managers often exempt; hourly workers non-exempt' },
    { field: 'Notice Period', description: 'Required advance notice before resignation or termination takes effect', example: '2 weeks (US standard); 1 month (UK standard)' },
    { field: 'Work for Hire', description: 'IP created within scope of employment belongs to employer by default', example: 'Code written by a software engineer during work hours' },
    { field: 'Non-Solicitation', description: 'Restriction on poaching clients or colleagues after leaving', example: 'Cannot recruit former colleagues for 1 year post-employment' },
    { field: 'Probationary Period', description: 'Trial period with reduced notice requirements and closer performance monitoring', example: '90-day probation with weekly check-ins' },
  ],
  aboutParagraphs: (name) => [
    `An employment contract is the foundational document that defines the legal relationship between employer and employee. It records the agreed terms of employment — compensation, duties, schedule, benefits, and exit conditions — in a form both parties can refer back to if questions arise. The ${name} helps small businesses and startups create standard employment agreements quickly.`,
    `Employment law is one of the most jurisdiction-specific areas of law. What is required in an employment contract varies significantly between US states, and dramatically between countries. Some jurisdictions (UK, EU member states, Australia) have statutory minimum terms that apply regardless of what a contract says. The generated contract provides a standard baseline — always verify compliance with your local employment law.`,
    `Written employment contracts benefit both parties. Employers gain protection: clear grounds for discipline, IP assignment clauses, and enforceable confidentiality terms. Employees gain certainty: they know their rights, their pay, and their notice entitlements. Courts look unfavorably on employers who make significant changes to employment terms without written agreement — documenting changes promptly is important.`,
  ],
  faqs: [
    { q: 'Is an employment contract legally required?', a: 'Requirements vary by country. In the US, there is no federal law requiring a written employment contract (employment is at-will by default). In the UK, employees are legally entitled to a written statement of employment particulars within 2 months of starting. In most EU countries, written contracts are required.' },
    { q: 'What is at-will employment?', a: 'At-will employment is the default rule in most US states: either the employer or the employee can end the employment relationship at any time, for any reason that is not illegal (such as discrimination). A contract can modify this by setting a fixed term, requiring cause for termination, or establishing notice periods.' },
    { q: 'What should every employment contract include?', a: 'A solid employment contract should include: parties, job title and duties, start date and work location, compensation, benefits summary, working hours, probationary period, confidentiality obligations, IP assignment, termination provisions, and governing law.' },
    { q: 'Can I include a non-compete clause?', a: 'Non-compete clauses are legal in many jurisdictions but heavily regulated. They are completely unenforceable in California, North Dakota, and Oklahoma (US). In other states, they must be reasonable in scope, duration (typically max 1–2 years), and geographic area. Consult an employment attorney before relying on a non-compete.' },
    { q: 'What is the difference between an employee and an independent contractor?', a: 'The distinction is determined by law, not by what you call someone in a contract. Courts look at: who controls how work is done, whether tools/equipment are provided, tax treatment, exclusivity of services, and whether the relationship is permanent or project-based.' },
    { q: 'Can I change an employment contract after it is signed?', a: 'You cannot unilaterally change a signed employment contract — any changes require mutual agreement. You must provide the employee with notice of proposed changes and obtain their written agreement. Making changes without consent can constitute constructive dismissal in some jurisdictions.' },
    { q: 'What is an IP assignment clause?', a: 'An IP assignment clause states that intellectual property created by the employee within the scope of their employment belongs to the employer. This is the default under "work for hire" doctrine in the US, but an explicit written clause is the safest approach, especially for key technical roles.' },
    { q: 'How long should the notice period be?', a: 'US: commonly 2 weeks, though legally no notice is required under at-will employment. UK: statutory minimum is 1 week per year of service, up to 12 weeks. EU: typically 1–3 months. Senior roles often have longer contractual notice periods regardless of jurisdiction.' },
    { q: 'What is a probationary period?', a: 'A probationary period (typically 3 months) is a trial phase where performance is closely monitored and either party can terminate with shorter notice. It does not remove employment rights — anti-discrimination law applies from day one.' },
    { q: 'Should I use a template or hire an attorney?', a: 'For standard roles with straightforward terms, a template contract is a reasonable starting point. Involve an employment attorney when: the role involves valuable trade secrets, you operate across multiple jurisdictions, compensation is complex, or the employee is senior/executive level.' },
    { q: 'What happens if there is no written employment contract?', a: 'Without a written contract, employment terms are governed by applicable employment statutes and any verbal agreements (harder to prove). This creates significant uncertainty for both parties — disputes about pay, duties, or termination rights are much harder to resolve.' },
    { q: 'Does an employment contract need to be witnessed or notarized?', a: 'In most jurisdictions, employment contracts do not need to be witnessed or notarized — both parties\' signatures are sufficient. Dated signatures from both parties with a clear copy retained by each party is best practice.' },
  ],
  relatedTools: [
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Standalone confidentiality agreement' },
    { slug: 'terms-of-service-generator', name: 'Terms of Service Generator', icon: '📋', description: 'Website usage terms' },
    { slug: 'privacy-policy-generator', name: 'Privacy Policy Generator', icon: '🛡️', description: 'Data privacy compliance' },
    { slug: 'cease-and-desist-generator', name: 'Cease & Desist Generator', icon: '✋', description: 'Formal legal demand letter' },
    { slug: 'lease-agreement-generator', name: 'Lease Agreement Generator', icon: '🏠', description: 'Office or property lease' },
  ],
}

// ─── Cease and Desist Generator ───────────────────────────────────────────────

const ceaseConfig: LegalToolConfig = {
  icon: '✋',
  categoryIcon: '⚖️',
  categoryLabel: 'Dispute Documents',
  description: 'Generate a professional cease and desist letter for copyright infringement, trademark violation, harassment, defamation, or contract breach. Formal demand letter with standard legal language.',
  metaTitle: 'Cease and Desist Generator – Free C&D Letter Template | RoughTools',
  metaDescription: 'Create a free cease and desist letter for copyright infringement, trademark violations, harassment, defamation, or debt collection. Professional legal demand letter, instant download.',
  documentStructure: {
    title: 'Cease and Desist Letter Structure',
    content: `CEASE AND DESIST LETTER

[Date]
[Recipient Name & Address]

Re: Demand to Cease and Desist [Specific Activity]

1. IDENTIFICATION OF PARTIES
   — Who you are and your rights/interests
   — Who the recipient is

2. DESCRIPTION OF INFRINGING/HARMFUL CONDUCT
   — Specific acts complained of (with dates, URLs, examples)
   — How these acts violate your rights

3. LEGAL BASIS
   — Applicable law (copyright, trademark, defamation, etc.)
   — Your legal rights and the recipient's obligations

4. DEMAND
   — Specific actions required to cure the violation
   — Deadline (typically 10–14 days)

5. CONSEQUENCES OF NON-COMPLIANCE
   — Legal action (lawsuit, injunction, damages)
   — Reservation of rights

6. SENDER INFORMATION & SIGNATURE`,
    variables: [
      { field: 'Infringing Conduct', meaning: 'The specific activity you want the recipient to stop' },
      { field: 'Legal Basis', meaning: 'The law or right being violated (copyright, trademark, contract, etc.)' },
      { field: 'Response Deadline', meaning: 'The date by which the recipient must comply or respond (10–30 days typical)' },
      { field: 'Reservation of Rights', meaning: 'Statement that you preserve all legal remedies even if you do not immediately file suit' },
      { field: 'Evidence', meaning: 'Documentation of the infringing conduct (screenshots, URLs, dates)' },
      { field: 'Demanded Remedy', meaning: 'Exactly what you want them to do: stop, remove content, pay damages, etc.' },
    ],
    note: 'A cease and desist letter is not a court document — it has no legal force by itself. Its purpose is to formally document that the recipient was notified of the alleged violation, which strengthens any future lawsuit.',
  },
  howToSteps: [
    { name: 'Identify the violation and gather evidence', text: 'Before drafting the letter, document the infringing conduct: take screenshots, record URLs, note dates, and save any relevant communications. The strength of a C&D letter depends on the quality of the evidence supporting it.' },
    { name: 'Specify your legal rights', text: 'Identify the legal basis for your demand: copyright ownership, registered trademark, contract clause that was breached, defamatory statement made, or harassment pattern. Be specific about what right is being violated.' },
    { name: 'State exactly what you want', text: 'Clearly and specifically state what the recipient must do: remove specific content, stop using your trademark, cease contacting you. Vague demands are easy to partially comply with and harder to enforce.' },
    { name: 'Set a firm response deadline', text: 'Give a specific date — typically 10 to 14 days from the date of the letter — by which the recipient must comply or provide a written response.' },
    { name: 'Send via traceable delivery', text: 'Send the letter by certified mail with return receipt AND email if you have the address. This creates a documented record that the recipient received formal notice.' },
  ],
  whenToUseCards: [
    { icon: '©️', title: 'Copyright infringement', description: 'Someone is using your photos, videos, written content, music, or software without permission or proper attribution.' },
    { icon: '™️', title: 'Trademark violation', description: 'Another business is using your brand name, logo, or slogan in a way likely to confuse consumers.' },
    { icon: '🗣️', title: 'Defamation or libel', description: 'A person or business has published false statements of fact about you that damage your reputation.' },
    { icon: '🚫', title: 'Harassment', description: 'Repeated unwanted contact, threatening communications, or cyberstalking that you need to formally put on record.' },
    { icon: '📜', title: 'Contract breach', description: 'A party is violating specific terms of a signed agreement — the C&D creates a written record before you escalate to litigation.' },
  ],
  proTips: [
    'Keep the tone professional and factual — avoid emotional language or threats beyond standard legal consequences. Courts look more favorably on measured, professional demands.',
    'Do not include information in the letter that you would not want a judge to read. Cease and desist letters frequently become exhibits in litigation — write as if you are writing for a court audience.',
    'For copyright or trademark matters, consult an IP attorney before sending — a poorly-worded C&D can trigger a declaratory judgment action where the recipient sues you first to establish their right to use the material.',
    'If the infringement is online content, send the C&D to both the individual AND the platform hosting the content. Most platforms have DMCA takedown procedures that are faster and more effective.',
  ],
  quickRefRows: [
    { field: 'Copyright Infringement', description: 'Unauthorized copying, distribution, or display of copyrighted work', example: 'Using your photo without license on their website' },
    { field: 'Trademark Infringement', description: 'Using a protected brand name or logo likely to cause consumer confusion', example: 'A competitor uses a logo similar to yours' },
    { field: 'Defamation', description: 'Publishing a false statement of fact that harms your reputation', example: 'False negative review claiming fraud you did not commit' },
    { field: 'DMCA Takedown', description: 'Formal notice to an online platform to remove infringing content (faster than a C&D)', example: 'Sending a DMCA notice to YouTube for an infringing video' },
    { field: 'Declaratory Judgment', description: 'Lawsuit filed by the recipient to establish they are NOT infringing', example: 'Risk if C&D is sent for a borderline trademark claim' },
    { field: 'Reservation of Rights', description: 'Statement that you preserve all legal remedies', example: '"Nothing herein waives any rights or remedies available at law or equity"' },
  ],
  aboutParagraphs: (name) => [
    `A cease and desist letter is a formal written demand sent to an individual or organization instructing them to stop a specific activity that violates your rights. While it is not a court order, a well-written C&D letter serves several important purposes: it puts the recipient on formal notice of the alleged violation, creates a documented record for future litigation, and often resolves disputes without the cost and time of a lawsuit. The ${name} helps you create a professional demand letter quickly.`,
    `Cease and desist letters are commonly used for intellectual property violations (copyright, trademark), contract breaches, defamation, harassment, and debt collection disputes. The effectiveness of a C&D letter depends on several factors: the strength of the legal claim, the quality of the supporting evidence, and whether the recipient believes you are willing to follow through with litigation.`,
    `Important caveat: a cease and desist letter can backfire if poorly drafted or sent for a weak claim. In intellectual property matters, an aggressive C&D letter can prompt the recipient to file a declaratory judgment action — essentially suing you first to establish that their conduct is lawful. For significant IP, defamation, or contract matters, having an attorney review the letter before sending is strongly advisable.`,
  ],
  faqs: [
    { q: 'What is a cease and desist letter?', a: 'A cease and desist letter is a formal written demand that an individual or organization stop (cease) a specific activity and refrain from doing it again (desist). It is not a court order and has no legal force by itself — but it formally notifies the recipient of your legal claim and creates a documented record of that notice.' },
    { q: 'Does a cease and desist letter have legal force?', a: 'Not on its own. Its legal significance comes from creating a record that the recipient was formally notified of an alleged violation. If the recipient ignores it and you later sue, you can show the court that you gave them fair warning before filing.' },
    { q: 'Do I need a lawyer to send a cease and desist letter?', a: 'No — anyone can send a cease and desist letter. A letter from an attorney carries more weight because it signals you have legal representation and are likely to follow through. For significant claims (major copyright infringement, valuable trademark), an attorney\'s letter is worth the cost.' },
    { q: 'What happens if someone ignores a cease and desist letter?', a: 'If the recipient ignores your C&D letter, your options include: filing a lawsuit, submitting a DMCA takedown notice (for online copyright issues), reporting to relevant authorities (for harassment), or escalating through other legal channels.' },
    { q: 'What should I do if I receive a cease and desist letter?', a: 'Do not ignore it. Read it carefully. Consult an attorney before responding. Do not admit fault in any response. Respond in writing within the specified deadline, either by complying with the demand, disputing the claim, or requesting more time.' },
    { q: 'Can a cease and desist letter be used for online harassment?', a: 'Yes. A cease and desist letter for harassment formally notifies the harasser that their conduct must stop and creates a paper trail. This is useful for cyberstalking, repeated unwanted contact, threatening messages, and doxxing.' },
    { q: 'What is the difference between a cease and desist letter and a DMCA takedown?', a: 'A C&D letter is sent directly to the person infringing your rights. A DMCA takedown notice is sent to the online platform hosting the infringing content. DMCA takedowns are often faster for online copyright issues — platforms are legally required to respond to valid DMCA notices by removing content.' },
    { q: 'Can I send a cease and desist for trademark infringement?', a: 'Yes. Trademark owners commonly use C&D letters to enforce their rights against unauthorized use of their brand name, logo, or slogan. You should have a registered trademark (or documented common-law rights) and specific evidence of confusingly similar use.' },
    { q: 'How should I send a cease and desist letter?', a: 'Send by certified mail (with return receipt requested) AND email if you have the address. This creates documented proof that the letter was sent and received. Keep copies of everything — the letter, proof of delivery, and any response.' },
    { q: 'Can a cease and desist letter backfire?', a: 'Yes, in certain circumstances. If you send a C&D for a weak trademark or copyright claim, the recipient may file a declaratory judgment lawsuit to establish that they are not infringing — and if they win, you may have to pay their legal fees.' },
    { q: 'Is a cease and desist letter the same as a restraining order?', a: 'No. A cease and desist letter is a private document with no court backing. A restraining order is a court order — violation is contempt of court and can result in arrest. For serious, ongoing harassment or threats, apply directly to a court for a protective order.' },
    { q: 'How long should I give the recipient to comply?', a: 'Typically 10 to 30 days is standard — long enough to be reasonable but short enough to create urgency. For time-sensitive matters (like a live infringing event), you can request a 48–72 hour response for the most urgent demand.' },
  ],
  relatedTools: [
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Prevent unauthorized disclosure' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Formal employment terms' },
    { slug: 'privacy-policy-generator', name: 'Privacy Policy Generator', icon: '🛡️', description: 'Data privacy compliance' },
    { slug: 'terms-of-service-generator', name: 'Terms of Service Generator', icon: '📋', description: 'Website usage rules' },
    { slug: 'lease-agreement-generator', name: 'Lease Agreement Generator', icon: '🏠', description: 'Property rental contract' },
  ],
}

// ─── Lease Agreement Generator ────────────────────────────────────────────────

const leaseConfig: LegalToolConfig = {
  icon: '🏠',
  categoryIcon: '🏡',
  categoryLabel: 'Property Documents',
  description: 'Create a free residential lease agreement for landlords and tenants. Covers rent, security deposit, maintenance duties, entry rights, and termination terms. Standard template for monthly and fixed-term leases.',
  metaTitle: 'Lease Agreement Generator – Free Rental Contract Template | RoughTools',
  metaDescription: 'Generate a free residential lease agreement for landlords and tenants. Covers rent, security deposit, maintenance, termination, and tenant rights. Instant download.',
  documentStructure: {
    title: 'Lease Agreement Structure',
    content: `RESIDENTIAL LEASE AGREEMENT

1. PARTIES
   Landlord: [Name & Address]
   Tenant(s): [Names of all adult occupants]

2. PROPERTY
   — Full address including unit number
   — Permitted use (residential only)

3. TERM
   — Start and end date (fixed-term) OR
   — Month-to-month with notice requirements

4. RENT
   — Monthly rent amount, due date (e.g. 1st of month)
   — Grace period, late fee structure
   — Accepted payment methods

5. SECURITY DEPOSIT
   — Amount (statutory limits apply by state)
   — Conditions for deduction
   — Return timeline (state law governs)

6. UTILITIES & MAINTENANCE
   — Which utilities tenant vs. landlord pays
   — Tenant maintenance obligations
   — Landlord repair obligations

7. ENTRY BY LANDLORD
   — Notice required (typically 24–48 hours)
   — Emergency entry provisions

8. RULES & RESTRICTIONS
   — Pets, smoking, subletting, alterations

9. TERMINATION & RENEWAL
10. GOVERNING LAW`,
    variables: [
      { field: 'Fixed-Term Lease', meaning: 'Specific start and end date — tenant cannot leave without penalty before the end' },
      { field: 'Month-to-Month', meaning: 'Renews automatically each month — either party can terminate with proper notice' },
      { field: 'Security Deposit', meaning: 'Refundable payment held by landlord against unpaid rent or damages' },
      { field: 'Late Fee', meaning: 'Penalty for paying rent after the grace period — must comply with state law maximums' },
      { field: 'Landlord Entry', meaning: 'Landlord\'s right to access the property — state law typically requires 24–48 hours notice' },
      { field: 'Habitability', meaning: 'Landlord\'s legal duty to maintain the property in livable condition' },
    ],
    note: 'Security deposit rules — including maximum amount and return timeline — vary significantly by state. In California, the max is 2 months\' rent; in New York, 1 month. Always check your state\'s specific landlord-tenant law.',
  },
  howToSteps: [
    { name: 'Enter property and party details', text: 'Enter the full property address, all adult tenants\' legal names, and the landlord\'s name and address. List all adult occupants — anyone not on the lease has no legal right to reside in the property.' },
    { name: 'Set the term and rent details', text: 'Choose between a fixed-term lease (specific end date) or month-to-month. Set the monthly rent amount, due date, grace period (typically 3–5 days), and late fee. Specify acceptable payment methods.' },
    { name: 'Configure the security deposit', text: 'Set the security deposit amount (check your state\'s legal maximum — typically 1–2 months\' rent). Specify the conditions under which deductions will be made and the timeline for returning the deposit.' },
    { name: 'Define utility and maintenance responsibilities', text: 'Specify which utilities each party pays. Define the tenant\'s maintenance obligations and the landlord\'s obligations (maintaining habitable conditions, handling structural repairs).' },
    { name: 'Review, sign, and keep copies', text: 'Both landlord and all adult tenants must sign and date the lease. Conduct a move-in inspection together and document the property condition with photos before occupancy. Provide each party with a signed copy.' },
  ],
  whenToUseCards: [
    { icon: '🏠', title: 'Renting your property', description: 'Any time you rent residential property — apartments, houses, condos, or rooms — a written lease is essential to protect both parties.' },
    { icon: '🔄', title: 'Lease renewal', description: 'When a tenant\'s fixed-term lease expires and you want to continue the tenancy with updated or unchanged terms.' },
    { icon: '👋', title: 'New tenant, existing property', description: 'When you have a new tenant moving into a property that was previously rented, always create a new lease.' },
    { icon: '📝', title: 'Replacing a verbal agreement', description: 'If you have been renting on a verbal or handshake basis, putting the terms in writing protects both sides.' },
    { icon: '🏘️', title: 'Room or shared housing rental', description: 'Renting individual rooms in a house requires a lease specifying private and shared spaces and common area rules.' },
  ],
  proTips: [
    'Conduct a thorough move-in inspection with the tenant present and document every pre-existing damage with timestamped photos. This is your strongest defense against disputes at move-out over security deposit deductions.',
    'Include a clause requiring renters insurance — it protects the tenant\'s belongings and limits your liability as a landlord. Many landlords require proof of a minimum $100,000 liability policy.',
    'Specify exactly which alterations are permitted (e.g. picture hooks, temporary adhesive strips) and which require written permission (painting, installing shelves, replacing fixtures). Ambiguity here is a common source of deposit disputes.',
    'For month-to-month leases, specify the notice period for both rent increases and termination in the lease itself — some states have specific requirements for notice periods.',
  ],
  quickRefRows: [
    { field: 'Fixed-Term Lease', description: 'Set start and end date — tenant is liable for full rent unless broken early', example: '12-month lease from Sept 1 to Aug 31' },
    { field: 'Month-to-Month', description: 'Auto-renews monthly; terminable with proper notice (typically 30 days)', example: 'Tenant gives 30-day notice to vacate on Sept 30' },
    { field: 'Security Deposit', description: 'Refundable amount held against unpaid rent or damages beyond normal wear and tear', example: 'Equal to 1 month\'s rent = $1,500' },
    { field: 'Normal Wear and Tear', description: 'Gradual deterioration from normal use — NOT deductible from security deposit', example: 'Carpet flattening, minor scuffs on walls' },
    { field: 'Habitability', description: 'Landlord\'s implied duty to maintain livable conditions (heat, water, structural safety)', example: 'Landlord must fix broken heating within reasonable time' },
    { field: 'Eviction Notice', description: 'Formal notice to vacate — period varies by state and reason', example: '3-day notice to pay or quit; 30-day notice to vacate' },
  ],
  aboutParagraphs: (name) => [
    `A lease agreement is the legal contract that governs the landlord-tenant relationship. It defines both parties' rights and obligations — the landlord's right to collect rent and enforce property rules, and the tenant's right to quiet enjoyment and habitable conditions. The ${name} helps landlords and tenants create a standard, professionally drafted agreement without expensive legal fees.`,
    `Landlord-tenant law is heavily regulated and varies substantially by state and locality. Security deposit maximums, required disclosures, habitability standards, eviction procedures, and notice periods are all governed by local statutes that override anything in a lease agreement. A lease clause that violates state law is unenforceable — the law takes precedence. Always verify your generated lease against your state's current landlord-tenant law.`,
    `A good lease agreement reduces disputes by establishing clear expectations before move-in. Issues that most commonly lead to disputes — security deposit returns, maintenance responsibilities, and early lease termination — are all addressed by a well-drafted lease. Supplementing the lease with a detailed move-in inspection report and keeping good records throughout the tenancy makes enforcement far easier if problems arise.`,
  ],
  faqs: [
    { q: 'What is the difference between a lease and a rental agreement?', a: 'A lease is typically a fixed-term agreement (usually 12 months) that locks in the rent and terms for that period. A rental agreement (or month-to-month agreement) automatically renews each month and can be terminated by either party with proper notice, but terms can be changed with notice.' },
    { q: 'Does a lease have to be in writing to be enforceable?', a: 'For leases longer than one year, most US states require a written agreement under the Statute of Frauds. For shorter leases, verbal agreements are technically enforceable but practically impossible to prove. A written lease is essential to document agreed terms.' },
    { q: 'How much security deposit can I charge?', a: 'Security deposit maximums are set by state law and vary significantly. Examples: California — max 2 months\' rent (unfurnished); New York — max 1 month\'s rent; Texas — no statutory limit but must be returned within 30 days; Florida — no statutory limit but must be returned within 15–60 days.' },
    { q: 'What can I deduct from a security deposit?', a: 'Landlords can deduct for: unpaid rent, damage beyond normal wear and tear, cleaning costs if the unit is left in poor condition, and early termination fees if allowed by state law. Landlords CANNOT deduct for normal wear and tear or pre-existing damage documented at move-in.' },
    { q: 'What is normal wear and tear?', a: 'Normal wear and tear is the gradual deterioration of the property from ordinary, reasonable use. Examples include: minor scuffs on walls, carpet flattening in traffic areas, fading paint, and small nail holes from picture hanging. This is NOT deductible from a security deposit.' },
    { q: 'Can a landlord enter the rental property without notice?', a: 'Most states require landlords to give 24–48 hours advance notice before non-emergency entry. Entry is typically permitted for: repairs, inspections, showing the unit to prospective tenants, and emergencies. Entering without required notice can constitute harassment.' },
    { q: 'Can a landlord raise rent during a fixed-term lease?', a: 'Generally no — rent is locked for the duration of a fixed-term lease. For month-to-month tenancies, the landlord can raise rent with proper notice (typically 30 days, or longer in rent-controlled areas).' },
    { q: 'What happens if a tenant breaks the lease early?', a: 'If a tenant breaks a fixed-term lease without legal justification, they may owe rent for the remaining term (subject to the landlord\'s duty to mitigate by re-renting the unit). Legal reasons to break a lease without penalty include domestic violence, military deployment (SCRA), or uninhabitable conditions.' },
    { q: 'Can a landlord refuse to rent to someone with children?', a: 'No. Refusing to rent based on familial status (having children under 18) violates the Fair Housing Act in the US. Restrictions like "adults only" in lease listings or advertising are illegal.' },
    { q: 'What is subletting and can a tenant sublet without permission?', a: 'Subletting means the tenant rents some or all of the unit to a third party. Most leases prohibit subletting without the landlord\'s written consent. Unauthorized subletting is generally grounds for lease termination.' },
    { q: 'What is an eviction and how does it work?', a: 'Eviction is the legal process by which a landlord removes a tenant from a property. It typically requires: a valid written notice, filing an unlawful detainer lawsuit if the tenant does not comply, a court hearing, a court judgment, and sheriff enforcement. Self-help evictions (changing locks, removing belongings) are illegal in all US states.' },
    { q: 'Should I require renters insurance?', a: 'Yes — it is strongly recommended and increasingly standard practice. Requiring renters insurance (typically $100,000 liability coverage minimum) protects tenants\' belongings, limits your liability, and reduces disputes. Include a clause requiring tenants to provide proof of insurance before move-in.' },
  ],
  relatedTools: [
    { slug: 'will-generator', name: 'Will Generator', icon: '📜', description: 'Estate planning and asset distribution' },
    { slug: 'power-of-attorney-generator', name: 'Power of Attorney Generator', icon: '✍️', description: 'Authorize a trusted agent' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Formal employment agreement' },
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Confidentiality agreement' },
    { slug: 'cease-and-desist-generator', name: 'Cease & Desist Generator', icon: '✋', description: 'Formal legal demand letter' },
  ],
}

// ─── Will Generator ───────────────────────────────────────────────────────────

const willConfig: LegalToolConfig = {
  icon: '📜',
  categoryIcon: '🏛️',
  categoryLabel: 'Estate Planning',
  description: 'Create a free Last Will and Testament template to document your wishes for asset distribution, guardianship, and executor appointment. Essential estate planning starting point for most adults.',
  metaTitle: 'Will Generator – Free Last Will and Testament Template | RoughTools',
  metaDescription: 'Create a free Last Will and Testament online. Document your asset distribution wishes, name an executor, appoint guardians for minor children. Download your will template instantly.',
  documentStructure: {
    title: 'Last Will and Testament Structure',
    content: `LAST WILL AND TESTAMENT

1. DECLARATION
   — Full legal name, address, declaration of sound mind
   — Revocation of all prior wills

2. EXECUTOR APPOINTMENT
   — Primary executor (name, relationship, address)
   — Alternate executor (if primary cannot serve)
   — Executor powers (sell property, manage estate, etc.)

3. GUARDIANSHIP (for minor children)
   — Named guardian for each minor child
   — Alternate guardian

4. SPECIFIC BEQUESTS
   — Individual items to named beneficiaries
   — Conditions (e.g. reaching age 25 for cash bequests)

5. RESIDUARY ESTATE
   — Who receives everything not specifically bequeathed
   — Percentage splits among multiple beneficiaries

6. TRUSTS (if applicable)
   — Testamentary trust for minor beneficiaries

7. FUNERAL & BURIAL WISHES (optional)
8. DIGITAL ASSETS (optional)
9. NO-CONTEST CLAUSE (optional)
10. ATTESTATION
    — Testator signature (in presence of witnesses)
    — Two (or three) disinterested witness signatures`,
    variables: [
      { field: 'Testator', meaning: 'The person making the will (you)' },
      { field: 'Executor', meaning: 'The person appointed to carry out the will\'s instructions' },
      { field: 'Beneficiary', meaning: 'A person or entity that inherits assets under the will' },
      { field: 'Bequest', meaning: 'A specific gift of property or money to a named person' },
      { field: 'Residuary Estate', meaning: 'Everything left over after debts, taxes, and specific bequests are paid' },
      { field: 'Probate', meaning: 'The legal process of validating a will and administering an estate through the courts' },
    ],
    note: 'A will generated by this tool is a template only. For a will to be legally valid, it must be signed by the testator in front of the required number of witnesses (typically 2) who sign in your presence. Requirements vary by state/country.',
  },
  howToSteps: [
    { name: 'Inventory your assets', text: 'Before drafting your will, list your significant assets: real estate, bank accounts, investments, vehicles, personal property, business interests, and digital assets. Also identify assets that pass outside a will (joint tenancy property, retirement accounts with beneficiary designations, life insurance).' },
    { name: 'Choose your executor', text: 'Name a trusted, organized individual as your executor — they will manage the probate process, pay debts and taxes, and distribute assets. Choose someone willing to serve, ideally younger than you, and name an alternate.' },
    { name: 'Name guardians for minor children', text: 'If you have minor children, naming a guardian in your will is one of the most important decisions you will make. Discuss this with the proposed guardian before naming them. Name an alternate in case the primary guardian cannot serve.' },
    { name: 'Specify bequests and residuary distribution', text: 'List any specific gifts to named individuals. Then specify who receives the residuary estate — everything not specifically bequeathed. For multiple beneficiaries, specify percentage shares.' },
    { name: 'Sign properly with witnesses', text: 'Signing requirements are strict and state-specific. Typically: you must sign or acknowledge the will in front of two disinterested witnesses who then sign in your presence. Some states require notarization. An improperly executed will may be invalid.' },
  ],
  whenToUseCards: [
    { icon: '👶', title: 'You have minor children', description: 'A will is essential for naming a guardian for your children. Without one, a court decides who raises your children without knowing your wishes.' },
    { icon: '💍', title: 'Marriage or divorce', description: 'Marriage, divorce, and remarriage are major triggers to create or update a will — old wills may not reflect your current wishes or legal situation.' },
    { icon: '🏠', title: 'You own real estate or significant assets', description: 'Real estate cannot pass outside of probate without specific planning. A will ensures your property goes to your chosen heirs.' },
    { icon: '👴', title: 'Any adult over 18', description: 'You do not need to be wealthy to need a will. Without one, your assets pass according to your state\'s intestacy laws — which may not match your wishes.' },
    { icon: '🔄', title: 'Updating an existing will', description: 'Major life changes — new children, deaths, divorce, large inheritances — should trigger a will review and update.' },
  ],
  proTips: [
    'Do not rely solely on a will for assets that have beneficiary designations (retirement accounts, life insurance, jointly titled property). These pass outside probate regardless of what your will says — review and update beneficiary designations separately.',
    'Consider a "pour-over will" if you have a living trust — it captures any assets not transferred to the trust during your lifetime and pours them into the trust at death.',
    'Store your original signed will in a safe but accessible location (not a bank safe deposit box — which may require a court order to open after death). Tell your executor where it is.',
    'If you have specific wishes about end-of-life medical care, a will is NOT the right document — use a Healthcare Directive (Living Will) and Healthcare Power of Attorney, which operate while you are alive and incapacitated.',
  ],
  quickRefRows: [
    { field: 'Testamentary Capacity', description: 'Legal requirement that you are of sound mind when signing a will', example: 'Must understand nature of the act and extent of your property' },
    { field: 'Intestacy', description: 'What happens to your estate if you die without a valid will — state law determines distribution', example: 'Without a will, unmarried partner typically receives nothing' },
    { field: 'Probate', description: 'Court-supervised process of validating a will and distributing the estate', example: 'Can take 6 months to 2+ years depending on complexity' },
    { field: 'Per Stirpes', description: 'If a beneficiary dies before you, their share passes to their descendants', example: 'Your son\'s share goes to your grandchildren if son predeceases you' },
    { field: 'Codicil', description: 'A legal amendment to an existing will — must be executed with same formality', example: 'Adding a new bequest without rewriting the entire will' },
    { field: 'No-Contest Clause', description: 'Provision that disinherits anyone who unsuccessfully challenges the will', example: 'Heir who sues and loses receives nothing' },
  ],
  aboutParagraphs: (name) => [
    `A Last Will and Testament is the legal document that expresses your wishes for the distribution of your property after death. Without a valid will, your estate passes according to your state's intestacy laws — a rigid formula that distributes assets to blood relatives in a predetermined order, regardless of your actual wishes. The ${name} provides a solid template foundation for this essential document.`,
    `A will does more than distribute assets: it lets you name a trusted executor to manage the process, appoint a guardian for minor children, express wishes about funeral arrangements, and create testamentary trusts to protect assets for beneficiaries who are minors or who need financial protection. For many people, the guardian nomination alone makes creating a will urgent.`,
    `Critical execution requirement: a will template is only a starting point. For a will to be legally valid, it must be signed and witnessed according to your state's specific requirements — typically requiring the testator's signature in front of two disinterested witnesses who also sign. We strongly recommend consulting an estate planning attorney for any will involving complex assets, business interests, blended family situations, or significant estates.`,
  ],
  faqs: [
    { q: 'What is a Last Will and Testament?', a: 'A Last Will and Testament is a legal document that expresses your wishes for how your assets should be distributed after you die, who should manage your estate (executor), and who should care for your minor children (guardian). It only takes effect upon your death and must go through the probate process to be legally enforced.' },
    { q: 'Do I really need a will?', a: 'If you have assets, dependents, or preferences about where your property goes after death — yes. Without a will, your state\'s intestacy law determines distribution, which may not match your wishes. Common outcomes without a will: an unmarried partner receives nothing, and guardianship of children is decided by a court without your input.' },
    { q: 'What makes a will legally valid?', a: 'Requirements vary by jurisdiction, but typically: you must be 18 or older, you must be of sound mind, you must sign the will, and two disinterested witnesses must sign in your presence. Some states also accept holographic (entirely handwritten) wills without witnesses.' },
    { q: 'Who should I name as executor?', a: 'Choose someone trustworthy, organized, and willing to take on the responsibility. The executor will inventory your assets, notify creditors and beneficiaries, file the will with probate court, pay valid debts and taxes, and distribute the estate. This often takes 6–18 months. Always name an alternate executor.' },
    { q: 'Can I name my pet as a beneficiary?', a: 'Pets cannot legally inherit property — they are property under the law. To provide for a pet, you can leave money to a trusted person with instructions to care for the pet, or create a pet trust (recognized in most US states) that holds funds for the pet\'s care.' },
    { q: 'What is the difference between a will and a living trust?', a: 'A will goes through probate — a court-supervised process that takes months and is public record. A living trust allows assets held in the trust to pass directly to beneficiaries without probate, is private, and can provide for incapacity during your lifetime.' },
    { q: 'Can I disinherit a family member?', a: 'In the US, you can generally disinherit adult children by explicitly stating so in the will. You typically cannot completely disinherit a spouse — most states grant a surviving spouse a minimum "elective share" (typically one-third of the estate).' },
    { q: 'What happens if my beneficiary dies before me?', a: 'If a beneficiary predeceases you and you have not updated your will, their share typically lapses (reverts to the residuary estate) or passes to their descendants (if your will includes a per stirpes clause). Always name alternate/contingent beneficiaries.' },
    { q: 'Do I need to file my will with a court?', a: 'No — you do not register a will during your lifetime. Store the original in a secure but accessible place and tell your executor where it is. After death, the executor files the will with the probate court to begin the administration process.' },
    { q: 'Can I change my will after signing it?', a: 'Yes. You can change your will at any time while you have testamentary capacity. You can execute a new will (which revokes the old one) or add a codicil (a formal amendment that must be executed with the same formality as the original will). Never cross out or add handwritten changes to an existing will.' },
    { q: 'What assets do NOT pass through a will?', a: 'Several asset types pass outside of probate regardless of what your will says: retirement accounts (IRA, 401k) with named beneficiaries, life insurance policies with named beneficiaries, jointly titled property, accounts with payable-on-death (POD) designations, and assets held in a living trust.' },
    { q: 'Do I need a lawyer to make a will?', a: 'Not legally — a properly executed homemade or generated will is valid. But an estate planning attorney is valuable for: complex or large estates, business succession, blended families, special needs beneficiaries, and ensuring all documents (will, trust, healthcare directive, power of attorney) work together.' },
  ],
  relatedTools: [
    { slug: 'power-of-attorney-generator', name: 'Power of Attorney Generator', icon: '✍️', description: 'Authorize someone to manage your affairs' },
    { slug: 'lease-agreement-generator', name: 'Lease Agreement Generator', icon: '🏠', description: 'Property rental contract' },
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Confidentiality agreement' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Employment terms document' },
    { slug: 'cease-and-desist-generator', name: 'Cease & Desist Generator', icon: '✋', description: 'Formal legal demand letter' },
  ],
}

// ─── Power of Attorney Generator ─────────────────────────────────────────────

const poaConfig: LegalToolConfig = {
  icon: '✍️',
  categoryIcon: '🏛️',
  categoryLabel: 'Estate Planning',
  description: 'Generate a free Power of Attorney (POA) document — General, Durable, or Limited. Authorize a trusted agent to manage your financial, legal, or medical affairs on your behalf.',
  metaTitle: 'Power of Attorney Generator – Free POA Template | RoughTools',
  metaDescription: 'Create a free Power of Attorney (POA) document online. General, durable, or limited POA for financial, legal, or medical decisions. Download your POA template instantly.',
  documentStructure: {
    title: 'Power of Attorney Document Structure',
    content: `POWER OF ATTORNEY

1. PRINCIPAL INFORMATION
   — Full legal name, address, date of birth

2. AGENT (ATTORNEY-IN-FACT) DESIGNATION
   — Primary agent: name, address, relationship
   — Successor agent (if primary cannot serve)

3. TYPE OF POWER OF ATTORNEY
   — General: broad financial and legal authority
   — Durable: survives principal's incapacity
   — Limited/Special: specific transaction or period
   — Healthcare: medical decisions (separate document)

4. SCOPE OF AUTHORITY
   — Real estate transactions
   — Banking and financial accounts
   — Business operations
   — Tax matters
   — Legal proceedings

5. EFFECTIVE DATE & DURATION
   — Immediate vs. "springing" (takes effect on incapacity)
   — Expiration date (or indefinite)

6. COMPENSATION (usually none for family agents)
7. REVOCATION STATEMENT
8. SIGNATURE & NOTARIZATION
   — Principal's signature in front of notary
   — Witnesses (required in some states)`,
    variables: [
      { field: 'Principal', meaning: 'The person granting the power of attorney (you)' },
      { field: 'Agent / Attorney-in-Fact', meaning: 'The person authorized to act on your behalf' },
      { field: 'Durable', meaning: 'A durable POA remains valid if the principal becomes incapacitated' },
      { field: 'Springing POA', meaning: 'Takes effect only upon a defined triggering event (e.g. incapacity certification by a doctor)' },
      { field: 'Revocation', meaning: 'The principal\'s right to cancel the POA at any time while competent' },
      { field: 'Notarization', meaning: 'Most states require a notary public to witness the principal\'s signature on a POA' },
    ],
    note: 'Most states require a Power of Attorney to be notarized to be accepted by banks and financial institutions. Some states additionally require witness signatures. Always check your state\'s specific execution requirements.',
  },
  howToSteps: [
    { name: 'Choose the type of POA you need', text: 'General POA: broad authority over financial and legal matters. Durable POA: the most common — remains in effect if you become incapacitated (essential for estate planning). Limited POA: for a specific transaction (e.g. selling a car while abroad). Healthcare POA: for medical decisions — typically a separate document.' },
    { name: 'Select your agent carefully', text: 'Your agent will have significant legal authority to act on your behalf. Choose someone you trust completely: a spouse, adult child, or close friend. Consider availability, financial literacy, and willingness to serve. Name a successor agent in case the primary agent cannot serve.' },
    { name: 'Define the scope of authority', text: 'List exactly what powers you are granting. Common categories: real estate (buy, sell, manage property), banking (access accounts, sign checks), investments (manage portfolio), business operations, tax filings, and legal proceedings.' },
    { name: 'Choose the effective date and duration', text: 'An immediate POA takes effect when signed. A "springing" POA takes effect upon a specified event (usually written certification of incapacity by two physicians). Decide if the POA should expire on a set date or remain in effect until you revoke it or pass away.' },
    { name: 'Execute with proper formalities', text: 'Sign the POA in front of a notary public (required in most states). Some states also require witnesses. Provide your agent with the original or certified copy. Give copies to relevant institutions (bank, brokerage, real estate attorney).' },
  ],
  whenToUseCards: [
    { icon: '🏥', title: 'Estate planning and aging', description: 'A durable POA is essential so a trusted person can manage your affairs if you become incapacitated through illness or age.' },
    { icon: '✈️', title: 'Extended travel or living abroad', description: 'Grant a limited or general POA to someone who can handle legal and financial matters back home while you are away.' },
    { icon: '🏠', title: 'Real estate transactions', description: 'If you cannot be physically present for closing or other real estate transactions, a limited POA allows your agent to sign on your behalf.' },
    { icon: '💼', title: 'Business management', description: 'Allow a business partner or trusted employee to execute contracts, manage accounts, and operate your business during your absence.' },
    { icon: '🩺', title: 'Medical decision planning', description: 'A Healthcare POA designates who makes medical decisions for you if you cannot speak for yourself — essential for everyone, not just the elderly.' },
  ],
  proTips: [
    'For a durable POA used for financial management of an elderly parent, consider a "springing" POA that requires written certification of incapacity from two physicians before taking effect — this prevents potential abuse while ensuring the document works when needed.',
    'Give your agent an "Agent Certification" letter — a document they sign acknowledging their duties, your intentions, and their accountability. While not legally required, it creates a clear record and may help when presenting the POA to financial institutions.',
    'Financial institutions can be skeptical of older or non-standard POA forms. Check with major financial institutions where your accounts are held before finalizing the form — you may need to execute their form in addition to a general POA.',
    'A POA ends at death. It is not a substitute for estate planning documents. Make sure you have a will, any living trusts, and current beneficiary designations in place — the POA covers management of your affairs during life, not distribution after death.',
  ],
  quickRefRows: [
    { field: 'General POA', description: 'Broad authority over financial and legal matters', example: 'Managing all finances during extended hospitalization' },
    { field: 'Durable POA', description: 'Survives principal\'s incapacity — most commonly used for estate planning', example: 'Agent can act even if you develop dementia' },
    { field: 'Limited/Special POA', description: 'Authority limited to a specific transaction or time period', example: 'Sign one real estate closing on your behalf' },
    { field: 'Springing POA', description: 'Takes effect only upon a specified event (usually incapacity)', example: 'Effective when two doctors certify incapacity' },
    { field: 'Revocation', description: 'Principal can cancel the POA at any time while competent — must notify agent and key institutions', example: 'Written revocation sent to bank and broker' },
    { field: 'Fiduciary Duty', description: 'Agent must act in the principal\'s best interests, not their own', example: 'Agent cannot gift assets to themselves without explicit authorization' },
  ],
  aboutParagraphs: (name) => [
    `A Power of Attorney (POA) is a legal document granting another person (your "agent" or "attorney-in-fact") the authority to act on your behalf in legal, financial, or medical matters. It is one of the most powerful legal documents you can sign — your agent can have the same legal authority you have, so choosing the right person and defining the right scope are critical decisions. The ${name} helps you create this essential document.`,
    `A Durable Power of Attorney is specifically designed to remain valid even if you become incapacitated — making it a cornerstone of estate planning for adults of all ages. Without a durable POA, if you were to become incapacitated through illness or injury, your family would need to go to court to obtain a guardianship or conservatorship to manage your affairs — an expensive, time-consuming, and emotionally difficult process that a simple durable POA completely avoids.`,
    `Important: a Power of Attorney generated by this tool is a starting template. Execution requirements — specifically notarization and witness requirements — vary by state and are strictly enforced by financial institutions and courts. For significant estates, business interests, or complex family situations, an estate planning attorney should review or draft your POA.`,
  ],
  faqs: [
    { q: 'What is a Power of Attorney?', a: 'A Power of Attorney (POA) is a legal document that grants another person (your agent or attorney-in-fact) the authority to act on your behalf in legal, financial, or medical matters. The agent\'s authority is limited to what the POA document specifies. You (the principal) retain your own rights and can still act for yourself unless the POA says otherwise.' },
    { q: 'What is the difference between General and Durable Power of Attorney?', a: 'A General POA grants broad authority but terminates automatically if you become mentally incapacitated. A Durable POA also grants broad authority but specifically remains valid even if you become incapacitated — which is why it is essential for estate planning.' },
    { q: 'What is a Springing Power of Attorney?', a: 'A springing POA does not take effect immediately — it only "springs" into effect upon a specified triggering event, typically written certification of the principal\'s incapacity by one or two physicians.' },
    { q: 'Does a Power of Attorney need to be notarized?', a: 'In most US states, yes — a notary\'s acknowledgment is required for a POA to be accepted by financial institutions, real estate companies, and government agencies. Some states also require witnesses in addition to notarization.' },
    { q: 'Can I revoke a Power of Attorney?', a: 'Yes — as long as you are mentally competent, you can revoke a POA at any time by executing a written revocation, notifying your agent, and notifying any institutions that have copies of the POA.' },
    { q: 'What can an agent do under a Power of Attorney?', a: 'An agent can only do what the POA document specifically authorizes. Common powers include: managing bank accounts, buying/selling real estate, filing taxes, managing investments, running a business, making legal decisions.' },
    { q: 'Can my agent give themselves gifts from my money?', a: 'Generally no — an agent has a fiduciary duty to act in your interest, not their own. Self-dealing and unauthorized gifts to themselves or others is a breach of that duty and potentially fraud. If you specifically want to allow gifting, you must explicitly authorize it in the POA document.' },
    { q: 'Does a Power of Attorney expire?', a: 'A POA expires when: the principal dies, the principal revokes it, the document has an explicit expiration date, or (for non-durable POAs) the principal becomes incapacitated. It does NOT expire simply because significant time has passed.' },
    { q: 'What is a Healthcare Power of Attorney?', a: 'A Healthcare POA (also called a Healthcare Proxy or Medical POA) is a separate document from a financial POA. It designates someone to make medical decisions on your behalf if you cannot communicate your wishes. It should be combined with a Living Will / Healthcare Directive.' },
    { q: 'What happens if I do not have a Power of Attorney and become incapacitated?', a: 'Without a durable POA, if you become mentally incapacitated, your family would need to petition a court for guardianship or conservatorship to manage your affairs. This process can take months, costs thousands of dollars in legal fees, and can be emotionally devastating.' },
    { q: 'Can a Power of Attorney be used to transfer my property to my agent?', a: 'A POA can be used to transfer property — but an agent transferring your property to themselves is generally not permitted unless the POA explicitly authorizes self-dealing. This is one of the most common forms of elder financial abuse. Choose your agent very carefully.' },
    { q: 'Should I have both a POA and a will?', a: 'Yes — they serve completely different purposes. A POA operates during your lifetime when you cannot act for yourself. A will operates after your death to distribute your estate. A complete estate plan includes: a durable financial POA, a healthcare POA, a living will, and a last will and testament.' },
  ],
  relatedTools: [
    { slug: 'will-generator', name: 'Will Generator', icon: '📜', description: 'Last will and testament' },
    { slug: 'lease-agreement-generator', name: 'Lease Agreement Generator', icon: '🏠', description: 'Property rental agreement' },
    { slug: 'nda-generator', name: 'NDA Generator', icon: '🤝', description: 'Non-disclosure agreement' },
    { slug: 'employment-contract-generator', name: 'Employment Contract Generator', icon: '💼', description: 'Employment contract template' },
    { slug: 'terms-of-service-generator', name: 'Terms of Service Generator', icon: '📋', description: 'Website terms of service' },
  ],
}

// ─── Master export ────────────────────────────────────────────────────────────

export const LEGAL_CONFIGS: Record<string, LegalToolConfig> = {
  'nda-generator': ndaConfig,
  'terms-of-service-generator': tosConfig,
  'privacy-policy-generator': privacyConfig,
  'employment-contract-generator': employmentConfig,
  'cease-and-desist-generator': ceaseConfig,
  'lease-agreement-generator': leaseConfig,
  'will-generator': willConfig,
  'power-of-attorney-generator': poaConfig,
}
