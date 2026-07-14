// ── KINETIC TEXT: the typographic signature ─────────────────────────────────
// Reveals text by staggered letters (or words): each unit rises, unblurs and
// fades in. THE effect of pro promos (never a flat fade). Pure per-frame.
// For flowing paragraphs use unit="word" + whiteSpace:"normal" in style —
// the text builds continuously start-to-finish across wrapped lines.

import React from "react";
import { Ease, EASE_CEREMONIAL, ramp } from "./easings";

export const KineticText: React.FC<{
  frame: number;
  text: string;
  /** frame at which the first unit starts */
  at: number;
  /** frames between units */
  stagger?: number;
  /** duration of each unit's entrance */
  dur?: number;
  /** px each unit rises while entering */
  rise?: number;
  unit?: "letter" | "word";
  ease?: Ease;
  style?: React.CSSProperties;
  maxBlur?: number;
}> = ({
  frame,
  text,
  at,
  stagger = 3.2,
  dur = 26,
  rise = 42,
  unit = "letter",
  ease = EASE_CEREMONIAL,
  style,
  maxBlur = 9,
}) => {
  const parts = unit === "letter" ? Array.from(text) : text.split(/(\s+)/);
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre", ...style }}>
      {parts.map((ch, i) => {
        const p = ramp(frame, at + i * stagger, at + i * stagger + dur, ease);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * rise}px)`,
              filter: p < 1 ? `blur(${(1 - p) * maxBlur}px)` : undefined,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </span>
  );
};
