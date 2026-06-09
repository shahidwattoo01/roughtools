/**
 * Base application error. All custom errors extend this.
 * This ensures every error has a consistent shape for API responses.
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, code?: string, isOperational?: boolean, details?: unknown);
    /**
     * Convert to a plain object for JSON API responses
     * IMPORTANT: Never include the stack trace in API responses
     */
    toJSON(): Record<string, unknown>;
}
/**
 * 400 Bad Request — Input validation failed
 */
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * 401 Unauthorized — Missing or invalid authentication
 */
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
/**
 * 403 Forbidden — Authenticated but not authorized
 */
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
/**
 * 404 Not Found — Resource does not exist
 */
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
/**
 * 409 Conflict — Resource already exists or state conflict
 */
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
/**
 * 422 Unprocessable Entity — Semantic validation failed
 */
export declare class UnprocessableEntityError extends AppError {
    constructor(message?: string, details?: unknown);
}
/**
 * 429 Too Many Requests — Rate limit exceeded
 */
export declare class RateLimitError extends AppError {
    constructor(message?: string);
}
/**
 * 500 Internal Server Error — Unexpected failure
 */
export declare class InternalServerError extends AppError {
    constructor(message?: string);
}
/**
 * 502 Bad Gateway — Upstream service returned an invalid response
 */
export declare class BadGatewayError extends AppError {
    constructor(message?: string);
}
/**
 * 503 Service Unavailable — Upstream service is down
 */
export declare class ServiceUnavailableError extends AppError {
    constructor(message?: string);
}
/**
 * Type guard to check if an error is an AppError
 */
export declare function isAppError(error: unknown): error is AppError;
/**
 * Convert any unknown error into an AppError
 * Use this in catch blocks to ensure you always have a structured error
 */
export declare function normalizeError(error: unknown): AppError;
/**
 * Format a success response (companion to AppError.toJSON)
 * Use this everywhere for consistent API responses
 */
export declare function successResponse<T>(data: T, message?: string): Record<string, unknown>;
//# sourceMappingURL=index.d.ts.map