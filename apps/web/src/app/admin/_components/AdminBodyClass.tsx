'use client'
import { useEffect } from 'react'

/** Adds `admin-panel` class to <body> while admin pages are mounted.
 *  Globals.css uses this to hide the public site header and footer. */
export function AdminBodyClass() {
  useEffect(() => {
    document.body.classList.add('admin-panel')
    return () => document.body.classList.remove('admin-panel')
  }, [])
  return null
}
