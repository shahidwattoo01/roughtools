import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | RoughTools',
  description:
    'RoughTools privacy policy. Learn how we use Google Analytics, Google AdSense, and cookies â€” and how to manage your preferences.',
  alternates: { canonical: 'https://roughtools.com/privacy-policy' },
  robots: { index: true, follow: true },
}

// â”€â”€ Inline styles for the dark design system â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const prose: React.CSSProperties = { maxWidth: 820, margin: '0 auto', padding: '40px 20px 80px' }
const h1s: React.CSSProperties  = { fontSize: 32, fontWeight: 800, color: '#e4e8ff', marginBottom: 8, marginTop: 0 }
const h2s: React.CSSProperties  = { fontSize: 19, fontWeight: 700, color: '#c4caff', marginTop: 44, marginBottom: 12 }
const h3s: React.CSSProperties  = { fontSize: 15, fontWeight: 700, color: '#a5b0ff', marginTop: 24, marginBottom: 8 }
const ps:  React.CSSProperties  = { fontSize: 14, color: '#9499bd', lineHeight: 1.75, marginBottom: 14, marginTop: 0 }
const lis: React.CSSProperties  = { fontSize: 14, color: '#9499bd', lineHeight: 1.75, marginBottom: 6 }
const ul:  React.CSSProperties  = { paddingLeft: 22, marginBottom: 14, marginTop: 0 }
const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginRight: 6,
}
const divider: React.CSSProperties = { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '40px 0' }

