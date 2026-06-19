# SVGotchi

SVGotchi is an experimental local-first SVG Tamagotchi prototype with deterministic animation and a browser-local emotion model path.

The current character uses the uploaded composed asset `assets/1.png` as its base inside the SVG app shell. Non-neutral emotions add app-owned SVG expression overlays for eyes, mouth, brows, blush, and effects so the character visibly reacts while preserving the SVG prompt, deterministic transitions, and browser-local model boundary.

## Install

### Deterministic Demo

```bash
npx svgotchi demo
```

This mode uses small committed assets and does not require model setup.

### Full Local Model Mode

```bash
npx svgotchi setup-model
npx svgotchi serve
```

`setup-model` asks before installing the large local model files and verifies them by size and SHA-256 hash.

`serve` starts a localhost static file server. Localhost only serves SVG, JS, WASM, tokenizer, and model files. It is not a model backend; inference is designed to run in the browser.

The opened app surface is an SVG document, not an HTML wrapper or HTML form UI.

### Guided Mode

```bash
npx svgotchi
```

Guided mode checks whether model assets exist, offers setup when needed, then starts the static server.

### Source Checkout

```bash
git clone <repo>
cd svgotchi
npm install
npm run setup-model
npm run serve
```

## Commands

```bash
svgotchi
svgotchi demo
svgotchi setup-model
svgotchi serve
svgotchi verify-model
```

Development commands:

```bash
npm test
npm run test:model
npm run verify:model
npm run serve:smoke
npm run verify:browser
npm run verify:served-svg
npm run verify
npm run verify:release
```

`npm test` runs the baseline model-free test suite. `npm run test:model` and `npm run verify:release` require the full local model/runtime assets from `setup-model`.

## Distribution Boundary

Large model files are not committed to Git. GitHub Pages is limited to deterministic demo use. Full local model mode is an npm/npx experience with explicit setup and browser-side inference.

No external inference APIs, hosted Hugging Face inference, backend model service, or runtime model download is allowed.

## Current Model Boundary

The current full mode uses `onnx-community/tanaos-emotion-detection-v1-ONNX` as a local browser-side emotion classifier. The model returns labels and scores; SVGotchi-owned code maps that evidence into a sanitized `TransitionPlan` for the SVG rig. The model must not generate reply text, raw SVG, CSS, JavaScript, DOM selectors, path data, or animation code.
