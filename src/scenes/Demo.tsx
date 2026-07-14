// ── DEMO (14s): the engine showing itself off — zero external assets ────────
// Three beats, so you can SEE every primitive working before you build:
//   Beat 1 (0–140): Spark pop → kinetic wordmark → accent line → tagline.
//   Beat 2 (140–300): compact TitleCard + a FlipCard (styled-div faces — in a
//     real promo these are YOUR screenshots/art) + Cursor clicks → the card
//     FLIPS (specular edge, floor shadow) → material gloss sweep → camera
//     punch-in. Particles rise behind.
//   Beat 3 (300–430): clean outro — spark, closing line, CTA pill.
// Study this file, then delete it and write your own scenes with the same
// pieces. Choreography lives in comments — keep that habit.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera } from "../lib/Camera";
import { KineticText } from "../lib/KineticText";
import { TitleCard } from "../lib/TitleCard";
import { FlipCard } from "../lib/FlipCard";
import { Cursor } from "../lib/Cursor";
import { Spark } from "../lib/Spark";
import { Particles } from "../lib/Particles";
import { bell, EASE_CEREMONIAL, EASE_DRAMATIC, EASE_INOUT, LINEAR, mix, ramp } from "../lib/easings";
import { C, FONT } from "../theme";

export const DEMO_DUR = 430;

const CARD_W = 340;
const CARD_H = 480;

const FrontFace: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      padding: "0 22px",
      background: `linear-gradient(160deg, ${C.bg1}, ${C.nebula})`,
    }}
  >
    <div style={{ fontSize: 64, color: C.accentBright, filter: `drop-shadow(0 0 12px ${C.accent})` }}>✦</div>
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: 40,
        fontWeight: 600,
        color: C.ink,
        textAlign: "center",
        lineHeight: 1.2,
      }}
    >
      Your art
      <br />
      goes here
    </div>
    <div
      style={{
        fontFamily: FONT.ui,
        fontSize: 14,
        letterSpacing: "0.22em",
        color: C.accent,
        textAlign: "center",
      }}
    >
      SCREENSHOT · CARD · PANEL
    </div>
  </div>
);

const BackFace: React.FC = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `repeating-linear-gradient(45deg, ${C.bg2} 0 14px, ${C.bg1} 14px 28px)`,
    }}
  >
    <div style={{ fontSize: 84, filter: `drop-shadow(0 0 18px ${C.accent})` }}>✦</div>
  </div>
);

