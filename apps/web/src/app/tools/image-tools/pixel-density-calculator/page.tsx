import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import PixelDensityClient from './PixelDensityClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Pixel Density Calculator — Calculate PPI and Image Print Size Free | Roughtools',
  description: 'Calculate pixel density (PPI), print size, and screen resolution online free. Enter image dimensions and display size to get exact DPI/PPI. Browser-based, instant results.',
  keywords: ['pixel density calculator', 'ppi calculator', 'dpi calculator', 'pixels per inch', 'image resolution calculator', 'screen ppi', 'print size calculator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/pixel-density-calculator' },
  openGraph: {
    title: 'Pixel Density Calculator — Free Online | Roughtools',
    description: 'Calculate PPI, DPI, and print size from image dimensions. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/pixel-density-calculator',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Pixel Density Calculator | Roughtools', description: 'Calculate PPI and print size from image dimensions. Free.' },
}


const _s = getImageToolSupplement('pixel-density-calculator')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Pixel Density Calculator"
      toolSlug="pixel-density-calculator"
      icon="??"
      description="Calculate the pixel density (PPI — pixels per inch) of any screen or the print DPI of any image. Enter the pixel dimensions and the physical size (screen diagonal or print dimensions) to get instant results. Useful for photographers, designers, and developers who need to understand image resolution and whether an image has enough pixels for a given use case."
      howToSteps={[
        { name: 'Choose calculation mode', text: 'Select Screen PPI to calculate the pixel density of a display, or Print DPI to calculate what DPI an image produces at a given print size.' },
        { name: 'Enter pixel dimensions', text: 'Type the width and height of the image or screen in pixels. For screen PPI, use the native resolution of the display (e.g. 2560×1600 for a MacBook Pro).' },
        { name: 'Enter physical size', text: 'For screen PPI, enter the screen diagonal size in inches. For print DPI, enter the width or height of the intended print in inches.' },
        { name: 'View results', text: 'The calculator instantly shows the PPI or DPI, the total megapixel count, and a quality rating (Low / OK / Good / Excellent) for the intended use.' },
      ]}
      useCases={[
        { title: 'Checking if an image has enough pixels for a print', description: 'Before ordering a large print, enter the image pixel dimensions and the print size to see what DPI the print will be. Below 150 DPI looks pixelated; 300 DPI is sharp for professional quality.' },
        { title: 'Comparing screen sharpness between devices', description: 'Compare the PPI of different phones, tablets, or monitors to understand which has a sharper display. Higher PPI means finer detail and crisper text at the same physical size.' },
        { title: 'Web development and responsive design', description: 'Know the pixel density of target devices to create correctly scaled images and graphics for retina/HiDPI screens. Images need to be 2x pixel dimensions to look sharp on 2x displays.' },
        { title: 'Photography and camera sensor comparison', description: 'Calculate the PPI of a camera sensor or print to compare sharpness between different camera systems. Useful for understanding whether a higher megapixel camera gives real-world benefits for your print size.' },
        { title: 'Signage and large format printing', description: 'Large format prints (banners, posters, billboards) are viewed at distance and can use lower DPI without visible pixelation. Calculate the minimum DPI needed for your print size and viewing distance.' },
      ]}
      specs={[
        { label: 'Calculation modes', value: 'Screen PPI and Print DPI' },
        { label: 'Input units', value: 'Pixels and inches (or mm with conversion)' },
        { label: 'Output', value: 'PPI / DPI, megapixels, quality rating' },
        { label: 'Processing', value: 'Instant — pure calculation, no image upload' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What is PPI and how is it different from DPI?', a: 'PPI (pixels per inch) describes the pixel density of a digital display or image — how many pixels fit into one inch. DPI (dots per inch) technically describes how many ink dots a printer places per inch. In digital imaging, the terms are often used interchangeably, but PPI is technically correct for screens and digital images, while DPI is correct for printers and printed output.' },
        { q: 'What PPI do I need for a sharp screen?', a: 'The required PPI depends on the viewing distance. For smartphones held 10–15 inches away, 300+ PPI is ideal (below this, individual pixels become visible). For monitors at 20–24 inches, 100–150 PPI is sufficient. For TVs watched from 6–10 feet away, 40–60 PPI is more than enough. Apple\'s Retina displays target approximately 220–460 PPI for near-viewing distances.' },
        { q: 'What DPI do I need for a sharp print?', a: '300 DPI is the professional standard for photo prints, magazines, and most commercial printing. 150 DPI is acceptable for standard documents and general desktop printing. 600 DPI is used for premium fine-art printing and high-quality photo books. Large format prints (banners, posters) are typically 72–150 DPI because they are viewed from a distance.' },
        { q: 'How do I calculate the minimum pixels needed for a print?', a: 'Multiply the print width in inches by the target DPI to get the required pixel width. For a 10×8 inch print at 300 DPI, you need 3000×2400 pixels minimum. This calculator performs this calculation automatically when you enter the print size and DPI.' },
        { q: 'Can I use this to check if my phone camera has enough resolution?', a: 'Yes. Enter your phone camera\'s photo resolution in pixels (e.g. 4032×3024 for a 12 MP camera) and your target print size. The calculator shows the maximum print size you can achieve at 300 DPI — if it is larger than your target, your camera has sufficient resolution.' },
        { q: 'What does megapixels mean in relation to print size?', a: 'One megapixel equals one million pixels. A 12 MP camera produces images with approximately 12 million pixels, typically in a 4:3 ratio (e.g. 4032×3024). At 300 DPI, a 12 MP image can print at roughly 13×10 inches at full professional quality. More megapixels allow larger print sizes at the same DPI.' },
      ]}
      relatedTools={[
        { name: 'DPI Converter', href: '/tools/image-tools/dpi-converter', icon: '???', description: 'Change image DPI for print' },
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to required pixel dimensions' },
        { name: 'Image Upscaler', href: '/tools/image-tools/image-upscaler', icon: '??', description: 'Increase image resolution' },
        { name: 'Image Size Checker', href: '/tools/image-tools/image-size-checker', icon: '??', description: 'Check dimensions and file size' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Reduce file size without quality loss' },
        { name: 'Bulk Image Resizer', href: '/tools/image-tools/bulk-image-resizer', icon: '??', description: 'Resize multiple images at once' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <PixelDensityClient />
    </ImageToolShell>
  )
}
