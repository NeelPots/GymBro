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

/**
 * A compact "system log" chip - the mobile/tablet equivalent of the
 * desktop SystemPanel. Mobile has no real gutter space to decorate, so
 * instead of a poster-style quote this reads like a terminal line: a
 * cut-corner glass chip, a pulsing status dot, and small glowing
 * monospace text, echoing the same System-window language as the rest of
 * the HUD instead of looking like a separate motivational-poster layer.
 */
function SystemLogLine({ text, tone }: { text: string; tone: "signal" | "progress" }) {
  const color = tone === "signal" ? "text-signal" : "text-progress";
  const border = tone === "signal" ? "border-signal/25" : "border-progress/25";
  const dot = tone === "signal" ? "bg-signal" : "bg-progress";
  return (
    <div
      className={cn("flex w-fit max-w-[88%] items-start gap-2 border bg-background/30 px-3 py-1.5 backdrop-blur-[1px] sm:max-w-[70%]", border)}
      style={{ clipPath: "polygon(9px 0, 100% 0, 100% 100%, calc(100% - 9px) 100%, 0 100%, 0 9px)" }}
    >
      <span className={cn("mt-1 size-1.5 shrink-0 animate-hud-blink-cursor rounded-full", dot)} />
      <span
        className={cn("font-mono text-[10px] font-semibold uppercase leading-snug tracking-wide sm:text-[11px]", color)}
        style={{ textShadow: "0 0 8px currentColor" }}
      >
        {text}
      </span>
    </div>
  );
}

/** Angular targeting-reticle corner marks - a recurring "system window" motif. */
function CornerBrackets({ className, tone = "signal" }: { className?: string; tone?: "signal" | "progress" }) {
  const color = tone === "signal" ? "border-signal/60" : "border-progress/60";
  return (
    <div className={cn("pointer-events-none absolute", className)} aria-hidden="true">
      <span className={cn("absolute left-0 top-0 size-4 border-l-2 border-t-2", color)} />
      <span className={cn("absolute right-0 top-0 size-4 border-r-2 border-t-2", color)} />
      <span className={cn("absolute bottom-0 left-0 size-4 border-b-2 border-l-2", color)} />
      <span className={cn("absolute bottom-0 right-0 size-4 border-b-2 border-r-2", color)} />
    </div>
  );
}

/** A slow-rotating radar sweep with a pulsing blip - pure CSS, no assets. */
function RadarRing() {
  return (
    <div className="relative size-24 shrink-0">
      <div className="absolute inset-0 animate-hud-ring-pulse rounded-full border border-signal/30" />
      <div className="absolute inset-3 rounded-full border border-signal/20" />
      <div className="absolute inset-6 rounded-full border border-signal/15" />
      <div
        className="absolute inset-0 animate-hud-radar-sweep rounded-full"
        style={{
          background: "conic-gradient(from 0deg, rgba(51,170,255,0.55), transparent 30%)",
          maskImage: "radial-gradient(circle, transparent 54%, black 56%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 54%, black 56%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_10px_2px_rgba(51,170,255,0.85)]" />
    </div>
  );
}

/**
 * The Solo-Leveling-style "System" readout panel - an octagon-cut glass
 * pane with a radar sweep, a scanline pass, and a live-looking status
 * readout. Pure decoration (aria-hidden), replaces the old stick-figure
 * illustrations with something that fits the HUD's own visual language
 * instead of clashing with it.
 */
function SystemPanel({ className }: { className?: string }) {
  const clip = "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)";
  return (
    <div
      className={cn("relative border border-signal/30 bg-background/50 backdrop-blur-sm", className)}
      style={{ clipPath: clip, boxShadow: "0 0 28px rgba(51,170,255,0.14), inset 0 0 32px rgba(51,170,255,0.05)" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-hidden opacity-25" style={{ clipPath: clip }}>
        <div
          className="absolute inset-x-0 h-12"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(51,170,255,0.9), transparent)",
            animation: "hud-scanline 4.5s linear infinite",
          }}
        />
      </div>
      <div className="relative flex items-center gap-4 px-5 py-4">
        <RadarRing />
        <div className="font-mono text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-1.5 text-signal">
            <span className="size-1.5 animate-hud-blink-cursor rounded-full bg-progress" />
            System // Monitor
          </div>
          <div className="mt-1.5 text-muted-foreground">
            Hunter status: <span className="text-progress">active</span>
          </div>
          <div className="mt-0.5 text-muted-foreground">
            Threat level: <span className="text-signal">none</span>
          </div>
          <div className="mt-0.5 text-muted-foreground">
            Scanning<span className="animate-hud-blink-cursor">_</span>
          </div>
        </div>
      </div>
    </div>
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
  // The band positions (BANDS' `top` percentages) were tuned against the
  // Home page's specific card layout - on other routes (a search bar +
  // filter pills + a dense exercise grid, a table-like history list, etc.)
  // there's no guarantee those percentages land in an actual gap, and they
  // were overlapping real card content there instead of decorating empty
  // space. Only Home gets the ambient quote bands until each page has its
  // own tuned gap positions; every route still gets the corner-bracket/
  // radar ornament below, which is anchored to the viewport edge, not to
  // content, so it can't collide with anything.
  const showQuoteBands = pathname === "/home";
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
      {showQuoteBands && BANDS.map((band, i) => {
        // The top band sits right where the mobile header (and the loose
        // "day streak" text just under it) lives - no page chrome down
        // there is guaranteed to be tall/opaque enough to fully clear it,
        // so skip it below `sm` rather than chase an exact pixel offset.
        if (isCompact && i === 0) return null;
        return (
        <div
          key={i}
          className="absolute"
          style={{
            top: band.top,
            left: "50%",
            width: isCompact ? "100%" : "118%",
            transform: isCompact ? "translateX(-50%)" : `translateX(-50%) rotate(${band.rotate})`,
          }}
        >
          <div className="flex justify-center py-1.5 lg:hidden">
            <SystemLogLine text={quotes[i]} tone={band.tone} />
          </div>
          <div
            className={
              "hidden py-3 text-center font-display font-bold uppercase tracking-wide lg:block lg:text-3xl " +
              (band.tone === "signal"
                ? "bg-gradient-to-r from-transparent via-signal/10 to-transparent text-signal/25"
                : "bg-gradient-to-r from-transparent via-progress/10 to-transparent text-progress/20")
            }
          >
            {quotes[i]}
          </div>
        </div>
        );
      })}

      <div className="absolute left-6 top-6 hidden size-40 lg:block xl:size-48">
        <CornerBrackets className="inset-0" tone="signal" />
        <div className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-signal/20" />
        <div className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 bg-signal/20" />
      </div>

      <div className="absolute bottom-72 right-8 hidden lg:block">
        <CornerBrackets className="-inset-3" tone="progress" />
        <SystemPanel />
      </div>

      <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 lg:block">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal/20"
          style={{ writingMode: "vertical-rl" }}
        >
          System Online // Hunter Log
        </span>
      </div>
    </div>
  );
}
