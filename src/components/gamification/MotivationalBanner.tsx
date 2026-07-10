"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const QUOTES = [
  "Every rep writes your next level.",
  "Discipline is the bridge between goals and rank-ups.",
  "The grind doesn't lie.",
  "Growth lives on the other side of today's excuse.",
  "You don't rise to the occasion. You fall to your training.",
  "Small reps. Compounding levels.",
  "No one ranks up on rest days alone.",
  "Consistency is the real cheat code.",
  "Your next rank is being decided today.",
  "Show up. Level up.",
];

interface MotivationalBannerProps {
  /** Which quote slot this instance shows, so multiple banners on one page don't repeat. */
  offset?: number;
  tone?: "signal" | "progress";
}

/**
 * A big, unmistakably visible motivational banner in the normal page flow -
 * not an absolutely-positioned background layer, since testing showed those
 * get fully hidden behind Home's large opaque cards anyway. The quote picks
 * off the current date (not Date.now()/Math.random() during render, which
 * would trip react-hooks/purity) so it's stable across a session and only
 * changes day to day.
 */
export function MotivationalBanner({ offset = 0, tone = "signal" }: MotivationalBannerProps) {
  const [quote, setQuote] = useState(QUOTES[offset % QUOTES.length]);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuote(QUOTES[(dayIndex + offset) % QUOTES.length]);
  }, [offset]);

  const isSignal = tone === "signal";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none -rotate-1 select-none rounded-[var(--radius)] border px-5 py-5 text-center",
        isSignal
          ? "border-signal/20 bg-gradient-to-r from-signal/20 via-signal/10 to-transparent"
          : "border-progress/20 bg-gradient-to-r from-progress/20 via-progress/10 to-transparent",
      )}
    >
      <p
        className={cn(
          "font-display text-xl font-bold tracking-wide uppercase sm:text-2xl",
          isSignal ? "text-signal/90" : "text-progress/80",
        )}
      >
        {quote}
      </p>
    </div>
  );
}
