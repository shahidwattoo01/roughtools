import type { Metadata } from 'next'
import ImageToolShell from '@/components/image-tools/ImageToolShell'
import ThumbnailMakerClient from './ThumbnailMakerClient'
import { getImageToolSupplement } from '@/data/imageTools'

export const metadata: Metadata = {
  title: 'Thumbnail Maker — Create YouTube and Social Media Thumbnails Free | Roughtools',
  description: 'Create eye-catching YouTube thumbnails and social media thumbnails free online. Add text, overlays, and borders. 1280×720 output. 100% browser-based — no upload required.',
  keywords: ['thumbnail maker', 'youtube thumbnail maker', 'thumbnail creator', 'create youtube thumbnail', 'social media thumbnail', 'thumbnail generator free'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/thumbnail-maker' },
  openGraph: {
    title: 'Thumbnail Maker — Free Online | Roughtools',
    description: 'Create YouTube and social media thumbnails with text and overlays. Free, instant.',
    url: 'https://roughtools.com/tools/image-tools/thumbnail-maker',
    type: 'website', siteName: 'Roughtools',
  },
  twitter: { card: 'summary_large_image', title: 'Thumbnail Maker | Roughtools', description: 'Create YouTube thumbnails free online. Text, overlays, instant download.' },
}


const _s = getImageToolSupplement('thumbnail-maker')

export default function Page() {
  return (
    <ImageToolShell
      toolName="Thumbnail Maker"
      toolSlug="thumbnail-maker"
      icon="??"
      description="Create professional YouTube thumbnails and social media preview images that drive clicks. Upload a background image, add bold title text with customisable font and colour, apply an overlay for contrast, add borders or badges, and download at the exact dimensions required by each platform. YouTube thumbnails output at 1280×720 pixels. All creation happens in your browser."
      howToSteps={[
        { name: 'Upload a background image', text: 'Upload a JPG or PNG image to use as your thumbnail background. This could be a screenshot from your video, a product photo, or any compelling image.' },
        { name: 'Add title text', text: 'Type your thumbnail title text. Large, bold text that is readable at thumbnail size is the key to high click-through rates. Choose font, colour, and shadow for maximum contrast.' },
        { name: 'Apply an overlay', text: 'Add a semi-transparent dark or coloured overlay to make the text pop against any background image. Adjust opacity for the right balance between image and overlay.' },
        { name: 'Add badges or highlights', text: 'Optional: add a coloured banner, number badge (for list videos), or highlight box around key text to draw the eye to the most important part of the thumbnail.' },
        { name: 'Download', text: 'Download at 1280×720 pixels (YouTube standard) or the correct dimensions for other platforms. The thumbnail is ready to upload directly.' },
      ]}
      useCases={[
        { title: 'YouTube video thumbnails', description: 'YouTube thumbnails are the single most impactful element for video click-through rate. A compelling, readable thumbnail with bold text and a clear subject can double or triple your video views from search and suggested video placement.' },
        { title: 'Podcast episode art', description: 'Podcast platforms display episode art alongside titles. Create episode-specific thumbnails with the episode number, guest name, and key topic for professional podcast presentation.' },
        { title: 'Online course and tutorial thumbnails', description: 'Udemy, Teachable, and course platforms use thumbnails for course listings. Create professional course thumbnails that communicate the topic clearly and build credibility with potential students.' },
        { title: 'Blog post feature images', description: 'Blog posts shared on social media display a feature image. Create compelling 16:9 feature images with the article title overlaid for higher click-through on LinkedIn, Twitter, and Facebook.' },
        { title: 'Social media video previews', description: 'Instagram Reels, TikTok, and Facebook videos all use a cover frame as the preview. Design a compelling cover image that represents your content at its best.' },
      ]}
      specs={[
        { label: 'Output dimensions', value: '1280×720 (YouTube), custom for other platforms' },
        { label: 'Background support', value: 'Uploaded image or solid colour' },
        { label: 'Text layers', value: 'Multiple text boxes, fonts, colours, shadows' },
        { label: 'Overlay', value: 'Yes — semi-transparent colour overlay' },
        { label: 'Output format', value: 'JPG (YouTube recommended) or PNG' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Watermark', value: 'None' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        { q: 'What size should a YouTube thumbnail be?', a: 'YouTube recommends 1280×720 pixels (16:9 aspect ratio) at a maximum file size of 2 MB. JPG format is preferred. The minimum size is 640×360 pixels, but higher resolution thumbnails look sharper on HD monitors and TVs. This tool outputs at the recommended 1280×720 resolution.' },
        { q: 'What makes a good YouTube thumbnail?', a: 'The most effective YouTube thumbnails share these characteristics: (1) bold, large text readable at small sizes — 48pt+ is usually needed; (2) a clear, expressive face or subject that creates an emotional hook; (3) high contrast between text and background; (4) bright colours that stand out against YouTube\'s white interface; (5) visual curiosity — the thumbnail should make viewers wonder about the content.' },
        { q: 'How many characters of text should a thumbnail have?', a: 'Less is more. Thumbnails are displayed at 246×138 pixels in YouTube search results — about 4×2 inches on a typical screen. Aim for 3–5 words maximum. Shorter, punchier text is more readable and creates more intrigue. Very long thumbnail text cannot be read at small sizes and looks cluttered.' },
        { q: 'Can I create thumbnails for platforms other than YouTube?', a: 'Yes. Use the custom dimensions option to set the exact width and height for any platform: Instagram Reels cover (1080×1920), Facebook video thumbnail (1280×720), Twitter card (1200×675), LinkedIn post image (1200×627), and others. Presets for common platforms are included.' },
        { q: 'What font works best for YouTube thumbnails?', a: 'Bold, condensed fonts read best at small sizes. Popular choices include Impact, Bebas Neue, Oswald Bold, Montserrat ExtraBold, and Anton. Avoid thin or light-weight fonts — they disappear at thumbnail scale. Always add a text shadow or outline to ensure readability against any background.' },
        { q: 'How do I make text readable against a bright background image?', a: 'There are three reliable techniques: (1) add a semi-transparent dark overlay at 30–50% opacity behind the text area; (2) add a solid coloured background band (often yellow, red, or your brand colour) behind the text; (3) apply a strong text shadow or thick outline in the opposite colour. The overlay technique is the most versatile for any background image.' },
      ]}
      relatedTools={[
        { name: 'Image Resizer', href: '/tools/image-tools/image-resizer', icon: '??', description: 'Resize to exact platform dimensions' },
        { name: 'Image Compressor', href: '/tools/image-tools/image-compressor', icon: '???', description: 'Compress thumbnail under 2MB limit' },
        { name: 'Image Cropper', href: '/tools/image-tools/image-cropper', icon: '??', description: 'Crop background to 16:9' },
        { name: 'Image Enhancer', href: '/tools/image-tools/image-enhancer', icon: '?', description: 'Improve background image quality' },
        { name: 'Add Watermark', href: '/tools/image-tools/add-watermark', icon: '??', description: 'Add your channel logo watermark' },
        { name: 'Meme Generator', href: '/tools/image-tools/meme-generator', icon: '??', description: 'Add meme-style text to images' },
      ]}      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips, ratingValue: _s.ratingValue, reviewCount: _s.reviewCount } : {})}
    >
      <ThumbnailMakerClient />
    </ImageToolShell>
  )
}
