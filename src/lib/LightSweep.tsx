// ── LIGHT SWEEP: THE transition motif ───────────────────────────────────────
// A warm diagonal band of light crosses the screen between scenes. Pro rule:
// ONE transition motif, repeated — never mix ten different wipes. In the
// composition: <LightSweep frame={f} at={boundaryFrame} />
// (Pair it with a quiet whoosh SFX — well below the voice level, ~0.27.)

import React from "react";
import { AbsoluteFill } from "remotion";
import { EASE_INOUT, ramp } from "./easings";
import { C } from "../theme";

export const LightSweep: React.FC<{
  frame: number;
  at: number;
  dur?: number;
  intensity?: number;
}> = ({ frame, at, dur = 26, intensity = 0.5 }) => {
  const p = ramp(frame, at, at + dur, EASE_INOUT);
  if (p <= 0 || p >= 1) return null;
  const x = -60 + p * 220; // % of screen
  const a = Math.sin(Math.PI * p) * intensity;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background: `linear-gradient(105deg, transparent ${x - 26}%, ${C.accentSoft} ${x}%, transparent ${x + 26}%)`,
          opacity: a,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
