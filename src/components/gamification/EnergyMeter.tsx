import { BatteryCharging } from "lucide-react";
import { energyColor, energyLabel, energyPercentFromSleepHours } from "@/lib/gamification/sleep";
import type { SleepEntry } from "@/lib/gamification/sleep";

interface EnergyMeterProps {
  latestSleepEntry: SleepEntry | null;
  hasLoggedSleepToday: boolean;
}

/**
 * Turns last night's logged sleep into a single at-a-glance "how much do you
 * have in the tank today" readout, front and center on Home instead of
 * buried in the Status sheet - the whole point is to make today's capacity
 * obvious without having to open anything.
 */
export function EnergyMeter({ latestSleepEntry, hasLoggedSleepToday }: EnergyMeterProps) {
  if (!latestSleepEntry) {
    return (
      <div className="hud-panel rounded-[var(--radius)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal ring-1 ring-signal/25">
            <BatteryCharging size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold tracking-tight">Energy</div>
            <div className="truncate text-xs text-muted-foreground">Log tonight&apos;s sleep to see today&apos;s capacity.</div>
          </div>
        </div>
      </div>
    );
  }

  const pct = energyPercentFromSleepHours(latestSleepEntry.hours);
  const label = energyLabel(pct);
  const color = energyColor(pct);
  const subtitle = hasLoggedSleepToday
    ? `${latestSleepEntry.hours}h sleep - today's capacity`
    : `${latestSleepEntry.hours}h last logged - log tonight to update`;

  return (
    <div className="hud-panel rounded-[var(--radius)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl ring-1"
            style={{ backgroundColor: `${color}1a`, color, boxShadow: `0 0 10px ${color}55`, borderColor: `${color}55` }}
          >
            <BatteryCharging size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold tracking-tight">Energy</div>
            <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-lg font-bold tabular-nums" style={{ color }}>
            {pct}%
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        </div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}
