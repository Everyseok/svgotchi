# SVGotchi Research Notes

Status: Stage -1 completed draft
Last updated: 2026-06-17 Asia/Seoul

Current update: later packaging proof showed that normal Chrome blocks direct-open SVG `file://` access to sibling model assets. The current full local model distribution path is npm/npx static serving on localhost, with inference still running in the browser and no backend inference service. The direct-open SVG target remains valid for deterministic demo behavior.

## Scope

This document records research findings for SVGotchi before implementation. It does not approve character art, model selection, packaging strategy, or implementation. Those decisions remain gated by the active plan.

The research target is a pure SVG artifact with local-only model behavior:

- direct SVG document usage, not an HTML app wrapper
- no foreignObject and no HTML form controls
- deterministic SVG animation engine
- local LLM limited to TransitionPlan generation
- no external API, backend, localhost dependency, or runtime network call

## Executive Findings

1. Standalone SVG can support scripting and interaction, but SVG used as an image resource is intentionally restricted. The final artifact must be opened as an SVG document. Documentation must warn that image-preview contexts may render a static/non-interactive view.
2. Pure SVG text input is feasible only as a custom control. The SVG root or prompt region must be focusable, keyboard events must be handled manually, and IME composition must be treated as first-class state.
3. Low-FPS pixel animation should use a deterministic frame scheduler on top of requestAnimationFrame. Web Animations API may be useful for simple properties, but explicit frame stepping is better aligned with pose interpolation and testability.
4. The pet should use a small explicit state model: current emotion, current pose, prompt buffer, animation status, model status, and history. A large state-machine dependency is not justified yet.
5. Transformers.js and ONNX Runtime Web are the most relevant browser-side inference paths. Both normally rely on JavaScript bundles, WASM/runtime assets, and model files. They can be configured for local assets, but true single-file SVG packaging remains high risk until measured.
6. Sibling local model assets are not automatically safe for direct file usage because browser fetch/CORS behavior for file URLs is constrained and browser-dependent. If sibling assets are approved later, they need a specific loading proof in target browsers.
7. Hugging Face model review must inspect license, model card metadata, English-first task fit, optional language coverage, artifact size, runtime compatibility, quantized availability, and offline vendoring terms. Candidate selection is intentionally deferred to Stage 5.

## Research Details

### Interactive SVG Document Behavior

Findings:

- SVG has a script element for adding scripts to SVG documents. MDN notes that SVG script differs from HTML script, including use of `href` instead of `src` and incomplete support for ECMAScript modules.
- W3C SVG Integration distinguishes top-level/embedded interactive documents from image-resource processing modes. When an SVG is used as an image resource, scripting and interactivity are disabled by design.
- Therefore the project can target direct-open standalone SVG documents, but cannot promise the same behavior when embedded as `<img>`, CSS background, or some image previewers.

Design consequence:

- Build output should be a standalone SVG document with inline non-module script.
- README and final docs must say: open `dist/svgotchi.svg` directly as an SVG document. Static preview contexts are not the runtime.
- E2E tests must open the SVG as a document, not as an HTML `<img>`.

Sources:

- MDN SVG `<script>`: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/script
- W3C SVG Integration: https://www.w3.org/TR/svg-integration/
- W3C SVG 2 conformance and processing modes: https://www.w3.org/TR/SVG/conform.html

### SVG Focus and Keyboard Input

Findings:

- SVG `tabindex` can make SVG elements focusable and participate in sequential focus navigation.
- `SVGElement.focus()` exists and focuses focusable SVG elements.
- Keyboard events are DOM events and can be handled on the focused SVG element or document.
- Since HTML inputs and `foreignObject` are banned, the prompt area must be a custom text-control model using SVG `rect`, `text`, clip path, caret, and event handlers.

Design consequence:

- The root SVG should be focusable.
- Clicking the prompt area should focus the SVG root or a dedicated focusable prompt group.
- The prompt UI should maintain its own buffer and render text through SVG `text`, with clipping/truncation.
- The prompt must not depend on HTML text selection or native input behavior.

Sources:

- MDN SVG `tabindex`: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/tabindex
- MDN `SVGElement.focus()`: https://developer.mozilla.org/en-US/docs/Web/API/SVGElement/focus
- MDN `KeyboardEvent.key`: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

### IME and Composition Events

Findings:

- IME input is represented by composition events. `compositionstart` begins a composition session, `compositionupdate` reports intermediate composition text, and `compositionend` commits it.
- `KeyboardEvent.isComposing` indicates whether a key event occurs after `compositionstart` and before `compositionend`.
- Event ordering around `input`, `beforeinput`, and composition can vary. This matters less if SVGotchi owns its own buffer and treats composition as a separate draft state.

