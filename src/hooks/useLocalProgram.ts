"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExperienceLevel, GeneratedProgramExercise, GoalType } from "@/services/ai/types";

const STORAGE_KEY = "adaptive-coach-program-v1";

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
 * Generated programs live in localStorage, not Supabase - this keeps the AI
 * builder usable without requiring sign-in, matching the local/Supabase
 * dual-mode pattern the rest of the app already follows (see
 * services/movements/getExercises.ts). Denormalized exercise data (name,
 * category) is looked up from the exercise list at render time rather than
 * duplicated here, so it can't go stale.
 */
export function useLocalProgram() {
  const [program, setProgram] = useState<LocalProgram | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgram(loadProgram());
  }, []);

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
