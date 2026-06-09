import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/.*/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('homepage has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Filter out known acceptable errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('DevTools')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('page has proper meta tags', async ({ page }) => {
    await page.goto('/');

    const metaDescription = page.locator('meta[name="description"]');
    const viewport = page.locator('meta[name="viewport"]');

    await expect(metaDescription).toHaveAttribute('content', /.+/);
    await expect(viewport).toHaveAttribute('content', /.+/);
  });

  test('page is accessible - no major a11y violations', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility requirements
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check for images with alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', /.*/);
    }
  });

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
  });

  test('404 page works correctly', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Next.js returns 404 for unknown pages
    expect(response?.status()).toBe(404);
  });
});