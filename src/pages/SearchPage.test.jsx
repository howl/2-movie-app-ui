import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SearchPage } from './SearchPage.jsx';
import { AuthContext } from '../context/AuthContext.js';

const authValue = { user: { name: 'u' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() };

describe('SearchPage', () => {
  afterEach(cleanup);

  it('renders search bar', () => {
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByPlaceholderText('Buscar películas...')).toBeInTheDocument();
  });
});
