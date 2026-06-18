import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import DpiConverterClient from './DpiConverterClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'DPI Converter — Change Image DPI for Print Free Online | Roughtools',
  description:
    'Change image DPI (dots per inch) for printing online free. Convert to 72, 150, 300, or 600 DPI. Check image print size. 100% browser-based, no upload required.',
  keywords: [
    'dpi converter',
    'change image dpi',
    'image dpi changer',
    'dpi to pixels',
    'print dpi',
    '300 dpi converter',
    'image resolution dpi',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/dpi-converter' },
  openGraph: {
    title: 'DPI Converter — Free Online | Roughtools',
    description: 'Change image DPI for print. Convert to 300 DPI for professional printing. Free.',
    url: 'https://roughtools.com/tools/image-tools/dpi-converter',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPI Converter | Roughtools',
    description: 'Change image DPI for print online free. 72, 150, 300, 600 DPI.',
  },
};

const _s = getImageToolSupplement('dpi-converter');

export default function Page() {
  return (
    <ImageToolShell
      toolName="DPI Converter"
      toolSlug="dpi-converter"
      icon="???"
      description="Change the DPI (dots per inch) metadata of any image for printing. Set DPI to 72 for screens, 150 for standard prints, 300 for professional printing, or 600 for high-resolution art and photo books. The tool also calculates the exact print size your image will produce at any DPI, helping you understand whether you have enough pixels for the print size you need."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG or PNG image. The current DPI metadata and calculated print size are displayed immediately.',
        },
        {
          name: 'Check current print size',
          text: 'The tool shows how large your image will print at the current DPI. A 3000×2000 pixel image at 300 DPI prints at 10×6.67 inches — check this before proceeding.',
        },
        {
          name: 'Enter the target DPI',
          text: 'Type your desired DPI or choose a preset: 72 DPI (screen), 150 DPI (standard print), 300 DPI (professional print), 600 DPI (fine art/photo book).',
        },
        {
          name: 'Choose whether to resample',
          text: 'Setting DPI without resampling only changes the metadata — the pixel count stays the same. Resampling changes the actual pixel dimensions to produce the new DPI at the same physical size.',
        },
        {
          name: 'Download',
          text: 'Download the image with the updated DPI setting embedded. For JPG, the DPI is stored in the EXIF data. For PNG, it is stored in the pHYs chunk.',
        },
      ]}
      useCases={[
        {
          title: 'Professional printing and press',
          description:
            'Commercial printers, photo labs, and print-on-demand services typically require 300 DPI images. Verify your image meets this requirement and convert if needed before submitting.',
        },
        {
          title: 'Fine art prints and photo books',
          description:
            'High-quality art prints and premium photo books often require 600 DPI for maximum sharpness at close viewing distances. Convert and verify pixel count is sufficient for the required print size.',
        },
        {
          title: 'Web and screen graphics',
          description:
            'Screen images are displayed at 72 or 96 DPI. Converting print images to 72 DPI before uploading to the web reduces unnecessary metadata and standardises the image for screen display.',
        },
        {
          title: 'Checking if an image is high enough resolution',
          description:
            'Before ordering a large print, check whether your image has enough pixels. The DPI calculator shows the maximum print size at 300 DPI — if your image is too small, you will see pixelation at the desired print size.',
        },
        {
          title: 'Magazine and newspaper submission',
          description:
            'Editorial publications have specific DPI requirements for submitted photography — typically 300 DPI at the final print size. Use this tool to verify compliance before submitting images to editors.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, TIFF' },
        { label: 'DPI presets', value: '72, 96, 150, 200, 300, 600 DPI' },
        { label: 'Custom DPI', value: 'Yes — enter any value' },
        { label: 'Resampling option', value: 'Yes — metadata only, or with pixel resize' },
        { label: 'Print size calculator', value: 'Yes — shows print dimensions at any DPI' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'What is DPI and why does it matter for printing?',
          a: 'DPI (dots per inch) describes how many ink dots a printer places per inch of paper. For digital images, it indicates how many pixels are mapped to each inch when printed. A higher DPI means more pixels per inch — resulting in a sharper, more detailed print. Standard professional printing uses 300 DPI; images printed below 150 DPI typically look pixelated or blurry.',
        },
        {
          q: 'Does changing DPI change the image quality?',
          a: 'Changing DPI metadata alone (without resampling) does not change the image quality or pixel count — it only changes a number stored in the file header that tells printers how to scale the image. To physically change the number of pixels, enable resampling, which will resize the image to maintain the same physical dimensions at the new DPI.',
        },
        {
          q: 'What DPI do I need for professional printing?',
          a: '300 DPI is the industry standard for professional photo printing, magazines, brochures, and most commercial print applications. Some high-end applications like fine art giclée printing or premium photo books use 600 DPI. Standard home printing at 150 DPI is acceptable for general documents. Screen display does not use DPI in the traditional sense.',
        },
        {
          q: 'My image is only 72 DPI — can I just change it to 300 DPI?',
          a: 'Changing the DPI metadata alone makes the file say 300 DPI, but the actual number of pixels has not changed — the print will just be smaller. To truly have a 300 DPI image at a given print size, you need enough pixels. For example, a 4×6 inch print at 300 DPI requires 1200×1800 pixels minimum. If your image does not have enough pixels, use the Image Upscaler to increase the pixel count, then set DPI to 300.',
        },
        {
          q: 'What is the difference between DPI and PPI?',
          a: 'DPI (dots per inch) technically refers to the number of ink dots a printer produces per inch. PPI (pixels per inch) refers to the number of pixels in a digital image per inch. In everyday use, the terms are used interchangeably for digital images, and most imaging software including this tool treats them as equivalent.',
        },
        {
          q: 'How do I know if my image is high enough resolution for my print size?',
          a: "Divide the pixel dimensions by 300 to get the maximum print size in inches at professional quality. For example: 3000 pixels wide ÷ 300 DPI = 10 inches wide maximum. The tool's print size calculator does this automatically — it shows the maximum print dimensions at any DPI you enter.",
        },
      ]}
      relatedTools={[
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to exact pixel dimensions',
        },
        {
          name: 'Image Upscaler',
          href: '/tools/image-tools/image-upscaler',
          icon: '??',
          description: 'Increase image resolution',
        },
        {
          name: 'Pixel Density Calculator',
          href: '/tools/image-tools/pixel-density-calculator',
          icon: '??',
          description: 'Calculate PPI for your screen',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress after DPI conversion',
        },
        {
          name: 'Passport Photo Maker',
          href: '/tools/image-tools/passport-photo-maker',
          icon: '??',
          description: 'Create 300 DPI passport photos',
        },
        {
          name: 'Bulk Image Resizer',
          href: '/tools/image-tools/bulk-image-resizer',
          icon: '??',
          description: 'Resize multiple images at once',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <DpiConverterClient />
    </ImageToolShell>
  );
}
