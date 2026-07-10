import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
}

export function ComingSoon({ icon: Icon, title, description, phase }: ComingSoonProps) {
  return (
    <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[var(--radius)] border border-border bg-surface px-6 py-20 text-center">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,77,46,0.14), transparent 70%)",
        }}
      />
      <div className="relative flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal ring-1 ring-signal/25">
        <Icon size={26} strokeWidth={1.9} />
      </div>
      <h2 className="relative font-display text-xl font-bold tracking-tight">{title}</h2>
      <p className="relative max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="relative mt-1 rounded-md bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
        {phase}
      </span>
    </div>
  );
}
