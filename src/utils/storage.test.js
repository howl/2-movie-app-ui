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
});
