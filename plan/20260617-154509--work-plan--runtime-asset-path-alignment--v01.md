# Runtime Asset Path Alignment Work Plan

Plan Type: work-plan
Workstream: SVGotchi full local model runtime asset path alignment
Version: v01
Status: Complete
Created: 2026-06-17 15:45:09 Asia/Seoul
Last Updated: 2026-06-17 15:47:15 Asia/Seoul
Supersedes or Related Plan: Related to `plan/20260617-153649--work-plan--two-tier-distribution--v01.md`, `docs/distribution.md`, and Stage 7 local model runtime work
Current Completion State: Complete
Completed So Far: Runtime defaults now point at the distribution asset roots; explicit path overrides remain available; tests and distribution docs were updated; model and project verification passed; review score recorded
Remaining Work: No remaining work inside this narrow runtime path alignment scope
Current Blockers: No blocker for this task; browser direct-open SVG local sibling asset proof remains a later Stage 7/Gate I requirement
Next Step: Stop for user review; do not proceed into browser packaging proof, final integration, or PNG overlay implementation without explicit approval

## Scoreboard

Current score: 50
Score source: provisional
Last updated: 2026-06-17 15:45:09 Asia/Seoul

Score rationale:

The user has not provided an explicit numeric score. The workspace score-tracking contract caps provisional scores at 50. The user gave a concise approval signal after the scaffold result, which is enough to proceed with the next small implementation slice, but it is not an explicit score.

What improved:

The two-tier distribution scaffold now exists, large model/runtime payloads are ignored under `models/` and `runtime/`, and `npm run verify:model` can prove the installed local assets match a pinned manifest. The remaining mismatch is now specific: the runtime proof still accepts explicit paths that tests pass from `assets/`, while the distribution contract says full local mode should use `models/` and `runtime/`.

What remains unsatisfactory:

The runtime has not yet made the new distribution folders its default local asset source. Without this follow-up, a user can run the setup script successfully and pass `verify:model`, but the application-side runtime contract still depends on callers knowing which paths to pass. That is not a good full-local-mode default. Browser direct-open SVG asset loading also remains unproven, and this plan does not attempt to solve that later packaging concern.

Actions to raise or maintain the score:

Keep the implementation small and explicit. Add defaults in the runtime boundary, preserve current explicit override behavior for tests and future packaging experiments, prove the actual local model still runs, prove the new default paths are used in tests, and document that `npm install` plus setup now prepares the default runtime asset layout. Do not add a fallback planner, do not widen the model contract, and do not touch the character overlay work.

Score history:

- 2026-06-17 15:45:09 Asia/Seoul: provisional 50. Runtime asset path alignment approved by concise user signal; no explicit numeric score provided.
- 2026-06-17 15:47:15 Asia/Seoul: provisional 50. Runtime asset path alignment completed and verified; review scored 95/100; provisional user score remains capped because no explicit numeric score was provided.

## Understanding Report

The user's "ㄱ" is treated as approval to proceed with the next logical follow-up from the prior report: connecting the full local LLM runtime boundary to the new two-tier distribution folders. The intent is not to rewrite the model runtime, not to change the classifier, and not to implement the PNG overlay character rig. The intent is to remove the remaining path mismatch between the newly created setup/verify flow and the Stage 7 runtime proof.

The current runtime already satisfies the important safety contract: it disables remote model loading, enables local model loading, sets ONNX WASM paths explicitly, uses `local_files_only: true`, and maps model labels/scores into a sanitized app-owned `TransitionPlan`. The current weakness is ergonomic and distribution-facing: callers must pass `localModelPath` and `wasmPath`, and the only test currently passes `assets/model` and `assets/runtime/onnxruntime`. Those proof assets predate the distribution scaffold. The new setup script installs or copies payloads into `models/onnx-community/tanaos-emotion-detection-v1-ONNX` and `runtime/onnxruntime`; the runtime should therefore be able to use those folders by default.

The smallest complete implementation is to make runtime options optional for the default path case, provide exported constants or helpers for the canonical local model/runtime asset paths, and have the existing classifier factory resolve missing path options to those defaults. Explicit options should remain supported because tests, packaging experiments, and future direct-open SVG layouts may need to provide different paths. This preserves behavior for current callers while making full local mode work naturally after `scripts/setup-model.*` has installed the assets.

## Objective

Align the Stage 7 local model runtime with the approved two-tier distribution model by making the ignored local asset folders the default source for full local LLM mode.

The end state should be:

- `scripts/setup-model.*` installs or copies assets into the same folders that the runtime defaults to using.
- `npm run verify:model` confirms those default folders contain the pinned model and runtime files.
- `createTanaosEmotionClassifierRuntime()` can be called without explicit asset paths in Node tests and should use the default full-local-mode folders.
- Existing explicit path options remain available.
- No remote model download or hosted inference is introduced.
- No deterministic planner substitution is introduced.
- No model output contract changes are introduced.
- No character rig, overlay rig, transition engine, or SVG rendering behavior is changed.

## Confirmed Constraints

The runtime must remain local-only. Remote model loading must stay disabled. The model must not call a hosted inference endpoint, external API, backend server, localhost server, or runtime download. Setup-time downloads are allowed through the setup scripts, but runtime must consume local files.

Large model files must not be committed. `models/` and `runtime/` remain ignored except for `.gitkeep`. The implementation must not use Git LFS. The implementation must not pretend the model is small or try to embed it into a single SVG.

The model output contract remains constrained. The classifier returns labels and scores; the app maps those into a sanitized `TransitionPlan`. The model must not output reply text, SVG, JavaScript, CSS, DOM patches, raw path data, or arbitrary overlay choices. This task should not expand `TransitionPlan`.

The deterministic transition engine remains unchanged. Character assets and Stage 1-4 artifacts remain unchanged. The PNG overlay proposal and character migration work remain approval-gated separately.

## Implementation Strategy

Use the smallest runtime-boundary change that makes the new distribution folders first-class defaults.

The runtime should expose canonical path constants for:

- model root: `models/onnx-community/tanaos-emotion-detection-v1-ONNX`
- Transformers local model path root: `models/`
- ONNX runtime root: `runtime/onnxruntime`

Transformers.js expects `env.localModelPath` to point at the root that contains the model namespace path, not necessarily the specific model directory. The current test passes `assets/model/`, and the model ID is `onnx-community/tanaos-emotion-detection-v1-ONNX`, so the default should mirror that structure by using `models/` as the local model root. The model verifier checks the fully nested model directory under `models/onnx-community/tanaos-emotion-detection-v1-ONNX`, which matches this expectation.

The ONNX runtime path should default to `runtime/onnxruntime/`, because that folder contains `ort-wasm-simd-threaded.mjs` and `ort-wasm-simd-threaded.wasm`.

Runtime options should become partially optional. Existing code that passes explicit paths should continue to work. The factory should resolve the final runtime options internally before configuring Transformers.js. This avoids forcing callers to learn path details when they want the standard full-local-mode setup.

The implementation should avoid a new abstraction layer unless it directly clarifies the path contract. A small `resolveTanaosRuntimeOptions` helper is acceptable if it is exported for tests and documentation clarity. It should not become a generic plugin registry, environment manager, or model catalog.

## File Scope

Expected writable files:

- `src/llm/modelRuntime.ts`
- `tests/llmPlanner.test.ts`
- `docs/distribution.md`
- `plan/svgotchi-active-plan.md`
- this work plan file
- a new review file under `plan/stage-reviews/` after verification

Files that should not change:

- `src/llm/localTransitionPlanner.ts`, unless verification proves a narrow import update is required
- `src/llm/transitionPlanSchema.ts`
- `src/llm/sanitizeTransitionPlan.ts`
- `src/engine/*`
- `src/character/*`
- `src/render/*`
- Stage 1-4 SVG assets and preview artifacts
- PNG overlay proposal documents, except if a future user request explicitly returns to that work
- `dist/`

## Work Sequence

First, update the runtime boundary. Add canonical default path constants and allow `createTanaosEmotionClassifierRuntime()` to be called without explicit paths. Keep the default model ID unchanged. Keep `env.allowRemoteModels = false`, `env.allowLocalModels = true`, and `local_files_only: true`. Preserve the existing `configureLocalTransformersRuntime` behavior, but feed it resolved options so callers with partial options are handled consistently.

Second, update the model runtime test. The actual local model test should use the default runtime path after the setup script has populated `models/` and `runtime/`. Add or adjust an assertion that the resolved defaults point at the distribution folders. Keep the actual model behavior assertions: clear English prompts still produce expected top labels and sanitized emotions. This proves the path alignment without weakening the model behavior contract.

Third, update `docs/distribution.md`. Remove the obsolete statement that the scaffold does not wire the folders into runtime loading. Replace it with the current boundary: setup installs assets into the default full-local-mode locations, the verifier proves them, and the runtime defaults to those locations while still allowing explicit path overrides in development or packaging experiments. Keep the GitHub Pages distinction intact.

Fourth, run verification. Run `cmd /c npm run verify:model` first to prove assets are installed in the default distribution folders. Then run `cmd /c npm run verify` to prove typecheck and all tests pass through the default runtime paths. Use `cmd /c` because direct PowerShell `npm run verify` was previously blocked by execution policy around `npm.ps1`.

