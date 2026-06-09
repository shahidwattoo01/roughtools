import {
  formatDate,
  formatNumber,
  formatCurrency,
  formatFileSize,
  formatPercentage,
  formatRelativeTime,
} from '../src/format';

describe('Format Utilities', () => {
  describe('formatDate', () => {
    it('formats dates in short format', () => {
      expect(formatDate('2024-03-15', 'short')).toMatch(/3.*15.*24/);
    });

    it('formats dates in long format', () => {
      expect(formatDate('2024-03-15', 'long')).toContain('March');
      expect(formatDate('2024-03-15', 'long')).toContain('2024');
    });

    it('formats dates in relative format', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 86400000);
      expect(formatDate(yesterday.toISOString(), 'relative')).toBe('yesterday');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('formats with decimal places', () => {
      expect(formatNumber(1234.5678, { decimals: 2 })).toBe('1,234.57');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats EUR', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });

    it('formats JPY (no decimals)', () => {
      expect(formatCurrency(1234, 'JPY')).toBe('¥1,234');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats kilobytes', () => {
      expect(formatFileSize(1500)).toBe('1.5 KB');
    });

    it('formats megabytes', () => {
      expect(formatFileSize(1500000)).toBe('1.5 MB');
    });

    it('formats gigabytes', () => {
      expect(formatFileSize(1500000000)).toBe('1.5 GB');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentages', () => {
      expect(formatPercentage(0.856)).toBe('85.6%');
    });

    it('formats with custom decimals', () => {
      expect(formatPercentage(0.8567, { decimals: 1 })).toBe('85.7%');
    });
  });

  describe('formatRelativeTime', () => {
    it('formats seconds ago', () => {
      const date = new Date(Date.now() - 30000);
      expect(formatRelativeTime(date)).toBe('30 seconds ago');
    });

    it('formats minutes ago', () => {
      const date = new Date(Date.now() - 300000);
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });

    it('formats hours ago', () => {
      const date = new Date(Date.now() - 7200000);
      expect(formatRelativeTime(date)).toBe('2 hours ago');
    });

    it('formats days ago', () => {
      const date = new Date(Date.now() - 172800000);
      expect(formatRelativeTime(date)).toBe('2 days ago');
    });
  });
});