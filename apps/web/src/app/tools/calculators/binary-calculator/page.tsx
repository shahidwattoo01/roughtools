import type { Metadata } from 'next'
import BinaryCalculatorClient from './BinaryCalculatorClient'
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

const _seo = getCalcSEO('binary-calculator')
export const metadata: Metadata = {
  title: _seo?.seoTitle ?? 'Free Binary Calculator | RoughTools',
  description: _seo?.metaDescription ?? 'Convert between binary, octal, decimal, and hex. Perform AND, OR, XOR, NAND, NOR, SHIFT operations. Free, instant, no signup.',
  keywords: ['binary calculator', 'binary to decimal', 'decimal to binary', 'bitwise calculator', 'hex to binary converter'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/calculators/binary-calculator' },
  openGraph: {
    title: 'Free Binary Calculator | RoughTools',
    description: 'Convert between binary, octal, decimal, hex and perform bitwise operations. Free, instant.',
    url: 'https://roughtools.com/tools/calculators/binary-calculator',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Binary Calculator | RoughTools',
    description: 'Convert binary, octal, decimal, hex and perform bitwise operations.',
  },
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How accurate is this binary calculator?',
    a: 'All conversions and bitwise operations are mathematically exact. Binary-to-decimal and decimal-to-binary conversions follow strict base-conversion rules with no rounding. Bitwise operations (AND, OR, XOR, NOT, SHIFT) are performed on the full integer representation. For very large numbers beyond JavaScript\'s safe integer range (2⁵³), precision notes are shown.',
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
    q: 'Do I need professional advice to use binary conversions?',
    a: 'No professional advice is needed for binary conversions — they are exact mathematical operations. However, if you are using binary representations for safety-critical systems, cryptographic protocols, or embedded firmware, consult a qualified engineer to verify your implementation.',
  },
  {
    q: 'What formula does binary-to-decimal conversion use?',
    a: 'Each binary digit is multiplied by 2 raised to its positional power (counting from right at 0), then the results are summed. For example, 1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11₁₀. Decimal-to-binary uses repeated division by 2, collecting remainders read bottom-up.',
  },
  {
    q: 'Why do computers use binary (base-2)?',
    a: 'Computers use binary because electronic circuits naturally have two stable states: on (1) and off (0), represented by high and low voltage. Building reliable hardware around two states is far simpler and more noise-resistant than handling ten states. Every number, letter, and instruction inside a computer is ultimately stored as a sequence of bits (binary digits).',
  },
  {
    q: 'What is a bit, and what is a byte?',
    a: 'A bit (binary digit) is the smallest unit of data in computing — a single 0 or 1. A byte is 8 bits grouped together, capable of representing 256 different values (0–255). Most modern data is measured in kilobytes (1,024 bytes), megabytes, gigabytes, and so on. The word "byte" is the foundational building block of all digital storage.',
  },
  {
    q: 'How does binary arithmetic work?',
    a: 'Binary addition follows the same rules as decimal but in base 2: 0+0=0, 0+1=1, 1+1=10 (write 0, carry 1), 1+1+1=11 (write 1, carry 1). For example, 1010 + 0110 = 10000 (10 + 6 = 16). Subtraction uses borrowing. Multiplication and division also mirror decimal methods but only use 0 and 1.',
  },
  {
    q: 'What is the difference between signed and unsigned binary, and what is two\'s complement?',
    a: 'Unsigned binary represents only non-negative integers. Signed binary uses the most significant bit (MSB) as a sign bit. Two\'s complement is the standard signed representation: to negate a number, flip all bits then add 1. In 8-bit two\'s complement, range is -128 to 127; unsigned 8-bit range is 0 to 255. Modern CPUs use two\'s complement because addition and subtraction circuits work identically for both signed and unsigned numbers.',
  },
]

// ─── Pro Tips ─────────────────────────────────────────────────────────────────

const PRO_TIPS = [
  'Use hexadecimal as shorthand for binary — each hex digit maps to exactly 4 bits. For example, 0xFF = 11111111 in binary and 0xA = 1010. This makes reading and writing large binary numbers in code much faster and less error-prone than spelling out every bit.',
  'Memorising powers of 2 up to 2¹⁰ = 1,024 is one of the highest-return memorisation tasks in computer science. Knowing that 2⁸ = 256, 2¹⁰ = 1,024, and 2¹⁶ = 65,536 lets you instantly recognize common data boundaries, memory sizes, and IP address components.',
  'Bit shifting is the fastest way to multiply or divide by powers of 2. Shifting left by n bits multiplies by 2ⁿ; shifting right by n bits divides by 2ⁿ (integer division). This trick is widely used in performance-critical code, embedded systems, and graphics programming.',
  'Know the difference between MSB (most significant bit) and LSB (least significant bit). The MSB carries the highest weight (leftmost in standard notation) and the LSB carries the lowest (rightmost). When debugging binary protocols and file formats, confusion about bit ordering (big-endian vs little-endian) is a frequent source of bugs.',
]

// ─── When to Use ─────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: '🎓',
    title: 'Computer science homework',
    description: 'Convert between number bases and verify bitwise operation results for CS assignments. Great for self-checking base-conversion steps before an exam.',
  },
  {
    icon: '🌐',
    title: 'Networking — IP addresses and subnets',
    description: 'IP addresses and subnet masks are binary under the hood. Convert IPv4 octets to binary to understand CIDR notation, subnet divisions, and network masks.',
  },
  {
    icon: '🐛',
    title: 'Programming and debugging',
    description: 'Verify flag values, bitmask operations, and register states when debugging low-level code. Check that your AND, OR, and XOR logic produces the expected bit pattern.',
  },
  {
    icon: '⚡',
    title: 'Digital electronics and hardware',
    description: 'Design logic gates, verify truth tables, and check binary-coded decimal (BCD) representations used in digital circuits and microcontroller programming.',
  },
  {
    icon: '🔤',
    title: 'Encoding and decoding',
    description: 'Understand how ASCII and Unicode characters map to binary. Inspect the binary representation of text characters for encoding troubleshooting.',
  },
]

