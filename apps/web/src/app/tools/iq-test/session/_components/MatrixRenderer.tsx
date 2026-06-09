import type { MatrixContent, GridCell } from '../../_lib/types'

// Theme-safe palette: colorIndex 1–4
const COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706']

interface CellProps {
  cell: GridCell
  size: number
  isAnswer?: boolean
}

function ShapeCell({ cell, size, isAnswer = false }: CellProps) {
  const color = COLORS[(cell.colorIndex - 1) % 4]
  const s = size * 0.55
  const cx = size / 2
  const cy = size / 2
  const transform = `rotate(${cell.rotation} ${cx} ${cy})`

  const fillId = `fill-${cell.shape}-${cell.fill}-${cell.colorIndex}-${cell.rotation}`

  let shapePath: React.ReactNode = null

  if (cell.shape === 'circle') {
    const r = s / 2
    if (cell.fill === 'solid') {
      shapePath = <circle cx={cx} cy={cy} r={r} fill={color} transform={transform} />
    } else if (cell.fill === 'outline') {
      shapePath = <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} transform={transform} />
    } else if (cell.fill === 'half') {
      shapePath = (
        <g transform={transform}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.5} />
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} fill={color} />
        </g>
      )
    } else {
      // dotted
      shapePath = <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} strokeDasharray="3 2" transform={transform} />
    }
  } else if (cell.shape === 'square') {
    const half = s / 2
    const x = cx - half
    const y = cy - half
    if (cell.fill === 'solid') {
      shapePath = <rect x={x} y={y} width={s} height={s} fill={color} transform={transform} />
    } else if (cell.fill === 'outline') {
      shapePath = <rect x={x} y={y} width={s} height={s} fill="none" stroke={color} strokeWidth={2} transform={transform} />
    } else if (cell.fill === 'half') {
      shapePath = (
        <g transform={transform}>
          <rect x={x} y={y} width={s} height={s} fill="none" stroke={color} strokeWidth={1.5} />
          <rect x={x} y={y} width={s / 2} height={s} fill={color} />
        </g>
      )
    } else {
      shapePath = <rect x={x} y={y} width={s} height={s} fill="none" stroke={color} strokeWidth={2} strokeDasharray="3 2" transform={transform} />
    }
  } else if (cell.shape === 'triangle') {
    const h = s * 0.866
    const pts = `${cx},${cy - h / 2} ${cx - s / 2},${cy + h / 2} ${cx + s / 2},${cy + h / 2}`
    if (cell.fill === 'solid') {
      shapePath = <polygon points={pts} fill={color} transform={transform} />
    } else if (cell.fill === 'outline') {
      shapePath = <polygon points={pts} fill="none" stroke={color} strokeWidth={2} transform={transform} />
    } else if (cell.fill === 'half') {
      shapePath = (
        <g transform={transform}>
          <polygon points={pts} fill="none" stroke={color} strokeWidth={1.5} />
          <clipPath id={fillId}><polygon points={pts} /></clipPath>
          <rect x={cx - s} y={cy} width={s * 2} height={s} fill={color} clipPath={`url(#${fillId})`} />
        </g>
      )
    } else {
      shapePath = <polygon points={pts} fill="none" stroke={color} strokeWidth={2} strokeDasharray="3 2" transform={transform} />
    }
  } else if (cell.shape === 'diamond') {
    const pts = `${cx},${cy - s / 2} ${cx + s / 2},${cy} ${cx},${cy + s / 2} ${cx - s / 2},${cy}`
    if (cell.fill === 'solid') {
      shapePath = <polygon points={pts} fill={color} transform={transform} />
    } else {
      shapePath = <polygon points={pts} fill="none" stroke={color} strokeWidth={2} transform={transform} />
    }
  } else {
    // hexagon / pentagon fallback — use circle outline
    shapePath = <circle cx={cx} cy={cy} r={s / 2} fill="none" stroke={color} strokeWidth={2} transform={transform} />
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`rounded-lg ${isAnswer ? '' : 'bg-[#f9f9f9] dark:bg-[#2a2a2a]'}`}
      aria-hidden="true"
    >
      {shapePath}
    </svg>
  )
}

interface Props {
  content: MatrixContent
  disabled: boolean
  onAnswer: (index: number) => void
}

export function MatrixRenderer({ content, disabled, onAnswer }: Props) {
  const cellSize = content.renderHint === '4x4' ? 52 : 64
  const optionSize = content.renderHint === '4x4' ? 44 : 54

  return (
    <div>
      <p className="text-[13px] text-[#555] dark:text-[#aaa] mb-4">
        Which option correctly completes the matrix?
      </p>

      {/* Grid */}
      <div className="inline-block mb-7 p-3 bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${content.grid[0].length}, ${cellSize}px)` }}
        >
          {content.grid.flat().map((cell, i) => (
            <div key={i} className={`w-[${cellSize}px] h-[${cellSize}px]`}>
              {cell === null ? (
                <div
                  className="rounded-lg border-2 border-dashed border-[#a21caf] bg-[#fdf4ff] dark:bg-[#a21caf]/10 flex items-center justify-center text-xl font-bold text-[#a21caf]"
                  style={{ width: cellSize, height: cellSize }}
                >
                  ?
                </div>
              ) : (
                <ShapeCell cell={cell} size={cellSize} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {content.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            disabled={disabled}
            className="flex flex-col items-center gap-1 p-2 rounded-xl border-2
                       border-black/10 dark:border-white/15
                       hover:border-[#a21caf] dark:hover:border-[#a21caf]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShapeCell cell={opt} size={optionSize} isAnswer />
            <span className="text-[10px] text-[#555] dark:text-[#aaa]">{String.fromCharCode(65 + i)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
