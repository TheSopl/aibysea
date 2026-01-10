/**
 * WhatsApp Webhook Route Handler
 *
 * Handles incoming WhatsApp Cloud API webhooks:
 * - GET: Webhook verification handshake with Meta
 * - POST: Receive and process incoming messages
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/whatsapp/signature';
import type { WebhookPayload } from '@/lib/whatsapp/types';
import { processWebhook } from '@/services/whatsapp/processor';

/**
 * GET /api/webhooks/whatsapp
 *
 * Webhook verification endpoint. Meta sends a GET request with these params
 * when you register a webhook URL. Must return the challenge value to verify.
 *
 * Query params:
 * - hub.mode: Should be 'subscribe'
 * - hub.verify_token: Your custom token to validate the request
 * - hub.challenge: Value to return if verification succeeds
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get('hub.mode');
  const verifyToken = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('[WhatsApp Webhook] Verification attempt:', {
    mode,
    hasVerifyToken: !!verifyToken,
    hasChallenge: !!challenge,
  });

  // Verify the request is a subscription request with matching token
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && verifyToken === expectedToken) {
    console.log('[WhatsApp Webhook] Verification successful');
    // Return the challenge value as plain text (required by Meta)
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('[WhatsApp Webhook] Verification failed:', {
    modeValid: mode === 'subscribe',
    tokenValid: verifyToken === expectedToken,
  });

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

/**
 * POST /api/webhooks/whatsapp
 *
 * Receives incoming WhatsApp messages and delivery status updates.
 * CRITICAL: Must respond within 5 seconds or Meta will retry.
 *
 * Security:
 * - Validates X-Hub-Signature-256 header using HMAC-SHA256
 * - Uses raw body for signature verification (not parsed JSON)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Get signature header
  const signature = request.headers.get('x-hub-signature-256');

  // Get raw body as text (required for signature verification)
  // IMPORTANT: Must use text() not json() to get exact bytes for HMAC
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (error) {
    console.error('[WhatsApp Webhook] Failed to read request body:', error);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  // Verify signature
  if (!verifySignature(rawBody, signature)) {
    console.warn('[WhatsApp Webhook] Invalid signature');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse the JSON payload
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch (error) {
    console.error('[WhatsApp Webhook] Failed to parse JSON:', error);
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  console.log('[WhatsApp Webhook] Received payload:', {
    object: payload.object,
    entryCount: payload.entry?.length ?? 0,
  });

  // Process webhook asynchronously - DO NOT await
  // This ensures we respond within 5 seconds as required by Meta
  processWebhook(payload).catch((error) => {
    console.error('[WhatsApp Webhook] Processing error:', error);
  });

  // Respond immediately with 200 OK
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
