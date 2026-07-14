// ── CURSOR: the mouse that demonstrates interaction ─────────────────────────
// A classic arrow (light fill, dark outline, soft shadow) that travels along
// keyframes + a CLICK ring (expanding accent pulse) + a press "dip". Use it
// in scenes that show the product IN USE: click → something happens, drag →
// something follows. Pure per-frame.
//   <Cursor frame={f} keyframes={[{f:40,x:900,y:600},{f:60,x:1100,y:520}]}
//           clicks={[62]} appearAt={38} exitAt={170} />

import React from "react";
import { Ease, EASE_INOUT, kf, ramp } from "./easings";
import { C } from "../theme";

export const Cursor: React.FC<{
  frame: number;
  keyframes: { f: number; x: number; y: number }[];
  clicks?: number[];
  appearAt?: number;
  exitAt?: number;
  ease?: Ease;
  scale?: number;
}> = ({ frame, keyframes, clicks = [], appearAt = 0, exitAt, ease = EASE_INOUT, scale = 1 }) => {
  const fs = keyframes.map((k) => k.f);
  const x = kf(frame, fs, keyframes.map((k) => k.x), ease);
  const y = kf(frame, fs, keyframes.map((k) => k.y), ease);
  const inP = ramp(frame, appearAt, appearAt + 10);
  const outP = exitAt === undefined ? 0 : ramp(frame, exitAt, exitAt + 10);
  let press = 0;
  for (const c of clicks) {
    const d = frame - c;
    if (d >= 0 && d < 8) press = Math.max(press, 1 - d / 8);
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, zIndex: 60, pointerEvents: "none" }}>
      {clicks.map((c, i) => {
        const d = frame - c;
        if (d < 0 || d > 22) return null;
        const p = d / 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 26 - p * 22,
              top: y - 26 - p * 22,
              width: (26 + p * 22) * 2,
              height: (26 + p * 22) * 2,
              borderRadius: "50%",
              border: `2px solid ${C.accentBright}`,
              opacity: (1 - p) * 0.8,
            }}
          />
        );
      })}
      <svg
        width={34 * scale}
        height={44 * scale}
        viewBox="0 0 34 44"
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `scale(${(1 - press * 0.12) * inP})`,
          transformOrigin: "6px 4px",
          opacity: inP * (1 - outP),
          filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.55))",
        }}
      >
        <path
          d="M6 3 L6 33 L13.5 26.5 L18.5 38 L23.5 35.5 L18.5 24.5 L28 24 Z"
          fill="#f4f0e6"
          stroke="#15171e"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
