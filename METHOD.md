# METHOD.md — the craft rules

Objective, project-agnostic rules distilled from building a full production
promo (a ~100s bilingual product tour) with this engine. They are what make
the output read as "an expensive studio promo" instead of "a slideshow".
Follow them unless the user explicitly overrides.

## 1 · Motion

- **Pure function of frame.** Position/opacity/scale = `f(frame)` via
  `ramp()`/`kf()`. No React state for animation. Ghost trails come free
  (evaluate the same function at `frame-2`, `frame-4` with lower opacity).
- **The camera is the wow.** Content sits still; the `Camera` glides/punches
  toward what matters (scale ~1.1–1.2, eased, held, released). Focus math:
  to center point P horizontally on a 1920 canvas, translate x = 960 − P.
- **One transition motif** (LightSweep here), reused at every boundary.
  Amateur cuts mix ten transitions; pro cuts repeat one.
- **One easing family.** Entrances `EASE_CEREMONIAL`, travels `EASE_INOUT`,
  hero moments `EASE_DRAMATIC`. Springs only for pops (Spark).
- **Continuous world.** One global ambient background behind all scenes with
  an ultra-slow whole-video zoom (~1→1.05). The universe never cuts; only
  content transitions.
- **Physicality sells 3D.** A flip needs a specular edge peaking at 90° and a
  floor shadow that narrows edge-on (FlipCard does both). During a flip,
  pause the floating bob (`calm = 1 − bell(flip, .5, .6)`).
- **Stagger everything.** Elements enter one by one (3–8 frame offsets), never
  as a block. Letters/words via KineticText.
- **Demonstrate, don't describe.** If the product is interactive, show a
  Cursor clicking/dragging and the UI responding. Mock minimal UI panels in
  the video's own design language rather than pasting low-res screenshots
  when crispness matters.

## 2 · Composition & text

- **Text is born visible.** If a scene's center is occupied (big product art),
  the section title enters already docked at the top (`TitleCard compact`) —
  a centered title that docks later will be hidden behind the content.
- **Docked elements + camera punch interact.** A punch-in pushes top-docked
  titles off-frame; keep dockY ≥ ~160 and avoid vertical camera offsets while
  a header is visible. Verify with stills.
- **Quick answer highlighted, detail dimmed.** For message/reading panels:
  a short bright "in short" line (accent color, larger) + the longer detail
  at ~60% opacity. Reveal text **continuously start→finish** (one flowing
  word-stagger), never block-by-block; no double spaces, no stray newlines.
- **Real data only.** Names, keywords, labels shown on screen must come from
  the product's real data — never invent placeholder facts in the final cut.

## 3 · Audio

- **Voice accompanies.** Read the on-screen section title, then ADD context
  while the animation runs (aim ~85% voice coverage, small breaths). Never
  read data labels (card names, keyword chips) — they're visual. Bridge lines
  across scene cuts deliberately; it feels intentional.
- **Everything placed by measurement.** After generating voice, measure every
  line (`ffprobe … format=duration`), convert to frames, place with ≥6-frame
  gaps. Size each scene to its line (stretch the scene, don't rush the voice).
  Minimize dead air at scene tails.
- **Ducking**: music base ~0.32 → ~0.14 under each voice line with ~6-frame
  ramps (compute windows from the VO table).
- **Transitions never mask the voice**: whoosh at ~0.27, carousel ticks at
  ~0.14, UI pops 0.22–0.3.
- **Interaction sounds are DRY** (card flicks, clicks — no whoosh baked into
  them); the whoosh belongs to transitions only.
- **TTS direction happens in the text**: diacritics fix pronunciation
  ("Léela", not "Leela"); dialect of the words steers the accent (tú vs vos);
  the final CTA must be its own short sentence ("Try it now. Free.") to get
  terminal falling intonation instead of a trailing half-breath.
- **Caching discipline**: generate line-by-line; regenerate only changed
  lines (the manifest handles it); audition voices with ONE short line first.
- **Master, don't guess**: measure LUFS, then `scripts/master.mjs` to
  −15.5 LUFS / −1.5 dBTP (loudnorm's limiter is safe where a blind dB gain
  would clip). Video stream stays copy-through.

## 4 · Copy & honesty

- Sell the outcome, not the tech ("the most precise reading online", not
  "our multi-layer AI architecture"). Avoid buzzwords the viewer can't feel.
- **Don't promise "free"** anywhere unless the business model is settled;
  a final "free to start / try it now, free" CTA is usually acceptable — ask
  the user first.
- Strong claims ("most precise", predictions) are fine for organic posting
  but can be rejected by paid-ads review on some platforms — warn the user.
- Match the product's real UI labels per language (don't literal-translate
  a label the product renders differently).

## 5 · Verification & process

- **Stills before renders.** Render single frames at enter/mid/end of every
  new animation and inspect them. A full render is the LAST step.
- Blends/motion don't read in stills (a moving gloss looks faint frozen) —
  judge those in the MP4 or Remotion Studio.
- **Version keepers** in `releases/` (`name-vN-desc.mp4` + a VERSIONS.md
  table). `out/` is disposable. Never overwrite a version the user approved —
  new file, new row.
- Document decisions as you go (a DECISIONS.md): why, what failed, the
  numbers that ended up right. The next session (or another agent) continues
  in the same style because the style is WRITTEN DOWN.

## 6 · Duration & distribution (2026)

- Reference cut ~60–95s. Platform limits: Instagram Reels ~3 min, YouTube
  Shorts 3 min, TikTok 10 min, X ~2:20 — a 90s cut fits everywhere that
  matters. The only hard short cap is the **App Store preview (15–30s)**;
  Google Play uses a YouTube link (no hard cap). Make the short cut only if
  the user needs those.
- 1920×1080\@30fps is the safe default; add 9:16 and 1:1 compositions from
  the same scenes when the user asks (parameterize scene layout by aspect).
