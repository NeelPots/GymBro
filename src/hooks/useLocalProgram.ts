"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUserId } from "@/services/gamification/questSync";
import { pullProgram, pushProgram } from "@/services/training/trainingSync";
import type { ExperienceLevel, GeneratedProgramExercise, GoalType } from "@/services/ai/types";

const STORAGE_KEY = "adaptive-coach-program-v1";
const CLOUD_PUSH_DEBOUNCE_MS = 800;
/** Caps how long the initial load waits on a cloud pull before falling back to local state, so a slow/offline network can't hang the app. */
const CLOUD_PULL_TIMEOUT_MS = 6_000;

export interface LocalProgram {
  title: string;
  rationale: string;
  goalType: GoalType;
  customPrompt?: string;
  experienceLevel?: ExperienceLevel;
  sessionsPerWeek?: number;
  createdAt: string;
  exercises: GeneratedProgramExercise[];
}

function loadProgram(): LocalProgram | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalProgram;
  } catch {
    return null;
  }
}

/**
 * Generated programs live in localStorage - this keeps the AI builder
 * usable without requiring sign-in, matching the local/Supabase dual-mode
 * pattern the rest of the app follows - and (when signed in) mirror to the
 * `training_state` table so the same program follows you to another
 * device. There's only ever one active program, so unlike routines/splits
 * there's nothing to union: whichever copy (local or cloud) has the newer
 * `createdAt` wins, since a freshly-generated program is meant to replace
 * the old one, not merge with it. Denormalized exercise data (name,
 * category) is looked up from the exercise list at render time rather
 * than duplicated here, so it can't go stale.
 */
export function useLocalProgram() {
  const [program, setProgram] = useState<LocalProgram | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const local = loadProgram();
      if (cancelled) return;

      if (!isSupabaseConfigured) {
        setProgram(local);
        return;
      }
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setProgram(local);
        return;
      }

      // Wait for the cloud pull (bounded by a timeout so a slow/offline
      // network can't hang the app) before showing anything as "loaded" -
      // same fix as the quest hook, so a program generated on another
      // device isn't briefly (or, on a flaky connection, not at all)
      // missing here.
      const cloud = await Promise.race([
        pullProgram(userId),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), CLOUD_PULL_TIMEOUT_MS)),
      ]);
      if (cancelled) return;
      if (!cloud) {
        setProgram(local);
        return;
      }

      try {
        const cloudProgram = cloud.program as unknown as LocalProgram;
        if (!local || new Date(cloudProgram.createdAt).getTime() > new Date(local.createdAt).getTime()) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProgram));
          if (!cancelled) setProgram(cloudProgram);
        } else {
          if (!cancelled) setProgram(local);
        }
      } catch (error) {
        console.error("Failed to merge cloud program, keeping local state:", error);
        if (!cancelled) setProgram(local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Re-sync from the cloud whenever the tab/app regains focus, so a program
  // generated on another device shows up here without needing a reload.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function resync() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const cloud = await pullProgram(userId);
      if (!cloud) return;
      try {
        const cloudProgram = cloud.program as unknown as LocalProgram;
        setProgram((prev) => {
          if (prev !== undefined && prev !== null && new Date(prev.createdAt).getTime() >= new Date(cloudProgram.createdAt).getTime()) {
            return prev;
          }
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProgram));
          return cloudProgram;
        });
      } catch (error) {
        console.error("Failed to merge cloud program on refocus, keeping current state:", error);
      }
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
    if (program === undefined || !isSupabaseConfigured) return;
    const id = setTimeout(() => {
      void (async () => {
        const userId = await getCurrentUserId();
        if (!userId) return;
        await pushProgram(userId, program as unknown as Record<string, unknown> | null, new Date().toISOString());
      })();
    }, CLOUD_PUSH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [program]);

  const saveProgram = useCallback((next: LocalProgram) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProgram(next);
  }, []);

  const clearProgram = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setProgram(null);
  }, []);

  return {
    program: program ?? null,
    isLoading: program === undefined,
    saveProgram,
    clearProgram,
  };
}
