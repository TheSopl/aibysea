/**
 * WhatsApp Cloud API Constants
 *
 * Configuration constants for interacting with the Meta WhatsApp Cloud API.
 * Environment variables are used for sensitive values (tokens, IDs).
 */

/**
 * Graph API version to use for WhatsApp Cloud API requests.
 * Defaults to 'v21.0' if WHATSAPP_API_VERSION is not set.
 * Update this when Meta releases new API versions.
 */
export const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';

/**
 * Base URL template for WhatsApp Cloud API messages endpoint.
 * The actual URL is constructed using getApiUrl() with environment variables.
 */
export const BASE_URL_TEMPLATE = 'https://graph.facebook.com/{version}/{phone_id}/messages';

/**
 * Constructs the full WhatsApp Cloud API messages endpoint URL.
 * Uses WHATSAPP_PHONE_NUMBER_ID from environment and API_VERSION constant.
 *
 * @returns The complete URL for sending messages via WhatsApp Cloud API
 * @throws Error if WHATSAPP_PHONE_NUMBER_ID is not configured
 *
 * @example
 * const url = getApiUrl();
 * // Returns: https://graph.facebook.com/v21.0/{phone_id}/messages
 */
export function getApiUrl(): string {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!phoneNumberId) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID environment variable is not configured');
  }

  return `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`;
}

/**
 * Gets the configured WhatsApp access token for API authentication.
 *
 * @returns The access token string
 * @throws Error if WHATSAPP_ACCESS_TOKEN is not configured
 */
export function getAccessToken(): string {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!token) {
    throw new Error('WHATSAPP_ACCESS_TOKEN environment variable is not configured');
  }

  return token;
}

/**
 * Gets the webhook verify token used for Meta webhook verification.
 * This is a custom string you define and configure in Meta Developer Dashboard.
 *
 * @returns The verify token string
 * @throws Error if WHATSAPP_WEBHOOK_VERIFY_TOKEN is not configured
 */
export function getWebhookVerifyToken(): string {
  const token = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!token) {
    throw new Error('WHATSAPP_WEBHOOK_VERIFY_TOKEN environment variable is not configured');
  }

  return token;
}
