import { describe, it, expect, vi } from 'vitest';
import { adminService } from './adminService.js';
import { api } from './api.js';

vi.mock('./api.js', () => ({
  api: {
    request: vi.fn(),
  },
}));

describe('adminService', () => {
  const FAKE_MOVIES = [
    { _id: '64a1b2c3d4e5f6a7b8c9d0e1', title: 'The Matrix', year: 1999 },
  ];

  it('getAll calls GET /admin/movies', async () => {
    api.request.mockResolvedValue({ ok: true, msg: '1 movie found', movies: FAKE_MOVIES, token: 'abc' });

    const result = await adminService.getAll();

    expect(api.request).toHaveBeenCalledWith('/api/v1/admin/movies');
    expect(result.movies).toEqual(FAKE_MOVIES);
  });

  it('create calls POST with FormData', async () => {
    const formData = new FormData();
    formData.append('title', 'New Movie');
    api.request.mockResolvedValue({ ok: true, msg: 'Movie created', movie: { title: 'New Movie' }, token: 'abc' });

    const result = await adminService.create(formData);

    expect(api.request).toHaveBeenCalledWith('/api/v1/admin/movies', {
      method: 'POST',
      body: formData,
    });
    expect(result.ok).toBe(true);
  });

  it('getById calls GET with movie id', async () => {
    const id = '64a1b2c3d4e5f6a7b8c9d0e1';
    api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIES[0], token: 'abc' });

    const result = await adminService.getById(id);

    expect(api.request).toHaveBeenCalledWith(`/api/v1/admin/movies/${id}`);
    expect(result.msg._id).toBe(id);
  });

  it('update calls PATCH with FormData', async () => {
    const id = '64a1b2c3d4e5f6a7b8c9d0e1';
    const formData = new FormData();
    formData.append('title', 'Updated Title');
    api.request.mockResolvedValue({ ok: true, msg: 'Movie updated', movie: { title: 'Updated Title' }, token: 'abc' });

    const result = await adminService.update(id, formData);

    expect(api.request).toHaveBeenCalledWith(`/api/v1/admin/movies/${id}`, {
      method: 'PATCH',
      body: formData,
    });
    expect(result.ok).toBe(true);
  });

  it('remove calls DELETE with movie id', async () => {
    const id = '64a1b2c3d4e5f6a7b8c9d0e1';
    api.request.mockResolvedValue({ ok: true, msg: 'Movie deleted', movie: { _id: id }, token: 'abc' });

    const result = await adminService.remove(id);

    expect(api.request).toHaveBeenCalledWith(`/api/v1/admin/movies/${id}`, {
      method: 'DELETE',
    });
    expect(result.ok).toBe(true);
  });
});
