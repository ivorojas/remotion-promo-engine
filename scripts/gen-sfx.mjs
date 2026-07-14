// ── SFX + MUSIC SYNTHESIZER (offline, pure Node — zero dependencies) ────────
// Generates every sound in public/audio/ from pure math → the audio is 100%
// YOURS, no third-party copyright, no sample packs. Deterministic (seeded LCG,
// never Math.random): running it twice produces identical bytes.
//
// Run:   node scripts/gen-sfx.mjs                (music defaults to 16s)
//        node scripts/gen-sfx.mjs --music 95     (one music length)
//        node scripts/gen-sfx.mjs --music 95 --music-out music-es.wav
//          (write a second length to another file — e.g. a longer locale cut —
//           WITHOUT touching the first one's fade)
//
// Sounds: chime (soft bell — highlights, placements) · whoosh (transitions —
// keep its mix volume LOW, ~0.27, so it never masks the voice) · pop (element
// lands) · tick (tiny click — carousels, UI clicks) · flick (dry card/paper
// flick — for flips; deliberately NO whoosh inside: interaction sounds must
// stay dry, transitions own the whoosh) · riffle (accelerating card riffle) ·
// music (an ambient chord pad; edit PROG for your mood).
// To tweak a sound: change its numbers and re-run. Remotion picks them up.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
fs.mkdirSync(OUT, { recursive: true });

const RATE = 44100;
const TAU = Math.PI * 2;

// deterministic LCG (no Math.random)
let seed = 20260101;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};

// ── WAV writer (PCM16, mono or stereo) ──────────────────────────────────────
function writeWav(file, chL, chR = null) {
  const nCh = chR ? 2 : 1;
  const n = chL.length;
  const data = Buffer.alloc(n * nCh * 2);
  for (let i = 0; i < n; i++) {
    const l = Math.max(-1, Math.min(1, chL[i]));
    data.writeInt16LE((l * 32767) | 0, i * nCh * 2);
    if (chR) {
      const r = Math.max(-1, Math.min(1, chR[i]));
      data.writeInt16LE((r * 32767) | 0, i * nCh * 2 + 2);
    }
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(nCh, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * nCh * 2, 28);
  h.writeUInt16LE(nCh * 2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
  console.log("✓", path.basename(file), (data.length / 1024 / 1024).toFixed(2) + "MB");
}

const buf = (secs) => new Float32Array(Math.round(secs * RATE));
const normalize = (b, peak = 0.88) => {
  let m = 0;
  for (const v of b) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < b.length; i++) b[i] = (b[i] / m) * peak;
  return b;
};

/** soft bell (short attack + exponential decay) summed into the buffer */
function bellInto(b, t0, f0, { partials = [1, 1.5, 2], amps = [1, 0.4, 0.2], taus = [0.5, 0.32, 0.22], gain = 1, attack = 0.008 } = {}) {
  const start = Math.round(t0 * RATE);
  for (let p = 0; p < partials.length; p++) {
    const f = f0 * partials[p];
    const a = amps[p] * gain;
    const tau = taus[p];
    const dur = Math.min(tau * 5, 3);
    const n = Math.min(Math.round(dur * RATE), b.length - start);
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      const env = Math.min(t / attack, 1) * Math.exp(-t / tau);
      b[start + i] += Math.sin(TAU * f * t) * env * a;
    }
  }
}

/** cardboard snap: HP noise burst + a small body thump */
function snapInto(b, t0, gain = 1) {
  const start = Math.round(t0 * RATE);
  let prev = 0;
  const nN = Math.round(0.016 * RATE);
  for (let i = 0; i < nN && start + i < b.length; i++) {
    const w = rnd();
    const hp = w - prev * 0.7;
    prev = w;
    const env = Math.exp(-i / (0.005 * RATE));
    b[start + i] += hp * env * 0.8 * gain;
  }
  const nB = Math.round(0.045 * RATE);
  for (let i = 0; i < nB && start + i < b.length; i++) {
    const t = i / RATE;
    b[start + i] += Math.sin(TAU * 155 * t) * Math.exp(-t / 0.014) * 0.5 * gain;
  }
}

/** whoosh: noise through a swept band-pass (swept LP − low LP) */
function whooshInto(b, t0, dur, { fFrom = 350, fTo = 2600, gain = 1 } = {}) {
  const start = Math.round(t0 * RATE);
  let lp1 = 0,
    lp2 = 0;
  const n = Math.min(Math.round(dur * RATE), b.length - start);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const fc = fFrom * Math.pow(fTo / fFrom, t);
    const k = Math.min(1, (TAU * fc) / RATE);
    const k2 = Math.min(1, (TAU * fc * 0.35) / RATE);
    const w = rnd();
    lp1 += k * (w - lp1);
    lp2 += k2 * (w - lp2);
    const bp = lp1 - lp2;
    const env = Math.pow(Math.sin(Math.PI * t), 1.4);
    b[start + i] += bp * env * 2.2 * gain;
  }
}

// ── chime.wav ────────────────────────────────────────────────────────────────
{
  const b = buf(2.0);
  bellInto(b, 0, 659.25, { gain: 0.9 });
  bellInto(b, 0.012, 329.63, { partials: [1], amps: [0.3], taus: [0.9], gain: 0.9 });
  writeWav(path.join(OUT, "chime.wav"), normalize(b, 0.8));
}

// ── whoosh.wav ───────────────────────────────────────────────────────────────
{
  seed = 777;
  const b = buf(1.2);
  whooshInto(b, 0, 1.1, { fFrom: 300, fTo: 2600, gain: 1 });
  writeWav(path.join(OUT, "whoosh.wav"), normalize(b, 0.7));
}

