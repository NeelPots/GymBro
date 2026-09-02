"use client";

import { useCallback, useEffect, useState } from "react";
import type { Exercise } from "@/lib/types/domain";

const STORAGE_KEY = "adaptive-coach-custom-exercises-v1";

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

/**
 * Exercises the user typed in themselves while building a split, because
 * the library didn't have what they wanted. Local-first like the rest of
 * this app's state (useLocalSplit, useLocalProgram) so it works with no
 * account - submitExercise.ts separately best-effort mirrors these to
 * Supabase when signed in, but this local copy is the one every split day
 * and picker actually reads from, so it's never gated on auth.
 */
export function useLocalCustomExercises() {
  const [exercises, setExercises] = useState<Exercise[] | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExercises(loadCustomExercises());
  }, []);

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
