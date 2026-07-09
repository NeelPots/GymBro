/**
 * Single source of truth for hex values needed outside Tailwind's reach
 * (Chart.js options, inline SVG strokes). Keep in sync with the CSS
 * custom properties in src/app/globals.css.
 */
export const tokens = {
  background: "#0A0B0D",
  surface: "#15171A",
  surface2: "#1E2124",
  border: "#26292E",
  textPrimary: "#F5F5F0",
  textSecondary: "#9A9DA3",
  textTertiary: "#5C6066",
  signal: "#FF4D2E",
  progress: "#3ECF8E",
  deload: "#FFB020",
  fontDisplay: "var(--font-display)",
  fontBody: "var(--font-body)",
  fontMono: "var(--font-mono)",
} as const;

export const movementChartColors = [
  tokens.signal,
  tokens.progress,
  tokens.deload,
  "#7DA6FF",
] as const;
