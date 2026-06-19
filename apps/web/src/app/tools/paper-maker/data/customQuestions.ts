'use client';
import type { Question } from './questions';

const STORAGE_KEY = 'papermaker_custom_questions';

export function loadCustomQuestions(): Question[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Question[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomQuestion(q: Omit<Question, 'id'>): Question {
  const all = loadCustomQuestions();
  const newQ: Question = {
    ...q,
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, newQ]));
  return newQ;
}

export function updateCustomQuestion(id: string, updates: Partial<Question>): void {
  const all = loadCustomQuestions();
  const updated = all.map((q) => (q.id === id ? { ...q, ...updates } : q));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteCustomQuestion(id: string): void {
  const all = loadCustomQuestions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter((q) => q.id !== id)));
}

export function isCustomQuestion(id: string): boolean {
  return id.startsWith('custom_');
}
