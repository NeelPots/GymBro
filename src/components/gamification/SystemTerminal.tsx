"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { formatLogTime } from "@/lib/gamification/log";
import { systemAudio } from "@/lib/gamification/audio";
import { cn } from "@/lib/utils";
import { useQuest } from "@/components/gamification/QuestProvider";

const TONE_COLOR: Record<string, string> = {
  info: "text-signal",
  success: "text-progress",
  warning: "text-deload",
  danger: "text-destructive",
};

/** Bottom-anchored, collapsible System Feed - an auto-scrolling terminal log of every quest/level/penalty event. */
export function SystemTerminal() {
  const { log } = useQuest();
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log, expanded]);

  const latest = log[log.length - 1];

  return (
    <div className="fixed right-3 bottom-20 z-30 flex w-[min(20rem,calc(100vw-1.5rem))] flex-col items-end lg:right-6 lg:bottom-6">
      {expanded && (
        <div className="mb-2 w-full overflow-hidden rounded-md border border-signal/25 bg-background/95 shadow-[0_0_24px_rgba(51,170,255,0.16)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-signal/15 px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-signal">System Feed</span>
          </div>
          <div ref={scrollRef} className="max-h-48 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed">
            {log.length === 0 ? (
              <p className="text-muted-foreground">Awaiting activity...</p>
            ) : (
              log.map((entry) => (
                <p key={entry.id} className="text-muted-foreground">
                  <span className="text-subtle">[{formatLogTime(entry.timestamp)}]</span>{" "}
                  <span className={TONE_COLOR[entry.tone]}>SYSTEM:</span> {entry.message}
                </p>
              ))
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          systemAudio.toggle();
          setExpanded((v) => !v);
        }}
        aria-label={expanded ? "Collapse system feed" : "Expand system feed"}
        className="flex items-center gap-1.5 rounded-md border border-signal/30 bg-surface/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-signal shadow-[0_0_16px_rgba(51,170,255,0.14)] backdrop-blur-md transition-colors hover:bg-surface-2"
      >
        <Terminal size={12} />
        <span className={cn("max-w-40 truncate", expanded && "hidden sm:inline")}>
          {expanded ? "System Feed" : (latest?.message ?? "System Feed")}
        </span>
        {expanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>
    </div>
  );
}
