"use client";

import { useEffect, useState } from "react";

function msUntil(targetIso: string): number {
  return Math.max(0, new Date(targetIso).getTime() - Date.now());
}

function format(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** A live "HH:MM:SS" countdown to `targetIso`, ticking once a second. */
export function Countdown({ targetIso, className }: { targetIso: string; className?: string }) {
  const [remaining, setRemaining] = useState(() => msUntil(targetIso));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(msUntil(targetIso));
    const id = setInterval(() => setRemaining(msUntil(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return <span className={className}>{format(remaining)}</span>;
}

/** Midnight in the viewer's local timezone, as an ISO string - recomputed each render. */
export function nextMidnightIso(): string {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.toISOString();
}
