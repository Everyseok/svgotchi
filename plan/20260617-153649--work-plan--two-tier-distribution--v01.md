# Two-Tier Distribution Work Plan

Plan Type: work-plan
Workstream: SVGotchi two-tier distribution and model asset setup scaffold
Version: v01
Status: Complete
Created: 2026-06-17 15:36:49 Asia/Seoul
Last Updated: 2026-06-17 15:42:33 Asia/Seoul
Supersedes or Related Plan: Related to `plan/svgotchi-active-plan.md`, `docs/packaging-review.md`, and Gate X distribution notes
Current Completion State: Complete
Completed So Far: User approved the two-tier distribution direction; setup and verification scripts were added; ignored local asset folders were created; distribution documentation was added; `.gitignore`, `package.json`, and `tsconfig.json` were updated; local setup and verification were run successfully
Remaining Work: No remaining work inside this approved scaffold scope; later runtime path adaptation remains a separate approval-gated task
Current Blockers: No blockers for the scaffold; full runtime integration still requires a later approved change because `src/llm` was intentionally left untouched
Next Step: Stop for user review of the completed distribution scaffold and do not refactor runtime loading until explicitly approved

## Scoreboard

Current score: 50
Score source: provisional
Last updated: 2026-06-17 15:36:49 Asia/Seoul

Score rationale:

The user has not provided an explicit numeric score. The workspace score-tracking contract caps provisional scores at 50 until explicit user scoring is provided. The technical review score for the intended design is higher, currently estimated at 93/100, but that is a design quality assessment rather than the active user-satisfaction score recorded by this workspace. The active score should therefore remain provisional 50 while implementation proceeds.

What improved:

The user clarified that the project should accept large local model assets instead of pretending the model is small. The distribution boundary is now clear: a GitHub-friendly deterministic demo remains small and model-free, while full local LLM mode requires a setup step that downloads or installs model and runtime assets into ignored local folders. This prevents oversized model files from entering the Git repository and avoids using GitHub Pages as the full runtime demo.

What remains unsatisfactory:

The current Stage 7 runtime and tests still reference `assets/model` and `assets/runtime` from the earlier local proof. The approved scaffold introduced `models/` and `runtime/` as the future distribution-facing ignored asset roots. This is acceptable for this task because the user explicitly said not to implement model runtime unless the current stage allows it, but it means a later integration task must reconcile runtime asset paths.

Actions to raise or maintain the score:

Keep this task tightly scoped to the requested files, preserve all existing runtime behavior, avoid committing model binaries, make setup failures precise, document setup-time network versus runtime network, and verify that the repo still typechecks and tests after the scaffold is added. Add a review score after verification using the local skill-based review criteria.

Score history:

- 2026-06-17 15:36:49 Asia/Seoul: provisional 50. Two-tier distribution scaffold approved for implementation; no explicit user score provided; provisional score remains capped at 50.
- 2026-06-17 15:42:33 Asia/Seoul: provisional 50. Two-tier distribution scaffold completed and verified; skill-based review scored 94/100; provisional user score remains capped at 50 because no explicit user score was provided.

## Objective

Implement a small, explicit distribution scaffold for SVGotchi that supports two different usage tiers without changing the current local model runtime implementation.

The first tier is a GitHub-friendly deterministic demo. It should require no model download, should use only small committed assets, and should be suitable for README and repository preview flows. It should not claim to run the full local LLM/classifier path. This tier exists so users can inspect the project and experience deterministic character behavior without downloading hundreds of megabytes.

The second tier is the full local LLM mode. It should require an explicit setup command that downloads or installs model and runtime assets into ignored local folders. After setup, runtime behavior should use local sibling assets, with no external API, no hosted inference, no backend runtime dependency, and no localhost runtime dependency. This plan only creates the setup and verification scaffold; it does not modify the existing runtime to consume the new folders yet.

## Confirmed User Requirements

The project should accept that full local model assets are large. The implementation should not optimize around pretending the model is small. Large model files must not be committed into the Git repository. GitHub Pages must not be targeted as the full local LLM runtime demo. The Qwen model must not be embedded into a single SVG. Git LFS must not be used unless explicitly approved later.

The required two-tier distribution model is:

Tier 1: GitHub-friendly demo:

