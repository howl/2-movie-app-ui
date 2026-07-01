import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AdminPage } from './AdminPage.jsx';
import { AuthContext } from '../context/AuthContext.js';

vi.mock('../services/adminService.js', () => ({
  adminService: {
    getAll: vi.fn().mockResolvedValue({ ok: true, msg: '', movies: [], token: 'abc' }),
    remove: vi.fn(),
    create: vi.fn(),
  },
}));

const authValue = { user: { name: 'admin', rol: 'admin' }, token: 'admin-token', isAuthenticated: true, isAdmin: true, login: vi.fn(), logout: vi.fn() };

describe('AdminPage', () => {
  afterEach(cleanup);

  it('renders admin title', () => {
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <AdminPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('Administrar películas')).toBeInTheDocument();
  });

  it('renders create movie button', () => {
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <AdminPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('Nueva película')).toBeInTheDocument();
  });
});
