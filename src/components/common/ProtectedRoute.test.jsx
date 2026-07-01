import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { AuthContext } from '../../context/AuthContext.js';

const renderWithAuth = (authValue, initialRoute = '/') => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Protected content</p>} />
          </Route>
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('ProtectedRoute', () => {
  afterEach(cleanup);

  it('renders children when user is authenticated', () => {
    renderWithAuth({ user: { name: 'user1' }, token: 'valid', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to /login when user is not authenticated', () => {
    renderWithAuth({ user: null, token: null, isAuthenticated: false, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders children when requiredRole is admin and user is admin', () => {
    renderWithAuth({ user: { name: 'admin1', rol: 'admin' }, token: 'admin', isAuthenticated: true, isAdmin: true, login: vi.fn(), logout: vi.fn() }, '/');
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
