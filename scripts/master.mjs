// ── MASTER: normalize the final mix to broadcast loudness ───────────────────
// Measures the rendered file's integrated loudness, then applies loudnorm
// (with its built-in true-peak limiter — safe even when a plain dB gain would
// clip) targeting -15.5 LUFS / -1.5 dBTP, the sweet spot for social/web.
// The VIDEO stream is copied untouched (-c:v copy) — only audio is re-encoded.
//
// Run:  node scripts/master.mjs out/promo.mp4
// The file is replaced in place; before/after numbers are printed.

import { spawnSync } from "child_process";
import fs from "fs";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("Usage: node scripts/master.mjs <rendered.mp4>");
  process.exit(1);
}

const TARGET_I = -15.5;
const TARGET_TP = -1.5;

function ff(args) {
  const r = spawnSync("npx", ["remotion", "ffmpeg", ...args], {
    encoding: "utf8",
    shell: true,
    maxBuffer: 64 * 1024 * 1024,
  });
  return (r.stdout || "") + (r.stderr || "");
}

function measure(f) {
  const out = ff(["-i", f, "-vn", "-af", "loudnorm=print_format=summary", "-f", "null", "-"]);
  const i = out.match(/Input Integrated:\s*([-\d.]+)/);
  const tp = out.match(/Input True Peak:\s*([-\d.]+)/);
  return { i: i ? Number(i[1]) : null, tp: tp ? Number(tp[1]) : null };
}

const before = measure(file);
console.log(`before: ${before.i} LUFS · ${before.tp} dBTP`);
if (before.i !== null && Math.abs(before.i - TARGET_I) < 0.8) {
  console.log("already within ±0.8 LU of target — nothing to do.");
  process.exit(0);
}

const tmp = file.replace(/\.mp4$/i, ".master-tmp.mp4");
ff([
  "-y",
  "-i",
  file,
  "-c:v",
  "copy",
  "-af",
  `loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=11`,
  "-c:a",
  "aac",
  "-b:a",
  "320k",
  tmp,
]);
if (!fs.existsSync(tmp)) {
  console.error("master failed — temp file not produced.");
  process.exit(1);
}
fs.renameSync(tmp, file);

const after = measure(file);
console.log(`after:  ${after.i} LUFS · ${after.tp} dBTP → ${file}`);
