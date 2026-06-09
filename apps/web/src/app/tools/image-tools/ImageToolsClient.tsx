'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ── Subcategories ───────────────────────────────────────────── */
const SUBCATEGORIES = [
  {
    id: 'optimize',
    label: 'Compress & Optimise',
    icon: '🗜️',
    color: 'rose',
    description: 'Reduce file size without losing quality',
    tools: [
      { slug: 'image-compressor',         name: 'Image Compressor',         icon: '🗜️', description: 'Compress JPG, PNG, WEBP by up to 90% without visible quality loss.', badge: 'Popular' },
      { slug: 'bulk-image-resizer',        name: 'Bulk Image Resizer',        icon: '📦', description: 'Resize multiple images at once to the same dimensions or percentage.' },
      { slug: 'dpi-converter',             name: 'DPI Converter',             icon: '🖨️', description: 'Change image DPI for print. Convert between 72, 150, and 300 DPI.' },
      { slug: 'image-size-checker',        name: 'Image Size Checker',        icon: '📐', description: 'Check image dimensions, file size, DPI, and format online.' },
    ],
  },
  {
    id: 'resize',
    label: 'Resize & Crop',
    icon: '✂️',
    color: 'pink',
    description: 'Resize, crop, rotate, flip, adjust dimensions',
    tools: [
      { slug: 'image-resizer',             name: 'Image Resizer',             icon: '📐', description: 'Resize images by pixels, percentage, or preset dimensions.', badge: 'Popular' },
      { slug: 'image-cropper',             name: 'Image Cropper',             icon: '✂️', description: 'Crop with free crop, aspect ratio lock, and social media presets.' },
      { slug: 'image-flipper-rotator',     name: 'Image Flipper & Rotator',   icon: '↔️', description: 'Flip and rotate images. Mirror horizontally/vertically, any angle.' },
      { slug: 'round-corner-image',        name: 'Round Corner Image',        icon: '⭕', description: 'Add rounded corners, circular crop, and custom radius to images.' },
      { slug: 'add-border',                name: 'Add Border',                icon: '🖼️', description: 'Add decorative borders and frames. Custom colour, width, style.' },
      { slug: 'pixel-density-calculator',  name: 'Pixel Density Calculator',  icon: '📏', description: 'Calculate PPI (pixels per inch) for screens and print.' },
    ],
  },
  {
    id: 'convert',
    label: 'Format Conversion',
    icon: '🔄',
    color: 'purple',
    description: 'Convert between JPG, PNG, WEBP, HEIC, Base64',
    tools: [
      { slug: 'image-converter',           name: 'Image Converter',           icon: '🔄', description: 'Convert between JPG, PNG, WEBP, GIF, BMP, SVG.', badge: 'Popular' },
      { slug: 'heic-to-jpg',               name: 'HEIC to JPG',               icon: '📱', description: 'Convert iPhone HEIC photos to JPG instantly.' },
      { slug: 'png-to-jpg',                name: 'PNG to JPG',                icon: '🖼️', description: 'Convert PNG to JPG with quality control and compression.' },
      { slug: 'jpg-to-png',                name: 'JPG to PNG',                icon: '🖼️', description: 'Convert JPG to PNG with transparent background support.' },
      { slug: 'image-to-base64',           name: 'Image to Base64',           icon: '💾', description: 'Convert images to Base64 for HTML, CSS, and JavaScript.' },
      { slug: 'base64-to-image',           name: 'Base64 to Image',           icon: '🔓', description: 'Decode Base64 strings back to images. Preview and download.' },
    ],
  },
  {
    id: 'background',
    label: 'Background Tools',
    icon: '🎭',
    color: 'fuchsia',
    description: 'Remove, replace, blur, or set backgrounds',
    tools: [
      { slug: 'background-remover',        name: 'Background Remover',        icon: '✂️', description: 'Remove image backgrounds instantly. Perfect for product photos.', badge: '#1 Tool' },
      { slug: 'background-changer',        name: 'Background Changer',        icon: '🎨', description: 'Replace background with a new colour or custom image.' },
      { slug: 'white-background-maker',    name: 'White Background Maker',    icon: '⬜', description: 'Add white background to product photos for e-commerce.' },
      { slug: 'blur-background',           name: 'Blur Background',           icon: '🌫️', description: 'Blur image background to create a DSLR-like portrait effect.' },
    ],
  },
  {
    id: 'enhance',
    label: 'Enhance & Transform',
    icon: '✨',
    color: 'violet',
    description: 'Upscale, enhance, colorize, artistic effects',
    tools: [
      { slug: 'image-upscaler',            name: 'Image Upscaler',            icon: '🔭', description: 'AI-powered upscaling — increase resolution without losing sharpness.', badge: 'AI' },
      { slug: 'image-enhancer',            name: 'Image Enhancer',            icon: '✨', description: 'Sharpen, brighten, adjust contrast and denoise photos.' },
      { slug: 'image-colorizer',           name: 'Image Colorizer',           icon: '🎨', description: 'Colorize black & white photos. Apply colour tones and effects.' },
      { slug: 'grayscale-converter',       name: 'Grayscale Converter',       icon: '⚫', description: 'Convert colour photos to black and white online.' },
      { slug: 'photo-to-cartoon',          name: 'Photo to Cartoon',          icon: '🎭', description: 'Convert photos to cartoon and sketch style.' },
    ],
  },
  {
    id: 'creative',
    label: 'Creative & Social',
    icon: '🎨',
    color: 'orange',
    description: 'Memes, watermarks, thumbnails, collages, IDs',
    tools: [
      { slug: 'meme-generator',            name: 'Meme Generator',            icon: '😂', description: 'Create memes with custom top and bottom text on any image.', badge: 'Popular' },
      { slug: 'thumbnail-maker',           name: 'Thumbnail Maker',           icon: '▶️', description: 'Create YouTube and social media thumbnails. Custom sizes.', badge: 'Popular' },
      { slug: 'add-watermark',             name: 'Add Watermark',             icon: '🏷️', description: 'Add text or logo watermarks to photos.' },
      { slug: 'remove-watermark',          name: 'Remove Watermark',          icon: '🧹', description: 'Remove watermarks and text overlays from images.' },
      { slug: 'photo-collage-maker',       name: 'Photo Collage Maker',       icon: '🖼️', description: 'Combine multiple photos into a grid or collage layout.' },
      { slug: 'gif-maker',                 name: 'GIF Maker',                 icon: '🎬', description: 'Create animated GIFs from image sequences online.' },
      { slug: 'screenshot-to-pdf',         name: 'Screenshot to PDF',         icon: '📄', description: 'Convert screenshots and images to PDF. Arrange pages.' },
      { slug: 'passport-photo-maker',      name: 'Passport Photo Maker',      icon: '🪪', description: 'Create passport photos: US 2×2, UK 35×45mm and more.', badge: 'Popular' },
      { slug: 'id-card-photo-maker',       name: 'ID Card Photo Maker',       icon: '🆔', description: 'Create standard ID card photos for any document.' },
    ],
  },
  {
    id: 'colors',
    label: 'Color & Metadata',
    icon: '🌈',
    color: 'indigo',
    description: 'Extract colours, view metadata, OCR text',
    tools: [
      { slug: 'image-color-picker',        name: 'Image Color Picker',        icon: '💧', description: 'Pick any colour from any image. Get HEX, RGB, and HSL codes.' },
      { slug: 'dominant-color-extractor',  name: 'Dominant Color Extractor',  icon: '🌈', description: 'Extract the dominant colour palette from any photo.' },
      { slug: 'image-to-text',             name: 'Image to Text (OCR)',        icon: '📝', description: 'Extract text from images using OCR.', badge: 'Popular' },
      { slug: 'image-metadata-viewer',     name: 'Image Metadata Viewer',     icon: '🔍', description: 'View EXIF data: camera settings, GPS, and file info.' },
    ],
  },
]

