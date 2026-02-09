-- Letters table for the "moment of trust" letter wall
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  author text not null default '',
  content text not null,
  image_url text,
  audio_url text,
  created_at timestamptz not null default now()
);

-- Allow anonymous read (so the wall can be public) and insert (so anyone can submit)
alter table public.letters enable row level security;

create policy "Anyone can read letters"
  on public.letters for select
  using (true);

create policy "Anyone can insert letters"
  on public.letters for insert
  with check (true);
