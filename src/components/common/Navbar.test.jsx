import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Navbar } from './Navbar.jsx';
import { AuthContext } from '../../context/AuthContext.js';

const renderWithAuth = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('Navbar', () => {
  afterEach(cleanup);

  it('renders the app name', () => {
    renderWithAuth({ user: null, token: null, isAuthenticated: false, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Movie App')).toBeInTheDocument();
  });

  it('shows Login and Signup links when not authenticated', () => {
    renderWithAuth({ user: null, token: null, isAuthenticated: false, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('shows Favorites and Logout when authenticated as user', () => {
    renderWithAuth({ user: { name: 'user1', rol: 'user' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  it('shows Admin link when user is admin', () => {
    renderWithAuth({ user: { name: 'admin1', rol: 'admin' }, token: 't', isAuthenticated: true, isAdmin: true, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
