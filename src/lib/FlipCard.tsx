// ── FLIP CARD: a physical 3D two-face card — the engine's crown piece ───────
// Faces are ANY ReactNode (product screenshots, images, styled panels, cards).
// Everything is driven by pure numeric props of the frame:
//   flip   0..1  → rotateY 0..180 (back → front). Face swaps at 0.5.
//   tiltX/tiltY  → hover-like tilt in degrees
//   glossT 0..1  → position of a material light-sweep across the FRONT face
//                  (soft-light band + faint screen band, masked to the center
//                  so light never sits on the border). null = off.
//   glow   0..1  → accent aura for emphasis moments
//   bobY/bobRot  → floating (pass sin(frame*k) from the scene)
// Physicality details that make a flip feel REAL and not like a slide deck:
//   · a specular edge highlight that peaks exactly when the card is edge-on
//   · a floor shadow that narrows as the card turns
// Because Remotion renders frame-by-frame (each frame is a full screenshot),
// CSS 3D here is flawless — none of the GPU/live-animation fragility of web.

import React from "react";
import { bell } from "./easings";
import { C } from "../theme";

export const FlipCard: React.FC<{
  front: React.ReactNode;
  back: React.ReactNode;
  width: number;
  height: number;
  flip?: number;
  tiltX?: number;
  tiltY?: number;
  glossT?: number | null;
  glow?: number;
  bobY?: number;
  bobRot?: number;
  shadow?: number;
  radius?: number;
}> = ({
  front,
  back,
  width,
  height,
  flip = 1,
  tiltX = 0,
  tiltY = 0,
  glossT = null,
  glow = 0,
  bobY = 0,
  bobRot = 0,
  shadow = 0.6,
  radius = 14,
}) => {
  const rotY = flip * 180;
  const showFront = flip >= 0.5;
  const edge = bell(rotY, 90, 55);
  const shadowW = width * (0.45 + 0.55 * Math.abs(Math.cos((rotY * Math.PI) / 180)));

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    border: `1px solid ${C.accent}4d`,
    boxShadow: `0 18px 50px rgba(0,0,0,0.55)`,
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `translateY(${bobY}px) rotate(${bobRot}deg)`,
      }}
    >
      {shadow > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -height * 0.075,
            width: shadowW,
            height: height * 0.05,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            filter: `blur(${height * 0.02}px)`,
            opacity: shadow,
          }}
        />
      )}
      {glow > 0 && (
        <div
          style={{
            position: "absolute",
            inset: `-${height * 0.09}px`,
            borderRadius: radius * 2.4,
            background: `radial-gradient(60% 60% at 50% 50%, ${C.accentBright}44 0%, transparent 70%)`,
            opacity: glow,
            filter: `blur(${height * 0.02}px)`,
          }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, perspective: 1700 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${rotY + tiltY}deg)`,
          }}
        >
          {/* back face (0°) */}
          <div style={face}>{back}</div>
          {/* front face (180°) */}
          <div style={{ ...face, transform: "rotateY(180deg)" }}>
            {front}
            {/* material gloss sweep — masked to the center so light never
                sits on the border/corners (a hard-won lesson) */}
            {glossT !== null && glossT !== undefined && showFront && (
              <>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(115deg, transparent ${glossT * 190 - 72}%, ${C.accentSoft}f2 ${glossT * 190 - 38}%, transparent ${glossT * 190 - 4}%)`,
                    mixBlendMode: "soft-light",
                    maskImage:
                      "radial-gradient(75% 82% at 50% 50%, #000 55%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(75% 82% at 50% 50%, #000 55%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(115deg, transparent ${glossT * 190 - 68}%, ${C.accentSoft}80 ${glossT * 190 - 38}%, transparent ${glossT * 190 - 10}%)`,
                    mixBlendMode: "screen",
                    maskImage:
                      "radial-gradient(70% 78% at 50% 50%, #000 50%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(70% 78% at 50% 50%, #000 50%, transparent 100%)",
                  }}
                />
              </>
            )}
          </div>
          {/* specular edge during the flip */}
          {edge > 0.02 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: radius,
                background: `linear-gradient(90deg, transparent 30%, ${C.accentSoft} 50%, transparent 70%)`,
                opacity: edge * 0.5,
                mixBlendMode: "screen",
                transform: "translateZ(2px)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
