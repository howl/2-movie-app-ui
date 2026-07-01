import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer.jsx';

describe('Footer', () => {
  it('renders footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
