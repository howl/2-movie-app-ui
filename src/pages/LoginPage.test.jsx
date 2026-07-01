import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AuthContext } from '../context/AuthContext.js';
import { LoginPage } from './LoginPage.jsx';

const renderLoginPage = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('LoginPage', () => {
  afterEach(cleanup);

  it('renders login form', () => {
    renderLoginPage({ user: null, token: null, isAuthenticated: false, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });
});
