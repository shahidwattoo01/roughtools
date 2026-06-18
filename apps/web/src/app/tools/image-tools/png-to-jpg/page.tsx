import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import PngToJpgClient from './PngToJpgClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'PNG to JPG Converter — Convert PNG to JPEG Free Online | Roughtools',
  description:
    'Convert PNG images to JPG/JPEG online for free. Adjust quality, reduce file size, and download instantly. 100% browser-based — your files are never uploaded to any server.',
  keywords: [
    'png to jpg',
    'convert png to jpeg',
    'png to jpg converter',
    'png to jpeg online',
    'convert png',
    'png jpg free',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/png-to-jpg' },
  openGraph: {
    title: 'PNG to JPG Converter — Free Online | Roughtools',
    description: 'Convert PNG to JPG instantly. Adjust quality, reduce file size. Free, no upload.',
    url: 'https://roughtools.com/tools/image-tools/png-to-jpg',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to JPG | Roughtools',
    description: 'Convert PNG files to JPG format online free.',
  },
};

const _s = getImageToolSupplement('png-to-jpg');

export default function Page() {
  return (
    <ImageToolShell
      toolName="PNG to JPG Converter"
      toolSlug="png-to-jpg"
      icon="???"
      description="Convert PNG images to JPG format instantly in your browser. Control the output quality to balance file size against visual fidelity — JPG files are typically 60–80% smaller than equivalent PNG files, making them ideal for web use, email attachments, and social sharing. Note that JPG does not support transparency; any transparent areas in your PNG will be filled with white."
      howToSteps={[
        {
          name: 'Upload your PNG',
          text: 'Click the upload area or drag and drop your PNG file. You can also upload WebP or other formats if you want to convert them to JPG.',
        },
        {
          name: 'Set the quality level',
          text: 'Use the quality slider to control the JPG compression. 85% is recommended for most uses — it produces files 50–70% smaller than PNG with barely visible quality difference.',
        },
        {
          name: 'Choose background colour',
          text: 'If your PNG has a transparent background, select the fill colour for transparent areas (white is the default, as JPG does not support transparency).',
        },
        {
          name: 'Convert',
          text: 'Click the Convert button. The browser re-encodes the image as a JPG file instantly — no server required.',
        },
        {
          name: 'Download',
          text: 'Download the JPG file. The original PNG remains unchanged on your device.',
        },
      ]}
      useCases={[
        {
          title: 'Reducing file size for web upload',
          description:
            'PNG files are large. Converting to JPG at 80% quality typically reduces file size by 60–80%, making images load faster on websites and pass CMS upload size limits.',
        },
        {
          title: 'Email attachments',
          description:
            'Email providers cap attachment sizes. Convert large PNG screenshots or graphics to JPG to send them without hitting file size limits.',
        },
        {
          title: 'Social media posting',
          description:
            'Most social platforms handle JPG better than PNG for photographs. Converting ensures your image is processed correctly and does not get re-compressed unexpectedly.',
        },
        {
          title: 'Removing transparency for print',
          description:
            'PNG transparency does not print correctly in some software. Convert to JPG with a white background to get a print-ready file that works in all applications.',
        },
        {
          title: 'Storage space saving',
          description:
            'Large collections of PNG screenshots or exports take up significant disk space. Convert to JPG to reclaim storage while keeping the images visually indistinguishable.',
        },
      ]}
      specs={[
        { label: 'Input format', value: 'PNG (also accepts WebP, GIF, BMP)' },
        { label: 'Output format', value: 'JPG / JPEG' },
        { label: 'Quality control', value: 'Yes — 10% to 100% slider' },
        { label: 'Transparency handling', value: 'Filled with chosen colour (default: white)' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Does converting PNG to JPG reduce quality?',
          a: 'JPG uses lossy compression, so some image data is discarded. At 80–90% quality, the difference is virtually invisible in photographs. For images with sharp text, flat graphics, or fine lines, the quality reduction may be more noticeable — in those cases, keep PNG or use 90%+ quality.',
        },
        {
          q: 'What happens to PNG transparency when converting to JPG?',
          a: 'JPG does not support transparency. Transparent areas in your PNG will be filled with a solid colour — white by default, but you can choose any colour using the background colour picker. If transparency is important for your use case, keep the PNG format or convert to WebP which supports alpha transparency.',
        },
        {
          q: 'How much smaller will the JPG file be compared to the PNG?',
          a: 'For photographs, JPG at 80% quality is typically 60–80% smaller than the equivalent PNG. For flat graphics with large areas of solid colour, the difference is smaller — often 20–40%. PNG uses lossless compression that is especially efficient for simple graphics, so the relative saving from JPG is less pronounced for those types of images.',
        },
        {
          q: 'Can I convert multiple PNG files at once?',
          a: 'Yes — drop multiple PNG files into the upload area and each will be converted individually. Download them one by one or use the Download All button to get every JPG in one go.',
        },
        {
          q: 'Will the image dimensions change after conversion?',
          a: 'No. The width and height of the image remain exactly the same after conversion. Only the format and file size change.',
        },
        {
          q: 'Is PNG to JPG conversion reversible?',
          a: 'Not losslessly. Once you convert to JPG and discard the original PNG, you cannot recover the exact original pixels. The quality loss from a single conversion at 80%+ is generally negligible, but repeated JPG-to-JPG conversion accumulates quality degradation. Always keep your original PNG files as master copies.',
        },
      ]}
      relatedTools={[
        {
          name: 'JPG to PNG',
          href: '/tools/image-tools/jpg-to-png',
          icon: '??',
          description: 'Convert JPG back to PNG format',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress your new JPG further',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert between all formats including WebP',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop after converting',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to exact dimensions',
        },
        {
          name: 'Image Enhancer',
          href: '/tools/image-tools/image-enhancer',
          icon: '?',
          description: 'Improve brightness and contrast',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <PngToJpgClient />
    </ImageToolShell>
  );
}
