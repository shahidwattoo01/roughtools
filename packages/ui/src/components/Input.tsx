import React from 'react'

interface InputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  suffix?: string
  prefix?: string
  hint?: string
  error?: string
  required?: boolean
}

export default function Input({
  label, value, onChange, type = 'text',
  placeholder, suffix, prefix, hint, error, required,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-500 text-sm font-medium">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border bg-white px-4 py-3 text-sm
            transition-colors duration-150 outline-none
            focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 hover:border-gray-300'}
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-16' : ''}
          `}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-500 text-sm font-medium">{suffix}</span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}