// ── EXAMPLE locale map (EN master → ES clone) ───────────────────────────────
// Copy to locales/es.mjs, list every scene file and every visible string.
// Tips learned the hard way:
//   · translate MEANING, not words (use the product's real labels per locale)
//   · duration consts belong here too (other languages speak longer — stretch
//     the clone's scene durations, never the master's)
//   · accents matter for TTS: "Léela" is pronounced correctly, "Leela" is not
export default {
  srcDir: "src/scenes",
  dstDir: "src/es/scenes",
  // scene imports go one level deeper in the clone
  importRewrite: [['from "../', 'from "../../']],
  files: {
    "Demo.tsx": [
      ['text="Promo Engine"', 'text="Promo Engine"'],
      ['text="Cinematic promos, written in code."', 'text="Promos de cine, escritos en código."'],
      ['text="Now make it yours"', 'text="Ahora hazlo tuyo"'],
    ],
  },
};
