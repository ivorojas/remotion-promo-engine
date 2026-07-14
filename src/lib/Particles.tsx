// ── PARTICLES: accent dust that rises and sways ─────────────────────────────
// Emphasis moments (a reveal, the finale). Each particle is a PURE function
// of the frame: rises on a loop, sways in X, breathes its opacity.
// Deterministic via remotion's random(seed) — NEVER Math.random().

import React, { useMemo } from "react";
import { random } from "remotion";
import { C } from "../theme";

type P = {
  x0: number;
  speed: number;
  sway: number;
  freq: number;
  ph: number;
  size: number;
  warm: number;
  cycle: number;
  delay: number;
};

function make(count: number, seed: string): P[] {
  const out: P[] = [];
  for (let i = 0; i < count; i++) {
    const s = (k: string) => random(`${seed}-${i}-${k}`);
    out.push({
      x0: s("x"),
      speed: 0.5 + s("v") * 1.1,
      sway: 6 + s("s") * 22,
      freq: 0.015 + s("f") * 0.04,
      ph: s("p") * Math.PI * 2,
      size: 1.6 + s("z") * 3.4,
      warm: s("w"),
      cycle: 90 + Math.floor(s("c") * 80),
      delay: Math.floor(s("d") * 120),
    });
  }
  return out;
}

export const Particles: React.FC<{
  frame: number;
  count?: number;
  width: number;
  height: number;
  seed?: string;
  /** 0..1 — how much particles drift toward the center X as they rise */
  converge?: number;
  opacity?: number;
}> = ({ frame, count = 24, width, height, seed = "dust", converge = 0, opacity = 1 }) => {
  const ps = useMemo(() => make(count, seed), [count, seed]);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {ps.map((p, i) => {
        const local = frame + p.delay;
        const t = (local % p.cycle) / p.cycle;
        const y = height - t * (height + 40);
        const swayX = Math.sin(local * p.freq + p.ph) * p.sway;
        const cx = width / 2;
        const baseX = p.x0 * width;
        const x = baseX + (cx - baseX) * converge * t + swayX;
        const life = Math.min(t / 0.15, 1) * Math.min((1 - t) / 0.25, 1);
        const col = p.warm > 0.5 ? C.accentBright : C.accent;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: col,
              opacity: life * 0.75 * opacity,
              boxShadow: `0 0 ${p.size * 3}px ${col}aa`,
            }}
          />
        );
      })}
    </div>
  );
};
