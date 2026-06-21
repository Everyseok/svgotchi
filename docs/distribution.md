# Distribution

SVGotchi is distributed as a source-first GitHub project. Public setup instructions use `git clone`, `npm ci`, and the repository scripts.

The important distinction is that full local model mode is not a direct-open `file://` SVG. Normal browsers block direct-open SVG access to sibling model files. Full local mode therefore runs from a localhost static file server started by the source checkout scripts. That localhost server is not a model backend. It only serves static SVG, JavaScript, WASM, tokenizer, and local model files so browser-side code can run inference locally.

## User Flows

### Flow A: Model-Free Preview

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run serve:preview
```

This starts the SVG runtime surface without local model assets.

### Flow B: Full Local Model Mode

```bash
git clone https://github.com/Everyseok/svgotchi.git
cd svgotchi
npm ci
npm run setup-model -- --yes
npm run serve
```

`setup-model` checks for local model/runtime assets, shows the expected size, downloads missing model files only during the explicit setup step, installs runtime assets, and verifies the pinned manifest.

`serve` starts a localhost static file server. Inference is expected to run in the browser. The server does not expose an inference endpoint and must not receive prompt text for model execution.

The root route serves the SVGotchi SVG app document directly. It is not an HTML wrapper.

### Flow C: Source Guided Mode

```bash
npm run cli --
```

Guided mode checks model assets, offers setup if assets are missing, then starts full local mode when ready. If setup is declined or unavailable, it can fall back to model-free preview mode.

## Distribution Modes

### Direct-Open SVG Preview

Direct-open SVG is allowed for deterministic previews and small committed assets. It is not the full local model runtime path.

### Local Served Full Model Mode

Full local mode uses localhost static serving only. Static serving is allowed because it avoids browser `file://` restrictions while keeping inference inside the browser.

The served runtime surface is SVG. Browser-side JavaScript is loaded as a static asset from the SVG document and mutates only approved SVG rig IDs.

Allowed static files include:

- SVG;
- JavaScript and module files;
- ONNX Runtime WASM files;
- tokenizer/config JSON;
- local ONNX model files;
- committed small preview assets;
- the browser integration script.

Forbidden server behavior:

- no inference endpoint;
- no hosted inference proxy;
- no prompt-processing backend;
- no runtime model download;
- no external inference API.

### GitHub Pages Limited Preview

GitHub Pages may host a limited model-free preview with small committed assets. It is not the full local model mode because full mode requires user-local model assets installed through setup.

### Source-First Distribution

The source checkout provides:

- a CLI command surface;
- explicit model setup;
- local asset verification;
- a local static server;
- browser-side inference boundary.

## Model Payload Policy

Large model files are not committed to Git. The local setup target is:

- `models/onnx-community/tanaos-emotion-detection-v1-ONNX/`
- `runtime/onnxruntime/`

The pinned payload is approximately:

- model files: 135,539,904 bytes, about 129.26 MiB;
- runtime files: 36,581,230 bytes, about 34.89 MiB;
- total: 172,121,134 bytes, about 164.15 MiB.

Setup may download model files only after explicit user approval or the `--yes` flag. Runtime after setup must not silently download model files.

## Commands

Source checkout scripts:

```bash
npm run cli --
npm run serve:preview
npm run setup-model -- --yes
npm run serve
npm run verify:model
```

## Verification

Basic checks that do not require local model files:

```bash
npm test
npm run verify
```

Full local checks after `npm run setup-model -- --yes`:

```bash
npm run verify:model
npm run serve:smoke
npm run verify:browser
npm run verify:served-svg
npm run verify:served-svg:full
npm run verify:runtime
npm run verify:release
```

Use browser DevTools Network after setup to confirm runtime requests are local static file requests only. There should be no hosted inference, model download, backend inference endpoint, or external API call during runtime.

`verify:served-svg` and `verify:served-svg:full` require Chrome or Edge. They verify that the served document is SVG, the SVG app script runs, no HTML document root is introduced, and the prompt path can complete a transition. The full variant also verifies browser-local model loading from the installed local assets.

`verify:runtime` groups the served SVG/browser checks. `verify:release` runs the base test suite, model asset verification, and runtime browser checks; it requires local model assets to be installed first.
