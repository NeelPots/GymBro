"use client";

import { useEffect, useState } from "react";

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

/**
 * Purely decorative diagonal ribbons behind the page content - the one
 * exception to putting real information in the background. The quote picks
 * off the current date (not Date.now()/Math.random() during render, which
 * would trip react-hooks/purity) so it's stable across a session and only
 * changes day to day.
 */
export function MotivationalBanner() {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuote(QUOTES[dayIndex % QUOTES.length]);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-16 top-10 w-72 -rotate-12 bg-gradient-to-r from-signal/15 to-transparent py-2 text-center font-display text-xs font-semibold tracking-wider text-signal/70 uppercase">
        {quote}
      </div>
      <div className="absolute -left-20 bottom-16 w-72 rotate-[10deg] bg-gradient-to-r from-transparent to-progress/15 py-2 text-center font-display text-xs font-semibold tracking-wider text-progress/60 uppercase">
        Level up, one session at a time.
      </div>
    </div>
  );
}
