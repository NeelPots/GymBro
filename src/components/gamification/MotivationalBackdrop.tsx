"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  "Strong is a habit, not a mood.",
  "Earn it before you post it.",
  "Comfort is where progress goes to stall.",
  "One more rep than yesterday.",
  "Rank-ups are just receipts for reps.",
  "Nobody regrets the workout they finished.",
  "Momentum is built, not found.",
  "Train like the streak is watching.",
  "Effort compounds. So does avoidance.",
  "Your body keeps the score. Keep it honest.",
  "Hard sets. Easy conscience.",
  "Progress hides inside boring, repeated work.",
  "Today's rep is tomorrow's rank.",
  "Discipline outlasts motivation every time.",
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
  { top: "4%", rotate: "-4deg", tone: "signal" },
  { top: "26%", rotate: "3deg", tone: "progress" },
  { top: "50%", rotate: "-3deg", tone: "signal" },
  { top: "72%", rotate: "4deg", tone: "progress" },
  { top: "93%", rotate: "-3deg", tone: "signal" },
];

/** Simple deterministic string hash so each route shows a different, stable slice of the quote pool. */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickQuotes(pathname: string, dayIndex: number): string[] {
  const base = hashString(pathname) + dayIndex;
  return BANDS.map((_, i) => QUOTES[(base + i * 5) % QUOTES.length]);
}

/**
 * A fixed, viewport-pinned backdrop shared by the whole app shell (see
 * (app)/layout.tsx) - not per-page content, so it stays visible in whatever
 * margin/gutter space exists around the real UI regardless of which page or
 * how far down it's scrolled. Which quotes show is derived from the route
 * plus the current date, so different pages show different slices of the
 * pool (not just the same handful everywhere) while staying stable within
 * a single visit - no flicker, no layout thrash.
 *
 * Deliberately NOT wider than the viewport in any way that could affect
 * document scroll: this is `fixed` + `overflow-hidden` + capped to 100vw
 * explicitly, so its rotated children (which do extend past their own
 * edges for the diagonal effect) can never contribute to page-level
 * horizontal scroll regardless of browser/zoom quirks.
 */
export function MotivationalBackdrop() {
  const pathname = usePathname();
  const [quotes, setQuotes] = useState(() => pickQuotes(pathname ?? "/", 0));
  // Below `sm`, the content column has almost no side gutter, so the bands'
  // usual diagonal overflow reads as clipped text jammed against card edges
  // (and the header, which has no gutter at all) instead of decoration.
  // Keep mobile bands flat and edge-to-edge so they only ever show in the
  // actual empty space between stacked cards, never crossing into them.
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuotes(pickQuotes(pathname ?? "/", dayIndex));
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ width: "100vw", maxWidth: "100vw" }}
      aria-hidden="true"
    >
      {BANDS.map((band, i) => {
        // The top band sits right where the mobile header (and the loose
        // "day streak" text just under it) lives - no page chrome down
        // there is guaranteed to be tall/opaque enough to fully clear it,
        // so skip it below `sm` rather than chase an exact pixel offset.
        if (isCompact && i === 0) return null;
        return (
        <div
          key={i}
          className={cn("absolute left-1/2 -translate-x-1/2", isCompact ? "w-full" : "w-[118%]")}
          style={{
            top: band.top,
            transform: isCompact ? "translateX(-50%)" : `translateX(-50%) rotate(${band.rotate})`,
          }}
        >
          <div
            className={
              "py-2 text-center font-display text-base font-bold tracking-wide uppercase sm:py-3 sm:text-2xl lg:py-4 lg:text-5xl " +
              (band.tone === "signal"
                ? "bg-gradient-to-r from-transparent via-signal/10 to-transparent text-signal/40 sm:via-signal/15 sm:text-signal/60 lg:via-signal/20 lg:text-signal/80"
                : "bg-gradient-to-r from-transparent via-progress/10 to-transparent text-progress/35 sm:via-progress/15 sm:text-progress/55 lg:via-progress/20 lg:text-progress/75")
            }
          >
            {quotes[i]}
          </div>
        </div>
        );
      })}

      <FlexFigure className="absolute -top-2 -left-4 hidden h-56 w-auto text-signal/60 lg:block lg:h-72 xl:h-80" />
      <RunnerFigure className="absolute -right-6 -bottom-4 hidden h-60 w-auto text-progress/55 lg:block lg:h-80 xl:h-[22rem]" />
    </div>
  );
}
