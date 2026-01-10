-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Agents table (internal users)
create table agents (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts table (customers)
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  phone text unique not null,  -- Primary identifier for WhatsApp
  name text,
  metadata jsonb default '{}',  -- Flexible storage for channel-specific data
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversations table
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid references contacts(id) on delete cascade not null,
  channel text not null default 'whatsapp',  -- Future: 'telegram', 'sms', etc.
  status text not null default 'active',  -- 'active', 'closed'
  handler_type text not null default 'ai',  -- 'ai' or 'human'
  assigned_agent_id uuid references agents(id) on delete set null,
  last_message_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  direction text not null,  -- 'inbound' or 'outbound'
  content text not null,
  content_type text not null default 'text',  -- 'text', 'image', 'document', etc.
  metadata jsonb default '{}',  -- WhatsApp message ID, media URLs, etc.
  sender_type text not null,  -- 'contact', 'agent', 'ai'
  sender_id uuid,  -- agent.id if sender_type is 'agent'
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_conversations_contact on conversations(contact_id);
create index idx_conversations_status on conversations(status);
create index idx_conversations_handler on conversations(handler_type);
create index idx_conversations_last_message on conversations(last_message_at desc);
create index idx_messages_conversation on messages(conversation_id);
create index idx_messages_created on messages(created_at desc);
create index idx_contacts_phone on contacts(phone);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger agents_updated_at before update on agents
  for each row execute function update_updated_at();
create trigger contacts_updated_at before update on contacts
  for each row execute function update_updated_at();
create trigger conversations_updated_at before update on conversations
  for each row execute function update_updated_at();

-- RLS Policies (agents can see all data - internal tool)
alter table agents enable row level security;
alter table contacts enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Agents can read/write all data (authenticated users are agents)
create policy "Agents can view all agents" on agents
  for select to authenticated using (true);

create policy "Agents can view all contacts" on contacts
  for select to authenticated using (true);
create policy "Agents can insert contacts" on contacts
  for insert to authenticated with check (true);
create policy "Agents can update contacts" on contacts
  for update to authenticated using (true);

create policy "Agents can view all conversations" on conversations
  for select to authenticated using (true);
create policy "Agents can insert conversations" on conversations
  for insert to authenticated with check (true);
create policy "Agents can update conversations" on conversations
  for update to authenticated using (true);

create policy "Agents can view all messages" on messages
  for select to authenticated using (true);
create policy "Agents can insert messages" on messages
  for insert to authenticated with check (true);
