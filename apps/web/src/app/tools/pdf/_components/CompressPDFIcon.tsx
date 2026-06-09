/**
 * Custom Compress PDF icon.
 * Pass scale={1} for the full-size tool header (default).
 * Pass scale={0.17} for the 40×40 listing card thumbnail.
 */
export default function CompressPDFIcon({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale

  const lineStyle: React.CSSProperties = {
    width: '100%',
    height: `${s(13)}px`,
    background: 'linear-gradient(90deg, #ff3333, #cc0000)',
    borderRadius: `${s(7)}px`,
    boxShadow:
      `0 ${s(3)}px ${s(6)}px rgba(200,0,0,0.35), inset 0 ${s(1)}px ${s(2)}px rgba(255,255,255,0.25), inset 0 -${s(1)}px ${s(2)}px rgba(0,0,0,0.2)`,
    flexShrink: 0,
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${s(220)}px`,
        height: `${s(260)}px`,
        flexShrink: 0,
      }}
    >
      {/* Back red card */}
      <div style={{
        position: 'absolute',
        top: `${s(10)}px`,
        right: `${-s(18)}px`,
        width: `${s(180)}px`,
        height: `${s(220)}px`,
        background: 'linear-gradient(145deg, #ff4444, #cc0000)',
        borderRadius: `${s(18)}px`,
        boxShadow:
          `${s(4)}px ${s(4)}px ${s(12)}px rgba(0,0,0,0.5), inset ${s(1)}px ${s(1)}px ${s(2)}px rgba(255,255,255,0.15)`,
      }} />

      {/* Front white card */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${s(185)}px`,
        height: `${s(230)}px`,
        background: 'linear-gradient(160deg, #ffffff 70%, #f0f0f0 100%)',
        borderRadius: `${s(18)}px`,
        boxShadow:
          `-${s(4)}px ${s(4)}px ${s(20)}px rgba(0,0,0,0.45), inset -${s(1)}px -${s(1)}px ${s(3)}px rgba(0,0,0,0.06), inset ${s(1)}px ${s(1)}px ${s(2)}px rgba(255,255,255,0.9)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${s(28)}px ${s(18)}px ${s(18)}px`,
        gap: `${s(12)}px`,
      }}>

        {/* Folded corner */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: `${s(38)}px`,
          height: `${s(38)}px`,
          background: 'linear-gradient(225deg, #e0e0e0 45%, #ffffff 55%)',
          borderBottomLeftRadius: `${s(10)}px`,
          boxShadow: `-${s(2)}px ${s(2)}px ${s(5)}px rgba(0,0,0,0.12)`,
          flexShrink: 0,
        }} />

        {/* Short line */}
        <div style={{ ...lineStyle, width: '65%', alignSelf: 'flex-start' }} />

        {/* Full line 1 */}
        <div style={lineStyle} />

        {/* Full line 2 */}
        <div style={lineStyle} />

        {/* COMPRESS label */}
        <div style={{
          marginTop: 'auto',
          width: '100%',
          background: 'linear-gradient(135deg, #ff3333, #cc0000)',
          borderRadius: `${s(10)}px`,
          padding: `${s(12)}px ${s(10)}px`,
          textAlign: 'center',
          boxShadow:
            `0 ${s(4)}px ${s(10)}px rgba(180,0,0,0.4), inset 0 ${s(1)}px ${s(2)}px rgba(255,255,255,0.2), inset 0 -${s(2)}px ${s(3)}px rgba(0,0,0,0.2)`,
          flexShrink: 0,
        }}>
          <span style={{
            color: '#fff',
            fontSize: `${s(19)}px`,
            fontWeight: 900,
            letterSpacing: '0.5px',
            textShadow:
              `${s(1)}px ${s(1)}px ${s(2)}px rgba(0,0,0,0.3), 0 ${s(1)}px 0 rgba(255,255,255,0.15)`,
            fontFamily: "'Arial Black', Arial, sans-serif",
            lineHeight: 1,
          }}>
            COMPRESS
          </span>
        </div>

      </div>
    </div>
  )
}
