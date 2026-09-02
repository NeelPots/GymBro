interface ResourceBarsProps {
  hp: number;
  hpMax: number;
  stamina: number;
  staminaMax: number;
}

/** HP (crimson) and Stamina (cyan) resource pools - the System's vitals readout. */
export function ResourceBars({ hp, hpMax, stamina, staminaMax }: ResourceBarsProps) {
  const hpPct = hpMax > 0 ? Math.min(100, Math.round((hp / hpMax) * 100)) : 0;
  const staminaPct = staminaMax > 0 ? Math.min(100, Math.round((stamina / staminaMax) * 100)) : 0;

  return (
    <div className="flex flex-col gap-2">
      <ResourceBar label="HP" current={hp} max={hpMax} pct={hpPct} color="#ff0055" />
      <ResourceBar label="STAMINA" current={stamina} max={staminaMax} pct={staminaPct} color="#33aaff" />
    </div>
  );
}

function ResourceBar({ label, current, max, pct, color }: { label: string; current: number; max: number; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-16 shrink-0 font-mono text-[10px] font-bold tracking-widest text-muted-foreground">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {current}/{max}
      </span>
    </div>
  );
}
