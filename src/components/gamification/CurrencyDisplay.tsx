import { Circle, Gem } from "lucide-react";

interface CurrencyDisplayProps {
  coins: number;
  gems: number;
}

/** Coins/Gems readout - earned from quests and milestones, purely a scoreboard for now. */
export function CurrencyDisplay({ coins, gems }: CurrencyDisplayProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className="flex items-center gap-1 text-deload">
        <Circle size={11} className="fill-deload" />
        {coins}
      </span>
      <span className="flex items-center gap-1 text-signal">
        <Gem size={11} className="fill-signal/30" />
        {gems}
      </span>
    </div>
  );
}
