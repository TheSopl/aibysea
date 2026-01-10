-- Add WhatsApp message ID for deduplication
-- This column stores the unique message ID from WhatsApp Cloud API
-- Used to prevent duplicate message insertion when webhooks are retried

ALTER TABLE messages ADD COLUMN whatsapp_message_id TEXT;

-- Partial index for fast duplicate lookup (only on non-null values)
-- WhatsApp message IDs are unique across the platform
CREATE INDEX idx_messages_whatsapp_message_id
  ON messages(whatsapp_message_id)
  WHERE whatsapp_message_id IS NOT NULL;

-- Note: Not adding UNIQUE constraint because:
-- 1. Only WhatsApp messages have this field (null for other channels)
-- 2. The index is sufficient for deduplication checks
