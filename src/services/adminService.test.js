import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminService } from './adminService.js';
import { api } from './api.js';

vi.mock('./api.js', () => ({
  api: {
    request: vi.fn(),
  },
}));

describe('adminService', () => {
  const FAKE_MOVIE = { _id: '64a1b2c3d4e5f6a7b8c9d0e1', title: 'The Matrix', year: 1999 };
  const FAKE_MOVIES = [FAKE_MOVIE];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('calls GET /admin/movies', async () => {
      api.request.mockResolvedValue({ ok: true, msg: '1 movie found', movies: FAKE_MOVIES, token: 'abc' });

      const result = await adminService.getAll();

      expect(api.request).toHaveBeenCalledWith('/api/v1/admin/movies');
      expect(result.movies).toEqual(FAKE_MOVIES);
    });

    it('handles empty movie list', async () => {
      api.request.mockRejectedValue(new Error('No se encontraron películas'));

      await expect(adminService.getAll()).rejects.toThrow('No se encontraron películas');
    });

    it('propagates errors', async () => {
      api.request.mockRejectedValue(new Error('Failed to fetch movies'));

      await expect(adminService.getAll()).rejects.toThrow('Failed to fetch movies');
    });
  });

  describe('create', () => {
    it('calls POST with FormData', async () => {
      const formData = new FormData();
      formData.append('title', 'New Movie');
      api.request.mockResolvedValue({ ok: true, msg: 'Película creada', movie: { title: 'New Movie' }, token: 'abc' });

      const result = await adminService.create(formData);

      expect(api.request).toHaveBeenCalledWith('/api/v1/admin/movies', {
        method: 'POST',
        body: formData,
      });
      expect(result.ok).toBe(true);
    });

    it('handles missing required fields', async () => {
      api.request.mockRejectedValue(new Error('Title is required'));

      const formData = new FormData();
      await expect(adminService.create(formData)).rejects.toThrow('Title is required');
    });

    it('handles missing image', async () => {
      api.request.mockRejectedValue(new Error('La imagen es obligatoria'));

      const formData = new FormData();
      formData.append('title', 'Test');
      await expect(adminService.create(formData)).rejects.toThrow('La imagen es obligatoria');
    });

    it('handles validation errors', async () => {
      api.request.mockRejectedValue(new Error('Validation failed'));

      const formData = new FormData();
      formData.append('title', '');
      await expect(adminService.create(formData)).rejects.toThrow('Validation failed');
    });

    it('returns created movie on success', async () => {
      const mockMovie = { title: 'Inception', year: 2010, _id: 'new-id' };
      api.request.mockResolvedValue({ ok: true, msg: 'Película creada', movie: mockMovie, token: 'abc' });

      const formData = new FormData();
      formData.append('title', 'Inception');
      const result = await adminService.create(formData);

      expect(result.movie.title).toBe('Inception');
    });
  });

  describe('getById', () => {
    it('calls GET with movie id', async () => {
      const id = '64a1b2c3d4e5f6a7b8c9d0e1';
      api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIE, token: 'abc' });

      const result = await adminService.getById(id);

      expect(api.request).toHaveBeenCalledWith(`/api/v1/admin/movies/${id}`);
      expect(result.msg._id).toBe(id);
    });

    it('handles non-existent movie', async () => {
      api.request.mockRejectedValue(new Error('No se encontró la película'));

      await expect(adminService.getById('000000000000000000000000')).rejects.toThrow('No se encontró la película');
    });

    it('handles invalid id', async () => {
      api.request.mockRejectedValue(new Error('Invalid ID'));

      await expect(adminService.getById('bad-id')).rejects.toThrow('Invalid ID');
    });
  });

  describe('update', () => {
    it('calls PATCH with FormData', async () => {
      const id = '64a1b2c3d4e5f6a7b8c9d0e1';
      const formData = new FormData();
      formData.append('title', 'Updated Title');
      api.request.mockResolvedValue({ ok: true, msg: 'pelicula editada', movie: { title: 'Updated Title' }, token: 'abc' });

      const result = await adminService.update(id, formData);

      expect(api.request).toHaveBeenCalledWith(`/api/v1/admin/movies/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      expect(result.ok).toBe(true);
    });

    it('handles non-existent movie on update', async () => {
      api.request.mockRejectedValue(new Error('No se encontró la película a actualizar'));

      const formData = new FormData();
      await expect(adminService.update('000000000000000000000000', formData)).rejects.toThrow('No se encontró la película a actualizar');
    });

    it('handles partial update (only title)', async () => {
      const formData = new FormData();
      formData.append('title', 'New Title Only');
      api.request.mockResolvedValue({ ok: true, msg: 'pelicula editada', movie: { title: 'New Title Only' }, token: 'abc' });

      const result = await adminService.update('64a1b2c3d4e5f6a7b8c9d0e1', formData);
      expect(result.movie.title).toBe('New Title Only');
    });
  });

  describe('remove', () => {
    it('calls DELETE with movie id', async () => {
      const id = '64a1b2c3d4e5f6a7b8c9d0e1';
      api.request.mockResolvedValue({ ok: true, msg: 'Película borrada', movie: { _id: id }, token: 'abc' });

      const result = await adminService.remove(id);

      expect(api.request).toHaveBeenCalledWith(`/api/v1/admin/movies/${id}`, {
        method: 'DELETE',
      });
      expect(result.ok).toBe(true);
    });

    it('handles non-existent movie on delete', async () => {
      api.request.mockRejectedValue(new Error('Película no encontrada'));

      await expect(adminService.remove('000000000000000000000000')).rejects.toThrow('Película no encontrada');
    });

    it('handles invalid id on delete', async () => {
      api.request.mockRejectedValue(new Error('Invalid ID'));

      await expect(adminService.remove('bad-id')).rejects.toThrow('Invalid ID');
    });
  });
});
