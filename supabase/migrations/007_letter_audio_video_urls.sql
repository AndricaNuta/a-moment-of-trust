-- Multiple audio and video attachments per letter
alter table public.letters
  add column if not exists audio_urls jsonb default '[]'::jsonb,
  add column if not exists video_urls jsonb default '[]'::jsonb;

comment on column public.letters.audio_urls is 'Array of storage URLs for attached audio files.';
comment on column public.letters.video_urls is 'Array of storage URLs for attached videos.';
