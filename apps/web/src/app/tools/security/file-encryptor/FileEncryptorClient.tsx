'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

type Mode = 'encrypt' | 'decrypt'

const FAQS = [
  {
    q: 'Is the file encryptor completely free to use?',
    a: 'Yes, the RoughTools File Encryptor is completely free with no subscriptions, account requirements, or hidden fees. You can encrypt and decrypt unlimited files of any type — documents, photos, archives, databases — at no cost. The tool is funded through non-intrusive advertising, keeping it permanently free for all users worldwide. There are no file count limits, no watermarks added to files, and no premium tier required to access any feature.'
  },
  {
    q: 'Do I need to sign up or create an account to encrypt files?',
    a: 'No account, registration, email address, or personal information is required. Open the page, drop your file, enter a password, and click Encrypt. Your encrypted file is downloaded directly to your device. The same applies to decryption — paste your password, upload the encrypted file, and download the original. There is no user tracking, no session storage of file contents, and no login wall blocking any part of the tool.'
  },
  {
    q: 'Is my file uploaded to a server when I encrypt it?',
    a: 'No. Every operation — encryption and decryption — runs entirely within your browser using the Web Cryptography API (SubtleCrypto). Your file data never leaves your device and is never transmitted to RoughTools servers. This is critical for sensitive documents: your contracts, medical records, private photos, and proprietary files stay on your machine throughout the process. The only data movement is the download of the encrypted output file to your local drive.'
  },
  {
    q: 'Does this file encryptor work on mobile phones and tablets?',
    a: 'Yes, the File Encryptor works on all modern smartphones and tablets running iOS 14+ (Safari 14+) or Android 8+ (Chrome 70+). The Web Cryptography API used for AES-256-GCM encryption is supported on all current mobile browsers. You can pick files from your device storage or cloud drives and download the encrypted file directly to your phone. For large files on mobile, ensure you have sufficient free storage space before downloading.'
  },
  {
    q: 'Which browsers are compatible with this encryption tool?',
    a: 'The tool works in all modern browsers that support the Web Cryptography API: Google Chrome 37+, Mozilla Firefox 34+, Microsoft Edge 79+, Safari 11+, and Opera 24+. All current versions of these browsers are fully supported on both desktop and mobile. Internet Explorer is not supported as it lacks the SubtleCrypto interface. For the best performance when encrypting large files (over 100 MB), Chrome or Firefox is recommended due to their optimized WebAssembly and memory management.'
  },
  {
    q: 'What encryption algorithm is used — how secure is it?',
    a: 'The tool uses AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode) — the same algorithm used by governments, banks, and security professionals worldwide. The key is derived from your password using PBKDF2 with SHA-256 and 100,000 iterations with a random 128-bit salt, making brute-force attacks against weak passwords computationally expensive. GCM mode also provides authenticated encryption, meaning the decryption process detects if the file has been tampered with or corrupted. Each encryption uses a fresh random 96-bit IV (initialization vector).'
  },
  {
    q: 'How do I encrypt a file step by step?',
    a: 'To encrypt a file: (1) Select "Encrypt" mode at the top of the page. (2) Click the upload area or drag and drop your file — any file type is supported. (3) Enter a strong password in the password field. Use a long passphrase (12+ characters with mixed types) for best security. (4) Optionally click the eye icon to reveal and verify your password. (5) Click "Encrypt & Download". The encrypted file is saved as your original filename with an ".enc" extension. Store your password securely — without it, decryption is mathematically impossible.'
  },
  {
    q: 'How do I decrypt a file encrypted with this tool?',
    a: 'To decrypt a file: (1) Select "Decrypt" mode using the tab at the top. (2) Upload the encrypted ".enc" file produced by this tool. (3) Enter the exact password used during encryption — it is case-sensitive and must match precisely. (4) Click "Decrypt & Download". The original file is restored and downloaded. If the password is incorrect or the file was tampered with, AES-GCM authentication will reject the decryption and display an error. There is no password recovery — only the original password will work.'
  },
  {
    q: 'Why should I use RoughTools instead of other file encryption websites?',
    a: 'Most online file encryption services upload your file to their servers, decrypt it there, then send it back — creating a window where your sensitive data is exposed. RoughTools File Encryptor is 100% client-side: your file never leaves your browser. The tool uses AES-256-GCM with PBKDF2 key derivation — the same standard used by professional password managers and security software. There are no file size restrictions imposed by server bandwidth, no watermarks, no accounts, and the complete source is inspectable in your browser developer tools.'
  },
  {
    q: 'How do I report a bug or request a new feature?',
    a: 'To report a bug or suggest a feature for the File Encryptor, use the feedback link in the site footer or visit the RoughTools contact page. When reporting an encryption or decryption issue, include: the browser name and version, operating system, file type and approximate size, and whether you are encrypting or decrypting. Useful feature requests include: batch file encryption, password strength meter integration, support for additional formats, or drag-and-drop improvements. All requests are reviewed and prioritised regularly.'
  },
  {
    q: 'What happens if I forget the password used to encrypt a file?',
    a: 'If you forget your encryption password, the file cannot be recovered. AES-256-GCM is a symmetric encryption algorithm with no backdoor, no master key, and no password recovery mechanism. The key derivation uses PBKDF2 with 100,000 iterations specifically to make brute-force guessing slow — even with supercomputers, recovering a strong 12-character password would take thousands of years. This is a security feature, not a flaw. Always store your encryption password in a password manager immediately after encrypting important files.'
  },
  {
    q: 'Can I encrypt any file type — PDFs, videos, ZIP archives?',
    a: 'Yes, any file type can be encrypted: PDFs, Word documents, Excel spreadsheets, ZIP/RAR archives, photos (JPEG, PNG, RAW), videos (MP4, MOV), audio files, database exports, source code, and any other binary or text file. The tool reads the raw bytes of the file regardless of its format and encrypts the entire content. The resulting ".enc" file contains the AES-GCM ciphertext along with the salt and IV required for decryption. The original file type is restored exactly upon decryption.'
  },
]

