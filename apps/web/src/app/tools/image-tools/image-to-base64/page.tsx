import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ImageToBase64Client from './ImageToBase64Client'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image to Base64 Converter — Encode Image as Base64 String Free | Roughtools',
  description: 'Convert any image to a Base64 encoded string online for free. Get the data URI or raw Base64 output instantly. Useful for embedding images in HTML, CSS, and JSON. Browser-based.',
  keywords: ['image to base64', 'image base64 encoder', 'convert image to base64', 'base64 encode image', 'data uri generator', 'embed image css html'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-to-base64' },
  openGraph: {
    title: 'Image to Base64 Converter — Free Online | Roughtools',
    description: 'Convert images to Base64 data URIs for embedding in HTML and CSS. Free.',
    url: 'https://roughtools.com/tools/image-tools/image-to-base64',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image to Base64 | Roughtools', description: 'Encode images as Base64 strings for HTML/CSS embedding. Free.' },
}


const _s = getImageToolSupplement('image-to-base64')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image to Base64 Converter"
      toolSlug="image-to-base64"
      icon="??"
      description="Convert any image file to a Base64 encoded string or data URI. Base64 encoding allows you to embed images directly into HTML, CSS, JSON, XML, or any text-based file without referencing an external file. Useful for developers creating self-contained HTML pages, email templates, CSS sprite sheets, and API payloads that include image data. Runs entirely in your browser."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, GIF, WebP, or SVG image. The image is immediately encoded without any server upload.' },
        { name: 'Choose output format', text: 'Select Data URI (includes the MIME type prefix like data:image/png;base64,...) for embedding in HTML/CSS, or Raw Base64 (the string only) for use in JSON APIs or other contexts.' },
        { name: 'Copy the encoded string', text: 'Click the Copy button to copy the entire Base64 string to your clipboard. The string can be very long for large images — this is normal.' },
        { name: 'Use in your project', text: 'Paste the data URI into an HTML img src attribute, a CSS background-image property, or any field that accepts image data. The image will render without any additional file loading.' },
      ]}
      useCases={[
        { title: 'Self-contained HTML email templates', description: 'Email clients block external image loading by default. Embed images as Base64 data URIs in the HTML so logos and headers display immediately without being blocked.' },
        { title: 'CSS background images without file references', description: 'Embed small icons, patterns, and background images directly in your CSS file as data URIs. Reduces HTTP requests and makes your stylesheet self-contained.' },
        { title: 'API payloads and JSON data', description: 'REST APIs that accept image data often require Base64 encoded strings in JSON bodies. Convert your image to Base64 raw string for use in API calls to OCR, AI, or image processing services.' },
        { title: 'Offline HTML pages', description: 'Create fully self-contained HTML pages that display images without needing any external file references — useful for offline documentation, embedded reports, and standalone demos.' },
        { title: 'Progressive web app (PWA) assets', description: 'Embed critical above-the-fold images as inline Base64 to eliminate render-blocking image requests on first page load.' },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, GIF, WebP, SVG, BMP' },
        { label: 'Output formats', value: 'Data URI (with MIME prefix) or raw Base64 string' },
        { label: 'Max file size', value: '5 MB (larger files create very long strings)' },
        { label: 'Copy to clipboard', value: 'Yes — one-click copy' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is Base64 encoding?', a: 'Base64 is a binary-to-text encoding scheme that converts binary data (like an image file) into a string of ASCII characters. It uses 64 characters (A-Z, a-z, 0-9, +, /) to represent any byte sequence. This allows binary data to be safely embedded in text-based formats like HTML, CSS, JSON, and XML that are not designed to handle raw binary.' },
        { q: 'What is the difference between a data URI and raw Base64?', a: 'A data URI includes a MIME type prefix: data:image/png;base64,iVBORw0KGgo... This format is ready to paste directly into an HTML src attribute or CSS background-image property. Raw Base64 is just the encoded string without the prefix: iVBORw0KGgo... Use raw Base64 when the API or system you are sending to expects the string without the prefix.' },
        { q: 'How much larger is a Base64 string compared to the original file?', a: 'Base64 encoding increases file size by approximately 33%. A 100 KB image becomes roughly 133 KB as a Base64 string. This is the trade-off for text compatibility. For large images, the overhead is significant — consider whether embedding is really the right approach versus referencing an external file.' },
        { q: 'Should I embed all my images as Base64?', a: 'No. Base64 embedding is appropriate for small images (icons, logos under 10 KB) where reducing HTTP requests outweighs the size increase. For larger images, external file references are better — browsers can cache external files and download them in parallel, which outperforms inline embedding for most use cases.' },
        { q: 'Can I use a Base64 image in an img tag?', a: 'Yes. Set the src attribute to the full data URI: <img src="data:image/png;base64,iVBORw0..." />. This works in all modern browsers and in most email clients.' },
        { q: 'What about SVG images?', a: 'SVG is already a text format, so you can embed SVGs in HTML/CSS as raw SVG markup without Base64 encoding. However, for use in img src attributes or CSS background-image in some contexts, Base64 encoding the SVG ensures compatibility. The tool supports SVG encoding.' },
      ]}
      relatedTools={[
        { name: 'Base64 to Image', href: '/tools/image-tools/base64-to-image', icon: '??', description: 'Decode Base64 string back to image' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress before encoding to reduce string size' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert to WebP before encoding' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to reduce encoding size' },
        { name: 'Image Size Checker', href: '/tools/image-tools/image-size-checker', icon: '??', description: 'Check image dimensions and file size' },
        { name: 'Image Metadata Viewer', href: '/tools/image-tools/image-metadata-viewer', icon: '??', description: 'View EXIF and metadata' },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ImageToBase64Client />
    </ImageToolShell>
  )
}
