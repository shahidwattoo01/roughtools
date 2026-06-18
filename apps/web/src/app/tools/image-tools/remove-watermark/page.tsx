import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import RemoveWatermarkClient from './RemoveWatermarkClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Remove Watermark — Remove Your Own Watermarks from Images Free Online | Roughtools',
  description:
    'Remove watermarks from your own images online for free. Paint over the watermark area and let the inpainting tool fill it seamlessly. 100% browser-based, no upload.',
  keywords: [
    'remove watermark',
    'watermark remover',
    'remove text from image',
    'image inpainting',
    'erase watermark',
    'photo watermark remover',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/remove-watermark' },
  openGraph: {
    title: 'Remove Watermark — Free Online | Roughtools',
    description: 'Remove watermarks from your own images. Paint to select and fill seamlessly.',
    url: 'https://roughtools.com/tools/image-tools/remove-watermark',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove Watermark | Roughtools',
    description: 'Remove watermarks from your own photos online free.',
  },
};

const _s = getImageToolSupplement('remove-watermark');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Remove Watermark"
      toolSlug="remove-watermark"
      icon="???"
      description="Remove watermarks, text overlays, logos, timestamps, and other unwanted elements from your own images using inpainting. Paint over the area you want to remove and the tool fills it with plausible image content reconstructed from the surrounding pixels. Intended for use on images you own the rights to — such as removing a Roughtools watermark, a trial software watermark, or a date stamp from your own camera."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop the JPG or PNG image containing the watermark or element you want to remove.',
        },
        {
          name: 'Paint over the watermark',
          text: 'Use the brush tool to paint a mask over the watermark or text area you want to remove. Cover the entire element including any feathered edges.',
        },
        {
          name: 'Adjust brush size',
          text: 'Use a small brush for precise areas and a large brush for larger watermarks. The mask is shown as a red overlay so you can see exactly what you have covered.',
        },
        {
          name: 'Remove',
          text: 'Click the Remove button. The tool analyses the surrounding image content and fills the masked area with plausible reconstructed pixels.',
        },
        {
          name: 'Download',
          text: 'Download the result. For complex backgrounds, some manual touch-up may be needed using the clone stamp tool in a photo editor.',
        },
      ]}
      useCases={[
        {
          title: 'Removing your own trial software watermarks',
          description:
            'If you used a trial version of a tool that added a watermark, after purchasing the full licence, use this tool to clean the watermark from images created during the trial period.',
        },
        {
          title: 'Removing date/time stamps from camera photos',
          description:
            'Some cameras print the date and time onto photos (in-camera date stamp feature). Remove these stamps from your own photos when you want a clean version for sharing or printing.',
        },
        {
          title: 'Cleaning up scanned documents and photos',
          description:
            'Scanned images sometimes have stamps, stickers, annotations, or text overlaid on them. Remove these to get a clean scan of the underlying image.',
        },
        {
          title: 'Removing your own logo before repurposing',
          description:
            'If you have a set of images with your company logo and you are rebranding or creating a version for a different platform, remove your own watermark before applying a new one.',
        },
        {
          title: 'Cleaning stock images you have purchased',
          description:
            'After purchasing a stock image, the licence gives you the right to use it without the watermark. If you only have access to the watermarked preview, wait until you download the licensed file — using the licensed download is always better than attempting removal.',
        },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG' },
        { label: 'Removal method', value: 'Content-aware inpainting' },
        { label: 'Brush size', value: 'Adjustable' },
        { label: 'Max file size', value: '10 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None added' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Can I use this to remove watermarks from images I do not own?',
          a: 'No. Removing watermarks from copyrighted images you do not have the rights to is illegal in most jurisdictions under copyright law (including the DMCA in the US and equivalent laws globally). This tool is intended only for use on images you have created, purchased, or otherwise have explicit permission to modify. Using it to remove copyright notices from others work is a violation of copyright law.',
        },
        {
          q: 'How well does the watermark removal work?',
          a: 'The quality of removal depends on the background under the watermark. Simple, uniform backgrounds (sky, grass, white walls) produce excellent results. Complex textures or detailed backgrounds produce less convincing results because the algorithm must reconstruct detail that was obscured. Simple text watermarks on plain backgrounds typically disappear cleanly.',
        },
        {
          q: 'What happens if the watermark is very large?',
          a: 'Large watermarks cover significant areas and require the algorithm to reconstruct large amounts of image content — this produces more noticeable artefacts. For very large watermarks, the result may require additional touch-up in image editing software (GIMP, Photoshop) using the clone stamp or healing brush.',
        },
        {
          q: 'Can I remove a tiled watermark that covers the whole image?',
          a: 'Full-image tiled watermarks are very difficult to remove automatically because the algorithm cannot reliably determine what is watermark and what is original image. Results will be poor — this is by design, as tiled watermarks are intentionally hard to remove.',
        },
        {
          q: 'Will the tool work on semi-transparent watermarks?',
          a: 'Semi-transparent watermarks (like a 30% opacity text overlay) are harder to remove because the original image is visible through the watermark. The algorithm must separate the watermark from the underlying image, which produces variable results depending on the watermark colour and background content.',
        },
        {
          q: 'Are there any legal restrictions on using this tool?',
          a: 'Yes. Only use this tool on images where you have the legal right to remove watermarks. This includes images you created, stock images you have purchased a licence for, or images explicitly released under a licence that permits modification. Removing watermarks from copyrighted images without permission is copyright infringement.',
        },
      ]}
      relatedTools={[
        {
          name: 'Add Watermark',
          href: '/tools/image-tools/add-watermark',
          icon: '??',
          description: 'Add watermarks to protect your images',
        },
        {
          name: 'Image Enhancer',
          href: '/tools/image-tools/image-enhancer',
          icon: '?',
          description: 'Improve image after watermark removal',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress the cleaned image',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop away edge watermarks',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize after cleaning',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert to your preferred format',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <RemoveWatermarkClient />
    </ImageToolShell>
  );
}
