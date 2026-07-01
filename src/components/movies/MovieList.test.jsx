import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, afterEach } from 'vitest';
import { MovieList } from './MovieList.jsx';

const movies = [
  { _id: '1', title: 'Movie A', year: 2000, director: 'Dir A', genres: ['Drama'], image: '' },
  { _id: '2', title: 'Movie B', year: 2001, director: 'Dir B', genres: ['Comedy'], image: '' },
];

describe('MovieList', () => {
  afterEach(cleanup);

  it('renders list of movies', () => {
    render(
      <MemoryRouter>
        <MovieList movies={movies} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Movie A')).toBeInTheDocument();
    expect(screen.getByText('Movie B')).toBeInTheDocument();
  });

  it('shows empty message when no movies', () => {
    render(
      <MemoryRouter>
        <MovieList movies={[]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('No se encontraron películas')).toBeInTheDocument();
  });

  it('renders nothing when movies is null', () => {
    render(
      <MemoryRouter>
        <MovieList movies={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText('No se encontraron películas')).toBeInTheDocument();
  });
});
