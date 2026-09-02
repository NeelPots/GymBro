/**
 * Single source of truth for hex values needed outside Tailwind's reach
 * (Chart.js options, inline SVG strokes). Keep in sync with the CSS
 * custom properties in src/app/globals.css.
 */
export const tokens = {
  background: "#050B22",
  surface: "#0C1938",
  surface2: "#16264F",
  border: "#22335F",
  textPrimary: "#EAF6FF",
  textSecondary: "#8FA8C9",
  textTertiary: "#5C7291",
  signal: "#33AAFF",
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
