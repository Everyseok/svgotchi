# SVGotchi Architecture

Status: living architecture; Stage -1 base plus later packaging decisions
Last updated: 2026-06-17 Asia/Seoul

## Objective

SVGotchi is a standalone SVG artifact containing a cute pixel-style Tamagotchi-like pet, a pure-SVG prompt area, deterministic emotion animation, and a local-only planner that returns a sanitized TransitionPlan. The current local emotion model is not a renderer and does not mutate the SVG.

This document describes the intended architecture and records later packaging decisions. It does not approve character art replacement or any generated preview.

## Runtime Boundary

The runtime target now has two tiers:

- deterministic demo: direct-open SVG remains valid for small committed assets and non-model behavior
- full local model mode: npm/npx starts a localhost static file server so the browser can fetch local SVG, JavaScript, WASM, tokenizer, and model files

The localhost server is not a model backend. It must not receive prompt text for inference and must not expose an inference endpoint. Browser code owns inference.

Allowed:

- SVG elements and attributes
- inline non-module JavaScript inside the SVG document
- static JavaScript loaded by the served SVG document in npm/npx full local mode
- deterministic app state owned by the SVG runtime
- local model assets only after explicit packaging approval
- local WASM/runtime assets only after explicit packaging approval
- localhost static file serving for full local model mode after explicit setup

Disallowed:

- HTML wrapper as the primary runtime
- `foreignObject`
- HTML input, button, form, or contenteditable
- canvas
- React or DOM framework
- remote inference, external API, backend, localhost inference bridge, or runtime model download
- model output applied directly to DOM, CSS, path data, selectors, scripts, or arbitrary attributes

## High-Level Flow

```text
User clicks SVG prompt area
  -> SVG root receives focus
  -> keyboard/composition handlers update prompt buffer
  -> user submits prompt
  -> local planner returns untrusted TransitionPlan-like data
  -> sanitizer validates and clamps into TransitionPlan
  -> deterministic transition engine resolves target pose
  -> frame scheduler emits low-FPS frame indices
  -> renderer mutates known SVG rig slots only
  -> PetState updates after transition completion
```

The LLM boundary is narrow by design. The LLM may choose intent, target emotion, duration, intensity, easing, motion, effect, blush, and confidence. It may not generate pet reply text, reply style, SVG, JavaScript, selectors, path data, CSS, HTML, or animation code.

For the approved classifier-based path, the model does not choose those fields directly. It returns an emotion label and confidence score; app-owned mapper code derives the target emotion and TransitionPlan fields. `TransitionPlan.intensity` is expression strength on a 0.0-1.0 scale, preferably quantized to 0.1 increments, and classifier confidence is only one input to that derived value.

## Proposed Source Structure

The initial prompt defines the required structure after Stage -2. Stage -1 confirms it is coherent, but implementation remains blocked until later gates.

The most important module boundaries are:

- `src/core`: app lifecycle and PetState ownership
- `src/input`: SVG prompt buffer, keyboard, composition, and caret behavior
- `src/character`: rig contract, required IDs, base character, and validation
- `src/emotion`: emotion catalog, intent catalog, pose map, app-owned display copy rules, and state rules
- `src/planner`: TransitionPlan type, sanitizer, deterministic development planner, planner routing
- `src/llm`: approved local model runtime and prompt/schema integration
- `src/engine`: interpolation, easing, frame scheduling, transition execution
- `src/render`: renderer, effects, speech bubble, pixel text, optional debug overlay
- `src/template` and `src/build`: SVG template and build/verification pipeline

Implementation order remains character-first:

1. character concept candidates
2. neutral base character and rig contract
3. 30-emotion pose sheet
4. prompt prototype
5. deterministic transition engine
6. model review and packaging strategy
7. local LLM planner
8. full integration

## State Model

Use one explicit state object owned by the runtime:

- current emotion
- current pose
- animation status
- prompt buffer state
- composition state
- model status
- last sanitized plan
- recent user prompts and app-owned display copy, if needed

Keep state visible and typed. Avoid hidden globals except the managed PetState instance. Persist nothing unless a later stage explicitly adds storage.

## Character Rig

The character is a stable SVG rig, not an opaque image. All emotion states use the same required IDs and slots. Optional visual parts remain present and hidden via opacity when inactive.

Rig validation must run before app start:

- every required ID exists
- IDs are unique
- root viewBox matches `0 0 100 100`
- pet and prompt layout areas match the coordinate contract
- hidden effect layers exist even when inactive

This supports deterministic rendering, stable tests, and rollback-safe pose changes.

## Prompt Input

The prompt is a custom SVG control.

