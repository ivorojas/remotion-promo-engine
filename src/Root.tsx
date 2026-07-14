// ── Composition registry ────────────────────────────────────────────────────
// "Demo" is the engine's showcase — study it, then register YOUR compositions
// here (one per promo, plus one per scene while iterating: rendering a single
// scene with local frame numbers is much faster than hunting global frames).

import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import { Demo, DEMO_DUR } from "./scenes/Demo";
import { Starfield, Vignette } from "./lib/Starfield";
import { LightSweep } from "./lib/LightSweep";
import { Audio, Sequence, staticFile } from "remotion";
import { C, FPS, H, W } from "./theme";

const DemoComposition: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg3 }}>
      {/* the WORLD: global, continuous — scenes only transition their content */}
      <AbsoluteFill style={{ transform: `scale(${1 + (f / DEMO_DUR) * 0.05})` }}>
        <Starfield frame={f} />
      </AbsoluteFill>
      <Demo />
      {/* ONE transition motif, at every boundary */}
      <LightSweep frame={f} at={127} />
      <LightSweep frame={f} at={287} />
      <Vignette strength={0.5} />
      {/* demo SFX (synthesized by scripts/gen-sfx.mjs — run `npm run sfx`) */}
      <Audio src={staticFile("audio/music.wav")} volume={0.3} />
      <Sequence from={12} durationInFrames={70}>
        <Audio src={staticFile("audio/chime.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={127} durationInFrames={70}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.27} />
      </Sequence>
      <Sequence from={210} durationInFrames={70}>
        <Audio src={staticFile("audio/flick.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={287} durationInFrames={70}>
        <Audio src={staticFile("audio/whoosh.wav")} volume={0.27} />
      </Sequence>
      <Sequence from={312} durationInFrames={70}>
        <Audio src={staticFile("audio/chime.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={352} durationInFrames={70}>
        <Audio src={staticFile("audio/pop.wav")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Demo" component={DemoComposition} durationInFrames={DEMO_DUR} fps={FPS} width={W} height={H} />
  </>
);
