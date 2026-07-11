"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RestTimerOverlayProps {
  seconds: number;
  exerciseName: string;
  onDone: () => void;
}

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function playBeep() {
  try {
    const AudioContextCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio unavailable/blocked - the visual + vibration cues still fire.
  }
}

/**
 * Mounting this component IS "open"; the parent unmounts it (via onDone) to
 * close, so there's no separate open prop to keep in sync. Renders through a
 * portal so it sits above the LogSetSheet (z-50) regardless of where it's
 * rendered from.
 */
export function RestTimerOverlay({ seconds, exerciseName, onDone }: RestTimerOverlayProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [minimized, setMinimized] = useState(false);
  const finished = remaining <= 0;
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!finished) return;
    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    playBeep();
    const timeout = setTimeout(() => onDoneRef.current(), 900);
    return () => clearTimeout(timeout);
  }, [finished]);

  if (minimized) {
    return createPortal(
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed right-4 bottom-24 z-[100] flex items-center gap-2 rounded-full border border-signal/40 bg-surface-2 px-4 py-2.5 shadow-lg transition-colors hover:border-signal/60 lg:bottom-6"
      >
        <span className="font-mono text-sm font-semibold tabular-nums text-signal">
          {formatTime(remaining)}
        </span>
        <span className="text-xs text-muted-foreground">rest — tap to expand</span>
      </button>,
      document.body,
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background/98 px-6 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setMinimized(true)}
        aria-label="Minimize rest timer"
        className="absolute top-6 right-6 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Minimize2 size={20} />
      </button>

      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Rest before next set</p>
        <p className="mt-1 font-display text-lg text-foreground">{exerciseName}</p>
      </div>

      <div
        className={cn(
          "font-display text-7xl font-bold tabular-nums transition-colors sm:text-8xl",
          finished ? "text-progress" : "text-signal",
        )}
      >
        {formatTime(remaining)}
      </div>

      {finished ? (
        <p className="font-mono text-sm uppercase tracking-widest text-progress animate-pulse">Time&apos;s up — go!</p>
      ) : (
        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={() => setRemaining((r) => r + 10)}>
            +10 sec
          </Button>
          <Button type="button" variant="outline" onClick={onDone}>
            Skip
          </Button>
        </div>
      )}
    </div>,
    document.body,
  );
}
