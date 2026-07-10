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

function FlexFigure({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={className} fill="none">
      <circle cx="60" cy="16" r="12" fill="currentColor" />
      <polygon points="40,32 80,32 74,90 46,90" fill="currentColor" />
      <rect x="44" y="88" width="32" height="14" rx="6" fill="currentColor" />
      <rect x="42" y="100" width="16" height="48" rx="8" fill="currentColor" />
      <rect x="62" y="100" width="16" height="48" rx="8" fill="currentColor" />
      <g stroke="currentColor" strokeLinecap="round">
        <line x1="40" y1="40" x2="20" y2="62" strokeWidth="14" />
        <line x1="20" y1="62" x2="34" y2="34" strokeWidth="13" />
        <line x1="80" y1="40" x2="100" y2="62" strokeWidth="14" />
        <line x1="100" y1="62" x2="86" y2="34" strokeWidth="13" />
      </g>
      <circle cx="34" cy="34" r="9" fill="currentColor" />
      <circle cx="86" cy="34" r="9" fill="currentColor" />
    </svg>
  );
}

function RunnerFigure({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 150" className={className} fill="none">
      <g stroke="currentColor" strokeLinecap="round" opacity="0.5">
        <line x1="14" y1="70" x2="34" y2="66" strokeWidth="3" />
        <line x1="10" y1="80" x2="32" y2="78" strokeWidth="3" />
        <line x1="14" y1="90" x2="34" y2="90" strokeWidth="3" />
      </g>
      <circle cx="78" cy="18" r="11" fill="currentColor" />
      <polygon points="70,30 92,34 82,86 62,82" fill="currentColor" />
      <g stroke="currentColor" strokeLinecap="round">
        <line x1="72" y1="84" x2="50" y2="100" strokeWidth="15" />
        <line x1="50" y1="100" x2="58" y2="130" strokeWidth="13" />
        <line x1="78" y1="84" x2="100" y2="104" strokeWidth="15" />
        <line x1="100" y1="104" x2="118" y2="118" strokeWidth="13" />
        <line x1="68" y1="40" x2="46" y2="48" strokeWidth="12" />
        <line x1="46" y1="48" x2="34" y2="64" strokeWidth="11" />
        <line x1="88" y1="40" x2="104" y2="34" strokeWidth="12" />
        <line x1="104" y1="34" x2="118" y2="44" strokeWidth="11" />
      </g>
      <circle cx="34" cy="64" r="7" fill="currentColor" />
      <circle cx="118" cy="44" r="7" fill="currentColor" />
      <ellipse cx="58" cy="134" rx="8" ry="5" fill="currentColor" />
      <ellipse cx="122" cy="120" rx="8" ry="5" fill="currentColor" />
    </svg>
  );
}

interface Band {
  top: string;
  rotate: string;
  tone: "signal" | "progress";
}

const BANDS: Band[] = [
  { top: "6%", rotate: "-4deg", tone: "signal" },
  { top: "46%", rotate: "3deg", tone: "progress" },
  { top: "86%", rotate: "-3deg", tone: "signal" },
];

/**
 * A fixed, viewport-pinned backdrop shared by the whole app shell (see
 * (app)/layout.tsx) - not per-page content, so it stays visible in whatever
 * margin/gutter space exists around the real UI regardless of which page or
 * how far down it's scrolled, rather than scrolling away with the content
 * column (which is what made the previous in-flow banner attempt either
 * invisible-behind-cards or too disruptive). Two illustrated athletic
 * silhouettes anchor the corners; a few low-opacity diagonal quote bands
 * fill the rest. Everything here is decorative: pointer-events-none,
 * aria-hidden, and z-indexed behind the whole app shell.
 */
export function MotivationalBackdrop() {
  const [quotes, setQuotes] = useState(() => [QUOTES[0], QUOTES[4], QUOTES[7]]);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuotes([QUOTES[dayIndex % QUOTES.length], QUOTES[(dayIndex + 4) % QUOTES.length], QUOTES[(dayIndex + 7) % QUOTES.length]]);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {BANDS.map((band, i) => (
        <div
          key={i}
          className="absolute left-1/2 w-[150%] -translate-x-1/2"
          style={{ top: band.top, transform: `translateX(-50%) rotate(${band.rotate})` }}
        >
          <div
            className={
              "py-3 text-center font-display text-lg font-bold tracking-wide uppercase sm:text-xl " +
              (band.tone === "signal"
                ? "bg-gradient-to-r from-transparent via-signal/[0.07] to-transparent text-signal/40"
                : "bg-gradient-to-r from-transparent via-progress/[0.07] to-transparent text-progress/35")
            }
          >
            {quotes[i]}
          </div>
        </div>
      ))}

      <FlexFigure className="absolute -top-4 -left-6 h-28 w-auto text-signal/[0.09] sm:h-36 lg:h-44" />
      <RunnerFigure className="absolute -right-8 -bottom-6 h-32 w-auto text-progress/[0.1] sm:h-40 lg:h-48" />
    </div>
  );
}
