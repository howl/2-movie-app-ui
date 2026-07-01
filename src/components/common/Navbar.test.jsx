import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('does not show Signup when authenticated', () => {
    renderWithAuth({ user: { name: 'u' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.queryByText('Signup')).not.toBeInTheDocument();
  });

  it('does not show Admin link when user is not admin', () => {
    renderWithAuth({ user: { name: 'u', rol: 'user' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('shows username when authenticated', () => {
    renderWithAuth({ user: { name: 'JohnDoe' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
  });

  it('calls logout and navigates on button click', async () => {
    const logout = vi.fn();
    renderWithAuth({ user: { name: 'u' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout });
    const user = userEvent.setup();

    await user.click(screen.getByText('Cerrar sesión'));

    expect(logout).toHaveBeenCalledOnce();
  });

  it('renders Home link always', () => {
    renderWithAuth({ user: null, token: null, isAuthenticated: false, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
