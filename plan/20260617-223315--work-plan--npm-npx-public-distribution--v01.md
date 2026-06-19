# npm/npx Public Distribution Work Plan

Plan Type: work-plan
Workstream: SVGotchi npm/npx public distribution and local static full LLM mode
Version: v01
Status: Complete, awaiting user review
Created: 2026-06-17 22:33:15 Asia/Seoul
Last Updated: 2026-06-17 22:45:22 Asia/Seoul
Supersedes or Related Plan: Supersedes the failed direct-open full LLM assumption documented in `plan/20260617-220925--work-plan--direct-open-svg-local-asset-proof--v01.md`; related to `docs/direct-open-svg-local-model-proof.md`, `docs/distribution.md`, and Stage 7 local runtime work
Current Completion State: Complete for the approved distribution scaffold scope
Completed So Far: npm/npx CLI scripts, TypeScript model setup, reusable manifest verification, localhost static server, package bin/script wiring, README install section, distribution/model/static-server docs, direct `onnxruntime-web` dependency declaration, obsolete shell/PowerShell setup wrapper cleanup, verification, package dry-run, and review record are complete
Remaining Work: Final browser-side local LLM UI integration, npm publication hardening, and any PNG overlay implementation remain later approved gates
Current Blockers: No blocker inside this distribution scaffold; public `npx svgotchi` still requires publication or a packed package install
Next Step: Stop for user review of the npm/npx static-server distribution scaffold before using it as the base for final full local mode integration

## Scoreboard

Current score: 50
Score source: provisional
Last updated: 2026-06-17 22:45:22 Asia/Seoul

Score rationale:

The user has not given an explicit numeric score. The active technical score before this request was 92/100 for the direct-open proof because it rigorously found a blocking browser file-access issue. The user has now selected a better packaging direction: npm/npx CLI with localhost allowed only as a static file server. The active user score remains provisional and capped at 50 by workspace policy, but the technical direction improves because it resolves the direct-open blocker without weakening the no-external-inference and no-silent-download rules.

What improved:

The architecture no longer has to pretend that normal Chrome can fetch local sibling model files from a directly opened SVG. The new direction uses an ordinary npm/npx command surface to serve local static files over localhost. That lets the browser fetch SVG, JavaScript, WASM, tokenizer, and model assets through normal HTTP semantics while still keeping inference in the browser and keeping localhost out of the LLM backend role.

What remains unsatisfactory:

The final browser app integration is not yet complete. Existing Stage 7 Node-side model calls work, and the static server can expose the local files, but this task should not silently claim that the full final SVGotchi UI is complete. The correct deliverable is a production-shaped distribution command surface and docs that prepare users for deterministic demo and full local mode. The actual polished browser app/overlay character integration remains a later stage.

Actions to raise or maintain the score:

Implement the CLI and docs exactly around the chosen boundaries. Do not commit model files. Do not use GitHub Pages for full LLM mode. Do not use external inference. Do not use Hugging Face hosted inference. Ask before downloads. Show expected size. Verify assets after setup. Start only a static server. Open the browser when possible. Make the CLI commands clear and testable. Keep scripts dependency-light and use the existing Node 24 TypeScript execution path already used by the repo. Record proof and limitations honestly.

Score history:

- 2026-06-17 22:33:15 Asia/Seoul: provisional 50. User adopted npm/npx public distribution with localhost static serving only; no explicit numeric user score provided.
- 2026-06-17 22:37:00 Asia/Seoul: provisional 50. User added implementation guidance to keep code short and efficient, remove code made obsolete by the new path, and still preserve all documented functionality; no explicit numeric user score provided.
- 2026-06-17 22:45:22 Asia/Seoul: provisional 50. npm/npx distribution scaffold completed and verified; skill-based review scored 95/100; no explicit numeric user score provided.

## Understanding Report

The user has made a packaging decision after the direct-open proof failed. The adopted direction is an npm/npx-based public distribution model. The primary general-user command should be `npx svgotchi`. It should guide the user through model presence checks, explicit approval for large model download, model verification, starting a local static file server, opening a browser, and explaining that localhost is only serving static files. The secondary source checkout flow should be `git clone`, `npm install`, `npm run setup-model`, and `npm run serve`.

The key architectural distinction is that localhost is now allowed, but only as a static file server. It is not an LLM backend, not a local inference API, and not a server that receives prompts for model execution. Browser code should fetch local static assets such as SVG, JavaScript, WASM, tokenizer files, config JSON, and ONNX model files. Inference must run in the browser. Runtime after setup must not silently download model files. Setup may download model assets only as an explicit user-approved setup step.

This request materially changes the packaging path and should supersede the earlier direct-open full LLM assumption. It does not change the core model contract: the model is still local, no external APIs are allowed, Hugging Face hosted inference is not allowed, and the model must not output arbitrary UI code or reply text. It also does not approve the PNG overlay implementation. The work should be scoped to distribution CLI, setup/verify/serve scripts, docs, README install section, and package bin/script wiring.

## Objective

Make SVGotchi installable and runnable by general GitHub users through npm/npx-style commands while preserving the local-only inference boundary.

