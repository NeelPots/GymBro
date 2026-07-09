import type { SignalItem } from "@/lib/types/domain";
import { SignalWave } from "./SignalWave";
import { cn } from "@/lib/utils";

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
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-subtle">
        Signal — what the plan is reading from you
      </div>
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
    </div>
  );
}
