// ============================================================
// @platform/errors — Structured error classes
// ============================================================

/**
 * Base application error. All custom errors extend this.
 * This ensures every error has a consistent shape for API responses.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace in V8 environments (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert to a plain object for JSON API responses
   * IMPORTANT: Never include the stack trace in API responses
   */
  toJSON(): Record<string, unknown> {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

/**
 * 400 Bad Request — Input validation failed
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

/**
 * 401 Unauthorized — Missing or invalid authentication
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR', true);
  }
}

/**
 * 403 Forbidden — Authenticated but not authorized
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN_ERROR', true);
  }
}

/**
 * 404 Not Found — Resource does not exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND', true);
  }
}

/**
 * 409 Conflict — Resource already exists or state conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR', true);
  }
}

/**
 * 422 Unprocessable Entity — Semantic validation failed
 */
export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Unprocessable entity', details?: unknown) {
    super(message, 422, 'UNPROCESSABLE_ENTITY', true, details);
  }
}

/**
 * 429 Too Many Requests — Rate limit exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429, 'RATE_LIMIT_ERROR', true);
  }
}

/**
 * 500 Internal Server Error — Unexpected failure
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR', false);
  }
}

/**
 * 502 Bad Gateway — Upstream service returned an invalid response
 */
export class BadGatewayError extends AppError {
  constructor(message: string = 'Bad gateway') {
    super(message, 502, 'BAD_GATEWAY', true);
  }
}

/**
 * 503 Service Unavailable — Upstream service is down
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE', true);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Convert any unknown error into an AppError
 * Use this in catch blocks to ensure you always have a structured error
 */
export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message);
  }

  if (typeof error === 'string') {
    return new InternalServerError(error);
  }

  return new InternalServerError('An unknown error occurred');
}

/**
 * Format a success response (companion to AppError.toJSON)
 * Use this everywhere for consistent API responses
 */
export function successResponse<T>(data: T, message?: string): Record<string, unknown> {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
}