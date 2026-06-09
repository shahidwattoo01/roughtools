// ============================================================
// @platform/validation — Input validation functions
// ============================================================
// IMPORTANT: These validators are used on BOTH the API and the
// frontend. Never trust data from the client, but also validate
// on the client for better UX before sending to the API.
// ============================================================

// --- Validation Result Type ---

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Helper to create a passing validation result
 */
export function valid(): ValidationResult {
  return { valid: true, errors: [] };
}

/**
 * Helper to create a failing validation result
 */
export function invalid(...errors: string[]): ValidationResult {
  return { valid: false, errors };
}

// --- String Validators ---

/**
 * Check if a string is non-empty after trimming
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate that a string length is within bounds
 */
export function validateStringLength(
  value: string,
  minLength: number = 0,
  maxLength: number = 10000,
  fieldName: string = 'value'
): ValidationResult {
  const errors: string[] = [];
  if (typeof value !== 'string') {
    return invalid(`${fieldName} must be a string`);
  }
  if (value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} character(s)`);
  }
  if (value.length > maxLength) {
    errors.push(`${fieldName} must be at most ${maxLength} character(s)`);
  }
  return errors.length > 0 ? invalid(...errors) : valid();
}

// --- Email Validator ---

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate an email address format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate email and return a ValidationResult
 */
export function validateEmail(email: unknown): ValidationResult {
  if (typeof email !== 'string') {
    return invalid('Email must be a string');
  }
  if (!EMAIL_REGEX.test(email)) {
    return invalid('Invalid email format');
  }
  if (email.length > 254) {
    return invalid('Email is too long (max 254 characters)');
  }
  return valid();
}

// --- URL Validator ---

/**
 * Validate a URL string
 */
export function isValidURL(url: string, allowedProtocols: string[] = ['http:', 'https:']): boolean {
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate URL and return a ValidationResult
 */
export function validateURL(url: unknown, allowedProtocols?: string[]): ValidationResult {
  if (typeof url !== 'string') {
    return invalid('URL must be a string');
  }
  if (!isValidURL(url, allowedProtocols)) {
    return invalid('Invalid URL format or protocol not allowed');
  }
  return valid();
}

// --- Number Validators ---

/**
 * Validate that a value is a number within a range
 */
export function validateNumberRange(
  value: unknown,
  min: number = -Infinity,
  max: number = Infinity,
  fieldName: string = 'value'
): ValidationResult {
  if (typeof value !== 'number' || !isFinite(value)) {
    return invalid(`${fieldName} must be a valid number`);
  }
  const errors: string[] = [];
  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }
  if (value > max) {
    errors.push(`${fieldName} must be at most ${max}`);
  }
  return errors.length > 0 ? invalid(...errors) : valid();
}

/**
 * Validate that a value is a positive number (greater than 0)
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

/**
 * Validate that a value is a non-negative number (0 or greater)
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value) && value >= 0;
}

// --- Password Validator ---

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Evaluate password strength
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const labels: PasswordStrength['label'][] = [
    'Very Weak',
    'Very Weak',
    'Weak',
    'Fair',
    'Strong',
    'Very Strong',
  ];

  return {
    score: Math.min(passedChecks, 4),
    label: labels[passedChecks],
    checks,
  };
}

/**
 * Validate a password meets minimum requirements
 */
export function validatePassword(password: unknown): ValidationResult {
  if (typeof password !== 'string') {
    return invalid('Password must be a string');
  }
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (password.length > 128) {
    errors.push('Password must be at most 128 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors.length > 0 ? invalid(...errors) : valid();
}

// --- File Validators ---

/**
 * Validate a file size in bytes is within limits
 */
export function validateFileSize(
  fileSizeBytes: number,
  maxSizeMB: number = 10
): ValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (fileSizeBytes < 0) {
    return invalid('File size cannot be negative');
  }
  if (fileSizeBytes > maxSizeBytes) {
    return invalid(`File size exceeds maximum of ${maxSizeMB}MB`);
  }
  return valid();
}

/**
 * Validate a file extension against an allowed list
 * NOTE: This only checks the extension, NOT the actual file content.
 * On the server, always validate the file header bytes using a package
 * like `file-type`. Never trust the extension alone.
 */
export function validateFileExtension(
  filename: string,
  allowedExtensions: string[]
): ValidationResult {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) {
    return invalid('File has no extension');
  }
  if (!allowedExtensions.map((e) => e.toLowerCase()).includes(ext)) {
    return invalid(
      `File extension ".${ext}" is not allowed. Allowed: ${allowedExtensions.join(', ')}`
    );
  }
  return valid();
}

// --- SSRF Protection ---

/**
 * Validate that a URL or IP is not targeting a private/internal network
 * CRITICAL: Use this before making any outbound request from the server
 * based on user input (SSL checker, VPN checker, IP lookup, etc.)
 */
export function isPrivateIP(ip: string): boolean {
  const privateRanges = [
    /^10\./,                        // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./,                  // 192.168.0.0/16
    /^127\./,                       // 127.0.0.0/8 (loopback)
    /^0\./,                         // 0.0.0.0/8
    /^169\.254\./,                  // 169.254.0.0/16 (link-local)
    /^::1$/,                        // IPv6 loopback
    /^fc00:/i,                      // IPv6 unique local
    /^fe80:/i,                      // IPv6 link-local
  ];
  return privateRanges.some((range) => range.test(ip));
}

/**
 * Validate a URL is safe for server-side requests (not SSRF)
 */
export function validateSafeURL(url: string): ValidationResult {
  if (!isValidURL(url)) {
    return invalid('Invalid URL format');
  }
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    // Check for private IP ranges
    if (isPrivateIP(hostname)) {
      return invalid('URL points to a private network address');
    }

    // Block common internal hostnames
    const blockedHosts = ['localhost', 'internal', 'metadata.google.internal'];
    if (blockedHosts.includes(hostname)) {
      return invalid('URL hostname is not allowed');
    }

    return valid();
  } catch {
    return invalid('Invalid URL');
  }
}

// --- Pagination Validator ---

/**
 * Validate and sanitize pagination parameters
 */
export function validatePagination(
  page: unknown,
  limit: unknown,
  maxLimit: number = 100
): { page: number; limit: number } | ValidationResult {
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : NaN;
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : typeof limit === 'number' ? limit : NaN;

  if (isNaN(pageNum) || pageNum < 1) {
    return invalid('Page must be a positive integer');
  }
  if (isNaN(limitNum) || limitNum < 1) {
    return invalid('Limit must be a positive integer');
  }
  if (limitNum > maxLimit) {
    return invalid(`Limit cannot exceed ${maxLimit}`);
  }

  return { page: pageNum, limit: limitNum };
}

// --- Sanitization ---

/**
 * Strip HTML tags from a string (basic sanitization)
 */
export function stripHTML(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize a string for safe use (trim, strip HTML, normalize whitespace)
 */
export function sanitizeString(input: string): string {
  return stripHTML(input).trim().replace(/\s+/g, ' ');
}