// ── THE WORLD: an ambient dark background + vignette ────────────────────────
// A premium dark canvas with drifting star-dust and soft nebula tints, all
// derived from your theme colors. Render it ONCE, GLOBALLY, behind every
// scene → the world never cuts, only the content transitions (a subtle but
// powerful continuity trick). Fully optional: replace with your own ambient
// background if your brand isn't dark — just keep it GLOBAL and continuous.
// Deterministic (remotion random(seed)); twinkle = sin(frame) per star.

import React, { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";
import { C } from "../theme";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  tw: number;
  ph: number;
  layer: 0 | 1;
};

function makeStars(count: number, seed: string): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const s = (k: string) => random(`${seed}-${i}-${k}`);
    stars.push({
      x: s("x") * 100,
      y: s("y") * 100,
      r: 0.6 + s("r") * 1.8,
      base: 0.18 + s("o") * 0.6,
      tw: 0.02 + s("t") * 0.05,
      ph: s("p") * Math.PI * 2,
      layer: s("l") > 0.6 ? 1 : 0,
    });
  }
  return stars;
}

export const Starfield: React.FC<{ frame: number; count?: number }> = ({
  frame,
  count = 150,
}) => {
  const stars = useMemo(() => makeStars(count, "promo-night"), [count]);
  const drift0 = frame * 0.045;
  const drift1 = frame * 0.085;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 30%, ${C.bg1} 0%, ${C.bg2} 45%, ${C.bg3} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 42% at 72% 26%, ${C.nebula}55 0%, transparent 70%),
             radial-gradient(46% 38% at 22% 78%, ${C.nebula}44 0%, transparent 72%),
             radial-gradient(30% 26% at 30% 20%, ${C.accent}0e 0%, transparent 75%)`,
        }}
      />
      {([0, 1] as const).map((layer) => (
        <AbsoluteFill
          key={layer}
          style={{
            transform: `translate(${-(layer === 0 ? drift0 : drift1) % 40}px, ${
              ((layer === 0 ? drift0 : drift1) * 0.3) % 30
            }px) scale(1.06)`,
          }}
        >
          {stars
            .filter((s) => s.layer === layer)
            .map((s, i) => {
              const o = s.base * (0.7 + 0.3 * Math.sin(frame * s.tw + s.ph));
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.r * 2,
                    height: s.r * 2,
                    borderRadius: "50%",
                    background: C.ink,
                    opacity: o,
                    boxShadow: s.r > 1.9 ? `0 0 ${s.r * 4}px ${C.accentBright}66` : undefined,
                  }}
                />
              );
            })}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** Cinematic vignette — always on top of everything, darkens the edges. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.5 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(75% 62% at 50% 46%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
