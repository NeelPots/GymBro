"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUserId } from "@/services/gamification/questSync";
import { pullCustomExercises, pushCustomExercises } from "@/services/training/trainingSync";
import type { Exercise } from "@/lib/types/domain";

const STORAGE_KEY = "adaptive-coach-custom-exercises-v1";
const CLOUD_PUSH_DEBOUNCE_MS = 800;
/** Caps how long the initial load waits on a cloud pull before falling back to local state, so a slow/offline network can't hang the app. */
const CLOUD_PULL_TIMEOUT_MS = 6_000;

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

      if (!isSupabaseConfigured) {
        setExercises(local);
        return;
      }
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setExercises(local);
        return;
      }

      // Wait for the cloud pull (bounded by a timeout so a slow/offline
      // network can't hang the app) before showing anything as "loaded" -
      // same fix as the quest hook, so a custom exercise added on another
      // device isn't briefly (or, on a flaky connection, not at all)
      // missing here (and, worse, silently overwritten by a push of this
      // device's incomplete list before the cloud copy arrived).
      const cloud = await Promise.race([
        pullCustomExercises(userId),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), CLOUD_PULL_TIMEOUT_MS)),
      ]);
      if (cancelled) return;
      if (!cloud) {
        setExercises(local);
        return;
      }

      try {
        const cloudExercises = cloud.exercises as Exercise[];
        const merged = mergeExercises(local, cloudExercises);
        saveCustomExercises(merged);
        if (!cancelled) setExercises(merged);
      } catch (error) {
        console.error("Failed to merge cloud custom exercises, keeping local state:", error);
        if (!cancelled) setExercises(local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Re-sync from the cloud whenever the tab/app regains focus, so a custom
  // exercise added on another device shows up here without needing a
  // reload. Also re-pushes the (now-merged) state afterward - the debounced
  // push effect below only fires on a local change, so if an earlier push
  // silently failed (offline, a table that didn't exist yet, etc.) and
  // nothing local has changed since, it would otherwise never retry.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function resync() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const cloud = await pullCustomExercises(userId);
      let toPush: Exercise[] | null = null;
      setExercises((prev) => {
        if (prev === undefined) return prev;
        if (!cloud) {
          toPush = prev;
          return prev;
        }
        try {
          const cloudExercises = cloud.exercises as Exercise[];
          const merged = mergeExercises(prev, cloudExercises);
          saveCustomExercises(merged);
          toPush = merged;
          return merged;
        } catch (error) {
          console.error("Failed to merge cloud custom exercises on refocus, keeping current state:", error);
          toPush = prev;
          return prev;
        }
      });
      if (toPush) await pushCustomExercises(userId, toPush, new Date().toISOString());
    }

    function onVisible() {
      if (document.visibilityState === "visible") void resync();
    }
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
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
