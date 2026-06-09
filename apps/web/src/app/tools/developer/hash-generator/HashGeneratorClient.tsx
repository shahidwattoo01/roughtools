'use client'
import { useState, useCallback, useRef } from 'react'
import type { CSSProperties } from 'react'

// ─── Style tokens ─────────────────────────────────────────────────────────────
const CARD: CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-strong)', borderRadius: 16, padding: '20px 24px',
}
const INPUT_BOX: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-strong)',
  color: '#fff', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box',
}
const LABEL: CSSProperties = {
  display: 'block', marginBottom: 5, fontSize: 12,
  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
}
const BTN_GHOST: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
  borderRadius: 8, padding: '8px 16px', color: '#c4b5fd', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
}

// ─── Inline MD5 (RFC 1321) ────────────────────────────────────────────────────
function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw=(x&0xFFFF)+(y&0xFFFF); const msw=(x>>16)+(y>>16)+(lsw>>16); return (msw<<16)|(lsw&0xFFFF) }
  function bitRotL(num: number, cnt: number) { return (num<<cnt)|(num>>>(32-cnt)) }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotL(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b) }
  function ff(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn((b&c)|((~b)&d),a,b,x,s,t)}
  function gg(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn((b&d)|(c&(~d)),a,b,x,s,t)}
  function hh(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn(b^c^d,a,b,x,s,t)}
  function ii(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn(c^(b|(~d)),a,b,x,s,t)}
  function str2binl(str: string) {
    const bin: number[] = []; const mask = (1<<8)-1
    for (let i=0;i<str.length*8;i+=8) bin[i>>5]|=(str.charCodeAt(i/8)&mask)<<(i%32)
    return bin
  }
  function binl2hex(ba: number[]) {
    const hc='0123456789abcdef'; let s=''
    for (let i=0;i<ba.length*4;i++) s+=hc[(ba[i>>2]>>((i%4)*8+4))&0xF]+hc[(ba[i>>2]>>((i%4)*8))&0xF]
    return s
  }
  function binlMD5(x: number[], len: number) {
    x[len>>5]|=0x80<<(len%32); x[(((len+64)>>>9)<<4)+14]=len
    let a=1732584193,b=-271733879,c=-1732584194,d=271733878
    for (let i=0;i<x.length;i+=16) {
      const oa=a,ob=b,oc=c,od=d
      a=ff(a,b,c,d,x[i+0],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330)
      a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983)
      a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162)
      a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329)
      a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i+0],20,-373897302)
      a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848)
      a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501)
      a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734)
      a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556)
      a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640)
      a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+0],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189)
      a=hh(a,b,c,d,x[i+9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+2],23,-995338651)
      a=ii(a,b,c,d,x[i+0],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055)
      a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799)
      a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649)
      a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551)
      a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od)
    }
    return [a,b,c,d]
  }
  const latin1 = unescape(encodeURIComponent(input))
  return binl2hex(binlMD5(str2binl(latin1), latin1.length*8))
}

