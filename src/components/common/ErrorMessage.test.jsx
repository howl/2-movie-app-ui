import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { ErrorMessage } from './ErrorMessage.jsx';

describe('ErrorMessage', () => {
  afterEach(cleanup);

  it('renders the error message text', () => {
    const { getByText } = render(<ErrorMessage message="Something went wrong" />);
    expect(getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders with error type by default', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    expect(container.firstChild.classList.contains('error')).toBe(true);
  });

  it('renders with warning type when specified', () => {
    const { container } = render(<ErrorMessage message="Warning" type="warning" />);
    expect(container.firstChild.classList.contains('warning')).toBe(true);
  });

  it('renders with info type when specified', () => {
    const { container } = render(<ErrorMessage message="Info" type="info" />);
    expect(container.firstChild.classList.contains('info')).toBe(true);
  });

  it('renders empty message without crashing', () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.querySelector('.error-message')).toBeInTheDocument();
  });
});
