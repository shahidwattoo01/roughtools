'use client';

/**
 * CommandPalette — complete (Steps 1a + 1b)
 * Opens on: Cmd+K · Ctrl+K · "/" anywhere on page
 * Closes on: Escape · backdrop click
 * Features: recent searches (localStorage), popular pre-list,
 *            live fuzzy results, character highlights, keyboard nav
 */

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useRouter } from 'next/navigation';
// ⚡ PERF: Only import the types (erased at build time), not the 1 663-line
// ALL_TOOLS array. The actual data is loaded lazily in a dynamic import
// the first time the palette opens — keeping it out of the initial bundle.
import type { Tool, ToolCategory } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────
const RECENT_KEY = 'rt_recent_tools';
const MAX_RECENT = 5;

const POPULAR_SLUGS = [
  'compress-pdf',
  'pdf-to-word',
  'background-remover',
  'bmi-calculator',
  'json-formatter',
  'password-generator',
  'word-counter',
  'egfr-ckd-epi-calculator',
  'mortgage-calculator',
  'image-compressor',
];

// ─── Category SVG icons (Lucide-style, strokeWidth 1.5) ───────
const CAT_ICONS: Record<ToolCategory, React.ReactNode> = {
  pdf: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  calculators: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 19h2M12 19h6" />
    </svg>
  ),
  developer: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  ),
  text: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  ),
  converters: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="m17 1 4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  network: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
    </svg>
  ),
  'legal-tools': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M16 16c0 2-2 3-4 3s-4-1-4-3M12 3v18M3 9l3-6 3 6M15 9l3-6 3 6M3 9c0 2 1.3 3 3 3s3-1 3-3M15 9c0 2 1.3 3 3 3s3-1 3-3" />
    </svg>
  ),
  'real-estate': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2Z" />
    </svg>
  ),
  'image-tools': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  security: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  ),
  'document-tools': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M9 12h6M9 16h4" />
    </svg>
  ),
  business: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  ),
  environment: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M11 20A7 7 0 014 13c0-7 9-11 16-11 0 7-4 16-11 16Z" />
      <path d="M2 22 16 8" />
    </svg>
  ),
  engineering: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  medical: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M19 14c1.5-1.4 3-3.4 3-5.5A5.5 5.5 0 0016.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 002 8.5c0 2 1.5 4 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.7-1 2 4 1.8-2.5 1 1H21" />
    </svg>
  ),
  'iq-test': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 013.76-3.28M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-3.76-3.28" />
    </svg>
  ),
  'notes-maker': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 013.002 3.002L7.368 18.635a2 2 0 01-.855.506l-2.872.864a.5.5 0 01-.62-.62l.864-2.872a2 2 0 01.506-.855z" />
    </svg>
  ),
  'paper-maker': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

// Category display name
const CAT_LABELS: Record<ToolCategory, string> = {
  pdf: 'PDF',
  calculators: 'Calculators',
  developer: 'Developer',
  text: 'Text',
  converters: 'Converters',
  network: 'Network',
  'legal-tools': 'Legal',
  'real-estate': 'Real Estate',
  'image-tools': 'Image',
  security: 'Security',
  'document-tools': 'Documents',
  business: 'Business',
  environment: 'Environment',
  engineering: 'Engineering',
  medical: 'Medical',
  'iq-test': 'IQ Test',
  'paper-maker': 'Paper Maker',
  'notes-maker': 'Notes Maker',
};

// Category accent colors
const CAT_COLORS: Record<ToolCategory, string> = {
  pdf: '#ff3d62',
  calculators: '#5b6cff',
  developer: '#64748b',
  text: '#f59e0b',
  converters: '#f97316',
  network: '#06b6d4',
  'legal-tools': '#facc15',
  'real-estate': '#f97316',
  'image-tools': '#ec4899',
  security: '#10b981',
  'document-tools': '#8b5cf6',
  business: '#a855f7',
  environment: '#84cc16',
  engineering: '#3b82f6',
  medical: '#14b8a6',
  'iq-test': '#a21caf',
  'paper-maker': '#0369a1',
  'notes-maker': '#7c3aed',
};

