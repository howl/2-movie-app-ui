import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, setToken, removeToken } from './storage.js';

const STORAGE_KEY = 'auth_token';

describe('storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull();
  });

  it('stores and retrieves a token', () => {
    setToken('test-token-123');
    expect(getToken()).toBe('test-token-123');
  });

  it('removes a token', () => {
    setToken('test-token-123');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('overwrites an existing token', () => {
    setToken('first-token');
    setToken('second-token');
    expect(getToken()).toBe('second-token');
  });

  it('uses the correct sessionStorage key', () => {
    setToken('test-token');
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('test-token');
  });

  it('returns null after sessionStorage is cleared externally', () => {
    setToken('test-token');
    sessionStorage.clear();
    expect(getToken()).toBeNull();
  });

  it('stores empty string token', () => {
    setToken('');
    expect(getToken()).toBe('');
  });

  it('stores token with special characters', () => {
    const specialToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.abc123_$!@';
    setToken(specialToken);
    expect(getToken()).toBe(specialToken);
  });

  it('removeToken does not throw when no token exists', () => {
    expect(() => removeToken()).not.toThrow();
  });

  it('stores and retrieves a very long token', () => {
    const longToken = 'a'.repeat(5000);
    setToken(longToken);
    expect(getToken()).toBe(longToken);
  });

  it('stores numeric token as string', () => {
    setToken('12345');
    expect(getToken()).toBe('12345');
  });

  it('stores token with unicode characters', () => {
    setToken('token-ñ-ü-日本語');
    expect(getToken()).toBe('token-ñ-ü-日本語');
  });
});
