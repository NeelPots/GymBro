"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlanSource } from "@/lib/adaptive/activePlan";

const STORAGE_KEY = "adaptive-coach-plan-source-v1";

function loadSource(): PlanSource {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "ai" || raw === "split" ? raw : "default";
}

/**
 * Tracks which system currently drives "today's plan" on Home: an AI program,
 * a custom split day, or neither (the default library). Set explicitly
 * whenever a program is generated or a split day is activated - see
 * resolveActivePlan for how this pointer is consumed.
 */
export function useActivePlanSource() {
  const [source, setSourceState] = useState<PlanSource | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSourceState(loadSource());
  }, []);

  const setSource = useCallback((next: PlanSource) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setSourceState(next);
  }, []);

  return {
    source: source ?? "default",
    isLoading: source === undefined,
    setSource,
  };
}
