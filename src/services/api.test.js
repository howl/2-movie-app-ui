import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './api.js';
import { getToken, setToken, removeToken } from '../utils/storage.js';

vi.mock('../utils/storage.js', () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

const API_URL = 'http://localhost:3000';
const FAKE_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.abc';

describe('api.request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Token handling ---

  it('includes Authorization header when token exists', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: FAKE_TOKEN }),
    });

    await api.request('/test');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${FAKE_TOKEN}`,
        }),
      }),
    );
  });

  it('does not include Authorization header when token is null', async () => {
    getToken.mockReturnValue(null);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: FAKE_TOKEN }),
    });

    await api.request('/test');

    const headers = globalThis.fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it('does not include Authorization header when token is empty string', async () => {
    getToken.mockReturnValue('');
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: FAKE_TOKEN }),
    });

    await api.request('/test');

    const headers = globalThis.fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  // --- Response parsing ---

  it('parses JSON response and returns body', async () => {
    getToken.mockReturnValue(null);
    const responseBody = { ok: true, msg: 'success', token: FAKE_TOKEN };
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(responseBody),
    });

    const result = await api.request('/test');
    expect(result).toEqual(responseBody);
  });

  // --- Error handling: HTTP status ---

  it('throws error on 401 and removes token', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 401,
      json: () => Promise.resolve({ ok: false, msg: 'Unauthorized' }),
    });

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    await expect(api.request('/test')).rejects.toThrow('Unauthorized');
    expect(removeToken).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it('throws generic error on 401 without msg', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 401,
      json: () => Promise.resolve({ ok: false }),
    });

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    await expect(api.request('/test')).rejects.toThrow('Unauthorized');
    expect(removeToken).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it('throws error on 500 without removing token', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 500,
      json: () => Promise.resolve({ ok: false, msg: 'Internal server error' }),
    });

    await expect(api.request('/test')).rejects.toThrow('Internal server error');
    expect(removeToken).not.toHaveBeenCalled();
  });

  it('handles 400 (bad request) errors', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 400,
      json: () => Promise.resolve({ ok: false, msg: 'Validation failed' }),
    });

    await expect(api.request('/test')).rejects.toThrow('Validation failed');
  });

  it('handles 404 (not found) errors', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 404,
      json: () => Promise.resolve({ ok: false, msg: 'Not found' }),
    });

    await expect(api.request('/test')).rejects.toThrow('Not found');
  });

  it('handles 403 (forbidden) without throwing (body.ok is true)', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 403,
      json: () => Promise.resolve({ ok: true, msg: 'Acceso prohibido' }),
    });

    const result = await api.request('/test');
    expect(result.msg).toBe('Acceso prohibido');
    expect(removeToken).not.toHaveBeenCalled();
  });

  // --- Error handling: body.ok === false ---

  it('throws error when body.ok is false', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: false, msg: 'Invalid credentials' }),
    });

    await expect(api.request('/test')).rejects.toThrow('Invalid credentials');
  });

  it('throws generic error when body.ok is false and msg is missing', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: false }),
    });

    await expect(api.request('/test')).rejects.toThrow('Request failed');
  });

  // --- Token refresh ---

  it('saves new token from response', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    const NEW_TOKEN = 'new-token-abc';
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: NEW_TOKEN }),
    });

    await api.request('/test');
    expect(setToken).toHaveBeenCalledWith(NEW_TOKEN);
  });

  it('does not save token when response has no token', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok' }),
    });

    await api.request('/test');
    expect(setToken).not.toHaveBeenCalled();
  });

  it('returns body after saving the token', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    const responseBody = { ok: true, msg: 'ok', token: 'new-token', data: 'test' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(responseBody),
    });

    const result = await api.request('/test');
    expect(result).toEqual(responseBody);
  });

  // --- Request construction ---

  it('sends GET request by default', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: FAKE_TOKEN }),
    });

    await api.request('/test');

    expect(globalThis.fetch.mock.calls[0][1].method).toBe('GET');
  });

  it('sends request with provided method and body', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: FAKE_TOKEN }),
    });

    const body = { email: 'test@example.com', password: '12345678' };
    await api.request('/auth/login', { method: 'POST', body });

    const fetchCall = globalThis.fetch.mock.calls[0];
    expect(fetchCall[0]).toBe(`${API_URL}/auth/login`);
    expect(fetchCall[1].method).toBe('POST');
    expect(JSON.parse(fetchCall[1].body)).toEqual(body);
  });

  it('sends FormData without Content-Type header', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: 'ok', token: FAKE_TOKEN }),
    });

    const formData = new FormData();
    formData.append('title', 'Test');
    await api.request('/admin/movies', { method: 'POST', body: formData });

    const fetchCall = globalThis.fetch.mock.calls[0];
    expect(fetchCall[1].body).toBe(formData);
    expect(fetchCall[1].headers['Content-Type']).toBeUndefined();
  });

  it('handles endpoint with query parameters', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: true, msg: [], token: FAKE_TOKEN }),
    });

    await api.request('/movies/search?title=Matrix&year=1999');

    expect(globalThis.fetch.mock.calls[0][0]).toBe(`${API_URL}/movies/search?title=Matrix&year=1999`);
  });

  // --- Network errors ---

  it('throws error on network failure', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(api.request('/test')).rejects.toThrow('Network error');
  });

  it('throws error on fetch with non-Error rejection', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockRejectedValue('String error');

    await expect(api.request('/test')).rejects.toThrow('String error');
  });

  it('preserves original error cause when rethrowing', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    const originalError = new Error('Failed to fetch');
    globalThis.fetch = vi.fn().mockRejectedValue(originalError);

    try {
      await api.request('/test');
    } catch (error) {
      expect(error.cause).toBe(originalError);
    }
  });

  // --- Edge cases with fetch response ---

  it('handles empty JSON response body', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({}),
    });

    const result = await api.request('/test');
    expect(result).toEqual({});
  });
});
