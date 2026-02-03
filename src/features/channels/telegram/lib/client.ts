import { getTelegramApiUrl } from './constants';
import type { SendMessageResponse } from './types';

/**
 * Send a text message to a Telegram chat.
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string
): Promise<SendMessageResponse> {
  const response = await fetch(`${getTelegramApiUrl()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML', // Allows <b>, <i>, <a>, etc.
    }),
  });

  const data = await response.json() as SendMessageResponse;

  if (!data.ok) {
    console.error('[Telegram Client] Send failed:', data);
    throw new Error(`Telegram error ${data.error_code}: ${data.description}`);
  }

  return data;
}

/**
 * Set the webhook URL for the bot.
 * Call this once during setup.
 */
export async function setTelegramWebhook(webhookUrl: string): Promise<void> {
  const response = await fetch(`${getTelegramApiUrl()}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message'], // Only receive message updates
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Failed to set webhook: ${data.description}`);
  }

  console.log('[Telegram Client] Webhook set successfully');
}

/**
 * Delete the webhook (useful for local testing with polling).
 */
export async function deleteTelegramWebhook(): Promise<void> {
  const response = await fetch(`${getTelegramApiUrl()}/deleteWebhook`, {
    method: 'POST',
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Failed to delete webhook: ${data.description}`);
  }

  console.log('[Telegram Client] Webhook deleted');
}
