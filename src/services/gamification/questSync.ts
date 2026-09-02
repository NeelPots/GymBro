"use client";

import { createClient } from "@/lib/supabase/client";

/** Returns the signed-in user's id, or null if signed out / unreachable. Never throws. */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

/** Pulls the hunter's cloud state. Returns null if there's none yet or the call fails. */
export async function pullQuestState(userId: string): Promise<{ state: unknown; updatedAt: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hunter_state")
      .select("state, updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return { state: data.state, updatedAt: data.updated_at };
  } catch {
    return null;
  }
}

/** Upserts the hunter's full state blob. Fails silently - localStorage remains the source of truth. */
export async function pushQuestState(userId: string, state: unknown, updatedAt: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase
      .from("hunter_state")
      .upsert({ user_id: userId, state: state as Record<string, unknown>, updated_at: updatedAt });
  } catch {
    // Offline or unreachable - the next successful save will catch up.
  }
}
