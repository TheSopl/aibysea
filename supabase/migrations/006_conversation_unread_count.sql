-- Add unread_count column to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS unread_count INTEGER DEFAULT 0 NOT NULL;

-- Create function to increment unread count on inbound message
CREATE OR REPLACE FUNCTION increment_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment for inbound messages (from customers)
  IF NEW.direction = 'inbound' THEN
    UPDATE conversations
    SET unread_count = unread_count + 1
    WHERE id = NEW.conversation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment unread count on new inbound message
DROP TRIGGER IF EXISTS trigger_increment_unread_count ON messages;
CREATE TRIGGER trigger_increment_unread_count
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_unread_count();
