import type { Metadata } from 'next'
import Link from 'next/link'
import ColorPickerClient from './ColorPickerClient'
import { ToolPageExtras } from '@/components/ToolPageExtras'

export const metadata: Metadata = {
  title: 'Color Picker & Converter — HEX, RGB, HSL, HSV | RoughTools',
  description: 'Pick any color and instantly see its HEX, RGB, HSL, and HSV values. Convert between all color formats and copy any value with one click — free online color tool.',
  keywords: ['color picker', 'color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'online color picker', 'color code converter'],
  alternates: { canonical: 'https://roughtools.com/tools/developer/color-picker' },
  openGraph: {
    title: `Color Picker — HEX, RGB, HSL Color Converter | RoughTools`,
    description: `Pick colors and convert between HEX, RGB, HSL, and RGBA formats instantly. Free browser-based color picker and converter.`,
    url: 'https://roughtools.com/tools/developer/color-picker',
    type: 'website',
    siteName: 'RoughTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Color Picker — HEX, RGB, HSL Color Converter | RoughTools`,
    description: `Pick colors and convert between HEX, RGB, HSL, and RGBA formats instantly. Free browser-based color picker and converter.`,
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Is this color picker free to use?', a: 'Yes, the RoughTools Color Picker is completely free with no account, subscription, or payment required. You can pick and convert unlimited colors at no cost. RoughTools is funded through non-intrusive advertising, keeping every developer tool permanently free. There are no usage limits, no premium color formats behind a paywall, and no registration required.' },
  { q: 'Do I need to sign up to use the color picker?', a: 'No account, email, or registration is required. Open the page, pick a color or enter a HEX/RGB value, and all four formats update instantly. There is no login wall and no data stored about the colors you pick. The tool is entirely anonymous and can be used for unlimited color exploration and conversion without any sign-up process.' },
  { q: 'Does this tool store the colors I pick?', a: 'No. All color conversion runs entirely within your browser using JavaScript. The color values you enter or pick are never transmitted to RoughTools servers, never logged, and never shared with any third party. Once you close the browser tab, all data is gone. Your design work and color palettes remain completely private.' },
  { q: 'Does the color picker work on mobile and tablet?', a: 'Yes, the tool is fully responsive and works on all modern smartphones and tablets. The color picker UI and all four format displays are optimised for touch screens. This is useful when sampling colors from design references on your phone, checking color accessibility on mobile, or quickly converting a color code received via message or email on your device.' },
  { q: 'Which browsers support this color picker?', a: 'The Color Picker works in all modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera, and Brave. The color input uses the browser\'s native color picker widget, which provides a full color selector on all current desktop and mobile browsers. Safari on iOS provides a particularly clean native color picker experience.' },
  { q: 'How accurate are the color format conversions?', a: 'All color conversions use the standard mathematical formulas defined by the sRGB color model. HEX to RGB conversion is exact. RGB to HSL and HSV conversions use precise floating-point arithmetic following the standard algorithm. Minor rounding may occur at extreme hue angles due to floating-point representation, but for all practical design and development purposes the output is accurate to the precision needed.' },
  { q: 'Can I use this color tool without an internet connection?', a: 'Once the page has fully loaded, all color picking and conversion runs in JavaScript without requiring an active internet connection. You can pick colors and view all format conversions offline. This is useful when working on design files in isolated environments, on flights, or in locations with restricted internet access. The initial page load requires internet, but after that the tool is fully client-side.' },
  { q: 'How do I convert a color between formats step by step?', a: 'To convert a color: (1) Use the color swatch/picker to visually select a color, or type a known HEX code (like #3b82f6) directly into the HEX field. (2) All other formats — RGB, HSL, and HSV — update instantly. (3) Click the copy button next to any format to copy that value to your clipboard. (4) Paste directly into your CSS, Tailwind config, Figma, or design tool. You can also enter values in any format field and all others will update to match.' },
  { q: 'Why should I use RoughTools instead of a search engine for color conversion?', a: 'Searching "hex to rgb converter" gives a basic single-pair converter. RoughTools Color Picker shows all four formats simultaneously — HEX, RGB, HSL, and HSV — in one view, with individual copy buttons for each. This is more efficient for design workflows where you need to supply the same color in different formats for CSS custom properties, Tailwind configuration, Android XML, and iOS UIColor in the same project.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or request a feature — such as CMYK output, Pantone lookup, CSS named colors, color accessibility contrast checker, palette generation, or oklch/lch support — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include the color value you entered, the browser and OS, and what you expected versus what was displayed.' },
  { q: 'What is the difference between HSL and HSV color models?', a: 'Both HSL and HSV represent colors using Hue (0–360°), Saturation (0–100%), and a third component. HSL (Hue, Saturation, Lightness) sets Lightness where 0% = black, 100% = white, and 50% = the pure hue. This is the model used in CSS: hsl(210, 100%, 50%) produces pure blue. HSV (Hue, Saturation, Value) sets Value where 0% = black and 100% = the fully bright hue (without the white washing of HSL). HSV is used in most visual color pickers and design applications like Photoshop and Figma because it feels more intuitive when adjusting brightness and saturation visually.' },
  { q: 'What is a HEX color code and how does it work?', a: 'A HEX color code is a 6-character hexadecimal representation of an RGB color, prefixed with #. Each pair of characters represents one of the three color channels: Red, Green, and Blue, each ranging from 00 (0) to FF (255). For example, #3b82f6 breaks down as Red=3b(59), Green=82(130), Blue=f6(246) — a medium blue. Shorthand 3-character HEX codes (like #fff for white) exist where each character is doubled: #abc = #aabbcc. HEX codes are used in CSS, HTML, SVG, and most web design contexts.' },
]

export default function Page() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roughtools.com' },
      { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://roughtools.com/tools/developer' },
      { '@type': 'ListItem', position: 3, name: 'Color Picker', item: 'https://roughtools.com/tools/developer/color-picker' },
    ],
  }

  const webappLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Color Picker',
    url: 'https://roughtools.com/tools/developer/color-picker',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free online color picker tool by RoughTools.',
  }

  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webappLd) }} />
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/developer" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Developer Tools
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="font-bold text-white text-sm">Color Picker & Converter</h1>
          <span className="ml-auto text-xs bg-fuchsia-900/50 text-fuchsia-400 border border-fuchsia-800 px-2 py-0.5 rounded-full">🎨 HEX · RGB · HSL · HSV</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-fuchsia-900/60 to-pink-900/60 border-b border-fuchsia-800/30">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {['HEX', 'RGB', 'HSL', 'HSV', 'Copy Any Format', 'Visual Picker', 'Free'].map(b => (
              <span key={b} className="text-xs bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-700/40 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Color Picker & Format Converter</h2>
          <p className="text-fuchsia-200/80 text-sm sm:text-base leading-relaxed max-w-3xl">Pick any color visually or enter a known value in any format — HEX, RGB, HSL, or HSV — and instantly see all four representations updated simultaneously. Copy any format with a single click. Useful for CSS development, design system color tokens, Tailwind configuration, Figma handoff, and any workflow where you need the same color in multiple format representations without manual conversion.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-[#0d0d1a] border border-fuchsia-900/20 rounded-2xl p-1"><ColorPickerClient /></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '🎨', title: '4 Formats', desc: 'HEX, RGB, HSL, and HSV shown simultaneously' }, { icon: '📋', title: 'One-Click Copy', desc: 'Copy button on every format for instant clipboard access' }, { icon: '⚡', title: 'Instant', desc: 'All formats update in real time as you pick or type' }].map(c => (
            <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div><div className="font-bold text-white text-xs mb-1">{c.title}</div><div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <section><h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">{FAQS.map((faq, i) => (
            <details key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <h3 className="text-sm font-semibold text-white text-left pr-4">{faq.q}</h3>
                <span className="text-fuchsia-400 font-bold text-lg flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-gray-400 leading-relaxed border-t border-gray-800">{faq.a}</div>
            </details>
          ))}</div>
        </section>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related Developer Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[{ href: '/tools/developer/css-minifier', label: '💨 CSS Minifier' }, { href: '/tools/developer/html-encoder', label: '🌐 HTML Encoder' }, { href: '/tools/developer/json-formatter', label: '{ } JSON Formatter' }, { href: '/tools/developer/url-encoder', label: '🔗 URL Encoder' }, { href: '/tools/developer/diff-checker', label: '↔️ Diff Checker' }].map(l => (
              <Link key={l.href} href={l.href} className="text-sm bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300 hover:border-fuchsia-500 hover:text-fuchsia-400 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        <ToolPageExtras
          toolName="Color Picker"
          toolSlug="color-picker"
          toolUrl="https://roughtools.com/tools/developer/color-picker"
          type="general"
          showPDF
        />
      </div>
    </div>
  )
}