/* ── Color palette ───────────────────────────────────────────── */
const PALETTE: Record<string, {
  card: string; cardActive: string; border: string; borderActive: string;
  icon: string; badge: string; text: string; arrow: string;
  toolBg: string; toolBorder: string; toolIconBg: string;
}> = {
  rose:    { card:'bg-rose-50',    cardActive:'bg-rose-600',    border:'border-rose-200',    borderActive:'border-rose-600',    icon:'bg-rose-100 text-rose-600',    badge:'bg-rose-600',    text:'text-rose-600',    arrow:'group-hover:text-rose-600',    toolBg:'bg-rose-50',    toolBorder:'border-rose-200',    toolIconBg:'bg-rose-100'    },
  pink:    { card:'bg-pink-50',    cardActive:'bg-pink-600',    border:'border-pink-200',    borderActive:'border-pink-600',    icon:'bg-pink-100 text-pink-600',    badge:'bg-pink-600',    text:'text-pink-600',    arrow:'group-hover:text-pink-600',    toolBg:'bg-pink-50',    toolBorder:'border-pink-200',    toolIconBg:'bg-pink-100'    },
  purple:  { card:'bg-purple-50',  cardActive:'bg-purple-600',  border:'border-purple-200',  borderActive:'border-purple-600',  icon:'bg-purple-100 text-purple-600',  badge:'bg-purple-600',  text:'text-purple-600',  arrow:'group-hover:text-purple-600',  toolBg:'bg-purple-50',  toolBorder:'border-purple-200',  toolIconBg:'bg-purple-100'  },
  fuchsia: { card:'bg-fuchsia-50', cardActive:'bg-fuchsia-600', border:'border-fuchsia-200', borderActive:'border-fuchsia-600', icon:'bg-fuchsia-100 text-fuchsia-600', badge:'bg-fuchsia-600', text:'text-fuchsia-600', arrow:'group-hover:text-fuchsia-600', toolBg:'bg-fuchsia-50', toolBorder:'border-fuchsia-200', toolIconBg:'bg-fuchsia-100' },
  violet:  { card:'bg-violet-50',  cardActive:'bg-violet-600',  border:'border-violet-200',  borderActive:'border-violet-600',  icon:'bg-violet-100 text-violet-600',  badge:'bg-violet-600',  text:'text-violet-600',  arrow:'group-hover:text-violet-600',  toolBg:'bg-violet-50',  toolBorder:'border-violet-200',  toolIconBg:'bg-violet-100'  },
  orange:  { card:'bg-orange-50',  cardActive:'bg-orange-500',  border:'border-orange-200',  borderActive:'border-orange-500',  icon:'bg-orange-100 text-orange-600',  badge:'bg-orange-500',  text:'text-orange-600',  arrow:'group-hover:text-orange-600',  toolBg:'bg-orange-50',  toolBorder:'border-orange-200',  toolIconBg:'bg-orange-100'  },
  indigo:  { card:'bg-indigo-50',  cardActive:'bg-indigo-600',  border:'border-indigo-200',  borderActive:'border-indigo-600',  icon:'bg-indigo-100 text-indigo-600',  badge:'bg-indigo-600',  text:'text-indigo-600',  arrow:'group-hover:text-indigo-600',  toolBg:'bg-indigo-50',  toolBorder:'border-indigo-200',  toolIconBg:'bg-indigo-100'  },
}

