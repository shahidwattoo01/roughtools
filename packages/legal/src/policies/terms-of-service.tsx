interface PolicyPageProps {
  siteName?: string;
  siteUrl?: string;
  contactEmail?: string;
}

export function TermsOfService({
  siteName = "RoughTools",
  siteUrl = "https://roughtools.com",
  contactEmail = "legal@roughtools.com",
}: PolicyPageProps) {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p>
        <strong>Last updated:</strong> January 22, 2025
      </p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of {siteName}({siteUrl}). By accessing or using {siteName}, you
        agree to be bound by these Terms.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing {siteName}, you confirm that you are at least 13 years of
        age and agree to comply with these Terms. If you do not agree, do not
        use the service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        {siteName} provides a directory of AI tools and online utilities. Our
        tools perform various functions including text processing, data
        conversion, code generation, image manipulation, and other computational
        tasks.
      </p>

      <h2>3. Tool Usage Disclaimer</h2>
      <div className="not-prose rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10 p-4 my-4">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
          Important Disclaimer
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Tools provided by {siteName} are offered &ldquo;as is&rdquo; for
          informational and utility purposes. Output from our tools should not
          be considered professional advice (legal, medical, financial, or
          otherwise). Always verify results independently before relying on them
          for critical decisions.
        </p>
      </div>
      <ul>
        <li>Tool outputs may contain errors or inaccuracies.</li>
        <li>
          AI-generated content should be reviewed by a qualified professional
          before use.
        </li>
        <li>We are not responsible for decisions made based on tool output.</li>
        <li>Users are solely responsible for how they use tool results.</li>
      </ul>

      <h2>4. User Accounts</h2>
      <ul>
        <li>
          You may create an account to access additional features (favorites,
          history, etc.).
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account credentials.
        </li>
        <li>
          You must provide accurate and complete registration information.
        </li>
        <li>
          You must notify us immediately of any unauthorized use of your
          account.
        </li>
        <li>
          We reserve the right to suspend or terminate accounts that violate
          these Terms.
        </li>
      </ul>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Use tools for any unlawful purpose or to generate harmful,
          threatening, or harassing content.
        </li>
        <li>
          Attempt to reverse engineer, decompile, or disassemble any part of the
          service.
        </li>
        <li>
          Use automated scripts, bots, or scrapers to access the service without
          permission.
        </li>
        <li>Interfere with or disrupt the service, servers, or networks.</li>
        <li>Attempt to gain unauthorized access to any part of the service.</li>
        <li>
          Use the service in any way that could damage, disable, or impair its
          operation.
        </li>
        <li>
          Circumvent, disable, or interfere with security features of the
          service.
        </li>
        <li>
          Reproduce, duplicate, sell, or exploit any portion of the service
          without express permission.
        </li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <ul>
        <li>
          The {siteName} website, design, and code are our intellectual
          property.
        </li>
        <li>
          Tool descriptions, reviews, and editorial content are owned by{" "}
          {siteName} or its licensors.
        </li>
        <li>You retain ownership of content you input into tools.</li>
        <li>
          You grant {siteName} a limited, non-exclusive license to process your
          input data to provide the service.
        </li>
        <li>Third-party tool listings belong to their respective owners.</li>
      </ul>

      <h2>7. User-Generated Content</h2>
      <p>
        If {siteName} allows user submissions (comments, reviews, tool
        submissions), you grant us a non-exclusive, worldwide, royalty-free
        license to use, display, and distribute such content in connection with
        the service.
      </p>
      <p>
        You represent that you have the right to submit such content and that it
        does not violate any third-party rights.
      </p>

      <h2>8. Third-Party Links and Tools</h2>
      <p>
        {siteName} may link to third-party websites and list third-party tools.
        We do not control and are not responsible for the content, privacy
        practices, or terms of any third-party services. Your use of third-party
        services is at your own risk.
      </p>

      <h2>9. Advertising</h2>
      <p>
        {siteName} displays advertisements provided by third-party advertising
        networks (including Google AdSense). We do not endorse or guarantee any
        advertised products or services. The presence of ads does not constitute
        a recommendation.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {siteName} and its operators
        shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, including but not limited to loss of
        profits, data, or use, arising from or related to your use of or
        inability to use the service.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {siteName}, its operators, and
        affiliates from any claims, damages, losses, or expenses (including
        reasonable attorney fees) arising from your use of the service or
        violation of these Terms.
      </p>

      <h2>12. Disclaimer of Warranties</h2>
      <p>
        The service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, either express or
        implied, including but not limited to implied warranties of
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2>13. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes become
        effective upon posting to this page. Your continued use of the service
        after changes are posted constitutes acceptance of the modified Terms.
      </p>

      <h2>14. Termination</h2>
      <p>
        We may terminate or suspend access to the service immediately, without
        prior notice, for any reason, including breach of these Terms.
      </p>

      <h2>15. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which{" "}
        {siteName}
        operates, without regard to conflict of law principles. Any disputes
        shall be resolved in the courts of that jurisdiction.
      </p>

      <h2>16. Contact</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or use our{" "}
        <a href="/contact">contact form</a>.
      </p>
    </article>
  );
}
