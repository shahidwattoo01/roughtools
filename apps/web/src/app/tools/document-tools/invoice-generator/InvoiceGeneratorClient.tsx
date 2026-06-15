'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ToolPageExtras } from '@/components/ToolPageExtras'
import ToolAdUnit from '@/components/ToolAdUnit'

// ─── Types ────────────────────────────────────────────────────

type Template = 'professional' | 'modern' | 'minimal' | 'executive'
type DiscountType = 'percent' | 'fixed'

interface Party {
  logo: string; company: string; name: string
  address: string; city: string; state: string; zip: string; country: string
  email: string; phone: string; website: string; taxId: string
}

interface LineItem {
  id: string; description: string; detail: string
  qty: string; unit: string; price: string; taxRate: string; discount: string
}

interface BankDetails {
  bankName: string; accountName: string; accountNumber: string
  routingNumber: string; iban: string; swift: string; note: string
}

interface InvoiceData {
  template: Template
  currency: string
  currencySymbol: string
  number: string; date: string; dueDate: string
  poNumber: string; paymentTerms: string
  from: Party; to: Party
  items: LineItem[]
  globalDiscount: string; globalDiscountType: DiscountType
  taxRate: string; taxLabel: string; taxEnabled: boolean
  shipping: string; shippingLabel: string
  notes: string; terms: string
  bank: BankDetails; showBank: boolean
}

// ─── Currencies ───────────────────────────────────────────────

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar' },
  { code: 'MXN', symbol: 'MX$', label: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', label: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', label: 'Danish Krone' },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee' },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal' },
  { code: 'KWD', symbol: 'KD', label: 'Kuwaiti Dinar' },
]

const PAYMENT_TERMS = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Net 90', '50% Upfront / 50% on Completion', 'Custom']
const UNITS = ['hour', 'day', 'week', 'month', 'unit', 'item', 'piece', 'kg', 'lb', 'km', 'mile', 'project', 'word', 'page']

const TEMPLATES: { id: Template; name: string; accent: string; preview: string }[] = [
  { id: 'professional', name: 'Professional', accent: '#2563eb', preview: 'Blue header, clean white body — ideal for corporate invoices' },
  { id: 'modern', name: 'Modern', accent: '#7c3aed', preview: 'Dark navy with purple accents — bold and contemporary' },
  { id: 'minimal', name: 'Minimal', accent: '#374151', preview: 'Light gray, thin borders — clean and elegant' },
  { id: 'executive', name: 'Executive', accent: '#1a1a1a', preview: 'Black header, gold accents — premium and authoritative' },
]

