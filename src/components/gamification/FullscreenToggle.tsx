"use client";

import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { systemAudio } from "@/lib/gamification/audio";

/** "SYSTEM FULLSCREEN" toggle - requestFullscreen() on the whole document. */
export function FullscreenToggle({ className }: { className?: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = () => setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  async function toggle() {
    systemAudio.toggle();
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen can be denied (iOS Safari, permissions policy) - fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={
        "inline-flex items-center gap-1.5 rounded-md border border-signal/25 bg-signal/5 px-2 py-1 font-mono text-[10px] tracking-wide text-signal transition-colors hover:bg-signal/15 " +
        (className ?? "")
      }
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title="System Fullscreen"
    >
      {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
      <span className="hidden sm:inline">SYSTEM</span>
    </button>
  );
}
