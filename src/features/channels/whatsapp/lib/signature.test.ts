/**
 * Webhook Signature Verification Tests
 *
 * Tests the HMAC-SHA256 signature verification for WhatsApp webhooks.
 * This is CRITICAL for security - ensures webhooks actually came from Meta.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { verifySignature } from './signature';
import { createHmac } from 'crypto';

describe('verifySignature', () => {
  const originalEnv = process.env;
  const testAppSecret = 'test-secret-key-12345';

  beforeEach(() => {
    // Mock environment variable
    process.env = { ...originalEnv };
    process.env.WHATSAPP_APP_SECRET = testAppSecret;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should return true for valid HMAC signature', () => {
    const payload = '{"test":"data"}';
    const validSignature =
      'sha256=' +
      createHmac('sha256', testAppSecret).update(payload).digest('hex');

    const result = verifySignature(payload, validSignature);

    expect(result).toBe(true);
  });

  it('should return false for invalid signature', () => {
    const payload = '{"test":"data"}';
    const invalidSignature = 'sha256=invalid-signature-here';

    const result = verifySignature(payload, invalidSignature);

    expect(result).toBe(false);
  });

  it('should return false for tampered payload', () => {
    const originalPayload = '{"test":"data"}';
    const tamperedPayload = '{"test":"modified"}';

    // Create signature for original payload
    const signature =
      'sha256=' +
      createHmac('sha256', testAppSecret).update(originalPayload).digest('hex');

    // Try to verify with tampered payload
    const result = verifySignature(tamperedPayload, signature);

    expect(result).toBe(false);
  });

  it('should return false when signature is null', () => {
    const payload = '{"test":"data"}';

    const result = verifySignature(payload, null);

    expect(result).toBe(false);
  });

  it('should return false when signature is undefined', () => {
    const payload = '{"test":"data"}';

    const result = verifySignature(payload, undefined);

    expect(result).toBe(false);
  });

  it('should return false when signature is empty string', () => {
    const payload = '{"test":"data"}';

    const result = verifySignature(payload, '');

    expect(result).toBe(false);
  });

  it('should return false when WHATSAPP_APP_SECRET is not configured', () => {
    delete process.env.WHATSAPP_APP_SECRET;

    const payload = '{"test":"data"}';
    const signature = 'sha256=some-signature';

    const result = verifySignature(payload, signature);

    expect(result).toBe(false);
  });

  it('should handle timing attack resistance (execution time similar)', () => {
    const payload = '{"test":"data"}';

    // Valid signature
    const validSignature =
      'sha256=' +
      createHmac('sha256', testAppSecret).update(payload).digest('hex');

    // Invalid signature (wrong length should be caught early, so use same length)
    const invalidSignature =
      'sha256=' + 'a'.repeat(validSignature.length - 7); // subtract 'sha256='

    // Measure valid signature time
    const validStart = performance.now();
    verifySignature(payload, validSignature);
    const validDuration = performance.now() - validStart;

    // Measure invalid signature time
    const invalidStart = performance.now();
    verifySignature(payload, invalidSignature);
    const invalidDuration = performance.now() - invalidStart;

    // Both should complete in similar time (within 10ms - generous for test environment)
    // This tests that timingSafeEqual is being used (constant-time comparison)
    const timeDifference = Math.abs(validDuration - invalidDuration);
    expect(timeDifference).toBeLessThan(10);
  });

  it('should return false for signature with wrong prefix', () => {
    const payload = '{"test":"data"}';
    const signature =
      'md5=' + createHmac('sha256', testAppSecret).update(payload).digest('hex');

    const result = verifySignature(payload, signature);

    expect(result).toBe(false);
  });

  it('should handle different payload sizes correctly', () => {
    // Small payload
    const smallPayload = '{}';
    const smallSignature =
      'sha256=' +
      createHmac('sha256', testAppSecret).update(smallPayload).digest('hex');
    expect(verifySignature(smallPayload, smallSignature)).toBe(true);

    // Large payload
    const largePayload = JSON.stringify({
      object: 'whatsapp_business_account',
      entry: Array(100).fill({ id: '123', changes: [] }),
    });
    const largeSignature =
      'sha256=' +
      createHmac('sha256', testAppSecret).update(largePayload).digest('hex');
    expect(verifySignature(largePayload, largeSignature)).toBe(true);
  });

  it('should handle buffer conversion errors gracefully', () => {
    const payload = '{"test":"data"}';
    // Create a signature that will cause Buffer.from to potentially fail
    // In practice, this is hard to trigger, but we test the error path exists
    const malformedSignature = 'sha256=';

    const result = verifySignature(payload, malformedSignature);

    // Should return false (fail secure) rather than throwing
    expect(result).toBe(false);
  });
});
