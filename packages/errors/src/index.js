"use strict";
// ============================================================
// @platform/errors — Structured error classes
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.BadGatewayError = exports.InternalServerError = exports.RateLimitError = exports.UnprocessableEntityError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
exports.isAppError = isAppError;
exports.normalizeError = normalizeError;
exports.successResponse = successResponse;
/**
 * Base application error. All custom errors extend this.
 * This ensures every error has a consistent shape for API responses.
 */
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true, details) {
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
    toJSON() {
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
exports.AppError = AppError;
/**
 * 400 Bad Request — Input validation failed
 */
class ValidationError extends AppError {
    constructor(message = 'Validation failed', details) {
        super(message, 400, 'VALIDATION_ERROR', true, details);
    }
}
exports.ValidationError = ValidationError;
/**
 * 401 Unauthorized — Missing or invalid authentication
 */
class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401, 'AUTHENTICATION_ERROR', true);
    }
}
exports.AuthenticationError = AuthenticationError;
/**
 * 403 Forbidden — Authenticated but not authorized
 */
class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'FORBIDDEN_ERROR', true);
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * 404 Not Found — Resource does not exist
 */
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND', true);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * 409 Conflict — Resource already exists or state conflict
 */
class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409, 'CONFLICT_ERROR', true);
    }
}
exports.ConflictError = ConflictError;
/**
 * 422 Unprocessable Entity — Semantic validation failed
 */
class UnprocessableEntityError extends AppError {
    constructor(message = 'Unprocessable entity', details) {
        super(message, 422, 'UNPROCESSABLE_ENTITY', true, details);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
/**
 * 429 Too Many Requests — Rate limit exceeded
 */
class RateLimitError extends AppError {
    constructor(message = 'Too many requests, please try again later') {
        super(message, 429, 'RATE_LIMIT_ERROR', true);
    }
}
exports.RateLimitError = RateLimitError;
/**
 * 500 Internal Server Error — Unexpected failure
 */
class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_ERROR', false);
    }
}
exports.InternalServerError = InternalServerError;
/**
 * 502 Bad Gateway — Upstream service returned an invalid response
 */
class BadGatewayError extends AppError {
    constructor(message = 'Bad gateway') {
        super(message, 502, 'BAD_GATEWAY', true);
    }
}
exports.BadGatewayError = BadGatewayError;
/**
 * 503 Service Unavailable — Upstream service is down
 */
class ServiceUnavailableError extends AppError {
    constructor(message = 'Service temporarily unavailable') {
        super(message, 503, 'SERVICE_UNAVAILABLE', true);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
/**
 * Type guard to check if an error is an AppError
 */
function isAppError(error) {
    return error instanceof AppError;
}
/**
 * Convert any unknown error into an AppError
 * Use this in catch blocks to ensure you always have a structured error
 */
function normalizeError(error) {
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
function successResponse(data, message) {
    return {
        success: true,
        data,
        ...(message ? { message } : {}),
    };
}
//# sourceMappingURL=index.js.map