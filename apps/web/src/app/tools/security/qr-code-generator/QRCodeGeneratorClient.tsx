'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard'
type ErrorLevel = 'L' | 'M' | 'Q' | 'H'
type WifiSecurity = 'WPA' | 'WEP' | 'nopass'

const TYPES: { id: QRType; label: string; icon: string; desc: string }[] = [
  { id: 'url', label: 'URL / Link', icon: '🌐', desc: 'Website, deep link, or any URL' },
  { id: 'text', label: 'Plain Text', icon: '📝', desc: 'Any text content' },
  { id: 'email', label: 'Email', icon: '📧', desc: 'Pre-filled email compose' },
  { id: 'phone', label: 'Phone', icon: '📞', desc: 'Tap to call' },
  { id: 'sms', label: 'SMS', icon: '💬', desc: 'Pre-filled text message' },
  { id: 'wifi', label: 'WiFi', icon: '📶', desc: 'Connect to network instantly' },
  { id: 'vcard', label: 'Contact Card', icon: '👤', desc: 'vCard / business card' },
]

const ERROR_LEVELS: { id: ErrorLevel; label: string; desc: string }[] = [
  { id: 'L', label: 'Low (7%)', desc: 'Smallest QR, minimal error recovery' },
  { id: 'M', label: 'Medium (15%)', desc: 'Good balance — recommended' },
  { id: 'Q', label: 'Quartile (25%)', desc: 'Better recovery, supports logo overlay' },
  { id: 'H', label: 'High (30%)', desc: 'Maximum recovery — use with logos' },
]

