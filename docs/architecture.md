# SVGotchi Architecture

Status: implemented runtime architecture
Last updated: 2026-06-21 Asia/Seoul

## Objective

SVGotchi is an SVG-native local AI companion runtime. The opened SVG document is the interaction surface: it owns the prompt area, character rig, transition state, and visible animation. Full local mode adds browser-side emotion inference through Transformers.js and a local ONNX model.

The local emotion model is not a renderer. It returns classifier labels and confidence scores only; app-owned TypeScript maps those values into a sanitized `TransitionPlan` before any SVG mutation happens.

## Runtime Contract

The runtime has two local surfaces:

- model-free preview mode: serves the same SVG app surface without requiring model assets
- full local AI mode: serves SVG, JavaScript, tokenizer, WASM, and ONNX files from localhost so the browser can fetch local assets with normal HTTP semantics

The localhost server is static serving only. It is not a model backend, does not expose an inference route, and must not receive prompt text for model execution. Browser code owns inference.

Allowed:

- SVG elements and attributes
- static JavaScript loaded by the served SVG document
- deterministic app state owned by the SVG runtime
- local model assets installed by explicit setup
- local ONNX Runtime Web assets installed by explicit setup
- localhost static file serving for local browser inference

Disallowed:

- HTML wrapper as the primary runtime
- `foreignObject`
- HTML input, button, form, or contenteditable controls
- canvas
- React or DOM framework ownership
- remote inference, hosted APIs, backend inference bridges, or runtime model downloads
- model output applied directly to DOM, CSS, path data, selectors, scripts, URLs, or arbitrary attributes

## Execution Flow

```text
User enters prompt in the SVG prompt area
  -> SVG keyboard and composition handlers update the prompt buffer
  -> browser-local classifier returns emotion labels and scores
  -> TypeScript planner derives a TransitionPlan
  -> sanitizer validates enums, clamps numbers, and rejects forbidden fields
  -> transition engine resolves target pose and frame schedule
  -> renderer mutates known SVG rig IDs only
  -> Pet state updates after transition completion
```

The model boundary is intentionally small. The model may provide emotion evidence only. It may not generate pet reply text, reply style, SVG, JavaScript, selectors, path data, CSS, HTML, URLs, animation code, or event handler names.

## Source Structure

The implemented runtime is organized by ownership boundary:

- `src/character`: canonical SVG character source, rig contract, required IDs, and validation
- `src/input`: SVG prompt buffer, keyboard handling, IME composition, and caret behavior
- `src/emotion`: emotion catalog, pose map, and pose preview generation
- `src/llm`: local classifier runtime, app-owned transition planner, and `TransitionPlan` sanitizer
- `src/engine`: interpolation, easing, frame scheduling, pose resolution, and transition execution
- `src/render`: SVG renderer, visual effects, and generated transition previews
- `scripts`: source-checkout setup, verification, and localhost static serving

## Character Rig

The character is a stable SVG rig, not an opaque image. Every emotion state uses the same required IDs and slots. Optional visual parts remain present and are hidden through opacity when inactive.

Rig validation checks:

- every required ID exists
- IDs are unique
- root viewBox matches `0 0 100 100`
- pet and prompt layout areas match the coordinate contract
- hidden effect layers exist even when inactive

This keeps rendering deterministic and makes pose changes testable.

## Prompt Input

The prompt is a custom SVG control.

Runtime state includes:

- committed text
- active IME composition text
- focus status
- caret visibility

Prompt behavior:

- clicking the prompt focuses the SVG root
- printable key input appends one Unicode code point when not composing
- Backspace deletes one Unicode code point when not composing
- Enter submits only when not composing
- composition events keep IME input separate until commit
- placeholder text hides when display text is non-empty
- visible prompt text is clipped to the prompt region

## TransitionPlan Sanitization

Model output is untrusted classifier data. Sanitization must:

- ignore unknown fields
- validate enum fields against known catalogs
- clamp numeric values such as confidence, intensity, duration, and fps
- correct or reject `from` when it does not match the current emotion
- reject SVG, HTML, CSS, JavaScript, path data, DOM selectors, URLs, attribute names, and reply text
- return either a safe `TransitionPlan` or an explicit unavailable/invalid state

## Animation Engine

The animation engine owns all visual interpolation.

Inputs:

- current pose
- target pose from the emotion catalog
- sanitized `TransitionPlan`
- clock time

Outputs:

- known SVG attribute changes on required rig slots
- low-FPS frame state for tests and previews
- completion signal for pet state

The engine uses `requestAnimationFrame` as a wall-clock signal while sampling a deterministic frame index from duration and fps. It supports partial target-pose interpolation so ambiguous prompts can stop partway toward a target emotion instead of forcing a full expression.

## Local AI Runtime

Full local mode uses:

- `@huggingface/transformers` in the browser
- ONNX Runtime Web
- `onnx-community/tanaos-emotion-detection-v1-ONNX`
- local model files under `models/`
- local runtime files under `runtime/`

Runtime locks:

- `allowRemoteModels = false`
- `local_files_only = true`
- no hosted inference endpoint
- no runtime model download
- no API keys or secrets
- no backend model execution

## Packaging Strategy

Full local AI mode uses source-checkout static serving because normal browsers block direct-open `file://` SVG access to sibling model assets. Static localhost serving gives the browser normal fetch semantics while preserving browser-owned inference.

The server serves the SVG app document directly. It does not wrap the runtime in an HTML app shell.

Model files are not committed to Git. They are installed through explicit setup, verified by size and SHA-256, and loaded from local folders during runtime.

## Security Model

Trust boundaries:

- user input is text, not code
- model output is untrusted classifier data
- app-owned TypeScript owns all planning and sanitization
- renderer mutates only known SVG rig IDs
- local assets are served only from approved local roots

Forbidden model effects:

- arbitrary DOM selectors
- raw SVG or path data
- raw CSS text
- JavaScript patches
- pet reply text or reply style
- URLs
- event handler names
- attribute names
- HTML snippets

The project has no runtime need for secrets.

## Verification

The repository includes focused checks for the runtime contract:

- TypeScript typechecking
- browser script syntax verification
- character rig validation
- prompt buffer and IME behavior
- emotion catalog and pose map coverage
- transition interpolation and frame scheduling
- sanitizer rejection of forbidden model-owned fields
- local model asset verification after setup
- served SVG runtime checks through a local browser
