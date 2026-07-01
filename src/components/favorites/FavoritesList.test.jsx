import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, afterEach } from 'vitest';
import { FavoritesList } from './FavoritesList.jsx';

const movies = [
  { _id: '1', title: 'Fav Movie', year: 2020, director: 'Dir', genres: ['Action'], image: '' },
];

describe('FavoritesList', () => {
  afterEach(cleanup);

  it('renders favorites when list is not empty', () => {
    render(
      <MemoryRouter>
        <FavoritesList movies={movies} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Fav Movie')).toBeInTheDocument();
  });

  it('shows empty message when no favorites', () => {
    render(
      <MemoryRouter>
        <FavoritesList movies={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('No tienes películas favoritas')).toBeInTheDocument();
  });
});
