'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import CompressPDFIcon from './CompressPDFIcon'

// API routes are handled by Next.js API routes at /api/pdf/*

export interface PDFToolConfig {
  slug: string
  title: string
  description: string
  endpoint: string
  acceptTypes: string
  outputExt: string
  outputMime: string
  buttonLabel: string
  processingLabel: string
  multiple?: boolean
  extraFields?: ExtraField[]
  subcategory: string
}

interface ExtraField {
  name: string
  label: string
  type: 'text' | 'password' | 'number' | 'select' | 'textarea' | 'hidden'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  defaultValue?: string
}

interface PDFToolClientProps {
  config: PDFToolConfig
}

export default function PDFToolClient({ config }: PDFToolClientProps) {
  const [files, setFiles] = useState<File[]>([])
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadName, setDownloadName] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const arr = Array.from(incoming)
    setFiles(config.multiple ? arr : [arr[0]])
    setStatus('idle')
    setError('')
    setDownloadUrl('')
  }, [config.multiple])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const process = async () => {
    if (files.length === 0) return
    setStatus('processing')
    setError('')
    try {
      const fd = new FormData()
      if (config.multiple) {
        files.forEach(f => fd.append('files', f))
      } else {
        fd.append('file', files[0])
      }
      // Merge in defaultValues for fields the user hasn't touched (includes hidden fields)
      const extraWithDefaults: Record<string, string> = {}
      config.extraFields?.forEach(f => {
        if (f.defaultValue !== undefined) extraWithDefaults[f.name] = f.defaultValue
      })
      Object.assign(extraWithDefaults, extra)
      Object.entries(extraWithDefaults).forEach(([k, v]) => { if (v) fd.append(k, v) })

      const res = await fetch(config.endpoint, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: 'Processing failed. Please try again.' }))
        throw new Error(msg.error || 'Processing failed.')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      // Prefer filename from Content-Disposition if provided by the route
      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="?([^";\n]+)"?/)
      const outName = match?.[1] || files[0].name.replace(/\.pdf$/i, '') + '.' + config.outputExt
      setDownloadUrl(url)
      setDownloadName(outName)
      setStatus('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error. Please try again.')
      setStatus('error')
    }
  }

  const reset = () => {
    setFiles([])
    setExtra({})
    setStatus('idle')
    setError('')
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    setDownloadUrl('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const totalSizeMB = files.reduce((s, f) => s + f.size, 0) / 1024 / 1024

  return (
    <div className="max-w-2xl mx-auto">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/tools/pdf" className="hover:text-red-600 transition-colors">PDF Tools</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{config.title}</span>
      </nav>

      {/* Tool header */}
      <div className="text-center mb-8">
        {config.slug === 'compress-pdf' ? (
          <div className="flex justify-center mb-4">
            <CompressPDFIcon />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
        <p className="text-gray-500 max-w-md mx-auto">{config.description}</p>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 text-xs text-gray-500">
        {[
          { icon: '🔒', text: 'Secure & Private' },
          { icon: '⚡', text: 'Fast Processing' },
          { icon: '🆓', text: 'Free to Use' },
          { icon: '🗑️', text: 'Auto-Deleted in 1hr' },
        ].map(b => (
          <span key={b.text} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
            {b.icon} {b.text}
          </span>
        ))}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Drop zone */}
        {status === 'idle' || status === 'error' ? (
          <div
            onDrop={onDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`
              relative cursor-pointer p-12 text-center transition-all duration-200 border-2 border-dashed m-6 rounded-xl
              ${dragging ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept={config.acceptTypes}
              multiple={config.multiple}
              className="sr-only"
              onChange={e => handleFiles(e.target.files)}
            />

            {files.length === 0 ? (
              <>
                <div className="flex justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  {config.multiple ? 'Drop PDF files here' : 'Drop PDF file here'}
                </p>
                <p className="text-sm text-gray-400 mb-5">or</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {config.multiple ? 'Select PDF Files' : 'Select PDF File'}
                </button>
                <p className="text-xs text-gray-400 mt-4">PDF files only · Max 50MB per file</p>
              </>
            ) : (
              <div className="text-left space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1 text-sm font-medium text-gray-700 truncate">{f.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); reset() }}
                  className="text-xs text-gray-400 hover:text-gray-600 mt-2 underline"
                >
                  Remove {files.length > 1 ? 'all files' : 'file'}
                </button>
                <p className="text-xs text-gray-400">
                  {files.length} file{files.length > 1 ? 's' : ''} · {totalSizeMB.toFixed(2)} MB total
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Extra fields */}
        {config.extraFields && config.extraFields.length > 0 && files.length > 0 && status === 'idle' && (
          <div className="px-6 pb-4 space-y-3">
            {config.extraFields.filter(f => f.type !== 'hidden').map(field => (
              <div key={field.name}>
                {field.label && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                {field.type === 'select' ? (
                  <select
                    value={extra[field.name] || field.defaultValue || ''}
                    onChange={e => setExtra(p => ({ ...p, [field.name]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {field.options?.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={extra[field.name] || ''}
                    onChange={e => setExtra(p => ({ ...p, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={extra[field.name] || ''}
                    onChange={e => setExtra(p => ({ ...p, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Processing state */}
        {status === 'processing' && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-red-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">{config.processingLabel}</p>
            <p className="text-sm text-gray-500">This may take a few seconds…</p>
            <div className="mt-4 bg-gray-100 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
              <div className="bg-red-500 h-full rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* Done state */}
        {status === 'done' && downloadUrl && (
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-1">Done!</p>
            <p className="text-sm text-gray-500 mb-6">Your file is ready to download.</p>
            <a
              href={downloadUrl}
              download={downloadName}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download {downloadName}
            </a>
            <div className="mt-4">
              <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 underline">
                Process another file
              </button>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-semibold">Processing failed</p>
              <p className="mt-0.5 text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Action button */}
        {(status === 'idle' || status === 'error') && files.length > 0 && (
          <div className="px-6 pb-6">
            <button
              onClick={process}
              disabled={false}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl text-base transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              {config.buttonLabel}
            </button>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        {[
          { step: '1', title: 'Select File', desc: 'Upload your PDF from device' },
          { step: '2', title: 'Process', desc: 'We handle it securely' },
          { step: '3', title: 'Download', desc: 'Get your result instantly' },
        ].map(s => (
          <div key={s.step} className="p-4">
            <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
              {s.step}
            </div>
            <p className="text-sm font-semibold text-gray-800">{s.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
