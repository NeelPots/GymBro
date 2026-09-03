"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUserId } from "@/services/gamification/questSync";
import { pullCustomExercises, pushCustomExercises } from "@/services/training/trainingSync";
import type { Exercise } from "@/lib/types/domain";

const STORAGE_KEY = "adaptive-coach-custom-exercises-v1";
const CLOUD_PUSH_DEBOUNCE_MS = 1_500;

function loadCustomExercises(): Exercise[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Exercise[];
  } catch {
    return [];
  }
}

function saveCustomExercises(exercises: Exercise[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
}

/** Union by id so an exercise created on one device is never discarded by a sync from another. */
function mergeExercises(a: Exercise[], b: Exercise[]): Exercise[] {
  const byId = new Map<string, Exercise>();
  for (const e of a) byId.set(e.id, e);
  for (const e of b) if (!byId.has(e.id)) byId.set(e.id, e);
  return [...byId.values()];
}

/**
 * Exercises the user typed in themselves while building a split, because
 * the library didn't have what they wanted. Local-first like the rest of
 * this app's state (useLocalSplit, useLocalProgram) so it works with no
 * account, and (when signed in) unioned with whatever's synced to the
 * `training_state` table so a custom exercise added on one device shows up
 * on another instead of only ever mirroring one-way to Supabase.
 */
export function useLocalCustomExercises() {
  const [exercises, setExercises] = useState<Exercise[] | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const local = loadCustomExercises();
      if (cancelled) return;
      setExercises(local);

      if (!isSupabaseConfigured) return;
      const userId = await getCurrentUserId();
      if (!userId || cancelled) return;

      const cloud = await pullCustomExercises(userId);
      if (!cloud || cancelled) return;

      try {
        const cloudExercises = cloud.exercises as Exercise[];
        const merged = mergeExercises(local, cloudExercises);
        saveCustomExercises(merged);
        if (!cancelled) setExercises(merged);
      } catch (error) {
        console.error("Failed to merge cloud custom exercises, keeping local state:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (exercises === undefined || !isSupabaseConfigured) return;
    const id = setTimeout(() => {
      void (async () => {
        const userId = await getCurrentUserId();
        if (!userId) return;
        await pushCustomExercises(userId, exercises, new Date().toISOString());
      })();
    }, CLOUD_PUSH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [exercises]);

  const addCustomExercise = useCallback((exercise: Exercise) => {
    setExercises((prev) => {
      const next = [...(prev ?? []), exercise];
      saveCustomExercises(next);
      return next;
    });
  }, []);

  return {
    customExercises: exercises ?? [],
    isLoading: exercises === undefined,
    addCustomExercise,
  };
}
