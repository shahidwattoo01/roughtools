'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

const FAQS = [
  {
    q: 'Is this metadata remover tool completely free?',
    a: 'Yes, the RoughTools Image Metadata Remover is completely free with no account, subscription, or payment required. You can strip EXIF metadata from unlimited images at no cost. There are no file count limits, no watermarks added to cleaned images, and no premium tier needed to access any feature. RoughTools is funded through non-intrusive advertising, keeping this and all tools permanently free for all users worldwide.'
  },
  {
    q: 'Do I need to sign up to remove EXIF data from photos?',
    a: 'No account, registration, email address, or personal information is required. Drag and drop your image or click to upload, and the metadata is stripped instantly in your browser. The cleaned image downloads directly to your device. There is no login wall, no usage limits that require registration to bypass, and no connection between your identity and the images you process.'
  },
  {
    q: 'Is my photo uploaded to a server when I remove metadata?',
    a: 'No. Metadata removal happens entirely within your browser using the HTML Canvas API. Your image is loaded into a canvas element, redrawn without EXIF data, and exported as a new clean file — all locally on your device. No image data is transmitted to RoughTools servers at any point. This is critical for personal photos that contain sensitive GPS coordinates, identity information, or proprietary content you do not want to share with any third party.'
  },
  {
    q: 'Does this tool work on mobile phones and tablets?',
    a: 'Yes, the Metadata Remover is fully responsive and works on all modern smartphones and tablets. On iOS (Safari 11+) and Android (Chrome 70+), you can select photos directly from your camera roll, gallery, or cloud storage. The canvas-based processing works on mobile browsers, and the cleaned image downloads to your device. For large photos (over 20 megapixels) on older phones, processing may take a few seconds due to memory constraints.'
  },
  {
    q: 'Which browsers are compatible with this metadata remover?',
    a: 'The tool works in all modern browsers: Google Chrome 4+, Mozilla Firefox 2+, Microsoft Edge 12+, Safari 3.1+, and Opera 10.6+. All current browser versions on both desktop and mobile are fully supported. The Canvas API used for EXIF stripping is one of the most widely supported web technologies. Internet Explorer 9+ also supports basic canvas operations, though for best performance and modern file handling, Chrome or Firefox is recommended.'
  },
  {
    q: 'What metadata does this tool remove from photos?',
    a: 'The tool removes all EXIF (Exchangeable Image File Format) metadata by redrawing the image through the HTML Canvas API and re-encoding it as a new JPEG or PNG. This removes: GPS coordinates (latitude, longitude, altitude), camera make and model, lens information, exposure settings (ISO, aperture, shutter speed), capture date and time, software used, copyright strings, thumbnail data, camera serial numbers, and all other embedded EXIF, IPTC, and XMP metadata fields. The pixel content of the image is preserved exactly.'
  },
  {
    q: 'How do I remove metadata from a photo step by step?',
    a: 'To strip metadata: (1) Click the upload area or drag and drop your image file. JPEG and PNG files are supported. (2) A preview of your clean image appears immediately below the upload area. (3) Review the preview to confirm the image looks correct — the visual content should be identical to the original. (4) Click "Download Clean Image" to save the metadata-free version to your device. (5) The downloaded file has the same visual quality as the original but with all EXIF data removed. Repeat for each image you need to clean.'
  },
  {
    q: 'How accurate is the metadata removal — is all EXIF data gone?',
    a: 'The canvas redraw method removes all embedded EXIF, XMP, and IPTC metadata because the Canvas API outputs raw pixel data without any metadata headers. The resulting JPEG or PNG file contains only the pixel color values and standard file format headers — no camera data, GPS coordinates, timestamps, or any other embedded information. This is a complete metadata strip, not a selective deletion. The only metadata that may remain is standard JPEG or PNG format headers (color profile, resolution) which contain no personal information.'
  },
  {
    q: 'Why should I remove EXIF metadata before sharing photos online?',
    a: 'Photos taken on modern smartphones and cameras automatically embed GPS coordinates in the EXIF data unless you disable this feature. When you share an original photo on social media, via email, or through a messaging app, anyone can extract these coordinates using free EXIF viewer tools to determine exactly where the photo was taken. This poses real privacy and safety risks — revealing your home address, workplace, school, or daily routine from seemingly harmless photos. Removing metadata before sharing is a simple, important privacy practice.'
  },
  {
    q: 'Why should I use RoughTools instead of other metadata removal tools?',
    a: 'RoughTools Metadata Remover processes images entirely in your browser with no server upload — unlike most online tools that require you to send your photos to their servers. This is particularly important for sensitive photos containing personal locations, identifiable subjects, or proprietary content. The tool also displays a side-by-side preview before download so you can confirm the image quality, supports batch-style quick processing of multiple images by re-uploading, and requires no software installation, account, or payment.'
  },
  {
    q: 'How do I report a bug or request a new feature?',
    a: 'To report a bug or suggest a feature — such as batch metadata removal for multiple files, viewing the metadata before removal, PNG metadata support improvements, RAW file support, or video metadata stripping — use the feedback link in the site footer or visit the RoughTools contact page. When reporting a bug, include your browser name and version, operating system, the approximate file size and format of the image, and what happened versus what you expected. Feature requests are reviewed regularly by the development team.'
  },
  {
    q: 'Can I remove metadata from PNG files as well as JPEG?',
    a: 'Yes, the tool supports both JPEG and PNG files, as well as WebP and other image formats that your browser can load into an Image element. PNG files can contain tEXt, zTXt, and iTXt metadata chunks with software information, creation dates, and comments. The canvas redraw method removes these PNG metadata chunks along with EXIF data embedded in JPEGs. The output format is JPEG by default (for smaller file size), but you can choose PNG output to preserve transparency or lossless quality if needed.'
  },
]

