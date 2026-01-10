-- Track last customer message for 24-hour window enforcement
-- WhatsApp only allows free-form messages within 24h of customer's last message
-- After that, you must use an approved template message

-- Add column to track when customer last messaged
ALTER TABLE conversations ADD COLUMN last_customer_message_at TIMESTAMPTZ;

-- Update existing conversations to use last_message_at as initial value
-- This provides a reasonable default for existing data
UPDATE conversations SET last_customer_message_at = last_message_at WHERE last_customer_message_at IS NULL;
