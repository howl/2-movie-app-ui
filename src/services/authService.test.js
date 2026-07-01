import { describe, it, expect, vi } from 'vitest';
import { authService } from './authService.js';
import { api } from './api.js';

vi.mock('./api.js', () => ({
  api: {
    request: vi.fn(),
  },
}));

describe('authService', () => {
  it('login calls api.request with POST and credentials', async () => {
    const credentials = { email: 'user@example.com', password: '12345678' };
    api.request.mockResolvedValue({ ok: true, msg: 'Logged in', user: { name: 'user1' }, token: 'abc' });

    const result = await authService.login(credentials.email, credentials.password);

    expect(api.request).toHaveBeenCalledWith('/api/v1/auth/login', {
      method: 'POST',
      body: credentials,
    });
    expect(result.ok).toBe(true);
  });

  it('signup calls api.request with POST and user data', async () => {
    const userData = { name: 'user1', email: 'user@example.com', password: '12345678' };
    api.request.mockResolvedValue({ ok: true, msg: 'User created', user: { name: 'user1' }, token: 'abc' });

    const result = await authService.signup(userData.name, userData.email, userData.password);

    expect(api.request).toHaveBeenCalledWith('/api/v1/auth/signup', {
      method: 'POST',
      body: userData,
    });
    expect(result.ok).toBe(true);
  });

  it('login propagates errors from api.request', async () => {
    api.request.mockRejectedValue(new Error('Invalid credentials'));

    await expect(authService.login('bad@email.com', 'wrong')).rejects.toThrow('Invalid credentials');
  });
});
