-- Support multiple images per letter (keep image_url for backward compatibility)
alter table public.letters
  add column if not exists image_urls jsonb default '[]'::jsonb;

comment on column public.letters.image_urls is 'Array of storage URLs for attached images';