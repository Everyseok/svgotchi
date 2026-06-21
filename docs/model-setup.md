# Model Setup

SVGotchi full local model mode requires explicit local model setup.

## Commands

Current source checkout flow:

```bash
npm run setup-model -- --yes
npm run verify:model
```

## What Setup Does

The setup command:

1. checks whether local model/runtime assets already exist;
2. shows the expected payload size;
3. asks before downloading missing large model files;
4. copies available local proof assets when present;
5. downloads approved model files only during this setup step when needed;
6. installs ONNX Runtime Web static files from the installed npm dependency;
7. verifies byte size and SHA-256 hash for every required file.

Runtime after setup must not silently download model files.

## Expected Size

- model files: 135,539,904 bytes, about 129.26 MiB;
- runtime files: 36,581,230 bytes, about 34.89 MiB;
- total: 172,121,134 bytes, about 164.15 MiB.

## Local Folders

Model files:

```text
models/onnx-community/tanaos-emotion-detection-v1-ONNX/
```

Runtime files:

```text
runtime/onnxruntime/
```

These folders are ignored by Git except for `.gitkeep`.

## Network Policy

Setup-time download is allowed only when the user explicitly runs setup and approves the prompt or passes `--yes`.

Runtime network model downloads are not allowed. Full mode must use the verified local files served by the local static server.

## Failure Modes

If verification fails, do not treat full local mode as ready. Re-run:

```bash
npm run setup-model -- --yes
npm run verify:model
```

If the download fails, check network access during setup. If runtime fails after verification passes, inspect browser DevTools Network and confirm requests are only local static file requests.
