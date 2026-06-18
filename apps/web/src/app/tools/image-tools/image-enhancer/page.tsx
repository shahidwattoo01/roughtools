import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import ImageEnhancerClient from './ImageEnhancerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Image Enhancer — Improve Brightness Contrast Sharpness Free Online | Roughtools',
  description:
    'Enhance images online for free. Adjust brightness, contrast, saturation, and sharpness with real-time preview. No software needed. 100% browser-based — files never uploaded.',
  keywords: [
    'image enhancer',
    'enhance image online',
    'improve image quality',
    'image brightness contrast',
    'sharpen image online',
    'photo enhancer free',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-enhancer' },
  openGraph: {
    title: 'Image Enhancer — Free Online | Roughtools',
    description: 'Adjust brightness, contrast, saturation and sharpness. Real-time preview. Free.',
    url: 'https://roughtools.com/tools/image-tools/image-enhancer',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Enhancer | Roughtools',
    description: 'Enhance image quality online free. Brightness, contrast, sharpness.',
  },
};

const _s = getImageToolSupplement('image-enhancer');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Enhancer"
      toolSlug="image-enhancer"
      icon="?"
      description="Improve photo and image quality with real-time adjustments to brightness, contrast, saturation, sharpness, and more. Fix underexposed photos, boost dull colours, sharpen soft focus, or apply a consistent visual style to a set of images. All adjustments are previewed live in the browser — no software installation needed, no files uploaded to any server."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The original is displayed immediately alongside the adjustment controls.',
        },
        {
          name: 'Adjust settings',
          text: 'Use the sliders to adjust brightness (make it lighter or darker), contrast (make tones more or less distinct), saturation (intensify or mute colours), and sharpness (crisp up soft detail).',
        },
        {
          name: 'Preview in real time',
          text: 'Changes are applied live to the preview image as you move the sliders. Toggle before/after view to compare the enhanced result against the original.',
        },
        {
          name: 'Apply and download',
          text: 'When you are satisfied with the adjustments, click Apply. Download the enhanced image in your preferred format.',
        },
      ]}
      useCases={[
        {
          title: 'Fixing underexposed or overexposed photos',
          description:
            'Increase brightness to rescue dark, underexposed shots. Reduce brightness and increase contrast to fix washed-out overexposed photos. The real-time preview helps you find the right balance.',
        },
        {
          title: 'Improving product photos',
          description:
            'E-commerce product photos need to look their best. Boost contrast to make the product pop, increase saturation for vibrant colour, and sharpen edges for a professional, detailed appearance.',
        },
        {
          title: 'Enhancing portrait photos',
          description:
            'Brighten skin tones, reduce harsh shadows, and sharpen eyes and hair. Subtle adjustments make a significant difference to portrait quality without requiring professional photo editing software.',
        },
        {
          title: 'Preparing images for social media',
          description:
            'Social platforms compress images, which can dull colours and reduce contrast. Pre-enhance images before uploading to compensate for platform compression and ensure they look vivid in the feed.',
        },
        {
          title: 'Old photo restoration',
          description:
            'Scanned old photos are often faded and low in contrast. Increase contrast, adjust brightness, and boost saturation to restore the visual punch of old photographs.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        {
          label: 'Adjustments',
          value: 'Brightness, contrast, saturation, sharpness, hue, temperature',
        },
        { label: 'Real-time preview', value: 'Yes — live rendering as sliders change' },
        { label: 'Before/after toggle', value: 'Yes' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Will enhancing an image reduce its quality?',
          a: 'The enhancements are applied to the original pixel data using the Canvas API. Brightness, contrast, and saturation adjustments are non-destructive in principle, but the final download is re-encoded, so some minimal quality change may occur — especially if saving as JPG. For lossless output, download as PNG.',
        },
        {
          q: 'What is the difference between brightness and contrast?',
          a: 'Brightness shifts all pixels lighter or darker uniformly — increasing brightness makes the whole image lighter, including highlights and shadows. Contrast changes the difference between light and dark areas — increasing contrast makes highlights brighter and shadows darker simultaneously, making the image look punchier and more vivid.',
        },
        {
          q: 'What does sharpness do?',
          a: 'Sharpness applies an unsharp mask or similar filter that enhances edge contrast — making transitions between different-coloured areas appear crisper and more defined. It does not add new detail that was not already in the image, but it makes existing detail more visible. Over-sharpening creates halos around edges.',
        },
        {
          q: 'What is colour temperature and how should I use it?',
          a: 'Colour temperature shifts the overall colour cast of an image toward warmer (orange/yellow) or cooler (blue) tones. Use it to correct photos taken in artificial light (which have a warm orange cast) or overcast conditions (cool blue cast). A slight warm shift makes portraits more flattering; a cool shift gives landscape photos a dramatic feel.',
        },
        {
          q: 'Can I reset to the original image?',
          a: 'Yes. Click the Reset button to return all sliders to their default (neutral) positions and restore the original image. You can then start adjusting from scratch.',
        },
        {
          q: 'Can I apply the same enhancements to multiple images?',
          a: 'The current enhancer processes one image at a time. Record the slider values you use for a good result, then apply the same values to each image in your batch. For truly consistent batch processing, professional tools like Lightroom or RawTherapee offer batch preset application.',
        },
      ]}
      relatedTools={[
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress enhanced image before sharing',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize after enhancing',
        },
        {
          name: 'Grayscale Converter',
          href: '/tools/image-tools/grayscale-converter',
          icon: '?',
          description: 'Convert to black and white',
        },
        {
          name: 'Image Colorizer',
          href: '/tools/image-tools/image-colorizer',
          icon: '??',
          description: 'Colorize black and white photos',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop before enhancing',
        },
        {
          name: 'Blur Background',
          href: '/tools/image-tools/blur-background',
          icon: '???',
          description: 'Blur background for portrait depth',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <ImageEnhancerClient />
    </ImageToolShell>
  );
}
