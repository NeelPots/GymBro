"use client";

import { useEffect, useRef, useState } from "react";
import { tokens } from "@/lib/design-tokens";

interface SignalWaveProps {
  rpeValues: number[];
}

export function SignalWave({ rpeValues }: SignalWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  const height = 48;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recent = rpeValues.slice(-16);

  let path: string;
  if (recent.length < 2) {
    path = `M0,${height / 2} L${width},${height / 2}`;
  } else {
    const step = width / (recent.length - 1);
    path = recent
      .map((rpe, i) => {
        const y = height - (rpe / 10) * height;
        return `${i * step},${y}`;
      })
      .join(" L");
    path = `M${path}`;
  }

  return (
    <div ref={containerRef} className="w-full">
      <svg
        className="w-full"
        style={{ height }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <path
          d={path}
          fill="none"
          stroke={tokens.signal}
          strokeWidth={2}
          strokeDasharray={recent.length < 2 ? "4 4" : undefined}
          opacity={recent.length < 2 ? 0.3 : 1}
          style={{ filter: `drop-shadow(0 0 6px rgba(255, 77, 46, 0.4))` }}
        />
      </svg>
    </div>
  );
}
