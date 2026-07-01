import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FavoriteButton } from './FavoriteButton.jsx';

describe('FavoriteButton', () => {
  afterEach(cleanup);

  it('renders filled heart when isFavorite is true', () => {
    render(<FavoriteButton isFavorite={true} onToggle={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveClass('favorite-button--active');
  });

  it('renders empty heart when isFavorite is false', () => {
    render(<FavoriteButton isFavorite={false} onToggle={vi.fn()} />);
    expect(screen.getByRole('button')).not.toHaveClass('favorite-button--active');
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});
