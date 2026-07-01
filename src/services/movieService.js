import { api } from './api.js';

const search = async (title) => {
  return api.request(`/api/v1/movies/search?title=${encodeURIComponent(title)}`);
};

const getById = async (id) => {
  return api.request(`/api/v1/movies/${id}`);
};

const getFavorites = async () => {
  return api.request('/api/v1/movies/favorites');
};

const addFavorite = async (movieId) => {
  return api.request('/api/v1/movies/favorites', {
    method: 'POST',
    body: { movieId },
  });
};

const removeFavorite = async (id) => {
  return api.request(`/api/v1/movies/favorites/${id}`, {
    method: 'DELETE',
  });
};

export const movieService = { search, getById, getFavorites, addFavorite, removeFavorite };
