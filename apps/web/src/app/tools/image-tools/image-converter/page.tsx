import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import ImageConverterClient from './ImageConverterClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Image Converter — Convert JPG PNG WebP GIF BMP Online Free | Roughtools',
  description:
    'Convert images between JPG, PNG, WebP, GIF, and BMP formats online for free. Fast, browser-based conversion — files never uploaded to any server. No signup required.',
  keywords: [
    'image converter',
    'convert jpg to png',
    'convert png to webp',
    'image format converter',
    'online image converter',
    'jpg to webp',
    'png to jpg converter',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-converter' },
  openGraph: {
    title: 'Image Converter — Free Online | Roughtools',
    description: 'Convert between JPG, PNG, WebP, GIF, BMP. Instant, free, no upload.',
    url: 'https://roughtools.com/tools/image-tools/image-converter',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Converter | Roughtools',
    description: 'Convert images between all major formats. Free, no signup.',
  },
};

const _s = getImageToolSupplement('image-converter');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Converter"
      toolSlug="image-converter"
      icon="??"
      description="Convert images between all major formats — JPG, PNG, WebP, GIF, and BMP — instantly in your browser. Adjust output quality for lossy formats, batch convert multiple files, and download results immediately. No files are ever uploaded to a server — conversion is 100% private and happens on your device."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop your image file. JPG, PNG, WebP, GIF, and BMP are all accepted as input formats.',
        },
        {
          name: 'Select the output format',
          text: 'Choose your target format from the dropdown. Pick WebP for web assets, PNG for transparency, JPG for photos, or GIF for animations.',
        },
        {
          name: 'Adjust quality (if applicable)',
          text: 'For lossy output formats like JPG and WebP, use the quality slider to balance file size against visual quality. 85% is the recommended default.',
        },
        {
          name: 'Convert',
          text: 'Click the Convert button. The browser re-encodes the image in the chosen format using the Canvas API — the process is instant for most images.',
        },
        {
          name: 'Download',
          text: 'Download the converted file. The filename will automatically include the new extension so it is clear which format you have.',
        },
      ]}
      useCases={[
        {
          title: 'Convert to WebP for web performance',
          description:
            'WebP images are 25–35% smaller than equivalent JPG or PNG files. Convert your site images to WebP to improve page load speed and Lighthouse scores.',
        },
        {
          title: 'PNG for transparency requirements',
          description:
            'If you need a transparent background — for logos, UI assets, or product photos on any colour background — convert to PNG which supports full alpha transparency.',
        },
        {
          title: 'JPG for universal compatibility',
          description:
            'JPG is supported everywhere. Convert PNG or WebP files to JPG when sharing with users on older devices, email clients, or services that do not support newer formats.',
        },
        {
          title: 'BMP for legacy software',
          description:
            'Some older desktop applications only accept BMP files. Convert any image to BMP for compatibility with legacy design tools, industrial software, or older Windows programs.',
        },
        {
          title: 'GIF for simple animations',
          description:
            'Convert image sequences or animated content to GIF format for sharing on platforms that support GIF but not video — such as email clients and older messaging apps.',
        },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP, GIF, BMP' },
        { label: 'Output formats', value: 'JPG, PNG, WebP, GIF, BMP' },
        { label: 'Quality control', value: 'Yes — slider for JPG and WebP output' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Batch conversion', value: 'Yes — multiple files at once' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Which image formats can I convert between?',
          a: 'The converter accepts JPG, PNG, WebP, GIF, and BMP as input and can output to any of those same formats. You can convert in any direction — PNG to WebP, JPG to PNG, BMP to JPG, and so on.',
        },
        {
          q: 'Will I lose quality when converting?',
          a: 'Converting to a lossless format like PNG or BMP preserves every pixel exactly. Converting to a lossy format like JPG or WebP applies compression — but with the quality slider set to 85%+, the difference is virtually invisible. Avoid converting lossy to lossy repeatedly (e.g. JPG ? WebP ? JPG) as each step accumulates quality loss.',
        },
        {
          q: 'Why should I convert to WebP?',
          a: 'WebP is a modern format developed by Google that delivers 25–35% smaller file sizes compared to JPG or PNG at equivalent visual quality. All major browsers have supported WebP since 2020, making it the ideal format for web images. Smaller images mean faster page loads, better SEO rankings, and lower bandwidth costs.',
        },
        {
          q: 'Does converting PNG to JPG remove transparency?',
          a: 'Yes. JPG does not support transparency. When you convert a transparent PNG to JPG, the transparent areas are filled with a solid colour (typically white). If you need to preserve transparency, keep the PNG format or convert to WebP, which does support alpha transparency.',
        },
        {
          q: 'Can I batch convert multiple images?',
          a: 'Yes. Drop multiple files into the upload area at once. Each file is converted individually and you can download them one by one, or use the Download All option to get every converted file in a single action.',
        },
        {
          q: 'Are my images private during conversion?',
          a: 'Completely. All conversion is performed locally in your browser using the HTML5 Canvas API. Your image data never leaves your device — no files are transmitted to any server at any point.',
        },
      ]}
      relatedTools={[
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Reduce file size without visible quality loss',
        },
        {
          name: 'PNG to JPG',
          href: '/tools/image-tools/png-to-jpg',
          icon: '???',
          description: 'Convert PNG files to JPG format',
        },
        {
          name: 'JPG to PNG',
          href: '/tools/image-tools/jpg-to-png',
          icon: '??',
          description: 'Convert JPG to PNG with transparency',
        },
        {
          name: 'HEIC to JPG',
          href: '/tools/image-tools/heic-to-jpg',
          icon: '??',
          description: 'Convert iPhone HEIC photos to JPG',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to exact pixel dimensions',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress after converting for smaller files',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <ImageConverterClient />
    </ImageToolShell>
  );
}
