import { api } from './api.js';

const login = async (email, password) => {
  return api.request('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  });
};

const signup = async (name, email, password) => {
  return api.request('/api/v1/auth/signup', {
    method: 'POST',
    body: { name, email, password },
  });
};

export const authService = { login, signup };
