# Public Pre-Release Cleanup Work Plan

Plan Type: work-plan
Workstream: public-pre-release-cleanup
Version: v01
Status: Completed
Created: 2026-06-19 11:54:52 Asia/Seoul
Last Updated: 2026-06-19 11:58:38 Asia/Seoul
Supersedes or Related Plan: Related to `plan/current-next-steps.md`, `plan/svgotchi-active-plan.md`, and the completed label/score emotion routing work plan
Current Completion State: Complete for the approved public pre-release cleanup scope
Completed So Far: Release viability review found that the core SVG, local model, static server, packaging, and verification paths are working; `verify:release` and npm package dry-run passed before this plan was created. The approved cleanup then updated public-facing model terminology, split the actual model integration test from baseline `npm test`, preserved the model integration proof under `npm run test:model` and `verify:release`, moved the root semantic-routing scratch note into `plan/backlog-semantic-routing.md`, refreshed the short handoff, and re-ran verification successfully.
Remaining Work: No work remains inside this approved cleanup scope. Deferred future work remains: planner source-sharing, full semantic routing pipeline, Gate X PNG overlay implementation, and final artifact review.
Current Blockers: None for this cleanup scope. Gate X PNG overlay implementation remains blocked by explicit approval policy. The large semantic routing pipeline remains deferred unless separately approved.
Next Step: Stop feature development and use the repository as an experimental/pre-alpha GitHub-ready baseline. If work resumes, choose a separate approved scope for final artifact review, source-sharing refactor, or semantic routing.

## Scoreboard

Current Score: 50/100
Score Source: provisional
Last Updated: 2026-06-19 11:58:38 Asia/Seoul

Score Rationale: The actual product path is substantially verified, but the workspace score remains capped because the user has not provided an explicit numeric score. The public release readiness review rated the project around 82/100 as an experimental/pre-alpha GitHub project. This cleanup should improve reader trust and reduce accidental breakage without claiming the project is finished.

What Improved: The core served SVG path, browser-local model path, static-only localhost boundary, package dry-run, release verification, and the sad-to-comforted routing bug are already verified. The cleanup also made public terminology more accurate, separated baseline tests from actual model integration, preserved the stronger release verification path, and moved a temporary root scratch file into a properly named deferred backlog document.

What Remains Unsatisfactory: Planner logic remains duplicated between `src/llm/localTransitionPlanner.ts` and `assets/svgotchi-browser.js`, but that larger source-sharing refactor is intentionally outside this cleanup. The semantic routing pipeline remains deferred future work. Historical ADRs still mention earlier LLM packaging analysis where that history is intentional.

Actions To Raise Or Maintain Score: Keep changes narrow, preserve all verified runtime behavior, make the README and user-facing docs describe the model accurately, make baseline tests usable before model setup, retain explicit release verification for model-backed behavior, and leave a clear backlog note for future semantic routing rather than silently pretending that work is complete.

Score History:
- 2026-06-19 11:54:52 Asia/Seoul: provisional 50/100. Public pre-release cleanup plan created after the user agreed to stop feature development and focus on release-facing cleanup. The provisional score remains capped because no explicit user score has been provided.
- 2026-06-19 11:58:38 Asia/Seoul: provisional 50/100. Cleanup completed and verified. The score remains capped because no explicit user score has been provided, even though release readiness improved.

## Objective

Prepare the current SVGotchi repository for a safer GitHub upload as an experimental or pre-alpha project without starting a new feature phase. The result should make the current state honest, reproducible, and easier for a public reader to understand. The cleanup should not change the approved product architecture, model choice, runtime boundary, character renderer, animation engine, prompt UI, or planner semantics beyond test-surface separation and public-facing wording.

The core product path is already working: an npm/npx static server serves an SVG app document, the browser loads local Transformers.js and local ONNX model/runtime assets after explicit setup, the classifier returns label and score evidence, the app maps that evidence into a sanitized TransitionPlan, and deterministic SVG animation applies the transition. The immediate risk is not that the runtime is fundamentally wrong. The immediate risk is that the repository still has rough public edges that can confuse a reader or make a fresh checkout appear broken before model setup.

This plan intentionally treats the current implementation as a validated experimental baseline. It does not attempt to make a final product release, publish to npm, open a GitHub repository, or complete the deferred semantic routing architecture.

## Confirmed Facts

The latest release verification passed before this plan was created. That verification included TypeScript checking, browser JavaScript syntax checking, the Node test suite, model asset checksum verification, static-server smoke checking, Transformers.js import verification, served SVG demo verification, and served SVG full local model verification through Chrome automation.

The npm package dry-run also passed before this plan was created. The generated package was small, around 85.7 kB compressed and around 354.6 kB unpacked, and it did not include the large model/runtime payloads. The package includes `.gitkeep` placeholders for `models/` and `runtime/`, while the real model/runtime files remain ignored local assets.

The current model is `onnx-community/tanaos-emotion-detection-v1-ONNX`. It is used as a local browser-side emotion classifier, not as a general text-generating LLM. It returns classifier labels and scores. App-owned code maps those labels and scores into a TransitionPlan. Model output still must not generate reply text, raw SVG, path data, CSS, JavaScript, selectors, DOM patches, animation code, or arbitrary overlay choices.

The `sadness` routing bug is already fixed in the currently verified implementation. A user affect statement such as `I'm sad` no longer becomes a comfort request merely because it contains sad wording. `comforted` is reserved for explicit support requests such as `comfort me`, `help me`, `hug me`, `cheer me up`, or `hold me`.

The root `1.md` file contains a more ambitious semantic routing refactor proposal. That proposal is useful as future backlog material, but it does not describe the current implemented architecture. It asks for concepts such as `SemanticSignals`, `speechAct`, `target`, `accentEmotion`, and at least 80 routing cases. That larger work has not been implemented and should not be presented as complete.

## Safe Assumptions

The user wants to stop feature development for now and avoid starting the large semantic routing refactor during this cleanup. The user also wants the current project to be in a state that can be uploaded to GitHub without obvious public-facing contradictions.

The correct public positioning is experimental/pre-alpha, not production-ready. The project can claim that the current local SVG model path works under the verified environment, but it should not imply broad browser support, npm production maturity, or final semantic routing completeness.

The cleanup should prefer low-risk documentation and test-surface changes over architectural rewrites. Any behavior change that could affect the browser runtime, model mapping, animation engine, character rig, or static server should be avoided unless it is necessary to preserve existing verified behavior after test splitting.

## Explicit Non-Goals

Do not implement the full semantic routing pipeline from the old root `1.md` note. That work would introduce new concepts, new schema surface, and new behavior. It needs a separate approved plan if it becomes the next priority.

Do not add `accentEmotion` or `accentWeight` to TransitionPlan in this cleanup. Those concepts are future architecture candidates and would require renderer and schema decisions.

Do not refactor planner source-sharing between `src/llm/localTransitionPlanner.ts` and `assets/svgotchi-browser.js` during this cleanup. The duplicate browser planner remains the main code-health risk, but it is currently covered by targeted e2e checks. A source-sharing refactor should happen only after a separate plan because it can affect browser loading, package layout, and the no-`dist` policy.

Do not implement the Gate X PNG-preserving anime overlay rig. That gate remains blocked until explicit approval.

Do not change the model selection, model asset manifest, static server architecture, or runtime security boundary.

Do not publish to npm or GitHub as part of this cleanup. This plan prepares the repository; publishing is a later user action unless separately requested.

## Work Sequence

### Phase 1: Public terminology cleanup

Update the primary public README so it describes the current model path accurately. Replace user-facing "Full Local LLM Mode" wording with "Full Local Model Mode" or a similarly precise phrase. Explain that the current model is a local browser-side emotion classifier. Preserve the important boundary that localhost is static serving only and that inference runs in the browser.

Avoid rewriting every historical ADR. Some ADRs intentionally discuss prior local LLM plans and superseded alternatives such as Qwen, Gemma, or GGUF candidates. Those historical details should remain when they are clearly historical. The cleanup should focus on the docs most likely to be read first by a public user: README and small current distribution/setup docs if necessary.

Ensure the README communicates that this is an experimental/pre-alpha project. A public reader should understand that the deterministic demo is the lighter path, while full local model mode requires explicit setup and large local assets.