export default function FileEncryptor() {
  const [mode, setMode] = useState<Mode>('encrypt')
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'working' | 'success' | 'error'; msg: string }>({ type: 'idle', msg: '' })
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pwdStrength = (() => {
    const p = password
    if (!p) return null
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (p.length >= 16) score++
    if (/[A-Z]/.test(p)) score++
    if (/[a-z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^a-zA-Z0-9]/.test(p)) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', pct: 25 }
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', pct: 50 }
    if (score <= 5) return { label: 'Good', color: 'bg-blue-500', pct: 75 }
    return { label: 'Strong', color: 'bg-green-500', pct: 100 }
  })()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  const handleEncrypt = async () => {
    if (!file || !password) return
    setStatus({ type: 'working', msg: 'Encrypting…' })
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pwdKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        pwdKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt'],
      )
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, arrayBuffer)
      const blob = new Blob([salt, iv, encrypted as unknown as ArrayBuffer], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name}.enc`
      a.click()
      URL.revokeObjectURL(url)
      setStatus({ type: 'success', msg: `Encrypted successfully — saved as "${file.name}.enc"` })
    } catch {
      setStatus({ type: 'error', msg: 'Encryption failed. Please check your file and try again.' })
    }
  }

  const handleDecrypt = async () => {
    if (!file || !password) return
    setStatus({ type: 'working', msg: 'Decrypting…' })
    try {
      const buf = await file.arrayBuffer()
      const salt = new Uint8Array(buf, 0, 16)
      const iv = new Uint8Array(buf, 16, 12)
      const data = buf.slice(28)
      const pwdKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        pwdKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt'],
      )
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
      const outName = file.name.endsWith('.enc') ? file.name.slice(0, -4) : `decrypted_${file.name}`
      const blob = new Blob([decrypted], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = outName
      a.click()
      URL.revokeObjectURL(url)
      setStatus({ type: 'success', msg: `Decrypted successfully — saved as "${outName}"` })
    } catch {
      setStatus({ type: 'error', msg: 'Decryption failed. Incorrect password or corrupted file.' })
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  }

  const CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top nav */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Security Tools
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">File Encryptor</h1>
          <span className="ml-auto text-xs bg-purple-900/50 text-purple-400 border border-purple-800 px-2 py-0.5 rounded-full">🔒 AES-256-GCM · Client-Side Only</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">AES-256-GCM File Encryptor & Decryptor</h2>
          <p className="text-purple-300/70 text-sm">Military-grade encryption · PBKDF2 key derivation · Runs in your browser · No file upload · 100% free</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['AES-256-GCM', 'PBKDF2 + SHA-256', '100k Iterations', 'Zero Server Upload', 'Any File Type'].map(b => (
              <span key={b} className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded-full px-3 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* Mode tabs + main panel */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {(['encrypt', 'decrypt'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setFile(null); setStatus({ type: 'idle', msg: '' }) }}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${mode === m ? 'bg-purple-700 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {m === 'encrypt' ? '🔐 Encrypt File' : '🔓 Decrypt File'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-purple-600 hover:bg-gray-800/50'}`}
            >
              <input ref={inputRef} type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? (
                <div>
                  <div className="text-2xl mb-2">📄</div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{file.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-3">📁</div>
                  <p className="text-gray-300 font-medium text-sm">Drag & drop your file here</p>
                  <p className="text-gray-600 text-xs mt-1">or click to browse · Any file type · No size limit</p>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {mode === 'encrypt' ? 'Set Encryption Password' : 'Enter Decryption Password'}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'encrypt' ? 'Choose a strong password…' : 'Enter the exact password used to encrypt…'}
                  className={`${CLS} pr-10`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>

              {/* Password strength */}
              {mode === 'encrypt' && pwdStrength && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Password strength</span>
                    <span className={`font-semibold ${pwdStrength.pct >= 75 ? 'text-green-400' : pwdStrength.pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{pwdStrength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pwdStrength.color}`} style={{ width: `${pwdStrength.pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Action button */}
            <button
              onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
              disabled={!file || !password || status.type === 'working'}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {status.type === 'working'
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{mode === 'encrypt' ? 'Encrypting…' : 'Decrypting…'}</>
                : mode === 'encrypt' ? '🔐 Encrypt & Download' : '🔓 Decrypt & Download'
              }
            </button>

            {/* Status */}
            {status.type !== 'idle' && status.type !== 'working' && (
              <div className={`p-4 rounded-xl text-sm text-center border ${status.type === 'success' ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-red-900/30 border-red-700 text-red-400'}`}>
                {status.type === 'success' ? '✅' : '❌'} {status.msg}
              </div>
            )}
          </div>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔐', title: 'AES-256-GCM', desc: 'Authenticated encryption — same standard as banking security' },
            { icon: '🚫', title: 'Zero Upload', desc: 'Files never leave your browser — complete privacy guaranteed' },
            { icon: '🔑', title: 'PBKDF2 Key Derivation', desc: '100,000 iterations protect weak passwords from brute force' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">How the Encryption Works</h2>
          <ol className="space-y-3 text-sm text-gray-400">
            {[
              ['Random salt generated', 'A unique 128-bit salt is created for every encryption operation using crypto.getRandomValues().'],
              ['Key derivation (PBKDF2)', 'Your password is processed through PBKDF2-SHA-256 with 100,000 iterations to produce a 256-bit encryption key.'],
              ['AES-256-GCM encryption', 'The file is encrypted with a unique 96-bit IV. GCM mode adds authentication — any tampering is detected on decryption.'],
              ['Output format', 'The output file contains: salt (16 bytes) + IV (12 bytes) + ciphertext. No password information is stored anywhere.'],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-800 text-purple-200 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div><span className="text-gray-900 dark:text-white font-medium">{title}</span> — {desc}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ */}
        <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={e => { e.preventDefault(); setFaqOpen(faqOpen === i ? null : i) }}>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left">{faq.q}</h3>
                  <span className="text-purple-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="File Encryptor"
          toolSlug="file-encryptor"
          toolUrl="https://roughtools.com/tools/security/file-encryptor"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
