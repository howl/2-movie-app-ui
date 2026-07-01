import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, afterEach } from 'vitest';
import { MovieCard } from './MovieCard.jsx';

const mockMovie = {
  _id: '123',
  title: 'The Matrix',
  year: 1999,
  director: 'Lana Wachowski',
  genres: ['Action', 'Sci-Fi'],
  image: 'https://example.com/poster.jpg',
};

describe('MovieCard', () => {
  afterEach(cleanup);

  it('renders movie title and year', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>,
    );
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('renders movie poster image', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg');
  });

  it('renders placeholder when no poster', () => {
    const movieWithoutPoster = { ...mockMovie, image: '' };
    render(
      <MemoryRouter>
        <MovieCard movie={movieWithoutPoster} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Sin póster')).toBeInTheDocument();
  });

  it('renders movie genres', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Action, Sci-Fi')).toBeInTheDocument();
  });

  it('renders favorite button', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
