"use client";

import { useEffect, useMemo, useState } from "react";
import { Swords } from "lucide-react";
import { systemAudio } from "@/lib/gamification/audio";
import { useQuest } from "@/components/gamification/QuestProvider";

const AUTO_DISMISS_MS = 3200;
const PARTICLE_COUNT = 24;

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    angle: (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.3,
    distance: 90 + Math.random() * 110,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 120,
  }));
}

/** High-energy particle/glowing splash shown on every level-up, driven by the shared quest state. */
export function LevelUpModal() {
  const quest = useQuest();
  const event = quest.lastLevelUp;
  const [visible, setVisible] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- regenerate the burst pattern each time a new level-up fires
  const particles = useMemo(() => makeParticles(), [event]);

  useEffect(() => {
    if (!event) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    systemAudio.levelUp();
    const id = setTimeout(() => {
      setVisible(false);
      quest.dismissLevelUp();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  if (!event || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/70 backdrop-blur-sm"
      onClick={() => {
        setVisible(false);
        quest.dismissLevelUp();
      }}
    >
      <div className="relative flex flex-col items-center gap-3 animate-hud-modal-in">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute size-1.5 rounded-full bg-signal animate-hud-particle"
              style={
                {
                  width: p.size,
                  height: p.size,
                  animationDelay: `${p.delay}ms`,
                  "--particle-x": `${Math.cos(p.angle) * p.distance}px`,
                  "--particle-y": `${Math.sin(p.angle) * p.distance}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative flex size-24 items-center justify-center rounded-full border-2 border-signal bg-signal/10 text-signal shadow-[0_0_40px_rgba(51,170,255,0.6)] animate-hud-pulse-glow">
          <Swords size={40} strokeWidth={1.75} />
        </div>

        <div className="relative text-center">
          <div className="font-display text-2xl font-black tracking-wide text-signal hud-glow-text">LEVEL UP</div>
          <div className="mt-1 font-mono text-lg font-bold">Lv. {event.level}</div>
          <div className="font-mono text-sm text-muted-foreground">{event.rankTitle}</div>
        </div>
      </div>
    </div>
  );
}
