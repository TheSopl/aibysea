-- Document Intelligence Schema
-- Tables for document processing, templates, extraction jobs, and extracted data

-- Documents table: stores uploaded documents and their processing status
create table documents (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  file_type text not null,  -- pdf, docx, jpg, png, etc.
  file_size integer not null,  -- size in bytes
  storage_path text not null,  -- Supabase storage reference
  status text not null default 'pending',  -- pending, processing, completed, failed
  template_id uuid references templates(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Templates table: extraction templates for specific document types
create table templates (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  type text not null,  -- invoice, receipt, contract, form, custom
  fields jsonb not null default '[]',  -- array of field definitions
  status text not null default 'active',  -- active, archived
  created_by uuid references agents(id) on delete set null,
  usage_count integer default 0,
  success_rate numeric default 0,  -- percentage 0-100
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Extraction Jobs table: tracks document processing jobs
create table extraction_jobs (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade,
  template_id uuid references templates(id) on delete cascade,
  status text not null default 'pending',  -- pending, processing, completed, failed
  progress integer default 0,  -- 0-100
  result jsonb,  -- extracted data in template field structure
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Extracted Data table: normalized field-level extraction results
create table extracted_data (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references extraction_jobs(id) on delete cascade,
  field_name text not null,
  extracted_value text,
  confidence numeric not null default 0,  -- 0-1 accuracy score
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_documents_template on documents(template_id);
create index idx_documents_status on documents(status);
create index idx_documents_created on documents(created_at desc);

create index idx_templates_name on templates(name);
create index idx_templates_type on templates(type);
create index idx_templates_status on templates(status);

create index idx_extraction_jobs_document on extraction_jobs(document_id);
create index idx_extraction_jobs_template on extraction_jobs(template_id);
create index idx_extraction_jobs_status on extraction_jobs(status);
create index idx_extraction_jobs_created on extraction_jobs(created_at desc);

create index idx_extracted_data_job on extracted_data(job_id);

-- Apply updated_at triggers
create trigger documents_updated_at before update on documents
  for each row execute function update_updated_at();
create trigger templates_updated_at before update on templates
  for each row execute function update_updated_at();
create trigger extraction_jobs_updated_at before update on extraction_jobs
  for each row execute function update_updated_at();

-- Enable RLS on all new tables
alter table documents enable row level security;
alter table templates enable row level security;
alter table extraction_jobs enable row level security;
alter table extracted_data enable row level security;

-- RLS Policies: Agents can view and manage all documents
create policy "Agents can view all documents" on documents
  for select to authenticated using (true);
create policy "Agents can insert documents" on documents
  for insert to authenticated with check (true);
create policy "Agents can update documents" on documents
  for update to authenticated using (true);

-- RLS Policies: Agents can view and manage all templates
create policy "Agents can view all templates" on templates
  for select to authenticated using (true);
create policy "Agents can insert templates" on templates
  for insert to authenticated with check (true);
create policy "Agents can update templates" on templates
  for update to authenticated using (true);
create policy "Agents can delete templates" on templates
  for delete to authenticated using (true);

-- RLS Policies: Agents can view and manage extraction jobs
create policy "Agents can view all extraction jobs" on extraction_jobs
  for select to authenticated using (true);
create policy "Agents can insert extraction jobs" on extraction_jobs
  for insert to authenticated with check (true);
create policy "Agents can update extraction jobs" on extraction_jobs
  for update to authenticated using (true);

-- RLS Policies: Agents can view extracted data
create policy "Agents can view all extracted data" on extracted_data
  for select to authenticated using (true);
create policy "Agents can insert extracted data" on extracted_data
  for insert to authenticated with check (true);

-- Enable real-time for extraction jobs (for progress tracking)
alter table extraction_jobs replica identity full;
