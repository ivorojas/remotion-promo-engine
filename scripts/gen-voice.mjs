// ── VOICE (ElevenLabs) — optional layer, with CACHING ───────────────────────
// Generates each narration line as public/audio/vo-N.mp3.
// - API key: .env → ELEVENLABS_API_KEY (copy .env.example). NEVER commit it.
// - Model: eleven_multilingual_v2 (best stable quality; it detects the
//   LANGUAGE from the text — the same voice speaks EN/ES/FR/…).
// - CACHE (public/audio/vo-manifest.json): a line is only re-billed if its
//   TEXT or the VOICE changed. Regenerate one line: `node scripts/gen-voice.mjs 3`.
//   Force all: --force.
// - Voice: set ELEVENLABS_VOICE=Name in .env, or the first match from
//   PREFERRED below (deep/warm narration voices) is used.
//
// WRITE YOUR SCRIPT in LINES below. Craft rules (see METHOD.md):
//   · voice ACCOMPANIES the scene: read the on-screen title, then ADD while
//     the animation plays — don't just read labels, and never leave long
//     silent tails.
//   · write for the EAR: short sentences, commas where you want breath.
//   · accents/diacritics in the text steer TTS pronunciation AND accent
//     (e.g. Spanish "Léela" is pronounced right, "Leela" is not; tuteo vs
//     voseo steers the regional accent).
//   · the final CTA line should be its OWN short sentence — terminal falling
//     intonation ("Try it now. Free.") instead of a trailing comma.
// After generating, MEASURE each line (ffprobe) and place it on the timeline:
//   npx remotion ffprobe -v error -show_entries format=duration \
//     -of default=noprint_wrappers=1:nokey=1 public/audio/vo-1.mp3

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(DIR, "public", "audio");
const MANIFEST = path.join(OUT, "vo-manifest.json");
fs.mkdirSync(OUT, { recursive: true });

const envFile = path.join(DIR, ".env");
const env = fs.existsSync(envFile)
  ? Object.fromEntries(
      fs
        .readFileSync(envFile, "utf8")
        .split("\n")
        .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
    )
  : {};
const KEY = env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Missing ELEVENLABS_API_KEY — copy .env.example to .env and fill it in.");
  process.exit(1);
}

const MODEL = "eleven_multilingual_v2";

// ── YOUR SCRIPT — replace these examples with your promo's lines ────────────
export const LINES = [
  { n: 1, text: "This is your product." },
  { n: 2, text: "A promo, written in code." },
];

// deep/warm narration voices, first existing match wins (or ELEVENLABS_VOICE)
const PREFERRED = ["Callum", "Brian", "Daniel", "George", "Bill", "Adam"];

const H = { "xi-api-key": KEY };

async function main() {
  const vRes = await fetch("https://api.elevenlabs.io/v1/voices", { headers: H });
  if (!vRes.ok) throw new Error("voices: " + vRes.status + " " + (await vRes.text()));
  const { voices } = await vRes.json();
  const want = env.ELEVENLABS_VOICE || process.env.ELEVENLABS_VOICE;
  let voice = null;
  const prefs = want ? [want, ...PREFERRED] : PREFERRED;
  for (const name of prefs) {
    voice = voices.find((v) => v.name?.toLowerCase().startsWith(name.toLowerCase()));
    if (voice) break;
  }
  if (!voice) voice = voices[0];
  console.log("Voice:", voice.name, `(${voice.voice_id})`);

  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  const force = process.argv.includes("--force");
  const onlyArg = process.argv.find((a) => /^\d+$/.test(a));
  const only = onlyArg ? Number(onlyArg) : null;

  let chars = 0;
  let skipped = 0;
  for (const line of LINES) {
    if (only && line.n !== only) continue;
    const file = path.join(OUT, `vo-${line.n}.mp3`);
    const key = `vo-${line.n}`;
    const entry = manifest[key];
    const unchanged =
      entry && entry.text === line.text && entry.voiceId === voice.voice_id && entry.model === MODEL;
    if (!force && unchanged && fs.existsSync(file)) {
      skipped++;
      continue; // cache hit → zero credits
    }
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { ...H, "content-type": "application/json" },
        body: JSON.stringify({
          text: line.text,
          model_id: MODEL,
          voice_settings: { stability: 0.55, similarity_boost: 0.85, style: 0.4, use_speaker_boost: true },
        }),
      },
    );
    if (!res.ok) throw new Error(`line ${line.n}: ${res.status} ${await res.text()}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    manifest[key] = { text: line.text, voiceId: voice.voice_id, voiceName: voice.name, model: MODEL };
    chars += line.text.length;
    console.log(`✓ vo-${line.n}.mp3 — "${line.text}"`);
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`Generated: ${chars} characters · cache-skipped: ${skipped}`);
}

main();
