"use client";

import { useCallback, useEffect, useState } from "react";
import { evaluateMovement, type MovementParams, type SessionEntry } from "@/lib/adaptive/engine";
import type { Exercise, SignalItem } from "@/lib/types/domain";

const STORAGE_KEY = "adaptive-coach-state-v2";

interface SessionLogEntry {
  id: string;
  date: string;
  exerciseId: string;
  avgRpe: number;
}

// A stable id per logged set, so a single entry can be found and deleted
// from both `history` (per exercise, feeds the adaptive engine) and
// `sessionLog` (flat, feeds streak/stats) without the two ever drifting
// out of sync.
interface HistoryEntry extends SessionEntry {
  id: string;
}

interface LocalState {
  movements: Record<string, MovementParams>;
  history: Record<string, HistoryEntry[]>;
  sessionLog: SessionLogEntry[];
  lastSignal: SignalItem[];
  streak: number;
  weekCompletion: number;
}

/**
 * Entries saved before ids existed won't have one. history[exerciseId] and
 * sessionLog (filtered to that exerciseId) were always appended together
 * 1:1 in logSession, so pairing them by index within each exerciseId is
 * exact, not a heuristic.
 */
function migrateIds(parsed: LocalState): LocalState {
  const history: Record<string, HistoryEntry[]> = {};
  for (const [exerciseId, entries] of Object.entries(parsed.history)) {
    history[exerciseId] = entries.map((e) => ({ ...e, id: e.id ?? crypto.randomUUID() }));
  }

  const cursor: Record<string, number> = {};
  const sessionLog = parsed.sessionLog.map((s) => {
    if (s.id) return s;
    const index = cursor[s.exerciseId] ?? 0;
    cursor[s.exerciseId] = index + 1;
    const id = history[s.exerciseId]?.[index]?.id ?? crypto.randomUUID();
    return { ...s, id };
  });

  return { ...parsed, history, sessionLog };
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
      const parsed = migrateIds(JSON.parse(raw) as LocalState);
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
        const id = crypto.randomUUID();

        const entry: HistoryEntry = {
          id,
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

        const sessionLog = [...prev.sessionLog, { id, date: today, exerciseId, avgRpe: rpe }];

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

  const deleteSession = useCallback((exerciseId: string, id: string) => {
    setState((prev) => {
      if (!prev) return prev;

      const history = {
        ...prev.history,
        [exerciseId]: (prev.history[exerciseId] ?? []).filter((e) => e.id !== id),
      };
      const sessionLog = prev.sessionLog.filter((s) => s.id !== id);

      const next = withDerived({ movements: prev.movements, history, sessionLog, lastSignal: prev.lastSignal });
      saveState(next);
      return next;
    });
  }, []);

  return {
    state,
    isLoading: state === null,
    logSession,
    deleteSession,
    streak: state?.streak ?? 0,
    weekCompletion: state?.weekCompletion ?? 0,
  };
}
