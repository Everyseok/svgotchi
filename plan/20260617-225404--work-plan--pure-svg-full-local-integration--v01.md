# Pure SVG Full Local Integration Work Plan

Plan Type: work-plan
Workstream: SVGotchi pure-SVG full local browser integration
Version: v01
Status: Complete, full browser-local verification passed
Created: 2026-06-17 22:54:04 Asia/Seoul
Last Updated: 2026-06-17 23:48:24 Asia/Seoul
Supersedes or Related Plan: Builds on `plan/20260617-223315--work-plan--npm-npx-public-distribution--v01.md`, `docs/distribution.md`, `docs/local-static-server.md`, `docs/architecture.md`, and `plan/stages/stage-08-full-integration.md`
Current Completion State: Complete for the scoped pure-SVG served integration slice
Completed So Far: `/` now serves an SVG app document instead of HTML; `assets/svgotchi-browser.js` implements SVG prompt handling, demo/full classifier flow, app-owned TransitionPlan mapping, and deterministic SVG rig animation; static server smoke checks content types; Chrome served-SVG demo and full model proofs pass; `verify:runtime` and `verify:release` are available; docs, package scripts, manifest, and ignored payload rules are updated
Remaining Work: Final release hardening, future source-sharing refactor for browser/runtime logic, performance tuning if model load is too slow, and PNG overlay rig implementation remain later work
Current Blockers: No code blocker for the scoped slice. Full browser-local model mode is now automatically verified through Chrome DevTools Protocol.
Next Step: Review refactor and architecture risks before choosing the next implementation gate.

## Scoreboard

Current score: 50
Score source: provisional
Last updated: 2026-06-17 23:48:24 Asia/Seoul

Score rationale:

The user has not given an explicit numeric score. The last reviewed technical scaffold scored 95/100, and the user confirmed it worked enough to continue. The current local score remains provisional and capped at 50 by workspace policy because no explicit user score has been provided. The next work should raise practical product value by turning the verified local static-server foundation into an actual pure-SVG browser integration path.

What improved:

The direct-open full local blocker has already been replaced by an npm/npx localhost static-serving path. The local model files are present and verified. The project now has a clear rule that localhost may only serve static bytes and must not be an inference backend. The served runtime is now an SVG document, not an HTML wrapper, and full browser-local model mode is verified in Chrome.

What remains unsatisfactory:

The remaining dissatisfaction is architectural, not a current execution blocker. Browser runtime logic duplicates a compact copy of mapper, sanitizer, pose, and transition behavior because the repo intentionally still has no browser build or `dist` pipeline. Full local model mode also carries a real setup payload of about 164.15 MiB, so final release messaging and performance checks still matter.

Actions to raise or maintain the score:

Keep the SVG document route and static-only server boundary, then decide whether to add a future build-hardening gate that shares TypeScript source with the browser runtime without creating unmanaged release artifacts. Maintain explicit setup-size messaging and keep large model/runtime payloads ignored.

Score history:

- 2026-06-17 22:54:04 Asia/Seoul: provisional 50. User approved continuing from the Markdown records and clarified that HTML code should not remain in the runtime surface; no explicit numeric user score provided.
- 2026-06-17 23:22:31 Asia/Seoul: provisional 50. Pure-SVG served integration slice completed; review scored 94/100; full browser local model automated proof remains a residual manual-check item.
- 2026-06-17 23:48:24 Asia/Seoul: provisional 50. Full browser local model proof now passes through Chrome CDP; `verify:release` also passes; review score updated to 96/100; remaining concern is targeted refactor risk, not runtime breakage.

## Understanding Report

The user wants the next implementation to follow the Markdown documents and the decisions accumulated in recent work. The immediate next useful slice is Stage 8 full integration, but with an important correction: the app should not be built as an HTML page around the SVG. The existing static server is still acceptable, but only as a static byte server. The runtime surface should be an SVG document, with SVG prompt elements and SVG-rendered animation. This preserves the original pure-SVG product direction while still using localhost to avoid browser `file://` restrictions for model, WASM, and JavaScript assets.

