// ── SECTION TITLE CARD: eyebrow + serif title + accent line ─────────────────
// The "bumper" announcing each section. Choreography:
//   1) eyebrow (small-caps, accent color) appears letter by letter
//   2) big title (display font) appears word by word
//   3) an accent line draws left→right
//   4) optional DOCK: the whole card shrinks and moves to the top header,
//      clearing the center for the scene's action — a classic pro move.
// `compact` renders it docked FROM THE START: use it when the scene's center
// is already occupied (a big product shot) — a centered title would be hidden
// BEHIND the content. Hard-won rule: text must always be born visible.

import React from "react";
import { EASE_CEREMONIAL, EASE_INOUT, ramp, mix } from "./easings";
import { KineticText } from "./KineticText";
import { C, FONT } from "../theme";

export const TitleCard: React.FC<{
  frame: number;
  eyebrow: string;
  title: string;
  at: number;
  /** frame at which the card docks to the top (omit = stays centered) */
  dockAt?: number;
  /** center Y (px) before docking */
  centerY?: number;
  /** Y once docked */
  dockY?: number;
  dockScale?: number;
  titleSize?: number;
  exitAt?: number;
  /** born already docked (center of the scene is busy) */
  compact?: boolean;
}> = ({
  frame,
  eyebrow,
  title,
  at,
  dockAt,
  centerY = 470,
  dockY = 160,
  dockScale = 0.52,
  titleSize = 112,
  exitAt,
  compact = false,
}) => {
  const dock = compact
    ? 1
    : dockAt === undefined
      ? 0
      : ramp(frame, dockAt, dockAt + 26, EASE_INOUT);
  const y = mix(centerY, dockY, dock);
  const scale = mix(1, dockScale, dock);
  const lineP = ramp(frame, at + 26, at + 52, EASE_CEREMONIAL);
  const exit = exitAt === undefined ? 0 : ramp(frame, exitAt, exitAt + 18, EASE_INOUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: "50% 50%",
        opacity: 1 - exit,
      }}
    >
      <KineticText
        frame={frame}
        text={eyebrow.toUpperCase()}
        at={at}
        stagger={1.6}
        dur={20}
        rise={16}
        maxBlur={4}
        style={{
          fontFamily: FONT.ui,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "0.42em",
          color: C.accent,
        }}
      />
      <KineticText
        frame={frame}
        text={title}
        at={at + 8}
        unit="word"
        stagger={7}
        dur={30}
        rise={54}
        style={{
          fontFamily: FONT.display,
          fontSize: titleSize,
          fontWeight: 600,
          color: C.ink,
          lineHeight: 1.05,
          textShadow: `0 2px 40px rgba(0,0,0,0.55)`,
        }}
      />
      <div
        style={{
          height: 2,
          width: 300,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          transform: `scaleX(${lineP})`,
          opacity: lineP,
        }}
      />
    </div>
  );
};
