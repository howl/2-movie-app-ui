import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm.js';

describe('useForm', () => {
  const validators = {
    email: (value) => (!value ? 'Email is required' : null),
    password: (value) => (value.length < 6 ? 'Password too short' : null),
  };

  it('initializes with provided values', () => {
    const { result } = renderHook(() => useForm({ email: 'a@b.com' }, validators));
    expect(result.current.values.email).toBe('a@b.com');
  });

  it('initializes with empty values when none provided', () => {
    const { result } = renderHook(() => useForm({}, validators));
    expect(result.current.values).toEqual({});
  });

  it('updates value on handleChange', () => {
    const { result } = renderHook(() => useForm({ email: '' }, validators));

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@test.com' } });
    });

    expect(result.current.values.email).toBe('test@test.com');
  });

  it('validates on blur and sets errors', () => {
    const { result } = renderHook(() => useForm({ email: '' }, validators));

    act(() => {
      result.current.handleBlur({ target: { name: 'email', value: '' } });
    });

    expect(result.current.errors.email).toBe('Email is required');
  });

  it('clears error on blur when value is valid', () => {
    const { result } = renderHook(() => useForm({ email: '' }, validators));

    act(() => {
      result.current.handleBlur({ target: { name: 'email', value: '' } });
    });
    expect(result.current.errors.email).toBe('Email is required');

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'a@b.com' } });
      result.current.handleBlur({ target: { name: 'email', value: 'a@b.com' } });
    });
    expect(result.current.errors.email).toBeUndefined();
  });

  it('validates all fields on submit', async () => {
    const { result } = renderHook(() => useForm({ email: '', password: '' }, validators));

    await act(async () => {
      await result.current.handleSubmit(() => {})({ preventDefault: () => {} });
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password too short');
  });

  it('calls onSubmit when validation passes', async () => {
    const { result } = renderHook(() => useForm({ email: 'a@b.com', password: '123456' }, validators));

    let submitted = false;
    await act(async () => {
      await result.current.handleSubmit(() => { submitted = true; })({ preventDefault: () => {} });
    });

    expect(submitted).toBe(true);
  });

  it('does not call onSubmit when validation fails', async () => {
    let submitted = false;
    const { result } = renderHook(() => useForm({ email: '', password: '' }, validators));

    await act(async () => {
      await result.current.handleSubmit(() => { submitted = true; })({ preventDefault: () => {} });
    });

    expect(submitted).toBe(false);
  });

  it('sets errors manually via setErrors', () => {
    const { result } = renderHook(() => useForm({ email: 'a@b.com' }, validators));

    act(() => {
      result.current.setErrors({ email: 'Already taken' });
    });

    expect(result.current.errors.email).toBe('Already taken');
  });
});
