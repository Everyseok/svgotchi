# SVGotchi Current Next Steps

Last updated: 2026-06-19 11:58:38 Asia/Seoul

This file is the short handoff for resuming after closing VSCode. The authoritative long-running status remains `plan/svgotchi-active-plan.md`.

## Current Verified State

The current working product path is:

```text
npm/npx static server
-> served SVG app document
-> browser-local Transformers.js + local ONNX model/runtime assets
-> classifier label/score
-> app-owned TransitionPlan
-> deterministic SVG rig transition
```

Current completed items:

- Stage 7 local model runtime and planner are implemented and verified.
- Stage 8 served SVG full local integration is implemented and verified.
- `/` serves SVG, not an HTML app wrapper.
- Localhost is static serving only. It is not an inference backend.
- Full local browser model mode is verified through Chrome CDP.
- The label/score routing bug is fixed:
  - old: `I'm sad but you are comfortable?` -> `comforted 1.0`
  - new: `I'm sad but you are comfortable?` -> `sad 1.0`
- `sadness` no longer maps to `comforted` unless support is explicit.
- `verify:release` passes.
- Public pre-release cleanup is complete:
  - README now describes the current path as full local model mode, not a generic text-generating model path.
  - `npm test` is now the baseline model-free suite.
  - `npm run test:model` is the dedicated actual local model integration test.
  - `verify:release` still includes model asset verification, actual model integration, and Chrome served-SVG checks.
  - the old root `1.md` scratch note has been moved to `plan/backlog-semantic-routing.md` as deferred future work.

Current score records:

- Pure SVG full local integration review: `96/100`.
- Label/score emotion routing review: `96/100`.
- User explicit numeric score: not provided, so workflow score remains provisionally capped at `50`.

## Quick Resume Commands

From a terminal:

```bat
cd C:\Users\touch\svgotchi
```

Use `cmd /c` for npm commands because PowerShell may block `npm.ps1`:

```bat
cmd /c npm run serve
```

Full release verification:

```bat
cmd /c npm run verify:release
```

Baseline model-free verification:

```bat
cmd /c npm test
```

Actual local model integration test:

```bat
cmd /c npm run test:model
```

Regression check for the corrected sad sentence:

```bat
cmd /c node scripts\verify-served-svg.ts --full --prompt "I'm sad but you are comfortable?" --expect sad
```

If local model/runtime assets are missing:

```bat
cmd /c npm run setup-model
cmd /c npm run verify:model
```

Expected local full-mode payload:

- model files: `135,539,904` bytes, about `129.26 MiB`;
- runtime files: `36,581,230` bytes, about `34.89 MiB`;
- total: `172,121,134` bytes, about `164.15 MiB`.

The large files belong in ignored local folders:

- `models/`
- `runtime/`

Do not commit model/runtime payloads.

## Current Mapping Contract

Use this as the active planner contract:

```text
model label -> pet emotion family
model score + top-label margin -> TransitionPlan.intensity
```

Current corrected routing examples:

| Input | Model top result | App result |
| --- | --- | --- |
| `you are cute` | `joy 0.8494` | `shy_love 0.9` |
| `I am scared` | `fear 0.9360` | `scared 1.0` |
| `I feel sad` | `sadness 0.9219` | `sad 0.9` |
| `I'm sad but you are comfortable?` | `sadness 0.9254` | `sad 1.0` |
| `I'm sad, comfort me` | `sadness` | `comforted 1.0` |
| `comfort me` | `sadness` | `comforted 1.0` |
| `I love you` | `joy` | `love` |
| `are you hungry?` | `neutral` | `hungry` |
| `go to sleep` | `neutral` | `sleepy` |

Important rule:

- `sad`, `lonely`, `scared`, or `afraid` alone must not become `comfort_request`.
- `comforted` is only for explicit support requests such as `comfort me`, `help me`, `hug me`, `cheer me up`, or `hold me`.

## Files Most Likely To Matter Next

Planner and model boundary:

- `src/llm/localTransitionPlanner.ts`
- `src/llm/modelRuntime.ts`
- `src/llm/sanitizeTransitionPlan.ts`
- `src/llm/transitionPlanSchema.ts`
- `tests/llmPlanner.test.ts`

Served SVG/browser runtime:

- `assets/svgotchi-browser.js`
- `scripts/serve.ts`
- `scripts/verify-served-svg.ts`
- `scripts/verify-transformers-import.ts`

Model setup/distribution:

- `scripts/model-manifest.ts`
- `scripts/setup-model.ts`
- `scripts/verify-model.ts`
- `docs/distribution.md`
- `docs/model-setup.md`
- `docs/local-static-server.md`

Current plan/reviews:

- `plan/svgotchi-active-plan.md`
- `plan/stage-reviews/pure-svg-full-local-integration-review.md`
- `plan/stage-reviews/label-score-emotion-routing-review.md`
- `plan/stages/stage-09-tests-and-verification.md`
- `plan/stages/stage-10-final-polish.md`

