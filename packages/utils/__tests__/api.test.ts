import {
  buildQueryString,
  parseQueryString,
  buildUrl,
  createHeaders,
  handleApiResponse,
  isRetryableError,
  retryWithBackoff,
} from '../src/api';

describe('API Utilities', () => {
  describe('buildQueryString', () => {
    it('builds query string from object', () => {
      expect(buildQueryString({ page: 1, limit: 10 })).toBe('page=1&limit=10');
    });

    it('skips undefined and null values', () => {
      expect(buildQueryString({ a: 1, b: null, c: undefined })).toBe('a=1');
    });

    it('handles array values', () => {
      expect(buildQueryString({ ids: [1, 2, 3] })).toBe('ids=1&ids=2&ids=3');
    });

    it('encodes special characters', () => {
      expect(buildQueryString({ q: 'hello world' })).toBe('q=hello%20world');
    });

    it('returns empty string for empty object', () => {
      expect(buildQueryString({})).toBe('');
    });
  });

  describe('parseQueryString', () => {
    it('parses query string to object', () => {
      expect(parseQueryString('page=1&limit=10')).toEqual({ page: '1', limit: '10' });
    });

    it('handles empty string', () => {
      expect(parseQueryString('')).toEqual({});
    });

    it('decodes special characters', () => {
      expect(parseQueryString('q=hello%20world')).toEqual({ q: 'hello world' });
    });
  });

  describe('buildUrl', () => {
    it('builds URL with path and query', () => {
      expect(buildUrl('https://api.example.com', '/users', { page: 1 })).toBe(
        'https://api.example.com/users?page=1'
      );
    });

    it('handles trailing slash', () => {
      expect(buildUrl('https://api.example.com/', '/users')).toBe(
        'https://api.example.com/users'
      );
    });
  });

  describe('createHeaders', () => {
    it('creates headers with auth token', () => {
      const headers = createHeaders({ token: 'abc123' });
      expect(headers['Authorization']).toBe('Bearer abc123');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('creates headers without auth', () => {
      const headers = createHeaders();
      expect(headers['Authorization']).toBeUndefined();
    });

    it('merges custom headers', () => {
      const headers = createHeaders({ customHeaders: { 'X-Custom': 'value' } });
      expect(headers['X-Custom']).toBe('value');
    });
  });

  describe('handleApiResponse', () => {
    it('returns data for successful response', async () => {
      const response = {
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      } as Response;

      const result = await handleApiResponse(response);
      expect(result).toEqual({ data: 'test' });
    });

    it('throws for error response', async () => {
      const response = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' }),
      } as unknown as Response;

      await expect(handleApiResponse(response)).rejects.toThrow();
    });
  });

  describe('isRetryableError', () => {
    it('identifies retryable errors', () => {
      expect(isRetryableError({ status: 429 })).toBe(true);
      expect(isRetryableError({ status: 500 })).toBe(true);
      expect(isRetryableError({ status: 502 })).toBe(true);
      expect(isRetryableError({ status: 503 })).toBe(true);
    });

    it('identifies non-retryable errors', () => {
      expect(isRetryableError({ status: 400 })).toBe(false);
      expect(isRetryableError({ status: 401 })).toBe(false);
      expect(isRetryableError({ status: 403 })).toBe(false);
      expect(isRetryableError({ status: 404 })).toBe(false);
    });
  });

  describe('retryWithBackoff', () => {
    it('retries on retryable errors and succeeds', async () => {
      let attempt = 0;
      const fn = jest.fn().mockImplementation(async () => {
        attempt++;
        if (attempt < 3) throw { status: 500 };
        return 'success';
      });

      const result = await retryWithBackoff(fn, { maxRetries: 3, baseDelay: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('throws after max retries', async () => {
      const fn = jest.fn().mockRejectedValue({ status: 500 });

      await expect(
        retryWithBackoff(fn, { maxRetries: 2, baseDelay: 10 })
      ).rejects.toEqual({ status: 500 });

      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });
  });
});