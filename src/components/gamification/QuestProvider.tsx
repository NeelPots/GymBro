"use client";

import { createContext, useContext, useEffect } from "react";
import { useLocalQuest } from "@/hooks/useLocalQuest";

type QuestContextValue = ReturnType<typeof useLocalQuest>;

const QuestContext = createContext<QuestContextValue | null>(null);

const FULLSCREEN_PROMPT_KEY = "adaptive-coach-fullscreen-prompted";

/**
 * Best-effort fullscreen on entry - browsers block requestFullscreen()
 * without a user gesture, so this tries immediately on mount and, if that's
 * silently rejected, retries once on the visitor's very first tap/keypress.
 * Gated to once per session so it never becomes a nag loop.
 */
function useAutoFullscreenPrompt() {
  useEffect(() => {
    if (window.sessionStorage.getItem(FULLSCREEN_PROMPT_KEY)) return;
    window.sessionStorage.setItem(FULLSCREEN_PROMPT_KEY, "1");

    function tryFullscreen() {
      if (document.fullscreenElement) return;
      document.documentElement.requestFullscreen().catch(() => {
        // Denied without a gesture (most browsers) - the first-gesture listener below retries.
      });
    }

    tryFullscreen();
    window.addEventListener("pointerdown", tryFullscreen, { once: true });
    window.addEventListener("keydown", tryFullscreen, { once: true });
    return () => {
      window.removeEventListener("pointerdown", tryFullscreen);
      window.removeEventListener("keydown", tryFullscreen);
    };
  }, []);
}

/**
 * Mounts the single, shared System HUD state for the whole app shell - one
 * localStorage-backed instance instead of each consumer (header, sidebar,
 * home, the penalty overlay, the terminal) reading it independently and
 * drifting out of sync with each other between navigations.
 */
export function QuestProvider({ children }: { children: React.ReactNode }) {
  const quest = useLocalQuest();
  useAutoFullscreenPrompt();
  return <QuestContext.Provider value={quest}>{children}</QuestContext.Provider>;
}

export function useQuest(): QuestContextValue {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuest must be used within a QuestProvider");
  return ctx;
}
