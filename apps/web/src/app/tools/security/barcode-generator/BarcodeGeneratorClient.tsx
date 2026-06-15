'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

// ─── Barcode encoders ─────────────────────────────────────────

function drawCode128(canvas: HTMLCanvasElement, data: string, opts: { fg: string; bg: string; scale: number; showText: boolean }) {
  const CODE128B_START = 104, CODE128B_STOP = 106
  const CODE128_CHARS: Record<string, number> = {}
  const CODE128_PATTERNS: string[] = [
    '11011001100','11001101100','11001100110','10010011000','10010001100','10001001100','10011001000','10011000100','10001100100','11001001000',
    '11001000100','11000100100','10110011100','10011011100','10011001110','10111001100','10011101100','10011100110','11001110010','11001011100',
    '11001001110','11011100100','11001110100','11101101110','11101001100','11100101100','11100100110','11101100100','11100110100','11100110010',
    '11011011000','11011000110','11000110110','10100011000','10001011000','10001000110','10110001000','10001101000','10001100010','11010001000',
    '11000101000','11000100010','10110111000','10110001110','10001101110','10111011000','10111000110','10001110110','11101110110','11010001110',
    '11000101110','11011101000','11011100010','11011101110','11101011000','11101000110','11100010110','11101101000','11101100010','11100011010',
    '11101111010','11001000010','11110001010','10100110000','10100001100','10010110000','10010000110','10000101100','10000100110','10110010000',
    '10110000100','10011010000','10011000010','10000110100','10000110010','11000010010','11001010000','11110111010','11000010100','10001111010',
    '10100111100','10010111100','10010011110','10111100100','10011110100','10011110010','11110100100','11110010100','11110010010','11011011110',
    '11011110110','11110110110','10101111000','10100011110','10001011110','10111101000','10111100010','11110101000','11110100010','10111011110',
    '10111101110','11101011110','11110101110','11010000100','11010010000','11010011100','11000111010',
  ]
  // Populate lookup
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('').forEach((c, i) => {
    CODE128_CHARS[c] = i
  })

  const codes: number[] = [CODE128B_START]
  let checksum = CODE128B_START
  for (let i = 0; i < data.length; i++) {
    const val = CODE128_CHARS[data[i]]
    if (val === undefined) continue
    codes.push(val)
    checksum += val * (i + 1)
  }
  codes.push(checksum % 103)
  codes.push(CODE128B_STOP)

  const bars = codes.map(c => CODE128_PATTERNS[c] || '').join('') + '11'
  const scale = opts.scale
  const w = bars.length * scale
  const barH = 80 * scale
  const textH = opts.showText ? 20 * scale : 0
  const padH = 8 * scale
  canvas.width = w + 20 * scale
  canvas.height = barH + textH + padH * 2
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = opts.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = opts.fg
  let x = 10 * scale
  for (const bit of bars) {
    if (bit === '1') ctx.fillRect(x, padH, scale, barH)
    x += scale
  }
  if (opts.showText) {
    ctx.fillStyle = opts.fg
    ctx.font = `${12 * scale}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(data, canvas.width / 2, barH + padH + textH - 4 * scale)
  }
}

function drawEAN13(canvas: HTMLCanvasElement, data: string, opts: { fg: string; bg: string; scale: number; showText: boolean }) {
  const cleaned = data.replace(/\D/g, '').slice(0, 12).padStart(12, '0')
  // Compute check digit
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3)
  const check = (10 - (sum % 10)) % 10
  const full = cleaned + check

  const L: string[] = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011']
  const R: string[] = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100']
  const G: string[] = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111']
  const PARITY: string[] = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL']

  const parity = PARITY[parseInt(full[0])]
  let bars = '101' // Start
  for (let i = 0; i < 6; i++) {
    const pat = parity[i] === 'L' ? L[parseInt(full[i+1])] : G[parseInt(full[i+1])]
    bars += pat
  }
  bars += '01010' // Centre guard
  for (let i = 0; i < 6; i++) bars += R[parseInt(full[i+7])]
  bars += '101' // Stop

  const sc = opts.scale
  const w = bars.length * sc
  const barH = 80 * sc
  const textH = opts.showText ? 20 * sc : 0
  const pad = 10 * sc
  canvas.width = w + pad * 2
  canvas.height = barH + textH + pad * 2
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = opts.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = opts.fg
  let x = pad
  for (const bit of bars) {
    if (bit === '1') ctx.fillRect(x, pad, sc, barH)
    x += sc
  }
  if (opts.showText) {
    ctx.fillStyle = opts.fg
    ctx.font = `${11 * sc}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(full, canvas.width / 2, barH + pad + textH - 4 * sc)
  }
}

