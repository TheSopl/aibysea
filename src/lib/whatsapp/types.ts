/**
 * WhatsApp Type Definitions
 *
 * Re-exports types from @whatsapp-cloudapi/types and defines custom types
 * that bridge WhatsApp's data structures to our database schema.
 */

// Re-export webhook types from the official types package
export type {
  WebhookPayload,
  WebhookEntry,
  WebhookChange,
  WebhookValue,
} from '@whatsapp-cloudapi/types/webhook';

export type {
  WebhookMessage,
  WebhookMessageBase,
  WebhookTextMessage,
  WebhookAudioMessage,
  WebhookButtonMessage,
  WebhookDocumentMessage,
  WebhookImageMessage,
  WebhookInteractiveMessage,
  WebhookOrderMessage,
  WebhookStickerMessage,
  WebhookSystemMessage,
  WebhookVideoMessage,
  WebhookUnknownMessage,
} from '@whatsapp-cloudapi/types/webhook';

export type {
  WebhookContact,
} from '@whatsapp-cloudapi/types/webhook';

export type {
  WebhookStatus,
} from '@whatsapp-cloudapi/types/webhook';

export type {
  WebhookError,
} from '@whatsapp-cloudapi/types/webhook';

// ============================================================================
// Custom Types - Bridge WhatsApp to our database schema
// ============================================================================

/**
 * Configuration interface for WhatsApp Cloud API client.
 * Matches the environment variables we require.
 */
export interface WhatsAppConfig {
  /** Phone number ID from Meta Developer Dashboard */
  phoneNumberId: string;
  /** System user access token (permanent token recommended) */
  accessToken: string;
  /** Custom verify token for webhook verification handshake */
  webhookVerifyToken: string;
  /** App secret for signature verification */
  appSecret: string;
  /** Graph API version (e.g., 'v21.0') */
  apiVersion: string;
}

/**
 * Message direction relative to our system.
 * Maps to database messages.direction column.
 *
 * - 'inbound': Message received from customer via WhatsApp
 * - 'outbound': Message sent to customer from our system
 */
export type MessageDirection = 'inbound' | 'outbound';

/**
 * Who sent the message within our system.
 * Maps to database messages.sender_type column.
 *
 * - 'customer': End user messaging via WhatsApp
 * - 'agent': Human agent responding via inbox
 * - 'ai': AI assistant responding automatically
 */
export type MessageSenderType = 'customer' | 'agent' | 'ai';

/**
 * Content types we support for messages.
 * Maps to database messages.content_type column.
 */
export type MessageContentType =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'document'
  | 'sticker'
  | 'location'
  | 'contacts'
  | 'interactive'
  | 'template';

/**
 * Normalized phone number format.
 * WhatsApp uses phone numbers without the '+' prefix.
 * Store and compare numbers in this format.
 *
 * @example '972501234567' (not '+972501234567')
 */
export type WhatsAppPhoneNumber = string;

/**
 * Utility function to normalize phone numbers to WhatsApp format.
 * Removes '+' prefix and any spaces/dashes.
 *
 * @param phone - Phone number in any format
 * @returns Normalized phone number string
 *
 * @example
 * normalizePhoneNumber('+972 50-123-4567') // Returns '972501234567'
 */
export function normalizePhoneNumber(phone: string): WhatsAppPhoneNumber {
  return phone.replace(/[\s\-+]/g, '');
}
