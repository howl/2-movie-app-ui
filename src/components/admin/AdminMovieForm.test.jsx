import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AdminMovieForm } from './AdminMovieForm.jsx';

describe('AdminMovieForm', () => {
  afterEach(cleanup);

  it('renders form fields for creating a movie', () => {
    render(<AdminMovieForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Año')).toBeInTheDocument();
    expect(screen.getByLabelText('Director')).toBeInTheDocument();
    expect(screen.getByLabelText('Duración (min)')).toBeInTheDocument();
    expect(screen.getByLabelText('Sinopsis')).toBeInTheDocument();
    expect(screen.getByLabelText('Géneros')).toBeInTheDocument();
  });

  it('renders submit button with correct text in create mode', () => {
    render(<AdminMovieForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Crear película' })).toBeInTheDocument();
  });

  it('renders submit button with correct text in edit mode', () => {
    const movie = { _id: '1', title: 'Test', year: 2000, director: 'Dir', genres: ['Action'], duration: 120, synopsis: 'Test', image: '' };
    render(<AdminMovieForm onSubmit={vi.fn()} initialData={movie} />);
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
  });

  it('pre-fills fields when editing', () => {
    const movie = { _id: '1', title: 'Existing Movie', year: 2005, director: 'Director Name', genres: ['Drama'], duration: 90, synopsis: 'A good movie', image: '' };
    render(<AdminMovieForm onSubmit={vi.fn()} initialData={movie} />);
    expect(screen.getByLabelText('Título')).toHaveValue('Existing Movie');
    expect(screen.getByLabelText('Año')).toHaveValue(2005);
    expect(screen.getByLabelText('Director')).toHaveValue('Director Name');
  });

  it('calls onSubmit with form data when submitted', async () => {
    const onSubmit = vi.fn();
    render(<AdminMovieForm onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Título'), 'New Movie');
    await user.type(screen.getByLabelText('Año'), '2020');
    await user.type(screen.getByLabelText('Director'), 'Director');
    await user.type(screen.getByLabelText('Duración (min)'), '120');
    await user.type(screen.getByLabelText('Géneros'), 'Action');
    await user.click(screen.getByRole('button', { name: 'Crear película' }));

    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows success message when provided', () => {
    render(<AdminMovieForm onSubmit={vi.fn()} success="Película creada correctamente" />);
    expect(screen.getByText('Película creada correctamente')).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    render(<AdminMovieForm onSubmit={vi.fn()} error="Error al crear la película" />);
    expect(screen.getByText('Error al crear la película')).toBeInTheDocument();
  });

  it('disables button while loading', () => {
    render(<AdminMovieForm onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled();
  });
});
