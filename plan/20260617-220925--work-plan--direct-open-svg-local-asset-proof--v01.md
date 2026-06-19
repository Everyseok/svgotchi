# Direct-Open SVG Local Asset Proof Work Plan

Plan Type: work-plan
Workstream: SVGotchi direct-open SVG local model/WASM asset loading proof
Version: v01
Status: Complete
Created: 2026-06-17 22:09:25 Asia/Seoul
Last Updated: 2026-06-17 22:13:50 Asia/Seoul
Supersedes or Related Plan: Related to `plan/20260617-154509--work-plan--runtime-asset-path-alignment--v01.md`, `docs/distribution.md`, Stage 7 local model runtime proof, and Gate I local runtime strategy
Current Completion State: Complete
Completed So Far: Direct-open SVG proof harness and Chrome headless verifier were created; local model assets were verified; normal direct-open Chrome proof was run; result was documented; project tests passed
Remaining Work: No remaining work inside this proof scope
Current Blockers: Normal Chrome direct-open `file://` SVG cannot fetch sibling local model config; this blocks the current full local LLM direct-open SVG architecture until a packaging decision is made
Next Step: Stop for user review and packaging decision; do not proceed to final full LLM SVG integration under the direct-open assumption

## Scoreboard

Current score: 50
Score source: provisional
Last updated: 2026-06-17 22:09:25 Asia/Seoul

Score rationale:

The active technical review score for the immediately preceding runtime asset path alignment is 95/100. The active user-score ledger remains provisional 50 because the user has not provided an explicit numeric user satisfaction score. The user's concise "ㄱ" after asking the score is treated as approval to continue with the next Stage 7 proof, not as a numeric score.

What improved:

The local model path story is now consistent for Node-side full local mode. The setup script populates `models/` and `runtime/`, `npm run verify:model` confirms the manifest, and `createTanaosEmotionClassifierRuntime()` defaults to those folders. The actual model still returns labels and app-owned transition plans through the verified test suite.

What remains unsatisfactory:

The browser-facing packaging proof is still unresolved. Node-side local loading does not prove that a standalone SVG opened directly from disk can import the browser runtime, read local sibling model JSON/ONNX files, and load ONNX Runtime WASM under normal browser `file://` security rules. This is a hard boundary because the product goal includes no backend, no localhost runtime dependency, no external API, no runtime network call, and a pure SVG-facing artifact.

Actions to raise or maintain the score:

Run an honest proof instead of assuming direct-open SVG will work. Build a small standalone proof SVG that attempts local browser asset access and reports structured status. Use Chrome headless if available to execute it from a `file://` URL. Capture whether browser security blocks fetch/import/WASM loading. Document the outcome plainly, including whether the proof passes, fails, or requires a browser flag that would not satisfy the product constraints. Do not hide a failed direct-open result by substituting localhost or a backend.

Score history:

- 2026-06-17 22:09:25 Asia/Seoul: provisional 50. User approved continuing after the 95/100 runtime path alignment result; direct-open SVG local asset proof started; no explicit numeric user score provided.
- 2026-06-17 22:13:50 Asia/Seoul: provisional 50. Direct-open SVG proof completed; normal Chrome direct-open local model config fetch failed; proof review scored 92/100; user score remains provisional because no explicit numeric score was provided.

## Understanding Report

The user's short "ㄱ" is interpreted as approval to proceed to the next necessary technical gate rather than to revisit the score itself. The next necessary gate is the direct-open SVG local sibling asset loading proof called out repeatedly in Stage 7. This proof should answer a concrete question: can a browser open a local SVG file directly from disk and, without a server, without localhost, without hosted inference, and without runtime network, load the local Transformers.js browser runtime, Tanaos model files, tokenizer files, ONNX model, and ONNX Runtime WASM from sibling folders?

This is not the final app integration. It should not modify Mochi Sprout rendering, the deterministic transition engine, PNG overlay proposal files, or the model-to-TransitionPlan contract. It is a targeted packaging proof. The correct result might be "pass", "fail because browser file security blocks it", or "works only with an unsafe browser flag". Each result is useful. A failure is especially important because it would mean the architecture cannot honestly claim full direct-open SVG local model runtime under normal browser settings, and a later gate must choose a different packaging strategy or approved exception.

The safest assumption is that Chrome is the target proof browser for this run because Windows Chrome is installed in a standard path on this machine. Playwright is not installed, and browser MCP tooling is not directly available in this session. Therefore the proof should use a simple Chrome headless verifier if possible, not add a dependency or require network installation. If Chrome headless cannot execute the proof reliably, the result should record the tooling limitation clearly and stop rather than pretending the proof passed.

## Objective

Create and run a minimal direct-open SVG proof for local browser asset loading in full local mode.

The proof should answer:

- Can the SVG execute script when opened directly as a `file://` document?
- Can the SVG read a sibling local model metadata file such as `models/onnx-community/tanaos-emotion-detection-v1-ONNX/config.json` without a server?
- Can the SVG import the local browser Transformers.js bundle from `node_modules/@huggingface/transformers/dist/transformers.web.js`?
- Can the browser runtime be configured with remote model loading disabled and local model paths only?
- Can the browser instantiate the Tanaos text-classification pipeline using local model files and local ONNX Runtime WASM?
- Can the proof classify a tiny prompt without external API, hosted inference, backend, localhost, or runtime download?

