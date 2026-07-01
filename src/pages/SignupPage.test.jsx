import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AuthContext } from '../context/AuthContext.js';
import { SignupPage } from './SignupPage.jsx';

const renderSignupPage = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe('SignupPage', () => {
  afterEach(cleanup);

  it('renders signup form', () => {
    renderSignupPage({ user: null, token: null, isAuthenticated: false, isAdmin: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });
});