// ─── SHA via SubtleCrypto ─────────────────────────────────────────────────────
async function shaHex(algo: string, data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest(algo, data as unknown as ArrayBuffer)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmacSha256Hex(key: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function hexToBase64(hex: string): string {
  const bytes = hex.match(/.{2}/g)?.map(b => parseInt(b, 16)) ?? []
  return btoa(String.fromCharCode(...bytes))
}

type HashResult = { label: string; hex: string; algo: string }
type Mode = 'text' | 'file' | 'compare' | 'hmac'
type Encoding = 'hex' | 'base64'

export default function HashGeneratorClient() {
  const [mode, setMode] = useState<Mode>('text')
  const [input, setInput] = useState('')
  const [input2, setInput2] = useState('')
  const [hmacKey, setHmacKey] = useState('')
  const [hashes, setHashes] = useState<HashResult[]>([])
  const [hashes2, setHashes2] = useState<HashResult[]>([])
  const [hmacResult, setHmacResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileProgress, setFileProgress] = useState(0)
  const [copied, setCopied] = useState('')
  const [encoding, setEncoding] = useState<Encoding>('hex')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const formatHash = useCallback((hex: string) => {
    if (encoding === 'base64') return hexToBase64(hex)
    return hex
  }, [encoding])

  async function computeHashes(text: string): Promise<HashResult[]> {
    const enc = new TextEncoder()
    const data = enc.encode(text)
    const [sha1, sha256, sha512] = await Promise.all([
      shaHex('SHA-1', data), shaHex('SHA-256', data), shaHex('SHA-512', data),
    ])
    return [
      { label: 'MD5', hex: md5(text), algo: 'MD5' },
      { label: 'SHA-1', hex: sha1, algo: 'SHA-1' },
      { label: 'SHA-256', hex: sha256, algo: 'SHA-256' },
      { label: 'SHA-512', hex: sha512, algo: 'SHA-512' },
    ]
  }

  async function generate() {
    if (!input.trim()) return
    setLoading(true)
    const results = await computeHashes(input)
    setHashes(results)
    if (mode === 'compare' && input2.trim()) {
      const results2 = await computeHashes(input2)
      setHashes2(results2)
    }
    if (mode === 'hmac' && hmacKey) {
      const h = await hmacSha256Hex(hmacKey, input)
      setHmacResult(h)
    }
    setLoading(false)
  }

  async function hashFile(file: File) {
    setLoading(true); setFileProgress(0)
    const chunkSize = 2 * 1024 * 1024
    const chunks: Uint8Array[] = []
    let offset = 0
    while (offset < file.size) {
      const slice = file.slice(offset, offset + chunkSize)
      const buf = await slice.arrayBuffer()
      chunks.push(new Uint8Array(buf))
      offset += chunkSize
      setFileProgress(Math.round((offset / file.size) * 100))
    }
    const total = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0))
    let pos = 0
    for (const c of chunks) { total.set(c, pos); pos += c.length }
    const text = new TextDecoder().decode(total)
    const [sha1, sha256, sha512] = await Promise.all([
      shaHex('SHA-1', total), shaHex('SHA-256', total), shaHex('SHA-512', total),
    ])
    setHashes([
      { label: 'MD5', hex: md5(text), algo: 'MD5' },
      { label: 'SHA-1', hex: sha1, algo: 'SHA-1' },
      { label: 'SHA-256', hex: sha256, algo: 'SHA-256' },
      { label: 'SHA-512', hex: sha512, algo: 'SHA-512' },
    ])
    setLoading(false); setFileProgress(100)
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 1500) })
  }

  const modes: Mode[] = ['text', 'file', 'compare', 'hmac']
  const modeLabels: Record<Mode, string> = { text: 'Text', file: 'File', compare: 'Compare', hmac: 'HMAC' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {modes.map(m => (
          <button key={m} onClick={() => { setMode(m); setHashes([]); setHashes2([]) }}
            style={mode === m ? { ...BTN_GHOST, background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.6)' } : BTN_GHOST}>
            {modeLabels[m]}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {(['hex', 'base64'] as Encoding[]).map(e => (
            <button key={e} onClick={() => setEncoding(e)}
              style={encoding === e ? { ...BTN_GHOST, background: 'rgba(99,102,241,0.25)' } : BTN_GHOST}>
              {e.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div style={CARD}>
        {mode === 'text' && (
          <>
            <label style={LABEL}>Input Text</label>
            <textarea
              style={{ ...INPUT_BOX, minHeight: 100, resize: 'vertical' }}
              value={input}
              onChange={e => { setInput(e.target.value); setHashes([]) }}
              placeholder="Enter text to hash..."
              spellCheck={false}
            />
          </>
        )}

        {mode === 'file' && (
          <>
            <label style={LABEL}>Drop file or click to upload</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) hashFile(f) }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(139,92,246,0.3)'}`,
                borderRadius: 10, padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0.2)',
                color: 'var(--fg-3)', fontSize: 14, transition: 'all 0.15s',
              }}
            >
              {loading ? `Hashing… ${fileProgress}%` : 'Drop a file here, or click to browse'}
            </div>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) hashFile(f) }} />
            {loading && (
              <div style={{ marginTop: 8, height: 4, background: 'rgba(99,102,241,0.2)', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${fileProgress}%`, background: '#6366f1', borderRadius: 4, transition: 'width 0.2s' }} />
              </div>
            )}
          </>
        )}

        {mode === 'compare' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={LABEL}>Input A</label>
              <textarea style={{ ...INPUT_BOX, minHeight: 80, resize: 'vertical' }} value={input} onChange={e => { setInput(e.target.value); setHashes([]); setHashes2([]) }} spellCheck={false} />
            </div>
            <div>
              <label style={LABEL}>Input B</label>
              <textarea style={{ ...INPUT_BOX, minHeight: 80, resize: 'vertical' }} value={input2} onChange={e => { setInput2(e.target.value); setHashes([]); setHashes2([]) }} spellCheck={false} />
            </div>
          </div>
        )}

        {mode === 'hmac' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={LABEL}>Message</label>
              <textarea style={{ ...INPUT_BOX, minHeight: 80, resize: 'vertical' }} value={input} onChange={e => { setInput(e.target.value); setHashes([]) }} spellCheck={false} />
            </div>
            <div>
              <label style={LABEL}>HMAC Secret Key</label>
              <input type="password" style={INPUT_BOX} value={hmacKey} onChange={e => setHmacKey(e.target.value)} placeholder="Enter secret key..." />
            </div>
          </div>
        )}

        {mode !== 'file' && (
          <button
            onClick={generate}
            disabled={!input.trim() || loading}
            style={{ ...BTN_GHOST, marginTop: 14, opacity: input.trim() && !loading ? 1 : 0.5, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}
          >
            {loading ? 'Computing…' : 'Generate Hashes'}
          </button>
        )}
      </div>

      {/* Hash results */}
      {hashes.length > 0 && (
        <div style={CARD}>
          <label style={LABEL}>Hash Results ({encoding.toUpperCase()})</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {hashes.map(({ label, hex }) => {
              const val = formatHash(hex)
              const match2 = hashes2.find(h => h.label === label)
              const compareStatus = match2 ? formatHash(match2.hex) === val ? 'match' : 'differ' : null
              return (
                <div key={label} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: `1px solid ${compareStatus === 'match' ? 'rgba(74,222,128,0.3)' : compareStatus === 'differ' ? 'rgba(248,113,113,0.3)' : 'var(--line-strong)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#c4b5fd', fontWeight: 700 }}>{label}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {compareStatus && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: compareStatus === 'match' ? '#4ade80' : '#f87171' }}>
                          {compareStatus === 'match' ? 'MATCH' : 'DIFFER'}
                        </span>
                      )}
                      <button onClick={() => copy(val, label)} style={{ ...BTN_GHOST, padding: '3px 10px', fontSize: 11 }}>
                        {copied === label ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--fg-2)', wordBreak: 'break-all', lineHeight: 1.5 }}>{val}</div>
                </div>
              )
            })}
          </div>
          {mode === 'hmac' && hmacResult && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#c4b5fd', fontWeight: 700 }}>HMAC-SHA256</span>
                <button onClick={() => copy(formatHash(hmacResult), 'hmac')} style={{ ...BTN_GHOST, padding: '3px 10px', fontSize: 11 }}>
                  {copied === 'hmac' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--fg-2)', wordBreak: 'break-all' }}>{formatHash(hmacResult)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