The safest assumption is that the current approved Mochi Sprout primitive SVG rig remains the active character for this slice. The PNG overlay rig has a proposal and review score, but its implementation remains a separate Gate X path and should not be mixed into Stage 8. The current task should therefore connect the existing Mochi Sprout rig to local browser inference and deterministic transition rendering. It should not silently replace the character, create a new character image, vector-trace PNGs, create `dist`, or modify the transition engine contract unless a narrow bug is found.

The runtime must preserve the model contract. The model is the Tanaos emotion classifier. It must output classifier labels and scores only. The app must map those labels to a sanitized TransitionPlan. The model must not generate pet reply text, raw SVG, JavaScript, CSS, DOM patches, arbitrary path data, selectors, or animation code. Any debug or display text about model status must be app-owned.

The current server implementation has a `renderIndex()` function that returns HTML. That was acceptable as a temporary static-server shell for distribution verification, but it conflicts with the user's "no HTML code" expectation and the ADR that rejects an HTML wrapper as the runtime. The new implementation should make `/` and `/svgotchi.svg` return an SVG document with `Content-Type: image/svg+xml`. The SVG should include the current base character and prompt elements, and should load a static browser JavaScript module through an SVG `script` element. The server may still serve that JavaScript module, the Transformers.js browser bundle, model JSON/tokenizer/ONNX files, and ONNX Runtime WASM files as static files.

## Objective

Implement a first pure-SVG full local browser integration path where a user can run the local static server, open the served SVG document, type a prompt into the SVG prompt area, submit it, have the browser load the local classifier from local model/runtime assets, convert the classifier output into a sanitized app-owned TransitionPlan, and animate the existing Mochi Sprout rig through known SVG IDs.

The minimum acceptance demo is:

- run `npm run serve`;
- open `http://127.0.0.1:4173/`;
- see the SVG document directly, not an HTML page;
- click the SVG prompt area;
- type `you are cute`;
- submit with Enter or the SVG send zone;
- the browser runs local classification without a server inference endpoint;
- the app maps the result to `shy_love`, `love`, or another approved affectionate/happy emotion depending on classifier output and mapper rules;
- the pet animates through deterministic transition frames;
- visible status remains app-owned and does not look like a model-generated reply.

## Non-Negotiable Constraints

Do not add an HTML input, HTML button, form, contenteditable surface, `foreignObject`, canvas, React, or another DOM framework. The served app surface should be SVG.

Do not add a backend inference route. The server must not receive prompt text. It may only serve static files from approved roots.

Do not call external inference APIs, hosted Hugging Face inference, OpenAI, Anthropic, Gemini, or any other hosted model service. Runtime after setup must not silently download model files.

Do not create `dist` in this task. The current public distribution path is a static server serving source assets and ignored local model/runtime folders.

Do not replace Mochi Sprout with the PNG overlay rig. Do not implement eye/mouth overlay PNG logic in this Stage 8 slice. The overlay path remains separate even though it is documented.

Do not let model output choose arbitrary overlays, DOM selectors, raw SVG, CSS, JavaScript, path data, reply text, or animation code. The browser mapper must use approved enum-like values and app-owned rendering behavior.

Do not widen scope into npm publishing, GitHub Pages release, package signing, or a final artifact review. This is a local full-mode integration slice, not a final release.

## Implementation Strategy

Use a thin browser-side JavaScript module under committed small assets. Because the repo intentionally does not create `dist` yet and the browser cannot import TypeScript directly, the first browser integration should be plain JavaScript. Keep it small and explicit rather than introducing a bundler. This avoids a build pipeline and keeps the server static-only.

The browser module should import Transformers.js from the local static route. It should configure:

