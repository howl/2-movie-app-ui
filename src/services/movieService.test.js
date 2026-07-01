import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  const SINGLE_MOVIE = { _id: '64a1b2c3d4e5f6a7b8c9d0e1', title: 'Inception', year: 2010, director: 'Christopher Nolan' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('calls GET with title query', async () => {
      api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIES, token: 'abc' });

      const result = await movieService.search('Matrix');

      expect(api.request).toHaveBeenCalledWith('/api/v1/movies/search?title=Matrix');
      expect(result.msg).toEqual(FAKE_MOVIES);
    });

    it('handles empty title gracefully', async () => {
      api.request.mockResolvedValue({ ok: true, msg: [], token: 'abc' });

      const result = await movieService.search('');

      expect(api.request).toHaveBeenCalledWith('/api/v1/movies/search?title=');
      expect(result.msg).toEqual([]);
    });

    it('encodes special characters in title', async () => {
      api.request.mockResolvedValue({ ok: true, msg: [], token: 'abc' });

      await movieService.search('Star Wars: Episode V');

      expect(api.request).toHaveBeenCalledWith('/api/v1/movies/search?title=Star%20Wars%3A%20Episode%20V');
    });

    it('handles unicode characters in title', async () => {
      api.request.mockResolvedValue({ ok: true, msg: [], token: 'abc' });

      await movieService.search('Café');

      expect(api.request).toHaveBeenCalledWith('/api/v1/movies/search?title=Caf%C3%A9');
    });

    it('handles very long title', async () => {
      const longTitle = 'A'.repeat(500);
      api.request.mockResolvedValue({ ok: true, msg: [], token: 'abc' });

      const result = await movieService.search(longTitle);

      expect(result.msg).toEqual([]);
    });

    it('handles external search response format (msg is string, results in peliculas)', async () => {
      const externalMovies = [{ Title: 'Matrix', Year: '1999' }];
      api.request.mockResolvedValue({ ok: true, msg: 'Peliculas encontradas fuera', peliculas: externalMovies, token: 'abc' });

      const result = await movieService.search('Matrix');

      expect(result.msg).toBe('Peliculas encontradas fuera');
      expect(result.peliculas).toEqual(externalMovies);
    });

    it('propagates api errors', async () => {
      api.request.mockRejectedValue(new Error('Error searching movies'));

      await expect(movieService.search('Matrix')).rejects.toThrow('Error searching movies');
    });
  });

  describe('getById', () => {
    it('calls GET with movie id', async () => {
      const movieId = '64a1b2c3d4e5f6a7b8c9d0e1';
      api.request.mockResolvedValue({ ok: true, msg: SINGLE_MOVIE, token: 'abc' });

      const result = await movieService.getById(movieId);

      expect(api.request).toHaveBeenCalledWith(`/api/v1/movies/${movieId}`);
      expect(result.msg._id).toBe(movieId);
    });

    it('handles non-existent movie id', async () => {
      api.request.mockRejectedValue(new Error('No se encontró la película'));

      await expect(movieService.getById('000000000000000000000000')).rejects.toThrow('No se encontró la película');
    });

    it('handles invalid id format', async () => {
      api.request.mockRejectedValue(new Error('Invalid movie ID'));

      await expect(movieService.getById('invalid-id')).rejects.toThrow('Invalid movie ID');
    });

    it('handles empty id', async () => {
      api.request.mockRejectedValue(new Error('Movie ID is required'));

      await expect(movieService.getById('')).rejects.toThrow();
    });
  });

  describe('getFavorites', () => {
    it('calls GET favorites endpoint', async () => {
      api.request.mockResolvedValue({ ok: true, msg: FAKE_MOVIES, token: 'abc' });

      const result = await movieService.getFavorites();

      expect(api.request).toHaveBeenCalledWith('/api/v1/movies/favorites');
      expect(result.msg).toEqual(FAKE_MOVIES);
    });

    it('handles empty favorites list', async () => {
      api.request.mockResolvedValue({ ok: true, msg: [], token: 'abc' });

      const result = await movieService.getFavorites();

      expect(result.msg).toEqual([]);
    });

    it('propagates errors', async () => {
      api.request.mockRejectedValue(new Error('Failed to fetch favorites'));

      await expect(movieService.getFavorites()).rejects.toThrow('Failed to fetch favorites');
    });
  });

  describe('addFavorite', () => {
    it('calls POST with movieId', async () => {
      const movieId = '64a1b2c3d4e5f6a7b8c9d0e1';
      api.request.mockResolvedValue({ message: 'Movie added to favorites', favorites: [movieId] });

      const result = await movieService.addFavorite(movieId);

      expect(api.request).toHaveBeenCalledWith('/api/v1/movies/favorites', {
        method: 'POST',
        body: { movieId },
      });
      expect(result.message).toBe('Movie added to favorites');
    });

    it('handles already favorited movie', async () => {
      api.request.mockRejectedValue(new Error('Movie is already in your favorites'));

      await expect(movieService.addFavorite('64a1b2c3d4e5f6a7b8c9d0e1')).rejects.toThrow('Movie is already in your favorites');
    });

    it('handles invalid movieId format', async () => {
      api.request.mockRejectedValue(new Error('Invalid movie ID'));

      await expect(movieService.addFavorite('invalid')).rejects.toThrow('Invalid movie ID');
    });

    it('handles empty movieId', async () => {
      api.request.mockRejectedValue(new Error('Movie ID is required'));

      await expect(movieService.addFavorite('')).rejects.toThrow();
    });
  });

  describe('removeFavorite', () => {
    it('calls DELETE with movie id', async () => {
      const movieId = '64a1b2c3d4e5f6a7b8c9d0e1';
      api.request.mockResolvedValue({ ok: true, msg: 'Favorito eliminado', token: 'abc' });

      const result = await movieService.removeFavorite(movieId);

      expect(api.request).toHaveBeenCalledWith(`/api/v1/movies/favorites/${movieId}`, {
        method: 'DELETE',
      });
      expect(result.ok).toBe(true);
    });

    it('handles non-existent favorite', async () => {
      api.request.mockRejectedValue(new Error('La película a borrar no existe en favoritos'));

      await expect(movieService.removeFavorite('000000000000000000000000')).rejects.toThrow('La película a borrar no existe en favoritos');
    });

    it('handles invalid id format', async () => {
      api.request.mockRejectedValue(new Error('Invalid ID format'));

      await expect(movieService.removeFavorite('bad-id')).rejects.toThrow('Invalid ID format');
    });
  });
});
