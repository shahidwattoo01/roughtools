'use client';
import type React from 'react';

/* ──────────────────────────────────────────────
   Card
   ────────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
  className?: string;
}
export function Card({ children, accent, style, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: accent ? 'rgba(139,92,246,0.1)' : 'var(--bg-1)',
        border: accent ? '1px solid rgba(139,92,246,0.35)' : '1px solid var(--line-strong)',
        borderRadius: 14,
        padding: '20px 24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Row (grid wrapper)
   ────────────────────────────────────────────── */
interface RowProps {
  children: React.ReactNode;
  cols?: number;
  gap?: number;
  style?: React.CSSProperties;
}
export function Row({ children, cols = 2, gap = 16, style }: RowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────
   SectionLabel
   ────────────────────────────────────────────── */
interface SectionLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export function SectionLabel({ children, style }: SectionLabelProps) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--brand-2)',
        margin: '0 0 8px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ──────────────────────────────────────────────
   InputField
   ────────────────────────────────────────────── */
interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  unit?: string;
  disabled?: boolean;
}
export function InputField({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  min,
  max,
  step,
  unit,
  disabled,
}: InputFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        htmlFor={id}
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '0.05em' }}
      >
        {label}
        {unit && <span style={{ color: 'var(--fg-3)', marginLeft: 4 }}>({unit})</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--line-strong)',
          borderRadius: 8,
          padding: '10px 12px',
          color: 'var(--fg)',
          fontSize: 15,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────
   SelectField
   ────────────────────────────────────────────── */
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}
export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '0.05em' }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'var(--bg-1)',
          border: '1px solid var(--line-strong)',
          borderRadius: 8,
          padding: '10px 12px',
          color: 'var(--fg)',
          fontSize: 15,
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ──────────────────────────────────────────────
   ResultRow
   ────────────────────────────────────────────── */
interface ResultRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  unit?: string;
}
export function ResultRow({ label, value, highlight, unit }: ResultRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>{label}</span>
      <span
        style={{
          fontSize: highlight ? 20 : 15,
          fontWeight: highlight ? 800 : 600,
          color: highlight ? 'var(--brand-2)' : 'var(--fg)',
        }}
      >
        {value}
        {unit && <span style={{ fontSize: 12, color: 'var(--fg-3)', marginLeft: 3 }}>{unit}</span>}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────
   InfoBox
   ────────────────────────────────────────────── */
interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success';
}
export function InfoBox({ children, type = 'info' }: InfoBoxProps) {
  const colors = {
    info: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', icon: 'ℹ️' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: '⚠️' },
    success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', icon: '✅' },
  };
  const c = colors[type];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: '12px 16px',
        fontSize: 13,
        color: 'var(--fg-2)',
        lineHeight: 1.5,
      }}
    >
      {c.icon} {children}
    </div>
  );
}
