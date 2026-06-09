import {
  isEmail,
  isURL,
  isPhoneNumber,
  isStrongPassword,
  isCreditCard,
  isDate,
  isAlphanumeric,
  isPostalCode,
  validateSchema,
} from '../src/validation';

describe('Validation Utilities', () => {
  describe('isEmail', () => {
    it('validates correct emails', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co')).toBe(true);
      expect(isEmail('user+tag@example.org')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isEmail('notanemail')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail('user@domain')).toBe(false);
    });
  });

  describe('isURL', () => {
    it('validates correct URLs', () => {
      expect(isURL('https://example.com')).toBe(true);
      expect(isURL('http://sub.domain.com/path?query=1')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isURL('not-a-url')).toBe(false);
      expect(isURL('ftp://invalid')).toBe(false);
    });
  });

  describe('isPhoneNumber', () => {
    it('validates phone numbers', () => {
      expect(isPhoneNumber('+1234567890')).toBe(true);
      expect(isPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isPhoneNumber('123-456-7890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isPhoneNumber('123')).toBe(false);
      expect(isPhoneNumber('abc-def-ghij')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('validates strong passwords', () => {
      expect(isStrongPassword('MyStr0ng!Pass')).toBe(true);
      expect(isStrongPassword('C0mpl3x#P@ss')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(isStrongPassword('password')).toBe(false);
      expect(isStrongPassword('12345678')).toBe(false);
      expect(isStrongPassword('Short1!')).toBe(false);
    });

    it('validates with custom options', () => {
      const options = { minLength: 6, requireSpecialChar: false };
      expect(isStrongPassword('Long1234', options)).toBe(true);
    });
  });

  describe('isCreditCard', () => {
    it('validates credit card numbers', () => {
      expect(isCreditCard('4111111111111111')).toBe(true); // Visa test
      expect(isCreditCard('5500000000000004')).toBe(true); // Mastercard test
    });

    it('rejects invalid card numbers', () => {
      expect(isCreditCard('1234567890123456')).toBe(false);
      expect(isCreditCard('abcd')).toBe(false);
    });
  });

  describe('isDate', () => {
    it('validates date strings', () => {
      expect(isDate('2024-01-15')).toBe(true);
      expect(isDate('January 15, 2024')).toBe(true);
    });

    it('rejects invalid dates', () => {
      expect(isDate('not a date')).toBe(false);
      expect(isDate('2024-13-01')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('validates alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC')).toBe(true);
    });

    it('rejects non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
    });
  });

  describe('isPostalCode', () => {
    it('validates US postal codes', () => {
      expect(isPostalCode('12345', 'US')).toBe(true);
      expect(isPostalCode('12345-6789', 'US')).toBe(true);
    });

    it('validates UK postal codes', () => {
      expect(isPostalCode('SW1A 1AA', 'UK')).toBe(true);
    });
  });
});