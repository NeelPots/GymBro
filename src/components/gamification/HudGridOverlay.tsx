/**
 * Fixed, viewport-pinned decoration for the System HUD: a faint grid plus a
 * slow scanline sweep. Pure CSS, zero JS - sits under MotivationalBackdrop
 * in the shell so both compose without fighting over z-index.
 */
export function HudGridOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,243,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.05) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      <div
        className="absolute inset-x-0 h-32 opacity-[0.06]"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(0,243,255,0.9), transparent)",
          animation: "hud-scanline 9s linear infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(0,243,255,0.08), transparent 55%)" }}
      />
    </div>
  );
}
