import React from 'react'

interface ResultBoxProps {
  label: string
  value: string | number
  subtext?: string
  highlight?: boolean
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'gray'
}

const colorMap = {
  green:  'bg-green-50 border-green-200 text-green-800',
  blue:   'bg-blue-50 border-blue-200 text-blue-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  red:    'bg-red-50 border-red-200 text-red-800',
  gray:   'bg-gray-50 border-gray-200 text-gray-800',
}

export default function ResultBox({
  label, value, subtext, highlight = false, color = 'gray'
}: ResultBoxProps) {
  return (
    <div className={`
      border rounded-xl p-4 transition-all duration-200
      ${highlight ? colorMap[color] : 'bg-gray-50 border-gray-200'}
    `}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? '' : 'text-gray-900'}`}>{value}</p>
      {subtext && <p className="text-xs mt-1 opacity-70">{subtext}</p>}
    </div>
  )
}