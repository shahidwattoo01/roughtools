import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export default function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}