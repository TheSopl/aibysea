import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
  test('should display English content with LTR direction by default', async ({ page }) => {
    // Navigate to login page (public page)
    await page.goto('/login');

    // Verify HTML dir attribute is ltr
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');

    // Verify English content is displayed
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should display Arabic content with RTL direction when accessing /ar route', async ({ page }) => {
    // Navigate to Arabic login page
    await page.goto('/ar/login');

    // Verify URL includes /ar prefix
    await expect(page).toHaveURL(/\/ar\/login$/);

    // Verify HTML dir attribute is rtl
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');

    // Verify lang attribute is set to ar
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('should maintain locale across navigation', async ({ page }) => {
    // Start with Arabic locale
    await page.goto('/ar/login');
    await expect(page).toHaveURL(/\/ar\/login$/);

    // Navigate to different page using link or direct navigation
    await page.goto('/ar/dashboard');

    // Verify locale is maintained
    await expect(page).toHaveURL(/\/ar\/dashboard$|\/ar\/login$/); // May redirect to login if not authenticated

    // Verify RTL direction is still applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('should handle locale switching between English and Arabic', async ({ page }) => {
    // Start with English
    await page.goto('/login');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Switch to Arabic by navigating to /ar
    await page.goto('/ar/login');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');

    // Verify we can navigate within Arabic locale
    await page.goto('/ar/dashboard');
    // Should redirect to /ar/login if not authenticated, or stay on /ar/dashboard
    await expect(page).toHaveURL(/\/ar\//);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('should apply correct direction to authenticated pages in Arabic', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    if (!testEmail || !testPassword) {
      test.skip();
      return;
    }

    // Login through Arabic locale
    await page.goto('/ar/login');
    await page.getByPlaceholder(/email/i).first().fill(testEmail);
    await page.getByPlaceholder(/8 characters/i).first().fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).first().click();

    // Wait for redirect
    await page.waitForURL(/\/(ar\/)?(dashboard|inbox)/, { timeout: 15000 });

    // Verify RTL is applied on authenticated page
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('should have proper meta tags for different locales', async ({ page }) => {
    // Check English meta tags
    await page.goto('/login');
    const htmlEn = page.locator('html');
    await expect(htmlEn).toHaveAttribute('lang', 'en');

    // Check Arabic meta tags
    await page.goto('/ar/login');
    const htmlAr = page.locator('html');
    await expect(htmlAr).toHaveAttribute('lang', 'ar');
  });
});
