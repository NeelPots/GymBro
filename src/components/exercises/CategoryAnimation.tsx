const CATEGORY_LABEL: Record<string, string> = {
  push: "Pressing motion",
  pull: "Pulling motion",
  legs: "Squatting motion",
  core: "Bracing hold",
  shoulders: "Overhead press motion",
  arms: "Curling motion",
  cardio: "Cardio motion",
};

/**
 * A small looping stick-figure pictogram, one consistent visual style shared
 * across every category. It's illustrative only - a generic rep pattern for
 * the category, not a demonstration of the specific exercise.
 */
export function CategoryAnimation({ category }: { category: string }) {
  const key = CATEGORY_LABEL[category] ? category : "push";
  const label = CATEGORY_LABEL[key] ?? CATEGORY_LABEL.push;

  return (
    <div
      className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-2/40 text-muted-foreground"
      data-category={key}
    >
      <svg viewBox="0 0 100 90" width="120" height="108" className={`category-anim category-anim--${key}`}>
        <circle className="ca-head" cx="50" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
        <g className="ca-body" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none">
          <line className="ca-torso" x1="50" y1="23" x2="50" y2="52" />
          <line className="ca-leg-l" x1="50" y1="52" x2="38" y2="80" />
          <line className="ca-leg-r" x1="50" y1="52" x2="62" y2="80" />
          <line className="ca-arm-l" x1="50" y1="30" x2="34" y2="42" />
          <line className="ca-arm-r" x1="50" y1="30" x2="66" y2="42" />
        </g>
      </svg>
      <span className="text-xs">{label} - illustrative</span>
      <style>{`
        .category-anim .ca-torso,
        .category-anim .ca-leg-l,
        .category-anim .ca-leg-r,
        .category-anim .ca-arm-l,
        .category-anim .ca-arm-r,
        .category-anim .ca-head,
        .category-anim .ca-body {
          transform-box: fill-box;
        }

        /* push: whole upper body dips and rises, arms bent at the sides */
        .category-anim--push .ca-head,
        .category-anim--push .ca-torso,
        .category-anim--push .ca-arm-l,
        .category-anim--push .ca-arm-r {
          animation: ca-push 1.6s ease-in-out infinite;
        }

        /* pull: whole figure rises toward a fixed point and lowers back down */
        .category-anim--pull .ca-head,
        .category-anim--pull .ca-torso,
        .category-anim--pull .ca-arm-l,
        .category-anim--pull .ca-arm-r,
        .category-anim--pull .ca-leg-l,
        .category-anim--pull .ca-leg-r {
          animation: ca-pull 1.6s ease-in-out infinite;
        }

        /* legs: whole figure crouches down and stands back up */
        .category-anim--legs .ca-head,
        .category-anim--legs .ca-torso,
        .category-anim--legs .ca-arm-l,
        .category-anim--legs .ca-arm-r {
          animation: ca-squat-upper 1.6s ease-in-out infinite;
        }
        .category-anim--legs .ca-leg-l {
          animation: ca-squat-leg-l 1.6s ease-in-out infinite;
        }
        .category-anim--legs .ca-leg-r {
          animation: ca-squat-leg-r 1.6s ease-in-out infinite;
        }

        /* core: a subtle braced pulse, since this is a hold, not a rep */
        .category-anim--core .ca-body,
        .category-anim--core .ca-head {
          animation: ca-brace 2.2s ease-in-out infinite;
        }

        /* shoulders: arms press from shoulder height up overhead */
        .category-anim--shoulders .ca-arm-l {
          transform-origin: 50px 30px;
          animation: ca-press-arm-l 1.6s ease-in-out infinite;
        }
        .category-anim--shoulders .ca-arm-r {
          transform-origin: 50px 30px;
          animation: ca-press-arm-r 1.6s ease-in-out infinite;
        }

        /* arms: forearms curl up toward the shoulder */
        .category-anim--arms .ca-arm-l {
          transform-origin: 34px 42px;
          animation: ca-curl-l 1.4s ease-in-out infinite;
        }
        .category-anim--arms .ca-arm-r {
          transform-origin: 66px 42px;
          animation: ca-curl-r 1.4s ease-in-out infinite;
        }

        /* cardio: the whole figure bounces with arms and legs kicked out */
        .category-anim--cardio .ca-head,
        .category-anim--cardio .ca-torso {
          animation: ca-jump-body 0.9s ease-in-out infinite;
        }
        .category-anim--cardio .ca-arm-l,
        .category-anim--cardio .ca-arm-r,
        .category-anim--cardio .ca-leg-l,
        .category-anim--cardio .ca-leg-r {
          animation: ca-jump-limbs 0.9s ease-in-out infinite;
        }

        @keyframes ca-push {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes ca-pull {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ca-squat-upper {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(14px); }
        }
        @keyframes ca-squat-leg-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes ca-squat-leg-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        @keyframes ca-brace {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes ca-press-arm-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(70deg); }
        }
        @keyframes ca-press-arm-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-70deg); }
        }
        @keyframes ca-curl-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-80deg); }
        }
        @keyframes ca-curl-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(80deg); }
        }
        @keyframes ca-jump-body {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ca-jump-limbs {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-anim * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
