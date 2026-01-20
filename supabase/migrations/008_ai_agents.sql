-- AI Agents table (AI personalities/configurations, NOT human agents)
-- Human agents are stored in the 'agents' table
create table ai_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,  -- Display name like "Sales Assistant"
  model text not null default 'gpt-4-turbo',  -- AI model identifier
  system_prompt text,  -- The personality/instructions prompt
  greeting_message text,  -- First message when conversation starts
  triggers jsonb default '[]',  -- Array of trigger keywords/patterns
  behaviors jsonb default '{}',  -- Behavior settings (escalation rules, etc.)
  status text not null default 'active',  -- 'active' or 'inactive'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for status filtering
create index idx_ai_agents_status on ai_agents(status);

-- Apply updated_at trigger (function already exists from 001_initial_schema.sql)
create trigger ai_agents_updated_at before update on ai_agents
  for each row execute function update_updated_at();

-- RLS Policies (same pattern as other tables - all authenticated users can access)
alter table ai_agents enable row level security;

create policy "Agents can view all AI agents" on ai_agents
  for select to authenticated using (true);

create policy "Agents can insert AI agents" on ai_agents
  for insert to authenticated with check (true);

create policy "Agents can update AI agents" on ai_agents
  for update to authenticated using (true);

create policy "Agents can delete AI agents" on ai_agents
  for delete to authenticated using (true);

-- Enable real-time for the table
alter publication supabase_realtime add table ai_agents;
