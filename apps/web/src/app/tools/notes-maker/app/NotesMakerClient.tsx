'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loadNotes,
  saveNote,
  deleteNote,
  createBlankNote,
  generateBlockId,
  countWords,
  type Note,
  type NoteBlock,
} from './notesStorage';

// ─── Constants ───────────────────────────────────────────────

const NOTE_COLORS = [
  { value: '#fef9c3', label: 'Yellow' },
  { value: '#dbeafe', label: 'Blue' },
  { value: '#dcfce7', label: 'Green' },
  { value: '#fce7f3', label: 'Pink' },
  { value: '#ede9fe', label: 'Purple' },
  { value: '#ffedd5', label: 'Orange' },
  { value: '#fee2e2', label: 'Red' },
  { value: '#ccfbf1', label: 'Teal' },
];

const NOTE_COLOR_BORDERS = [
  '#ca8a04',
  '#2563eb',
  '#16a34a',
  '#db2777',
  '#7c3aed',
  '#ea580c',
  '#dc2626',
  '#0d9488',
];

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'Urdu',
  'Islamiat',
  'Pak. Studies',
  'History',
  'Geography',
  'Economics',
  'Civics',
  'General Science',
  'Art & Drawing',
];

const NOTE_TYPES: { value: Note['type']; label: string; emoji: string }[] = [
  { value: 'general', label: 'General', emoji: '📝' },
  { value: 'summary', label: 'Summary', emoji: '📖' },
  { value: 'keypoints', label: 'Key Points', emoji: '🔑' },
  { value: 'formulas', label: 'Formulas', emoji: '📐' },
  { value: 'glossary', label: 'Glossary', emoji: '📚' },
  { value: 'flashcards', label: 'Flashcards', emoji: '🃏' },
  { value: 'experiment', label: 'Experiment', emoji: '🧪' },
];

const BLOCK_TYPES: { type: NoteBlock['type']; label: string; emoji: string; desc: string }[] = [
  { type: 'h1', label: 'Heading 1', emoji: 'H1', desc: 'Large title heading' },
  { type: 'h2', label: 'Heading 2', emoji: 'H2', desc: 'Section heading' },
  { type: 'h3', label: 'Heading 3', emoji: 'H3', desc: 'Sub-section heading' },
  { type: 'paragraph', label: 'Paragraph', emoji: '¶', desc: 'Plain text paragraph' },
  { type: 'bullets', label: 'Bullet List', emoji: '•', desc: 'Unordered list' },
  { type: 'numbered', label: 'Numbered List', emoji: '1.', desc: 'Ordered list' },
  { type: 'formula', label: 'Formula', emoji: 'fx', desc: 'Math formula or equation' },
  { type: 'definition', label: 'Definition', emoji: 'Def', desc: 'Term + definition pair' },
  { type: 'important', label: 'Important', emoji: '⚠️', desc: 'Red callout box' },
  { type: 'image', label: 'Image', emoji: '🖼', desc: 'Image with caption' },
  { type: 'divider', label: 'Divider', emoji: '—', desc: 'Horizontal rule' },
  { type: 'flashcard', label: 'Flashcard', emoji: '🃏', desc: 'Front / back flip card' },
];

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function getBlockPreview(note: Note): string {
  const first = note.blocks.find(
    (b) => b.type === 'paragraph' || b.type === 'bullets' || b.type === 'h1' || b.type === 'h2'
  );
  if (!first) return '';
  const text = first.content || (first.items ? first.items.join(', ') : '');
  return text.slice(0, 80);
}

function getNoteColorBorder(colorValue: string): string {
  const idx = NOTE_COLORS.findIndex((c) => c.value === colorValue);
  return NOTE_COLOR_BORDERS[idx >= 0 ? idx : 0];
}

// ─── Auto-resize textarea ─────────────────────────────────────

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
}

// ─── Block Component ──────────────────────────────────────────

interface BlockProps {
  block: NoteBlock;
  index: number;
  total: number;
  onChange: (id: string, patch: Partial<NoteBlock>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onChangeType: (id: string, type: NoteBlock['type']) => void;
}

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onChangeType,
}: BlockProps) {
  const baseInput =
    'w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400';

  const renderEditor = () => {
    if (block.type === 'h1') {
      return (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
          placeholder="Heading 1…"
          className={`${baseInput} text-2xl font-black`}
        />
      );
    }
    if (block.type === 'h2') {
      return (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
          placeholder="Heading 2…"
          className={`${baseInput} text-xl font-bold`}
        />
      );
    }
    if (block.type === 'h3') {
      return (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
          placeholder="Heading 3…"
          className={`${baseInput} text-lg font-semibold`}
        />
      );
    }
    if (block.type === 'paragraph') {
      return (
        <AutoTextarea
          value={block.content}
          onChange={(v) => onChange(block.id, { content: v })}
          placeholder="Start writing…"
          className={`${baseInput} text-base leading-relaxed`}
        />
      );
    }
    if (block.type === 'bullets') {
      return (
        <div className="space-y-1">
          <AutoTextarea
            value={block.content}
            onChange={(v) => onChange(block.id, { content: v })}
            placeholder="One bullet per line…"
            className={`${baseInput} text-sm font-mono`}
          />
          {block.content && (
            <div className="text-xs text-gray-400 mt-1 print:hidden">
              Preview:{' '}
              {block.content
                .split('\n')
                .filter(Boolean)
                .map((l, i) => (
                  <span key={i} className="block">
                    • {l}
                  </span>
                ))}
            </div>
          )}
        </div>
      );
    }
    if (block.type === 'numbered') {
      return (
        <div className="space-y-1">
          <AutoTextarea
            value={block.content}
            onChange={(v) => onChange(block.id, { content: v })}
            placeholder="One item per line…"
            className={`${baseInput} text-sm font-mono`}
          />
          {block.content && (
            <div className="text-xs text-gray-400 mt-1 print:hidden">
              Preview:{' '}
              {block.content
                .split('\n')
                .filter(Boolean)
                .map((l, i) => (
                  <span key={i} className="block">
                    {i + 1}. {l}
                  </span>
                ))}
            </div>
          )}
        </div>
      );
    }
    if (block.type === 'formula') {
      return (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2">
            Formula / Equation
          </div>
          <AutoTextarea
            value={block.content}
            onChange={(v) => onChange(block.id, { content: v })}
            placeholder="e.g. F = ma  or  v = u + at"
            className={`${baseInput} font-mono text-base text-amber-900 dark:text-amber-200 bg-transparent`}
          />
        </div>
      );
    }
    if (block.type === 'definition') {
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.term || ''}
            onChange={(e) => onChange(block.id, { term: e.target.value })}
            placeholder="Term…"
            className={`${baseInput} font-bold text-violet-700 dark:text-violet-400 border-b border-gray-200 dark:border-gray-700 pb-1`}
          />
          <AutoTextarea
            value={block.content}
            onChange={(v) => onChange(block.id, { content: v })}
            placeholder="Definition…"
            className={`${baseInput} text-sm`}
          />
        </div>
      );
    }
    if (block.type === 'important') {
      return (
        <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 pl-4 py-2 rounded-r-lg">
          <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">
            ⚠️ Important
          </div>
          <AutoTextarea
            value={block.content}
            onChange={(v) => onChange(block.id, { content: v })}
            placeholder="Important note…"
            className={`${baseInput} text-sm text-red-800 dark:text-red-200 bg-transparent`}
          />
        </div>
      );
    }
    if (block.type === 'image') {
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={block.imageUrl || ''}
              onChange={(e) => onChange(block.id, { imageUrl: e.target.value })}
              placeholder="Image URL or paste base64…"
              className={`${baseInput} text-sm border border-gray-200 dark:border-gray-700 rounded px-2 py-1 flex-1`}
            />
            <label className="cursor-pointer px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm rounded border border-violet-200 dark:border-violet-800 hover:bg-violet-200 transition-colors">
              📷 Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    onChange(block.id, { imageUrl: ev.target?.result as string });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
          <input
            type="text"
            value={block.content}
            onChange={(e) => onChange(block.id, { content: e.target.value })}
            placeholder="Alt text / caption…"
            className={`${baseInput} text-sm text-gray-500`}
          />
          {block.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.imageUrl}
              alt={block.content || 'Note image'}
              className="max-h-64 rounded-lg border border-gray-200 dark:border-gray-700 object-contain"
            />
          )}
        </div>
      );
    }
    if (block.type === 'divider') {
      return <hr className="border-gray-300 dark:border-gray-600 my-2" />;
    }
    if (block.type === 'flashcard') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">
              🃏 Front (Question)
            </div>
            <AutoTextarea
              value={block.term || ''}
              onChange={(v) => onChange(block.id, { term: v })}
              placeholder="Question or prompt…"
              className={`${baseInput} text-sm bg-transparent`}
            />
          </div>
          <div className="rounded-xl border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">
              ✅ Back (Answer)
            </div>
            <AutoTextarea
              value={block.content}
              onChange={(v) => onChange(block.id, { content: v })}
              placeholder="Answer…"
              className={`${baseInput} text-sm bg-transparent`}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="group relative flex gap-2 py-2">
      {/* Left: drag handle + type icon */}
      <div className="flex flex-col items-center gap-0.5 pt-1 flex-shrink-0 print:hidden">
        <span className="text-gray-300 dark:text-gray-600 cursor-grab text-xs select-none leading-none">
          ⠿
        </span>
        <span className="text-[10px] text-gray-400 font-mono leading-none">
          {BLOCK_TYPES.find((b) => b.type === block.type)?.emoji || '?'}
        </span>
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0">{renderEditor()}</div>

      {/* Right: controls */}
      <div className="flex flex-col gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
        <select
          value={block.type}
          onChange={(e) => onChangeType(block.id, e.target.value as NoteBlock['type'])}
          className="text-[10px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1 py-0.5"
          title="Change block type"
        >
          {BLOCK_TYPES.map((bt) => (
            <option key={bt.type} value={bt.type}>
              {bt.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onMoveUp(block.id)}
          disabled={index === 0}
          className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 disabled:opacity-30"
          title="Move up"
        >
          ↑
        </button>
        <button
          onClick={() => onMoveDown(block.id)}
          disabled={index === total - 1}
          className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 disabled:opacity-30"
          title="Move down"
        >
          ↓
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100"
          title="Delete block"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ─── Block Print View ─────────────────────────────────────────

function BlockPrintView({ block }: { block: NoteBlock }) {
  if (block.type === 'h1')
    return <h1 className="text-2xl font-black mt-4 mb-1">{block.content}</h1>;
  if (block.type === 'h2') return <h2 className="text-xl font-bold mt-3 mb-1">{block.content}</h2>;
  if (block.type === 'h3')
    return <h3 className="text-lg font-semibold mt-2 mb-1">{block.content}</h3>;
  if (block.type === 'paragraph') return <p className="mb-2 leading-relaxed">{block.content}</p>;
  if (block.type === 'bullets') {
    return (
      <ul className="list-disc list-inside mb-2 space-y-0.5">
        {block.content
          .split('\n')
          .filter(Boolean)
          .map((l, i) => (
            <li key={i}>{l}</li>
          ))}
      </ul>
    );
  }
  if (block.type === 'numbered') {
    return (
      <ol className="list-decimal list-inside mb-2 space-y-0.5">
        {block.content
          .split('\n')
          .filter(Boolean)
          .map((l, i) => (
            <li key={i}>{l}</li>
          ))}
      </ol>
    );
  }
  if (block.type === 'formula') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-2 font-mono text-sm">
        {block.content}
      </div>
    );
  }
  if (block.type === 'definition') {
    return (
      <div className="mb-2">
        <span className="font-bold text-violet-700">{block.term}: </span>
        <span>{block.content}</span>
      </div>
    );
  }
  if (block.type === 'important') {
    return (
      <div className="border-l-4 border-red-500 bg-red-50 pl-3 py-1.5 rounded-r mb-2">
        <div className="text-[10px] font-bold text-red-600 uppercase mb-0.5">⚠️ Important</div>
        <p className="text-sm">{block.content}</p>
      </div>
    );
  }
  if (block.type === 'image' && block.imageUrl) {
    return (
      <div className="mb-2 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.imageUrl}
          alt={block.content || 'image'}
          className="max-h-48 mx-auto rounded"
        />
        {block.content && <p className="text-xs text-gray-500 mt-1">{block.content}</p>}
      </div>
    );
  }
  if (block.type === 'divider') {
    return <hr className="border-gray-300 my-3" />;
  }
  if (block.type === 'flashcard') {
    return (
      <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
        <div className="border border-violet-300 rounded p-2">
          <div className="font-bold text-violet-600 text-[10px] mb-1">FRONT</div>
          {block.term}
        </div>
        <div className="border border-green-300 rounded p-2">
          <div className="font-bold text-green-600 text-[10px] mb-1">BACK</div>
          {block.content}
        </div>
      </div>
    );
  }
  return null;
}

// ─── Dashboard ────────────────────────────────────────────────

interface DashboardProps {
  notes: Note[];
  onNew: () => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

function Dashboard({ notes, onNew, onEdit, onDelete }: DashboardProps) {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState(0);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState<Note['type'] | ''>('');
  const [filterColor, setFilterColor] = useState('');

  const filtered = notes.filter((n) => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterClass && n.classLevel !== filterClass) return false;
    if (filterSubject && n.subjectId !== filterSubject) return false;
    if (filterType && n.type !== filterType) return false;
    if (filterColor && n.color !== filterColor) return false;
    return true;
  });

  const totalWords = notes.reduce((s, n) => s + n.wordCount, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">Notes Maker</h1>
          </div>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            + New Note
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 print:hidden">
        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes…"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-violet-400 mb-4 text-sm"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(Number(e.target.value))}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200"
          >
            <option value={0}>All Classes</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as Note['type'] | '')}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200"
          >
            <option value="">All Types</option>
            {NOTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>

          {/* Color filter dots */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterColor('')}
              className={`w-6 h-6 rounded-full border-2 text-xs flex items-center justify-center ${filterColor === '' ? 'border-violet-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-100 dark:bg-gray-700`}
              title="All colors"
            >
              ×
            </button>
            {NOTE_COLORS.map((c, i) => (
              <button
                key={c.value}
                onClick={() => setFilterColor(c.value === filterColor ? '' : c.value)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${c.value === filterColor ? 'scale-125' : ''}`}
                style={{ background: c.value, borderColor: NOTE_COLOR_BORDERS[i] }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {filtered.length} note{filtered.length !== 1 ? 's' : ''} · {totalWords.toLocaleString()}{' '}
          words total
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              {notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              {notes.length === 0
                ? 'Create your first note and start organising your studies.'
                : 'Try clearing some filters.'}
            </p>
            {notes.length === 0 && (
              <button
                onClick={onNew}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((note) => {
              const border = getNoteColorBorder(note.color);
              const typeInfo = NOTE_TYPES.find((t) => t.value === note.type);
              const preview = getBlockPreview(note);
              return (
                <div
                  key={note.id}
                  className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  style={{ borderTop: `4px solid ${border}` }}
                  onClick={() => onEdit(note)}
                >
                  <div className="p-4">
                    {/* Type badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {typeInfo?.emoji} {typeInfo?.label}
                      </span>
                      {note.classLevel > 0 && (
                        <span className="text-[11px] text-gray-400">Class {note.classLevel}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-[15px] leading-snug truncate mb-1">
                      {note.title}
                    </h3>

                    {/* Subject */}
                    {note.subjectId && (
                      <div className="text-xs text-violet-600 dark:text-violet-400 mb-1">
                        {note.subjectId}
                      </div>
                    )}

                    {/* Preview */}
                    {preview && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                        {preview}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{note.wordCount} words</span>
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(note);
                      }}
                      className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow text-xs text-violet-600 hover:bg-violet-50 border border-gray-100 dark:border-gray-700"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this note?')) onDelete(note.id);
                      }}
                      className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow text-xs text-red-500 hover:bg-red-50 border border-gray-100 dark:border-gray-700"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────

interface EditorProps {
  note: Note;
  onBack: () => void;
  onSave: (note: Note) => void;
}

function Editor({ note: initialNote, onBack, onSave }: EditorProps) {
  const [note, setNote] = useState<Note>(initialNote);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const updated = { ...note, updatedAt: new Date().toISOString(), wordCount: countWords(note) };
      onSave(updated);
      setNote(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 1000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // onSave is stable, note changes trigger this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    note.title,
    note.blocks,
    note.classLevel,
    note.subjectId,
    note.chapter,
    note.type,
    note.color,
    note.tags,
  ]);

  const updateBlock = useCallback((id: string, patch: Partial<NoteBlock>) => {
    setNote((n) => ({
      ...n,
      blocks: n.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setNote((n) => ({ ...n, blocks: n.blocks.filter((b) => b.id !== id) }));
  }, []);

  const moveUp = useCallback((id: string) => {
    setNote((n) => {
      const idx = n.blocks.findIndex((b) => b.id === id);
      if (idx <= 0) return n;
      const blocks = [...n.blocks];
      [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
      return { ...n, blocks };
    });
  }, []);

  const moveDown = useCallback((id: string) => {
    setNote((n) => {
      const idx = n.blocks.findIndex((b) => b.id === id);
      if (idx < 0 || idx >= n.blocks.length - 1) return n;
      const blocks = [...n.blocks];
      [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
      return { ...n, blocks };
    });
  }, []);

  const changeType = useCallback((id: string, type: NoteBlock['type']) => {
    setNote((n) => ({
      ...n,
      blocks: n.blocks.map((b) => (b.id === id ? { ...b, type } : b)),
    }));
  }, []);

  const addBlock = (type: NoteBlock['type']) => {
    const newBlock: NoteBlock = { id: generateBlockId(), type, content: '' };
    setNote((n) => ({ ...n, blocks: [...n.blocks, newBlock] }));
    setShowBlockPicker(false);
  };

  const handleManualSave = () => {
    const updated = { ...note, updatedAt: new Date().toISOString(), wordCount: countWords(note) };
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handlePrint = () => window.print();

  const [tagInput, setTagInput] = useState('');

  return (
    <div className="min-h-screen bg-[#f5f5f3] dark:bg-[#121212]">
      {/* Top bar */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            ← Back
          </button>
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))}
            className="flex-1 text-xl font-black text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-300"
            placeholder="Note title…"
          />
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleManualSave}
            className="px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-colors"
          >
            {saved ? '✓ Saved' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* Metadata row */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-white/5 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center">
          {/* Class */}
          <select
            value={note.classLevel}
            onChange={(e) => setNote((n) => ({ ...n, classLevel: Number(e.target.value) }))}
            className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200"
          >
            <option value={0}>Class…</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          {/* Subject */}
          <select
            value={note.subjectId}
            onChange={(e) => setNote((n) => ({ ...n, subjectId: e.target.value }))}
            className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200"
          >
            <option value="">Subject…</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Chapter */}
          <input
            type="number"
            min={0}
            max={50}
            value={note.chapter || ''}
            onChange={(e) => setNote((n) => ({ ...n, chapter: Number(e.target.value) }))}
            placeholder="Chapter #"
            className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 w-24"
          />

          {/* Type */}
          <select
            value={note.type}
            onChange={(e) => setNote((n) => ({ ...n, type: e.target.value as Note['type'] }))}
            className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200"
          >
            {NOTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>

          {/* Color dots */}
          <div className="flex items-center gap-1">
            {NOTE_COLORS.map((c, i) => (
              <button
                key={c.value}
                onClick={() => setNote((n) => ({ ...n, color: c.value }))}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${note.color === c.value ? 'scale-125 ring-2 ring-violet-400 ring-offset-1' : ''}`}
                style={{ background: c.value, borderColor: NOTE_COLOR_BORDERS[i] }}
                title={c.label}
              />
            ))}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1 flex-wrap">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => setNote((n) => ({ ...n, tags: n.tags.filter((t) => t !== tag) }))}
                  className="text-violet-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                  e.preventDefault();
                  const tag = tagInput.trim().replace(/,/g, '');
                  if (tag && !note.tags.includes(tag)) {
                    setNote((n) => ({ ...n, tags: [...n.tags, tag] }));
                  }
                  setTagInput('');
                }
              }}
              placeholder="Add tag…"
              className="text-xs outline-none bg-transparent text-gray-500 w-20"
            />
          </div>
        </div>
      </div>

      {/* Editor body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Print header (visible only on print) */}
        <div className="hidden print:block mb-6 text-center border-b pb-4">
          <h1 className="text-3xl font-black">{note.title}</h1>
          <div className="text-sm text-gray-500 mt-1">
            {note.classLevel > 0 && `Class ${note.classLevel}`}
            {note.subjectId && ` · ${note.subjectId}`}
            {note.chapter > 0 && ` · Chapter ${note.chapter}`}
            {' · '}
            {NOTE_TYPES.find((t) => t.value === note.type)?.label}
            {' · '}
            {formatDate(note.updatedAt)}
          </div>
        </div>

        {/* Blocks — editor view */}
        <div className="print:hidden space-y-1 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-4">
          {note.blocks.map((block, idx) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={idx}
              total={note.blocks.length}
              onChange={updateBlock}
              onDelete={deleteBlock}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
              onChangeType={changeType}
            />
          ))}

          {/* Add block button */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 mt-2">
            <button
              onClick={() => setShowBlockPicker((v) => !v)}
              className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 font-medium"
            >
              + Add Block
            </button>
            {showBlockPicker && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-center"
                  >
                    <span className="font-mono font-black text-sm text-violet-600 dark:text-violet-400">
                      {bt.emoji}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                      {bt.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">{bt.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Print view */}
        <div className="hidden print:block text-sm text-gray-800">
          {note.blocks.map((block) => (
            <BlockPrintView key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────

export default function NotesMakerClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const handleNew = () => {
    const note = createBlankNote();
    setEditingNote(note);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
  };

  const handleSave = useCallback((note: Note) => {
    saveNote(note);
    setNotes(loadNotes());
  }, []);

  const handleDelete = (id: string) => {
    deleteNote(id);
    setNotes(loadNotes());
  };

  const handleBack = () => {
    setEditingNote(null);
    setNotes(loadNotes());
  };

  if (editingNote) {
    return <Editor note={editingNote} onBack={handleBack} onSave={handleSave} />;
  }

  return <Dashboard notes={notes} onNew={handleNew} onEdit={handleEdit} onDelete={handleDelete} />;
}