// ── riffle.wav — accelerating card riffle ───────────────────────────────────
{
  seed = 4242;
  const b = buf(1.0);
  const SNAPS = 12;
  for (let i = 0; i < SNAPS; i++) {
    const t = 0.04 + 0.72 * Math.pow(i / (SNAPS - 1), 1.3) + rnd() * 0.008;
    snapInto(b, t, 0.75 + rnd() * 0.2);
  }
  writeWav(path.join(OUT, "riffle.wav"), normalize(b, 0.75));
}

// ── pop.wav — an element lands ──────────────────────────────────────────────
{
  seed = 99;
  const b = buf(0.7);
  snapInto(b, 0, 1);
  for (let i = 0; i < Math.round(0.09 * RATE); i++) {
    const t = i / RATE;
    b[i] += Math.sin(TAU * 118 * t) * Math.exp(-t / 0.03) * 0.5;
  }
  bellInto(b, 0.03, 1318.5, { partials: [1], amps: [0.18], taus: [0.18], gain: 1 });
  writeWav(path.join(OUT, "pop.wav"), normalize(b, 0.7));
}

// ── flick.wav — DRY card/paper flick (flips). No whoosh here on purpose. ────
{
  seed = 1313;
  const b = buf(0.9);
  snapInto(b, 0.02, 0.9);
  snapInto(b, 0.075, 1.0);
  snapInto(b, 0.135, 0.7);
  bellInto(b, 0.17, 1975, { partials: [1], amps: [0.09], taus: [0.12], gain: 1 });
  bellInto(b, 0.21, 2637, { partials: [1], amps: [0.06], taus: [0.1], gain: 1 });
  writeWav(path.join(OUT, "flick.wav"), normalize(b, 0.7));
}

// ── tick.wav — tiny click (carousels, UI clicks) ────────────────────────────
{
  seed = 555;
  const b = buf(0.12);
  let prev = 0;
  for (let i = 0; i < Math.round(0.006 * RATE); i++) {
    const w = rnd();
    const hp = w - prev * 0.6;
    prev = w;
    b[i] += hp * Math.exp(-i / (0.0018 * RATE)) * 0.9;
  }
  bellInto(b, 0.002, 1568, { partials: [1], amps: [0.25], taus: [0.045], gain: 1 });
  writeWav(path.join(OUT, "tick.wav"), normalize(b, 0.6));
}

// ── music.wav — ORIGINAL ambient chord pad (stereo) ─────────────────────────
// Each note = sine + faint octave, slow attack/decay, subtle L/R detune →
// stereo width. + low-passed noise "air". Edit PROG for your mood; duration
// must cover your video + a fade tail. CLI: --music <seconds>.
{
  const args = process.argv.slice(2);
  const mIdx = args.indexOf("--music");
  const DUR = mIdx >= 0 ? Number(args[mIdx + 1]) : 16;
  const oIdx = args.indexOf("--music-out");
  const MFILE = oIdx >= 0 ? args[oIdx + 1] : "music.wav";

  seed = 20260101;
  const L = buf(DUR);
  const R = buf(DUR);
  const PROG = [
    [110.0, 164.81, 220.0, 261.63], // Am
    [87.31, 130.81, 174.61, 220.0], // F
    [98.0, 146.83, 196.0, 246.94], // G
    [110.0, 164.81, 220.0, 261.63], // Am (home)
  ];
  // repeat the progression enough times to fill DUR at ~4s per chord
  const reps = Math.max(1, Math.round(DUR / (PROG.length * 4)));
  const chords = Array.from({ length: reps }, () => PROG).flat();
  const SEG = DUR / chords.length;
  const XF = Math.min(1.4, SEG * 0.35);
  for (let c = 0; c < chords.length; c++) {
    const t0 = c * SEG;
    const notes = chords[c];
    for (let nI = 0; nI < notes.length; nI++) {
      const f = notes[nI];
      const detL = 1 - 0.0012 - nI * 0.0002;
      const detR = 1 + 0.0012 + nI * 0.0002;
      const amp = nI === 0 ? 0.3 : 0.2;
      const start = Math.round(t0 * RATE);
      const segN = Math.min(Math.round((SEG + XF) * RATE), L.length - start);
      const phL = rnd() * TAU;
      const phR = rnd() * TAU;
      for (let i = 0; i < segN; i++) {
        const t = i / RATE;
        const aIn = Math.min(t / 1.3, 1);
        const aOut = Math.min((SEG + XF - t) / XF, 1);
        const env = Math.min(aIn, Math.max(aOut, 0));
        if (env <= 0) continue;
        const breathe = 0.85 + 0.15 * Math.sin(TAU * 0.11 * (t0 + t) + nI);
        const g = amp * env * breathe;
        L[start + i] += (Math.sin(TAU * f * detL * t + phL) + 0.3 * Math.sin(TAU * f * 2 * detL * t)) * g;
        R[start + i] += (Math.sin(TAU * f * detR * t + phR) + 0.3 * Math.sin(TAU * f * 2 * detR * t)) * g;
      }
    }
  }
  let lpL = 0,
    lpR = 0;
  for (let i = 0; i < L.length; i++) {
    const k = (TAU * 240) / RATE;
    lpL += k * (rnd() - lpL);
    lpR += k * (rnd() - lpR);
    L[i] += lpL * 0.05;
    R[i] += lpR * 0.05;
  }
  for (let i = 0; i < L.length; i++) {
    const t = i / RATE;
    const g = Math.min(t / 0.8, 1) * Math.min(Math.max((DUR - t) / 2.5, 0), 1);
    L[i] *= g;
    R[i] *= g;
  }
  normalize(L, 0.72);
  normalize(R, 0.72);
  writeWav(path.join(OUT, MFILE), L, R);
}

console.log("Done. WAVs in public/audio/");
