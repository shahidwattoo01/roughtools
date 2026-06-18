import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import RoundCornerClient from './RoundCornerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Round Corner Image — Add Rounded Corners to Images Free Online | Roughtools',
  description:
    'Add rounded corners to any image online for free. Control corner radius for a subtle curve or a full circle. Transparent PNG output. 100% browser-based — no upload required.',
  keywords: [
    'round corner image',
    'rounded corners image',
    'add rounded corners',
    'circle image maker',
    'round image online',
    'rounded photo edges',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/round-corner-image' },
  openGraph: {
    title: 'Round Corner Image — Free Online | Roughtools',
    description: 'Add rounded corners to images. Subtle curves to full circle. Transparent PNG.',
    url: 'https://roughtools.com/tools/image-tools/round-corner-image',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Round Corner Image | Roughtools',
    description: 'Add rounded corners to images online free. Circle or custom radius.',
  },
};

const _s = getImageToolSupplement('round-corner-image');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Round Corner Image"
      toolSlug="round-corner-image"
      icon="??"
      description="Add rounded corners to any image with full control over the corner radius. Set a small radius for a subtle modern card effect, increase it for a prominent rounded look, or go to maximum for a perfect circle — ideal for profile pictures and avatars. Output is a transparent PNG so the rounded corners appear correctly on any background colour. Runs entirely in your browser."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop a JPG, PNG, or WebP image. For circle output, use a square image — crop it first with the Image Cropper if needed.',
        },
        {
          name: 'Set the corner radius',
          text: 'Use the radius slider to control the roundness. 0 = sharp square corners. 50% of the shortest side = perfect circle (for square images). Try 20–40px for a modern card style.',
        },
        {
          name: 'Choose individual corners (optional)',
          text: 'By default all four corners are rounded equally. Disable the lock to set different radius values for each corner — top-left, top-right, bottom-right, bottom-left independently.',
        },
        {
          name: 'Preview',
          text: 'The rounded result is shown in real time against a transparent checkerboard background, showing exactly how the corners will appear.',
        },
        {
          name: 'Download as PNG',
          text: 'Download the result as a transparent PNG. The rounded corners are cut out as transparency — the image will display correctly on any background colour.',
        },
      ]}
      useCases={[
        {
          title: 'Profile pictures and avatars',
          description:
            'Most platforms display profile photos as circles. Create a perfect circular avatar from any square photo by setting the radius to 50%. Works for Twitter, Discord, Slack, and any platform that shows round profile images.',
        },
        {
          title: 'App UI screenshots and mockups',
          description:
            'Modern UI design uses rounded corners on cards, images, and components. Add consistent rounded corners to screenshots and product images to match contemporary design standards.',
        },
        {
          title: 'Social media graphics',
          description:
            'Rounded corner image cards look modern and polished in social media feeds. Apply a 20–30px radius to create a design that stands out from square-cornered images.',
        },
        {
          title: 'Blog and article thumbnails',
          description:
            'Round-cornered thumbnails have a softer, more approachable feel for blog posts and article cards. Apply consistent rounding across all thumbnails for a professional publication look.',
        },
        {
          title: 'App icons and store assets',
          description:
            'iOS app icons require a specific rounded-corner squircle shape. Use this tool to preview how app icon artwork looks with rounded corners before submitting to the App Store.',
        },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG, WebP' },
        { label: 'Output format', value: 'PNG (transparent corners)' },
        { label: 'Corner radius', value: 'Pixels or percentage (0 to 50%)' },
        { label: 'Individual corners', value: 'Yes — set each corner independently' },
        { label: 'Circle output', value: 'Yes — set radius to 50% on a square image' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Why is the output always a PNG and not JPG?',
          a: 'Rounded corners require transparency — the cut-off corner areas must be transparent so the underlying background colour shows through. JPG does not support transparency. PNG is the only widely supported format that handles alpha transparency correctly, so rounded corner output must be PNG.',
        },
        {
          q: 'How do I make a perfect circle from my photo?',
          a: 'First, crop your photo to a square using the Image Cropper tool. Then upload the square image here and set the corner radius to 50% (or the maximum value). A 50% radius on a square image produces a perfect circle. The circular image will have transparent corners when downloaded as PNG.',
        },
        {
          q: 'What radius should I use for a modern card look?',
          a: 'For a modern UI card style, 12–24px on images of 400–800px width is the typical range used in contemporary web design. For very large images (1000px+), use 20–40px. For very small icons (64–128px), 8–16px. Avoid very large radii on rectangular images as they create an oval shape rather than clean rounded corners.',
        },
        {
          q: 'Can I use a different radius for each corner?',
          a: 'Yes. Disable the "lock all corners" option and set each corner radius independently. This is useful for design elements where only some corners should be rounded — for example, a speech bubble shape with one sharp corner.',
        },
        {
          q: 'Will the rounded corner image look correct on a dark background?',
          a: 'Yes. Because the corners are transparent PNG, they adapt to whatever background they are placed on. The same image displays correctly on white, dark, or any coloured background — the corners are genuinely transparent, not filled with white.',
        },
        {
          q: 'Can I add rounded corners and a border at the same time?',
          a: 'Not directly in a single step. First add rounded corners with this tool to get a transparent PNG, then use the Add Border tool to add a border. Alternatively, use CSS border-radius in web development contexts — this is the most efficient approach when displaying images on a website.',
        },
      ]}
      relatedTools={[
        {
          name: 'Add Border',
          href: '/tools/image-tools/add-border',
          icon: '???',
          description: 'Add a decorative border or frame',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop to square before making circle',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress PNG to reduce file size',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to exact dimensions',
        },
        {
          name: 'Background Remover',
          href: '/tools/image-tools/background-remover',
          icon: '??',
          description: 'Remove background for transparent PNG',
        },
        {
          name: 'Passport Photo Maker',
          href: '/tools/image-tools/passport-photo-maker',
          icon: '??',
          description: 'Create compliant passport photos',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <RoundCornerClient />
    </ImageToolShell>
  );
}
