import { tokens } from "@/lib/design-tokens";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label: string;
}

/**
 * Ring-style metric readout (the Whoop/recovery-score pattern) - used for
 * weekly compliance instead of a flat percentage, since it reads at a
 * glance the way a bar chart of one number doesn't.
 */
export function CircularProgress({ value, size = 72, strokeWidth = 6, label }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tokens.surface2}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tokens.signal}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: "drop-shadow(0 0 4px rgba(255, 77, 46, 0.5))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold">
          {Math.round(value)}%
        </div>
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
