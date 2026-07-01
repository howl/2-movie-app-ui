import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { LoginForm } from './LoginForm.jsx';

const renderLoginForm = (props = {}) => {
  const defaults = {
    onSubmit: vi.fn(),
    errors: {},
    loading: false,
  };
  return render(
    <MemoryRouter>
      <LoginForm {...defaults} {...props} />
    </MemoryRouter>,
  );
};

describe('LoginForm', () => {
  afterEach(cleanup);

  it('renders email and password fields', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders submit button with correct text', () => {
    renderLoginForm();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('renders link to signup', () => {
    renderLoginForm();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('calls onSubmit when submitted', async () => {
    const onSubmit = vi.fn();
    renderLoginForm({ onSubmit });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables button while loading', () => {
    renderLoginForm({ loading: true });
    expect(screen.getByRole('button', { name: 'Cargando...' })).toBeDisabled();
  });

  it('displays field errors', () => {
    renderLoginForm({ errors: { email: 'Email is required' } });
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('shows loading text on button when loading', () => {
    renderLoginForm({ loading: true });
    expect(screen.getByRole('button', { name: 'Cargando...' })).toHaveTextContent('Cargando...');
  });
});
