<h1 align="center">SVGotchi</h1>

<p align="center">
  <img src="assets/base-character.svg" alt="SVGotchi character preview" width="150" />
</p>

<p align="center">
  <strong>An SVG-native local AI companion runtime.</strong><br />
  Runs browser-side emotion inference with Transformers.js and ONNX. No Python backend, no hosted inference API, no HTML app shell.
</p>

<p align="center">
  <a href="https://github.com/Everyseok/svgotchi">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Runtime-Node%2024%2B-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node 24+" />
  <img src="https://img.shields.io/badge/App-SVG%20Document-FFB13B?style=for-the-badge" alt="SVG Document" />
  <img src="https://img.shields.io/badge/Model-Hugging%20Face-FFD21E?style=for-the-badge" alt="Hugging Face Model" />
  <img src="https://img.shields.io/badge/Inference-Browser%20Local-2563EB?style=for-the-badge" alt="Browser Local Inference" />
</p>

---

## Local Runtime Preview

<p align="center">
  <img src="docs/assets/readme/svgotchi-preview.gif" alt="SVGotchi full mode preview" width="72%" />
</p>

---

## What Makes It Different

| Usual small AI app | SVGotchi |
|---|---|
| Python backend or notebook starts the model loop | The opened SVG document is the app surface |
| Prompt goes to a server/API | Prompt stays in the browser |
| Backend owns inference | Transformers.js loads a local ONNX model in the browser |
| UI state is handled by an app framework | SVG rig IDs are animated directly |
| Model output may drive arbitrary text/UI | Labels and scores are sanitized into fixed pose transitions |

SVGotchi is not a Python app that renders an SVG character. It is an SVG-native local AI application where the opened SVG document itself becomes the interaction surface, the browser owns inference through Transformers.js and a local ONNX model, and sanitized emotion labels directly drive deterministic pose transitions.

---

## Core Properties

- **SVG-native surface**: the opened SVG document is the runtime surface, not a rendered asset inside a separate app.
- **Browser-local inference**: Transformers.js loads a local ONNX model in the browser; prompt text is not sent to a backend.
- **TypeScript-controlled behavior**: classifier labels are mapped into a typed `TransitionPlan`, then sanitized before animation.
- **Small model boundary**: the model returns labels and scores only; SVG, CSS, JavaScript, selectors, and path data are never model-generated.
- **Static-local deployment**: after model setup, SVGotchi runs from a localhost static server with local model and runtime assets.

---

## Local AI Runtime

| Layer | Value |
|---|---|
| Model repo | [`onnx-community/tanaos-emotion-detection-v1-ONNX`](https://huggingface.co/onnx-community/tanaos-emotion-detection-v1-ONNX) |
| Pipeline | `text-classification` |
| Browser loader | `@huggingface/transformers` / Transformers.js |
| Runtime format | ONNX Runtime Web |
| Selected model file | `onnx/model_int8.onnx` |
| Tokenizer files | `tokenizer.json`, `tokenizer_config.json`, `special_tokens_map.json` |
| Local model root | `models/onnx-community/tanaos-emotion-detection-v1-ONNX/` |
| Local runtime root | `runtime/onnxruntime/` |
| Runtime lock | `allowRemoteModels = false`, `local_files_only = true` |
| Classifier labels | `joy`, `anger`, `fear`, `sadness`, `surprise`, `disgust`, `excitement`, `neutral` |
| SVGotchi output | sanitized `TransitionPlan` -> SVG pose, motion, effect, blush, duration |

```mermaid
flowchart TD
  HF["Hugging Face model repo"] --> SETUP["npm run setup-model"]
  SETUP --> VERIFY["size + SHA-256 verification"]
  VERIFY --> LOCAL["models/ + runtime/"]
  LOCAL --> SERVE["localhost static server"]
  SERVE --> SVG["SVG document"]
  SVG --> JS["browser JavaScript"]
  JS --> PIPE["pipeline('text-classification')"]
  PIPE --> RESULT["emotion labels + scores"]
  RESULT --> PLAN["TypeScript transition planner"]
  PLAN --> SAFE["sanitized TransitionPlan"]
  SAFE --> RIG["SVG rig animation"]
```

---

## Quick Start

SVGotchi is distributed as a source-first GitHub project. Clone the repository and run it locally.

Full local AI mode:

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run setup-model -- --yes
npm run serve
```

Model-free preview mode:

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run serve:preview
```

Default local URL:

```text
http://127.0.0.1:4173/?mode=full
```

---

## Verification

Basic checks, no model download required:

```bash
npm test
npm run verify
```

Full local release checks, after model setup:

```bash
npm run setup-model -- --yes
npm run verify:model
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
| Browser did not open automatically | Open `http://127.0.0.1:4173/?mode=full`, or the port printed by the terminal. |
| `node` crashes before npm runs | Reinstall Node, then check `node -v`. |

---

## Runtime Contract

SVGotchi treats model output as untrusted classifier data.

The model returns emotion labels and confidence scores only. It does not generate reply text, SVG, CSS, JavaScript, DOM selectors, path data, URLs, or animation code. App-owned TypeScript maps classifier output into a sanitized `TransitionPlan`, then the renderer mutates only known SVG rig IDs.

---

## License

SVGotchi source code, project documentation, and repository-owned media are MIT licensed.

Third-party npm packages and Hugging Face model/runtime assets keep their own upstream licenses. See [LICENSE](LICENSE), [NOTICE](NOTICE), and [docs/license-inventory.md](docs/license-inventory.md).

---

## Author

**Jun Seok Kim**<br />
GitHub: [@Everyseok](https://github.com/Everyseok)

---

<p align="center">
  <strong>SVG native. Browser local. TypeScript controlled.</strong>
</p>
