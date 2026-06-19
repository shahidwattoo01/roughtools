// ============================================================
// Notes Maker — localStorage CRUD
// ============================================================

export interface NoteBlock {
  id: string;
  type:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'paragraph'
    | 'bullets'
    | 'numbered'
    | 'formula'
    | 'definition'
    | 'important'
    | 'image'
    | 'divider'
    | 'flashcard';
  content: string; // main text or formula text
  items?: string[]; // for bullets/numbered (one item per line stored as \n)
  term?: string; // for definition & flashcard blocks
  imageUrl?: string; // for image blocks
}

export interface Note {
  id: string;
  title: string;
  classLevel: number; // 0 = unset
  subjectId: string; // '' = unset
  chapter: number; // 0 = unset
  type: 'general' | 'summary' | 'keypoints' | 'formulas' | 'glossary' | 'flashcards' | 'experiment';
  color: string; // one of 8 preset colors
  tags: string[];
  blocks: NoteBlock[];
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

const STORAGE_KEY = 'roughtools_notes_v1';

export function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

export function saveNote(note: Note): void {
  if (typeof window === 'undefined') return;
  const notes = loadNotes();
  const idx = notes.findIndex((n) => n.id === note.id);
  if (idx >= 0) {
    notes[idx] = note;
  } else {
    notes.unshift(note);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function deleteNote(id: string): void {
  if (typeof window === 'undefined') return;
  const notes = loadNotes().filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createBlankNote(): Note {
  const now = new Date().toISOString();
  return {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: 'Untitled Note',
    classLevel: 0,
    subjectId: '',
    chapter: 0,
    type: 'general',
    color: '#fef9c3',
    tags: [],
    blocks: [
      {
        id: generateBlockId(),
        type: 'h1',
        content: '',
      },
      {
        id: generateBlockId(),
        type: 'paragraph',
        content: '',
      },
    ],
    createdAt: now,
    updatedAt: now,
    wordCount: 0,
  };
}

export function countWords(note: Note): number {
  const text = note.blocks
    .map((b) => [b.content, b.term, b.items?.join(' ')].filter(Boolean).join(' '))
    .join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}
