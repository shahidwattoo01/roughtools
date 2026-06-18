import type { Metadata } from 'next';
import ImageToolShell from '@/components/image-tools/ImageToolShell';
import ImageSizeCheckerClient from './ImageSizeCheckerClient';
import { getImageToolSupplement } from '@/data/imageTools';

export const metadata: Metadata = {
  title: 'Image Size Checker — Check Image Dimensions and File Size Free Online | Roughtools',
  description:
    'Check image dimensions (width × height in pixels), file size, format, DPI, and colour mode instantly online for free. Upload any image and get all technical details. Browser-based.',
  keywords: [
    'image size checker',
    'check image dimensions',
    'image file size checker',
    'image resolution checker',
    'photo size checker',
    'image info tool',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://roughtools.com/tools/image-tools/image-size-checker' },
  openGraph: {
    title: 'Image Size Checker — Free Online | Roughtools',
    description:
      'Check image dimensions, file size, format, and DPI instantly. Free, browser-based.',
    url: 'https://roughtools.com/tools/image-tools/image-size-checker',
    type: 'website',
    siteName: 'Roughtools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Size Checker | Roughtools',
    description: 'Check image dimensions, file size and technical info online free.',
  },
};

const _s = getImageToolSupplement('image-size-checker');

export default function Page() {
  return (
    <ImageToolShell
      toolName="Image Size Checker"
      toolSlug="image-size-checker"
      icon="??"
      description="Instantly check the full technical specification of any image file — pixel dimensions (width × height), file size in KB/MB, file format, DPI/PPI setting, colour mode (RGB/CMYK/Grayscale), bit depth, and aspect ratio. Useful for verifying images before uploading to platforms with specific requirements, checking print readiness, or diagnosing why an image looks wrong. No files are uploaded — all information is read locally in your browser."
      howToSteps={[
        {
          name: 'Upload your image',
          text: 'Click the upload area or drag and drop any image file — JPG, PNG, WebP, GIF, TIFF, or HEIC. You can also drop multiple images to compare their specifications side by side.',
        },
        {
          name: 'View all specifications',
          text: 'All technical details are displayed immediately: pixel dimensions, file size, format, DPI, colour mode, bit depth, aspect ratio, and megapixel count.',
        },
        {
          name: 'Check platform requirements',
          text: 'Compare the image specifications against the common platform requirements shown below the results. Green indicators show where the image meets requirements; red shows where it falls short.',
        },
        {
          name: 'Take action',
          text: 'If the image does not meet requirements, use the recommended tools to resize, compress, or convert it. Buttons link directly to the relevant tool with context pre-filled where possible.',
        },
      ]}
      useCases={[
        {
          title: 'Platform upload requirement verification',
          description:
            'Before uploading to Amazon, Etsy, LinkedIn, or any platform with specific image requirements, check whether your image meets the minimum pixel dimensions, maximum file size, and format requirements.',
        },
        {
          title: 'Print readiness check',
          description:
            'Verify that an image has sufficient pixels and the correct DPI setting before sending to a printer. Check whether a 300 DPI image is large enough for the required print size.',
        },
        {
          title: 'Diagnosing display quality issues',
          description:
            'If an image looks blurry or pixelated on screen, check its actual pixel dimensions versus the display size. An image displayed at a larger size than its pixel count causes blurriness.',
        },
        {
          title: 'File size optimisation planning',
          description:
            'Check the current file size before deciding whether to compress or resize. If a 5 MB image is only 800×600 pixels, compression will help. If it is 6000×4000 pixels, resizing to the display size will help more.',
        },
        {
          title: 'Batch specification audit',
          description:
            'Drop multiple images into the checker to compare their specifications. Useful for auditing a product image library to find images that are below minimum dimensions or too large in file size.',
        },
      ]}
      specs={[
        { label: 'Supported formats', value: 'JPG, PNG, WebP, GIF, TIFF, HEIC, SVG, BMP' },
        {
          label: 'Information shown',
          value:
            'Width, height, file size, format, DPI, colour mode, bit depth, aspect ratio, megapixels',
        },
        { label: 'Batch checking', value: 'Yes — drop multiple images' },
        { label: 'Platform comparison', value: 'Yes — Amazon, Instagram, LinkedIn, and more' },
        { label: 'Server upload', value: 'Never — 100% browser-based' },
        { label: 'Cost', value: 'Free, no account needed' },
      ]}
      faqs={[
        {
          q: 'What is the difference between file size and image dimensions?',
          a: 'Image dimensions describe the number of pixels: width × height (e.g. 1920×1080 pixels). File size describes how much storage the file takes (e.g. 2.4 MB). Two images can have the same dimensions but very different file sizes — a highly compressed JPG and a lossless PNG of the same 1920×1080 image might be 200 KB versus 4 MB respectively. Both dimensions and file size matter for different use cases.',
        },
        {
          q: 'What is bit depth?',
          a: 'Bit depth describes how many levels of colour information each channel can store. Standard photos are 8-bit per channel (24-bit RGB total), giving 256 levels per colour channel. Professional cameras and RAW files support 12, 14, or 16 bits per channel for more gradation and editing headroom. Most web and print images use 8-bit.',
        },
        {
          q: 'What does colour mode mean?',
          a: 'Colour mode describes how colours are represented: RGB (Red, Green, Blue — the standard for screens and web), CMYK (Cyan, Magenta, Yellow, Black — used for print), Grayscale (single channel, no colour), or Indexed (a limited palette, used in GIF). Most images you encounter are RGB. CMYK images saved as JPG or PNG may not display correctly on screen — the DPI Converter can help identify these.',
        },
        {
          q: 'My image shows the wrong DPI in the checker — what does this mean?',
          a: 'DPI stored in an image file is just metadata — a number that tells print software how large to size the image. It does not affect how the image looks on screen or its pixel count. A 300 DPI setting on a small image does not make it high resolution — only the pixel count determines actual resolution. The DPI metadata can be changed without changing pixels using the DPI Converter tool.',
        },
        {
          q: 'What is aspect ratio and why does it matter?',
          a: 'Aspect ratio is the proportional relationship between width and height (e.g. 16:9, 4:3, 1:1). Many platforms require specific aspect ratios — Instagram feed posts work best at 1:1 or 4:5, YouTube thumbnails must be 16:9, Twitter cards at 2:1. If your image aspect ratio does not match the platform requirement, the platform will crop it, often removing important content.',
        },
        {
          q: 'Can I check images without uploading them to a server?',
          a: 'Yes — all image information is read directly from the file in your browser. The image data is never transmitted to any server. This makes the tool completely private — even sensitive images (personal photos, confidential documents) can be checked without any data leaving your device.',
        },
      ]}
      relatedTools={[
        {
          name: 'Image Resizer',
          href: '/tools/image-tools/image-resizer',
          icon: '??',
          description: 'Resize to required dimensions',
        },
        {
          name: 'Image Compressor',
          href: '/tools/image-tools/image-compressor',
          icon: '???',
          description: 'Reduce file size',
        },
        {
          name: 'DPI Converter',
          href: '/tools/image-tools/dpi-converter',
          icon: '???',
          description: 'Change DPI metadata for print',
        },
        {
          name: 'Image Metadata Viewer',
          href: '/tools/image-tools/image-metadata-viewer',
          icon: '??',
          description: 'View full EXIF and metadata',
        },
        {
          name: 'Pixel Density Calculator',
          href: '/tools/image-tools/pixel-density-calculator',
          icon: '??',
          description: 'Calculate PPI and print size',
        },
        {
          name: 'Image Converter',
          href: '/tools/image-tools/image-converter',
          icon: '??',
          description: 'Convert to required format',
        },
      ]}
      {...(_s ? { aboutHTML: _s.aboutHTML, proTips: _s.proTips } : {})}
    >
      <ImageSizeCheckerClient />
    </ImageToolShell>
  );
}
