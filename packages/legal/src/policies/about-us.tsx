interface AboutProps {
  siteName?: string;
  siteUrl?: string;
  launchYear?: number;
}

export function AboutUs({
  siteName = "RoughTools",
  siteUrl = "https://roughtools.com",
  launchYear = 2024,
}: AboutProps) {
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - launchYear;

  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1>About {siteName}</h1>

      <p>
        {siteName} is a comprehensive directory of AI tools and online utilities
        designed to help developers, designers, creators, and businesses find
        the right tools for their workflow. Since {launchYear}, we&apos;ve been
        cataloging, reviewing, and organizing the rapidly growing landscape of
        AI-powered tools.
      </p>

      <h2>Our Mission</h2>
      <p>
        The AI tool ecosystem is exploding. New tools launch daily, and finding
        the right one for your specific need has become harder than building the
        tool itself. Our mission is to cut through the noise by providing:
      </p>
      <ul>
        <li>
          <strong>Structured categorization</strong> â€” tools organized by use
          case, not just popularity.
        </li>
        <li>
          <strong>Honest descriptions</strong> â€” what each tool does, its
          limitations, and who it&apos;s for.
        </li>
        <li>
          <strong>Free tools you can use immediately</strong> â€” no sign-up
          walls, no paywalls on core features.
        </li>
        <li>
          <strong>Side-by-side comparison</strong> â€” understand differences
          between similar tools at a glance.
        </li>
      </ul>

      <h2>What We Offer</h2>

      <h3>Tool Directory</h3>
      <p>
        Browse {siteName === "RoughTools" ? "200+" : "hundreds of"} tools across
        categories including Development, Design, AI &amp; Machine Learning,
        DevOps, Security, Analytics, and more. Each listing includes a detailed
        description, key features, pricing model, and direct links.
      </p>

      <h3>Built-in Utilities</h3>
      <p>
        Beyond the directory, we provide free, browser-based tools you can use
        right now â€” no installation required. JSON formatters, color pickers,
        regex testers, text analyzers, and more.
      </p>

      <h3>Blog &amp; Guides</h3>
      <p>
        In-depth articles on choosing tools, workflow optimization, and staying
        current with AI trends. Written by practitioners, not marketers.
      </p>

      <h2>How We Make Money</h2>
      <p>{siteName} is free to use. We generate revenue through:</p>
      <ul>
        <li>
          <strong>Display advertising</strong> â€” we use Google AdSense to show
          relevant ads. Ads are clearly distinguishable from our editorial
          content.
        </li>
        <li>
          <strong>Affiliate partnerships</strong> â€” some tool listings include
          affiliate links. When you purchase through these links, we may earn a
          commission at no extra cost to you. Affiliate listings are always
          disclosed.
        </li>
      </ul>
      <p>
        Our editorial integrity is non-negotiable. Advertising and affiliate
        relationships do not influence our tool ratings, descriptions, or
        listing order.
      </p>

      <h2>Our Team</h2>
      <p>
        {siteName} is built and maintained by a small team of developers and
        writers who actually use the tools we list. We test every tool before
        adding it to the directory, and we update listings when tools change.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have a question, want to submit a tool, or found an error? We&apos;d
        love to hear from you.
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:hello@roughtools.com">hello@roughtools.com</a>
        </li>
        <li>
          <strong>Contact form:</strong>{" "}
          <a href="/contact">roughtools.com/contact</a>
        </li>
        <li>
          <strong>Submit a tool:</strong>{" "}
          <a href="/submit">roughtools.com/submit</a>
        </li>
      </ul>

      <p className="text-sm text-gray-500 dark:text-gray-400 not-prose mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        {siteName} has been helping people find the right tools for{" "}
        {yearsActive > 0
          ? `${yearsActive} year${yearsActive > 1 ? "s" : ""}`
          : "less than a year"}
        .
      </p>
    </article>
  );
}
