import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import OcrClient from './OcrClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Image to Text (OCR) — Extract Text from Images Free Online | Roughtools',
  description: 'Extract text from images using OCR online for free. Supports JPG, PNG, PDF screenshots. Copy extracted text instantly. Supports 30+ languages. 100% browser-based.',
  keywords: ['image to text', 'ocr online', 'extract text from image', 'ocr image', 'photo to text', 'screenshot to text', 'image text extractor'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-to-text' },
  openGraph: {
    title: 'Image to Text (OCR) — Free Online | Roughtools',
    description: 'Extract text from images with OCR. 30+ languages, instant results. Free.',
    url: 'https://roughtools.com/tools/image-tools/image-to-text',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Image to Text (OCR) | Roughtools', description: 'Extract text from images with OCR online free. 30+ languages.' },
}


const _s = getImageToolSupplement('image-to-text')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image to Text (OCR)"
      toolSlug="image-to-text"
      icon="??"
      description="Extract text from any image using Optical Character Recognition (OCR). Upload a screenshot, photo of a document, scanned page, or any image containing text — the tool recognises and extracts the text, making it selectable, copyable, and searchable. Supports over 30 languages including English, French, Spanish, German, Arabic, Chinese, Hindi, and more. All OCR processing runs in your browser."
      howToSteps={[
        { name: 'Upload your image', text: 'Click the upload area or drag and drop a JPG, PNG, WebP, or TIFF image containing text. High-contrast, well-lit images with clear text produce the best accuracy.' },
        { name: 'Select language', text: 'Choose the language of the text in the image from the dropdown. Selecting the correct language significantly improves recognition accuracy, especially for languages with special characters.' },
        { name: 'Extract text', text: 'Click the Extract Text button. The OCR engine analyses the image and identifies text regions, characters, and words. Processing takes 2–10 seconds depending on image size and text density.' },
        { name: 'Review and copy', text: 'The extracted text is displayed in an editable text area. Review for accuracy and correct any errors. Click Copy to clipboard to copy all extracted text for use in any other application.' },
        { name: 'Export', text: 'Download the extracted text as a plain .txt file, or copy it directly. Use the text in documents, spreadsheets, search engines, or any text-based workflow.' },
      ]}
      useCases={[
        { title: 'Extracting text from screenshots', description: 'Copy text from screenshots of websites, error messages, software interfaces, or any screen content where you cannot directly select and copy the text.' },
        { title: 'Digitising scanned documents', description: 'Convert scanned paper documents, old printed pages, and physical books into searchable digital text. Extract content from archived documents for editing or data extraction.' },
        { title: 'Reading text in images from social media', description: 'Extract text from infographics, quote images, memes with text, and social media images where the text is embedded as a visual element rather than selectable text.' },
        { title: 'Data extraction from tables and invoices', description: 'Extract numbers, names, and data from photos of receipts, invoices, business cards, and tables. The extracted text can be pasted into spreadsheets for further processing.' },
        { title: 'Accessibility and content reuse', description: 'Make image-based content accessible by extracting the text for screen readers, translation tools, or content management systems that require machine-readable text.' },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP, TIFF, BMP' },
        { label: 'Languages supported', value: '30+ including English, French, Spanish, German, Arabic, Chinese, Hindi, Japanese' },
        { label: 'Output', value: 'Editable text, copy to clipboard, .txt download' },
        { label: 'Max file size', value: '10 MB per image' },
        { label: 'Processing', value: 'Browser-based OCR using Tesseract.js' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'How accurate is the text extraction?', a: 'Accuracy depends on image quality. Clean, high-contrast, well-lit images of printed text typically achieve 95–99% accuracy. Handwritten text, low-resolution images, unusual fonts, skewed or rotated text, and overlapping characters reduce accuracy significantly. For the best results, use images with black text on white background at 300 DPI or higher.' },
        { q: 'What image quality gives the best OCR results?', a: 'High contrast (dark text on light background), minimum 300 DPI resolution, sharp focus with no motion blur, upright orientation (not rotated), and a clean background without patterns or other images behind the text. If your image is skewed or rotated, use the Image Flip and Rotate tool to correct it before running OCR.' },
        { q: 'Can I extract text from handwritten notes?', a: 'Printed text recognition is very reliable. Handwritten text is significantly harder — the OCR engine was trained primarily on printed fonts. Neat, block-capital handwriting gives reasonable results. Cursive or very personal handwriting styles produce poor accuracy. For critical handwritten content, review and correct the output carefully.' },
        { q: 'Does the tool work on images containing both text and graphics?', a: 'Yes. The OCR engine identifies text regions within the image and extracts text from those areas. Graphics, photos, and decorative elements are ignored. In complex layouts (multi-column documents, tables, sidebars), the reading order may not perfectly follow the intended document flow — review the output to correct any ordering issues.' },
        { q: 'What is Tesseract.js?', a: 'Tesseract.js is the JavaScript port of Tesseract OCR, an open-source optical character recognition engine originally developed by HP and maintained by Google. It supports over 100 languages and runs entirely in the browser without any server-side processing. The language data files are downloaded to your browser on first use.' },
        { q: 'Can I extract text from a PDF?', a: 'This tool processes image files. For searchable PDFs, the text can usually be selected and copied directly without OCR. For scanned PDFs (image-based), take a screenshot of each page and use this tool on each screenshot, or use a dedicated PDF OCR tool.' },
      ]}
      relatedTools={[
        { name: 'Screenshot to PDF', href: '/tools/image-tools/screenshot-to-pdf', icon: '??', description: 'Convert screenshots to PDF' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve contrast before OCR' },
        { name: 'Image Flipper Rotator', href: '/tools/image-tools/image-flipper-rotator', icon: '??', description: 'Correct orientation before OCR' },
        { name: 'Image Size Checker', href: '/tools/image-tools/image-size-checker', icon: '??', description: 'Check image resolution' },
        { name: 'DPI Converter', href: '/tools/image-tools/dpi-converter', icon: '???', description: 'Set correct DPI for scanned images' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress images for sharing' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <OcrClient />
    </ImageToolShell>
  )
}
