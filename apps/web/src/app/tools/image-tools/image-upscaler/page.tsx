import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import ImageUpscalerClient from './ImageUpscalerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Image Upscaler — Upscale and Enlarge Images Free Online | Roughtools',
  description:
    'Upscale and enlarge images online for free. Increase resolution without losing quality. Supports 2x and 4x upscaling. 100% browser-based — no upload required.',
  keywords: [
    'image upscaler',
    'upscale image online',
    'enlarge image',
    'increase image resolution',
    'image upscale free',
    'ai image upscaler',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-upscaler' },
  openGraph: {
    title: 'Image Upscaler — Free Online | Roughtools',
    description: 'Upscale images 2x or 4x without quality loss. Free, browser-based, no upload.',
    url: 'https://roughtools.com/tools/image-tools/image-upscaler',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Upscaler | Roughtools',
    description: 'Upscale and enlarge images online free. 2x and 4x upscaling.',
  },
};

const _s = getImageToolSupplement('image-upscaler');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Upscaler"
      toolSlug="image-upscaler"
      icon="??"
      description="Upscale and enlarge images to higher resolutions without the blurriness that usually comes from simple stretching. The upscaler uses interpolation algorithms to fill in new pixel data intelligently — increasing dimensions while keeping edges sharp. Supports 2x and 4x scale factors for JPG, PNG, and WebP images. All processing runs in your browser."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The original dimensions are displayed so you can see the starting resolution.',
        },
        {
          name: 'Choose a scale factor',
          text: 'Select 2x to double the dimensions, or 4x to quadruple them. A 400×300 image becomes 800×600 at 2x or 1600×1200 at 4x.',
        },
        {
          name: 'Choose output format',
          text: 'Select JPG, PNG, or WebP for the upscaled output. Use PNG for lossless upscaling, or JPG/WebP for smaller file sizes.',
        },
        {
          name: 'Upscale',
          text: 'Click the Upscale button. The browser applies the interpolation algorithm to the image, generating new pixel data at the larger dimensions.',
        },
        {
          name: 'Download',
          text: 'Preview the upscaled result and download it. Compare with the original to check edge sharpness and overall quality.',
        },
      ]}
      useCases={[
        {
          title: 'Printing small images at larger sizes',
          description:
            'An image that looks fine on screen may be too small to print at high quality. Upscale before printing to get a sharper, more detailed result at larger print dimensions.',
        },
        {
          title: 'Improving thumbnail or icon resolution',
          description:
            'Small icons and thumbnails often look pixelated when displayed at larger sizes. Upscale to a higher resolution so they remain sharp when shown at larger sizes on modern displays.',
        },
        {
          title: 'Enlarging product photos',
          description:
            'If you only have a small product photo, upscale it to meet the minimum resolution requirements of e-commerce platforms that require images to be at least 1000px wide.',
        },
        {
          title: 'Making old photos print-ready',
          description:
            'Old scanned photos and digital images from early cameras may not have enough pixels for modern print sizes. Upscaling increases the pixel count for better print output.',
        },
        {
          title: 'Preparing images for large screens',
          description:
            'On 4K and high-DPI displays, images need more pixels to look sharp. Upscale images to ensure they render crisply on high-resolution monitors and TVs.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Scale factors', value: '2x (double), 4x (quadruple)' },
        { label: 'Upscaling method', value: 'Bicubic interpolation' },
        { label: 'Max input size', value: '10 MB per image' },
        { label: 'Output formats', value: 'JPG, PNG, WebP' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Can upscaling really add quality to a small image?',
          a: 'Upscaling cannot recover detail that was never captured — it cannot add information that does not exist. What it does is increase the number of pixels using interpolation, which makes the image look smoother at larger display sizes than simple stretching would. For photographs, good interpolation algorithms like bicubic produce much better results than the default browser scaling.',
        },
        {
          q: 'What is the difference between 2x and 4x upscaling?',
          a: '2x doubles both dimensions — a 500×500 image becomes 1000×1000. 4x quadruples them — the same image becomes 2000×2000. The resulting file size also grows substantially: a 4x upscale results in roughly 16 times as many pixels as the original. Use 4x only when you genuinely need the larger dimensions, as it creates very large files.',
        },
        {
          q: 'How is this different from just resizing the image to a larger size?',
          a: 'Both operations increase pixel count, but upscaling is typically optimised to use higher-quality interpolation algorithms that reduce blurring and artefacts compared to basic resize. The practical difference is subtle for photograph content and more noticeable for images with sharp edges, text, or high contrast.',
        },
        {
          q: 'Will upscaling look good for all types of images?',
          a: 'Photographs with gradual tonal transitions respond well to upscaling. Images with sharp geometric shapes, text, or pixel art may show artefacts or blurring around edges. For pixel art specifically, use nearest-neighbour scaling rather than bicubic interpolation to preserve the sharp pixel grid.',
        },
        {
          q: 'What is the maximum output resolution?',
          a: 'The output resolution is determined by the input size multiplied by the scale factor. A 10 MP input at 4x becomes 160 MP — this may push browser memory limits and slow processing significantly. For very large outputs, process images in stages or use desktop upscaling software.',
        },
        {
          q: 'Should I compress the upscaled image after downloading?',
          a: 'Yes, if you are using it for web. Upscaled images at full quality are large. Use the Image Compressor tool to reduce the file size after upscaling, especially for JPG output. For PNG, the file will be very large — consider converting to WebP for web use.',
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
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress the upscaled result',
        },
        {
          name: 'Image Enhancer',
          href: '/tools/image-tools/image-enhancer',
          icon: '?',
          description: 'Improve sharpness after upscaling',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert upscaled image to WebP',
        },
        {
          name: 'DPI Converter',
          href: '/tools/image-tools/dpi-converter',
          icon: '???',
          description: 'Set DPI for print',
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
      <ImageUpscalerClient />
    </ImageToolShell>
  );
}
