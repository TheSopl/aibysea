export const TELEGRAM_API_VERSION = ''; // Telegram doesn't version like Meta

export function getTelegramApiUrl(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not configured');
  return `https://api.telegram.org/bot${token}`;
}

export function getWebhookSecretPath(): string {
  // Use a secret path segment to prevent random POST attacks
  return process.env.TELEGRAM_WEBHOOK_SECRET || 'telegram-webhook-secret';
}
