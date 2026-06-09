import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length - 3) + '...'
}

export function truncateText(str: string, length: number): string {
  return truncate(str, length)
}

export function formatDate(
  date: string | Date,
  options?: { format?: 'short' | 'long' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'Invalid date'
  if (options?.format === 'long') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatCurrency(
  amount: number,
  options?: { currency?: string; locale?: string }
): string {
  const currency = options?.currency ?? 'USD'
  const locale = options?.locale ?? 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      fn(...args)
    }
  }
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value as object).length === 0
  return false
}

export function classNames(...args: (string | false | null | undefined | Record<string, boolean>)[]): string {
  return args
    .flatMap((arg) => {
      if (!arg) return []
      if (typeof arg === 'string') return [arg]
      return Object.entries(arg)
        .filter(([, v]) => v)
        .map(([k]) => k)
    })
    .join(' ')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
  return prefix ? `${prefix}_${id}` : id
}
