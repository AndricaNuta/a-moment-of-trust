-- Analytics events for page views, letter opens, shares, donations, etc.
-- Run this in Supabase Dashboard → SQL Editor if you haven't linked the project with `supabase link`

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_type_created
  on public.analytics_events (event_type, created_at desc);

alter table public.analytics_events enable row level security;

create policy "Anyone can insert analytics events"
  on public.analytics_events for insert
  with check (true);

create policy "No public read on analytics"
  on public.analytics_events for select
  using (false);
