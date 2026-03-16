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
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
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
  audios?: string[];
  videos?: string[];
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
  const audioUrls: string[] = [];
  if (input.audios?.length) {
    for (let i = 0; i < input.audios.length; i++) {
      const url = await uploadDataUrl(`audio/${id}_${i}`, input.audios[i]);
      if (url) audioUrls.push(url);
    }
  }
  const videoUrls: string[] = [];
  if (input.videos?.length) {
    for (let i = 0; i < input.videos.length; i++) {
      const url = await uploadDataUrl(`video/${id}_${i}`, input.videos[i]);
      if (url) videoUrls.push(url);
    }
  }

  const rowFull = {
    id,
    author: input.author || "cineva care își amintește",
    content: input.content,
    image_url: imageUrls[0] ?? null,
    image_urls: imageUrls.length ? imageUrls : null,
    audio_url: audioUrls[0] ?? null,
    audio_urls: audioUrls.length ? audioUrls : null,
    video_url: videoUrls[0] ?? null,
    video_urls: videoUrls.length ? videoUrls : null,
    is_private: input.isPrivate ?? false,
    promo_consent: input.promoConsent,
  };

  const rowWithMedia = {
    id,
    author: rowFull.author,
    content: rowFull.content,
    image_url: imageUrls[0] ?? null,
    image_urls: imageUrls.length ? imageUrls : null,
    audio_url: audioUrls[0] ?? null,
    audio_urls: audioUrls.length ? audioUrls : null,
    video_url: videoUrls[0] ?? null,
    video_urls: videoUrls.length ? videoUrls : null,
  };

  const rowWithAudioVideoArrays = {
    id,
    author: rowFull.author,
    content: rowFull.content,
    image_url: imageUrls[0] ?? null,
    audio_url: audioUrls[0] ?? null,
    audio_urls: audioUrls.length ? audioUrls : null,
    video_url: videoUrls[0] ?? null,
    video_urls: videoUrls.length ? videoUrls : null,
  };

  const rowWithVideo = {
    id,
    author: rowFull.author,
    content: rowFull.content,
    image_url: imageUrls[0] ?? null,
    audio_url: audioUrls[0] ?? null,
    video_url: videoUrls[0] ?? null,
  };

  const rowLegacy = {
    id,
    author: rowFull.author,
    content: rowFull.content,
    image_url: imageUrls[0] ?? null,
    audio_url: audioUrls[0] ?? null,
  };

  const { data, error } = await supabase
    .from("letters")
    .insert(rowFull)
    .select("id, author, content, image_url, image_urls, audio_url, audio_urls, video_url, video_urls, is_private, promo_consent, created_at")
    .single();

  if (error) {
    const isMissingColumn =
      /is_private|promo_consent|video_url|video_urls|audio_urls|image_urls|schema cache|column.*does not exist/i.test(error.message);
    if (isMissingColumn) {
      // 2. Try with video_url and image_urls (no is_private/promo_consent) — in case only those columns are missing
      const { data: mediaData, error: mediaError } = await supabase
        .from("letters")
        .insert(rowWithMedia)
        .select("id, author, content, image_url, image_urls, audio_url, audio_urls, video_url, video_urls, created_at")
        .single();
      if (!mediaError && mediaData != null) {
        return {
          ok: true,
          row: { ...(mediaData as LetterRow), is_private: false, promo_consent: false },
        };
      }
      // 3. Try with audio_urls, video_urls (no image_urls) — schema has arrays but not image_urls
      const { data: avData, error: avError } = await supabase
        .from("letters")
        .insert(rowWithAudioVideoArrays)
        .select("id, author, content, image_url, audio_url, audio_urls, video_url, video_urls, created_at")
        .single();
      if (!avError && avData != null) {
        return {
          ok: true,
          row: {
            ...(avData as LetterRow),
            is_private: false,
            promo_consent: false,
            image_urls: imageUrls.length ? imageUrls : null,
          },
        };
      }
      // 4. Try with video_url only (no arrays) — schema has video_url but not audio_urls/video_urls
      const { data: videoData, error: videoError } = await supabase
        .from("letters")
        .insert(rowWithVideo)
        .select("id, author, content, image_url, audio_url, video_url, created_at")
        .single();
      if (!videoError && videoData != null) {
        return {
          ok: true,
          row: {
            ...(videoData as LetterRow),
            is_private: false,
            promo_consent: false,
            image_urls: imageUrls.length ? imageUrls : null,
            audio_urls: audioUrls.length ? audioUrls : null,
            video_urls: videoUrls.length ? videoUrls : null,
          },
        };
      }
      // 5. Fallback: minimal schema (no video_url, no image_urls)
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
        row: { ...(legacyData as LetterRow), is_private: false, promo_consent: false, video_url: null, image_urls: null },
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

  // 1. Try full schema (migrations 003, 004, 005)
  const { data, error } = await supabase
    .from("letters")
    .select("id, author, content, image_url, image_urls, audio_url, audio_urls, video_url, video_urls, is_private, promo_consent, created_at")
    .eq("is_private", false)
    .order("created_at", { ascending: false });
  if (!error && data != null) return data as LetterRow[];

  // 2. Fallback: maybe is_private column missing — fetch all without filter, with video_url and image_urls
  if (error) console.warn("Supabase fetch (full schema) failed, trying without is_private filter:", error.message);
  const { data: dataWithVideo, error: err2 } = await supabase
    .from("letters")
    .select("id, author, content, image_url, image_urls, audio_url, audio_urls, video_url, video_urls, created_at")
    .order("created_at", { ascending: false });
  if (!err2 && dataWithVideo != null) return dataWithVideo as LetterRow[];

  // 3. Fallback: image_urls column missing but video_url exists — select video_url without image_urls
  if (err2) console.warn("Supabase fetch (with video) failed, trying without image_urls:", err2.message);
  const { data: dataVideoOnly, error: err3 } = await supabase
    .from("letters")
    .select("id, author, content, image_url, audio_url, video_url, created_at")
    .order("created_at", { ascending: false });
  if (!err3 && dataVideoOnly != null) return dataVideoOnly as LetterRow[];

  // 4. Fallback: video_url column missing — minimal schema
  if (err3) console.warn("Supabase fetch (with video_url) failed, trying legacy:", err3.message);
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
  audios?: string[];
  videos?: string[];
  isPrivate?: boolean;
  createdAt: Date;
} {
  const images =
    Array.isArray(row.image_urls) && row.image_urls.length > 0
      ? row.image_urls
      : row.image_url
        ? [row.image_url]
        : [];
  const audios =
    Array.isArray(row.audio_urls) && row.audio_urls.length > 0
      ? row.audio_urls
      : row.audio_url
        ? [row.audio_url]
        : [];
  const videos =
    Array.isArray(row.video_urls) && row.video_urls.length > 0
      ? row.video_urls
      : row.video_url
        ? [row.video_url]
        : [];
  return {
    id: row.id,
    author: row.author,
    content: row.content,
    images,
    ...(audios.length > 0 && { audios }),
    ...(videos.length > 0 && { videos }),
    ...(row.is_private && { isPrivate: true }),
    createdAt: new Date(row.created_at),
  };
}
