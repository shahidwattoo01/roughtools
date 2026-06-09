import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import Base64ToImageClient from './Base64ToImageClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Base64 to Image Converter — Decode Base64 String to Image Free | Roughtools',
  description: 'Decode Base64 encoded strings back to image files online for free. Paste a data URI or raw Base64 string and download the image. 100% browser-based, instant.',
  keywords: ['base64 to image', 'decode base64 image', 'base64 image decoder', 'data uri to image', 'base64 string to image', 'base64 decode image'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/base64-to-image' },
  openGraph: {
    title: 'Base64 to Image Converter — Free Online | Roughtools',
    description: 'Decode Base64 strings to image files. Paste and download. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/base64-to-image',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Base64 to Image | Roughtools', description: 'Decode Base64 image strings to downloadable files. Free.' },
}


const _s = getImageToolSupplement('base64-to-image')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Base64 to Image Converter"
      toolSlug="base64-to-image"
      icon="??"
      description="Decode any Base64 encoded string or data URI back into a viewable and downloadable image file. Paste the Base64 string from an API response, HTML source, CSS file, or database, preview the decoded image, and download it as JPG, PNG, or WebP. Useful for developers debugging APIs, extracting embedded images from source code, or working with image data in text formats."
      howToSteps={[
        { name: 'Paste the Base64 string', text: 'Paste your Base64 encoded string into the text area. This can be a full data URI (starting with data:image/...) or a raw Base64 string without the prefix.' },
        { name: 'Specify MIME type (if raw Base64)', text: 'If you pasted a raw Base64 string without a data URI prefix, select the image type (JPG, PNG, WebP) so the decoder knows how to interpret the data.' },
        { name: 'Decode', text: 'Click the Decode button. The Base64 string is converted back to image data and rendered as a preview in the browser.' },
        { name: 'Download', text: 'Download the decoded image in your preferred format. The image file is exactly as it was before it was Base64 encoded.' },
      ]}
      useCases={[
        { title: 'Debugging API responses', description: 'REST APIs for OCR, AI vision, or image processing often return results as Base64 encoded images. Paste the response directly to preview and download the image for debugging.' },
        { title: 'Extracting images from HTML source', description: 'When a web page embeds images as Base64 data URIs in the HTML or CSS, use this tool to decode and download those images as standalone files.' },
        { title: 'Database image recovery', description: 'Some databases store images as Base64 encoded text in columns. Extract the text from the database and decode it back to an image file.' },
        { title: 'Email template debugging', description: 'HTML email templates often embed logos and images as data URIs. Decode them to check whether the correct image is embedded and preview how it looks.' },
        { title: 'Working with JSON data that includes images', description: 'When parsing JSON payloads that include Base64 image data (from forms, mobile apps, or IoT devices), use this tool to quickly visualise the image content.' },
      ]}
      specs={[
        { label: 'Input', value: 'Base64 string or full data URI' },
        { label: 'Supported image types', value: 'JPG, PNG, GIF, WebP, SVG' },
        { label: 'Output', value: 'Downloadable image file' },
        { label: 'Max string length', value: 'Limited by browser memory' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is the difference between a data URI and raw Base64?', a: 'A data URI is the full format including the MIME type prefix: data:image/png;base64,iVBORw0... This is ready to paste directly into an HTML img src or CSS background-image. Raw Base64 is just the encoded string: iVBORw0KGgo... without the prefix. This tool accepts both formats.' },
        { q: 'My Base64 string does not decode correctly — what could be wrong?', a: 'Common issues: (1) the string is truncated — Base64 strings must be complete; (2) the wrong MIME type is selected — a PNG encoded with JPG MIME type will fail; (3) the string includes whitespace or line breaks from copying multi-line — the tool handles this automatically, but very unusual formatting may cause issues; (4) the data is not actually an image — Base64 is used for all binary data, not just images.' },
        { q: 'Can I decode animated GIFs?', a: 'Yes, if the Base64 string encodes a complete GIF file including its animation frames. The decoded and downloaded file will be an animated GIF.' },
        { q: 'How large can the Base64 string be?', a: 'There is no hard limit — the maximum is determined by the available browser memory. Very long strings (representing images above 10 MB) may cause the browser to slow down or run out of memory on devices with limited RAM.' },
        { q: 'Can I convert the decoded image to a different format?', a: 'Yes. After decoding, the image preview is shown. Download it and then use the Image Converter tool to change the format, or compress it with the Image Compressor before using it.' },
        { q: 'Is Base64 decoding secure?', a: 'Yes. Decoding happens entirely in your browser — no data is sent to any server. The Base64 string you paste stays on your device. Do not paste Base64 strings from untrusted sources into other systems without understanding what image they decode to.' },
      ]}
      relatedTools={[
        { name: 'Image to Base64', href: '/tools/image-tools/image-to-base64', icon: '??', description: 'Encode image as Base64 string' },
        { name: 'Image Converter', href: '/tools/image-tools/image-converter', icon: '??', description: 'Convert decoded image to another format' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress the decoded image' },
        { name: 'Image Metadata Viewer', href: '/tools/image-tools/image-metadata-viewer', icon: '??', description: 'View EXIF data in the decoded image' },
        { name: 'Image Size Checker', href: '/tools/image-tools/image-size-checker', icon: '??', description: 'Check dimensions and file size' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize the decoded image' },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <Base64ToImageClient />
    </ImageToolShell>
  )
}
