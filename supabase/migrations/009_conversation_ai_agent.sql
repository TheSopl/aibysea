-- Add ai_agent_id to conversations table
-- Links conversations to specific AI agents for personalized handling

ALTER TABLE conversations
ADD COLUMN ai_agent_id uuid REFERENCES ai_agents(id) ON DELETE SET NULL;

-- Index for efficient lookups by AI agent
CREATE INDEX idx_conversations_ai_agent_id ON conversations(ai_agent_id);

COMMENT ON COLUMN conversations.ai_agent_id IS 'The AI agent assigned to handle this conversation when handler_type is ai';
