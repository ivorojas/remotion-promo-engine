// ── EASINGS + KEYFRAMES: the core of the engine ─────────────────────────────
// Golden rule: EVERYTHING is a PURE function of the current frame. No state,
// no effects, no Math.random(). Every frame renders deterministically, so a
// re-render is identical, ghost trails are free (same function at frame-2),
// and you can tweak one number and re-render without surprises.

import { Easing } from "remotion";

export type Ease = (t: number) => number;

/** ceremonial entrance (soft quintic out) — titles, elements appearing */
export const EASE_CEREMONIAL: Ease = Easing.bezier(0.22, 1, 0.36, 1);
/** dramatic reveal (fast start, soft landing) — hero flips, big moments */
export const EASE_DRAMATIC: Ease = Easing.bezier(0.16, 0.8, 0.24, 1);
/** even flip — quick interactions */
export const EASE_FLIP: Ease = Easing.bezier(0.4, 0, 0.25, 1);
/** camera moves / anything that travels and settles */
export const EASE_INOUT: Ease = Easing.bezier(0.64, 0, 0.36, 1);
/** linear (ambient drift) */
export const LINEAR: Ease = (t) => t;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * `ramp(frame, from, to)` → eased progress 0..1, clamped.
 * The smallest unit of every animation in this engine.
 */
export function ramp(
  frame: number,
  from: number,
  to: number,
  ease: Ease = EASE_CEREMONIAL,
): number {
  if (to <= from) return frame >= to ? 1 : 0;
  return ease(clamp01((frame - from) / (to - from)));
}

/**
 * `kf(frame, [f0,f1,f2], [v0,v1,v2])` → keyframe interpolation with the
 * easing applied PER SEGMENT (guaranteed behavior). Clamps outside the range.
 */
export function kf(
  frame: number,
  frames: number[],
  values: number[],
  ease: Ease = EASE_INOUT,
): number {
  const n = Math.min(frames.length, values.length);
  if (n === 0) return 0;
  if (frame <= frames[0]) return values[0];
  if (frame >= frames[n - 1]) return values[n - 1];
  let i = 0;
  while (i < n - 2 && frame > frames[i + 1]) i++;
  const t = clamp01((frame - frames[i]) / (frames[i + 1] - frames[i]));
  return values[i] + (values[i + 1] - values[i]) * ease(t);
}

/** simple lerp */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** bell 0→1→0 centered at `center` with `width` (for passing glints) */
export function bell(x: number, center: number, width: number): number {
  const d = Math.abs(x - center) / width;
  return d >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * d);
}
