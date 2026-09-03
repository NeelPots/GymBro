"use client";

import { useCallback, useEffect, useState } from "react";
import { evaluateMovement, type MovementParams, type SessionEntry } from "@/lib/adaptive/engine";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUserId } from "@/services/gamification/questSync";
import { pullAdaptiveState, pushAdaptiveState } from "@/services/training/trainingSync";
import type { Exercise, SignalItem } from "@/lib/types/domain";

const STORAGE_KEY = "adaptive-coach-state-v2";
const CLOUD_PUSH_DEBOUNCE_MS = 800;
/** Caps how long the initial load waits on a cloud pull before falling back to local state, so a slow/offline network can't hang the app. */
const CLOUD_PULL_TIMEOUT_MS = 6_000;

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

export interface LocalState {
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

function unionHistoryEntries(a: HistoryEntry[], b: HistoryEntry[]): HistoryEntry[] {
  const byId = new Map<string, HistoryEntry>();
  for (const e of a) byId.set(e.id, e);
  for (const e of b) if (!byId.has(e.id)) byId.set(e.id, e);
  return [...byId.values()].sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime());
}

/**
 * Merges two LocalStates (this device's and whatever synced from the cloud)
 * so a logged set from either side is never lost - history and the flat
 * sessionLog union by entry id, same as the rest of the app's sync. Per-
 * exercise `movements` params are trickier: evaluateMovement steps them
 * forward incrementally one session at a time (progress/hold/deload from
 * wherever they currently are) rather than deriving them purely from
 * history, so they can't be safely recomputed from a merged history alone.
 * Instead, whichever side logged the more recent session for that exercise
 * keeps its params, since that's the freshest incremental state.
 */
export function mergeAdaptiveState(a: LocalState, b: LocalState): LocalState {
  const exerciseIds = new Set([
    ...Object.keys(a.history),
    ...Object.keys(b.history),
    ...Object.keys(a.movements),
    ...Object.keys(b.movements),
  ]);
  const history: Record<string, HistoryEntry[]> = {};
  const movements: Record<string, MovementParams> = {};

  for (const id of exerciseIds) {
    const aEntries = a.history[id] ?? [];
    const bEntries = b.history[id] ?? [];
    history[id] = unionHistoryEntries(aEntries, bEntries);

    const aParams = a.movements[id];
    const bParams = b.movements[id];
    if (!aParams) {
      if (bParams) movements[id] = bParams;
      continue;
    }
    if (!bParams) {
      movements[id] = aParams;
      continue;
    }
    const aLatest = aEntries[aEntries.length - 1]?.date;
    const bLatest = bEntries[bEntries.length - 1]?.date;
    if (!aLatest) movements[id] = bParams;
    else if (!bLatest) movements[id] = aParams;
    else movements[id] = new Date(bLatest).getTime() > new Date(aLatest).getTime() ? bParams : aParams;
  }

  const sessionById = new Map<string, SessionLogEntry>();
  for (const s of [...a.sessionLog, ...b.sessionLog]) sessionById.set(s.id, s);
  const sessionLog = [...sessionById.values()].sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime());

  const lastSignalById = new Map<string, SignalItem>();
  for (const s of [...a.lastSignal, ...b.lastSignal]) lastSignalById.set(s.movementId, s);

  return withDerived({ movements, history, sessionLog, lastSignal: [...lastSignalById.values()].slice(0, 6) });
}

export function useLocalAdaptiveState(exercises: Exercise[]) {
  const [state, setState] = useState<LocalState | null>(null);

  useEffect(() => {
    // localStorage isn't available during SSR, so the real state can only be
    // loaded after mount - this intentionally causes one extra client render
    // (the caller shows a skeleton via isLoading until then).
    let cancelled = false;

    void (async () => {
      const local = loadState(exercises);
      if (cancelled) return;

      if (!isSupabaseConfigured) {
        setState(local);
        return;
      }
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setState(local);
        return;
      }

      // Wait for the cloud pull (bounded by a timeout so a slow/offline
      // network can't hang the app) before showing anything as "loaded" -
      // same fix as the quest/gamification hook, so history logged on
      // another device isn't briefly (or, on a flaky connection,
      // permanently) missing from streak/week-completion here too.
      const cloud = await Promise.race([
        pullAdaptiveState(userId),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), CLOUD_PULL_TIMEOUT_MS)),
      ]);
      if (cancelled) return;
      if (!cloud) {
        setState(local);
        return;
      }

      try {
        const cloudState = migrateIds(cloud.state as unknown as LocalState);
        const merged = mergeAdaptiveState(local, cloudState);
        saveState(merged);
        if (!cancelled) setState(merged);
      } catch (error) {
        console.error("Failed to merge cloud adaptive state, keeping local state:", error);
        if (!cancelled) setState(local);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync from the cloud whenever the tab/app regains focus, so history
  // logged on another device shows up here without needing a reload.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function resync() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const cloud = await pullAdaptiveState(userId);
      if (!cloud) return;
      setState((prev) => {
        if (!prev) return prev;
        try {
          const cloudState = migrateIds(cloud.state as unknown as LocalState);
          const merged = mergeAdaptiveState(prev, cloudState);
          saveState(merged);
          return merged;
        } catch (error) {
          console.error("Failed to merge cloud adaptive state on refocus, keeping current state:", error);
          return prev;
        }
      });
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

  // Debounced cloud push - mirrors every local save to `training_state` when signed in.
  useEffect(() => {
    if (state === null || !isSupabaseConfigured) return;
    const id = setTimeout(() => {
      void (async () => {
        const userId = await getCurrentUserId();
        if (!userId) return;
        await pushAdaptiveState(userId, state as unknown as Record<string, unknown>, new Date().toISOString());
      })();
    }, CLOUD_PUSH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [state]);

  /**
   * `exercises` (the resolved active plan) can still be settling when the
   * effect above runs - useLocalSplit/useLocalCustomExercises/
   * useActivePlanSource all load asynchronously a beat after mount, so the
   * very first `exercises` value is often the fallback default plan, not
   * the real active split. Since the mount effect above only runs once,
   * any exercise that only shows up once those finish loading (a custom
   * exercise in an activated split, most commonly) would otherwise never
   * get a `movements` entry - and every consumer assumes that entry
   * exists unconditionally, so a missing one crashes the page rather than
   * rendering incorrectly. Backfill it whenever the resolved list changes.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- backfilling movements for exercises that appeared after mount, guarded to no-op when nothing's missing
    setState((prev) => {
      if (!prev) return prev;
      const missing = exercises.filter((e) => !prev.movements[e.id]);
      if (missing.length === 0) return prev;

      const movements = { ...prev.movements };
      const history = { ...prev.history };
      for (const e of missing) {
        movements[e.id] = { reps: e.defaultReps, sets: e.defaultSets, difficultyTier: e.difficultyTier };
        history[e.id] = [];
      }
      const next = { ...prev, movements, history };
      saveState(next);
      return next;
    });
  }, [exercises]);

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
