import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SearchBar } from './SearchBar.jsx';

describe('SearchBar', () => {
  afterEach(cleanup);

  it('renders input and search button', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Buscar películas...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  it('calls onSearch after debounce delay when typing', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Buscar películas...'), 'Matrix');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Matrix');
    }, { timeout: 1000 });
  });

  it('calls onSearch with empty string when input is cleared', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Buscar películas...');

    await user.type(input, 'Matrix');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Matrix');
    }, { timeout: 1000 });

    await user.clear(input);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('');
    }, { timeout: 1000 });
  });

  it('handles special characters in search', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Buscar películas...'), 'Star Wars: Episode V');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Star Wars: Episode V');
    }, { timeout: 1000 });
  });
});
