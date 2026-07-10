import Link from "next/link";
import { Flame } from "lucide-react";

interface ProfileCardProps {
  streak: number;
  totalLogs: number;
  movementCount: number;
}

/**
 * Desktop-only right-rail card (hidden on mobile - see HomeView). Mirrors
 * the profile-summary-card pattern from reference fitness apps: a banner,
 * an overlapping avatar, a stat row, and a single primary CTA.
 */
export function ProfileCard({ streak, totalLogs, movementCount }: ProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
      <div
        className="h-16"
        style={{
          background: "linear-gradient(135deg, rgba(255,77,46,0.25), rgba(21,23,26,0) 70%)",
        }}
      />
      <div className="px-5 pb-5">
        <div className="-mt-7 mb-3 flex size-14 items-center justify-center rounded-full border-4 border-surface bg-signal text-white">
          <Flame size={22} strokeWidth={2.25} />
        </div>
        <div className="font-display text-base font-semibold">Your progress</div>
        <div className="mt-0.5 text-xs text-muted-foreground">Keep the streak going</div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <Stat value={streak} label="Streak" />
          <Stat value={totalLogs} label="Logs" />
          <Stat value={movementCount} label="Moves" />
        </div>

        <Link
          href="/history"
          className="mt-4 flex items-center justify-center rounded-lg bg-signal py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal/90"
        >
          View your history
        </Link>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
