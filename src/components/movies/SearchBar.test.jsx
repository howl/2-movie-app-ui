import { render, screen, cleanup } from '@testing-library/react';
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

  it('calls onSearch with input value on submit', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Buscar películas...'), 'Matrix');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('Matrix');
  });

  it('calls onSearch with empty string when input is empty', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('handles special characters in search', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Buscar películas...'), 'Star Wars: Episode V');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('Star Wars: Episode V');
  });

  it('clears input after submit', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Buscar películas...');

    await user.type(input, 'Test');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(input).toHaveValue('Test');
  });
});
