import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword, isRequired } from './validators.js';

describe('validators', () => {
  describe('isRequired', () => {
    it('returns false for empty string', () => {
      expect(isRequired('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isRequired(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isRequired(undefined)).toBe(false);
    });

    it('returns true for non-empty string', () => {
      expect(isRequired('hello')).toBe(true);
    });

    it('returns true for string with whitespace', () => {
      expect(isRequired(' ')).toBe(true);
    });

    it('returns true for number zero', () => {
      expect(isRequired(0)).toBe(true);
    });

    it('returns true for boolean false', () => {
      expect(isRequired(false)).toBe(true);
    });

    it('returns false for empty array', () => {
      expect(isRequired([])).toBe(false);
    });

    it('returns true for empty object', () => {
      expect(isRequired({})).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    it('returns true for email with subdomain', () => {
      expect(isValidEmail('user@sub.example.com')).toBe(true);
    });

    it('returns true for email with plus sign', () => {
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('returns true for email with dots in local part', () => {
      expect(isValidEmail('first.last@example.com')).toBe(true);
    });

    it('returns true for email with numbers', () => {
      expect(isValidEmail('user123@example.com')).toBe(true);
    });

    it('returns false for email without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('returns false for email without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('returns false for email without local part', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidEmail(undefined)).toBe(false);
    });

    it('returns false for email with spaces', () => {
      expect(isValidEmail('user @example.com')).toBe(false);
    });

    it('returns false for email with multiple @', () => {
      expect(isValidEmail('user@domain@example.com')).toBe(false);
    });

    it('returns false for email without TLD', () => {
      expect(isValidEmail('user@example')).toBe(false);
    });

    it('returns false for just a string without @', () => {
      expect(isValidEmail('notanemail')).toBe(false);
    });

    it('returns false for boolean', () => {
      expect(isValidEmail(false)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('returns true for password with 8+ chars, a letter and a number', () => {
      expect(isValidPassword('abc12345')).toBe(true);
    });

    it('returns true for password with special characters', () => {
      expect(isValidPassword('abc!@#123')).toBe(true);
    });

    it('returns true for password exactly 8 chars with letter and number', () => {
      expect(isValidPassword('abcd1234')).toBe(true);
    });

    it('returns true for very long password', () => {
      expect(isValidPassword('a1'.repeat(50))).toBe(true);
    });

    it('returns true for password with uppercase and lowercase', () => {
      expect(isValidPassword('Abcd1234')).toBe(true);
    });

    it('returns false for password shorter than 8 chars', () => {
      expect(isValidPassword('ab1')).toBe(false);
    });

    it('returns false for 7 char password', () => {
      expect(isValidPassword('abc1234')).toBe(false);
    });

    it('returns false for password without numbers', () => {
      expect(isValidPassword('abcdefgh')).toBe(false);
    });

    it('returns false for password without letters', () => {
      expect(isValidPassword('12345678')).toBe(false);
    });

    it('returns false for password with only symbols', () => {
      expect(isValidPassword('!@#$%^&*')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidPassword('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isValidPassword(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidPassword(undefined)).toBe(false);
    });

    it('returns false for whitespace-only password', () => {
      expect(isValidPassword('        ')).toBe(false);
    });

    it('returns false for boolean', () => {
      expect(isValidPassword(true)).toBe(false);
    });

    it('returns false for single letter', () => {
      expect(isValidPassword('a')).toBe(false);
    });

    it('returns false for single number', () => {
      expect(isValidPassword('1')).toBe(false);
    });
  });
});
