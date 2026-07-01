import { api } from './api.js';

const getAll = async () => {
  return api.request('/api/v1/admin/movies');
};

const create = async (formData) => {
  return api.request('/api/v1/admin/movies', {
    method: 'POST',
    body: formData,
  });
};

const getById = async (id) => {
  return api.request(`/api/v1/admin/movies/${id}`);
};

const update = async (id, formData) => {
  return api.request(`/api/v1/admin/movies/${id}`, {
    method: 'PATCH',
    body: formData,
  });
};

const remove = async (id) => {
  return api.request(`/api/v1/admin/movies/${id}`, {
    method: 'DELETE',
  });
};

export const adminService = { getAll, create, getById, update, remove };
