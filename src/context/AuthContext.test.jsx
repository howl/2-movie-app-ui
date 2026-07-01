import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext.js';
import { AuthProvider } from './AuthProvider.jsx';

const mockGetToken = vi.fn();
const mockSetToken = vi.fn();
const mockRemoveToken = vi.fn();

vi.mock('../utils/storage.js', () => ({
  getToken: (...args) => mockGetToken(...args),
  setToken: (...args) => mockSetToken(...args),
  removeToken: (...args) => mockRemoveToken(...args),
}));

const useAuth = () => useContext(AuthContext);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null user and null token when no token in storage', () => {
    mockGetToken.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('initializes with token from storage when it exists', () => {
    mockGetToken.mockReturnValue('stored-token');

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.token).toBe('stored-token');
  });

  it('initializes isAuthenticated as false when no token', () => {
    mockGetToken.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login sets user, token, and updates isAuthenticated', () => {
    mockGetToken.mockReturnValue(null);
    const user = { name: 'user1', email: 'u@example.com', rol: 'user' };
    const token = 'jwt-token';

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login(user, token); });

    expect(result.current.user).toEqual(user);
    expect(result.current.token).toBe(token);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockSetToken).toHaveBeenCalledWith(token);
  });

  it('login overwrites previous user and token', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'old' }, 'old-token'); });
    act(() => { result.current.login({ name: 'new' }, 'new-token'); });

    expect(result.current.user.name).toBe('new');
    expect(result.current.token).toBe('new-token');
  });

  it('logout clears user, token, and calls removeToken', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'u' }, 't'); });
    act(() => { result.current.logout(); });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockRemoveToken).toHaveBeenCalled();
  });

  it('logout does not throw when called without prior login', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(() => {
      act(() => { result.current.logout(); });
    }).not.toThrow();
  });

  it('isAdmin returns true when user rol is admin', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'admin1', rol: 'admin' }, 't'); });

    expect(result.current.isAdmin).toBe(true);
  });

  it('isAdmin returns false when user rol is user', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'user1', rol: 'user' }, 't'); });

    expect(result.current.isAdmin).toBe(false);
  });

  it('isAdmin returns false when user is null', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAdmin).toBe(false);
  });

  it('treats empty string token from storage as not authenticated', () => {
    mockGetToken.mockReturnValue('');
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.token).toBe('');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('exposes login and logout functions', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('toggles isAuthenticated correctly through login and logout cycle', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'u' }, 't'); });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => { result.current.logout(); });
    expect(result.current.isAuthenticated).toBe(false);

    act(() => { result.current.login({ name: 'u2' }, 't2'); });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('isAdmin returns false when user rol is null', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'admin1', rol: null }, 't'); });

    expect(result.current.isAdmin).toBe(false);
  });

  it('isAdmin returns false when user has no rol property', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'user1' }, 't'); });

    expect(result.current.isAdmin).toBe(false);
  });

  it('handles login with empty user object', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({}, 'some-token'); });

    expect(result.current.user).toEqual({});
    expect(result.current.token).toBe('some-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('handles multiple rapid logins', () => {
    mockGetToken.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => { result.current.login({ name: 'a' }, 't1'); });
    act(() => { result.current.login({ name: 'b' }, 't2'); });
    act(() => { result.current.login({ name: 'c' }, 't3'); });

    expect(result.current.user.name).toBe('c');
    expect(result.current.token).toBe('t3');
    expect(mockSetToken).toHaveBeenCalledTimes(3);
  });

  it('logs out when auth:unauthorized event is dispatched', () => {
    mockGetToken.mockReturnValue('stored-token');
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(mockRemoveToken).toHaveBeenCalled();
  });
});