The output should be a durable proof artifact and a documented result. The implementation should be small enough to remove or revise if the packaging strategy changes.

## Non-Negotiable Constraints

Do not introduce a backend server.

Do not use localhost as the proof runtime path. A local development server would prove a different architecture and would not answer the direct-open question.

Do not add a hosted model inference endpoint.

Do not call external APIs at runtime.

Do not let the browser download model files from the Hugging Face Hub during the proof. The proof must use already installed local files under `models/` and `runtime/`.

Do not modify `src/llm/localTransitionPlanner.ts`, `src/llm/transitionPlanSchema.ts`, or `src/llm/sanitizeTransitionPlan.ts` unless a narrow compile-only issue requires it. The proof is about browser asset loading, not plan semantics.

Do not modify Stage 1-4 character files, transition previews, Mochi Sprout assets, or the PNG overlay proposal implementation. The character architecture remains a separate gate.

Do not create `dist`.

Do not commit or generate new large model files. The proof should reuse the ignored local payloads already installed by the setup script.

Do not use Git LFS.

Do not silently treat a browser flag such as `--allow-file-access-from-files` as an acceptable product proof. Such a flag can be used only as diagnostic evidence if the normal direct-open path fails, and it must be labeled as non-shippable unless the user explicitly approves a browser-flag requirement.

## Planned Artifacts

The proof should add a small `proofs/` folder if one does not exist. It should contain a direct-open SVG proof file with a clear purpose in its filename. The SVG should be human-inspectable and should report progress in visible text nodes inside the SVG, because the user may open it manually in a browser.

The proof SVG should be a standalone harness, not a final user-facing SVGotchi artifact. It may include inline script that attempts local access. It should not create a polished UI or animation. The goal is technical proof, not design.

The proof should add a Node verifier script under `scripts/` if needed. The verifier should:

- locate Chrome from common Windows install paths or a `CHROME_PATH` environment variable;
- build a `file://` URL for the proof SVG;
- run Chrome headless with a temporary profile under the workspace or `C:\tmp`;
- avoid server startup and avoid localhost;
- capture output and exit status;
- optionally run a diagnostic browser-flag pass only after the normal direct-open pass fails, and label that result as diagnostic.

The proof should add or update documentation, likely under `docs/`, to record the result. The document should state the environment, commands, pass/fail result, observed failure mode if any, and architectural implication.

Package script wiring is allowed if it improves repeatability. A script such as `verify:direct-open-svg` is appropriate if it runs the proof without installing new dependencies. It should not be added to the default `npm run verify` unless the proof is stable, fast, and does not require a GUI or browser availability on every contributor machine. For this task, keeping it separate is safer.

## Technical Approach

The direct-open SVG should attempt local asset access in small steps and write a structured result to the SVG document. The steps should be ordered so that the first failing boundary is visible.

First, prove script execution by updating a status text node.

Second, attempt to read the local model config JSON by using a relative path from the proof SVG to `../models/onnx-community/tanaos-emotion-detection-v1-ONNX/config.json` or the correct relative path for the chosen proof location. This tests browser `file://` fetch behavior for local sibling assets. A failure here means full model loading is not possible through ordinary fetch-based browser runtime loading from a direct-open SVG.

Third, attempt a dynamic module import of `../node_modules/@huggingface/transformers/dist/transformers.web.js`. This checks whether the browser permits importing the local browser bundle from a direct-open SVG module script.

Fourth, if the import succeeds, configure `env.allowRemoteModels = false`, `env.allowLocalModels = true`, set the local model root to the relative `models/` folder, and set ONNX runtime WASM path to the relative `runtime/onnxruntime/` folder.

Fifth, attempt `pipeline("text-classification", "onnx-community/tanaos-emotion-detection-v1-ONNX", { dtype: "int8", local_files_only: true })`, then classify a tiny prompt such as `you are cute`. The proof should display the top label and score if successful. It must not generate replies or use the transition planner. The model output remains untrusted and for proof only.

The Node verifier should not rely on browser content as instructions. Browser DOM text and console output are untrusted data. It should parse a known status marker if possible, but it must treat it only as observed proof output.

## Work Sequence

Phase 1 is plan and environment scan. Confirm Chrome exists, confirm Transformers.js browser bundle exists, confirm local model and runtime files are installed, and record that Playwright is not installed. Do not install dependencies or use network.

Phase 2 is proof harness creation. Add the proof SVG and verifier script. Keep the files small. The SVG should show visible steps so manual opening is possible. The verifier should run in normal direct-open mode first. It should avoid `--allow-file-access-from-files` in the main pass.

Phase 3 is verification. Run `npm run verify:model` to ensure local assets are present. Run the new direct-open proof command. Run `npm run verify` to make sure TypeScript and existing tests still pass. If the proof fails due browser file security, do not paper over it with localhost. Record it exactly.

