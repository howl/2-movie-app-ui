import { describe, it, expect } from 'vitest';
import { API_URL } from './constants.js';

describe('constants', () => {
  it('defines API_URL from MOVIE_API_URL env variable', () => {
    expect(API_URL).toBeDefined();
    expect(typeof API_URL).toBe('string');
    expect(API_URL.length).toBeGreaterThan(0);
  });
});
