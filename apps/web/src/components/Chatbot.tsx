'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Knowledge base ───────────────────────────────────────────
const KB: { q: string[]; a: string }[] = [
  {
    q: ['hello', 'hi', 'hey', 'what can you do', 'help'],
    a: "Hi! 👋 I'm the Roughtools assistant. Ask me about any tool, category, or how to get started. Type something like **\"PDF tools\"**, **\"resize image\"**, or **\"what is roughtools\"**.",
  },
  {
    q: ['what is roughtools', 'about roughtools', 'what is this site', 'what does this site do'],
    a: '**Roughtools.com** is a free online toolbox with 200+ utilities. No sign-up, no watermark, no downloads needed — everything runs right in your browser. Tools span PDF editing, image processing, calculators, developer utilities, legal docs, real estate, and more.',
  },
  {
    q: ['free', 'cost', 'price', 'paid', 'subscription', 'signup', 'account'],
    a: 'Every tool is **100 % free** with up to 20 uses per day. No account or credit card required. Just open the tool and start working!',
  },
  {
    q: ['pdf', 'pdf tool', 'pdf to word', 'compress pdf', 'merge pdf', 'split pdf', 'convert pdf'],
    a: 'We have **26 PDF tools** including:\n• PDF to Word / Excel / PPT\n• Compress PDF\n• Merge & Split PDF\n• PDF to JPG\n• Add watermark, rotate, unlock PDF\n\nGo to **Tools → PDF Tools** to see them all.',
  },
  {
    q: ['image', 'photo', 'picture', 'resize', 'compress image', 'crop', 'background remove', 'convert image'],
    a: 'Our **Image Tools** (38 tools) include:\n• Resize, crop, compress images\n• Remove background\n• Convert between JPG, PNG, WebP, AVIF\n• Add watermark, flip, rotate\n• Colour picker, EXIF viewer\n\nHead to **Tools → Image Tools**.',
  },
  {
    q: ['calculator', 'bmi', 'mortgage', 'loan', 'tax', 'tip', 'percentage'],
    a: 'We offer **21 calculators**:\n• BMI, calorie & body fat\n• Mortgage, loan EMI, compound interest\n• Tax, GST & VAT\n• Tip, percentage, discount\n• Age, date difference\n\nFind them under **Tools → Calculators**.',
  },
  {
    q: ['developer', 'json', 'base64', 'regex', 'html', 'css', 'minify', 'formatter', 'encode', 'decode'],
    a: '**20 developer tools** including:\n• JSON formatter & validator\n• Base64 encode/decode\n• URL encode/decode\n• Regex tester\n• HTML minifier & beautifier\n• Diff checker, UUID generator\n\nSee **Tools → Developer**.',
  },
  {
    q: ['text', 'word count', 'word counter', 'case converter', 'lorem ipsum', 'palindrome', 'slug'],
    a: '**Text Tools** (10 tools):\n• Word & character counter\n• Case converter (UPPER, lower, Title)\n• Lorem ipsum generator\n• Slug generator\n• Palindrome checker\n\nVisit **Tools → Text Tools**.',
  },
  {
    q: ['convert', 'unit', 'length', 'weight', 'temperature', 'currency'],
    a: '**8 unit converters**:\n• Length, weight, temperature\n• Speed, area, volume\n• Time zone converter\n• Currency converter (live rates)\n\nSee **Tools → Converters**.',
  },
  {
    q: ['network', 'ip', 'dns', 'whois', 'ping', 'port', 'ssl'],
    a: '**Network tools** (6 tools):\n• IP lookup & geolocation\n• DNS lookup\n• WHOIS lookup\n• Port scanner\n• SSL certificate checker\n\nFind them at **Tools → Network**.',
  },
  {
    q: ['security', 'password', 'hash', 'md5', 'sha', 'encrypt', 'random'],
    a: '**Security tools** (8 tools):\n• Strong password generator\n• MD5, SHA-1, SHA-256 hash\n• HMAC generator\n• Random token generator\n• bcrypt password hasher\n\nSee **Tools → Security**.',
  },
  {
    q: ['legal', 'contract', 'agreement', 'nda', 'invoice', 'affidavit', 'template'],
    a: '**50 legal tools** covering:\n• NDA, employment contracts\n• Lease & rental agreements\n• Service agreements\n• Invoice & receipt templates\n• Affidavits, power of attorney\n\nSee **Tools → Legal Tools**.',
  },
  {
    q: ['real estate', 'property', 'mortgage calculator', 'rent', 'roi', 'cap rate'],
    a: '**42 real-estate tools** including:\n• Mortgage payment calculator\n• Rent vs. Buy analyser\n• Cap rate & ROI calculator\n• Property tax estimator\n• Amortisation schedule\n\nVisit **Tools → Real Estate**.',
  },
  {
    q: ['resume', 'cv', 'template', 'resume builder', 'download resume'],
    a: 'Our **Resume Builder** has 100+ professional templates. Pick a style, fill in your details, and download a polished PDF instantly — for free!\n\nGo to **Tools → Resume Builder**.',
  },
  {
    q: ['privacy', 'data', 'safe', 'secure', 'upload', 'file'],
    a: "Your privacy matters. Files uploaded to Roughtools are **deleted within 1 hour** and are never shared or sold. Most tools run entirely in your browser and don't upload anything at all.",
  },
  {
    q: ['contact', 'feedback', 'bug', 'report', 'support', 'email'],
    a: 'Found a bug or want to suggest a tool? Reach us on:\n• **Twitter/X** — @roughtools\n• **Instagram** — @roughtools\n• **LinkedIn** — linkedin.com/company/roughtools\n• **GitHub** — github.com/roughtools',
  },
  {
    q: ['social', 'twitter', 'instagram', 'linkedin', 'github'],
    a: 'Follow Roughtools on social media:\n• Twitter/X: **@roughtools**\n• Instagram: **@roughtools**\n• LinkedIn: **roughtools**\n• GitHub: **roughtools**',
  },
]

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim()
  let best: { score: number; answer: string } = { score: 0, answer: '' }

  for (const entry of KB) {
    for (const keyword of entry.q) {
      if (lower.includes(keyword)) {
        const score = keyword.length
        if (score > best.score) best = { score, answer: entry.a }
      }
    }
  }

  return best.answer ||
    "I'm not sure about that yet. Try asking about a specific tool category like **PDF**, **Image**, **Calculator**, **Developer**, **Resume**, or **Legal**. Or visit our site and search directly!"
}

// ─── Markdown-lite renderer ───────────────────────────────────
function renderMd(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g)
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    )
    if (line.startsWith('•')) {
      return <li key={i} className="ml-3 list-none">{rendered}</li>
    }
    return <p key={i} className={i > 0 ? 'mt-1' : ''}>{rendered}</p>
  })
}

// ─── Message types ────────────────────────────────────────────
interface Msg {
  from: 'bot' | 'user'
  text: string
  id: number
}

let msgId = 0

// ─── Main Chatbot component ───────────────────────────────────
export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'bot',
      text: "Hi! 👋 Welcome to **Roughtools.com**. I can help you find the right tool. Try asking about **PDF**, **images**, **calculators**, **developer tools**, **legal templates**, or **resume builder**!",
      id: ++msgId,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const send = useCallback(() => {
    const text = input.trim()
    if (!text) return
    const userMsg: Msg = { from: 'user', text, id: ++msgId }
    setMsgs((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate a slight delay for realism
    setTimeout(() => {
      const answer = findAnswer(text)
      setTyping(false)
      setMsgs((prev) => [...prev, { from: 'bot', text: answer, id: ++msgId }])
    }, 600 + Math.random() * 300)
  }, [input])

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        send()
      }
    },
    [send]
  )

  return (
    <>
      {/* ── Chat window ── */}
      <div
        className={`
          fixed bottom-20 right-4 sm:right-6 z-50
          w-[calc(100vw-2rem)] max-w-sm
          bg-white rounded-2xl shadow-2xl border border-gray-200
          flex flex-col overflow-hidden
          transition-all duration-300 origin-bottom-right
          ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'}
        `}
        style={{ maxHeight: '480px' }}
        role="dialog"
        aria-label="Roughtools assistant"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <span className="text-xl" aria-hidden="true">🤖</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight">Roughtools Assistant</p>
            <p className="text-[10px] text-indigo-200">Ask me anything about our tools</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm" style={{ minHeight: 0 }}>
          {msgs.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.from === 'bot' && (
                <span className="mr-2 mt-0.5 text-base flex-shrink-0" aria-hidden="true">🤖</span>
              )}
              <div
                className={`
                  max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed
                  ${msg.from === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }
                `}
              >
                {msg.from === 'bot' ? renderMd(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start">
              <span className="mr-2 text-base" aria-hidden="true">🤖</span>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
          {['PDF tools', 'Resume builder', 'Free?', 'Privacy'].map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); setTimeout(send, 0) }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-3 py-2 flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about any tool…"
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            aria-label="Type your question"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="flex-shrink-0 p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── FAB toggle button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          fixed bottom-4 right-4 sm:right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-indigo-600 to-purple-600
          text-white shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 active:scale-95
          ${open ? 'rotate-0' : ''}
        `}
        aria-label={open ? 'Close assistant' : 'Open Roughtools assistant'}
        aria-expanded={open}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
        {/* Notification dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            1
          </span>
        )}
      </button>
    </>
  )
}
