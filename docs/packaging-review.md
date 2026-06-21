# SVGotchi Model Packaging Strategy Review

Status: Revised Stage 6 complete; superseded for public distribution by source-checkout static serving
Last updated: 2026-06-17 Asia/Seoul

## Current Packaging Update

The direct-open SVG local asset proof failed in normal Chrome at `file://` model config fetch. The approved public distribution path is now GitHub source checkout plus npm scripts:

- deterministic demo remains GitHub-friendly and does not require model files;
- full local model mode uses explicit setup to install large ignored local assets;
- `npm run serve` starts a localhost static file server for SVG, JavaScript, WASM, tokenizer, and model files;
- localhost is not an inference backend and must not receive prompt text for model execution;
- browser code remains responsible for inference.

The earlier direct-open sibling-asset recommendation is retained below as historical Stage 6 analysis, not the current full-mode distribution contract.

## Scope

Stage 6 reviews packaging for the revised Gate G model:

```text
onnx-community/tanaos-emotion-detection-v1-ONNX
```

This review does not implement local model runtime, download model files into the repo, create `src/llm`, create `dist`, or build the final SVG artifact.

## Approved Model Contract

This model is a local English emotion classifier, not a general instruction LLM. That is intentional.

Runtime contract:

- input: user prompt text
- model output: classifier label and confidence score only
- app-owned mapper: converts label/confidence into a sanitized TransitionPlan
- app-owned mapper derives `emotionStrength` on a 0.0-1.0 scale, quantized to 0.1 increments
- app-owned deterministic code may fill `intent`, `motion`, `effect`, `durationMs`, `fps`, `easing`, and `blush`
- model output must not include pet reply text or reply style
- model output must not include JSON, SVG, HTML, CSS, JavaScript, path data, selectors, URLs, or arbitrary animation code
- `Intent` may remain `unknown` unless app-owned deterministic parsing identifies an allowed intent

Important confidence rule:

- classifier score is not automatically the emotional intensity
- Stage 7 must derive `emotionStrength` from score, top-label margin if available, label type, current emotion, and app-owned prompt heuristics
- ambiguous or low-confidence inputs should produce a lower `emotionStrength`, not a hard full-emotion jump
- the resulting `TransitionPlan.intensity` should represent expression strength, not model certainty alone
- a partial emotional state may stop interpolation at 0.1, 0.2, ... 0.9 of the target pose instead of always reaching the full target pose

Likely classifier label mapping:

| Model Label | SVGotchi Direction |
|---|---|
| `joy` | `happy`, `love`, or `grateful` depending on current state and confidence |
| `excitement` | `excited` or `playful` |
| `surprise` | `surprised` |
| `sadness` | `sad`, `lonely`, or `comforted` depending on prompt context |
| `fear` | `scared` or `nervous` |
| `anger` | `angry` or `annoyed` |
| `disgust` | `sulky` or `disappointed` |
| `neutral` | `neutral`, `curious`, or `thinking` |

The exact mapping remains Stage 7 implementation work after packaging approval.

## Partial Emotion Strength

The classifier path should support graded expression.

If the model recognizes a label weakly or the prompt is ambiguous, the app should not force the full target expression. Instead, the mapper should produce a decimal strength:

| Derived Strength | Visual Meaning |
|---:|---|
| 0.0 | stay at current/neutral expression |
| 0.1-0.3 | tiny hint of the target emotion |
| 0.4-0.6 | visible but restrained expression |
| 0.7-0.9 | strong expression, still not fully saturated |
| 1.0 | full target emotion |

For example, if the input loosely suggests affection but the classifier is uncertain, the mapper may choose `to: "shy_love"` with `intensity: 0.4`. The transition engine should then interpolate only partway toward the `shy_love` pose. That creates a softer face rather than an all-or-nothing emotion swap.

Stage 7 should treat this as an app-owned mapping rule. The model supplies label/score evidence; the app decides how strongly the pet expresses the result.

## Evidence

Hugging Face model card and API metadata:

- task: text classification / emotion detection
- runtime tags: Transformers.js, ONNX
- language: English
- license: MIT
- model card usage example shows Transformers.js `pipeline('text-classification', 'onnx-community/tanaos-emotion-detection-v1-ONNX')`

Observed model assets from the Hugging Face Hub API, with no download into the repo:

| Asset | Observed Size |
|---|---:|
| `onnx/model_int8.onnx` | 118,453,659 bytes, about 118.5MB |
| `onnx/model_quantized.onnx` | 118,453,659 bytes, about 118.5MB |
| `onnx/model_uint8.onnx` | 118,453,659 bytes, about 118.5MB |
| `onnx/model_q4f16.onnx` | 205,109,577 bytes, about 205.1MB |
| `onnx/model_fp16.onnx` | 235,622,294 bytes, about 235.6MB |
| `onnx/model.onnx` | 470,935,627 bytes, about 470.9MB |
| `tokenizer.json` | 17,082,900 bytes, about 17.1MB |
| `config.json` | 1,150 bytes |
| `tokenizer_config.json` | 1,231 bytes |
| `special_tokens_map.json` | 964 bytes |

Observed package metadata from npm:

| Package | Version Observed | Unpacked Size Observed |
|---|---:|---:|
| `@huggingface/transformers` | 4.2.0 | about 9.5MB |
| `onnxruntime-web` | 1.26.0 | about 134.3MB |

The ONNX Runtime package size is a conservative upper bound. Stage 7 should vendor only the JavaScript and WASM artifacts required by the selected execution path.

## Option A: True Single-File SVG With Embedded Runtime And Model Assets

Description:

- Put the app, Transformers.js or equivalent runtime, required ONNX Runtime Web/WASM files, tokenizer/config, and ONNX model inside one SVG file.
- Decode embedded assets in memory before local inference.

