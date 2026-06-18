import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import GifMakerClient from './GifMakerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'GIF Maker — Create Animated GIFs from Images Free Online | Roughtools',
  description:
    'Create animated GIFs from multiple images online for free. Control frame delay, loop count, and output size. No software needed. 100% browser-based — files never uploaded.',
  keywords: [
    'gif maker',
    'create animated gif',
    'gif creator online',
    'images to gif',
    'make gif free',
    'animated gif maker',
    'gif generator',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/gif-maker' },
  openGraph: {
    title: 'GIF Maker — Free Online | Roughtools',
    description: 'Create animated GIFs from multiple images. Control speed and loop count. Free.',
    url: 'https://roughtools.com/tools/image-tools/gif-maker',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF Maker | Roughtools',
    description: 'Create animated GIFs from images online free. Control speed and loops.',
  },
};

const _s = getImageToolSupplement('gif-maker');

export default function Page() {
  return (
    <ImageToolShell
      toolName="GIF Maker"
      toolSlug="gif-maker"
      icon="???"
      description="Create animated GIFs by combining multiple images into a sequence. Upload 2–50 frames, set the delay between frames (controlling animation speed), choose loop count (infinite loop or specific number), and download the animated GIF. Perfect for product demos, social media reactions, tutorial steps, and creative animations. All processing runs entirely in your browser using client-side GIF encoding."
      howToSteps={[
        {
          name: 'Upload your frames',
          text: 'Click the upload area or drag and drop 2–50 JPG or PNG images. Each image becomes one frame of the GIF. Images are ordered by upload sequence — drag to rearrange.',
        },
        {
          name: 'Set frame delay',
          text: 'Enter the delay between frames in milliseconds. 100ms = 10 frames per second (smooth animation). 500ms = 2 frames per second (slideshow pace). 1000ms = 1 second per frame.',
        },
        {
          name: 'Choose loop settings',
          text: 'Select infinite loop (the GIF repeats forever) or set a specific number of loops (e.g. play 3 times then stop). Most social media platforms loop GIFs infinitely.',
        },
        {
          name: 'Set output size',
          text: 'Choose the output width. All frames are scaled to this width maintaining aspect ratio. Smaller GIFs (400–600px) have manageable file sizes; larger GIFs can become very large.',
        },
        {
          name: 'Create and download',
          text: 'Click Create GIF. The browser encodes the GIF client-side — this may take 10–30 seconds for large frame counts. Download the animated GIF and share anywhere.',
        },
      ]}
      useCases={[
        {
          title: 'Product demonstrations and how-to animations',
          description:
            'Show a product feature or process as a simple animated sequence. Screenshot each step, upload in order, and create a short GIF that explains more than a static image.',
        },
        {
          title: 'Social media reactions and expressions',
          description:
            'Create custom reaction GIFs from a sequence of photos or edited stills. Share via Giphy, Tenor, or directly in messaging apps and social platforms that support GIF upload.',
        },
        {
          title: 'Tutorial and documentation step sequences',
          description:
            'Technical documentation benefits from animated step sequences. Create a GIF showing a UI workflow, setup process, or configuration steps to embed in help articles.',
        },
        {
          title: 'Logo and brand animation',
          description:
            'Animate a logo reveal or brand mark transformation using a sequence of frames. Export as GIF for use in email signatures, websites, and messaging platforms that support GIF.',
        },
        {
          title: 'Art and creative animation projects',
          description:
            'Create simple frame-by-frame animations, flipbook-style sequences, and creative looping visuals. GIF supports up to 256 colours per frame for vivid animations.',
        },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG (per frame)' },
        { label: 'Max frames', value: '50 images per GIF' },
        { label: 'Frame delay control', value: 'Yes — per-frame or global delay (ms)' },
        { label: 'Loop options', value: 'Infinite or specific number of loops' },
        { label: 'Output format', value: 'GIF (animated)' },
        { label: 'Output size', value: 'Up to 1200px wide' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Why are GIF files so large compared to video?',
          a: 'GIF uses an old compression algorithm (LZW from 1987) that was designed before modern video codecs existed. It stores each frame as a complete image with up to 256 colours and LZW compression. Modern video formats (H.264, WebP animation, AVIF) compress sequences far more efficiently. A 5-second GIF at 600px width might be 5–15 MB, while equivalent video would be under 1 MB. For web use, consider WebP animation or MP4 video when file size matters.',
        },
        {
          q: 'Why does my GIF look washed out or have wrong colours?',
          a: 'GIF supports only 256 colours per frame — it uses a palette of 256 colours chosen to best represent the image. Photographs with millions of colours are dithered to 256, causing visible colour banding. GIF works best for images with flat colours and limited colour ranges — illustrations, logos, and simple graphics. For photographs, the colour reduction is very noticeable.',
        },
        {
          q: 'What frame delay should I use for smooth animation?',
          a: 'For smooth motion like loading spinners and continuous animations: 50–80ms (12–20fps). For standard animation like character movement: 80–120ms (8–12fps). For step-by-step demonstrations: 300–800ms per step. For slideshow-style transitions: 1000–3000ms per frame. Many social platforms have a minimum frame delay of 20ms regardless of what is set.',
        },
        {
          q: 'Is there a maximum file size for the output GIF?',
          a: 'The tool does not impose a file size limit, but be aware that many platforms cap GIF uploads: Twitter is 15 MB, Discord is 8 MB (free) or 50 MB (Nitro), email attachments are usually 10–20 MB. For large GIFs, reduce the output width or increase frame delay to fewer frames per second.',
        },
        {
          q: 'Can I extract frames from an existing GIF?',
          a: 'Currently the GIF Maker only creates GIFs from individual image files. To extract frames from an existing GIF for editing, use dedicated GIF editing software or a frame extraction tool, then upload the individual frames here.',
        },
        {
          q: 'Can I set different delays for different frames?',
          a: 'Yes — enable per-frame delay mode to set a custom delay for each individual frame. This is useful for holding on a key frame longer or speeding through transition frames. By default a global delay applies to all frames equally.',
        },
      ]}
      relatedTools={[
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert GIF to other formats',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress individual frames before GIF creation',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize frames to consistent dimensions',
        },
        {
          name: 'Image Cropper',
          href: '/tools/image-tools/image-cropper',
          icon: '??',
          description: 'Crop frames to consistent composition',
        },
        {
          name: 'Photo Collage Maker',
          href: '/tools/image-tools/photo-collage-maker',
          icon: '???',
          description: 'Combine images in a grid layout',
        },
        {
          name: 'Thumbnail Maker',
          href: '/tools/image-tools/thumbnail-maker',
          icon: '??',
          description: 'Create a thumbnail for your animation',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <GifMakerClient />
    </ImageToolShell>
  );
}
