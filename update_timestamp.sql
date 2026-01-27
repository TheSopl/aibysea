-- Force update last_customer_message_at to NOW for testing
-- This will open the 24-hour window
UPDATE conversations
SET last_customer_message_at = NOW()
WHERE contact_id IN (
  SELECT id FROM contacts WHERE phone = '971543638614'
);

-- Verify the update
SELECT 
  c.id,
  co.phone,
  c.last_customer_message_at,
  EXTRACT(EPOCH FROM (NOW() - c.last_customer_message_at)) / 3600 as hours_ago
FROM conversations c
JOIN contacts co ON c.contact_id = co.id
WHERE co.phone = '971543638614';
