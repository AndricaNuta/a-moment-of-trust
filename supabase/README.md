# Supabase migrations

Rulează migrațiile în ordine în **Supabase Dashboard → SQL Editor**:

1. `001_letters.sql` – tabelul `letters` și RLS
2. `002_storage_letter_attachments.sql` – bucket pentru atașamente
3. `003_letter_image_urls.sql` – coloana `image_urls`
4. `004_letters_private_and_consent.sql` – coloanele `is_private`, `promo_consent`
5. `005_letter_video_url.sql` – coloana `video_url` (pentru video atașat la scrisori)
6. `006_backfill_video_url.sql` – populează `video_url` pentru scrisorile care au deja video în storage
7. `007_letter_audio_video_urls.sql` – coloanele `audio_urls` și `video_urls` (pentru mai multe audio/video per scrisoare)

**Video nu apare pe peretele amintirilor?**
1. Rulează `005_letter_video_url.sql` dacă nu ai făcut-o.
2. Rulează `006_backfill_video_url.sql` – actualizează scrisorile existente care au video în storage. Schimbă `project_ref` în script dacă folosești alt proiect Supabase.
3. Reîncarcă pagina (sau fă refresh forțat: Cmd+Shift+R / Ctrl+Shift+R).

**Se salvează doar prima poză/video/audio în loc de toate?**
Rulează migrațiile `003_letter_image_urls.sql` și `007_letter_audio_video_urls.sql` – adaugă coloanele pentru array-uri (image_urls, audio_urls, video_urls). Fără ele, se salvează doar primul atașament de fiecare tip.
