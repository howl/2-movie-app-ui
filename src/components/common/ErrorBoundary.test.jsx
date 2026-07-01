import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary.jsx';

const ProblemChild = () => {
  throw new Error('Test error message');
};

const SafeChild = () => <p>Safe content</p>;

describe('ErrorBoundary', () => {
  afterEach(cleanup);

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders error message when child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('renders generic message when error has no message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const ProblemChildNoMsg = () => { throw new Error(); };
    render(
      <ErrorBoundary>
        <ProblemChildNoMsg />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Ha ocurrido un error inesperado')).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
