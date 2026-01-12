-- Enable real-time for messages table
-- Replica identity is required for Supabase real-time to broadcast changes
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Enable real-time publication for messages table
-- This allows the real-time subscription to receive INSERT, UPDATE, DELETE events
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
