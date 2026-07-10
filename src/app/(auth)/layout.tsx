import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-5 py-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,77,46,0.16), transparent 70%)",
        }}
      />
      <Link
        href="/home"
        className="absolute left-4 top-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-6 sm:top-6"
      >
        <ArrowLeft size={16} />
        Back to app
      </Link>
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-signal/10 text-signal ring-1 ring-signal/30">
            <Activity size={22} strokeWidth={2.25} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Adaptive Coach</span>
        </div>
        <div className="rounded-[var(--radius)] border border-border bg-surface p-6 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
          {children}
        </div>
      </div>
    </div>
  );
}
