"use client";

import { useEffect, useState } from "react";

function storageKey(id: string): string {
  return `adaptive-coach-collapsed-${id}`;
}

/**
 * A persisted collapsed/expanded flag for one named section - each caller
 * picks its own stable `id` (e.g. "home-signal", "home-plan"). Local-first
 * like the rest of the app's UI state, one localStorage key per section
 * rather than a shared registry, so sections stay fully independent.
 */
export function useCollapsible(id: string, defaultCollapsed = false) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey(id));
    if (raw !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(raw === "true");
    }
  }, [id]);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(storageKey(id), String(next));
      return next;
    });
  }

  return { collapsed, toggle };
}