Estimated artifact size:

- `model_int8.onnx` alone becomes about 158MB after base64 expansion.
- `tokenizer.json` becomes about 22.8MB after base64 expansion.
- Runtime and WASM assets would add more payload. A practical embedded artifact is likely above 220MB and may be substantially higher depending on the required ONNX Runtime Web artifacts.

Browser compatibility:

- Risky for direct-open SVG.
- Large XML/base64 payloads increase parse time and memory pressure.
- Standard Transformers.js and ONNX Runtime Web loading paths expect local URLs or configured asset paths, not large in-memory blobs inside SVG.

Startup latency:

- Worst of the options.
- The browser must parse a large SVG text document, decode embedded binaries, initialize tokenization/runtime, then load the ONNX session.

Memory risk:

- High.
- Startup may temporarily hold SVG text, base64 strings, decoded ArrayBuffers, tokenizer data, runtime WASM, and ONNX session buffers.

Assessment:

- Not recommended for the Tanaos classifier.
- It is much smaller than Qwen2.5, but still too large and brittle for a robust single-file SVG target.

## Option B: SVG Plus Local Sibling Model And Runtime Assets

Description:

- Ship `svgotchi.svg` with adjacent local model/runtime assets.
- Configure Transformers.js for local model paths and local WASM paths.
- Disable remote model loading.

Recommended layout:

```text
svgotchi/
  svgotchi.svg
  assets/
    model/
      tanaos-emotion-detection-v1/
        config.json
        special_tokens_map.json
        tokenizer.json
        tokenizer_config.json
        onnx/
          model_int8.onnx
    runtime/
      transformers/
        transformers.min.js
      onnxruntime/
        required-wasm-files-only/
    notices/
      THIRD_PARTY_NOTICES.md
      MODEL_CARD_SUMMARY.md
      LICENSES.md
```

Estimated artifact size:

- Minimum model/tokenizer/config payload is about 135.6MB.
- A conservative full folder estimate before Stage 7 runtime pruning is about 155-280MB.
- No base64 expansion is required.

Browser compatibility:

- Best practical fit with Transformers.js and ONNX Runtime Web.
- Transformers.js documents local model path configuration, disabling remote model loading, and local WASM path configuration.
- Main risk remains direct-open SVG loading local sibling files through `file:///`, which can vary by browser.

Startup latency:

- Better than Option A because assets can be loaded as binary files rather than embedded base64.
- Still non-trivial because a 118.5MB ONNX file and 17.1MB tokenizer must load before inference.

Memory risk:

- Moderate to high, but bounded compared with Option A.
- Avoids base64 text duplication and giant XML parse overhead.

Build complexity:

- Moderate.
- Requires an asset manifest, asset copier, integrity checks, local runtime configuration, no-network verification, and license notice packaging.

Offline behavior:

- Good if all sibling files are present and the target browser allows direct-open SVG to load local sibling assets.
- Missing asset behavior must show explicit model-unavailable status.

Legal/licensing implications:

- Best option for readable license and model-card notices.
- Must include Tanaos model MIT license metadata, ONNX Community provenance, Transformers.js notices, and ONNX Runtime notices.

Assessment:

- Recommended strategy.
- It keeps behavior stable, keeps model output narrow, avoids embedding hundreds of MB into SVG text, and stays aligned with existing browser-local ONNX runtime patterns.

## Option C: Custom Local Classifier Runtime Or User-Selected Asset Directory

Candidate C1: Direct ONNX Runtime Web plus app-owned tokenization, avoiding the full Transformers.js layer.

Pros:

- May reduce runtime package size after careful pruning.
- Keeps classifier behavior narrow.

Cons:

- Tokenization correctness becomes app-owned and risky.
- More implementation complexity than Stage 7 should take on first.

Candidate C2: SVG asks the user to select a local asset directory through browser file-system APIs.

Pros:

- Avoids some direct `file:///` path assumptions.

Cons:

- Adds UX friction and browser API constraints.
- May require secure contexts and narrower browser support.

Assessment:

- Keep as an explicit contingency only if Option B direct-open proof fails and the user explicitly accepts a narrower browser target or more implementation complexity.

## Recommendation

Recommend approving:

```text
B. SVG plus local sibling Tanaos model/runtime assets, no network and no backend
```

Mandatory constraints:

- selected model is `onnx-community/tanaos-emotion-detection-v1-ONNX`
- preferred artifact is `onnx/model_int8.onnx`
- model output is classifier label/score only
- app-owned deterministic mapper creates sanitized TransitionPlan fields
- app-owned mapper derives `TransitionPlan.intensity` as a 0.0-1.0 expression-strength value quantized to 0.1 increments
- transition rendering must support partial target-pose interpolation for intensities below 1.0
- model/runtime files are local sibling assets, not embedded base64 in SVG
- `env.allowRemoteModels = false`
- local model path only
- local WASM/runtime path only
- no hosted inference
- no runtime network call
- no backend
- no localhost inference bridge
- localhost static serving only for the approved source-checkout full local mode
- no production deterministic planner substitution if the model fails
- no model-generated reply text or reply style
- direct-open full local asset loading has been tested and is blocked in normal Chrome

## Gate H Decision Needed

Approve one of:

- approve Strategy B as recommended
- reject Strategy B and request true single-file Strategy A despite size and memory risk
- reject both and ask for a custom Strategy C

No Stage 7 local model runtime implementation should begin until Gate H is explicit.

## Sources

- https://huggingface.co/onnx-community/tanaos-emotion-detection-v1-ONNX
- https://huggingface.co/docs/transformers.js/en/custom_usage
- https://onnxruntime.ai/docs/tutorials/web/deploy.html
- https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp
