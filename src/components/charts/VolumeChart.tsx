"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { movementChartColors, tokens } from "@/lib/design-tokens";
import type { SessionEntry } from "@/lib/adaptive/engine";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface VolumeChartProps {
  history: Record<string, SessionEntry[]>;
  names: Record<string, string>;
}

export function VolumeChart({ history, names }: VolumeChartProps) {
  const allDates = [...new Set(Object.values(history).flat().map((h) => h.date))].sort();

  const entries = Object.entries(history).filter(([, hist]) => hist.length > 0);

  if (entries.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center font-mono text-xs text-muted-foreground">
        Log a session to see volume trends here.
      </div>
    );
  }

  const datasets = entries.map(([id, hist], i) => {
    const dataMap = Object.fromEntries(hist.map((h) => [h.date, h.completedReps * h.completedSets]));
    return {
      label: names[id] ?? id,
      data: allDates.map((d) => dataMap[d] ?? null),
      borderColor: movementChartColors[i % movementChartColors.length],
      backgroundColor: "transparent",
      tension: 0.3,
      spanGaps: true,
    };
  });

  return (
    <Line
      data={{ labels: allDates, datasets }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            labels: { color: tokens.textSecondary, font: { family: "JetBrains Mono", size: 10 } },
          },
        },
        scales: {
          x: { ticks: { color: tokens.textTertiary, font: { size: 9 } }, grid: { color: tokens.border } },
          y: { ticks: { color: tokens.textTertiary, font: { size: 9 } }, grid: { color: tokens.border } },
        },
      }}
    />
  );
}
