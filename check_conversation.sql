-- Check the conversation for UAE number
SELECT 
  id,
  channel,
  status,
  handler_type,
  last_message_at,
  last_customer_message_at,
  created_at
FROM conversations
WHERE contact_id IN (
  SELECT id FROM contacts WHERE phone = '971543638614'
)
ORDER BY created_at DESC
LIMIT 1;