- `env.allowRemoteModels = false`;
- `env.allowLocalModels = true`;
- `env.localModelPath = "/models/"`;
- ONNX WASM paths under `/runtime/onnxruntime/`;
- `pipeline("text-classification", "onnx-community/tanaos-emotion-detection-v1-ONNX", { dtype: "int8", local_files_only: true })`.

The browser module should own a small explicit state object:

- current emotion;
- current prompt buffer;
- model status;
- classifier load promise;
- last classifier labels;
- last sanitized plan;
- animation in-flight flag.

Prompt input should be SVG-owned. The existing SVG has `prompt-area`, `prompt-bg`, `prompt-placeholder`, `prompt-text`, `prompt-caret`, `send-zone`, and `send-label`. The browser code should reuse those IDs. It should handle click-to-focus, printable key append, Backspace, Enter, and send-zone click. It should keep composition handling simple and safe in this first slice: if composition events are available on the SVG root, maintain an IME draft; otherwise do not corrupt committed text. Existing TypeScript input modules already cover the more complete unit-tested logic, but the browser module should avoid importing TS until a build step exists.

Transition mapping should mirror the approved app-owned classifier mapper. The browser module may duplicate the small deterministic mapping logic for now because there is no browser build pipeline. The duplication should be kept narrow and reviewed. A later build/hardening task can share TypeScript sources between Node tests and browser code.

Rendering should mutate only known SVG rig IDs. The simplest complete renderer can update:

- `pet` transform for body motion, scale, rotation, and offsets;
- `eye-left` and `eye-right` geometry/visibility for known eye poses;
- `mouth` geometry/visibility for known mouth poses;
- `brow-left` and `brow-right` geometry/opacity for known brow poses;
- `blush-left` and `blush-right` opacity;
- `effect-hearts`, `effect-sparkles`, `effect-tears`, `effect-zzz`, `effect-question`, and `effect-anger` opacity.

If the existing base SVG uses `rect` elements for eyes and mouth, the browser renderer may replace their known attributes and simple `d` attributes only on approved rig IDs. It should not create arbitrary model-derived nodes. If a shape needs to switch between rect and path for a pose, the safer MVP is to make a small fixed set of renderer-owned child nodes or use a deterministic `innerHTML` from a hardcoded table. That hardcoded table is not model output.

The first slice should not try to replicate the full preview renderer's exact visual richness if that would bloat the runtime. It should prove the end-to-end local path and known-ID mutation. Existing transition engine behavior in TypeScript remains the canonical tested engine; the browser code can use a small matching implementation until a build pipeline is approved.

## Ordered Work Sequence

Phase 1 is plan and contract alignment. Confirm the user clarification that HTML code should not remain as the runtime surface. Save this plan. Update the active plan after implementation begins and after completion.

Phase 2 is SVG app serving. Replace the server's HTML `renderIndex()` route with an SVG document route. The route should return `image/svg+xml`. The SVG document should be based on the existing `BASE_CHARACTER_SVG` asset or a small generated SVG string that preserves the current rig IDs. It should include only SVG elements and a script link to the browser module. The server's `/assets/*`, `/models/*`, `/runtime/*`, and `/vendor/transformers/*` static routes should remain static-only.

Phase 3 is browser module foundation. Add a small browser JavaScript file under `assets/`, include it in `package.json` files, and serve it as `text/javascript`. The module should attach to the SVG document, expose a minimal debug status through existing SVG text or a new SVG text node, and implement prompt buffer behavior without HTML controls.

Phase 4 is browser local model connection. Configure Transformers.js with local-only paths, lazy-load the classifier on first submit or app start, classify the prompt, normalize the output, and map it into a sanitized TransitionPlan. Errors should show explicit model unavailable status in SVG-owned text, not silently fall back to a deterministic production planner.

Phase 5 is deterministic animation. Add browser-side transition frame generation or a compact equivalent that applies the sanitized plan to known SVG IDs over multiple frames. Use requestAnimationFrame as the clock and sample low-FPS frame indices from the plan's duration and fps. Keep current emotion updated only after the transition completes.

