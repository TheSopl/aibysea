/**
 * WhatsApp Webhook Signature Verification
 *
 * Implements HMAC-SHA256 signature verification for incoming WhatsApp webhooks.
 * This is critical for security - it ensures webhooks actually came from Meta.
 *
 * SECURITY: Uses timingSafeEqual to prevent timing attacks. A timing attack
 * could allow an attacker to guess the correct signature byte-by-byte by
 * measuring response times. timingSafeEqual compares in constant time.
 */

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies that a webhook request actually came from Meta/WhatsApp.
 *
 * Meta signs all webhook payloads with HMAC-SHA256 using your app secret.
 * The signature is sent in the X-Hub-Signature-256 header, prefixed with 'sha256='.
 *
 * @param payload - The raw request body as a string (must be exact bytes received)
 * @param signature - The X-Hub-Signature-256 header value (e.g., 'sha256=abc123...')
 * @returns true if signature is valid, false otherwise
 *
 * @example
 * const isValid = verifySignature(
 *   req.body, // raw body string
 *   req.headers['x-hub-signature-256']
 * );
 * if (!isValid) {
 *   return res.status(401).json({ error: 'Invalid signature' });
 * }
 *
 * @security
 * - Uses timing-safe comparison to prevent timing attacks
 * - Returns false for any error condition (fail secure)
 * - Requires WHATSAPP_APP_SECRET to be configured
 */
export function verifySignature(payload: string, signature: string | null | undefined): boolean {
  // Fail secure: reject if no signature provided
  if (!signature) {
    return false;
  }

  const appSecret = process.env.WHATSAPP_APP_SECRET;

  // Fail secure: reject if app secret not configured
  if (!appSecret) {
    console.error('WHATSAPP_APP_SECRET is not configured - cannot verify webhook signature');
    return false;
  }

  try {
    // Compute HMAC-SHA256 hash of the payload using app secret
    const expectedSignature = 'sha256=' + createHmac('sha256', appSecret)
      .update(payload)
      .digest('hex');

    // Convert both to buffers for timing-safe comparison
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(signature, 'utf8');

    // timingSafeEqual throws if buffer lengths differ
    // This is intentional - different lengths mean different signatures
    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    // Constant-time comparison prevents timing attacks
    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (error) {
    // Fail secure: any error means invalid signature
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
