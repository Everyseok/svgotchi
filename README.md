<h1 align="center">SVGotchi</h1>

<p align="center">
  <img src="assets/base-character.svg" alt="SVGotchi character preview" width="180" />
</p>

<p align="center">
  <strong>A local-first SVG companion prototype with browser-side emotion inference.</strong>
</p>

<p align="center">
  Run a pure SVG app locally, type a prompt into the character, and let the browser map emotion evidence into deterministic character motion.
</p>

<p align="center">
  <a href="https://github.com/Everyseok/svgotchi">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Runtime-Node%2024%2B-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node 24+" />
  <img src="https://img.shields.io/badge/App-Pure%20SVG-FFB13B?style=for-the-badge" alt="Pure SVG" />
  <img src="https://img.shields.io/badge/Inference-Browser%20Local-2563EB?style=for-the-badge" alt="Browser Local Inference" />
  <img src="https://img.shields.io/badge/Status-Prototype-2F3640?style=for-the-badge" alt="Prototype" />
</p>

---

## What is SVGotchi?

**SVGotchi** is an experimental SVG Tamagotchi-style prototype. The app opens as an SVG document, not an HTML wrapper, and keeps the interaction loop local:

- the static server only serves SVG, JavaScript, WASM, tokenizer, and model files
- prompt text is handled by browser code
- emotion classification runs in the browser after explicit local model setup
- SVGotchi-owned code maps model labels and scores into safe deterministic character poses

No hosted inference API, backend model service, or silent runtime model download is used.

---

## Preview

<p align="center">
  <img src="docs/assets/readme/svgotchi-preview.gif" alt="SVGotchi full mode preview" width="72%" />
</p>

Additional screenshot slots can be added under `docs/assets/readme/` later:

- `docs/assets/readme/svgotchi-full-mode.png`
- `docs/assets/readme/svgotchi-demo-mode.png`

---

## Start From Zero

Use this path on a fresh computer or a folder that does not have the project yet.

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run setup-model -- --yes
npm run serve
```

Then open the local URL printed by the terminal. The default is:

```text
http://127.0.0.1:4173/?mode=full
```

`setup-model` downloads and verifies the local model/runtime assets. The expected payload is about **164 MiB** and is stored in ignored local folders:

- `models/`
- `runtime/`

These large files are not committed to Git.

---

## Demo Without Model Setup

If you only want to confirm the SVG app opens, use deterministic demo mode:

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run serve:demo
```

Demo mode does not require `models/` or `runtime/`.

---

## Requirements

| Requirement | Version / Note |
|---|---|
| Node.js | `>= 24.0.0` |
| npm | bundled with Node |
| Git | needed for source checkout |
| Browser | modern Chromium/Safari/Firefox browser |
| Network | required once for `setup-model` |

Check Node before installing:

```bash
node -v
```

If `node -v` itself crashes on macOS with a missing Homebrew `.dylib`, reinstall Node with your preferred tool before running the project. For Homebrew users:

```bash
brew reinstall node
```

---

## Commands

| Command | Purpose |
|---|---|
| `npm run serve` | Start full local model mode. Requires `setup-model` first. |
| `npm run serve:demo` | Start deterministic demo mode without model files. |
| `npm run setup-model` | Ask before downloading local model/runtime files. |
| `npm run setup-model -- --yes` | Download local model/runtime files without the prompt. |
| `npm run verify:model` | Verify local model/runtime file size and SHA-256 hashes. |
| `npm test` | Run the model-free baseline test suite. |
| `npm run test:model` | Run model/runtime integration tests after setup. |
| `npm run verify` | Run typecheck, browser syntax check, and baseline tests. |
| `npm run verify:release` | Run the full release verification suite. Requires model setup. |

Stop the local server with `Ctrl+C`.

---

## Troubleshooting

### `Full local model mode requires local model assets.`

`npm run serve` starts full mode. Run setup once:

```bash
npm run setup-model -- --yes
npm run serve
```

### `npm ERR! 404 Not Found - svgotchi`

The npm package is not published yet. Do not use `npx svgotchi` for now. Use the GitHub source checkout:

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
```

### Browser did not open automatically

Open the printed URL manually:

```text
http://127.0.0.1:4173/?mode=full
```

If port `4173` is busy, the server tries the next available port and prints the actual URL.

### `node` crashes before npm runs

This is a local Node installation problem, not an SVGotchi code problem. Reinstall Node, then retry:

```bash
node -v
npm ci
```

---

## Current Project Status

- Pure SVG app surface with browser-loaded JavaScript
- Deterministic demo mode that works without model files
- Full local model mode with explicit asset setup and verification
- Local emotion model: `onnx-community/tanaos-emotion-detection-v1-ONNX`
- Static localhost server for SVG, JS, WASM, tokenizer, and model files
- Baseline test suite for character contract, prompt input, emotion pose mapping, transitions, and rig validation

---

## Model Boundary

The model returns labels and scores. SVGotchi code owns the rest of the behavior.

The model must not generate:

- reply text
- raw SVG
- CSS
- JavaScript
- DOM selectors
- path data
- animation code

The app maps model evidence into a sanitized transition plan before changing the character pose.

---

## Repository Notes

This repository is currently source-first. The README uses `git clone` and `npm run ...` commands because the npm package name is not published yet.

When a package release exists, the install section can add `npx svgotchi` commands back as the primary path.

---

## Author

**Jun Seok Kim**<br />
GitHub: [@Everyseok](https://github.com/Everyseok)

---

<p align="center">
  <strong>Local SVG companion. Browser-owned emotion. No backend inference.</strong>
</p>
