'use client'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

// ─── Crypto-secure generation ─────────────────────────────────
function cryptoRandom(max: number): number {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return arr[0] % max
}

function generateStandardPassword(opts: {
  length: number; upper: boolean; lower: boolean
  digits: boolean; symbols: boolean; ambiguous: boolean
}): string {
  let pool = ''
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const LOWER = 'abcdefghijklmnopqrstuvwxyz'
  const DIGITS = '0123456789'
  const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?'
  const AMBIGUOUS_RE = /[0OIl1]/g

  if (opts.upper) pool += UPPER
  if (opts.lower) pool += LOWER
  if (opts.digits) pool += DIGITS
  if (opts.symbols) pool += SYMBOLS
  if (!opts.ambiguous) pool = pool.replace(AMBIGUOUS_RE, '')
  if (!pool) return ''

  let pwd = ''
  // Ensure at least one of each required charset
  if (opts.upper) pwd += UPPER.replace(AMBIGUOUS_RE, '')[cryptoRandom(opts.ambiguous ? UPPER.length : UPPER.replace(AMBIGUOUS_RE,'').length)]
  if (opts.lower) pwd += LOWER.replace(AMBIGUOUS_RE, '')[cryptoRandom(opts.ambiguous ? LOWER.length : LOWER.replace(AMBIGUOUS_RE,'').length)]
  if (opts.digits) pwd += DIGITS[cryptoRandom(DIGITS.length)]
  if (opts.symbols) pwd += SYMBOLS[cryptoRandom(SYMBOLS.length)]

  while (pwd.length < opts.length) pwd += pool[cryptoRandom(pool.length)]

  // Shuffle
  return pwd.split('').sort(() => cryptoRandom(3) - 1).join('').slice(0, opts.length)
}

const WORDLIST = ['correct','horse','battery','staple','cloud','river','stone','delta','falcon','maple','cedar','ocean','solar','amber','crimson','noble','swift','lunar','prism','vortex','ember','frost','gleam','haven','ivory','jasper','kelp','lumen','mossy','nexus','oasis','pearl','quartz','ridge','silva','terra','ultra','vivid','wheat','xenon','yield','zephyr']

function generatePassphrase(wordCount: number, separator: string, capitalize: boolean, addNumber: boolean): string {
  let words = Array.from({length: wordCount}, () => WORDLIST[cryptoRandom(WORDLIST.length)])
  if (capitalize) words = words.map(w => w[0].toUpperCase() + w.slice(1))
  let phrase = words.join(separator)
  if (addNumber) phrase += separator + cryptoRandom(9999).toString().padStart(4, '0')
  return phrase
}

function generatePIN(length: number, grouping: boolean): string {
  const digits = Array.from({length}, () => cryptoRandom(10).toString()).join('')
  if (!grouping || length < 8) return digits
  return digits.match(/.{1,4}/g)?.join('-') ?? digits
}

// ─── Entropy & Strength ───────────────────────────────────────
function calcEntropy(password: string): number {
  if (!password) return 0
  const chars = new Set(password).size
  const poolSize = (() => {
    let s = 0
    if (/[a-z]/.test(password)) s += 26
    if (/[A-Z]/.test(password)) s += 26
    if (/[0-9]/.test(password)) s += 10
    if (/[^a-zA-Z0-9]/.test(password)) s += 32
    return s || chars
  })()
  return Math.round(password.length * Math.log2(poolSize))
}

function getStrength(entropy: number): { label: string; color: string; bg: string; pct: number } {
  if (entropy < 28) return { label: 'Very Weak', color: 'text-red-400', bg: 'bg-red-500', pct: 10 }
  if (entropy < 36) return { label: 'Weak', color: 'text-orange-400', bg: 'bg-orange-500', pct: 30 }
  if (entropy < 60) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500', pct: 55 }
  if (entropy < 80) return { label: 'Strong', color: 'text-green-400', bg: 'bg-green-500', pct: 75 }
  if (entropy < 120) return { label: 'Very Strong', color: 'text-emerald-400', bg: 'bg-emerald-500', pct: 90 }
  return { label: 'Excellent', color: 'text-cyan-400', bg: 'bg-cyan-400', pct: 100 }
}

// ─── FAQ JSON-LD ──────────────────────────────────────────────
const FAQS = [
  { q: 'Is this password generator free to use?', a: 'Yes, the Roughtools Password Generator is completely free with no hidden charges, subscriptions, or premium tiers. You can generate unlimited passwords of any length and complexity without creating an account. Roughtools is funded through non-intrusive advertising, which keeps every tool on the site permanently free for all users worldwide, whether you need one password or generate hundreds daily for a business.' },
  { q: 'Do I need to create an account or sign up?', a: 'No account, sign-up, email address, or personal information is required at any stage. Open the page, configure your options, and your password is generated instantly in your browser. Nothing is transmitted to any server — all generation happens locally using your device\'s cryptographic hardware. There are no usage limits, no sessions, and no tracking of generated passwords.' },
  { q: 'Is my generated password stored or sent anywhere?', a: 'No. Every password is generated entirely within your browser using the Web Cryptography API — specifically crypto.getRandomValues(), which is the browser\'s built-in cryptographically secure random number generator. Your passwords are never transmitted to Roughtools servers, logged, stored, or shared. Once you close the tab, the generated password is gone — we have no record of it.' },
  { q: 'Does this password generator work on mobile and tablet?', a: 'Yes. The Password Generator is fully responsive and works on all modern smartphones and tablets running iOS 14+ or Android 8+. The touch-friendly interface supports all generation modes including Standard, Passphrase, and PIN. The copy-to-clipboard button works on mobile browsers. For iOS Safari, if copy does not work, simply tap the password field and use the standard iOS text selection to copy.' },
  { q: 'Which browsers support this password generator?', a: 'The generator works in all modern browsers that support the Web Cryptography API: Google Chrome 37+, Mozilla Firefox 34+, Microsoft Edge 12+, Safari 11+, and Opera 24+. All current versions of these browsers are fully supported. The tool does not work in Internet Explorer, which lacks the crypto.getRandomValues API. For maximum security and compatibility, we recommend using the latest version of Chrome, Firefox, or Edge.' },
  { q: 'How random and secure is the generated password?', a: 'Passwords are generated using crypto.getRandomValues(), the Web Cryptography API\'s cryptographically secure pseudorandom number generator (CSPRNG). Unlike Math.random() — which is predictable and unsuitable for security — crypto.getRandomValues() sources entropy from the operating system\'s secure random pool (equivalent to /dev/urandom on Linux or BCryptGenRandom on Windows). This is the same source used by password managers and security software. The entropy score displayed tells you exactly how mathematically unpredictable your password is.' },
  { q: 'What is password entropy and what score should I aim for?', a: 'Password entropy is a measure of unpredictability expressed in bits. The higher the entropy, the longer a brute-force attack takes to crack the password. A 28-bit password can be cracked instantly; 60 bits requires years with current hardware; 80+ bits is effectively uncrackable with foreseeable computing power. For online account passwords, aim for 60+ bits (Strong). For encryption keys, database passwords, or master passwords, aim for 80+ bits (Very Strong or Excellent). The entropy score updates in real time as you adjust settings.' },
  { q: 'How do I generate a strong password with this tool?', a: 'To generate a strong password: (1) Select "Standard" mode. (2) Set the length slider to at least 16 characters — longer is always better. (3) Enable uppercase, lowercase, digits, and symbols for maximum character variety. (4) Optionally toggle "Exclude Ambiguous Characters" to avoid 0, O, l, and 1 confusion. (5) Click the refresh icon or change any setting to generate a new password. (6) Click "Copy" and paste it directly into a password manager. Never reuse generated passwords across multiple accounts.' },
  { q: 'Why should I use Roughtools instead of other password generators?', a: 'Roughtools Password Generator uses crypto.getRandomValues() for cryptographically secure generation — the same standard used by professional security tools. Unlike many online generators that use Math.random() (which is not cryptographically secure), or generators that transmit passwords to their servers for logging, this tool generates everything locally in your browser with no server communication whatsoever. It also provides entropy scoring, passphrase mode for memorable-yet-secure passwords, and PIN mode, all in a clean, ad-light interface with no registration required.' },
  { q: 'How do I report a bug or suggest a new feature?', a: 'To report a bug or suggest a feature improvement for the Password Generator, use the feedback link in the site footer or visit the Roughtools contact page. When reporting a bug, please include: the browser name and version, operating system, what you were trying to do, and what happened instead. Feature requests such as new character sets, export options, or additional generation modes are reviewed regularly and the most-requested features are prioritised in development.' },
]

