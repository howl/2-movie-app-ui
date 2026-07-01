const STORAGE_KEY = 'auth_token';

const getToken = () => {
  return sessionStorage.getItem(STORAGE_KEY);
};

const setToken = (token) => {
  sessionStorage.setItem(STORAGE_KEY, token);
};

const removeToken = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export { getToken, setToken, removeToken };
