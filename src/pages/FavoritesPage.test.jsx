import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FavoritesPage } from './FavoritesPage.jsx';
import { AuthContext } from '../context/AuthContext.js';

vi.mock('../services/movieService.js', () => ({
  movieService: {
    getFavorites: vi.fn().mockResolvedValue({ ok: true, msg: [], token: 'abc' }),
    removeFavorite: vi.fn(),
  },
}));

const authValue = { user: { name: 'u' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() };

describe('FavoritesPage', () => {
  afterEach(cleanup);

  it('renders title', async () => {
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(await screen.findByText('Mis favoritos')).toBeInTheDocument();
  });
});
