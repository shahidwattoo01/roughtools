import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import AddBorderClient from './AddBorderClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Add Border to Image — Add Photo Borders and Frames Free Online | Roughtools',
  description:
    'Add decorative borders and frames to photos online for free. Choose colour, width, style, and corner radius. Polaroid, vintage, and custom borders. 100% browser-based.',
  keywords: [
    'add border to image',
    'photo border maker',
    'image border online',
    'add frame to photo',
    'polaroid border',
    'picture frame online free',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/add-border' },
  openGraph: {
    title: 'Add Border to Image — Free Online | Roughtools',
    description: 'Add photo borders and frames. Polaroid, vintage, custom colour and width. Free.',
    url: 'https://roughtools.com/tools/image-tools/add-border',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Border to Image | Roughtools',
    description: 'Add decorative borders and frames to photos online free.',
  },
};

const _s = getImageToolSupplement('add-border');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Add Border to Image"
      toolSlug="add-border"
      icon="???"
      description="Add decorative borders and frames to any photo or image. Choose from solid colour borders, gradient frames, polaroid-style white borders, or vintage film borders. Control the border width, colour, and corner radius for rounded frame effects. Preview in real time and download with or without a drop shadow. All processing runs in your browser."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. The image is shown in the preview editor immediately.',
        },
        {
          name: 'Choose a border style',
          text: 'Select from: Solid border (choose colour and width), Polaroid (wide white bottom border for caption space), Vintage film border, or Custom (set all parameters manually).',
        },
        {
          name: 'Set border width and colour',
          text: 'Use the slider to set the border thickness in pixels or as a percentage of image size. Click the colour picker to choose the border colour — white, black, or any custom colour.',
        },
        {
          name: 'Adjust corner radius',
          text: 'Slide the corner radius control to add rounded corners to the border. 0 = sharp square corners, 20+ = softly rounded frame.',
        },
        {
          name: 'Download',
          text: 'Click Download to save the image with border. The output dimensions increase by the border width on all sides.',
        },
      ]}
      useCases={[
        {
          title: 'Polaroid and vintage photo aesthetics',
          description:
            'The polaroid border style adds a wide white bottom border, recreating the iconic look of Polaroid instant photographs. Use for retro-style social media posts, photo books, and wall art.',
        },
        {
          title: 'Social media framing',
          description:
            'A consistent white border around photos creates a clean, editorial look in Instagram feeds. The border also creates padding that prevents feed images from bleeding into the background.',
        },
        {
          title: 'Photo album and scrapbook preparation',
          description:
            'Add borders to photos before inserting them into digital photo albums or scrapbook layouts. A consistent border width creates visual unity across a collection of photos.',
        },
        {
          title: 'Presentation slides and documents',
          description:
            'A simple black or coloured border around an image adds structure and visual weight to photos in presentations, reports, and documents.',
        },
        {
          title: 'Art print and canvas preparation',
          description:
            'Adding a white or off-white mat border around artwork or photography creates a gallery-ready presentation. The border simulates the mat border used in professional photo framing.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP' },
        { label: 'Border styles', value: 'Solid, Polaroid, vintage film, gradient, custom' },
        { label: 'Border width', value: 'Pixels or percentage of image size' },
        { label: 'Border colour', value: 'Any colour via colour picker' },
        { label: 'Corner radius', value: 'Yes — adjustable rounded corners' },
        { label: 'Drop shadow', value: 'Optional' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Will adding a border change the image dimensions?',
          a: 'Yes. The border is added outside the original image area, increasing the total dimensions. A 100-pixel border on a 1000×1000 image produces a 1200×1200 output. The original image content is not cropped or resized.',
        },
        {
          q: 'What border width should I use for Instagram?',
          a: 'For a clean gallery border look on Instagram, 40–60 pixels on a 1080×1080 image (roughly 4–6%) creates a visible but not overwhelming border. The output dimension of 1160–1200 pixels will be scaled by Instagram to fit their display. For a polaroid look, use 60px sides and 120px bottom for the wider base.',
        },
        {
          q: 'Can I add a border to a transparent PNG without filling the transparency?',
          a: 'Yes. When the input is a transparent PNG and the output format is PNG, the border is added outside the transparent content while preserving the alpha channel of the original image inside the border. If you want the border to be visible over any background, use a solid colour border that adds actual border pixels rather than modifying the canvas.',
        },
        {
          q: 'What is the Polaroid border style?',
          a: 'The Polaroid style adds a white border with a wider bottom section — typically 5% on the top and sides and 15–20% on the bottom. This mimics the iconic appearance of Polaroid instant photo prints and creates space for a handwritten caption at the bottom.',
        },
        {
          q: 'Can I add a border to multiple images at once?',
          a: 'Currently the tool processes one image at a time. For batch border addition, contact us about batch features, or use the tool individually for each image you want to frame.',
        },
        {
          q: 'What colour should I use for a professional photo border?',
          a: 'White (#FFFFFF) is the most universally used border colour for photos — it reads as a mat border and works with all image types. Black (#000000) creates a dramatic, moody feel. Off-white (#F5F1EB) gives a slightly warm, aged paper look. Avoid bright or saturated colours that compete with the photo content.',
        },
      ]}
      relatedTools={[
        {
          name: 'Round Corner Image',
          href: '/tools/image-tools/round-corner-image',
          icon: '??',
          description: 'Add rounded corners to images',
        },
        {
          name: 'Image Enhancer',
          href: '/tools/image-tools/image-enhancer',
          icon: '?',
          description: 'Improve photo quality before framing',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress after adding border',
        },
        {
          name: 'Add Watermark',
          href: '/tools/image-tools/add-watermark',
          icon: '??',
          description: 'Add your name or logo',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop to the right composition first',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize before adding border',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <AddBorderClient />
    </ImageToolShell>
  );
}