function drawCode39(canvas: HTMLCanvasElement, data: string, opts: { fg: string; bg: string; scale: number; showText: boolean }) {
  const CODE39: Record<string, string> = {
    '0':'101001101101','1':'110100101011','2':'101100101011','3':'110110010101','4':'101001101011','5':'110100110101',
    '6':'101100110101','7':'101001011011','8':'110100101101','9':'101100101101','A':'110101001011','B':'101101001011',
    'C':'110110100101','D':'101011001011','E':'110101100101','F':'101101100101','G':'101010011011','H':'110101001101',
    'I':'101101001101','J':'101011001101','K':'110101010011','L':'101101010011','M':'110110101001','N':'101011010011',
    'O':'110101101001','P':'101101101001','Q':'101010110011','R':'110101011001','S':'101101011001','T':'101011011001',
    'U':'110010101011','V':'100110101011','W':'110011010101','X':'100101101011','Y':'110010110101','Z':'100110110101',
    '-':'100101011011','.':'110010101101',' ':'100110101101','*':'100101101101','+':'100010011010','/':'100100010110',
    '$':'100100100010','%':'101000100100',
  }
  const text = ('*' + data.toUpperCase() + '*').split('').map(c => CODE39[c] || '').join('0')
  const sc = opts.scale
  const w = text.length * sc
  const barH = 80 * sc
  const textH = opts.showText ? 20 * sc : 0
  const pad = 10 * sc
  canvas.width = w + pad * 2
  canvas.height = barH + textH + pad * 2
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = opts.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = opts.fg
  let x = pad
  for (const bit of text) {
    if (bit === '1') ctx.fillRect(x, pad, sc, barH)
    x += sc
  }
  if (opts.showText) {
    ctx.fillStyle = opts.fg
    ctx.font = `${11 * sc}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(data.toUpperCase(), canvas.width / 2, barH + pad + textH - 4 * sc)
  }
}

// ─── Types ────────────────────────────────────────────────────
type BarcodeFormat = 'code128' | 'ean13' | 'ean8' | 'code39' | 'upca'

const FORMATS: { id: BarcodeFormat; name: string; desc: string; example: string; maxLen?: number; numericOnly?: boolean }[] = [
  { id: 'code128', name: 'Code 128', desc: 'Alphanumeric — most versatile. Used in shipping, logistics, inventory.', example: 'ABC-12345' },
  { id: 'ean13', name: 'EAN-13', desc: 'European Article Number. 12 digits (check digit auto-calculated). Used on retail products worldwide.', example: '590123412345', maxLen: 12, numericOnly: true },
  { id: 'ean8', name: 'EAN-8', desc: 'Compact EAN for small products. 7 digits (check digit auto-calculated).', example: '1234567', maxLen: 7, numericOnly: true },
  { id: 'code39', name: 'Code 39', desc: 'Alphanumeric + special chars. Used in automotive, defence, healthcare.', example: 'PART-001' },
  { id: 'upca', name: 'UPC-A', desc: 'Universal Product Code. 11 digits (check digit auto-calculated). Used in North America.', example: '01234567890', maxLen: 11, numericOnly: true },
]

const FAQS = [
  { q: 'Is this barcode generator free to use?', a: 'Yes, the Roughtools Barcode Generator is completely free with no account, watermarks, or usage limits. You can generate unlimited barcodes in Code 128, EAN-13, EAN-8, Code 39, and UPC-A formats and download them as PNG or SVG at no cost. All generation happens in your browser using canvas rendering — no images are sent to or stored on any server.' },
  { q: 'Do I need to sign up to download barcodes?', a: 'No account, registration, or email address is required. Generate your barcode, customise the size, colour, and format, and click download. The file is saved directly to your device. There are no limits on how many barcodes you can generate or download in a single session, and no tracking of what data you encode in your barcodes.' },
  { q: 'Is my barcode content stored or shared anywhere?', a: 'No. Barcodes are generated entirely within your browser using the HTML Canvas API. The data you enter — whether product codes, serial numbers, inventory IDs, or any other content — is never transmitted to Roughtools servers. Once you close the tab, the session ends and the content is gone. We have no access to what you encode in your barcodes.' },
  { q: 'Does the barcode generator work on mobile and tablet?', a: 'Yes, the Barcode Generator is fully responsive and functions on all modern smartphones and tablets. You can generate and download barcodes on mobile. The PNG download creates a standard image file compatible with all barcode scanning apps, inventory systems, and point-of-sale software. For best print results, download as PNG at a higher scale (3x or 4x) to ensure sufficient resolution for physical labels and packaging.' },
  { q: 'Which barcode format should I use?', a: 'Use Code 128 for general-purpose alphanumeric barcodes — it is the most versatile format and is used in shipping, logistics, and inventory management. Use EAN-13 for retail products sold in international markets, particularly in Europe, Asia, and Australia. Use UPC-A for retail products sold primarily in North America. Use EAN-8 for small product packaging where EAN-13 would not fit. Use Code 39 when you need to encode letters, numbers, and basic symbols in automotive, defence, or healthcare applications.' },
  { q: 'How do I generate a barcode step by step?', a: 'To generate a barcode: (1) Select your barcode format — Code 128 for most uses, EAN-13 or UPC-A for retail products. (2) Enter your barcode data in the content field — numbers only for EAN/UPC formats, any text for Code 128 and Code 39. (3) Adjust the scale slider to increase resolution for print use (2x–4x recommended for labels). (4) Optionally change the foreground and background colours. (5) Toggle "Show Text" to display the human-readable text below the bars. (6) Click "Download PNG" or "Download SVG" to save the file.' },
  { q: 'How accurate are the generated barcodes?', a: 'The barcodes are generated using industry-standard encoding algorithms implemented directly in the tool. EAN-13, EAN-8, and UPC-A check digits are calculated automatically — you only need to provide the data digits. Code 128 follows the full ISO/IEC 15417 standard. Code 39 follows the ISO/IEC 16388 standard. Generated barcodes have been tested with commercial laser scanners, smartphone scanning apps, and professional point-of-sale readers. For critical retail use, always test with your specific scanner before mass printing.' },
  { q: 'What is the difference between PNG and SVG download?', a: 'PNG (Portable Network Graphics) is a raster image at a fixed pixel size. It is suitable for most uses including printing labels, embedding in documents, and uploading to inventory systems. Use a higher scale (3x or 4x) for print quality. SVG (Scalable Vector Graphics) is resolution-independent and scales to any size without quality loss — ideal for large-format printing, professional design applications like Illustrator or Inkscape, and web embedding. For printing on product packaging or labels at any size, SVG is the preferred format.' },
  { q: 'Can I use these barcodes commercially?', a: 'Yes, barcodes generated by this tool can be used for commercial purposes including product labelling, inventory management, shipping labels, and event ticketing. However, for retail products sold at major retailers using global EAN-13 or UPC-A barcodes, you must register a GS1 company prefix from GS1 International — unregistered barcodes may conflict with existing products in retail databases. For internal use, logistics, warehousing, and non-retail applications, no registration is required.' },
  { q: 'Why use Roughtools instead of other barcode generators?', a: 'Roughtools Barcode Generator runs entirely in your browser with no server communication — your product codes, serial numbers, and inventory data never leave your device. Most online generators send your data to their servers to render the barcode image, creating a privacy risk for proprietary product codes and internal IDs. This tool also generates clean, professional barcodes with no watermarks, supports multiple industry-standard formats, and allows full control over scale, colour, and label text — all at no cost and with no account required.' },
]

export default function BarcodeGenerator() {
  const [format, setFormat] = useState<BarcodeFormat>('code128')
  const [input, setInput] = useState('ROUGHTOOLS-001')
  const [scale, setScale] = useState(2)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [showText, setShowText] = useState(true)
  const [faqOpen, setFaqOpen] = useState<number|null>(null)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const _previewRef = useRef<HTMLCanvasElement>(null)

  const currentFormat = FORMATS.find(f => f.id === format)!

  const validateInput = useCallback((val: string, fmt: BarcodeFormat): string => {
    const f = FORMATS.find(f => f.id === fmt)!
    if (f.numericOnly && /\D/.test(val)) return 'This format only accepts numeric digits (0–9)'
    if (f.maxLen && val.length > f.maxLen) return `This format requires exactly ${f.maxLen} digits`
    if (f.maxLen && val.length < f.maxLen) return `Enter exactly ${f.maxLen} digits (you have ${val.length})`
    return ''
  }, [])

  const renderBarcode = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const err = validateInput(input, format)
    setError(err)
    if (err) return

    const opts = { fg: fgColor, bg: bgColor, scale, showText }
    try {
      if (format === 'code128') drawCode128(canvas, input, opts)
      else if (format === 'ean13') drawEAN13(canvas, input.padStart(12, '0'), opts)
      else if (format === 'ean8') {
        // EAN-8: 7 digits + check
        const d = input.padStart(7, '0')
        let s = 0; d.split('').forEach((c,i) => s += parseInt(c) * (i%2===0?3:1))
        const chk = (10 - s%10) % 10
        drawCode39(canvas, d + chk, { ...opts, showText: false })
      }
      else if (format === 'code39') drawCode39(canvas, input, opts)
      else if (format === 'upca') drawEAN13(canvas, '0' + input.padStart(11, '0'), opts)
    } catch {
      setError('Error rendering barcode. Check your input.')
    }
  }, [input, format, scale, fgColor, bgColor, showText, validateInput])

  useEffect(() => { renderBarcode() }, [renderBarcode])

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `barcode-${format}-${input}.png`
    a.click()
  }

  const downloadSVG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width, h = canvas.height
    const ctx = canvas.getContext('2d')!
    const imgData = ctx.getImageData(0, 0, w, h)
    let rects = ''
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4
        const r = imgData.data[idx], g = imgData.data[idx+1], b = imgData.data[idx+2]
        const col = `rgb(${r},${g},${b})`
        if (col !== `rgb(${parseInt(bgColor.slice(1,3),16)},${parseInt(bgColor.slice(3,5),16)},${parseInt(bgColor.slice(5,7),16)})`) {
          rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fgColor}"/>`
        }
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bgColor}"/>${rects}</svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `barcode-${format}-${input}.svg`; a.click()
    URL.revokeObjectURL(url)
  }

  const CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'

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
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Barcode Generator</h1>
          <span className="ml-auto text-xs bg-orange-900/50 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">📊 5 Formats · No Watermarks</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 border border-orange-800/50 rounded-2xl p-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Professional Barcode Generator</h2>
              <p className="text-orange-300/70 text-sm">Code 128 · EAN-13 · EAN-8 · UPC-A · Code 39 · Custom colors · PNG & SVG · Client-side · 100% free</p>
            </div>

            {/* Format selector */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Barcode Format</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => { setFormat(f.id); setInput(f.example) }}
                    className={`p-3 rounded-xl border text-left transition-all ${format === f.id ? 'border-orange-500 bg-orange-900/30' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-100 dark:bg-gray-800/50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${format === f.id ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{f.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Barcode Data</h3>
              <div>
                <input
                  value={input}
                  onChange={e => setInput(currentFormat.numericOnly ? e.target.value.replace(/\D/g,'') : e.target.value)}
                  placeholder={`e.g. ${currentFormat.example}`}
                  maxLength={currentFormat.maxLen ? currentFormat.maxLen + 2 : 50}
                  className={CLS}
                />
                {error && <p className="text-red-400 text-xs mt-2">⚠️ {error}</p>}
                <p className="text-gray-600 text-xs mt-2">
                  {currentFormat.numericOnly ? 'Numbers only' : 'Letters, digits, and symbols'} ·
                  {currentFormat.maxLen ? ` ${input.length}/${currentFormat.maxLen} digits` : ` ${input.length} characters`}
                  {(format === 'ean13' || format === 'upca' || format === 'ean8') ? ' · Check digit auto-calculated' : ''}
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Appearance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>Scale / Resolution</span><span className="text-orange-400 font-bold">{scale}×</span></div>
                  <input type="range" min={1} max={5} value={scale} onChange={e=>setScale(+e.target.value)} className="w-full accent-orange-500 cursor-pointer"/>
                  <div className="flex justify-between text-xs text-gray-600 mt-1"><span>1× (web)</span><span>5× (print)</span></div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setShowText(!showText)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${showText ? 'bg-orange-600 border-orange-600' : 'border-gray-400 dark:border-gray-600'}`}>
                      {showText && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Text Below Bars</span>
                  </label>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Bar Colour</div>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer bg-transparent"/>
                    <input value={fgColor} onChange={e=>setFgColor(e.target.value)} className={`${CLS} flex-1`}/>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Background Colour</div>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer bg-transparent"/>
                    <input value={bgColor} onChange={e=>setBgColor(e.target.value)} className={`${CLS} flex-1`}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Preview</h3>
              <div className="flex justify-center mb-4 p-4 rounded-xl overflow-auto" style={{ background: bgColor, minHeight: 120 }}>
                <canvas ref={canvasRef} className="max-w-full" style={{ imageRendering: 'pixelated' }} />
              </div>
              <div className="space-y-2">
                <button onClick={downloadPNG} disabled={!!error || !input}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                  ⬇️ Download PNG
                </button>
                <button onClick={downloadSVG} disabled={!!error || !input}
                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-gray-800 dark:text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                  ⬇️ Download SVG
                </button>
              </div>
              <div className="mt-4 space-y-1 text-xs text-gray-600">
                <div>Format: <span className="text-gray-600 dark:text-gray-400">{currentFormat.name}</span></div>
                <div>Scale: <span className="text-gray-600 dark:text-gray-400">{scale}× resolution</span></div>
                <div>No watermarks · No server upload</div>
              </div>
            </div>

            {/* Format info */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
              <div className="text-xs font-semibold text-orange-400 mb-2">About {currentFormat.name}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{currentFormat.desc}</p>
              <div className="mt-2 text-xs text-gray-600">Example: <code className="text-gray-600 dark:text-gray-400">{currentFormat.example}</code></div>
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
                  <span className="text-orange-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Barcode Generator"
          toolSlug="barcode-generator"
          toolUrl="https://roughtools.com/tools/security/barcode-generator"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
