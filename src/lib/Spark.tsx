// ── ✦ BRAND SPARK: an 8-point star that pops in with overshoot ──────────────
// A tiny recurring brand mark (hero, highlights, outro). Swap the path for
// your own logo mark if you have one.

import React from "react";
import { spring, useVideoConfig } from "remotion";
import { C } from "../theme";

export const Spark: React.FC<{
  frame: number;
  at: number;
  size?: number;
  color?: string;
  breathe?: boolean;
}> = ({ frame, at, size = 44, color = C.accentBright, breathe = true }) => {
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - at,
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.7 },
  });
  const glow = breathe ? 0.75 + 0.25 * Math.sin((frame - at) * 0.09) : 1;
  const r = size / 2;
  const k = 0.26;
  const d = `M0 ${-r} L${r * k} ${-r * k} L${r} 0 L${r * k} ${r * k} L0 ${r} L${-r * k} ${r * k} L${-r} 0 L${-r * k} ${-r * k} Z`;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-r} ${-r} ${size} ${size}`}
      style={{
        display: "block",
        transform: `scale(${pop}) rotate(${(1 - pop) * -80}deg)`,
        filter: `drop-shadow(0 0 ${10 * glow}px ${color})`,
        opacity: frame < at ? 0 : 1,
      }}
    >
      <path d={d} fill={color} />
    </svg>
  );
};
