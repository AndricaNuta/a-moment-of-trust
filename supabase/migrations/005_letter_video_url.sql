-- Video attachment support for letters
alter table public.letters
  add column if not exists video_url text;

comment on column public.letters.video_url is 'Supabase Storage public URL for attached video.';
