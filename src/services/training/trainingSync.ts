"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Cloud sync for the training side of the app (splits, the active AI
 * program, custom exercises) - one row per hunter in `training_state`, one
 * column per concern so pushing splits can never clobber program/
 * custom_exercises written independently. Mirrors questSync.ts's pattern
 * (getCurrentUserId there, reused by every local-first hook) but split into
 * three explicit pairs rather than one generic helper, matching how the
 * rest of this codebase prefers named Supabase calls over dynamic column
 * access.
 */

export async function pullSplits(userId: string): Promise<{ splits: unknown[]; updatedAt: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("training_state")
      .select("splits, splits_updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data || !data.splits || !data.splits_updated_at) return null;
    return { splits: data.splits, updatedAt: data.splits_updated_at };
  } catch {
    return null;
  }
}

export async function pushSplits(userId: string, splits: unknown[], updatedAt: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("training_state").upsert({ user_id: userId, splits, splits_updated_at: updatedAt });
  } catch {
    // Offline or unreachable - the next successful save will catch up.
  }
}

export async function pullProgram(userId: string): Promise<{ program: Record<string, unknown>; updatedAt: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("training_state")
      .select("program, program_updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data || !data.program || !data.program_updated_at) return null;
    return { program: data.program, updatedAt: data.program_updated_at };
  } catch {
    return null;
  }
}

export async function pushProgram(userId: string, program: Record<string, unknown> | null, updatedAt: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("training_state").upsert({ user_id: userId, program, program_updated_at: updatedAt });
  } catch {
    // Offline or unreachable - the next successful save will catch up.
  }
}

export async function pullCustomExercises(userId: string): Promise<{ exercises: unknown[]; updatedAt: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("training_state")
      .select("custom_exercises, custom_exercises_updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data || !data.custom_exercises || !data.custom_exercises_updated_at) return null;
    return { exercises: data.custom_exercises, updatedAt: data.custom_exercises_updated_at };
  } catch {
    return null;
  }
}

export async function pushCustomExercises(userId: string, exercises: unknown[], updatedAt: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("training_state").upsert({ user_id: userId, custom_exercises: exercises, custom_exercises_updated_at: updatedAt });
  } catch {
    // Offline or unreachable - the next successful save will catch up.
  }
}

export async function pullAdaptiveState(userId: string): Promise<{ state: Record<string, unknown>; updatedAt: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("training_state")
      .select("adaptive_state, adaptive_state_updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data || !data.adaptive_state || !data.adaptive_state_updated_at) return null;
    return { state: data.adaptive_state, updatedAt: data.adaptive_state_updated_at };
  } catch {
    return null;
  }
}

export async function pushAdaptiveState(userId: string, state: Record<string, unknown>, updatedAt: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("training_state").upsert({ user_id: userId, adaptive_state: state, adaptive_state_updated_at: updatedAt });
  } catch {
    // Offline or unreachable - the next successful save will catch up.
  }
}
