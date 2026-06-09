'use client'

/**
 * useToast — lightweight toast system
 * No external dependency. Uses a singleton store with React subscribers.
 * Spec: bottom-right, success/error/info left border, auto-dismiss 3s.
 */

import { useState, useEffect, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number  // ms, default 3000
}

// ─── Singleton store ──────────────────────────────────────────
let toasts: Toast[] = []
const subscribers = new Set<() => void>()

function notify() {
  subscribers.forEach((fn) => fn())
}

function addToast(toast: Omit<Toast, 'id'>): string {
  const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`
  toasts = [...toasts, { ...toast, id }]
  notify()

  const duration = toast.duration ?? 3000
  setTimeout(() => removeToast(id), duration)
  return id
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

// ─── Public API ───────────────────────────────────────────────
export const toast = {
  success: (message: string, opts?: Partial<Toast>) =>
    addToast({ message, type: 'success', ...opts }),
  error:   (message: string, opts?: Partial<Toast>) =>
    addToast({ message, type: 'error',   ...opts }),
  info:    (message: string, opts?: Partial<Toast>) =>
    addToast({ message, type: 'info',    ...opts }),
  dismiss: removeToast,
}

// ─── React hook ───────────────────────────────────────────────
export function useToasts() {
  const [list, setList] = useState<Toast[]>(toasts)

  useEffect(() => {
    const sync = () => setList([...toasts])
    subscribers.add(sync)
    return () => { subscribers.delete(sync) }
  }, [])

  const dismiss = useCallback((id: string) => removeToast(id), [])
  return { toasts: list, dismiss }
}
