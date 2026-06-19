# Character Overlay Proposal Skill-Based Review

Review timestamp: 2026-06-17 15:11:52 Asia/Seoul
Review scope: Gate X: PNG-preserving anime character overlay rig review
Status: Passed proposal review with score >= 90; implementation remains blocked pending user approval

## Reviewed Scope

Reviewed proposal artifacts:

- `docs/character-overlay-rig.md`
- `docs/character-migration-impact.md`
- `docs/character-overlay-preview-plan.md`
- `plan/svgotchi-active-plan.md`

Explicitly not reviewed as implementation because the user prohibited implementation:

- no Stage 1-4 implementation changes
- no transition engine changes
- no `src/llm` changes
- no `dist` artifact
- no PNG pixel edits
- no vector tracing
- no regenerated character art
- no model download/setup script implementation

## Skill Basis

Applied local and installed review discipline:

- `skills/karpathy-guidelines/SKILL.md`
- `vendor/agent-skills/skills/documentation-and-adrs/SKILL.md`
- `vendor/agent-skills/skills/deprecation-and-migration/SKILL.md`
- `vendor/agent-skills/skills/planning-and-task-breakdown/SKILL.md`
- `vendor/agent-skills/skills/code-review-and-quality/SKILL.md`
- `vendor/agent-skills/skills/api-and-interface-design/SKILL.md`

The review evaluated the proposal as an architectural migration and interface-contract change, not as shipped code.

## Verification Commands

Executed checks:

- `npm run verify`
- `cmd /c npm run verify` after PowerShell execution policy blocked `npm.ps1`
- `git status --short`
- `git diff --name-only`
- `Test-Path dist`
- file-size and file-existence checks for the new proposal artifacts

Observed results:

- PowerShell `npm run verify` failed because the host execution policy blocks `npm.ps1`.
- `cmd /c npm run verify` passed:
  - typecheck passed
  - 35 tests passed
  - actual local Tanaos model call test passed
- `dist` is absent.
- The workspace does not currently contain a `.git` directory, so git status/diff could not be used for changed-file proof.
- Filesystem checks confirmed the created/updated proposal artifacts exist.

## Requirement Compliance Review

The proposal satisfies the explicit documentation requirements:

- `docs/character-overlay-rig.md` exists.
- `docs/character-migration-impact.md` exists.
- `docs/character-overlay-preview-plan.md` exists.
- `plan/stage-reviews/character-overlay-proposal-review.md` exists.
- `plan/svgotchi-active-plan.md` includes Gate X.
- Overlay implementation is marked blocked until user approval.
- The proposal preserves the uploaded/generated PNG visually as immutable base art.
- The proposal forbids vector tracing, redrawing, replacement, and PNG pixel mutation.
- The proposal keeps the model output constrained to app-owned `TransitionPlan` data.
- The proposal forbids model-generated reply text and raw visual/code outputs.
- The proposal defines primary emotion plus optional accent emotion handling.
- The proposal keeps overlay selection app-owned and enum-driven.
- The proposal incorporates the user's correction that blink/eye occlusion is required for release.
- The proposal incorporates the user's distribution decision: full functionality should use `npm install` plus a model download/setup script later.

## Architecture Review

The proposal is compatible with the existing architecture at the planning boundary because it preserves:

- the 30-emotion catalog;
- the app-owned `TransitionPlan` boundary;
- sanitized model output;
- deterministic scheduling/easing principles;
- no raw SVG or DOM generation by the model;
- no model-generated reply text.

It correctly identifies incompatibility with the current character-rendering assumptions:

- Stage 1 primitive rig assumptions break.
- Stage 2 primitive pose rendering assumptions break.
- Stage 4 primitive preview validation assumptions break.
- The current transition engine is reusable only as scheduling/interpolation infrastructure, not as a drop-in renderer.

The recommendation to introduce Gate X as a branch/gate is appropriate. It avoids silently invalidating prior Mochi Sprout approvals and avoids unnecessary restart of model/runtime work.

## Risk Review

Major risks are documented with reasonable mitigation:

- mouth patch seams;
- blink/eye occlusion seams;
- persistent eye masking changing character identity;
- anchor precision error;
- full-color PNG invalidating monochrome checks;
- larger asset footprint;
- GitHub distribution constraints around the model file;
- inability to rely on GitHub Pages for full model experience;
- need for visual approval before engine wiring.

The highest unresolved risk is visual quality of blink and persistent eye overlays. The preview plan correctly makes this a required user review item instead of assuming it is solved.

## Score Breakdown

| Category | Score | Review Notes |
|---|---:|---|
| Requirement compliance score | 97 | All requested documents and Gate X plan update are present; implementation is blocked as required. |
| Architecture quality score | 94 | The proposal preserves the model and transition trust boundaries while isolating character-rendering churn behind Gate X. |
| Migration quality score | 95 | The impact analysis clearly separates reusable modules, broken assumptions, adaptation targets, and branch-vs-restart decision. |
| Interface-contract quality score | 93 | The overlay rig contract defines base layer, coordinates, groups, taxonomy, emotion mapping, and composite emotion constraints. |
| Preview readiness score | 94 | The preview plan covers required emotions, base-only view, anchors, final overlay pose, patch usage, eye blink, and risk notes. |
| Verification quality score | 91 | Existing tests pass through `cmd /c npm run verify`; git diff proof is unavailable because `.git` is missing in this workspace. |
| Approval-gate compliance score | 100 | Proposal stops before implementation and explicitly blocks overlay rig work pending user approval. |
| Distribution-risk handling score | 92 | Records npm install plus setup/download script as full-feature direction and avoids direct oversized model push assumptions. |

Overall proposal score: 95/100

## Findings

No blocking findings for the proposal package.

Non-blocking observations:

- The proposal intentionally leaves the exact base asset mode unresolved because the user must approve single composed base PNG versus immutable 2-6 layer stack.
- Git-based changed-file proof could not be collected because the workspace is not currently a git repository from the tool's perspective.
- Actual visual preview artifacts are not created yet; the proposal correctly treats them as a later approved step.
- The future `npm run setup` or equivalent model-download command is only documented as a direction and is not implemented.

## Gate Decision

Gate X proposal review passes the required score threshold with an overall score of 95/100.

Implementation remains blocked until the user explicitly approves:

- the PNG overlay rig contract;
- the migration impact decision;
- the preview plan;
- the base asset mode;
- blink and eye-occlusion behavior;
- mouth patch style;
- the exact preview artifacts in a later approved step.

