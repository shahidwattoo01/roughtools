import Link from 'next/link'

interface Recommendation {
  tip: string
  cta: string
  href: string
  icon: string
}

// Map from current tool slug → contextual recommendations shown after processing
const RECOMMENDATIONS: Record<string, Recommendation[]> = {
  'image-compressor': [
    { icon: '🔄', tip: 'PNG files are large. Convert to WebP for up to 35% extra savings with no visible loss.', cta: 'Convert to WebP', href: '/tools/image-tools/image-converter' },
    { icon: '📏', tip: 'Still too big? Resize dimensions before compressing for the best file size reduction.', cta: 'Resize Image', href: '/tools/image-tools/image-resizer' },
  ],
  'image-resizer': [
    { icon: '🗜️', tip: 'Now compress your resized image to reduce file size further before uploading.', cta: 'Compress Image', href: '/tools/image-tools/image-compressor' },
    { icon: '🔄', tip: 'Convert to WebP format for maximum compression with browser-compatible output.', cta: 'Convert to WebP', href: '/tools/image-tools/image-converter' },
  ],
  'image-converter': [
    { icon: '🗜️', tip: 'Compress your converted image to reduce file size without losing quality.', cta: 'Compress Now', href: '/tools/image-tools/image-compressor' },
    { icon: '📏', tip: 'Resize your image to exact dimensions for social media or web use.', cta: 'Resize Image', href: '/tools/image-tools/image-resizer' },
  ],
  'png-to-jpg': [
    { icon: '🗜️', tip: 'Compress your new JPG further — most JPGs can lose 40–60% more size.', cta: 'Compress JPG', href: '/tools/image-tools/image-compressor' },
    { icon: '✂️', tip: 'Crop your image to the exact dimensions you need.', cta: 'Crop Image', href: '/tools/image-tools/image-cropper' },
  ],
  'jpg-to-png': [
    { icon: '🔳', tip: 'Remove the background from your new PNG to get a transparent image.', cta: 'Remove Background', href: '/tools/image-tools/background-remover' },
    { icon: '🗜️', tip: 'PNGs are large — compress it to reduce size while keeping transparency.', cta: 'Compress PNG', href: '/tools/image-tools/image-compressor' },
  ],
  'background-remover': [
    { icon: '⬜', tip: 'Add a white background to your transparent PNG for professional use.', cta: 'Add White Background', href: '/tools/image-tools/white-background-maker' },
    { icon: '🎨', tip: 'Replace the background with a custom colour or image.', cta: 'Change Background', href: '/tools/image-tools/background-changer' },
  ],
  'grayscale-converter': [
    { icon: '🗜️', tip: 'Grayscale images compress much better — reduce file size now.', cta: 'Compress Image', href: '/tools/image-tools/image-compressor' },
    { icon: '✨', tip: 'Enhance brightness and contrast on your greyscale photo.', cta: 'Enhance Image', href: '/tools/image-tools/image-enhancer' },
  ],
  'image-cropper': [
    { icon: '🗜️', tip: 'Compress your cropped image before uploading to save bandwidth.', cta: 'Compress Image', href: '/tools/image-tools/image-compressor' },
    { icon: '📏', tip: 'Resize to an exact pixel dimension after cropping.', cta: 'Resize Image', href: '/tools/image-tools/image-resizer' },
  ],
  'heic-to-jpg': [
    { icon: '🗜️', tip: 'Compress your new JPG — iPhone photos are often still large after conversion.', cta: 'Compress JPG', href: '/tools/image-tools/image-compressor' },
    { icon: '📏', tip: 'Resize the converted photo to a smaller dimension for sharing.', cta: 'Resize Image', href: '/tools/image-tools/image-resizer' },
  ],
  'image-enhancer': [
    { icon: '🗜️', tip: 'Compress the enhanced image before sharing or uploading.', cta: 'Compress Image', href: '/tools/image-tools/image-compressor' },
    { icon: '📏', tip: 'Resize to the exact dimensions needed for your platform.', cta: 'Resize Image', href: '/tools/image-tools/image-resizer' },
  ],
  'bulk-image-resizer': [
    { icon: '🗜️', tip: 'Compress all resized images in batch to reduce file sizes further.', cta: 'Compress Images', href: '/tools/image-tools/image-compressor' },
    { icon: '🔄', tip: 'Convert your batch to WebP format for even smaller web-optimised files.', cta: 'Convert to WebP', href: '/tools/image-tools/image-converter' },
  ],
}

// Generic fallback recommendation
const FALLBACK: Recommendation[] = [
  { icon: '🗜️', tip: 'Compress your image to reduce file size before uploading or sharing.', cta: 'Compress Image', href: '/tools/image-tools/image-compressor' },
  { icon: '📏', tip: 'Resize your image to exact platform dimensions for professional results.', cta: 'Resize Image', href: '/tools/image-tools/image-resizer' },
]

interface Props {
  currentSlug: string
}

export default function SmartRecommendation({ currentSlug }: Props) {
  const recs = RECOMMENDATIONS[currentSlug] ?? FALLBACK

  return (
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recs.map((r, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          background: 'rgba(236,72,153,0.06)',
          border: '1px solid rgba(236,72,153,0.18)',
          borderRadius: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
          <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5, margin: 0, flex: 1 }}>
            💡 {r.tip}
          </p>
          <Link href={r.href} style={{
            flexShrink: 0, fontSize: 12, fontWeight: 700,
            color: '#f9a8d4', textDecoration: 'none',
            background: 'rgba(236,72,153,0.15)',
            border: '1px solid rgba(236,72,153,0.25)',
            borderRadius: 6, padding: '5px 12px', whiteSpace: 'nowrap',
          }}>
            {r.cta} →
          </Link>
        </div>
      ))}
    </div>
  )
}
