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

  it('throws error on 401 and removes token', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 401,
      json: () => Promise.resolve({ ok: false, msg: 'Unauthorized' }),
    });

    await expect(api.request('/test')).rejects.toThrow();
    expect(removeToken).toHaveBeenCalled();
  });

  it('throws error when body.ok is false', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ ok: false, msg: 'Invalid credentials' }),
    });

    await expect(api.request('/test')).rejects.toThrow('Invalid credentials');
  });

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

  it('throws error on network failure', async () => {
    getToken.mockReturnValue(FAKE_TOKEN);
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(api.request('/test')).rejects.toThrow('Network error');
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
});