const TOTAL = SUBCATEGORIES.reduce((n, s) => n + s.tools.length, 0)

const TRUST = [
  { icon: '⚡', text: 'Instant Processing' },
  { icon: '🚫', text: 'No Watermarks' },
  { icon: '🔒', text: 'Browser-Side Only' },
  { icon: '🆓', text: 'Always Free' },
  { icon: '📱', text: 'Mobile Friendly' },
]

const POPULAR = ['image-compressor', 'background-remover', 'image-resizer', 'image-converter', 'passport-photo-maker', 'meme-generator', 'thumbnail-maker', 'image-upscaler']

export default function ImageToolsClient() {
  const [active, setActive] = useState<string | null>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const selectCategory = useCallback((id: string | null) => {
    setActive(id)
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 30)
  }, [])

  const visibleSections = active
    ? SUBCATEGORIES.filter(s => s.id === active)
    : SUBCATEGORIES

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-rose-500 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <span>🖼️</span>
            <span>{TOTAL} Free Image Tools — No Signup, No Watermark</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Every Image Tool You Need.<br className="hidden sm:block" /> 100% Free.
          </h1>
          <p className="text-lg text-rose-100 max-w-2xl mx-auto mb-8">
            Compress, resize, convert, remove backgrounds, crop, enhance, add watermarks, create memes and passport photos — all browser-side. Files never leave your device.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map(slug => {
              const tool = SUBCATEGORIES.flatMap(s => s.tools).find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link
                  key={slug}
                  href={`/tools/image-tools/${slug}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  {tool.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Category Filter Cards ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-7">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Browse by Category</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Choose what you need to do</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* All Tools card */}
          <button
            onClick={() => selectCategory(null)}
            className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
              active === null
                ? 'bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${active === null ? 'bg-white/15' : 'bg-gray-100'}`}>
              🖼️
            </div>
            <div>
              <div className="font-bold text-[14px] leading-tight">All Image Tools</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${active === null ? 'text-white/70' : 'text-gray-400'}`}>
                {TOTAL} tools
              </div>
            </div>
          </button>

          {/* Subcategory cards */}
          {SUBCATEGORIES.map(sc => {
            const pal = PALETTE[sc.color] ?? PALETTE.rose
            const isActive = active === sc.id
            return (
              <button
                key={sc.id}
                onClick={() => selectCategory(isActive ? null : sc.id)}
                className={`relative group flex flex-col items-center text-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${
                  isActive
                    ? `${pal.cardActive} ${pal.borderActive} text-white shadow-lg -translate-y-0.5`
                    : `bg-white ${pal.border} text-gray-700 hover:${pal.card} hover:${pal.borderActive}`
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isActive ? 'bg-white/20' : pal.icon}`}>
                  {sc.icon}
                </div>
                <div>
                  <div className="font-bold text-[14px] leading-tight">{sc.label}</div>
                  <div className={`text-[11px] mt-0.5 font-semibold ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    {sc.tools.length} tools
                  </div>
                </div>
                <p className={`text-[11px] leading-snug ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {sc.description}
                </p>
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Active filter label */}
        {active && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">
                {SUBCATEGORIES.find(s => s.id === active)?.label}
              </span> tools
            </p>
            <button
              onClick={() => selectCategory(null)}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
          {TRUST.map(b => (
            <span key={b.text} className="flex items-center gap-1.5 font-medium">
              <span>{b.icon}</span>{b.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tool Sections ─────────────────────────────────────── */}
      <main ref={toolsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14 scroll-mt-20" id="main-content">

        {visibleSections.map(sc => {
          const pal = PALETTE[sc.color] ?? PALETTE.rose
          return (
            <section key={sc.id} id={sc.id} aria-labelledby={`heading-${sc.id}`} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl flex-shrink-0 ${pal.icon}`}>
                  {sc.icon}
                </div>
                <div>
                  <h2 id={`heading-${sc.id}`} className="text-xl font-bold text-gray-900">{sc.label}</h2>
                  <p className="text-sm text-gray-500">{sc.description}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full text-white ${pal.badge}`}>
                  {sc.tools.length} {sc.tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sc.tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/image-tools/${tool.slug}`}
                    className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${pal.toolBg} ${pal.toolBorder} hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0 ${pal.toolIconBg}`}>
                      {tool.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-gray-900 group-hover:${pal.text} transition-colors leading-snug`}>
                          {tool.name}
                        </h3>
                        {tool.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${pal.badge} flex-shrink-0`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 text-gray-300 ${pal.arrow} transition-colors mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* ── SEO Section ──────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Best Free Image Tools Online</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="mb-3">
                Roughtools offers {TOTAL} professional-grade image tools completely free. Whether you need to compress photos for the web, remove backgrounds for product listings, convert HEIC from iPhone, or create passport photos — all processing runs in your browser.
              </p>
              <p>No daily limits, no forced signups, and absolutely no watermarks. Your images never leave your device.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why Roughtools Image Tools?</h3>
              <ul className="space-y-2">
                {[
                  'No account required — start immediately',
                  `All ${TOTAL} tools completely free with no hidden limits`,
                  '100% browser-based — images never uploaded to any server',
                  'Works on any device: desktop, tablet, mobile',
                  'No watermarks added to any output file',
                ].map(point => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Explore other free tools:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/tools/pdf', label: '📄 PDF Tools' },
                { href: '/tools/developer', label: '💻 Developer Tools' },
                { href: '/tools/text', label: '✏️ Text Tools' },
                { href: '/tools/calculators', label: '🧮 Calculators' },
                { href: '/tools/document-tools', label: '📋 Document Tools' },
                { href: '/tools/security', label: '🔒 Security Tools' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-gray-700 hover:border-rose-300 hover:text-rose-700 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      
        {/* -- FAQ Section ------------------------------------------- */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              { q: 'Are all image tools completely free?', a: 'Yes. All 38 image tools on RoughTools are completely free with no usage limits, no watermarks added to your output, and no payment required. No account or credit card is ever needed.' },
              { q: 'Do I need to create an account to use the tools?', a: 'No. Every image tool is accessible directly without registration. Go to the tool, upload your image, and download your result — no signup at any step.' },
              { q: 'Are my images safe and private?', a: 'Most tools run entirely in your browser — your images never leave your device. Server-side tools (like AI background removal) transmit images over HTTPS and delete them immediately after processing. No images are stored, analyzed, or shared.' },
              { q: 'What image formats are supported?', a: 'Most tools support JPG, PNG, and WebP as input. Many also accept BMP, GIF, TIFF, HEIC, and SVG. Each tool page specifies the supported input and output formats in its Quick Reference table.' },
              { q: 'Can I use these tools on my phone?', a: 'Yes. All 38 tools are fully functional in mobile browsers on iOS (Safari) and Android (Chrome). Upload photos directly from your camera roll and download results to your device.' },
              { q: 'Is there a limit on image size or resolution?', a: 'Most tools support images up to 20 MB per file. AI-powered tools (background removal, upscaling) typically support up to 10 MB for optimal processing speed. There are no pixel dimension limits below those file sizes.' },
              { q: 'Can I process multiple images at once?', a: 'The Bulk Image Resizer and Image Compressor support batch processing of multiple images simultaneously. Most other tools process one image at a time for the best quality control.' },
              { q: 'Do the tools add watermarks to my images?', a: 'Never. RoughTools does not add watermarks, logos, or any branding to processed images. Your output is clean and ready to use — just as you uploaded it, with your requested modifications applied.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 list-none text-sm">
                  {faq.q}
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-200 pt-3">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>
</main>
    </div>
  )
}
