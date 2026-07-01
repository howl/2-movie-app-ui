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
  });

  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    it('returns false for email without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('returns false for email without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    it('returns true for email with subdomain', () => {
      expect(isValidEmail('user@sub.example.com')).toBe(true);
    });
  });

  describe('isValidPassword', () => {
    it('returns true for password with 8+ chars, a letter and a number', () => {
      expect(isValidPassword('abc12345')).toBe(true);
    });

    it('returns false for password shorter than 8 chars', () => {
      expect(isValidPassword('ab1')).toBe(false);
    });

    it('returns false for password without numbers', () => {
      expect(isValidPassword('abcdefgh')).toBe(false);
    });

    it('returns false for password without letters', () => {
      expect(isValidPassword('12345678')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidPassword('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isValidPassword(null)).toBe(false);
    });
  });
});
