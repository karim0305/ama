import { HistoryEntry } from "../Storage/LocalStorage";
import { isSupabaseConfigured, supabase } from "./client";

/**
 * Pushes a local history entry to Supabase, if configured.
 * Fails silently on any error — cloud sync is a bonus, never a
 * blocker for core functionality (per Phase 0/11 requirements).
 */
export async function syncHistoryEntry(entry: HistoryEntry): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return; // not signed in — skip silently

    await supabase.from("command_history").insert({
      user_id: userId,
      raw_text: entry.rawText,
      intent: entry.intent,
      success: entry.success,
      message: entry.message,
      created_at: entry.createdAt,
    });
  } catch (e) {
    // Silently ignore — no internet, RLS issue, etc. Local storage
    // already has the record, so nothing is lost.
    console.log("Supabase sync skipped:", e);
  }
}

export async function fetchCustomAliases(): Promise<Record<
  string,
  string
> | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return null;

    const { data, error } = await supabase
      .from("custom_app_aliases")
      .select("alias, package_name")
      .eq("user_id", userId);

    if (error || !data) return null;

    const map: Record<string, string> = {};
    for (const row of data) {
      map[row.alias] = row.package_name;
    }
    return map;
  } catch {
    return null;
  }
}