Required state:

- committed text
- active composition text
- focus status
- caret visibility
- selection is intentionally not part of MVP unless later approved

Required behavior:

- click prompt focuses the SVG root or prompt group
- printable key input appends one Unicode code point when not composing
- Backspace deletes one Unicode code point when not composing
- Enter submits only when not composing
- compositionstart/update/end maintain a separate IME draft buffer
- placeholder hides when display text is non-empty
- prompt text is clipped to the prompt region

## TransitionPlan Sanitization

Model output is untrusted. Sanitization must:

- parse structured data only
- ignore unknown fields
- validate enum fields against known catalogs
- clamp numeric values
- correct or reject `from` if it does not match current emotion
- reject SVG, HTML, CSS, JS, path data, DOM selectors, URLs, and attribute names from model output
- return either a safe TransitionPlan or explicit model-unavailable/model-invalid status

The deterministic development planner is allowed only for engine and prompt testing. Production model failure must not silently fall back to deterministic non-LLM planning.

## Animation Engine

The animation engine owns all visual interpolation.

Inputs:

- current pose
- target pose from emotion catalog
- sanitized TransitionPlan
- clock time

Outputs:

- known SVG attribute changes on required rig slots
- low-FPS frame state for tests and visual preview
- completion signal for PetState

Use requestAnimationFrame as a wall-clock signal, but sample a deterministic frame index from duration and fps. This keeps pixel-style motion stable and testable.

Recommended approach:

- convert `durationMs` and `fps` to a fixed frame count
- compute normalized progress per frame
- apply named easing
- resolve discrete pose changes at stable thresholds
- interpolate numeric offsets, opacity, scale, and rotation
- support partial target-pose interpolation when `intensity` is below 1.0, so ambiguous prompts can stop partway toward the target emotion instead of forcing a full expression
- render only known rig IDs

## Local Model Runtime

Stage -1 does not choose a model. The architecture keeps a planner interface that can later be backed by an approved runtime.

Candidate runtime families:

- Transformers.js over ONNX Runtime
- direct ONNX Runtime Web with a custom model pipeline
- approved alternative if later research proves it better

Hard runtime requirements:

- no remote model loading
- no hosted inference
- no runtime network for model download after setup
- no API keys or secrets
- no backend or localhost inference bridge
- browser-side inference only in full local mode
- explicit unavailable status when model runtime fails

## Packaging Strategy

Packaging decision update:

- The direct-open SVG full local model path was tested and failed in normal Chrome because `file://` fetch of sibling model assets is blocked.
- Full local model mode is now an npm/npx experience with a localhost static server.
- GitHub Pages and direct-open SVG remain limited to deterministic demo behavior unless a later gate approves another model packaging route.

Options to evaluate later:

- A: true single-file SVG with embedded runtime/model assets
- B: SVG plus local sibling model/runtime assets, still no backend and no runtime network
- C: SVG plus development-only deterministic planner while LLM runtime is postponed
- D: another user-approved strategy

Current recommendation:

- Keep early implementation independent from model packaging.
- Build deterministic character/input/transition layers first.
- Use the npm/npx static-server distribution path for full local model mode.
- Serve the SVG app document directly; do not wrap it in an HTML runtime page.
- Do not commit model assets to Git.
- Do not present GitHub Pages as full local model mode.

## Security Model

Trust boundaries:

- user input is text, not code
- model output is untrusted data
- runtime owns all DOM IDs and rendering behavior
- local assets must be bundled or loaded only through an approved local strategy

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

Logs and debug output must not include secrets. The current product has no reason to handle secrets.

## Verification Strategy

Each stage must end with focused proof:

- Stage 0: concept previews and user approval
- Stage 1: rig validator and base SVG review
- Stage 2: POSE_MAP completeness and pose sheet review
- Stage 3: pure SVG prompt behavior and composition-event tests
- Stage 4: multi-frame transition tests and five preview transitions
- Stage 5: model candidate review with license/runtime/offline evidence
- Stage 6: packaging strategy evidence and approval
- Stage 7: local-only model runtime tests and network prohibition checks
- Stage 8: full prompt-to-transition integration
- Stage 9: unit/e2e/type/lint/build checks
- Stage 10: docs, screenshots/demo, final artifact review

## Stop Points

User confirmation is required before:

- Stage 0 starts
- any character concept is accepted
- neutral base SVG is accepted
- rig contract is accepted
- pose sheet is accepted
- transition previews are accepted
- Hugging Face model candidate is selected
- model packaging strategy is selected
- final artifact is accepted

Stage -1 ends by asking for Stage 0 approval.
