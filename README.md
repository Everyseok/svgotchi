<h1 align="center">SVGotchi</h1>

<p align="center">
  <img src="assets/base-character.svg" alt="SVGotchi character preview" width="180" />
</p>

<p align="center">
  <strong>A local-first AI companion that lives inside an SVG document.</strong>
</p>

<p align="center">
  SVGotchi is an SVG-first experiment: instead of a Python backend, hosted inference API, or normal HTML app shell, the opened SVG document becomes the product surface. Browser JavaScript handles interaction and local inference; TypeScript keeps the setup, verification, contracts, and transition logic under control.
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

## Figure 1. Running Prototype

<p align="center">
  <img src="docs/assets/readme/svgotchi-preview.gif" alt="SVGotchi full mode preview" width="72%" />
</p>

<p align="center">
  The browser opens an SVG document, accepts prompt input, runs local emotion inference, and animates the character rig without a backend prompt-processing service.
</p>

---

## Figure 2. Technical Bet

<p align="center">
  <img src="docs/assets/readme/figure-01-technical-bet.svg" alt="Typical AI prototype stack compared with SVGotchi SVG-first stack" width="100%" />
</p>

---

## Figure 3. Runtime Architecture

<p align="center">
  <img src="docs/assets/readme/figure-02-runtime-architecture.svg" alt="SVGotchi runtime architecture" width="100%" />
</p>

---

## Figure 4. Run and Test Flow

<p align="center">
  <img src="docs/assets/readme/figure-03-run-and-test.svg" alt="SVGotchi run and test flow" width="100%" />
</p>

---

## Run It

Fresh checkout, full local AI mode:

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run setup-model -- --yes
npm run serve
```

Open the URL printed by the terminal. The default is:

```text
http://127.0.0.1:4173/?mode=full
```

Fast visual demo without model setup:

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run serve:demo
```

Stop the local server with `Ctrl+C`.

---

## Test It

```bash
npm test
npm run verify:model
```

Full release verification after model setup:

```bash
npm run verify:release
```

---

## Requirements

| Requirement | Version / Note |
|---|---|
| Node.js | `>= 24.0.0` |
| Browser | Modern Chromium, Safari, or Firefox |
| Network | Required once for `setup-model` |
| Model payload | About 164 MiB, stored in ignored `models/` and `runtime/` folders |

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Full local model mode requires local model assets.` | Run `npm run setup-model -- --yes`, then `npm run serve`. |
| `npm ERR! 404 Not Found - svgotchi` | The npm package is not published yet. Use the GitHub source checkout above. |
| Browser did not open automatically | Open `http://127.0.0.1:4173/?mode=full`, or the port printed by the terminal. |
| `node` crashes before npm runs | Reinstall Node, then check `node -v`. |

---

## Model Boundary

The model returns emotion labels and scores. SVGotchi code maps that evidence into deterministic SVG rig transitions.

The model does not generate reply text, SVG, CSS, JavaScript, DOM selectors, path data, or animation code.

---

## Author

**Jun Seok Kim**<br />
GitHub: [@Everyseok](https://github.com/Everyseok)

---

<p align="center">
  <strong>SVG first. Browser local. TypeScript controlled.</strong>
</p>
