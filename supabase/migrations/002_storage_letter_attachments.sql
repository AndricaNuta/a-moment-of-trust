-- Create a public bucket for letter images and audio (so URLs work without auth)
insert into storage.buckets (id, name, public)
values ('letter-attachments', 'letter-attachments', true)
on conflict (id) do update set public = true;

-- Drop existing policies so this migration is safe to re-run
drop policy if exists "Anon can upload letter attachments" on storage.objects;
drop policy if exists "Public can read letter attachments" on storage.objects;

-- Anon can upload (INSERT) into this bucket
create policy "Anon can upload letter attachments"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'letter-attachments');

-- Anyone can read (SELECT) from this bucket (public URLs)
create policy "Public can read letter attachments"
  on storage.objects for select
  to anon
  using (bucket_id = 'letter-attachments');
