import { useState } from 'react';
import { AuthContext } from './AuthContext.js';
import { getToken, setToken, removeToken } from '../utils/storage.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());

  const login = (userData, authToken) => {
    setUser(userData);
    setTokenState(authToken);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    removeToken();
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
