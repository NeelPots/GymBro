"use client";

import { useCallback, useEffect, useState } from "react";
import { evaluateMovement, type MovementParams, type SessionEntry } from "@/lib/adaptive/engine";
import type { Exercise, SignalItem } from "@/lib/types/domain";

const STORAGE_KEY = "adaptive-coach-state-v2";

interface SessionLogEntry {
  date: string;
  exerciseId: string;
  avgRpe: number;
}

interface LocalState {
  movements: Record<string, MovementParams>;
  history: Record<string, SessionEntry[]>;
  sessionLog: SessionLogEntry[];
  lastSignal: SignalItem[];
  streak: number;
  weekCompletion: number;
}

function computeStreak(sessionLog: SessionLogEntry[]): number {
  const dates = [...new Set(sessionLog.map((s) => s.date))].sort().reverse();
  if (dates.length === 0) return 0;
  let count = 0;
  let cursor = new Date();
  for (const d of dates) {
    const diff = Math.round((cursor.getTime() - new Date(d).getTime()) / 86400000);
    if (diff > 1) break;
    count++;
    cursor = new Date(d);
  }
  return count;
}

function computeWeekCompletion(sessionLog: SessionLogEntry[]): number {
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = sessionLog.filter((s) => new Date(s.date).getTime() >= weekAgo);
  const uniqueDays = new Set(thisWeek.map((s) => s.date)).size;
  return Math.min(100, Math.round((uniqueDays / 6) * 100));
}

function withDerived(state: Omit<LocalState, "streak" | "weekCompletion">): LocalState {
  return {
    ...state,
    streak: computeStreak(state.sessionLog),
    weekCompletion: computeWeekCompletion(state.sessionLog),
  };
}

function defaultState(exercises: Exercise[]): LocalState {
  return withDerived({
    movements: Object.fromEntries(
      exercises.map((e) => [
        e.id,
        { reps: e.defaultReps, sets: e.defaultSets, difficultyTier: e.difficultyTier },
      ]),
    ),
    history: Object.fromEntries(exercises.map((e) => [e.id, []])),
    sessionLog: [],
    lastSignal: [],
  });
}

function loadState(exercises: Exercise[]): LocalState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as LocalState;
      // Merge in any exercises added to the library since last visit.
      for (const e of exercises) {
        if (!parsed.movements[e.id]) {
          parsed.movements[e.id] = {
            reps: e.defaultReps,
            sets: e.defaultSets,
            difficultyTier: e.difficultyTier,
          };
          parsed.history[e.id] = [];
        }
      }
      return withDerived(parsed);
    } catch {
      // fall through to default
    }
  }
  return defaultState(exercises);
}

function saveState(state: LocalState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useLocalAdaptiveState(exercises: Exercise[]) {
  const [state, setState] = useState<LocalState | null>(null);

  useEffect(() => {
    // localStorage isn't available during SSR, so the real state can only be
    // loaded after mount - this intentionally causes one extra client render
    // (the caller shows a skeleton via isLoading until then).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState(exercises));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logSession = useCallback(
    (exerciseId: string, completedReps: number, completedSets: number, rpe: number) => {
      setState((prev) => {
        if (!prev) return prev;
        const params = prev.movements[exerciseId];
        const today = new Date().toISOString().slice(0, 10);

        const entry: SessionEntry = {
          date: today,
          targetReps: params.reps,
          targetSets: params.sets,
          completedReps,
          completedSets,
          rpe,
        };

        const history = { ...prev.history, [exerciseId]: [...prev.history[exerciseId], entry] };
        const result = evaluateMovement(history[exerciseId], params);
        const movements = { ...prev.movements, [exerciseId]: result.newParams };

        const sessionLog = [...prev.sessionLog, { date: today, exerciseId, avgRpe: rpe }];

        const exerciseName = exercises.find((e) => e.id === exerciseId)?.name ?? exerciseId;
        const lastSignal = [
          { movementId: exerciseId, movementName: exerciseName, action: result.action, reason: result.reason },
          ...prev.lastSignal.filter((s) => s.movementId !== exerciseId),
        ].slice(0, 6);

        const next = withDerived({ movements, history, sessionLog, lastSignal });
        saveState(next);
        return next;
      });
    },
    [exercises],
  );

  return {
    state,
    isLoading: state === null,
    logSession,
    streak: state?.streak ?? 0,
    weekCompletion: state?.weekCompletion ?? 0,
  };
}
