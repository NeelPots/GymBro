/**
 * Single source of truth for hex values needed outside Tailwind's reach
 * (Chart.js options, inline SVG strokes). Keep in sync with the CSS
 * custom properties in src/app/globals.css.
 */
export const tokens = {
  background: "#030712",
  surface: "#0A1120",
  surface2: "#101A30",
  border: "#17233A",
  textPrimary: "#EAF6FF",
  textSecondary: "#8FA8C9",
  textTertiary: "#5C7291",
  signal: "#00F3FF",
  progress: "#39FF8A",
  deload: "#FFB020",
  penalty: "#FF0055",
  fontDisplay: "var(--font-display)",
  fontBody: "var(--font-body)",
  fontMono: "var(--font-mono)",
} as const;

export const movementChartColors = [
  tokens.signal,
  tokens.progress,
  tokens.deload,
  "#7C5CFF",
] as const;