export default function PasswordGenerator() {
  // Mode
  const [mode, setMode] = useState<'standard'|'passphrase'|'pin'>('standard')

  // Standard options
  const [length, setLength] = useState(20)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [ambiguous, setAmbiguous] = useState(false)
  const [count, setCount] = useState(1)

  // Passphrase options
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [capitalizeWords, setCapitalizeWords] = useState(true)
  const [addNumber, setAddNumber] = useState(true)

  // PIN options
  const [pinLength, setPinLength] = useState(6)
  const [pinGrouping, setPinGrouping] = useState(true)

  // Output
  const [passwords, setPasswords] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number|null>(null)
  const [faqOpen, setFaqOpen] = useState<number|null>(null)

  const generate = useCallback(() => {
    const list: string[] = []
    for (let i = 0; i < count; i++) {
      if (mode === 'standard') {
        list.push(generateStandardPassword({ length, upper, lower, digits, symbols, ambiguous }))
      } else if (mode === 'passphrase') {
        list.push(generatePassphrase(wordCount, separator, capitalizeWords, addNumber))
      } else {
        list.push(generatePIN(pinLength, pinGrouping))
      }
    }
    setPasswords(list)
    setCopiedIdx(null)
  }, [mode, length, upper, lower, digits, symbols, ambiguous, count, wordCount, separator, capitalizeWords, addNumber, pinLength, pinGrouping])

  useEffect(() => { generate() }, [generate])

  const copy = (idx: number) => {
    navigator.clipboard.writeText(passwords[idx] || '')
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const entropy = calcEntropy(passwords[0] || '')
  const strength = getStrength(entropy)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>Security Tools
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <h1 className="font-bold text-gray-900 dark:text-white text-sm">Password Generator</h1>
          <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 px-2 py-0.5 rounded-full">🔒 Client-Side Only</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Cryptographically Secure Password Generator</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Uses <code className="text-green-400 bg-gray-200 dark:bg-gray-900 px-1 rounded text-xs">crypto.getRandomValues()</code> — the same CSPRNG used by security software. Never Math.random(). Zero server communication.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['CSPRNG', 'No Server', 'Entropy Score', '100% Free'].map(b => (
                <span key={b} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {(['standard','passphrase','pin'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${mode === m ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {m === 'standard' ? '🔐 Standard' : m === 'passphrase' ? '📝 Passphrase' : '🔢 PIN'}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-5">
            {/* Output(s) */}
            <div className="space-y-2">
              {passwords.map((pwd, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="font-mono text-base text-green-700 dark:text-green-400 flex-1 break-all select-all">{pwd || '—'}</span>
                  <button onClick={() => copy(i)}
                    className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${copiedIdx === i ? 'bg-green-700 text-green-100' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}>
                    {copiedIdx === i ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            {/* Strength bar (first password) */}
            {passwords[0] && mode === 'standard' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Strength</span>
                  <span className={strength.color}>{strength.label} — {entropy} bits entropy</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.bg}`} style={{ width: `${strength.pct}%` }} />
                </div>
              </div>
            )}

            {/* Standard Options */}
            {mode === 'standard' && (
              <>
                <div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span>Length</span>
                    <span className="font-bold text-gray-900 dark:text-white">{length} characters</span>
                  </div>
                  <input type="range" min={4} max={128} value={length} onChange={e => setLength(+e.target.value)}
                    className="w-full accent-indigo-500 cursor-pointer" />
                  <div className="flex justify-between text-xs text-gray-600 mt-1"><span>4</span><span>128</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    [upper, setUpper, 'Uppercase (A–Z)'],
                    [lower, setLower, 'Lowercase (a–z)'],
                    [digits, setDigits, 'Digits (0–9)'],
                    [symbols, setSymbols, 'Symbols (!@#$%)'],
                    [!ambiguous, (v: boolean) => setAmbiguous(!v), 'Exclude Ambiguous (0,O,l,1,I)'],
                  ].map(([val, setVal, label]: any) => (
                    <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                      <div onClick={() => setVal(!val)}
                        className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${val ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400'}`}>
                        {val && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Generate</span>
                  <select value={count} onChange={e => setCount(+e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {[1,3,5,10].map(n => <option key={n} value={n}>{n} password{n>1?'s':''}</option>)}
                  </select>
                  <span className="text-sm text-gray-700 dark:text-gray-300">at once</span>
                </div>
              </>
            )}

            {/* Passphrase Options */}
            {mode === 'passphrase' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span>Word Count</span><span className="font-bold text-gray-900 dark:text-white">{wordCount} words</span>
                  </div>
                  <input type="range" min={3} max={8} value={wordCount} onChange={e => setWordCount(+e.target.value)} className="w-full accent-indigo-500 cursor-pointer"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Word Separator</label>
                    <select value={separator} onChange={e => setSeparator(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {['-','_','.','+','@','#',' ',''].map(s => <option key={s||'none'} value={s}>{s || '(none)'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[[capitalizeWords, setCapitalizeWords, 'Capitalize First Letter'],[addNumber, setAddNumber, 'Append Random Number']].map(([val, setVal, label]: any) => (
                    <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                      <div onClick={() => setVal(!val)}
                        className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${val ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 dark:border-gray-600'}`}>
                        {val && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400">
                  💡 Passphrases like <code className="text-indigo-400">Correct-Horse-Battery-Staple-1987</code> are easier to remember and can have higher entropy than random character passwords when using 4+ words.
                </div>
              </div>
            )}

            {/* PIN Options */}
            {mode === 'pin' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span>PIN Length</span><span className="font-bold text-gray-900 dark:text-white">{pinLength} digits</span>
                  </div>
                  <input type="range" min={4} max={12} value={pinLength} onChange={e => setPinLength(+e.target.value)} className="w-full accent-indigo-500 cursor-pointer"/>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div onClick={() => setPinGrouping(!pinGrouping)}
                    className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center cursor-pointer ${pinGrouping ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400 dark:border-gray-600'}`}>
                    {pinGrouping && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Group digits (e.g. 1234-5678)</span>
                </label>
              </div>
            )}

            <button onClick={generate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Generate New Password{count > 1 ? 's' : ''}
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'CSPRNG', desc: 'crypto.getRandomValues() — cryptographically secure' },
            { icon: '🚫', title: 'Zero Logging', desc: 'No passwords stored or transmitted anywhere' },
            { icon: '📱', title: 'Offline-Ready', desc: 'Works without internet once page loads' },
          ].map(c => (
            <div key={c.title} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white text-xs mb-1">{c.title}</div>
              <div className="text-gray-600 dark:text-gray-500 text-xs">{c.desc}</div>
            </div>
          ))}
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
                  <span className="text-indigo-400 font-bold text-lg flex-shrink-0 ml-3">{faqOpen === i ? '−' : '+'}</span>
                </summary>
                {faqOpen === i && (
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-800">{faq.a}</div>
                )}
              </details>
            ))}
          </div>
        </section>
        <ToolPageExtras
          toolName="Password Generator"
          toolSlug="password-generator"
          toolUrl="https://roughtools.com/tools/security/password-generator"
          type="general"
          showPDF
        />
        <ToolAdUnit position="bottom" />
      </div>
    </div>
  )
}
