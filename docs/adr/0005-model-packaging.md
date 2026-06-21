# ADR 0005: Model Packaging Strategy

## Status

Accepted for the current public distribution path.

## Date

2026-06-17 Asia/Seoul

## Context

SVGotchi must use a local model and must not call remote APIs, hosted inference, backend services, localhost inference bridges, or runtime model downloads after setup. The initial prompt required user approval before selecting a packaging strategy if true single-file local model embedding was not feasible or too large.

The user later clarified that English is the primary language target and that the model only needs intent/emotion planning, not natural-language pet replies. This supersedes the earlier model selection rationale that favored Qwen2.5 for broad language coverage.

The revised Gate G decision selected `onnx-community/tanaos-emotion-detection-v1-ONNX` because task-specific emotion classification is more stable than general text generation for SVGotchi's product behavior.

Research shows browser-side inference with Transformers.js or ONNX Runtime Web normally involves JavaScript runtime code, WASM binaries, and model files. Documentation supports local asset configuration, but direct-open SVG plus local sibling assets must be tested because browser local-file loading and CORS behavior can be constrained.

## Decision

Use a GitHub source-checkout public distribution path for full local LLM mode until the npm package is published:

- `npm run serve:preview` runs the GitHub-friendly model-free preview without model assets.
- `npm run setup-model -- --yes` explicitly installs large local model/runtime assets into ignored folders.
- `npm run serve` starts a localhost static file server for SVG, JavaScript, WASM, tokenizer, and local model files.
- `npm run cli --` runs a guided flow that checks assets, asks before downloading, verifies files, starts the static server, and opens the browser.

The localhost server is static serving only. Inference must run in the browser. The server must not expose an inference endpoint or receive prompt text for model execution.

Superseded Stage 6 recommendation after Qwen2.5 approval:

- Recommend option B: SVG plus local sibling model/runtime assets.
- Do not embed Qwen2.5 model/runtime assets directly into a single SVG.
- Do not implement runtime before Gate H approval.
- Stage 7 must first prove direct-open local sibling asset loading without network, backend, or localhost.

Current decision:

- Do not proceed with the old Qwen2.5 packaging recommendation.
- Treat `onnx-community/tanaos-emotion-detection-v1-ONNX` as the approved Gate G model.
- Use source-checkout static serving for local sibling model/runtime assets.
- Do not embed the Tanaos ONNX model/runtime assets directly into a single SVG.
- Do not commit model files to Git.
- Do not use GitHub Pages as the full local LLM mode.
- Do not use external inference APIs or Hugging Face hosted inference.

## Options To Evaluate Later

### A. True single-file SVG with embedded runtime/model assets

Pros:

- purest artifact story
- no sibling files
- no local file loading ambiguity

Cons:

- likely very large
- base64/text embedding increases size
- memory/startup risk
- harder to use standard runtime asset loaders
- may require custom in-memory loading paths

### B. SVG plus local sibling model/runtime assets

Pros:

- more practical for WASM and model files
- closer to Transformers.js and ONNX Runtime Web deployment patterns
- easier to update model assets
- avoids base64 expansion and giant XML parse cost for the approved Tanaos ONNX model

Cons:

- direct-open `file:///` loading may fail or vary by browser
- still needs no-network proof
- user must keep files together
- must stop and return to Gate H if direct-open local loading requires localhost or a backend

Status:

- Direct-open full local model loading failed in normal Chrome.
- This option is superseded for full local mode by source-checkout static serving.
- The sibling asset layout is still used, but assets are fetched by the browser from `http://127.0.0.1:<port>` rather than `file://`.

### B2. Source checkout static server with local sibling model/runtime assets

Pros:

- works with normal browser fetch semantics
- keeps inference in the browser
- avoids committing large model files
- keeps setup-time downloads explicit
- supports a simple public UX through `npm run` scripts before npm publish

Cons:

- requires Node/npm for full local mode
- still has large local model/runtime assets
- must keep the static server narrow and localhost-bound
- direct-open SVG remains deterministic-only for full-model claims

### C. SVG plus development-only deterministic planner, LLM postponed

Pros:

- allows full character/input/animation testing early
- smallest early artifact

Cons:

- not final product
- must not be presented as production local LLM

### D. Another explicitly approved strategy

Pros:

- leaves room for new evidence

Cons:

- must be reviewed against all hard constraints

## Consequences

- Stage 1 through Stage 4 should avoid coupling to model packaging.
- Stage 5 selected a task-specific classifier path for stable behavior.
- Stage 6 recommends sibling local assets for that classifier path.
- Any use of Transformers.js or ONNX Runtime Web must disable remote model loading and vendor required runtime assets.
- Direct-open SVG full local model loading was tested and failed in normal Chrome.
- Full local mode now uses source-checkout static serving.
- GitHub Pages and direct-open SVG remain limited preview paths.

## Sources

- https://huggingface.co/docs/transformers.js/custom_usage
- https://huggingface.co/docs/transformers.js/api/env
- https://onnxruntime.ai/docs/tutorials/web/deploy.html
- https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
- https://datatracker.ietf.org/doc/html/rfc2397
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp
