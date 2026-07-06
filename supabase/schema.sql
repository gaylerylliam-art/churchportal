create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  email text not null unique,
  role_name text not null check (role_name in ('Admin', 'Board of Directors', 'Treasury Officer', 'District Leader')),
  district text,
  created_at timestamptz not null default now()
);

create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  ministry text,
  district text,
  leader_name text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  venue text,
  expected_participants integer not null default 0,
  status text not null default 'Pending Approval',
  budget_status text not null default 'Pending',
  report_status text not null default 'Pending',
  funding_source text,
  proposed_budget numeric(12, 2) not null default 0,
  approved_budget numeric(12, 2) not null default 0,
  actual_expense numeric(12, 2) not null default 0,
  line_items jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.fund_releases (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  released_amount numeric(12, 2) not null check (released_amount >= 0),
  release_date date not null,
  released_to text not null,
  payment_method text not null,
  reference_number text,
  remarks text,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  category text not null,
  vendor text,
  invoice_no text,
  invoice_date date,
  amount numeric(12, 2) not null check (amount >= 0),
  tax numeric(12, 2) not null default 0,
  description text,
  payment_method text,
  paid_by text,
  remarks text,
  status text not null default 'Pending Treasury Review',
  attachment_label text,
  extracted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_attachments (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  file_name text not null,
  file_path text,
  mime_type text,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.ai_extracted_invoice_data (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid references public.expenses(id) on delete cascade,
  vendor text,
  invoice_no text,
  invoice_date date,
  total_amount numeric(12, 2),
  tax numeric(12, 2),
  line_items jsonb not null default '[]'::jsonb,
  payment_method text,
  raw_response jsonb not null default '{}'::jsonb,
  confirmed_by_human boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.liquidation_reports (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  summary text not null,
  attendees integer not null default 0,
  amount_returned numeric(12, 2) not null default 0,
  issues text,
  recommendations text,
  status text not null default 'Submitted',
  submitted_by text not null,
  submitted_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  related_table text not null,
  related_id uuid not null,
  decision text not null check (decision in ('Approved', 'Rejected', 'Returned for Correction')),
  remarks text,
  decided_by text not null,
  decided_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  user_id uuid references public.profiles(id),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  role_name text not null,
  action text not null,
  related_record text,
  previous_value text,
  new_value text,
  occurred_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.districts enable row level security;
alter table public.ministries enable row level security;
alter table public.activities enable row level security;
alter table public.fund_releases enable row level security;
alter table public.expenses enable row level security;
alter table public.invoice_attachments enable row level security;
alter table public.ai_extracted_invoice_data enable row level security;
alter table public.liquidation_reports enable row level security;
alter table public.approvals enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "authenticated users can read portal data" on public.activities for select to authenticated using (true);
create policy "authenticated users can create activities" on public.activities for insert to authenticated with check (true);
create policy "authenticated users can read expenses" on public.expenses for select to authenticated using (true);
create policy "authenticated users can create expenses" on public.expenses for insert to authenticated with check (true);
create policy "authenticated users can update expense status" on public.expenses for update to authenticated using (true) with check (true);
create policy "authenticated users can read fund releases" on public.fund_releases for select to authenticated using (true);
create policy "authenticated users can create fund releases" on public.fund_releases for insert to authenticated with check (true);
create policy "authenticated users can read liquidation reports" on public.liquidation_reports for select to authenticated using (true);
create policy "authenticated users can create liquidation reports" on public.liquidation_reports for insert to authenticated with check (true);
create policy "authenticated users can read audit logs" on public.audit_logs for select to authenticated using (true);
create policy "authenticated users can create audit logs" on public.audit_logs for insert to authenticated with check (true);

