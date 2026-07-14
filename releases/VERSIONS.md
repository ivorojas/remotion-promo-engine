# Release history

Every render worth keeping goes here with a version number. `out/` is
disposable (overwritten every render); **this folder is the history**.

| Version | File | What it contains |
|---|---|---|
| demo | `demo.mp4` | The engine demoing itself (3 beats, synthesized audio, no voice). |

When you produce promos: `node scripts/master.mjs out/promo.mp4`, then copy
here as `<product>-v<N>-<short-desc>.mp4` and add a row. Never overwrite a
version the user approved — new file, new row.
