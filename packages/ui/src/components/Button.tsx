import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  href?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'btn-primary bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'btn-secondary bg-gray-100 text-gray-900 hover:bg-gray-200',
  danger: 'btn-danger bg-red-600 text-white hover:bg-red-700',
  ghost: 'btn-ghost bg-transparent text-gray-700 hover:bg-gray-100',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'btn-sm px-3 py-1.5 text-xs',
  md: 'btn-md px-4 py-2 text-sm',
  lg: 'btn-lg px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  href,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'btn-fullWidth w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const isDisabled = disabled || loading

  if (href) {
    return (
      <a href={href} className={classes}>
        {leftIcon}
        {children}
        {rightIcon}
      </a>
    )
  }

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      className={classes}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {children}
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
}

export default Button