The target command surfaces are:

- `svgotchi`
- `svgotchi demo`
- `svgotchi setup-model`
- `svgotchi serve`
- `svgotchi verify-model`

The target user flows are:

- Flow A deterministic demo: `npx svgotchi demo`
- Flow B full local LLM mode: `npx svgotchi setup-model`, then `npx svgotchi serve`
- Flow C guided mode: `npx svgotchi`

The source checkout equivalents are:

- `npm run setup-model`
- `npm run serve`
- `npm run verify:model`

The CLI should make clear that full local LLM mode requires a model setup step, that model files are large and ignored by Git, that setup may download files only after user approval, that runtime after setup must use local files, and that localhost is static serving only.

## Non-Negotiable Distribution Rules

Large model files must not be committed to Git. The ignored `models/` and `runtime/` folders remain the payload locations. `.gitkeep` files may remain committed to preserve directory shape.

GitHub Pages must not be presented as full LLM mode. GitHub Pages may host a limited deterministic demo because it cannot be expected to include large local model files or per-user local runtime assets.

External inference APIs are forbidden. Hugging Face hosted inference is forbidden. No OpenAI, Anthropic, Gemini, or hosted inference provider may appear in the runtime path.

Localhost must not be an LLM backend. It is allowed only as a static file server for browser-readable files. The static server may serve SVG, JavaScript, WASM, tokenizer JSON, config JSON, ONNX model files, and other committed static assets. It must not receive prompt text for inference or expose an inference endpoint.

Inference must run in the browser. The current task may not fully wire final UI inference, but the docs and server contract must be consistent with this rule.

Model setup may download files only as an explicit user-approved setup step. The CLI must show expected download size and ask before downloading. Runtime after setup must not silently download model files.

The CLI must check whether model assets exist before deciding what to do. It must verify downloaded or copied files using the pinned manifest.

## Implementation Scope

Expected files to create or update:

- `docs/distribution.md`
- `docs/local-static-server.md`
- `docs/model-setup.md`
- `scripts/setup-model.ts`
- `scripts/verify-model.ts`
- `scripts/serve.ts`
- likely `scripts/svgotchi.ts` for the CLI bin entry
- `package.json`
- `README.md`
- active plan and stage review files

Optional small shared modules under `scripts/` may be added if they reduce meaningful duplication between setup, verify, serve, and CLI scripts. Such modules should stay simple and specific, not become a generic framework.

Existing shell and PowerShell setup wrappers may remain for compatibility, but the npm-first script should be `scripts/setup-model.ts`. If wrappers become stale, they should either call the TypeScript script or be documented as legacy helpers. The core public path should not depend on platform-specific shell scripts.

The user later clarified that while implementing this direction, code should be kept short and efficient and unused or newly obsolete code should be removed. Within this task, that means the new npm/npx setup path should become the single maintained setup implementation. If the older shell and PowerShell setup scripts are no longer referenced by docs or package scripts, they should be removed rather than kept as stale duplicate logic. This cleanup permission does not extend to unrelated Stage 1-4 implementation, transition engine code, PNG overlay proposal files, or other gated work that is outside the current distribution scope.

Files that should not change:

- `src/llm/localTransitionPlanner.ts`
- `src/llm/transitionPlanSchema.ts`
- `src/llm/sanitizeTransitionPlan.ts`
- deterministic transition engine files
- Stage 1-4 character implementation files
- PNG overlay implementation files
- large model payload files under tracked source locations
- `dist/`

## Technical Design

The public CLI should be a small TypeScript executable script. Because this repository already uses Node 24 and runs TypeScript files directly with Node, the npm `bin` entry can point to a TypeScript script with a Node shebang for the current scaffold. This avoids creating `dist` and avoids introducing a build pipeline prematurely. The package should declare a Node engine compatible with native TypeScript execution. A later packaging-hardening task can add a build output if the project decides to support older Node versions.

The CLI should parse the first positional command. No dependency such as commander is required. Supported commands should be:

- no command: guided mode;
- `demo`: start static server in deterministic demo mode;
- `setup-model`: run explicit setup;
- `serve`: start static server for full local mode if assets exist, or explain setup if they do not;
- `verify-model`: verify the pinned manifest;
- `help` or `--help`: print help.

The setup command should:

- run the same manifest check used by verify;
- if all files are present, report success and exit;
- if files are missing, show expected total model/runtime size;
- ask for confirmation before downloading or installing large assets;
- prefer local proof assets if they exist under `assets/model` and `assets/runtime`, because this repo currently contains those proof assets in the working tree;
- otherwise download model files from the approved Hugging Face file URLs as a setup-time operation;
- install ONNX Runtime Web assets from `node_modules/onnxruntime-web/dist` when available, falling back to local proof runtime assets or an explicitly configured runtime URL only if needed;
- run verification after installation;
- fail clearly if any required file is missing or hash mismatches.

The verify command should remain local-only. It should never download. It should check file presence, byte size, and SHA-256 hash. It should expose reusable functions if the setup and CLI scripts need them. It should still work as `node scripts/verify-model.ts` and `npm run verify:model`.

