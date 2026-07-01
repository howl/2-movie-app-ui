import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, afterEach } from 'vitest';
import { MovieDetail } from './MovieDetail.jsx';

const mockMovie = {
  _id: '123',
  title: 'Inception',
  year: 2010,
  director: 'Christopher Nolan',
  genres: ['Action', 'Thriller'],
  duration: 148,
  synopsis: 'A thief who steals corporate secrets through dream-sharing technology.',
  image: 'https://example.com/inception.jpg',
};

describe('MovieDetail', () => {
  afterEach(cleanup);

  it('renders movie details', () => {
    render(
      <MemoryRouter>
        <MovieDetail movie={mockMovie} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('148 min')).toBeInTheDocument();
  });

  it('renders movie poster', () => {
    render(
      <MemoryRouter>
        <MovieDetail movie={mockMovie} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/inception.jpg');
  });

  it('renders placeholder when no poster', () => {
    const movieWithoutPoster = { ...mockMovie, image: '' };
    render(
      <MemoryRouter>
        <MovieDetail movie={movieWithoutPoster} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Sin póster')).toBeInTheDocument();
  });

  it('renders synopsis', () => {
    render(
      <MemoryRouter>
        <MovieDetail movie={mockMovie} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/A thief who steals/)).toBeInTheDocument();
  });
});