export const Demo: React.FC = () => {
  const f = useCurrentFrame();

  // ── beat 1: hero ──
  const b1Exit = ramp(f, 122, 140, EASE_INOUT);

  // ── beat 2: the card ──
  const flip = ramp(f, 210, 238, EASE_DRAMATIC);
  const calm = 1 - bell(flip, 0.5, 0.6);
  const glossT = f >= 250 ? ramp(f, 250, 290, EASE_INOUT) : null;
  const cardIn = ramp(f, 148, 172, EASE_CEREMONIAL);

  // ── beat 3: outro ──
  const b3 = ramp(f, 300, 314, LINEAR);

  return (
    <Camera
      frame={f}
      keyframes={[
        { f: 0, scale: 1 },
        { f: 140, scale: 1.05 },
        { f: 150, scale: 1.02, x: 0 },
        { f: 245, scale: 1.02, x: 0 },
        { f: 296, scale: 1.14, x: 0, y: -10 },
        { f: 310, scale: 1 },
        { f: 430, scale: 1.04 },
      ]}
    >
      {/* ── BEAT 1 ── */}
      {f < 150 && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            opacity: (1 - b1Exit) * ramp(f, 0, 12, LINEAR),
            transform: `scale(${mix(1, 1.06, b1Exit)})`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <Spark frame={f} at={12} size={56} />
            <KineticText
              frame={f}
              text="Promo Engine"
              at={20}
              stagger={3.4}
              dur={28}
              rise={46}
              style={{
                fontFamily: FONT.display,
                fontSize: 150,
                fontWeight: 600,
                color: C.accentBright,
                lineHeight: 1,
                textShadow: `0 0 80px ${C.accent}55, 0 4px 44px rgba(0,0,0,0.6)`,
              }}
            />
            <div
              style={{
                height: 2,
                width: 340,
                background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
                transform: `scaleX(${ramp(f, 52, 76)})`,
                opacity: ramp(f, 52, 76),
              }}
            />
            <KineticText
              frame={f}
              text="Cinematic promos, written in code."
              at={64}
              unit="word"
              stagger={5.5}
              dur={26}
              rise={28}
              style={{
                fontFamily: FONT.bodyItalic,
                fontStyle: "italic",
                fontSize: 44,
                color: C.ink,
                opacity: 0.94,
              }}
            />
            <KineticText
              frame={f}
              text="CAMERA · TYPE · SOUND · VOICE"
              at={96}
              stagger={1.1}
              dur={18}
              rise={12}
              maxBlur={3}
              style={{
                fontFamily: FONT.ui,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "0.44em",
                color: C.inkDim,
              }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── BEAT 2 ── */}
      {f >= 140 && f < 310 && (
        <AbsoluteFill style={{ opacity: ramp(f, 140, 152, LINEAR) * (1 - ramp(f, 296, 308, EASE_INOUT)) }}>
          <TitleCard
            frame={f}
            eyebrow="The engine"
            title="Every piece is a component"
            at={144}
            compact
            titleSize={96}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 400,
              width: 700,
              height: 620,
              transform: "translateX(-50%)",
              opacity: 0.8,
            }}
          >
            <Particles frame={f} count={22} width={700} height={620} converge={0.4} seed="demo" />
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 640,
              transform: `translate(-50%, -50%) scale(${mix(0.92, 1, cardIn) * (1 + 0.05 * bell(flip, 0.5, 0.5))})`,
              opacity: cardIn,
            }}
          >
            <FlipCard
              front={<FrontFace />}
              back={<BackFace />}
              width={CARD_W}
              height={CARD_H}
              flip={flip}
              glossT={glossT}
              glow={0.3 * bell(flip, 0.5, 0.8)}
              bobY={6 * Math.sin(f * 0.05) * calm}
              bobRot={0.8 * Math.sin(f * 0.04) * calm}
            />
          </div>
          <Cursor
            frame={f}
            keyframes={[
              { f: 180, x: 1500, y: 950 },
              { f: 206, x: 1010, y: 640 },
              { f: 216, x: 1010, y: 640 },
              { f: 262, x: 1560, y: 820 },
            ]}
            clicks={[210]}
            appearAt={180}
            exitAt={258}
          />
        </AbsoluteFill>
      )}

      {/* ── BEAT 3 ── */}
      {f >= 300 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: b3 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <Spark frame={f} at={312} size={48} />
            <KineticText
              frame={f}
              text="Now make it yours"
              at={320}
              unit="word"
              stagger={6}
              dur={28}
              rise={40}
              style={{
                fontFamily: FONT.display,
                fontSize: 110,
                fontWeight: 600,
                color: C.ink,
                lineHeight: 1,
                textShadow: "0 2px 40px rgba(0,0,0,0.55)",
              }}
            />
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT.ui,
                fontSize: 27,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: C.bg2,
                background: `linear-gradient(120deg, ${C.accentBright}, ${C.accent})`,
                borderRadius: 999,
                padding: "17px 42px",
                opacity: ramp(f, 352, 372, EASE_CEREMONIAL),
                transform: `translateY(${(1 - ramp(f, 352, 372, EASE_CEREMONIAL)) * 20}px) scale(${1 + Math.max(0, Math.sin((f - 372) * 0.09)) * 0.03})`,
                boxShadow: `0 10px 34px rgba(0,0,0,0.45), 0 0 22px ${C.accent}66`,
              }}
            >
              Point your agent at AGENTS.md
            </div>
          </div>
        </AbsoluteFill>
      )}
    </Camera>
  );
};