Fifth, do a read-only review. Confirm no `dist` was created, no character/transition engine files were touched, no fallback planner was introduced, remote model loading remains disabled, and large payloads remain ignored. Record the review score in `plan/stage-reviews/`.

Sixth, update `plan/svgotchi-active-plan.md` and this plan file with verification results, review score, and the next gate. If the implementation reveals a meaningful risk or failing verification, keep the repair narrow and repeat verification.

## Test and Verification Plan

The main proof is an actual model call using default full-local-mode paths. The test should not merely assert string constants. It should instantiate the classifier without explicit path options and classify the same stable English samples already used in the suite. If that passes, it demonstrates that setup plus defaults plus Transformers.js local loading all line up.

Required commands:

- `cmd /c npm run verify:model`
- `cmd /c npm run verify`

Additional read-only checks:

- confirm `dist` does not exist;
- scan `src/llm/modelRuntime.ts` for `allowRemoteModels = false` and `local_files_only: true`;
- scan for accidental references to hosted inference, fallback planner, or remote model URLs in runtime code;
- inspect that `models/` and `runtime/` contain ignored payloads and `.gitkeep`, not committed intent;
- confirm `git status` if the workspace exposes Git, or report that Git metadata is unavailable if it remains unavailable.

## Risks

The main technical risk is misunderstanding the path expected by Transformers.js. The model ID includes the namespace and model directory, so `env.localModelPath` should be the root folder that contains `onnx-community/tanaos-emotion-detection-v1-ONNX`, not the model folder itself. The existing `assets/model` test confirms that structure. The new default should use `models/`, not the nested model directory. The verifier still checks the nested directory because it verifies concrete files.

Another risk is making runtime options too loose. If options become optional but missing files produce vague downstream errors, the user experience is poor. The current task can rely on `npm run verify:model` as the explicit asset check, and the docs should say to run it before full local mode. A later improvement could make runtime startup call the same manifest verifier or surface a clearer unavailable status, but this plan should avoid broadening into a new runtime health-check system unless tests fail in a confusing way.

There is a release risk around the POSIX setup script. It was created but not run in the Windows session. This plan does not need to change it unless path alignment reveals a mismatch. It should still be reviewed as part of the distribution docs, but the main executable proof here is the Windows setup already completed and the Node test running against the resulting default folders.

There is a browser packaging risk. Node tests can prove the local files are present and loadable from the project root. They cannot prove direct-open SVG browser loading, CORS/file URL behavior, or future bundling rules. That remains the later Stage 7/Gate I browser-context proof and should not be silently claimed as complete.

## Definition of Done

This task is complete when:

- the runtime has canonical defaults for `models/` and `runtime/`;
- `createTanaosEmotionClassifierRuntime()` works without explicit asset paths after setup;
- explicit asset path overrides still work;
- actual local model tests pass using default paths;
- docs state that setup installs the default full-local-mode runtime layout;
- `npm run verify:model` passes;
- `npm run verify` passes;
- no `dist` is created;
- no character, transition engine, or PNG overlay implementation is modified;
- no fallback planner, remote model loading, hosted inference, backend, localhost dependency, or runtime download is introduced;
- active plan and review notes record the score and verification outcome.

## Approval State

The user's concise "ㄱ" after the prior report is treated as explicit approval for this narrow follow-up. If the user later clarifies that "ㄱ" meant a different target, this plan should be superseded and any implementation outside the corrected scope should stop.

## Completion Notes

Completed at 2026-06-17 15:47:15 Asia/Seoul.

Implemented:

- `src/llm/modelRuntime.ts` now exports default local asset path constants for `models/` and `runtime/onnxruntime/`.
- `createTanaosEmotionClassifierRuntime()` can now be called without explicit paths and uses the setup-installed distribution layout by default.
- Explicit runtime path overrides are still supported and normalized with a trailing slash.
- `tests/llmPlanner.test.ts` now verifies the default path contract and calls the actual local Tanaos model through default paths.
- `docs/distribution.md` now states that runtime defaults to the setup-installed local folders.

Verification:

- `cmd /c npm run verify:model`: passed.
- `cmd /c npm run verify`: passed with 36 tests.
- `dist` check: passed, no `dist` directory exists.
- Read-only scope scan: passed, no character, render, or transition engine changes were made.
- `git status --short`: unavailable because this workspace is not exposed as a Git repository.

Review:

- Review file: `plan/stage-reviews/runtime-asset-path-alignment-review.md`
- Overall score: 95/100
