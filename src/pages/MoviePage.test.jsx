import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MoviePage } from './MoviePage.jsx';
import { AuthContext } from '../context/AuthContext.js';

const authValue = { user: { name: 'u' }, token: 't', isAuthenticated: true, isAdmin: false, login: vi.fn(), logout: vi.fn() };

describe('MoviePage', () => {
  afterEach(cleanup);

  it('renders loading state', () => {
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/movies/123']}>
          <Routes>
            <Route path="/movies/:id" element={<MoviePage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