// ─── Search logic ─────────────────────────────────────────────
// ⚡ PERF: tools array passed in (not captured from module scope)
function searchTools(query: string, tools: Tool[], limit = 8): Tool[] {
  if (!query.trim() || !tools.length) return [];
  const q = query.toLowerCase().trim();
  const scored = tools.map((tool) => {
    let score = 0;
    const name = tool.name.toLowerCase();
    const desc = tool.description.toLowerCase();
    const kw = tool.keywords.join(' ').toLowerCase();
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 80;
    else if (name.includes(q)) score += 60;
    else if (kw.includes(q)) score += 40;
    else if (desc.includes(q)) score += 20;
    if (tool.popular && score > 0) score += 10;
    return { tool, score };
  });
  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.tool);
}

// Highlight matching characters in a string
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--brand)]/20 text-[var(--brand)] rounded-[2px] not-italic font-medium">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

// ─── Recent searches (localStorage) ──────────────────────────
function getRecent(tools: Tool[]): Tool[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const slugs: string[] = JSON.parse(raw);
    return slugs.map((s) => tools.find((t) => t.slug === s)).filter(Boolean) as Tool[];
  } catch {
    return [];
  }
}

function saveRecent(tool: Tool) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const slugs: string[] = raw ? JSON.parse(raw) : [];
    const next = [tool.slug, ...slugs.filter((s) => s !== tool.slug)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

// ─── Context ──────────────────────────────────────────────────
interface PaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const PaletteContext = createContext<PaletteCtx>({ open: false, setOpen: () => {} });
export function usePalette() {
  return useContext(PaletteContext);
}

// ─── Provider ─────────────────────────────────────────────────
export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable = (e.target as HTMLElement).isContentEditable;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || editable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === '/' && !inField) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <PaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandPaletteModal open={open} onClose={() => setOpen(false)} />
    </PaletteContext.Provider>
  );
}