The serve command should start an HTTP static file server bound to localhost by default. It should serve only files from the project/package root. It should reject path traversal. It should set reasonable MIME types for `.svg`, `.js`, `.mjs`, `.wasm`, `.json`, `.onnx`, `.png`, `.css`, and `.html`. It should print a clear message that localhost is static serving only and that inference runs in the browser. It should open the browser when possible. It should not add any inference endpoint.

Because the final full app is not complete, the static server can serve a small committed landing/demo page or the existing proof/deterministic SVG assets. The page should be honest about the mode. It can link to deterministic assets and explain full local mode setup. It should not claim the finished full LLM UI exists if it does not. For the CLI UX, `svgotchi demo` can open the deterministic demo page, while `svgotchi serve` can open the same static shell in full-local mode after asset verification.

## Documentation Design

`docs/distribution.md` should become the top-level distribution decision document. It should distinguish:

- direct-open SVG deterministic demo;
- local served full LLM mode;
- GitHub Pages limited demo;
- npm/npx full local experience.

`docs/local-static-server.md` should define the static server boundary. It should say localhost is allowed only to serve static files and is not an inference backend. It should list what file types are served, what is not served, why this avoids the direct-open file security issue, and how to verify that no inference endpoint exists.

`docs/model-setup.md` should define setup-time downloads, expected size, approval prompt, local folders, manifest verification, zero silent runtime download, and common failure modes.

`README.md` should get an install section because it is currently missing. The README should show:

- `npx svgotchi demo`;
- `npx svgotchi`;
- `npx svgotchi setup-model`;
- `npx svgotchi serve`;
- source checkout flow with `npm install`, `npm run setup-model`, `npm run serve`.

The README should clearly state that full LLM mode uses local browser inference and a localhost static file server, not hosted inference or a backend LLM service.

## Verification Plan

Run the local model verifier:

- `cmd /c npm run verify:model`

Run TypeScript and tests:

- `cmd /c npm run verify`

Run CLI help:

- `node scripts/svgotchi.ts --help`

Run CLI model verification:

- `node scripts/svgotchi.ts verify-model`

Run server smoke check without leaving a long-running process:

- start `node scripts/serve.ts --no-open --smoke`;
- fetch `/`, a known SVG asset, and a known model config file if assets exist;
- confirm response status and MIME types;
- confirm no inference endpoint is implemented.

Run setup in a non-destructive way:

- if local model assets are already present, `node scripts/setup-model.ts --yes` should detect and verify without downloading;
- if missing assets cannot be simulated safely without moving user files, rely on unit-level flow and documentation instead of deleting model files.

Check that `dist` is not created. Check that no large model files are newly copied into tracked source folders. Check that `.gitignore` still ignores `models/*` and `runtime/*`.

## Risks

The main implementation risk is over-claiming. The static server can solve the browser `file://` fetch blocker, but it does not automatically mean the final full LLM UI is complete. The docs and CLI should say this is the distribution command surface and static serving boundary. Full app integration remains later.

Another risk is Node version support. A TypeScript bin entry works in this workspace on Node 24. Public npm users on older Node versions may not be able to run `.ts` directly. For this scaffold, set a Node engine and document it. A later release-hardening task can add a build step and JS bin output if broader compatibility is required.

Another risk is downloading from Hugging Face raw file URLs. This is setup-time only and explicitly user-approved, which matches the new rule. The setup script must verify hashes after download to prevent silent drift.

Another risk is runtime assets. In an npm installation, local proof assets under `assets/runtime` may not exist. The setup script should install ONNX Runtime Web assets from the installed `onnxruntime-web` package that comes through `@huggingface/transformers`, because those files are available in `node_modules/onnxruntime-web/dist`.

Another risk is opening the browser in automated environments. The server should allow `--no-open` for tests and CI. Browser opening should be best-effort and should not fail the server if no opener is available.

Another risk is security of the static server. It must normalize paths, reject traversal, and bind to localhost. It should not expose arbitrary filesystem roots.

## Definition of Done

This task is complete when:

- `docs/distribution.md` reflects the npm/npx direction and the four required mode distinctions;
- `docs/local-static-server.md` exists and documents the static-only localhost boundary;
- `docs/model-setup.md` exists and documents explicit setup-time downloads and verification;
- `scripts/setup-model.ts` exists and asks before large downloads;
- `scripts/verify-model.ts` remains local-only and reusable;
- `scripts/serve.ts` exists and serves static files from localhost only;
- package scripts include setup, serve, verify model, and CLI-friendly commands;
- package bin entry plan is represented in `package.json`;
- README install section exists;
- CLI commands are available through the bin script design;
- verification commands pass;
- no `dist` is created;
- no large model files are newly committed or copied into source-controlled payload paths;
- active plan and review records are updated.

## Approval State

The user explicitly said "이 방식으로 간다" after listing the npm/npx public distribution plan and command requirements. This is treated as approval for this implementation scope. It is not approval to change model semantics, use hosted inference, implement the PNG overlay rig, or create a final polished browser app beyond the static distribution command surface.
