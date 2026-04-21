-- Joner Session Planner, single sessions table, public read + insert, no auth.
-- Apply in Supabase SQL editor or via the Supabase CLI.

create extension if not exists "pgcrypto";

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  prompt text,
  title text,
  objective text,
  blocks jsonb,
  total_duration int,
  created_at timestamptz default now()
);

alter table sessions enable row level security;

drop policy if exists "public read" on sessions;
create policy "public read" on sessions for select using (true);

drop policy if exists "public insert" on sessions;
create policy "public insert" on sessions for insert with check (true);