// ─── Trigger button ───────────────────────────────────────────
export function CommandPaletteTrigger({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setOpen } = usePalette();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open search (Ctrl+K)"
      style={style}
      className={cn(
        'group flex items-center gap-2 px-3 h-9 rounded-lg text-sm cursor-pointer select-none',
        'border border-[var(--line)] bg-[var(--bg-1)]',
        'text-[var(--fg-2)] hover:text-[var(--fg)] hover:border-[var(--line-strong)]',
        'transition-colors duration-150',
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <span className="hidden sm:inline">Search tools…</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border border-[var(--line)] bg-[var(--bg-2)] text-[var(--fg-3)] font-sans leading-none">
        {isMac ? '⌘' : 'Ctrl'}
        <span className="ml-0.5">K</span>
      </kbd>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────
function CommandPaletteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<Tool[]>([]);
  // ⚡ PERF: tools loaded lazily on first open — not in the initial JS bundle
  const [allTools, setAllTools] = useState<Tool[]>([]);

  // Load ALL_TOOLS dynamically the first time the palette opens
  useEffect(() => {
    if (open && allTools.length === 0) {
      import('@/lib/tools-registry').then((m) => setAllTools(m.ALL_TOOLS));
    }
  }, [open, allTools.length]);

  // Popular tools — computed once tools are loaded
  const popular = useMemo(
    () =>
      allTools.length
        ? (POPULAR_SLUGS.map((s) => allTools.find((t) => t.slug === s)).filter(Boolean) as Tool[])
        : [],
    [allTools]
  );

  // Reset state on open/close
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActive(-1);
      if (allTools.length) setRecent(getRecent(allTools));
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Update recent when tools finish loading
  useEffect(() => {
    if (open && allTools.length) setRecent(getRecent(allTools));
  }, [allTools, open]);

  // Live search
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setActive(-1);
      setResults(searchTools(val, allTools));
    },
    [allTools]
  );

  // Navigate to tool
  const navigate = useCallback(
    (tool: Tool) => {
      saveRecent(tool);
      onClose();
      router.push(`/tools/${tool.category}/${tool.slug}`);
    },
    [onClose, router]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const list = query ? results : recent.length ? recent : popular;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => {
          const next = Math.min(i + 1, list.length - 1);
          scrollToItem(listRef, next);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => {
          const next = Math.max(i - 1, 0);
          scrollToItem(listRef, next);
          return next;
        });
      } else if (e.key === 'Enter' && active >= 0) {
        e.preventDefault();
        const tool = list[active];
        if (tool) navigate(tool);
      }
    },
    [query, results, recent, popular, active, navigate]
  );

  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  // Decide what to show
  const showResults = query.length > 0;
  const displayList = showResults ? results : recent.length > 0 ? recent : popular;
  const sectionLabel = showResults
    ? `${results.length} result${results.length !== 1 ? 's' : ''}`
    : recent.length > 0
      ? 'Recent'
      : 'Popular';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onBackdrop}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4 bg-black/50 backdrop-blur-[2px]"
      style={{ animation: 'palette-backdrop 150ms ease forwards' }}
    >
      <div
        className={cn(
          'relative w-full max-w-[620px] rounded-2xl overflow-hidden',
          'bg-[var(--bg-surface)] border border-[var(--line-strong)]'
        )}
        style={{
          boxShadow: '0 32px 80px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          animation: 'palette-panel 200ms cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* ── Search row ── */}
        <div className="flex items-center gap-3 px-4 border-b border-[var(--line)] h-14">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 flex-shrink-0 text-[var(--fg-3)]"
            aria-hidden="true"
          >
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-label="Search tools"
            placeholder="Search 400+ tools…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-3)] leading-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setActive(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear"
              className="text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] border border-[var(--line)] bg-[var(--bg-2)] text-[var(--fg-3)] font-sans leading-none">
            ESC
          </kbd>
        </div>

        {/* ── Results ── */}
        <div className="overflow-hidden">
          {/* Section label */}
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-[var(--fg-3)] font-medium">
              {sectionLabel}
            </span>
            {showResults && results.length === 0 && (
              <a
                href={`/search?q=${encodeURIComponent(query)}`}
                className="text-[11px] text-[var(--brand)] hover:underline"
              >
                Suggest a tool →
              </a>
            )}
          </div>

          {/* List */}
          {displayList.length > 0 ? (
            <ul
              id="command-palette-listbox"
              ref={listRef}
              role="listbox"
              aria-label="Search results"
              className="max-h-[360px] overflow-y-auto pb-2"
            >
              {displayList.map((tool, i) => {
                const isActive = i === active;
                const color = CAT_COLORS[tool.category];
                return (
                  <li key={tool.slug} role="option" aria-selected={isActive}>
                    <button
                      onClick={() => navigate(tool)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer',
                        'transition-colors duration-100 group',
                        isActive ? 'bg-[var(--brand)]/8' : 'hover:bg-[var(--bg-1)]'
                      )}
                      data-index={i}
                    >
                      {/* Category icon with tinted bg */}
                      <span
                        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{ background: `${color}18`, color }}
                        aria-hidden="true"
                      >
                        {CAT_ICONS[tool.category]}
                      </span>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[var(--fg)] truncate">
                          <Highlight text={tool.name} query={showResults ? query : ''} />
                        </p>
                        <p className="text-[12px] text-[var(--fg-2)] truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>

                      {/* Category badge */}
                      <span
                        className="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${color}18`, color }}
                      >
                        {CAT_LABELS[tool.category]}
                      </span>

                      {/* Arrow */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          'w-3.5 h-3.5 flex-shrink-0 transition-colors',
                          isActive
                            ? 'text-[var(--fg-2)]'
                            : 'text-[var(--fg-mute)] group-hover:text-[var(--fg-2)]'
                        )}
                        aria-hidden="true"
                      >
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : showResults && query ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--fg-2)]">
                No results for <strong>&ldquo;{query}&rdquo;</strong>
              </p>
              <p className="text-xs text-[var(--fg-3)] mt-1">
                Try &ldquo;pdf&rdquo;, &ldquo;json&rdquo;, &ldquo;calculator&rdquo;…
              </p>
            </div>
          ) : null}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-[var(--line)] px-4 py-2 flex items-center gap-4">
          {[
            { keys: ['↑', '↓'], label: 'navigate' },
            { keys: ['↵'], label: 'open' },
            { keys: ['ESC'], label: 'close' },
          ].map(({ keys, label }) => (
            <span key={label} className="flex items-center gap-1 text-[11px] text-[var(--fg-3)]">
              {keys.map((k) => (
                <kbd
                  key={k}
                  className="px-1.5 py-0.5 rounded border border-[var(--line)] bg-[var(--bg-2)] text-[10px] font-sans leading-none"
                >
                  {k}
                </kbd>
              ))}
              <span className="ml-0.5">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Scroll active item into view
function scrollToItem(listRef: React.RefObject<HTMLUListElement | null>, index: number) {
  const item = listRef.current?.querySelector(`[data-index="${index}"]`);
  item?.scrollIntoView({ block: 'nearest' });
}
