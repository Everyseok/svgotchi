# Direct-Open SVG Local Model Proof

Status: complete, normal direct-open proof failed

This proof checks whether the full local model runtime can run from a directly opened SVG file without a backend, localhost, hosted inference, external API, or runtime model download.

## Artifacts

- Proof SVG: `proofs/direct-open-local-model.svg`
- Verifier: `scripts/verify-direct-open-svg.ts`
- Result JSON: `proofs/direct-open-local-model-result.json`

## What It Tests

The proof SVG runs as a `file://` SVG document and attempts these steps:

1. Execute SVG module script.
2. Fetch local model config from `../models/onnx-community/tanaos-emotion-detection-v1-ONNX/config.json`.
3. Import local browser Transformers.js from `../node_modules/@huggingface/transformers/dist/transformers.web.js`.
4. Configure local-only model loading and local ONNX Runtime WASM paths.
5. Instantiate the Tanaos text-classification pipeline and classify `you are cute`.

The verifier runs Chrome headless against the `file://` SVG. It runs normal direct-open mode first. If normal mode fails, it also runs a diagnostic pass with `--allow-file-access-from-files` to separate browser file-security failure from path-layout failure. The diagnostic pass is not considered shippable proof.

## Commands

```bash
npm run verify:model
npm run verify:direct-open-svg
```

The regular project verification remains:

```bash
npm run verify
```

## Interpretation

`data-proof-status="pass"` in normal mode means the direct-open SVG loaded local model/runtime assets and classified locally under the tested Chrome environment.

`data-proof-status="fail"` in normal mode with diagnostic pass success means the asset layout is coherent, but normal browser file security blocks direct-open operation. That does not satisfy the product constraint unless the user explicitly approves a browser-flag requirement.

Failure in both modes means either browser file security blocks the proof earlier than the diagnostic flag can help, or the browser-facing runtime path still needs work.

## Result

Executed at 2026-06-17 22:13:50 Asia/Seoul on Windows with Chrome at:

```text
C:\Program Files\Google\Chrome\Application\chrome.exe
```

The normal direct-open `file://` run failed:

```json
{
  "mode": "normal",
  "proofStatus": "fail",
  "detail": "config fetch failed: Failed to fetch",
  "steps": ["ok", "fail", null, null]
}
```

Interpretation: the SVG script executed, but Chrome blocked fetching the sibling local model config file from `file://`. This means the current full local model architecture cannot honestly claim normal direct-open SVG model loading in Chrome without an approved packaging exception.

The diagnostic pass with `--allow-file-access-from-files` reached the config fetch step:

```json
{
  "mode": "diagnostic-file-access-flag",
  "proofStatus": "running",
  "steps": ["ok", "ok", "running", null]
}
```

Interpretation: the local file layout is at least reachable when Chrome file access is relaxed, but the diagnostic pass did not complete the browser Transformers.js import/classification path during this headless run. This diagnostic mode is not shippable because it requires a browser flag.

## Architectural Consequence

The no-backend/no-localhost direct-open SVG full LLM path is blocked for normal Chrome. Tier 1 deterministic demo remains viable. Tier 2 setup plus local model verification remains viable.

Current decision after this proof:

- direct-open SVG is deterministic-demo only for public distribution claims;
- full local model mode uses the npm/npx CLI;
- the CLI starts a localhost static server for SVG, JavaScript, WASM, tokenizer, and local model files;
- localhost is not a model backend and must not receive prompt text for inference;
- browser code remains responsible for inference.

The rejected or deferred alternatives remain:

- keep direct-open SVG as deterministic-only and do not promise full LLM runtime there;
- approve a different full local runtime wrapper that is not a backend service, such as a packaged desktop/runtime shell;
- approve a browser-flag requirement, which is not recommended for ordinary users.

The project should not proceed to final browser-side LLM integration until the npm/npx static-server path is reviewed and verified.