- deterministic demo;
- no model required;
- small assets only;
- works from the repository without model download;
- suitable for README and GitHub preview.

Tier 2: full local LLM mode:

- requires explicit setup script;
- downloads or installs model and runtime assets into ignored local folders;
- no external API at runtime after setup;
- no backend or localhost runtime dependency;
- model assets are local sibling assets;
- verification confirms all model assets are present.

Required files are:

- `scripts/setup-model.sh`;
- `scripts/setup-model.ps1`;
- `scripts/verify-model.ts`;
- `models/.gitkeep`;
- `runtime/.gitkeep`;
- `docs/distribution.md`.

`.gitignore` must ignore model and runtime payloads while allowing `.gitkeep` files:

- `models/*`;
- `runtime/*`;
- `!models/.gitkeep`;
- `!runtime/.gitkeep`.

The distribution documentation must explain:

- why model files are not committed;
- expected model size;
- setup-time download versus runtime network;
- deterministic demo versus full local LLM mode;
- why GitHub Pages demo is not the full LLM mode;
- how to verify zero runtime network after setup.

The implementation must not change model runtime behavior unless the current stage explicitly allows it. For this task, that means no changes to `src/llm`, no transition engine changes, and no attempt to wire the new `models/` or `runtime/` folders into runtime loading yet.

## Design Intent

The smallest complete design is to add a distribution-facing scaffold, not a runtime refactor.

The setup scripts should be clear wrappers that create the local asset directories and explain the download/install step. The verification script should check for the required local files in the new ignored folders and fail with precise messages if they are absent. It should not contact the network, silently download assets, or mutate runtime code. It should be deterministic and fast.

The documentation should set the correct mental model for contributors and users: the repository can stay GitHub-friendly, but full local LLM mode is intentionally heavier and requires setup. This avoids misleading users into expecting GitHub Pages to run the full classifier path and avoids the maintenance hazard of committing large model binaries to Git.

Package script wiring is allowed if it remains narrow and improves discoverability. Recommended scripts are:

- `setup:model` for invoking the platform-appropriate setup command manually;
- `verify:model` for invoking `scripts/verify-model.ts`.

On Windows, package script portability is tricky because `npm` scripts run under the user shell. The safest cross-platform command for verification is Node's built-in TypeScript stripping support already used by the project's `node --test tests/*.test.ts` flow. Setup scripts can remain separate files, with documentation telling users to run the shell script on Unix-like systems or the PowerShell script on Windows. If a package script is added for setup, it must not hide platform-specific behavior behind brittle shell assumptions.

## Out Of Scope

Do not modify `src/llm`.

Do not modify the transition engine.

Do not modify Stage 1-4 character implementation.

Do not create `dist`.

Do not commit any ONNX model, tokenizer, WASM runtime payload, generated archive, or downloaded model directory under `models/` or `runtime/`.

Do not use Git LFS.

Do not target GitHub Pages as the full local LLM runtime demo.

Do not embed any large model into a single SVG.

Do not add a backend or localhost runtime dependency.

Do not execute a real model download as part of verification. Network may be required when a user later runs setup for real, but implementation verification should not depend on remote availability.

## File Plan

`scripts/setup-model.sh` should be a POSIX shell script with safe shell behavior. It should create `models/` and `runtime/`, print the expected model/runtime layout, explain that model downloads happen at setup time only, and either use environment-configured URLs in a guarded way or stop with actionable instructions if URLs are not provided. Because this repository does not currently have an approved final download source and checksum manifest, the script should avoid hardcoding a brittle unofficial download flow that could silently drift. It should be ready for a later approved URL/checksum update.

`scripts/setup-model.ps1` should be the Windows equivalent. It should create the same directories and produce the same expectations. It should fail clearly if the approved download configuration is absent. It should not require elevated privileges. It should not write outside the repository.

`scripts/verify-model.ts` should define the expected local asset paths and sizes for the approved Tanaos classifier and required ONNX Runtime files. It should verify:

- model directory exists;
- required config/tokenizer files exist;
- required ONNX model file exists and is close to the expected size;
- runtime directory exists;
- required ONNX Runtime WASM and JavaScript module files exist;
- no oversized payload expectation is hidden inside Git;
- verification failure exits non-zero with actionable messages.

`models/.gitkeep` and `runtime/.gitkeep` should make the empty ignored directories visible without committing payloads.

`.gitignore` should ignore all payloads under `models/` and `runtime/` but allow `.gitkeep`.

`docs/distribution.md` should become the primary human-facing distribution explanation. It should describe both tiers, expected size, setup-time network versus runtime network, why Pages is not the full LLM mode, how to run verification, and what "zero runtime network after setup" means in practice.

`package.json` may receive a narrow `verify:model` script. If a `setup:model` script is added, it should choose a simple command that works for the default development shell or documentation should direct users to the platform-specific script instead. The implementation should avoid adding dependencies solely for script portability.

`plan/svgotchi-active-plan.md` should be updated before and after implementation to record this distribution scaffold work, score state, verification results, and review score.

## Validation Plan

Validation should include:

1. Run TypeScript typecheck.
2. Run the existing test suite.
3. Run the new model verification script in the current repository state.
4. Confirm that the verification script fails or passes intentionally.
5. Confirm that `models/` and `runtime/` contain only `.gitkeep` after scaffold creation.
6. Confirm no `dist` directory is created.
7. Confirm `src/llm` and transition engine files are not modified.
8. Confirm documentation contains the required explanations.

Because current local model assets already exist under `assets/model` and `assets/runtime`, the new `models/` and `runtime/` verification should probably fail until assets are installed into the new ignored folders. That is not a defect if the script's failure is precise and documented. The regular `npm run verify` should still pass because this task must not break existing runtime proof.

## Risk Assessment

The main architecture risk is path divergence. Existing Stage 7 proof assets live under `assets/model` and `assets/runtime`; new distribution assets will live under `models/` and `runtime/`. This is acceptable for a scaffold but must be documented as future integration work. It should not be solved here by changing runtime paths, because that would touch `src/llm` and change the current stage behavior.

The main user-experience risk is setup ambiguity. If setup scripts only say "download later" without clear verification, users will not know what to do. The mitigation is to make `docs/distribution.md` explicit and to make `verify-model.ts` report exactly which files are missing and where they should be placed.

The main security risk is confusing setup-time network with runtime network. The documentation and scripts must say that setup may download approved assets, while runtime after setup must use local sibling assets only. The verification script must be local-only. Any future downloader should verify checksums before accepting assets.

The main rollback risk is low because the work is additive and does not change runtime code. If the approach is rejected later, the new scripts, docs, ignored folders, and `.gitignore` entries can be removed without touching character or model logic.

## Definition Of Done

The task is complete when:

- the required files exist;
- `.gitignore` ignores model/runtime payloads while preserving `.gitkeep`;
- `docs/distribution.md` explains the two-tier model and required network boundary;
- package script wiring, if added, is minimal and documented;
- `scripts/verify-model.ts` provides a deterministic local check;
- existing `cmd /c npm run verify` passes;
- the new verification command behavior is observed and documented;
- no runtime implementation, transition engine, `src/llm`, Stage 1-4 implementation, large model binaries, Git LFS, or `dist` artifact is introduced;
- active plan and review notes record the score and verification outcome.

## Completion Notes

Completed at 2026-06-17 15:42:33 Asia/Seoul.

Added the required distribution scaffold:

- `scripts/setup-model.sh`
- `scripts/setup-model.ps1`
- `scripts/verify-model.ts`
- `models/.gitkeep`
- `runtime/.gitkeep`
- `docs/distribution.md`

Updated `.gitignore` to ignore `models/*` and `runtime/*` while allowing `.gitkeep`. Added `npm run verify:model` and included `scripts/**/*.ts` in TypeScript checking.

Verification results:

- `cmd /c npm run verify`: passed with 35 tests.
- `cmd /c npm run verify:model` before setup: failed intentionally with 7 missing asset reports.
- `powershell -ExecutionPolicy Bypass -File scripts/setup-model.ps1`: passed, copying local proof assets into ignored `models/` and `runtime/`.
- `cmd /c npm run verify:model` after setup: passed with pinned byte-size and SHA-256 checks.

Review result: `plan/stage-reviews/two-tier-distribution-skill-review.md`, overall score 94/100.
