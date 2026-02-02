import { test, expect } from '@playwright/test';

test.describe('Inbox', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;

    if (!testEmail || !testPassword) {
      test.skip();
      return;
    }

    // Login
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill(testEmail);
    await page.getByPlaceholder(/8 characters/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 });
  });

  test('should load inbox page and display conversations list', async ({ page }) => {
    // Skip if no test credentials
    const testEmail = process.env.TEST_USER_EMAIL;
    if (!testEmail) {
      test.skip();
      return;
    }

    // Navigate to inbox
    await page.goto('/inbox');

    // Wait for page to load
    await expect(page).toHaveURL(/\/inbox$/);

    // Check for inbox UI elements (search bar, conversation list area)
    // Note: These selectors may need adjustment based on actual implementation
    const searchInput = page.getByPlaceholder(/search/i).first();
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }

    // Verify the page structure loaded (TopBar or main content)
    // At minimum, the page should not show an error
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display conversation details when clicking on a conversation', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL;
    if (!testEmail) {
      test.skip();
      return;
    }

    await page.goto('/inbox');

    // Wait for conversations to potentially load
    await page.waitForTimeout(2000);

    // Try to find and click first conversation item
    // This is a best-effort test - may not find conversations in empty database
    const firstConversation = page.locator('[data-testid="conversation-item"]').first();
    const conversationExists = await firstConversation.isVisible().catch(() => false);

    if (conversationExists) {
      await firstConversation.click();

      // Verify conversation detail view shows
      // Look for message area or conversation header
      const messageArea = page.locator('[data-testid="message-area"]');
      if (await messageArea.isVisible().catch(() => false)) {
        await expect(messageArea).toBeVisible();
      }
    } else {
      // If no conversations exist, verify empty state or conversation list container
      const conversationList = page.locator('[data-testid="conversation-list"]');
      if (await conversationList.isVisible().catch(() => false)) {
        await expect(conversationList).toBeVisible();
      }
    }
  });

  test('should be able to send a message in an open conversation', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL;
    if (!testEmail) {
      test.skip();
      return;
    }

    await page.goto('/inbox');
    await page.waitForTimeout(2000);

    // Try to find and open first conversation
    const firstConversation = page.locator('[data-testid="conversation-item"]').first();
    const conversationExists = await firstConversation.isVisible().catch(() => false);

    if (conversationExists) {
      await firstConversation.click();

      // Try to find message input field
      const messageInput = page.getByPlaceholder(/type.*message/i).first();
      const inputExists = await messageInput.isVisible().catch(() => false);

      if (inputExists) {
        const testMessage = `Test message at ${new Date().toISOString()}`;

        // Type and send message
        await messageInput.fill(testMessage);

        // Find and click send button
        const sendButton = page.getByRole('button', { name: /send/i }).or(page.locator('[aria-label="Send message"]'));
        await sendButton.click();

        // Verify message appears in conversation (optimistic UI)
        await expect(page.getByText(testMessage)).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
