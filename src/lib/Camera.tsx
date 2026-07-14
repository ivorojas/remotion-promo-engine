// ── CAMERA: the "promo punch-in" ────────────────────────────────────────────
// Wraps a scene's content and animates scale/pan/rotation by keyframes. This
// is 80% of the pro look: the scene stays still and the CAMERA glides toward
// what matters. Usage:
//   <Camera frame={f} keyframes={[{f:0,scale:1},{f:120,scale:1.18,x:-40}]}>…
// Omitted props default to scale 1, x/y/rot 0.
// Focus formula (transform: scale(s) translate(x)): to center point P on a
// 1920-wide canvas, x = 960 - P (independent of s).

import React from "react";
import { AbsoluteFill } from "remotion";
import { Ease, EASE_INOUT, kf } from "./easings";

export type CamKeyframe = {
  f: number;
  scale?: number;
  x?: number;
  y?: number;
  rot?: number;
};

export const Camera: React.FC<{
  frame: number;
  keyframes: CamKeyframe[];
  ease?: Ease;
  children: React.ReactNode;
}> = ({ frame, keyframes, ease = EASE_INOUT, children }) => {
  const fs = keyframes.map((k) => k.f);
  const get = (sel: (k: CamKeyframe) => number | undefined, def: number) =>
    kf(frame, fs, keyframes.map((k) => sel(k) ?? def), ease);
  const scale = get((k) => k.scale, 1);
  const x = get((k) => k.x, 0);
  const y = get((k) => k.y, 0);
  const rot = get((k) => k.rot, 0);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${x}px, ${y}px) rotate(${rot}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
