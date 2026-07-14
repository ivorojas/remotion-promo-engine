# AGENTS.md — how an AI coding agent uses this engine

You are an AI coding agent (Claude Code, Codex, Cursor, Copilot Workspace…)
and your user wants a **cinematic product promo video** for THEIR app. This
repo is a complete, proven engine for that job. Read this file, then
**METHOD.md** (the craft rules — they are the difference between "a video"
and "a promo that looks expensive"), then skim the headers of `src/lib/*`.

## What this is

- **Remotion**: the video is a tree of React components; every frame is a
  deterministic render; `npx remotion render` produces a real MP4 (headless
  Chrome + ffmpeg). You never "record" anything — you *author* frames.
- **The engine** (`src/lib/`): Camera (promo punch-ins), KineticText, TitleCard,
  FlipCard (3D card/screenshot flips with material gloss), Cursor (demonstrates
  clicks/drags), LightSweep (the one transition), Particles, Spark,
  Starfield/Vignette (ambient world) — all pure functions of the frame, all
  styled through `src/theme.ts` tokens.
- **Optional layers**, each independent:
  1. **Video only** — works out of the box.
  2. **SFX + music** — `npm run sfx` synthesizes original audio from pure math
     (no third-party copyright). Wire `<Audio>` tags like `src/Root.tsx` does.
  3. **Voice** — needs the user's ElevenLabs API key in `.env`
     (copy `.env.example`). `scripts/gen-voice.mjs` has caching so unchanged
     lines are never re-billed.

## Install into a user's project

Two options — ask the user which they prefer:

- **A. Subfolder of their app repo (recommended)**: copy this whole repo into
  `<their-app>/video/`, run `npm install` inside it. ⚠️ **CRITICAL**: add
  `"video"` to the HOST app's `tsconfig.json` `exclude` — otherwise the host's
  type-check/build (Next.js, Vite, CI) will try to compile the video project
  and fail on its private dependencies. Also gitignore `video/node_modules`
  and `video/out` in the host repo.
- **B. Standalone sibling repo**: clone as its own project next to the app.

Then: `npm install` → `npm run sfx` → `npm run render` → confirm
`out/demo.mp4` plays. Now you know the pipeline works end to end.

## The workflow (follow in order)

1. **Harvest the brand.** Open the user's app code. Copy their real colors
   (CSS variables / design tokens) and their real fonts into `src/theme.ts`
   (if Google Fonts, `@remotion/google-fonts` matches pixel-exactly). Copy
   their REAL assets (screenshots, product art, logos) into `public/`.
   Never invent a lookalike brand — reuse the real one. That, more than
   anything, is why the result looks premium.
2. **Write the shot list with the user.** One scene per feature/beat. Ask
   what to show; propose an arc: hero → core magic → features → finale + CTA.
3. **Build scenes** in `src/scenes/` (study `Demo.tsx`, then replace it).
   One component per scene, choreography written as frame-numbered comments
   at the top. Compose an assembler like `Demo`'s pattern but with a
   `SCENES[]` + computed `ANCHOR[]` list when you have many scenes.
4. **Verify with stills, not full renders.** Render single frames at the
   enter / middle / end of every animation and LOOK at them:
   `npx remotion still src/index.ts <CompId> out/check.png --frame=N`
   Fix what's wrong; only then render the full video. (If you can view
   images, view them; if not, have the user look.)
5. **Audio pass** (optional layers): run `npm run sfx` (regenerate music with
   `--music <videoSeconds + 3>`), write the voice LINES in
   `scripts/gen-voice.mjs`, generate, **measure every line with ffprobe**,
   place lines at exact frames with ducking (see METHOD.md §Audio), add SFX
   at each visual beat.
6. **Render + master**: `npm run render` → `node scripts/master.mjs out/….mp4`
   (normalizes to -15.5 LUFS with a true-peak limiter).
7. **Version every keeper**: copy to `releases/<name>-v<N>-<desc>.mp4` and
   keep a `releases/VERSIONS.md` table. `out/` is disposable; `releases/` is
   the history the user browses.
8. **Iterate by numbers.** The user gives feedback ("the whoosh masks the
   voice", "that title is hidden"); you change a number or a line and
   re-render. Never rebuild from scratch.

## Ground rules (non-negotiable, from METHOD.md)

- Everything is a pure function of `frame` — no state, no `Math.random()`
  (use remotion's seeded `random()`).
- ONE transition motif. One easing family. The camera does the "wow", not
  a pile of effects.
- Text is always born visible (use TitleCard `compact` when the center is
  occupied). Verify with stills.
- Voice **accompanies** (reads the section title, then adds context while the
  animation plays); it never reads data labels off the screen; transitions
  sit ~0.27 volume, well under the voice.
- Make honest claims only. Don't promise "free" unless the user's business
  model is settled (a "free to start" CTA is usually safe — ask).
- Bilingual? `scripts/clone-locale.mjs` — master locale untouched, clones
  re-generated from a fail-loud map. Re-measure voice; other languages run
  longer — stretch the clone's scene durations, never the master's.

## Cost notes for the user

- Remotion: free for individuals & small teams (larger companies need their
  company license — remotion.dev/license).
- ElevenLabs: only for the voice layer. A ~90s bilingual promo with generous
  retakes ≈ 3–4k characters; the $6/mo Starter tier (30k) is plenty, and the
  caching in `gen-voice.mjs` keeps retakes cheap. Free tier works for testing
  but does NOT include a commercial license.
