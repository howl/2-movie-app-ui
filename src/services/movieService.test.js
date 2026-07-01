import { describe, it, expect, vi } from 'vitest';
import { movieService } from './movieService.js';
import { api } from './api.js';

vi.mock('./api.js', () => ({
  api: {
    request: vi.fn(),
  },
}));

describe('movieService', () => {
  const FAKE_MOVIES = [
    { _id: '64a1b2c3d4e5f6a7b8c9d0e1', title: 'The Matrix', year: 1999 },
    { _id: '64a1b2c3d4e5f6a7b8c9d0e2', title: 'The Matrix Reloaded', year: 2003 },
  ];

  it('search calls GET with title query', async () => {
    api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIES, token: 'abc' });

    const result = await movieService.search('Matrix');

    expect(api.request).toHaveBeenCalledWith('/api/v1/movies/search?title=Matrix');
    expect(result.msg).toEqual(FAKE_MOVIES);
  });

  it('search handles empty title gracefully', async () => {
    api.request.mockResolvedValue({ ok: true, msg: [], token: 'abc' });

    const result = await movieService.search('');

    expect(api.request).toHaveBeenCalledWith('/api/v1/movies/search?title=');
    expect(result.msg).toEqual([]);
  });

  it('getById calls GET with movie id', async () => {
    const movieId = '64a1b2c3d4e5f6a7b8c9d0e1';
    api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIES[0], token: 'abc' });

    const result = await movieService.getById(movieId);

    expect(api.request).toHaveBeenCalledWith(`/api/v1/movies/${movieId}`);
    expect(result.msg._id).toBe(movieId);
  });

  it('getFavorites calls GET favorites endpoint', async () => {
    api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIES, token: 'abc' });

    const result = await movieService.getFavorites();

    expect(api.request).toHaveBeenCalledWith('/api/v1/movies/favorites');
    expect(result.msg).toEqual(FAKE_MOVIES);
  });

  it('addFavorite calls POST with movieId', async () => {
    const movieId = '64a1b2c3d4e5f6a7b8c9d0e1';
    api.request.mockResolvedValue({ message: 'Movie added to favorites', favorites: [movieId] });

    const result = await movieService.addFavorite(movieId);

    expect(api.request).toHaveBeenCalledWith('/api/v1/movies/favorites', {
      method: 'POST',
      body: { movieId },
    });
    expect(result.message).toBe('Movie added to favorites');
  });

  it('removeFavorite calls DELETE with movie id', async () => {
    const movieId = '64a1b2c3d4e5f6a7b8c9d0e1';
    api.request.mockResolvedValue({ ok: true, msg: 'Favorite removed', token: 'abc' });

    const result = await movieService.removeFavorite(movieId);

    expect(api.request).toHaveBeenCalledWith(`/api/v1/movies/favorites/${movieId}`, {
      method: 'DELETE',
    });
    expect(result.ok).toBe(true);
  });
});
