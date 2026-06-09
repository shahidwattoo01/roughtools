interface PolicyPageProps {
  siteName?: string;
  siteUrl?: string;
  contactEmail?: string;
}

export function PrivacyPolicy({
  siteName = "RoughTools",
  siteUrl = "https://roughtools.com",
  contactEmail = "privacy@roughtools.com",
}: PolicyPageProps) {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong> January 22, 2025
      </p>

      <p>
        This Privacy Policy describes how {siteName} ({siteUrl}) collects, uses,
        and shares information when you use our website and services. By using
        {siteName}, you agree to the practices described below.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Information You Provide</h3>
      <ul>
        <li>
          <strong>Account information:</strong> Name, email address, and
          password when you register.
        </li>
        <li>
          <strong>Contact submissions:</strong> Name, email, and message content
          when you use our contact form.
        </li>
        <li>
          <strong>Tool inputs:</strong> Text, files, or data you enter into our
          tools. This data is processed in real-time and is not permanently
          stored unless you explicitly save it.
        </li>
        <li>
          <strong>Favorites and preferences:</strong> Tools you favorite and
          settings you configure, stored locally in your browser or in your
          account if logged in.
        </li>
      </ul>

      <h3>1.2 Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Log data:</strong> IP address, browser type, operating system,
          referring URL, pages visited, and time spent on pages.
        </li>
        <li>
          <strong>Device information:</strong> Screen resolution, device type,
          and unique device identifiers.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> See Section 3 for
          details.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To operate, maintain, and improve our tools and website.</li>
        <li>To respond to your inquiries and provide customer support.</li>
        <li>
          To personalize your experience (recent tools, preferences, theme).
        </li>
        <li>To detect, prevent, and address technical issues or abuse.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies for the purposes described
        below. You can manage your cookie preferences through our cookie consent
        banner.
      </p>

      <h3>3.1 Necessary Cookies</h3>
      <p>
        Required for the website to function. These cannot be disabled. They
        include session cookies and CSRF protection tokens.
      </p>

      <h3>3.2 Analytics Cookies</h3>
      <p>
        We use Google Analytics to understand how visitors interact with our
        website. This includes pages visited, time on site, and traffic sources.
        Data is aggregated and anonymized where possible.
      </p>

      <h3>3.3 Advertising Cookies</h3>
      <p>
        We use Google AdSense to display advertisements. Google and its partners
        may use cookies to serve ads based on your prior visits to our site or
        other websites. Google&apos;s use of advertising cookies enables it and
        its partners to serve ads based on your visit to our site and/or other
        sites on the Internet.
      </p>
      <p>
        You may opt out of personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Ads Settings
        </a>
        .
      </p>

      <h3>3.4 Functional Cookies</h3>
      <p>
        Remember your preferences such as theme (dark/light mode) and recently
        used tools. These are stored locally in your browser.
      </p>

      <h2>4. Advertising and AdSense</h2>
      <p>
        {siteName} uses Google AdSense to display advertisements. Google AdSense
        uses cookies to serve ads based on user activity. As a Google AdSense
        publisher, we may earn revenue when visitors interact with ads on our
        site.
      </p>
      <p>
        For more information about how Google uses your data, please review{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s advertising policies
        </a>
        .
      </p>
      <p>
        You can opt out of third-party vendor use of cookies for personalized
        advertising by visiting{" "}
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aboutads.info/choices
        </a>
        .
      </p>

      <h2>5. Third-Party Services</h2>
      <ul>
        <li>
          <strong>Google Analytics:</strong> Web analytics service.{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <strong>Google AdSense:</strong> Advertising service.{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <strong>Cloudflare:</strong> CDN and security.{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <ul>
        <li>
          <strong>Account data:</strong> Retained while your account is active.
          Deleted within 30 days of account deletion request.
        </li>
        <li>
          <strong>Tool input data:</strong> Not permanently stored unless saved.
          Temporary processing data is purged within 24 hours.
        </li>
        <li>
          <strong>Analytics data:</strong> Retained for 26 months per Google
          Analytics default.
        </li>
        <li>
          <strong>Log data:</strong> Retained for 90 days.
        </li>
      </ul>

      <h2>7. Your Rights</h2>
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of your personal data.
        </li>
        <li>
          <strong>Correction:</strong> Request correction of inaccurate data.
        </li>
        <li>
          <strong>Deletion:</strong> Request deletion of your personal data.
        </li>
        <li>
          <strong>Portability:</strong> Request your data in a structured
          format.
        </li>
        <li>
          <strong>Objection:</strong> Object to processing of your data for
          marketing purposes.
        </li>
        <li>
          <strong>Restriction:</strong> Request restriction of processing in
          certain circumstances.
        </li>
      </ul>
      <p>
        To exercise these rights, contact us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>8. GDPR (European Union)</h2>
      <p>
        For users in the EEA, we process your data under lawful bases including
        consent, legitimate interest, and contractual necessity. Our cookie
        consent mechanism complies with the ePrivacy Directive. You can withdraw
        consent at any time through the cookie settings.
      </p>

      <h2>9. CCPA (California)</h2>
      <p>
        California residents have the right to know what personal information is
        collected, to request deletion, and to opt out of the sale of personal
        information. We do not sell personal information. To submit a request
        under CCPA, contact us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>10. Children&apos;s Privacy</h2>
      <p>
        {siteName} is not directed to children under 13. We do not knowingly
        collect personal information from children under 13. If we become aware
        that we have collected such information, we will delete it promptly.
      </p>

      <h2>11. Security</h2>
      <p>
        We implement reasonable security measures including HTTPS encryption,
        secure session management, and regular security reviews. However, no
        method of transmission over the Internet is 100% secure.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of material changes by updating the &ldquo;Last updated&rdquo; date and,
        for significant changes, by displaying a notice on our website.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at:{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or use our{" "}
        <a href="/contact">contact form</a>.
      </p>
    </article>
  );
}
