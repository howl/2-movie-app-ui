import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from './Loading.jsx';

describe('Loading', () => {
  it('renders a skeleton element', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.skeleton')).toBeInTheDocument();
  });
});
