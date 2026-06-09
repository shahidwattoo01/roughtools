import type { Metadata } from 'next'
import HexCalculatorClient from './HexCalculatorClient'
import { getCalcSEO } from '../_components/calc-seo-configs'
import ToolAdUnit from '@/components/ToolAdUnit'
import { JsonLd } from '@/components/JsonLd'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import {
  ProTipsSection,
  WhenToUseCards,
  QuickReferenceTable,
  CalculatorFAQ,
  RelatedCalculators,
} from '@/components/tools/CalculatorSections'

// ─── Metadata ────────────────────────────────────────────────────────────────

const _seo = getCalcSEO('hex-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Hex Calculator | RoughTools',
  description: _seo?.metaDescription ?? 'Convert hex colors to RGB and HSL, do hex arithmetic, and explore web color codes instantly. Free, no signup.',
  keywords: ['hex calculator', 'hex to rgb', 'hex to decimal', 'hexadecimal calculator', 'hex color converter'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/hex-calculator' },
  openGraph: {
    title: 'Free Hex Calculator | RoughTools',
    description: 'Convert hex colors to RGB and HSL, perform hex arithmetic instantly. Free, no signup.',
    url: 'https://roughtools.com/tools/calculators/hex-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Hex Calculator | RoughTools',
    description: 'Hex color converter and hex arithmetic. Free, instant.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this hex calculator?',
    a: 'All conversions and arithmetic operations are mathematically exact. Hex-to-decimal and decimal-to-hex conversions follow strict base-16 rules. Color conversions from hex to RGB and HSL are computed using the standard formulae used by all modern browsers. Results are identical to what you would get from a programming language\'s built-in parseInt or color functions.',
  },
  {
    q: 'Is my data private — is anything stored?',
    a: 'Yes, completely private. All calculations run entirely in your browser using JavaScript. No data you enter is transmitted to any server, stored in a database, or shared with third parties. When you close the tab, your inputs are gone.',
  },
  {
    q: 'Is this calculator free to use?',
    a: 'Yes, completely free. No account, no subscription, no hidden fees. RoughTools is ad-supported — using it costs you nothing.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. The calculator is fully responsive and works on any device — smartphone, tablet, or desktop — in any modern browser.',
  },
  {
    q: 'What browsers are supported?',
    a: 'All modern browsers: Chrome, Firefox, Safari, Edge, and Opera. Internet Explorer is not supported. We recommend Chrome or Firefox for the best experience.',
  },
  {
    q: 'Can I save or export my results?',
    a: 'Yes. Use the "Export PDF" button to download a formatted PDF of your inputs and results. You can also use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.',
  },
  {
    q: 'Do I need professional advice to use hex conversions?',
    a: 'No professional advice is needed for hex conversions — they are exact mathematical operations. If you are working with hex in safety-critical systems, cryptographic implementations, or hardware registers, have a qualified engineer verify your usage.',
  },
  {
    q: 'What formula does hex-to-decimal conversion use?',
    a: 'Each hex digit is multiplied by 16 raised to its positional power (counting from right at 0), then results are summed. For example, 0xFF = 15×16¹ + 15×16⁰ = 240 + 15 = 255. Decimal-to-hex uses repeated division by 16, collecting remainders (0–15, written as 0–9 and A–F) from bottom to top.',
  },
  {
    q: 'What do A–F represent in hexadecimal?',
    a: 'Hexadecimal uses digits 0–9 plus letters A–F to represent the sixteen values of a single digit: A=10, B=11, C=12, D=13, E=14, F=15. This lets a single character represent any value from 0 to 15, which maps perfectly to 4 binary bits. Hex is case-insensitive: 0xFF equals 0xff.',
  },
  {
    q: 'How do hex color codes work?',
    a: 'A hex color like #RRGGBB encodes red, green, and blue channels each as a 2-digit hex value (00–FF), representing intensities from 0 to 255. #FF0000 is pure red, #00FF00 is pure green, #0000FF is pure blue, #FFFFFF is white, and #000000 is black. The shorthand form #RGB expands each digit: #F0A becomes #FF00AA.',
  },
  {
    q: 'How is hex used in web development?',
    a: 'Hex is ubiquitous in web development. CSS colors are written in hex (#RRGGBB or #RRGGBBAA with alpha). Memory addresses in JavaScript engines, HTTP status codes in network debugging, and binary file signatures (magic numbers) are all read in hex. Web fonts and Base64-encoded assets also appear as hex in some tooling.',
  },
  {
    q: 'What is big-endian vs little-endian in hex?',
    a: 'Endianness describes the order bytes are stored in memory. Big-endian stores the most significant byte first (left to right, as written). Little-endian stores the least significant byte first — used by x86/x64 CPUs. For example, the 32-bit value 0x12345678 is stored as 12 34 56 78 in big-endian, but 78 56 34 12 in little-endian. This matters when reading raw binary files or network packets.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Always prefix hex literals with 0x in code (e.g., 0xFF, 0x1A3F). This is the universal notation recognised by C, C++, JavaScript, Python, Rust, Go, and most other languages. Without the prefix, the compiler or interpreter may misread the value as a variable name or decimal.',
  'Two hex digits equal exactly one byte (8 bits). A byte\'s range is 0x00–0xFF (0–255). This is why hex is the standard way to write memory addresses, byte arrays, file offsets, and cryptographic hashes — each pair of hex characters represents one byte of data.',
  'Break down CSS hex colors using the #RRGGBB pattern: the first two digits control red intensity, the middle two control green, and the last two control blue. To lighten a color, increase all three values proportionally. To shift hue, adjust individual channels. Use this mental model to decode any CSS color at a glance.',
  'Use hex for memory addresses and register values in low-level debugging. Debuggers, disassemblers, and memory viewers all display data in hex because it compresses binary data to a readable length while preserving exact bit patterns. A 32-bit address like 0xDEADBEEF is far more readable than its 32-digit binary equivalent.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎨',
    title: 'Web development color codes',
    description: 'Convert between #RRGGBB hex, RGB, and HSL to pick, verify, and adjust colors for CSS stylesheets, design systems, and UI components.',
  },
  {
    icon: '⚙️',
    title: 'Assembly and low-level programming',
    description: 'Work with CPU registers, opcodes, and memory-mapped hardware addresses that are always expressed in hexadecimal in datasheets and assembler code.',
  },
  {
    icon: '🐛',
    title: 'Memory debugging',
    description: 'Read and decode memory dumps, core files, and binary data in hex format when debugging segfaults, buffer overflows, or data corruption issues.',
  },
  {
    icon: '🌐',
    title: 'Networking protocols',
    description: 'Inspect Ethernet MAC addresses (e.g., AA:BB:CC:DD:EE:FF), IPv6 addresses, and raw packet bytes — all represented in hexadecimal in network tooling.',
  },
  {
    icon: '🎓',
    title: 'Computer science coursework',
    description: 'Convert numbers between decimal, hex, binary, and octal for assignments covering number systems, character encoding, and data representation.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Hex input (base 16)', description: 'Digits 0–9 and A–F; prefix 0x optional', example: '0xFF or FF' },
  { input: 'Decimal input (base 10)', description: 'Standard integer or decimal number', example: '255' },
  { input: 'Binary input (base 2)', description: 'Digits 0 and 1 only', example: '11111111' },
  { input: 'Hex color (#RRGGBB)', description: '6-digit hex code for CSS/HTML colors', example: '#FF5733' },
  { input: 'RGB output', description: 'Red, green, blue channels each 0–255', example: 'rgb(255, 87, 51)' },
  { input: 'HSL output', description: 'Hue (0–360°), saturation, lightness (%)', example: 'hsl(11, 100%, 60%)' },
  { input: 'Hex arithmetic result', description: 'Sum, difference, product, or quotient in hex', example: '0x1F + 0x2A = 0x49' },
  { input: 'Output', description: 'Decimal equivalent, binary, and color preview', example: '255 | 11111111 | #FF' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '💻', name: 'Binary Calculator', slug: 'binary-calculator', description: 'Binary, octal, decimal conversion and bitwise ops' },
  { icon: '🧮', name: 'Scientific Calculator', slug: 'scientific-calculator', description: 'Advanced math functions and operations' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hex Calculator',
    description: 'Free hex calculator. Convert hex to decimal, binary, RGB, and HSL. Perform hexadecimal arithmetic.',
    url: 'https://roughtools.com/tools/calculators/hex-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://roughtools.com/tools/calculators' },
      { '@type': 'ListItem', position: 3, name: 'Hex Calculator', item: 'https://roughtools.com/tools/calculators/hex-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HexCalculatorPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 20 }} aria-label="Breadcrumb">
          <a href="/" style={{ color: 'var(--fg-2)' }}>Home</a>
          {' › '}
          <a href="/tools/calculators" style={{ color: 'var(--fg-2)' }}>Calculators</a>
          {' › '}
          <span style={{ color: 'var(--brand)' }}>Hex Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          🔢
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Hex Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Convert hexadecimal to decimal, binary, RGB, and HSL. Perform hex arithmetic and decode CSS color codes.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🎨 Color preview'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <HexCalculatorClient />

        <ToolAdUnit position="middle" />

        {/* Quick Reference */}
        <QuickReferenceTable rows={QUICK_REF} />

        {/* When to Use */}
        <WhenToUseCards cards={WHEN_TO_USE} />

        {/* About section */}
        <section
          style={{
            marginTop: 40,
            padding: '28px 32px',
            background: 'var(--bg-1)',
            borderRadius: 16,
            border: '1px solid var(--line-strong)',
          }}
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>
            About This Hex Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Hex Calculator converts hexadecimal numbers to and from decimal, binary, and octal, performs arithmetic on hex values,
            and decodes CSS hex color codes into RGB and HSL components with a live color preview. It is designed for web developers,
            software engineers, computer science students, and anyone who works with color systems, memory addresses, or low-level binary data.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How Hex Conversion Works
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Hexadecimal (base-16) uses positional notation. Each digit is multiplied by 16 raised to its position (from right at 0):
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Decimal = d₍ₙ₎ × 16ⁿ + d₍ₙ₋₁₎ × 16ⁿ⁻¹ + … + d₁ × 16¹ + d₀ × 16⁰
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            For example, 0x1A3 = 1×256 + 10×16 + 3×1 = 256 + 160 + 3 = 419. Decimal-to-hex: repeatedly divide by 16, collect remainders (digits A–F for 10–15), read from bottom to top.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Why Hexadecimal Is Used in Computing
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Hexadecimal exists as a human-readable shorthand for binary. Because 16 = 2⁴, every 4 binary bits map to exactly one hex digit.
            A byte (8 bits) needs only two hex characters — far more compact than 8 binary digits. This is why memory addresses, CPU
            registers, file format magic numbers, SHA hashes, and AES keys are always shown in hex. A 128-bit AES key written in binary
            would be 128 characters; in hex it is just 32 characters.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Hex Colors in Web Development
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            CSS hex colors (#RRGGBB) encode three color channels: red, green, and blue, each as a 2-digit hex value (00–FF). This gives
            256 possible intensities per channel and 16,777,216 total colors. The 4-digit shorthand #RGBA and 8-digit #RRGGBBAA forms
            add an alpha (opacity) channel. Understanding hex color arithmetic lets you darken, lighten, or shift the hue of any color
            programmatically without a design tool.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this hex calculator are performed entirely in your browser. No data you enter is transmitted to any server,
            stored in any database, or shared with third parties. See our{' '}
            <a href="/privacy" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
            for full details.
          </p>
        </section>

        {/* Pro Tips */}
        <ProTipsSection tips={PRO_TIPS} />

        {/* FAQ */}
        <CalculatorFAQ faqs={FAQS} />

        {/* Related Calculators */}
        <RelatedCalculators calculators={RELATED} />

        {/* Compliance kit */}
        <ToolPageExtras
          toolName="Hex Calculator"
          toolSlug="hex-calculator"
          toolUrl="https://roughtools.com/tools/calculators/hex-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
