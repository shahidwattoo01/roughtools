import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import BulkImageResizerClient from './BulkImageResizerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Bulk Image Resizer — Resize Multiple Images at Once Free Online | Roughtools',
  description:
    'Resize multiple images at once online for free. Set one target size and apply it to an entire batch. Download all resized images in one click. No uploads, 100% browser-based.',
  keywords: [
    'bulk image resizer',
    'resize multiple images',
    'batch image resizer',
    'resize images in bulk',
    'batch resize photos',
    'mass image resize',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/bulk-image-resizer' },
  openGraph: {
    title: 'Bulk Image Resizer — Free Online | Roughtools',
    description: 'Resize multiple images to the same size at once. Free, no upload, download all.',
    url: 'https://roughtools.com/tools/image-tools/bulk-image-resizer',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Image Resizer | Roughtools',
    description: 'Resize multiple images at once. Free, no signup.',
  },
};

const _s = getImageToolSupplement('bulk-image-resizer');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Bulk Image Resizer"
      toolSlug="bulk-image-resizer"
      icon="??"
      description="Resize dozens of images to the same dimensions in a single operation. Upload a batch of JPG, PNG, or WebP images, set your target width and height (or percentage scale), and download all the resized files at once. Ideal for preparing image libraries for websites, apps, and social media. Everything runs in your browser — no files are ever uploaded."
      howToSteps={[
        {
          name: 'Upload your images',
          text: 'Click the upload area or drag and drop multiple JPG, PNG, or WebP files. You can add them all at once — there is no per-batch limit beyond your browser memory.',
        },
        {
          name: 'Set target dimensions',
          text: 'Enter the target width and height in pixels, or choose a percentage scale. Enable aspect ratio lock to resize proportionally without distorting any image.',
        },
        {
          name: 'Choose output format',
          text: 'Select JPG, PNG, or WebP as the output format. All images in the batch will be converted to this format. Adjust JPG/WebP quality if needed.',
        },
        {
          name: 'Resize all images',
          text: 'Click the Resize All button. Each image is processed independently in the browser — the progress bar shows completion across the batch.',
        },
        {
          name: 'Download',
          text: 'Download each resized image individually, or click Download All to get every file packaged together in a zip archive.',
        },
      ]}
      useCases={[
        {
          title: 'Website image libraries',
          description:
            'Websites need images at specific display dimensions. Resize an entire product catalogue, blog header set, or gallery to the exact pixel width in one operation.',
        },
        {
          title: 'Social media content batches',
          description:
            'Creating a week of Instagram posts or Twitter cards? Upload all your source images and resize the batch to the platform-standard dimensions simultaneously.',
        },
        {
          title: 'App asset preparation',
          description:
            'Mobile and web apps use the same icon or image asset at multiple resolutions. Resize a batch of originals to all the required sizes and download them together.',
        },
        {
          title: 'E-commerce product photos',
          description:
            'Marketplaces require all product images to be the same dimensions. Upload your entire product photo library and standardise sizes in seconds.',
        },
        {
          title: 'Email newsletter images',
          description:
            'Email templates have strict width constraints (usually 600px). Bulk resize all images for an email campaign to the correct width before building the newsletter.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Batch size', value: 'Unlimited (browser memory permitting)' },
        { label: 'Resize modes', value: 'Pixels or percentage' },
        { label: 'Aspect ratio lock', value: 'Yes' },
        { label: 'Output format', value: 'JPG, PNG, or WebP (user choice for whole batch)' },
        { label: 'Bulk download', value: 'Yes — ZIP archive of all resized files' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'How many images can I resize at once?',
          a: 'There is no hard limit on batch size — you can add as many images as your browser memory allows. For most computers, batches of 50–100 images process smoothly. For very large batches (200+), process in groups to avoid browser slowdown and potential out-of-memory errors.',
        },
        {
          q: 'Will all images be resized to exactly the same dimensions?',
          a: 'Yes. All images receive the same target width and height. If aspect ratio lock is enabled, each image is scaled proportionally to fit within the target dimensions without cropping — so some images may not hit exactly the target height if their aspect ratio differs. Turn off aspect ratio lock to force all images to exactly the specified width × height, which may stretch some images.',
        },
        {
          q: 'Can I use different sizes for different images in the same batch?',
          a: 'No — the bulk resizer applies one target size to all images. If you need different sizes for different images, process each separately with the standard Image Resizer tool, or split your batch into groups by size and process each group.',
        },
        {
          q: 'What output format should I use for my batch?',
          a: 'For photographs and general content, JPG gives the smallest file sizes. For images that require transparency or lossless quality, use PNG. For web assets, WebP gives the best combination of quality and compression. All images in the batch are converted to the same format you select.',
        },
        {
          q: 'Can I change the file name pattern for the output files?',
          a: 'Output files are named with the original filename plus a "-resized" suffix and the new extension. This keeps your original filenames recognisable while making it clear which files have been processed.',
        },
        {
          q: 'Is bulk resizing slower than resizing one image at a time?',
          a: 'Each image takes roughly the same time regardless of whether it is in a batch. The browser processes images sequentially, so a batch of 20 images takes approximately 20 times as long as a single image. Most images process in under a second, so a batch of 20 completes in about 5–10 seconds.',
        },
      ]}
      relatedTools={[
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize a single image with more control',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress images after resizing',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert batch to WebP or another format',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop to a specific ratio or area',
        },
        {
          name: 'Thumbnail Maker',
          href: '/tools/image-tools/thumbnail-maker',
          icon: '??',
          description: 'Create thumbnails for YouTube and social',
        },
        {
          name: 'DPI Converter',
          href: '/tools/image-tools/dpi-converter',
          icon: '???',
          description: 'Change image DPI for print',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <BulkImageResizerClient />
    </ImageToolShell>
  );
}
