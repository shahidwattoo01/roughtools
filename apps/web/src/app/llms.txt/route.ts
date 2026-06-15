import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roughtools.com'

const LLMS_TXT = `# RoughTools — Free Online Tools

> RoughTools is a free online tools platform with 250+ tools across PDF, calculators, developer utilities, text tools, unit converters, network tools, and security tools. No signup required for any tool. All tools work in your browser — no file uploads, no server processing for most tools.

## About
- Website: ${BASE_URL}
- Tagline: Free Online Tools for Everyone
- Tools available: 250+
- No account required: Yes
- Privacy: Most tools run entirely in your browser — your data never leaves your device
- Pricing: Free forever — all 604+ tools, no signup required, no watermarks
- Blog: ${BASE_URL}/blog — guides, tutorials, tips for using free online tools

## Tool Categories

### PDF & Document Tools (40+ tools)
Free PDF tools running entirely in your browser: compress PDF, merge PDF, split PDF, rotate PDF, add watermark, add page numbers, remove pages, organize pages, PDF to Word, PDF to Excel, PDF to JPG, Word to PDF, Excel to PDF, PowerPoint to PDF, HTML to PDF, OCR PDF, sign PDF, protect PDF, unlock PDF, repair PDF, redact PDF, crop PDF, compare PDF, scan to PDF, and more.
- ${BASE_URL}/tools/document-tools

### Calculators (21 tools)
BMI calculator, mortgage calculator, loan calculator with amortization, compound interest calculator, age calculator, percentage calculator, tip calculator, income tax calculator, ROI calculator, currency converter (170+ currencies), GPA calculator, calorie calculator, salary converter, inflation calculator, body fat calculator, retirement calculator, scientific calculator, discount calculator, pregnancy due date calculator, ovulation calculator.
- ${BASE_URL}/tools/calculators

### Developer Tools (19 tools)
JSON formatter & validator, Base64 encode/decode, regex tester with live matches, UUID generator (v4), hash generator (MD5/SHA-1/SHA-256/SHA-512), JWT decoder, CSS minifier, JavaScript beautifier, URL encoder/decoder, HTML entity encoder, timestamp converter, color picker (HEX/RGB/HSL), chmod calculator, cron expression parser, SQL formatter, XML formatter, YAML validator, diff checker, markdown editor with preview.
- ${BASE_URL}/tools/developer

### Text Tools (10 tools)
Word counter (words, characters, sentences, reading time), case converter (8 case types), lorem ipsum generator, grammar checker, readability score (Flesch-Kincaid), text summarizer, text-to-speech (Web Speech API), remove duplicate lines, text reverser, find & replace.
- ${BASE_URL}/tools/text

### Unit Converters (8 tools)
Temperature converter (Celsius/Fahrenheit/Kelvin/Rankine), length converter, weight/mass converter, area converter, volume converter, speed converter, time converter, digital storage converter (bytes/KB/MB/GB/TB/PB).
- ${BASE_URL}/tools/converters

### Network Tools (7 tools)
IP address checker (geolocation, ISP, timezone), DNS lookup (A/AAAA/CNAME/MX/TXT), WHOIS lookup, port checker, ping tool, HTTP headers checker, website speed test.
- ${BASE_URL}/tools/network

### Security & Privacy (8 tools)
Password generator (customizable rules), QR code generator (URL/WiFi/vCard/text, PNG+SVG), URL shortener, temporary email, file encryptor (AES-256), VPN checker, SSL certificate checker, metadata remover (photos/PDFs).
- ${BASE_URL}/tools/security

## Individual Tool URLs

### High-Traffic PDF Tools
- ${BASE_URL}/tools/document-tools/compress-pdf — Reduce PDF file size up to 90%
- ${BASE_URL}/tools/document-tools/merge-pdf — Combine multiple PDFs into one
- ${BASE_URL}/tools/document-tools/pdf-to-word — Convert PDF to Word document
- ${BASE_URL}/tools/document-tools/pdf-to-jpg — Convert PDF pages to JPG images
- ${BASE_URL}/tools/document-tools/split-pdf — Split PDF into separate files
- ${BASE_URL}/tools/document-tools/rotate-pdf — Rotate PDF pages

### High-Traffic Calculators
- ${BASE_URL}/tools/calculators/bmi-calculator — Body Mass Index calculator
- ${BASE_URL}/tools/calculators/mortgage-calculator — Monthly payment & amortization
- ${BASE_URL}/tools/calculators/compound-interest-calculator — Investment growth calculator
- ${BASE_URL}/tools/calculators/age-calculator — Exact age in years, months, days
- ${BASE_URL}/tools/calculators/currency-converter — Live exchange rates, 170+ currencies
- ${BASE_URL}/tools/calculators/loan-calculator — Loan payment and total interest

### Popular Developer Tools
- ${BASE_URL}/tools/developer/json-formatter — Format, minify, validate JSON
- ${BASE_URL}/tools/developer/base64-encoder — Encode/decode Base64
- ${BASE_URL}/tools/developer/uuid-generator — Generate UUID v4
- ${BASE_URL}/tools/developer/regex-tester — Live regex testing with match highlighting
- ${BASE_URL}/tools/developer/hash-generator — MD5, SHA-1, SHA-256, SHA-512
- ${BASE_URL}/tools/developer/color-picker — HEX, RGB, HSL color converter

### Popular Converters
- ${BASE_URL}/tools/converters/temperature-converter — Celsius, Fahrenheit, Kelvin
- ${BASE_URL}/tools/converters/length-converter — Meters, feet, inches, km, miles
- ${BASE_URL}/tools/converters/weight-converter — Kg, lbs, oz, stone
- ${BASE_URL}/tools/converters/digital-storage-converter — Bytes, KB, MB, GB, TB

## Blog Articles
- ${BASE_URL}/blog — All guides and tutorials
- ${BASE_URL}/blog/how-to-compress-pdf-without-losing-quality
- ${BASE_URL}/blog/bmi-calculator-guide-what-your-bmi-means
- ${BASE_URL}/blog/mortgage-calculator-how-much-house-can-you-afford
- ${BASE_URL}/blog/password-security-guide-2026
- ${BASE_URL}/blog/free-developer-tools-2026
- ${BASE_URL}/blog/qr-code-generator-guide
- ${BASE_URL}/blog/json-formatter-guide
- ${BASE_URL}/blog/temperature-converter-celsius-fahrenheit
- ${BASE_URL}/blog/base64-encode-decode-guide

## Legal & Contact
- Privacy Policy: ${BASE_URL}/privacy-policy
- Terms of Service: ${BASE_URL}/terms-of-service
- Contact: ${BASE_URL}/contact
- Support: shahidwattoo0111@gmail.com
`

export function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
