import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SignupForm } from './SignupForm.jsx';

const renderSignupForm = (props = {}) => {
  const defaults = {
    onSubmit: vi.fn(),
    errors: {},
    loading: false,
  };
  return render(
    <MemoryRouter>
      <SignupForm {...defaults} {...props} />
    </MemoryRouter>,
  );
};

describe('SignupForm', () => {
  afterEach(cleanup);

  it('renders name, email and password fields', () => {
    renderSignupForm();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders submit button with correct text', () => {
    renderSignupForm();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });

  it('renders link to login', () => {
    renderSignupForm();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('calls onSubmit when submitted', async () => {
    const onSubmit = vi.fn();
    renderSignupForm({ onSubmit });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables button while loading', () => {
    renderSignupForm({ loading: true });
    expect(screen.getByRole('button', { name: 'Cargando...' })).toBeDisabled();
  });

  it('displays field errors', () => {
    renderSignupForm({ errors: { name: 'Name is required' } });
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('renders multiple field errors', () => {
    renderSignupForm({ errors: { name: 'Name required', email: 'Email required', password: 'Password required' } });
    expect(screen.getByText('Name required')).toBeInTheDocument();
    expect(screen.getByText('Email required')).toBeInTheDocument();
    expect(screen.getByText('Password required')).toBeInTheDocument();
  });

  it('renders with no errors prop', () => {
    renderSignupForm({ errors: undefined });
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
  });
});
