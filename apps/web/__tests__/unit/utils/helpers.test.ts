import {
  formatDate,
  formatCurrency,
  truncateText,
  slugify,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  classNames,
  sleep,
  generateId,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/Jan.*15.*2024/);
    });

    it('handles different date formats', () => {
      const result = formatDate('2024-12-25', { format: 'long' });
      expect(result).toContain('December');
      expect(result).toContain('25');
      expect(result).toContain('2024');
    });

    it('returns "Invalid date" for invalid input', () => {
      const result = formatDate('not-a-date');
      expect(result).toBe('Invalid date');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats with different currency', () => {
      expect(formatCurrency(1234.56, { currency: 'EUR' })).toBe('€1,234.56');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative values', () => {
      expect(formatCurrency(-500)).toBe('-$500.00');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const result = truncateText('This is a very long text that needs truncation', 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('does not truncate short text', () => {
      const short = 'Hello';
      expect(truncateText(short, 20)).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello & World!')).toBe('hello-and-world');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });

    it('handles special characters', () => {
      expect(slugify('café résumé')).toBe('cafe-resume');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('debounces function calls', () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('a');
      debouncedFn('b');
      debouncedFn('c');

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('c');
    });

    jest.useRealTimers();
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('throttles function calls', () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 300);

      throttledFn('a');
      throttledFn('b');
      throttledFn('c');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('a');

      jest.advanceTimersByTime(300);
      throttledFn('d');

      expect(fn).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  describe('deepClone', () => {
    it('deep clones an object', () => {
      const original = { a: 1, b: { c: 2, d: { e: 3 } } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it('handles arrays', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('isEmpty', () => {
    it('checks empty objects', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('checks empty arrays', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    });

    it('checks empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });

    it('checks null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe('classNames', () => {
    it('combines class names', () => {
      expect(classNames('a', 'b', 'c')).toBe('a b c');
    });

    it('handles conditional classes', () => {
      expect(classNames('a', false && 'b', 'c')).toBe('a c');
      expect(classNames('a', null, undefined, 'b')).toBe('a b');
    });

    it('handles object syntax', () => {
      expect(classNames({ active: true, disabled: false })).toBe('active');
    });
  });

  describe('sleep', () => {
    jest.useFakeTimers();

    it('resolves after specified time', async () => {
      const promise = sleep(1000);
      jest.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    });

    jest.useRealTimers();
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });

    it('generates IDs with specified prefix', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test_/);
    });
  });
});