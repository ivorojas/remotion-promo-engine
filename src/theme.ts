// ── THEME: your brand lives here — THIS IS THE FILE YOU EDIT FIRST ──────────
// The entire engine reads its colors, fonts and canvas from these tokens.
// Replace the placeholder values with YOUR product's identity:
//   1. Colors: copy them from your app's design system / CSS variables.
//   2. Fonts: use the SAME fonts your app uses. If they're Google Fonts,
//      @remotion/google-fonts gives you a pixel-exact match (loads from
//      Google's CDN at render time — network required; for offline, bundle
//      .woff2 files in public/fonts and use @font-face instead).
// Rule: never invent colors inside scenes — always reference these tokens.

import { loadFont as loadDisplay } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadBody } from "@remotion/google-fonts/CrimsonPro";
import { loadFont as loadUi } from "@remotion/google-fonts/Inter";

const display = loadDisplay("normal", { weights: ["500", "600", "700"] });
const bodyItalic = loadBody("italic", { weights: ["400"] });
const ui = loadUi("normal", { weights: ["400", "500", "600"] });

export const FONT = {
  /** headlines / wordmark — a serif reads "premium", swap for your brand font */
  display: display.fontFamily,
  /** taglines / reading text — an italic serif adds warmth */
  bodyItalic: bodyItalic.fontFamily,
  /** eyebrows, small-caps labels, UI chrome */
  ui: ui.fontFamily,
};

export const C = {
  // background (dark → deep; a dark canvas flatters product art and glow)
  bg1: "#12141c",
  bg2: "#0c0e14",
  bg3: "#07080c",
  nebula: "#2a3350", // large soft radial tint behind content
  // ink
  ink: "#ecebe6", // primary text
  inkDim: "#a9adba", // secondary text
  // accent (the "light" of the video: lines, sparks, glows, CTA)
  accent: "#e8b86b",
  accentBright: "#f6d391",
  accentSoft: "#fbe9c4",
};

// Canvas
export const W = 1920;
export const H = 1080;
export const FPS = 30;
