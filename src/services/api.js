import { getToken, setToken, removeToken } from '../utils/storage.js';
import { API_URL } from '../utils/constants.js';

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body && fetchOptions.method !== 'GET') {
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
      fetchOptions.body = options.body;
    } else {
      fetchOptions.body = JSON.stringify(options.body);
    }
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message || 'Request failed', { cause: error });
  }

  const body = await response.json();

  if (response.status === 401) {
    removeToken();
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    throw new Error(body.msg || 'Unauthorized');
  }

  if (body.token) {
    setToken(body.token);
  }

  if (body.ok === false) {
    throw new Error(body.msg || 'Request failed');
  }

  return body;
};

export const api = { request };