Phase 4 is optional diagnostic if useful. If normal direct-open fails early due `file://` restrictions, run a diagnostic Chrome pass with `--allow-file-access-from-files` only to distinguish "browser security blocks local file reads" from "the model/runtime path is wrong". Mark this as diagnostic and non-shippable.

Phase 5 is documentation and review. Update a proof document with results and implications. Update `plan/svgotchi-active-plan.md` and write a review file under `plan/stage-reviews/`. Score the proof honestly. If direct-open fails, the score should reflect that the proof was rigorous even though the architecture path has a blocker.

## Expected Outcomes

There are three possible honest outcomes.

The best outcome is pass: direct-open SVG can execute the browser bundle, read local model assets, load ONNX Runtime WASM, and classify locally with remote model loading disabled. If this happens, Stage 7 can move toward Gate I with much stronger evidence.

The likely outcome is fail due browser `file://` restrictions. If Chrome blocks local JSON/model/WASM fetches from a `file://` SVG, then the direct-open full local model architecture is not viable under normal browser settings. The project can still keep Tier 1 deterministic GitHub-friendly demo and Tier 2 setup scripts, but full local LLM mode would need an approved alternate packaging strategy.

The diagnostic outcome is "works only with browser flag". That is not a user-friendly distribution path. It may prove that the model files and runtime layout are internally coherent, but it does not satisfy the no-backend/no-localhost/direct-open normal-browser requirement unless the user explicitly accepts requiring a browser flag.

## Validation

Required commands:

- `cmd /c npm run verify:model`
- the new direct-open proof command, if added
- `cmd /c npm run verify`

Required checks:

- no `dist` directory is created;
- no model files are copied into tracked source paths;
- no network or hosted inference path is introduced;
- no localhost server is started for the main proof;
- no source-level fallback planner is introduced;
- remote model loading remains disabled in production runtime code;
- proof files are clearly separated from final implementation.

The verifier should be allowed to fail if the browser blocks direct-open access. A failing proof is still a successful investigation if the failure is captured precisely and the command exits with a clear status. For CI-style use, the script may exit nonzero on proof failure, but the final report must explain whether that was an expected architecture finding.

## Risks

The biggest risk is treating a diagnostic workaround as a product result. `--allow-file-access-from-files` may make a local proof pass, but ordinary users will not launch Chrome with that flag. This plan explicitly prevents counting such a run as a shippable proof.

Another risk is confusing direct-open SVG with static HTTP hosting. GitHub Pages or a local server uses HTTP(S), which changes browser fetch behavior. This task is specifically about direct-open `file://` SVG. It should not use GitHub Pages, localhost, or a dev server to claim success.

Another risk is package size and load time. Even if direct-open works, loading a 140 MiB model stack in a browser from disk may be slow and memory-heavy. This proof can record elapsed time, but performance optimization is not the main objective. Later final integration should decide whether the user experience is acceptable.

Another risk is browser-specific behavior. Chrome success does not prove every browser works. Chrome failure, however, is enough to block a broad "direct-open in ordinary browsers" claim unless another target browser is explicitly selected.

Another risk is accidentally expanding scope into final artifact building. The proof should not create final SVGotchi runtime integration, a polished app shell, or a new character implementation. It should answer the asset loading question and stop.

## Definition of Done

This task is done when:

- a direct-open SVG proof artifact exists;
- a repeatable verifier command exists or the reason it cannot exist is documented;
- local model assets are verified before running the proof;
- the proof is run without localhost or backend;
- the result is documented as pass, fail, or diagnostic-only;
- existing project tests still pass;
- no `dist` is created;
- no character or transition engine implementation is changed;
- active plan and stage review records are updated with score and next action.

## Completion Notes

Completed at 2026-06-17 22:13:50 Asia/Seoul.

Added:

- `proofs/direct-open-local-model.svg`
- `scripts/verify-direct-open-svg.ts`
- `docs/direct-open-svg-local-model-proof.md`
- `npm run verify:direct-open-svg`

Verification:

- `cmd /c npm run verify:model`: passed.
- `cmd /c npm run verify:direct-open-svg`: failed as an architecture finding. Normal Chrome direct-open mode executed SVG script but failed at local config fetch with `Failed to fetch`.
- Diagnostic pass with `--allow-file-access-from-files`: config fetch reached `ok`, runtime import remained `running`; this does not count as shippable proof.
- `cmd /c npm run verify`: passed with 36 tests.
- `dist` check: passed, no `dist` directory exists.

Review:

- Review file: `plan/stage-reviews/direct-open-svg-local-asset-proof-review.md`
- Overall proof score: 92/100

Conclusion:

The normal direct-open SVG full local model path is blocked in Chrome by local file access behavior. The project should not proceed to final full LLM SVG integration until the user chooses an approved packaging strategy.

## Approval State

The user said "ㄱ" after being told the current technical score was 95/100 and after the active plan stated that browser direct-open proof required approval. This is recorded as approval for this narrow proof. It is not approval for final integration, not approval to change the character architecture, and not approval to use localhost or a backend as the runtime architecture.