### Phase 2: Baseline test split

Separate the model-dependent integration test from the baseline `npm test` command. A fresh checkout should be able to run baseline unit tests after `npm install` without requiring the 164 MiB local model/runtime payload.

Keep planner unit tests that use fixed classifier result fixtures in the baseline test suite. These tests prove the corrected sad/support routing and app-owned mapping logic without loading the actual model.

Move or isolate the actual local model call test into a dedicated model/integration test command. The release verification path should still run this model-dependent test after `verify:model` confirms the assets exist. This preserves the strong proof that the app can call the actual local model while making the default test command less surprising.

Update `package.json` scripts conservatively. The likely shape is that `npm test` remains baseline and model-free, while a new command such as `test:model` performs the actual local model runtime test. `verify:release` should include the model-dependent test because release verification is expected to require full local assets.

Do not weaken `verify:release`. The public project should keep a strict full verification command for maintainers who have run setup.

### Phase 3: Temporary semantic-routing note cleanup

Move the root `1.md` scratch note into a proper plan/backlog document. The new document should say clearly that it is future work and not part of the currently implemented public baseline. It should preserve the useful problem statement and examples but remove mojibake or accidental encoding noise where possible.

The backlog document should make the decision boundary explicit: the current release keeps the smaller label/score routing fix, while a future semantic routing pipeline remains optional and separately approved.

Removing or relocating `1.md` from the repository root reduces public confusion. The root directory should not contain unexplained temporary handoff files.

### Phase 4: Current handoff update

Refresh the short current-next-steps handoff so it describes the new public cleanup state. It should still name Stage 9 release verification hardening as the current line of work if verification remains open, but it should not imply that the old scratch note is the active implementation scope.

If the cleanup succeeds, update the handoff to say that baseline tests are model-free and that full release verification remains the command for local model coverage.

### Phase 5: Verification

Run baseline verification after the edits. At minimum, run `cmd /c npm test` and `cmd /c npm run verify` to prove the model-free baseline still passes.

Run the dedicated model-dependent command if one is created and local assets are present. Then run `cmd /c npm run verify:release` if the edit surface touched package scripts or release verification ordering.

Run npm package dry-run again if `package.json`, files, or public packaging docs changed. Confirm large model/runtime payloads remain excluded.

If any verification fails, fix only the narrow cause inside this cleanup scope. Do not widen into semantic routing refactor or runtime architecture changes.

## Acceptance Criteria

The README should no longer present the current path as a generic LLM experience when the actual selected model is an emotion classifier. It may still mention the historical local-model goal if the wording clearly distinguishes classifier-based current behavior from prior or future LLM options.

The default `npm test` path should not require installed model/runtime assets. A fresh developer should be able to understand and run baseline tests without running setup-model first.

The strict full release path should still verify the local model assets and actual model behavior when assets are present. The cleanup must not turn full-mode verification into a weaker smoke test.

The root `1.md` file should not remain as an unexplained public artifact. Its useful content should be preserved in a better-named backlog or planning document, or it should be explicitly documented as deferred work.

No large model/runtime files should enter the npm package. The package dry-run should continue to show only placeholders for `models/` and `runtime/`.

No runtime behavior should change for the served SVG app. The same prompt-to-transition checks should remain valid.

## Risks And Mitigations

The main risk is accidentally weakening verification while trying to make baseline tests friendlier. Mitigation: add a dedicated model-dependent test script and keep it in `verify:release`.

Another risk is creating documentation drift by changing terminology in only one place. Mitigation: update the high-visibility docs that describe current usage, and leave historical ADRs intact when their context is clear.

Another risk is treating the semantic routing backlog as implemented. Mitigation: name the backlog document plainly and state that it is future work requiring a separate plan.

Another risk is widening into a source-sharing refactor. Mitigation: keep planner duplication as a documented known risk and rely on regression checks for now.

## Definition Of Done

The cleanup is complete when the user-facing repository no longer has the obvious public-readiness issues identified in review, baseline verification passes, full release verification still passes with local assets, package dry-run still excludes large model/runtime payloads, and the final response reports the changed files and verification results succinctly.

If any command cannot be run because of environment limits, the final response must say so directly and identify whether that leaves release risk.