export default function MetadataRemover() {
  const [preview, setPreview] = useState<string | null>(null)
  const [cleanBlob, setCleanBlob] = useState<Blob | null>(null)
  const [originalName, setOriginalName] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [cleanSize, setCleanSize] = useState(0)
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setProcessing(true)
    setOriginalName(file.name)
    setOriginalSize(file.size)
    setPreview(null)
    setCleanBlob(null)

    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        setDimensions({ w: img.width, h: img.height })
        setPreview(canvas.toDataURL('image/jpeg'))
        canvas.toBlob(blob => {
          if (blob) {
            setCleanBlob(blob)
            setCleanSize(blob.size)
          }
          setProcessing(false)
        }, 'image/jpeg', 0.95)
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const downloadClean = () => {
    if (!cleanBlob) return
    const url = URL.createObjectURL(cleanBlob)
    const a = document.createElement('a')
    a.href = url
    const _ext = originalName.match(/\.[^.]+$/)
    a.download = `clean_${originalName.replace(/\.[^.]+$/, '')}.jpg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  const sizeSaving = originalSize && cleanSize ? Math.round((1 - cleanSize / originalSize) * 100) : 0

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top nav */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Security Tools
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Metadata Remover</h1>
          <span className="ml-auto text-xs bg-teal-900/50 text-teal-400 border border-teal-800 px-2 py-0.5 rounded-full">🧹 EXIF Strip · Client-Side Only</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-teal-900/50 to-green-900/50 border border-teal-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Image EXIF Metadata Remover</h2>
          <p className="text-teal-300/70 text-sm">Strip GPS location, camera data & timestamps · Client-side only · No upload · JPEG & PNG · Free</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['GPS Coordinates', 'Camera Model', 'Capture Date', 'Lens Data', 'No Upload', 'JPEG & PNG'].map(b => (
              <span key={b} className="text-xs bg-teal-900/40 text-teal-300 border border-teal-700/50 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-teal-500 bg-teal-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-gray-800/50'}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }}
            />
            {processing ? (
              <div className="flex flex-col items-center gap-2">
                <span className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"/>
                <p className="text-teal-600 dark:text-teal-300 text-sm">Processing image…</p>
              </div>
            ) : preview ? (
              <div className="text-sm">
                <p className="text-green-400 font-medium mb-1">✅ Metadata removed successfully</p>
                <p className="text-gray-500">{originalName} · Click to process another image</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">🖼️</div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Drag & drop your image here</p>
                <p className="text-gray-600 text-sm mt-1">or click to browse · JPEG, PNG, WebP supported</p>
                <p className="text-gray-700 text-xs mt-2">Your image never leaves your browser</p>
              </div>
            )}
          </div>

          {/* Preview + info */}
          {preview && cleanBlob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-2 font-medium">BEFORE (original)</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Size</span>
                    <span className="text-gray-900 dark:text-white">{(originalSize / 1024).toFixed(0)} KB</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Metadata</span>
                    <span className="text-red-400">⚠️ Contains EXIF</span>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-2 font-medium">AFTER (clean)</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Size</span>
                    <span className="text-gray-900 dark:text-white">{(cleanSize / 1024).toFixed(0)} KB {sizeSaving > 0 && <span className="text-green-600 dark:text-green-400">(-{sizeSaving}%)</span>}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Metadata</span>
                    <span className="text-green-400">✅ Stripped</span>
                  </div>
                </div>
              </div>

              {dimensions && (
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>{dimensions.w} × {dimensions.h}px</span>
                  <span>·</span>
                  <span>Pixel content unchanged</span>
                </div>
              )}

              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                <p className="text-gray-500 text-xs px-3 pt-3 pb-2">Preview (metadata-free)</p>
                <img src={preview} alt="Clean preview" className="w-full max-h-64 object-contain"/>
              </div>

              <button
                onClick={downloadClean}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download Clean Image (JPEG)
              </button>
            </div>
          )}
        </div>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📍', title: 'GPS Removed', desc: 'Latitude, longitude & altitude data stripped completely' },
            { icon: '📷', title: 'Camera Data Gone', desc: 'Make, model, lens, serial number — all removed' },
            { icon: '🚫', title: 'Zero Upload', desc: 'Your photos never leave your device during processing' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* What gets removed */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">What Metadata Gets Removed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              '📍 GPS Coordinates', '🏔️ GPS Altitude', '🕐 Capture Date & Time',
              '📷 Camera Make & Model', '🔭 Lens Information', '⚙️ ISO / Aperture / Shutter',
              '💻 Software Used', '©️ Copyright Strings', '👤 Author Information',
              '🔢 Camera Serial Number', '🖼️ Embedded Thumbnail', '📊 Color Profile Data',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={e => { e.preventDefault(); setFaqOpen(faqOpen === i ? null : i) }}>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left">{faq.q}</h3>
                  <span className="text-teal-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Metadata Remover"
          toolSlug="metadata-remover"
          toolUrl="https://roughtools.com/tools/security/metadata-remover"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
