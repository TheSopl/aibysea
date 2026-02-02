import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to login when accessing protected route unauthenticated', async ({ page }) => {
    // Try to access protected dashboard page
    await page.goto('/dashboard');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login$/);

    // Verify login page elements are visible
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/8 characters/i)).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials using placeholder selectors
    await page.getByPlaceholder(/email/i).fill('invalid@example.com');
    await page.getByPlaceholder(/8 characters/i).fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for and verify error message appears (any error text in red box)
    await expect(page.locator('.bg-red-50, [class*="error"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should login successfully with valid credentials and redirect to dashboard', async ({ page }) => {
    // Note: This test requires valid test credentials in Supabase
    // Skip if credentials are not available
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    if (!testEmail || !testPassword) {
      test.skip();
      return;
    }

    await page.goto('/login');

    // Fill in valid credentials
    await page.getByPlaceholder(/email/i).fill(testEmail);
    await page.getByPlaceholder(/8 characters/i).fill(testPassword);

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 });

    // Verify dashboard content is visible
    await expect(page.getByText(/conversational ai/i)).toBeVisible();
  });

  test('should redirect authenticated users away from login page', async ({ page, context }) => {
    // Note: This test requires valid test credentials
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    if (!testEmail || !testPassword) {
      test.skip();
      return;
    }

    // First login
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill(testEmail);
    await page.getByPlaceholder(/8 characters/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 });

    // Try to go back to login page
    await page.goto('/login');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('should protect inbox route from unauthenticated access', async ({ page }) => {
    // Try to access inbox without authentication
    await page.goto('/inbox');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should protect agents route from unauthenticated access', async ({ page }) => {
    // Try to access agents without authentication
    await page.goto('/agents');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login$/);
  });
});
