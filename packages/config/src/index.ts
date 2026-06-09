// ============================================================
// @platform/config — Environment variable readers
// ============================================================
// IMPORTANT: Never hardcode secrets in this file or any file.
// Always read from process.env. These functions provide type-safe
// access with validation and defaults.
// ============================================================

// --- Environment ---

export type NodeEnvironment = 'development' | 'staging' | 'production' | 'test';

/**
 * Get the current Node environment
 */
export function getNodeEnv(): NodeEnvironment {
  const env = process.env.NODE_ENV || 'development';
  if (!['development', 'staging', 'production', 'test'].includes(env)) {
    return 'development';
  }
  return env as NodeEnvironment;
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getNodeEnv() === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getNodeEnv() === 'production';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return getNodeEnv() === 'test';
}

// --- Generic Env Readers ---

/**
 * Read a required environment variable. Throws if missing.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Check your .env file and ensure ${key} is set.`
    );
  }
  return value.trim();
}

/**
 * Read an optional environment variable with a default value
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    return defaultValue;
  }
  return value.trim();
}

/**
 * Read an environment variable as a number
 */
export function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  if (isNaN(parsed) || !isFinite(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a valid number, got: "${value}"`
    );
  }
  return parsed;
}

/**
 * Read an environment variable as a boolean
 * Accepts: true, 1, yes, on (case-insensitive) as true
 * Everything else is false
 */
export function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    return defaultValue;
  }
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase().trim());
}

// --- Application Config ---

export interface AppConfig {
  nodeEnv: NodeEnvironment;
  port: number;
  host: string;
  appName: string;
  appUrl: string;
  apiVersion: string;
}

/**
 * Get application configuration from environment
 */
export function getAppConfig(): AppConfig {
  return {
    nodeEnv: getNodeEnv(),
    port: getEnvNumber('PORT', 3001),
    host: getEnv('HOST', '0.0.0.0'),
    appName: getEnv('APP_NAME', 'Toolverse'),
    appUrl: getEnv('APP_URL', 'http://localhost:3000'),
    apiVersion: getEnv('API_VERSION', 'v1'),
  };
}

// --- Database Config ---

export interface DatabaseConfig {
  url: string;
  poolSize: number;
  ssl: boolean;
}

/**
 * Get database configuration from environment
 * IMPORTANT: DATABASE_URL must be set before running the API
 */
export function getDatabaseConfig(): DatabaseConfig {
  return {
    url: getEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/toolverse?schema=public'),
    poolSize: getEnvNumber('DB_POOL_SIZE', 10),
    ssl: getEnvBoolean('DB_SSL', false),
  };
}

// --- Redis Config ---

export interface RedisConfig {
  url: string;
  ttl: number;
  enabled: boolean;
}

/**
 * Get Redis configuration from environment
 */
export function getRedisConfig(): RedisConfig {
  return {
    url: getEnv('REDIS_URL', 'redis://localhost:6379'),
    ttl: getEnvNumber('REDIS_TTL', 3600), // Default 1 hour
    enabled: getEnvBoolean('REDIS_ENABLED', true),
  };
}

// --- Security Config ---

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiry: string;
  bcryptRounds: number;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}

/**
 * Get security configuration from environment
 * IMPORTANT: JWT_SECRET must be set in production
 */
export function getSecurityConfig(): SecurityConfig {
  const nodeEnv = getNodeEnv();
  return {
    jwtSecret: getEnv(
      'JWT_SECRET',
      nodeEnv === 'production' ? '' : 'dev-only-jwt-secret-change-in-production'
    ),
    jwtExpiry: getEnv('JWT_EXPIRY', '24h'),
    bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12),
    corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
    rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
    rateLimitMax: getEnvNumber('RATE_LIMIT_MAX', 100), // 100 requests per window
  };
}

// --- Logging Config ---

export interface LoggingConfig {
  level: string;
  format: 'json' | 'text';
  redactFields: string[];
}

/**
 * Get logging configuration from environment
 * IMPORTANT: Never log request bodies in production (contains passwords, PII)
 */
export function getLoggingConfig(): LoggingConfig {
  return {
    level: getEnv('LOG_LEVEL', isProduction() ? 'info' : 'debug'),
    format: getEnv('LOG_FORMAT', isProduction() ? 'json' : 'text') as 'json' | 'text',
    redactFields: ['password', 'token', 'authorization', 'creditCard', 'ssn'],
  };
}

// --- Full Config ---

export interface FullConfig {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
}

/**
 * Get all configuration at once
 * Validates required values in production
 */
export function getFullConfig(): FullConfig {
  const config: FullConfig = {
    app: getAppConfig(),
    database: getDatabaseConfig(),
    redis: getRedisConfig(),
    security: getSecurityConfig(),
    logging: getLoggingConfig(),
  };

  // Production validation — fail fast if required values are missing
  if (isProduction()) {
    if (!config.security.jwtSecret) {
      throw new Error('JWT_SECRET must be set in production');
    }
    if (config.database.url.includes('localhost')) {
      throw new Error('DATABASE_URL should not point to localhost in production');
    }
  }

  return config;
}

/**
 * Print current config (redacts sensitive values)
 * Useful for debugging at startup
 */
export function printConfig(config: FullConfig): void {
  console.log('=== Application Configuration ===');
  console.log(`  Environment: ${config.app.nodeEnv}`);
  console.log(`  Port: ${config.app.port}`);
  console.log(`  App URL: ${config.app.appUrl}`);
  console.log(`  Database: ${config.database.url.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  console.log(`  Redis: ${config.redis.enabled ? config.redis.url : 'disabled'}`);
  console.log(`  CORS Origin: ${config.security.corsOrigin}`);
  console.log(`  Rate Limit: ${config.security.rateLimitMax} per ${config.security.rateLimitWindowMs / 1000}s`);
  console.log(`  Log Level: ${config.logging.level}`);
  console.log('=================================');
}