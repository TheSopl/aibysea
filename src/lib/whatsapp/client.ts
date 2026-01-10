/**
 * WhatsApp Cloud API Client
 *
 * Client for sending messages via WhatsApp Cloud API.
 * Handles text messages and template messages with error handling.
 */

import { getApiUrl, getAccessToken } from './constants';

// ============================================================================
// Types
// ============================================================================

/**
 * Response from WhatsApp Send Message API
 */
export interface SendMessageResponse {
  messaging_product: 'whatsapp';
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

/**
 * Error response from WhatsApp API
 */
export interface WhatsAppError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

/**
 * Template component for parameterized templates
 */
export interface TemplateComponent {
  type: 'header' | 'body' | 'button';
  parameters?: Array<{
    type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
    text?: string;
    currency?: { fallback_value: string; code: string; amount_1000: number };
    date_time?: { fallback_value: string };
    image?: { link: string };
    document?: { link: string };
    video?: { link: string };
  }>;
  sub_type?: 'quick_reply' | 'url';
  index?: number;
}

// ============================================================================
// Error Handling Helpers
// ============================================================================

/**
 * Common WhatsApp API error codes and their meanings
 */
const ERROR_MESSAGES: Record<number, string> = {
  131047: '24-hour window expired - use template message',
  131056: 'Pair rate limit - too many messages to same user',
  132001: 'Template does not exist',
  131051: 'Unsupported message type',
  131052: 'Media download failed',
  131053: 'Media upload failed',
};

/**
 * Format a WhatsApp API error for user-friendly display
 */
function formatErrorMessage(error: WhatsAppError['error']): string {
  const friendlyMessage = ERROR_MESSAGES[error.code];
  if (friendlyMessage) {
    return `WhatsApp Error ${error.code}: ${friendlyMessage}`;
  }
  return `WhatsApp Error ${error.code}: ${error.message}`;
}

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * Send a text message to a WhatsApp user.
 *
 * @param to - Recipient phone number (without + prefix)
 * @param text - Message text content
 * @returns Promise resolving to send message response with message ID
 * @throws Error if API call fails
 *
 * @example
 * const response = await sendTextMessage('972501234567', 'Hello!');
 * console.log('Message ID:', response.messages[0].id);
 */
export async function sendTextMessage(
  to: string,
  text: string
): Promise<SendMessageResponse> {
  const url = getApiUrl();
  const accessToken = getAccessToken();

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      body: text,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as WhatsAppError;
    console.error('[WhatsApp Client] Send text failed:', errorData);
    throw new Error(formatErrorMessage(errorData.error));
  }

  const data = (await response.json()) as SendMessageResponse;
  console.log('[WhatsApp Client] Text message sent:', data.messages[0]?.id);
  return data;
}

/**
 * Send a template message to a WhatsApp user.
 * Template messages can be sent outside the 24-hour window.
 *
 * @param to - Recipient phone number (without + prefix)
 * @param templateName - Name of the approved template
 * @param languageCode - Language code (e.g., 'en', 'ar', 'he')
 * @param components - Optional template components for parameters
 * @returns Promise resolving to send message response with message ID
 * @throws Error if API call fails
 *
 * @example
 * // Simple template without parameters
 * await sendTemplateMessage('972501234567', 'hello_world', 'en');
 *
 * @example
 * // Template with body parameters
 * await sendTemplateMessage('972501234567', 'order_update', 'en', [
 *   { type: 'body', parameters: [{ type: 'text', text: 'ORDER-123' }] }
 * ]);
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components?: TemplateComponent[]
): Promise<SendMessageResponse> {
  const url = getApiUrl();
  const accessToken = getAccessToken();

  const body: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      ...(components && { components }),
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as WhatsAppError;
    console.error('[WhatsApp Client] Send template failed:', errorData);
    throw new Error(formatErrorMessage(errorData.error));
  }

  const data = (await response.json()) as SendMessageResponse;
  console.log('[WhatsApp Client] Template message sent:', data.messages[0]?.id);
  return data;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if the 24-hour messaging window is still open for a conversation.
 * Free-form messages can only be sent within 24 hours of customer's last message.
 * After 24 hours, you must use an approved template message.
 *
 * @param lastCustomerMessageAt - ISO timestamp of customer's last message
 * @returns true if within 24-hour window, false otherwise
 *
 * @example
 * const canSendFreeform = isWithin24HourWindow(conversation.last_customer_message_at);
 * if (canSendFreeform) {
 *   await sendTextMessage(phone, 'Hello!');
 * } else {
 *   await sendTemplateMessage(phone, 'hello_world', 'en');
 * }
 */
export function isWithin24HourWindow(
  lastCustomerMessageAt: string | null
): boolean {
  if (!lastCustomerMessageAt) return false;

  const lastMessage = new Date(lastCustomerMessageAt);
  const now = new Date();
  const hoursDiff =
    (now.getTime() - lastMessage.getTime()) / (1000 * 60 * 60);

  return hoursDiff < 24;
}
