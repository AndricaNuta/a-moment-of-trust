import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars missing (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Letters will not be persisted."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type LetterRow = {
  id: string;
  author: string;
  content: string;
  image_url: string | null;
  image_urls?: string[] | null;
  audio_url: string | null;
  is_private?: boolean;
  promo_consent?: boolean;
  created_at: string;
};