// ─── Helpers ─────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9)
const fmt = (n: number, sym: string, decimals = 2) => `${sym}${n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
const num = (s: string) => parseFloat(s) || 0

function blankItem(): LineItem {
  return { id: uid(), description: '', detail: '', qty: '1', unit: 'hour', price: '', taxRate: '0', discount: '0' }
}

function blankParty(): Party {
  return { logo: '', company: '', name: '', address: '', city: '', state: '', zip: '', country: '', email: '', phone: '', website: '', taxId: '' }
}

function getInitial(): InvoiceData {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('roughtools_invoice_v3')
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
  }
  const today = new Date()
  const due = new Date(today); due.setDate(due.getDate() + 30)
  return {
    template: 'professional',
    currency: 'USD', currencySymbol: '$',
    number: 'INV-001',
    date: today.toISOString().split('T')[0],
    dueDate: due.toISOString().split('T')[0],
    poNumber: '', paymentTerms: 'Net 30',
    from: blankParty(), to: blankParty(),
    items: [blankItem()],
    globalDiscount: '0', globalDiscountType: 'percent',
    taxRate: '0', taxLabel: 'Tax', taxEnabled: false,
    shipping: '0', shippingLabel: 'Shipping',
    notes: 'Thank you for your business!',
    terms: 'Payment is due within 30 days of invoice date. Late payments may be subject to a 1.5% monthly interest charge.',
    bank: { bankName: '', accountName: '', accountNumber: '', routingNumber: '', iban: '', swift: '', note: '' },
    showBank: false,
  }
}

// ─── Calculations ─────────────────────────────────────────────

function calcTotals(data: InvoiceData) {
  const subtotal = data.items.reduce((sum, item) => {
    const lineTotal = num(item.qty) * num(item.price)
    const lineDisc = lineTotal * num(item.discount) / 100
    return sum + lineTotal - lineDisc
  }, 0)

  const discAmt = data.globalDiscountType === 'percent'
    ? subtotal * num(data.globalDiscount) / 100
    : num(data.globalDiscount)

  const afterDiscount = subtotal - discAmt
  const taxAmt = data.taxEnabled ? afterDiscount * num(data.taxRate) / 100 : 0
  const shipping = num(data.shipping)
  const total = afterDiscount + taxAmt + shipping

  return { subtotal, discAmt, afterDiscount, taxAmt, shipping, total }
}

// ─── Shared UI ────────────────────────────────────────────────

const CLS = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white'
const LBL = 'block text-xs font-medium text-gray-500 mb-1'

function F({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className={LBL}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className={CLS} />
    </div>
  )
}

function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-gray-800 text-sm flex-1">{title}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  )
}

// ─── Party Editor ─────────────────────────────────────────────

function PartyEditor({ title: _title, value, onChange, showLogo = false }: {
  title: string; value: Party; onChange: (p: Party) => void; showLogo?: boolean
}) {
  const set = (k: keyof Party, v: string) => onChange({ ...value, [k]: v })

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('logo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="pt-4 space-y-3">
      {showLogo && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          {value.logo
            ? <img src={value.logo} alt="Logo" className="h-12 max-w-[120px] object-contain flex-shrink-0" />
            : <div className="h-12 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">Logo</div>
          }
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Company Logo (optional)</p>
            <div className="flex gap-2">
              <label className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-100">
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
              {value.logo && <button onClick={() => set('logo', '')} className="text-xs text-red-500 hover:underline">Remove</button>}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><F label="Company / Business Name" value={value.company} onChange={v => set('company', v)} placeholder="Acme Corporation" /></div>
        <F label="Contact Name" value={value.name} onChange={v => set('name', v)} placeholder="John Smith" />
        <F label="Email" value={value.email} onChange={v => set('email', v)} placeholder="billing@acme.com" type="email" />
        <F label="Phone" value={value.phone} onChange={v => set('phone', v)} placeholder="+1 555 000 0000" />
        <F label="Website" value={value.website} onChange={v => set('website', v)} placeholder="acme.com" />
        <div className="col-span-2"><F label="Street Address" value={value.address} onChange={v => set('address', v)} placeholder="123 Business Ave, Suite 100" /></div>
        <F label="City" value={value.city} onChange={v => set('city', v)} placeholder="New York" />
        <F label="State / Province" value={value.state} onChange={v => set('state', v)} placeholder="NY" />
        <F label="ZIP / Postal Code" value={value.zip} onChange={v => set('zip', v)} placeholder="10001" />
        <F label="Country" value={value.country} onChange={v => set('country', v)} placeholder="United States" />
        <div className="col-span-2"><F label="Tax ID / VAT Number (optional)" value={value.taxId} onChange={v => set('taxId', v)} placeholder="US-12-3456789" /></div>
      </div>
    </div>
  )
}

// ─── Line Items ───────────────────────────────────────────────

function LineItemsEditor({ items, onChange, sym }: {
  items: LineItem[]; onChange: (items: LineItem[]) => void; sym: string
}) {
  const upd = (id: string, k: keyof LineItem, v: string) =>
    onChange(items.map(it => it.id === id ? { ...it, [k]: v } : it))
  const del = (id: string) => onChange(items.filter(it => it.id !== id))
  const add = () => onChange([...items, blankItem()])

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-1 mb-1">
        <span className="col-span-4">Description</span>
        <span className="col-span-1">Qty</span>
        <span className="col-span-2">Unit</span>
        <span className="col-span-2">Price ({sym})</span>
        <span className="col-span-1">Tax %</span>
        <span className="col-span-1">Disc %</span>
        <span className="col-span-1 text-right">Amount</span>
      </div>

      {items.map((item) => {
        const lineTotal = num(item.qty) * num(item.price)
        const lineDisc = lineTotal * num(item.discount) / 100
        const lineAmt = lineTotal - lineDisc
        return (
          <div key={item.id} className="border border-gray-100 rounded-xl p-3 mb-2 bg-gray-50">
            <div className="sm:grid sm:grid-cols-12 gap-2 space-y-2 sm:space-y-0 items-center">
              <div className="col-span-4 space-y-1">
                <input value={item.description} onChange={e => upd(item.id, 'description', e.target.value)}
                  placeholder="Service / product description" className={`${CLS} text-sm font-medium`} />
                <input value={item.detail} onChange={e => upd(item.id, 'detail', e.target.value)}
                  placeholder="Additional details (optional)" className={`${CLS} text-xs text-gray-400`} />
              </div>
              <input type="number" value={item.qty} onChange={e => upd(item.id, 'qty', e.target.value)}
                className={`col-span-1 ${CLS}`} min="0" step="any" />
              <select value={item.unit} onChange={e => upd(item.id, 'unit', e.target.value)}
                className={`col-span-2 ${CLS}`}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <input type="number" value={item.price} onChange={e => upd(item.id, 'price', e.target.value)}
                placeholder="0.00" className={`col-span-2 ${CLS}`} min="0" step="any" />
              <input type="number" value={item.taxRate} onChange={e => upd(item.id, 'taxRate', e.target.value)}
                placeholder="0" className={`col-span-1 ${CLS}`} min="0" max="100" step="any" />
              <input type="number" value={item.discount} onChange={e => upd(item.id, 'discount', e.target.value)}
                placeholder="0" className={`col-span-1 ${CLS}`} min="0" max="100" step="any" />
              <div className="col-span-1 flex items-center justify-between sm:justify-end gap-2">
                <span className="text-sm font-semibold text-gray-700">{sym}{lineAmt.toFixed(2)}</span>
                {items.length > 1 && (
                  <button onClick={() => del(item.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <button onClick={add}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Line Item
      </button>
    </div>
  )
}

// ─── Totals Panel ─────────────────────────────────────────────

function TotalsPanel({ data, onChange }: { data: InvoiceData; onChange: (d: InvoiceData) => void }) {
  const { subtotal, discAmt, afterDiscount: _afterDiscount, taxAmt, shipping: _shipping, total } = calcTotals(data)
  const sym = data.currencySymbol

  return (
    <div className="pt-4">
      <div className="ml-auto max-w-xs space-y-3">
        {/* Discount */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 flex-1">Discount</span>
          <div className="flex items-center gap-1">
            <input type="number" value={data.globalDiscount}
              onChange={e => onChange({ ...data, globalDiscount: e.target.value })}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0" placeholder="0" />
            <select value={data.globalDiscountType}
              onChange={e => onChange({ ...data, globalDiscountType: e.target.value as DiscountType })}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="percent">%</option>
              <option value="fixed">{sym}</option>
            </select>
          </div>
        </div>

        {/* Tax toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <input type="checkbox" checked={data.taxEnabled}
              onChange={e => onChange({ ...data, taxEnabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600" />
            <input value={data.taxLabel}
              onChange={e => onChange({ ...data, taxLabel: e.target.value })}
              className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:underline w-24"
              placeholder="Tax label" />
          </label>
          {data.taxEnabled && (
            <div className="flex items-center gap-1">
              <input type="number" value={data.taxRate}
                onChange={e => onChange({ ...data, taxRate: e.target.value })}
                className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="0" max="100" placeholder="0" />
              <span className="text-sm text-gray-400">%</span>
            </div>
          )}
        </div>

        {/* Shipping */}
        <div className="flex items-center gap-2">
          <input value={data.shippingLabel}
            onChange={e => onChange({ ...data, shippingLabel: e.target.value })}
            className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:underline flex-1"
            placeholder="Shipping label" />
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-400">{sym}</span>
            <input type="number" value={data.shipping}
              onChange={e => onChange({ ...data, shipping: e.target.value })}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="0" placeholder="0.00" />
          </div>
        </div>

        {/* Summary */}
        <div className="border-t border-gray-200 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>{fmt(subtotal, sym)}</span>
          </div>
          {discAmt > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span><span>-{fmt(discAmt, sym)}</span>
            </div>
          )}
          {data.taxEnabled && taxAmt > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>{data.taxLabel} ({data.taxRate}%)</span><span>{fmt(taxAmt, sym)}</span>
            </div>
          )}
          {num(data.shipping) > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>{data.shippingLabel}</span><span>{fmt(num(data.shipping), sym)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
            <span>Total</span><span className="text-blue-600">{fmt(total, sym)}</span>
          </div>
          <div className="text-xs text-gray-400 text-right">{data.currency}</div>
        </div>
      </div>
    </div>
  )
}

// ─── PDF Generator ────────────────────────────────────────────

function generateHTML(data: InvoiceData): string {
  const { subtotal, discAmt, taxAmt, shipping: _shipping2, total } = calcTotals(data)
  const sym = data.currencySymbol
  const f = data.from; const t = data.to

  const themeMap = {
    professional: { bg: '#2563eb', text: '#fff', accent: '#eff6ff', border: '#dbeafe' },
    modern: { bg: '#1e1b4b', text: '#fff', accent: '#f5f3ff', border: '#e0e7ff' },
    minimal: { bg: '#f3f4f6', text: '#111827', accent: '#f9fafb', border: '#e5e7eb' },
    executive: { bg: '#111827', text: '#f59e0b', accent: '#fefce8', border: '#fef08a' },
  }
  const theme = themeMap[data.template]

  const partyBlock = (label: string, p: Party) => `
    <div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px">${label}</div>
      ${p.logo ? `<img src="${p.logo}" style="height:36px;object-fit:contain;margin-bottom:6px;display:block">` : ''}
      ${p.company ? `<strong>${p.company}</strong><br>` : ''}
      ${p.name ? `${p.name}<br>` : ''}
      ${p.address ? `${p.address}<br>` : ''}
      ${p.city ? `${p.city}${p.state ? ', ' + p.state : ''}${p.zip ? ' ' + p.zip : ''}<br>` : ''}
      ${p.country ? `${p.country}<br>` : ''}
      ${p.email ? `${p.email}<br>` : ''}
      ${p.phone ? `${p.phone}<br>` : ''}
      ${p.taxId ? `Tax ID: ${p.taxId}<br>` : ''}
    </div>`

  const itemRows = data.items.filter(it => it.description).map(it => {
    const lineTotal = num(it.qty) * num(it.price)
    const lineDisc = lineTotal * num(it.discount) / 100
    const lineAmt = lineTotal - lineDisc
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid ${theme.border}">
        ${it.description}
        ${it.detail ? `<div style="font-size:11px;color:#888;margin-top:2px">${it.detail}</div>` : ''}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid ${theme.border};text-align:center">${it.qty} ${it.unit}</td>
      <td style="padding:10px 12px;border-bottom:1px solid ${theme.border};text-align:right">${fmt(num(it.price), sym)}</td>
      ${num(it.discount) > 0 ? `<td style="padding:10px 12px;border-bottom:1px solid ${theme.border};text-align:center;color:#16a34a">${it.discount}%</td>` : `<td style="padding:10px 12px;border-bottom:1px solid ${theme.border};text-align:center;color:#888">—</td>`}
      <td style="padding:10px 12px;border-bottom:1px solid ${theme.border};text-align:right;font-weight:600">${fmt(lineAmt, sym)}</td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoice ${data.number}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#1a1a1a;font-size:13px;line-height:1.5;background:#fff}
  @page{size:A4;margin:0}
  @media print{body{width:210mm}}
</style></head><body>
<div style="max-width:800px;margin:0 auto;padding:0">

  <!-- Header -->
  <div style="background:${theme.bg};color:${theme.text};padding:36px 40px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      ${f.logo ? `<img src="${f.logo}" style="height:40px;object-fit:contain;margin-bottom:10px;display:block;filter:brightness(10)">` : ''}
      <div style="font-size:32px;font-weight:900;letter-spacing:-1px">INVOICE</div>
      <div style="font-size:14px;opacity:0.8;margin-top:4px">#${data.number}</div>
    </div>
    <div style="text-align:right;font-size:13px">
      <div style="opacity:0.7;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">Date</div>
      <div style="font-weight:600">${data.date}</div>
      ${data.dueDate ? `<div style="opacity:0.7;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:8px;margin-bottom:3px">Due Date</div><div style="font-weight:600;color:${data.template === 'executive' ? '#f59e0b' : '#fbbf24'}">${data.dueDate}</div>` : ''}
      ${data.poNumber ? `<div style="opacity:0.7;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:8px;margin-bottom:3px">PO Number</div><div>${data.poNumber}</div>` : ''}
    </div>
  </div>

  <!-- From / To -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:32px 40px;background:${theme.accent};border-bottom:2px solid ${theme.border};font-size:13px">
    ${partyBlock('From', f)}
    ${partyBlock('Bill To', t)}
  </div>

  <!-- Items table -->
  <div style="padding:24px 40px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr style="background:${theme.accent}">
          <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;border-bottom:2px solid ${theme.border}">Description</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;border-bottom:2px solid ${theme.border}">Qty / Unit</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;border-bottom:2px solid ${theme.border}">Unit Price</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;border-bottom:2px solid ${theme.border}">Discount</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;border-bottom:2px solid ${theme.border}">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <!-- Totals -->
    <div style="margin-left:auto;width:300px">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#666">
        <span>Subtotal</span><span>${fmt(subtotal, sym)}</span>
      </div>
      ${discAmt > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#16a34a"><span>Discount</span><span>-${fmt(discAmt, sym)}</span></div>` : ''}
      ${data.taxEnabled && taxAmt > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#666"><span>${data.taxLabel} (${data.taxRate}%)</span><span>${fmt(taxAmt, sym)}</span></div>` : ''}
      ${num(data.shipping) > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#666"><span>${data.shippingLabel}</span><span>${fmt(num(data.shipping), sym)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:18px;font-weight:800;border-top:2px solid ${theme.border};margin-top:6px;color:${theme.bg}">
        <span>Total</span><span>${fmt(total, sym)} ${data.currency}</span>
      </div>
    </div>
  </div>

  <!-- Bank details -->
  ${data.showBank && (data.bank.bankName || data.bank.iban) ? `
  <div style="padding:0 40px 24px">
    <div style="background:${theme.accent};border:1px solid ${theme.border};border-radius:8px;padding:16px 20px">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:8px;font-weight:600">Bank Transfer Details</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
        ${data.bank.bankName ? `<div><span style="color:#888">Bank: </span>${data.bank.bankName}</div>` : ''}
        ${data.bank.accountName ? `<div><span style="color:#888">Account Name: </span>${data.bank.accountName}</div>` : ''}
        ${data.bank.accountNumber ? `<div><span style="color:#888">Account Number: </span>${data.bank.accountNumber}</div>` : ''}
        ${data.bank.routingNumber ? `<div><span style="color:#888">Routing Number: </span>${data.bank.routingNumber}</div>` : ''}
        ${data.bank.iban ? `<div><span style="color:#888">IBAN: </span>${data.bank.iban}</div>` : ''}
        ${data.bank.swift ? `<div><span style="color:#888">SWIFT/BIC: </span>${data.bank.swift}</div>` : ''}
      </div>
      ${data.bank.note ? `<div style="margin-top:8px;font-size:12px;color:#555">${data.bank.note}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Notes & Terms -->
  ${data.notes || data.terms ? `
  <div style="padding:0 40px 36px;display:grid;grid-template-columns:1fr 1fr;gap:24px;font-size:12px">
    ${data.notes ? `<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;font-weight:600">Notes</div><div style="color:#555;line-height:1.6">${data.notes}</div></div>` : ''}
    ${data.terms ? `<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;font-weight:600">Terms & Conditions</div><div style="color:#555;line-height:1.6">${data.terms}</div></div>` : ''}
  </div>` : ''}

  <!-- Footer -->
  <div style="background:${theme.bg};color:${theme.text};padding:16px 40px;text-align:center;font-size:11px;opacity:0.7">
    ${data.paymentTerms ? `Payment Terms: ${data.paymentTerms}` : ''} · Generated with Roughtools.com
  </div>

</div>
</body></html>`
}

// ─── FAQ Section ──────────────────────────────────────────────

const FAQS = [
  {
    q: 'Is this invoice generator completely free to use?',
    a: 'Yes, the Roughtools Invoice Generator is completely free to use with no hidden charges, subscription fees, or premium tiers. You can create, customise, and download unlimited invoices at no cost. Roughtools is funded through non-intrusive advertising, which keeps every tool on the platform permanently free for all users worldwide — whether you are a freelancer creating your first invoice or a small business generating hundreds per month.'
  },
  {
    q: 'Do I need to create an account to generate an invoice?',
    a: 'No account, sign-up, or email address is required. Simply open the Invoice Generator, fill in your details, and download your invoice as a PDF. Your invoice data is saved automatically in your browser\'s local storage, so your information is preserved between sessions on the same device — without ever being sent to a server or requiring you to log in.'
  },
  {
    q: 'Is my invoice data stored or shared with anyone?',
    a: 'Your invoice data is stored exclusively in your browser\'s local storage and is never transmitted to Roughtools servers. We do not collect, store, or share any invoice content, client names, amounts, or business details. The PDF is generated entirely in your browser using a print dialog. Your financial data remains completely private and is only accessible on the device where you created it.'
  },
  {
    q: 'Can I use this invoice generator on my phone or tablet?',
    a: 'Yes, the Invoice Generator is fully responsive and works on all modern smartphones and tablets running iOS or Android. The layout adapts to smaller screens, allowing you to fill in all fields, add line items, set tax rates, and generate a PDF directly from your mobile device. For the best experience when printing, a desktop or laptop is recommended, but the tool is fully functional on mobile.'
  },
  {
    q: 'Which browsers are supported by the Invoice Generator?',
    a: 'The Invoice Generator works in all major modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (macOS and iOS), and Opera. For PDF generation, the tool uses your browser\'s built-in print dialog, which is supported universally. We recommend using the latest version of Chrome or Edge for the best PDF output quality and layout accuracy when saving or printing your invoice.'
  },
  {
    q: 'How do I generate and download my invoice as a PDF?',
    a: 'To generate your invoice: (1) Select a template style — Professional, Modern, Minimal, or Executive. (2) Fill in your business details in the "From" section, including logo upload if desired. (3) Enter your client\'s details in the "Bill To" section. (4) Add your line items with descriptions, quantities, unit prices, and any per-item discounts or tax rates. (5) Set global discount, tax, and shipping if applicable. (6) Add payment terms, bank details, and notes. (7) Click "Generate PDF" — your browser\'s print dialog will open. Select "Save as PDF" to download the file.'
  },
  {
    q: 'Can I add my company logo to the invoice?',
    a: 'Yes, you can upload your company logo directly in the "From" section. Click the "Upload" button next to the logo placeholder and select a PNG, JPG, or SVG file from your device. The logo is embedded directly into the invoice PDF. For best results, use a transparent-background PNG logo with a minimum width of 200 pixels. Logos are stored in your browser only and are never uploaded to any server.'
  },
  {
    q: 'What currencies and tax options are supported?',
    a: 'The Invoice Generator supports 20 international currencies including USD, EUR, GBP, CAD, AUD, INR, AED, SAR, PKR, and more. You can set a global tax rate with a custom label (e.g. "VAT", "GST", "Sales Tax"), apply per-line-item discounts as a percentage, add a global discount as either a fixed amount or a percentage, and include shipping or handling charges. All amounts update in real time as you type.'
  },
  {
    q: 'Can I add bank transfer details to my invoice?',
    a: 'Yes. In the "Bank Details" section, toggle on "Show Bank Details" and enter your bank name, account name, account number, routing number (for US transfers), IBAN (for international SEPA transfers), and SWIFT/BIC code. These details appear in a clearly formatted section on your printed invoice, making it easy for international clients to transfer payment correctly. This is especially useful for freelancers working across borders.'
  },
  {
    q: 'Why should I use Roughtools Invoice Generator instead of paid alternatives?',
    a: 'Roughtools Invoice Generator offers professional-grade invoice creation for free — no monthly subscription, no per-invoice charge, and no watermarks on your PDFs. Unlike basic free tools, it supports 4 professional templates, 20+ currencies, per-item discounts and tax rates, logo upload, bank detail sections, and custom payment terms. Your data never leaves your device, making it more private than cloud-based invoicing software. It is ideal for freelancers, consultants, and small businesses who need clean invoices without the overhead of a paid platform.'
  },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="mt-16 max-w-4xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
      <p className="text-gray-500 text-sm mb-8">Everything you need to know about the free Invoice Generator.</p>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details key={i} open={open === i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary
              className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 text-sm list-none"
              onClick={e => { e.preventDefault(); setOpen(open === i ? null : i) }}>
              <h3 className="text-sm font-semibold text-gray-900">{faq.q}</h3>
              <span className="text-blue-600 font-bold text-lg flex-shrink-0 ml-3">{open === i ? '−' : '+'}</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(getInitial)
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = useCallback((next: InvoiceData) => {
    setData(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem('roughtools_invoice_v3', JSON.stringify(next)) } catch { /**/ }
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 500)
  }, [])

  const handlePrint = () => {
    const html = generateHTML(data)
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.onload = () => { win.print(); }
  }

  const clearAll = () => {
    if (!confirm('Clear all invoice data and start fresh?')) return
    const fresh = getInitial()
    update({ ...fresh, from: blankParty(), to: blankParty(), items: [blankItem()] })
    localStorage.removeItem('roughtools_invoice_v3')
  }

  const sym = data.currencySymbol

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/tools/document-tools" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-900 text-sm">Invoice Generator</h1>
          <div className={`ml-2 text-xs transition-opacity ${saved ? 'opacity-100 text-green-600' : 'opacity-0'}`}>✓ Saved</div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500">Clear</button>
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Generate PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Professional Invoice Generator</h2>
              <p className="text-blue-100 text-sm">4 templates · 20+ currencies · Logo upload · Bank details · PDF download</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['No Signup', 'No Watermark', '100% Free', 'Data Stays Local'].map(b => (
                <span key={b} className="text-xs bg-white/15 border border-white/25 rounded-full px-3 py-1">{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Template picker */}
        <Section title="Choose Invoice Template" icon="🎨">
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => update({ ...data, template: t.id })}
                className={`rounded-xl border-2 p-3 text-left transition-all ${data.template === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <div className="h-12 rounded-lg mb-2" style={{ background: t.accent }} />
                <div className="font-semibold text-xs text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{t.preview.split(' — ')[0]}</div>
                {data.template === t.id && <div className="text-xs text-blue-600 font-semibold mt-1">✓ Selected</div>}
              </button>
            ))}
          </div>
        </Section>

        {/* Invoice settings */}
        <Section title="Invoice Settings" icon="📋">
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <F label="Invoice Number" value={data.number} onChange={v => update({ ...data, number: v })} placeholder="INV-001" />
            <F label="Invoice Date" value={data.date} onChange={v => update({ ...data, date: v })} type="date" />
            <F label="Due Date" value={data.dueDate} onChange={v => update({ ...data, dueDate: v })} type="date" />
            <F label="PO Number (optional)" value={data.poNumber} onChange={v => update({ ...data, poNumber: v })} placeholder="PO-2024-001" />
            <div>
              <label className={LBL}>Payment Terms</label>
              <select value={data.paymentTerms} onChange={e => update({ ...data, paymentTerms: e.target.value })} className={CLS}>
                {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Currency</label>
              <select value={data.currency}
                onChange={e => {
                  const c = CURRENCIES.find(c => c.code === e.target.value)!
                  update({ ...data, currency: c.code, currencySymbol: c.symbol })
                }} className={CLS}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* From */}
        <Section title="Your Business Details (From)" icon="🏢">
          <PartyEditor title="From" value={data.from} onChange={v => update({ ...data, from: v })} showLogo />
        </Section>

        {/* To */}
        <Section title="Client Details (Bill To)" icon="👤">
          <PartyEditor title="Bill To" value={data.to} onChange={v => update({ ...data, to: v })} />
        </Section>

        {/* Line items */}
        <Section title="Line Items" icon="📦">
          <LineItemsEditor items={data.items} onChange={v => update({ ...data, items: v })} sym={sym} />
        </Section>

        {/* Totals */}
        <Section title="Totals, Tax & Discounts" icon="💰">
          <TotalsPanel data={data} onChange={update} />
        </Section>

        {/* Bank details */}
        <Section title="Bank Transfer Details" icon="🏦" defaultOpen={false}>
          <div className="pt-4">
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input type="checkbox" checked={data.showBank}
                onChange={e => update({ ...data, showBank: e.target.checked })}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700 font-medium">Show bank details on invoice</span>
            </label>
            {data.showBank && (
              <div className="grid grid-cols-2 gap-3">
                <F label="Bank Name" value={data.bank.bankName} onChange={v => update({ ...data, bank: { ...data.bank, bankName: v } })} placeholder="Chase Bank" />
                <F label="Account Holder Name" value={data.bank.accountName} onChange={v => update({ ...data, bank: { ...data.bank, accountName: v } })} placeholder="Acme Corporation" />
                <F label="Account Number" value={data.bank.accountNumber} onChange={v => update({ ...data, bank: { ...data.bank, accountNumber: v } })} placeholder="0123456789" />
                <F label="Routing / Sort Code" value={data.bank.routingNumber} onChange={v => update({ ...data, bank: { ...data.bank, routingNumber: v } })} placeholder="021000021" />
                <F label="IBAN" value={data.bank.iban} onChange={v => update({ ...data, bank: { ...data.bank, iban: v } })} placeholder="GB29 NWBK 6016 1331 9268 19" />
                <F label="SWIFT / BIC" value={data.bank.swift} onChange={v => update({ ...data, bank: { ...data.bank, swift: v } })} placeholder="CHASUS33" />
                <div className="col-span-2">
                  <label className={LBL}>Additional Payment Note</label>
                  <textarea value={data.bank.note} onChange={e => update({ ...data, bank: { ...data.bank, note: e.target.value } })}
                    rows={2} placeholder="e.g. Please include invoice number in the payment reference."
                    className={`${CLS} resize-none`} />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Notes & Terms */}
        <Section title="Notes & Terms" icon="📝" defaultOpen={false}>
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div>
              <label className={LBL}>Notes to Client</label>
              <textarea value={data.notes} onChange={e => update({ ...data, notes: e.target.value })} rows={4}
                placeholder="Thank you for your business! Please feel free to reach out with any questions."
                className={`${CLS} resize-none`} />
            </div>
            <div>
              <label className={LBL}>Terms & Conditions</label>
              <textarea value={data.terms} onChange={e => update({ ...data, terms: e.target.value })} rows={4}
                placeholder="Payment is due within 30 days. Late payments may be subject to 1.5% monthly interest."
                className={`${CLS} resize-none`} />
            </div>
          </div>
        </Section>

        {/* Generate button */}
        <button onClick={handlePrint}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Generate & Download PDF Invoice
        </button>

        <p className="text-center text-xs text-gray-400">
          Your invoice data is saved locally in your browser. Nothing is ever uploaded to our servers.
        </p>
      </div>

      {/* FAQ */}
      <FAQSection />
      <ToolPageExtras
        toolName="Invoice Generator"
        toolSlug="invoice-generator"
        toolUrl="https://roughtools.com/tools/document-tools/invoice-generator"
        type="financial"
        showPDF
      />
      <ToolAdUnit position="bottom" />
    </div>
  )
}
