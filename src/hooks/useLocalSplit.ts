"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUserId } from "@/services/gamification/questSync";
import { pullSplits, pushSplits } from "@/services/training/trainingSync";

const STORAGE_KEY = "adaptive-coach-split-v1";
const CLOUD_PUSH_DEBOUNCE_MS = 800;
/** Caps how long the initial load waits on a cloud pull before falling back to local state, so a slow/offline network can't hang the app. */
const CLOUD_PULL_TIMEOUT_MS = 6_000;

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

/** Union by id so a day created on one device is never discarded by a sync from another. */
function mergeDays(a: SplitDay[], b: SplitDay[]): SplitDay[] {
  const byId = new Map<string, SplitDay>();
  for (const day of a) byId.set(day.id, day);
  for (const day of b) if (!byId.has(day.id)) byId.set(day.id, day);
  return [...byId.values()];
}

/**
 * User-authored workout splits (e.g. "Push Day", "Pull Day") - local-first
 * in localStorage, and (when signed in) mirrored to the `training_state`
 * table so a day built on one device shows up on another. Only the day
 * *content* syncs, unioned by id like routines/steps - which day is
 * currently active stays a per-device choice (not synced), since which
 * plan drives Home is separately decided by useActivePlanSource and
 * legitimately can differ device to device.
 */
export function useLocalSplit() {
  const [split, setSplit] = useState<LocalSplitState | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const local = loadSplit();
      if (cancelled) return;

      if (!isSupabaseConfigured) {
        setSplit(local);
        return;
      }
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setSplit(local);
        return;
      }

      // Wait for the cloud pull (bounded by a timeout so a slow/offline
      // network can't hang the app) before showing anything as "loaded" -
      // same fix as the quest hook, so a split day built on another device
      // isn't briefly (or, on a flaky connection, not at all) missing here.
      const cloud = await Promise.race([
        pullSplits(userId),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), CLOUD_PULL_TIMEOUT_MS)),
      ]);
      if (cancelled) return;
      if (!cloud) {
        setSplit(local);
        return;
      }

      try {
        const cloudDays = cloud.splits as SplitDay[];
        const merged: LocalSplitState = { days: mergeDays(local.days, cloudDays), activeDayId: local.activeDayId };
        saveSplit(merged);
        if (!cancelled) setSplit(merged);
      } catch (error) {
        console.error("Failed to merge cloud split state, keeping local state:", error);
        if (!cancelled) setSplit(local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Re-sync from the cloud whenever the tab/app regains focus, so a split day
  // built on another device shows up here without needing a reload. Also
  // re-pushes the (now-merged) state afterward - the debounced push effect
  // below only fires on a local change, so if an earlier push silently
  // failed (offline, a table that didn't exist yet, etc.) and nothing local
  // has changed since, it would otherwise never retry.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function resync() {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const cloud = await pullSplits(userId);
      let toPush: LocalSplitState | null = null;
      setSplit((prev) => {
        if (!prev) return prev;
        if (!cloud) {
          toPush = prev;
          return prev;
        }
        try {
          const cloudDays = cloud.splits as SplitDay[];
          const merged: LocalSplitState = { days: mergeDays(prev.days, cloudDays), activeDayId: prev.activeDayId };
          saveSplit(merged);
          toPush = merged;
          return merged;
        } catch (error) {
          console.error("Failed to merge cloud split state on refocus, keeping current state:", error);
          toPush = prev;
          return prev;
        }
      });
      if (toPush) await pushSplits(userId, (toPush as LocalSplitState).days, new Date().toISOString());
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
    if (split === undefined || !isSupabaseConfigured) return;
    const id = setTimeout(() => {
      void (async () => {
        const userId = await getCurrentUserId();
        if (!userId) return;
        await pushSplits(userId, split.days, new Date().toISOString());
      })();
    }, CLOUD_PUSH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [split]);

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