Phase 6 is verification and docs. Add focused tests for static server contract where practical. At minimum, `serve:smoke` must verify that `/` returns SVG and that `/assets/svgotchi-browser.js` or the chosen browser module path returns JavaScript. Run `npm run verify:model`, `npm run serve:smoke`, and `npm run verify`. Update README/docs if the usage or runtime route changes.

Phase 7 is review. Record a stage review file under `plan/stage-reviews/` with score, findings, verification evidence, and residual risks. Update `plan/svgotchi-active-plan.md` with completion state and next action.

## Validation Requirements

The server smoke check must fail if `/` is not HTTP 200, if `/assets/base-character.svg` is not HTTP 200, if the browser integration JavaScript is not HTTP 200, or if full mode cannot access `/models/onnx-community/tanaos-emotion-detection-v1-ONNX/config.json`.

TypeScript verification must continue to pass. Existing unit tests must not be weakened. If any test changes, the change must be directly tied to the new pure-SVG served runtime contract.

A read-only scan should confirm no `dist` directory exists after this task.

A search should confirm no `<input`, `<button`, `<form`, `contenteditable`, `foreignObject`, hosted inference URL, or prompt-submission endpoint is added to the served runtime.

Browser manual testing is desirable but may be limited by the available tool surface. If a full browser run is not possible in this session, the final report must say so clearly and provide the exact command for the user to run.

## Risks And Mitigations

The main risk is browser module loading from SVG. SVG script module behavior can differ from HTML script behavior. The mitigation is to keep the app served as an SVG document over HTTP and use a standard SVG `script` element with `href` pointing to the module. If module scripts are unreliable in target browsers, the fallback should be a non-module plain script that uses global imports only if the local Transformers bundle exposes them. This fallback should be tested before claiming broad support.

Another risk is duplication between TypeScript Node-tested mapper code and browser JavaScript mapper code. The mitigation for this slice is to keep the browser copy small, deterministic, and visibly tied to the same enum values. A later build step can remove duplication by bundling the TypeScript source. Do not add a bundler in this task unless browser execution is otherwise impossible.

Another risk is performance. Loading roughly 164.15 MiB of local model/runtime assets in the browser can take time. The SVG should show explicit app-owned loading status. It should not freeze the prompt with no feedback.

Another risk is over-claiming. This slice should prove the full local browser path for the current Mochi Sprout rig. It should not claim final release readiness, npm publication, PNG overlay completion, or final artifact acceptance.

Another risk is accidentally turning localhost into an application backend. The mitigation is simple: do not add any route that inspects request bodies, prompt text, or query prompts. Keep the server route table static-file only.

## Definition Of Done

This task is complete when:

- `/` serves an SVG document, not an HTML page;
- no separate HTML runtime page is required;
- the SVG document contains the prompt surface and current Mochi Sprout rig IDs;
- the browser module is served as a static asset;
- the browser module loads the local classifier with remote model loading disabled;
- the browser module maps classifier labels/scores into app-owned TransitionPlan values;
- prompt submission can trigger a deterministic multi-frame transition of known SVG rig IDs;
- model failure shows explicit unavailable status and does not silently substitute a production deterministic planner;
- `npm run verify:model` passes;
- `npm run serve:smoke` passes and checks the new SVG route;
- `npm run verify` passes;
- no `dist` directory is created;
- no HTML controls, `foreignObject`, canvas, React, backend inference route, hosted inference API, or runtime model download path is introduced;
- docs and active plan reflect the new pure-SVG served runtime status;
- a review file records the score and residual risks.

## Approval State

The user said to proceed according to the Markdown files and the recently accumulated changes, then clarified that there should be no HTML code. This is treated as approval for this Stage 8 pure-SVG full local integration slice. It is not approval for PNG overlay implementation, npm publication, GitHub release work, or final artifact acceptance.