export default function PrivacyPolicy() {
  const lastUpdated = 'June 2026'

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
    <main style={prose}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: 13, color: '#555878', marginBottom: 28 }} aria-label="Breadcrumb">
        <a href="/" style={{ color: '#555878' }}>Home</a>
        {' â€º '}
        <span style={{ color: '#a5b0ff' }}>Privacy Policy</span>
      </nav>

      <h1 style={h1s}>Privacy Policy</h1>
      <p style={{ ...ps, color: '#666a8a' }}>Last updated: <strong style={{ color: '#9499bd' }}>{lastUpdated}</strong></p>
      <p style={ps}>
        RoughTools (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates{' '}
        <a href="https://roughtools.com" style={{ color: '#7c8bff' }}>roughtools.com</a> (the
        &ldquo;Site&rdquo;). This policy explains what information we collect, how we use it, and your
        rights regarding your personal data. We are committed to transparency, especially regarding
        our use of advertising and analytics services.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 1. Information We Collect â”€â”€ */}
      <h2 style={h2s}>1. Information We Collect</h2>

      <h3 style={h3s}>1a. Information you provide directly</h3>
      <p style={ps}>
        All tool calculations run entirely in your browser. <strong style={{ color: '#c4caff' }}>No input
        data you enter into any tool is ever sent to our servers or stored.</strong> If you contact us
        by email, we collect your email address and the content of your message for the purpose of
        responding.
      </p>

      <h3 style={h3s}>1b. Automatically collected usage data</h3>
      <p style={ps}>
        When you visit the Site, the following information may be collected automatically by the
        third-party services described in Section 3:
      </p>
      <ul style={ul}>
        <li style={lis}>Browser type and version, operating system</li>
        <li style={lis}>Pages visited, time on page, referring URL</li>
        <li style={lis}>Approximate geographic location (country / region level only)</li>
        <li style={lis}>Device type (desktop, mobile, tablet)</li>
        <li style={lis}>IP address (anonymised before storage by Google Analytics)</li>
      </ul>

      <hr style={divider} />

      {/* â”€â”€ 2. Cookies â”€â”€ */}
      <h2 style={h2s}>2. Cookies and Similar Technologies</h2>
      <p style={ps}>
        We use cookies and similar tracking technologies. The table below lists every category of
        cookie used on this site, who sets them, and their purpose.
      </p>

      {/* Cookie table */}
      <div style={{ overflowX: 'auto', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['Category', 'Set by', 'Purpose', 'Duration', 'Consent required'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#7c8bff', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Essential', 'RoughTools', 'Stores your cookie consent choice (cookie_consent)', 'Persistent', 'No'],
              ['Analytics', 'Google Analytics 4', 'Anonymised traffic analysis, page-view counts, tool usage patterns', 'Up to 2 years', 'Yes (EU/UK)'],
              ['Advertising', 'Google AdSense', 'Serves contextual and interest-based ads. May track cross-site browsing.', 'Up to 13 months', 'Yes (EU/UK)'],
              ['Advertising', 'DoubleClick / Google Ad Manager', 'Ad delivery, frequency capping, conversion tracking', 'Up to 13 months', 'Yes (EU/UK)'],
            ].map(([cat, by, purpose, dur, req], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '10px 14px', color: '#9499bd', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }}>
                  <span style={{
                    ...badge,
                    background: cat === 'Essential' ? 'rgba(16,185,129,0.15)' : cat === 'Analytics' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                    color:       cat === 'Essential' ? '#34d399'               : cat === 'Analytics' ? '#60a5fa'               : '#fbbf24',
                  }}>
                    {cat}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9499bd', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }}>{by}</td>
                <td style={{ padding: '10px 14px', color: '#9499bd', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }}>{purpose}</td>
                <td style={{ padding: '10px 14px', color: '#9499bd', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{dur}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                  <span style={{ color: req === 'Yes (EU/UK)' ? '#fbbf24' : '#34d399', fontWeight: 700 }}>{req}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={ps}>
        <strong style={{ color: '#c4caff' }}>Managing cookies:</strong> When you first visit the Site,
        a consent banner asks for your permission before analytics and advertising cookies are set.
        You can change your preferences at any time by clearing your browser cookies and revisiting
        (the banner will reappear). You can also opt out of Google personalised ads at{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#7c8bff' }}>
          adssettings.google.com
        </a>{' '}
        or install the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#7c8bff' }}>
          Google Analytics opt-out browser extension
        </a>.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 3. Google AdSense â”€â”€ */}
      <h2 style={h2s}>3. Google AdSense (Advertising)</h2>
      <p style={ps}>
        We use <strong style={{ color: '#fbbf24' }}>Google AdSense</strong> to display advertisements
        on the Site. AdSense is operated by Google LLC (or, for EEA users, Google Ireland Limited).
      </p>
      <p style={ps}>
        AdSense may use cookies and web beacons to serve ads based on your prior visits to this site
        and other sites on the internet. Google&rsquo;s use of advertising cookies enables it and its
        partners to serve ads based on your visit to our site and/or other sites on the Internet.
      </p>
      <ul style={ul}>
        <li style={lis}><strong style={{ color: '#c4caff' }}>What it collects:</strong> Cookie identifiers, IP address, browser fingerprint, browsing behaviour across sites that show Google ads.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>What it is used for:</strong> Selecting relevant ads, measuring ad performance, fraud prevention, and frequency capping.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Consent Mode v2:</strong> We have implemented Google Consent Mode v2. For EU/UK/EEA users, advertising cookies will not be set until you accept the consent banner. Non-personalised ads may be shown without consent.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Opt out:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#7c8bff' }}>adssettings.google.com</a> to manage or opt out of personalised advertising.</li>
      </ul>
      <p style={ps}>
        Google&rsquo;s Privacy Policy:{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#7c8bff' }}>
          policies.google.com/privacy
        </a>
      </p>

      <hr style={divider} />

      {/* â”€â”€ 4. Google Analytics â”€â”€ */}
      <h2 style={h2s}>4. Google Analytics (Traffic Analysis)</h2>
      <p style={ps}>
        We use <strong style={{ color: '#60a5fa' }}>Google Analytics 4 (GA4)</strong> to understand
        how visitors use the Site â€” which tools are most useful, how people navigate between pages,
        and where traffic comes from.
      </p>
      <ul style={ul}>
        <li style={lis}>IP addresses are anonymised before being stored.</li>
        <li style={lis}>Data is aggregated; we do not identify individual users.</li>
        <li style={lis}>Data is stored on Google&rsquo;s servers and subject to Google&rsquo;s data-processing terms.</li>
        <li style={lis}>Opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#7c8bff' }}>Google Analytics opt-out extension</a>.</li>
      </ul>

      <hr style={divider} />

      {/* â”€â”€ 5. Vercel Analytics â”€â”€ */}
      <h2 style={h2s}>5. Vercel Analytics &amp; Speed Insights</h2>
      <p style={ps}>
        We use Vercel Analytics (privacy-first, no cookies) and Vercel Speed Insights (Core Web
        Vitals measurements) to monitor Site performance. These services collect anonymised
        performance metrics only and do not set cookies or collect personal data.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 6. How We Use Information â”€â”€ */}
      <h2 style={h2s}>6. How We Use Your Information</h2>
      <ul style={ul}>
        <li style={lis}>To operate and improve the Site and its tools</li>
        <li style={lis}>To understand which tools are most useful and prioritise development</li>
        <li style={lis}>To serve relevant advertisements that fund the free service</li>
        <li style={lis}>To respond to enquiries sent to us by email</li>
        <li style={lis}>To comply with legal obligations</li>
      </ul>
      <p style={ps}>
        <strong style={{ color: '#ef4444' }}>We do not sell, rent, or trade personal data with third
        parties for their own marketing purposes.</strong>
      </p>

      <hr style={divider} />

      {/* â”€â”€ 7. Data Retention â”€â”€ */}
      <h2 style={h2s}>7. Data Retention</h2>
      <p style={ps}>
        Tool calculation inputs are never sent to or stored on our servers â€” retention is zero.
        Email enquiries are retained for up to 2 years and then deleted. Analytics data is retained
        in Google Analytics for 14 months (our configured retention period). Advertising data is
        retained by Google per their policies.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 8. Your Rights â”€â”€ */}
      <h2 style={h2s}>8. Your Rights (GDPR / UK GDPR / CCPA)</h2>
      <p style={ps}>
        Depending on where you are located, you may have the following rights regarding your personal data:
      </p>
      <ul style={ul}>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Access:</strong> Request a copy of the personal data we hold about you.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Rectification:</strong> Request correction of inaccurate data.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Erasure:</strong> Request deletion of your personal data.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Restriction:</strong> Ask us to stop processing your data in certain circumstances.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Portability:</strong> Receive your data in a machine-readable format.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Objection:</strong> Object to processing based on legitimate interest.</li>
        <li style={lis}><strong style={{ color: '#c4caff' }}>Withdraw consent:</strong> Withdraw consent at any time (does not affect prior processing).</li>
      </ul>
      <p style={ps}>
        To exercise any of these rights, email us at{' '}
        <a href="mailto:shahidwattoo0111@gmail.com" style={{ color: '#7c8bff' }}>shahidwattoo0111@gmail.com</a>.
        We will respond within 30 days. You also have the right to lodge a complaint with your local
        data protection authority (e.g. ICO in the UK, your national DPA in the EU).
      </p>

      <hr style={divider} />

      {/* â”€â”€ 9. Children â”€â”€ */}
      <h2 style={h2s}>9. Children&rsquo;s Privacy</h2>
      <p style={ps}>
        The Site is not directed at children under 13, and we do not knowingly collect personal data
        from children. If you believe we have inadvertently collected data from a child, please
        contact us immediately at{' '}
        <a href="mailto:shahidwattoo0111@gmail.com" style={{ color: '#7c8bff' }}>shahidwattoo0111@gmail.com</a>.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 10. Security â”€â”€ */}
      <h2 style={h2s}>10. Security</h2>
      <p style={ps}>
        The Site is served over HTTPS. All tool calculations run client-side in your browser. Because
        input data is never transmitted, there is no risk of data breach from server-side storage of
        your calculation inputs.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 11. Changes â”€â”€ */}
      <h2 style={h2s}>11. Changes to This Policy</h2>
      <p style={ps}>
        We may update this policy to reflect changes in our practices or applicable law. When we
        make material changes, we will update the &ldquo;Last updated&rdquo; date at the top of this page.
        Continued use of the Site after any update constitutes acceptance of the revised policy.
      </p>

      <hr style={divider} />

      {/* â”€â”€ 12. Contact â”€â”€ */}
      <h2 style={h2s}>12. Contact Us</h2>
      <p style={ps}>
        Questions about this policy? Reach us at:{' '}
        <a href="mailto:shahidwattoo0111@gmail.com" style={{ color: '#7c8bff' }}>shahidwattoo0111@gmail.com</a>
      </p>
    </main>
    </div>
  )
}
