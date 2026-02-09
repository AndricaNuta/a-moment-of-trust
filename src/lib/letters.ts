import { supabase, type LetterRow } from "./supabase";

const BUCKET = "letter-attachments";

function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1].trim() : "application/octet-stream";
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "audio/webm": "webm",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/ogg": "ogg",
  };
  const ext = extMap[mime] ?? "bin";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), ext };
}

async function uploadDataUrl(
  path: string,
  dataUrl: string
): Promise<string | null> {
  if (!supabase) return null;
  const { blob, ext } = dataUrlToBlob(dataUrl);
  const fullPath = `${path}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(fullPath, blob, {
    contentType: blob.type,
    upsert: false,
  });
  if (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
  return publicUrl;
}

export type LetterInput = {
  author: string;
  content: string;
  images?: string[];
  audio?: string;
  isPrivate?: boolean;
  promoConsent: boolean;
};

export type SubmitLetterResult =
  | { ok: true; row: LetterRow }
  | { ok: false; error: string };

export async function submitLetter(input: LetterInput): Promise<SubmitLetterResult> {
  if (!supabase) {
    return {
      ok: false,
      error: "Serviciul de scrisori nu este configurat. Verifică setările proiectului.",
    };
  }

  const id = crypto.randomUUID();
  const imageUrls: string[] = [];
  if (input.images?.length) {
    for (let i = 0; i < input.images.length; i++) {
      const url = await uploadDataUrl(`images/${id}_${i}`, input.images[i]);
      if (url) imageUrls.push(url);
    }
  }
  let audioUrl: string | null = null;
  if (input.audio) {
    audioUrl = await uploadDataUrl(`audio/${id}`, input.audio);
  }

  const rowFull = {
    id,
    author: input.author || "cineva care își amintește",
    content: input.content,
    image_url: imageUrls[0] ?? null,
    audio_url: audioUrl,
    is_private: input.isPrivate ?? false,
    promo_consent: input.promoConsent,
  };

  const rowLegacy = {
    id,
    author: rowFull.author,
    content: rowFull.content,
    image_url: rowFull.image_url,
    audio_url: rowFull.audio_url,
  };

  const { data, error } = await supabase
    .from("letters")
    .insert(rowFull)
    .select("id, author, content, image_url, audio_url, is_private, promo_consent, created_at")
    .single();

  if (error) {
    const isMissingColumn =
      /is_private|promo_consent|schema cache|column.*does not exist/i.test(error.message);
    if (isMissingColumn) {
      const { data: legacyData, error: legacyError } = await supabase
        .from("letters")
        .insert(rowLegacy)
        .select("id, author, content, image_url, audio_url, created_at")
        .single();
      if (legacyError) {
        console.error("Supabase insert error (legacy):", legacyError);
        return {
          ok: false,
          error: legacyError.message || "Nu s-a putut salva scrisoarea. Încearcă din nou.",
        };
      }
      return {
        ok: true,
        row: { ...(legacyData as LetterRow), is_private: false, promo_consent: false },
      };
    }
    console.error("Supabase insert error:", error);
    return {
      ok: false,
      error: error.message || "Nu s-a putut salva scrisoarea. Încearcă din nou.",
    };
  }
  return { ok: true, row: data as LetterRow };
}

export async function fetchLetters(): Promise<LetterRow[]> {
  if (!supabase) return [];
  // Try with new columns (is_private, promo_consent) — requires migration 004
  const { data, error } = await supabase
    .from("letters")
    .select("id, author, content, image_url, audio_url, is_private, promo_consent, created_at")
    .eq("is_private", false)
    .order("created_at", { ascending: false });
  if (!error && data != null) return data as LetterRow[];
  // Fallback: table may not have is_private yet (migration 004 not run) — fetch all letters
  if (error) console.warn("Supabase fetch (new schema) failed, trying legacy:", error.message);
  const { data: legacyData, error: legacyError } = await supabase
    .from("letters")
    .select("id, author, content, image_url, audio_url, created_at")
    .order("created_at", { ascending: false });
  if (legacyError) {
    console.error("Supabase fetch letters error:", legacyError);
    return [];
  }
  return (legacyData ?? []) as LetterRow[];
}

export function letterRowToLetter(row: LetterRow): {
  id: string;
  author: string;
  content: string;
  images: string[];
  audio?: string;
  isPrivate?: boolean;
  createdAt: Date;
} {
  const images =
    Array.isArray(row.image_urls) && row.image_urls.length > 0
      ? row.image_urls
      : row.image_url
        ? [row.image_url]
        : [];
  return {
    id: row.id,
    author: row.author,
    content: row.content,
    images,
    ...(row.audio_url && { audio: row.audio_url }),
    ...(row.is_private && { isPrivate: true }),
    createdAt: new Date(row.created_at),
  };
}
