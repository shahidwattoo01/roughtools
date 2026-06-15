'use client'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=DM+Serif+Display&display=optional'

export function FontLoader() {
  return (
    // eslint-disable-next-line @next/next/no-page-custom-font
    <link
      rel="stylesheet"
      href={FONT_HREF}
      media="print"
      onLoad={(e) => {
        ;(e.currentTarget as HTMLLinkElement).media = 'all'
      }}
    />
  )
}
