-- Aggregate page views (and other high-volume events) into daily counters
-- instead of one row per event. One row per day per event_type.

create table if not exists public.analytics_daily (
  date date not null,
  event_type text not null,
  count int not null default 0,
  primary key (date, event_type)
);

alter table public.analytics_daily enable row level security;

-- No direct public access; RPC (security definer) handles increments
create policy "No public read on analytics daily"
  on public.analytics_daily for select
  using (false);

-- RPC to atomically increment a daily counter (used for page_view, etc.)
create or replace function public.increment_analytics(p_event_type text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into analytics_daily (date, event_type, count)
  values (current_date, p_event_type, 1)
  on conflict (date, event_type) do update
  set count = analytics_daily.count + 1;
end;
$$;

grant execute on function public.increment_analytics(text) to anon;
grant execute on function public.increment_analytics(text) to authenticated;

-- Backfill: aggregate existing page_view events from analytics_events into analytics_daily
insert into analytics_daily (date, event_type, count)
select
  created_at::date as date,
  event_type,
  count(*)::int as count
from public.analytics_events
where event_type = 'page_view'
group by created_at::date, event_type
on conflict (date, event_type) do update
set count = analytics_daily.count + excluded.count;
