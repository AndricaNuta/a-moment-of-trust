-- Backfill video_url for letters that have video in storage but video_url is null.
-- Rulează în SQL Editor după 005. Înlocuiește YOUR_PROJECT_REF cu project reference-ul tău (din URL-ul Supabase).
-- Exemplu: https://YOUR_PROJECT_REF.supabase.co → YOUR_PROJECT_REF

do $$
declare
  project_ref text := 'waqyaewaldphstmiobjj'; -- schimbă dacă e alt proiect
  base_url text;
begin
  base_url := 'https://' || project_ref || '.supabase.co/storage/v1/object/public/letter-attachments/';
  update public.letters l
  set video_url = base_url || s.name
  from storage.objects s
  where s.bucket_id = 'letter-attachments'
    and s.name like 'video/' || l.id::text || '.%'
    and (l.video_url is null or l.video_url = '');
end $$;
