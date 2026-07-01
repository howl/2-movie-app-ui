import { test, expect } from '@playwright/test';

test.describe('Movie App UI', () => {
  test('shows login page for unauthenticated user accessing protected route', async ({ page }) => {
    await page.goto('/');
    await page.goto('/favorites');
    await expect(page.getByRole('heading').or(page.getByText('Iniciar sesión'))).toBeAttached();
  });

  test('login page renders form fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabelText('Email')).toBeAttached();
    await expect(page.getByLabelText('Password')).toBeAttached();
    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeAttached();
  });

  test('signup page renders form fields', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByLabelText('Name')).toBeAttached();
    await expect(page.getByLabelText('Email')).toBeAttached();
    await expect(page.getByLabelText('Password')).toBeAttached();
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeAttached();
  });

  test('navbar is present on all pages', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Movie App')).toBeAttached();
    await expect(page.getByText('Login')).toBeAttached();
    await expect(page.getByText('Signup')).toBeAttached();
  });

  test('search page has search bar', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.goto('/');
    await expect(page.getByPlaceholderText('Buscar películas...')).toBeAttached();
  });
});
