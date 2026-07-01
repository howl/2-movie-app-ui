import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService.js';
import { api } from './api.js';

vi.mock('./api.js', () => ({
  api: {
    request: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('calls api.request with POST and credentials', async () => {
      const credentials = { email: 'user@example.com', password: '12345678' };
      api.request.mockResolvedValue({ ok: true, msg: 'Logged in', user: { name: 'user1' }, token: 'abc' });

      const result = await authService.login(credentials.email, credentials.password);

      expect(api.request).toHaveBeenCalledWith('/api/v1/auth/login', {
        method: 'POST',
        body: credentials,
      });
      expect(result.ok).toBe(true);
    });

    it('propagates errors from api.request', async () => {
      api.request.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login('bad@email.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    it('propagates network errors', async () => {
      api.request.mockRejectedValue(new Error('Network error'));

      await expect(authService.login('test@example.com', '12345678')).rejects.toThrow('Network error');
    });

    it('handles empty email', async () => {
      api.request.mockRejectedValue(new Error('Email is required'));

      await expect(authService.login('', '12345678')).rejects.toThrow('Email is required');
    });

    it('handles empty password', async () => {
      api.request.mockRejectedValue(new Error('Password is required'));

      await expect(authService.login('test@example.com', '')).rejects.toThrow('Password is required');
    });

    it('handles non-existent user response', async () => {
      api.request.mockRejectedValue(new Error('Usuario inexistente'));

      await expect(authService.login('unknown@example.com', '12345678')).rejects.toThrow('Usuario inexistente');
    });

    it('handles wrong password response', async () => {
      api.request.mockRejectedValue(new Error('Contraseña incorrecta'));

      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow('Contraseña incorrecta');
    });

    it('returns user data on successful login', async () => {
      const mockResponse = { ok: true, msg: 'Sesión iniciada', user: { name: 'user1', rol: 'user' }, token: 'abc' };
      api.request.mockResolvedValue(mockResponse);

      const result = await authService.login('user@example.com', '12345678');

      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('user1');
      expect(result.token).toBeDefined();
    });
  });

  describe('signup', () => {
    it('calls api.request with POST and user data', async () => {
      const userData = { name: 'user1', email: 'user@example.com', password: '12345678' };
      api.request.mockResolvedValue({ ok: true, msg: 'User created', user: { name: 'user1' }, token: 'abc' });

      const result = await authService.signup(userData.name, userData.email, userData.password);

      expect(api.request).toHaveBeenCalledWith('/api/v1/auth/signup', {
        method: 'POST',
        body: userData,
      });
      expect(result.ok).toBe(true);
    });

    it('handles duplicate email response', async () => {
      api.request.mockRejectedValue(new Error('Email ya registrado'));

      await expect(authService.signup('user1', 'existing@example.com', '12345678')).rejects.toThrow('Email ya registrado');
    });

    it('handles short name', async () => {
      api.request.mockRejectedValue(new Error('Name must be at least 3 characters'));

      await expect(authService.signup('ab', 'test@example.com', '12345678')).rejects.toThrow('Name must be at least 3 characters');
    });

    it('handles weak password on signup', async () => {
      api.request.mockRejectedValue(new Error('Password is not strong enough'));

      await expect(authService.signup('user1', 'test@example.com', 'weak')).rejects.toThrow('Password is not strong enough');
    });

    it('returns user data on successful signup', async () => {
      const mockResponse = { ok: true, msg: 'Nuevo usuario registrado', user: { name: 'newuser' }, token: 'abc' };
      api.request.mockResolvedValue(mockResponse);

      const result = await authService.signup('newuser', 'new@example.com', '12345678');

      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('newuser');
    });
  });
});
