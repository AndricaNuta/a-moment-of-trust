import { supabase } from "./supabase";

export type AnalyticsEvent =
  | { event_type: "page_view" }
  | { event_type: "letter_opened"; letter_id: string; from_share_link?: boolean }
  | {
      event_type: "letter_shared";
      letter_id: string;
      platform: "facebook" | "twitter" | "linkedin" | "whatsapp" | "copy_link";
    }
  | { event_type: "letter_submitted"; letter_id: string }
  | { event_type: "donation_clicked"; button: "doneaza" | "3,5" }
  | { event_type: "write_letter_clicked" };

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  if (!supabase) return;

  // High-volume events: aggregate into daily counters (one row per day, not per event)
  if (event.event_type === "page_view") {
    await supabase.rpc("increment_analytics", { p_event_type: "page_view" });
    return;
  }

  // Lower-volume events: keep one row per event (letter_id, platform, etc. matter)
  const payload: Record<string, unknown> = {};
  if ("letter_id" in event && event.letter_id) payload.letter_id = event.letter_id;
  if ("from_share_link" in event && event.from_share_link)
    payload.from_share_link = event.from_share_link;
  if ("platform" in event && event.platform) payload.platform = event.platform;
  if ("button" in event && event.button) payload.button = event.button;

  await supabase.from("analytics_events").insert({
    event_type: event.event_type,
    payload,
  });
}
