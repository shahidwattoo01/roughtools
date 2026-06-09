/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import YamlValidatorClient from './YamlValidatorClient'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'YAML Validator — Validate & Format YAML Online | RoughTools',
  description: 'Validate YAML syntax and convert YAML to JSON online. Instantly detect indentation errors, duplicate keys, and syntax problems in your configuration files. Free and private.',
  keywords: ['yaml validator', 'yaml checker', 'validate yaml online', 'yaml syntax checker', 'yaml to json', 'yaml linter', 'yaml formatter'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/yaml-validator' },
  openGraph: {
    title: `YAML Validator — Validate & Format YAML Online | RoughTools`,
    description: `Validate and format YAML files online. Detect syntax errors and pretty-print YAML. Free online YAML validator.`,
    url: 'https://roughtools.com/tools/developer/yaml-validator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `YAML Validator — Validate & Format YAML Online | RoughTools`,
    description: `Validate and format YAML files online. Detect syntax errors and pretty-print YAML. Free online YAML validator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the YAML Validator free to use?',
    a: 'Yes, the YAML Validator is completely free to use with no subscription, usage limits, or premium features locked behind a paywall. You can validate and convert unlimited YAML documents at no cost. RoughTools is funded through non-intrusive advertising, which keeps this tool and every other tool on the platform permanently free for developers, DevOps engineers, and system administrators worldwide.',
  },
  {
    q: 'Do I need to create an account to validate YAML files?',
    a: 'No account or registration is required. Open the tool, paste your YAML, and get instant validation results. There is no email address needed, no password to create, and no profile to manage. RoughTools is designed for developers who need to debug configuration problems fast — you can go from pasted YAML to a clear validation result in under three seconds without any sign-up step.',
  },
  {
    q: 'Is my YAML data safe? Does this tool send it to a server?',
    a: 'Your YAML data never leaves your device. All validation and YAML-to-JSON conversion happen entirely in your browser using JavaScript. No content is transmitted to any external server, stored in a database, or logged anywhere. This means you can safely validate Kubernetes secrets, GitHub Actions workflows with API keys, environment configuration files, and any other sensitive YAML without risk of data exposure.',
  },
  {
    q: 'Does the YAML Validator work on mobile phones and tablets?',
    a: 'Yes. The YAML Validator is fully responsive and works on smartphones, tablets, and desktop computers. The interface adapts to smaller screens so you can paste YAML, validate it, and read the results clearly on any device. It works in Chrome for Android, Safari for iOS, and all modern mobile browsers. For editing large multi-hundred-line YAML files, a desktop browser with a physical keyboard is more practical.',
  },
  {
    q: 'Which browsers are supported by this YAML validator?',
    a: 'The YAML Validator works in all modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool relies on standard JavaScript string processing and the JSON API, which are universally available in every modern browser. Internet Explorer is not supported, as it has been end-of-life since June 2022 and is not suitable for modern web development workflows.',
  },
  {
    q: 'How accurate is the YAML validation?',
    a: 'The validator checks for the most common YAML errors that cause failures in production tools: tabs mixed with spaces (explicitly forbidden by the YAML specification), duplicate keys at the same indentation level, inconsistent indentation depth, unclosed quotes, and structural issues that produce unexpected data types. For maximum accuracy on complex YAML with anchors, aliases, multi-line strings, and merge keys, validating against a full YAML 1.2 parser is recommended.',
  },
  {
    q: 'Can I use the YAML Validator offline?',
    a: 'Once the page has loaded, YAML validation and conversion work entirely offline because all processing uses JavaScript running in your browser — no server connection is required. For frequent offline use, open the tool before losing internet access so the page is cached. This is particularly useful for developers working in air-gapped environments, on flights, or in secure networks that restrict external internet access.',
  },
  {
    q: 'How do I validate YAML with this tool? Step-by-step guide.',
    a: 'Validating YAML takes just a few seconds. Step one: open the YAML Validator on this page. Step two: paste your YAML content into the input area. Step three: click Validate to check for syntax errors — any issues found are displayed with a description of the problem and its location. Step four: if the YAML is valid, click Convert to JSON to see the parsed data structure as JSON, confirming that your YAML is being interpreted the way you intend. Step five: use the Copy button to copy the JSON output.',
  },
  {
    q: 'Why use RoughTools YAML Validator instead of other websites?',
    a: 'RoughTools combines validation and YAML-to-JSON conversion in a single tool, so you can both check your syntax and verify that your data structure is correct in one step. All processing runs locally in your browser — no server round-trips, no data exposure, and no latency. The interface loads instantly and provides clear, actionable error messages. It is especially useful when debugging Kubernetes manifests, Docker Compose files, and CI/CD pipeline configurations.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report a bug or submit a feature suggestion. When reporting a bug, include your browser name and version, operating system, the YAML snippet that triggered the unexpected behavior (with sensitive values replaced), and a description of what you expected versus what you saw. Feature requests are welcome — explain your specific use case and the team will evaluate it for a future release.',
  },
  {
    q: 'What is YAML and what is it used for?',
    a: 'YAML (YAML Ain\'t Markup Language) is a human-readable data serialization format designed to be easy to write and understand. It uses indentation to express hierarchy instead of brackets or tags, making it significantly more readable than JSON or XML for complex nested structures. YAML is the standard format for Kubernetes manifests, Docker Compose files, GitHub Actions workflows, Ansible playbooks, Helm chart values, and application configuration files across many frameworks.',
  },
  {
    q: 'Why does YAML forbid tabs for indentation?',
    a: 'The YAML specification explicitly forbids tab characters for indentation because different text editors interpret tab width differently — one editor might display a tab as 2 spaces, another as 4 or 8. This ambiguity would make YAML files that look correct in one editor parse differently in another. By requiring spaces, YAML ensures that the visual indentation always matches the structural indentation exactly, regardless of editor settings.',
  },
  {
    q: 'What is the difference between YAML and JSON?',
    a: 'YAML is a superset of JSON — every valid JSON document is also valid YAML. YAML adds features JSON lacks: comments (lines starting with #), multi-line strings, anchors and aliases for reusing values, and a more human-friendly syntax without all the quotes and braces. JSON is better for machine-to-machine data exchange because it is strict and unambiguous. YAML is better for configuration files that humans write and maintain. Most tools that accept YAML can also convert it to JSON for inspection.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YAML Validator',
  url: 'https://roughtools.com/tools/developer/yaml-validator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Validate YAML syntax and convert YAML to JSON online. Detects errors in Kubernetes, Docker, and CI/CD config files. Free, private, instant.',
}
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
    { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
    { '@type': 'ListItem', position: 3, name: 'YAML Validator', item: 'https://roughtools.com/tools/developer/yaml-validator' },
  ],
}
export default function Page() {
  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd, breadcrumbLd]} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 64px' }}>
        <ToolAdUnit position="top" />
        <nav style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> ›{' '}
          <Link href="/tools/developer" style={{ color: '#888', textDecoration: 'none' }}>Developer Tools</Link> › YAML Validator
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>YAML Validator</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Validate YAML syntax and convert YAML to JSON — instantly in your browser. Catches tabs mixed with spaces, duplicate keys, and structural errors in Kubernetes manifests, Docker Compose files, and CI/CD pipelines. Free, private, and no account required.
        </p>
        <YamlValidatorClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About YAML Validator</h2>
          <p style={{ color: '#aaa', lineHeight: 1.7 }}>
            YAML is ubiquitous in modern software development — Kubernetes manifests, Docker Compose files, GitHub Actions workflows, and application config files all rely on it. A single indentation mistake or duplicate key can cause silent failures or cryptic error messages from the tool consuming the YAML. Catching these errors early, before deploying to a cluster or running a pipeline, saves significant debugging time.
          </p>
          <p style={{ color: '#aaa', lineHeight: 1.7, marginTop: 12 }}>
            This validator checks your YAML for the most common mistakes: tabs mixed with spaces (forbidden by the spec), duplicate keys at the same indentation level, and structural issues. The YAML-to-JSON converter lets you see exactly how your YAML will be parsed, which is invaluable when debugging configuration problems or verifying that nested values are at the correct depth.
          </p>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#e0e0ff' }}>{q}</h3>
              <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </section>
        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
