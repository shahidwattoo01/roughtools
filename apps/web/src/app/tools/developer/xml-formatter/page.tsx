/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import ToolAdUnit from '@/components/ToolAdUnit'
import XmlFormatterClient from './XmlFormatterClient'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'XML Formatter — Beautify & Validate XML Online | RoughTools',
  description: 'Format, beautify, validate, and minify XML documents online. Indents nested elements for readability, catches syntax errors instantly, and runs entirely in your browser.',
  keywords: ['xml formatter', 'xml beautifier', 'xml validator', 'format xml online', 'xml pretty print', 'xml indenter', 'xml minifier'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/xml-formatter' },
  openGraph: {
    title: `XML Formatter — Beautify & Validate XML Online | RoughTools`,
    description: `Format, beautify, and validate XML documents online with proper indentation. Free online XML formatter and validator.`,
    url: 'https://roughtools.com/tools/developer/xml-formatter',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `XML Formatter — Beautify & Validate XML Online | RoughTools`,
    description: `Format, beautify, and validate XML documents online with proper indentation. Free online XML formatter and validator.`,
  },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Is the XML Formatter and Validator free to use?',
    a: 'Yes, the XML Formatter and Validator is completely free with no subscription fee, usage limits, or hidden costs. You can format, validate, and minify unlimited XML documents at no charge. RoughTools is supported through non-intrusive advertising, which keeps this tool and every other tool on the platform permanently free for developers, data engineers, and system integrators worldwide.',
  },
  {
    q: 'Do I need to sign up or create an account to format XML?',
    a: 'No account or registration is required. Open the tool, paste your XML, and format it immediately. There is no email required, no password to remember, and no profile to create. RoughTools is designed for developers who need instant results — you can go from raw, unformatted XML to a beautifully indented document in under five seconds without any sign-up step.',
  },
  {
    q: 'Is my XML data safe? Does this tool send it to a server?',
    a: 'Your XML data never leaves your device. All parsing, formatting, validation, and minification happen entirely in your browser using the native DOMParser API. No content is transmitted to any external server, and nothing is stored or logged. This means you can safely format confidential configuration files, internal API payloads, or sensitive XML documents without any risk of data exposure.',
  },
  {
    q: 'Does the XML Formatter work on mobile phones and tablets?',
    a: 'Yes. The XML Formatter is fully responsive and works on smartphones, tablets, and desktop computers. The text areas adapt to smaller screens, and formatting results display clearly on all device sizes. It works in Chrome for Android, Safari for iOS, and every other modern mobile browser. For very large XML files, a desktop browser with more available memory will provide the best performance.',
  },
  {
    q: 'Which browsers support this XML formatter?',
    a: 'The XML Formatter works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The tool relies on the DOMParser API, which has been universally available in all major browsers for many years. Internet Explorer is not supported, as it reached end-of-life in 2022. Any browser released after 2016 should work correctly with this tool.',
  },
  {
    q: 'How accurate is the XML formatting and validation?',
    a: 'Formatting accuracy is very high because the tool uses the browser\'s native DOMParser — the same XML parser built into every modern browser. Validation is equally reliable: if the DOMParser cannot parse the input, it returns a parsererror element with the exact error message, line number, and column number reported by the parser engine. This means error reporting matches what you would see in a production browser environment.',
  },
  {
    q: 'Can I format or validate XML documents offline?',
    a: 'Once the page has fully loaded, the XML Formatter works completely offline. All processing uses the browser\'s built-in DOMParser API, so no internet connection is required after the initial load. For frequent offline use, open the tool before you go offline — modern browsers cache the page and its assets so it remains available. This is especially useful for developers working in air-gapped environments or on aircraft.',
  },
  {
    q: 'How do I format or validate XML? Step-by-step instructions.',
    a: 'Using this tool is simple. Step one: open the XML Formatter on this page. Step two: paste your raw or unformatted XML into the input area on the left. Step three: click the Format button to produce an indented, readable version of your XML, or click Validate to check for syntax errors. Step four: if you need compact output for storage or transmission, click Minify to remove all unnecessary whitespace. Step five: click Copy to copy the output to your clipboard.',
  },
  {
    q: 'Why use RoughTools XML Formatter instead of other websites?',
    a: 'RoughTools processes XML entirely in your browser using the native DOMParser — the same engine built into every major browser. This means zero server latency, zero data transmission risk, and validation results that exactly match what a real browser XML parser would report. The interface is clean, loads instantly, and supports formatting, validation, and minification in one place without switching between tools.',
  },
  {
    q: 'How do I report a bug or suggest a new feature for this tool?',
    a: 'Use the Contact page on RoughTools to report issues or submit feature suggestions. When reporting a bug, include the browser and operating system you are using, a short sample of the XML that caused the problem (removing any sensitive data), what you expected the tool to do, and what it actually did. The team reviews every submission and uses them to improve the tool in future releases.',
  },
  {
    q: 'What is XML and where is it commonly used?',
    a: 'XML (Extensible Markup Language) is a structured text format for storing and transporting data, defined by the W3C. It represents data as a tree of nested elements, each with a tag name and optional attributes. XML is widely used in configuration files (Maven pom.xml, Android layouts, Spring Boot config), web services and SOAP APIs, document formats (Office Open XML, SVG, XHTML), RSS and Atom feeds, and data exchange between enterprise systems.',
  },
  {
    q: 'What is the difference between XML formatting and XML minification?',
    a: 'Formatting (also called pretty-printing or beautifying) adds consistent indentation and line breaks to make the XML structure visually clear and easy to read during development, debugging, or code review. Minification does the opposite — it removes all whitespace, indentation, and unnecessary line breaks between tags to produce the smallest possible file size. Minified XML is ideal for network transmission or storage where byte count matters, but it is very difficult to read manually.',
  },
  {
    q: 'What errors does the XML validator catch?',
    a: 'The validator uses the browser\'s DOMParser to detect all well-formedness errors defined by the XML specification. Common errors it catches include unclosed tags (a tag opened without a matching closing tag), mismatched tag names, illegal characters in element names or attribute values, missing XML declaration when required, duplicate attribute names on the same element, and improperly nested elements. The error output includes the line and column number to help you locate the problem quickly.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'XML Formatter & Validator',
  url: 'https://roughtools.com/tools/developer/xml-formatter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Format, beautify, validate, and minify XML documents online. Free, private, runs entirely in your browser.',
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
    { '@type': 'ListItem', position: 3, name: 'XML Formatter', item: 'https://roughtools.com/tools/developer/xml-formatter' },
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
          <Link href="/tools/developer" style={{ color: '#888', textDecoration: 'none' }}>Developer Tools</Link> › XML Formatter
        </nav>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 8, letterSpacing: -1 }}>XML Formatter & Validator</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>
          Format, beautify, validate, and minify XML documents instantly in your browser. Uses the native DOMParser for accurate validation with precise error line numbers. No data leaves your device — free, private, and no account required.
        </p>
        <XmlFormatterClient />
        <ToolAdUnit position="middle" />
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About XML Formatter</h2>
          <p style={{ color: '#aaa', lineHeight: 1.7 }}>
            XML (Extensible Markup Language) is widely used for configuration files, data exchange between systems, SOAP web services, and document storage. When XML arrives from an API, a database export, or a legacy system, it often lacks consistent indentation. This formatter uses the browser&apos;s native DOMParser to parse the XML, then recursively serializes each node with proper indentation to make the element hierarchy immediately clear.
          </p>
          <p style={{ color: '#aaa', lineHeight: 1.7, marginTop: 12 }}>
            The validator detects malformed XML immediately — unclosed tags, mismatched brackets, illegal characters in attribute values, and other common errors are caught with the exact line and column number. The minifier removes all whitespace between tags to produce the most compact representation suitable for network transmission or compact storage.
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