Design consequence:

- Do not append raw printable keys while composition is active.
- Maintain separate `committedText` and `compositionText`.
- Render `committedText + compositionText` during composition, but commit only on `compositionend`.
- Suppress Enter submit while composing.
- Backspace should delete one Unicode code point from the committed buffer when not composing.

Sources:

- MDN `compositionstart`: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event
- MDN `CompositionEvent`: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
- MDN `KeyboardEvent.isComposing`: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
- W3C UI Events: https://www.w3.org/TR/uievents/
- W3C Input Events Level 2: https://www.w3.org/TR/input-events-2/

### Low-FPS SVG Animation

Findings:

- `requestAnimationFrame()` is the browser primitive for scheduling visual updates before repaint.
- Web Animations API can construct and control animations from JavaScript, but SVGotchi needs deterministic low-FPS frame stepping, pose interpolation, effect visibility, and testable intermediate frames.
- Pixel-style animation benefits from step sampling: compute a frame index from elapsed time, fps, duration, and easing, then render the exact pose for that frame.

Design consequence:

- Use requestAnimationFrame as the clock.
- Convert real elapsed time to deterministic frame index.
- Render primitive SVG attributes and transforms from pose data.
- Avoid path morphing unless path pairs are compatible and directly tested.
- Keep the deterministic transition engine independent from the model planner.

Sources:

- MDN `requestAnimationFrame()`: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- MDN CSS and JavaScript animation performance: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance
- MDN Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

### Pet State and Finite-State Architecture

Findings:

- State machines model a system as a finite set of states and transitions triggered by inputs/events.
- SVGotchi does not need a full statecharts dependency at Stage -1. The initial product state can be an explicit typed state object plus pure transition functions.
- The LLM should not own state transitions directly. It can propose intent and transition parameters, but the deterministic runtime validates and applies them.

Design consequence:

- Keep `PetState` explicit and small: current emotion, pose, animation status, model status, prompt state, and recent interactions.
- Keep emotion taxonomy separate from intent taxonomy.
- Validate every TransitionPlan against the current state before rendering.
- Treat invalid model output as model failure or sanitized safe plan, not as executable content.

Sources:

- MDN state machine glossary: https://developer.mozilla.org/en-US/docs/Glossary/State_machine
- XState state machine concepts: https://stately.ai/docs/machines
- Game Programming Patterns - State: https://gameprogrammingpatterns.com/state.html

### Transformers.js

Findings:

- Transformers.js is designed to run Transformers models in the browser without a server and uses ONNX Runtime under the hood.
- Browser execution defaults to WASM CPU. WebGPU can be enabled but remains browser-support-sensitive.
- Transformers.js supports quantized dtypes such as q8 and q4 for resource-constrained browser environments when the model supports them.
- The environment API includes `allowRemoteModels`, `allowLocalModels`, `localModelPath`, cache flags, and WASM path configuration.
- Documentation explicitly shows disabling remote models and setting local model paths.

Design consequence:

- Transformers.js is a plausible runtime candidate, but production mode must set remote loading off.
- If used, the build must vendor both runtime/WASM and model assets. It must not rely on CDN or Hub at runtime.
- The model output must still be constrained to TransitionPlan and sanitized.
- WebGPU should be considered an optional acceleration path, not the only path, because support and secure-context requirements vary.

Sources:

- Transformers.js overview: https://huggingface.co/docs/transformers.js/index
- Transformers.js custom usage: https://huggingface.co/docs/transformers.js/custom_usage
- Transformers.js environment API: https://huggingface.co/docs/transformers.js/api/env
- Transformers.js WebGPU guide: https://huggingface.co/docs/transformers.js/guides/webgpu

### ONNX Runtime Web

Findings:

- ONNX Runtime Web runs ONNX models in web applications using JavaScript APIs.
- Deployment normally includes a JavaScript bundle, WebAssembly binaries, and model files.
- Production deployment may need explicit `wasmPaths` so ONNX Runtime can locate required WASM assets.
- WebGPU is available as an execution provider for heavier models but is optional; default WASM remains relevant for lightweight models.
- ONNX Runtime docs call out artifact size, loading time, memory, and custom builds as deployment concerns.

Design consequence:

- ONNX Runtime Web is a lower-level alternative to Transformers.js.
- It may be useful if Transformers.js packaging is too large or if a small custom classifier/generator can be exported to ONNX.
- It does not remove the need to package WASM and model files locally.

Sources:

- ONNX Runtime Web get started: https://onnxruntime.ai/docs/get-started/with-javascript/web.html
- ONNX Runtime Web tutorials: https://onnxruntime.ai/docs/tutorials/web/
- ONNX Runtime Web deployment: https://onnxruntime.ai/docs/tutorials/web/deploy.html
- ONNX Runtime WebGPU execution provider: https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html

### WebGPU Constraints

Findings:

- MDN marks WebGPU as limited availability and secure-context gated in some or all supporting browsers.
- Transformers.js docs also warn that WebGPU can be problematic in non-Chromium browsers.
- A direct-open local SVG may not provide the same secure-context behavior as HTTPS. This must be empirically tested before relying on WebGPU.

Design consequence:

- Do not require WebGPU for the MVP.
- Prefer WASM/CPU viability for the local model path unless later model review proves otherwise.
- WebGPU can remain an optional enhancement after browser/runtime testing.

Sources:

- MDN WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- Transformers.js WebGPU guide: https://huggingface.co/docs/transformers.js/guides/webgpu

### Hugging Face Model Cards and Licensing

Findings:

- Hugging Face model repositories render `README.md` as the model card and use YAML metadata for discoverability, including license, language, library, tags, datasets, and model relationships.
- Hugging Face license docs say the repo card metadata is the place to specify license and remind users to respect project licenses.
- Model review cannot use "works on Hugging Face" as enough evidence. SVGotchi needs runtime compatibility, offline packaging, license clarity, English-first intent/emotion behavior, and optional multilingual notes.

Design consequence:

- Stage 5 must evaluate model candidates with a table that includes license, English-first task fit, optional language coverage, supported library/runtime, ONNX/GGUF/Transformers.js compatibility, quantized artifacts, artifact size, model-card quality, and local/offline packaging notes.
- Do not select a model in Stage -1.

Sources:

- Hugging Face model cards: https://huggingface.co/docs/hub/en/model-cards
- Hugging Face licenses: https://huggingface.co/docs/hub/en/repositories-licenses
- Hugging Face course model card metadata: https://huggingface.co/docs/course/en/chapter4/4

### Offline Packaging and Single-File SVG

Findings:

- Data URLs can embed small files inline in documents, but MDN frames them as suitable for small files and notes modern browsers treat data URLs as unique opaque origins.
- RFC 2397 defines data URLs as a way to include small data items inline.
- Large model assets and WASM binaries embedded as base64 or text will increase artifact size and memory pressure.
- Browser fetch/CORS behavior around `file:///` URLs is constrained. MDN documents CORS errors for non-HTTP schemes, often with local file URLs.
- ONNX Runtime Web and Transformers.js normally expect model files and WASM assets to be loadable resources, not arbitrary in-memory blobs inside an SVG, unless custom loading hooks are engineered and tested.

Design consequence:

- True single-file SVG with embedded model/runtime assets is the highest-purity architecture but highest-risk.
- SVG plus local sibling assets may be more practical but conflicts with the no-network/no-server/direct-open target unless target browsers can load local sibling assets reliably.
- A development-only deterministic planner is valid for early engine tests but must never be substituted for production model failure.
- Packaging strategy must remain a user-approved gate after concrete size and browser tests.

Sources:

- MDN data URLs: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
- RFC 2397 data URL scheme: https://datatracker.ietf.org/doc/html/rfc2397
- MDN CORS request not HTTP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp
- ONNX Runtime Web deployment: https://onnxruntime.ai/docs/tutorials/web/deploy.html
- Transformers.js custom usage: https://huggingface.co/docs/transformers.js/custom_usage

## Unresolved Technical Questions

These are intentionally not guessed in Stage -1:

1. Which browser is the primary runtime target for direct-open SVG: Chrome, Edge, Firefox, Safari, or a narrower set?
2. Can the selected browser execute inline SVG script from `file:///` with the needed focus, keyboard, composition, and animation behavior?
3. Can direct-open SVG load sibling local WASM/model assets without a server in the selected browser?
4. Can a candidate local model generate constrained TransitionPlan reliably enough, or should the model be a classifier/structured planner rather than a free-form generator?
5. What artifact size is acceptable for the final distribution?
6. Will the user approve single-file embedding if the result is large, or sibling local model assets if direct-open loading is reliable?

## Stage -1 Recommendation

Use this architecture direction for later approval:

- Implement character and transition runtime first, without LLM integration.
- Keep SVG runtime deterministic and model-agnostic.
- Keep the LLM boundary as a small planner interface returning sanitized TransitionPlan.
- Treat model runtime and packaging as later research gates with measured browser tests.
- Favor single inline SVG script for app/runtime code; defer model and WASM asset packaging until Stage 5 and Stage 6 evidence exists.

Stage -1 does not approve Stage 0. User confirmation is required before character concept candidates begin.
