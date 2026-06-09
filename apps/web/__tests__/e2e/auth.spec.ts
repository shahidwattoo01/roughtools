import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
  test.describe('Sign In', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/signin');
    });

    test('displays sign in form', async ({ page }) => {
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('shows validation errors on empty submit', async ({ page }) => {
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page.getByText(/email is required/i)).toBeVisible();
      await expect(page.getByText(/password is required/i)).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.locator('input[type="email"]').fill('wrong@example.com');
      await page.locator('input[type="password"]').fill('wrongpassword');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page.getByText(/invalid/i)).toBeVisible();
    });

    test('successful login redirects to dashboard', async ({ page }) => {
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="password"]').fill('TestPassword123!');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });

    test('navigates to sign up page', async ({ page }) => {
      await page.getByRole('link', { name: /sign up|create account/i }).click();

      await expect(page).toHaveURL(/\/auth\/signup/);
    });
  });

  test.describe('Sign Up', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/signup');
    });

    test('displays sign up form', async ({ page }) => {
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    });

    test('validates password confirmation match', async ({ page }) => {
      await page.locator('input[name="password"]').fill('Password123!');
      await page.locator('input[name="confirmPassword"]').fill('Different123!');
      await page.getByRole('button', { name: /create account/i }).click();

      await expect(page.getByText(/passwords do not match/i)).toBeVisible();
    });

    test('successful registration redirects to verification', async ({ page }) => {
      await page.locator('input[name="name"]').fill('New User');
      await page.locator('input[type="email"]').fill('newuser@example.com');
      await page.locator('input[name="password"]').fill('StrongP@ss123');
      await page.locator('input[name="confirmPassword"]').fill('StrongP@ss123');
      await page.getByRole('checkbox', { name: /terms/i }).check();
      await page.getByRole('button', { name: /create account/i }).click();

      await expect(page).toHaveURL(/\/auth\/verify|\/dashboard/, { timeout: 10000 });
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects to sign in when not authenticated', async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 10000 });
    });

    test('allows access when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/auth/signin');
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="password"]').fill('TestPassword123!');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

      // Now try protected route
      await page.goto('/dashboard/settings');
      await expect(page).toHaveURL(/\/dashboard\/settings/);
    });
  });
});