// ─── Quick Reference table ────────────────────────────────────────────────────

const QUICK_REF = [
  { input: 'Binary input', description: 'Base-2 number using only 0 and 1 digits', example: '1011 0110' },
  { input: 'Decimal input', description: 'Base-10 number using digits 0–9', example: '182' },
  { input: 'Hex input', description: 'Base-16 using digits 0–9 and A–F', example: '0xB6' },
  { input: 'Octal input', description: 'Base-8 using digits 0–7', example: '266' },
  { input: 'AND operation', description: 'Returns 1 only where both inputs have 1', example: '1010 AND 1100 = 1000' },
  { input: 'OR operation', description: 'Returns 1 where either input has 1', example: '1010 OR 1100 = 1110' },
  { input: 'XOR operation', description: 'Returns 1 where exactly one input has 1', example: '1010 XOR 1100 = 0110' },
  { input: 'NOT operation', description: 'Flips all bits (bitwise complement)', example: 'NOT 1010 = 0101' },
]

// ─── Related calculators ──────────────────────────────────────────────────────

const RELATED = [
  { icon: '🔢', name: 'Hex Calculator', slug: 'hex-calculator', description: 'Hexadecimal arithmetic and color codes' },
  { icon: '🧮', name: 'Scientific Calculator', slug: 'scientific-calculator', description: 'Advanced math functions and operations' },
  { icon: '📊', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Percentage of a number, increase/decrease' },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Binary Calculator',
    description: 'Free binary calculator. Convert between binary, octal, decimal, and hexadecimal. Perform bitwise operations: AND, OR, XOR, NOT, SHIFT.',
    url: 'https://roughtools.com/tools/calculators/binary-calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Binary Calculator', item: 'https://roughtools.com/tools/calculators/binary-calculator' },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BinaryCalculatorPage() {
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
          <span style={{ color: 'var(--brand)' }}>Binary Calculator</span>
        </nav>

        {/* H1 */}
        <div style={{ fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', borderRadius: 14, padding: '10px 14px', lineHeight: 1, marginBottom: 12 }}>
          💻
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Free Binary Calculator
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
          Convert between binary, octal, decimal, and hexadecimal. Perform bitwise operations: AND, OR, XOR, NAND, NOR, NOT, and left/right bit shifts.
          Free, private — all calculations run in your browser.
        </p>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {['⚡ Instant results', '🔒 100% private', '🆓 Always free', '🚫 No signup', '🔢 Exact conversions'].map(b => (
            <span key={b} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12, color: 'var(--brand-2)', fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        <ToolAdUnit position="top" />

        {/* Calculator widget */}
        <BinaryCalculatorClient />

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
            About This Binary Calculator
          </h2>

          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            The Binary Calculator lets you convert numbers between four number bases — binary (base 2), octal (base 8), decimal (base 10),
            and hexadecimal (base 16) — and perform bitwise logical and shift operations. It is an essential tool for computer science
            students, software developers, hardware engineers, and anyone working with low-level programming, networking, or digital electronics.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Formula — How Conversions Work
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Binary-to-decimal conversion uses positional notation: each bit is multiplied by 2 raised to its positional power, counted from right starting at 0:
          </p>
          <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14, fontFamily: 'monospace', fontSize: 13, color: 'var(--brand-2)' }}>
            Decimal = b₍ₙ₎ × 2ⁿ + b₍ₙ₋₁₎ × 2ⁿ⁻¹ + … + b₁ × 2¹ + b₀ × 2⁰
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Decimal-to-binary conversion uses repeated division by 2, collecting remainders from bottom to top. The same principle applies
            for other bases: divide repeatedly by the target base, collect remainders.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            The Binary Number System
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Binary (base-2) is the fundamental language of computers. Every piece of data — text, images, video, programs — is ultimately
            stored and processed as sequences of 0s and 1s. These correspond to the two voltage states of transistors in a CPU: high voltage
            = 1, low voltage = 0. This simplicity makes digital circuits extremely reliable and scalable.
          </p>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Hexadecimal (base-16) is commonly used as a shorthand for binary because every 4 binary bits correspond to exactly one hex digit
            (0–9, A–F). A byte (8 bits) is represented by two hex digits, which is why memory addresses, color codes (#RRGGBB), and file hashes
            are written in hex. Octal (base-8) maps 3 bits per digit and is used in Unix file permission notation (e.g., chmod 755).
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Bitwise Operations
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, marginBottom: 14 }}>
            Bitwise operations manipulate individual bits. AND is used to clear specific bits (masking). OR is used to set specific bits. XOR
            is used to toggle bits or detect differences (also used in simple encryption). NOT flips all bits to produce the one's complement.
            Left shift (≪) multiplies by 2 per shift; right shift (≫) divides by 2 per shift — making shifts the fastest way to scale by
            powers of 2 in low-level code. These operations are essential in systems programming, graphics, cryptography, and embedded firmware.
          </p>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-2)', margin: '20px 0 10px' }}>
            Privacy Notice
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0 }}>
            All calculations in this binary calculator are performed entirely in your browser. No data you enter is transmitted to any server,
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
          toolName="Binary Calculator"
          toolSlug="binary-calculator"
          toolUrl="https://roughtools.com/tools/calculators/binary-calculator"
          type="general"
        />

        <ToolAdUnit position="bottom" />
      </div>
    </>
  )
}
