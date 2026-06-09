'use client'

export interface Preset {
  label: string
  width: number
  height: number
  category: string
}

export const PLATFORM_PRESETS: Preset[] = [
  // Instagram
  { label: 'Instagram Post (Square)',  width: 1080, height: 1080, category: 'Instagram' },
  { label: 'Instagram Portrait',       width: 1080, height: 1350, category: 'Instagram' },
  { label: 'Instagram Story',          width: 1080, height: 1920, category: 'Instagram' },
  { label: 'Instagram Reel Cover',     width: 1080, height: 1920, category: 'Instagram' },
  // Facebook
  { label: 'Facebook Post',            width: 1200, height: 630,  category: 'Facebook' },
  { label: 'Facebook Cover',           width: 820,  height: 312,  category: 'Facebook' },
  { label: 'Facebook Story',           width: 1080, height: 1920, category: 'Facebook' },
  // Twitter / X
  { label: 'Twitter / X Post',         width: 1200, height: 675,  category: 'Twitter / X' },
  { label: 'Twitter / X Header',       width: 1500, height: 500,  category: 'Twitter / X' },
  // LinkedIn
  { label: 'LinkedIn Post',            width: 1200, height: 627,  category: 'LinkedIn' },
  { label: 'LinkedIn Cover',           width: 1584, height: 396,  category: 'LinkedIn' },
  // YouTube
  { label: 'YouTube Thumbnail',        width: 1280, height: 720,  category: 'YouTube' },
  { label: 'YouTube Channel Art',      width: 2560, height: 1440, category: 'YouTube' },
  // WhatsApp
  { label: 'WhatsApp Profile Photo',   width: 500,  height: 500,  category: 'WhatsApp' },
  { label: 'WhatsApp Status',          width: 1080, height: 1920, category: 'WhatsApp' },
  // Pinterest
  { label: 'Pinterest Pin',            width: 1000, height: 1500, category: 'Pinterest' },
  { label: 'Pinterest Board Cover',    width: 800,  height: 450,  category: 'Pinterest' },
  // General
  { label: 'HD Wallpaper (16:9)',       width: 1920, height: 1080, category: 'General' },
  { label: 'Email Banner',             width: 600,  height: 200,  category: 'General' },
  { label: 'Web Banner',               width: 728,  height: 90,   category: 'General' },
]

interface Props {
  onSelect: (preset: Preset) => void
  style?: React.CSSProperties
}

export default function PlatformPresets({ onSelect, style }: Props) {
  const categories = [...new Set(PLATFORM_PRESETS.map(p => p.category))]

  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 6 }}>
        📐 Resize for platform
      </label>
      <select
        defaultValue=""
        onChange={e => {
          const preset = PLATFORM_PRESETS.find(p => p.label === e.target.value)
          if (preset) { onSelect(preset); e.target.value = '' }
        }}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 8,
          background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(167,139,250,0.25)',
          color: '#e0e0ff', fontSize: 13, cursor: 'pointer',
        }}
      >
        <option value="">Choose a platform preset…</option>
        {categories.map(cat => (
          <optgroup key={cat} label={cat}>
            {PLATFORM_PRESETS.filter(p => p.category === cat).map(p => (
              <option key={p.label} value={p.label}>
                {p.label} — {p.width} × {p.height}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
