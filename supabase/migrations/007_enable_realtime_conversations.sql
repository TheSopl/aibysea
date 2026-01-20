-- Enable real-time for conversations table
-- Replica identity is required for Supabase real-time to broadcast changes
ALTER TABLE conversations REPLICA IDENTITY FULL;

-- Enable real-time publication for conversations table
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Also enable for contacts table (for name updates)
ALTER TABLE contacts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