function buildQRValue(type: QRType, fields: Record<string, string>): string {
  switch (type) {
    case 'url': return fields.url || 'https://roughtools.com'
    case 'text': return fields.text || ''
    case 'email':
      return `mailto:${fields.emailTo || ''}?subject=${encodeURIComponent(fields.emailSubject || '')}&body=${encodeURIComponent(fields.emailBody || '')}`
    case 'phone': return `tel:${fields.phone || ''}`
    case 'sms': return `sms:${fields.smsPhone || ''}${fields.smsBody ? `?body=${encodeURIComponent(fields.smsBody)}` : ''}`
    case 'wifi':
      return `WIFI:T:${fields.wifiSec || 'WPA'};S:${fields.wifiSSID || ''};P:${fields.wifiPass || ''};H:${fields.wifiHidden === 'true' ? 'true' : 'false'};;`
    case 'vcard':
      return [
        'BEGIN:VCARD', 'VERSION:3.0',
        fields.vcardName ? `FN:${fields.vcardName}` : '',
        fields.vcardOrg ? `ORG:${fields.vcardOrg}` : '',
        fields.vcardPhone ? `TEL:${fields.vcardPhone}` : '',
        fields.vcardEmail ? `EMAIL:${fields.vcardEmail}` : '',
        fields.vcardWeb ? `URL:${fields.vcardWeb}` : '',
        fields.vcardAddress ? `ADR:;;${fields.vcardAddress};;;;` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n')
    default: return ''
  }
}

const FAQS = [
  { q: 'Is this QR code generator free to use?', a: 'Yes, the Roughtools QR Code Generator is completely free with no account, watermarks, or usage limits. You can generate unlimited QR codes for URLs, WiFi networks, contact cards, emails, SMS, phone numbers, and plain text. All QR codes are generated locally in your browser using the open-source qrcode.react library, so nothing is transmitted to any server.' },
  { q: 'Do I need to sign up to download QR codes?', a: 'No sign-up, email, or account is required at any stage. Generate your QR code, download it as SVG or PNG, and use it immediately. Your QR code content — whether it is a private WiFi password, phone number, or contact details — never leaves your device. The download happens entirely in the browser without any server communication.' },
  { q: 'Is my QR code content stored or transmitted anywhere?', a: 'No. All QR code generation happens locally in your browser using the qrcode.react JavaScript library. Your WiFi passwords, phone numbers, email addresses, and any other content you enter are not sent to Roughtools servers at any point. Once you close the tab, the data is gone. There is no backend, no analytics on QR content, and no logging of what you generate.' },
  { q: 'Does the QR code generator work on mobile and tablet?', a: 'Yes, fully. The QR Code Generator is responsive and works on all modern smartphones and tablets. You can generate QR codes on mobile and share them directly. The download buttons produce PNG files compatible with all standard QR code scanners including Apple\'s built-in camera app, Google Lens, and all dedicated QR reader apps. For WiFi QR codes, Android 10+ and iOS 11+ can scan and connect automatically.' },
  { q: 'Which browsers support this QR code generator?', a: 'The tool works in all modern browsers: Chrome, Firefox, Edge, Safari, and Opera. Both desktop and mobile versions are supported. The SVG download works in all browsers. The PNG download uses the HTML Canvas API, which is supported in Chrome 4+, Firefox 2+, Safari 3.1+, and Edge 12+. Internet Explorer is not supported.' },
  { q: 'How do I create a WiFi QR code for my network?', a: 'Select "WiFi" as the QR type. Enter your network SSID (the exact network name as it appears on your devices), your WiFi password, and select the security type (WPA/WPA2 for most modern routers, WEP for older networks, or None for open networks). Toggle "Hidden Network" if your SSID is not broadcast publicly. The generated QR code, when scanned by a phone, will automatically offer to connect to the network without typing the password.' },
  { q: 'How accurate are the QR codes? Will they scan reliably?', a: 'The QR codes are generated to the ISO/IEC 18004 standard using the qrcode.react library, which is tested and used by millions of applications worldwide. The error correction level you choose determines scan reliability — Medium (15%) is recommended for most uses, while High (30%) is ideal for printed materials or when adding a logo overlay. Higher error correction allows the QR to remain scannable even if part of it is obscured, damaged, or printed at lower quality.' },
  { q: 'How do I download my QR code as PNG or SVG?', a: 'After generating your QR code, click "Download PNG" for a raster image (best for printing and sharing) or "Download SVG" for a scalable vector format (best for large-format printing, logos, and editing in Illustrator or Inkscape). Both download options save the file directly to your device with no watermarks. The PNG download renders at your chosen size. SVG files scale to any size without quality loss.' },
  { q: 'What is error correction level and which should I choose?', a: 'Error correction (EC) level determines how much of the QR code can be damaged or obscured while still scanning correctly. Level L (7%) produces the smallest QR code. Level M (15%) is the standard recommendation for most uses. Level Q (25%) is suitable when you plan to add a logo or icon in the centre. Level H (30%) provides maximum damage resistance and is best for QR codes on textured surfaces, curved objects, or outdoor signage that may be partially obscured.' },
  { q: 'Why should I use Roughtools QR code generator?', a: 'Roughtools QR Code Generator supports 7 QR types in one place — including WiFi, vCard, email, SMS, and phone — while most free tools only support URLs. All generation is client-side with no watermarks, no account, and no limits. You get full control over size (128–512px), foreground and background colour, and error correction level. The SVG and PNG download options make it suitable for professional use in print, digital, and product packaging contexts.' },
]

export default function QRCodeGenerator() {
  const [type, setType] = useState<QRType>('url')
  const [fields, setFields] = useState<Record<string, string>>({ url: 'https://roughtools.com', wifiSec: 'WPA' })
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M')
  const [faqOpen, setFaqOpen] = useState<number|null>(null)
  const svgRef = useRef<HTMLDivElement>(null)

  const set = (k: string, v: string) => setFields(prev => ({ ...prev, [k]: v }))
  const qrValue = buildQRValue(type, fields)

  const downloadSVG = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'qrcode.svg'; a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadPNG = useCallback(() => {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')!
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      canvas.toBlob(blob => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'qrcode.png'; a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)))
  }, [size])

  const CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
  const LBL = 'block text-xs font-medium text-gray-400 mb-1.5'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Security Tools
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">QR Code Generator</h1>
          <span className="ml-auto text-xs bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">📷 Client-Side · No Watermarks</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Left: Controls */}
          <div className="space-y-4">
            {/* Hero */}
            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-800/50 rounded-2xl p-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Professional QR Code Generator</h2>
              <p className="text-cyan-300/70 text-sm">7 QR types · Custom colors · SVG & PNG download · Error correction · No watermarks · 100% free</p>
            </div>

            {/* Type selector */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">QR Code Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setType(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${type === t.id ? 'border-cyan-500 bg-cyan-900/30' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'}`}>
                    <div className="text-lg mb-1">{t.icon}</div>
                    <div className="font-semibold text-xs text-white">{t.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content fields */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-300">Content</h3>

              {type === 'url' && (
                <div><label className={LBL}>URL</label><input value={fields.url||''} onChange={e=>set('url',e.target.value)} placeholder="https://example.com" className={CLS}/></div>
              )}
              {type === 'text' && (
                <div><label className={LBL}>Text Content</label><textarea value={fields.text||''} onChange={e=>set('text',e.target.value)} placeholder="Any text content..." rows={4} className={`${CLS} resize-none`}/></div>
              )}
              {type === 'email' && (
                <div className="space-y-3">
                  <div><label className={LBL}>To Email Address</label><input value={fields.emailTo||''} onChange={e=>set('emailTo',e.target.value)} placeholder="recipient@example.com" className={CLS}/></div>
                  <div><label className={LBL}>Subject (optional)</label><input value={fields.emailSubject||''} onChange={e=>set('emailSubject',e.target.value)} placeholder="Hello there" className={CLS}/></div>
                  <div><label className={LBL}>Body (optional)</label><textarea value={fields.emailBody||''} onChange={e=>set('emailBody',e.target.value)} placeholder="Message body..." rows={3} className={`${CLS} resize-none`}/></div>
                </div>
              )}
              {type === 'phone' && (
                <div><label className={LBL}>Phone Number (with country code)</label><input value={fields.phone||''} onChange={e=>set('phone',e.target.value)} placeholder="+1 555 000 0000" className={CLS}/></div>
              )}
              {type === 'sms' && (
                <div className="space-y-3">
                  <div><label className={LBL}>Phone Number</label><input value={fields.smsPhone||''} onChange={e=>set('smsPhone',e.target.value)} placeholder="+1 555 000 0000" className={CLS}/></div>
                  <div><label className={LBL}>Pre-filled Message (optional)</label><textarea value={fields.smsBody||''} onChange={e=>set('smsBody',e.target.value)} placeholder="Hi, I scanned your QR code..." rows={2} className={`${CLS} resize-none`}/></div>
                </div>
              )}
              {type === 'wifi' && (
                <div className="space-y-3">
                  <div><label className={LBL}>Network Name (SSID)</label><input value={fields.wifiSSID||''} onChange={e=>set('wifiSSID',e.target.value)} placeholder="MyWiFiNetwork" className={CLS}/></div>
                  <div><label className={LBL}>Password</label><input type="password" value={fields.wifiPass||''} onChange={e=>set('wifiPass',e.target.value)} placeholder="WiFi password" className={CLS}/></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LBL}>Security Type</label>
                      <select value={fields.wifiSec||'WPA'} onChange={e=>set('wifiSec',e.target.value)} className={CLS}>
                        <option value="WPA">WPA/WPA2 (most routers)</option>
                        <option value="WEP">WEP (older routers)</option>
                        <option value="nopass">None (open network)</option>
                      </select>
                    </div>
                    <div>
                      <label className={LBL}>Hidden Network</label>
                      <select value={fields.wifiHidden||'false'} onChange={e=>set('wifiHidden',e.target.value)} className={CLS}>
                        <option value="false">No (SSID is broadcast)</option>
                        <option value="true">Yes (hidden SSID)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {type === 'vcard' && (
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={LBL}>Full Name</label><input value={fields.vcardName||''} onChange={e=>set('vcardName',e.target.value)} placeholder="Jane Smith" className={CLS}/></div>
                  <div><label className={LBL}>Organisation</label><input value={fields.vcardOrg||''} onChange={e=>set('vcardOrg',e.target.value)} placeholder="Acme Corp" className={CLS}/></div>
                  <div><label className={LBL}>Phone</label><input value={fields.vcardPhone||''} onChange={e=>set('vcardPhone',e.target.value)} placeholder="+1 555 000 0000" className={CLS}/></div>
                  <div><label className={LBL}>Email</label><input value={fields.vcardEmail||''} onChange={e=>set('vcardEmail',e.target.value)} placeholder="jane@acme.com" className={CLS}/></div>
                  <div><label className={LBL}>Website</label><input value={fields.vcardWeb||''} onChange={e=>set('vcardWeb',e.target.value)} placeholder="https://acme.com" className={CLS}/></div>
                  <div><label className={LBL}>Address</label><input value={fields.vcardAddress||''} onChange={e=>set('vcardAddress',e.target.value)} placeholder="123 Main St, NY" className={CLS}/></div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">Appearance & Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2"><label className={LBL}>Size</label><span className="text-xs text-cyan-400 font-bold">{size}×{size}px</span></div>
                  <input type="range" min={128} max={512} step={32} value={size} onChange={e=>setSize(+e.target.value)} className="w-full accent-cyan-500 cursor-pointer"/>
                </div>
                <div>
                  <label className={LBL}>Error Correction</label>
                  <select value={errorLevel} onChange={e=>setErrorLevel(e.target.value as ErrorLevel)} className={CLS}>
                    {ERROR_LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LBL}>Foreground Colour</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} className="w-10 h-10 rounded border border-gray-700 cursor-pointer bg-transparent"/>
                    <input value={fgColor} onChange={e=>setFgColor(e.target.value)} className={`${CLS} flex-1`} placeholder="#000000"/>
                  </div>
                </div>
                <div>
                  <label className={LBL}>Background Colour</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} className="w-10 h-10 rounded border border-gray-700 cursor-pointer bg-transparent"/>
                    <input value={bgColor} onChange={e=>setBgColor(e.target.value)} className={`${CLS} flex-1`} placeholder="#ffffff"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: QR Preview */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Preview</h3>
              <div ref={svgRef} className="flex justify-center mb-4 p-4 rounded-xl" style={{ background: bgColor }}>
                {qrValue ? (
                  <QRCodeSVG
                    value={qrValue}
                    size={Math.min(size, 220)}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={errorLevel}
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-500 text-sm text-center">
                    Fill in content to generate QR code
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <button onClick={downloadPNG} disabled={!qrValue}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                  ⬇️ Download PNG
                </button>
                <button onClick={downloadSVG} disabled={!qrValue}
                  className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                  ⬇️ Download SVG
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-600 text-center">
                No watermarks · No account · No limits
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={e => { e.preventDefault(); setFaqOpen(faqOpen === i ? null : i) }}>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left">{faq.q}</h3>
                  <span className="text-cyan-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="QR Code Generator"
          toolSlug="qr-code-generator"
          toolUrl="https://roughtools.com/tools/security/qr-code-generator"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
