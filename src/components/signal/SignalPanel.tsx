"use client";

import { ChevronDown } from "lucide-react";
import type { SignalItem } from "@/lib/types/domain";
import { SignalWave } from "./SignalWave";
import { cn } from "@/lib/utils";
import { useCollapsible } from "@/hooks/useCollapsible";
import { systemAudio } from "@/lib/gamification/audio";

interface SignalPanelProps {
  signals: SignalItem[];
  rpeValues: number[];
}

const dotColor: Record<SignalItem["action"], string> = {
  progress: "bg-progress shadow-[0_0_6px_theme(colors.progress)]",
  deload: "bg-deload shadow-[0_0_6px_theme(colors.deload)]",
  hold: "bg-subtle",
};

export function SignalPanel({ signals, rpeValues }: SignalPanelProps) {
  const { collapsed, toggle } = useCollapsible("home-signal");

  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
      <button
        type="button"
        onClick={() => {
          systemAudio.click();
          toggle();
        }}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand signal panel" : "Collapse signal panel"}
        className={cn("flex w-full items-center gap-1.5 text-left font-mono text-[11px] uppercase tracking-wider text-subtle", !collapsed && "mb-3")}
      >
        <ChevronDown size={14} className={cn("shrink-0 transition-transform", collapsed && "-rotate-90")} />
        Signal — what the plan is reading from you
      </button>

      {!collapsed && (
        <>
          <SignalWave rpeValues={rpeValues} />
          <div className="mt-3.5 flex flex-col gap-2.5">
            {signals.length === 0 ? (
              <div className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-subtle" />
                <span>
                  Log a few sessions and the plan will start adjusting to how you&apos;re actually
                  performing.
                </span>
              </div>
            ) : (
              signals.map((sig) => (
                <div
                  key={sig.movementId}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
                >
                  <span className={cn("mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full", dotColor[sig.action])} />
                  <span>
                    <strong className="font-semibold text-foreground">{sig.movementName}:</strong>{" "}
                    {sig.reason}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
