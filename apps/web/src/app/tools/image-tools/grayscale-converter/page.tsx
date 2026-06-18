import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import GrayscaleClient from './GrayscaleClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Grayscale Converter — Convert Photos to Black and White Free Online | Roughtools',
  description:
    'Convert colour images to black and white or grayscale online for free. Choose from multiple grayscale modes. Real-time preview. 100% browser-based — files never uploaded.',
  keywords: [
    'grayscale converter',
    'black and white photo converter',
    'convert to grayscale',
    'black and white image',
    'desaturate image',
    'bw photo converter',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/grayscale-converter' },
  openGraph: {
    title: 'Grayscale Converter — Free Online | Roughtools',
    description: 'Convert photos to black and white with multiple grayscale modes. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/grayscale-converter',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grayscale Converter | Roughtools',
    description: 'Convert colour photos to black and white online free.',
  },
};

const _s = getImageToolSupplement('grayscale-converter');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Grayscale Converter"
      toolSlug="grayscale-converter"
      icon="?"
      description="Convert any colour image to black and white or grayscale with multiple conversion methods. Choose standard luminance conversion for natural-looking results, or try high-contrast, dramatic, or custom channel-mix modes for creative effects. Compare the result against the original with a before/after slider before downloading. All processing is browser-based and instant."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The original colour image is displayed in the preview.',
        },
        {
          name: 'Choose a grayscale mode',
          text: 'Select from Luminance (standard, natural-looking), Average (equal RGB channels), High Contrast (emphasises differences), or custom channel mix (set R/G/B weights manually for creative control).',
        },
        {
          name: 'Preview in real time',
          text: 'The grayscale conversion is applied immediately as you select modes. Use the before/after slider to compare against the original.',
        },
        {
          name: 'Adjust and download',
          text: 'Fine-tune the result using the Image Enhancer after converting if you want to adjust brightness and contrast. Download the grayscale image as JPG or PNG.',
        },
      ]}
      useCases={[
        {
          title: 'Photography and artistic projects',
          description:
            'Black and white photography has a timeless, dramatic quality. Convert colour photos to grayscale for a classic photographic aesthetic in portfolios, art prints, and photography projects.',
        },
        {
          title: 'Reducing file size before compression',
          description:
            'Grayscale images compress significantly better than colour images with the same content. Convert before compressing when colour is not needed — especially for document scans and text-heavy images.',
        },
        {
          title: 'Preparing images for printing in grayscale',
          description:
            'Printers set to grayscale mode handle pre-converted grayscale images better than auto-converting colour images. Convert before printing for more consistent and accurate grayscale print output.',
        },
        {
          title: 'UI and icon design in grayscale',
          description:
            'Grayscale testing is a standard UI/UX design technique — it reveals visual hierarchy and contrast problems that colour can mask. Convert screenshots or mockups to grayscale to evaluate design legibility.',
        },
        {
          title: 'Creating high-contrast masks',
          description:
            'Grayscale images are commonly used as masks and alpha channels in compositing workflows. Convert a colour selection to grayscale as a step in preparing image masks for further editing.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        {
          label: 'Grayscale modes',
          value: 'Luminance, average, high contrast, custom channel mix',
        },
        { label: 'Real-time preview', value: 'Yes' },
        { label: 'Before/after comparison', value: 'Yes — drag slider' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'What is the difference between the grayscale conversion modes?',
          a: 'Luminance mode uses the formula 0.299R + 0.587G + 0.114B, which weights green most heavily because the human eye is most sensitive to green light. This produces the most natural-looking black and white conversion. Average mode uses (R+G+B)/3, treating all channels equally. High contrast increases the difference between tones. Custom channel mix lets you set your own R/G/B weights — the classic red channel mix (0.7R, 0.2G, 0.1B) produces dramatic skies in landscape photos.',
        },
        {
          q: 'Why do different parts of the image have different brightness in grayscale?',
          a: 'Different colours convert to different brightness values in grayscale based on their luminance. A highly saturated red and green may look equally vivid in colour but convert to very different grey tones. This is used creatively by photographers — a red filter (equivalent to the red channel mix) makes blue skies appear very dark and dramatic.',
        },
        {
          q: 'Will the grayscale image have a smaller file size?',
          a: 'The pixels contain less colour information, but the saving in file size depends on the file format. JPG stores grayscale images more efficiently than colour because it needs fewer colour channels. PNG grayscale can be significantly smaller too. Compress with the Image Compressor after converting for maximum file size reduction.',
        },
        {
          q: 'Can I add a sepia or other tint to the grayscale image?',
          a: 'The Grayscale Converter converts to pure black and white. For a sepia effect, convert to grayscale first, then use the Image Enhancer to add a warm tint by adjusting the colour temperature slider toward warm. For a specific sepia colour, use the Image Colorizer tool after converting.',
        },
        {
          q: 'Can I convert multiple images to grayscale at once?',
          a: 'The current tool processes one image at a time. For batch grayscale conversion, process images individually, or use dedicated batch processing tools if you need to convert a large library.',
        },
        {
          q: 'Is the result different from desaturating in Photoshop?',
          a: "Photoshop desaturation uses the luminance method, equivalent to this tool's standard luminance mode. Photoshop's Black and White adjustment layer offers even more control with individual colour channel sliders — equivalent to this tool's custom channel mix mode.",
        },
      ]}
      relatedTools={[
        {
          name: 'Image Colorizer',
          href: '/tools/image-tools/image-colorizer',
          icon: '??',
          description: 'Add colour back to black and white photos',
        },
        {
          name: 'Image Enhancer',
          href: '/tools/image-tools/image-enhancer',
          icon: '?',
          description: 'Adjust brightness and contrast',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress grayscale images further',
        },
        {
          name: 'Add Border',
          href: '/tools/image-tools/add-border',
          icon: '???',
          description: 'Add a vintage border',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop for better composition',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert to PNG or WebP',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <GrayscaleClient />
    </ImageToolShell>
  );
}
