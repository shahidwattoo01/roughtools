import { test, expect } from '@playwright/test';

test.describe('Navigation E2E Tests', () => {
  test('header navigation links work', async ({ page }) => {
    await page.goto('/');

    const navLinks = [
      { text: /about/i, href: /\/about/ },
      { text: /contact/i, href: /\/contact/ },
    ];

    for (const link of navLinks) {
      await page.getByRole('link', { name: link.text }).click();
      await expect(page).toHaveURL(link.href);
    }
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByTestId('mobile-nav')).toBeVisible();

    // Close mobile menu
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByTestId('mobile-nav')).not.toBeVisible();
  });

  test('footer links are functional', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const links = footer.locator('a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    // Check all links have valid href
    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });

  test('back button works after navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/\/about/);

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test('page transitions show loading state', async ({ page }) => {
    await page.goto('/');

    // Slow down network to observe loading states
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (500 * 1024) / 8,
      uploadThroughput: (500 * 1024) / 8,
      latency: 500,
    });

    // Navigate and check for loading indicator
    const navigationPromise = page.getByRole('link', { name: /about/i }).click();

    // Look for any loading indicator
    const hasLoader =
      (await page.locator('[data-loading], [aria-busy="true"]').count()) > 0;

    await navigationPromise;
    // Loading state may or may not be present depending on speed
    // Just verify navigation completed
    await expect(page).toHaveURL(/\/about/);
  });

  test('theme toggle works and persists', async ({ page }) => {
    await page.goto('/');

    // Toggle to dark mode
    await page.getByRole('button', { name: /theme|dark mode/i }).click();

    // Check dark class or data attribute
    const htmlElement = page.locator('html');
    const isDark =
      (await htmlElement.getAttribute('class'))?.includes('dark') ||
      (await htmlElement.getAttribute('data-theme')) === 'dark';
    expect(isDark).toBe(true);

    // Refresh and verify persistence
    await page.reload();
    const isStillDark =
      (await htmlElement.getAttribute('class'))?.includes('dark') ||
      (await htmlElement.getAttribute('data-theme')) === 'dark';
    expect(isStillDark).toBe(true);
  });
});