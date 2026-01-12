import { NextRequest, NextResponse } from 'next/server';
import type { TelegramUpdate } from '@/lib/telegram/types';
import { getWebhookSecretPath } from '@/lib/telegram/constants';
import { processTelegramUpdate } from '@/services/telegram/processor';

/**
 * POST /api/webhooks/telegram/[secret]
 *
 * Receives Telegram bot updates. The [secret] path segment
 * acts as authentication (only Telegram knows the webhook URL).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ secret: string }> }
): Promise<NextResponse> {
  const { secret } = await params;

  // Verify secret path matches
  if (secret !== getWebhookSecretPath()) {
    console.warn('[Telegram Webhook] Invalid secret path');
    return new NextResponse('Not Found', { status: 404 });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json() as TelegramUpdate;
  } catch (error) {
    console.error('[Telegram Webhook] Failed to parse JSON:', error);
    return new NextResponse('Bad Request', { status: 400 });
  }

  console.log('[Telegram Webhook] Received update:', update.update_id);

  // Process asynchronously
  processTelegramUpdate(update).catch((error) => {
    console.error('[Telegram Webhook] Processing error:', error);
  });

  // Respond immediately
  return new NextResponse('OK', { status: 200 });
}
