"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "adaptive-coach-split-v1";

export interface SplitExercise {
  exerciseId: string;
  orderIndex: number;
  targetReps: number;
  targetSets: number;
}

export interface SplitDay {
  id: string;
  name: string;
  exercises: SplitExercise[];
  createdAt: string;
}

interface LocalSplitState {
  days: SplitDay[];
  activeDayId: string | null;
}

const EMPTY_STATE: LocalSplitState = { days: [], activeDayId: null };

function loadSplit(): LocalSplitState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_STATE;
  try {
    return JSON.parse(raw) as LocalSplitState;
  } catch {
    return EMPTY_STATE;
  }
}

function saveSplit(state: LocalSplitState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * User-authored workout splits (e.g. "Push Day", "Pull Day") - stored in
 * localStorage alongside useLocalProgram, same dual-mode pattern as the rest
 * of the app. Activating a day only updates activeDayId here; whether a
 * split or an AI program actually drives Home is decided by the separate
 * planSource pointer (see useActivePlanSource) so both can be saved at once
 * without one silently overriding the other.
 */
export function useLocalSplit() {
  const [split, setSplit] = useState<LocalSplitState | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSplit(loadSplit());
  }, []);

  const createDay = useCallback((name: string, exercises: SplitExercise[]) => {
    setSplit((prev) => {
      const base = prev ?? EMPTY_STATE;
      const day: SplitDay = {
        id: crypto.randomUUID(),
        name,
        exercises,
        createdAt: new Date().toISOString(),
      };
      const next = { ...base, days: [...base.days, day] };
      saveSplit(next);
      return next;
    });
  }, []);

  const updateDay = useCallback((dayId: string, name: string, exercises: SplitExercise[]) => {
    setSplit((prev) => {
      const base = prev ?? EMPTY_STATE;
      const next = {
        ...base,
        days: base.days.map((d) => (d.id === dayId ? { ...d, name, exercises } : d)),
      };
      saveSplit(next);
      return next;
    });
  }, []);

  const deleteDay = useCallback((dayId: string) => {
    setSplit((prev) => {
      const base = prev ?? EMPTY_STATE;
      const next = {
        days: base.days.filter((d) => d.id !== dayId),
        activeDayId: base.activeDayId === dayId ? null : base.activeDayId,
      };
      saveSplit(next);
      return next;
    });
  }, []);

  const activateDay = useCallback((dayId: string) => {
    setSplit((prev) => {
      const base = prev ?? EMPTY_STATE;
      const next = { ...base, activeDayId: dayId };
      saveSplit(next);
      return next;
    });
  }, []);

  return {
    days: split?.days ?? [],
    activeDayId: split?.activeDayId ?? null,
    isLoading: split === undefined,
    createDay,
    updateDay,
    deleteDay,
    activateDay,
  };
}
