// ============================================================
// @platform/utils — Shared utility functions
// ============================================================

// --- String Utilities ---

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to slug format (lowercase, hyphens, no special chars)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate a string to a maximum length, adding ellipsis if truncated
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove all non-alphanumeric characters from a string
 */
export function alphanumericOnly(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Mask a string, showing only the first and last N characters
 * Useful for displaying API keys or emails partially
 */
export function maskString(str: string, visibleStart: number = 2, visibleEnd: number = 2): string {
  if (!str || str.length <= visibleStart + visibleEnd) return str;
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskedLength = str.length - visibleStart - visibleEnd;
  return `${start}${'*'.repeat(maskedLength)}${end}`;
}

// --- Number Utilities ---

/**
 * Clamp a number between a minimum and maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round a number to a specified number of decimal places
 */
export function roundTo(value: number, decimals: number): number {
  if (decimals < 0) decimals = 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format a number as currency string
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with commas for thousands separators
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Convert a number to a percentage string
 */
export function toPercentage(value: number, decimals: number = 1): string {
  return `${roundTo(value, decimals)}%`;
}

/**
 * Check if a value is a finite number (not NaN, not Infinity)
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Safely parse a number from a string, returning a default on failure
 */
export function safeParseNumber(value: string, defaultValue: number = 0): number {
  const parsed = Number(value);
  return isNaN(parsed) || !isFinite(parsed) ? defaultValue : parsed;
}

// --- Date Utilities ---

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the number of days between two dates
 */
export function daysBetween(dateA: Date, dateB: Date): number {
  const oneDayMs = 86400000; // 24 * 60 * 60 * 1000
  const a = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const b = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  const diffMs = Math.abs(a.getTime() - b.getTime());
  return Math.round(diffMs / oneDayMs);
}

/**
 * Check if a string is a valid ISO date (YYYY-MM-DD)
 */
export function isValidDateString(str: string): boolean {
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoPattern.test(str)) return false;
  const date = new Date(str + 'T00:00:00Z');
  return !isNaN(date.getTime());
}

// --- Array Utilities ---

/**
 * Remove duplicate values from an array
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Chunk an array into smaller arrays of a specified size
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size < 1) throw new Error('Chunk size must be at least 1');
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Shuffle an array (returns a new array, does not mutate original)
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// --- Object Utilities ---

/**
 * Deep clone an object using structuredClone (available in Node 17+)
 * Falls back to JSON parse/stringify for older environments
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick specific keys from an object (type-safe)
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object (type-safe)
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Check if an object is empty (has no own enumerable properties)
 */
export function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

// --- Async Utilities ---

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

// --- ID Generation ---

/**
 * Generate a simple unique ID (not cryptographically secure, for UI keys only)
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// --- Conditional Utility ---

/**
 * Type-safe version of cn/clsx for conditional class names
 * This is a minimal implementation — use clsx/tailwind-merge in the web app
 */
export function cn(...classes: (string | boolean | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}