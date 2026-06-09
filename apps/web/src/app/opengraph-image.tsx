import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RoughTools — 600+ Free Online Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)',
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            🛠️
          </div>
          <span
            style={{
              fontSize: '42px',
              fontWeight: '800',
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            RoughTools
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: '56px',
            fontWeight: '900',
            color: 'white',
            textAlign: 'center',
            lineHeight: '1.1',
            margin: '0 0 16px',
            letterSpacing: '-2px',
            maxWidth: '900px',
          }}
        >
          194 Free Online Tools
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            margin: '0 0 40px',
            maxWidth: '700px',
          }}
        >
          PDF • Calculators • Developer Tools • Converters & More
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['No Signup Required', 'Free Forever', 'Privacy Friendly'].map((text) => (
            <div
              key={text}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '100px',
                padding: '8px 20px',
                fontSize: '18px',
                color: 'white',
                fontWeight: '600',
              }}
            >
              ✓ {text}
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '40px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          roughtools.com
        </div>
      </div>
    ),
    { ...size }
  )
}