## What Is Left

### 1. Stage 9 Release Verification Hardening

Status: substantially complete for the public pre-release cleanup slice.

Goal: make the current npm/npx full local experience hard to accidentally break.

Recommended checklist:

- Run and record:
  - `cmd /c npm run verify:release`
  - `cmd /c npm pack --dry-run --json --cache .tmp\npm-cache`
  - `cmd /c node scripts\verify-served-svg.ts --full --prompt "I'm sad but you are comfortable?" --expect sad`
  - `cmd /c node scripts\verify-served-svg.ts --full --prompt "you are cute" --expect shy_love,love,happy`
- Confirm no `dist` directory is created.
- Confirm npm package excludes large model/runtime payloads.
- Confirm baseline tests do not require setup-installed model/runtime assets.
- Confirm runtime code does not introduce:
  - HTML input/button/form controls;
  - `foreignObject`;
  - canvas;
  - React or another DOM framework;
  - hosted inference;
  - backend prompt-processing route;
  - runtime model download.
- Strengthen browser checks if needed for:
  - model unavailable status;
  - local-only import failure diagnostics;
  - prompt-to-transition regression prompts.

This is the safest next step if the goal is public sharing soon.

### 2. Stage 10 Final Polish

Goal: make the repo reviewable and understandable for general GitHub/npm users.

Recommended checklist:

- Improve README install/run section:
  - `npx svgotchi demo`
  - `npx svgotchi setup-model`
  - `npx svgotchi serve`
  - `npx svgotchi verify-model`
- Explain the two-tier model:
  - Tier 1 deterministic demo, small assets, no model required.
  - Tier 2 full local model mode, explicit setup, local ignored model/runtime assets.
- Add or update:
  - model license notes;
  - runtime dependency/license notes;
  - browser support notes;
  - static-server boundary notes;
  - no external inference/API statement;
  - model payload size statement.
- Add screenshot or GIF if requested.
- Add architecture diagram if requested.
- Run package dry-run and record final package size.

### 3. Source-Sharing Refactor For Planner Logic

Current risk:

- `src/llm/localTransitionPlanner.ts` is the canonical planner.
- `assets/svgotchi-browser.js` contains a compact duplicate planner copy for the served SVG runtime.

This duplication is currently kept in sync, but it is the main code-health risk.

Safe next options:

- Short-term: add more browser-level regression checks for important prompts.
- Medium-term: create a small shared browser-compatible planner module and serve that without introducing a `dist` artifact.
- Larger option: introduce a controlled browser build/bundle step, but this needs a separate approved plan because the project has intentionally avoided `dist` so far.

Do not casually refactor this without preserving:

- browser-local inference;
- no backend prompt route;
- no HTML runtime surface;
- no model-generated reply text;
- no raw SVG/DOM/CSS/JS from model output.

### 4. Gate X PNG-Preserving Anime Overlay Rig

Status:

- Proposal/review exists and passed review threshold.
- Implementation is still blocked until explicit user approval.

Do not implement it until approval.

If approved later, the key requirements are:

- preserve uploaded/generated PNG as immutable base layer;
- do not vector-trace, redraw, regenerate, or silently replace the PNG;
- expression changes must be overlay layers above the PNG;
- human-like blink/eye occlusion is required for release;
- model still outputs only TransitionPlan-like enum data;
- model must not choose arbitrary overlays or generate raw SVG/path/DOM/CSS/JS.

### 5. Gate J Final Artifact Review

Still open.

Final review should happen only after Stage 9/10 hardening and any approved character decision are done.

Gate J should confirm:

- runtime works from npm/npx path;
- full local mode has no external inference or runtime model download;
- package does not include large model/runtime payloads;
- docs match actual commands;
- no unapproved PNG overlay implementation happened;
- all verification commands pass.

## Things Not To Do Accidentally

- Do not commit model files from `models/`, `runtime/`, `assets/model/`, or `assets/runtime/`.
- Do not use Git LFS unless explicitly approved later.
- Do not target GitHub Pages as the full local model runtime.
- Do not embed the model into a single SVG.
- Do not add a backend/localhost inference route.
- Do not reintroduce direct-open full local model mode as the primary path.
- Do not implement PNG overlay rig until Gate X approval.
- Do not let model output generate reply text, raw SVG, path data, CSS, JS, selectors, or DOM patches.

## Recommended Next Decision

Recommended next work:

```text
Stage 9 release verification hardening
```

Reason:

- The core full local SVG path now works.
- The emotion routing bug is fixed.
- Public distribution is the next practical risk.
- The duplicate planner/browser logic should be handled after release checks make regressions easier to catch.

Alternative next work:

```text
Gate X PNG overlay approval and implementation
```

Choose this only if the character change is now the priority over shipping the current Mochi Sprout path.
