/**
 * WhatsApp Webhook Route Tests
 *
 * Tests the GET (verification) and POST (webhook processing) handlers.
 * Critical for security: ensures signature validation is enforced.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

// Mock the processor module
vi.mock('@/services/whatsapp/processor', () => ({
  processWebhook: vi.fn().mockResolvedValue(undefined),
}));

describe('WhatsApp Webhook Route', () => {
  const originalEnv = process.env;
  const testAppSecret = 'test-secret-key-12345';
  const testVerifyToken = 'test-verify-token-67890';

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.WHATSAPP_APP_SECRET = testAppSecret;
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = testVerifyToken;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe('GET - Webhook Verification', () => {
    it('should return challenge for valid verification request', async () => {
      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      url.searchParams.set('hub.mode', 'subscribe');
      url.searchParams.set('hub.verify_token', testVerifyToken);
      url.searchParams.set('hub.challenge', 'test-challenge-123');

      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(200);
      const body = await response.text();
      expect(body).toBe('test-challenge-123');
    });

    it('should return 403 for invalid verify token', async () => {
      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      url.searchParams.set('hub.mode', 'subscribe');
      url.searchParams.set('hub.verify_token', 'wrong-token');
      url.searchParams.set('hub.challenge', 'test-challenge-123');

      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toEqual({ error: 'Forbidden' });
    });

    it('should return 403 for invalid mode', async () => {
      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      url.searchParams.set('hub.mode', 'invalid');
      url.searchParams.set('hub.verify_token', testVerifyToken);
      url.searchParams.set('hub.challenge', 'test-challenge-123');

      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(403);
    });

    it('should return 403 when missing parameters', async () => {
      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url);
      const response = await GET(request);

      expect(response.status).toBe(403);
    });
  });

  describe('POST - Webhook Processing', () => {
    it('should accept valid webhook with correct signature', async () => {
      const payload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: '123',
            changes: [
              {
                field: 'messages',
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '1234567890',
                    phone_number_id: 'test-phone-id',
                  },
                  contacts: [],
                  messages: [],
                },
              },
            ],
          },
        ],
      };

      const payloadString = JSON.stringify(payload);
      const signature =
        'sha256=' +
        createHmac('sha256', testAppSecret).update(payloadString).digest('hex');

      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'x-hub-signature-256': signature,
          'content-type': 'application/json',
        },
        body: payloadString,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ status: 'ok' });
    });

    it('should reject webhook with invalid signature', async () => {
      const payload = { object: 'whatsapp_business_account', entry: [] };
      const payloadString = JSON.stringify(payload);
      const invalidSignature = 'sha256=invalid-signature-here';

      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'x-hub-signature-256': invalidSignature,
          'content-type': 'application/json',
        },
        body: payloadString,
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({ error: 'Unauthorized' });
    });

    it('should reject webhook with missing signature header', async () => {
      const payload = { object: 'whatsapp_business_account', entry: [] };
      const payloadString = JSON.stringify(payload);

      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: payloadString,
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toEqual({ error: 'Unauthorized' });
    });

    it('should reject webhook with tampered payload', async () => {
      const originalPayload = { object: 'whatsapp_business_account', entry: [] };
      const tamperedPayload = {
        object: 'whatsapp_business_account',
        entry: [{ id: 'malicious' }],
      };

      const originalString = JSON.stringify(originalPayload);
      const signature =
        'sha256=' +
        createHmac('sha256', testAppSecret)
          .update(originalString)
          .digest('hex');

      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'x-hub-signature-256': signature,
          'content-type': 'application/json',
        },
        body: JSON.stringify(tamperedPayload),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should handle malformed JSON gracefully', async () => {
      const invalidJson = '{"invalid": json}';
      const signature =
        'sha256=' +
        createHmac('sha256', testAppSecret).update(invalidJson).digest('hex');

      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'x-hub-signature-256': signature,
          'content-type': 'application/json',
        },
        body: invalidJson,
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual({ error: 'Bad Request' });
    });

    it('should respond quickly (within 5 seconds for Meta requirement)', async () => {
      const payload = { object: 'whatsapp_business_account', entry: [] };
      const payloadString = JSON.stringify(payload);
      const signature =
        'sha256=' +
        createHmac('sha256', testAppSecret).update(payloadString).digest('hex');

      const url = new URL('http://localhost:3000/api/webhooks/whatsapp');
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'x-hub-signature-256': signature,
          'content-type': 'application/json',
        },
        body: payloadString,
      });

      const startTime = performance.now();
      const response = await POST(request);
      const duration = performance.now() - startTime;

      expect(response.status).toBe(200);
      // Should respond in less than 5000ms (Meta requirement)
      // In tests this should be instant (<100ms)
      expect(duration).toBeLessThan(100);
    });
  });
});
