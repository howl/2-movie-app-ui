import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AdminMovieTable } from './AdminMovieTable.jsx';

const mockMovies = [
  { _id: '1', title: 'The Matrix', year: 1999, director: 'Wachowski', duration: 136 },
  { _id: '2', title: 'Inception', year: 2010, director: 'Nolan', duration: 148 },
];

describe('AdminMovieTable', () => {
  afterEach(cleanup);

  it('renders table with movie data', () => {
    render(<AdminMovieTable movies={mockMovies} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each movie', () => {
    render(<AdminMovieTable movies={mockMovies} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Eliminar');
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<AdminMovieTable movies={mockMovies} onEdit={onEdit} onDelete={vi.fn()} />);
    const user = userEvent.setup();

    await user.click(screen.getAllByText('Editar')[0]);

    expect(onEdit).toHaveBeenCalledWith(mockMovies[0]);
  });

  it('calls onDelete when delete is confirmed', async () => {
    const onDelete = vi.fn();
    render(<AdminMovieTable movies={mockMovies} onEdit={vi.fn()} onDelete={onDelete} />);
    const user = userEvent.setup();

    window.confirm = vi.fn(() => true);
    await user.click(screen.getAllByText('Eliminar')[0]);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('does not call onDelete when confirm is cancelled', async () => {
    const onDelete = vi.fn();
    render(<AdminMovieTable movies={mockMovies} onEdit={vi.fn()} onDelete={onDelete} />);
    const user = userEvent.setup();

    window.confirm = vi.fn(() => false);
    await user.click(screen.getAllByText('Eliminar')[0]);

    expect(onDelete).not.toHaveBeenCalled();
  });

  it('shows empty message when no movies', () => {
    render(<AdminMovieTable movies={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No hay películas en el catálogo')).toBeInTheDocument();
  });

  it('shows empty message when movies is null', () => {
    render(<AdminMovieTable movies={null} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No hay películas en el catálogo')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<AdminMovieTable movies={mockMovies} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Año')).toBeInTheDocument();
    expect(screen.getByText('Director')).toBeInTheDocument();
    expect(screen.getByText('Duración')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });
});
