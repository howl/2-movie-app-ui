import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFetch } from './useFetch.js';

describe('useFetch', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useFetch());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.execute).toBe('function');
  });

  it('sets loading to true when execute is called', async () => {
    const fn = vi.fn().mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useFetch());

    act(() => { result.current.execute(fn); });

    expect(result.current.loading).toBe(true);
  });

  it('sets data on successful execution', async () => {
    const fn = vi.fn().mockResolvedValue([1, 2, 3]);
    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.execute(fn);
    });

    expect(result.current.data).toEqual([1, 2, 3]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failed execution', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Something went wrong'));
    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await expect(result.current.execute(fn)).rejects.toThrow('Something went wrong');
    });

    expect(result.current.error).toBe('Something went wrong');
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('passes arguments to the service function', async () => {
    const fn = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useFetch());

    await act(async () => {
      await result.current.execute(fn, 'arg1', 'arg2');
    });

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('does not execute on mount', () => {
    const fn = vi.fn();
    renderHook(() => useFetch());

    expect(fn).not.toHaveBeenCalled();
  });

  it('resets state on new execute call', async () => {
    const fn1 = vi.fn().mockRejectedValue(new Error('First error'));
    const fn2 = vi.fn().mockResolvedValue('second result');
    const { result } = renderHook(() => useFetch());

    await act(async () => { await expect(result.current.execute(fn1)).rejects.toThrow('First error'); });
    expect(result.current.error).toBe('First error');

    await act(async () => { await result.current.execute(fn2); });
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('second result');
  });
});
