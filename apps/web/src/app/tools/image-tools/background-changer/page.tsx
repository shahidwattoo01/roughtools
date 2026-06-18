import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import BackgroundChangerClient from './BackgroundChangerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Background Changer — Replace Image Background Free Online | Roughtools',
  description:
    'Replace image backgrounds with a solid colour, gradient, or custom image online for free. Works with transparent PNGs. 100% browser-based — files never uploaded.',
  keywords: [
    'background changer',
    'change image background',
    'replace background',
    'background replacer',
    'photo background changer',
    'change photo background',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/background-changer' },
  openGraph: {
    title: 'Background Changer — Free Online | Roughtools',
    description: 'Replace image backgrounds with any colour or image. Free, browser-based.',
    url: 'https://roughtools.com/tools/image-tools/background-changer',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Background Changer | Roughtools',
    description: 'Change image backgrounds online free. Colour, gradient, or custom image.',
  },
};

const _s = getImageToolSupplement('background-changer');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Background Changer"
      toolSlug="background-changer"
      icon="??"
      description="Replace the background of any image with a solid colour, gradient, or a completely different background photo. Works best with transparent PNGs (use the Background Remover first to cut out your subject), or upload any image and paint on the areas you want to replace. Perfect for product photography, social media content, and creative compositing. All processing stays in your browser."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Upload a PNG with a transparent background (from the Background Remover) or any JPG/PNG image. Transparent PNGs give the cleanest results.',
        },
        {
          name: 'Choose a new background',
          text: 'Select a solid colour using the colour picker, choose a gradient preset, or upload a custom background photo. The background is applied behind your subject.',
        },
        {
          name: 'Position and scale (for photo backgrounds)',
          text: 'If using a photo background, drag to reposition it and use the scale slider to adjust the zoom level so the background fills the frame correctly.',
        },
        {
          name: 'Fine-tune edges',
          text: 'Use the feather slider to soften the edge between subject and new background for a more natural composite. Increase feather for hair or fur edges.',
        },
        {
          name: 'Download',
          text: 'Download the result as a JPG (for solid/photo backgrounds) or PNG (to keep a modified transparent layer).',
        },
      ]}
      useCases={[
        {
          title: 'Product photography backgrounds',
          description:
            'E-commerce photos on white look professional, but coloured or contextual backgrounds can increase conversion rates on social media. Quickly test different backgrounds for the same product photo.',
        },
        {
          title: 'Professional headshot backgrounds',
          description:
            'Replace a messy home background with a clean solid colour, a blurred office setting, or a professional gradient for LinkedIn and CV profile photos.',
        },
        {
          title: 'Social media content creation',
          description:
            'Change the background of photos to match your brand colours, seasonal themes, or campaign aesthetics without reshooting. Create consistent visual content at scale.',
        },
        {
          title: 'Real estate virtual staging',
          description:
            'Place product photos or furniture images on realistic room backgrounds to create virtual staging images. Cut out the product, then composite it onto a background photo.',
        },
        {
          title: 'Creative photo compositing',
          description:
            'Place a portrait against a dramatic landscape, a fantasy scene, or an abstract art background for creative photography and digital art projects.',
        },
      ]}
      specs={[
        { label: 'Input formats', value: 'JPG, PNG (with or without transparency)' },
        { label: 'Background types', value: 'Solid colour, gradient, or custom photo' },
        { label: 'Edge softening', value: 'Yes — feather slider' },
        { label: 'Output formats', value: 'JPG, PNG' },
        { label: 'Max file size', value: '20 MB per image' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'Do I need to remove the background first?',
          a: 'For the cleanest results, yes — use the Background Remover to create a transparent PNG, then bring that into the Background Changer. However, you can also upload a JPG and use the manual paint tools to mark which areas should be treated as background and replaced.',
        },
        {
          q: 'Can I use my own photo as the new background?',
          a: 'Yes. Upload any JPG or PNG as a custom background. You can reposition and scale it within the frame to get the composition you want. The tool then composites your subject over the background photo.',
        },
        {
          q: 'How do I get a natural-looking composite?',
          a: 'The most important factors are: (1) match the lighting direction and colour temperature between subject and background, (2) use the feather slider to soften the subject edge, especially around hair and clothing, (3) add a subtle shadow at the base of the subject if the background has a ground plane. Complex compositing with mismatched lighting will still look artificial without manual retouching.',
        },
        {
          q: 'What background colour should I use for a professional headshot?',
          a: 'Light grey (#E8E8E8 to #D0D0D0) is the most commonly used professional headshot background — it reads as neutral, works on any website background colour, and does not clash with clothing. Pure white can look overexposed. Dark navy or charcoal (#1A2744) is popular for a modern, high-contrast look on LinkedIn.',
        },
        {
          q: 'Can I use a gradient background?',
          a: 'Yes. The tool includes gradient presets including horizontal, vertical, and radial gradients. Choose two colours and the gradient direction, and the background is generated automatically. Gradients are popular for social media content and product photography.',
        },
        {
          q: 'Will the tool work without removing the background first?',
          a: 'You can use the tool on any image. Without pre-removed background, you will need to manually paint the areas you want to replace. This is less precise than working from a transparent PNG but can work for simple images with clear colour contrast between subject and background.',
        },
      ]}
      relatedTools={[
        {
          name: 'Background Remover',
          href: '/tools/image-tools/background-remover',
          icon: '??',
          description: 'Remove background to create transparent PNG',
        },
        {
          name: 'White Background Maker',
          href: '/tools/image-tools/white-background-maker',
          icon: '?',
          description: 'Add white background to transparent PNG',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Compress result before uploading',
        },
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to platform requirements',
        },
        {
          name: 'Blur Background',
          href: '/tools/image-tools/blur-background',
          icon: '???',
          description: 'Blur background for portrait effect',
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
      <BackgroundChangerClient />
    </ImageToolShell>
  );
}
